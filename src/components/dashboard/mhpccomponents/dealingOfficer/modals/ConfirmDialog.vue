<template>
  <div
    v-if="isVisible"
    class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4 modal-confirm"
    @click.self="handleCancel"
  >
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
      <h3 class="text-xl font-semibold text-gray-800 mb-4">{{ title }}</h3>
      <p class="text-gray-600 mb-6 whitespace-pre-line">{{ message }}</p>
      <div v-if="showRemarks" class="mb-6">
        <label for="remarks" class="block text-sm font-medium text-gray-700 mb-2">
          Remarks
          <span v-if="title.includes('Reject')" class="text-red-500">*</span>
        </label>
        <textarea
          id="remarks"
          v-model="remarks"
          rows="4"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          :required="title.includes('Reject')"
        ></textarea>
      </div>
      <div class="flex justify-end space-x-3">
        <button
          @click="handleCancel"
          class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
        >
          Cancel
        </button>
        <button
          @click="handleConfirm"
          :class="[
            'px-4 py-2 text-white rounded-md transition-colors',
            confirmButtonClass || 'bg-blue-600 hover:bg-blue-700',
          ]"
          :disabled="title.includes('Reject') && !remarks.trim()"
        >
          {{ confirmButtonText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
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
  confirmButtonClass: {
    type: String,
    default: null,
  },
  showRemarks: {
    type: Boolean,
    default: false,
  },
  remarks: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:remarks', 'confirm', 'cancel'])

const remarks = computed({
  get: () => props.remarks,
  set: (value) => emit('update:remarks', value),
})

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
