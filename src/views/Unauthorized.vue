<!-- eslint-disable vue/multi-word-component-names -->
<!-- src/views/Unauthorized.vue -->
<template>
  <div class="min-h-screen bg-slate-50 flex items-center justify-center">
    <!-- Unauthorized Section with Animated Background -->
    <div class="relative bg-gradient-to-r from-slate-900 to-slate-800 overflow-hidden w-full py-24">
      <!-- Decorative circles -->
      <div class="absolute inset-0">
        <div class="absolute -top-20 -right-20 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl"></div>
        <div class="absolute -bottom-32 -left-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div class="text-center">
          <!-- Unauthorized Content -->
          <div class="space-y-2 mb-6">
            <div
              class="inline-flex items-center px-3 py-1 rounded-full border border-blue-400/30 bg-blue-400/10 text-blue-200">
              <span class="text-sm">Access Denied</span>
            </div>
          </div>
          <h1 class="text-4xl font-serif font-bold tracking-tight sm:text-5xl lg:text-6xl mb-6 text-white">
            <span class="block">Unauthorized Access</span>
          </h1>
          <p class="mt-6 text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
            You do not have permission to access this page. Please contact the administrator if you believe this is an
            error.
          </p>
          <div class="mt-10 flex justify-center gap-4">
            <router-link to="/#services"
              class="group inline-flex items-center px-6 py-3 bg-white text-slate-900 rounded-lg hover:bg-slate-100 transition-all shadow-lg hover:shadow-xl">
              <span>Return to Login</span>
              <ChevronRight class="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
            </router-link>
            <router-link to="/#contact"
              class="inline-flex items-center px-6 py-3 border-2 border-white text-white rounded-lg hover:bg-white/10 transition-colors">
              Contact Admin
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ChevronRight } from 'lucide-vue-next';
</script>

<style scoped>
/* Additional custom styles can be added here if needed */
</style>
