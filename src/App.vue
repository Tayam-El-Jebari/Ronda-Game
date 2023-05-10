<template>
  <navigation />
  <router-view />
</template>

<script>
import Navigation from './components/Navigation.vue'
import { useUserAuthStore } from './stores/authstore.js'


export default {
  name: "App",
  components: {
    Navigation
  }
};
</script>

<style>
</style>
