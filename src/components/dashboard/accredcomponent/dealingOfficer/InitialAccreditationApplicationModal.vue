<template>
  <!-- Main Application Review Modal -->
  <transition name="fade">
    <div
      v-if="show"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
      @click.self="closeModal"
    >
      <div class="relative my-8 flex w-full max-w-5xl flex-col rounded-lg bg-white shadow-xl mx-4">
        <!-- Header -->
        <div class="flex items-center justify-between border-b border-gray-200 p-4">
          <h5 class="text-xl font-semibold text-gray-800">Review Initial Accreditation Application</h5>
          <button @click="closeModal" class="rounded-full p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-600 focus:outline-none">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <!-- Body -->
        <div class="space-y-8 overflow-y-auto p-6" style="max-height: 80vh;">
          <!-- Loading State -->
          <div v-if="isLoading" class="my-16 text-center">
            <div class="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
            <p class="mt-4 text-gray-600">Loading application details...</p>
          </div>

          <!-- Error State -->
          <div v-if="!isLoading && error" class="border-l-4 border-red-500 bg-red-100 p-4 text-red-700" role="alert">
            <p class="font-bold">An Error Occurred</p><p>{{ error }}</p>
          </div>

          <!-- Application Details -->
          <div v-if="!isLoading && !error && application.id" class="space-y-6">
            <!-- Overview, Documents, and Course sections (unchanged) -->
            <div class="rounded-lg border bg-gray-50 p-6 shadow-sm">
              <h3 class="mb-4 text-lg font-semibold text-gray-800">Application Overview</h3>
              <dl class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div class="sm:col-span-1"><dt class="text-sm font-medium text-gray-500">Name of HEI</dt><dd class="mt-1 text-sm text-gray-900">{{ application.institute_profile_name_display }}</dd></div>
                <div v-if="application.application_schedule_details" class="sm:col-span-1"><dt class="text-sm font-medium text-gray-500">Application Schedule</dt><dd class="mt-1 text-sm text-gray-900">{{ `${application.application_schedule_details.schedule_name} (${application.application_schedule_details.from_date} to ${application.application_schedule_details.end_date})` }}</dd></div>
                <div v-if="application.fee_amount_payable !== null" class="sm:col-span-1"><dt class="text-sm font-medium text-gray-500">Application Fee</dt><dd class="mt-1 text-sm text-gray-900">{{ `Nu. ${application.fee_amount_payable}` }}</dd></div>
                <div class="sm:col-span-1"><dt class="text-sm font-medium text-gray-500">Current Status</dt><dd class="mt-1 text-sm text-gray-900"><span :class="['inline-flex rounded-full px-2 text-xs font-semibold leading-5', statusBadgeClass(application.status)]">{{ application.status_display }}</span></dd></div>
                <div class="sm:col-span-1"><dt class="text-sm font-medium text-gray-500">Cycle Applied For</dt><dd class="mt-1 text-sm text-gray-900">{{ application.accreditation_cycle_display }}</dd></div>
                <div v-if="application.accreditation_cycle === 'other'" class="sm:col-span-1"><dt class="text-sm font-medium text-gray-500">Specified Other Cycle</dt><dd class="mt-1 text-sm text-gray-900">{{ application.accreditation_cycle_other_specify }}</dd></div>
              </dl>
            </div>
            <div class="rounded-lg border bg-white p-6 shadow-sm">
              <h3 class="mb-4 text-lg font-semibold text-gray-800">Part I: Submitted Documents</h3>
              <div v-if="!application.application_documents?.length" class="text-sm text-gray-500">No documents were submitted for this section.</div>
              <ul v-else class="space-y-2"><li v-for="doc in application.application_documents" :key="doc.id" class="flex items-center justify-between rounded-md border bg-gray-50 p-2"><span class="text-sm font-medium text-gray-800">{{ doc.document_type_details?.name || 'Document' }}</span><a :href="doc.document_file" target="_blank" rel="noopener noreferrer" class="inline-flex items-center rounded-md border border-transparent bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 hover:bg-blue-200"><svg class="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg> View/Download</a></li></ul>
            </div>
            <div class="rounded-lg border bg-white p-6 shadow-sm">
              <h3 class="mb-4 text-lg font-semibold text-gray-800">Part II: Course/Programme Details</h3>
              <div v-if="!application.application_courses?.length" class="text-sm text-gray-500">No courses/programmes were listed.</div>
              <div v-else class="space-y-4"><div v-for="(course, index) in application.application_courses" :key="index" class="rounded-md border border-blue-200 bg-blue-50 p-4"><h4 class="mb-3 border-b border-blue-100 pb-2 text-md font-semibold text-blue-800">Course/Programme {{ index + 1 }}: {{ course.course_programme_title }}</h4><dl class="grid grid-cols-1 gap-4 sm:grid-cols-3"><div><dt class="text-sm font-medium text-gray-500">Awarding Body</dt><dd class="mt-1 text-sm text-gray-900">{{ course.awarding_body || 'N/A' }}</dd></div><div><dt class="text-sm font-medium text-gray-500">Level (BQF)</dt><dd class="mt-1 text-sm text-gray-900">{{ course.level_as_per_bqf || 'N/A' }}</dd></div><div><dt class="text-sm font-medium text-gray-500">Current Students</dt><dd class="mt-1 text-sm text-gray-900">{{ course.current_student_number }}</dd></div></dl></div></div>
            </div>

            <!-- Action/Summary Section -->
            <div v-if="application.id">
              <fieldset v-if="isActionable" class="mt-8 rounded-lg border-2 border-gray-300 bg-gray-50 p-4">
                <legend class="px-2 text-lg font-semibold text-gray-700">Officer's Action</legend>
                <div class="space-y-4">
                  <div>
                    <label for="remarks" class="block text-sm font-medium text-gray-700">Remarks / Reason for Decision</label>
                    <textarea id="remarks" v-model="remarks" rows="4" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" placeholder="Provide a clear reason for approval or rejection. This will be sent to the institute."></textarea>
                    <p v-if="decisionError" class="mt-1 text-sm text-red-600">{{ decisionError }}</p>
                  </div>
                  <div class="flex justify-end space-x-3">
                    <button @click="requestConfirmation('reject')" :disabled="isSubmittingDecision" class="inline-flex items-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"><span v-if="isSubmittingDecision && decisionType === 'reject'" class="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></span> Reject Application</button>
                    <button @click="requestConfirmation('approve')" :disabled="isSubmittingDecision" class="inline-flex items-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"><span v-if="isSubmittingDecision && decisionType === 'approve'" class="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></span> Approve Application</button>
                  </div>
                </div>
              </fieldset>
              <div v-else class="mt-8 rounded-lg border bg-gray-100 p-6 shadow-sm">
                <h3 class="text-lg font-semibold text-gray-800">Decision Summary</h3>
                <p class="mt-2 text-sm text-gray-600">A decision has already been recorded for this application and no further action is required at this stage.</p>
                <div class="mt-4 rounded-md border border-gray-200 bg-white p-4">
                    <p class="text-sm font-medium text-gray-500">Final Status</p><p class="text-md font-semibold text-gray-900">{{ application.status_display }}</p>
                    <template v-if="application.heqc_review_remarks_initial_app"><p class="mt-3 text-sm font-medium text-gray-500">Remarks Provided</p><p class="mt-1 text-sm text-gray-800 whitespace-pre-wrap">{{ application.heqc_review_remarks_initial_app }}</p></template>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </transition>

  <!-- Confirmation Dialog -->
  <transition name="fade">
    <div
      v-if="isConfirming"
      class="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50"
      @click.self="handleCancelConfirmation"
    >
      <div class="relative mx-4 w-full max-w-md rounded-lg bg-white shadow-xl">
        <!-- Dialog Header -->
        <div class="flex items-center justify-between border-b border-gray-200 p-4">
          <h3 class="text-lg font-semibold text-gray-900">{{ confirmDialogOptions.title }}</h3>
          <button @click="handleCancelConfirmation" class="rounded-full p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-600 focus:outline-none">
            <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Dialog Body -->
        <div class="p-6">
          <div class="flex items-start space-x-3">
            <!-- Warning Icon -->
            <div class="flex-shrink-0">
              <svg class="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L3.316 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div class="flex-1">
              <p class="text-sm text-gray-700">{{ confirmDialogOptions.message }}</p>
            </div>
          </div>
        </div>

        <!-- Dialog Footer -->
        <div class="flex justify-end space-x-3 border-t border-gray-200 px-6 py-4">
          <button
            @click="handleCancelConfirmation"
            class="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {{ confirmDialogOptions.cancelText }}
          </button>
          <button
            @click="handleConfirm"
            :class="[
              'inline-flex items-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2',
              confirmDialogOptions.confirmVariant === 'danger'
                ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                : 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
            ]"
          >
            {{ confirmDialogOptions.confirmText }}
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { useToast } from 'vue-toastification';
import apiService from '@/services/services';

const props = defineProps({
  show: Boolean,
  applicationId: Number,
});
const emit = defineEmits(['close', 'decision-made']);
const toast = useToast();

const isLoading = ref(false);
const error = ref(null);
const application = ref({});
const remarks = ref('');
const isSubmittingDecision = ref(false);
const decisionType = ref('');
const decisionError = ref('');

// Confirmation dialog state
const isConfirming = ref(false);
const confirmDialogOptions = ref({
  title: '',
  message: '',
  confirmText: '',
  cancelText: 'Cancel',
  confirmVariant: 'danger',
  onConfirm: () => {},
});

const isActionable = computed(() => {
  return application.value?.status === 'initial_app_submitted_heqc_review';
});

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
    remarks.value = application.value.heqc_review_remarks_initial_app || '';
  } catch (err) {
    console.error("Failed to fetch application details:", err);
    error.value = "Could not load application details. Please try again.";
    toast.error(error.value);
  } finally {
    isLoading.value = false;
  }
};

// Show confirmation dialog instead of toast
const requestConfirmation = (type) => {
  decisionError.value = '';
  if (type === 'reject' && !remarks.value.trim()) {
    decisionError.value = 'Remarks are required for rejecting an application.';
    toast.warning(decisionError.value);
    return;
  }

  // Set up confirmation dialog options
  confirmDialogOptions.value = {
    title: type === 'approve' ? 'Approve Application' : 'Reject Application',
    message: `You are about to ${type} this application. This action will notify the institute and cannot be undone. Are you sure you want to proceed?`,
    confirmText: type === 'approve' ? 'Yes, Approve' : 'Yes, Reject',
    cancelText: 'Cancel',
    confirmVariant: type === 'approve' ? 'success' : 'danger',
    onConfirm: () => submitDecision(type),
  };

  // Show the confirmation dialog
  isConfirming.value = true;
};

// Submit decision after confirmation
const submitDecision = async (type) => {
  isSubmittingDecision.value = true;
  decisionType.value = type;
  try {
    const payload = new FormData();
    payload.append('heqc_review_remarks_initial_app', remarks.value);

    if (type === 'approve') {
      payload.append('status', 'initial_app_approved_awaiting_isar');
    } else {
      payload.append('status', 'initial_app_rejected');
    }

    await apiService.patchAccreditationApplication(props.applicationId, payload);

    const successMessage = `Application has been successfully ${type === 'approve' ? 'approved' : 'rejected'}.`;
    toast.success(successMessage);

    emit('decision-made');

  } catch (err) {
    console.error(`Failed to ${type} application:`, err.response?.data || err);

    const errorData = err.response?.data;
    let errorMessage = 'An unexpected error occurred. Please try again.';
    if (errorData) {
        errorMessage = errorData.detail || errorData.remarks?.[0] || errorData.status?.[0] || 'An unknown API error occurred.';
    }

    decisionError.value = errorMessage;
    toast.error(errorMessage);

  } finally {
    isSubmittingDecision.value = false;
    decisionType.value = '';
  }
};

// Confirmation dialog handlers
const handleConfirm = () => {
  if (confirmDialogOptions.value.onConfirm) {
    confirmDialogOptions.value.onConfirm();
  }
  isConfirming.value = false;
};

const handleCancelConfirmation = () => {
  isConfirming.value = false;
};

const statusBadgeClass = (statusKey) => {
  const mapping = {
    'initial_app_submitted_heqc_review': 'bg-blue-100 text-blue-800',
    'initial_app_approved_awaiting_isar': 'bg-green-100 text-green-800',
    'initial_app_rejected': 'bg-red-100 text-red-800',
  };
  return mapping[statusKey] || 'bg-gray-100 text-gray-800';
};

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