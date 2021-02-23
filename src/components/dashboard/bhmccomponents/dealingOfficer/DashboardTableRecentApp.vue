<template>
  <div class="bg-white rounded-xl p-6 shadow-md mb-8">
  <div class="flex justify-between items-center mb-4">
    <h2 class="text-xl font-bold text-gray-900">Recent Applications</h2>
    <button class="text-blue-600 hover:text-blue-800">View All</button>
  </div>
  <div class="overflow-x-auto">
    <table class="min-w-full">
      <thead class="bg-gray-50">
        <tr>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicant</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr v-for="application in recentApplications" :key="application.id">
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="flex items-center">
              <div class="text-sm font-medium text-gray-900">{{ application.name }}</div>
            </div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="getApplicationTypeClass(application.type)">
              {{ application.type }}
            </span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="getStatusClass(application.status)">
              {{ application.status }}
            </span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {{ application.submittedDate }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm">
            <button class="text-blue-600 hover:text-blue-900">Review</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
</template>

<script setup>

import {onMounted} from 'vue';
import apiservice from '@/services/bmhcservices'; // Ensure correct import

// Fetch data on mounted
onMounted(async () => {
  try {
    const applicantsResponse = await apiservice.getBhmcNewApplications();
    const applicantsData = applicantsResponse.data.results || [];
    //for applcant = applicantsData.full_name
    //  for applicantsData.registration_type (fot renwal )




    const cpdRecordsResponse = await apiservice.getBmhcCpdRecords();
    const cpdData = cpdRecordsResponse.data.results || [];

    const cogsRecordsResponse = await apiservice.getBmhcCogs();
    const cogsData = cogsRecordsResponse.data.results || [];



  } catch (error) {
    console.error('Error fetching data:', error);
  }
});

const getApplicationTypeClass = (type) => {
  const classes = {
    'Registration': 'bg-blue-100 text-blue-800',
    'Renewal': 'bg-green-100 text-green-800',
    'CPD': 'bg-purple-100 text-purple-800',
    'CoGS': 'bg-yellow-100 text-yellow-800'
  };
  return classes[type] || 'bg-gray-100 text-gray-800';
};

const getStatusClass = (status) => {
  const classes = {
    'Pending': 'bg-yellow-100 text-yellow-800',
    'In Review': 'bg-blue-100 text-blue-800',
    'Documents Required': 'bg-red-100 text-red-800',
    'Approved': 'bg-green-100 text-green-800',
    'Rejected': 'bg-gray-100 text-gray-800'
  };
  return classes[status] || 'bg-gray-100 text-gray-800';
};
</script>
