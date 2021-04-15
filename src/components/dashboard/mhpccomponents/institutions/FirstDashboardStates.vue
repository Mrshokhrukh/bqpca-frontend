<template>
  <div class="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-12">
    <div class="flex flex-col items-center max-w-md">
      <!-- Illustration/Icon -->
      <div class="w-40 h-40 mb-6 flex items-center justify-center rounded-full bg-indigo-50">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-24 h-24 text-indigo-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M15 13l-3 3m0 0l-3-3m3 3V8m0 13a9 9 0 110-18 9 9 0 010 18z"
          />
        </svg>
      </div>

      <!-- Title -->
      <h2 class="text-2xl font-bold text-gray-900 mb-3">You Dont Have Any Applications Yet</h2>

      <!-- Message -->
      <p class="text-gray-600 mb-8">{{ message }}</p>

      <!-- Status -->
      <!-- <div class="bg-amber-50 border border-amber-200 rounded-md px-4 py-3 mb-6 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-amber-400 mr-2" fill="none" viewBox="0 0 24 24"
          stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span class="text-amber-800 text-sm">Your application yet reviewed by our team</span>
      </div> -->

      <!-- Action buttons -->
      <div class="flex flex-col sm:flex-row gap-4 w-full">
        <button
          class="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          @click="checkApplicationStatus"
        >
          Apply Now
        </button>

        <!-- <button
          class="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          @click="contactSupport">
          Contact Support
        </button> -->
      </div>
    </div>

    <!-- Animated loading indicator for a pulse effect -->
    <!-- <div class="mt-16 flex flex-col items-center">
      <div class="relative">
        <div class="h-3 w-3 bg-indigo-500 rounded-full absolute animate-ping opacity-75"></div>
        <div class="h-3 w-3 bg-indigo-500 rounded-full relative"></div>
      </div>
      <p class="mt-4 text-sm text-gray-500">You'll be notified once your application is approved</p>
    </div> -->
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()

defineProps({
  message: {
    type: String,
    default:
      "You don't have any applications yet. Please apply by clicking on the following button",
  },
})

const checkApplicationStatus = () => {
  if (typeof router.push === 'function') {
    router.push('/admin/institutions/health_certification/apply_for_eoi') // Ensure router.push is a function
  } else {
    console.error('router.push is not a function')
  }
}
</script>
