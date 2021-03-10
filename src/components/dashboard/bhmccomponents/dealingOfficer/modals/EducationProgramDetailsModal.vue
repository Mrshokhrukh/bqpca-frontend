<template>
  <Teleport to="body">
    <div v-if="isOpen" class="fixed z-50 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog"
      aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="closeModal">
        </div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div
          class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  Program Details
                </h3>
                <div class="mt-4">
                  <p class="text-sm text-gray-500">
                    View detailed information about the education program.
                  </p>
                </div>
              </div>
            </div>
            <div class="mt-6 grid grid-cols-1 gap-4">
              <div>
                <label for="institute" class="block text-sm font-medium text-gray-700">Institute</label>
                <div class="mt-1">
                  <input type="text" id="institute" :value="programDetails.institute"
                    class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    disabled>
                </div>
              </div>
              <div>
                <label for="course-title" class="block text-sm font-medium text-gray-700">Course title</label>
                <div class="mt-1">
                  <input type="text" id="course-title" :value="programDetails.courseTitle"
                    class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    disabled>
                </div>
              </div>
              <div>
                <label for="duration" class="block text-sm font-medium text-gray-700">Duration in months</label>
                <div class="mt-1">
                  <input type="text" id="duration" :value="programDetails.durationMonths"
                    class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    disabled>
                </div>
              </div>
              <div>
                <label for="commencement-date" class="block text-sm font-medium text-gray-700">Commencement date</label>
                <div class="mt-1">
                  <input type="text" id="commencement-date" :value="formatDate(programDetails.commencementDate)"
                    class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    disabled>
                </div>
              </div>
              <div>
                <label for="institute-attachments" class="block text-sm font-medium text-gray-700">Institute
                  attachments</label>
                <div class="mt-1">
                  <a :href="programDetails.instituteAttachments" target="_blank"
                    v-if="programDetails.instituteAttachments" class="text-blue-600 hover:text-blue-800">View
                    Attachments</a>
                  <span v-else class="text-gray-500">No attachments available</span>
                </div>
              </div>
              <div>
                <label for="remarks" class="block text-sm font-medium text-gray-700">Remarks</label>
                <div class="mt-1">
                  <textarea id="remarks" :value="programDetails.remarks" rows="3"
                    class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    disabled></textarea>
                </div>
              </div>
              <div>
                <label for="ins-declaration" class="block text-sm font-medium text-gray-700">Ins declaration</label>
                <div class="mt-1">
                  <textarea id="ins-declaration" :value="programDetails.insDeclaration" rows="2"
                    class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    disabled></textarea>
                </div>
              </div>
              <div>
                <label for="renewal-review-name" class="block text-sm font-medium text-gray-700">Ins renewal review
                  name</label>
                <div class="mt-1">
                  <input type="text" id="renewal-review-name" :value="programDetails.insRenewalReviewName"
                    class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    disabled>
                </div>
              </div>
              <div>
                <label for="review-summary" class="block text-sm font-medium text-gray-700">Ins review summary</label>
                <div class="mt-1">
                  <textarea id="review-summary" :value="programDetails.insReviewSummary" rows="2"
                    class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    disabled></textarea>
                </div>
              </div>
              <div>
                <label for="ins-report" class="block text-sm font-medium text-gray-700">Ins report</label>
                <div class="mt-1">
                  <a :href="programDetails.insReport" target="_blank" v-if="programDetails.insReport"
                    class="text-blue-600 hover:text-blue-800">View Report</a>
                  <span v-else class="text-gray-500">No report available</span>
                </div>
              </div>
              <div>
                <label for="review-decision" class="block text-sm font-medium text-gray-700">Ins review decision</label>
                <div class="mt-1">
                  <input type="text" id="review-decision" :value="getStatusText(programDetails.insReviewDecision)"
                    class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    disabled>
                </div>
              </div>
              <div v-if="programDetails.insReviewDecision === 'Rejected'">
                <label for="rejection-reason" class="block text-sm font-medium text-gray-700">Ins reason if
                  rejected</label>
                <div class="mt-1">
                  <textarea id="rejection-reason" :value="programDetails.insReasonIfRejected" rows="2"
                    class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    disabled></textarea>
                </div>
              </div>
              <div>
                <label for="ins-remarks" class="block text-sm font-medium text-gray-700">Ins remarks</label>
                <div class="mt-1">
                  <textarea id="ins-remarks" :value="programDetails.insRemarks" rows="2"
                    class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    disabled></textarea>
                </div>
              </div>
              <div>
                <label for="is-active" class="block text-sm font-medium text-gray-700">Is active</label>
                <div class="mt-1">
                  <input type="text" id="is-active" :value="programDetails.isActive ? 'Yes' : 'No'"
                    class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    disabled>
                </div>
              </div>
              <div>
                <label for="valid-till" class="block text-sm font-medium text-gray-700">Valid till</label>
                <div class="mt-1">
                  <input type="text" id="valid-till" :value="formatDate(programDetails.validTill)"
                    class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    disabled>
                </div>
              </div>
              <div>
                <label for="payment-id" class="block text-sm font-medium text-gray-700">Payment id</label>
                <div class="mt-1">
                  <input type="text" id="payment-id" :value="programDetails.paymentId"
                    class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    disabled>
                </div>
              </div>
              <div>
                <label for="is-payment-complete" class="block text-sm font-medium text-gray-700">Is payment
                  complete</label>
                <div class="mt-1">
                  <input type="text" id="is-payment-complete" :value="programDetails.isPaymentComplete ? 'Yes' : 'No'"
                    class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    disabled>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button type="button"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              @click="closeModal">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>

defineProps({
  isOpen: Boolean,
  programDetails: {
    type: Object,
    default: () => ({}) // Default to empty object if no details are passed
  }
});

const emit = defineEmits(['close-modal']);

const closeModal = () => {
  emit('close-modal');
};

const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const getStatusText = (decision) => {
  switch (decision) {
    case 'Approved':
      return 'Approved';
    case 'Rejected':
      return 'Rejected';
    default:
      return 'Pending';
  }
};
</script>
