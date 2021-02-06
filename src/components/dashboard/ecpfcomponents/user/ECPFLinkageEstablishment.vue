<template>
    <div class="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-md">
      <div class="p-6 border-b border-gray-200">
        <h1 class="text-2xl font-bold text-gray-900">Linkage Establishment Form</h1>
      </div>
  
      <div class="p-6">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div v-for="(linkage, index) in linkages" :key="index" 
               class="p-4 border rounded-lg bg-gray-50">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <!-- Institution Name -->
              <div>
                <label class="text-sm font-medium mb-1 block text-gray-700">
                  Institution Name *
                </label>
                <input
                  v-model="linkage.name"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter institution name"
                  required
                />
              </div>
  
              <!-- Location -->
              <div>
                <label class="text-sm font-medium mb-1 block text-gray-700">
                  Location *
                </label>
                <input
                  v-model="linkage.location"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter location"
                  required
                />
              </div>
  
              <!-- Country -->
              <div>
                <label class="text-sm font-medium mb-1 block text-gray-700">
                  Country *
                </label>
                <select
                  v-model="linkage.country"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select country</option>
                  <option v-for="country in countries" 
                          :key="country.value" 
                          :value="country.value">
                    {{ country.label }}
                  </option>
                </select>
              </div>
            </div>
  
            <!-- File Uploads -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <!-- Recognition Document -->
              <div>
                <label class="text-sm font-medium mb-1 block text-gray-700">
                  Recognition/Accreditation *
                </label>
                <div class="flex items-center gap-2">
                  <input
                    type="file"
                    @change="(e) => handleFileChange(e, index, 'recognition')"
                    accept=".pdf,.doc,.docx"
                    class="flex-1 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 
                           file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 
                           hover:file:bg-violet-100"
                  />
                  <a v-if="linkage.recognitionUrl"
                     :href="linkage.recognitionUrl"
                     target="_blank"
                     class="px-3 py-1 text-sm border rounded-md hover:bg-gray-50">
                    View
                  </a>
                </div>
              </div>
  
              <!-- Approval Document -->
              <div>
                <label class="text-sm font-medium mb-1 block text-gray-700">
                  University Approval *
                </label>
                <div class="flex items-center gap-2">
                  <input
                    type="file"
                    @change="(e) => handleFileChange(e, index, 'approval')"
                    accept=".pdf,.doc,.docx"
                    class="flex-1 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 
                           file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 
                           hover:file:bg-violet-100"
                  />
                  <a v-if="linkage.approvalUrl"
                     :href="linkage.approvalUrl"
                     target="_blank"
                     class="px-3 py-1 text-sm border rounded-md hover:bg-gray-50">
                    View
                  </a>
                </div>
              </div>
            </div>
  
            <!-- Delete Button -->
            <button v-if="linkages.length > 1"
                    type="button"
                    @click="deleteLinkage(index)"
                    class="mt-2 px-4 py-2 text-sm text-red-600 bg-red-50 rounded-md 
                           hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 
                           inline-flex items-center">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Remove Linkage
            </button>
          </div>
  
          <!-- Form Actions -->
          <div class="flex flex-col gap-4">
            <button
              type="button"
              @click="addLinkage"
              class="w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 
                     rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 
                     focus:ring-blue-500 inline-flex items-center justify-center">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Another Linkage
            </button>
  
            <div class="flex gap-4">
              <button
                type="submit"
                :disabled="isSubmitting"
                class="flex-1 px-4 py-2 text-white bg-blue-600 rounded-md 
                       hover:bg-blue-700 focus:outline-none focus:ring-2 
                       focus:ring-blue-500 disabled:bg-blue-300">
                {{ isSubmitting ? 'Submitting...' : 'Submit Form' }}
              </button>
              <button
                type="button"
                @click="resetForm"
                class="flex-1 px-4 py-2 text-gray-700 bg-white border border-gray-300 
                       rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 
                       focus:ring-blue-500">
                Reset Form
              </button>
            </div>
          </div>
  
          <!-- Status Messages -->
          <div v-if="status.message" 
               :class="[
                 'p-4 rounded-md', 
                 status.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
               ]">
            {{ status.message }}
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const countries = [
      { label: 'United States', value: 'US' },
      { label: 'Canada', value: 'CA' },
      { label: 'United Kingdom', value: 'UK' },
      { label: 'Bhutan', value: 'BT' },
      { label: 'India', value: 'IN' }
    ];
  
    const INITIAL_LINKAGE = {
    name: '',
    location: '',
    country: '',
    recognition: null,
    approval: null,
    recognitionUrl: null,
    approvalUrl: null
  };
  
  const linkages = ref([{ ...INITIAL_LINKAGE }]);
  const isSubmitting = ref(false);
  const status = ref({ type: '', message: '' });
  
  const addLinkage = () => {
    linkages.value.push({ ...INITIAL_LINKAGE });
  };
  
  const deleteLinkage = (index) => {
    linkages.value = linkages.value.filter((_, i) => i !== index);
  };
  
  const handleFileChange = async (event, index, type) => {
    const file = event.target.files?.[0];
    if (!file) return;
  
    try {
      // Simulate file upload
      const url = await simulateFileUpload(file);
      linkages.value[index][type] = file;
      linkages.value[index][`${type}Url`] = url;
    } catch (error) {
      status.value = {
        type: 'error',
        message: `Error uploading ${type} document: ${error.message}`
      };
    }
  };
  
  const simulateFileUpload = (file) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`https://example.com/uploads/${file.name}`);
      }, 500);
    });
  };
  
  const validateForm = () => {
    return linkages.value.every(linkage => 
      linkage.name && 
      linkage.location && 
      linkage.country && 
      linkage.recognition && 
      linkage.approval
    );
  };
  
  const handleSubmit = async () => {
    if (!validateForm()) {
      status.value = {
        type: 'error',
        message: 'Please fill in all required fields for each linkage.'
      };
      return;
    }
  
    isSubmitting.value = true;
    status.value = { type: '', message: '' };
  
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      status.value = {
        type: 'success',
        message: 'Linkage establishment request submitted successfully!'
      };
      resetForm();
    } catch (error) {
      status.value = {
        type: 'error',
        message: `Failed to submit request: ${error.message}`
      };
    } finally {
      isSubmitting.value = false;
    }
  };
  
  const resetForm = () => {
    linkages.value = [{ ...INITIAL_LINKAGE }];
    status.value = { type: '', message: '' };
  };
  </script>
  
  <style scoped>
  /* Additional custom styles can be added here if needed */
  </style>