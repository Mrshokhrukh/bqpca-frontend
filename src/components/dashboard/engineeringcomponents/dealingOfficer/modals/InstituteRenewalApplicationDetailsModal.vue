<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed z-50 inset-0 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div
        class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
      >
        <!-- Background overlay -->
        <div
          class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
          @click="closeModal"
        ></div>

        <!-- Modal panel -->
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true"> </span>
        <div
          class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
        >
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  Institute Details
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    Viewing details for
                    {{ applicationDetails.name_of_institution || 'Unknown Institute' }}.
                    <!-- Indicate if expired -->
                    <span
                      v-if="isExpired(applicationDetails.valid_till)"
                      class="text-red-600 font-semibold ml-2"
                      >(Expired)</span
                    >
                  </p>
                </div>
              </div>
            </div>

            <!-- Main content section - institute details -->
            <div v-if="!showPromptDialog" class="mt-5 max-h-96 overflow-y-auto">
              <dl class="divide-y divide-gray-200">
                <!-- Institute Information -->
                <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt class="text-sm font-medium text-gray-500">Institute Name</dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {{ applicationDetails.name_of_institution || 'N/A' }}
                  </dd>
                </div>
                <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt class="text-sm font-medium text-gray-500">Is Active?</dt>
                  <dd
                    class="mt-1 text-sm sm:mt-0 sm:col-span-2"
                    :class="
                      applicationDetails.is_active
                        ? 'text-green-600 font-semibold'
                        : 'text-red-600 font-semibold'
                    "
                  >
                    {{ applicationDetails.is_active ? 'Yes' : 'No' }}
                  </dd>
                </div>
                <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt class="text-sm font-medium text-gray-500">Course Title</dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {{ applicationDetails.title_of_course || 'N/A' }}
                  </dd>
                </div>
                <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt class="text-sm font-medium text-gray-500">Course Duration</dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {{ applicationDetails.course_duration || 'N/A' }}
                    {{ applicationDetails.course_duration === 1 ? 'year' : 'years' }}
                  </dd>
                </div>
                <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt class="text-sm font-medium text-gray-500">Commencement Date</dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {{ formatDate(applicationDetails.commencement_date) }}
                  </dd>
                </div>
                <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt class="text-sm font-medium text-gray-500">Last Review Status</dt>
                  <dd class="mt-1 sm:mt-0 sm:col-span-2">
                    <span :class="getStatusClass(applicationDetails.review_decision)">
                      {{ applicationDetails.review_decision || 'N/A' }}
                    </span>
                  </dd>
                </div>
                <div
                  v-if="applicationDetails.valid_since"
                  class="py-4 sm:grid sm:grid-cols-3 sm:gap-4"
                >
                  <dt class="text-sm font-medium text-gray-500">Valid Since</dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {{ formatDate(applicationDetails.valid_since) }}
                  </dd>
                </div>
                <div
                  v-if="applicationDetails.valid_till"
                  class="py-4 sm:grid sm:grid-cols-3 sm:gap-4"
                >
                  <dt class="text-sm font-medium text-gray-500">Valid Till</dt>
                  <dd
                    class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2"
                    :class="{
                      'text-red-600 font-semibold': isExpired(applicationDetails.valid_till),
                    }"
                  >
                    {{ formatDate(applicationDetails.valid_till) }}
                  </dd>
                </div>

                <!-- Applicant Information -->
                <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt class="text-sm font-medium text-gray-500">Applicant Name</dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {{ applicationDetails.full_name || 'N/A' }}
                  </dd>
                </div>
                <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt class="text-sm font-medium text-gray-500">CID</dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {{ applicationDetails.CID || 'N/A' }}
                  </dd>
                </div>
                <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt class="text-sm font-medium text-gray-500">Contact Number</dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {{ applicationDetails.contact_no || 'N/A' }}
                  </dd>
                </div>
                <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt class="text-sm font-medium text-gray-500">Email</dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {{ applicationDetails.email_address || 'N/A' }}
                  </dd>
                </div>

                <!-- Address Information -->
                <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt class="text-sm font-medium text-gray-500">Address</dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {{ applicationDetails.address || 'N/A' }}<br />
                    {{ applicationDetails.village || ''
                    }}{{ applicationDetails.village && applicationDetails.chiwog ? ', ' : ''
                    }}{{ applicationDetails.chiwog || '' }}<br />
                    {{ applicationDetails.gewog || ''
                    }}{{ applicationDetails.gewog && applicationDetails.dzongkhag ? ', ' : ''
                    }}{{ applicationDetails.dzongkhag || '' }}<br />
                    {{
                      applicationDetails.country === 'BT'
                        ? 'Bhutan'
                        : applicationDetails.country || ''
                    }}
                  </dd>
                </div>

                <!-- Documents Section -->
                <div
                  v-if="applicationDetails.supporting_documents"
                  class="py-4 sm:grid sm:grid-cols-3 sm:gap-4"
                >
                  <dt class="text-sm font-medium text-gray-500">Supporting Documents</dt>
                  <dd class="mt-1 text-sm text-blue-600 sm:mt-0 sm:col-span-2">
                    <a
                      :href="applicationDetails.supporting_documents"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="hover:underline"
                      >View Document</a
                    >
                  </dd>
                </div>

                <!-- Rejection Reason if applicable -->
                <div
                  v-if="applicationDetails.reason_if_rejected"
                  class="py-4 sm:grid sm:grid-cols-3 sm:gap-4"
                >
                  <dt class="text-sm font-medium text-gray-500">Reason for Regret/Rejection</dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {{ applicationDetails.reason_if_rejected }}
                  </dd>
                </div>
              </dl>
            </div>

            <!-- Prompt Dialog (Conditional) -->
            <div v-if="showPromptDialog" class="mt-5">
              <div class="border-b border-gray-200 pb-4 mb-4">
                <h3 class="text-lg leading-6 font-medium text-gray-900">
                  {{
                    actionType === 'approve' ? 'Approve Registration' : 'Regret/Reject Registration'
                  }}
                </h3>
                <p class="mt-1 text-sm text-gray-500">
                  {{
                    actionType === 'approve'
                      ? 'Please provide an optional message for this approval:'
                      : 'Please provide a reason for this rejection:'
                  }}
                </p>
              </div>

              <div class="mb-4">
                <label for="message-input" class="block text-sm font-medium text-gray-700 mb-1">
                  {{
                    actionType === 'approve' ? 'Approval Message (Optional)' : 'Rejection Reason'
                  }}
                  <span v-if="actionType === 'regret'" class="text-red-500">*</span>
                </label>
                <textarea
                  id="message-input"
                  v-model="actionMessage"
                  rows="4"
                  class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  :placeholder="
                    actionType === 'approve'
                      ? 'Enter an optional message...'
                      : 'Enter reason for rejection...'
                  "
                  :class="{ 'border-red-500': actionType === 'regret' && messageError }"
                ></textarea>
                <p v-if="actionType === 'regret' && messageError" class="mt-1 text-sm text-red-600">
                  {{ messageError }}
                </p>
              </div>

              <div class="flex justify-end space-x-3">
                <button
                  type="button"
                  class="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
                  @click="cancelAction"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  class="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm"
                  :class="
                    actionType === 'approve'
                      ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                      : 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                  "
                  @click="confirmAction"
                >
                  {{ actionType === 'approve' ? 'Confirm Approval' : 'Confirm Rejection' }}
                </button>
              </div>
            </div>
          </div>

          <!-- Footer with Action Buttons (only shown when not in prompt mode) -->
          <div
            v-if="!showPromptDialog"
            class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse"
          >
            <!-- Approve Button: Always shown, calls initiateApprove -->
            <button
              type="button"
              class="ml-3 w-auto inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:text-sm"
              @click="initiateApprove"
              :title="
                isExpired(applicationDetails.valid_till)
                  ? 'Approve/Reactivate this expired registration'
                  : 'Approve this registration'
              "
            >
              Approve
            </button>
            <!-- Regret Button: Always shown, calls initiateRegret -->
            <button
              type="button"
              class="ml-3 w-auto inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm"
              @click="initiateRegret"
              title="Regret/Reject this registration"
            >
              Regret
            </button>
            <!-- Close Button -->
            <button
              type="button"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              @click="closeModal"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { defineProps, defineEmits, ref } from 'vue'

defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  applicationDetails: {
    type: Object,
    default: () => ({}),
  },
  isProcessingAction: Boolean,
})

const emit = defineEmits(['close-modal', 'approve-application', 'regret-application'])

// --- For Modal Prompt ---
const showPromptDialog = ref(false)
const actionType = ref('') // 'approve' or 'regret'
const actionMessage = ref('')
const messageError = ref('')

// --- Methods for handling actions with better prompts ---

const initiateApprove = () => {
  // Show the prompt dialog with approve mode
  actionType.value = 'approve'
  actionMessage.value = '' // Clear any previous message
  messageError.value = '' // Clear any previous error
  showPromptDialog.value = true
}

const initiateRegret = () => {
  // Show the prompt dialog with regret mode
  actionType.value = 'regret'
  actionMessage.value = '' // Clear any previous message
  messageError.value = '' // Clear any previous error
  showPromptDialog.value = true
}

const confirmAction = () => {
  // Validate message if this is a regret action
  if (actionType.value === 'regret' && !actionMessage.value.trim()) {
    messageError.value = 'A reason is required to regret/reject this registration.'
    return
  }

  // Clear any previous errors
  messageError.value = ''

  // Emit the appropriate event based on action type
  if (actionType.value === 'approve') {
    console.log('Emitting approve-application with message:', actionMessage.value)
    emit('approve-application', actionMessage.value.trim())
  } else {
    console.log('Emitting regret-application with reason:', actionMessage.value)
    emit('regret-application', actionMessage.value.trim())
  }

  // Reset the prompt dialog
  resetPrompt()
}

const cancelAction = () => {
  // User cancelled, just reset the prompt
  resetPrompt()
}

const resetPrompt = () => {
  showPromptDialog.value = false
  actionType.value = ''
  actionMessage.value = ''
  messageError.value = ''
}

const closeModal = () => {
  // Reset prompt if it's open
  resetPrompt()
  // Close the entire modal
  emit('close-modal')
}

// --- Utility Functions ---

const isExpired = (validTillDateString) => {
  if (!validTillDateString) return false
  try {
    const validTillDate = new Date(validTillDateString)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    validTillDate.setHours(0, 0, 0, 0) // Compare dates only
    return validTillDate < today
  } catch {
    return false // Invalid date format
  }
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'Invalid Date'
    return date.toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return 'Invalid Date'
  }
}

const getStatusClass = (status) => {
  // Use the same logic as the parent component for consistency
  switch (status) {
    case 'Approved':
      return 'px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800'
    case 'Regretted':
    case 'Rejected':
      return 'px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800'
    case 'Pending':
    case 'Submitted':
      return 'px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800'
    default:
      return 'px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800'
  }
}
</script>

<style scoped>
/* Styles for the modal */
.max-h-96 {
  max-height: 24rem;
}
</style>
