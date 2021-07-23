<template>
  <div class="p-6 font-sans">
    <h1 class="text-2xl font-bold mb-6">Track Accreditation Applications</h1>

    <div class="mb-6 flex gap-4">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search by Application ID or Institute..."
        class="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-1/3"
      />

      <select
        v-model="selectedStatus"
        class="px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">All Statuses</option>
        <option v-for="status in uniqueStatuses" :key="status" :value="status">{{ status }}</option>
      </select>
    </div>

    <div v-if="loading" class="text-center py-10">
      <div class="animate-spin inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" role="status">
          <span class="sr-only">Loading...</span>
      </div>
      <p class="mt-2 text-gray-600">Loading applications...</p>
    </div>
    <div v-else-if="error" class="text-center py-10 text-red-500">
        <p>Error loading applications: {{ error }}</p>
    </div>

    <div v-else class="overflow-x-auto">
      <table class="min-w-full bg-white border border-gray-200">
         <thead>
          <tr class="bg-gray-100">
            <th class="py-3 px-4 text-left border-b font-semibold text-gray-600">Application ID</th>
            <th class="py-3 px-4 text-left border-b font-semibold text-gray-600">Institute Name</th>
            <th class="py-3 px-4 text-left border-b font-semibold text-gray-600">Submission Date</th>
            <th class="py-3 px-4 text-left border-b font-semibold text-gray-600">Status</th>
            <th class="py-3 px-4 text-left border-b font-semibold text-gray-600">ISAR Deadline</th>
            <th class="py-3 px-4 text-left border-b font-semibold text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="filteredApplications.length === 0">
            <td colspan="6" class="py-4 px-4 text-center border-b text-gray-500">
              No applications found matching your criteria.
            </td>
          </tr>
          <tr
            v-for="application in filteredApplications"
            :key="application.id"
            class="hover:bg-gray-50"
          >
            <td class="py-3 px-4 border-b">{{ application.application_uid ? application.application_uid.substring(0, 8) : 'N/A' }}</td>
            <td class="py-3 px-4 border-b">{{ application.institute_profile_details.name }}</td>
            <td class="py-3 px-4 border-b">
              {{ formatDate(application.date_initial_app_submitted_to_heqc || application.created_at) }}
            </td>
            <td class="py-3 px-4 border-b">
              <span :class="getStatusClass(application.status)">
                {{ application.status_display || 'N/A' }}
              </span>
            </td>
            <td class="py-3 px-4 border-b">
              <IsarCountdown :deadline="application.isar_submission_deadline" />
            </td>
            <td class="py-3 px-4 border-b">
              <button
                @click="viewApplication(application)"
                class="bg-blue-500 hover:bg-blue-600 text-white py-1 px-3 rounded text-sm mr-2"
              >
                View Details
              </button>
              
              <button
                v-if="canSubmitIsar(application)"
                @click="openIsarModal(application)"
                class="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded text-sm"
              >
                Submit ISAR
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modals -->
    <ApplicationDetailsModal :is-open="isModalOpen" :application="selectedApplication" @close="closeModal" />
    <IsarReportModal
        :is-open="isIsarModalOpen"
        :application="selectedApplicationForIsar"
        @close="closeIsarModal"
        @submit-isar="handleIsarSubmit"
    />

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useToast } from 'vue-toastification';
import apiService from '@/services/services';
import ApplicationDetailsModal from './ApplicationDetailsModal.vue';
import IsarReportModal from './IsarReportModal.vue';
import IsarCountdown from './IsarCountdown.vue';

const applications = ref([]);
const loading = ref(true);
const error = ref(null);
const searchQuery = ref('');
const selectedStatus = ref('');
const toast = useToast();

const isModalOpen = ref(false);
const selectedApplication = ref(null);

const isIsarModalOpen = ref(false);
const selectedApplicationForIsar = ref(null);

const fetchApplications = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await apiService.getAccreditationApplications();
    applications.value = response.data.results || response.data || [];
  } catch (err) {
    console.error('Error fetching accreditation applications:', err);
    error.value = 'Failed to load applications.';
    toast.error(error.value);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchApplications);

const uniqueStatuses = computed(() => {
  const statuses = new Set(applications.value.map(app => app.status_display));
  return Array.from(statuses).sort();
});

const filteredApplications = computed(() => {
  return applications.value.filter(app => {
    const appName = app.institute_profile_details?.name || '';
    const appUID = app.application_uid || '';
    const matchesSearch =
      appName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      appUID.toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesStatus = selectedStatus.value ? app.status_display === selectedStatus.value : true;
    return matchesSearch && matchesStatus;
  });
});

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const getStatusClass = (statusKey) => {
    const mapping = {
        'draft_initial': 'bg-gray-200 text-gray-800',
        'pending_payment': 'bg-yellow-100 text-yellow-800',
        'initial_app_submitted_heqc_review': 'bg-blue-100 text-blue-800',
        'initial_app_rejected': 'bg-red-100 text-red-800',
        'initial_app_approved_awaiting_isar': 'bg-green-100 text-green-800',
        'isar_submitted_heqc_review': 'bg-indigo-100 text-indigo-800',
        'approved_accredited': 'bg-green-200 text-green-900 font-bold',
        'rejected_not_accredited': 'bg-red-200 text-red-900 font-bold',
        'coi_pending_declaration': 'bg-purple-100 text-purple-800',
        'site_visit_scheduled': 'bg-pink-100 text-pink-800',
        'assessment_report_submitted': 'bg-teal-100 text-teal-800',
    };
    return `inline-block py-1 px-2 rounded text-xs font-medium ${mapping[statusKey] || 'bg-gray-100 text-gray-800'}`;
};

const isDeadlinePassed = (deadlineString) => {
    if (!deadlineString) return false;
    const deadline = new Date(deadlineString);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Compare dates only, ignoring time
    return deadline < today;
};

const canSubmitIsar = (application) => {
  // Rule 1: The status must be exactly 'initial_app_approved_awaiting_isar'.
  if (application.status !== 'initial_app_approved_awaiting_isar') {
    return false;
  }
  
  // Rule 2: The deadline must not have passed.
  if (isDeadlinePassed(application.isar_submission_deadline)) {
      return false;
  }

  return true;
};

// Functions for Details Modal
const viewApplication = (application) => {
  selectedApplication.value = application;
  isModalOpen.value = true;
};
const closeModal = () => {
  isModalOpen.value = false;
  selectedApplication.value = null;
};

// Functions to control the ISAR Modal
const openIsarModal = (application) => {
    selectedApplicationForIsar.value = application;
    isIsarModalOpen.value = true;
};

const closeIsarModal = () => {
    isIsarModalOpen.value = false;
    selectedApplicationForIsar.value = null;
};

const handleIsarSubmit = async (formData) => {
    try {
        // This flag tells the backend to perform a final submission,
        // which includes changing the application status.
        formData.append('is_final_submission', 'true');

        // The API now returns the updated main application object
        const response = await apiService.createIsarReport(formData);
        const updatedApplication = response.data;

        // For better performance, we find and replace the single updated
        // application in our local list instead of re-fetching everything.
        const index = applications.value.findIndex(app => app.id === updatedApplication.id);
        if (index !== -1) {
            applications.value[index] = updatedApplication;
        } else {
            // As a fallback, refresh the entire list if the item isn't found
            await fetchApplications();
        }

        toast.success('ISAR submitted successfully! The application status has been updated.');
        closeIsarModal();

    } catch (err) {
        console.error('Error submitting ISAR:', err.response?.data || err);
        const errorMsg = err.response?.data?.detail || 'Failed to submit ISAR. Please check the form and try again.';
        toast.error(errorMsg);
    }
};

</script>

<style scoped>
@keyframes spin {
  to { transform: rotate(360deg); }
}
.animate-spin {
  animation: spin 1s linear infinite;
}
</style>