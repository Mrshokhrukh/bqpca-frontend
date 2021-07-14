<template>
  <div
    class="relative bg-gradient-to-r from-indigo-600 via-indigo-500 to-blue-500 rounded-2xl p-8 md:p-12 mb-12 shadow-xl overflow-hidden"
    role="banner" aria-labelledby="form-title">
    <!-- Subtle Background Pattern -->
    <div
      class="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.1\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'1\'/%3E%3Ccircle cx=\'17\' cy=\'17\' r=\'1\'/%3E%3C/g%3E%3C/svg%3E')]">
    </div>

    <!-- Logo/Icon -->
    <div class="absolute top-4 left-4 md:top-6 md:left-6">
      <svg class="h-8 w-8 text-white opacity-80" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
        stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    </div>

    <!-- Main Content -->
    <div class="relative text-center max-w-3xl mx-auto animate-fade-in">
      <h2 id="form-title" class="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
        CPD Application Form
      </h2>
      <p class="text-indigo-100 text-base md:text-lg leading-relaxed mb-6">
        Submit your Continuing Professional Development application with ease. Ensure all required
        fields are completed (approximately 10-15 minutes).
      </p>

      <!-- Help Button -->
      <button @click="showHelp"
        class="inline-flex items-center px-4 py-2 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors text-sm font-medium"
        aria-label="View form help">
        <svg class="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
          stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Form Help
      </button>
    </div>

    <!-- Validation Errors -->
    <div v-if="errors.length" class="mt-6 bg-red-50 p-4 rounded-lg border border-red-200 max-w-3xl mx-auto" role="alert"
      aria-live="assertive">
      <p class="text-sm text-red-600 font-medium flex items-center">
        <svg class="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
          stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Please correct the following errors:
      </p>
      <ul class="mt-2 text-sm text-red-600 list-disc list-inside">
        <li v-for="(error, index) in errors" :key="index">{{ error }}</li>
      </ul>
    </div>

    <!-- Progress Bar (Optional) -->
    <div v-if="showProgress" class="mt-8 max-w-xl mx-auto" role="progressbar" :aria-valuenow="progress"
      aria-valuemin="0" aria-valuemax="100">
      <p class="text-sm text-white mb-2">Form Completion: {{ progress }}%</p>
      <div class="w-full bg-indigo-300 rounded-full h-2.5">
        <div class="bg-white h-2.5 rounded-full transition-all duration-300" :style="{ width: `${progress}%` }"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  errors: {
    type: Array,
    default: () => [],
  },
  progress: {
    type: Number,
    default: 0,
  },
  showProgress: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['show-help'])

const showHelp = () => {
  emit('show-help')
}
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}
</style>
