<!-- App.vue -->
<template>
  <div class="min-h-screen">
    <!-- Force header class reset when shown after dashboard logout -->
    <Header v-if="!isAdminRoute" :key="navigationCounter" />
    <router-view />
    <Footer v-if="!isAdminRoute" />
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import Header from '@/components/common/Header.vue'
import Footer from '@/components/common/Footer.vue'
import { useAuthStore } from '@/stores/authStore'

const route = useRoute()
const authStore = useAuthStore()
const navigationCounter = ref(0)

// Compute whether current route is an admin/dashboard route
const isAdminRoute = computed(() => {
  const path = route.path.toLowerCase()
  return path.includes('dashboard') || path.includes('admin')
})

// Watch for route changes, especially when moving from dashboard to home
watch(
  () => route.path,
  (newPath) => {
    if (!newPath.toLowerCase().includes('dashboard') && !newPath.toLowerCase().includes('admin')) {
      // Increment the counter to force a header refresh when returning to home
      navigationCounter.value++
    }
  }
)

// Also listen for logout events to ensure header resets
watch(
  () => authStore.isAuthenticated,
  (isAuthenticated) => {
    if (!isAuthenticated) {
      // Force header refresh after logout
      setTimeout(() => {
        navigationCounter.value++
      }, 100) // Small delay to ensure all transitions complete
    }
  }
)
</script>

<style>
html {
  scroll-behavior: smooth;
}

/* Force override any problematic header styles that might persist */
body:not(.admin-view) header {
  height: auto !important;
  max-height: none !important;
  min-height: auto !important;
}
</style>
