<template>
  <div class="bg-white rounded-lg shadow-lg p-8">
    <!-- Question Header -->
    <div class="mb-6">
      <div class="flex justify-between items-center mb-4">
        <span class="text-sm font-medium text-primary bg-primary-light px-3 py-1 rounded-full">
          {{ getQuestionTypeLabel(question.type) }}
        </span>
        <span class="text-sm text-gray-500">
          Question {{ questionNumber }} of {{ totalQuestions }}
        </span>
      </div>
      <h2 class="text-xl font-semibold text-gray-900">{{ question.content }}</h2>
    </div>

    <!-- Audio Player for Listening Questions -->
    <div v-if="question.type === 'listening' && question.audioUrl" class="mb-6">
      <AudioPlayer 
        :audioUrl="question.audioUrl"
        @audio-loaded="handleAudioLoaded"
        @audio-error="handleAudioError"
      />
    </div>

    <!-- Answer Input Section -->
    <div class="mb-8">
      <!-- Multiple Choice (Grammar/Reading) -->
      <div v-if="question.options && question.options.length > 0" class="space-y-3">
        <div 
          v-for="(option, index) in question.options"
          :key="index"
          class="flex items-center"
        >
          <input
            :id="`option-${index}`"
            v-model="selectedAnswer"
            :value="option"
            type="radio"
            :name="`question-${question._id}`"
            class="h-4 w-4 text-primary focus:ring-primary border-gray-300"
          />
          <label 
            :for="`option-${index}`"
            class="ml-3 text-gray-700 cursor-pointer"
          >
            {{ option }}
          </label>
        </div>
      </div>

      <!-- Text Input (Writing) -->
      <div v-else-if="question.type === 'writing'" class="space-y-4">
        <textarea
          v-model="textAnswer"
          :placeholder="getWritingPlaceholder()"
          rows="6"
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
        ></textarea>
        <div class="text-sm text-gray-500">
          Minimum 50 words. Current: {{ wordCount }} words
        </div>
      </div>

      <!-- Audio Recording (Listening) -->
      <div v-else-if="question.type === 'listening'" class="space-y-4">
        <AudioRecorder 
          @recording-complete="handleAudioRecording"
          @recording-error="handleRecordingError"
          :isRecording="isRecording"
          @recording-status="isRecording = $event"
        />
        
        <!-- Show recorded audio if available -->
        <div v-if="recordedAudioBlob" class="p-4 bg-gray-50 rounded-lg">
          <div class="flex items-center justify-between">
            <span class="text-sm text-gray-600">Recording ready</span>
            <button 
              @click="clearRecording"
              class="text-sm text-red-600 hover:text-red-800"
            >
              Clear
            </button>
          </div>
          <audio 
            :src="recordedAudioUrl" 
            controls 
            class="w-full mt-2"
          ></audio>
        </div>
      </div>

      <!-- Reading with text input -->
      <div v-else-if="question.type === 'reading'" class="space-y-4">
        <textarea
          v-model="textAnswer"
          placeholder="Please provide your answer based on the reading passage above..."
          rows="4"
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
        ></textarea>
      </div>
    </div>

    <!-- Feedback Display (if answer already submitted) -->
    <div v-if="showFeedback && submittedResponse" class="mb-6 p-4 rounded-lg border-l-4" :class="getFeedbackClass()">
      <div class="flex items-center justify-between mb-2">
        <span class="font-medium">Score: {{ submittedResponse.score }}/10</span>
        <span class="text-sm" :class="submittedResponse.isCorrect ? 'text-green-600' : 'text-red-600'">
          {{ submittedResponse.isCorrect ? 'Correct' : 'Incorrect' }}
        </span>
      </div>
      <p class="text-sm text-gray-700">{{ submittedResponse.feedback }}</p>
    </div>

    <!-- Action Buttons -->
    <div class="flex justify-between">
      <div>
        <!-- Previous button (if not first question) -->
        <button 
          v-if="questionNumber > 1"
          @click="$emit('previous-question')"
          class="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Previous
        </button>
      </div>

      <div class="flex space-x-4">
        <!-- Submit button -->
        <button
          @click="submitAnswer"
          :class="[
            'px-6 py-2 rounded-lg font-medium transition-colors',
            canSubmit && submitting
              ? 'bg-primary text-white hover:bg-primary-dark'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          ]"
        >
          <span v-if="submitting" class="flex items-center">
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Submitting...
          </span>
          <span v-else>
            {{ submittedResponse ? 'Submitted' : 'Submit Answer' }}
          </span>
        </button>

        <!-- Next button (after submission) -->
        <button
          v-if="submittedResponse"
          @click="$emit('next-question')"
          class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          {{ questionNumber === totalQuestions ? 'Finish Exam' : 'Next Question' }}
        </button>
      </div>
    </div>

    <!-- Error Display -->
    <div v-if="error" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
      <p class="text-red-600 text-sm">{{ error }}</p>
    </div>
  </div>
</template>

<script>
import examAPI from '../../services/examAPI.js'
import AudioPlayer from './AudioPlayer.vue'
import AudioRecorder from './AudioRecorder.vue'

export default {
  name: 'QuestionComponent',
  components: {
    AudioPlayer,
    AudioRecorder
  },
  props: {
    question: {
      type: Object,
      required: true
    },
    questionNumber: {
      type: Number,
      required: true
    },
    totalQuestions: {
      type: Number,
      required: true
    },
    sessionId: {
      type: String,
      required: true
    }
  },
  emits: ['answer-submitted', 'next-question', 'previous-question'],
  data() {
    return {
      selectedAnswer: '',
      textAnswer: '',
      recordedAudioBlob: null,
      recordedAudioUrl: null,
      submitting: false,
      submittedResponse: null,
      showFeedback: false,
      error: null,
      isRecording: false
    }
  },
  computed: {
    canSubmit() {
      if (this.submittedResponse) return false // Already submitted
      
      switch (this.question.type) {
        case 'grammar':
        case 'reading':
          return this.selectedAnswer.length > 0 || this.textAnswer.trim().length > 0
        case 'writing':
          return this.textAnswer.trim().length >= 50 // Minimum word requirement
        case 'listening':
          //return this.recordedAudioBlob !== null
          return true
        default:
          return false
      }
    },
    wordCount() {
      return this.textAnswer.trim().split(/\s+/).filter(word => word.length > 0).length
    }
  },
  methods: {
    async submitAnswer() {
      if (!this.canSubmit || this.submitting) return

      this.submitting = true
      this.error = null

      try {
        let response
        const timeSpent = examAPI.getQuestionTimeSpent(this.questionNumber)

        if (this.question.type === 'listening' && this.recordedAudioBlob) {
          // Submit audio file
          response = await examAPI.submitAudioAnswer(
            this.sessionId,
            this.question._id,
            this.recordedAudioBlob,
            this.questionNumber,
            timeSpent
          )
        } else {
          // Submit text answer
          const answer = this.selectedAnswer || this.textAnswer.trim()
          response = await examAPI.submitAnswer(
            this.sessionId,
            this.question._id,
            answer,
            this.questionNumber,
            timeSpent
          )
        }

        this.submittedResponse = response
        this.showFeedback = true
        this.$emit('answer-submitted', response)

      } catch (error) {
        this.error = error.message || 'Failed to submit answer'
        console.error('Failed to submit answer:', error)
      } finally {
        this.submitting = false
      }
    },

    handleAudioRecording(audioBlob, audioUrl) {
      this.recordedAudioBlob = audioBlob
      this.recordedAudioUrl = audioUrl
    },

    handleRecordingError(error) {
      this.error = `Recording error: ${error}`
    },

    clearRecording() {
      this.recordedAudioBlob = null
      this.recordedAudioUrl = null
    },

    handleAudioLoaded() {
      console.log('Audio loaded successfully')
    },

    handleAudioError(error) {
      this.error = `Audio playback error: ${error}`
    },

    getQuestionTypeLabel(type) {
      const labels = {
        grammar: 'Grammar',
        writing: 'Writing',
        listening: 'Listening',
        reading: 'Reading Comprehension'
      }
      return labels[type] || type
    },

    getWritingPlaceholder() {
      return 'Please write your response here. Be sure to use proper grammar and express your ideas clearly. Minimum 50 words required.'
    },

    getFeedbackClass() {
      if (!this.submittedResponse) return ''
      
      if (this.submittedResponse.isCorrect) {
        return 'border-green-400 bg-green-50'
      } else {
        return 'border-yellow-400 bg-yellow-50'
      }
    }
  },

  watch: {
    question: {
      handler() {
        // Reset component state when question changes
        this.selectedAnswer = ''
        this.textAnswer = ''
        this.recordedAudioBlob = null
        this.recordedAudioUrl = null
        this.submittedResponse = null
        this.showFeedback = false
        this.error = null
      },
      immediate: true
    }
  }
}
</script>

<style scoped>
/* Custom styles for question component */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style> 