<template>
  <div class="bg-gray-50 rounded-lg p-6">
    <div class="text-center">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Record your response</h3>
      
      <!-- Microphone permissions -->
      <div v-if="!microphoneAccess && !requestingPermission" class="mb-6">
        <div class="mb-4">
          <svg class="h-12 w-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
          </svg>
          <p class="text-gray-600">Microphone access is required to record your response</p>
        </div>
        <button 
          @click="requestMicrophoneAccess"
          class="btn-primary"
        >
          Allow Microphone Access
        </button>
      </div>

      <!-- Permission requesting -->
      <div v-else-if="requestingPermission" class="mb-6">
        <svg class="animate-pulse h-12 w-12 text-blue-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
        </svg>
        <p class="text-blue-600">Requesting microphone access...</p>
      </div>

      <!-- Recording interface -->
      <div v-else-if="microphoneAccess" class="space-y-6">
        <!-- Recording status -->
        <div class="mb-4">
          <div class="relative">
            <div 
              :class="[
                'w-20 h-20 rounded-full mx-auto flex items-center justify-center transition-all duration-300',
                isRecording 
                  ? 'bg-red-500 animate-pulse' 
                  : 'bg-gray-300 hover:bg-gray-400 cursor-pointer'
              ]"
              @click="toggleRecording"
            >
              <svg v-if="!isRecording" class="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clip-rule="evenodd"></path>
              </svg>
              <svg v-else class="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clip-rule="evenodd"></path>
              </svg>
            </div>
            
            <!-- Recording animation -->
            <div v-if="isRecording" class="absolute inset-0 rounded-full border-4 border-red-500 animate-ping"></div>
          </div>
          
          <p class="mt-3 text-sm text-gray-600">
            {{ isRecording ? 'Recording... Click to stop' : 'Click to start recording' }}
          </p>
        </div>

        <!-- Recording timer -->
        <div v-if="isRecording || recordingTime > 0" class="text-2xl font-mono text-gray-700">
          {{ formatTime(recordingTime) }}
        </div>

        <!-- Audio level indicator -->
        <div v-if="isRecording" class="w-full max-w-xs mx-auto">
          <div class="flex items-center space-x-1">
            <div 
              v-for="i in 10" 
              :key="i"
              :class="[
                'h-4 w-2 rounded-full transition-all duration-100',
                audioLevel * 10 >= i ? 'bg-green-500' : 'bg-gray-300'
              ]"
            ></div>
          </div>
          <p class="text-xs text-gray-500 mt-2">Audio level</p>
        </div>

        <!-- Recording controls -->
        <div v-if="!isRecording && hasRecording" class="flex justify-center space-x-4">
          <button 
            @click="playRecording"
            :disabled="isPlaying"
            class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 transition-colors"
          >
            {{ isPlaying ? 'Playing...' : 'Play Recording' }}
          </button>
          <button 
            @click="deleteRecording"
            class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Delete & Re-record
          </button>
        </div>

        <!-- Recording instructions -->
        <div class="text-sm text-gray-600 bg-blue-50 p-4 rounded-lg">
          <p class="font-medium mb-2">Recording Tips:</p>
          <ul class="text-left space-y-1">
            <li>• Speak clearly and at a normal pace</li>
            <li>• Keep background noise to a minimum</li>
            <li>• Maximum recording length: {{ maxDuration }} seconds</li>
            <li>• You can re-record as many times as needed</li>
          </ul>
        </div>
      </div>

      <!-- Error display -->
      <div v-if="error" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
        <p class="text-red-600 text-sm">{{ error }}</p>
        <button 
          @click="clearError"
          class="text-sm text-red-800 underline mt-1"
        >
          Dismiss
        </button>
      </div>

      <!-- Browser compatibility warning -->
      <div v-if="!isSupported" class="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p class="text-yellow-800 text-sm">
          Your browser doesn't support audio recording. Please use a modern browser like Chrome, Firefox, or Safari.
        </p>
      </div>
    </div>

    <!-- Hidden audio element for playback -->
    <audio 
      ref="playbackAudio"
      @ended="handlePlaybackEnded"
      @error="handlePlaybackError"
    ></audio>
  </div>
</template>

<script>
import examAPI from '../../services/examAPI.js'

export default {
  name: 'AudioRecorder',
  emits: ['recording-complete', 'recording-error', 'recording-status'],
  data() {
    return {
      isSupported: false,
      microphoneAccess: false,
      requestingPermission: false,
      isRecording: false,
      isPlaying: false,
      hasRecording: false,
      recordingTime: 0,
      audioLevel: 0,
      error: null,
      maxDuration: 120, // 2 minutes max
      
      // MediaRecorder related
      mediaRecorder: null,
      audioChunks: [],
      audioBlob: null,
      audioUrl: null,
      
      // Audio analysis
      audioContext: null,
      analyser: null,
      microphone: null,
      
      // Timers
      recordingTimer: null,
      levelTimer: null
    }
  },
  mounted() {
    this.checkBrowserSupport()
  },
  beforeUnmount() {
    this.cleanup()
  },
  methods: {
    checkBrowserSupport() {
      this.isSupported = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder)
      
      if (!this.isSupported) {
        this.error = 'Your browser does not support audio recording'
      }
    },

    async requestMicrophoneAccess() {
      if (!this.isSupported) return

      this.requestingPermission = true
      this.error = null

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          }
        })

        this.microphoneAccess = true
        this.setupAudioContext(stream)
        
        // Stop the initial stream, we'll get a new one when recording
        stream.getTracks().forEach(track => track.stop())

      } catch (error) {
        console.error('Microphone access error:', error)
        
        let errorMessage = 'Failed to access microphone'
        if (error.name === 'NotAllowedError') {
          errorMessage = 'Microphone access was denied. Please allow microphone access and try again.'
        } else if (error.name === 'NotFoundError') {
          errorMessage = 'No microphone found. Please check your audio devices.'
        } else if (error.name === 'NotReadableError') {
          errorMessage = 'Microphone is already in use by another application.'
        }
        
        this.error = errorMessage
        this.$emit('recording-error', errorMessage)
      } finally {
        this.requestingPermission = false
      }
    },

    async setupAudioContext(stream) {
      try {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
        this.analyser = this.audioContext.createAnalyser()
        this.microphone = this.audioContext.createMediaStreamSource(stream)
        
        this.analyser.fftSize = 256
        this.microphone.connect(this.analyser)
      } catch (error) {
        console.warn('Audio analysis setup failed:', error)
        // Don't prevent recording if analysis fails
      }
    },

    async toggleRecording() {
      if (this.isRecording) {
        this.stopRecording()
      } else {
        await this.startRecording()
      }
    },

    async startRecording() {
      if (!this.microphoneAccess || this.isRecording) return

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          }
        })

        // Setup audio level monitoring
        this.setupAudioContext(stream)

        // Create MediaRecorder
        this.mediaRecorder = new MediaRecorder(stream, {
          mimeType: this.getSupportedMimeType()
        })

        this.audioChunks = []
        this.recordingTime = 0

        this.mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            this.audioChunks.push(event.data)
          }
        }

        this.mediaRecorder.onstop = () => {
          this.processRecording()
          stream.getTracks().forEach(track => track.stop())
        }

        this.mediaRecorder.start(100) // Collect data every 100ms
        this.isRecording = true
        this.$emit('recording-status', true)

        // Start timers
        this.startTimers()

      } catch (error) {
        console.error('Recording start error:', error)
        this.error = 'Failed to start recording'
        this.$emit('recording-error', 'Failed to start recording')
      }
    },

    stopRecording() {
      if (!this.isRecording || !this.mediaRecorder) return

      this.mediaRecorder.stop()
      this.isRecording = false
      this.$emit('recording-status', false)
      
      this.stopTimers()
    },

    startTimers() {
      // Recording duration timer
      this.recordingTimer = setInterval(() => {
        this.recordingTime++
        
        // Auto-stop at max duration
        if (this.recordingTime >= this.maxDuration) {
          this.stopRecording()
        }
      }, 1000)

      // Audio level monitoring
      if (this.analyser) {
        this.levelTimer = setInterval(() => {
          this.updateAudioLevel()
        }, 100)
      }
    },

    stopTimers() {
      if (this.recordingTimer) {
        clearInterval(this.recordingTimer)
        this.recordingTimer = null
      }
      
      if (this.levelTimer) {
        clearInterval(this.levelTimer)
        this.levelTimer = null
      }
    },

    updateAudioLevel() {
      if (!this.analyser) return

      const bufferLength = this.analyser.frequencyBinCount
      const dataArray = new Uint8Array(bufferLength)
      this.analyser.getByteFrequencyData(dataArray)

      let sum = 0
      for (let i = 0; i < bufferLength; i++) {
        sum += dataArray[i]
      }
      
      this.audioLevel = (sum / bufferLength) / 255
    },

    async processRecording() {
      if (this.audioChunks.length === 0) {
        this.error = 'No audio data recorded'
        return
      }

      try {
        this.audioBlob = new Blob(this.audioChunks, { 
          type: this.getSupportedMimeType() 
        })

        // Validate file size
        examAPI.validateAudioFile(this.audioBlob)

        this.audioUrl = URL.createObjectURL(this.audioBlob)
        this.hasRecording = true

        // Emit the recording
        this.$emit('recording-complete', this.audioBlob, this.audioUrl)

      } catch (error) {
        console.error('Recording processing error:', error)
        this.error = error.message || 'Failed to process recording'
        this.$emit('recording-error', this.error)
      }
    },

    async playRecording() {
      if (!this.audioUrl || this.isPlaying) return

      try {
        const audio = this.$refs.playbackAudio
        audio.src = this.audioUrl
        
        this.isPlaying = true
        await audio.play()
        
      } catch (error) {
        console.error('Playback error:', error)
        this.error = 'Failed to play recording'
      }
    },

    deleteRecording() {
      if (this.audioUrl) {
        URL.revokeObjectURL(this.audioUrl)
      }
      
      this.audioBlob = null
      this.audioUrl = null
      this.audioChunks = []
      this.hasRecording = false
      this.recordingTime = 0
      this.error = null
    },

    getSupportedMimeType() {
      const types = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/ogg;codecs=opus',
        'audio/ogg',
        'audio/mp4',
        'audio/wav'
      ]

      for (const type of types) {
        if (MediaRecorder.isTypeSupported(type)) {
          return type
        }
      }

      return 'audio/webm' // fallback
    },

    handlePlaybackEnded() {
      this.isPlaying = false
    },

    handlePlaybackError(error) {
      this.isPlaying = false
      console.error('Playback error:', error)
    },

    clearError() {
      this.error = null
    },

    cleanup() {
      this.stopTimers()
      
      if (this.audioUrl) {
        URL.revokeObjectURL(this.audioUrl)
      }
      
      if (this.audioContext) {
        this.audioContext.close()
      }
      
      if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
        this.mediaRecorder.stop()
      }
    },

    formatTime(seconds) {
      const mins = Math.floor(seconds / 60)
      const secs = seconds % 60
      return `${mins}:${secs.toString().padStart(2, '0')}`
    }
  }
}
</script>

<style scoped>
/* Recording button pulse animation */
@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.animate-pulse-custom {
  animation: pulse 2s infinite;
}

/* Audio level bars animation */
.audio-level-bar {
  transition: height 0.1s ease-out;
}
</style> 