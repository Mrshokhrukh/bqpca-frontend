<template>
  <div v-if="isOpen" class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <!-- Modal overlay -->
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="$emit('close')"></div>

      <!-- This element is to trick the browser into centering the modal contents. -->
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true"> </span>

      <div class="relative inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <div class="absolute top-0 right-0 pt-4 pr-4">
          <button type="button" class="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" @click="openEditMode">
            <span class="sr-only">Edit</span>
            <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
        </div>
        
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
              <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                ECPF Renewal Application Review
              </h3>
              <div class="mt-4 grid grid-cols-1 gap-4">
                <!-- Current ECPF Details -->
                <div class="border-b pb-2">
                  <h4 class="text-sm font-semibold text-gray-700 mb-2">Current ECPF Information</h4>
                  <div class="grid grid-cols-2 gap-2 text-sm">
                    <div><span class="font-medium">ECPF Name:</span></div>
                    <div>{{ application?.currentDetails?.ecpfName || 'N/A' }}</div>
                    <div><span class="font-medium">Licence No.:</span></div>
                    <div>{{ application?.currentDetails?.licenceNo || 'N/A' }}</div>
                    <div><span class="font-medium">Location:</span></div>
                    <div>{{ application?.currentDetails?.location || 'N/A' }}</div>
                    <div><span class="font-medium">Name of Proprietor:</span></div>
                    <div>{{ application?.currentDetails?.proprietorName || 'N/A' }}</div>
                    <div><span class="font-medium">CID:</span></div>
                    <div>{{ application?.currentDetails?.cid || 'N/A' }}</div>
                    <div><span class="font-medium">Contact No.:</span></div>
                    <div>{{ application?.currentDetails?.contactNo || 'N/A' }}</div>
                    <div><span class="font-medium">Email Address:</span></div>
                    <div>{{ application?.currentDetails?.emailAddress || 'N/A' }}</div>
                  </div>
                </div>

                <!-- Renewal Details -->
                <div class="border-b pb-2">
                  <h4 class="text-sm font-semibold text-gray-700 mb-2">Renewal Details</h4>
                  <div class="grid grid-cols-2 gap-2 text-sm">
                    <div><span class="font-medium">Renewal Period:</span></div>
                    <div>{{ application?.renewalDetails?.period || 'N/A' }}</div>
                    <div><span class="font-medium">Payment Status:</span></div>
                    <div>
                      <span :class="application?.paymentStatus === 'Paid' ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'">
                        {{ application?.paymentStatus || 'Pending' }}
                      </span>
                    </div>
                    <div v-if="application?.paymentStatus === 'Paid'"><span class="font-medium">Payment Date:</span></div>
                    <div v-if="application?.paymentStatus === 'Paid'">{{ application?.paymentDate || 'N/A' }}</div>
                  </div>
                </div>

                <!-- External Party Contact Details -->
                <div class="border-b pb-2">
                  <h4 class="text-sm font-semibold text-gray-700 mb-2">External Party Contact Details</h4>
                  <div class="grid grid-cols-2 gap-2 text-sm">
                    <div><span class="font-medium">Name of Proprietor:</span></div>
                    <div>{{ application?.externalPartyContactDetails?.nameOfProprietor || 'N/A' }}</div>
                    <div><span class="font-medium">Nationality:</span></div>
                    <div>{{ application?.externalPartyContactDetails?.nationality || 'N/A' }}</div>
                    <div><span class="font-medium">Designation:</span></div>
                    <div>{{ application?.externalPartyContactDetails?.designation || 'N/A' }}</div>
                    <div><span class="font-medium">Email Address:</span></div>
                    <div>{{ application?.externalPartyContactDetails?.emailAddress || 'N/A' }}</div>
                    <div><span class="font-medium">Contact Number:</span></div>
                    <div>{{ application?.externalPartyContactDetails?.contactNumber || 'N/A' }}</div>
                    <div><span class="font-medium">Website:</span></div>
                    <div>{{ application?.externalPartyContactDetails?.website || 'N/A' }}</div>
                  </div>
                </div>

                <!-- Collaboration Description -->
                <div class="border-b pb-2">
                  <h4 class="text-sm font-semibold text-gray-700 mb-2">Collaboration Description</h4>
                  <div class="grid grid-cols-1 gap-2 text-sm">
                    <div>{{ application?.collaborationDescription || 'N/A' }}</div>
                  </div>
                </div>

                <!-- Supporting Documents -->
                <div class="border-b pb-2">
                  <h4 class="text-sm font-semibold text-gray-700 mb-2">Supporting Documents</h4>
                  <div class="grid grid-cols-1 gap-2 text-sm">
                    <div>{{ application?.supportingDocuments || 'N/A' }}</div>
                  </div>
                </div>
                
                <!-- Previous Review Notes -->
                <div v-if="application?.previousReviewNotes" class="border-b pb-2">
                  <h4 class="text-sm font-semibold text-gray-700 mb-2">Previous Review Notes</h4>
                  <div class="grid grid-cols-1 gap-2 text-sm bg-gray-50 p-2 rounded">
                    <div>{{ application?.previousReviewNotes }}</div>
                  </div>
                </div>

                <!-- Chief's Decision -->
                <div class="mt-4">
                  <h4 class="text-sm font-semibold text-gray-700 mb-2">Chief's Decision</h4>
                  <div class="grid grid-cols-1 gap-3">
                    <div>
                      <label for="decision" class="block text-sm font-medium text-gray-700">Decision</label>
                      <select id="decision" v-model="chiefDecision" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                        <option value="">Select a decision</option>
                        <option value="approved">Approve & Forward</option>
                        <option value="regretted">Regret</option>
                        <option value="hold">Hold for Verification</option>
                      </select>
                    </div>
                    <div v-if="chiefDecision === 'regretted' || chiefDecision === 'hold'">
                      <label for="reason" class="block text-sm font-medium text-gray-700">Reason/Corrective Measures</label>
                      <textarea id="reason" v-model="decisionReason" rows="3" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button 
            type="button" 
            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
            @click="submitDecision"
          >
            Submit Decision
          </button>
          <button 
            type="button" 
            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            @click="downloadRecommendationLetter"
          >
            Generate eRecommendation
          </button>
          <button 
            type="button" 
            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:mr-3 sm:w-auto sm:text-sm"
            @click="$emit('close')"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, ref} from 'vue';

const props = defineProps({
  isOpen: Boolean,
  application: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(['close', 'submit-decision', 'download-letter', 'edit']);

const chiefDecision = ref('');
const decisionReason = ref('');

const submitDecision = () => {
  emit('submit-decision', {
    applicationId: props.application?.id,
    decision: chiefDecision.value,
    reason: decisionReason.value
  });
};

const downloadRecommendationLetter = () => {
  emit('download-letter', props.application?.id);
};

const openEditMode = () => {
  emit('edit', props.application?.id);
};
</script>