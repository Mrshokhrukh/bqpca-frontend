<template>
    <div class="container mx-auto p-4">
      <!-- Page Header -->
      <h1 class="mb-6 text-2xl font-bold text-gray-800">
        Assessor Task for Application #{{ applicationId }}
      </h1>
  
      <!-- All logic for file upload is now in this component -->
      <div class="w-full max-w-2xl rounded-lg border border-gray-200 bg-white p-6 shadow-md">
        
        <!-- v-if handles showing the FORM or the SUCCESS message -->
        <div v-if="!uploadSuccess">
          <h2 class="mb-1 text-xl font-bold text-gray-800">Upload Site Visit Report</h2>
          <p class="mb-6 text-sm text-gray-500">
            Please upload your completed report file (PDF, DOCX). This will be sent to the dealing officer for review.
          </p>
  
          <form @submit.prevent="handleSubmit">
            <div class="space-y-6">
              <!-- File Input -->
              <div>
                <label for="report-file" class="block text-sm font-medium text-gray-700">Report File</label>
                <div class="mt-2 flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 px-6 py-10">
                  <div class="text-center">
                    <UploadCloud class="mx-auto h-12 w-12 text-gray-400" />
                    <div class="mt-4 flex text-sm text-gray-600">
                      <label for="report-file-input" class="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2">
                        <span>Upload a file</span>
                        <input id="report-file-input" name="report-file-input" type="file" class="sr-only" @change="handleFileChange" accept=".pdf,.doc,.docx" />
                      </label>
                      <p class="pl-1">or drag and drop</p>
                    </div>
                    <p v-if="!reportFile" class="text-xs text-gray-500">PDF, DOC, DOCX up to 10MB</p>
                    <p v-if="reportFile" class="mt-2 text-sm font-semibold text-green-700">{{ reportFile.name }}</p>
                  </div>
                </div>
              </div>
  
              <!-- Remarks -->
              <div>
                <label for="remarks" class="block text-sm font-medium text-gray-700">Remarks (Optional)</label>
                <textarea
                  id="remarks"
                  v-model="remarks"
                  rows="4"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  placeholder="Add any optional comments for the dealing officer..."
                ></textarea>
              </div>
  
              <!-- Error Message -->
              <div v-if="errorMessage" class="rounded-md bg-red-50 p-4">
                <p class="text-sm font-medium text-red-800">{{ errorMessage }}</p>
              </div>
            </div>
  
            <!-- Submit Button -->
            <div class="mt-8 border-t border-gray-200 pt-5">
              <div class="flex justify-end">
                <button
                  type="submit"
                  :disabled="!reportFile || isLoading"
                  class="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-indigo-300"
                >
                  <Loader2 v-if="isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                  <Upload v-else class="-ml-1 mr-3 h-5 w-5 text-white" />
                  <span v-if="isLoading">Uploading...</span>
                  <span v-else>Submit Report</span>
                </button>
              </div>
            </div>
          </form>
        </div>
  
        <!-- Success State -->
        <div v-if="uploadSuccess" class="text-center">
           <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
             <Check class="h-6 w-6 text-green-600" />
           </div>
           <h3 class="mt-4 text-lg font-medium leading-6 text-gray-900">Report Uploaded Successfully</h3>
           <p class="mt-2 text-sm text-gray-500">The dealing officer has been notified and can now review your report.</p>
           <div class="mt-6">
             <button
               @click="resetForm"
               type="button"
               class="inline-flex justify-center rounded-md border border-transparent bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
             >
               Upload Another Report
             </button>
           </div>
        </div>
      </div>
  
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useRoute } from 'vue-router';
  import apiService from '@/services/services';
  import { UploadCloud, Loader2, Upload, Check } from 'lucide-vue-next';
  
  // --- State from the Parent Component ---
  const route = useRoute();
  // Assuming the application ID comes from the URL, e.g., /assessor/tasks/123
  const applicationId = ref(route.params.id);
  
  
  // --- State and Logic from the Merged Child Component ---
  const reportFile = ref(null);
  const remarks = ref('');
  const isLoading = ref(false);
  const errorMessage = ref('');
  const uploadSuccess = ref(false);
  
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;
  
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      errorMessage.value = 'Invalid file type. Please upload a PDF, DOC, or DOCX file.';
      reportFile.value = null;
      event.target.value = '';
      return;
    }
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
        errorMessage.value = 'File is too large. Maximum size is 10MB.';
        reportFile.value = null;
        event.target.value = '';
        return;
    }
  
    reportFile.value = file;
    errorMessage.value = '';
  };
  
  const handleSubmit = async () => {
    if (!reportFile.value) {
      errorMessage.value = 'Please select a report file to upload.';
      return;
    }
  
    isLoading.value = true;
    errorMessage.value = '';
    uploadSuccess.value = false;
  
    const formData = new FormData();
    // We use `applicationId.value` directly instead of a prop
    formData.append('application', applicationId.value);
    formData.append('report_file', reportFile.value);
    formData.append('remarks', remarks.value);
  
    try {
      await apiService.uploadAssessorReport(formData);
  
      uploadSuccess.value = true;
      
      // This is the logic from your original `onUploadComplete` handler
      console.log(`Report for application ${applicationId.value} was uploaded.`);
      alert('Upload complete! The page can now be updated or the user can be redirected.');
      // You could add further logic here, like redirecting the user.
  
    } catch (error) {
      console.error('Error uploading assessor report:', error);
      if (error.response && error.response.data) {
        const apiErrors = error.response.data;
        errorMessage.value = apiErrors.detail || Object.values(apiErrors).flat().join(' ');
      } else {
        errorMessage.value = 'An unexpected error occurred. Please try again.';
      }
    } finally {
      isLoading.value = false;
    }
  };
  
  const resetForm = () => {
    reportFile.value = null;
    remarks.value = '';
    errorMessage.value = '';
    uploadSuccess.value = false;
    const fileInput = document.getElementById('report-file-input');
    if(fileInput) fileInput.value = '';
  };
  </script>