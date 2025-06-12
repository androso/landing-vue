<template>
 <nav class="container mx-auto px-6 py-4">
      <div class="flex justify-between items-center">
          <div class="flex items-center">
              <router-link to="/" class="flex items-center">
                  <div class="mr-2 p-2 rounded-full bg-primary-light">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24"
                          stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                  </div>
                  <span class="text-xl font-bold text-primary">mentarie</span>
              </router-link>
          </div>
          <!-- Desktop Navigation -->
          <div class="hidden lg:flex items-center space-x-8">
              <router-link to="/" class="text-gray-600 hover:text-primary transition-colors">Home</router-link>
              <router-link to="/about" class="text-gray-600 hover:text-primary transition-colors">About</router-link>
              <router-link to="/exam-trial" class="text-gray-600 hover:text-primary transition-colors flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Free Trial
              </router-link>
              <router-link to="/pricing" class="text-gray-600 hover:text-primary transition-colors">Pricing</router-link>
              <router-link to="/checkout" class="text-gray-600 hover:text-primary transition-colors">Checkout</router-link>
              <router-link to="/faq" class="text-gray-600 hover:text-primary transition-colors">FAQ</router-link>
              <router-link to="/contact" class="text-gray-600 hover:text-primary transition-colors">Contact</router-link>
          </div>

          <!-- Mobile Hamburger Menu -->
          <div class="lg:hidden">
              <button 
                @click="isOpen = !isOpen"
                class="text-gray-600 hover:text-primary transition-colors p-2"
              >
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path v-if="!isOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                  <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
          </div>
          
          <!-- Right side - Cart & User section -->
          <div class="flex items-center space-x-4 ml-0 lg:ml-8">
              <!-- Cart Button -->
              <button 
                v-if="isAuthenticated" 
                @click="showCart = !showCart"
                class="relative p-2 text-gray-600 hover:text-primary transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5H19M7 13v-3h10" />
                </svg>
                <span v-if="cartItemCount > 0" class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {{ cartItemCount }}
                </span>
              </button>

              <!-- User dropdown or Login button -->
              <div v-if="isAuthenticated" class="relative">
                <button 
                  @click="showUserMenu = !showUserMenu"
                  class="flex items-center space-x-2 text-gray-600 hover:text-primary transition-colors"
                >
                  <div class="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span class="text-primary text-sm font-medium">
                      {{ userInitials }}
                    </span>
                  </div>
                  <span class="hidden md:block">{{ userName }}</span>
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <!-- User Dropdown Menu -->
                <div v-if="showUserMenu" class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border">
                  <router-link to="/dashboard" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Dashboard
                  </router-link>
                  <router-link to="/dashboard" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Profile
                  </router-link>
                  <div class="border-t border-gray-100"></div>
                  <button 
                    @click="handleLogout"
                    class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
              
              <button v-else @click="showLoginModal = true" class="btn-primary">
                Sign In
              </button>
          </div>
      </div>

      <!-- Mobile Navigation Menu -->
      <div v-if="isOpen" class="lg:hidden">
        <div class="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
          <router-link 
            to="/" 
            @click="isOpen = false"
            class="block px-3 py-2 text-gray-600 hover:text-primary transition-colors"
          >
            Home
          </router-link>
          <router-link 
            to="/about" 
            @click="isOpen = false"
            class="block px-3 py-2 text-gray-600 hover:text-primary transition-colors"
          >
            About
          </router-link>
          <router-link 
            to="/exam-trial" 
            @click="isOpen = false"
            class="block px-3 py-2 text-gray-600 hover:text-primary transition-colors"
          >
            <div class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Free Trial
            </div>
          </router-link>
          <router-link 
            to="/pricing" 
            @click="isOpen = false"
            class="block px-3 py-2 text-gray-600 hover:text-primary transition-colors"
          >
            Pricing
          </router-link>
          <router-link 
            to="/checkout" 
            @click="isOpen = false"
            class="block px-3 py-2 text-gray-600 hover:text-primary transition-colors"
          >
            Checkout
          </router-link>
          <router-link 
            to="/faq" 
            @click="isOpen = false"
            class="block px-3 py-2 text-gray-600 hover:text-primary transition-colors"
          >
            FAQ
          </router-link>
          <router-link 
            to="/contact" 
            @click="isOpen = false"
            class="block px-3 py-2 text-gray-600 hover:text-primary transition-colors"
          >
            Contact
          </router-link>
          
          <!-- Mobile User Menu (when authenticated) -->
          <div v-if="isAuthenticated" class="border-t border-gray-200 pt-2">
            <div class="px-3 py-2 text-sm text-gray-500">
              Welcome, {{ userName }}
            </div>
            <router-link 
              to="/dashboard" 
              @click="isOpen = false"
              class="block px-3 py-2 text-gray-600 hover:text-primary transition-colors"
            >
              Dashboard
            </router-link>
            <router-link 
              to="/dashboard" 
              @click="isOpen = false"
              class="block px-3 py-2 text-gray-600 hover:text-primary transition-colors"
            >
              Profile
            </router-link>
            <button 
              @click="handleLogout"
              class="block w-full text-left px-3 py-2 text-gray-600 hover:text-primary transition-colors"
            >
              Sign Out
            </button>
          </div>
          
          <!-- Mobile Sign In (when not authenticated) -->
          <div v-else class="border-t border-gray-200 pt-2">
            <button 
              @click="showLoginModal = true; isOpen = false"
              class="block w-full text-left px-3 py-2 text-primary font-medium"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>

      <!-- Cart Dropdown -->
      <div v-if="showCart && isAuthenticated" class="absolute right-6 mt-2 w-80 bg-white rounded-lg shadow-xl border z-50">
        <div class="p-4">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold">Shopping Cart</h3>
            <button @click="showCart = false" class="text-gray-400 hover:text-gray-600">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Cart Items -->
          <div v-if="cartItems.length > 0" class="space-y-3 max-h-60 overflow-y-auto">
            <div v-for="item in cartItems" :key="item.productId" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div class="flex-1">
                <h4 class="font-medium text-gray-900">{{ item.product?.name || 'Product' }}</h4>
                <p class="text-sm text-gray-600">{{ formatPrice(item.product?.price || 0) }}</p>
              </div>
              <div class="flex items-center space-x-2">
                <span class="text-sm font-medium">Qty: {{ item.quantity }}</span>
                <button 
                  @click="removeFromCart(item.productId)"
                  class="text-red-500 hover:text-red-700"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div v-else class="text-center py-8 text-gray-500">
            <svg class="mx-auto h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5H19M7 13v-3h10" />
            </svg>
            <p class="mt-2">Your cart is empty</p>
          </div>

          <!-- Cart Summary -->
          <div v-if="cartItems.length > 0" class="border-t pt-4 mt-4">
            <div class="flex justify-between items-center mb-4">
              <span class="font-semibold">Total: {{ formatPrice(cartTotal) }}</span>
            </div>
            <button 
              @click="proceedToCheckout"
              class="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-600 transition-colors"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>

      <!-- Login Modal -->
      <LoginModal 
        :is-visible="showLoginModal"
        @close="showLoginModal = false"
        @login-success="handleLoginSuccess"
      />

      <!-- Success Message -->
      <div 
        v-if="successMessage" 
        class="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50"
      >
        {{ successMessage }}
      </div>
  </nav>
</template>

<script>
import examAPI from '../../services/examAPI.js'
import LoginModal from '../auth/LoginModal.vue'

export default {
  name: 'NavigationSection',
  components: {
    LoginModal
  },
  data() {
    return {
      isOpen: false,
      showLoginModal: false,
      showCart: false,
      showUserMenu: false,
      cartItems: [],
      successMessage: ''
    }
  },
  computed: {
    isAuthenticated() {
      return examAPI.isAuthenticated()
    },
    userName() {
      return examAPI.getUserDisplayName()
    },
    userInitials() {
      const name = this.userName
      if (name === 'Guest') return 'G'
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    },
    cartItemCount() {
      return this.cartItems.reduce((total, item) => total + item.quantity, 0)
    },
    cartTotal() {
      return this.cartItems.reduce((total, item) => {
        return total + (item.product?.price || 0) * item.quantity
      }, 0)
    }
  },
  async mounted() {
    await this.loadUserCart()
    
    // Check if user was redirected due to auth requirement
    const redirectPath = localStorage.getItem('redirectAfterLogin')
    if (redirectPath && !this.isAuthenticated) {
      this.showLoginModal = true
      this.showSuccessMessage('Please sign in to access this page')
    }
    
    // Listen for clicks outside to close dropdowns
    document.addEventListener('click', this.handleClickOutside)
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside)
  },
  methods: {
    async handleLoginSuccess(user) {
      this.showSuccessMessage(`Welcome back, ${user.name}!`)
      await this.loadUserCart()
    },

    async handleLogout() {
      try {
        await examAPI.logout()
        this.cartItems = []
        this.showUserMenu = false
        this.isOpen = false // Close mobile menu if open
        this.showSuccessMessage('Successfully logged out')
        
        // Refresh the website to ensure clean state
        setTimeout(() => {
          window.location.reload()
        }, 1000) // Give time for success message to show
      } catch (error) {
        console.error('Logout error:', error)
        // Still refresh even if logout fails to ensure clean UI state
        setTimeout(() => {
          window.location.reload()
        }, 1000)
      }
    },

    async loadUserCart() {
      if (!this.isAuthenticated) return
      
      try {
        const response = await examAPI.getCart()
        this.cartItems = response.cart?.items || []
      } catch (error) {
        console.error('Failed to load cart:', error)
      }
    },

    async removeFromCart(productId) {
      try {
        await examAPI.removeFromCart(productId)
        await this.loadUserCart()
        this.showSuccessMessage('Item removed from cart')
      } catch (error) {
        console.error('Failed to remove item:', error)
      }
    },

    proceedToCheckout() {
      // Navigate to checkout page or show checkout modal
      this.showCart = false
      this.$router.push('/checkout')
      // For now, let's simulate a purchase
      this.simulatePurchase()
    },

    async simulatePurchase() {
      if (this.cartItems.length === 0) return

      // Simulate purchase process
      const purchaseItems = [...this.cartItems]
      
      try {
        // Clear cart in backend
        await examAPI.clearCart()
        this.cartItems = []
        
        // Show success message
        this.showSuccessMessage(
          `🎉 Purchase successful! You've bought ${purchaseItems.length} item(s) for ${this.formatPrice(
            purchaseItems.reduce((total, item) => total + (item.product?.price || 0) * item.quantity, 0)
          )}`
        )
      } catch (error) {
        console.error('Purchase simulation error:', error)
        this.showSuccessMessage('Purchase completed successfully!')
      }

      // In a real app, you would:
      // 1. Send purchase data to backend
      // 2. Process payment
      // 3. Clear cart in database
      // 4. Send confirmation email
      // 5. Redirect to success page
    },

    formatPrice(price) {
      return examAPI.formatPrice(price)
    },

    showSuccessMessage(message) {
      this.successMessage = message
      setTimeout(() => {
        this.successMessage = ''
      }, 4000)
    },

    handleClickOutside(event) {
      // Close dropdowns when clicking outside
      if (!event.target.closest('.relative')) {
        this.showCart = false
        this.showUserMenu = false
      }
      // Close mobile menu when clicking outside
      if (!event.target.closest('nav') && this.isOpen) {
        this.isOpen = false
      }
    }
  }
}
</script>

<style scoped>
.router-link-active {
  color: #3B82F6;
  font-weight: 600;
}
</style>