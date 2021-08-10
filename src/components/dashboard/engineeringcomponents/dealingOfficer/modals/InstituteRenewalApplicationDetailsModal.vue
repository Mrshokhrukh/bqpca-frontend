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
            <div v-if="isOpen" class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
              <!-- Header -->
              <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 border-b border-gray-200">
                <div class="sm:flex sm:items-start">
                  <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg class="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                  </div>
                  <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 id="modal-title" class="text-lg leading-6 font-medium text-gray-900">
                      Renewal Application Review
                    </h3>
                    <p class="text-sm text-gray-500">
                      {{ institute.name_of_institution || 'N/A' }} (ID: {{ institute.id }})
                    </p>
                  </div>
                  <button @click="closeModal" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded" :disabled="isProcessingAction">
                    <span class="sr-only">Close</span>
                    <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              </div>

              <!-- Details Section -->
              <div class="px-4 sm:px-6 py-4 max-h-[65vh] overflow-y-auto styled-scrollbar">
                <div class="space-y-6">
                  <!-- Institute Licence Information -->
                  <div>
                    <h4 class="text-base font-semibold text-gray-800 border-b pb-2 mb-3">Institute Licence Information</h4>
                    <dl class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-sm">
                      <div>
                        <dt class="font-medium text-gray-500">Applicant Name</dt>
                        <dd class="text-gray-900">{{ institute.full_name || 'N/A' }}</dd>
                      </div>
                      <div>
                        <dt class="font-medium text-gray-500">Course Title</dt>
                        <dd class="text-gray-900">{{ institute.title_of_course || 'N/A' }}</dd>
                      </div>
                      <div>
                        <dt class="font-medium text-gray-500">Current Licence Status</dt>
                        <dd>
                           <span :class="getInstituteDisplayStatus(institute).class">
                            {{ getInstituteDisplayStatus(institute).text }}
                           </span>
                        </dd>
                      </div>
                      <div>
                        <dt class="font-medium text-gray-500">Licence Valid Till</dt>
                        <dd class="text-gray-900">{{ formatDate(institute.valid_till) }}</dd>
                      </div>
                      <div>
                        <dt class="font-medium text-gray-500">Contact</dt>
                        <dd class="text-gray-900">{{ institute.contact_no || 'N/A' }}</dd>
                      </div>
                      <div>
                        <dt class="font-medium text-gray-500">Email</dt>
                        <dd class="text-gray-900">{{ institute.email_address || 'N/A' }}</dd>
                      </div>
                    </dl>
                  </div>

                  <!-- Renewal Submission Details -->
                  <div>
                    <h4 class="text-base font-semibold text-gray-800 border-b pb-2 mb-3">Renewal Submission Details</h4>
                     <dl class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-sm">
                        <div>
                            <dt class="font-medium text-gray-500">Submitted On</dt>
                            <dd class="text-gray-900">{{ formatDate(applicationDetails.created_at) }}</dd>
                        </div>
                        <div>
                            <dt class="font-medium text-gray-500">Renewal Status</dt>
                            <dd :class="getReviewDecisionClass(applicationDetails.renewal_status)">
                                {{ applicationDetails.renewal_status_display }}
                            </dd>
                        </div>
                        <div class="md:col-span-2" v-if="applicationDetails.user_remarks">
                            <dt class="font-medium text-gray-500 mb-1">Applicant's Remarks</dt>
                            <dd class="text-gray-800 bg-gray-50 p-3 rounded border border-gray-200 text-sm">
                                {{ applicationDetails.user_remarks }}
                            </dd>
                        </div>
                        <div class="md:col-span-2" v-if="applicationDetails.renewal_document">
                           <dt class="font-medium text-gray-500">Attached Document</dt>
                           <dd>
                             <a :href="applicationDetails.renewal_document" target="_blank" class="text-blue-600 hover:underline inline-flex items-center">
                               View Renewal Document
                               <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1.5" viewBox="0 0 20 20" fill="currentColor"><path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" /><path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" /></svg>
                             </a>
                           </dd>
                        </div>
                    </dl>
                  </div>

                  <!-- Action Panel -->
                  <div v-if="canTakeAction" class="pt-4 border-t">
                     <div v-if="!actionType">
                        <p class="text-sm text-gray-600 mb-3">Choose an action for this renewal application.</p>
                     </div>
                     <div v-else>
                        <label for="officer_remarks" class="block text-sm font-medium text-gray-700">
                          Officer Remarks <span v-if="actionType === 'regret'" class="text-red-500">*</span>
                          <span v-else>(Optional)</span>
                        </label>
                        <textarea
                          id="officer_remarks"
                          v-model="officerRemarks"
                          rows="3"
                          class="mt-1 shadow-sm block w-full sm:text-sm border rounded-md"
                          :class="remarksError ? 'border-red-400 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'"
                          :placeholder="actionType === 'regret' ? 'A clear reason for rejection is required.' : 'Add optional remarks for approval...'"
                        ></textarea>
                        <p v-if="remarksError" class="mt-1 text-xs text-red-600">{{ remarksError }}</p>
                      </div>
                  </div>
                </div>
              </div>

              <!-- Footer / Actions -->
              <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse items-center gap-3">
                <!-- Action Buttons -->
                <div v-if="canTakeAction">
                    <!-- Initial State Buttons -->
                    <div v-if="!actionType" class="flex gap-3">
                         <button type="button" @click="setActionType('approve')" :disabled="isProcessingAction" class="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:text-sm disabled:opacity-50">Approve</button>
                         <button type="button" @click="setActionType('regret')" :disabled="isProcessingAction" class="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm disabled:opacity-50">Regret</button>
                    </div>
                    <!-- Confirmation State Buttons -->
                    <div v-else class="flex gap-3">
                         <button v-if="actionType === 'approve'" type="button" @click="confirmAction" :disabled="isProcessingAction" class="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:text-sm disabled:opacity-50">Confirm Approval</button>
                         <button v-if="actionType === 'regret'" type="button" @click="confirmAction" :disabled="!officerRemarks.trim() || isProcessingAction" class="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm disabled:opacity-50">Confirm Regret</button>
                         <button type="button" @click="cancelAction" :disabled="isProcessingAction" class="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm disabled:opacity-50">Cancel</button>
                    </div>
                </div>

                <button type="button" @click="closeModal" :disabled="isProcessingAction" class="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm mr-auto disabled:opacity-50">Close</button>

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
import { ref, computed, watch } from 'vue'

const props = defineProps({
  isOpen: Boolean,
  applicationDetails: { type: Object, default: () => ({}) },
  isProcessingAction: Boolean,
})

const emit = defineEmits(['close-modal', 'approve-application', 'regret-application'])

const actionType = ref(null) // 'approve' or 'regret'
const officerRemarks = ref('')
const remarksError = ref('')

const institute = computed(() => props.applicationDetails?.institute_details || {})
const canTakeAction = computed(() => props.applicationDetails?.renewal_status === 'PENDING_REVIEW')

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    actionType.value = null;
    officerRemarks.value = '';
    remarksError.value = '';
  }
});

const closeModal = () => !props.isProcessingAction && emit('close-modal');
const setActionType = (type) => actionType.value = type;
const cancelAction = () => {
    actionType.value = null;
    officerRemarks.value = '';
    remarksError.value = '';
}

const confirmAction = () => {
  if (props.isProcessingAction) return;

  if (actionType.value === 'regret' && !officerRemarks.value.trim()) {
    remarksError.value = 'Reason for regret cannot be empty.';
    return;
  }
  remarksError.value = '';

  if (actionType.value === 'approve') {
    emit('approve-application', props.applicationDetails, officerRemarks.value.trim());
  } else if (actionType.value === 'regret') {
    emit('regret-application', props.applicationDetails, officerRemarks.value.trim());
  }
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  } catch (e) {
    return 'Invalid Date';
  }
}

const getInstituteDisplayStatus = (inst) => {
  const baseClass = 'px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full';
  if (!inst?.valid_till) return { text: 'Unknown', class: `${baseClass} bg-gray-100 text-gray-800` };

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiryDate = new Date(inst.valid_till);
  expiryDate.setHours(0, 0, 0, 0);

  if (expiryDate < today) return { text: 'Expired', class: `${baseClass} bg-red-100 text-red-800` };
  return { text: 'Active', class: `${baseClass} bg-green-100 text-green-800` };
}

const getReviewDecisionClass = (status) => {
  const lowerStatus = String(status).toLowerCase();
  const base = 'px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full';
  const colors = {
    'pending_review': 'bg-yellow-100 text-yellow-800',
    'awaiting_payment': 'bg-blue-100 text-blue-800',
    'completed': 'bg-green-100 text-green-800',
    'rejected': 'bg-red-100 text-red-800'
  };
  return `${base} ${colors[lowerStatus] || 'bg-gray-100 text-gray-800'}`;
}
</script>

<style scoped>
.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.3s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }
.modal-transform-enter-active { transition: all 0.3s ease-out; }
.modal-transform-leave-active { transition: all 0.2s ease-in; }
.modal-transform-enter-from, .modal-transform-leave-to { transform: translateY(20px) scale(0.95); opacity: 0; }

.styled-scrollbar::-webkit-scrollbar { width: 6px; }
.styled-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
.styled-scrollbar::-webkit-scrollbar-thumb { background: #c5c5c5; border-radius: 10px; }
.styled-scrollbar::-webkit-scrollbar-thumb:hover { background: #a8a8a8; }
.styled-scrollbar { scrollbar-width: thin; scrollbar-color: #c5c5c5 #f1f1f1; }
</style>