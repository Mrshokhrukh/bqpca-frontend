// 11. FormActions.vue
<template>
  <div class="mt-12 flex justify-end space-x-4 p-8">
    <button @click="saveDraft" :disabled="loading"
      class="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
      Save as Draft
    </button>
    <button @click="handleSubmit" :disabled="loading"
      class="px-6 py-3 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
      Submit
    </button>
    <button @click="cancelForm" :disabled="loading"
      class="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
      Cancel
    </button>
  </div>
</template>

<script setup>
defineProps({
  loading: Boolean,
  saveDraft: Function,
  handleSubmit: Function,
  cancelForm: Function
});
</script>