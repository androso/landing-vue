<template>
    <NavigationSection />
    <div class="min-h-screen bg-gray-50 py-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center">
                <h1 class="text-4xl font-bold text-gray-900 mb-8">About Us</h1>
                <div class="max-w-3xl mx-auto">
                    <p class="text-lg text-gray-600 mb-6">
                        We are dedicated to creating innovative solutions that help people connect, 
                        learn, and grow together. Our mission is to build technology that makes a 
                        positive impact on communities around the world.
                    </p>
                    <p class="text-lg text-gray-600 mb-6">
                        Founded with the vision of bridging gaps between people and technology, 
                        we focus on user-centered design and cutting-edge development practices 
                        to deliver exceptional experiences.
                    </p>
                    <p class="text-lg text-gray-600">
                        Join us on our journey to make technology more accessible, intuitive, 
                        and meaningful for everyone.
                    </p>
                </div>
            </div>
            
            <!-- Team Section -->
            <div class="mt-16">
                <h2 class="text-3xl font-bold text-center text-gray-900 mb-12">Our Team</h2>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div class="bg-white rounded-lg shadow-md p-6 text-center">
                        <img src="@/assets/CEO.jpg" alt="Anibal Andrade" class="w-24 h-24 rounded-full mx-auto mb-4 object-cover">
                        <h3 class="text-xl font-semibold text-gray-900 mb-2">Anibal Andrade</h3>
                        <p class="text-gray-600">CEO & Founder</p>
                    </div>
                    <div class="bg-white rounded-lg shadow-md p-6 text-center">
                        <img src="@/assets/me.jpeg" alt="Isaac Medrano" class="w-24 h-24 rounded-full mx-auto mb-4 object-cover">
                        <h3 class="text-xl font-semibold text-gray-900 mb-2">Isaac Medrano</h3>
                        <p class="text-gray-600">CTO</p>
                    </div>
                    <div class="bg-white rounded-lg shadow-md p-6 text-center">
                        <img src="@/assets/lead-dev.jpg" alt="Mauricio Villalobos" class="w-24 h-24 rounded-full mx-auto mb-4 object-cover">
                        <h3 class="text-xl font-semibold text-gray-900 mb-2">Mauricio Villalobos</h3>
                        <p class="text-gray-600">Lead Developer</p>
                    </div>
                    <div class="bg-white rounded-lg shadow-md p-6 text-center">
                        <img src="@/assets/intern.jpg" alt="Anderson Fuentes" class="w-24 h-24 rounded-full mx-auto mb-4 object-cover">
                        <h3 class="text-xl font-semibold text-gray-900 mb-2">Anderson Fuentes</h3>
                        <p class="text-gray-600">Intern</p>
                    </div>
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
    name: 'About',
    components: {
        NavigationSection,
        Footer
    }
}
</script> 