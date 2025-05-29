<template>
    <NavigationSection />
    <div class="py-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-12">
                <h1 class="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
                <p class="text-xl text-gray-600">Find answers to common questions</p>
            </div>
        </div>
        <FAQSection />
    </div>
    <Footer />
</template>

<script>
import NavigationSection from "../components/landing/NavigationSection.vue"
import FAQSection from "../components/landing/FAQSection.vue"
import Footer from "../components/landing/Footer.vue"

export default {
    name: 'FAQ',
    components: {
        NavigationSection,
        FAQSection,
        Footer
    }
}
</script> 