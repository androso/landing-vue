<template>
  <section id="pricing" class="py-20 bg-gray-50">
    <div class="container mx-auto px-6">
      <div class="text-center mb-16">
        <h2 class="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
        <p class="max-w-2xl mx-auto text-gray-600">Choose the plan that fits your learning journey.</p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <span class="ml-3 text-gray-600">Loading pricing plans...</span>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <div class="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <svg class="mx-auto h-12 w-12 text-red-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h3 class="text-lg font-medium text-red-800 mb-2">Failed to Load Pricing</h3>
          <p class="text-red-600 mb-4">{{ error }}</p>
          <button 
            @click="fetchProducts" 
            class="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>

      <!-- Pricing Cards -->
      <div v-else class="flex flex-col lg:flex-row justify-center items-center space-y-8 lg:space-y-0 lg:space-x-8">
        <div 
          v-for="product in sortedProducts" 
          :key="product._id"
          class="bg-white rounded-xl shadow-lg p-8 flex flex-col max-w-sm w-full relative transform hover:scale-105 transition-transform duration-300"
          :class="{ 
            'ring-2 ring-primary ring-opacity-50 shadow-xl': product.isFeatured,
            'lg:scale-105': product.isFeatured 
          }"
        >
          <!-- Popular Badge -->
          <div 
            v-if="product.badge" 
            class="absolute top-0 right-0 bg-primary text-white px-4 py-1 rounded-tr-xl rounded-bl-xl font-medium text-sm"
          >
            {{ product.badge }}
          </div>

          <!-- Plan Name -->
          <h3 class="text-xl font-bold mb-2" :class="{ 'text-primary': product.isFeatured }">
            {{ product.name }}
          </h3>

          <!-- Price -->
          <div class="text-3xl font-bold mb-4">
            <span v-if="product.originalPrice && product.originalPrice > product.price" class="text-lg font-normal text-gray-400 line-through mr-2">
              {{ formatPrice(product.originalPrice, product.currency) }}
            </span>
            {{ formatPrice(product.price, product.currency) }}
            <span class="text-lg font-normal text-gray-500">
              /{{ product.billingPeriod || 'month' }}
            </span>
          </div>

          <!-- Description -->
          <p class="text-gray-600 mb-6">{{ product.description }}</p>

          <!-- Features List -->
          <ul class="space-y-3 mb-8 flex-grow">
            <li 
              v-for="feature in product.features" 
              :key="feature._id || feature.name"
              class="flex items-start"
            >
              <svg 
                v-if="feature.included" 
                xmlns="http://www.w3.org/2000/svg" 
                class="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              <svg 
                v-else 
                xmlns="http://www.w3.org/2000/svg" 
                class="h-5 w-5 text-gray-300 mr-3 mt-0.5 flex-shrink-0" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span :class="{ 'text-gray-400': !feature.included }">
                {{ feature.name }}
                <span v-if="feature.limit" class="text-sm text-gray-500">({{ feature.limit }})</span>
              </span>
            </li>
          </ul>

          <!-- CTA Button -->
          <button
            @click="selectPlan(product)"
            :disabled="addingToCart === product._id"
            class="w-full py-3 rounded-full font-medium transition-all duration-300 relative overflow-hidden"
            :class="product.isFeatured ? 
              'bg-primary text-white hover:bg-primary-600 hover:shadow-lg' : 
              'border border-primary text-primary hover:bg-primary hover:text-white'"
          >
            <span v-if="addingToCart === product._id" class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Adding...
            </span>
            <span v-else>
              {{ product.price === 0 ? 'Get Started' : product.isFeatured ? 'Start Free Trial' : 'Choose Plan' }}
            </span>
          </button>

          <!-- Additional Info -->
          <div v-if="product.hasRealtimeAPI || product.maxConversationsPerDay === -1" class="mt-3 text-center">
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
              <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd" />
              </svg>
              {{ product.hasRealtimeAPI ? 'Real-time API' : 'Unlimited' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Success Message -->
      <div 
        v-if="successMessage" 
        class="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300"
        :class="{ 'translate-y-0 opacity-100': successMessage, 'translate-y-full opacity-0': !successMessage }"
      >
        <div class="flex items-center">
          <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
          {{ successMessage }}
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import examAPI from '../../services/examAPI.js'

export default {
  name: 'PricingSection',
  data() {
    return {
      products: [],
      loading: true,
      error: null,
      addingToCart: null,
      successMessage: ''
    }
  },
  computed: {
    sortedProducts() {
      return [...this.products].sort((a, b) => {
        // Sort by sortOrder, then by price
        if (a.sortOrder !== b.sortOrder) {
          return (a.sortOrder || 999) - (b.sortOrder || 999)
        }
        return a.price - b.price
      })
    }
  },
  async mounted() {
    await this.fetchProducts()
  },
  methods: {
    async fetchProducts() {
      this.loading = true
      this.error = null
      
      try {
        const response = await examAPI.getSubscriptionPlans()
        this.products = response.products || []
        
        if (this.products.length === 0) {
          this.error = 'No pricing plans available at the moment.'
        }
      } catch (error) {
        console.error('Failed to fetch products:', error)
        this.error = error.message || 'Failed to load pricing plans. Please try again later.'
      } finally {
        this.loading = false
      }
    },

    async selectPlan(product) {
      if (this.addingToCart === product._id) return

      this.addingToCart = product._id

      try {
        if (product.price === 0) {
          // Free plan - just show success
          this.showSuccessMessage(`Welcome to ${product.name}! You can start learning right away.`)
        } else {
          // Paid plan - add to cart
          await examAPI.addToCart(product._id, 1)
          this.showSuccessMessage(`${product.name} added to cart successfully!`)
        }
      } catch (error) {
        console.error('Failed to select plan:', error)
        this.showErrorMessage(error.message || 'Failed to select plan. Please try again.')
      } finally {
        this.addingToCart = null
      }
    },

    formatPrice(price, currency = 'USD') {
      return examAPI.formatPrice(price, currency)
    },

    showSuccessMessage(message) {
      this.successMessage = message
      setTimeout(() => {
        this.successMessage = ''
      }, 3000)
    },

    showErrorMessage(message) {
      // You could implement a toast/notification system here
      alert(message)
    }
  }
}
</script>

<style scoped>
/* Custom scrollbar for features list if needed */
.space-y-3 {
  scrollbar-width: thin;
  scrollbar-color: #e5e7eb transparent;
}

/* Smooth transitions */
* {
  transition-property: transform, box-shadow, background-color, border-color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Hover effects */
.bg-white:hover {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* Animation for loading spinner */
@keyframes spin {
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Featured plan glow effect */
.ring-2.ring-primary.ring-opacity-50 {
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.5), 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}
</style>