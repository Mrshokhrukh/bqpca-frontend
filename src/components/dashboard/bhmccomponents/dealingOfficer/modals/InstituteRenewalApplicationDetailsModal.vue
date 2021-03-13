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
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  Institute Renewal Application Details
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    View details for the renewal application of {{ applicationDetails.name_of_institution || 'Unknown Institute' }}.
                  </p>
                </div>
              </div>
            </div>
            <div class="mt-5 max-h-96 overflow-y-auto">
              <dl class="divide-y divide-gray-200">
                <!-- Institute Information -->
                <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt class="text-sm font-medium text-gray-500">
                    Institute Name
                  </dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {{ applicationDetails.name_of_institution || 'N/A' }}
                  </dd>
                </div>

                <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt class="text-sm font-medium text-gray-500">
                    Course Title
                  </dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {{ applicationDetails.title_of_course || 'N/A' }}
                  </dd>
                </div>

                <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt class="text-sm font-medium text-gray-500">
                    Course Duration
                  </dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {{ applicationDetails.course_duration || 'N/A' }} {{ applicationDetails.course_duration === 1 ?
                    'year' : 'years' }}
                  </dd>
                </div>

                <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt class="text-sm font-medium text-gray-500">
                    Commencement Date
                  </dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {{ formatDate(applicationDetails.commencement_date) || 'N/A' }}
                  </dd>
                </div>

                <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt class="text-sm font-medium text-gray-500">
                    Review Status
                  </dt>
                  <dd class="mt-1 sm:mt-0 sm:col-span-2">
                    <span :class="getStatusClass(applicationDetails.review_decision)">
                      {{ applicationDetails.review_decision || 'Pending' }}
                    </span>
                  </dd>
                </div>

                <div v-if="applicationDetails.valid_since" class="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt class="text-sm font-medium text-gray-500">
                    Valid Since
                  </dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {{ formatDate(applicationDetails.valid_since) }}
                  </dd>
                </div>

                <div v-if="applicationDetails.valid_till" class="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt class="text-sm font-medium text-gray-500">
                    Expiry Date
                  </dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {{ formatDate(applicationDetails.valid_till) }}
                  </dd>
                </div>

                <!-- Applicant Information -->
                <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt class="text-sm font-medium text-gray-500">
                    Applicant Name
                  </dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {{ applicationDetails.full_name || 'N/A' }}
                  </dd>
                </div>

                <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt class="text-sm font-medium text-gray-500">
                    CID
                  </dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {{ applicationDetails.CID || 'N/A' }}
                  </dd>
                </div>

                <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt class="text-sm font-medium text-gray-500">
                    Contact Number
                  </dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {{ applicationDetails.contact_no || 'N/A' }}
                  </dd>
                </div>

                <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt class="text-sm font-medium text-gray-500">
                    Email
                  </dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {{ applicationDetails.email_address || 'N/A' }}
                  </dd>
                </div>

                <!-- Documents Section -->
                <div v-if="applicationDetails.supporting_documents" class="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt class="text-sm font-medium text-gray-500">
                    Supporting Documents
                  </dt>
                  <dd class="mt-1 text-sm text-blue-600 sm:mt-0 sm:col-span-2">
                    <a :href="applicationDetails.supporting_documents" target="_blank" class="hover:underline">View
                      Document</a>
                  </dd>
                </div>

                <!-- Rejection Reason if applicable -->
                <div v-if="applicationDetails.reason_if_rejected" class="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt class="text-sm font-medium text-gray-500">
                    Reason for Regret
                  </dt>
                  <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {{ applicationDetails.reason_if_rejected }}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button v-if="applicationDetails.review_decision === 'Pending'" type="button"
              class="ml-3 w-auto inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:text-sm"
              @click="$emit('approve-application')">
              Approve
            </button>
            <button v-if="applicationDetails.review_decision === 'Pending'" type="button"
              class="ml-3 w-auto inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm"
              @click="$emit('regret-application')">
              Regret
            </button>
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
  isOpen: {
    type: Boolean,
    required: true
  },
  applicationDetails: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(['close-modal', 'approve-application', 'regret-application']);

const closeModal = () => {
  emit('close-modal');
};

const formatDate = (date) => {
  if (!date) return 'Not Set';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const getStatusClass = (status) => {
  switch (status) {
    case 'Approved':
      return 'px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800';
    case 'Regretted': // Changed from 'Rejected' to 'Regretted'
      return 'px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800';
    case 'Pending':
    default:
      return 'px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800';
  }
};
</script>

<style scoped>
/* Add any additional styles here */
.max-h-96 {
  max-height: 24rem;
}
</style>