<template>
  <!-- Main Modal -->
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
      @click="close"
    >
      <div
        v-if="applicationDetails"
        class="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        @click.stop
      >
        <!-- Header -->
        <div class="p-6 border-b border-gray-100">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h2 class="text-lg font-semibold text-gray-900">Institute Renewal</h2>
              <p class="text-sm text-gray-500">{{ applicationDetails.instituteName }}</p>
            </div>
          </div>
        </div>

        <!-- Content -->
        <div class="p-6 space-y-4">
          <div class="space-y-3">
            <div class="flex justify-between py-2">
              <span class="text-sm text-gray-600">Applicant</span>
              <span class="text-sm font-medium text-gray-900">{{ applicationDetails.applicantName }}</span>
            </div>
            <div class="flex justify-between py-2">
              <span class="text-sm text-gray-600">Submitted</span>
              <span class="text-sm font-medium text-gray-900">{{ formatDate(applicationDetails.lastUpdated) }}</span>
            </div>
            <div class="flex justify-between py-2">
              <span class="text-sm text-gray-600">Current Expiry</span>
              <span class="text-sm font-medium text-gray-900">{{ formatDate(applicationDetails.expiryDate) }}</span>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="p-6 border-t border-gray-100 flex space-x-3">
          <button
            @click="showApproveDialog = true"
            :disabled="isSubmitting"
            class="flex-1 bg-green-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:bg-gray-300"
          >
            {{ isSubmitting ? 'Processing...' : 'Approve' }}
          </button>
          <button
            @click="showRejectDialog = true"
            :disabled="isSubmitting"
            class="flex-1 bg-red-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:bg-gray-300"
          >
            {{ isSubmitting ? 'Processing...' : 'Reject' }}
          </button>
          <button
            @click="close"
            :disabled="isSubmitting"
            class="px-4 py-2.5 text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </Teleport>

  <!-- Approve Dialog -->
  <Teleport to="body">
    <div
      v-if="showApproveDialog"
      class="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black bg-opacity-50"
      @click="showApproveDialog = false"
    >
      <div class="bg-white rounded-xl shadow-2xl max-w-sm w-full" @click.stop>
        <div class="p-6">
          <div class="flex items-center space-x-3 mb-4">
            <div class="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900">Approve Renewal</h3>
          </div>

          <p class="text-sm text-gray-600 mb-4">
            Add a message for the approval (optional):
          </p>

          <textarea
            v-model="approveMessage"
            rows="3"
            class="w-full p-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
            placeholder="Your approval message..."
          ></textarea>

          <div class="flex space-x-3 mt-6">
            <button
              @click="handleApprove"
              :disabled="isSubmitting"
              class="flex-1 bg-green-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:bg-gray-300"
            >
              {{ isSubmitting ? 'Approving...' : 'Confirm Approval' }}
            </button>
            <button
              @click="showApproveDialog = false"
              :disabled="isSubmitting"
              class="px-4 py-2.5 text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>

  <!-- Reject Dialog -->
  <Teleport to="body">
    <div
      v-if="showRejectDialog"
      class="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black bg-opacity-50"
      @click="showRejectDialog = false"
    >
      <div class="bg-white rounded-xl shadow-2xl max-w-sm w-full" @click.stop>
        <div class="p-6">
          <div class="flex items-center space-x-3 mb-4">
            <div class="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold text-gray-900">Reject Renewal</h3>
          </div>

          <p class="text-sm text-gray-600 mb-4">
            Please provide a reason for rejection:
          </p>

          <textarea
            v-model="rejectMessage"
            rows="3"
            class="w-full p-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
            placeholder="Reason for rejection..."
            required
          ></textarea>

          <div class="flex space-x-3 mt-6">
            <button
              @click="handleReject"
              :disabled="isSubmitting || !rejectMessage.trim()"
              class="flex-1 bg-red-600 text-white py-2.5 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:bg-gray-300"
            >
              {{ isSubmitting ? 'Rejecting...' : 'Confirm Rejection' }}
            </button>
            <button
              @click="showRejectDialog = false"
              :disabled="isSubmitting"
              class="px-4 py-2.5 text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useToast } from 'vue-toastification'
import apiService from '@/services/services'

const props = defineProps({
  isOpen: Boolean,
  applicationDetails: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['close-modal', 'application-updated'])
const toast = useToast()

const isSubmitting = ref(false)
const showApproveDialog = ref(false)
const showRejectDialog = ref(false)
const approveMessage = ref('')
const rejectMessage = ref('')

// Reset form when modal opens with new details
watch(
  () => props.applicationDetails,
  (newDetails) => {
    if (newDetails) {
      approveMessage.value = newDetails.officerRemarks || ''
      rejectMessage.value = newDetails.officerRemarks || ''
    } else {
      approveMessage.value = ''
      rejectMessage.value = ''
    }
  },
  { immediate: true, deep: true },
)

// Reset dialogs when main modal closes
watch(
  () => props.isOpen,
  (isOpen) => {
    if (!isOpen) {
      showApproveDialog.value = false
      showRejectDialog.value = false
    }
  }
)

const handleApprove = async () => {
  if (isSubmitting.value) return
  isSubmitting.value = true
  try {
    await apiService.approveInstituteRenewal(
      props.applicationDetails.instituteCID,
      props.applicationDetails.renewalId,
      { remarks: approveMessage.value },
    )
    toast.success('Renewal application approved successfully!')
    showApproveDialog.value = false
    emit('application-updated')
  } catch (error) {
    console.error('Error approving application:', error)
    toast.error(error.response?.data?.detail || 'Failed to approve application.')
  } finally {
    isSubmitting.value = false
  }
}

const handleReject = async () => {
  if (isSubmitting.value) return
  if (!rejectMessage.value.trim()) {
    toast.error('Please provide a reason for rejection.')
    return
  }
  isSubmitting.value = true
  try {
    await apiService.rejectInstituteRenewal(
      props.applicationDetails.instituteCID,
      props.applicationDetails.renewalId,
      { remarks: rejectMessage.value },
    )
    toast.warning('Renewal application has been rejected.')
    showRejectDialog.value = false
    emit('application-updated')
  } catch (error) {
    console.error('Error rejecting application:', error)
    toast.error(error.response?.data?.detail || 'Failed to reject application.')
  } finally {
    isSubmitting.value = false
  }
}

const close = () => {
  if (isSubmitting.value) return
  emit('close-modal')
}

const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
</script>