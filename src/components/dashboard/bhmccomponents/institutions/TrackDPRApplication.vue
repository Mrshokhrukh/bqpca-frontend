<template>
    <div class="max-w-3xl mx-auto px-4 py-8">
      <h2 class="text-3xl font-bold text-gray-900 mb-6 text-center">Track DPR Application</h2>
  
      <div class="bg-white border rounded-xl shadow-sm p-6">
        <div class="mb-4">
          <label for="trackingId" class="block text-sm font-medium text-gray-700">Enter CID or Application Number:</label>
          <div class="mt-1">
            <input
              type="text"
              id="trackingId"
              v-model="trackingId"
              class="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
              placeholder="Enter CID or Application Number"
            />
          </div>
        </div>
  
        <div class="flex justify-end">
          <button @click="trackApplication"
            class="px-6 py-3 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors">
            Track Application
          </button>
        </div>
  
        <!-- Display Application Status -->
        <div v-if="applicationStatus" class="mt-8">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Application Status:</h3>
          <div class="bg-gray-50 border rounded-lg p-4">
            <p class="text-gray-700" v-if="applicationStatus.error">
              {{ applicationStatus.error }}
            </p>
            <template v-else>
              <p class="text-gray-700">
                Application Number: {{ applicationStatus.applicationNumber }}
              </p>
              <p class="text-gray-700">
                Status: <span class="font-semibold">{{ applicationStatus.status }}</span>
              </p>
              <p class="text-gray-700" v-if="applicationStatus.details">
                Details: {{ applicationStatus.details }}
              </p>
            </template>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const trackingId = ref('');
  const applicationStatus = ref(null);
  
  const trackApplication = async () => {
    // Simulate API call to fetch application status based on trackingId
    // Replace this with your actual API endpoint and logic
  
    // For Demonstration I create the function to display data
  
    const applicationData = {
      "12345678910": {
        applicationNumber: "DPR-2024-001",
        status: "Under Review",
        details: "Application is currently being reviewed by the technical committee."
      },
      "98765432109": {
        applicationNumber: "DPR-2024-002",
        status: "Approved",
        details: "Application has been approved and is awaiting final licensing."
      },
      "DPR-2024-003": {
        applicationNumber: "DPR-2024-003",
        status: "Rejected",
        details: "Application has been rejected due to incomplete documentation."
      }
    };
  
    setTimeout(() => {
      if (applicationData[trackingId.value]) {
        applicationStatus.value = applicationData[trackingId.value];
      } else {
        applicationStatus.value = { error: "Application not found." };
      }
    }, 500);
  };
  </script>