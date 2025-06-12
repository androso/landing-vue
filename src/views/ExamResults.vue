<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm">
      <div class="container mx-auto px-6 py-4">
        <div class="flex justify-between items-center">
          <router-link to="/" class="flex items-center">
            <div class="mr-2 p-2 rounded-full bg-primary-light">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <span class="text-xl font-bold text-primary">mentarie</span>
          </router-link>
          
          <h1 class="text-xl font-semibold text-gray-900">Exam Results</h1>
          
          <div class="flex space-x-4">
            <router-link to="/exam-trial" class="btn-secondary">Take Another Exam</router-link>
            <router-link to="/" class="btn-primary">Home</router-link>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container mx-auto px-6 py-8">
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center min-h-96">
        <div class="text-center">
          <svg class="animate-spin h-12 w-12 text-primary mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p class="text-gray-600">Loading your results...</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="max-w-2xl mx-auto">
        <div class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <svg class="h-12 w-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
          </svg>
          <h3 class="text-lg font-semibold text-red-800 mb-2">Error Loading Results</h3>
          <p class="text-red-600 mb-4">{{ error }}</p>
          <button @click="loadResults" class="btn-primary">Try Again</button>
        </div>
      </div>

      <!-- Results Display -->
      <div v-else-if="results" class="max-w-6xl mx-auto space-y-8">
        <!-- Overall Score Card -->
        <div class="bg-white rounded-lg shadow-lg p-8 text-center">
          <div class="mb-6">
            <div class="relative w-32 h-32 mx-auto mb-4">
              <!-- Circular Progress -->
              <svg class="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="54" stroke="#e5e7eb" stroke-width="8" fill="none"></circle>
                <circle 
                  cx="60" 
                  cy="60" 
                  r="54" 
                  :stroke="getScoreColor(results.percentage)" 
                  stroke-width="8" 
                  fill="none"
                  stroke-linecap="round"
                  :stroke-dasharray="circumference"
                  :stroke-dashoffset="circumference - (results.percentage / 100) * circumference"
                  class="transition-all duration-1000"
                ></circle>
              </svg>
              <div class="absolute inset-0 flex items-center justify-center">
                <div>
                  <div class="text-3xl font-bold text-gray-900">{{ Math.round(results.percentage) }}%</div>
                  <div class="text-sm text-gray-500">Overall Score</div>
                </div>
              </div>
            </div>
            
            <h2 class="text-3xl font-bold text-gray-900 mb-2">
              {{ results.proficiencyLevel }}
            </h2>
            <p class="text-lg text-gray-600 mb-4">
              Your English proficiency level based on {{ results.level }} assessment
            </p>
            
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div class="bg-gray-50 rounded-lg p-4">
                <div class="text-2xl font-bold text-gray-900">{{ results.totalScore }}</div>
                <div class="text-sm text-gray-500">Total Points</div>
              </div>
              <div class="bg-gray-50 rounded-lg p-4">
                <div class="text-2xl font-bold text-gray-900">{{ results.totalQuestions }}</div>
                <div class="text-sm text-gray-500">Questions</div>
              </div>
              <div class="bg-gray-50 rounded-lg p-4">
                <div class="text-2xl font-bold text-gray-900">{{ Math.round(results.averageScore * 10) / 10 }}</div>
                <div class="text-sm text-gray-500">Avg Score</div>
              </div>
              <div class="bg-gray-50 rounded-lg p-4">
                <div class="text-2xl font-bold text-gray-900">{{ formatTime(results.totalTimeSpent) }}</div>
                <div class="text-sm text-gray-500">Time Taken</div>
              </div>
            </div>
          </div>
        </div>

        <!-- General Feedback Section -->
        <div v-if="results.generalFeedback" class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-lg p-8 border border-blue-100">
          <h3 class="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <svg class="h-6 w-6 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
            </svg>
            Personal Feedback & Recommendations
          </h3>
          
          <!-- Congratulations -->
          <div class="bg-white rounded-lg p-6 mb-6 border-l-4 border-green-500">
            <div class="flex items-start">
              <svg class="h-6 w-6 text-green-500 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div>
                <h4 class="text-lg font-semibold text-gray-900 mb-2">Congratulations!</h4>
                <p class="text-gray-700">{{ results.generalFeedback.congratulations }}</p>
              </div>
            </div>
          </div>

          <!-- Overall Assessment -->
          <div class="bg-white rounded-lg p-6 mb-6">
            <h4 class="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <svg class="h-5 w-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
              Performance Assessment
            </h4>
            <p class="text-gray-700">{{ results.generalFeedback.overallAssessment }}</p>
          </div>

          <!-- Strengths and Areas for Improvement -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <!-- Strengths -->
            <div class="bg-white rounded-lg p-6">
              <h4 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <svg class="h-5 w-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
                Your Strengths
              </h4>
              <ul class="space-y-2">
                <li v-for="strength in results.generalFeedback.strengths" :key="strength" class="flex items-start text-green-700">
                  <svg class="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                  </svg>
                  <span class="text-sm">{{ strength }}</span>
                </li>
              </ul>
            </div>

            <!-- Areas for Improvement -->
            <div class="bg-white rounded-lg p-6" v-if="results.generalFeedback.areasForImprovement.length > 0">
              <h4 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <svg class="h-5 w-5 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                </svg>
                Focus Areas
              </h4>
              <ul class="space-y-2">
                <li v-for="area in results.generalFeedback.areasForImprovement" :key="area" class="flex items-start text-orange-700">
                  <svg class="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                  </svg>
                  <span class="text-sm">{{ area }}</span>
                </li>
              </ul>
            </div>
          </div>

          <!-- Study Recommendations -->
          <div class="bg-white rounded-lg p-6 mb-6">
            <h4 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <svg class="h-5 w-5 mr-2 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
              </svg>
              Study Recommendations
            </h4>
            <ul class="space-y-3">
              <li v-for="recommendation in results.generalFeedback.recommendations" :key="recommendation" class="flex items-start text-gray-700">
                <span class="text-lg mr-3">{{ recommendation.charAt(0) }}</span>
                <span class="text-sm">{{ recommendation.substring(2) }}</span>
              </li>
            </ul>
          </div>

          <!-- Next Steps -->
          <div class="bg-white rounded-lg p-6 mb-6">
            <h4 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <svg class="h-5 w-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              Your Next Steps
            </h4>
            <ul class="space-y-3">
              <li v-for="step in results.generalFeedback.nextSteps" :key="step" class="flex items-start text-gray-700">
                <span class="text-lg mr-3">{{ step.charAt(0) }}</span>
                <span class="text-sm">{{ step.substring(2) }}</span>
              </li>
            </ul>
          </div>

          <!-- Motivational Message -->
          <div class="bg-gradient-to-r from-green-100 to-blue-100 rounded-lg p-6 text-center border border-green-200">
            <svg class="h-8 w-8 text-green-600 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
            </svg>
            <p class="text-gray-700 font-medium">{{ results.generalFeedback.motivationalMessage }}</p>
          </div>
        </div>

        <!-- Performance Breakdown -->
        <div class="bg-white rounded-lg shadow-lg p-8">
          <h3 class="text-2xl font-bold text-gray-900 mb-6">Performance by Skill</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div 
              v-for="(skill, type) in results.breakdown" 
              :key="type"
              class="text-center"
            >
              <div class="mb-4">
                <div class="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-2" :class="getSkillIconBg(type)">
                  <div class="h-8 w-8" :class="getSkillIconColor(type)" v-html="getSkillIconSvg(type)"></div>
                </div>
                <h4 class="text-lg font-semibold text-gray-900 capitalize">{{ type }}</h4>
              </div>
              
              <div class="space-y-2">
                <div class="flex justify-between text-sm">
                  <span>Correct:</span>
                  <span>{{ skill.correct }}/{{ skill.total }}</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    class="h-2 rounded-full transition-all duration-1000"
                    :class="getSkillProgressColor(type)"
                    :style="{ width: `${(skill.correct / skill.total) * 100}%` }"
                  ></div>
                </div>
                <div class="text-lg font-bold" :class="getSkillScoreColor(skill.totalScore / skill.total)">
                  {{ Math.round((skill.totalScore / skill.total) * 10) / 10 }}/10
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Detailed Question Review -->
        <div class="bg-white rounded-lg shadow-lg p-8">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-2xl font-bold text-gray-900">Question Review</h3>
            <button 
              @click="showAllQuestions = !showAllQuestions"
              class="text-primary hover:text-primary-dark font-medium"
            >
              {{ showAllQuestions ? 'Show Less' : 'Show All Questions' }}
            </button>
          </div>
          
          <div class="space-y-6">
            <div 
              v-for="(skill, type) in results.breakdown" 
              :key="type"
              class="border border-gray-200 rounded-lg p-6"
            >
              <h4 class="text-lg font-semibold text-gray-900 capitalize mb-4 flex items-center">
                <div class="h-5 w-5 mr-2" :class="getSkillIconColor(type)" v-html="getSkillIconSvg(type)"></div>
                {{ type }} Questions
              </h4>
              
              <div class="space-y-4">
                <div 
                  v-for="(question, index) in (showAllQuestions ? skill.questions : skill.questions.slice(0, 2))" 
                  :key="index"
                  class="bg-gray-50 rounded-lg p-4"
                >
                  <div class="flex justify-between items-start mb-2">
                    <div class="flex-1">
                      <p class="text-sm text-gray-700 mb-2">{{ question.question }}</p>
                      <p class="text-sm">
                        <span class="font-medium">Your answer:</span> 
                        <span class="text-gray-600">{{ question.userAnswer }}</span>
                      </p>
                    </div>
                    <div class="ml-4 text-right">
                      <div 
                        class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                        :class="question.isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                      >
                        {{ question.score }}/10
                      </div>
                    </div>
                  </div>
                  
                  <div class="text-sm text-gray-600 bg-white rounded p-3 mt-2">
                    <span class="font-medium">Feedback:</span> {{ question.feedback }}
                  </div>
                  
                  <div v-if="question.timeSpent" class="text-xs text-gray-500 mt-2">
                    Time spent: {{ formatTime(question.timeSpent) }}
                  </div>
                </div>
                
                <div v-if="!showAllQuestions && skill.questions.length > 2" class="text-center">
                  <span class="text-sm text-gray-500">
                    ... and {{ skill.questions.length - 2 }} more questions
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recommendations -->
        <div class="bg-white rounded-lg shadow-lg p-8">
          <h3 class="text-2xl font-bold text-gray-900 mb-6">Recommendations</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-4">
              <h4 class="text-lg font-semibold text-gray-900">Strengths</h4>
              <div class="space-y-2">
                <div v-for="strength in getStrengths()" :key="strength" class="flex items-center text-green-700">
                  <svg class="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                  </svg>
                  {{ strength }}
                </div>
              </div>
            </div>
            
            <div class="space-y-4">
              <h4 class="text-lg font-semibold text-gray-900">Areas for Improvement</h4>
              <div class="space-y-2">
                <div v-for="area in getImprovementAreas()" :key="area" class="flex items-center text-orange-700">
                  <svg class="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                  </svg>
                  {{ area }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Save Results -->
        <div v-if="!results.userId && !savedResults" class="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 class="text-lg font-semibold text-blue-900 mb-4">Save Your Results</h3>
          <p class="text-blue-700 mb-4">
            Enter your information to save these results and get personalized study recommendations.
          </p>
          
          <div class="max-w-md space-y-4">
            <input
              v-model="userInfo.name"
              type="text"
              placeholder="Your Name"
              class="w-full px-4 py-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              v-model="userInfo.email"
              type="email"
              placeholder="Your Email"
              class="w-full px-4 py-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button 
              @click="saveResults"
              :disabled="!userInfo.name || !userInfo.email || saving"
              class="w-full btn-primary"
            >
              {{ saving ? 'Saving...' : 'Save Results' }}
            </button>
          </div>
        </div>

        <!-- Success Message -->
        <div v-if="savedResults" class="bg-green-50 border border-green-200 rounded-lg p-6">
          <div class="flex items-center">
            <svg class="h-6 w-6 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div>
              <h3 class="text-lg font-semibold text-green-900">Results Saved!</h3>
              <p class="text-green-700">Your exam results have been saved successfully.</p>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-center space-x-4">
          <router-link to="/exam-trial" class="btn-secondary">Take Another Exam</router-link>
          <button @click="shareResults" class="btn-outline">Share Results</button>
          <router-link to="/" class="btn-primary">Back to Home</router-link>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import examAPI from '../services/examAPI.js'

export default {
  name: 'ExamResults',
  props: {
    sessionId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      loading: true,
      error: null,
      results: null,
      showAllQuestions: false,
      userInfo: {
        name: '',
        email: ''
      },
      saving: false,
      savedResults: false,
      circumference: 2 * Math.PI * 54 // for circular progress
    }
  },
  async mounted() {
    await this.loadResults()
  },
  methods: {
    async loadResults() {
      this.loading = true
      this.error = null

      try {
        this.results = await examAPI.getSessionSummary(this.sessionId)
      } catch (error) {
        this.error = error.message || 'Failed to load exam results'
        console.error('Failed to load results:', error)
      } finally {
        this.loading = false
      }
    },

    async saveResults() {
      if (!this.userInfo.name || !this.userInfo.email) return

      this.saving = true

      try {
        await examAPI.completeSession(this.sessionId, this.userInfo)
        this.savedResults = true
      } catch (error) {
        console.error('Failed to save results:', error)
        // Don't show error, just fail silently for better UX
      } finally {
        this.saving = false
      }
    },

    shareResults() {
      if (navigator.share) {
        navigator.share({
          title: 'My English Proficiency Results',
          text: `I just completed an English proficiency exam and scored ${this.results.percentage}% (${this.results.proficiencyLevel} level)!`,
          url: window.location.href
        })
      } else {
        // Fallback to copying URL
        navigator.clipboard.writeText(window.location.href).then(() => {
          alert('Results URL copied to clipboard!')
        })
      }
    },

    getScoreColor(percentage) {
      if (percentage >= 90) return '#10b981' // green
      if (percentage >= 75) return '#3b82f6' // blue  
      if (percentage >= 60) return '#f59e0b' // yellow
      return '#ef4444' // red
    },

    getSkillIconSvg(type) {
      const icons = {
        grammar: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
        </svg>`,
        writing: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
        </svg>`,
        listening: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 14.142M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path>
        </svg>`,
        reading: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>`
      }
      return icons[type] || icons.grammar
    },

    getSkillIconBg(type) {
      const colors = {
        grammar: 'bg-blue-100',
        writing: 'bg-green-100',
        listening: 'bg-purple-100',
        reading: 'bg-yellow-100'
      }
      return colors[type] || 'bg-gray-100'
    },

    getSkillIconColor(type) {
      const colors = {
        grammar: 'text-blue-600',
        writing: 'text-green-600', 
        listening: 'text-purple-600',
        reading: 'text-yellow-600'
      }
      return colors[type] || 'text-gray-600'
    },

    getSkillProgressColor(type) {
      const colors = {
        grammar: 'bg-blue-500',
        writing: 'bg-green-500',
        listening: 'bg-purple-500', 
        reading: 'bg-yellow-500'
      }
      return colors[type] || 'bg-gray-500'
    },

    getSkillScoreColor(avgScore) {
      if (avgScore >= 8) return 'text-green-600'
      if (avgScore >= 6) return 'text-yellow-600'
      return 'text-red-600'
    },

    getStrengths() {
      if (!this.results?.breakdown) return []
      
      const strengths = []
      Object.entries(this.results.breakdown).forEach(([type, skill]) => {
        const accuracy = skill.correct / skill.total
        const avgScore = skill.totalScore / skill.total
        
        if (accuracy >= 0.8 && avgScore >= 7) {
          strengths.push(`Strong ${type} skills`)
        }
      })
      
      if (this.results.percentage >= 85) {
        strengths.push('Excellent overall performance')
      }
      
      return strengths.length > 0 ? strengths : ['Good effort on the exam']
    },

    getImprovementAreas() {
      if (!this.results?.breakdown) return []
      
      const areas = []
      Object.entries(this.results.breakdown).forEach(([type, skill]) => {
        const accuracy = skill.correct / skill.total
        const avgScore = skill.totalScore / skill.total
        
        if (accuracy < 0.6 || avgScore < 6) {
          areas.push(`Focus on ${type} practice`)
        }
      })
      
      return areas.length > 0 ? areas : ['Continue practicing to improve further']
    },

    formatTime(seconds) {
      if (!seconds) return '0:00'
      
      const mins = Math.floor(seconds / 60)
      const secs = seconds % 60
      return `${mins}:${secs.toString().padStart(2, '0')}`
    }
  }
}
</script>

<style scoped>
/* Custom animations and styles */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style> 