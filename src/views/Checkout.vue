<template>
  <div class="min-h-screen bg-gray-50">
    <NavigationSection />
    
    <div class="py-16">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="text-center mb-12">
          <h1 class="text-4xl font-bold text-gray-900 mb-4">Checkout</h1>
          <p class="text-xl text-gray-600">Complete your purchase</p>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <span class="ml-3 text-gray-600">Loading your cart...</span>
        </div>

        <!-- Empty Cart -->
        <div v-else-if="cartItems.length === 0" class="text-center py-12">
          <svg class="mx-auto h-24 w-24 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5H19M7 13v-3h10" />
          </svg>
          <h3 class="mt-6 text-lg font-medium text-gray-900">Your cart is empty</h3>
          <p class="mt-2 text-gray-600">Add some products to your cart before checking out.</p>
          <router-link 
            to="/pricing" 
            class="mt-6 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary-600"
          >
            Browse Plans
          </router-link>
        </div>

        <!-- Checkout Form -->
        <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Order Summary -->
          <div class="bg-white rounded-lg shadow-sm p-6 h-fit">
            <h2 class="text-lg font-semibold mb-6">Order Summary</h2>
            
            <div class="space-y-4">
              <div v-for="item in cartItems" :key="item.productId" class="flex items-center justify-between py-4 border-b">
                <div class="flex-1">
                  <h3 class="font-medium text-gray-900">{{ item.product?.name || 'Product' }}</h3>
                  <p class="text-sm text-gray-600">{{ item.product?.description || '' }}</p>
                  <div class="mt-2 flex items-center space-x-4">
                    <span class="text-sm text-gray-500">Qty: {{ item.quantity }}</span>
                    <button 
                      @click="removeFromCart(item.productId)"
                      class="text-sm text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <div class="text-right ml-4">
                  <p class="font-medium">{{ formatPrice(item.product?.price || 0) }}</p>
                  <p v-if="item.quantity > 1" class="text-sm text-gray-500">
                    {{ formatPrice((item.product?.price || 0) * item.quantity) }} total
                  </p>
                </div>
              </div>
            </div>

            <!-- Total -->
            <div class="mt-6 space-y-3">
              <div class="flex justify-between">
                <span>Subtotal</span>
                <span>{{ formatPrice(subtotal) }}</span>
              </div>
              <div class="flex justify-between">
                <span>Tax</span>
                <span>{{ formatPrice(tax) }}</span>
              </div>
              <div class="border-t pt-3 flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>{{ formatPrice(total) }}</span>
              </div>
            </div>
          </div>

          <!-- Payment Form -->
          <div class="bg-white rounded-lg shadow-sm p-6">
            <h2 class="text-lg font-semibold mb-6">Payment Information</h2>
            
            <form @submit.prevent="processPayment">
              <!-- Billing Address -->
              <div class="mb-6">
                <h3 class="font-medium mb-4">Billing Address</h3>
                <div class="grid grid-cols-1 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      v-model="billingForm.name"
                      type="text"
                      required
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      v-model="billingForm.email"
                      type="email"
                      required
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <input
                      v-model="billingForm.address"
                      type="text"
                      required
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                  </div>
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">City</label>
                      <input
                        v-model="billingForm.city"
                        type="text"
                        required
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
                      <input
                        v-model="billingForm.zipCode"
                        type="text"
                        required
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                    </div>
                  </div>
                </div>
              </div>

              <!-- Payment Method -->
              <div class="mb-6">
                <h3 class="font-medium mb-4">Payment Method</h3>
                <div class="space-y-4">
                  <label class="flex items-center">
                    <input type="radio" value="card" v-model="paymentMethod" class="mr-3">
                    <span>Credit/Debit Card</span>
                  </label>
                  <label class="flex items-center">
                    <input type="radio" value="paypal" v-model="paymentMethod" class="mr-3">
                    <span>PayPal</span>
                  </label>
                </div>
              </div>

              <!-- Credit Card Form -->
              <div v-if="paymentMethod === 'card'" class="mb-6">
                <div class="grid grid-cols-1 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                    <input
                      v-model="cardForm.number"
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                  </div>
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
                      <input
                        v-model="cardForm.expiry"
                        type="text"
                        placeholder="MM/YY"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">CVC</label>
                      <input
                        v-model="cardForm.cvc"
                        type="text"
                        placeholder="123"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                    </div>
                  </div>
                </div>
              </div>

              <!-- Error Message -->
              <div v-if="errorMessage" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p class="text-sm text-red-600">{{ errorMessage }}</p>
              </div>

              <!-- Submit Button -->
              <button
                type="submit"
                :disabled="processing"
                class="w-full bg-primary text-white py-3 px-4 rounded-md hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <span v-if="processing" class="flex items-center justify-center">
                  <svg class="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing Payment...
                </span>
                <span v-else>
                  Complete Purchase - {{ formatPrice(total) }}
                </span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Modal -->
    <div v-if="showSuccessModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-8 max-w-md w-full mx-4 text-center">
        <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 class="text-lg font-semibold mb-2">Payment Successful!</h3>
        <p class="text-gray-600 mb-6">Thank you for your purchase. You now have access to your selected plan.</p>
        <button 
          @click="goHome"
          class="bg-primary text-white px-6 py-2 rounded-md hover:bg-primary-600 transition-colors"
        >
          Continue
        </button>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script>
import NavigationSection from '../components/landing/NavigationSection.vue'
import Footer from '../components/landing/Footer.vue'
import examAPI from '../services/examAPI.js'

export default {
  name: 'Checkout',
  components: {
    NavigationSection,
    Footer
  },
  data() {
    return {
      loading: true,
      processing: false,
      cartItems: [],
      errorMessage: '',
      showSuccessModal: false,
      paymentMethod: 'card',
      billingForm: {
        name: '',
        email: '',
        address: '',
        city: '',
        zipCode: ''
      },
      cardForm: {
        number: '',
        expiry: '',
        cvc: ''
      }
    }
  },
  computed: {
    currentUser() {
      return examAPI.getCurrentUser()
    },
    subtotal() {
      return this.cartItems.reduce((total, item) => {
        return total + (item.product?.price || 0) * item.quantity
      }, 0)
    },
    tax() {
      return this.subtotal * 0.1 // 10% tax
    },
    total() {
      return this.subtotal + this.tax
    }
  },
  async mounted() {
    await this.loadCart()
    this.prefillUserInfo()
  },
  methods: {
    async loadCart() {
      this.loading = true
      try {
        const response = await examAPI.getCart()
        this.cartItems = response.cart?.items || []
      } catch (error) {
        console.error('Failed to load cart:', error)
        this.errorMessage = 'Failed to load cart items'
      } finally {
        this.loading = false
      }
    },

    async removeFromCart(productId) {
      try {
        await examAPI.removeFromCart(productId)
        await this.loadCart()
      } catch (error) {
        console.error('Failed to remove item:', error)
      }
    },

    prefillUserInfo() {
      if (this.currentUser) {
        this.billingForm.name = this.currentUser.name || ''
        this.billingForm.email = this.currentUser.email || ''
      }
    },

    async processPayment() {
      this.processing = true
      this.errorMessage = ''

      try {
        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 2000))

        // Simulate payment success
        if (Math.random() > 0.1) { // 90% success rate
          // Create subscriptions for purchased items
          const subscriptionPromises = [];
          for (const item of this.cartItems) {
            if (item.product?.category === 'subscription') {
              const subscriptionPromise = examAPI.createSubscription({
                productId: item.product._id || item.productId,
                paymentMethod: this.paymentMethod,
                transactionId: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
              }).catch(error => {
                console.error('Failed to create subscription for product:', item.product._id, error);
                // Don't fail the whole checkout if one subscription fails
                return { error: error.message, productId: item.product._id };
              });
              
              subscriptionPromises.push(subscriptionPromise);
            }
          }
          
          // Wait for all subscription creations
          const subscriptionResults = await Promise.all(subscriptionPromises);
          
          // Check if any subscriptions failed
          const failedSubscriptions = subscriptionResults.filter(result => result && result.error);
          if (failedSubscriptions.length > 0) {
            console.warn('Some subscriptions failed to create:', failedSubscriptions);
            // Still continue with clearing cart and showing success
          }
          
          // Clear cart in backend
          try {
            await examAPI.clearCart();
            this.cartItems = [];
          } catch (clearError) {
            console.error('Failed to clear cart:', clearError);
            // Don't fail checkout if cart clearing fails
          }
          
          this.showSuccessModal = true;
        } else {
          throw new Error('Payment failed. Please try again.')
        }
      } catch (error) {
        console.error('Payment process failed:', error);
        
        if (error.message.includes('Backend server is not running') || error.message.includes('Payment service is currently unavailable')) {
          this.errorMessage = 'Payment service is currently unavailable. Please try again later.';
        } else if (error.message.includes('Authentication failed')) {
          this.errorMessage = 'Please log in again to complete your purchase.';
          // Could redirect to login here
        } else if (error.message.includes('Subscription service not available')) {
          this.errorMessage = 'Unable to activate your subscription. Please contact support.';
        } else {
          this.errorMessage = error.message || 'An unexpected error occurred during payment.';
        }
      } finally {
        this.processing = false;
      }
    },

    formatPrice(price) {
      return examAPI.formatPrice(price)
    },

    goHome() {
      this.showSuccessModal = false
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
@keyframes spin {
  to { transform: rotate(360deg); }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

input:focus {
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}
</style> 