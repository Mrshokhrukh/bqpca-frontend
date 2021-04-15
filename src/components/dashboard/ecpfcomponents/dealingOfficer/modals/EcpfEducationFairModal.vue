<!-- EducationFairModal.vue -->
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
        <div class="fixed inset-0 bg-black/80 backdrop-blur-sm" aria-hidden="true" />
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
              class="w-full max-w-7xl transform overflow-hidden rounded-2xl bg-gray-50 shadow-2xl transition-all max-h-screen sm:max-h-[calc(100vh-80px)] overflow-y-auto"
            >
              <!-- Application Header -->
              <div
                v-if="application"
                class="px-8 py-6 bg-gradient-to-r from-indigo-500 to-blue-600 text-white"
              >
                <div class="flex justify-between items-center">
                  <div>
                    <h2 class="text-2xl font-bold tracking-tight">
                      {{ application.ecpfName || 'Education Fair Application' }}
                    </h2>
                    <p class="mt-1 text-white/90">Application ID: {{ application.cid }}</p>
                  </div>
                </div>
              </div>

              <div v-if="application" class="px-8 py-6 bg-white">
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <!-- Left Column -->
                  <div class="lg:col-span-1 space-y-6">
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
                        <p><strong>ECPF Name:</strong> {{ application.ecpfName || 'N/A' }}</p>
                        <p><strong>Location:</strong> {{ application.ecpfLocation || 'N/A' }}</p>
                        <p>
                          <strong>Name of Proprietor:</strong>
                          {{ application.proprietorName || 'N/A' }}
                        </p>
                        <p><strong>CID:</strong> {{ application.cid || 'N/A' }}</p>
                        <p><strong>Contact No.:</strong> {{ application.contactNo || 'N/A' }}</p>
                        <p>
                          <strong>Email Address:</strong> {{ application.emailAddress || 'N/A' }}
                        </p>
                      </div>
                    </div>

                    <!-- Proposed Fair Details -->
                    <div
                      class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-all"
                    >
                      <div class="p-6">
                        <div class="flex items-center mb-4">
                          <div class="bg-indigo-100 p-2 rounded-md">
                            <DocumentTextIcon class="h-5 w-5 text-indigo-600" />
                          </div>
                          <h4 class="font-semibold text-gray-900 ml-2">Proposed Fair Details</h4>
                        </div>
                        <p><strong>Fair Name:</strong> {{ application.fairName || 'N/A' }}</p>
                        <p>
                          <strong>Fair Description:</strong>
                          {{ application.fairDescription || 'N/A' }}
                        </p>
                        <p>
                          <strong>Fair Location:</strong> {{ application.fairLocation || 'N/A' }}
                        </p>
                      </div>
                    </div>
                  </div>

                  <!-- Right Column -->
                  <div class="lg:col-span-2 space-y-6">
                    <!-- Representative Details Section -->
                    <div
                      class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-all"
                    >
                      <div class="p-6">
                        <div class="flex items-center mb-4">
                          <div class="bg-green-100 p-2 rounded-md">
                            <UserIcon class="h-5 w-5 text-green-600" />
                          </div>
                          <h4 class="font-semibold text-gray-900 ml-2">Representative Details</h4>
                        </div>

                        <div
                          v-if="
                            application.representatives && application.representatives.length > 0
                          "
                          class="space-y-4"
                        >
                          <div
                            v-for="(rep, index) in application.representatives"
                            :key="index"
                            class="border p-4 rounded-md mb-4"
                          >
                            <h5 class="font-medium text-gray-700 mb-2">
                              Representative {{ index + 1 }}
                            </h5>
                            <p><strong>Name:</strong> {{ rep.name || 'N/A' }}</p>
                            <p><strong>Passport No:</strong> {{ rep.passportNo || 'N/A' }}</p>
                            <p><strong>Nationality:</strong> {{ rep.nationality || 'N/A' }}</p>
                            <p><strong>Arrival Date:</strong> {{ rep.arrivalDate || 'N/A' }}</p>
                            <p><strong>Departure Date:</strong> {{ rep.departureDate || 'N/A' }}</p>
                            <p>
                              <strong>CV of Representative:</strong>
                              <button class="text-indigo-600 hover:text-indigo-800">View</button>
                            </p>
                          </div>
                        </div>
                        <div v-else>
                          <p class="text-center py-6 text-gray-500 italic">
                            No Representative Details Available.
                          </p>
                        </div>
                      </div>
                    </div>

                    <!-- Participating Institute Details Section -->
                    <div
                      class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-all"
                    >
                      <div class="p-6">
                        <div class="flex items-center mb-4">
                          <div class="bg-purple-100 p-2 rounded-md">
                            <AcademicCapIcon class="h-5 w-5 text-purple-600" />
                          </div>
                          <h4 class="font-semibold text-gray-900 ml-2">
                            Participating Institute Details
                          </h4>
                        </div>

                        <div
                          v-if="application.institutes && application.institutes.length > 0"
                          class="space-y-4"
                        >
                          <div
                            v-for="(institute, index) in application.institutes"
                            :key="index"
                            class="border p-4 rounded-md mb-4"
                          >
                            <h5 class="font-medium text-gray-700 mb-2">
                              Institute {{ index + 1 }}
                            </h5>
                            <p>
                              <strong>Name of the Institution:</strong>
                              {{ institute.institutionName || 'N/A' }}
                            </p>
                            <p><strong>Location:</strong> {{ institute.location || 'N/A' }}</p>
                            <p><strong>Zone/State:</strong> {{ institute.zoneState || 'N/A' }}</p>
                            <p><strong>Country:</strong> {{ institute.country || 'N/A' }}</p>
                            <p>
                              <strong>Institute Website:</strong> {{ institute.website || 'N/A' }}
                            </p>
                            <p>
                              <strong>Contact (focal person):</strong>
                              {{ institute.contactPerson || 'N/A' }}
                            </p>
                            <p>
                              <strong>College Affiliated to:</strong>
                              {{ institute.affiliatedCollege || 'N/A' }}
                            </p>
                            <p>
                              <strong>Type of University:</strong>
                              {{ institute.universityType || 'N/A' }}
                            </p>
                            <p>
                              <strong>Recognition Code (if any):</strong>
                              {{ institute.recognitionCode || 'N/A' }}
                            </p>
                            <p>
                              <strong>Course Offered Details:</strong>
                              {{ institute.courseDetails || 'N/A' }}
                            </p>
                            <p>
                              <strong>Accredited By:</strong> {{ institute.accreditedBy || 'N/A' }}
                            </p>
                            <p>
                              <strong>Authorization Letter:</strong>
                              <button class="text-indigo-600 hover:text-indigo-800">View</button>
                            </p>
                            <p><strong>Remarks:</strong> {{ institute.remarks || 'N/A' }}</p>
                          </div>
                        </div>
                        <div v-else>
                          <p class="text-center py-6 text-gray-500 italic">
                            No Participating Institute Details Available.
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
                          <h4 class="font-semibold text-gray-900 ml-2">Verification Stage</h4>
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
                              <option value="regretted">Regretted</option>
                            </select>
                          </div>
                          <div v-if="verificationForm.verificationDecision === 'regretted'">
                            <label
                              for="regretReason"
                              class="block text-sm font-medium text-gray-700"
                              >Regret Reason:</label
                            >
                            <textarea
                              id="regretReason"
                              v-model="verificationForm.regretReason"
                              rows="2"
                              class="shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-1 block w-full sm:text-sm border-gray-300 rounded-md"
                            ></textarea>
                          </div>
                          <div v-if="verificationForm.verificationDecision === 'accepted'">
                            <label
                              for="conditionText"
                              class="block text-sm font-medium text-gray-700"
                              >Condition (if accepted):</label
                            >
                            <textarea
                              id="conditionText"
                              v-model="verificationForm.conditionText"
                              rows="2"
                              class="shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-1 block w-full sm:text-sm border-gray-300 rounded-md"
                            ></textarea>
                          </div>
                          <div>
                            <label for="remarksText" class="block text-sm font-medium text-gray-700"
                              >Remarks:</label
                            >
                            <textarea
                              id="remarksText"
                              v-model="verificationForm.remarksText"
                              rows="2"
                              class="shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-1 block w-full sm:text-sm border-gray-300 rounded-md"
                            ></textarea>
                          </div>

                          <div class="mt-6 flex justify-end space-x-2">
                            <button
                              type="button"
                              class="rounded-md px-4 py-2 font-semibold text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-all"
                              @click="showAcceptDialog"
                            >
                              <CheckIcon class="h-4 w-4 inline-block mr-1" />
                              Accept
                            </button>
                            <button
                              type="button"
                              class="rounded-md px-4 py-2 font-semibold text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-all"
                              @click="showRejectDialog"
                            >
                              <XMarkIcon class="h-4 w-4 inline-block mr-1" />
                              Regret
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Footer buttons -->
              <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-all"
                  @click="closeModal"
                >
                  <XMarkIcon class="h-4 w-4 inline-block mr-1" />
                  Close
                </button>
                <button
                  type="button"
                  class="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                  @click="submitVerification"
                >
                  Submit Verification
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>

  <!-- Accept Message Dialog -->
  <TransitionRoot appear :show="showAcceptMessageDialog" as="template">
    <Dialog as="div" @close="closeAcceptDialog" class="relative z-50">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4">
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
              class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
            >
              <DialogTitle
                as="h3"
                class="text-lg font-medium leading-6 text-gray-900 flex items-center"
              >
                <CheckCircleIcon class="h-6 w-6 text-green-500 mr-2" />
                Accept Application
              </DialogTitle>
              <div class="mt-4">
                <p class="text-sm text-gray-500 mb-4">
                  Please provide a message for accepting this application.
                </p>
                <textarea
                  class="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  rows="4"
                  v-model="acceptMessage"
                  placeholder="Enter acceptance message here..."
                ></textarea>
              </div>

              <div class="mt-4 flex justify-end space-x-2">
                <button
                  type="button"
                  class="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  @click="closeAcceptDialog"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  class="inline-flex justify-center rounded-md border border-transparent bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  @click="confirmAccept"
                >
                  Confirm Accept
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>

  <!-- Reject Message Dialog -->
  <TransitionRoot appear :show="showRejectMessageDialog" as="template">
    <Dialog as="div" @close="closeRejectDialog" class="relative z-50">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4">
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
              class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
            >
              <DialogTitle
                as="h3"
                class="text-lg font-medium leading-6 text-gray-900 flex items-center"
              >
                <XCircleIcon class="h-6 w-6 text-red-500 mr-2" />
                Regret Application
              </DialogTitle>
              <div class="mt-4">
                <p class="text-sm text-gray-500 mb-4">
                  Please provide a reason for regretting this application.
                </p>
                <textarea
                  class="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  rows="4"
                  v-model="rejectMessage"
                  placeholder="Enter regret reason here..."
                ></textarea>
              </div>

              <div class="mt-4 flex justify-end space-x-2">
                <button
                  type="button"
                  class="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  @click="closeRejectDialog"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  class="inline-flex justify-center rounded-md border border-transparent bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  @click="confirmReject"
                >
                  Confirm Regret
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
import { ref } from 'vue'
import {
  UserIcon,
  DocumentTextIcon,
  DocumentDuplicateIcon,
  CheckBadgeIcon,
  CheckIcon,
  XMarkIcon,
  AcademicCapIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/vue/24/outline'

const props = defineProps({
  isOpen: Boolean,
  application: {
    type: Object,
    default: () => null,
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

// Message dialog refs
const showAcceptMessageDialog = ref(false)
const showRejectMessageDialog = ref(false)
const acceptMessage = ref('')
const rejectMessage = ref('')

// Accept dialog functions
const showAcceptDialog = () => {
  showAcceptMessageDialog.value = true
}

const closeAcceptDialog = () => {
  showAcceptMessageDialog.value = false
}

const confirmAccept = () => {
  if (acceptMessage.value.trim()) {
    verificationForm.value.verificationDecision = 'accepted'
    verificationForm.value.conditionText = acceptMessage.value
    saveVerificationDecision('Accepted')
    closeAcceptDialog()
  }
}

// Reject dialog functions
const showRejectDialog = () => {
  showRejectMessageDialog.value = true
}

const closeRejectDialog = () => {
  showRejectMessageDialog.value = false
}

const confirmReject = () => {
  if (rejectMessage.value.trim()) {
    verificationForm.value.verificationDecision = 'regretted'
    verificationForm.value.regretReason = rejectMessage.value
    saveVerificationDecision('Regretted')
    closeRejectDialog()
  }
}

const saveVerificationDecision = (action) => {
  console.log(
    'Verification Decision:',
    verificationForm.value,
    'Action:',
    action,
    'for CID:',
    props.application.cid,
  )
  emit('update-verification', {
    applicationId: props.application.id, // Or use CID if ID is not available/suitable
    verificationData: { ...verificationForm.value, verificationStatus: action },
  })
  closeModal()
}

const submitVerification = () => {
  saveVerificationDecision(
    verificationForm.value.verificationDecision === 'accepted' ? 'Accepted' : 'Regretted',
  )
}
</script>
