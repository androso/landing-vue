<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation -->
    <header class="bg-white shadow-sm">
      <NavigationSection />
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-6 py-12">
      <div class="max-w-4xl mx-auto">
        <!-- Hero Section -->
        <div class="text-center mb-12">
          <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Free English Proficiency Trial
          </h1>
          <p class="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Test your English skills with our comprehensive proficiency exam. Get instant feedback and discover your language level in just 10-15 minutes.
          </p>
          <div class="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
            <div class="flex items-center">
              <svg class="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
              Instant AI Feedback
            </div>
            <div class="flex items-center">
              <svg class="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
              No Registration Required
            </div>
            <div class="flex items-center">
              <svg class="h-5 w-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
              </svg>
              Detailed Score Breakdown
            </div>
          </div>
        </div>

        <!-- Level Selection -->
        <div class="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-6 text-center">
            Choose Your Starting Level
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div 
              v-for="level in levels" 
              :key="level.code"
              :class="[
                'border-2 rounded-lg p-6 cursor-pointer transition-all hover:shadow-md',
                selectedLevel === level.code 
                  ? 'border-primary bg-primary-light' 
                  : 'border-gray-200 hover:border-gray-300'
              ]"
              @click="selectedLevel = level.code"
            >
              <div class="text-center">
                <h3 class="text-xl font-bold text-gray-900 mb-2">{{ level.code }}</h3>
                <h4 class="text-lg font-semibold text-primary mb-3">{{ level.name }}</h4>
                <p class="text-gray-600 text-sm mb-4">{{ level.description }}</p>
                <div class="text-xs text-gray-500">
                  <p><strong>Grammar:</strong> {{ level.skills.grammar }}</p>
                  <p><strong>Vocabulary:</strong> {{ level.skills.vocabulary }}</p>
                  <p><strong>Speaking:</strong> {{ level.skills.speaking }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- What to Expect -->
        <div class="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-6 text-center">
            What to Expect
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div class="text-center">
              <div class="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                </svg>
              </div>
              <h3 class="font-semibold text-gray-900 mb-2">Grammar</h3>
              <p class="text-sm text-gray-600">2-3 questions testing sentence structure and verb forms</p>
            </div>
            <div class="text-center">
              <div class="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                </svg>
              </div>
              <h3 class="font-semibold text-gray-900 mb-2">Writing</h3>
              <p class="text-sm text-gray-600">1-2 questions with AI-powered grammar and style analysis</p>
            </div>
            <div class="text-center">
              <div class="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="h-8 w-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 14.142M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path>
                </svg>
              </div>
              <h3 class="font-semibold text-gray-900 mb-2">Listening</h3>
              <p class="text-sm text-gray-600">2-3 audio questions with voice recording responses</p>
            </div>
            <div class="text-center">
              <div class="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="h-8 w-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                </svg>
              </div>
              <h3 class="font-semibold text-gray-900 mb-2">Reading</h3>
              <p class="text-sm text-gray-600">2-3 comprehension questions based on short passages</p>
            </div>
          </div>
        </div>

        <!-- User Info Section - Different for logged in vs anonymous users -->
        <div class="bg-white rounded-lg shadow-lg p-8 mb-8">
          <!-- For Authenticated Users -->
          <div v-if="isAuthenticated">
            <h2 class="text-2xl font-bold text-gray-900 mb-6 text-center">
              Ready to Take Your Exam
            </h2>
            <div class="flex items-center justify-center mb-6">
              <div class="flex items-center bg-green-50 border border-green-200 rounded-lg p-4">
                <svg class="h-6 w-6 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <div>
                  <p class="text-green-800 font-semibold">{{ authenticatedUser?.name || 'User' }}</p>
                  <p class="text-green-600 text-sm">{{ authenticatedUser?.email }}</p>
                </div>
              </div>
            </div>
            <p class="text-gray-600 text-center">
              Your results will be automatically saved to your account and available in your dashboard.
            </p>
          </div>

          <!-- For Anonymous Users -->
          <div v-else>
            <h2 class="text-2xl font-bold text-gray-900 mb-6 text-center">
              Optional: Save Your Results
            </h2>
            <p class="text-gray-600 text-center mb-6">
              Provide your information to save your results and get personalized study recommendations.
            </p>
            <div class="max-w-md mx-auto grid grid-cols-1 gap-4 mb-4">
              <input
                v-model="userInfo.name"
                type="text"
                placeholder="Your Name (optional)"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <input
                v-model="userInfo.email"
                type="email"
                placeholder="Your Email (optional)"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div class="text-center">
              <p class="text-sm text-gray-500 mb-2">Or</p>
              <router-link 
                to="/auth" 
                class="text-primary hover:text-primary-dark font-medium text-sm"
              >
                Log in to automatically save your results
              </router-link>
            </div>
          </div>
        </div>

        <!-- Start Button -->
        <div class="text-center">
          <button
            @click="startExam"
            :disabled="loading || !selectedLevel"
            :class="[
              'px-8 py-4 rounded-lg text-white font-semibold text-lg transition-all',
              loading || !selectedLevel
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-primary hover:bg-primary-dark shadow-lg hover:shadow-xl'
            ]"
          >
            <span v-if="loading" class="flex items-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Starting Exam...
            </span>
            <span v-else>
              Start Free Trial Exam
            </span>
          </button>
          <p class="text-sm text-gray-500 mt-4">
            Estimated time: 10-15 minutes
          </p>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p class="text-red-600 text-center">{{ error }}</p>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import NavigationSection from '../components/landing/NavigationSection.vue'
import examAPI from '../services/examAPI.js'

export default {
  name: 'ExamTrial',
  components: {
    NavigationSection
  },
  data() {
    return {
      selectedLevel: 'A1',
      loading: false,
      error: null,
      isAuthenticated: false,
      authenticatedUser: null,
      userInfo: {
        name: '',
        email: ''
      },
      levels: [
        {
          code: 'A1',
          name: 'Beginner',
          description: 'Basic everyday expressions and simple phrases',
          skills: {
            grammar: 'Present tense, basic sentence structure',
            vocabulary: 'Common words and phrases',
            speaking: 'Simple introductions and questions'
          }
        },
        {
          code: 'A2',
          name: 'Elementary',
          description: 'Simple sentences on familiar topics',
          skills: {
            grammar: 'Past and future tense, comparatives',
            vocabulary: 'Everyday topics and situations',
            speaking: 'Simple conversations and descriptions'
          }
        },
        {
          code: 'B1',
          name: 'Intermediate',
          description: 'Clear communication on familiar matters',
          skills: {
            grammar: 'Complex sentences, conditionals',
            vocabulary: 'Work, school, and leisure topics',
            speaking: 'Express opinions and experiences'
          }
        },
        {
          code: 'B2',
          name: 'Upper Intermediate',
          description: 'Complex texts and abstract topics',
          skills: {
            grammar: 'Advanced tenses, passive voice',
            vocabulary: 'Specialized and technical terms',
            speaking: 'Fluent conversations on most topics'
          }
        },
        {
          code: 'C1',
          name: 'Advanced',
          description: 'Wide range of demanding texts',
          skills: {
            grammar: 'Subtle grammatical distinctions',
            vocabulary: 'Idiomatic and nuanced expressions',
            speaking: 'Spontaneous and fluent communication'
          }
        },
        {
          code: 'C2',
          name: 'Proficient',
          description: 'Native-like understanding and expression',
          skills: {
            grammar: 'Perfect command of all structures',
            vocabulary: 'Precise and sophisticated usage',
            speaking: 'Effortless and natural communication'
          }
        }
      ]
    }
  },
  methods: {
    async loadUserData() {
      // Check if user is authenticated
      this.isAuthenticated = examAPI.isAuthenticated()
      
      if (this.isAuthenticated) {
        try {
          // Get user profile data
          this.authenticatedUser = await examAPI.getProfile()
        } catch (error) {
          console.error('Failed to load user profile:', error)
          // If profile loading fails, treat as not authenticated
          this.isAuthenticated = false
          this.authenticatedUser = null
        }
      }
    },

    async startExam() {
      if (!this.selectedLevel) {
        this.error = 'Please select a starting level'
        return
      }

      this.loading = true
      this.error = null

      try {
        let userInfo = null

        if (this.isAuthenticated && this.authenticatedUser) {
          // Use authenticated user data
          userInfo = {
            name: this.authenticatedUser.name,
            email: this.authenticatedUser.email,
            userId: this.authenticatedUser._id || this.authenticatedUser.id
          }
        } else if (this.userInfo.name || this.userInfo.email) {
          // Use manually entered anonymous user info
          userInfo = {
            name: this.userInfo.name || null,
            email: this.userInfo.email || null
          }
        }

        // Start the session
        const sessionData = await examAPI.startSession(this.selectedLevel, userInfo)
        
        // Navigate to exam interface
        this.$router.push({
          name: 'ExamInterface',
          params: { sessionId: sessionData.sessionId }
        })
      } catch (error) {
        this.error = error.message || 'Failed to start exam. Please try again.'
        console.error('Failed to start exam:', error)
      } finally {
        this.loading = false
      }
    }
  },
  async mounted() {
    // Clear any existing session data when user visits trial page
    examAPI.clearSession()
    
    // Load user authentication state and profile
    await this.loadUserData()
  }
}
</script>

<style scoped>
/* Add any custom styles here */
</style> 