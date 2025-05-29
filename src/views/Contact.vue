<template>
    <NavigationSection />
    <div class="min-h-screen bg-gray-50 py-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16">
                <h1 class="text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
                <p class="text-xl text-gray-600">Get in touch with our team</p>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <!-- Contact Form -->
                <div class="bg-white rounded-lg shadow-md p-8">
                    <h2 class="text-2xl font-bold text-gray-900 mb-6">Send us a message</h2>
                    <form @submit.prevent="submitForm">
                        <div class="mb-6">
                            <label for="name" class="block text-sm font-medium text-gray-700 mb-2">Name</label>
                            <input 
                                type="text" 
                                id="name" 
                                v-model="form.name"
                                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            >
                        </div>
                        <div class="mb-6">
                            <label for="email" class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                            <input 
                                type="email" 
                                id="email" 
                                v-model="form.email"
                                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            >
                        </div>
                        <div class="mb-6">
                            <label for="subject" class="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                            <input 
                                type="text" 
                                id="subject" 
                                v-model="form.subject"
                                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            >
                        </div>
                        <div class="mb-6">
                            <label for="message" class="block text-sm font-medium text-gray-700 mb-2">Message</label>
                            <textarea 
                                id="message" 
                                v-model="form.message"
                                rows="5"
                                class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            ></textarea>
                        </div>
                        <button 
                            type="submit"
                            class="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition duration-300"
                        >
                            Send Message
                        </button>
                    </form>
                </div>

                <!-- Contact Information -->
                <div class="bg-white rounded-lg shadow-md p-8">
                    <h2 class="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
                    <div class="space-y-6">
                        <div class="flex items-start">
                            <div class="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mr-4 mt-1">
                                <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"></path>
                                </svg>
                            </div>
                            <div>
                                <h3 class="font-semibold text-gray-900">Address</h3>
                                <p class="text-gray-600">123 Business St, Suite 100<br>City, State 12345</p>
                            </div>
                        </div>
                        <div class="flex items-start">
                            <div class="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mr-4 mt-1">
                                <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
                                </svg>
                            </div>
                            <div>
                                <h3 class="font-semibold text-gray-900">Phone</h3>
                                <p class="text-gray-600">+1 (555) 123-4567</p>
                            </div>
                        </div>
                        <div class="flex items-start">
                            <div class="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mr-4 mt-1">
                                <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                                </svg>
                            </div>
                            <div>
                                <h3 class="font-semibold text-gray-900">Email</h3>
                                <p class="text-gray-600">contact@company.com</p>
                            </div>
                        </div>
                        <div class="flex items-start">
                            <div class="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mr-4 mt-1">
                                <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"></path>
                                </svg>
                            </div>
                            <div>
                                <h3 class="font-semibold text-gray-900">Business Hours</h3>
                                <p class="text-gray-600">Monday - Friday: 9:00 AM - 6:00 PM<br>Saturday - Sunday: Closed</p>
                            </div>
                        </div>
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
    name: 'Contact',
    components: {
        NavigationSection,
        Footer
    },
    data() {
        return {
            form: {
                name: '',
                email: '',
                subject: '',
                message: ''
            }
        }
    },
    methods: {
        submitForm() {
            // Handle form submission here
            console.log('Form submitted:', this.form)
            alert('Thank you for your message! We will get back to you soon.')
            
            // Reset form
            this.form = {
                name: '',
                email: '',
                subject: '',
                message: ''
            }
        }
    }
}
</script> 