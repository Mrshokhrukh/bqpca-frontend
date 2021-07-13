// 12. ConfirmationModal.vue
<template>
  <div
    v-if="showConfirmation"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
  >
    <div class="bg-white rounded-xl shadow-xl max-w-md w-full p-6 transform transition-all">
      <div class="flex items-center mb-4">
        <div class="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3 class="text-xl font-bold text-gray-900">Confirm Submission</h3>
      </div>
      <p class="text-gray-600 mb-6">
        You are about to submit your CPD application. This action cannot be undone. Are you sure you
        want to proceed?
      </p>
      <div class="flex justify-end gap-4">
        <button
          @click="closeModal"
          :disabled="loading"
          class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
        <button
          @click="confirmSubmit"
          :disabled="loading"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Confirm
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  showConfirmation: Boolean,
  loading: Boolean,
  confirmSubmit: Function,
})
const emit = defineEmits(['update:showConfirmation'])

const closeModal = () => {
  emit('update:showConfirmation', false)
}
</script>
