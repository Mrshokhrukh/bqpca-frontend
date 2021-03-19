<!-- InHouseEventModal.vue -->
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
              class="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-gray-50 shadow-2xl transition-all">
              <!-- Application Header -->
              <div v-if="application" class="px-8 py-6 bg-gradient-to-r from-indigo-500 to-blue-600 text-white">
                <div class="flex justify-between items-center">
                  <div>
                    <h2 class="text-2xl font-bold tracking-tight">In-House Event Application</h2>
                    <p class="mt-1 text-white/90">Application ID: {{ application.cid }}</p>
                  </div>
                </div>
              </div>

              <div v-if="application" class="px-8 py-6 bg-white">
                <div class="grid grid-cols-1 gap-8">
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
                      <p><strong>Institute:</strong> {{ application.institute || 'N/A' }}</p>
                    </div>
                  </div>

                  <!-- Proposed In-House Event Details -->
                  <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-all">
                    <div class="p-6">
                      <div class="flex items-center mb-4">
                        <div class="bg-green-100 p-2 rounded-md">
                          <DocumentTextIcon class="h-5 w-5 text-green-600" />
                        </div>
                        <h4 class="font-semibold text-gray-900 ml-2">Proposed In-House Event Details</h4>
                      </div>
                      <p><strong>Event Name:</strong> {{ application.eventName || 'N/A' }}</p>
                      <p><strong>Event Description:</strong> {{ application.eventDescription || 'N/A' }}</p>
                      <p><strong>Event Purpose:</strong> {{ application.eventPurpose || 'N/A' }}</p>
                      <p><strong>Event Location:</strong> {{ application.eventLocation || 'N/A' }}</p>
                    </div>
                  </div>

                  <!-- Representative Details -->
                  <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-all">
                    <div class="p-6">
                      <div class="flex items-center mb-4">
                        <div class="bg-purple-100 p-2 rounded-md">
                          <UserIcon class="h-5 w-5 text-purple-600" />
                        </div>
                        <h4 class="font-semibold text-gray-900 ml-2">Representative Details</h4>
                      </div>
                      <div v-if="application.representatives && application.representatives.length > 0">
                        <div v-for="(rep, index) in application.representatives" :key="index" class="border-b pb-4 mb-4">
                          <h5 class="font-medium text-gray-700 mb-2">Representative {{ index + 1 }}</h5>
                          <p><strong>Name:</strong> {{ rep.name || 'N/A' }}</p>
                          <p><strong>Passport No:</strong> {{ rep.passportNo || 'N/A' }}</p>
                          <p><strong>Nationality:</strong> {{ rep.nationality || 'N/A' }}</p>
                        </div>
                      </div>
                      <div v-else>
                        <p class="text-center py-6 text-gray-500 italic">No Representative Details Available.</p>
                      </div>
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
                            @click="showMessageBox('accept')">
                            <CheckIcon class="h-4 w-4 inline-block mr-1" />
                            Accept
                          </button>
                          <button type="button"
                            class="rounded-md px-4 py-2 font-semibold text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-all"
                            @click="showMessageBox('reject')">
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

  <!-- Message Box Modal -->
  <TransitionRoot appear :show="isMessageBoxOpen" as="div">
    <Dialog as="div" @close="closeMessageBox" class="relative z-50">
      <TransitionChild as="div" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100"
        leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4">
          <TransitionChild as="div" enter="duration-300 ease-out" enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95">
            <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 shadow-xl transition-all">
              <h3 class="text-lg font-medium leading-6 text-gray-900 mb-4">
                {{ messageBoxAction === 'accept' ? 'Accept Application' : 'Regret Application' }}
              </h3>

              <div class="mt-2">
                <p class="text-sm text-gray-500 mb-3">
                  {{ messageBoxAction === 'accept' ?
                    'Please provide any additional messages for acceptance:' :
                    'Please provide reason for regret:'
                  }}
                </p>
                <textarea
                  v-model="messageBoxText"
                  rows="4"
                  class="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  :placeholder="messageBoxAction === 'accept' ? 'Enter acceptance message...' : 'Enter regret reason...'"
                ></textarea>
              </div>

              <div class="mt-5 flex justify-end space-x-3">
                <button
                  type="button"
                  class="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                  @click="closeMessageBox"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  class="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  @click="confirmAction"
                >
                  Confirm
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
import { Dialog, DialogPanel, TransitionRoot, TransitionChild } from '@headlessui/vue'
import { ref, watch } from 'vue';
import {
  DocumentTextIcon,
  DocumentDuplicateIcon,
  CheckBadgeIcon,
  CheckIcon,
  XMarkIcon,
  UserIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/vue/24/outline'

const props = defineProps({
  isOpen: Boolean,
  application: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(['close', 'update-verification']);

const closeModal = () => {
  emit('close');
};

const verificationForm = ref({
  verificationDecision: '',
  regretReason: '',
  conditionText: '',
  remarksText: '',
});

// Message box state
const isMessageBoxOpen = ref(false);
const messageBoxAction = ref('');
const messageBoxText = ref('');

const showMessageBox = (action) => {
  messageBoxAction.value = action;
  messageBoxText.value = '';
  isMessageBoxOpen.value = true;
};

const closeMessageBox = () => {
  isMessageBoxOpen.value = false;
};

const confirmAction = () => {
  if (messageBoxAction.value === 'accept') {
    verificationForm.value.verificationDecision = 'accepted';
    verificationForm.value.conditionText = messageBoxText.value;
    saveVerificationDecision('Accepted');
  } else if (messageBoxAction.value === 'reject') {
    verificationForm.value.verificationDecision = 'regretted';
    verificationForm.value.regretReason = messageBoxText.value;
    saveVerificationDecision('Regretted');
  }
  closeMessageBox();
};

const saveVerificationDecision = (action) => {
  console.log('Verification Decision:', verificationForm.value, 'Action:', action, 'for CID:', props.application.cid);
  emit('update-verification', {
    applicationId: props.application.id, // Or use CID if ID is not available/suitable
    verificationData: { ...verificationForm.value, verificationStatus: action }
  });
  closeModal();
};

const submitVerification = () => {
  saveVerificationDecision(verificationForm.value.verificationDecision === 'accepted' ? 'Accepted' : 'Regretted');
};

watch(() => props.application, (newApplication) => {
  if (newApplication) {
    // Initialize verification stage fields if needed, or fetch existing values if applicable
    verificationForm.value.verificationDecision = '';
    verificationForm.value.regretReason = '';
    verificationForm.value.conditionText = '';
    verificationForm.value.remarksText = '';
  }
}, { immediate: true });
</script>