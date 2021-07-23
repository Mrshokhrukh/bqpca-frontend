<template>
  <div class="p-6 font-sans">
    <h1 class="text-2xl font-bold mb-6">Track Accreditation Applications</h1>

    <!-- Search and Filter Controls -->
    <div class="mb-6 flex gap-4">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search by Application Ref or Institute..."
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

    <!-- Loading and Error States -->
    <div v-if="loading" class="text-center py-10">
      <div class="animate-spin inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full" role="status">
          <span class="sr-only">Loading...</span>
      </div>
      <p class="mt-2 text-gray-600">Loading applications...</p>
    </div>
    <div v-else-if="error" class="text-center py-10 text-red-500">
        <p>Error loading applications: {{ error }}</p>
    </div>

    <!-- Applications Table -->
    <div v-else class="overflow-x-auto">
      <table class="min-w-full bg-white border border-gray-200">
         <thead>
          <tr class="bg-gray-100">
            <th class="py-3 px-4 text-left border-b font-semibold text-gray-600">Application Ref #</th>
            <th class="py-3 px-4 text-left border-b font-semibold text-gray-600">Institute Name</th>
            <th class="py-3 px-4 text-left border-b font-semibold text-gray-600">Submission Date</th>
            <th class="py-3 px-4 text-left border-b font-semibold text-gray-600">Status</th>
            <th class="py-3 px-4 text-left border-b font-semibold text-gray-600">Validity Period</th>
            <th class="py-3 px-4 text-left border-b font-semibold text-gray-600">ISAR Deadline</th>
            <th class="py-3 px-4 text-left border-b font-semibold text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="filteredApplications.length === 0">
            <td colspan="7" class="py-4 px-4 text-center border-b text-gray-500">
              No applications found matching your criteria.
            </td>
          </tr>
          <tr
            v-for="application in filteredApplications"
            :key="application.id"
            class="hover:bg-gray-50"
          >
            <!-- === UPDATED TO SHOW THE NEW HUMAN-READABLE REFERENCE NUMBER === -->
            <td class="py-3 px-4 border-b font-medium text-gray-700">
                {{ application.application_reference_no || application.application_uid.substring(0, 8) }}
            </td>
            <td class="py-3 px-4 border-b">{{ application.institute_profile_details.name }}</td>
            <td class="py-3 px-4 border-b">
              {{ formatDate(application.date_initial_app_submitted_to_heqc || application.created_at) }}
            </td>
            <td class="py-3 px-4 border-b">
              <span :class="getStatusClass(application.status)">
                {{ application.status_display || 'N/A' }}
              </span>
            </td>
            <td class="py-3 px-4 border-b text-sm">
              <div v-if="application.status === 'approved_accredited' && application.accreditation_validity_from">
                  <span class="font-semibold text-green-700">{{ formatDate(application.accreditation_validity_from) }}</span>
                  <span class="text-gray-500"> to </span>
                  <span class="font-semibold text-green-700">{{ formatDate(application.accreditation_validity_to) }}</span>
              </div>
              <span v-else class="text-gray-400">N/A</span>
            </td>
            <td class="py-3 px-4 border-b text-sm">
              <div v-if="application.status === 'initial_app_approved_awaiting_isar'">
                <IsarCountdown :deadline="application.isar_submission_deadline" />
              </div>
              <div v-else-if="application.isar_report?.date_isar_formally_submitted">
                  <span class="font-medium text-gray-700">Submitted:</span><br>
                  <span class="text-gray-600">{{ formatDate(application.isar_report.date_isar_formally_submitted) }}</span>
              </div>
              <span v-else class="text-gray-400">N/A</span>
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
              <button
                v-if="application.status === 'approved_accredited'"
                @click="openCertificateModal(application)"
                class="bg-purple-500 hover:bg-purple-600 text-white py-1 px-3 rounded text-sm"
              >
                View Certificate
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- All Modals are placed here -->
    <ApplicationDetailsModal
        :is-open="isModalOpen"
        :application="selectedApplication"
        @close="closeModal"
    />

    <IsarReportModal
        :is-open="isIsarModalOpen"
        :application="selectedApplicationForIsar"
        @close="closeIsarModal"
        @submit-isar="handleIsarSubmit"
    />

    <AccreCertificateModal
        :is-open="isCertificateModalOpen"
        :application="selectedApplicationForCertificate"
        @close="closeCertificateModal"
    />

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useToast } from 'vue-toastification';
import apiService from '@/services/services';

// Component Imports
import ApplicationDetailsModal from './ApplicationDetailsModal.vue';
import IsarReportModal from './IsarReportModal.vue';
import IsarCountdown from './IsarCountdown.vue';
import AccreCertificateModal from '@/components/common/Accreditation/AccreCertificateModal.vue';

// Reactive State
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

const isCertificateModalOpen = ref(false);
const selectedApplicationForCertificate = ref(null);

// Fetching Data
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

// Computed Properties
const uniqueStatuses = computed(() => {
  if (!Array.isArray(applications.value)) return [];
  const statuses = new Set(applications.value.map(app => app.status_display));
  return Array.from(statuses).sort();
});

const filteredApplications = computed(() => {
  if (!Array.isArray(applications.value)) return [];
  return applications.value.filter(app => {
    // UPDATED: Search now includes the new reference number
    const appName = app.institute_profile_details?.name || '';
    const appRef = app.application_reference_no || '';
    const appUID = app.application_uid || ''; // Fallback search

    const lowerCaseQuery = searchQuery.value.toLowerCase();

    const matchesSearch =
      appName.toLowerCase().includes(lowerCaseQuery) ||
      appRef.toLowerCase().includes(lowerCaseQuery) ||
      appUID.toLowerCase().includes(lowerCaseQuery);

    const matchesStatus = selectedStatus.value ? app.status_display === selectedStatus.value : true;
    return matchesSearch && matchesStatus;
  });
});

// Helper Functions
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
        'isar_queried_by_heqc': 'bg-yellow-200 text-yellow-900',
        'isar_accepted_by_heqc': 'bg-green-200 text-green-900',
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
    today.setHours(0, 0, 0, 0);
    return deadline < today;
};

const canSubmitIsar = (application) => {
  if (application.status !== 'initial_app_approved_awaiting_isar') return false;
  if (isDeadlinePassed(application.isar_submission_deadline)) return false;
  return true;
};

// Modal Control Handlers
const viewApplication = (application) => {
  selectedApplication.value = application;
  isModalOpen.value = true;
};
const closeModal = () => {
  isModalOpen.value = false;
  selectedApplication.value = null;
};

const openIsarModal = (application) => {
    selectedApplicationForIsar.value = application;
    isIsarModalOpen.value = true;
};
const closeIsarModal = () => {
    isIsarModalOpen.value = false;
    selectedApplicationForIsar.value = null;
};

const openCertificateModal = (application) => {
  selectedApplicationForCertificate.value = application;
  isCertificateModalOpen.value = true;
};
const closeCertificateModal = () => {
  isCertificateModalOpen.value = false;
  selectedApplicationForCertificate.value = null;
};

// API Interaction
const handleIsarSubmit = async (formData) => {
    try {
        formData.append('is_final_submission', 'true');
        const response = await apiService.createIsarReport(formData);
        const updatedApplication = response.data;
        const index = applications.value.findIndex(app => app.id === updatedApplication.id);
        if (index !== -1) {
            applications.value[index] = updatedApplication;
        } else {
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