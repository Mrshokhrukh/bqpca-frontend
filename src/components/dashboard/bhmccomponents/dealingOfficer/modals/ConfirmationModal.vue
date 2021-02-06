<template>
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white p-6 rounded-lg w-1/3">
        <h2 class="text-xl font-semibold mb-4">{{ message }}</h2>

        <!-- Rejection Message (only shown for reject action) -->
        <textarea
          v-if="message.includes('reject')"
          v-model="rejectionMessage"
          placeholder="Enter rejection reason..."
          class="w-full p-2 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="3"
        ></textarea>

        <!-- Buttons -->
        <div class="flex justify-end space-x-4">
          <button @click="cancel" class="px-4 py-2 border rounded-lg hover:bg-gray-100">Cancel</button>
          <button @click="confirm" class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            Confirm
          </button>
        </div>
      </div>
    </div>
  </template>

  <script setup>
  import { ref } from 'vue';

  defineProps({
    message: String,
  });

  const emit = defineEmits(['confirm', 'cancel']);

  const rejectionMessage = ref('');

  const confirm = () => {
    emit('confirm', rejectionMessage.value); // Pass rejection message to parent
  };

  const cancel = () => {
    emit('cancel');
  };
  </script>

  <style scoped>
  /* Additional custom styles can be added here if needed */
  </style>
