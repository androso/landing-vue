<template>
  <div class="min-h-screen bg-gray-50">
    <NavigationSection />
    
    <div class="py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p class="mt-2 text-gray-600">Manage your account and subscriptions</p>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <span class="ml-3 text-gray-600">Loading dashboard...</span>
        </div>

        <!-- Dashboard Content -->
        <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Left Column - Profile & Quick Actions -->
          <div class="lg:col-span-1 space-y-6">
            <!-- Profile Card -->
            <div class="bg-white rounded-lg shadow-sm p-6">
              <div class="flex items-center mb-4">
                <div class="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                  <span class="text-primary text-xl font-bold">
                    {{ userInitials }}
                  </span>
                </div>
                <div class="ml-4">
                  <h3 class="text-lg font-semibold text-gray-900">{{ user?.name }}</h3>
                  <p class="text-gray-600">{{ user?.email }}</p>
                </div>
              </div>
              
              <div class="space-y-2 text-sm text-gray-600">
                <div><strong>Member since:</strong> {{ formatDate(user?.createdAt) }}</div>
                <div><strong>Last login:</strong> {{ formatDate(user?.lastLogin) }}</div>
                <div v-if="user?.phone"><strong>Phone:</strong> {{ user.phone }}</div>
                <div v-if="user?.address"><strong>Address:</strong> {{ user.address }}</div>
              </div>

              <button 
                @click="showProfileEdit = true"
                class="mt-4 w-full bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-600 transition-colors"
              >
                Edit Profile
              </button>
            </div>

            <!-- Quick Actions -->
            <div class="bg-white rounded-lg shadow-sm p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div class="space-y-3">
                <button 
                  @click="showPasswordChange = true"
                  class="w-full text-left p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <div class="flex items-center">
                    <svg class="w-5 h-5 text-gray-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Change Password
                  </div>
                </button>
                
                <router-link 
                  to="/pricing"
                  class="block w-full text-left p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <div class="flex items-center">
                    <svg class="w-5 h-5 text-gray-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    Browse Plans
                  </div>
                </router-link>
                
                <router-link 
                  to="/exam-trial"
                  class="block w-full text-left p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <div class="flex items-center">
                    <svg class="w-5 h-5 text-gray-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Take Exam
                  </div>
                </router-link>
              </div>
            </div>
          </div>

          <!-- Right Column - Subscription & Activity -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Current Subscription -->
            <div class="bg-white rounded-lg shadow-sm p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Current Subscription</h3>
              
              <div v-if="loadingSubscription" class="flex items-center justify-center py-8">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <span class="ml-2 text-gray-600">Loading subscription...</span>
              </div>

              <div v-else-if="activeSubscription" class="space-y-4">
                <div class="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div>
                    <h4 class="font-semibold text-green-900">{{ activeSubscription.plan?.name }}</h4>
                    <p class="text-green-700">{{ formatPrice(activeSubscription.plan?.price) }}/{{ activeSubscription.plan?.billingPeriod }}</p>
                  </div>
                  <div class="text-right">
                    <span class="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      Active
                    </span>
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="p-4 bg-gray-50 rounded-lg">
                    <h5 class="font-medium text-gray-900">Next Billing</h5>
                    <p class="text-gray-600">
                      {{ activeSubscription.nextBillingDate ? formatDate(activeSubscription.nextBillingDate) : 'No renewal (Cancelled)' }}
                    </p>
                  </div>
                  
                  <div class="p-4 bg-gray-50 rounded-lg">
                    <h5 class="font-medium text-gray-900">Auto Renewal</h5>
                    <div class="flex items-center mt-1">
                      <button 
                        @click="toggleAutoRenewal"
                        :class="activeSubscription.autoRenew ? 'bg-green-600' : 'bg-gray-300'"
                        class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out"
                      >
                        <span 
                          :class="activeSubscription.autoRenew ? 'translate-x-5' : 'translate-x-0'"
                          class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
                        ></span>
                      </button>
                      <span class="ml-2 text-sm text-gray-600">
                        {{ activeSubscription.autoRenew ? 'On' : 'Off' }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Features -->
                <div v-if="formattedSubscriptionFeatures.length > 0" class="mt-4">
                  <h5 class="font-medium text-gray-900 mb-2">Included Features</h5>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div 
                      v-for="feature in formattedSubscriptionFeatures" 
                      :key="feature.name"
                      class="flex items-center"
                    >
                      <svg class="w-4 h-4 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span class="text-sm text-gray-600">{{ feature.name }}</span>
                    </div>
                  </div>
                </div>

                <!-- Subscription Actions -->
                <div class="flex space-x-3 pt-4 border-t">
                  <button 
                    v-if="activeSubscription.status === 'active'"
                    @click="showCancelSubscription = true"
                    class="px-4 py-2 text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors"
                  >
                    Cancel Subscription
                  </button>
                  <router-link 
                    to="/pricing"
                    class="px-4 py-2 text-primary bg-primary-50 rounded-md hover:bg-primary-100 transition-colors"
                  >
                    Change Plan
                  </router-link>
                </div>
              </div>

              <div v-else class="text-center py-8">
                <svg class="mx-auto h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                <h4 class="mt-2 text-lg font-medium text-gray-900">No Active Subscription</h4>
                <p class="mt-1 text-gray-600">Upgrade to access premium features</p>
                <router-link 
                  to="/pricing"
                  class="mt-4 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary-600"
                >
                  Browse Plans
                </router-link>
              </div>
            </div>

            <!-- Recent Activity -->
            <div class="bg-white rounded-lg shadow-sm p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              
              <div v-if="subscriptions.length > 0" class="space-y-3">
                <div 
                  v-for="subscription in subscriptions.slice(0, 5)" 
                  :key="subscription._id"
                  class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <h4 class="font-medium text-gray-900">{{ subscription.plan?.name }}</h4>
                    <p class="text-sm text-gray-600">{{ formatDate(subscription.createdAt) }}</p>
                  </div>
                  <span 
                    :class="{
                      'bg-green-100 text-green-800': subscription.status === 'active',
                      'bg-red-100 text-red-800': subscription.status === 'cancelled',
                      'bg-yellow-100 text-yellow-800': subscription.status === 'pending',
                      'bg-gray-100 text-gray-800': subscription.status === 'expired'
                    }"
                    class="px-2 py-1 rounded-full text-xs font-medium"
                  >
                    {{ subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1) }}
                  </span>
                </div>
              </div>

              <div v-else class="text-center py-4 text-gray-500">
                <p>No subscription history</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Profile Edit Modal -->
    <div v-if="showProfileEdit" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <h3 class="text-lg font-semibold mb-4">Edit Profile</h3>
        
        <form @submit.prevent="updateProfile">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <input
                v-model="profileForm.name"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <input
                v-model="profileForm.phone"
                type="tel"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <input
                v-model="profileForm.address"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
            </div>
          </div>

          <div v-if="profileError" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p class="text-sm text-red-600">{{ profileError }}</p>
          </div>

          <div class="mt-6 flex space-x-3">
            <button
              type="submit"
              :disabled="updatingProfile"
              class="flex-1 bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-600 disabled:opacity-50 transition-colors"
            >
              {{ updatingProfile ? 'Updating...' : 'Update Profile' }}
            </button>
            <button
              type="button"
              @click="closeProfileEdit"
              class="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Password Change Modal -->
    <div v-if="showPasswordChange" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <h3 class="text-lg font-semibold mb-4">Change Password</h3>
        
        <form @submit.prevent="changePassword">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
              <input
                v-model="passwordForm.currentPassword"
                type="password"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">New Password</label>
              <input
                v-model="passwordForm.newPassword"
                type="password"
                required
                minlength="6"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
              <input
                v-model="passwordForm.confirmPassword"
                type="password"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
            </div>
          </div>

          <div v-if="passwordError" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p class="text-sm text-red-600">{{ passwordError }}</p>
          </div>

          <div class="mt-6 flex space-x-3">
            <button
              type="submit"
              :disabled="changingPassword"
              class="flex-1 bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-600 disabled:opacity-50 transition-colors"
            >
              {{ changingPassword ? 'Changing...' : 'Change Password' }}
            </button>
            <button
              type="button"
              @click="closePasswordChange"
              class="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Cancel Subscription Modal -->
    <div v-if="showCancelSubscription" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <h3 class="text-lg font-semibold mb-4">Cancel Subscription</h3>
        <p class="text-gray-600 mb-4">Are you sure you want to cancel your subscription? You'll lose access to premium features.</p>
        
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">Reason for cancellation (optional)</label>
          <textarea
            v-model="cancellationReason"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Let us know why you're cancelling..."
          ></textarea>
        </div>

        <div class="flex space-x-3">
          <button
            @click="cancelSubscription"
            :disabled="cancellingSubscription"
            class="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            {{ cancellingSubscription ? 'Cancelling...' : 'Yes, Cancel' }}
          </button>
          <button
            @click="showCancelSubscription = false"
            class="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
          >
            Keep Subscription
          </button>
        </div>
      </div>
    </div>

    <!-- Success Message -->
    <div 
      v-if="successMessage" 
      class="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50"
    >
      {{ successMessage }}
    </div>

    <Footer />
  </div>
</template>

<script>
import NavigationSection from '../components/landing/NavigationSection.vue'
import Footer from '../components/landing/Footer.vue'
import examAPI from '../services/examAPI.js'

export default {
  name: 'Dashboard',
  components: {
    NavigationSection,
    Footer
  },
  data() {
    return {
      loading: true,
      loadingSubscription: true,
      user: null,
      activeSubscription: null,
      subscriptions: [],
      successMessage: '',
      
      // Profile editing
      showProfileEdit: false,
      updatingProfile: false,
      profileError: '',
      profileForm: {
        name: '',
        phone: '',
        address: ''
      },
      
      // Password change
      showPasswordChange: false,
      changingPassword: false,
      passwordError: '',
      passwordForm: {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      
      // Subscription management
      showCancelSubscription: false,
      cancellingSubscription: false,
      cancellationReason: ''
    }
  },
  computed: {
    userInitials() {
      if (!this.user?.name) return 'U'
      return this.user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    },
    
    formattedSubscriptionFeatures() {
      // Get features from the populated product instead of stored features
      const productFeatures = this.activeSubscription?.product?.features || 
                             this.activeSubscription?.features || []
      
      return productFeatures.map(feature => {
        // Handle different feature formats
        if (typeof feature === 'string') {
          return { name: feature, enabled: true }
        }
        
        if (feature && typeof feature === 'object') {
          // Handle proper product feature format
          if (feature.name) {
            return { 
              name: feature.name, 
              enabled: feature.included !== false,
              limit: feature.limit 
            }
          }
        }
        
        // Fallback for any other format
        return { name: 'Premium Feature', enabled: true }
      })
    }
  },
  async mounted() {
    await this.loadDashboard()
  },
  methods: {
    async loadDashboard() {
      this.loading = true
      this.loadingSubscription = true
      
      try {
        // Check if user is authenticated first
        if (!examAPI.isAuthenticated()) {
          this.$router.push('/');
          return;
        }
        
        // Load user profile
        const userResponse = await examAPI.getProfile();
        this.user = userResponse;
        
        // Load subscriptions with better error handling
        try {
          const subscriptionsResponse = await examAPI.getUserSubscriptions();
          this.subscriptions = subscriptionsResponse.subscriptions || [];
        } catch (subError) {
          console.error('Failed to load subscriptions:', subError);
          this.subscriptions = [];
        }
        
        // Load active subscription with better error handling
        try {
          const activeSubResponse = await examAPI.getActiveSubscription();
          this.activeSubscription = activeSubResponse.subscription;
        } catch (activeSubError) {
          console.error('Failed to load active subscription:', activeSubError);
          this.activeSubscription = null;
        }
        
      } catch (error) {
        console.error('Failed to load dashboard:', error);
        
        // Handle specific error cases
        if (error.message.includes('401') || error.message.includes('Unauthorized') || error.message.includes('Authentication failed')) {
          examAPI.clearAuthData();
          this.$router.push('/');
        } else if (error.message.includes('Backend service unavailable') || error.message.includes('Backend server is not running')) {
          alert('The server is currently unavailable. Please try again later or contact support.');
        } else if (error.message.includes('Route not found') || error.message.includes('404') || error.message.includes('Subscription service not available')) {
          alert('Some features are currently unavailable. Please try refreshing the page or contact support.');
        } else {
          alert('An unexpected error occurred. Please try refreshing the page.');
        }
      } finally {
        this.loading = false;
        this.loadingSubscription = false;
      }
    },

    async updateProfile() {
      if (!this.profileForm.name.trim()) {
        this.profileError = 'Name is required'
        return
      }

      this.updatingProfile = true
      this.profileError = ''

      try {
        const response = await examAPI.updateProfile(this.profileForm)
        this.user = response.user
        this.showSuccessMessage('Profile updated successfully!')
        this.closeProfileEdit()
      } catch (error) {
        this.profileError = error.message
      } finally {
        this.updatingProfile = false
      }
    },

    async changePassword() {
      if (this.passwordForm.newPassword !== this.passwordForm.confirmPassword) {
        this.passwordError = 'New passwords do not match'
        return
      }

      if (this.passwordForm.newPassword.length < 6) {
        this.passwordError = 'New password must be at least 6 characters'
        return
      }

      this.changingPassword = true
      this.passwordError = ''

      try {
        await examAPI.changePassword({
          currentPassword: this.passwordForm.currentPassword,
          newPassword: this.passwordForm.newPassword
        })
        this.showSuccessMessage('Password changed successfully!')
        this.closePasswordChange()
      } catch (error) {
        this.passwordError = error.message
      } finally {
        this.changingPassword = false
      }
    },

    async toggleAutoRenewal() {
      if (!this.activeSubscription) return

      try {
        const response = await examAPI.updateSubscriptionSettings(
          this.activeSubscription._id, 
          { autoRenew: !this.activeSubscription.autoRenew }
        )
        this.activeSubscription = response.subscription
        this.showSuccessMessage(`Auto-renewal ${this.activeSubscription.autoRenew ? 'enabled' : 'disabled'}`)
      } catch (error) {
        console.error('Failed to update auto-renewal:', error)
      }
    },

    async cancelSubscription() {
      this.cancellingSubscription = true

      try {
        await examAPI.cancelSubscription(this.activeSubscription._id, this.cancellationReason)
        this.showSuccessMessage('Subscription cancelled successfully')
        this.showCancelSubscription = false
        await this.loadDashboard() // Refresh data
      } catch (error) {
        console.error('Failed to cancel subscription:', error)
      } finally {
        this.cancellingSubscription = false
      }
    },

    closeProfileEdit() {
      this.showProfileEdit = false
      this.profileError = ''
      this.profileForm = {
        name: this.user?.name || '',
        phone: this.user?.phone || '',
        address: this.user?.address || ''
      }
    },

    closePasswordChange() {
      this.showPasswordChange = false
      this.passwordError = ''
      this.passwordForm = {
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }
    },

    showSuccessMessage(message) {
      this.successMessage = message
      setTimeout(() => {
        this.successMessage = ''
      }, 4000)
    },

    formatPrice(price) {
      return examAPI.formatPrice(price)
    },

    formatDate(date) {
      return examAPI.formatDate(date)
    }
  },

  watch: {
    showProfileEdit(newVal) {
      if (newVal) {
        this.profileForm = {
          name: this.user?.name || '',
          phone: this.user?.phone || '',
          address: this.user?.address || ''
        }
      }
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
</style>