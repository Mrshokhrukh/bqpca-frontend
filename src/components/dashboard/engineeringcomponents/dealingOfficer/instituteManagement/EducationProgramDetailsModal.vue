<!-- src/components/modals/EducationProgramDetailsModal.vue -->
<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed z-30 inset-0 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <!-- Background overlay -->
        <div
          class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
          @click="close"
        ></div>

        <!-- Modal panel -->
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true"> </span>
        <div
          class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full"
        >
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start w-full">
              <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <div class="flex justify-between items-center mb-4 pb-3 border-b border-gray-200">
                  <h3 class="text-2xl leading-6 font-semibold text-gray-900" id="modal-title">
                    Program Details {{ isEditing ? '(Editing)' : '' }}
                  </h3>
                   <!-- Edit/Close Buttons (Header) -->
                   <!-- REMOVED Save/Cancel from here -->
                   <div class="flex items-center space-x-2">
                     <button
                       v-if="!isEditing"
                       @click="startEditing"
                       type="button"
                       class="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                       title="Edit Program"
                     >
                       <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"> <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /> </svg>
                       Edit
                     </button>
                     <button @click="close" type="button" class="text-gray-400 hover:text-gray-600 focus:outline-none"> <span class="sr-only">Close</span> <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true"> <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /> </svg> </button>
                   </div>
                </div>

                 <!-- Modal Content -->
                 <div class="mt-5 space-y-5 max-h-[65vh] overflow-y-auto pr-2"> <!-- Added max-height and scroll -->
                   <!-- Error Message Area -->
                   <div v-if="modalError" class="p-3 bg-red-50 text-red-700 border border-red-200 rounded-md text-sm">
                      {{ modalError }}
                   </div>

                   <!-- View Mode -->
                   <div v-if="!isEditing" class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-sm">
                     <!-- View mode fields... (Keep as is) -->
                      <div> <p class="font-medium text-gray-500">Program ID:</p> <p class="text-gray-900">{{ localProgram.id || 'N/A' }}</p> </div>
                      <div> <p class="font-medium text-gray-500">Training Institute Name:</p> <p class="text-gray-900">{{ localProgram.training_institute_name || 'N/A' }}</p> </div>
                      <div> <p class="font-medium text-gray-500">Country:</p> <p class="text-gray-900">{{ localProgram.country?.name || localProgram.country || 'N/A' }}</p> </div>
                      <div> <p class="font-medium text-gray-500">Dzongkhag/Throme:</p> <p class="text-gray-900">{{ localProgram.dzongkhag || 'N/A' }}</p> </div>
                      <div> <p class="font-medium text-gray-500">City/Gewog:</p> <p class="text-gray-900">{{ localProgram.gewog || 'N/A' }}</p> </div>
                      <div> <p class="font-medium text-gray-500">Address/Location:</p> <p class="text-gray-900">{{ localProgram.address_location || 'N/A' }}</p> </div>
                      <div> <p class="font-medium text-gray-500">Contact No.:</p> <p class="text-gray-900">{{ localProgram.contact_no || 'N/A' }}</p> </div>
                      <div> <p class="font-medium text-gray-500">Email Address:</p> <p class="text-gray-900">{{ localProgram.email_address || 'N/A' }}</p> </div>
                      <div class="md:col-span-2 mt-2 border-t pt-2"> <p class="font-medium text-gray-700">Head of Institution Details</p> </div>
                      <div> <p class="font-medium text-gray-500">Name:</p> <p class="text-gray-900">{{ localProgram.head_institution_name || 'N/A' }}</p> </div>
                      <div> <p class="font-medium text-gray-500">Mobile Number:</p> <p class="text-gray-900">{{ localProgram.head_institution_mobile || 'N/A' }}</p> </div>
                      <div> <p class="font-medium text-gray-500">Email Address:</p> <p class="text-gray-900">{{ localProgram.head_institution_email || 'N/A' }}</p> </div>
                      <div> <p class="font-medium text-gray-500">Website:</p> <p class="text-gray-900">{{ localProgram.website || 'N/A' }}</p> </div>
                      <div class="md:col-span-2 mt-2 border-t pt-2"> <p class="font-medium text-gray-700">Proposal Details</p> </div>
                      <div class="md:col-span-2"> <p class="font-medium text-gray-500">Proposal Title:</p> <p class="text-gray-900">{{ localProgram.proposal_title || 'N/A' }}</p> </div>
                      <div> <p class="font-medium text-gray-500">Duration:</p> <p class="text-gray-900">{{ localProgram.duration_months ? `${localProgram.duration_months} Months` : 'N/A' }}</p> </div>
                      <div> <p class="font-medium text-gray-500">Commencement Date:</p> <p class="text-gray-900">{{ formatDate(localProgram.commencement_date) }}</p> </div>
                      <div class="md:col-span-2"> <p class="font-medium text-gray-500">Proposal Attachment:</p> <a v-if="localProgram.proposal_attachment && typeof localProgram.proposal_attachment === 'string'" :href="localProgram.proposal_attachment" target="_blank" rel="noopener noreferrer" class="text-indigo-600 hover:text-indigo-800 underline break-all"> {{ localProgram.proposal_attachment.split('/').pop() }} </a> <p v-else class="text-gray-900">{{ localProgram.proposal_attachment || 'No attachment provided.' }}</p> </div>
                      <div class="md:col-span-2 mt-2 border-t pt-2"> <p class="font-medium text-gray-700">Review Details</p> </div>
                      <div> <p class="font-medium text-gray-500">Renewal Review Name:</p> <p class="text-gray-900">{{ localProgram.renewal_review_name || 'N/A' }}</p> </div>
                      <div class="md:col-span-2"> <p class="font-medium text-gray-500">Review Summary:</p> <p class="text-gray-900 whitespace-pre-wrap">{{ localProgram.review_summary || 'No review summary provided.' }}</p> </div>
                      <div> <p class="font-medium text-gray-500">Review Report:</p> <a v-if="localProgram.review_report_upload && typeof localProgram.review_report_upload === 'string'" :href="localProgram.review_report_upload" target="_blank" rel="noopener noreferrer" class="text-indigo-600 hover:text-indigo-800 underline break-all"> {{ localProgram.review_report_upload.split('/').pop() }} </a> <p v-else class="text-gray-900">{{ localProgram.review_report_upload ? 'File uploaded' : 'No report uploaded.' }}</p> </div>
                      <div> <p class="font-medium text-gray-500">Status:</p> <p class="text-gray-900"> <span class="px-3 py-1 rounded-full text-xs font-medium leading-tight" :class="{ 'bg-yellow-100 text-yellow-800': localProgram.review_decision === 'Pending', 'bg-green-100 text-green-800': localProgram.review_decision === 'Approved', 'bg-red-100 text-red-800': localProgram.review_decision === 'Regretted', 'bg-gray-100 text-gray-600': !['Pending', 'Approved', 'Regretted'].includes(localProgram.review_decision) }"> {{ localProgram.review_decision_display || localProgram.review_decision || 'Unknown' }} </span> </p> </div>
                      <div v-if="localProgram.review_decision === 'Regretted' && localProgram.reason_if_rejected" class="md:col-span-2"> <p class="font-medium text-gray-500">Reason for Regret:</p> <p class="text-red-700 whitespace-pre-wrap">{{ localProgram.reason_if_rejected }}</p> </div>
                      <div class="md:col-span-2"> <p class="font-medium text-gray-500">Remarks:</p> <p class="text-gray-900 whitespace-pre-wrap">{{ localProgram.remarks || 'No remarks provided.' }}</p> </div>
                   </div>

                   <!-- Edit Mode -->
                    <form v-else @submit.prevent="saveChanges" class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-sm">
                       <!-- Edit mode fields... (Keep as is) -->
                        <div> <label class="block font-medium text-gray-500">Program ID:</label> <p class="mt-1 text-gray-900">{{ localProgram.id || 'N/A' }}</p> </div>
                        <div> <label class="block font-medium text-gray-500">Training Institute Name:</label> <p class="mt-1 text-gray-900">{{ localProgram.training_institute_name || 'N/A' }}</p> </div>
                        <div> <label class="block font-medium text-gray-500">Country:</label> <p class="mt-1 text-gray-900">{{ localProgram.country?.name || localProgram.country || 'N/A' }}</p> </div>
                        <div> <label class="block font-medium text-gray-500">Dzongkhag/Throme:</label> <p class="mt-1 text-gray-900">{{ localProgram.dzongkhag || 'N/A' }}</p> </div>
                        <div> <label class="block font-medium text-gray-500">City/Gewog:</label> <p class="mt-1 text-gray-900">{{ localProgram.gewog || 'N/A' }}</p> </div>
                        <div> <label for="address_location" class="block font-medium text-gray-700">Address/Location</label> <input type="text" id="address_location" v-model.trim="localProgram.address_location" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"> </div>
                        <div> <label for="contact_no" class="block font-medium text-gray-700">Contact No.</label> <input type="text" id="contact_no" v-model.trim="localProgram.contact_no" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"> </div>
                        <div> <label for="email_address" class="block font-medium text-gray-700">Email Address</label> <input type="email" id="email_address" v-model.trim="localProgram.email_address" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"> </div>
                        <div class="md:col-span-2 mt-2 border-t pt-2"> <p class="font-medium text-gray-700">Head of Institution Details</p> </div>
                        <div> <label for="head_institution_name" class="block font-medium text-gray-700">Name</label> <input type="text" id="head_institution_name" v-model.trim="localProgram.head_institution_name" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"> </div>
                        <div> <label for="head_institution_mobile" class="block font-medium text-gray-700">Mobile Number</label> <input type="text" id="head_institution_mobile" v-model.trim="localProgram.head_institution_mobile" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"> </div>
                        <div> <label for="head_institution_email" class="block font-medium text-gray-700">Email Address</label> <input type="email" id="head_institution_email" v-model.trim="localProgram.head_institution_email" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"> </div>
                        <div> <label for="website" class="block font-medium text-gray-700">Website</label> <input type="url" id="website" v-model.trim="localProgram.website" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="https://example.com"> </div>
                        <div class="md:col-span-2 mt-2 border-t pt-2"> <p class="font-medium text-gray-700">Proposal Details</p> </div>
                        <div class="md:col-span-2"> <label for="proposal_title" class="block font-medium text-gray-700">Proposal Title <span class="text-red-500">*</span></label> <input type="text" id="proposal_title" v-model.trim="localProgram.proposal_title" required class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"> </div>
                        <div> <label for="duration_months" class="block font-medium text-gray-700">Duration (Months) <span class="text-red-500">*</span></label> <input type="number" id="duration_months" v-model.number="localProgram.duration_months" required min="1" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"> </div>
                        <div> <label for="commencement_date" class="block font-medium text-gray-700">Commencement Date <span class="text-red-500">*</span></label> <input type="date" id="commencement_date" v-model="localProgram.commencement_date" required :max="getFutureDateLimit()" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"> </div>
                        <div class="md:col-span-2"> <label for="proposal_attachment" class="block font-medium text-gray-700">Proposal Attachment</label> <div class="mt-1 flex items-center"> <span v-if="localProgram.proposal_attachment && typeof localProgram.proposal_attachment === 'string'" class="mr-2 text-sm text-gray-700 truncate max-w-xs"> Current: {{ localProgram.proposal_attachment.split('/').pop() }} </span> <span v-else-if="localProgram.proposalAttachmentFile" class="mr-2 text-sm text-indigo-700 truncate max-w-xs"> New: {{ localProgram.proposalAttachmentFile.name }} </span> <span v-else class="mr-2 text-sm text-gray-500">No file selected</span> <button type="button" class="ml-auto inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" @click="triggerFileUpload('proposalAttachmentInput')"> Change File </button> <input type="file" ref="proposalAttachmentInput" class="hidden" @change="handleFileUpload($event, 'proposalAttachmentFile')" accept=".pdf,.doc,.docx,.txt" /> </div> </div>
                        <div class="md:col-span-2 mt-2 border-t pt-2"> <p class="font-medium text-gray-700">Review Details</p> </div>
                        <div> <label for="renewal_review_name" class="block font-medium text-gray-700">Renewal Review Name</label> <input type="text" id="renewal_review_name" v-model.trim="localProgram.renewal_review_name" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"> </div>
                        <div class="md:col-span-2"> <label for="review_summary" class="block font-medium text-gray-700">Review Summary</label> <textarea id="review_summary" v-model="localProgram.review_summary" rows="3" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea> </div>
                        <div class="md:col-span-2"> <label for="review_report_upload" class="block font-medium text-gray-700">Review Report Upload</label> <div class="mt-1 flex items-center"> <span v-if="localProgram.review_report_upload && typeof localProgram.review_report_upload === 'string'" class="mr-2 text-sm text-gray-700 truncate max-w-xs"> Current: {{ localProgram.review_report_upload.split('/').pop() }} </span> <span v-else-if="localProgram.reviewReportFile" class="mr-2 text-sm text-indigo-700 truncate max-w-xs"> New: {{ localProgram.reviewReportFile.name }} </span> <span v-else class="mr-2 text-sm text-gray-500">No file selected</span> <button type="button" class="ml-auto inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" @click="triggerFileUpload('reviewReportInput')"> Change File </button> <input type="file" ref="reviewReportInput" class="hidden" @change="handleFileUpload($event, 'reviewReportFile')" accept=".pdf,.doc,.docx" /> </div> </div>
                        <div> <label for="review_decision" class="block font-medium text-gray-700">Review Decision</label> <select id="review_decision" v-model="localProgram.review_decision" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"> <option value="Pending">Pending</option> <option value="Approved">Approved</option> <option value="Regretted">Regretted</option> </select> </div>
                        <div v-if="localProgram.review_decision === 'Regretted'" class="md:col-span-2"> <label for="reason_if_rejected" class="block font-medium text-gray-700">Reason (if rejected)</label> <textarea id="reason_if_rejected" v-model="localProgram.reason_if_rejected" rows="3" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea> </div>
                        <div class="md:col-span-2"> <label for="remarks" class="block font-medium text-gray-700">Remarks</label> <textarea id="remarks" v-model="localProgram.remarks" rows="3" class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea> </div>

                       <div class="md:col-span-2 pt-3 border-t border-gray-200"> <p class="text-xs text-gray-500">Fields marked with <span class="text-red-500">*</span> are required.</p> </div>
                       <button type="submit" class="hidden"></button> <!-- Hidden submit -->
                   </form>
                 </div>

              </div>
            </div>
          </div>

          <!-- ****** UPDATED Modal Footer ****** -->
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse items-center">
             <!-- VIEWING Buttons (Approve/Regret) -->
             <template v-if="!isEditing && localProgram.review_decision === 'Pending'">
               <button
                 type="button"
                 @click="emitApprove"
                 class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
               > Approve </button>
               <button
                 type="button"
                 @click="emitRegret"
                 class="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
               > Regret </button>
             </template>

              <!-- EDITING Buttons (Save/Cancel) -->
             <template v-if="isEditing">
                <button
                 @click="saveChanges"
                 type="button"
                 :disabled="modalLoading || !isFormValid"
                 :class="{ 'opacity-50 cursor-not-allowed': !isFormValid && !modalLoading }"
                 class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 sm:ml-3 sm:w-auto sm:text-sm"
               >
                  <!-- Loading Spinner -->
                  <svg v-if="modalLoading" class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"> <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle> <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path> </svg>
                  {{ modalLoading ? 'Saving...' : 'Save Changes' }}
               </button>
                 <!-- Cancel Button (in Edit mode) -->
                <button
                  type="button"
                  @click="cancelEditing"
                  :disabled="modalLoading"
                  class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                 > Cancel </button>
             </template>

             <!-- Close Button (Visible when Viewing and status is NOT Pending, or when editing but acts as Cancel) -->
            <button
              v-if="!isEditing && localProgram.review_decision !== 'Pending'"
              type="button"
              @click="close"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-auto sm:w-auto sm:text-sm"
             > Close </button> <!-- Takes remaining space on left when Approve/Regret are hidden -->

          </div> <!-- End Footer -->
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, watch, computed,  } from 'vue';
import apiServices from '@/services/services'; // Adjust path

const props = defineProps({
  isOpen: { type: Boolean, required: true },
  programDetails: { type: Object, default: () => ({}) },
});

const emit = defineEmits(['close-modal', 'approve', 'regret', 'program-updated']);

const isEditing = ref(false);
const localProgram = ref({});
const modalLoading = ref(false);
const modalError = ref('');

const proposalAttachmentInput = ref(null);
const reviewReportInput = ref(null);

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString.includes('T') ? dateString : dateString + 'T00:00:00Z');
    if (isNaN(date.getTime())) return 'Invalid Date';
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' });
  } catch { return dateString; }
};
const getIsoDate = (dateString) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString.includes('T') ? dateString : dateString + 'T00:00:00Z');
    if (isNaN(date.getTime())) return '';
    return date.toISOString().split('T')[0];
  } catch { return ''; }
};
const getFutureDateLimit = () => {
    const date = new Date();
    date.setFullYear(date.getFullYear() + 10);
    return date.toISOString().split('T')[0];
};

watch(() => props.programDetails, (newDetails) => {
  if (newDetails && newDetails.id) {
    const detailsCopy = JSON.parse(JSON.stringify(newDetails));
    localProgram.value = {
        id: detailsCopy.id,
        training_institute_name: detailsCopy.training_institute_details?.name_of_institution || 'N/A',
        training_institute_id: detailsCopy.training_institute_details?.id || null,
        country: detailsCopy.country || '',
        dzongkhag: detailsCopy.dzongkhag || '',
        gewog: detailsCopy.gewog || '',
        address_location: detailsCopy.address_location || '',
        contact_no: detailsCopy.contact_no || '',
        email_address: detailsCopy.email_address || '',
        head_institution_name: detailsCopy.head_institution_name || '',
        head_institution_mobile: detailsCopy.head_institution_mobile || '',
        head_institution_email: detailsCopy.head_institution_email || '',
        website: detailsCopy.website || '',
        proposal_title: detailsCopy.proposal_title || '',
        duration_months: typeof detailsCopy.duration_months === 'number' ? detailsCopy.duration_months : null,
        commencement_date: getIsoDate(detailsCopy.commencement_date),
        proposal_attachment: detailsCopy.proposal_attachment || null,
        renewal_review_name: detailsCopy.renewal_review_name || '',
        review_summary: detailsCopy.review_summary || '',
        review_report_upload: detailsCopy.review_report_upload || null,
        review_decision: detailsCopy.review_decision || 'Pending',
        review_decision_display: detailsCopy.review_decision_display || detailsCopy.review_decision || 'Pending',
        reason_if_rejected: detailsCopy.reason_if_rejected || '',
        remarks: detailsCopy.remarks || '',
        created_at: detailsCopy.created_at || null,
        updated_at: detailsCopy.updated_at || null,
        proposalAttachmentFile: null,
        reviewReportFile: null,
    };
    isEditing.value = false;
    modalError.value = '';
    modalLoading.value = false;
  } else {
    localProgram.value = {};
  }
}, { deep: true, immediate: true });

const isFormValid = computed(() => {
    if (!isEditing.value) return true;
    const prog = localProgram.value;
    return !!(prog.proposal_title?.trim() &&
              prog.duration_months && prog.duration_months > 0 &&
              prog.commencement_date);
});

const close = () => {
    if (modalLoading.value) return;
    // Ensure edit mode is reset *before* emitting close
    if (isEditing.value) {
        cancelEditing(); // Revert changes if cancel is pressed
    }
    emit('close-modal');
};
const startEditing = () => {
    isEditing.value = true;
    modalError.value = '';
};

const cancelEditing = () => {
  if (modalLoading.value) return;
  // Restore original data before exiting edit mode
  if (props.programDetails && props.programDetails.id) {
      const detailsCopy = JSON.parse(JSON.stringify(props.programDetails));
      localProgram.value = {
        id: detailsCopy.id,
        training_institute_name: detailsCopy.training_institute_details?.name_of_institution || 'N/A',
        training_institute_id: detailsCopy.training_institute_details?.id || null,
        country: detailsCopy.country || '',
        dzongkhag: detailsCopy.dzongkhag || '',
        gewog: detailsCopy.gewog || '',
        address_location: detailsCopy.address_location || '',
        contact_no: detailsCopy.contact_no || '',
        email_address: detailsCopy.email_address || '',
        head_institution_name: detailsCopy.head_institution_name || '',
        head_institution_mobile: detailsCopy.head_institution_mobile || '',
        head_institution_email: detailsCopy.head_institution_email || '',
        website: detailsCopy.website || '',
        proposal_title: detailsCopy.proposal_title || '',
        duration_months: typeof detailsCopy.duration_months === 'number' ? detailsCopy.duration_months : null,
        commencement_date: getIsoDate(detailsCopy.commencement_date),
        proposal_attachment: detailsCopy.proposal_attachment || null,
        renewal_review_name: detailsCopy.renewal_review_name || '',
        review_summary: detailsCopy.review_summary || '',
        review_report_upload: detailsCopy.review_report_upload || null,
        review_decision: detailsCopy.review_decision || 'Pending',
        review_decision_display: detailsCopy.review_decision_display || detailsCopy.review_decision || 'Pending',
        reason_if_rejected: detailsCopy.reason_if_rejected || '',
        remarks: detailsCopy.remarks || '',
        created_at: detailsCopy.created_at || null,
        updated_at: detailsCopy.updated_at || null,
        proposalAttachmentFile: null,
        reviewReportFile: null,
      };
  }
  isEditing.value = false; // Exit edit mode
  modalError.value = ''; // Clear error
};


const triggerFileUpload = (inputRefName) => {
  const inputElement = {
      proposalAttachmentInput: proposalAttachmentInput.value,
      reviewReportInput: reviewReportInput.value
  }[inputRefName];
  if (inputElement) inputElement.click();
  else console.error("File input ref not found:", inputRefName);
};

const handleFileUpload = (event, fileTypeKey) => {
  const file = event.target.files[0];
  if (file) {
    localProgram.value[fileTypeKey] = file;
    if (fileTypeKey === 'proposalAttachmentFile') localProgram.value.proposal_attachment = null;
    if (fileTypeKey === 'reviewReportFile') localProgram.value.review_report_upload = null;
  }
  event.target.value = null; // Reset input
};

const saveChanges = async () => {
  if (!isFormValid.value) {
     modalError.value = 'Please fill required fields (*) correctly.';
     return;
  }
  modalLoading.value = true;
  modalError.value = '';
  const formData = new FormData();

  // Required fields
  formData.append('proposal_title', localProgram.value.proposal_title.trim());
  formData.append('duration_months', localProgram.value.duration_months);
  formData.append('commencement_date', localProgram.value.commencement_date);

  // Optional fields - Append only if they have a value
  if (localProgram.value.address_location?.trim()) formData.append('address_location', localProgram.value.address_location.trim());
  if (localProgram.value.contact_no?.trim()) formData.append('contact_no', localProgram.value.contact_no.trim());
  if (localProgram.value.email_address?.trim()) formData.append('email_address', localProgram.value.email_address.trim());
  if (localProgram.value.head_institution_name?.trim()) formData.append('head_institution_name', localProgram.value.head_institution_name.trim());
  if (localProgram.value.head_institution_mobile?.trim()) formData.append('head_institution_mobile', localProgram.value.head_institution_mobile.trim());
  if (localProgram.value.head_institution_email?.trim()) formData.append('head_institution_email', localProgram.value.head_institution_email.trim());
  if (localProgram.value.website?.trim()) formData.append('website', localProgram.value.website.trim());
  if (localProgram.value.renewal_review_name?.trim()) formData.append('renewal_review_name', localProgram.value.renewal_review_name.trim());
  if (localProgram.value.review_summary?.trim()) formData.append('review_summary', localProgram.value.review_summary.trim());
  formData.append('review_decision', localProgram.value.review_decision); // Always send decision
  if (localProgram.value.review_decision === 'Regretted' && localProgram.value.reason_if_rejected?.trim()) {
    formData.append('reason_if_rejected', localProgram.value.reason_if_rejected.trim());
  } else {
     // Send empty string if not Regretted or reason is empty to potentially clear it
     formData.append('reason_if_rejected', '');
  }
  if (localProgram.value.remarks?.trim()) formData.append('remarks', localProgram.value.remarks.trim());

  // Append files if new ones are selected
  if (localProgram.value.proposalAttachmentFile instanceof File) {
    formData.append('proposal_attachment', localProgram.value.proposalAttachmentFile);
  }
  if (localProgram.value.reviewReportFile instanceof File) {
    formData.append('review_report_upload', localProgram.value.reviewReportFile);
  }

  try {
    const id = localProgram.value.id;
    if (!id) throw new Error("Program ID is missing.");

    const response = await apiServices.patchEpcNewEducationProgram(id, formData);
    const updatedProgramData = response.data || {};
    emit('program-updated', updatedProgramData);

    // Update local state with server response AFTER successful save
     const serverDataCopy = JSON.parse(JSON.stringify(updatedProgramData));
     localProgram.value = {
       ...localProgram.value,
       ...serverDataCopy,
       training_institute_name: serverDataCopy.training_institute_details?.name_of_institution || localProgram.value.training_institute_name,
       commencement_date: getIsoDate(serverDataCopy.commencement_date),
       review_decision_display: serverDataCopy.review_decision_display || serverDataCopy.review_decision,
       proposalAttachmentFile: null, // Clear staged file on success
       reviewReportFile: null, // Clear staged file on success
     };

    isEditing.value = false; // Exit edit mode

  } catch (error) {
    console.error('Error saving program details:', error);
    let specificError = '';
    if (error.response?.data && typeof error.response.data === 'object') {
      specificError = Object.entries(error.response.data)
        .map(([key, value]) => `${key.replace(/_/g, ' ')}: ${Array.isArray(value) ? value.join(', ') : value}`)
        .join('; ');
    }
    modalError.value = `Save failed: ${specificError || error.response?.data?.detail || error.message || 'Please check the details and try again.'}`;
  } finally {
    modalLoading.value = false;
  }
};

const emitApprove = () => emit('approve');
const emitRegret = () => emit('regret');

</script>

<style scoped>
/* Styles remain the same */
input[type="date"]:required:invalid::-webkit-datetime-edit { color: #9ca3af; }
input[type="date"]:focus::-webkit-datetime-edit,
input[type="date"]:valid::-webkit-datetime-edit { color: black; }
</style>