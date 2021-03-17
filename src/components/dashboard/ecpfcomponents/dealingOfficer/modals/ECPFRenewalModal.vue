<template>
  <div v-if="application" class="fixed z-50 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
      <!-- Backdrop -->
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity backdrop-blur-sm" aria-hidden="true" @click="emit('close')"></div>

      <!-- Modal positioning -->
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

      <!-- Modal content -->
      <div class="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full border border-gray-200">
        <!-- Header -->
        <div class="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4 flex justify-between items-center">
          <h3 class="text-xl font-semibold text-white" id="modal-title">
            Renewal Application Details
          </h3>
          <div class="flex space-x-2">
            <button
              @click="toggleEditMode"
              class="text-white hover:text-gray-200 focus:outline-none p-1 bg-blue-700 rounded-md"
              :title="isEditing ? 'Cancel editing' : 'Edit application'"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button @click="emit('close')" class="text-white hover:text-gray-200 focus:outline-none">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Body -->
        <div class="bg-white px-6 py-4 max-h-[70vh] overflow-y-auto">
          <!-- Status badge -->
          <div class="flex justify-between items-center mb-6">
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div class="bg-blue-600 h-2 rounded-full" style="width: 33%"></div>
            </div>
            <div class="ml-4 flex-shrink-0">
              <span
                :class="{
                  'bg-yellow-100 text-yellow-800': renewalData.decision === 'hold',
                  'bg-red-100 text-red-800': renewalData.decision === 'regret',
                  'bg-green-100 text-green-800': renewalData.decision === 'accept'
                }"
                class="px-3 py-1 rounded-full text-xs font-medium"
              >
                {{ renewalData.decision === 'accept' ? 'Approved' : renewalData.decision === 'regret' ? 'Regretted' : 'On Hold' }}
              </span>
            </div>
          </div>

          <!-- Applicant Information Card -->
          <div class="bg-white rounded-lg border border-gray-200 shadow-md mb-6 overflow-hidden">
            <div class="bg-blue-50 px-4 py-2 border-b border-gray-200">
              <h4 class="text-md font-semibold text-blue-800">Applicant Information</h4>
            </div>
            <div class="p-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="bg-gray-50 p-3 rounded-md">
                  <label class="block text-gray-500 text-sm font-medium mb-1">ECPF Name</label>
                  <p class="text-gray-800 font-medium">{{ application.ecpfName }}</p>
                </div>
                <div class="bg-gray-50 p-3 rounded-md">
                  <label class="block text-gray-500 text-sm font-medium mb-1">Location</label>
                  <p class="text-gray-800 font-medium">{{ application.location || 'Not specified' }}</p>
                </div>
                <div class="bg-gray-50 p-3 rounded-md">
                  <label class="block text-gray-500 text-sm font-medium mb-1">Proprietor Name</label>
                  <p class="text-gray-800 font-medium">{{ application.applicantName }}</p>
                </div>
                <div class="bg-gray-50 p-3 rounded-md">
                  <label class="block text-gray-500 text-sm font-medium mb-1">CID</label>
                  <p class="text-gray-800 font-medium">{{ application.cid || 'Not specified' }}</p>
                </div>
                <div class="bg-gray-50 p-3 rounded-md">
                  <label class="block text-gray-500 text-sm font-medium mb-1">Contact No.</label>
                  <p class="text-gray-800 font-medium">{{ application.contactNo || 'Not specified' }}</p>
                </div>
                <div class="bg-gray-50 p-3 rounded-md">
                  <label class="block text-gray-500 text-sm font-medium mb-1">Email Address</label>
                  <p class="text-gray-800 font-medium">{{ application.email || 'Not specified' }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Renewal Application Details Card -->
          <div class="bg-white rounded-lg border border-gray-200 shadow-md mb-6 overflow-hidden">
            <div class="bg-blue-50 px-4 py-2 border-b border-gray-200">
              <h4 class="text-md font-semibold text-blue-800">Renewal Application Details</h4>
            </div>
            <div class="p-4">
              <div class="mb-4">
                <label for="subject" class="block text-gray-700 text-sm font-medium mb-2">Subject:</label>
                <select
                  id="subject"
                  v-model="renewalData.subject"
                  :disabled="!isEditing"
                  class="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  :class="{'bg-gray-100': !isEditing}"
                >
                  <option value="independent">Independent ECPF renewal</option>
                  <option value="collaboration">ECPF in Collaboration renewal</option>
                  <option value="branch">Branch Renewal</option>
                </select>
              </div>
              <div>
                <label for="remarks" class="block text-gray-700 text-sm font-medium mb-2">Remarks:</label>
                <textarea
                  id="remarks"
                  v-model="renewalData.remarks"
                  :disabled="!isEditing"
                  rows="3"
                  class="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  :class="{'bg-gray-100': !isEditing}"
                  placeholder="Enter any additional remarks..."
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Verification & Decision Card -->
          <div class="bg-white rounded-lg border border-gray-200 shadow-md mb-6 overflow-hidden">
            <div class="bg-blue-50 px-4 py-2 border-b border-gray-200">
              <h4 class="text-md font-semibold text-blue-800">Verification & Decision</h4>
            </div>
            <div class="p-4">
              <div class="mb-4">
                <label for="verificationDecision" class="block text-gray-700 text-sm font-medium mb-2">Verification Decision:</label>
                <select
                  id="verificationDecision"
                  v-model="renewalData.decision"
                  :disabled="!isEditing"
                  class="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  :class="{'bg-gray-100': !isEditing}"
                >
                  <option value="accept">Accept & Forward</option>
                  <option value="regret">Regret</option>
                  <option value="hold">Hold for Re-verification</option>
                </select>
              </div>
              <div v-if="renewalData.decision === 'regret'">
                <label for="regretReason" class="block text-gray-700 text-sm font-medium mb-2">Reason if Regret:</label>
                <textarea
                  id="regretReason"
                  v-model="renewalData.regretReason"
                  :disabled="!isEditing"
                  rows="2"
                  class="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  :class="{'bg-gray-100': !isEditing}"
                  placeholder="Please provide a reason for regret..."
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="bg-gray-50 px-6 py-4 flex flex-wrap justify-between items-center gap-2 border-t border-gray-200">
          <div class="flex flex-wrap gap-2">
            <button
              v-if="isEditing"
              type="button"
              class="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm"
              @click="saveChanges"
            >
              <span class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                Save Changes
              </span>
            </button>
          </div>
          <div class="flex flex-wrap gap-2">
            <button
              type="button"
              class="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm"
              @click="emit('close')"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';

const props = defineProps({
  isOpen: Boolean,
  application: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits([
  'close',
  'updateVerification',
  'updateEvaluation',
  'saveChanges',
  'edit',
]);

// Reactive data for the form initialized with props values
const renewalData = reactive({
  subject: props.application?.subject || '',
  remarks: props.application?.remarks || '',
  decision: props.application?.decision || '',
  regretReason: props.application?.regretReason || '',
});

const isEditing = ref(false);

const toggleEditMode = () => {
  isEditing.value = !isEditing.value;
  if (!isEditing.value) {
    // Optionally reset form data to original application data if needed on cancel edit
    // resetFormData();
  }
};

const saveChanges = () => {
  emit('saveChanges', renewalData); // Emit saveChanges event with form data
  isEditing.value = false; // Exit edit mode after saving changes
};

// Example function to reset form data - implement if needed
// const resetFormData = () => {
//   renewalData.subject = props.application.subject || '';
//   renewalData.remarks = props.application.remarks || '';
//   renewalData.decision = props.application.decision || '';
//   renewalData.regretReason = props.application.regretReason || '';
// };

// Optional: Initialize form data when component mounts
// onMounted(() => {
//   resetFormData();
// });
</script>