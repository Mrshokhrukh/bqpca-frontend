<template>
  <div>
    <!-- Main Application Review Modal -->
    <transition name="fade">
      <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" @click.self="closeModal">
        <div class="relative my-8 flex w-full max-w-5xl flex-col rounded-2xl bg-gray-50 shadow-xl max-h-[90vh]">
          <!-- Header -->
          <div class="flex items-start justify-between border-b p-5 bg-white rounded-t-2xl">
            <div>
              <h5 class="text-xl font-semibold text-gray-800">
                Review Initial Accreditation Application
              </h5>
              <p v-if="!isLoading && application.id" class="text-sm text-gray-500 mt-1">For: {{ application.institute_profile_name_display }}</p>
            </div>
            <button @click="closeModal" class="p-2 rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-600 focus:outline-none transition-colors">
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <!-- Body -->
          <div class="flex-grow space-y-6 overflow-y-auto p-6">
            <!-- Loading State -->
            <div v-if="isLoading" class="flex flex-col items-center justify-center my-16 text-center">
              <div class="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-indigo-600"></div>
              <p class="mt-4 text-gray-600">Loading application details...</p>
            </div>

            <!-- Error State -->
            <div v-if="!isLoading && error" class="border-l-4 border-red-500 bg-red-100 p-4 text-red-700 rounded-r-lg" role="alert">
              <p class="font-bold">An Error Occurred</p>
              <p>{{ error }}</p>
            </div>

            <!-- Application Details -->
            <div v-if="!isLoading && !error && application.id" class="space-y-6">
              <!-- Overview Card -->
              <fieldset class="p-6 bg-white rounded-xl border shadow-sm">
                <legend class="text-lg font-semibold text-gray-800 px-2">Application Overview</legend>
                <dl class="mt-4 grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2 md:grid-cols-3 text-sm">
                  <div class="sm:col-span-1">
                    <dt class="font-medium text-gray-500">Name of HEI</dt>
                    <dd class="mt-1 font-semibold text-gray-900">{{ application.institute_profile_name_display }}</dd>
                  </div>
                  <div v-if="application.application_schedule_details" class="sm:col-span-2">
                    <dt class="font-medium text-gray-500">Application Schedule</dt>
                    <dd class="mt-1 text-gray-900">{{ `${application.application_schedule_details.schedule_name} (${application.application_schedule_details.from_date} to ${application.application_schedule_details.end_date})` }}</dd>
                  </div>
                  <div v-if="application.fee_amount_payable !== null" class="sm:col-span-1">
                    <dt class="font-medium text-gray-500">Application Fee</dt>
                    <dd class="mt-1 text-gray-900">{{ `Nu. ${application.fee_amount_payable}` }}</dd>
                  </div>
                  <div class="sm:col-span-1">
                    <dt class="font-medium text-gray-500">Current Status</dt>
                    <dd class="mt-1">
                      <span :class="['inline-flex rounded-full px-3 py-1 text-xs font-semibold leading-5', statusBadgeClass(application.status)]">{{ application.status_display }}</span>
                    </dd>
                  </div>
                  <div class="sm:col-span-1">
                    <dt class="font-medium text-gray-500">Cycle Applied For</dt>
                    <dd class="mt-1 text-gray-900">
                      {{ application.accreditation_cycle_display }}
                      <span v-if="application.accreditation_cycle === 'other'" class="text-gray-600 italic">({{ application.accreditation_cycle_other_specify }})</span>
                    </dd>
                  </div>
                </dl>
              </fieldset>

              <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- Documents Card -->
                <fieldset class="p-6 bg-white rounded-xl border shadow-sm">
                  <legend class="text-lg font-semibold text-gray-800 px-2">Part I: Submitted Documents</legend>
                  <div v-if="!application.application_documents?.length" class="mt-4 text-sm text-gray-500 italic">
                    No documents were submitted for this section.
                  </div>
                  <ul v-else class="mt-4 space-y-3">
                    <li v-for="doc in application.application_documents" :key="doc.id" class="flex items-center justify-between rounded-lg border bg-gray-50 p-3">
                      <span class="text-sm font-medium text-gray-800">{{ doc.document_type_details?.name || 'Document' }}</span>
                      <a :href="doc.document_file" target="_blank" rel="noopener noreferrer" class="inline-flex items-center rounded-md bg-indigo-100 px-3 py-1.5 text-sm font-medium text-indigo-700 hover:bg-indigo-200 transition-colors">
                        <svg class="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                        View
                      </a>
                    </li>
                  </ul>
                </fieldset>

                <!-- Courses Card -->
                <fieldset class="p-6 bg-white rounded-xl border shadow-sm">
                  <legend class="text-lg font-semibold text-gray-800 px-2">Part II: Course/Programme Details</legend>
                  <div v-if="!application.application_courses?.length" class="mt-4 text-sm text-gray-500 italic">
                    No courses/programmes were listed.
                  </div>
                  <div v-else class="mt-4 space-y-4">
                    <div v-for="(course, index) in application.application_courses" :key="index" class="rounded-lg border border-blue-200 bg-blue-50/50 p-4">
                      <h4 class="mb-3 border-b border-blue-100 pb-2 text-md font-semibold text-blue-800">{{ course.course_programme_title }}</h4>
                      <dl class="grid grid-cols-1 gap-4 sm:grid-cols-3 text-sm">
                        <div>
                          <dt class="font-medium text-gray-500">Awarding Body</dt>
                          <dd class="mt-1 text-gray-900">{{ course.awarding_body || 'N/A' }}</dd>
                        </div>
                        <div>
                          <dt class="font-medium text-gray-500">Level (BQF)</dt>
                          <dd class="mt-1 text-gray-900">{{ course.level_as_per_bqf || 'N/A' }}</dd>
                        </div>
                        <div>
                          <dt class="font-medium text-gray-500">Students</dt>
                          <dd class="mt-1 text-gray-900">{{ course.current_student_number }}</dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                </fieldset>
              </div>

              <!-- Action/Summary Section -->
              <div v-if="application.id">
                <fieldset v-if="isActionable" class="p-6 bg-white rounded-xl border-2 border-dashed border-indigo-300">
                  <legend class="text-lg font-semibold text-gray-700 px-2">Officer's Action</legend>
                  <div class="mt-4 space-y-4">
                    <div>
                      <label for="remarks" class="block text-sm font-medium text-gray-700">Remarks / Reason for Decision</label>
                      <textarea id="remarks" v-model="remarks" rows="4" class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" placeholder="Provide a clear reason for approval or rejection. This will be sent to the institute."></textarea>
                      <p v-if="decisionError" class="mt-1 text-sm text-red-600">{{ decisionError }}</p>
                    </div>
                    <div class="flex justify-end space-x-3">
                      <button @click="requestConfirmation('reject')" :disabled="isSubmittingDecision" class="inline-flex items-center gap-2 rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed">
                        <span v-if="isSubmittingDecision && decisionType === 'reject'" class="h-4 w-4 animate-spin rounded-full border-b-2 border-white"></span>
                        Reject Application
                      </button>
                      <button @click="requestConfirmation('approve')" :disabled="isSubmittingDecision" class="inline-flex items-center gap-2 rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed">
                        <span v-if="isSubmittingDecision && decisionType === 'approve'" class="h-4 w-4 animate-spin rounded-full border-b-2 border-white"></span>
                        Approve for ISAR
                      </button>
                    </div>
                  </div>
                </fieldset>
                <div v-else class="mt-8 rounded-lg border bg-gray-100 p-6 shadow-sm">
                  <h3 class="text-lg font-semibold text-gray-800">Decision Summary</h3>
                  <p class="mt-2 text-sm text-gray-600">A decision has already been recorded for this application and no further action is required at this stage.</p>
                  <div class="mt-4 rounded-md border border-gray-200 bg-white p-4">
                    <dl class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <dt class="text-sm font-medium text-gray-500">Final Status</dt>
                            <dd class="mt-1 text-md font-semibold text-gray-900">{{ application.status_display }}</dd>
                        </div>
                        <div v-if="application.heqc_review_remarks_initial_app">
                            <dt class="text-sm font-medium text-gray-500">Remarks Provided</dt>
                            <dd class="mt-1 text-sm text-gray-800 whitespace-pre-wrap">{{ application.heqc_review_remarks_initial_app }}</dd>
                        </div>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="flex justify-end items-center p-4 bg-gray-100 border-t rounded-b-2xl">
            <button @click="closeModal" class="px-5 py-2.5 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 transition-colors">Close</button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Confirmation Dialog -->
    <transition name="fade">
      <div v-if="isConfirming" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/70" @click.self="handleCancelConfirmation">
        <div class="relative mx-4 w-full max-w-md rounded-2xl bg-white shadow-xl">
          <!-- Dialog Header -->
          <div class="flex items-center justify-between border-b p-4">
            <h3 class="text-lg font-semibold text-gray-900">{{ confirmDialogOptions.title }}</h3>
            <button @click="handleCancelConfirmation" class="p-1 rounded-full text-gray-400 hover:bg-gray-200 hover:text-gray-600 focus:outline-none transition-colors">
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <!-- Dialog Body -->
          <div class="p-6">
            <div class="flex items-start space-x-4">
              <div class="flex-shrink-0">
                <div :class="['mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10', confirmDialogOptions.confirmVariant === 'danger' ? 'bg-red-100' : 'bg-green-100']">
                    <svg :class="['h-6 w-6', confirmDialogOptions.confirmVariant === 'danger' ? 'text-red-600' : 'text-green-600']" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
                </div>
              </div>
              <div class="flex-1 mt-1">
                <p class="text-sm text-gray-700">{{ confirmDialogOptions.message }}</p>
              </div>
            </div>
          </div>

          <!-- Dialog Footer -->
          <div class="flex justify-end space-x-3 bg-gray-50 px-6 py-4 rounded-b-2xl">
            <button @click="handleCancelConfirmation" class="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
              {{ confirmDialogOptions.cancelText }}
            </button>
            <button @click="handleConfirm" :class="['inline-flex items-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2', confirmDialogOptions.confirmVariant === 'danger' ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' : 'bg-green-600 hover:bg-green-700 focus:ring-green-500']">
              {{ confirmDialogOptions.confirmText }}
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useToast } from 'vue-toastification'
import apiService from '@/services/services'

const props = defineProps({
  show: Boolean,
  applicationId: Number,
})
const emit = defineEmits(['close', 'decision-made'])
const toast = useToast()

const isLoading = ref(false)
const error = ref(null)
const application = ref({})
const remarks = ref('')
const isSubmittingDecision = ref(false)
const decisionType = ref('')
const decisionError = ref('')

// Confirmation dialog state
const isConfirming = ref(false)
const confirmDialogOptions = ref({
  title: '',
  message: '',
  confirmText: '',
  cancelText: 'Cancel',
  confirmVariant: 'danger',
  onConfirm: () => {},
})

const isActionable = computed(() => {
  return application.value?.status === 'initial_app_submitted_heqc_review'
})

const closeModal = () => {
  if (!isSubmittingDecision.value) {
    emit('close')
  }
}

const resetState = () => {
  isLoading.value = false
  error.value = null
  application.value = {}
  remarks.value = ''
  isSubmittingDecision.value = false
  decisionType.value = ''
  decisionError.value = ''
}

const fetchApplicationDetails = async () => {
  if (!props.applicationId) return
  isLoading.value = true
  error.value = null
  try {
    const response = await apiService.getAccreditationApplication(props.applicationId)
    application.value = response.data
    remarks.value = application.value.heqc_review_remarks_initial_app || ''
  } catch (err) {
    console.error('Failed to fetch application details:', err)
    error.value = 'Could not load application details. Please try again.'
    toast.error(error.value)
  } finally {
    isLoading.value = false
  }
}

// Show confirmation dialog instead of toast
const requestConfirmation = (type) => {
  decisionError.value = ''
  if (type === 'reject' && !remarks.value.trim()) {
    decisionError.value = 'Remarks are required for rejecting an application.'
    toast.warning(decisionError.value)
    return
  }

  // Set up confirmation dialog options
  confirmDialogOptions.value = {
    title: type === 'approve' ? 'Approve Application' : 'Reject Application',
    message: `You are about to ${type} this application. This action will notify the institute and cannot be undone. Are you sure you want to proceed?`,
    confirmText: type === 'approve' ? 'Yes, Approve' : 'Yes, Reject',
    cancelText: 'Cancel',
    confirmVariant: type === 'approve' ? 'success' : 'danger',
    onConfirm: () => submitDecision(type),
  }

  // Show the confirmation dialog
  isConfirming.value = true
}

// Submit decision after confirmation
const submitDecision = async (type) => {
  isSubmittingDecision.value = true
  decisionType.value = type
  try {
    const payload = new FormData()
    payload.append('heqc_review_remarks_initial_app', remarks.value)

    if (type === 'approve') {
      payload.append('status', 'initial_app_approved_awaiting_isar')
    } else {
      payload.append('status', 'initial_app_rejected')
    }

    await apiService.patchAccreditationApplication(props.applicationId, payload)

    const successMessage = `Application has been successfully ${
      type === 'approve' ? 'approved' : 'rejected'
    }.`
    toast.success(successMessage)

    emit('decision-made')
  } catch (err) {
    console.error(`Failed to ${type} application:`, err.response?.data || err)

    const errorData = err.response?.data
    let errorMessage = 'An unexpected error occurred. Please try again.'
    if (errorData) {
      errorMessage =
        errorData.detail ||
        errorData.remarks?.[0] ||
        errorData.status?.[0] ||
        'An unknown API error occurred.'
    }

    decisionError.value = errorMessage
    toast.error(errorMessage)
  } finally {
    isSubmittingDecision.value = false
    decisionType.value = ''
  }
}

// Confirmation dialog handlers
const handleConfirm = () => {
  if (confirmDialogOptions.value.onConfirm) {
    confirmDialogOptions.value.onConfirm()
  }
  isConfirming.value = false
}

const handleCancelConfirmation = () => {
  isConfirming.value = false
}

const statusBadgeClass = (statusKey) => {
  const mapping = {
    initial_app_submitted_heqc_review: 'bg-blue-100 text-blue-800',
    initial_app_approved_awaiting_isar: 'bg-green-100 text-green-800',
    initial_app_rejected: 'bg-red-100 text-red-800',
  }
  return mapping[statusKey] || 'bg-gray-100 text-gray-800'
}

watch(
  () => props.show,
  (newVal) => {
    if (newVal) {
      resetState()
      fetchApplicationDetails()
    }
  },
  { immediate: true }
)
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
