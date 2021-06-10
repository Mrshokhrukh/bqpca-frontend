<template>
  <div class="flex justify-end space-x-4 mt-6">
    <button
      :disabled="loading"
      @click="cancelForm"
      class="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
    >
      Cancel
    </button>
    <button
      :disabled="loading"
      @click="saveDraft"
      class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      Save as Draft
    </button>
    <button
      :disabled="loading || !isValid"
      @click="handleSubmit"
      class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
    >
      Submit
    </button>
  </div>
</template>

<script setup>
import { watch } from 'vue';
const props = defineProps({
  loading: Boolean,
  isValid: Boolean,
  saveDraft: Function,
  handleSubmit: Function,
  cancelForm: Function,
});

watch([() => props.loading, () => props.isValid], ([newLoading, newIsValid]) => {
  console.log('FormActions: loading:', newLoading, 'isValid:', newIsValid);
});
</script>