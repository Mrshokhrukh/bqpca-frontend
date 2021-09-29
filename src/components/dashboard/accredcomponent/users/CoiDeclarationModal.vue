<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div class="bg-white p-6 rounded-xl shadow-xl w-full max-w-lg">
      <div class="flex justify-between items-center mb-4 border-b pb-3">
        <h2 class="text-xl font-bold text-gray-800">Declare Conflict of Interest</h2>
        <button @click="$emit('close')" class="text-gray-500 hover:text-gray-800">&times;</button>
      </div>
      <form @submit.prevent="submit">
        <div class="space-y-4">
          <div>
            <label for="coi-remarks" class="block text-sm font-medium text-gray-700">Reason for Conflict of Interest</label>
            <textarea v-model="remarks" id="coi-remarks" rows="4" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" required></textarea>
          </div>
          <div>
            <label for="coi-document" class="block text-sm font-medium text-gray-700">Supporting Document (Optional)</label>
            <input type="file" id="coi-document" @change="handleFileChange" class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
          </div>
        </div>
        <div class="mt-6 pt-4 border-t flex justify-end space-x-4">
          <button type="button" @click="$emit('close')" class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded">Cancel</button>
          <button type="submit" class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Submit Declaration</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

defineProps({
  isOpen: Boolean,
  coiRecord: Object,
});

const emit = defineEmits(['close', 'submit']);

const remarks = ref('');
const document = ref(null);

const handleFileChange = (event) => {
    document.value = event.target.files[0];
};

const submit = () => {
    if (!remarks.value.trim()) {
        alert('Please provide a reason for the conflict of interest.');
        return;
    }
    emit('submit', { remarks: remarks.value, document: document.value });
};
</script>
