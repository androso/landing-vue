
<script setup>
import { ref, computed } from 'vue'

const openedFaq = ref(null)
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = 5

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
  },
  {
    question: "How often are new lessons added?",
    answer: "We add new conversation scenarios and lessons weekly, ensuring fresh content for continuous learning and practice."
  },
  {
    question: "Is there a community feature?",
    answer: "Yes, Mentarie has a vibrant community where learners can practice with native speakers, join language exchange groups, and participate in themed conversation challenges."
  },
  {
    question: "What's the recommended study time per day?",
    answer: "We recommend 15-30 minutes daily for optimal progress. The app is designed for flexible learning, so you can adjust based on your schedule."
  },
  {
    question: "Are there different difficulty levels?",
    answer: "Yes, we offer beginner, intermediate, and advanced levels for each language, with adaptive learning that adjusts to your progress."
  },
  {
    question: "How does the AI conversation partner work?",
    answer: "Our AI uses natural language processing to engage in realistic conversations, adapting to your level and providing instant feedback on pronunciation and grammar."
  },
]

const filteredFAQs = computed(() => {
  return faqItems.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const totalPages = computed(() => Math.ceil(filteredFAQs.value.length / itemsPerPage))

const paginatedFAQs = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredFAQs.value.slice(start, end)
})

const goToPage = (page) => {
  currentPage.value = page
  openedFaq.value = null
}
</script>

<template>
  <section id="faq" class="py-20">
    <div class="container mx-auto px-6">
      <div class="text-center mb-16">
        <h2 class="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
        <p class="max-w-2xl mx-auto text-gray-600 mb-8">Find answers to common questions about Mentarie.</p>
        
        <div class="max-w-xl mx-auto mb-12">
          <input 
            type="text" 
            v-model="searchQuery"
            placeholder="Search questions..."
            class="w-full px-6 py-3 rounded-full border border-gray-300 focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      <div class="max-w-3xl mx-auto space-y-6">
        <div v-for="(faq, index) in paginatedFAQs" :key="index" class="bg-white rounded-xl shadow-sm p-6">
          <button class="flex justify-between items-center w-full focus:outline-none" @click="toggleFaq(index)">
            <h3 class="font-bold text-lg text-left">{{ faq.question }}</h3>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary transform transition-transform duration-200"
              v-bind:class="{ 'rotate-180': openedFaq === index }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <div class="mt-3" v-bind:class="{ 'hidden': openedFaq !== index }">
            <p class="text-gray-600">{{ faq.answer }}</p>
          </div>
        </div>

        <!-- Pagination -->
        <div class="flex justify-center space-x-2 mt-8" v-if="totalPages > 1">
          <button 
            v-for="page in totalPages" 
            :key="page"
            @click="goToPage(page)"
            :class="[
              'px-4 py-2 rounded-lg',
              currentPage === page 
                ? 'bg-primary text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            ]"
          >
            {{ page }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>
