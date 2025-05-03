<template>
    <NavigationSection />
    <HeroSection />
    <FeaturesSection/>
    <HowItWorksSection />
    <TestimonialsSection />
    <PricingSection />
    <DownloadSection />
    <FAQSection />
    <Footer />
</template>

<style>
@import './assets/main.css';
</style>
<script>
    import NavigationSection from "./components/landing/NavigationSection.vue"
    import HeroSection from "./components/landing/HeroSection.vue"
    import FeaturesSection from "./components/landing/FeaturesSection.vue"
    import HowItWorks from "./components/landing/HowItWorks.vue"
    import TestimonialsSection from "./components/landing/TestimonialsSection.vue"
    import PricingSection from "./components/landing/PricingSection.vue"
    import Footer from "./components/landing/Footer.vue"    
    import DownloadSection from "./components/landing/DownloadSection.vue";
    import FAQSection from './components/landing/FAQSection.vue'
    
    export default {
        name: 'App',
        components: {
            NavigationSection,
            HeroSection,
            FeaturesSection,
            HowItWorksSection: HowItWorks,
            TestimonialsSection,
            PricingSection,
            Footer,
            DownloadSection
        }
    }
</script>