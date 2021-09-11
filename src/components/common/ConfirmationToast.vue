<template>
  <div class="confirmation-toast p-2">
    <p class="text-sm font-semibold text-gray-800 mb-3">{{ message }}</p>
    <div class="flex justify-end gap-2">
      <button
        @click="onConfirm"
        class="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
      >
        Confirm
      </button>
      <button
        @click="onCancel"
        class="px-3 py-1 bg-gray-200 text-gray-700 text-xs font-bold rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
      >
        Cancel
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  message: {
    type: String,
    default: 'Are you sure?'
  },
  
  closeToast: Function,
});

const emit = defineEmits(['confirm', 'cancel']);

const onConfirm = () => {
  emit('confirm');
  props.closeToast(); // Close the toast after emitting the event
};

const onCancel = () => {
  emit('cancel');
  props.closeToast(); // Close the toast after emitting the event
};
</script>