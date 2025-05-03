<template>
 <nav class="container mx-auto px-6 py-4">
      <div class="flex justify-between items-center">
          <div class="flex items-center">
              <div class="mr-2 p-2 rounded-full bg-primary-light">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
              </div>
              <span class="text-xl font-bold text-primary">mentarie</span>
          </div>
          <div class="hidden lg:flex items-center space-x-8">
              <a href="#features" class="text-gray-600 hover:text-primary">Features</a>
              <a href="#how-it-works" class="text-gray-600 hover:text-primary">How It Works</a>
              <a href="#pricing" class="text-gray-600 hover:text-primary">Pricing</a>
              <a href="#testimonials" class="text-gray-600 hover:text-primary">Testimonials</a>
          </div>
          <div class="ml-0 lg:ml-8">
              <a href="#download" class="btn-primary">Get Started</a>
          </div>
      </div>
  </nav>
</template>

<script>
export default {
  name: 'NavigationSection'
}
</script>