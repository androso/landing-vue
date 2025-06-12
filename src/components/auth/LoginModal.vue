<template>
  <div v-if="isVisible" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-8 max-w-md w-full mx-4 relative">
      <!-- Close button -->
      <button 
        @click="close" 
        class="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <!-- Header -->
      <div class="text-center mb-6">
        <h2 class="text-2xl font-bold text-gray-900 mb-2">
          {{ isRegistering ? 'Create Account' : 'Welcome Back' }}
        </h2>
        <p class="text-gray-600">
          {{ isRegistering ? 'Join Mentarie to start your learning journey' : 'Sign in to your account' }}
        </p>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit">
        <!-- Name field (only for registration) -->
        <div v-if="isRegistering" class="mb-4">
          <label for="name" class="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
          <input
            id="name"
            v-model="formData.name"
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            :class="{ 'border-red-500': errors.name }"
            placeholder="Enter your full name"
          >
          <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
        </div>

        <!-- Email field -->
        <div class="mb-4">
          <label for="email" class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
          <input
            id="email"
            v-model="formData.email"
            type="email"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            :class="{ 'border-red-500': errors.email }"
            placeholder="Enter your email"
          >
          <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
        </div>

        <!-- Password field -->
        <div class="mb-4">
          <label for="password" class="block text-sm font-medium text-gray-700 mb-2">Password</label>
          <div class="relative">
            <input
              id="password"
              v-model="formData.password"
              :type="showPassword ? 'text' : 'password'"
              required
              class="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              :class="{ 'border-red-500': errors.password }"
              :placeholder="isRegistering ? 'Create a password (min 6 characters)' : 'Enter your password'"
            >
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
            >
              <svg v-if="showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
              </svg>
            </button>
          </div>
          <p v-if="errors.password" class="mt-1 text-sm text-red-600">{{ errors.password }}</p>
        </div>

        <!-- Phone field (only for registration) -->
        <div v-if="isRegistering" class="mb-4">
          <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">Phone Number (Optional)</label>
          <input
            id="phone"
            v-model="formData.phone"
            type="tel"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Enter your phone number"
          >
        </div>

        <!-- Error message -->
        <div v-if="errorMessage" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p class="text-sm text-red-600">{{ errorMessage }}</p>
        </div>

        <!-- Submit button -->
        <button
          type="submit"
          :disabled="isLoading"
          class="w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <span v-if="isLoading" class="flex items-center justify-center">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isRegistering ? 'Creating Account...' : 'Signing In...' }}
          </span>
          <span v-else>
            {{ isRegistering ? 'Create Account' : 'Sign In' }}
          </span>
        </button>
      </form>

      <!-- Toggle mode -->
      <div class="mt-6 text-center">
        <p class="text-sm text-gray-600">
          {{ isRegistering ? 'Already have an account?' : "Don't have an account?" }}
          <button 
            @click="toggleMode" 
            class="text-primary hover:text-primary-600 font-medium ml-1"
          >
            {{ isRegistering ? 'Sign In' : 'Create Account' }}
          </button>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import examAPI from '../../services/examAPI.js'

export default {
  name: 'LoginModal',
  props: {
    isVisible: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close', 'login-success'],
  data() {
    return {
      isRegistering: false,
      isLoading: false,
      showPassword: false,
      errorMessage: '',
      formData: {
        name: '',
        email: '',
        password: '',
        phone: ''
      },
      errors: {}
    }
  },
  methods: {
    close() {
      this.resetForm()
      this.$emit('close')
    },

    toggleMode() {
      this.isRegistering = !this.isRegistering
      this.resetForm()
    },

    resetForm() {
      this.formData = {
        name: '',
        email: '',
        password: '',
        phone: ''
      }
      this.errors = {}
      this.errorMessage = ''
      this.isLoading = false
    },

    validateForm() {
      this.errors = {}

      if (this.isRegistering && !this.formData.name.trim()) {
        this.errors.name = 'Name is required'
      }

      if (!examAPI.validateEmail(this.formData.email)) {
        this.errors.email = 'Please enter a valid email address'
      }

      const passwordValidation = examAPI.validatePassword(this.formData.password)
      if (!passwordValidation.isValid) {
        this.errors.password = 'Password must be at least 6 characters long'
      }

      return Object.keys(this.errors).length === 0
    },

    async handleSubmit() {
      if (!this.validateForm()) {
        return
      }

      this.isLoading = true
      this.errorMessage = ''

      try {
        let response
        if (this.isRegistering) {
          response = await examAPI.register(this.formData)
        } else {
          response = await examAPI.login({
            email: this.formData.email,
            password: this.formData.password
          })
        }

        // Sync cart after login
        if (!this.isRegistering) {
          await examAPI.syncCart()
        }

        this.$emit('login-success', response.user)
        this.close()
        
        // Check for redirect after login
        const redirectPath = localStorage.getItem('redirectAfterLogin')
        if (redirectPath) {
          localStorage.removeItem('redirectAfterLogin')
          this.$router.push(redirectPath)
        }
        
        // Show success message
        this.$emit('show-message', {
          type: 'success',
          message: this.isRegistering ? 'Account created successfully!' : 'Welcome back!'
        })

      } catch (error) {
        this.errorMessage = error.message
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>

<style scoped>
/* Custom animations */
@keyframes spin {
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Focus styles for better accessibility */
input:focus {
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

/* Smooth transitions */
* {
  transition: all 0.2s ease-in-out;
}
</style>