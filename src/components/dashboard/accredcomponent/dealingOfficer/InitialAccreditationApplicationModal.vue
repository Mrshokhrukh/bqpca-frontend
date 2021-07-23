<template>
  <transition name="fade">
    <div
      v-if="show"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
      @click.self="closeModal"
    >
      <div class="relative my-8 flex w-full max-w-5xl flex-col rounded-lg bg-white shadow-xl mx-4">

        <!-- Modal Header -->
        <div class="flex items-center justify-between border-b border-gray-200 p-4">
          <h5 class="text-xl font-semibold text-gray-800">Review Initial Accreditation Application</h5>
          <button @click="closeModal" class="rounded-full p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-600 focus:outline-none">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Modal Body (Scrollable) -->
        <div class="space-y-8 overflow-y-auto p-6" style="max-height: 80vh;">
          <!-- Loading State -->
          <div v-if="isLoading" class="my-16 text-center">
            <div class="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
            <p class="mt-4 text-gray-600">Loading application details...</p>
          </div>

          <!-- Error State -->
          <div v-if="!isLoading && error" class="border-l-4 border-red-500 bg-red-100 p-4 text-red-700" role="alert">
            <p class="font-bold">An Error Occurred</p>
            <p>{{ error }}</p>
          </div>

          <!-- Application Details (Read-Only) -->
          <div v-if="!isLoading && !error" class="space-y-6">

            <!-- Overview Section -->
            <div class="rounded-lg border bg-gray-50 p-6 shadow-sm">
              <h3 class="mb-4 text-lg font-semibold text-gray-800">Application Overview</h3>
              <dl class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div class="sm:col-span-1">
                  <dt class="text-sm font-medium text-gray-500">Name of HEI</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ application.institute_profile_name_display }}</dd>
                </div>
                <div v-if="application.application_schedule_details" class="sm:col-span-1">
                  <dt class="text-sm font-medium text-gray-500">Application Schedule</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ `${application.application_schedule_details.schedule_name} (${application.application_schedule_details.from_date} to ${application.application_schedule_details.end_date})` }}</dd>
                </div>
                <div v-if="application.fee_amount_payable !== null" class="sm:col-span-1">
                  <dt class="text-sm font-medium text-gray-500">Application Fee</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ `Nu. ${application.fee_amount_payable}` }}</dd>
                </div>
                <div class="sm:col-span-1">
                  <dt class="text-sm font-medium text-gray-500">Current Status</dt>
                  <dd class="mt-1 text-sm text-gray-900"><span :class="['inline-flex rounded-full px-2 text-xs font-semibold leading-5', statusBadgeClass(application.status)]">{{ application.status_display }}</span></dd>
                </div>
                <div class="sm:col-span-1">
                  <dt class="text-sm font-medium text-gray-500">Cycle Applied For</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ application.accreditation_cycle_display }}</dd>
                </div>
                <div v-if="application.accreditation_cycle === 'other'" class="sm:col-span-1">
                  <dt class="text-sm font-medium text-gray-500">Specified Other Cycle</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ application.accreditation_cycle_other_specify }}</dd>
                </div>
              </dl>
            </div>

            <!-- Submitted Documents Section (FIXED) -->
            <div class="rounded-lg border bg-white p-6 shadow-sm">
              <h3 class="mb-4 text-lg font-semibold text-gray-800">Part I: Submitted Documents</h3>
              <!-- Corrected v-if condition -->
              <div v-if="!application.application_documents?.length" class="text-sm text-gray-500">No documents were submitted for this section.</div>
              <ul v-else class="space-y-2">
                <!-- Corrected v-for loop -->
                <li v-for="doc in application.application_documents" :key="doc.id" class="flex items-center justify-between rounded-md border bg-gray-50 p-2">
                  <span class="text-sm font-medium text-gray-800">{{ doc.document_type_details?.name || 'Document' }}</span>
                  <a :href="doc.document_file" target="_blank" class="inline-flex items-center rounded-md border border-transparent bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 hover:bg-blue-200">
                    <svg class="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    View/Download
                  </a>
                </li>
              </ul>
            </div>

            <!-- Course/Programme Details Section -->
            <div class="rounded-lg border bg-white p-6 shadow-sm">
              <h3 class="mb-4 text-lg font-semibold text-gray-800">Part II: Course/Programme Details</h3>
              <div v-if="!application.application_courses?.length" class="text-sm text-gray-500">No courses/programmes were listed.</div>
              <div v-else class="space-y-4">
                <div v-for="(course, index) in application.application_courses" :key="index" class="rounded-md border border-blue-200 bg-blue-50 p-4">
                  <h4 class="mb-3 border-b border-blue-100 pb-2 text-md font-semibold text-blue-800">Course/Programme {{ index + 1 }}: {{ course.course_programme_title }}</h4>
                  <dl class="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div>
                      <dt class="text-sm font-medium text-gray-500">Awarding Body</dt>
                      <dd class="mt-1 text-sm text-gray-900">{{ course.awarding_body || 'N/A' }}</dd>
                    </div>
                    <div>
                      <dt class="text-sm font-medium text-gray-500">Level (BQF)</dt>
                      <dd class="mt-1 text-sm text-gray-900">{{ course.level_as_per_bqf || 'N/A' }}</dd>
                    </div>
                    <div>
                      <dt class="text-sm font-medium text-gray-500">Current Students</dt>
                      <dd class="mt-1 text-sm text-gray-900">{{ course.current_student_number }}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>

            <!-- Officer's Action Panel -->
            <fieldset class="mt-8 rounded-lg border-2 border-gray-300 bg-gray-50 p-4">
              <legend class="px-2 text-lg font-semibold text-gray-700">Officer's Action</legend>
              <div class="space-y-4">
                <div>
                  <label for="remarks" class="block text-sm font-medium text-gray-700">Remarks / Reason for Decision</label>
                  <textarea id="remarks" v-model="remarks" rows="4" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" placeholder="Provide a clear reason for approval or rejection. This will be sent to the institute."></textarea>
                  <p v-if="decisionError" class="mt-1 text-sm text-red-600">{{ decisionError }}</p>
                </div>
                <div class="flex justify-end space-x-3">
                  <button @click="makeDecision('reject')" :disabled="isSubmittingDecision" class="inline-flex items-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 disabled:opacity-50">
                    <span v-if="isSubmittingDecision && decisionType === 'reject'" class="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></span>
                    Reject Application
                  </button>
                  <button @click="makeDecision('approve')" :disabled="isSubmittingDecision" class="inline-flex items-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 disabled:opacity-50">
                    <span v-if="isSubmittingDecision && decisionType === 'approve'" class="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></span>
                    Approve Application
                  </button>
                </div>
              </div>
            </fieldset>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch } from 'vue';
import apiService from '@/services/services';

// --- PROPS & EMITS ---
const props = defineProps({
  show: Boolean,
  applicationId: Number,
});
const emit = defineEmits(['close', 'decision-made']);


// --- COMPONENT STATE ---
const isLoading = ref(false);
const error = ref(null);
const application = ref({});
const remarks = ref('');
const isSubmittingDecision = ref(false);
const decisionType = ref('');
const decisionError = ref('');


// --- METHODS ---
const closeModal = () => {
  if (!isSubmittingDecision.value) {
    emit('close');
  }
};

const resetState = () => {
  isLoading.value = false;
  error.value = null;
  application.value = {};
  remarks.value = '';
  isSubmittingDecision.value = false;
  decisionType.value = '';
  decisionError.value = '';
};

const fetchApplicationDetails = async () => {
  if (!props.applicationId) return;
  isLoading.value = true;
  error.value = null;
  try {
    const response = await apiService.getAccreditationApplication(props.applicationId);
    application.value = response.data;
  } catch (err) {
    console.error("Failed to fetch application details:", err);
    error.value = "Could not load application details. Please try again.";
  } finally {
    isLoading.value = false;
  }
};

const makeDecision = async (type) => {
  decisionError.value = '';
  if (type === 'reject' && !remarks.value.trim()) {
    decisionError.value = 'Remarks are required for rejecting an application.';
    return;
  }
  if (!confirm(`Are you sure you want to ${type} this application? This action will notify the institute.`)) {
    return;
  }

  isSubmittingDecision.value = true;
  decisionType.value = type;
  try {
    const payload = new FormData();
    payload.append('remarks', remarks.value);

    if (type === 'approve') {
      payload.append('status', 'initial_app_approved_awaiting_isar');
    } else {
      payload.append('status', 'initial_app_rejected');
    }

    await apiService.patchAccreditationApplication(props.applicationId, payload);
    alert(`Application successfully ${type}ed!`);
    emit('decision-made');

  } catch (err) {
    console.error(`Failed to ${type} application:`, err.response?.data || err);
    const errorData = err.response?.data;
    if (errorData) {
        decisionError.value = errorData.detail || errorData.remarks?.[0] || errorData.status?.[0] || 'An unknown error occurred.';
    } else {
        decisionError.value = `An error occurred. Please try again.`;
    }
  } finally {
    isSubmittingDecision.value = false;
    decisionType.value = '';
  }
};

const statusBadgeClass = (statusKey) => {
  const mapping = {
    'initial_app_submitted_heqc_review': 'bg-blue-100 text-blue-800',
    'initial_app_approved_awaiting_isar': 'bg-green-100 text-green-800',
    'initial_app_rejected': 'bg-red-100 text-red-800',
  };
  return mapping[statusKey] || 'bg-gray-100 text-gray-800';
};


// --- WATCHER ---
watch(() => props.show, (newVal) => {
  if (newVal) {
    resetState();
    fetchApplicationDetails();
  }
}, { immediate: true });
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>