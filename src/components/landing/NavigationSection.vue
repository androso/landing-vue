<template>
 <nav class="container mx-auto px-6 py-4">
      <div class="flex justify-between items-center">
          <div class="flex items-center">
              <router-link to="/" class="flex items-center">
                  <div class="mr-2 p-2 rounded-full bg-primary-light">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24"
                          stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                  </div>
                  <span class="text-xl font-bold text-primary">mentarie</span>
              </router-link>
          </div>
          <div class="hidden lg:flex items-center space-x-8">
              <router-link to="/" class="text-gray-600 hover:text-primary transition-colors">Home</router-link>
              <router-link to="/about" class="text-gray-600 hover:text-primary transition-colors">About</router-link>
              <router-link to="/pricing" class="text-gray-600 hover:text-primary transition-colors">Pricing</router-link>
              <router-link to="/faq" class="text-gray-600 hover:text-primary transition-colors">FAQ</router-link>
              <router-link to="/contact" class="text-gray-600 hover:text-primary transition-colors">Contact</router-link>
          </div>
          <div class="ml-0 lg:ml-8">
              <router-link to="/contact" class="btn-primary">Get Started</router-link>
          </div>
      </div>
  </nav>
</template>

<script>
export default {
  name: 'NavigationSection'
}
</script>

<style scoped>
.router-link-active {
  @apply text-primary font-semibold;
}
</style>