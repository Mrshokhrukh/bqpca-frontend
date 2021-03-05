<template>
  <div class="min-h-screen ">

    <!-- Show  blink message  in div saying Your Cid is Missing PLease please Fill your CID Show button below mgs  -->
     <div v-if="userCID == null" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      <strong class="font-bold">Your CID is Missing!</strong>
      <span class="block sm:inline ml-6">Please fill your CID to view the dashboard.</span>
      <router-link to="/profile" class="absolute top-0 right-0 px-4 py-3">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
          class="w-6 h-6 text-red-700">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </router-link>

     </div>
    <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-8 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
          class="w-8 h-8 mr-3 text-blue-500">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25" />
        </svg>
        Institute Dashboard
      </h1>

      <!-- Main Stats -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div class="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-200 flex items-center">
          <div class="flex-shrink-0 bg-blue-100 text-blue-600 rounded-full p-3 mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
              stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0 6.75 1.5m-6.75-1.5v11.25c0 .621.504 1.125 1.125 1.125h4.875c.621 0 1.125-.504 1.125-1.125V4.5m-9 0h3.75m9-1.5h-9m9 1.5-2.25-2.25m4.5 0H21m-17.25 0h.75m16.5 0h.75" />
            </svg>
          </div>
          <div>
            <h2 class="text-lg font-semibold text-gray-900">Total Applications</h2>
            <p class="text-2xl font-bold text-blue-600">{{ totalApplications }}</p>
          </div>
        </div>

        <div class="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-200 flex items-center">
          <div class="flex-shrink-0 bg-green-100 text-green-600 rounded-full p-3 mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
              stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244" />
            </svg>
          </div>
          <div>
            <h2 class="text-lg font-semibold text-gray-900">Registered Institutes</h2>
            <p class="text-2xl font-bold text-green-600">{{ totalInstitutes }}</p>
          </div>
        </div>

        <div class="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-200 flex items-center">
          <div class="flex-shrink-0 bg-purple-100 text-purple-600 rounded-full p-3 mr-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
              stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
            </svg>
          </div>
          <div>
            <h2 class="text-lg font-semibold text-gray-900">Total Departments</h2>
            <p class="text-2xl font-bold text-purple-600">{{ totalDepartments }}</p>
          </div>
        </div>
      </div>

      <!-- Application Status Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div
          class="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 text-white">
          <h3 class="text-lg font-semibold">Pending Institute</h3>
          <p class="text-3xl font-bold mt-2">{{ applicationStatusCounts.Pending }}</p>
        </div>
        <div
          class="bg-gradient-to-r from-green-400 to-green-500 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 text-white">
          <h3 class="text-lg font-semibold">Approved Institute</h3>
          <p class="text-3xl font-bold mt-2">{{ applicationStatusCounts.Approved }}</p>
        </div>
        <div
          class="bg-gradient-to-r from-red-400 to-red-500 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 text-white">
          <h3 class="text-lg font-semibold">Rejected Institute</h3>
          <p class="text-3xl font-bold mt-2">{{ applicationStatusCounts.Reject }}</p>
        </div>
      </div>

      <!-- Department Status Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div
          class="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 text-white">
          <h3 class="text-lg font-semibold">Pending Departments</h3>
          <p class="text-3xl font-bold mt-2">{{ departmentStatusCounts.Pending }}</p>
        </div>
        <div
          class="bg-gradient-to-r from-green-400 via-green-500 to-green-600 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 text-white">
          <h3 class="text-lg font-semibold">Approved Departments</h3>
          <p class="text-3xl font-bold mt-2">{{ departmentStatusCounts.Approved }}</p>
        </div>
        <div
          class="bg-gradient-to-r from-red-400 via-red-500 to-red-600 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 text-white">
          <h3 class="text-lg font-semibold">Rejected Departments</h3>
          <p class="text-3xl font-bold mt-2">{{ departmentStatusCounts.Reject }}</p>
        </div>
      </div>

      <!-- Recent Applications Table -->
      <div class="bg-white rounded-xl p-6 shadow-lg">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-bold text-gray-900 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
              stroke="currentColor" class="w-6 h-6 mr-2 text-gray-500">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25-4.125c.825-.675 1.913-.675 2.738 0l5.276 4.297a3.355 3.355 0 0 1 0 4.818l-5.276 4.297a3.375 3.375 0 0 1-2.738 0l-5.276-4.297a3.355 3.355 0 0 1 0-4.818l5.276-4.297Z" />
            </svg>
            Recent Applications
          </h2>

        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-300 rounded-lg">
            <thead class="bg-gray-100">
              <tr>
                <th scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-lg">
                  Applicant</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone No</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Institute</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department</th>
                <th scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-lg">
                  Dpr Status</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="application in recentApplications" :key="application.id"
                class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{{ application.full_name }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-gray-500">{{ application.contact_no }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-gray-500">{{ application.email_address }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-gray-500">{{ application.name_of_institution }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getStatusClass(application.review_decision)">
                    {{ application.review_decision }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-gray-500">{{ application.dpr_name }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getDprStatusClass(application.do_dpr_review_decision)">
                    {{ application.do_dpr_review_decision }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import apiservices from '@/services/bmhcservices';
import { useAuthStore } from '@/stores/authStore';

const authStore = useAuthStore();
const instituteData = ref([]);

// Computed Properties for Counts
const totalApplications = computed(() => instituteData.value.length);

const totalInstitutes = computed(() => {
  const instituteNames = new Set();
  instituteData.value.forEach(app => {
    instituteNames.add(app.name_of_institution);
  });
  return instituteNames.size;
});

const totalDepartments = computed(() => {
  const departmentNames = new Set();
  instituteData.value.forEach(app => {
    departmentNames.add(app.dpr_name);
  });
  return departmentNames.size;
});

const applicationStatusCounts = computed(() => {
  const counts = { Pending: 0, Approved: 0, Reject: 0 };
  instituteData.value.forEach(app => {
    if (app.review_decision === 'Pending') {
      counts.Pending++;
    } else if (app.review_decision === 'Approved') {
      counts.Approved++;
    } else if (app.review_decision === 'Reject') {
      counts.Reject++;
    }
  });
  return counts;
});

const departmentStatusCounts = computed(() => {
  const counts = { Pending: 0, Approved: 0, Reject: 0 };
  instituteData.value.forEach(app => {
    if (app.do_dpr_review_decision === 'Pending') {
      counts.Pending++;
    } else if (app.do_dpr_review_decision === 'Approved') {
      counts.Approved++;
    } else if (app.do_dpr_review_decision === 'Reject') {
      counts.Reject++;
    }
  });
  return counts;
});

const recentApplications = computed(() => {
  return [...instituteData.value]  // Create a copy
    .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
    .slice(0, 10);
});

// Fetch Data
onMounted(async () => {
  try {
    const response = await apiservices.getBmhcInstitutes();
    const allInstitutes = response.data.results || [];
    const userCID = authStore.user?.cid;

    // Filter data based on user's CID
    instituteData.value = allInstitutes.filter(institute => institute.CID === userCID);
  } catch (error) {
    console.error('Error fetching institute data:', error);
  }
});

const getStatusClass = (status) => {
  switch (status) {
    case 'Pending':
      return 'bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-semibold';
    case 'Approved':
      return 'bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold';
    case 'Reject':
      return 'bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-semibold';
    default:
      return 'bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-semibold';
  }
};

const getDprStatusClass = (status) => {
  switch (status) {
    case 'Pending':
      return 'bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-semibold';
    case 'Approved':
      return 'bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold';
    case 'Reject':
      return 'bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-semibold';
    default:
      return 'bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-xs font-semibold';
  }
};
</script>
