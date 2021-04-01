<template>
  <section class="p-6 bg-white rounded-lg shadow">
    <h2 class="text-xl font-semibold mb-4 text-indigo-700">Supporting Documents</h2>
    <div>
      <label for="cvUpload" class="block text-sm font-medium text-gray-700">Applicant's CV Upload <span class="text-red-500">*</span></label>
      <input
        type="file"
        id="cvUpload"
        @change="handleFileUpload($event, 'cvFile')"
        required
        accept=".pdf,.doc,.docx"
        class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
      />
      <span v-if="cvFileName" class="text-xs text-gray-600 mt-1 block">
        Selected: {{ cvFileName }}
      </span>
       <span v-else class="text-xs text-gray-500 mt-1 block">No file selected.</span>
      <p class="mt-1 text-xs text-gray-500">Please upload your latest Curriculum Vitae (PDF, DOC, DOCX format).</p>
    </div>

    <!-- Add other required supporting documents here -->
    <!-- Example:
    <div class="mt-4">
        <label for="otherDoc" class="block text-sm font-medium text-gray-700">Another Document <span class="text-red-500">*</span></label>
        <input type="file" id="otherDoc" @change="handleFileUpload($event, 'otherDocFile')" required accept=".pdf" class="..."/>
        <span v-if="otherDocFileName" class="text-xs text-gray-600 mt-1 block">Selected: {{ otherDocFileName }}</span>
         <span v-else class="text-xs text-gray-500 mt-1 block">No file selected.</span>
    </div>
    -->
  </section>
</template>

<script setup>
defineProps({
    cvFileName: {
        type: String,
        default: ''
    },
    // Add props for other file names if needed
    // otherDocFileName: { type: String, default: '' },
});

const emit = defineEmits(['update:file']);

const handleFileUpload = (event, fieldIdentifier) => {
  const file = event.target.files[0];
  emit('update:file', { file: file || null, field: fieldIdentifier });
  if (!file) { event.target.value = ''; }
};
</script>