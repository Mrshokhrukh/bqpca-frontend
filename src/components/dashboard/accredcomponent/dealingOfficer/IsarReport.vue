<template>
  <div class="p-8 bg-gray-50 min-h-screen">
    <div class="mx-auto">
      <h1 class="text-3xl font-bold text-gray-800 mb-6">Institutional Self Assessment Report</h1>

      <!-- Loading and Error States -->
      <div v-if="isLoading" class="text-center p-10">
        <p class="text-gray-600">Loading applications...</p>
      </div>
      <div v-else-if="error" class="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
        <p>{{ error }}</p>
      </div>

      <!-- Main Application Table -->
      <div v-else class="bg-white shadow-md rounded-lg overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-100">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Institute Name</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Application ID</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Application Status</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Final Outcome</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="applications.length === 0">
                <td colspan="5" class="text-center py-10 text-gray-500">No ISAR applications were found.</td>
            </tr>
            <tr v-for="app in applications" :key="app.id" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ app.application_details?.institute_profile_details?.name || 'N/A' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                {{ app.application_details?.application_uid?.slice(0, 8) || 'N/A' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <!-- Priority 1: Reschedule Request -->
                <span v-if="isRescheduleRequested(app)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800">
                  Reschedule Requested
                </span>

                <!-- Priority 2: Conflict Declared (FIXED LOGIC) -->
                <!-- We now check the helper function 'hasActiveConflict' OR the status string -->
                <span v-else-if="hasActiveConflict(app) || app.application_details?.status === 'coi_conflict_declared'" class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                  </svg>
                  Conflict Declared
                </span>

                <!-- Default Status -->
                <span v-else :class="getStatusClass(app.application_details?.status)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                  {{ app.application_details?.status_display || 'Unknown Status' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                <div v-if="app.application_details?.final_grade_awarded_details">
                  <p class="font-bold text-gray-900">{{ app.application_details.final_grade_awarded_details.rating_category_name }}</p>
                  <p v-if="app.application_details.status === 'approved_accredited'" class="text-xs text-green-700">
                    Valid: {{ formatDate(app.application_details.accreditation_validity_from) }} - {{ formatDate(app.application_details.accreditation_validity_to) }}
                  </p>
                </div>
                <span v-else class="text-gray-400 italic">Pending</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button @click="openReportModal(app)" class="text-indigo-600 hover:text-indigo-900">
                  View Details
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Component Call -->
    <IsarReportModal
      v-if="isModalOpen && selectedApplication"
      :is-open="isModalOpen"
      :isar-data="selectedApplication"
      :assessors="availableAssessors"
      :rating-categories="ratingCategories"
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
const ratingCategories = ref([]);
const selectedApplication = ref(null);
const isModalOpen = ref(false);
const isLoading = ref(true);
const error = ref(null);

const fetchData = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    const [appsRes, assessorsRes, ratingsRes] = await Promise.all([
      apiService.getIsarReports(),
      apiService.getMastersAssessorPools(),
      apiService.getMastersRatingCategories(),
    ]);
    applications.value = appsRes.data.results || [];
    availableAssessors.value = (assessorsRes.data.results || []).map(assessor => ({
        id: assessor.id,
        name: assessor.name || assessor.full_name
    }));
    ratingCategories.value = ratingsRes.data.results || [];
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

// --- NEW FUNCTION: Check nested COI records for conflicts ---
// This ensures the table updates even if the status string lags behind
const hasActiveConflict = (app) => {
  const cois = app.application_details?.assessor_cois_details;
  if (!cois || !Array.isArray(cois)) return false;
  return cois.some(coi => coi.status === 'conflict_declared');
};

const isRescheduleRequested = (app) => {
  const visit = app.application_details?.site_visits?.[0];
  return (
    app.application_details?.status === 'site_visit_scheduled' &&
    visit &&
    visit.is_confirmed_by_institute === false &&
    !!visit.institute_confirmation_remarks
  );
};

const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-CA');
    } catch (e) {
        return 'Invalid Date';
    }
};

const getStatusClass = (status) => {
  const classes = {
    'draft_initial': 'bg-gray-100 text-gray-800',
    'pending_payment': 'bg-yellow-100 text-yellow-800',
    'initial_app_submitted_heqc_review': 'bg-blue-100 text-blue-800',
    'initial_app_approved_awaiting_isar': 'bg-purple-100 text-purple-800',
    'isar_submitted_heqc_review': 'bg-blue-100 text-blue-800',
    'isar_queried_by_heqc': 'bg-orange-100 text-orange-800',
    'isar_accepted_by_heqc': 'bg-teal-100 text-teal-800',
    'coi_pending_declaration': 'bg-yellow-100 text-yellow-800',
    'coi_conflict_declared': 'bg-red-200 text-red-800',
    'coi_resolved_scheduling_visit': 'bg-teal-100 text-teal-800',
    'site_visit_scheduled': 'bg-indigo-100 text-indigo-800',
    'site_visit_confirmed': 'bg-indigo-200 text-indigo-900',
    'assessment_report_submitted': 'bg-cyan-100 text-cyan-800',
    'approved_accredited': 'bg-green-100 text-green-800',
    'rejected_not_accredited': 'bg-red-100 text-red-800',
    'appealed': 'bg-pink-100 text-pink-800',
  };
  return classes[status] || 'bg-gray-100 text-gray-800';
};
</script>