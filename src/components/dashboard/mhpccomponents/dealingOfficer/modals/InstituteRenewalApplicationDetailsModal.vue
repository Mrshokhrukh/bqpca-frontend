<template>
  <Teleport to="body">
    <!-- Main Modal Backdrop -->
    <Transition name="modal-backdrop">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        @click.self="closeModal"
      >
        <!-- Main Modal Container -->
        <Transition name="modal">
          <div
            v-if="isOpen"
            class="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-xl shadow-2xl overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <!-- Modal Header -->
            <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
              <div class="flex items-center justify-between">
                <h2 id="modal-title" class="text-xl font-semibold text-gray-900">
                  Institute Renewal Application
                </h2>
                <button
                  @click="closeModal"
                  class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Close modal"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Modal Body -->
            <div class="overflow-y-auto max-h-[60vh] px-6 py-4">
              <div class="space-y-6">
                <!-- Application Details Grid -->
                <div class="grid gap-6">
                  <!-- Institute Name -->
                  <div class="bg-gray-50 rounded-lg p-4">
                    <label class="block text-sm font-medium text-gray-600 mb-1">
                      Institute Name
                    </label>
                    <p class="text-base font-medium text-gray-900">
                      {{ applicationDetails.name_of_institution || 'N/A' }}
                    </p>
                  </div>

                  <!-- Applicant Information -->
                  <div class="grid md:grid-cols-2 gap-4">
                    <div class="bg-gray-50 rounded-lg p-4">
                      <label class="block text-sm font-medium text-gray-600 mb-1">
                        Applicant Name
                      </label>
                      <p class="text-base text-gray-900">
                        {{ applicationDetails.full_name || 'N/A' }}
                      </p>
                    </div>
                    <div class="bg-gray-50 rounded-lg p-4">
                      <label class="block text-sm font-medium text-gray-600 mb-1">
                        Contact Number
                      </label>
                      <p class="text-base text-gray-900">
                        {{ applicationDetails.contact_no || 'N/A' }}
                      </p>
                    </div>
                  </div>

                  <!-- Supporting Documents -->
                  <div v-if="applicationDetails.institute_eoi_supporting_documents" class="bg-gray-50 rounded-lg p-4">
                    <label class="block text-sm font-medium text-gray-600 mb-2">
                      Renewal Document
                    </label>
                    <a
                      :href="applicationDetails.institute_eoi_supporting_documents"
                      target="_blank"
                      class="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 hover:text-blue-700 transition-colors"
                    >
                      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      View Document
                    </a>
                  </div>

                  <!-- Certificate Status & Renewal Information -->
                  <div class="bg-gray-50 rounded-lg p-4">
                    <label class="block text-sm font-medium text-gray-600 mb-2">
                      Certificate Status
                    </label>
                    <div class="space-y-2">
                      <div class="flex items-center justify-between">
                        <span class="text-sm text-gray-600">Current Status:</span>
                        <span
                          :class="{
                            'bg-yellow-100 text-yellow-800': getRenewalStatus === 'Pending Renewal',
                            'bg-green-100 text-green-800': getRenewalStatus === 'Active',
                            'bg-red-100 text-red-800': getRenewalStatus === 'Expired',
                            'bg-blue-100 text-blue-800': getRenewalStatus === 'Renewal In Progress'
                          }"
                          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        >
                          {{ getRenewalStatus }}
                        </span>
                      </div>
                      <div v-if="applicationDetails.valid_since" class="flex items-center justify-between">
                        <span class="text-sm text-gray-600">Valid Since:</span>
                        <span class="text-sm font-medium text-gray-900">
                          {{ formatDate(applicationDetails.valid_since) }}
                        </span>
                      </div>
                      <div v-if="applicationDetails.valid_till" class="flex items-center justify-between">
                        <span class="text-sm text-gray-600">Valid Until:</span>
                        <span
                          :class="{
                            'text-red-600 font-medium': isExpired,
                            'text-orange-600 font-medium': isExpiringSoon,
                            'text-gray-900': !isExpired && !isExpiringSoon
                          }"
                          class="text-sm"
                        >
                          {{ formatDate(applicationDetails.valid_till) }}
                          <span v-if="isExpired" class="text-xs text-red-500 ml-1">(Expired)</span>
                          <span v-else-if="isExpiringSoon" class="text-xs text-orange-500 ml-1">(Expiring Soon)</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Modal Footer -->
            <div class="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4">
              <div class="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 space-y-3 space-y-reverse sm:space-y-0">
                <button
                  @click="closeModal"
                  type="button"
                  class="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Close
                </button>

                <!-- Action Buttons (only show if renewal is needed) -->
                <template v-if="showRenewalActions">
                  <button
                    @click="openActionDialog('Regret')"
                    type="button"
                    class="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                  >
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Reject Renewal
                  </button>
                  <button
                    @click="openActionDialog('Approve')"
                    type="button"
                    class="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                  >
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Approve Renewal
                  </button>
                </template>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>

    <!-- Action Dialog (Approve/Reject) -->
    <Transition name="modal-backdrop">
      <div
        v-if="isActionDialog"
        class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        @click.self="closeActionDialog"
      >
        <Transition name="modal">
          <div
            v-if="isActionDialog"
            class="relative w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-labelledby="action-modal-title"
          >
            <!-- Dialog Header -->
            <div class="bg-white border-b border-gray-200 px-6 py-4">
              <div class="flex items-center justify-between">
                <h3 id="action-modal-title" class="text-lg font-semibold text-gray-900">
                  {{ actionType === 'Approve' ? 'Approve Renewal' : 'Reject Renewal' }}
                </h3>
                <button
                  @click="closeActionDialog"
                  class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Close dialog"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Dialog Body -->
            <div class="px-6 py-4">
              <div class="mb-4">
                <div
                  :class="{
                    'bg-green-50 border-green-200': actionType === 'Approve',
                    'bg-red-50 border-red-200': actionType === 'Regret'
                  }"
                  class="flex items-center p-3 border rounded-lg"
                >
                  <div
                    :class="{
                      'text-green-600': actionType === 'Approve',
                      'text-red-600': actionType === 'Regret'
                    }"
                    class="flex-shrink-0"
                  >
                    <svg v-if="actionType === 'Approve'" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <div class="ml-3">
                    <p
                      :class="{
                        'text-green-800': actionType === 'Approve',
                        'text-red-800': actionType === 'Regret'
                      }"
                      class="text-sm font-medium"
                    >
                      {{ actionType === 'Approve' ? 'Confirm Renewal Approval' : 'Confirm Renewal Rejection' }}
                    </p>
                    <p
                      :class="{
                        'text-green-700': actionType === 'Approve',
                        'text-red-700': actionType === 'Regret'
                      }"
                      class="text-sm"
                    >
                      {{ actionType === 'Approve'
                        ? 'This will approve the institute renewal and extend the certificate validity.'
                        : 'This will reject the institute renewal application.' }}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label for="action-message" class="block text-sm font-medium text-gray-700 mb-2">
                  {{ actionType === 'Approve' ? 'Renewal Approval Message (Optional)' : 'Renewal Rejection Reason (Required)' }}
                </label>
                <textarea
                  v-model="actionMessage"
                  id="action-message"
                  rows="4"
                  :placeholder="actionType === 'Approve'
                    ? 'Add any additional comments for renewal approval...'
                    : 'Please provide a reason for renewal rejection...'"
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-sm"
                  :class="{
                    'border-red-300 focus:ring-red-500 focus:border-red-500': actionType === 'Regret' && !actionMessage.trim()
                  }"
                ></textarea>
                <p v-if="actionType === 'Regret' && !actionMessage.trim()" class="mt-1 text-sm text-red-600">
                  A reason is required for renewal rejection.
                </p>
              </div>
            </div>

            <!-- Dialog Footer -->
            <div class="bg-gray-50 border-t border-gray-200 px-6 py-4">
              <div class="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 space-y-3 space-y-reverse sm:space-y-0">
                <button
                  @click="closeActionDialog"
                  type="button"
                  class="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  @click="submitAction"
                  type="button"
                  :disabled="actionType === 'Regret' && !actionMessage.trim()"
                  :class="{
                    'bg-green-600 hover:bg-green-700 focus:ring-green-500': actionType === 'Approve',
                    'bg-red-600 hover:bg-red-700 focus:ring-red-500': actionType === 'Regret',
                    'opacity-50 cursor-not-allowed': actionType === 'Regret' && !actionMessage.trim()
                  }"
                  class="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg v-if="actionType === 'Approve'" class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <svg v-else class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  {{ actionType === 'Approve' ? 'Approve Application' : 'Reject Application' }}
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useToast } from 'vue-toastification'
import apiService from '@/services/services'

const props = defineProps({
  isOpen: Boolean,
  applicationDetails: Object,
})

const emit = defineEmits(['close-modal', 'application-updated'])
const toast = useToast()

const isActionDialog = ref(false)
const actionType = ref('') // 'Approve' or 'Regret'
const actionMessage = ref('')

// Computed properties for renewal logic
const isExpired = computed(() => {
  if (!props.applicationDetails?.valid_till) return false
  const today = new Date()
  const validTill = new Date(props.applicationDetails.valid_till)
  return validTill < today
})

const isExpiringSoon = computed(() => {
  if (!props.applicationDetails?.valid_till || isExpired.value) return false
  const today = new Date()
  const validTill = new Date(props.applicationDetails.valid_till)
  const daysUntilExpiry = Math.ceil((validTill - today) / (1000 * 60 * 60 * 24))
  return daysUntilExpiry <= 30 && daysUntilExpiry > 0
})

const getRenewalStatus = computed(() => {
  if (!props.applicationDetails) return 'Unknown'

  // Check if there's a pending renewal decision
  if (props.applicationDetails.review_decision === 'Pending') {
    return 'Renewal In Progress'
  }

  if (isExpired.value) {
    return 'Expired'
  } else if (isExpiringSoon.value) {
    return 'Pending Renewal'
  } else {
    return 'Active'
  }
})

const showRenewalActions = computed(() => {
  // Show renewal actions if:
  // 1. Certificate is expired or expiring soon
  // 2. AND there's no pending decision already
  return (isExpired.value || isExpiringSoon.value) &&
         props.applicationDetails?.review_decision !== 'Pending'
})

// Helper function to format dates
const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const openActionDialog = (type) => {
  actionType.value = type
  actionMessage.value = '' // Reset message
  isActionDialog.value = true
}

const closeActionDialog = () => {
  isActionDialog.value = false
  actionMessage.value = ''
  actionType.value = ''
}

const submitAction = async () => {
  if (actionType.value === 'Regret' && !actionMessage.value.trim()) {
    toast.error('A reason is required to reject a renewal application.')
    return
  }

  let payload = {}
  if (actionType.value === 'Approve') {
    const currentDate = new Date()
    const validTill = new Date()
    validTill.setFullYear(validTill.getFullYear() + 1)

    payload = {
      review_decision: 'Approved',
      is_active: true,
      valid_since: currentDate.toISOString().split('T')[0],
      valid_till: validTill.toISOString().split('T')[0],
      remarks: actionMessage.value || 'Institute renewal approved.', // Use a generic `remarks` field
    }
  } else { // Regret
    payload = {
      review_decision: 'Regretted',
      reason_if_rejected: actionMessage.value,
      is_active: false, // Deactivate if renewal is rejected
    }
  }

  try {
    await apiService.patchMhpcInstitute(props.applicationDetails.id, payload)
    toast.success(`Institute renewal has been ${actionType.value.toLowerCase()}d successfully.`)
    closeActionDialog()
    emit('application-updated') // Notify parent to refresh
  } catch (error) {
    console.error(`Error ${actionType.value.toLowerCase()}ing renewal:`, error)
    toast.error(`Failed to ${actionType.value.toLowerCase()} the renewal application.`)
  }
}

const closeModal = () => {
  closeActionDialog() // Close any open dialogs
  emit('close-modal')
}
</script>

<style scoped>
/* Modal Transitions */
.modal-backdrop-enter-active,
.modal-backdrop-leave-active {
  transition: opacity 0.3s ease;
}

.modal-backdrop-enter-from,
.modal-backdrop-leave-to {
  opacity: 0;
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.9) translateY(-20px);
}
</style>