<template>
  <div class="overflow-hidden">
    <!-- Empty state when no approved applications -->
    <FirstDashboardState v-if="hasNoApplications && !isLoading"
      message="You don't have any applications yet.  Once submitted, you will have access to the dashboard." />
    <EmptyDashboardState v-else-if="!hasApprovedApplications && !isLoading"
      message="You don't have any approved applications yet.  Once approved, you will have access to the dashboard." />
    <!-- Application processing message -->
    <div v-else-if="hasPendingApplications && !isLoading"
      class="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded relative" role="alert">
      <strong class="font-bold">Application Under Process!</strong>
      <span class="block sm:inline ml-6">Your application is currently being reviewed. Please check back later.</span>
    </div>

    <!-- Main dashboard content - only shown when user has at least one approved application -->
    <div v-else>
      <div v-if="userCID === null" class="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded relative"
        role="alert">
        <strong class="font-bold">Your CID is Missing!</strong>
        <span class="block sm:inline ml-6">Please fill your CID to view the dashboard.</span>
        <router-link to="/admin/institutions/engineering_certification/institution_profile"
          class="absolute top-0 right-0 px-4 py-3">
          <button type="button"
            class="bg-white rounded px-2 py-1 text-gray-700 hover:text-gray-500 border border-gray-200"
            aria-label="Close">
            <span aria-hidden="true">Complete Profile</span>
          </button>
        </router-link>
      </div>
      <div class=" mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-8 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
            stroke="currentColor" class="w-8 h-8 mr-3 text-indigo-600">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25" />
          </svg>
          Institute Dashboard
        </h1>

        <!-- Main Stats -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div
            class="bg-white rounded-lg p-6 shadow border border-gray-100 hover:shadow-md transition-shadow duration-200">
            <div class="flex items-center">
              <div class="mr-4 text-indigo-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
                </svg>
              </div>
              <div>
                <h2 class="text-sm font-semibold text-gray-500 uppercase tracking-wider">Total Applications</h2>
                <p class="text-2xl font-bold text-gray-800 mt-1">{{ totalApplications }}</p>
              </div>
            </div>
          </div>

          <div
            class="bg-white rounded-lg p-6 shadow border border-gray-100 hover:shadow-md transition-shadow duration-200">
            <div class="flex items-center">
              <div class="mr-4 text-indigo-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"></path>
                  <path d="M3 9V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4"></path>
                </svg>
              </div>
              <div>
                <h2 class="text-sm font-semibold text-gray-500 uppercase tracking-wider">Registered Institutes</h2>
                <p class="text-2xl font-bold text-gray-800 mt-1">{{ totalInstitutes }}</p>
              </div>
            </div>
          </div>

          <div
            class="bg-white rounded-lg p-6 shadow border border-gray-100 hover:shadow-md transition-shadow duration-200">
            <div class="flex items-center">
              <div class="mr-4 text-indigo-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                </svg>
              </div>
              <div>
                <h2 class="text-sm font-semibold text-gray-500 uppercase tracking-wider">Total Departments</h2>
                <p class="text-2xl font-bold text-gray-800 mt-1">{{ totalDepartments }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Application Status Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div
            class="bg-white rounded-lg p-6 shadow border border-gray-100 hover:shadow-md transition-shadow duration-200">
            <div class="flex items-center mb-3">
              <div class="text-amber-500 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              </div>
              <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wider">Pending Institute</h3>
            </div>
            <p class="text-3xl font-bold text-gray-800">{{ applicationStatusCounts.Pending }}</p>
          </div>

          <div
            class="bg-white rounded-lg p-6 shadow border border-gray-100 hover:shadow-md transition-shadow duration-200">
            <div class="flex items-center mb-3">
              <div class="text-emerald-500 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wider">Approved Institute</h3>
            </div>
            <p class="text-3xl font-bold text-gray-800">{{ applicationStatusCounts.Approved }}</p>
          </div>

          <div
            class="bg-white rounded-lg p-6 shadow border border-gray-100 hover:shadow-md transition-shadow duration-200">
            <div class="flex items-center mb-3">
              <div class="text-red-500 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="15" y1="9" x2="9" y2="15"></line>
                  <line x1="9" y1="9" x2="15" y2="15"></line>
                </svg>
              </div>
              <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wider">Rejected Institute</h3>
            </div>
            <p class="text-3xl font-bold text-gray-800">{{ applicationStatusCounts.Regret }}</p>
          </div>
        </div>

        <!-- Department Status Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div
            class="bg-white rounded-lg p-6 shadow border border-gray-100 hover:shadow-md transition-shadow duration-200">
            <div class="flex items-center mb-3">
              <div class="text-amber-500 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 20v-6M9 17l3 3 3-3M4 4v6M7 7l-3 3 3 3M20 4v6M17 7l3 3-3 3M12 4v6M9 7l3 3 3-3"></path>
                </svg>
              </div>
              <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wider">Pending DPR</h3>
            </div>
            <p class="text-3xl font-bold text-gray-800">{{ departmentStatusCounts.Pending }}</p>
          </div>

          <div
            class="bg-white rounded-lg p-6 shadow border border-gray-100 hover:shadow-md transition-shadow duration-200">
            <div class="flex items-center mb-3">
              <div class="text-emerald-500 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h1"></path>
                  <path d="M17 3h1a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-1"></path>
                  <path d="M12 12h2a2 2 0 0 1 2 2v6"></path>
                  <path d="M10 12h2a2 2 0 0 0 2-2V4"></path>
                  <path d="M9 20H7a2 2 0 0 1-2-2v-6"></path>
                  <path d="M21 16v3a2 2 0 0 1-2 2h-7"></path>
                  <path d="M12 10v4"></path>
                </svg>
              </div>
              <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wider">Approved DPR</h3>
            </div>
            <p class="text-3xl font-bold text-gray-800">{{ departmentStatusCounts.Approved }}</p>
          </div>

          <div
            class="bg-white rounded-lg p-6 shadow border border-gray-100 hover:shadow-md transition-shadow duration-200">
            <div class="flex items-center mb-3">
              <div class="text-red-500 mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path
                    d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17">
                  </path>
                </svg>
              </div>
              <h3 class="text-sm font-semibold text-gray-500 uppercase tracking-wider">Rejected DPR</h3>
            </div>
            <p class="text-3xl font-bold text-gray-800">{{ departmentStatusCounts.Regret }}</p>
          </div>
        </div>

        <!-- Teaching Centers Card -->
        <div v-if="teachingCenters && teachingCenters.length > 0"
          class="bg-white rounded-lg p-6 shadow border border-gray-100 mb-8">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-gray-800 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                class="mr-2 text-indigo-600">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
              </svg>
              Teaching Centers
            </h2>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div v-for="center in teachingCenters" :key="center.id"
              class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div class="flex items-center justify-between mb-2">
                <h3 class="font-medium text-gray-800">{{ center.center_name }}</h3>
                <span :class="{
                  'bg-green-100 text-green-800': center.tc_review_decision === 'Approved' && center.is_active,
                  'bg-yellow-100 text-yellow-800': center.tc_review_decision === 'Pending',
                  'bg-red-100 text-red-800': center.tc_review_decision === 'Rejected'
                }" class="text-xs px-2 py-1 rounded-full">
                  {{ center.tc_review_decision }}
                </span>
              </div>
              <p class="text-sm text-gray-600 mb-3">{{ center.center_location }}, {{ center.state_dzongkhag }}</p>

              <!-- View Certificate Button - Only show for approved and active centers -->
              <div class="flex justify-end mt-2">
                <button v-if="center.is_active && center.tc_review_decision === 'Approved'"
                  @click="openCertificateDialog(center)"
                  class="inline-flex items-center bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-md text-sm font-medium">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  View Certificate
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Applications Table -->
        <div class="bg-white rounded-lg p-6 shadow border border-gray-100">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-gray-800 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                class="mr-2 text-indigo-600">
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
              </svg>
              Recent Applications
            </h2>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 rounded-lg">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-lg">
                    Applicant</th>
                  <th scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phone No</th>
                  <th scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email</th>
                  <th scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Institute</th>
                  <th scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status</th>
                  <th scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-lg">
                    DPR Status</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="application in recentApplications" :key="application.id"
                  class="hover:bg-gray-50 transition-colors">
                  <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{{ application.full_name }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-gray-600">{{ application.contact_no }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-gray-600">{{ application.email_address }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-gray-600">{{ application.name_of_institution }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <span v-if="application.review_decision === 'Pending'"
                        class="w-2 h-2 bg-amber-400 rounded-full mr-2"></span>
                      <span v-else-if="application.review_decision === 'Approved'"
                        class="w-2 h-2 bg-emerald-400 rounded-full mr-2"></span>
                      <span v-else-if="application.review_decision === 'Regret'"
                        class="w-2 h-2 bg-red-400 rounded-full mr-2"></span>
                      <span v-else class="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                      <span :class="getStatusTextClass(application.review_decision)">
                        {{ application.review_decision }}
                      </span>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <span v-if="application.do_dpr_review_decision === 'Pending'"
                        class="w-2 h-2 bg-amber-400 rounded-full mr-2"></span>
                      <span v-else-if="application.do_dpr_review_decision === 'Approved'"
                        class="w-2 h-2 bg-emerald-400 rounded-full mr-2"></span>
                      <span v-else-if="application.do_dpr_review_decision === 'Regret'"
                        class="w-2 h-2 bg-red-400 rounded-full mr-2"></span>
                      <span v-else class="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                      <span :class="getStatusTextClass(application.do_dpr_review_decision)">
                        {{ application.do_dpr_review_decision }}
                      </span>
                    </div>
                  </td>
                </tr>
                <!-- Empty state when no applications -->
                <tr v-if="recentApplications.length === 0">
                  <td colspan="6" class="px-6 py-8 text-center text-gray-500">
                    <div class="flex flex-col items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"
                        class="text-gray-300 mb-3">
                        <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
                        <line x1="7" y1="2" x2="7" y2="22"></line>
                        <line x1="17" y1="2" x2="17" y2="22"></line>
                        <line x1="2" y1="12" x2="22" y2="12"></line>
                        <line x1="2" y1="7" x2="7" y2="7"></line>
                        <line x1="2" y1="17" x2="7" y2="17"></line>
                        <line x1="17" y1="17" x2="22" y2="17"></line>
                        <line x1="17" y1="7" x2="22" y2="7"></line>
                      </svg>
                      <p>No applications found</p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Certificate Dialog -->
  <CertificateDialog v-if="showCertificateDialog" :show="showCertificateDialog" :center-data="selectedCenter"
    :cert-type="'teaching-center'" @close="closeCertificateDialog" />
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import apiservices from '@/services/epcServices';
import { useAuthStore } from '@/stores/authStore';
import FirstDashboardState from '@/components/dashboard/engineeringcomponents/institutions/FirstDashboardStates.vue';
import EmptyDashboardState from '@/components/dashboard/engineeringcomponents/institutions/EmptyDashboardStates.vue';
import CertificateDialog from '@/components/dashboard/engineeringcomponents/institutions/CertificateDialog.vue';


const authStore = useAuthStore();
const instituteData = ref([]);
const teachingCenters = ref([]);
const isLoading = ref(true);
const userCID = computed(() => authStore.user?.cid);

// Certificate dialog state
const showCertificateDialog = ref(false);
const selectedCenter = ref(null);

// Computed properties for conditional rendering
const hasNoApplications = computed(() => instituteData.value.length === 0);

const hasApprovedApplications = computed(() => {
  return instituteData.value.some(app => app.review_decision === 'Approved');
});

const hasPendingApplications = computed(() => {
  return !hasApprovedApplications.value &&
    instituteData.value.some(app => app.review_decision === 'Pending');
});

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
    // Check if dpr_name exists and is not null
    if (app.dpr_name) {
      departmentNames.add(app.dpr_name);
    }
  });
  return departmentNames.size;
});


const applicationStatusCounts = computed(() => {
  const counts = { Pending: 0, Approved: 0, Regret: 0 };
  instituteData.value.forEach(app => {
    if (app.review_decision === 'Pending') {
      counts.Pending++;
    } else if (app.review_decision === 'Approved') {
      counts.Approved++;
    } else if (app.review_decision === 'Regret') {
      counts.Regret++;
    }
  });
  return counts;
});

const departmentStatusCounts = computed(() => {
  const counts = { Pending: 0, Approved: 0, Regret: 0 };
  instituteData.value.forEach(app => {
    if (app.do_dpr_review_decision === 'Pending') {
      counts.Pending++;
    } else if (app.do_dpr_review_decision === 'Approved') {
      counts.Approved++;
    } else if (app.do_dpr_review_decision === 'Regret') {
      counts.Regret++;
    }
  });
  return counts;
});

const recentApplications = computed(() => {
  return [...instituteData.value]  // Create a copy
    .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
    .slice(0, 10);
});

// Updated status class functions
const getStatusTextClass = (status) => {
  switch (status) {
    case 'Pending':
      return 'text-amber-700 font-medium';
    case 'Approved':
      return 'text-emerald-700 font-medium';
    case 'Regret':
      return 'text-red-700 font-medium';
    default:
      return 'text-gray-700 font-medium';
  }
};

// Certificate dialog methods
const openCertificateDialog = (center) => {
  console.log('Opening certificate dialog for center:', center); // Debug log
  selectedCenter.value = center;
  showCertificateDialog.value = true;
};

const closeCertificateDialog = () => {
  showCertificateDialog.value = false;
  selectedCenter.value = null;
};

// Fetch Data
onMounted(async () => {
  try {
    isLoading.value = true;
    const response = await apiservices.getEpcInstitutes();
    const allInstitutes = response.data.results || [];

    // Filter data based on user's CID
    instituteData.value = allInstitutes.filter(institute => institute.CID === userCID.value);
    console.log(instituteData.value);

    // Fetch teaching centers
    try {
      const tcResponse = await apiservices.getEpcTeachingCenters();
      if (tcResponse && tcResponse.data && tcResponse.data.results) {
        // Store teaching centers
        teachingCenters.value = tcResponse.data.results;
        console.log('Teaching centers:', teachingCenters.value);
      }
    } catch (tcError) {
      console.error('Error fetching teaching centers:', tcError);
    }
  } catch (error) {
    console.error('Error fetching institute data:', error);
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
@keyframes custom-bounce {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-5px);
  }
}

.animate-custom-bounce {
  animation: custom-bounce 1.5s infinite ease-in-out;
}
</style>