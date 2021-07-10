<template>
  <TransitionRoot appear :show="isOpen" as="template" @after-leave="handleAfterLeave">
    <Dialog as="div" @close="handleClose" class="relative z-50" :key="`modal-${renewalData?.renewal_id || 'new'}`">
      <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100"
        leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-black/30" @click="handleClose" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95">
            <DialogPanel
              class="w-full max-w-6xl transform overflow-hidden rounded-2xl bg-gray-100 text-left align-middle shadow-xl transition-all"
              @click.stop>
              <!-- Hidden focusable element for accessibility -->
              <button ref="fallbackFocusElement" class="sr-only" tabindex="-1" @focus="focusPrimaryButton"
                aria-label="Fallback focus element">
                Fallback focus element
              </button>

              <DialogTitle as="h3"
                class="flex justify-between items-center text-lg font-semibold leading-6 text-gray-900 px-6 py-4 bg-white border-b">
                EPC Renewal Application Review (#{{ renewalData?.renewal_id }})
                <span v-if="isProcessed" class="text-sm font-normal text-gray-500">
                  (Already Processed)
                </span>
                <button ref="closeButton" @click="handleClose"
                  class="p-1 rounded-full hover:bg-gray-200 transition-colors focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  tabindex="0" aria-label="Close modal">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </DialogTitle>

              <div v-if="renewalData && !isDestroyed" class="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6"
                :key="`content-${renewalData.renewal_id}`">
                <!-- Decision Support Panel -->
                <div class="lg:col-span-1 space-y-6">
                  <!-- CPD Status Panel -->
                  <div class="bg-white rounded-xl border p-4 shadow-sm">
                    <h4 class="font-semibold text-gray-800 mb-3 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-blue-600" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      CPD Status
                    </h4>

                    <div v-if="cpdState.isLoading" class="text-center p-6 text-sm text-gray-500">
                      <div
                        class="animate-spin h-5 w-5 mx-auto mb-2 border-2 border-blue-600 border-t-transparent rounded-full">
                      </div>
                      Loading CPD data...
                    </div>

                    <div v-else-if="cpdState.error" class="text-center p-6 text-sm text-red-600">
                      <p>Failed to load CPD data</p>
                      <button @click="retryFetchCpd" class="mt-2 text-xs text-blue-600 hover:text-blue-800 underline">
                        Retry
                      </button>
                    </div>

                    <div v-else class="text-center p-6 bg-blue-50 rounded-lg border">
                      <p class="text-3xl font-bold text-blue-700">
                        {{ cpdState.totalPoints }}
                        <span class="text-lg font-medium">Points</span>
                      </p>
                      <p class="text-xs text-blue-600 mt-1">(Recommended: 60)</p>
                      <div class="mt-3 text-xs px-2 py-1 rounded-full inline-block font-medium"
                        :class="cpdState.status.badgeClass">
                        {{ cpdState.status.text }}
                      </div>

                      <div v-if="cpdState.records.length > 0" class="mt-3 text-xs text-gray-600">
                        <details class="cursor-pointer">
                          <summary class="hover:text-blue-600">View {{ cpdState.records.length }} CPD records</summary>
                          <ul class="mt-2 text-left space-y-1 max-h-32 overflow-y-auto">
                            <li v-for="record in cpdState.records.slice(0, 5)" :key="record.id"
                              class="flex justify-between">
                              <span class="truncate">{{ record.title_of_cpd || 'Untitled' }}</span>
                              <span class="font-medium">{{ record.cpd_credit || 0 }}pts</span>
                            </li>
                          </ul>
                        </details>
                      </div>
                    </div>
                  </div>

                  <!-- Payment Status Panel -->
                  <div class="bg-white rounded-xl border p-4 shadow-sm">
                    <h4 class="font-semibold text-gray-800 mb-3 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-green-600" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Payment Status
                    </h4>

                    <div class="text-center p-6 bg-gray-50 rounded-lg border">
                      <div class="flex items-center justify-center mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" :class="paymentInfo.iconClass"
                          fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <p class="text-sm font-medium text-gray-700">{{ paymentInfo.text }}</p>
                      <p class="text-xs text-gray-500 mt-1">{{ paymentInfo.subtext }}</p>

                      <div v-if="renewalData.renewal_fee_amount || renewalData.original_renewal?.renewal_fee_amount"
                        class="mt-2">
                        <p class="text-xs text-gray-600">
                          Fee: <span class="font-semibold">Nu. {{ renewalData.renewal_fee_amount ||
                            renewalData.original_renewal?.renewal_fee_amount }}</span>
                        </p>
                      </div>

                      <div v-if="renewalData.payment_id || renewalData.original_renewal?.payment_id" class="mt-1">
                        <p class="text-xs text-gray-600">
                          Payment ID: <span class="font-mono text-xs">{{ renewalData.payment_id ||
                            renewalData.original_renewal?.payment_id }}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Main Content Panel -->
                <div class="lg:col-span-2 space-y-6">
                  <!-- Registration Details -->
                  <div class="bg-white rounded-xl border p-4 shadow-sm">
                    <h4 class="font-semibold text-gray-800 mb-4">Original Registration Details</h4>
                    <div class="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p class="text-xs text-gray-500">Full Name</p>
                        <p class="font-medium text-gray-800">{{ renewalData.full_name }}</p>
                      </div>
                      <div>
                        <p class="text-xs text-gray-500">CID No.</p>
                        <p class="font-medium text-gray-800">{{ renewalData.cid_no }}</p>
                      </div>
                      <div>
                        <p class="text-xs text-gray-500">Reg. No.</p>
                        <p class="font-medium text-gray-800">{{ renewalData.registration_no }}</p>
                      </div>
                      <div>
                        <p class="text-xs text-gray-500">Primary Qualification</p>
                        <p class="font-medium text-gray-800">{{ renewalData.primary_qualification || 'N/A' }}</p>
                      </div>
                      <div>
                        <p class="text-xs text-gray-500"> Expiry Date</p>
                        <p class="font-medium text-red-600">{{ formatDate(renewalData.original_expiry_date) }}</p>
                      </div>
                      <div>
                        <p class="text-xs text-gray-500">Applied On</p>
                        <p class="font-medium text-gray-600">{{ formatDate(renewalData.application_date) }}</p>
                      </div>
                    </div>
                  </div>

                  <!-- Current Status (if already processed) -->
                  <div v-if="isProcessed" class="bg-white rounded-xl border p-4 shadow-sm">
                    <h4 class="font-semibold text-gray-800 mb-4">Current Processing Status</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p class="text-xs text-gray-500">Review Status</p>
                        <p class="font-medium" :class="getStatusColor(renewalData.renewal_review_status)">
                          {{ renewalData.renewal_review_status || 'N/A' }}
                        </p>
                      </div>
                      <div>
                        <p class="text-xs text-gray-500">Endorsement Decision</p>
                        <p class="font-medium" :class="getStatusColor(renewalData.renewal_status)">
                          {{ renewalData.renewal_status || 'N/A' }}
                        </p>
                      </div>
                      <div>
                        <p class="text-xs text-gray-500">Payment Status</p>
                        <p class="font-medium"
                          :class="getStatusColor(renewalData.payment_status || renewalData.original_renewal?.payment_status)">
                          {{ renewalData.payment_status_display || renewalData.original_renewal?.payment_status_display
                            || 'N/A' }}
                        </p>
                      </div>
                      <div v-if="renewalData.new_expiry_date">
                        <p class="text-xs text-gray-500">New Expiry Date</p>
                        <p class="font-medium text-green-600">{{ formatDate(renewalData.new_expiry_date) }}</p>
                      </div>
                      <div class="md:col-span-2" v-if="renewalData.renewal_review_remarks">
                        <p class="text-xs text-gray-500">Review Remarks</p>
                        <p class="font-medium text-gray-800">{{ renewalData.renewal_review_remarks }}</p>
                      </div>
                      <div class="md:col-span-2" v-if="renewalData.endorsement_remarks">
                        <p class="text-xs text-gray-500">Endorsement Remarks</p>
                        <p class="font-medium text-gray-800">{{ renewalData.endorsement_remarks }}</p>
                      </div>
                    </div>
                  </div>

                  <!-- Payment Status Warning -->
                  <div v-if="!paymentInfo.isCompleted && !isProcessed"
                    class="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                    <div class="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-yellow-600 mr-2" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <div>
                        <p class="font-medium text-yellow-800">Payment Required</p>
                        <p class="text-sm text-yellow-700">Endorsement can only be processed after payment is completed.
                        </p>
                      </div>
                    </div>
                  </div>

                  <!-- Process Renewal Form -->
                  <div v-if="!isProcessed" class="bg-white rounded-xl border p-4 shadow-sm">
                    <h4 class="font-semibold text-gray-800 mb-4">Process EPC Renewal Application</h4>

                    <form @submit.prevent="handleSubmit" class="space-y-4">
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label for="review_status" class="block text-sm font-medium text-gray-700">
                            Review Status <span class="text-red-500">*</span>
                          </label>
                          <select id="review_status" v-model="formData.renewal_review_status"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            tabindex="0">
                            <option value="Pending">Pending</option>
                            <option value="Approved">Approved</option>
                            <option value="Regretted">Regretted</option>
                          </select>
                        </div>

                        <div>
                          <label for="endorsement_decision" class="block text-sm font-medium text-gray-700">
                            Endorsement Decision <span class="text-red-500">*</span>
                            <span v-if="!paymentInfo.isCompleted" class="text-xs text-yellow-600">(Payment
                              required)</span>
                          </label>
                          <select id="endorsement_decision" v-model="formData.renewal_endorsement_decision"
                            :disabled="!paymentInfo.isCompleted"
                            :class="{ 'bg-gray-100 cursor-not-allowed': !paymentInfo.isCompleted }"
                            :tabindex="paymentInfo.isCompleted ? 0 : -1"
                            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                            <option value="Pending">Pending</option>
                            <option value="Approved">Approved</option>
                            <option value="Regretted">Regretted</option>
                          </select>
                        </div>
                      </div>

                      <div v-if="formData.renewal_review_status === 'Approved'">
                        <label for="new_expiry_date" class="block text-sm font-medium text-gray-700">
                          New Expiry Date <span class="text-red-500">*</span>
                        </label>
                        <input type="date" id="new_expiry_date" v-model="formData.new_expiry_date"
                          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          tabindex="0" />
                      </div>

                      <div>
                        <label for="review_remarks" class="block text-sm font-medium text-gray-700">Review
                          Remarks</label>
                        <textarea id="review_remarks" v-model="formData.renewal_review_remarks" rows="2"
                          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          placeholder="Add review remarks..." tabindex="0"></textarea>
                      </div>

                      <div>
                        <label for="endorsement_remarks" class="block text-sm font-medium text-gray-700">
                          Endorsement Remarks
                          <span v-if="!paymentInfo.isCompleted" class="text-xs text-yellow-600">(Payment
                            required)</span>
                        </label>
                        <textarea id="endorsement_remarks" v-model="formData.endorsement_remarks" rows="2"
                          :disabled="!paymentInfo.isCompleted"
                          :class="{ 'bg-gray-100 cursor-not-allowed': !paymentInfo.isCompleted }"
                          :tabindex="paymentInfo.isCompleted ? 0 : -1"
                          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          placeholder="Add endorsement remarks..."></textarea>
                      </div>
                    </form>
                  </div>

                  <!-- Attachments -->
                  <div v-if="primaryQualification?.user_qualification_attachments?.length > 0"
                    class="bg-white rounded-xl border p-4 shadow-sm">
                    <h4 class="font-semibold text-gray-800 mb-4">Supporting Documents</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div v-for="attachment in primaryQualification.user_qualification_attachments"
                        :key="attachment.id" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div class="flex-1">
                          <p class="text-sm font-medium text-gray-900">{{ attachment.file_type_name || 'Document' }}</p>
                          <p class="text-xs text-gray-500">{{ formatDate(attachment.uploaded_at) }}</p>
                        </div>
                        <a :href="attachment.file" target="_blank"
                          class="ml-3 inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:ring-2 focus:ring-blue-500">
                          View
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 ml-1" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Action Buttons -->
              <div class="px-6 py-4 bg-gray-50 border-t flex justify-end space-x-3">
                <button type="button" @click="handleClose"
                  class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  tabindex="0">
                  Cancel
                </button>

                <button v-if="!isProcessed" type="button" ref="submitButton" @click="handleSubmit"
                  :disabled="submissionState.isSubmitting || isFormInvalid"
                  class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  tabindex="0">
                  <svg v-if="submissionState.isSubmitting" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                    </path>
                  </svg>
                  {{ submissionState.isSubmitting ? 'Processing...' : 'Submit Decision' }}
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
import { ref, watch, computed, onUnmounted, nextTick, onMounted, reactive } from 'vue';
import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from '@headlessui/vue';
import apiServices from '@/services/services';
import { useToast } from 'vue-toastification';
import dayjs from 'dayjs';

// Props with validation
const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  renewalData: {
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

// Services
const toast = useToast();

// Refs
const fallbackFocusElement = ref(null);
const closeButton = ref(null);
const submitButton = ref(null);

// State management
const isDestroyed = ref(false);
const originalBodyState = ref({
  overflow: '',
  activeElement: null
});

// Form state
const formData = ref({
  renewal_review_status: 'Pending',
  renewal_review_remarks: '',
  new_expiry_date: null,
  renewal_endorsement_decision: 'Pending',
  endorsement_remarks: ''
});

// CPD state
const cpdState = reactive({
  records: [],
  isLoading: false,
  error: null,
  totalPoints: 0,
  status: {
    text: 'Loading...',
    badgeClass: 'bg-gray-100 text-gray-800'
  }
});

// Submission state
const submissionState = reactive({
  isSubmitting: false,
  error: null
});

// Computed properties
const isProcessed = computed(() => {
  return props.renewalData?.renewal_status && props.renewalData.renewal_status !== 'Pending';
});

const paymentInfo = computed(() => {
  if (isDestroyed.value || !props.renewalData) {
    return {
      text: 'Payment Status Unknown',
      subtext: 'Payment information not available.',
      iconClass: 'text-gray-500',
      isCompleted: false
    };
  }

  const status = props.renewalData?.payment_status || props.renewalData?.original_renewal?.payment_status;

  // Normalize status to handle both uppercase and lowercase
  const normalizedStatus = status ? status.toLowerCase() : '';
  const isCompleted = normalizedStatus === 'completed';

  const statusMap = {
    'completed': {
      text: 'Payment Completed',
      subtext: 'Ready for endorsement decision.',
      iconClass: 'text-green-500'
    },
    'pending': {
      text: 'Payment Pending',
      subtext: 'Awaiting payment confirmation.',
      iconClass: 'text-yellow-500'
    },
    'processing payment': {
      text: 'Processing Payment',
      subtext: 'Payment is being processed.',
      iconClass: 'text-blue-500'
    },
    'failed': {
      text: 'Payment Failed',
      subtext: 'Payment needs to be retried.',
      iconClass: 'text-red-500'
    }
  };

  return {
    ...statusMap[normalizedStatus] || {
      text: 'Payment Status Unknown',
      subtext: 'Payment information not available.',
      iconClass: 'text-gray-500'
    },
    isCompleted
  };
});

const primaryQualification = computed(() => {
  if (!props.renewalData?.user_qualifications?.length) return null;

  const primaryQual = props.renewalData.user_qualifications.find(q => q?.is_primary_qualification === true);
  return primaryQual || props.renewalData.user_qualifications[0];
});

const isFormInvalid = computed(() => {
  return formData.value.renewal_review_status === 'Pending' &&
    formData.value.renewal_endorsement_decision === 'Pending';
});

// CPD computed properties
watch(() => cpdState.records, (records) => {
  if (isDestroyed.value) return;

  cpdState.totalPoints = records.reduce((total, record) => total + (record?.cpd_credit || 0), 0);

  if (cpdState.totalPoints >= 60) {
    cpdState.status = { text: 'Requirement Met', badgeClass: 'bg-green-100 text-green-800' };
  } else if (cpdState.totalPoints >= 30) {
    cpdState.status = { text: 'Partially Met', badgeClass: 'bg-yellow-100 text-yellow-800' };
  } else {
    cpdState.status = { text: 'Below Required', badgeClass: 'bg-red-100 text-red-800' };
  }
}, { immediate: true });

// Helper functions
const formatDate = (dateString) => {
  return dateString ? dayjs(dateString).format('MMM D, YYYY') : 'N/A';
};

const getStatusColor = (status) => {
  // Normalize status to handle both uppercase and lowercase
  const normalizedStatus = status ? status.toLowerCase() : '';

  const statusColors = {
    'approved': 'text-green-600',
    'completed': 'text-green-600',
    'regretted': 'text-red-600',
    'rejected': 'text-red-600',
    'failed': 'text-red-600',
    'pending': 'text-yellow-600',
    'processing payment': 'text-blue-600'
  };
  return statusColors[normalizedStatus] || 'text-gray-600';
};

const calculateDefaultExpiryDate = (currentExpiryDate) => {
  try {
    const baseDate = currentExpiryDate ? new Date(currentExpiryDate) : new Date();
    if (isNaN(baseDate.getTime())) throw new Error('Invalid date');

    baseDate.setFullYear(baseDate.getFullYear() + 3);
    return baseDate.toISOString().split('T')[0];
  } catch (error) {
    console.error('Error calculating default expiry date:', error);
    const fallbackDate = new Date();
    fallbackDate.setFullYear(fallbackDate.getFullYear() + 3);
    return fallbackDate.toISOString().split('T')[0];
  }
};

// Focus management
const focusPrimaryButton = () => {
  if (isDestroyed.value) return;

  nextTick(() => {
    const elementToFocus = closeButton.value || submitButton.value || fallbackFocusElement.value;
    if (elementToFocus?.focus) {
      try {
        elementToFocus.focus();
      } catch (error) {
        console.warn('Focus failed:', error);
      }
    }
  });
};

const setupModalState = () => {
  if (isDestroyed.value) return;

  // Store original state
  originalBodyState.value = {
    overflow: document.body.style.overflow || '',
    activeElement: document.activeElement
  };

  // Setup modal state
  document.body.style.overflow = 'hidden';
  document.body.classList.add('modal-open');

  // Focus management
  nextTick(() => focusPrimaryButton());
};

const restorePageState = () => {
  // Restore body state
  document.body.style.overflow = originalBodyState.value.overflow;
  document.body.style.paddingRight = '';
  document.body.classList.remove('modal-open');

  // Restore focus
  const { activeElement } = originalBodyState.value;
  if (activeElement?.focus) {
    try {
      activeElement.focus();
    } catch (error) {
      console.warn('Focus restoration failed:', error);
    }
  }
};

// Data fetching
const fetchCpdData = async (cid) => {
  if (!cid || isDestroyed.value) return;

  cpdState.isLoading = true;
  cpdState.error = null;

  try {
    const response = await apiServices.getEpcCpdRecordsByCid(cid);
    if (!isDestroyed.value) {
      cpdState.records = response.data?.filter(record => record.review_status === 'Approved') || [];
    }
  } catch (error) {
    console.error('Error fetching CPD records:', error);
    if (!isDestroyed.value) {
      cpdState.error = error;
      cpdState.records = [];
    }
  } finally {
    if (!isDestroyed.value) {
      cpdState.isLoading = false;
    }
  }
};

const retryFetchCpd = () => {
  if (props.renewalData?.cid_no) {
    fetchCpdData(props.renewalData.cid_no);
  }
};

// Event handlers
const handleClose = () => {
  if (submissionState.isSubmitting || isDestroyed.value) return;
  emit('close');
};

const handleAfterLeave = () => {
  // This runs after the modal transition completes
  restorePageState();
};

const handleSubmit = async () => {
  if (!props.renewalData?.renewal_id || isDestroyed.value) {
    toast.error('Cannot process: Renewal ID is missing.');
    return;
  }

  // Validation
  if (formData.value.renewal_endorsement_decision !== 'Pending' && !paymentInfo.value.isCompleted) {
    toast.error('Cannot endorse renewal: Payment must be completed first.');
    return;
  }

  if (formData.value.renewal_review_status === 'Approved' && !formData.value.new_expiry_date) {
    toast.error('New expiry date is required when approving the renewal review.');
    return;
  }

  if (isFormInvalid.value) {
    toast.warning('Please make a decision on the renewal application.');
    return;
  }

  submissionState.isSubmitting = true;
  submissionState.error = null;

  try {
    // Prepare renewal update data
    const renewalUpdateData = {
      renewal_review_status: formData.value.renewal_review_status,
      renewal_review_remarks: formData.value.renewal_review_remarks || '',
      renewal_endorsement_decision: formData.value.renewal_endorsement_decision,
      endorsement_remarks: formData.value.endorsement_remarks || ''
    };

    if (formData.value.renewal_review_status === 'Approved' && formData.value.new_expiry_date) {
      renewalUpdateData.new_expiry_date = formData.value.new_expiry_date;
    }

    // Update renewal record
    await apiServices.patchEpcRenewal(props.renewalData.renewal_id, renewalUpdateData);

    // Update qualification if approved
    if (formData.value.renewal_endorsement_decision === 'Approved' && formData.value.new_expiry_date) {
      const primaryQual = primaryQualification.value;

      if (primaryQual?.id) {
        try {
          const qualificationData = new FormData();
          qualificationData.append('expiry_date', formData.value.new_expiry_date);
          qualificationData.append('is_active', 'true');

          await apiServices.patchEpcNewQualification(primaryQual.id, qualificationData);
          toast.success('EPC renewal approved and qualification expiry date updated successfully!');
        } catch (qualError) {
          console.error('Error updating qualification:', qualError);
          toast.warning('Renewal processed, but failed to update qualification expiry date. Please update manually.');
        }
      }
    } else {
      toast.success('EPC renewal process updated successfully!');
    }

    // Auto-close modal after successful update
    emit('close');

    // Emit update to refresh parent data
    emit('update');

  } catch (error) {
    console.error('Error updating renewal:', error);
    submissionState.error = error;

    const errorMessage = error.response?.data
      ? (typeof error.response.data === 'string' ? error.response.data : JSON.stringify(error.response.data))
      : 'An unknown error occurred.';

    toast.error(`Update failed: ${errorMessage}`);
  } finally {
    submissionState.isSubmitting = false;
  }
};

// Watchers
const unwatchRenewalData = watch(() => props.renewalData, (newData) => {
  if (!newData || isDestroyed.value) return;

  // Update form data
  formData.value = {
    renewal_review_status: newData.renewal_review_status || 'Pending',
    renewal_review_remarks: newData.renewal_review_remarks || '',
    new_expiry_date: newData.new_expiry_date || calculateDefaultExpiryDate(newData.original_expiry_date),
    renewal_endorsement_decision: newData.renewal_status || 'Pending',
    endorsement_remarks: newData.endorsement_remarks || ''
  };

  // Fetch CPD data
  if (newData.cid_no) {
    fetchCpdData(newData.cid_no);
  }
}, { immediate: true });

const unwatchIsOpen = watch(() => props.isOpen, (isOpen) => {
  if (isOpen && !isDestroyed.value) {
    nextTick(() => setupModalState());
  }
});

// Lifecycle
onMounted(() => {
  if (props.isOpen) {
    nextTick(() => setupModalState());
  }
});

onUnmounted(() => {
  isDestroyed.value = true;

  // Clean up watchers
  unwatchRenewalData?.();
  unwatchIsOpen?.();

  // Restore page state
  restorePageState();

  // Clear reactive state
  Object.assign(cpdState, {
    records: [],
    isLoading: false,
    error: null,
    totalPoints: 0,
    status: { text: 'Loading...', badgeClass: 'bg-gray-100 text-gray-800' }
  });

  Object.assign(submissionState, {
    isSubmitting: false,
    error: null
  });
});
</script>
