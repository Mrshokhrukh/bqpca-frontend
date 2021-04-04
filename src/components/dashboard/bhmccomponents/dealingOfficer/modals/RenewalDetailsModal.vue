<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" @click="closeModal"></div>

      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

      <div
        class="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-5xl sm:w-full"
        role="dialog" aria-modal="true" aria-labelledby="modal-headline">
        <!-- Modal header -->
        <div class="px-6 py-4 bg-gray-50 border-b border-gray-100">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-900" id="modal-headline">
              Renewal Application {{ qualification?.renewalData ? '(Already Processed)' : '' }}
            </h3>
            <button @click="closeModal" class="text-gray-400 hover:text-gray-500 focus:outline-none">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div v-if="qualification" class="p-6">
          <!-- Status Badge (if renewal exists) -->
          <div v-if="qualification.renewalData" class="mb-6">
            <div class="inline-flex items-center px-4 py-2 rounded-full"
              :class="getRenewalStatusClasses(qualification.renewalData.renewal_endorsement_decision)">
              <span class="text-sm font-medium">
                Renewal Status: {{ qualification.renewalData.renewal_endorsement_decision || 'Pending' }}
              </span>
              <span class="ml-2 text-xs text-opacity-75">
                (Processed on {{ formatDate(qualification.renewalData.updated_at) }})
              </span>
            </div>
          </div>

          <!-- Applicant Information -->
          <div class="mb-8 p-6 bg-white rounded-lg border border-gray-200">
            <h4 class="text-lg font-medium text-gray-900 mb-4">Applicant Information</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="flex flex-col">
                <span class="text-sm text-gray-500">Name</span>
                <span class="font-medium text-gray-900">{{ qualification.user?.full_name || 'Unknown' }}</span>
              </div>
              <div class="flex flex-col">
                <span class="text-sm text-gray-500">CID Number</span>
                <span class="font-medium text-gray-900">{{ qualification.user?.cid || 'N/A' }}</span>
              </div>
              <div class="flex flex-col">
                <span class="text-sm text-gray-500">Registration Number</span>
                <span class="font-medium text-gray-900">{{ qualification.registration_no || 'N/A' }}</span>
              </div>
              <div class="flex flex-col">
                <span class="text-sm text-gray-500">Registration Date</span>
                <span class="font-medium text-gray-900">{{ formatDate(qualification.registration_date) }}</span>
              </div>
              <div class="flex flex-col">
                <span class="text-sm text-gray-500">Current Expiry Date</span>
                <span class="font-medium text-gray-900">{{ formatDate(qualification.expiry_date) }}</span>
              </div>
              <div v-if="qualification.renewalData" class="flex flex-col">
                <span class="text-sm text-gray-500">New Expiry Date</span>
                <span class="font-medium text-gray-900">{{ formatDate(qualification.renewalData.new_expiry_date)
                }}</span>
              </div>
            </div>
          </div>

          <!-- Qualification Information -->
          <div class="mb-8 p-6 bg-white rounded-lg border border-gray-200">
            <h4 class="text-lg font-medium text-gray-900 mb-4">Qualification Information</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="flex flex-col">
                <span class="text-sm text-gray-500">Qualification</span>
                <span class="font-medium text-gray-900">{{ qualification.qualification_name_display || 'N/A' }}</span>
              </div>
              <div class="flex flex-col">
                <span class="text-sm text-gray-500">Qualification Type</span>
                <span class="font-medium text-gray-900">{{ qualification.qualification_type_display || 'N/A' }}</span>
              </div>
              <div class="flex flex-col">
                <span class="text-sm text-gray-500">Institute/University</span>
                <span class="font-medium text-gray-900">{{ qualification.institute_university_display || 'N/A' }}</span>
              </div>
              <div class="flex flex-col">
                <span class="text-sm text-gray-500">Personnel Category</span>
                <span class="font-medium text-gray-900">{{ qualification.personnel_category_name || 'N/A' }}</span>
              </div>
              <div class="flex flex-col">
                <span class="text-sm text-gray-500">Personnel Sub-Category</span>
                <span class="font-medium text-gray-900">{{ qualification.personnel_sub_category_name || 'N/A' }}</span>
              </div>
              <div class="flex flex-col">
                <span class="text-sm text-gray-500">Sector</span>
                <span class="font-medium text-gray-900">{{ qualification.select_sector_name || 'N/A' }}</span>
              </div>
              <div class="flex flex-col">
                <span class="text-sm text-gray-500">Completion Year</span>
                <span class="font-medium text-gray-900">{{ qualification.completion_year || 'N/A' }}</span>
              </div>
              <div class="flex flex-col">
                <span class="text-sm text-gray-500">Practice Address</span>
                <span class="font-medium text-gray-900">{{ qualification.practice_address || 'N/A' }}</span>
              </div>
              <div class="flex flex-col">
                <span class="text-sm text-gray-500">Status</span>
                <span :class="getQualificationStatusClasses(qualification.endorsement_decision)"
                  class="inline-flex px-2 py-1 rounded text-xs">
                  {{ qualification.endorsement_decision }}
                </span>
              </div>
            </div>
          </div>

          <!-- Attachments -->
          <div class="mb-8 p-6 bg-white rounded-lg border border-gray-200">
            <h4 class="text-lg font-medium text-gray-900 mb-4">Attachments</h4>
            <div v-if="qualification.user_qualification_attachments?.length > 0">
              <ul class="divide-y divide-gray-200">
                <li v-for="attachment in qualification.user_qualification_attachments" :key="attachment.id"
                  class="py-3 flex justify-between items-center">
                  <div>
                    <p class="font-medium text-gray-900">{{ attachment.file_type_name }}</p>
                    <p class="text-sm text-gray-500">Uploaded: {{ formatDate(attachment.uploaded_at) }}</p>
                  </div>
                  <a :href="attachment.file" target="_blank"
                    class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    View
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </li>
              </ul>
            </div>
            <div v-else class="text-center py-4 text-gray-500">
              No attachments available
            </div>
          </div>

          <!-- Existing Renewal Information (if any) -->
          <div v-if="qualification.renewalData" class="mb-8 p-6 bg-white rounded-lg border border-gray-200">
            <h4 class="text-lg font-medium text-gray-900 mb-4">Renewal Information</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="flex flex-col">
                <span class="text-sm text-gray-500">Review Status</span>
                <span :class="getStatusTagClass(qualification.renewalData.renewal_review_status)"
                  class="mt-1 inline-flex px-2 py-1 rounded text-xs">
                  {{ qualification.renewalData.renewal_review_status || 'Pending' }}
                </span>
              </div>
              <div class="flex flex-col">
                <span class="text-sm text-gray-500">Endorsement Decision</span>
                <span :class="getStatusTagClass(qualification.renewalData.renewal_endorsement_decision)"
                  class="mt-1 inline-flex px-2 py-1 rounded text-xs">
                  {{ qualification.renewalData.renewal_endorsement_decision || 'Pending' }}
                </span>
              </div>
              <div class="flex flex-col col-span-2">
                <span class="text-sm text-gray-500">Review Remarks</span>
                <span class="font-medium text-gray-900">{{ qualification.renewalData.renewal_review_remarks ||
                  'Noremarks' }}</span>
              </div>
              <div class="flex flex-col col-span-2">
                <span class="text-sm text-gray-500">Endorsement Remarks</span>
                <span class="font-medium text-gray-900">{{ qualification.renewalData.endorsement_remarks || 'No remarks'
                }}</span>
              </div>
            </div>
          </div>

          <!-- Review Section for Officer (if not already processed) -->
          <div class="mb-8 p-6 bg-white rounded-lg border border-gray-200" v-if="!qualification.renewalData">
            <h4 class="text-lg font-medium text-gray-900 mb-4">Process Renewal</h4>

            <div class="mb-6">
              <label for="renewal_review_status" class="block text-sm font-medium text-gray-700 mb-2">
                Review Status <span class="text-red-500">*</span>
              </label>
              <select id="renewal_review_status" v-model="reviewForm.renewal_review_status"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Regretted">Regretted</option>
              </select>
            </div>

            <div class="mb-6">
              <label for="renewal_review_remarks" class="block text-sm font-medium text-gray-700 mb-2">
                Review Remarks
              </label>
              <textarea id="renewal_review_remarks" v-model="reviewForm.renewal_review_remarks" rows="3"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Enter your remarks here..."></textarea>
            </div>

            <div class="mb-6" v-if="reviewForm.renewal_review_status === 'Approved'">
              <label for="new_expiry_date" class="block text-sm font-medium text-gray-700 mb-2">
                New Expiry Date <span class="text-red-500">*</span>
              </label>
              <input type="date" id="new_expiry_date" v-model="reviewForm.new_expiry_date"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
            </div>

            <div class="mb-6">
              <label for="renewal_endorsement_decision" class="block text-sm font-medium text-gray-700 mb-2">
                Endorsement Decision <span class="text-red-500">*</span>
              </label>
              <select id="renewal_endorsement_decision" v-model="reviewForm.renewal_endorsement_decision"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Regretted">Regretted</option>
              </select>
            </div>

            <div class="mb-6">
              <label for="endorsement_remarks" class="block text-sm font-medium text-gray-700 mb-2">
                Endorsement Remarks
              </label>
              <textarea id="endorsement_remarks" v-model="reviewForm.endorsement_remarks" rows="3"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Enter your endorsement remarks here..."></textarea>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex justify-end space-x-3 mt-8">
            <button @click="closeModal"
              class="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Cancel
            </button>
            <button v-if="!qualification.renewalData" @click="submitRenewal" :disabled="isSubmitting"
              :class="{ 'opacity-50 cursor-not-allowed': isSubmitting }"
              class="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
              </svg>
              {{ isSubmitting ? 'Processing...' : 'Submit Renewal' }}
            </button>
          </div>
        </div>

        <!-- Loading State -->
        <div v-else class="p-6 text-center">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <p class="mt-2 text-sm text-gray-600">Loading qualification details...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import apiServices from '@/services/services';
import { useToast } from 'vue-toastification';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  qualification: {
    type: Object,
    default: null
  },
  personnelCategories: {
    type: Array,
    default: () => []
  },
  personnelSubcategories: {
    type: Array,
    default: () => []
  },
  sectors: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['close', 'update']);
const toast = useToast();
const isSubmitting = ref(false);

// Initialize review form with default values
const reviewForm = ref({
  renewal_review_status: 'Pending',
  renewal_review_remarks: '',
  new_expiry_date: null,
  renewal_endorsement_decision: 'Pending',
  endorsement_remarks: ''
});

// Reset form when modal opens with new qualification
watch(() => props.qualification, (newQualification) => {
  if (newQualification) {
    // Calculate a default expiry date (3 years from current expiry)
    let defaultNewExpiryDate = null;
    if (newQualification.expiry_date) {
      const currentExpiry = new Date(newQualification.expiry_date);
      currentExpiry.setFullYear(currentExpiry.getFullYear() + 3);
      defaultNewExpiryDate = currentExpiry.toISOString().split('T')[0];
    } else {
      // Fallback to 3 years from today
      const today = new Date();
      today.setFullYear(today.getFullYear() + 3);
      defaultNewExpiryDate = today.toISOString().split('T')[0];
    }

    reviewForm.value = {
      renewal_review_status: 'Pending',
      renewal_review_remarks: '',
      new_expiry_date: defaultNewExpiryDate,
      renewal_endorsement_decision: 'Pending',
      endorsement_remarks: ''
    };
  }
}, { immediate: true });

// Format date for display
const formatDate = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Get CSS classes for qualification status display
const getQualificationStatusClasses = (status) => {
  return {
    'bg-yellow-100 text-yellow-800': status === 'Pending',
    'bg-green-100 text-green-800': status === 'Approved',
    'bg-red-100 text-red-800': status === 'Regretted',
  };
};

// Get CSS classes for renewal status display
const getRenewalStatusClasses = (status) => {
  return {
    'bg-yellow-100 text-yellow-800': status === 'Pending',
    'bg-green-100 text-green-800': status === 'Approved',
    'bg-red-100 text-red-800': status === 'Regretted'
  };
};

// Get CSS classes for status tag
const getStatusTagClass = (status) => {
  return {
    'bg-yellow-100 text-yellow-800': status === 'Pending',
    'bg-green-100 text-green-800': status === 'Approved',
    'bg-red-100 text-red-800': status === 'Regretted',
  };
};

// Close the modal
const closeModal = () => {
  if (!isSubmitting.value) {
    emit('close');
  }
};

// Submit the renewal
const submitRenewal = async () => {
  if (!props.qualification) {
    toast.error('No qualification data available');
    return;
  }

  // Validate form inputs
  if (reviewForm.value.renewal_review_status === 'Approved' && !reviewForm.value.new_expiry_date) {
    toast.error('New expiry date is required when approving the renewal');
    return;
  }

  try {
    isSubmitting.value = true;

    // Prepare data for submission
    const renewalData = {
      application: props.qualification.id,
      user_qualification: props.qualification.id,
      renewal_review_status: reviewForm.value.renewal_review_status,
      renewal_review_remarks: reviewForm.value.renewal_review_remarks,
      renewal_endorsement_decision: reviewForm.value.renewal_endorsement_decision,
      endorsement_remarks: reviewForm.value.endorsement_remarks
    };

    // Only include new_expiry_date if it has a value
    if (reviewForm.value.new_expiry_date) {
      renewalData.new_expiry_date = reviewForm.value.new_expiry_date;
    }

    // Create the renewal
    await apiServices.createMhpcRenewal(renewalData);

    toast.success('Renewal application processed successfully');
    emit('update');
  } catch (error) {
    console.error('Error processing renewal:', error);
    toast.error('Failed to process renewal application');
  } finally {
    isSubmitting.value = false;
  }
};
</script>
