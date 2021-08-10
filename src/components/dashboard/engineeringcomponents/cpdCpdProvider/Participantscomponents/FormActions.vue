<template>
  <div class="pt-6 border-t border-gray-200 flex items-center justify-end space-x-4">
    <!-- Cancel Button -->
    <button type="button" @click="$emit('cancel')" :disabled="isSubmitting"
      class="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
      Cancel
    </button>

    <!-- Reset Button -->
    <button type="button" @click="$emit('reset')" :disabled="isSubmitting"
      class="px-6 py-2 text-sm font-medium text-blue-700 bg-blue-100 border border-transparent rounded-lg hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
      Reset
    </button>

    <!-- Submit Button -->
    <button type="button" @click="$emit('submit')" :disabled="disabled || isSubmitting"
      class="relative inline-flex items-center justify-center px-6 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-lg shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors">
      <span v-if="isSubmitting" class="flex items-center">
        <!-- Loading Spinner -->
        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
          viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
          </path>
        </svg>
        Processing...
      </span>
      <span v-else class="flex items-center">
        <CheckCircleIcon class="h-5 w-5 mr-2" />
        {{ submitLabel }}
      </span>
    </button>
  </div>
</template>

<script setup>
import { CheckCircleIcon } from '@heroicons/vue/24/solid'

defineProps({
  submitLabel: {
    type: String,
    default: 'Submit',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  isSubmitting: {
    type: Boolean,
    default: false,
  }
})

defineEmits(['submit', 'reset', 'cancel'])
</script>
