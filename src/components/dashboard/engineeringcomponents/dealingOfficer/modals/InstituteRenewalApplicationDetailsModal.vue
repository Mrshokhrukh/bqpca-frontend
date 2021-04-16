<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="isOpen" class="fixed z-50 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <!-- Background overlay -->
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="isProcessingAction ? null : closeModal"></div>
          <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">​</span>

          <!-- Modal panel -->
           <Transition name="modal-transform">
             <div v-if="isOpen"
              class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <!-- Header -->
                <div class="sm:flex sm:items-start mb-4 border-b pb-3">
                   <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                     <!-- Heroicon name: outline/document-text -->
                     <svg class="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                       <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                     </svg>
                   </div>
                  <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Institute Application Details
                    </h3>
                    <p class="text-sm text-gray-500">
                      {{ applicationDetails.name_of_institution || 'N/A Institute' }} (ID: {{ applicationDetails.id }})
                    </p>
                  </div>
                   <button @click="closeModal" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded" :disabled="isProcessingAction">
                      <span class="sr-only">Close</span>
                      <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                   </button>
                </div>

                 <!-- Details Section -->
                <div class="mt-3 max-h-[60vh] overflow-y-auto pr-2">
                  <dl class="space-y-4">

                    <!-- Key Details -->
                     <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                        <div><span class="font-medium text-gray-600">Institute Name:</span> {{ applicationDetails.name_of_institution || 'N/A' }}</div>
                        <div><span class="font-medium text-gray-600">Course Title:</span> {{ applicationDetails.title_of_course || 'N/A' }}</div>
                        <div><span class="font-medium text-gray-600">Course Duration:</span> {{ applicationDetails.course_duration || 'N/A' }} {{ applicationDetails.course_duration === 1 ? 'year' : 'years' }}</div>
                        <div><span class="font-medium text-gray-600">Commencement:</span> {{ formatDate(applicationDetails.commencement_date) }}</div>
                        <div><span class="font-medium text-gray-600">Valid Since:</span> {{ formatDate(applicationDetails.valid_since) }}</div>
                        <div :class="getValidityClass(applicationDetails.valid_till)"><span class="font-medium text-gray-600">Valid Till:</span> {{ formatDate(applicationDetails.valid_till) }}</div>
                        <div><span class="font-medium text-gray-600">Applicant Name:</span> {{ applicationDetails.full_name || 'N/A' }}</div>
                        <div><span class="font-medium text-gray-600">CID:</span> {{ applicationDetails.CID || 'N/A' }}</div>
                        <div><span class="font-medium text-gray-600">Contact:</span> {{ applicationDetails.contact_no || 'N/A' }}</div>
                        <div><span class="font-medium text-gray-600">Email:</span> {{ applicationDetails.email_address || 'N/A' }}</div>
                     </div>

                     <div class="pt-3 border-t grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                        <div>
                            <span class="font-medium text-gray-600">Active Status: </span>
                            <span :class="getStatusClass(applicationDetails.is_active, 'active')">
                              {{ applicationDetails.is_active ? 'Active' : 'Inactive' }}
                            </span>
                         </div>
                         <div>
                            <span class="font-medium text-gray-600">Review Decision: </span>
                            <span :class="getDecisionClass(applicationDetails.do_dpr_review_decision)">
                              {{ applicationDetails.do_dpr_review_decision || 'N/A' }}
                            </span>
                         </div>
                         <div>
                            <span class="font-medium text-gray-600">Payment Status: </span>
                            <span :class="getStatusClass(applicationDetails.is_payment_complete, 'payment')">
                                {{ applicationDetails.is_payment_complete ? 'Complete' : 'Pending / Not Required' }}
                            </span>
                         </div>
                     </div>

                     <div v-if="applicationDetails.do_dpr_reason_if_rejected" class="pt-3 border-t">
                        <p class="text-sm font-medium text-gray-600">Reason for Rejection/Regret:</p>
                        <p class="mt-1 text-sm text-gray-800 bg-red-50 p-2 rounded border border-red-100">{{ applicationDetails.do_dpr_reason_if_rejected }}</p>
                     </div>

                     <!-- Document Links -->
                     <div v-if="hasDocuments" class="pt-3 border-t">
                          <p class="text-sm font-medium text-gray-600 mb-1">Documents:</p>
                          <ul class="list-disc list-inside text-sm space-y-1">
                              <li v-if="applicationDetails.supporting_documents">
                                  <a :href="applicationDetails.supporting_documents" target="_blank" class="text-blue-600 hover:underline">Supporting Document</a>
                              </li>
                               <li v-if="applicationDetails.institute_eoi_supporting_documents">
                                  <a :href="applicationDetails.institute_eoi_supporting_documents" target="_blank" class="text-blue-600 hover:underline">EOI Document</a>
                              </li>
                               <li v-if="applicationDetails.do_dpr_report">
                                  <a :href="applicationDetails.do_dpr_report" target="_blank" class="text-blue-600 hover:underline">DPR Report</a>
                              </li>
                          </ul>
                     </div>

                    <!-- Rejection Reason Input (Shown when Regret is initiated) -->
                     <div v-if="showRejectionInput" class="pt-4 border-t">
                          <label for="rejection_reason" class="block text-sm font-medium text-gray-700">Reason for Regret <span class="text-red-600">*</span></label>
                          <textarea id="rejection_reason" v-model="rejectionReason" rows="3"
                            class="mt-1 shadow-sm block w-full sm:text-sm border rounded-md"
                            :class="rejectionError ? 'border-red-400 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'"
                            placeholder="Please provide a clear reason..."></textarea>
                           <p v-if="rejectionError" class="mt-1 text-xs text-red-600">{{ rejectionError }}</p>
                     </div>

                  </dl>
                </div>
              </div>

              <!-- Footer / Actions -->
              <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse items-center gap-3">
                <!-- Standard Buttons -->
                 <button v-if="!showRejectionInput && canApproveOrRegret" type="button"
                  class="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:text-sm disabled:opacity-50"
                  @click="approveAction" :disabled="isProcessingAction">
                  Approve
                </button>
                <button v-if="!showRejectionInput && canApproveOrRegret" type="button"
                  class="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm disabled:opacity-50"
                  @click="initiateRegret" :disabled="isProcessingAction">
                  Regret
                </button>

                <!-- Regret Confirmation Buttons -->
                 <button v-if="showRejectionInput" type="button"
                  class="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm disabled:opacity-50"
                  @click="confirmRegretAction" :disabled="!rejectionReason.trim() || isProcessingAction">
                  Confirm Regret
                </button>
                 <button v-if="showRejectionInput" type="button"
                   class="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm disabled:opacity-50"
                   @click="cancelRegret" :disabled="isProcessingAction">
                    Cancel Regret
                 </button>


                <button type="button"
                  class="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm mr-auto disabled:opacity-50"
                  @click="closeModal" :disabled="isProcessingAction">
                  Close
                </button>

                <!-- Loading Indicator -->
                 <div v-if="isProcessingAction" class="flex items-center justify-center ml-4">
                     <div class="inline-block animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-600"></div>
                     <span class="ml-2 text-sm text-gray-600">Processing...</span>
                 </div>

              </div>
            </div>
           </Transition>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  isOpen: Boolean,
  applicationDetails: {
    type: Object,
    default: () => ({})
  },
  isProcessingAction: Boolean
});

const emit = defineEmits(['close-modal', 'approve-application', 'regret-application']);

const showRejectionInput = ref(false);
const rejectionReason = ref('');
const rejectionError = ref('');

// Reset internal modal state when it opens or details change
watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    showRejectionInput.value = false;
    rejectionReason.value = '';
    rejectionError.value = '';
  }
});

// Simplified computed properties
const canApproveOrRegret = computed(() =>
  props.applicationDetails?.do_dpr_review_decision === 'Pending'
);

const hasDocuments = computed(() =>
  !!props.applicationDetails?.supporting_documents ||
  !!props.applicationDetails?.institute_eoi_supporting_documents ||
  !!props.applicationDetails?.do_dpr_report
);

// --- Actions ---
const closeModal = () => {
  if (!props.isProcessingAction) {
    emit('close-modal');
  }
};

const initiateRegret = () => {
  if (!props.isProcessingAction) {
    showRejectionInput.value = true;
    rejectionError.value = '';
  }
};

const cancelRegret = () => {
  if (!props.isProcessingAction) {
    showRejectionInput.value = false;
    rejectionReason.value = '';
    rejectionError.value = '';
  }
};

const approveAction = () => {
  if (!props.isProcessingAction) {
    emit('approve-application', props.applicationDetails);
  }
};

const confirmRegretAction = () => {
  if (props.isProcessingAction) return;

  if (!rejectionReason.value.trim()) {
    rejectionError.value = 'Reason cannot be empty.';
    return;
  }

  rejectionError.value = '';
  emit('regret-application', props.applicationDetails, rejectionReason.value.trim());
};

// --- Consolidated Helper Functions ---
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date';

    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch(e) {
    return "Invalid Date";
  }
};

// Combined status class handler for multiple status types
const getStatusClass = (status, type) => {
  if (status === true) {
    return 'px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800';
  } else {
    return type === 'payment'
      ? 'px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800'
      : 'px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800';
  }
};

// More concise decision class handler
const getDecisionClass = (decision) => {
  const lowerDecision = String(decision || '').toLowerCase();
  const classMap = {
    'approved': 'bg-blue-100 text-blue-800',
    'rejected': 'bg-red-100 text-red-800',
    'regretted': 'bg-red-100 text-red-800',
    'pending': 'bg-yellow-100 text-yellow-800'
  };

  const colorClass = classMap[lowerDecision] || 'bg-gray-100 text-gray-800';
  return `px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${colorClass}`;
};

const getValidityClass = (validTillDate) => {
  if (!validTillDate) return 'text-gray-500';

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const expiryDate = new Date(validTillDate);
    if (isNaN(expiryDate.getTime())) return 'text-purple-600 font-medium';

    expiryDate.setHours(0, 0, 0, 0);
    const diffDays = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'text-red-600 font-medium';
    if (diffDays <= 30) return 'text-orange-600';
    if (diffDays <= 90) return 'text-yellow-600';
    return 'text-gray-600';
  } catch(e) {
    return 'text-purple-600 font-medium';
  }
};
</script>

<style scoped>
/* Modal Transitions */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-transform-enter-active {
  transition: all 0.3s ease-out;
}
.modal-transform-leave-active {
  transition: all 0.2s ease-in;
}
.modal-transform-enter-from,
.modal-transform-leave-to {
  transform: translateY(20px) scale(0.95);
  opacity: 0;
}

/* Improve scrollbar visibility */
.max-h-\[60vh\]::-webkit-scrollbar { width: 6px; }
.max-h-\[60vh\]::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
.max-h-\[60vh\]::-webkit-scrollbar-thumb { background: #c5c5c5; border-radius: 10px; }
.max-h-\[60vh\]::-webkit-scrollbar-thumb:hover { background: #a8a8a8; }
.max-h-\[60vh\] { scrollbar-width: thin; scrollbar-color: #c5c5c5 #f1f1f1; }
</style>
