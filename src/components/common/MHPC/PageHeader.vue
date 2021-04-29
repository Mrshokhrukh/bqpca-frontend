<template>
  <div
    class="relative overflow-hidden backdrop-blur-sm bg-white/80 rounded-2xl p-6 sm:p-8 mb-10 shadow-lg border border-indigo-100"
  >
    <div class="absolute -top-16 -right-16 w-40 h-40 bg-indigo-100 rounded-full opacity-30 blur-xl"></div>
    <div class="absolute -bottom-12 -left-12 w-32 h-32 bg-blue-100 rounded-full opacity-40 blur-lg"></div>

    <div class="relative z-10">
      <div class="flex justify-center mb-5">
        <div class="bg-gradient-to-r from-indigo-500 to-blue-500 rounded-xl p-1 shadow-md">
          <div class="bg-white rounded-lg p-2.5">
            <!-- Icon Slot: Parent component will provide the icon here -->
            <slot name="icon">
              <!-- Optional: Default icon if none provided -->
              <!-- <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6 text-indigo-600"><circle cx="12" cy="12" r="10"></circle></svg> -->
            </slot>
          </div>
        </div>
      </div>

      <h2 class="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-blue-600 mb-3 text-center">
        {{ title }}
      </h2>
      <p class="text-gray-600 text-center max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
        {{ subtitle }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue'

defineProps({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    required: true,
  },
})
</script>

<style scoped>
/* No component-specific styles needed as Tailwind covers everything */
</style>
