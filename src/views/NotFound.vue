<template>
    <NavigationSection />
    <div class="min-h-screen bg-gray-50 flex items-center justify-center py-16">
        <div class="max-w-md mx-auto text-center">
            <div class="mb-8">
                <h1 class="text-9xl font-bold text-gray-300">404</h1>
            </div>
            <h2 class="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h2>
            <p class="text-lg text-gray-600 mb-8">
                Sorry, the page you are looking for doesn't exist or has been moved.
            </p>
            <div class="space-y-4">
                <router-link 
                    to="/" 
                    class="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition duration-300"
                >
                    Go Back Home
                </router-link>
                <div>
                    <button 
                        @click="$router.go(-1)"
                        class="text-blue-600 hover:text-blue-700 underline"
                    >
                        Go Back to Previous Page
                    </button>
                </div>
            </div>
        </div>
    </div>
    <Footer />
</template>

<script>
import NavigationSection from "../components/landing/NavigationSection.vue"
import Footer from "../components/landing/Footer.vue"

export default {
    name: 'NotFound',
    components: {
        NavigationSection,
        Footer
    }
}
</script> 