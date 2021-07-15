<template>
 <div>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" @close="closeModal" class="relative z-50">
      <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100"
        leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-black/80 backdrop-blur-sm" aria-hidden="true" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-start justify-center p-4 sm:pt-12">
          <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95">
            <DialogPanel
              class="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all">
              <DialogTitle as="h3"
                class="text-lg font-medium leading-6 text-gray-900 px-6 py-4 border-b border-gray-200">
                HEI Visit Promotional Event Application
              </DialogTitle>
              <div class="px-6 py-6">
                <div class="grid grid-cols-1 gap-6">
                  <!-- Promotional Event Type -->
                  <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-all">
                    <div class="p-6">
                      <div class="flex items-center mb-4">
                        <div class="bg-blue-100 p-2 rounded-md">
                          <DocumentDuplicateIcon class="h-5 w-5 text-blue-600" />
                        </div>
                        <h4 class="font-semibold text-gray-900 ml-2">Promotional Event Type</h4>
                      </div>
                      <p><strong>Event Type:</strong> {{ application.promotionalEventType || 'N/A' }}</p>
                    </div>
                  </div>

                  <!-- Current Details of ECPF -->
                  <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-all">
                    <div class="p-6">
                      <div class="flex items-center mb-4">
                        <div class="bg-indigo-100 p-2 rounded-md">
                          <DocumentTextIcon class="h-5 w-5 text-indigo-600" />
                        </div>
                        <h4 class="font-semibold text-gray-900 ml-2">Current Details of ECPF</h4>
                      </div>
                      <p><strong>ECPF Name:</strong> {{ application.ecpfName || 'N/A' }}</p>
                      <p><strong>Location:</strong> {{ application.ecpfLocation || 'N/A' }}</p>
                      <p><strong>Name of Proprietor:</strong> {{ application.proprietorName || 'N/A' }}</p>
                      <p><strong>CID:</strong> {{ application.cid || 'N/A' }}</p>
                      <p><strong>Contact No.:</strong> {{ application.contactNo || 'N/A' }}</p>
                      <p><strong>Email Address:</strong> {{ application.emailAddress || 'N/A' }}</p>
                    </div>
                  </div>

                  <!-- Proposed Promotion Event - HEI Visit -->
                  <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-all">
                    <div class="p-6">
                      <div class="flex items-center mb-4">
                        <div class="bg-green-100 p-2 rounded-md">
                          <DocumentTextIcon class="h-5 w-5 text-green-600" />
                        </div>
                        <h4 class="font-semibold text-gray-900 ml-2">Proposed Promotion Event - HEI Visit</h4>
                      </div>
                      <p>
                        <strong>Institute(s):</strong>
                        <ul v-if="application.institutes && application.institutes.length > 0" class="list-disc list-inside">
                          <li v-for="(institute, index) in application.institutes" :key="index">{{ institute }}</li>
                        </ul>
                        <span v-else>N/A</span>
                      </p>
                      <p><strong>Programme Detail (visit detail):</strong> {{ application.programmeDetail || 'N/A' }}</p>
                      <p><strong>Description:</strong> {{ application.description || 'N/A' }}</p>
                      <p><strong>Purpose:</strong> {{ application.purpose || 'N/A' }}</p>
                      <p><strong>From Date:</strong> {{ application.fromDate || 'N/A' }}</p>
                      <p><strong>To Date:</strong> {{ application.toDate || 'N/A' }}</p>
                      <p><strong>Others (specify):</strong> {{ application.othersSpecify || 'N/A' }}</p>
                      <p><strong>Supporting Document:</strong> <button class="text-indigo-600 hover:text-indigo-800">View</button></p>
                    </div>
                  </div>

                  <!-- Remarks -->
                  <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-all">
                    <div class="p-6">
                      <div class="flex items-center mb-4">
                        <div class="bg-amber-100 p-2 rounded-md">
                          <ChatBubbleLeftRightIcon class="h-5 w-5 text-amber-600" />
                        </div>
                        <h4 class="font-semibold text-gray-900 ml-2">Remarks</h4>
                      </div>
                      <p><strong>Remarks:</strong> {{ application.remarks || 'N/A' }}</p>
                    </div>
                  </div>

                  <!-- Verification Stage Form -->
                  <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-all">
                    <div class="p-6">
                      <div class="flex items-center mb-4">
                        <div class="bg-yellow-100 p-2 rounded-md">
                          <CheckBadgeIcon class="h-5 w-5 text-yellow-600" />
                        </div>
                        <h4 class="font-semibold text-gray-900 ml-2">Verification Stage</h4>
                      </div>
                      <div class="mt-2 space-y-4">
                        <div>
                          <label for="verificationDecision" class="block text-sm font-medium text-gray-700">Verification Decision:</label>
                          <select id="verificationDecision" v-model="verificationForm.verificationDecision"
                            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                            <option value="">Select Decision</option>
                            <option value="accepted">Accepted</option>
                            <option value="regretted">Regretted</option>
                          </select>
                        </div>
                        <div v-if="verificationForm.verificationDecision === 'regretted'">
                          <label for="regretReason" class="block text-sm font-medium text-gray-700">Regret Reason:</label>
                          <textarea id="regretReason" v-model="verificationForm.regretReason" rows="2"
                            class="shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-1 block w-full sm:text-sm border-gray-300 rounded-md"></textarea>
                        </div>
                        <div v-if="verificationForm.verificationDecision === 'accepted'">
                          <label for="conditionText" class="block text-sm font-medium text-gray-700">Condition (if accepted):</label>
                          <textarea id="conditionText" v-model="verificationForm.conditionText" rows="2"
                            class="shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-1 block w-full sm:text-sm border-gray-300 rounded-md"></textarea>
                        </div>
                        <div>
                          <label for="remarksText" class="block text-sm font-medium text-gray-700">Remarks:</label>
                          <textarea id="remarksText" v-model="verificationForm.remarksText" rows="2"
                            class="shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-1 block w-full sm:text-sm border-gray-300 rounded-md"></textarea>
                        </div>

                        <div class="mt-6 flex justify-end space-x-2">
                          <button type="button"
                            class="rounded-md px-4 py-2 font-semibold text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-all"
                            @click="openAcceptDialog">
                            <CheckIcon class="h-4 w-4 inline-block mr-1" />
                            Accept
                          </button>
                          <button type="button"
                            class="rounded-md px-4 py-2 font-semibold text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-all"
                            @click="openRejectDialog">
                            <XMarkIcon class="h-4 w-4 inline-block mr-1" />
                            Regret
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Footer buttons -->
              <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button type="button"
                  class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-all"
                  @click="closeModal">
                  <XMarkIcon class="h-4 w-4 inline-block mr-1" />
                  Close
                </button>
                <button type="button"
                  class="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                  @click="submitVerification">
                  Submit Verification
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>

  <!-- Accept Confirmation Dialog -->
  <TransitionRoot appear :show="isAcceptDialogOpen" as="template">
    <Dialog as="div" @close="closeAcceptDialog" class="relative z-50">
      <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100"
        leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-black/25" aria-hidden="true" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4">
          <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95">
            <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
              <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900 flex items-center">
                <div class="bg-green-100 p-2 rounded-full mr-2">
                  <CheckIcon class="h-5 w-5 text-green-600" />
                </div>
                Confirm Acceptance
              </DialogTitle>
              <div class="mt-4">
                <p class="text-sm text-gray-500">
                  Are you sure you want to accept this HEI Visit application? Please review your comments and conditions before proceeding.
                </p>
              </div>

              <div class="mt-4">
                <label class="text-sm font-medium text-gray-700">Comments:</label>
                <textarea v-model="acceptDialogMessage" rows="3"
                  class="shadow-sm focus:ring-green-500 focus:border-green-500 mt-1 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Add any additional comments or instructions..."></textarea>
              </div>

              <div class="mt-6 flex justify-end space-x-3">
                <button type="button"
                  class="inline-flex justify-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  @click="closeAcceptDialog">
                  Cancel
                </button>
                <button type="button"
                  class="inline-flex justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  @click="confirmAccept">
                  Confirm Acceptance
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>

  <!-- Reject Confirmation Dialog -->
  <TransitionRoot appear :show="isRejectDialogOpen" as="template">
    <Dialog as="div" @close="closeRejectDialog" class="relative z-50">
      <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100"
        leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-black/25" aria-hidden="true" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4">
          <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95">
            <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
              <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900 flex items-center">
                <div class="bg-red-100 p-2 rounded-full mr-2">
                  <XMarkIcon class="h-5 w-5 text-red-600" />
                </div>
                Confirm Rejection
              </DialogTitle>
              <div class="mt-4">
                <p class="text-sm text-gray-500">
                  Are you sure you want to regret this HEI Visit application? This action cannot be undone.
                </p>
              </div>

              <div class="mt-4">
                <label class="text-sm font-medium text-gray-700">Rejection Reason:</label>
                <textarea v-model="rejectDialogMessage" rows="3"
                  class="shadow-sm focus:ring-red-500 focus:border-red-500 mt-1 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Please provide a reason for rejection..."></textarea>
              </div>

              <div class="mt-6 flex justify-end space-x-3">
                <button type="button"
                  class="inline-flex justify-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  @click="closeRejectDialog">
                  Cancel
                </button>
                <button type="button"
                  class="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  @click="confirmReject">
                  Confirm Rejection
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
 </div> 
</template>

<script setup>
import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from '@headlessui/vue'
import { ref, watch } from 'vue'
import {
  DocumentTextIcon,
  DocumentDuplicateIcon,
  CheckBadgeIcon,
  ChatBubbleLeftRightIcon,
  CheckIcon,
  XMarkIcon,
} from '@heroicons/vue/24/outline'

const props = defineProps({
  isOpen: Boolean,
  application: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits(['close', 'update-verification'])

const closeModal = () => {
  emit('close')
}

const verificationForm = ref({
  verificationDecision: '',
  regretReason: '',
  conditionText: '',
  remarksText: '',
})

// Dialog states
const isAcceptDialogOpen = ref(false)
const isRejectDialogOpen = ref(false)
const acceptDialogMessage = ref('')
const rejectDialogMessage = ref('')

// Dialog functions
const openAcceptDialog = () => {
  acceptDialogMessage.value = verificationForm.value.conditionText || ''
  isAcceptDialogOpen.value = true
}

const closeAcceptDialog = () => {
  isAcceptDialogOpen.value = false
}

const openRejectDialog = () => {
  rejectDialogMessage.value = verificationForm.value.regretReason || ''
  isRejectDialogOpen.value = true
}

const closeRejectDialog = () => {
  isRejectDialogOpen.value = false
}

const confirmAccept = () => {
  // Transfer the dialog message to the form
  verificationForm.value.verificationDecision = 'accepted'
  verificationForm.value.conditionText = acceptDialogMessage.value

  // Save the verification
  saveVerificationDecision('Accepted')
  closeAcceptDialog()
}

const confirmReject = () => {
  // Transfer the dialog message to the form
  verificationForm.value.verificationDecision = 'regretted'
  verificationForm.value.regretReason = rejectDialogMessage.value

  // Save the verification
  saveVerificationDecision('Regretted')
  closeRejectDialog()
}

const saveVerificationDecision = (action) => {
  console.log(
    'Verification Decision:',
    verificationForm.value,
    'Action:',
    action,
    'for CID:',
    props.application.cid
  )
  emit('update-verification', {
    applicationId: props.application.id, // Or use CID if ID is not available/suitable
    verificationData: { ...verificationForm.value, verificationStatus: action },
  })
  closeModal()
}

const submitVerification = () => {
  if (verificationForm.value.verificationDecision === 'accepted') {
    openAcceptDialog()
  } else if (verificationForm.value.verificationDecision === 'regretted') {
    openRejectDialog()
  } else {
    alert('Please select a verification decision before submitting.')
  }
}

watch(
  () => props.application,
  (newApplication) => {
    if (newApplication) {
      // Initialize verification stage fields if needed, or fetch existing values if applicable
      verificationForm.value.verificationDecision = ''
      verificationForm.value.regretReason = ''
      verificationForm.value.conditionText = ''
      verificationForm.value.remarksText = ''
    }
  },
  { immediate: true }
)
</script>