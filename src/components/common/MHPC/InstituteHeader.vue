<template>
  <div class="header-container bg-white rounded-2xl p-8 mb-12 relative overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300"
       @mousemove="handleMouseMove"
       :class="{ 'header-visible': isVisible }">

    <!-- Subtle design elements -->
    <div class="absolute inset-0 pointer-events-none">
      <!-- Subtle corner accent -->
      <div class="absolute top-0 right-0 w-24 h-24 opacity-10">
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="100" cy="0" r="80" fill="url(#paint0_radial)" />
          <defs>
            <radialGradient id="paint0_radial" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse"
                            gradientTransform="translate(100 0) rotate(90) scale(100)">
              <stop stop-color="#818CF8" />
              <stop offset="1" stop-color="#818CF8" stop-opacity="0" />
            </radialGradient>
          </defs>
        </svg>
      </div>

      <!-- Floating dots -->
      <div class="absolute top-1/4 left-12 w-4 h-4 rounded-full bg-purple-300 opacity-30"
           :style="{ transform: `translate(${transform.x/5}px, ${transform.y/5}px)` }"></div>
      <div class="absolute bottom-1/3 right-16 w-3 h-3 rounded-full bg-indigo-400 opacity-20"
           :style="{ transform: `translate(${-transform.x/4}px, ${-transform.y/4}px)` }"></div>
    </div>

    <!-- Header content -->
    <div class="relative z-10">
      <!-- Accent icon -->
      <div class="flex justify-center mb-4">
        <div class="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-tr from-indigo-100 to-blue-50 shadow-sm">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="text-indigo-500">
            <path d="M18 8.4C18 12.4 12 19 12 19C12 19 6 12.4 6 8.4C6 5.4 8.7 3 12 3C15.3 3 18 5.4 18 8.4Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M12 10C13.1046 10 14 9.10457 14 8C14 6.89543 13.1046 6 12 6C10.8954 6 10 6.89543 10 8C10 9.10457 10.8954 10 12 10Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>

      <!-- Title with subtle accents -->
      <h2 class="text-4xl font-extrabold text-gray-800 mb-4 text-center tracking-tight flex flex-col items-center sm:flex-row sm:justify-center gap-2">
        {{ title }}
        <span v-if="showAccent" class="inline-block w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
      </h2>

      <!-- Subtitle with gentle color -->
      <p v-if="subtitle" class="text-gray-600 text-lg text-center max-w-3xl mx-auto">
        {{ subtitle }}
        <span class="text-indigo-500">·</span>
      </p>

      <!-- Action buttons with subtle design -->
      <div v-if="showActions" class="mt-8 flex justify-center space-x-4">
        <slot name="actions">
          <button class="bg-white text-indigo-600 font-medium py-2.5 px-5 rounded-lg border border-indigo-100 shadow-sm hover:shadow hover:border-indigo-200 transition-all duration-300 flex items-center gap-2">
            Get Started
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="m9 18 6-6-6-6"/>
            </svg>
          </button>
          <button class="bg-gray-50 text-gray-700 font-medium py-2.5 px-5 rounded-lg hover:bg-gray-100 transition-all duration-300">
            Learn More
          </button>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

defineProps({
  title: {
    type: String,
    default: 'Welcome'
  },
  subtitle: {
    type: String,
    default: ''
  },
  showActions: {
    type: Boolean,
    default: false
  },
  showAccent: {
    type: Boolean,
    default: true
  }
})

const isVisible = ref(false)
const mousePosition = ref({ x: 0, y: 0 })
const transform = ref({ x: 0, y: 0 })

const handleMouseMove = (e) => {
  const rect = e.currentTarget.getBoundingClientRect()
  mousePosition.value = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  }

  transform.value = {
    x: (mousePosition.value.x / 20) - 15,
    y: (mousePosition.value.y / 20) - 15
  }
}

onMounted(() => {
  isVisible.value = true
})
</script>

<style scoped>
.header-container {
  transition: all 0.5s ease-out;
}

.header-visible {
  opacity: 1;
  transform: translateY(0);
}

.header-container:not(.header-visible) {
  opacity: 0;
  transform: translateY(20px);
}
</style>
