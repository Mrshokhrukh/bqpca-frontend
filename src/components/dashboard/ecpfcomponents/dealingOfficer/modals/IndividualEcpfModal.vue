<!-- EcpfApplicationModal.vue -->
<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" @close="closeModalHandler" class="relative z-50">
      <TransitionChild as="div" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100"
        leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-black/80 backdrop-blur-sm" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-start justify-center p-4 sm:pt-12">
          <TransitionChild as="div" enter="duration-300 ease-out" enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95">
            <DialogPanel
              class="w-full max-w-7xl transform overflow-hidden rounded-2xl bg-gray-50 shadow-2xl transition-all max-h-screen sm:max-h-[calc(100vh-80px)] overflow-y-auto"
            >
              <div class="px-8 py-6 bg-white">
                <DialogTitle as="h3" class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  ECPF Application Details
                </DialogTitle>
                <div class="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <!-- Left Column -->
                  <div class="lg:col-span-1 space-y-6">
                    <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                      <div class="p-6">
                        <h4 class="font-semibold text-gray-900 mb-4">Personal Information</h4>
                        <p><strong>CID No.:</strong> {{ application.cidNo }}</p>
                        <p><strong>Applicant's Name:</strong> {{ application.applicantName }}</p>
                        <p><strong>Gender:</strong> {{ application.gender }}</p>
                        <p><strong>Date of Birth:</strong> {{ application.dateOfBirth }}</p>
                        <p><strong>Contact No.:</strong> {{ application.contactNo }}</p>
                        <p><strong>Email Address:</strong> {{ application.emailAddress }}</p>
                      </div>
                    </div>

                    <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                      <div class="p-6">
                        <h4 class="font-semibold text-gray-900 mb-4">Residential/Present Address</h4>
                        <p><strong>Office Number:</strong> {{ application.presentAddress.officeNumber }}</p>
                        <p><strong>Flat No.:</strong> {{ application.presentAddress.flatNo }}</p>
                        <p><strong>Building No.:</strong> {{ application.presentAddress.buildingNo }}</p>
                        <p><strong>Location:</strong> {{ application.presentAddress.location }}</p>
                        <p><strong>Gewog/Throm:</strong> {{ application.presentAddress.gewogThrom }}</p>
                        <p><strong>Dzongkhag/Thromde:</strong> {{ application.presentAddress.dzongkhagThromde }}</p>
                      </div>
                    </div>

                    <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                      <div class="p-6">
                        <h4 class="font-semibold text-gray-900 mb-4">Permanent Address</h4>
                        <p><strong>Village/Chiwog:</strong> {{ application.permanentAddress.villageChiwog }}</p>
                        <p><strong>Gewog:</strong> {{ application.permanentAddress.gewog }}</p>
                        <p><strong>Dungkhag:</strong> {{ application.permanentAddress.dungkhag }}</p>
                        <p><strong>Dzongkhag/Thromde:</strong> {{ application.permanentAddress.dzongkhagThromde }}</p>
                      </div>
                    </div>
                  </div>

                  <!-- Middle Column -->
                  <div class="lg:col-span-1 space-y-6">
                    <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                      <div class="p-6">
                        <h4 class="font-semibold text-gray-900 mb-4">Education Details</h4>
                        <p><strong>Qualification:</strong> {{ application.educationDetails.qualification }}</p>
                        <p><strong>Name of Institute:</strong> {{ application.educationDetails.instituteName }}</p>
                        <p><strong>Name of University:</strong> {{ application.educationDetails.universityName }}</p>
                      </div>
                    </div>

                    <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                      <div class="p-6">
                        <h4 class="font-semibold text-gray-900 mb-4">ECPF Establishment Proposal Details</h4>
                        <p><strong>Name of the Proposed Firm:</strong> {{ application.ecpfProposalDetails.firmName }}</p>
                        <p><strong>Address of the Proposed Firm:</strong> {{ application.ecpfProposalDetails.firmAddress }}</p>
                        <p><strong>Location of the Proposed Firm:</strong> {{ application.ecpfProposalDetails.firmLocation }}</p>
                        <p><strong>Type of Firm:</strong> {{ application.ecpfProposalDetails.firmType }}</p>
                      </div>
                    </div>

                    <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                      <div class="p-6">
                        <h4 class="font-semibold text-gray-900 mb-4">Purpose of Establishment</h4>
                        <p><strong>Vision:</strong> {{ application.purposeOfEstablishment.vision }}</p>
                        <p><strong>Mission:</strong> {{ application.purposeOfEstablishment.mission }}</p>
                        <p><strong>Objective:</strong> {{ application.purposeOfEstablishment.objective }}</p>
                      </div>
                    </div>
                  </div>

                  <!-- Right Column -->
                  <div class="lg:col-span-1 space-y-6">
                    <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                      <div class="p-6">
                        <h4 class="font-semibold text-gray-900 mb-4">Human Resource (Example - First HR)</h4>
                        <div v-if="application.humanResource && application.humanResource.length > 0">
                          <p><strong>Position:</strong> {{ application.humanResource[0].position }}</p>
                          <p><strong>CID:</strong> {{ application.humanResource[0].cid }}</p>
                          <p><strong>FullName:</strong> {{ application.humanResource[0].fullName }}</p>
                          <p><strong>Qualification:</strong> {{ application.humanResource[0].qualification }}</p>
                          <p><strong>Contact Number:</strong> {{ application.humanResource[0].contactNumber }}</p>
                          <p><strong>Email Address:</strong> {{ application.humanResource[0].emailAddress }}</p>
                        </div>
                        <div v-else>
                          <p>No Human Resources Added.</p>
                        </div>
                      </div>
                    </div>

                    <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                      <div class="p-6">
                        <h4 class="font-semibold text-gray-900 mb-4">Finance Plan</h4>
                        <p><strong>Finance Plan Details:</strong> {{ application.financePlan.details }}</p>
                      </div>
                    </div>

                    <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                      <div class="p-6">
                        <h4 class="font-semibold text-gray-900 mb-4">Services (Example - First Service)</h4>
                        <div v-if="application.services && application.services.length > 0">
                          <p><strong>Service Category:</strong> {{ application.services[0].category }}</p>
                          <p><strong>Details:</strong> {{ application.services[0].details }}</p>
                        </div>
                        <div v-else>
                          <p>No Services Added.</p>
                        </div>
                      </div>
                    </div>

                    <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                      <div class="p-6">
                        <h4 class="font-semibold text-gray-900 mb-4">SWOT Analysis</h4>
                        <p><strong>Strengths:</strong> {{ application.swotAnalysis.strengths }}</p>
                        <p><strong>Weaknesses:</strong> {{ application.swotAnalysis.weaknesses }}</p>
                        <p><strong>Opportunities:</strong> {{ application.swotAnalysis.opportunities }}</p>
                        <p><strong>Threats:</strong> {{ application.swotAnalysis.threats }}</p>
                      </div>
                    </div>

                    <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                      <div class="p-6">
                        <h4 class="font-semibold text-gray-900 mb-4">Fee & Charges (Example - First Fee)</h4>
                        <div v-if="application.feeCharges && application.feeCharges.length > 0">
                          <p><strong>Fee Breakup:</strong> {{ application.feeCharges[0].breakup }}</p>
                          <p><strong>Description:</strong> {{ application.feeCharges[0].description }}</p>
                          <p><strong>Amount:</strong> {{ application.feeCharges[0].amount }}</p>
                          <p><strong>Total Amount:</strong> {{ application.feeCharges[0].totalAmount }}</p>
                        </div>
                        <div v-else>
                          <p>No Fee Charges Added.</p>
                        </div>
                      </div>

                      <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div class="p-6">
                          <h4 class="font-semibold text-gray-900 mb-4">Guarantor Details</h4>
                          <p><strong>Full Name:</strong> {{ application.guarantorDetails.fullName }}</p>
                          <p><strong>CID Number:</strong> {{ application.guarantorDetails.cidNumber }}</p>
                          <p><strong>Relation to the Applicant:</strong> {{ application.guarantorDetails.relation }}</p>
                          <p><strong>Contact Number:</strong> {{ application.guarantorDetails.contactNumber }}</p>
                        </div>
                      </div>

                      <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div class="p-6">
                          <h4 class="font-semibold text-gray-900 mb-4">Supporting Documents</h4>
                          <p><em>Supporting documents information would go here.</em></p>
                        </div>
                      </div>

                      <!-- Verification Decision Form -->
                      <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div class="p-6 border-t border-gray-100 bg-gray-50">
                          <h4 class="font-semibold text-gray-900 mb-4">Verification Decision</h4>
                          <div class="mt-2">
                            <label for="verificationDecision" class="block text-sm font-medium text-gray-700">Verification Decision:</label>
                            <select id="verificationDecision" v-model="verificationForm.verificationDecision"
                              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                              <option value="">Select Decision</option>
                              <option value="Accepted for presentation">Accepted for presentation</option>
                              <option value="Reject">Reject</option>
                            </select>
                          </div>
                          <div v-if="verificationForm.verificationDecision === 'Reject'" class="mt-2">
                            <label for="regretReason" class="block text-sm font-medium text-gray-700">Regret Reason:</label>
                            <textarea id="regretReason" v-model="verificationForm.regretReason" rows="3"
                              class="shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-1 block w-full sm:text-sm border-gray-300 rounded-md"></textarea>
                          </div>
                          <div class="mt-4">
                            <button type="button"
                              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                              @click="saveVerificationDecision">
                              Save Verification
                            </button>
                            <button type="button"
                              class="ml-2 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                              @click="cancelVerificationEdit">
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>

                      <!-- Evaluation Decision Form -->
                      <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div class="p-6 border-t border-gray-100 bg-gray-50">
                          <h4 class="font-semibold text-gray-900 mb-4">Evaluation Decision</h4>
                          <div class="mt-2">
                            <label for="evaluationDecision" class="block text-sm font-medium text-gray-700">Evaluation Decision:</label>
                            <select id="evaluationDecision" v-model="evaluationForm.evaluationDecision"
                              class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                              <option value="">Select Decision</option>
                              <option value="Accepted & Forward">Accepted & Forward</option>
                              <option value="Pending">Pending Changes</option>
                            </select>
                          </div>
                          <div class="mt-4">
                            <button type="button"
                              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                              @click="saveEvaluationDecision">
                              Save Evaluation
                            </button>
                            <button type="button"
                              class="ml-2 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                              @click="cancelEvaluationEdit">
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>

                      <!-- MoU & Undertaking Signing Form -->
                      <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div class="p-6 border-t border-gray-100 bg-gray-50">
                          <h4 class="font-semibold text-gray-900 mb-4">MoU & Undertaking Signing</h4>
                          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                            <div>
                              <label for="licenseName" class="block text-sm font-medium text-gray-700">License Name:</label>
                              <input type="text" id="licenseName" v-model="mouForm.licenseName"
                                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                            </div>
                            <div>
                              <label for="licenseNumber" class="block text-sm font-medium text-gray-700">License Number:</label>
                              <input type="text" id="licenseNumber" v-model="mouForm.licenseNumber"
                                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                            </div>
                            <div>
                              <label for="licenseValidity" class="block text-sm font-medium text-gray-700">License Validity (Years):</label>
                              <input type="number" id="licenseValidity" v-model="mouForm.licenseValidity"
                                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                            </div>
                            <div>
                              <label for="mouSignDate" class="block text-sm font-medium text-gray-700">MoU Sign Date:</label>
                              <input type="date" id="mouSignDate" v-model="mouForm.mouSignDate"
                                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                            </div>
                            <div>
                              <label for="mouValidityDate" class="block text-sm font-medium text-gray-700">MoU Validity Date:</label>
                              <input type="date" id="mouValidityDate" v-model="mouForm.mouValidityDate"
                                class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                            </div>
                          </div>
                          <div class="mt-4">
                            <button type="button"
                              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                              @click="completeRegistration">
                              Complete Registration
                            </button>
                            <button type="button"
                              class="ml-2 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                              @click="cancelMouEdit">
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="button"
                    class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    @click="closeModal"
                  >
                    Close
                  </button>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue';
import { ref } from 'vue';

const props = defineProps({
  isOpen: Boolean,
  application: {
    type: Object,
    default: null,
  },
  closeModal: {
    type: Function,
    required: true,
  },
});

const emit = defineEmits(['update-verification', 'update-evaluation', 'update-mou']);

// Form Data for Verification, Evaluation, and MoU (local to Modal)
const verificationForm = ref({
  verificationDecision: '',
  regretReason: '',
});

const evaluationForm = ref({
  evaluationDecision: '',
  hrInfraFormTemplate: null, // Example, you might need to handle file uploads differently
});

const mouForm = ref({
  licenseName: '',
  licenseNumber: '',
  licenseValidity: null,
  mouSignDate: '',
  mouValidityDate: '',
});

const closeModalHandler = () => {
  props.closeModal();
};

const resetForms = () => {
  verificationForm.value = { verificationDecision: '', regretReason: '' };
  evaluationForm.value = { evaluationDecision: '', hrInfraFormTemplate: null };
  mouForm.value = { licenseName: '', licenseNumber: '', licenseValidity: null, mouSignDate: '', mouValidityDate: '' };
};

const saveVerificationDecision = () => {
  // Here you would typically send the verificationForm.value and props.application.cidNo to your backend
  console.log('Verification Decision Saved:', verificationForm.value, 'for CID:', props.application.cidNo);
  emit('update-verification', { cidNo: props.application.cidNo, verificationData: verificationForm.value });
  props.closeModal();
  resetForms();
};

const cancelVerificationEdit = () => {
  resetForms();
  props.closeModal();
};

const saveEvaluationDecision = () => {
  // Save Evaluation Decision logic (backend call)
  console.log('Evaluation Decision Saved:', evaluationForm.value, 'for CID:', props.application.cidNo);
  emit('update-evaluation', { cidNo: props.application.cidNo, evaluationData: evaluationForm.value });
  props.closeModal();
  resetForms();
};
const cancelEvaluationEdit = () => {
  resetForms();
  props.closeModal();
};

const completeRegistration = () => {
  // Complete Registration Logic (backend call)
  console.log('Registration Completed with MoU details:', mouForm.value, 'for CID:', props.application.cidNo);
  emit('update-mou', { cidNo: props.application.cidNo, mouData: mouForm.value });
  props.closeModal();
  resetForms();
};
const cancelMouEdit = () => {
  resetForms();
  props.closeModal();
};
</script>

<style scoped>
/* Enhanced scrollbar styles */
.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 transparent;
}

.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: #cbd5e1;
  border-radius: 3px;
}

/* Enhanced transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

/* Enhanced card hover effects */
.rounded-xl {
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.rounded-xl:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* Status indicator animations */
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>