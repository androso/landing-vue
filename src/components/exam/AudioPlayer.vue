<template>
  <div class="bg-gray-50 rounded-lg p-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-medium text-gray-900">Listen to the audio</h3>
      <div class="flex items-center space-x-2">
        <button
          @click="togglePlayPause"
          :disabled="!audioLoaded || loading"
          class="p-2 rounded-full bg-primary text-white hover:bg-primary-dark disabled:bg-gray-400 transition-colors"
        >
          <svg v-if="loading" class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <svg v-else-if="isPlaying" class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"></path>
          </svg>
          <svg v-else class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"></path>
          </svg>
        </button>
        
        <!-- Replay button -->
        <button
          @click="replay"
          :disabled="!audioLoaded"
          class="p-2 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 transition-colors"
          title="Replay from beginning"
        >
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
        </button>

        <!-- Volume control -->
        <div class="flex items-center space-x-2">
          <svg class="h-4 w-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L4.6 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.6l3.783-3.793zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 11-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clip-rule="evenodd"></path>
          </svg>
          <input
            v-model="volume"
            type="range"
            min="0"
            max="1"
            step="0.1"
            class="w-16 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            @input="updateVolume"
          >
        </div>
      </div>
    </div>

    <!-- Progress Bar -->
    <div class="mb-4">
      <div class="flex items-center justify-between text-sm text-gray-500 mb-2">
        <span>{{ formatTime(currentTime) }}</span>
        <span>{{ formatTime(duration) }}</span>
      </div>
      <div 
        class="w-full bg-gray-200 rounded-full h-2 cursor-pointer"
        @click="seekTo"
        ref="progressBar"
      >
        <div 
          class="bg-primary h-2 rounded-full transition-all duration-100"
          :style="{ width: `${progress}%` }"
        ></div>
      </div>
    </div>

    <!-- Playback Speed -->
    <div class="flex items-center justify-between">
      <div class="text-sm text-gray-600">
        <span v-if="playCount > 0">Played {{ playCount }} time{{ playCount !== 1 ? 's' : '' }}</span>
        <span v-else>Click play to listen</span>
      </div>
      <div class="flex items-center space-x-2">
        <label class="text-sm text-gray-600">Speed:</label>
        <select 
          v-model="playbackRate" 
          @change="updatePlaybackRate"
          class="text-sm border border-gray-300 rounded px-2 py-1"
        >
          <option value="0.5">0.5x</option>
          <option value="0.75">0.75x</option>
          <option value="1">1x</option>
          <option value="1.25">1.25x</option>
          <option value="1.5">1.5x</option>
        </select>
      </div>
    </div>

    <!-- Hidden audio element -->
    <audio
      ref="audioElement"
      :src="streamingUrl"
      preload="metadata"
      @loadstart="handleLoadStart"
      @loadeddata="handleLoadedData"
      @loadedmetadata="handleLoadedMetadata"
      @canplay="handleCanPlay"
      @play="handlePlay"
      @pause="handlePause"
      @ended="handleEnded"
      @timeupdate="handleTimeUpdate"
      @error="handleError"
      @progress="handleProgress"
    ></audio>

    <!-- Error display -->
    <div v-if="error" class="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
      <p class="text-red-600 text-sm">{{ error }}</p>
      <button @click="retryLoad" class="text-sm text-red-800 underline mt-1">Try again</button>
    </div>

    <!-- Loading indicator -->
    <div v-if="loading && !error" class="mt-4 text-center">
      <div class="inline-flex items-center text-sm text-gray-600">
        <svg class="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Loading audio...
      </div>
    </div>
  </div>
</template>

<script>
import examAPI from '../../services/examAPI.js'

export default {
  name: 'AudioPlayer',
  props: {
    audioUrl: {
      type: String,
      required: true
    }
  },
  emits: ['audio-loaded', 'audio-error'],
  data() {
    return {
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      volume: 1,
      playbackRate: 1,
      loading: true,
      audioLoaded: false,
      error: null,
      playCount: 0,
      streamingUrl: ''
    }
  },
  computed: {
    progress() {
      if (this.duration === 0) return 0
      return (this.currentTime / this.duration) * 100
    }
  },
  mounted() {
    this.initializeAudio()
  },
  beforeUnmount() {
    this.cleanup()
  },
  methods: {
    initializeAudio() {
      // Create optimized Cloudinary URL for audio streaming
      this.streamingUrl = examAPI.createAudioURL(this.audioUrl)
      
      // Start loading
      this.loading = true
      this.error = null
      
      // The audio element will start loading automatically due to preload="metadata"
    },

    togglePlayPause() {
      if (!this.audioLoaded) return

      const audio = this.$refs.audioElement
      if (this.isPlaying) {
        audio.pause()
      } else {
        audio.play().catch(error => {
          this.handleError(error)
        })
      }
    },

    replay() {
      if (!this.audioLoaded) return

      const audio = this.$refs.audioElement
      audio.currentTime = 0
      if (!this.isPlaying) {
        audio.play().catch(error => {
          this.handleError(error)
        })
      }
    },

    seekTo(event) {
      if (!this.audioLoaded) return

      const progressBar = this.$refs.progressBar
      const clickX = event.offsetX
      const width = progressBar.offsetWidth
      const percentage = clickX / width
      const audio = this.$refs.audioElement
      
      audio.currentTime = percentage * this.duration
    },

    updateVolume() {
      const audio = this.$refs.audioElement
      if (audio) {
        audio.volume = this.volume
      }
    },

    updatePlaybackRate() {
      const audio = this.$refs.audioElement
      if (audio) {
        audio.playbackRate = parseFloat(this.playbackRate)
      }
    },

    retryLoad() {
      this.error = null
      this.loading = true
      this.audioLoaded = false
      
      const audio = this.$refs.audioElement
      audio.load() // Reload the audio
    },

    cleanup() {
      const audio = this.$refs.audioElement
      if (audio) {
        audio.pause()
        audio.src = ''
        audio.load()
      }
    },

    formatTime(seconds) {
      if (isNaN(seconds) || seconds === 0) return '0:00'
      
      const mins = Math.floor(seconds / 60)
      const secs = Math.floor(seconds % 60)
      return `${mins}:${secs.toString().padStart(2, '0')}`
    },

    // Audio event handlers
    handleLoadStart() {
      this.loading = true
    },

    handleLoadedData() {
      this.loading = false
    },

    handleLoadedMetadata() {
      const audio = this.$refs.audioElement
      this.duration = audio.duration || 0
      this.updateVolume()
      this.updatePlaybackRate()
    },

    handleCanPlay() {
      this.loading = false
      this.audioLoaded = true
      this.error = null
      this.$emit('audio-loaded')
    },

    handlePlay() {
      this.isPlaying = true
      if (this.currentTime === 0) {
        this.playCount++
      }
    },

    handlePause() {
      this.isPlaying = false
    },

    handleEnded() {
      this.isPlaying = false
      // Don't auto-replay, let user control playback
    },

    handleTimeUpdate() {
      const audio = this.$refs.audioElement
      this.currentTime = audio.currentTime || 0
    },

    handleError(error) {
      this.loading = false
      this.audioLoaded = false
      this.isPlaying = false
      
      let errorMessage = 'Failed to load audio'
      
      if (error && error.target) {
        // HTML5 audio error
        const audioError = error.target.error
        if (audioError) {
          switch (audioError.code) {
            case audioError.MEDIA_ERR_ABORTED:
              errorMessage = 'Audio loading was aborted'
              break
            case audioError.MEDIA_ERR_NETWORK:
              errorMessage = 'Network error occurred while loading audio'
              break
            case audioError.MEDIA_ERR_DECODE:
              errorMessage = 'Audio file is corrupted or unsupported'
              break
            case audioError.MEDIA_ERR_SRC_NOT_SUPPORTED:
              errorMessage = 'Audio format not supported'
              break
            default:
              errorMessage = 'Unknown audio error occurred'
          }
        }
      } else if (typeof error === 'string') {
        errorMessage = error
      }
      
      this.error = errorMessage
      console.error('Audio error:', error)
      this.$emit('audio-error', errorMessage)
    },

    handleProgress() {
      // Handle buffering progress if needed
      const audio = this.$refs.audioElement
      if (audio.buffered.length > 0) {
        // Audio is buffering/loading
      }
    }
  },

  watch: {
    audioUrl: {
      handler() {
        this.initializeAudio()
      },
      immediate: true
    }
  }
}
</script>

<style scoped>
/* Custom range slider styles */
input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
}

input[type="range"]::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #3b82f6;
  cursor: pointer;
  border: none;
}
</style> 