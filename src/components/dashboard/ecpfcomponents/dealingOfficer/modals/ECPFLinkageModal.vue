<template>
  <TransitionRoot appear :show="isOpen" as="div">
    <Dialog as="div" @close="closeModal" class="relative z-50">
      <TransitionChild
        as="div"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/80 backdrop-blur-sm" aria-hidden="true" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-start justify-center p-4 sm:pt-12">
          <TransitionChild
            as="div"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel
              class="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white shadow-xl transition-all"
            >
              <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
                  ECPF Linkage Establishment Application
                </DialogTitle>
                <button
                  @click="showEditModal = true"
                  class="flex items-center text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <PencilIcon class="h-5 w-5" />
                </button>
              </div>

              <div class="px-6 py-6">
                <div class="grid grid-cols-1 gap-6">
                  <!-- Current Details of ECPF -->
                  <div
                    class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-all"
                  >
                    <div class="p-6">
                      <div class="flex items-center mb-4">
                        <div class="bg-blue-100 p-2 rounded-md">
                          <DocumentDuplicateIcon class="h-5 w-5 text-blue-600" />
                        </div>
                        <h4 class="font-semibold text-gray-900 ml-2">Current Details of ECPF</h4>
                      </div>
                      <p><strong>ECPF Name:</strong> {{ linkage.ecpfName || 'N/A' }}</p>
                      <p>
                        <strong>Proprietor of the ECPF:</strong>
                        {{ linkage.proprietorName || 'N/A' }}
                      </p>
                      <p>
                        <strong>CID of the Proprietor:</strong> {{ linkage.proprietorCid || 'N/A' }}
                      </p>
                      <p><strong>Location of ECPF:</strong> {{ linkage.ecpfLocation || 'N/A' }}</p>
                      <p><strong>Contact No.:</strong> {{ linkage.contactNo || 'N/A' }}</p>
                      <p><strong>Email Address:</strong> {{ linkage.emailAddress || 'N/A' }}</p>
                    </div>
                  </div>

                  <!-- Institute Linkage Details (HEI) -->
                  <div
                    class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-all"
                  >
                    <div class="p-6">
                      <div class="flex items-center mb-4">
                        <div class="bg-indigo-100 p-2 rounded-md">
                          <DocumentTextIcon class="h-5 w-5 text-indigo-600" />
                        </div>
                        <h4 class="font-semibold text-gray-900 ml-2">
                          Institute Linkage Details (HEI)
                        </h4>
                      </div>
                      <p><strong>Name of HEI:</strong> {{ linkage.heiName || 'N/A' }}</p>
                      <p>
                        <strong>Official Website:</strong> {{ linkage.officialWebsite || 'N/A' }}
                      </p>
                      <p><strong>Location:</strong> {{ linkage.heiLocation || 'N/A' }}</p>
                      <p><strong>Country:</strong> {{ linkage.heiCountry || 'N/A' }}</p>
                      <p>
                        <strong>Year of Establishment:</strong>
                        {{ linkage.yearEstablished || 'N/A' }}
                      </p>
                      <p><strong>Recognised By:</strong> {{ linkage.recognizedBy || 'N/A' }}</p>
                      <p><strong>Accredited By:</strong> {{ linkage.accreditedBy || 'N/A' }}</p>
                      <p>
                        <strong>Affiliation to, if applicable:</strong>
                        {{ linkage.affiliation || 'N/A' }}
                      </p>
                      <p>
                        <strong>Approval from relevant professional bodies, if relevant:</strong>
                        {{ linkage.approvalFromProBodies || 'N/A' }}
                      </p>
                      <p>
                        <strong>Report on HEI Visit:</strong>
                        <button class="text-indigo-600 hover:text-indigo-800">View</button>
                      </p>
                    </div>
                  </div>

                  <!-- Programme/Course Details -->
                  <div
                    class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-all"
                  >
                    <div class="p-6">
                      <div class="flex items-center mb-4">
                        <div class="bg-green-100 p-2 rounded-md">
                          <DocumentTextIcon class="h-5 w-5 text-green-600" />
                        </div>
                        <h4 class="font-semibold text-gray-900 ml-2">Programme/Course Details</h4>
                      </div>
                      <template v-if="linkage.courses && linkage.courses.length > 0">
                        <div
                          v-for="(course, index) in linkage.courses"
                          :key="index"
                          class="border-b pb-4 mb-4"
                        >
                          <h5 class="font-medium text-gray-700 mb-2">Course {{ index + 1 }}</h5>
                          <p>
                            <strong>Name of Programme/Courses:</strong>
                            {{ course.programmeName || 'N/A' }}
                          </p>
                          <p><strong>Level:</strong> {{ course.level || 'N/A' }}</p>
                          <p>
                            <strong>Minimum Credit:</strong> {{ course.minimumCredit || 'N/A' }}
                          </p>
                          <p>
                            <strong>Qualification Type:</strong>
                            {{ course.qualificationType || 'N/A' }}
                          </p>
                          <p><strong>Remarks:</strong> {{ course.remarks || 'N/A' }}</p>
                        </div>
                      </template>
                      <div v-else>
                        <p class="text-center py-6 text-gray-500 italic">
                          No Programme/Course Details Available.
                        </p>
                      </div>
                    </div>
                  </div>

                  <!-- Verification Stage Form -->
                  <div
                    class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-all"
                  >
                    <div class="p-6">
                      <div class="flex items-center mb-4">
                        <div class="bg-yellow-100 p-2 rounded-md">
                          <CheckBadgeIcon class="h-5 w-5 text-yellow-600" />
                        </div>
                        <h4 class="font-semibold text-gray-900 ml-2">A. Linkage Verification</h4>
                      </div>
                      <div class="mt-2 space-y-4">
                        <div>
                          <label
                            for="verificationDecision"
                            class="block text-sm font-medium text-gray-700"
                            >Verification Decision:</label
                          >
                          <select
                            id="verificationDecision"
                            v-model="verificationForm.verificationDecision"
                            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          >
                            <option value="">Select Decision</option>
                            <option value="accepted">Accepted</option>
                            <option value="regret">Regret</option>
                          </select>
                        </div>
                        <div v-if="verificationForm.verificationDecision === 'regret'">
                          <label for="regretReason" class="block text-sm font-medium text-gray-700"
                            >Regret Reason:</label
                          >
                          <textarea
                            id="regretReason"
                            v-model="verificationForm.regretReason"
                            rows="2"
                            class="shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-1 block w-full sm:text-sm border-gray-300 rounded-md"
                          ></textarea>
                        </div>

                        <div class="mt-6 flex justify-end space-x-2">
                          <button
                            type="button"
                            class="rounded-md px-4 py-2 font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-all"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            class="rounded-md px-4 py-2 font-semibold text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all"
                            @click="saveVerificationDecision"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            class="rounded-md px-4 py-2 font-semibold text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-all"
                            @click="submitVerification"
                          >
                            Submit
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- MoU Acceptance Form -->
                  <div
                    class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-all"
                  >
                    <div class="p-6">
                      <div class="flex items-center mb-4">
                        <div class="bg-orange-100 p-2 rounded-md">
                          <DocumentCheckIcon class="h-5 w-5 text-orange-600" />
                        </div>
                        <h4 class="font-semibold text-gray-900 ml-2">B. MoU Acceptance</h4>
                      </div>
                      <div class="mt-2 space-y-4">
                        <div>
                          <label for="mouAcceptance" class="block text-sm font-medium text-gray-700"
                            >MoU Acceptance:</label
                          >
                          <select
                            id="mouAcceptance"
                            v-model="mouAcceptanceForm.mouAcceptance"
                            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          >
                            <option value="">Select Decision</option>
                            <option value="accept">Accept</option>
                            <option value="revert">Revert to Modify</option>
                          </select>
                        </div>
                        <div v-if="mouAcceptanceForm.mouAcceptance === 'revert'">
                          <label for="revertReason" class="block text-sm font-medium text-gray-700"
                            >Reason (if not accepted):</label
                          >
                          <textarea
                            id="revertReason"
                            v-model="mouAcceptanceForm.revertReason"
                            rows="2"
                            class="shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-1 block w-full sm:text-sm border-gray-300 rounded-md"
                          ></textarea>
                        </div>
                        <div v-if="mouAcceptanceForm.mouAcceptance === 'accept'">
                          <label for="mouValidity" class="block text-sm font-medium text-gray-700"
                            >MoU Validity Date:</label
                          >
                          <input
                            type="date"
                            id="mouValidity"
                            v-model="mouAcceptanceForm.mouValidity"
                            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          />
                        </div>

                        <div class="mt-6 flex justify-end space-x-2">
                          <button
                            type="button"
                            class="rounded-md px-4 py-2 font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-all"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            class="rounded-md px-4 py-2 font-semibold text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all"
                            @click="saveMouAcceptance"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="px-6 py-4 bg-gray-50 flex justify-between">
                <div class="flex space-x-3">
                  <button
                    type="button"
                    @click="showRejectModal = true"
                    class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <XMarkIcon class="h-4 w-4 mr-1" />
                    Reject
                  </button>
                  <button
                    type="button"
                    @click="showApproveModal = true"
                    class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <CheckIcon class="h-4 w-4 mr-1" />
                    Approve
                  </button>
                </div>
                <button
                  type="button"
                  @click="closeModal"
                  class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Close
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>

    <!-- Approve Modal -->
    <Dialog :open="showApproveModal" @close="showApproveModal = false" class="relative z-50">
      <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" />
      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4">
          <DialogPanel
            class="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all"
          >
            <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900 mb-4">
              Approve Application
            </DialogTitle>
            <div class="mt-2">
              <p class="text-sm text-gray-500 mb-4">
                You are about to approve this ECPF Linkage application. Please provide any
                additional comments or notes for this approval.
              </p>
              <textarea
                v-model="approvalMessage"
                rows="4"
                class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Add your approval comments here..."
              ></textarea>
            </div>
            <div class="mt-6 flex justify-end space-x-2">
              <button
                type="button"
                @click="showApproveModal = false"
                class="rounded-md px-4 py-2 font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                @click="finalApprove"
                class="rounded-md px-4 py-2 font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-all"
              >
                Confirm Approval
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>

    <!-- Reject Modal -->
    <Dialog :open="showRejectModal" @close="showRejectModal = false" class="relative z-50">
      <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" />
      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4">
          <DialogPanel
            class="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all"
          >
            <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900 mb-4">
              Reject Application
            </DialogTitle>
            <div class="mt-2">
              <p class="text-sm text-gray-500 mb-2">
                You are about to reject this ECPF Linkage application. Please provide the reason for
                rejection.
              </p>
              <div>
                <label for="rejectionReason" class="block text-sm font-medium text-gray-700 mb-1"
                  >Rejection Reason:</label
                >
                <textarea
                  id="rejectionReason"
                  v-model="rejectionMessage"
                  rows="4"
                  class="w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500"
                  placeholder="Please provide a detailed reason for rejection..."
                  required
                ></textarea>
              </div>
            </div>
            <div class="mt-6 flex justify-end space-x-2">
              <button
                type="button"
                @click="showRejectModal = false"
                class="rounded-md px-4 py-2 font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                @click="finalReject"
                class="rounded-md px-4 py-2 font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-all"
                :disabled="!rejectionMessage.trim()"
              >
                Confirm Rejection
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>

    <!-- Edit Modal -->
    <Dialog :open="showEditModal" @close="showEditModal = false" class="relative z-50">
      <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" />
      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4">
          <DialogPanel
            class="w-full max-w-lg transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all"
          >
            <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900 mb-4">
              Edit Application Details
            </DialogTitle>
            <div class="mt-2 space-y-4">
              <p class="text-sm text-gray-500">Make changes to the application details below.</p>
              <div>
                <label for="editEcpfName" class="block text-sm font-medium text-gray-700 mb-1"
                  >ECPF Name:</label
                >
                <input
                  id="editEcpfName"
                  type="text"
                  v-model="editForm.ecpfName"
                  class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label for="editProprietorName" class="block text-sm font-medium text-gray-700 mb-1"
                  >Proprietor Name:</label
                >
                <input
                  id="editProprietorName"
                  type="text"
                  v-model="editForm.proprietorName"
                  class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label for="editLocation" class="block text-sm font-medium text-gray-700 mb-1"
                  >Location of ECPF:</label
                >
                <input
                  id="editLocation"
                  type="text"
                  v-model="editForm.ecpfLocation"
                  class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label for="editContact" class="block text-sm font-medium text-gray-700 mb-1"
                  >Contact No.:</label
                >
                <input
                  id="editContact"
                  type="text"
                  v-model="editForm.contactNo"
                  class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label for="editEmail" class="block text-sm font-medium text-gray-700 mb-1"
                  >Email Address:</label
                >
                <input
                  id="editEmail"
                  type="email"
                  v-model="editForm.emailAddress"
                  class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
            <div class="mt-6 flex justify-end space-x-2">
              <button
                type="button"
                @click="showEditModal = false"
                class="rounded-md px-4 py-2 font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                @click="saveEdit"
                class="rounded-md px-4 py-2 font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-all"
              >
                Save Changes
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from '@headlessui/vue'
import { ref, watch } from 'vue'
import {
  DocumentTextIcon,
  DocumentDuplicateIcon,
  CheckBadgeIcon,
  DocumentCheckIcon,
  PencilIcon,
  XMarkIcon,
  CheckIcon,
} from '@heroicons/vue/24/outline'

const props = defineProps({
  isOpen: Boolean,
  linkage: {
    type: Object,
    default: () => ({}),
  },
})

const emit = defineEmits([
  'close',
  'update-verification',
  'update-mou-acceptance',
  'approve-application',
  'reject-application',
  'edit-application',
])

const closeModal = () => {
  emit('close')
}

const verificationForm = ref({
  verificationDecision: '',
  regretReason: '',
})

const mouAcceptanceForm = ref({
  mouAcceptance: '',
  revertReason: '',
  mouValidity: null,
})

// Reactive refs for modals
const showApproveModal = ref(false)
const showRejectModal = ref(false)
const showEditModal = ref(false)
const approvalMessage = ref('')
const rejectionMessage = ref('')

// Edit form data
const editForm = ref({
  ecpfName: '',
  proprietorName: '',
  ecpfLocation: '',
  contactNo: '',
  emailAddress: '',
})

const saveVerificationDecision = () => {
  emit('update-verification', {
    linkageId: props.linkage.id,
    verificationData: verificationForm.value,
  })
}

const submitVerification = () => {
  emit('update-verification', {
    linkageId: props.linkage.id,
    verificationData: verificationForm.value,
  })
  closeModal()
}

const saveMouAcceptance = () => {
  emit('update-mou-acceptance', {
    linkageId: props.linkage.id,
    mouAcceptanceData: mouAcceptanceForm.value,
  })
  closeModal()
}

// Function to handle final approval
const finalApprove = () => {
  emit('approve-application', {
    linkageId: props.linkage.id,
    message: approvalMessage.value,
  })
  showApproveModal.value = false
  // Let the parent handle closing the main dialog
}

const finalReject = () => {
  if (!rejectionMessage.value.trim()) {
    alert('Please provide a reason for rejection')
    return
  }

  emit('reject-application', {
    linkageId: props.linkage.id,
    reason: rejectionMessage.value,
  })
  showRejectModal.value = false
  // Let the parent handle closing the main dialog
}

// Function to save edit changes
const saveEdit = () => {
  emit('edit-application', {
    linkageId: props.linkage.id,
    data: editForm.value,
  })
  showEditModal.value = false
}

// Watch for linkage changes to initialize forms
watch(
  () => props.linkage,
  (newLinkage) => {
    if (newLinkage) {
      // Initialize verification stage fields
      verificationForm.value.verificationDecision = newLinkage.verificationDecision || ''
      verificationForm.value.regretReason = newLinkage.regretReason || ''

      // Initialize MoU acceptance fields
      mouAcceptanceForm.value.mouAcceptance = newLinkage.mouAcceptance || ''
      mouAcceptanceForm.value.mouValidity = newLinkage.mouValidity || null
      mouAcceptanceForm.value.revertReason = newLinkage.revertReason || ''

      // Reset modal state and messages
      approvalMessage.value = ''
      rejectionMessage.value = ''

      // Initialize edit form with current values
      editForm.value = {
        ecpfName: newLinkage.ecpfName || '',
        proprietorName: newLinkage.proprietorName || '',
        ecpfLocation: newLinkage.ecpfLocation || '',
        contactNo: newLinkage.contactNo || '',
        emailAddress: newLinkage.emailAddress || '',
      }
    }
  },
  { immediate: true },
)
</script>
