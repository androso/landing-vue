<script setup>
import { ref } from 'vue'

const openedFaq = ref(null)

const toggleFaq = (index) => {
  if (openedFaq.value === index) {
    openedFaq.value = null
  } else {
    openedFaq.value = index
  }
}

const faqItems = [
  {
    question: "How is Mentarie different from other language learning apps?",
    answer: "Mentarie focuses on conversation first, teaching you how to speak naturally in real-world contexts. Instead of memorizing isolated vocabulary and grammar rules, you learn through guided dialogues that progressively increase in complexity."
  },
  {
    question: "Which languages does Mentarie support?",
    answer: "Currently, Mentarie supports Spanish, French, German, Italian, Portuguese, Japanese, and Mandarin Chinese. We're constantly adding more languages based on user demand."
  },
  {
    question: "Do I need any prior knowledge to use Mentarie?",
    answer: "While Mentarie is designed for learners with some basic vocabulary knowledge, we offer introductory chapters to help complete beginners build a foundation before diving into conversations."
  },
  {
    question: "How does grammar learning work in Mentarie?",
    answer: "Grammar is taught contextually within conversations. As you progress, you'll notice patterns naturally, and the app highlights key structures for you to save and practice. This approach helps you internalize grammar rules through usage rather than memorization."
  },
  {
    question: "Can I use Mentarie offline?",
    answer: "Yes! You can download conversation packs for offline use. While some advanced features require an internet connection, core learning functionality is available offline."
  }
]
</script>

<template>
  <section id="faq" class="py-20">
    <div class="container mx-auto px-6">
      <div class="text-center mb-16">
        <h2 class="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
        <p class="max-w-2xl mx-auto text-gray-600">Find answers to common questions about Mentarie.</p>
      </div>

      <div class="max-w-3xl mx-auto space-y-6">
        <div v-for="(faq, index) in faqItems" :key="index" class="bg-white rounded-xl shadow-sm p-6">
          <button class="flex justify-between items-center w-full focus:outline-none" @click="toggleFaq(index)">
            <h3 class="font-bold text-lg text-left">{{ faq.question }}</h3>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary transform transition-transform duration-200"
              :class="{ 'rotate-180': openedFaq === index }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <div class="mt-3" :class="{ 'hidden': openedFaq !== index }">
            <p class="text-gray-600">{{ faq.answer }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>