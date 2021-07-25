<template>
  <div
    v-if="isOpen"
    class="fixed z-20 inset-0 overflow-y-auto"
    aria-labelledby="modal-title"
    role="dialog"
    aria-modal="true"
  >
    <div
      class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
    >
      <div
        class="fixed inset-0 bg-gray-700 bg-opacity-75 transition-opacity"
        aria-hidden="true"
        @click="closeModal"
      ></div>

      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">​</span>

      <div
        class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl w-full"
      >
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6">
          <div class="sm:flex sm:items-start w-full">
            <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
              <div class="flex justify-between items-center mb-4 pb-3 border-b">
                <h3 class="text-xl leading-6 font-semibold text-gray-900" id="modal-title">
                  Teaching Center Application Review
                </h3>
                <span
                  class="px-3 py-1 rounded-full text-xs font-medium"
                  :class="statusBadgeClass"
                >
                  {{ formattedStatus(hospitalDetails.tc_review_decision) }}
                </span>
              </div>

              <div class="max-h-[70vh] overflow-y-auto pr-2 space-y-6 custom-scrollbar">
                <!-- Details Sections (Unchanged) -->
                <section class="p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
                   <h4 class="text-lg font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-200">
                    Proponent Details & Proposed Center
                  </h4>
                  <dl class="text-sm space-y-1">
                     <div class="grid grid-cols-1 md:grid-cols-3 gap-x-4 py-1.5 px-2 rounded bg-gray-50">
                      <dt class="font-medium text-gray-600">Institute Name:</dt>
                      <dd class="md:col-span-2 text-gray-800">{{ hospitalDetails.institute_details.name_of_institution || 'N/A' }}</dd>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-x-4 py-1.5 px-2 rounded">
                      <dt class="font-medium text-gray-600">Center Name:</dt>
                      <dd class="md:col-span-2 text-gray-800 font-semibold">{{ hospitalDetails.center_name || 'N/A' }}</dd>
                    </div>
                  </dl>
                </section>

                <!-- Display existing verification status -->
                <section class="p-4 border border-gray-200 rounded-lg bg-white shadow-sm">
                    <h4 class="text-lg font-semibold text-gray-700 mb-4 pb-2 border-b border-gray-200">
                        Current Verification Status
                    </h4>
                    <div v-if="hospitalDetails.physical_verification_status && hospitalDetails.physical_verification_status !== 'PENDING_PV'" class="p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
                        <p class="text-blue-700 text-sm">Status: <strong>{{ hospitalDetails.physical_verification_status_display }}</strong></p>
                        <p v-if="hospitalDetails.physical_verification_remarks" class="text-blue-700 text-sm mt-1">Remarks: {{ hospitalDetails.physical_verification_remarks }}</p>
                        <div v-if="hospitalDetails.officer_uploaded_files && hospitalDetails.officer_uploaded_files.length > 0" class="mt-2">
                            <h6 class="font-semibold text-blue-800 text-sm">Officer Uploaded Files:</h6>
                            <ul class="list-disc list-inside text-blue-700 text-sm">
                                <li v-for="file in hospitalDetails.officer_uploaded_files" :key="file.id">
                                    <a :href="file.file_url" target="_blank" class="text-blue-600 hover:underline">{{ file.description || getFileNameFromUrl(file.file_url) }}</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <p v-else class="text-sm text-gray-500">Verification is currently pending.</p>
                </section>

                <!-- Dealing Officer Actions Section -->
                <section class="mt-6 pt-6 border-t-2 border-green-200">
                  <div class="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg mb-6">
                    <h4 class="text-xl font-bold text-green-800 mb-2 flex items-center">
                      <svg class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      Dealing Officer Actions
                    </h4>
                  </div>

                  <!-- Form is shown only if a final decision hasn't been made -->
                  <div v-if="canDecide">
                    <!-- Verification Management Form -->
                    <div class="mb-8 p-6 border-2 border-dashed border-blue-300 rounded-xl bg-blue-50">
                      <h5 class="text-xl font-bold text-blue-800 mb-4">Physical Verification Management</h5>
                      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        <div>
                          <label for="verificationStatus" class="block text-sm font-semibold text-blue-700 mb-2">Verification Status <span class="text-red-500">*</span></label>
                          <select v-model="localVerificationData.status" id="verificationStatus" class="form-input">
                            <option value="PENDING_PV">Pending (Schedule Site Visit)</option>
                            <option value="IN_PROGRESS_PV">In Progress</option>
                            <option value="VERIFIED_PV">Verified & Recommended</option>
                            <option value="NOT_VERIFIED_PV">Failed / Not Recommended</option>
                          </select>
                        </div>

                        <!-- Schedule Date (Conditional) -->
                        <div v-if="localVerificationData.status === 'PENDING_PV'">
                          <label for="siteVisitScheduleDate" class="block text-sm font-semibold text-blue-700 mb-2">Site Visit Schedule Date</label>
                          <input type="date" id="siteVisitScheduleDate" v-model="localVerificationData.siteVisitScheduleDate" :min="todayDate()" class="form-input" />
                        </div>

                        <!-- Actual Date (Conditional) -->
                        <div v-if="['IN_PROGRESS_PV', 'VERIFIED_PV', 'NOT_VERIFIED_PV'].includes(localVerificationData.status)">
                          <label for="actualVerificationDate" class="block text-sm font-semibold text-blue-700 mb-2">Actual Verification Date</label>
                          <input type="date" id="actualVerificationDate" v-model="localVerificationData.actualVerificationDate" :max="todayDate()" class="form-input" />
                        </div>

                        <div class="lg:col-span-2">
                          <label for="verificationReport" class="block text-sm font-semibold text-blue-700 mb-2">Verification Remarks / Notes</label>
                          <textarea v-model="localVerificationData.report" id="verificationReport" rows="4" class="form-input" placeholder="Add scheduling plan, findings, reasons, etc."></textarea>
                        </div>

                        <!-- File Uploads (Conditional) -->
                        <div class="lg:col-span-2 space-y-4 pt-4 border-t border-blue-200">
                          <div v-if="localVerificationData.status === 'PENDING_PV'">
                            <label for="nms-letter" class="block text-sm font-medium text-gray-700">Upload NMS Letter / Other Reference</label>
                            <input @change="handleAttachmentsChange" type="file" id="nms-letter" multiple class="file-input"/>
                            <p class="text-xs text-gray-500 mt-1">For internal reference only. You can select multiple files.</p>
                          </div>
                          <div v-if="['VERIFIED_PV', 'NOT_VERIFIED_PV'].includes(localVerificationData.status)">
                            <div>
                                <label for="final-report" class="block text-sm font-medium text-gray-700">Upload Final Verification Report</label>
                                <input @change="handleReportFileChange" type="file" id="final-report" class="file-input"/>
                            </div>
                            <div>
                                <label for="other-docs" class="block text-sm font-medium text-gray-700 mt-2">Upload Other Supporting Documents (Multiple)</label>
                                <input @change="handleAttachmentsChange" type="file" id="other-docs" multiple class="file-input"/>
                            </div>
                          </div>
                        </div>

                        <!-- Send to User Checkbox -->
                        <div class="lg:col-span-2 bg-white p-4 rounded-lg border border-blue-200">
                          <div class="flex items-start">
                            <div class="flex items-center h-5"><input v-model="localVerificationData.sendToUser" id="sendToUserModal" type="checkbox" class="focus:ring-blue-500 h-5 w-5 text-blue-600 border-2 border-blue-300 rounded"/></div>
                            <div class="ml-3"><label for="sendToUserModal" class="font-semibold text-blue-700 text-sm">Send notification to user</label><p class="text-blue-600 text-xs mt-1">Check to notify applicant about this verification update.</p></div>
                          </div>
                        </div>

                      </div>
                      <button @click="submitVerificationHandler" :disabled="!isVerificationFormValid" class="btn btn-info py-3 px-6 text-sm font-semibold">Save Verification Status</button>
                    </div>

                    <!-- Final Decision Section -->
                    <div class="mt-8 p-6 border border-gray-300 rounded-xl bg-gray-50 shadow-lg">
                      <h5 class="text-xl font-semibold text-gray-800 text-center mb-6">Make Final Decision</h5>
                      <div v-if="actionAttempt === 'reject'" class="mb-6">
                        <label for="modalRejectionReason" class="block text-sm font-medium text-gray-700 mb-1">Reason for Rejection <span class="text-red-500">*</span></label>
                        <textarea v-model="rejectionReason" rows="3" class="form-input" placeholder="This will be shown to the applicant."></textarea>
                      </div>
                      <div class="flex flex-col sm:flex-row justify-center items-center gap-6">
                        <button @click="handleApprove" :disabled="!isVerificationSufficientForApproval" class="btn btn-success">Approve Application</button>
                        <button @click="prepareReject" class="btn btn-danger">{{ actionAttempt === 'reject' && rejectionReason.trim() ? 'Confirm Rejection' : 'Reject Application' }}</button>
                      </div>
                      <p v-if="!isVerificationSufficientForApproval" class="mt-4 text-center text-sm text-orange-600">Approval is disabled. The verification status must be 'Verified & Recommended'.</p>
                    </div>
                  </div>

                  <!-- Final Status Displays -->
                  <div v-if="isEffectivelyApproved" class="mt-8 p-6 bg-green-100 border-l-4 border-green-500"><h3 class="text-xl font-bold text-green-800">✅ Application Approved</h3></div>
                  <div v-if="isEffectivelyRejected" class="mt-8 p-6 bg-red-100 border-l-4 border-red-500">
                    <h3 class="text-xl font-bold text-red-800">❌ Application Rejected</h3>
                    <p class="mt-1 text-sm text-red-700">Reason: {{ hospitalDetails.tc_reason_if_rejected }}</p>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-gray-100 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button type="button" @click="closeModal" class="btn btn-secondary">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';

const props = defineProps({
  isOpen: Boolean,
  hospitalDetails: Object,
});

const emit = defineEmits(['close-modal', 'approve', 'reject', 'submit-verification']);

const localVerificationData = ref({
  siteVisitScheduleDate: '',
  actualVerificationDate: '',
  report: '',
  status: 'PENDING_PV',
  sendToUser: false,
});
const selectedAttachments = ref(null);
const selectedReportFile = ref(null);
const rejectionReason = ref('');
const actionAttempt = ref(null);

watch(() => props.hospitalDetails, (newDetails) => {
  if (newDetails && props.isOpen) {
    localVerificationData.value = {
      siteVisitScheduleDate: newDetails.site_visit_schedule_date ? new Date(newDetails.site_visit_schedule_date).toISOString().split('T')[0] : '',
      actualVerificationDate: newDetails.physical_verification_date ? new Date(newDetails.physical_verification_date).toISOString().split('T')[0] : '',
      report: newDetails.physical_verification_remarks || '',
      status: newDetails.physical_verification_status || 'PENDING_PV',
      sendToUser: newDetails.send_to_user || false,
    };
    actionAttempt.value = null;
    rejectionReason.value = '';
    selectedAttachments.value = null;
    selectedReportFile.value = null;
  }
}, { immediate: true, deep: true });

const isEffectivelyApproved = computed(() => props.hospitalDetails?.tc_review_decision === 'Approved');
const isEffectivelyRejected = computed(() => ['Rejected', 'Regretted'].includes(props.hospitalDetails?.tc_review_decision));
const canDecide = computed(() => !isEffectivelyApproved.value && !isEffectivelyRejected.value);

const isVerificationSufficientForApproval = computed(() => {
  const currentStatus = props.hospitalDetails?.physical_verification_status;
  return currentStatus === 'VERIFIED_PV';
});

const isVerificationFormValid = computed(() => {
    const data = localVerificationData.value;
    if (!data.status) return false;
    // You can add more complex validation if remarks are always required, etc.
    return true;
});

const statusBadgeClass = computed(() => getDecisionStatusClass(props.hospitalDetails?.tc_review_decision));

const submitVerificationHandler = () => {
  const payload = {
    ...localVerificationData.value,
    verificationReport: localVerificationData.value.report,
    verificationStatus: localVerificationData.value.status,
    officer_attachments: selectedAttachments.value ? Array.from(selectedAttachments.value) : [],
    officer_report: selectedReportFile.value,
  };
  emit('submit-verification', payload);
};

const handleApprove = () => {
  if (!isVerificationSufficientForApproval.value) {
    alert("Cannot approve. The verification status must be set to 'Verified & Recommended' first.");
    return;
  }
  actionAttempt.value = null;
  emit('approve');
};

const prepareReject = () => {
  if (actionAttempt.value === 'reject' && rejectionReason.value.trim()) {
    emit('reject', { rejectionReason: rejectionReason.value.trim() });
    actionAttempt.value = null;
  } else {
    actionAttempt.value = 'reject';
  }
};

const closeModal = () => emit('close-modal');

const handleAttachmentsChange = (event) => {
  selectedAttachments.value = event.target.files;
};

const handleReportFileChange = (event) => {
  selectedReportFile.value = event.target.files[0];
};

const todayDate = () => new Date().toISOString().split('T')[0];

const formattedStatus = (statusKey) => {
  if (!statusKey) return 'Pending Review';
  return String(statusKey).replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
};

const getDecisionStatusClass = (status) => {
  const s = String(status).toLowerCase();
  if (s === 'approved') return 'bg-green-100 text-green-800';
  if (s === 'regretted' || s === 'rejected') return 'bg-red-100 text-red-800';
  return 'bg-yellow-100 text-yellow-800'; // Pending
};

const getFileNameFromUrl = (url) => url ? url.substring(url.lastIndexOf('/') + 1) : 'attachment';
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }

.btn { @apply inline-flex justify-center items-center rounded-md border shadow-sm px-4 py-2 text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-150 ease-in-out; }
.btn-success { @apply border-transparent bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 disabled:bg-green-300; }
.btn-danger { @apply border-transparent bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 disabled:bg-red-300; }
.btn-info { @apply border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:bg-blue-300; }
.btn-secondary { @apply border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-indigo-500; }

.form-input { @apply block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2; }
.file-input { @apply block w-full text-sm text-gray-900 border border-blue-300 rounded-lg cursor-pointer bg-blue-50 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-l-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-200 file:text-blue-700 hover:file:bg-blue-300; }
</style>