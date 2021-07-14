<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" @close="closeModal" class="relative z-50">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/80 backdrop-blur-sm" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-start justify-center p-4 sm:pt-12">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel
              class="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-gray-50 shadow-2xl transition-all max-h-screen sm:max-h-[calc(100vh-80px)] overflow-y-auto"
            >
              <!-- Modal Header -->
              <div class="px-8 py-6 bg-gradient-to-r from-indigo-500 to-blue-600 text-white">
                <div class="flex justify-between items-center">
                  <div>
                    <DialogTitle as="h3" class="text-2xl font-bold tracking-tight"
                      >ECPF Location Change Application</DialogTitle
                    >
                    <p class="mt-1 text-white/90">Application Details</p>
                  </div>
                  <button
                    type="button"
                    @click="$emit('edit')"
                    class="rounded-md text-indigo-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                    aria-label="Edit application details"
                  >
                    <PencilIcon class="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>
              </div>

              <!-- Modal Body -->
              <div v-if="applicationData" class="px-8 py-6 bg-white">
                <div class="space-y-6">
                  <!-- Current Details Section -->
                  <div class="section-card">
                    <div class="p-6">
                      <div class="flex items-center mb-4">
                        <div class="bg-blue-100 p-2 rounded-md">
                          <UserIcon class="h-5 w-5 text-blue-600" />
                        </div>
                        <h4 class="font-semibold text-gray-900 ml-2">Current Details of ECPF</h4>
                      </div>
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p><strong>ECPF Name:</strong> {{ applicationData.ecpfName }}</p>
                          <p>
                            <strong>Current Location:</strong> {{ applicationData.currentLocation }}
                          </p>
                          <p>
                            <strong>Name of Proprietor:</strong>
                            {{ applicationData.proprietorName }}
                          </p>
                        </div>
                        <div>
                          <p><strong>CID:</strong> {{ applicationData.cid }}</p>
                          <p><strong>Contact No.:</strong> {{ applicationData.contactNo }}</p>
                          <p><strong>Email Address:</strong> {{ applicationData.emailAddress }}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Proposed Change Section -->
                  <div class="section-card">
                    <div class="p-6">
                      <div class="flex items-center mb-4">
                        <div class="bg-green-100 p-2 rounded-md">
                          <DocumentTextIcon class="h-5 w-5 text-green-600" />
                        </div>
                        <h4 class="font-semibold text-gray-900 ml-2">Proposed Change</h4>
                      </div>
                      <div class="space-y-4">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label for="proposed-location" class="form-label"
                              >Proposed Location:</label
                            >
                            <input
                              type="text"
                              id="proposed-location"
                              v-model="proposedLocation"
                              placeholder="Enter location"
                              class="form-input"
                            />
                          </div>
                          <div>
                            <label for="gewog-throm" class="form-label">Gewog/Throm:</label>
                            <select
                              id="gewog-throm"
                              v-model="proposedGewogThrom"
                              class="form-select"
                            >
                              <option value="">Select Gewog/Throm</option>
                              <option value="Drujegang">Drujegang</option>
                              <option value="Chhokhor">Chhokhor</option>
                            </select>
                          </div>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label for="dzongkhag-thromde" class="form-label"
                              >Dzongkhag/Thromde:</label
                            >
                            <select
                              id="dzongkhag-thromde"
                              v-model="proposedDzongkhagThromde"
                              class="form-select"
                            >
                              <option value="">Select Dzongkhag/Thromde</option>
                              <option value="Dagana">Dagana</option>
                              <option value="Bumthang">Bumthang</option>
                            </select>
                          </div>
                          <div>
                            <label for="remarks" class="form-label">Remarks:</label>
                            <textarea
                              id="remarks"
                              v-model="proposedRemarks"
                              placeholder="Enter remarks"
                              rows="3"
                              class="form-textarea"
                            ></textarea>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Rejection Reason (Conditionally Rendered) -->
                  <div v-if="actionMode === 'reject'" class="section-card border-red-200">
                    <div class="p-6">
                      <div class="flex items-center mb-4">
                        <div class="bg-red-100 p-2 rounded-md">
                          <XMarkIcon class="h-5 w-5 text-red-600" />
                        </div>
                        <h4 class="font-semibold text-red-900 ml-2">
                          Rejection Reason <span class="text-red-500">*</span>
                        </h4>
                      </div>
                      <textarea
                        v-model="rejectionReasonMessage"
                        rows="3"
                        placeholder="Please provide the reason for rejecting this application"
                        class="form-textarea border-red-300 focus:border-red-500 focus:ring-red-500 w-full"
                        required
                      ></textarea>
                      <p
                        class="mt-1 text-sm text-red-500"
                        v-if="showValidationError && !rejectionReasonMessage.trim()"
                      >
                        Please provide a reason for rejection
                      </p>
                    </div>
                  </div>

                  <!-- Approval Message (Conditionally Rendered) -->
                  <div v-if="actionMode === 'approve'" class="section-card border-green-200">
                    <div class="p-6">
                      <div class="flex items-center mb-4">
                        <div class="bg-green-100 p-2 rounded-md">
                          <CheckIcon class="h-5 w-5 text-green-600" />
                        </div>
                        <h4 class="font-semibold text-green-900 ml-2">Approval Message</h4>
                      </div>
                      <textarea
                        v-model="approvalMessage"
                        rows="3"
                        placeholder="Enter any additional notes or instructions (optional)"
                        class="form-textarea border-green-300 focus:border-green-500 focus:ring-green-500 w-full"
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Modal Footer -->
              <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse justify-between">
                <div class="flex justify-end space-x-2">
                  <template v-if="actionMode === 'none'">
                    <button type="button" class="approve-button" @click="initiateApprove">
                      Approve
                    </button>
                    <button type="button" class="reject-button" @click="initiateReject">
                      Reject
                    </button>
                  </template>

                  <template v-else>
                    <button type="button" class="confirm-button" @click="confirmAction">
                      Confirm
                    </button>
                    <button type="button" class="cancel-action-button" @click="cancelAction">
                      Cancel
                    </button>
                  </template>
                </div>

                <button
                  type="button"
                  class="cancel-button-small"
                  @click="closeModal"
                  v-if="actionMode === 'none'"
                >
                  Close
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from '@headlessui/vue'
import { ref, watch } from 'vue'
import {
  UserIcon,
  DocumentTextIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
} from '@heroicons/vue/24/outline'

const props = defineProps({
  isOpen: Boolean,
  applicationData: {
    type: Object,
    default: () => null,
  },
})

const emit = defineEmits(['close-modal', 'approve', 'reject', 'edit'])

const proposedLocation = ref('')
const proposedGewogThrom = ref('')
const proposedDzongkhagThromde = ref('')
const proposedRemarks = ref('')

const actionMode = ref('none')
const rejectionReasonMessage = ref('')
const approvalMessage = ref('')
const showValidationError = ref(false)

// ✨ This watch effect is the key to populating the modal's form fields.
// It listens for the 'applicationData' prop and updates the local state.
watch(
  () => props.applicationData,
  (newData) => {
    if (newData && newData.id) {
      proposedLocation.value = newData.new_location || ''
      proposedGewogThrom.value = newData.new_geowg_throm || ''
      proposedDzongkhagThromde.value = newData.new_dzongkhag_throm || ''
      proposedRemarks.value = newData.remarks || ''
    } else {
      // Clear the form if no data is present
      proposedLocation.value = ''
      proposedGewogThrom.value = ''
      proposedDzongkhagThromde.value = ''
      proposedRemarks.value = ''
    }
  },
  {
    immediate: true,
    deep: true,
  },
)

const initiateApprove = () => {
  actionMode.value = 'approve'
}

const initiateReject = () => {
  actionMode.value = 'reject'
  showValidationError.value = false
}

const confirmAction = () => {
  const commonPayload = {
    proposedLocation: proposedLocation.value,
    proposedGewogThrom: proposedGewogThrom.value,
    proposedDzongkhagThromde: proposedDzongkhagThromde.value,
    proposedRemarks: proposedRemarks.value,
  }

  if (actionMode.value === 'reject') {
    if (!rejectionReasonMessage.value.trim()) {
      showValidationError.value = true
      return
    }
    emit('reject', { message: rejectionReasonMessage.value, ...commonPayload })
  } else if (actionMode.value === 'approve') {
    emit('approve', { message: approvalMessage.value, ...commonPayload })
  }
  closeModal()
}

const cancelAction = () => {
  actionMode.value = 'none'
  showValidationError.value = false
}

function closeModal() {
  actionMode.value = 'none'
  rejectionReasonMessage.value = ''
  approvalMessage.value = ''
  showValidationError.value = false
  emit('close-modal')
}
</script>

<style scoped>
.form-label {
  @apply block text-sm font-medium text-gray-700;
}
.form-input,
.form-select,
.form-textarea {
  @apply mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm;
}
.section-card {
  @apply bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-all;
}
.approve-button,
.reject-button,
.confirm-button,
.cancel-action-button {
  @apply rounded-md px-4 py-2 font-semibold text-white focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all sm:ml-3 sm:w-auto sm:text-sm;
}
.approve-button {
  @apply bg-green-500 hover:bg-green-600 focus:ring-green-500;
}
.reject-button {
  @apply bg-red-500 hover:bg-red-600 focus:ring-red-500;
}
.confirm-button {
  @apply bg-blue-500 hover:bg-blue-600 focus:ring-blue-500;
}
.cancel-action-button {
  @apply bg-gray-500 hover:bg-gray-600 focus:ring-gray-500;
}
.cancel-button-small {
  @apply mt-3 w-auto inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-3 py-1 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 focus:ring-indigo-500 sm:text-sm;
}
</style>
