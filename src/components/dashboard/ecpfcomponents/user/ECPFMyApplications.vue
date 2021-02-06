<template>
    <div class="container mx-auto p-4">
      <h1 class="text-2xl font-semibold mb-4">My Applications</h1>
  
      <div v-if="loading" class="text-center">Loading applications...</div>
      <div v-else-if="error" class="text-red-500 text-center">Error loading applications: {{ error }}</div>
      <div v-else>
        <div class="overflow-x-auto">
          <table class="min-w-full table-auto border-collapse border border-gray-300">
            <thead>
              <tr class="bg-gray-100">
                <th class="border border-gray-300 px-4 py-2">Application Type</th>
                <th class="border border-gray-300 px-4 py-2">Date Submitted</th>
                <th class="border border-gray-300 px-4 py-2">Status</th>
                <th class="border border-gray-300 px-4 py-2">Remarks</th>
                <th class="border border-gray-300 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="application in applications" :key="application.id">
                <td class="border border-gray-300 px-4 py-2">{{ application.applicationType }}</td>
                <td class="border border-gray-300 px-4 py-2">{{ formatDate(application.dateSubmitted) }}</td>
                <td class="border border-gray-300 px-4 py-2">{{ application.status }}</td>
                <td class="border border-gray-300 px-4 py-2">{{ application.remarks }}</td>
                <td class="border border-gray-300 px-4 py-2">
                  <button @click="viewDetails(application.id)" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">View Details</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-if="applications.length === 0" class="text-center mt-4">No applications found.</div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted } from 'vue';
  
  export default {
    setup() {
      const applications = ref([]);
      const loading = ref(true); // Start in loading state
      const error = ref(null);
  
      // Mock data - Replace with your actual API call
      const mockApplications = [
        {
          id: 1,
          applicationType: "ECPF Establishment Registration",
          dateSubmitted: "2024-10-27T10:00:00.000Z",
          status: "Pending",
          remarks: "Application received and under review.",
        },
        {
          id: 2,
          applicationType: "Change Request",
          dateSubmitted: "2024-10-20T14:30:00.000Z",
          status: "Approved",
          remarks: "Change request successfully processed.",
        },
        {
          id: 3,
          applicationType: "License Renewal",
          dateSubmitted: "2024-11-05T08:00:00.000Z",
          status: "Submitted",
          remarks: "Awaiting payment confirmation.",
        },
        {
          id: 4,
          applicationType: "Promotional Event Approval",
          dateSubmitted: "2024-11-10T16:00:00.000Z",
          status: "Rejected",
          remarks: "Event details do not meet requirements.",
        },
        {
          id: 5,
          applicationType: "Institutional Linkage Application",
          dateSubmitted: "2024-11-15T12:00:00.000Z",
          status: "In Review",
          remarks: "Under review by the Institutional Linkages Committee",
        },
        {
          id: 6,
          applicationType: "HR Management Request",
          dateSubmitted: "2024-11-18T14:30:00.000Z",
          status: "Approved",
          remarks: "HR Request Approved",
        },
        {
          id: 7,
          applicationType: "Student Data Change Request",
          dateSubmitted: "2024-11-20T10:00:00.000Z",
          status: "Pending",
          remarks: "Awaiting approval from student and head",
        },
      ];
  
      onMounted(() => {
        // Simulate API call delay - now without fetch
        setTimeout(() => {
          applications.value = mockApplications;
          loading.value = false;
        }, 500); // Simulate a 500ms delay
      });
  
      const formatDate = (dateString) => {
        try {
          const date = new Date(dateString);
          return date.toLocaleDateString(); // Adjust formatting as needed
        } catch (error) {
          console.error("Error formatting date:", error);
          return "Invalid Date"; // or some default value
        }
      };
  
      const viewDetails = (applicationId) => {
        // Implement navigation to application details page here
        console.log(`Viewing details for application ID: ${applicationId}`);
        // Example:  router.push(`/applications/${applicationId}`);  (if using Vue Router)
      };
  
      return {
        applications,
        loading,
        error,
        formatDate,
        viewDetails,
      };
    },
  };
  </script>
  
  <style scoped>
  /* Add any component-specific styles here */
  </style>