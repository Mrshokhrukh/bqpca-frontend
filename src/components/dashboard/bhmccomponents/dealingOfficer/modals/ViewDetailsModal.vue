<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div class="bg-white p-6 rounded w-1/2">
      <h2 class="text-xl font-semibold mb-4">Application Details</h2>
      <div v-if="application">
        <p><strong>Applicant Name:</strong> {{ application.fullName }}</p>
        <p><strong>CID:</strong> {{ application.cid || 'N/A' }}</p>
        <p><strong>Type:</strong> {{ application.type }}</p>
        <p><strong>Status:</strong> {{ application.status }}</p>
        <p><strong>Submission Date:</strong> {{ application.submissionDate }}</p>
      </div>
      <button @click="close" class="mt-4 bg-red-500 text-white px-4 py-2 rounded">Close</button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  application: Object,
});

const emit = defineEmits(['close']);

const close = () => emit('close');
</script>