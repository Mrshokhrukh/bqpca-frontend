<template>
  <div class="flex flex-col items-start p-2">
    <p class="text-sm font-medium text-white mb-3">{{ message }}</p>
    <div class="flex w-full justify-end gap-3">
      <button
        @click="cancel"
        class="rounded-md border border-gray-300 bg-white px-3 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-50"
      >
        Cancel
      </button>
      <button
        @click="confirm"
        class="rounded-md bg-yellow-500 px-3 py-1 text-xs font-semibold text-white hover:bg-yellow-600"
      >
        Confirm
      </button>
    </div>
  </div>
</template>

<script setup>
import { useToast } from 'vue-toastification';

const props = defineProps({
  // The toastId is automatically passed by vue-toastification
  toastId: { type: [String, Number], required: true },
  message: { type: String, default: 'Are you sure?' }
});

const emit = defineEmits(['onConfirm']);
const toast = useToast();

const confirm = () => {
  emit('onConfirm');
  toast.dismiss(props.toastId);
};

const cancel = () => {
  toast.dismiss(props.toastId);
};
</script>