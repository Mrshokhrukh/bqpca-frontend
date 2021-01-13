<!-- App.vue -->
<template>
  <div class="min-h-screen">
    <Header v-if="!isAdminRoute" />
    <router-view />
    <Footer v-if="!isAdminRoute" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Header from '@/components/common/Header.vue'
import Footer from '@/components/common/Footer.vue'

const route = useRoute()

// Compute whether current route is an admin/dashboard route
const isAdminRoute = computed(() => {
  const path = route.path.toLowerCase()
  return path.includes('dashboard') || path.includes('admin')
})
</script>

<style scoped>
html {
  scroll-behavior: smooth;
}
</style>
