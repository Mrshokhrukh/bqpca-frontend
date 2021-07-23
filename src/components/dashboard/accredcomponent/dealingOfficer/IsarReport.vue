<!-- IsarReport.vue -->
<template>
  <div class="p-8 bg-gray-50 min-h-screen">
    <div class="max-w-7xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-800 mb-6">ISAR Applications Dashboard</h1>

      <!-- Loading and Error States -->
      <div v-if="isLoading" class="text-center p-10">
        <p class="text-gray-600">Loading applications...</p>
      </div>
      <div v-else-if="error" class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
        <p>{{ error }}</p>
      </div>

      <!-- Applications Table -->
      <div v-else class="bg-white shadow-md rounded-lg overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-100">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Institute Name</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Application ID</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submission Date</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Application Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned Assessor(s)</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="app in applications" :key="app.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ app.application_details.institute_profile_details.name }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                {{ app.application_details.application_uid.slice(0, 8) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ app.isar_submission_date_by_institute ? new Date(app.isar_submission_date_by_institute).toLocaleDateString() : 'N/A' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <span :class="getStatusClass(app.application_details.status)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                  {{ app.application_details.status_display }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                <div v-if="app.application_details.assessor_cois_details && app.application_details.assessor_cois_details.length > 0">
                    <span v-for="coi in app.application_details.assessor_cois_details" :key="coi.id" class="block">
                        {{ coi.assessor_details.name }}
                    </span>
                </div>
                <span v-else class="text-gray-400 italic">Not Assigned</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button @click="openReportModal(app)" class="text-indigo-600 hover:text-indigo-900">
                  View Details
                </button>
              </td>
            </tr>
             <tr v-if="applications.length === 0">
                <td colspan="6" class="text-center py-10 text-gray-500">No ISAR applications requiring action were found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <IsarReportModal
      v-if="isModalOpen && selectedApplication"
      :is-open="isModalOpen"
      :isar-data="selectedApplication"
      :assessors="availableAssessors"
      @close="closeReportModal"
      @action-completed="handleActionCompletion"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import IsarReportModal from './IsarReportModal.vue';
import apiService from '@/services/services';

const applications = ref([]);
const availableAssessors = ref([]);
const selectedApplication = ref(null);
const isModalOpen = ref(false);
const isLoading = ref(true);
const error = ref(null);

const fetchData = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    const [appsRes, assessorsRes] = await Promise.all([
      apiService.getIsarReports(),
      apiService.getMastersAssessorPools(),
    ]);
    applications.value = appsRes.data.results || [];
    availableAssessors.value = (assessorsRes.data.results || []).map(assessor => ({
        id: assessor.id,
        name: assessor.name || assessor.full_name
    }));
  } catch (err) {
    console.error("Failed to fetch data:", err);
    error.value = "Could not load application data. Please try again later.";
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchData);

const openReportModal = (application) => {
  selectedApplication.value = application;
  isModalOpen.value = true;
};

const closeReportModal = () => {
  isModalOpen.value = false;
  selectedApplication.value = null;
};

const handleActionCompletion = () => {
  closeReportModal();
  fetchData();
};

const getStatusClass = (status) => {
  const classes = {
    'draft_initial': 'bg-gray-100 text-gray-800',
    'initial_app_submitted_heqc_review': 'bg-blue-100 text-blue-800',
    'initial_app_approved_awaiting_isar': 'bg-purple-100 text-purple-800',
    'coi_pending_declaration': 'bg-yellow-100 text-yellow-800',
    'coi_conflict_declared': 'bg-red-100 text-red-800',
    'coi_resolved_scheduling_visit': 'bg-teal-100 text-teal-800',
    'site_visit_scheduled': 'bg-indigo-100 text-indigo-800',
    'assessor_report_submitted': 'bg-cyan-100 text-cyan-800',
    'approved_accredited': 'bg-green-100 text-green-800',
    'rejected_by_heqc': 'bg-red-100 text-red-800',
  };
  return classes[status] || 'bg-gray-100 text-gray-800';
};
</script>