<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div class="bg-white p-8 rounded-lg shadow-lg w-1/2">
      <h2 class="text-2xl font-semibold mb-6">Application Details</h2>
      <div v-if="application">
        <p class="mb-4"><strong>Applicant Name:</strong> {{ application.fullName }}</p>
        <p class="mb-4"><strong>CID:</strong> {{ application.cid || 'N/A' }}</p>
        <p class="mb-4"><strong>Type:</strong> {{ application.type }}</p>
        <p class="mb-4"><strong>Status:</strong> {{ application.status }}</p>
        <p class="mb-4"><strong>Submission Date:</strong> {{ application.submissionDate }}</p>
      </div>
      <button @click="close" class="mt-6 bg-red-600 text-white px-6 py-3 rounded-lg shadow hover:bg-red-700">Close</button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  isOpen: Boolean,
  application: Object,
});

const emit = defineEmits(['close']);

const close = () => emit('close');
</script>
