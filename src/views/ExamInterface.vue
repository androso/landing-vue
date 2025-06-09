<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm">
      <div class="container mx-auto px-6 py-4">
        <div class="flex justify-between items-center">
          <div class="flex items-center">
            <router-link to="/" class="flex items-center">
              <div class="mr-2 p-2 rounded-full bg-primary-light">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <span class="text-xl font-bold text-primary">mentarie</span>
            </router-link>
          </div>
          
          <!-- Progress Bar -->
          <div v-if="sessionData" class="flex items-center space-x-4">
            <div class="text-sm text-gray-600">
              Question {{ currentQuestionIndex + 1 }} of {{ sessionData.totalQuestions }}
            </div>
            <div class="w-32 bg-gray-200 rounded-full h-2">
              <div 
                class="bg-primary h-2 rounded-full transition-all duration-300"
                :style="{ width: `${progress}%` }"
              ></div>
            </div>
          </div>

          <!-- Timer -->
          <div v-if="questionStartTime" class="text-sm text-gray-600">
            Time: {{ formatTime(currentQuestionTime) }}
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
          <p class="text-gray-600">Loading exam...</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="max-w-2xl mx-auto">
        <div class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <svg class="h-12 w-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
          </svg>
          <h3 class="text-lg font-semibold text-red-800 mb-2">Error Loading Exam</h3>
          <p class="text-red-600 mb-4">{{ error }}</p>
          <button @click="retryLoad" class="btn-primary">Try Again</button>
        </div>
      </div>

      <!-- Question Interface -->
      <div v-else-if="currentQuestion" class="max-w-4xl mx-auto">
        <QuestionComponent
          :question="currentQuestion"
          :questionNumber="currentQuestionIndex + 1"
          :totalQuestions="sessionData.totalQuestions"
          :sessionId="sessionId"
          @answer-submitted="handleAnswerSubmitted"
          @next-question="nextQuestion"
        />
      </div>

      <!-- Exam Completed -->
      <div v-else-if="examCompleted" class="max-w-2xl mx-auto text-center">
        <div class="bg-white rounded-lg shadow-lg p-8">
          <svg class="h-16 w-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h2 class="text-3xl font-bold text-gray-900 mb-4">Exam Completed!</h2>
          <p class="text-gray-600 mb-6">Thank you for taking the proficiency exam. Your results are being calculated...</p>
          <button @click="viewResults" class="btn-primary">View Results</button>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import examAPI from '../services/examAPI.js'
import QuestionComponent from '../components/exam/QuestionComponent.vue'

export default {
  name: 'ExamInterface',
  components: {
    QuestionComponent
  },
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
      sessionData: null,
      questions: [],
      currentQuestionIndex: 0,
      submittedAnswers: new Set(),
      examCompleted: false,
      questionStartTime: null,
      currentQuestionTime: 0,
      timer: null
    }
  },
  computed: {
    currentQuestion() {
      return this.questions[this.currentQuestionIndex] || null
    },
    progress() {
      if (!this.sessionData) return 0
      return Math.round(((this.currentQuestionIndex + 1) / this.sessionData.totalQuestions) * 100)
    }
  },
  async mounted() {
    await this.loadExamData()
    this.startQuestionTimer()
  },
  beforeUnmount() {
    this.stopTimer()
  },
  methods: {
    async loadExamData() {
      this.loading = true
      this.error = null

      try {
        // Get session questions
        const data = await examAPI.getSessionQuestions(this.sessionId)
        this.sessionData = data
        this.questions = data.questions || []

        if (this.questions.length === 0) {
          throw new Error('No questions found for this session')
        }

        // Check session status to see if already completed
        const statusData = await examAPI.getSessionStatus(this.sessionId)
        if (statusData.status === 'completed') {
          this.examCompleted = true
          return
        }

        // Start from the first unanswered question
        this.currentQuestionIndex = statusData.answeredQuestions || 0
        if (this.currentQuestionIndex >= this.questions.length) {
          this.examCompleted = true
          return
        }

      } catch (error) {
        this.error = error.message || 'Failed to load exam data'
        console.error('Failed to load exam:', error)
      } finally {
        this.loading = false
      }
    },

    async retryLoad() {
      await this.loadExamData()
    },

    startQuestionTimer() {
      this.questionStartTime = Date.now()
      this.currentQuestionTime = 0
      
      // Start the timer for current question tracking
      examAPI.startQuestionTimer(this.currentQuestionIndex + 1)
      
      // Update display timer every second
      this.timer = setInterval(() => {
        if (this.questionStartTime) {
          this.currentQuestionTime = Math.floor((Date.now() - this.questionStartTime) / 1000)
        }
      }, 1000)
    },

    stopTimer() {
      if (this.timer) {
        clearInterval(this.timer)
        this.timer = null
      }
    },

    handleAnswerSubmitted(response) {
      // Mark question as answered
      this.submittedAnswers.add(this.currentQuestion._id)
      
      // Store response data for potential display
      this.currentQuestion.userResponse = response
      
      console.log('Answer submitted:', response)
    },

    nextQuestion() {
      this.stopTimer()
      
      if (this.currentQuestionIndex < this.questions.length - 1) {
        this.currentQuestionIndex++
        this.startQuestionTimer()
      } else {
        // All questions completed
        this.completeExam()
      }
    },

    async completeExam() {
      this.stopTimer()
      this.examCompleted = true
      
      try {
        // Mark session as completed
        await examAPI.completeSession(this.sessionId)
        
        // Auto-redirect to results page immediately
        this.$router.push({
          name: 'ExamResults',
          params: { sessionId: this.sessionId }
        })
      } catch (error) {
        console.error('Failed to complete session:', error)
        // Still redirect to results even if completion fails
        this.$router.push({
          name: 'ExamResults',
          params: { sessionId: this.sessionId }
        })
      }
    },

    viewResults() {
      this.$router.push({
        name: 'ExamResults',
        params: { sessionId: this.sessionId }
      })
    },

    formatTime(seconds) {
      const mins = Math.floor(seconds / 60)
      const secs = seconds % 60
      return `${mins}:${secs.toString().padStart(2, '0')}`
    }
  },

  // Navigation guards
  beforeRouteLeave(to, from, next) {
    if (!this.examCompleted && this.currentQuestionIndex > 0) {
      const confirmed = window.confirm(
        'Are you sure you want to leave? Your progress will be saved, but you can continue later.'
      )
      if (confirmed) {
        next()
      } else {
        next(false)
      }
    } else {
      next()
    }
  }
}
</script>

<style scoped>
/* Custom styles for exam interface */
</style> 