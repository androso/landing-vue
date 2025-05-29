<template>
    <NavigationSection />
    <HeroSection />
    <FeaturesSection/>
    <HowItWorksSection />
    <TestimonialsSection />
    <DownloadSection />
    <NewsletterSection />
    <Footer />
</template>

<script>
    import NavigationSection from "../components/landing/NavigationSection.vue"
    import HeroSection from "../components/landing/HeroSection.vue"
    import FeaturesSection from "../components/landing/FeaturesSection.vue"
    import HowItWorks from "../components/landing/HowItWorks.vue"
    import TestimonialsSection from "../components/landing/TestimonialsSection.vue"
    import Footer from "../components/landing/Footer.vue"    
    import DownloadSection from "../components/landing/DownloadSection.vue"
    import NewsletterSection from '../components/landing/NewsletterSection.vue'

    export default {
        name: 'Home',
        components: {
            NavigationSection,
            HeroSection,
            FeaturesSection,
            HowItWorksSection: HowItWorks,
            TestimonialsSection,
            Footer,
            DownloadSection,
            NewsletterSection
        }
    }
</script> 