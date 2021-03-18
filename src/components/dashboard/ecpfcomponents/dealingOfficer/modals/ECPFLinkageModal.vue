<template>
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
                ECPF Linkage Establishment Application
              </DialogTitle>
              <div class="px-6 py-6">
                <div class="grid grid-cols-1 gap-6">
                  <!-- Current Details of ECPF -->
                  <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-all">
                    <div class="p-6">
                      <div class="flex items-center mb-4">
                        <div class="bg-blue-100 p-2 rounded-md">
                          <DocumentDuplicateIcon class="h-5 w-5 text-blue-600" />
                        </div>
                        <h4 class="font-semibold text-gray-900 ml-2">Current Details of ECPF</h4>
                      </div>
                      <p><strong>ECPF Name:</strong> {{ linkage.ecpfName || 'N/A' }}</p>
                      <p><strong>Proprietor of the ECPF:</strong> {{ linkage.proprietorName || 'N/A' }}</p>
                      <p><strong>CID of the Proprietor:</strong> {{ linkage.proprietorCid || 'N/A' }}</p>
                      <p><strong>Location of ECPF:</strong> {{ linkage.ecpfLocation || 'N/A' }}</p>
                      <p><strong>Contact No.:</strong> {{ linkage.contactNo || 'N/A' }}</p>
                      <p><strong>Email Address:</strong> {{ linkage.emailAddress || 'N/A' }}</p>
                    </div>
                  </div>

                  <!-- Institute Linkage Details (HEI) -->
                  <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-all">
                    <div class="p-6">
                      <div class="flex items-center mb-4">
                        <div class="bg-indigo-100 p-2 rounded-md">
                          <DocumentTextIcon class="h-5 w-5 text-indigo-600" />
                        </div>
                        <h4 class="font-semibold text-gray-900 ml-2">Institute Linkage Details (HEI)</h4>
                      </div>
                      <p><strong>Name of HEI:</strong> {{ linkage.heiName || 'N/A' }}</p>
                      <p><strong>Official Website:</strong> {{ linkage.officialWebsite || 'N/A' }}</p>
                      <p><strong>Location:</strong> {{ linkage.heiLocation || 'N/A' }}</p>
                      <p><strong>Country:</strong> {{ linkage.heiCountry || 'N/A' }}</p>
                      <p><strong>Year of Establishment:</strong> {{ linkage.yearEstablished || 'N/A' }}</p>
                      <p><strong>Recognised By:</strong> {{ linkage.recognizedBy || 'N/A' }}</p>
                      <p><strong>Accredited By:</strong> {{ linkage.accreditedBy || 'N/A' }}</p>
                      <p><strong>Affiliation to, if applicable:</strong> {{ linkage.affiliation || 'N/A' }}</p>
                      <p><strong>Approval from relevant professional bodies, if relevant:</strong> {{ linkage.approvalFromProBodies || 'N/A' }}</p>
                      <p><strong>Report on HEI Visit:</strong> <button class="text-indigo-600 hover:text-indigo-800">View</button></p>
                    </div>
                  </div>

                  <!-- Programme/Course Details -->
                  <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-all">
                    <div class="p-6">
                      <div class="flex items-center mb-4">
                        <div class="bg-green-100 p-2 rounded-md">
                          <DocumentTextIcon class="h-5 w-5 text-green-600" />
                        </div>
                        <h4 class="font-semibold text-gray-900 ml-2">Programme/Course Details</h4>
                      </div>
                      <template v-if="linkage.courses && linkage.courses.length > 0">
                        <div v-for="(course, index) in linkage.courses" :key="index" class="border-b pb-4 mb-4">
                          <h5 class="font-medium text-gray-700 mb-2">Course {{ index + 1 }}</h5>
                          <p><strong>Name of Programme/Courses:</strong> {{ course.programmeName || 'N/A' }}</p>
                          <p><strong>Level:</strong> {{ course.level || 'N/A' }}</p>
                          <p><strong>Minimum Credit:</strong> {{ course.minimumCredit || 'N/A' }}</p>
                          <p><strong>Qualification Type:</strong> {{ course.qualificationType || 'N/A' }}</p>
                          <p><strong>Remarks:</strong> {{ course.remarks || 'N/A' }}</p>
                        </div>
                      </template>
                      <div v-else>
                        <p class="text-center py-6 text-gray-500 italic">No Programme/Course Details Available.</p>
                      </div>
                    </div>
                  </div>

                  <!-- Verification Stage Form -->
                  <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-all">
                    <div class="p-6">
                      <div class="flex items-center mb-4">
                        <div class="bg-yellow-100 p-2 rounded-md">
                          <CheckBadgeIcon class="h-5 w-5 text-yellow-600" />
                        </div>
                        <h4 class="font-semibold text-gray-900 ml-2">A. Linkage Verification</h4>
                      </div>
                      <div class="mt-2 space-y-4">
                        <div>
                          <label for="verificationDecision" class="block text-sm font-medium text-gray-700">Verification Decision:</label>
                          <select id="verificationDecision" v-model="verificationForm.verificationDecision"
                            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                            <option value="">Select Decision</option>
                            <option value="accepted">Accepted</option>
                            <option value="regret">Regret</option>
                          </select>
                        </div>
                        <div v-if="verificationForm.verificationDecision === 'regret'">
                          <label for="regretReason" class="block text-sm font-medium text-gray-700">Regret Reason:</label>
                          <textarea id="regretReason" v-model="verificationForm.regretReason" rows="2"
                            class="shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-1 block w-full sm:text-sm border-gray-300 rounded-md"></textarea>
                        </div>

                        <div class="mt-6 flex justify-end space-x-2">
                          <button type="button"
                            class="rounded-md px-4 py-2 font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-all">
                            Cancel
                          </button>
                          <button type="button"
                            class="rounded-md px-4 py-2 font-semibold text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all"
                            @click="saveVerificationDecision">
                            Save
                          </button>
                          <button type="button"
                            class="rounded-md px-4 py-2 font-semibold text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-all"
                            @click="submitVerification">
                            Submit
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- MoU Acceptance Form -->
                  <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-all">
                    <div class="p-6">
                      <div class="flex items-center mb-4">
                        <div class="bg-orange-100 p-2 rounded-md">
                          <DocumentCheckIcon class="h-5 w-5 text-orange-600" />
                        </div>
                        <h4 class="font-semibold text-gray-900 ml-2">B. MoU Acceptance</h4>
                      </div>
                      <div class="mt-2 space-y-4">
                        <div>
                          <label for="mouAcceptance" class="block text-sm font-medium text-gray-700">MoU Acceptance:</label>
                          <select id="mouAcceptance" v-model="mouAcceptanceForm.mouAcceptance"
                            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                            <option value="">Select Decision</option>
                            <option value="accept">Accept</option>
                            <option value="revert">Revert to Modify</option>
                          </select>
                        </div>
                        <div v-if="mouAcceptanceForm.mouAcceptance === 'revert'">
                          <label for="revertReason" class="block text-sm font-medium text-gray-700">Reason (if not accepted):</label>
                          <textarea id="revertReason" v-model="mouAcceptanceForm.revertReason" rows="2"
                            class="shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-1 block w-full sm:text-sm border-gray-300 rounded-md"></textarea>
                        </div>
                        <div v-if="mouAcceptanceForm.mouAcceptance === 'accept'">
                          <label for="mouValidity" class="block text-sm font-medium text-gray-700">MoU Validity Date:</label>
                          <input type="date" id="mouValidity" v-model="mouAcceptanceForm.mouValidity"
                            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                        </div>

                        <div class="mt-6 flex justify-end space-x-2">
                          <button type="button"
                            class="rounded-md px-4 py-2 font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-all">
                            Cancel
                          </button>
                          <button type="button"
                            class="rounded-md px-4 py-2 font-semibold text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all"
                            @click="saveMouAcceptance">
                            Save
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
              <div class="px-6 py-4 bg-gray-50 flex justify-end">
                <button type="button" @click="closeModal" class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
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
import { ref, watch } from 'vue';
import {
  DocumentTextIcon,
  DocumentDuplicateIcon,
  CheckBadgeIcon,
  DocumentCheckIcon
} from '@heroicons/vue/24/outline'

const props = defineProps({
  isOpen: Boolean,
  linkage: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(['close', 'update-verification', 'update-mou-acceptance']);

const closeModal = () => {
  emit('close');
};

const verificationForm = ref({
  verificationDecision: '',
  regretReason: '',
});

const mouAcceptanceForm = ref({
  mouAcceptance: '',
  revertReason: '',
  mouValidity: null,
});

const saveVerificationDecision = () => {
  console.log('Verification Decision:', verificationForm.value, 'for Linkage ID:', props.linkage.id);
  emit('update-verification', {
    linkageId: props.linkage.id,
    verificationData: verificationForm.value
  });
  // closeModal(); // Decide if modal should close after save or only after submit
};

const submitVerification = () => {
  console.log('Verification Submitted:', verificationForm.value, 'for Linkage ID:', props.linkage.id);
  emit('update-verification', {
    linkageId: props.linkage.id,
    verificationData: verificationForm.value
  });
  closeModal();
};

const saveMouAcceptance = () => {
  console.log('MoU Acceptance Saved:', mouAcceptanceForm.value, 'for Linkage ID:', props.linkage.id);
  emit('update-mou-acceptance', {
    linkageId: props.linkage.id,
    mouAcceptanceData: mouAcceptanceForm.value
  });
  closeModal();
};


watch(() => props.linkage, (newLinkage) => {
  if (newLinkage) {
    // Initialize verification stage fields if needed, or fetch existing values
    verificationForm.value.verificationDecision = '';
    verificationForm.value.regretReason = '';
    mouAcceptanceForm.value.mouAcceptance = '';
    mouAcceptanceForm.value.mouValidity = null;
    mouAcceptanceForm.value.revertReason = '';
  }
}, { immediate: true });
</script>