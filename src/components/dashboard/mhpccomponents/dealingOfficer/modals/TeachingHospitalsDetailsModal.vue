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

      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true"> </span>

      <div
        class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl w-full"
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
                <!-- Proponent Details Section -->
                <section>
                  <h4 class="text-md font-semibold text-indigo-700 mb-2">Proponent Details (Institute)</h4>
                  <dl class="text-sm space-y-1" v-if="hospitalDetails.institute_details">
                    <div class="grid grid-cols-3 gap-2 py-1 px-2 rounded bg-gray-50">
                      <dt class="font-medium text-gray-600">Institute Name:</dt>
                      <dd class="col-span-2 text-gray-800">{{ hospitalDetails.institute_details.name_of_institution || 'N/A' }}</dd>
                    </div>
                    <div class="grid grid-cols-3 gap-2 py-1 px-2 rounded">
                      <dt class="font-medium text-gray-600">Institute CID:</dt>
                      <dd class="col-span-2 text-gray-800">{{ hospitalDetails.institute_details.CID || 'N/A' }}</dd>
                    </div>
                     <div class="grid grid-cols-3 gap-2 py-1 px-2 rounded bg-gray-50">
                      <dt class="font-medium text-gray-600">Contact No (Proponent):</dt>
                      <dd class="col-span-2 text-gray-800">{{ hospitalDetails.institute_details.contact_no || 'N/A' }}</dd>
                    </div>
                    <div class="grid grid-cols-3 gap-2 py-1 px-2 rounded">
                      <dt class="font-medium text-gray-600">Email (Proponent):</dt>
                      <dd class="col-span-2 text-gray-800">{{ hospitalDetails.institute_details.email_address || 'N/A' }}</dd>
                    </div>
                    <div class="grid grid-cols-3 gap-2 py-1 px-2 rounded bg-gray-50">
                      <dt class="font-medium text-gray-600">Country (Proponent):</dt>
                      <dd class="col-span-2 text-gray-800">{{ hospitalDetails.institute_details.country === 'BT' ? 'Bhutan' : hospitalDetails.institute_details.country || 'N/A' }}</dd>
                    </div>
                    <div class="grid grid-cols-3 gap-2 py-1 px-2 rounded">
                      <dt class="font-medium text-gray-600">Dzongkhag (Proponent):</dt>
                      <dd class="col-span-2 text-gray-800">{{ hospitalDetails.institute_details.dzongkhag || 'N/A' }}</dd>
                    </div>
                    <div class="grid grid-cols-3 gap-2 py-1 px-2 rounded bg-gray-50">
                      <dt class="font-medium text-gray-600">Gewog (Proponent):</dt>
                      <dd class="col-span-2 text-gray-800">{{ hospitalDetails.institute_details.gewog || 'N/A' }}</dd>
                    </div>
                    <div class="grid grid-cols-3 gap-2 py-1 px-2 rounded">
                      <dt class="font-medium text-gray-600">Address (Proponent):</dt>
                      <dd class="col-span-2 text-gray-800">{{ hospitalDetails.institute_details.address || 'N/A' }}</dd>
                    </div>
                    <div class="grid grid-cols-3 gap-2 py-1 px-2 rounded bg-gray-50">
                        <dt class="font-medium text-gray-600">Institute Website:</dt>
                        <dd class="col-span-2 text-gray-800">
                            <a :href="hospitalDetails.institute_details.website" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline" v-if="hospitalDetails.institute_details.website">
                                {{ hospitalDetails.institute_details.website }}
                            </a>
                            <span v-else>N/A</span>
                        </dd>
                    </div>
                    <!-- Course Title is not directly in institute_details in your sample, if it's from `mhpc-course-details` it would be linked differently -->
                    <!-- Teaching Institute Type: not directly in `institute_details` for "Good Institution", might be a separate classification. -->
                  </dl>
                   <p v-else class="text-sm text-gray-500">Institute details not available.</p>
                </section>

                <!-- Teaching Center Details Section -->
                <section>
                  <h4 class="text-md font-semibold text-indigo-700 mb-2 mt-4">Proposed Teaching Center Details</h4>
                  <dl class="text-sm space-y-1">
                    <div class="grid grid-cols-3 gap-2 py-1 px-2 rounded bg-gray-50">
                      <dt class="font-medium text-gray-600">Center Name:</dt>
                      <dd class="col-span-2 text-gray-800">{{ hospitalDetails.center_name || 'N/A' }}</dd>
                    </div>
                    <div class="grid grid-cols-3 gap-2 py-1 px-2 rounded">
                      <dt class="font-medium text-gray-600">Center Location:</dt>
                      <dd class="col-span-2 text-gray-800">{{ hospitalDetails.center_location || 'N/A' }}</dd>
                    </div>
                    <div class="grid grid-cols-3 gap-2 py-1 px-2 rounded bg-gray-50">
                      <dt class="font-medium text-gray-600">State/Dzongkhag (Center):</dt>
                      <dd class="col-span-2 text-gray-800">{{ hospitalDetails.state_dzongkhag || 'N/A' }}</dd>
                    </div>
                    <div class="grid grid-cols-3 gap-2 py-1 px-2 rounded">
                      <dt class="font-medium text-gray-600">City/Gewog (Center):</dt>
                      <dd class="col-span-2 text-gray-800">{{ hospitalDetails.city_gewog || 'N/A' }}</dd>
                    </div>
                    <div class="grid grid-cols-3 gap-2 py-1 px-2 rounded bg-gray-50">
                      <dt class="font-medium text-gray-600">Target Category:</dt>
                      <dd class="col-span-2 text-gray-800">{{ hospitalDetails.target_category || 'N/A' }}</dd>
                    </div>
                     <div class="grid grid-cols-3 gap-2 py-1 px-2 rounded">
                      <dt class="font-medium text-gray-600">Renewal Review Name:</dt>
                      <dd class="col-span-2 text-gray-800">{{ hospitalDetails.tc_renewal_review_name || 'N/A' }}</dd>
                    </div>
                    <div class="grid grid-cols-3 gap-2 py-1 px-2 rounded bg-gray-50">
                      <dt class="font-medium text-gray-600">Review Summary:</dt>
                      <dd class="col-span-2 text-gray-800 whitespace-pre-wrap">{{ hospitalDetails.tc_review_summary || 'N/A' }}</dd>
                    </div>
                    <div class="grid grid-cols-3 gap-2 py-1 px-2 rounded">
                      <dt class="font-medium text-gray-600">Proposed Valid Till:</dt>
                      <dd class="col-span-2 text-gray-800">{{ hospitalDetails.valid_till ? formatDate(hospitalDetails.valid_till) : 'N/A' }}</dd>
                    </div>
                    <div class="grid grid-cols-3 gap-2 py-1 px-2 rounded bg-gray-50">
                      <dt class="font-medium text-gray-600">Attachments:</dt>
                      <dd class="col-span-2 text-gray-800">
                        <a v-if="hospitalDetails.tc_attachments" :href="hospitalDetails.tc_attachments" target="_blank" class="text-blue-600 hover:underline" :download="getFileNameFromUrl(hospitalDetails.tc_attachments)">
                            {{ getFileNameFromUrl(hospitalDetails.tc_attachments) || 'View Attachment' }}
                        </a>
                        <span v-else>No attachments</span>
                      </dd>
                    </div>
                     <div class="grid grid-cols-3 gap-2 py-1 px-2 rounded">
                      <dt class="font-medium text-gray-600">Report File:</dt>
                       <dd class="col-span-2 text-gray-800">
                        <a v-if="hospitalDetails.tc_report" :href="hospitalDetails.tc_report" target="_blank" class="text-blue-600 hover:underline" :download="getFileNameFromUrl(hospitalDetails.tc_report)">
                            {{ getFileNameFromUrl(hospitalDetails.tc_report) || 'View Report' }}
                        </a>
                        <span v-else>No report file</span>
                      </dd>
                    </div>
                    <div class="grid grid-cols-3 gap-2 py-1 px-2 rounded bg-gray-50">
                      <dt class="font-medium text-gray-600">TC Remarks (User):</dt>
                      <dd class="col-span-2 text-gray-800 whitespace-pre-wrap">{{ hospitalDetails.tc_remarks || 'N/A' }}</dd>
                    </div>
                    <div class="grid grid-cols-3 gap-2 py-1 px-2 rounded">
                      <dt class="font-medium text-gray-600">General Remarks (User):</dt>
                      <dd class="col-span-2 text-gray-800 whitespace-pre-wrap">{{ hospitalDetails.remarks || 'N/A' }}</dd>
                    </div>
                    <div class="grid grid-cols-3 gap-2 py-1 px-2 rounded bg-gray-50">
                      <dt class="font-medium text-gray-600">Declaration Accepted (User):</dt>
                      <dd class="col-span-2 text-gray-800">{{ hospitalDetails.tc_declaration ? 'Yes' : 'No' }}</dd>
                    </div>
                  </dl>
                </section>

                <!-- Dealing Officer Section -->
                <section class="mt-6 pt-4 border-t">
                  <h4 class="text-md font-semibold text-green-700 mb-3">Dealing Officer Actions</h4>

                  <div v-if="hospitalDetails.verification_date" class="mb-3 p-2 bg-blue-50 border border-blue-200 rounded-md text-sm">
                    <p><span class="font-medium">Physical Verification Recorded:</span></p>
                    <p>Date: {{ formatDate(hospitalDetails.verification_date) }}</p>
                    <p>Report: {{ hospitalDetails.verification_report || 'N/A' }}</p>
                  </div>
                  <div v-if="(hospitalDetails.tc_review_decision === 'Rejected' || hospitalDetails.tc_review_decision === 'Regretted') && hospitalDetails.tc_reason_if_rejected" class="mb-3 p-2 bg-red-50 border border-red-200 rounded-md text-sm">
                    <p><span class="font-medium">Rejection Reason:</span> {{ hospitalDetails.tc_reason_if_rejected }}</p>
                  </div>

                  <!-- Physical Verification Input -->
                  <div v-if="canRecordVerification" class="space-y-3 mb-4 p-3 border rounded-md bg-gray-50">
                    <h5 class="text-sm font-medium text-gray-800">Record Physical Verification:</h5>
                    <div>
                      <label for="verificationDate" class="block text-xs font-medium text-gray-700">Verification Date <span class="text-red-500">*</span></label>
                      <input type="date" id="verificationDate" v-model="localVerificationDate" :max="todayDate()" class="mt-1 block w-full sm:w-1/2 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2">
                    </div>
                    <div>
                      <label for="verificationReport" class="block text-xs font-medium text-gray-700">Verification Report/Notes <span class="text-red-500">*</span></label>
                      <textarea id="verificationReport" v-model="localVerificationReport" rows="3" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2" placeholder="Enter notes from physical verification"></textarea>
                    </div>
                    <button
                        type="button"
                        @click="submitVerificationHandler"
                        :disabled="!localVerificationDate || !localVerificationReport.trim()"
                        class="btn-sm btn-info"
                    >
                        Save Verification Details
                    </button>
                  </div>

                  <!-- Approval/Rejection Inputs & Actions -->
                  <div v-if="canDecide" class="space-y-3 p-3 border rounded-md bg-gray-50">
                     <h5 class="text-sm font-medium text-gray-800">Application Decision:</h5>
                     <div v-if="showRejectionReasonInput">
                        <label for="rejectionReason" class="block text-xs font-medium text-gray-700">Reason for Rejection <span class="text-red-500">*</span></label>
                        <textarea id="rejectionReason" v-model="localRejectionReason" rows="3" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2" placeholder="Provide clear reason for rejection"></textarea>
                     </div>
                  </div>
                   <div v-if="isApproved" class="mt-4 p-3 bg-green-100 text-green-700 rounded-md text-sm">
                        Application Approved. Payment is enabled for the institute.
                    </div>
                     <div v-if="isRejectedStatus && !canDecide" class="mt-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
                        Application has been Rejected.
                    </div>
                </section>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-gray-100 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button
            v-if="canApprove"
            type="button"
            @click="approveHandler"
            class="btn btn-success sm:ml-3"
          >
            Approve Application
          </button>
          <button
            v-if="canReject"
            type="button"
            @click="rejectHandler"
            :disabled="isRejecting && !localRejectionReason.trim()"
            class="btn btn-danger sm:ml-3"
          >
            {{ isRejecting ? 'Confirm Rejection' : 'Reject Application' }}
          </button>
           <button
            v-if="isRejecting"
            type="button"
            @click="cancelReject"
            class="btn btn-secondary sm:ml-3"
          >
            Cancel Rejection
          </button>
          <button
            type="button"
            @click="closeModal"
            class="btn btn-secondary sm:mt-0"
            :class="{'sm:ml-3': !canApprove && !canReject && !isRejecting}"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  isOpen: Boolean,
  hospitalDetails: {
    type: Object,
    default: () => ({ institute_details: {}, tc_attachments: null, tc_report: null }),
  },
})

const emit = defineEmits(['close-modal', 'approve', 'reject', 'submit-verification'])

const localVerificationDate = ref('')
const localVerificationReport = ref('')
const localRejectionReason = ref('')
const isRejecting = ref(false)

const todayDate = () => new Date().toISOString().split('T')[0];

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString; // Invalid date
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  } catch (e) {
    console.error('Error formatting date:', e);
    return dateString; // fallback
  }
};

const getFileNameFromUrl = (url) => {
    if (!url || typeof url !== 'string') return null;
    try {
        const urlObj = new URL(url);
        const pathSegments = urlObj.pathname.split('/');
        // Remove the unique ID prefix if present (e.g., 8ddc78ffb3704f6999a39805141529f9_)
        const fileNameWithPossiblePrefix = pathSegments.pop();
        const parts = fileNameWithPossiblePrefix.split('_');
        if (parts.length > 1 && parts[0].length === 32 && parts[1].match(/^\d{8}/)) { // Heuristic for UUID_timestamp
            return parts.slice(1).join('_');
        }
        return fileNameWithPossiblePrefix;
    } catch (e) {
      console.error('Error parsing URL:', e);
        // Fallback for non-URL strings or malformed URLs
        const parts = url.split('/');
        return parts.pop();
    }
};


watch(() => props.hospitalDetails, (newDetails) => {
  if (newDetails) {
    localVerificationDate.value = newDetails.verification_date ? new Date(newDetails.verification_date).toISOString().split('T')[0] : '';
    localVerificationReport.value = newDetails.verification_report || '';
    localRejectionReason.value = newDetails.tc_reason_if_rejected || '';
    isRejecting.value = false;
  }
}, { immediate: true, deep: true })

const closeModal = () => {
  emit('close-modal')
}

const submitVerificationHandler = () => {
  if (!localVerificationDate.value || !localVerificationReport.value.trim()) {
    alert('Please provide both verification date and report.');
    return;
  }
  emit('submit-verification', {
    verificationDate: localVerificationDate.value,
    verificationReport: localVerificationReport.value,
  });
}

const approveHandler = () => {
  if (!props.hospitalDetails.verification_date && !isVerificationOptionalForApproval.value) {
      alert('Physical verification must be recorded before approving the application.');
      return;
  }
  emit('approve');
}

const rejectHandler = () => {
  if (!isRejecting.value) {
    isRejecting.value = true;
    if (props.hospitalDetails.tc_review_decision === 'Rejected' && props.hospitalDetails.tc_reason_if_rejected) {
        localRejectionReason.value = props.hospitalDetails.tc_reason_if_rejected;
    } else if (props.hospitalDetails.tc_review_decision === 'Regretted' && props.hospitalDetails.tc_reason_if_rejected) { // For backward compatibility
        localRejectionReason.value = props.hospitalDetails.tc_reason_if_rejected;
    }
    return;
  }
  if (!localRejectionReason.value.trim()) {
    alert('Please provide a reason for rejection.');
    return;
  }
  emit('reject', localRejectionReason.value);
  isRejecting.value = false;
}

const cancelReject = () => {
    isRejecting.value = false;
    if(props.hospitalDetails.tc_review_decision !== 'Rejected' && props.hospitalDetails.tc_review_decision !== 'Regretted') {
        localRejectionReason.value = '';
    }
}

const formattedStatus = (status) => {
    if (!status) return 'Pending Review';
    return status.replace(/_/g, ' ');
}

const statusBadgeClass = computed(() => {
  const status = props.hospitalDetails.tc_review_decision;
  if (status === 'Approved') return 'bg-green-100 text-green-800';
  if (status === 'Rejected' || status === 'Regretted') return 'bg-red-100 text-red-800';
  if (status === 'Verification_Completed') return 'bg-blue-100 text-blue-800';
  return 'bg-yellow-100 text-yellow-800';
});

const isInitialPending = computed(() => !props.hospitalDetails.tc_review_decision || props.hospitalDetails.tc_review_decision === 'Pending');
const isVerificationDone = computed(() => !!props.hospitalDetails.verification_date);
const isApproved = computed(() => props.hospitalDetails.tc_review_decision === 'Approved');
const isRejectedStatus = computed(() => props.hospitalDetails.tc_review_decision === 'Rejected' || props.hospitalDetails.tc_review_decision === 'Regretted');

const isVerificationOptionalForApproval = ref(false);

const canRecordVerification = computed(() => {
    return (isInitialPending.value || props.hospitalDetails.tc_review_decision === 'Verification_Completed') && !isApproved.value && !isRejectedStatus.value;
});

const canDecide = computed(() => {
    return (isVerificationDone.value || (isInitialPending.value && isVerificationOptionalForApproval.value) || props.hospitalDetails.tc_review_decision === 'Verification_Completed') && !isApproved.value && !isRejectedStatus.value;
});

const canApprove = computed(() => {
    return canDecide.value && !isRejecting.value;
});

const canReject = computed(() => {
    return canDecide.value || (isRejectedStatus.value && isRejecting.value);
});

const showRejectionReasonInput = computed(() => {
    return isRejecting.value && canReject.value;
});

</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1; /* Tailwind gray-300 */
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #94a3b8; /* Tailwind gray-400 */
}
.whitespace-pre-wrap {
  white-space: pre-wrap;
}
.btn {
  @apply inline-flex justify-center items-center rounded-md border shadow-sm px-4 py-2 text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 sm:w-auto sm:text-sm disabled:opacity-50;
}
.btn-sm {
   @apply px-3 py-1.5 text-xs;
}
.btn-success {
  @apply border-transparent bg-green-600 text-white hover:bg-green-700 focus:ring-green-500;
}
.btn-danger {
  @apply border-transparent bg-red-600 text-white hover:bg-red-700 focus:ring-red-500;
}
.btn-info {
  @apply border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500;
}
.btn-secondary {
  @apply border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-indigo-500;
}
</style>