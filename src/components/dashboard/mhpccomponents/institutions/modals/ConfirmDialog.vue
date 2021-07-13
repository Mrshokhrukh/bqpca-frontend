<template>
  <div
    v-if="isVisible"
    class="modal-confirm fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4"
    @click.self="handleCancel"
  >
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
      <h3 class="text-xl font-semibold text-gray-800 mb-4">{{ title }}</h3>
      <p class="text-gray-600 mb-6 whitespace-pre-line">{{ message }}</p>
      <div class="flex justify-end space-x-3">
        <button
          @click="handleCancel"
          class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
        >
          {{ cancelButtonText }}
        </button>
        <button
          @click="handleConfirm"
          :class="[
            'px-4 py-2 text-white rounded-md transition-colors',
            confirmButtonClass || 'bg-red-600 hover:bg-red-700',
          ]"
        >
          {{ confirmButtonText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  isVisible: {
    type: Boolean,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  confirmButtonText: {
    type: String,
    required: true,
  },
  cancelButtonText: {
    type: String,
    default: 'Cancel',
  },
  confirmButtonClass: {
    type: String,
    default: null,
  },
})

const emit = defineEmits(['confirm', 'cancel'])

const handleConfirm = () => {
  console.log('ConfirmDialog confirm called')
  emit('confirm')
}

const handleCancel = () => {
  console.log('ConfirmDialog cancel called')
  emit('cancel')
}
</script>

<style scoped>
.modal-confirm {
  z-index: 70 !important;
}
</style>
