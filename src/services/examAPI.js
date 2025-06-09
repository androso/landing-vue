// Exam API Service
import axios from 'axios'

const API_BASE_URL = 'http://localhost:3000/api'

class ExamAPIService {
  constructor() {
    this.api = axios.create({
      baseURL: `${API_BASE_URL}/exam`,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Add response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('API Request failed:', error)
        if (error.response) {
          throw new Error(error.response.data.error || `HTTP ${error.response.status}: ${error.response.statusText}`)
        } else if (error.request) {
          throw new Error('Network error: Unable to reach the server')
        } else {
          throw new Error(error.message)
        }
      }
    )
  }

  // Start a new exam session
  async startSession(level = 'A1', userInfo = null) {
    const body = { level }
    if (userInfo) {
      body.anonymousUserInfo = userInfo
    }

    const response = await this.api.post('/session/start', body)
    const data = response.data

    // Store session ID in localStorage
    localStorage.setItem('examSessionId', data.sessionId)
    localStorage.setItem('examStartTime', Date.now().toString())
    
    return data
  }

  // Get session questions
  async getSessionQuestions(sessionId) {
    const response = await this.api.get(`/session/${sessionId}/questions`)
    return response.data
  }

  // Submit answer for a question
  async submitAnswer(sessionId, questionId, answer, questionOrder, timeSpent = null) {
    const body = {
      questionId,
      answer,
      questionOrder,
      language: 'English',
    }

    if (timeSpent !== null) {
      body.timeSpent = timeSpent
    }

    const response = await this.api.post(`/session/${sessionId}/submit`, body)
    return response.data
  }

  // Submit audio answer
  async submitAudioAnswer(sessionId, questionId, audioFile, questionOrder, timeSpent = null) {
    const formData = new FormData()
    formData.append('file', audioFile)
    formData.append('questionId', questionId)
    formData.append('questionOrder', questionOrder)
    formData.append('language', 'English')
    
    if (timeSpent !== null) {
      formData.append('timeSpent', timeSpent.toString())
    }

    const response = await this.api.post(`/session/${sessionId}/submit`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  }

  // Get session summary/results
  async getSessionSummary(sessionId) {
    const response = await this.api.get(`/session/${sessionId}/summary`)
    return response.data
  }

  // Check session status
  async getSessionStatus(sessionId) {
    const response = await this.api.get(`/session/${sessionId}/status`)
    return response.data
  }

  // Complete session (mark as finished)
  async completeSession(sessionId, userInfo = null) {
    const body = {}
    if (userInfo) {
      body.userInfo = userInfo
    }

    const response = await this.api.post(`/session/${sessionId}/complete`, body)
    return response.data
  }

  // Get current session ID from localStorage
  getCurrentSessionId() {
    return localStorage.getItem('examSessionId')
  }

  // Clear session data
  clearSession() {
    localStorage.removeItem('examSessionId')
    localStorage.removeItem('examStartTime')
    // Clear question timers
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('question_') && key.endsWith('_start')) {
        localStorage.removeItem(key)
      }
    })
  }

  // Track question timing
  startQuestionTimer(questionOrder) {
    localStorage.setItem(`question_${questionOrder}_start`, Date.now().toString())
  }

  // Get time spent on a question
  getQuestionTimeSpent(questionOrder) {
    const startTime = localStorage.getItem(`question_${questionOrder}_start`)
    if (startTime) {
      return Math.floor((Date.now() - parseInt(startTime)) / 1000)
    }
    return null
  }

  // Audio utilities
  createAudioURL(cloudinaryUrl) {
    // Cloudinary URLs are already optimized for streaming
    return cloudinaryUrl
  }

  // Validate audio file
  validateAudioFile(file, maxSizeMB = 20) {
    const validTypes = ['audio/mp3', 'audio/wav', 'audio/ogg', 'audio/webm', 'audio/m4a']
    
    if (!validTypes.includes(file.type)) {
      throw new Error('Invalid audio format. Please use MP3, WAV, OGG, WebM, or M4A.')
    }

    const maxSize = maxSizeMB * 1024 * 1024 // Convert to bytes
    if (file.size > maxSize) {
      throw new Error(`File too large. Maximum size is ${maxSizeMB}MB.`)
    }

    return true
  }
}

// Create singleton instance
const examAPI = new ExamAPIService()

export default examAPI

// Named exports for specific methods
export const {
  startSession,
  getSessionQuestions,
  submitAnswer,
  submitAudioAnswer,
  getSessionSummary,
  getSessionStatus,
  completeSession,
  getCurrentSessionId,
  clearSession,
  startQuestionTimer,
  getQuestionTimeSpent,
  createAudioURL,
  validateAudioFile
} = examAPI

// ============================
// AUTH API EXTENSIONS
// ============================
examAPI.register = async function(userData) {
  try {
    const response = await axios.post(`${API_BASE_URL}/user/register`, userData)
    const { user, token } = response.data
    examAPI.setAuthData(token, user)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Registration failed')
  }
}

examAPI.login = async function(credentials) {
  try {
    const response = await axios.post(`${API_BASE_URL}/user/login`, credentials)
    const { user, token } = response.data
    examAPI.setAuthData(token, user)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Login failed')
  }
}

examAPI.logout = async function() {
  try {
    const token = localStorage.getItem('authToken')
    if (token) {
      await axios.post(`${API_BASE_URL}/user/logout`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
    }
  } catch (error) {
    console.error('Logout API error:', error)
  } finally {
    examAPI.clearAuthData()
  }
}

examAPI.getProfile = async function() {
  try {
    const token = localStorage.getItem('authToken')
    const response = await axios.get(`${API_BASE_URL}/user/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    localStorage.setItem('userData', JSON.stringify(response.data))
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to get profile')
  }
}

// ============================
// PRODUCT API EXTENSIONS
// ============================
examAPI.getAllProducts = async function(filters = {}) {
  try {
    const params = new URLSearchParams()
    if (filters.category) params.append('category', filters.category)
    if (filters.planType) params.append('planType', filters.planType)

    const response = await axios.get(`${API_BASE_URL}/products?${params.toString()}`)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to get products')
  }
}

examAPI.getSubscriptionPlans = async function() {
  try {
    const response = await axios.get(`${API_BASE_URL}/products?category=subscription`)
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to get subscription plans')
  }
}

examAPI.seedProducts = async function() {
  try {
    const token = localStorage.getItem('authToken')
    const response = await axios.post(`${API_BASE_URL}/products/seed`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    })
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Failed to seed products')
  }
}

// ============================
// CART API EXTENSIONS
// ============================
examAPI.addToCart = async function(productId, quantity = 1) {
  if (examAPI.isAuthenticated()) {
    try {
      const token = localStorage.getItem('authToken')
      const response = await axios.post(`${API_BASE_URL}/cart/add`, 
        { productId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to add to cart')
    }
  } else {
    examAPI.addToLocalCart(productId, quantity)
    return { message: 'Item added to local cart', success: true }
  }
}

examAPI.getCart = async function() {
  if (examAPI.isAuthenticated()) {
    try {
      const token = localStorage.getItem('authToken')
      const response = await axios.get(`${API_BASE_URL}/cart`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to get cart')
    }
  } else {
    return { 
      cart: { 
        items: examAPI.getLocalCart(),
        totalItems: examAPI.getLocalCartTotalItems(),
        totalAmount: examAPI.getLocalCartTotalAmount()
      } 
    }
  }
}

examAPI.removeFromCart = async function(productId) {
  if (examAPI.isAuthenticated()) {
    try {
      const token = localStorage.getItem('authToken')
      const response = await axios.delete(`${API_BASE_URL}/cart/remove/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to remove from cart')
    }
  } else {
    examAPI.removeFromLocalCart(productId)
    return { message: 'Item removed from local cart', success: true }
  }
}

examAPI.syncCart = async function() {
  if (!examAPI.isAuthenticated()) return

  const localCartItems = examAPI.getLocalCart().map(item => ({
    productId: item.productId,
    quantity: item.quantity
  }))

  if (localCartItems.length > 0) {
    try {
      const token = localStorage.getItem('authToken')
      const response = await axios.post(`${API_BASE_URL}/cart/sync`, 
        { localCartItems },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      examAPI.clearLocalCart()
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to sync cart')
    }
  }

  return await examAPI.getCart()
}

// ============================
// UTILITY METHODS
// ============================
examAPI.isAuthenticated = function() {
  const token = localStorage.getItem('authToken')
  const isAuth = localStorage.getItem('isAuthenticated')
  return !!(token && isAuth === 'true')
}

examAPI.getCurrentUser = function() {
  const userData = localStorage.getItem('userData')
  return userData ? JSON.parse(userData) : null
}

examAPI.getUserDisplayName = function() {
  const user = examAPI.getCurrentUser()
  return user ? user.name : 'Guest'
}

examAPI.setAuthData = function(token, user) {
  localStorage.setItem('authToken', token)
  localStorage.setItem('userData', JSON.stringify(user))
  localStorage.setItem('isAuthenticated', 'true')
}

examAPI.clearAuthData = function() {
  localStorage.removeItem('authToken')
  localStorage.removeItem('userData')
  localStorage.removeItem('isAuthenticated')
  localStorage.removeItem('localCart')
}

examAPI.validateEmail = function(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

examAPI.validatePassword = function(password) {
  return {
    isValid: password.length >= 6,
    minLength: password.length >= 6,
    hasLetter: /[a-zA-Z]/.test(password),
    hasNumber: /\d/.test(password)
  }
}

examAPI.formatPrice = function(price, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(price)
}

// ============================
// LOCAL CART METHODS
// ============================
examAPI.getLocalCart = function() {
  const cart = localStorage.getItem('localCart')
  return cart ? JSON.parse(cart) : []
}

examAPI.addToLocalCart = function(productId, quantity) {
  const cart = examAPI.getLocalCart()
  const existingItemIndex = cart.findIndex(item => item.productId === productId)
  
  if (existingItemIndex >= 0) {
    cart[existingItemIndex].quantity += quantity
  } else {
    cart.push({ 
      productId, 
      quantity, 
      addedAt: new Date().toISOString() 
    })
  }
  
  localStorage.setItem('localCart', JSON.stringify(cart))
}

examAPI.removeFromLocalCart = function(productId) {
  const cart = examAPI.getLocalCart()
  const filteredCart = cart.filter(item => item.productId !== productId)
  localStorage.setItem('localCart', JSON.stringify(filteredCart))
}

examAPI.getLocalCartTotalItems = function() {
  const cart = examAPI.getLocalCart()
  return cart.reduce((total, item) => total + item.quantity, 0)
}

examAPI.getLocalCartTotalAmount = function() {
  const cart = examAPI.getLocalCart()
  return cart.reduce((total, item) => total + (item.price || 0) * item.quantity, 0)
}

examAPI.clearLocalCart = function() {
  localStorage.removeItem('localCart')
} 