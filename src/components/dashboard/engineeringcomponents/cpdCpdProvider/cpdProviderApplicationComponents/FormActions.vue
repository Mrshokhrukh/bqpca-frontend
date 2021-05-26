<template>
  <div class="mt-12 flex justify-end space-x-4 p-8 bg-gray-50 border-t border-gray-200">
    <!-- Save as Draft Button -->
    <button @click="handleSaveDraft" :disabled="loading"
      class="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
      aria-label="Save form as draft" :aria-busy="loading">
      <svg v-if="loading" class="animate-spin h-5 w-5 mr-2 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none"
        viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
        </path>
      </svg>
      Save as Draft
    </button>

    <!-- Submit Button -->
    <div class="relative">
      <button @click="handleSubmitClick" :disabled="loading || !formValid"
        class="px-6 py-3 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        aria-label="Submit form" :aria-busy="loading">
        <svg v-if="loading" class="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
          viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
          </path>
        </svg>
        Submit
      </button>
      <span v-if="!formValid && !loading"
        class="absolute top-full mt-2 left-0 text-xs text-red-500 bg-white border border-red-200 rounded px-2 py-1 shadow-sm"
        role="alert">
        Please complete all required fields before submitting
      </span>
    </div>

    <!-- Cancel Button -->
    <button @click="handleCancel" :disabled="loading"
      class="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
      aria-label="Cancel form" :aria-busy="loading">
      <svg v-if="loading" class="animate-spin h-5 w-5 mr-2 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none"
        viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
        </path>
      </svg>
      Cancel
    </button>
  </div>
</template>

<script setup>

defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
  formValid: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['save-draft', 'submit', 'cancel'])

// Handle Save as Draft
const handleSaveDraft = () => {
  emit('save-draft')
}

// Handle Submit with Confirmation
const handleSubmitClick = () => {
  if (
    window.confirm(
      'Are you sure you want to submit the form? Please ensure all details are correct.'
    )
  ) {
    emit('submit')
  }
}

// Handle Cancel with Confirmation
const handleCancel = () => {
  if (window.confirm('Are you sure you want to cancel? Unsaved changes will be lost.')) {
    emit('cancel')
  }
}
</script>
