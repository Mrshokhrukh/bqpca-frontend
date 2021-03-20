<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" @close="closeModal" class="relative z-50">
      <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100"
        leave="duration-200 ease-in" leave-from="opacity-0" leave-to="opacity-0">
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
                    <h2 class="text-2xl font-bold tracking-tight">Mass Media Event Application</h2>
                    <p class="mt-1 text-white/90">Application ID: {{ application.cid }}</p>
                  </div>
                  <div class="space-x-2">
                    <button
                      @click="showEditModal = true"
                      class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <PencilIcon class="h-4 w-4 mr-2" />
                      Edit Application
                    </button>
                    <button
                      v-if="application.chiefDecision === 'approved'"
                      @click="previewApprovalLetter"
                      class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-green-600 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      <DocumentTextIcon class="h-4 w-4 mr-2" />
                      Preview Approval Letter
                    </button>
                  </div>
                </div>
              </div>

              <div v-if="application" class="px-8 py-6 bg-white">
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
                      <p><strong>Institute(s):</strong>
                        <ul v-if="application.institutes && application.institutes.length > 0" class="list-disc list-inside">
                          <li v-for="(institute, index) in application.institutes" :key="index">{{ institute }}</li>
                        </ul>
                        <span v-else>N/A</span>
                      </p>
                    </div>
                  </div>

                  <!-- Proposed Promotion Event - Mass Media -->
                  <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-all">
                    <div class="p-6">
                      <div class="flex items-center mb-4">
                        <div class="bg-green-100 p-2 rounded-md">
                          <DocumentTextIcon class="h-5 w-5 text-green-600" />
                        </div>
                        <h4 class="font-semibold text-gray-900 ml-2">Proposed Promotion Event - Mass Media</h4>
                      </div>
                      <p><strong>Mass Media Promotional Name:</strong> {{ application.massMediaPromotionalName || 'N/A' }}</p>
                      <p><strong>Description:</strong> {{ application.description || 'N/A' }}</p>
                      <p><strong>Purpose:</strong> {{ application.purpose || 'N/A' }}</p>
                      <p><strong>Promotional Channel:</strong> {{ application.promotionalChannel || 'N/A' }}</p>
                      <p><strong>Promotional Contents:</strong> <button class="text-indigo-600 hover:text-indigo-800">View</button></p>
                      <p><strong>Others (specify):</strong> {{ application.othersSpecify || 'N/A' }}</p>
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

                  <!-- Chief Decision Form -->
                  <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-all">
                    <div class="p-6">
                      <div class="flex items-center mb-4">
                        <div class="bg-yellow-100 p-2 rounded-md">
                          <CheckBadgeIcon class="h-5 w-5 text-yellow-600" />
                        </div>
                        <h4 class="font-semibold text-gray-900 ml-2">Chief Decision</h4>
                      </div>
                      <div class="mt-2 space-y-4">
                        <div>
                          <label for="chiefDecision" class="block text-sm font-medium text-gray-700">Decision:</label>
                          <select id="chiefDecision" v-model="verificationForm.verificationDecision"
                            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                            <option value="">Select Decision</option>
                            <option value="approved">Approved</option>
                            <option value="regretted">Regretted</option>
                            <option value="reupload_documents">Request Re-upload</option>
                          </select>
                        </div>
                        <div v-if="verificationForm.verificationDecision === 'regretted'">
                          <label for="regretReason" class="block text-sm font-medium text-gray-700">Reason (if regretted):</label>
                          <textarea id="regretReason" v-model="verificationForm.regretReason" rows="2"
                            class="shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-1 block w-full sm:text-sm border-gray-300 rounded-md"></textarea>
                        </div>
                        <div v-if="verificationForm.verificationDecision === 'approved'">
                          <label for="conditionText" class="block text-sm font-medium text-gray-700">Condition (if approved):</label>
                          <textarea id="conditionText" v-model="verificationForm.conditionText" rows="2"
                            class="shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-1 block w-full sm:text-sm border-gray-300 rounded-md"></textarea>
                        </div>
                        <div v-if="verificationForm.verificationDecision === 'reupload_documents'">
                          <label for="reuploadRequestReason" class="block text-sm font-medium text-gray-700">Reason for Re-upload Request:</label>
                          <textarea id="reuploadRequestReason" v-model="verificationForm.reuploadRequestReason" rows="2"
                            class="shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-1 block w-full sm:text-sm border-gray-300 rounded-md" placeholder="Specify which documents need re-upload and why."></textarea>
                        </div>
                        <div>
                          <label for="remarksText" class="block text-sm font-medium text-gray-700">Remarks:</label>
                          <textarea id="remarksText" v-model="verificationForm.remarksText" rows="2"
                            class="shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-1 block w-full sm:text-sm border-gray-300 rounded-md"></textarea>
                        </div>

                        <div class="mt-6 flex justify-end space-x-2">
                          <button type="button"
                            class="rounded-md px-4 py-2 font-semibold text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-all"
                            @click="submitDecision('approved')">
                            <CheckIcon class="h-4 w-4 inline-block mr-1" />
                            Approve
                          </button>
                          <button type="button"
                            class="rounded-md px-4 py-2 font-semibold text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-all"
                            @click="submitDecision('regretted')">
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
              <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse justify-between">
                <button type="button"
                  class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-all"
                  @click="closeModal">
                  <XMarkIcon class="h-4 w-4 inline-block mr-1" />
                  Close
                </button>
                <button type="button"
                  class="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                  @click="submitDecision">
                  Submit Decision
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>

  <!-- Edit Modal -->
  <Dialog :open="showEditModal" @close="showEditModal = false" class="relative z-50">
     <DialogPanel class="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all overflow-y-scroll max-h-[90vh]">
      <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900 mb-4">
        Edit Mass Media Event Application
      </DialogTitle>
      <div class="mt-2 space-y-6">
        <!-- Edit Promotional Event Type -->
        <div>
          <label for="editPromotionalEventType" class="block text-sm font-medium text-gray-700 mb-1">Promotional Event Type:</label>
          <input type="text" id="editPromotionalEventType" v-model="editForm.promotionalEventType" class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
        </div>

        <!-- Edit Current Details of ECPF -->
        <div>
          <h4 class="font-semibold text-gray-900 mb-2">ECPF Details</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="editEcpfName" class="block text-sm font-medium text-gray-700 mb-1">ECPF Name:</label>
              <input type="text" id="editEcpfName" v-model="editForm.ecpfName" class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
            </div>
            <div>
              <label for="editLocation" class="block text-sm font-medium text-gray-700 mb-1">Location:</label>
              <input type="text" id="editLocation" v-model="editForm.ecpfLocation" class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
            </div>
            <div>
              <label for="editProprietorName" class="block text-sm font-medium text-gray-700 mb-1">Name of Proprietor:</label>
              <input type="text" id="editProprietorName" v-model="editForm.proprietorName" class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
            </div>
            <div>
              <label for="editCid" class="block text-sm font-medium text-gray-700 mb-1">CID:</label>
              <input type="text" id="editCid" v-model="editForm.cid" class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
            </div>
            <div>
              <label for="editContactNo" class="block text-sm font-medium text-gray-700 mb-1">Contact No.:</label>
              <input type="text" id="editContactNo" v-model="editForm.contactNo" class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
            </div>
            <div>
              <label for="editEmailAddress" class="block text-sm font-medium text-gray-700 mb-1">Email Address:</label>
              <input type="email" id="editEmailAddress" v-model="editForm.emailAddress" class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
            </div>
          </div>
          <div>
              <label for="editInstitutes" class="block text-sm font-medium text-gray-700 mb-1">Institutes (comma-separated):</label>
              <textarea id="editInstitutes" v-model="editForm.institutesInput" rows="2" class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"></textarea>
              <p class="text-sm text-gray-500 mt-1">Enter institute names separated by commas.</p>
          </div>
        </div>

        <!-- Edit Proposed Promotion Event - Mass Media -->
        <div>
          <h4 class="font-semibold text-gray-900 mb-2">Proposed Promotion Event - Mass Media</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="editMassMediaPromotionalName" class="block text-sm font-medium text-gray-700 mb-1">Mass Media Promotional Name:</label>
              <input type="text" id="editMassMediaPromotionalName" v-model="editForm.massMediaPromotionalName" class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
            </div>
            <div>
              <label for="editDescription" class="block text-sm font-medium text-gray-700 mb-1">Description:</label>
              <textarea id="editDescription" v-model="editForm.description" rows="2" class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"></textarea>
            </div>
            <div>
              <label for="editPurpose" class="block text-sm font-medium text-gray-700 mb-1">Purpose:</label>
              <input type="text" id="editPurpose" v-model="editForm.purpose" class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
            </div>
            <div>
              <label for="editPromotionalChannel" class="block text-sm font-medium text-gray-700 mb-1">Promotional Channel:</label>
              <input type="text" id="editPromotionalChannel" v-model="editForm.promotionalChannel" class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
            </div>
            <div>
              <label for="editOthersSpecify" class="block text-sm font-medium text-gray-700 mb-1">Others (specify):</label>
              <input type="text" id="editOthersSpecify" v-model="editForm.othersSpecify" class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
            </div>
          </div>
           <div>
              <label for="editPromotionalContents" class="block text-sm font-medium text-gray-700 mb-1">Promotional Contents:</label>
              <input type="file" id="editPromotionalContents" @change="handlePromoContentUpload" class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
              <span v-if="editForm.promotionalContentsName" class="text-gray-500 text-sm mt-1 block">Current File: {{ editForm.promotionalContentsName }}</span>
          </div>
        </div>

        <!-- Edit Remarks -->
        <div>
          <label for="editRemarks" class="block text-sm font-medium text-gray-700 mb-1">Remarks:</label>
          <textarea id="editRemarks" v-model="editForm.remarks" rows="2" class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"></textarea>
        </div>

        <div class="mt-6 flex justify-between">
          <button
            type="button"
            @click="deleteApplication"
            class="rounded-md px-4 py-2 font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-all"
          >
            Delete Application
          </button>
          <div class="space-x-2">
            <button type="button" @click="showEditModal = false"
              class="rounded-md px-4 py-2 font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-all">Cancel</button>
            <button type="button" @click="saveFullEdit"
              class="rounded-md px-4 py-2 font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 transition-all">Save Changes</button>
          </div>
        </div>
      </div>
    </DialogPanel>
  </Dialog>
</template>

<script setup>
import { Dialog, DialogPanel, TransitionRoot, TransitionChild, DialogTitle } from '@headlessui/vue'
import { ref, watch, reactive } from 'vue';
import {
  DocumentTextIcon,
  DocumentDuplicateIcon,
  CheckBadgeIcon,
  ChatBubbleLeftRightIcon,
  CheckIcon,
  XMarkIcon,
  PencilIcon
} from '@heroicons/vue/24/outline'


const props = defineProps({
  isOpen: Boolean,
  application: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(['close', 'update-decision', 'edit-application', 'delete-application', 'preview-approval-letter']);


const closeModal = () => {
  emit('close');
};

const verificationForm = ref({
  verificationDecision: '',
  regretReason: '',
  conditionText: '',
  remarksText: '',
  reuploadRequestReason: '',
});
const showEditModal = ref(false);

const editForm = reactive({
  promotionalEventType: '',
  ecpfName: '',
  ecpfLocation: '',
  proprietorName: '',
  cid: '',
  contactNo: '',
  emailAddress: '',
  institutesInput: '', // Input for institutes as comma-separated string
  institutes: [], // Array to hold individual institute names
  massMediaPromotionalName: '',
  description: '',
  purpose: '',
  promotionalChannel: '',
  othersSpecify: '',
  remarks: '',
  promotionalContents: null,
  promotionalContentsName: ''
});

const submitDecision = (decision) => {
  verificationForm.value.verificationDecision = decision;
  emit('update-decision', {
    applicationId: props.application.id,
    decisionData: verificationForm.value
  });
  closeModal();
};

const previewApprovalLetter = () => {
  emit('preview-approval-letter', {
    applicationId: props.application.id
  });
};

const saveFullEdit = () => {
  // Split the comma-separated string into an array before emitting
  editForm.institutes = editForm.institutesInput.split(',').map(item => item.trim()).filter(item => item);
  emit('edit-application', {
    applicationId: props.application.id,
    data: editForm
  });
  showEditModal.value = false;
};
const deleteApplication = () => {
  if (confirm('Are you sure you want to delete this application? This action cannot be undone.')) {
    emit('delete-application', {
      applicationId: props.application.id
    });
    showEditModal.value = false;
    closeModal();
  }
};
const handlePromoContentUpload = (event) => {
  const file = event.target.files[0];
  editForm.promotionalContents = file;
  editForm.promotionalContentsName = file ? file.name : '';
};


watch(() => props.application, (newApplication) => {
  if (newApplication) {
    verificationForm.value.verificationDecision = newApplication.chiefDecision || '';
    verificationForm.value.regretReason = newApplication.regretReasonChief || '';
    verificationForm.value.conditionText = newApplication.conditionChief || '';
    verificationForm.value.remarksText = newApplication.chiefRemarks || '';
    verificationForm.value.reuploadRequestReason = newApplication.reuploadRequestReasonChief || '';

    // Initialize Edit Form
    editForm.promotionalEventType = newApplication.promotionalEventType || '';
    editForm.ecpfName = newApplication.ecpfName || '';
    editForm.ecpfLocation = newApplication.ecpfLocation || '';
    editForm.proprietorName = newApplication.proprietorName || '';
    editForm.cid = newApplication.cid || '';
    editForm.contactNo = newApplication.contactNo || '';
    editForm.emailAddress = newApplication.emailAddress || '';
    editForm.institutes = newApplication.institutes ? [...newApplication.institutes] : [];
    editForm.institutesInput = newApplication.institutes ? newApplication.institutes.join(', ') : ''; // Initialize input from array
    editForm.massMediaPromotionalName = newApplication.massMediaPromotionalName || '';
    editForm.description = newApplication.description || '';
    editForm.purpose = newApplication.purpose || '';
    editForm.promotionalChannel = newApplication.promotionalChannel || '';
    editForm.othersSpecify = newApplication.othersSpecify || '';
    editForm.remarks = newApplication.remarks || '';
    editForm.promotionalContentsName = newApplication.promotionalContentsName || '';
    editForm.promotionalContents = null; // Reset file on load, handle file update in edit modal

  }
}, { immediate: true });
</script>