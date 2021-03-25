<template>
  <div class="mt-8 flex justify-between items-center">
    <button @click="$emit('cancel')" class="text-gray-600 hover:text-gray-800 hover:underline font-medium">
      Cancel
    </button>
    <div class="flex space-x-4">
      <button @click="$emit('reset')"
        class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg border border-gray-300 font-medium">
        Reset
      </button>
      <button @click="$emit('submit')"
        class="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium shadow-sm flex items-center"
        :disabled="disabled" :class="{ 'opacity-50 cursor-not-allowed': disabled }">
        <CheckCircleIcon class="h-5 w-5 mr-2" />
        {{ submitLabel }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { CheckCircleIcon } from '@heroicons/vue/24/outline';

defineProps({
  submitLabel: {
    type: String,
    default: 'Submit'
  },
  disabled: {
    type: Boolean,
    default: false
  }
});

defineEmits(['submit', 'reset', 'cancel']);
</script>