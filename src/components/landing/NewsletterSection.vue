<template>
  <div class="bg-primary-light py-16">
    <div class="container mx-auto px-6">
      <div class="max-w-2xl mx-auto text-center">
        <h2 class="text-3xl font-bold mb-4">Stay Updated</h2>
        <p class="text-gray-600 mb-8">Subscribe to our newsletter to get notified when we launch and receive language learning tips.</p>
        <form @submit.prevent="handleSubmit" class="flex flex-col max-w-xl mx-auto gap-4">
          <input 
            type="text" 
            v-model="name"
            placeholder="Enter your name"
            class="px-6 py-3 rounded-full border border-gray-300 focus:outline-none focus:border-primary"
            required
          />
          <input 
            type="email" 
            v-model="email"
            placeholder="Enter your email"
            class="px-6 py-3 rounded-full border border-gray-300 focus:outline-none focus:border-primary"
            required
          />
          <button type="submit" class="btn-primary whitespace-nowrap">
            {{ loading ? 'Subscribing...' : 'Subscribe Now' }}
          </button>
        </form>
        <p v-if="message" :class="['mt-4', {'text-green-600': success, 'text-red-600': !success}]">
          {{ message }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const name = ref('')
const email = ref('')
const loading = ref(false)
const message = ref('')
const success = ref(false)

const handleSubmit = async () => {
  loading.value = true
  message.value = ''

  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000))

  success.value = true
  message.value = 'Thanks for subscribing! We\'ll keep you posted.'
  email.value = ''

  loading.value = false
}
</script>