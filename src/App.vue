<template>
    <router-view />
    <ExitIntentPopup />
</template>

<style>
@import './assets/main.css';
</style>

<script>
import ExitIntentPopup from './components/ExitIntentPopup.vue'

export default {
    name: 'App',
    components: {
        ExitIntentPopup
    }
}
</script>