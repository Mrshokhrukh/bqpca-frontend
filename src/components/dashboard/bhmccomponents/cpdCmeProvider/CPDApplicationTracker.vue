<template>
    <div class="max-w-6xl mx-auto px-4 py-8">
      <!-- Application Tracking Header -->
      <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 mb-10">
        <h2 class="text-3xl font-bold text-gray-900 mb-3 text-center">
          Application Tracking
        </h2>
        <p class="text-gray-600 text-center max-w-2xl mx-auto">
          Track the status of your CPD applications.
        </p>
      </div>
  
      <!-- Search Bar -->
      <div class="mb-6 flex items-center">
        <label for="search" class="mr-3 text-sm font-medium text-gray-700">Search:</label>
        <input type="text" id="search" v-model="searchTerm"
          class="mt-1 block w-full sm:w-64 rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
          placeholder="Enter application ID or name" />
      </div>
  
      <!-- Application Table -->
      <div class="bg-white border rounded-xl shadow-sm overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Application ID
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Applicant Name
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title of CPD
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Submission Date
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="application in filteredApplications" :key="application.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ application.id }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ application.applicantName }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ application.title }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ application.submissionDate }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <span :class="[
                  'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                  application.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    application.status === 'Approved' ? 'bg-green-100 text-green-800' :
                      application.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                ]">
                  {{ application.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button @click="viewApplication(application.id)"
                  class="text-blue-600 hover:text-blue-900 focus:outline-none">View</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed } from 'vue';
  
  export default {
    setup() {
      const searchTerm = ref('');
  
      // Dummy application data
      const applications = ref([
        {
          id: 'APP-2024-001',
          applicantName: 'Alice Smith',
          title: 'Advanced JavaScript Concepts',
          submissionDate: '2024-01-15',
          status: 'Pending',
        },
        {
          id: 'APP-2024-002',
          applicantName: 'Bob Johnson',
          title: 'Effective Communication Skills',
          submissionDate: '2024-02-01',
          status: 'Approved',
        },
        {
          id: 'APP-2024-003',
          applicantName: 'Charlie Brown',
          title: 'Project Management Fundamentals',
          submissionDate: '2024-02-10',
          status: 'Rejected',
        },
        {
          id: 'APP-2024-004',
          applicantName: 'David Lee',
          title: 'Data Analysis with Python',
          submissionDate: '2024-03-01',
          status: 'Pending',
        },
        {
          id: 'APP-2024-005',
          applicantName: 'Eve Wilson',
          title: 'Cybersecurity Essentials',
          submissionDate: '2024-03-15',
          status: 'Approved',
        },
      ]);
  
      const filteredApplications = computed(() => {
        const term = searchTerm.value.toLowerCase();
        return applications.value.filter(application =>
          application.id.toLowerCase().includes(term) ||
          application.applicantName.toLowerCase().includes(term) ||
          application.title.toLowerCase().includes(term)
        );
      });
  
      const viewApplication = (applicationId) => {
        // Implement navigation to the application details page here
        console.log(`Viewing application with ID: ${applicationId}`);
        // Example using Vue Router:
        // router.push(`/applications/${applicationId}`);
      };
  
      return {
        searchTerm,
        applications,
        filteredApplications,
        viewApplication,
      };
    },
  };
  </script>