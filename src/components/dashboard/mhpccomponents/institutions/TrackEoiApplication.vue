<template>
  <div class="min-h-screen bg-gray-50 px-6 py-10">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
      <InstituteHeader
        title="Your EOI Applications"
        subtitle="View and manage all your Expression of Interest applications"
        :show-actions="false"
      />
      <button @click="openEoiModal" class="btn btn-primary ml-auto sm:ml-4 shrink-0 w-full sm:w-auto">
        <PlusIcon class="w-5 h-5 mr-2" />
        Add New EOI
      </button>
    </div>

    <div v-if="isLoading" class="flex justify-center my-12">
      <Loader class="inline-block animate-spin text-indigo-600 w-8 h-8" />
    </div>

    <div v-else-if="applications?.length > 0" class="bg-white shadow-xl rounded-2xl overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Institution Name
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Course Title
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Commencement
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Program Type (ID)
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Duration (Mths)
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Remarks / Reason
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="application in applications" :key="application.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ application.name_of_institution || 'N/A' }}</div>
                <div class="text-xs text-gray-500">License: {{ application.CID || 'N/A' }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">
                  {{ application.title_of_course || 'N/A' }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {{ application.commencement_date ? new Date(application.commencement_date).toLocaleDateString() : 'N/A' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                <!-- Displays Program Master ID. For name, API needs to provide it or another lookup is needed -->
                {{ application.type_of_programme || 'N/A' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {{ application.course_duration ? `${application.course_duration}` : 'N/A' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="[
                    'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                    getStatusColor(application.review_decision),
                  ]"
                >
                  {{ application.review_decision || 'N/A' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-normal text-sm text-gray-600 max-w-xs break-words">
                 <div v-if="application.review_decision === 'Rejected'" class="text-red-600">
                    {{ application.reason_if_rejected || 'Reason not specified' }}
                  </div>
                  <div v-else-if="application.review_decision === 'Approved'" class="text-green-700 font-medium">
                    {{ application.remarks || 'Approved, proceed with DPR.' }}
                  </div>
                   <div v-else-if="application.review_decision === 'Pending'" class="text-yellow-700 font-medium">
                    {{ application.remarks || 'Application is pending review.' }}
                  </div>
                  <div v-else class="text-gray-500 italic">
                    {{ application.remarks || 'No remarks.'}}
                  </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div
      v-else-if="!isLoading && !apiError"
      class="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-xl"
    >
      <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path vector-effect="non-scaling-stroke" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      </svg>
      <h3 class="mt-2 text-lg font-medium text-gray-800">No EOI applications found.</h3>
      <p class="mt-1 text-sm text-gray-500">Get started by submitting your first Expression of Interest.</p>
      <div class="mt-6">
        <button @click="openEoiModal" class="btn btn-primary">
          <PlusIcon class="w-5 h-5 mr-2" />
          Submit Your First EOI
        </button>
      </div>
    </div>
    <div
      v-else-if="apiError"
      class="text-center py-16 bg-red-50 rounded-2xl border border-red-200 shadow-xl"
    >
       <svg class="mx-auto h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
      <h3 class="mt-2 text-lg font-medium text-red-800">Error Fetching Applications</h3>
      <p class="mt-1 text-sm text-red-600">{{ errorMessage }}</p>
    </div>

    <!-- EOI Application Modal -->
    <InstituteEoiApplication
      v-model:modelValue="showEoiModal"
      @application-submitted="handleApplicationSubmitted"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import apiServices from '@/services/services';
import { Loader, PlusIcon } from 'lucide-vue-next'; // Assuming lucide-vue-next icons
import InstituteHeader from '@/components/common/MHPC/InstituteHeader.vue'; // Adjust path if needed
import InstituteEoiApplication from './InstituteEoiApplication.vue'; // Adjust path if needed

const applications = ref([]);
const isLoading = ref(false);
const apiError = ref(false);
const errorMessage = ref('');
const showEoiModal = ref(false);

const authStore = useAuthStore();

const getStatusColor = (status) => {
  if (!status) return 'bg-gray-100 text-gray-800';
  const lowerStatus = status.toLowerCase();
  if (lowerStatus.includes('approved')) return 'bg-green-100 text-green-800';
  if (lowerStatus.includes('rejected')) return 'bg-red-100 text-red-800';
  if (lowerStatus.includes('pending') || lowerStatus.includes('submitted')) return 'bg-yellow-100 text-yellow-800';
  return 'bg-blue-100 text-blue-800'; // Default for other statuses
};

const fetchApplications = async () => {
  if (!authStore.user || !authStore.user.cid) {
    errorMessage.value = 'User information not available. Please log in again.';
    apiError.value = true;
    isLoading.value = false;
    applications.value = []; // Clear applications on auth error
    return;
  }

  isLoading.value = true;
  apiError.value = false;
  errorMessage.value = '';

  try {
    // This API endpoint should ideally return data that includes fields from the EOI form.
    // e.g., name_of_institution, title_of_course, commencement_date, type_of_programme (ID),
    // course_duration, review_decision, reason_if_rejected, remarks.
    const response = await apiServices.getMhpcInstitutes(); // Or a specific EOI listing endpoint

    if (response && response.data && Array.isArray(response.data.results)) {
      const userCid = authStore.user.cid.toLowerCase();
      // Filter applications submitted by the current user based on CID
      applications.value = response.data.results.filter(
        (app) => app.CID && app.CID.toLowerCase() === userCid,
      );
      // Sort by creation date or ID if available, newest first
      applications.value.sort((a, b) => {
          const dateA = a.created_at ? new Date(a.created_at) : (a.id || 0);
          const dateB = b.created_at ? new Date(b.created_at) : (b.id || 0);
          if (dateA instanceof Date && dateB instanceof Date) {
              return dateB - dateA; // Newest first
          }
          return (dateB || 0) - (dateA || 0); // Fallback to ID or 0
      });

    } else {
      applications.value = [];
      console.warn('Expected results to be an array or data structure not as expected:', response?.data);
      // Optional: Set a gentle error if data format is unexpected but not a server error
      // errorMessage.value = 'Received unexpected data format for applications.';
      // apiError.value = true; // Or handle as an empty list
    }
  } catch (error) {
    console.error('Error fetching EOI applications:', error);
    applications.value = [];
    apiError.value = true;
    errorMessage.value = error.response?.data?.detail || error.response?.data?.message || 'Error fetching your applications. Please try again.';
  } finally {
    isLoading.value = false;
  }
};

const openEoiModal = () => {
  showEoiModal.value = true;
};

const handleApplicationSubmitted = () => {
  fetchApplications(); // Refresh the list of applications
  // The modal will close itself via its internal logic (emit('update:modelValue', false))
};

onMounted(() => {
  fetchApplications();
});
</script>

<style scoped>
/* Ensure btn styles are available or define them here if not globally available */
.btn {
  @apply inline-flex items-center justify-center rounded-lg border py-2.5 px-5 text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed;
}
.btn-primary {
  @apply border-transparent bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500;
}

/* Add any other specific styles for this dashboard page */
.max-w-xs {
  max-width: 20rem; /* Adjust as needed for remarks column */
}
</style>