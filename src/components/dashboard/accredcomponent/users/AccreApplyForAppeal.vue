<template>
  <div v-if="isVisible" class="fixed inset-0 bg-black bg-opacity-60 z-40 flex justify-center items-center p-4" @click.self="closeModal">
    <div class="bg-gray-50 rounded-2xl shadow-2xl overflow-hidden w-full max-w-4xl max-h-[95vh] flex flex-col">
      <!-- Header -->
      <div class="bg-white p-6 flex justify-between items-center border-b border-gray-200">
        <div>
            <h2 class="text-2xl font-bold text-gray-800">Accreditation Appeal</h2>
            <p v-if="appeal.application" class="text-gray-600 text-sm mt-1">
                Filing an appeal for Application UID: <strong class="text-indigo-700 font-semibold">{{ appealedApplicationUID }}</strong>
            </p>
        </div>
        <button @click="closeModal" class="p-2 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>

      <!-- Main Content -->
      <div class="overflow-y-auto flex-grow">
          <div v-if="loadingError" class="p-8 text-center">
              <p class="text-lg text-red-600 font-semibold">Cannot Proceed with Appeal</p>
              <p class="text-gray-700 mt-2">{{ loadingError }}</p>
              <button @click="closeModal" class="mt-6 inline-flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 transition-colors">Close</button>
          </div>

          <form v-else-if="appeal.application" @submit.prevent="handleSubmit" class="p-6 space-y-8">
              <!-- Section 1: Appellant Details -->
              <fieldset class="p-6 bg-white rounded-xl shadow-sm border">
                <legend class="text-lg font-semibold text-gray-800 px-2">1. Appellant Details</legend>
                <p class="text-sm text-gray-500 mb-6">These details are auto-filled from your institution profile and cannot be edited here.</p>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <div v-for="(value, key) in autoFilledDetails" :key="key">
                    <label class="block text-sm font-medium text-gray-500">{{ key }}</label>
                    <input type="text" :value="value" readonly class="mt-1 block w-full rounded-lg border-gray-200 p-2.5 bg-gray-100 cursor-not-allowed text-gray-700" />
                  </div>
                </div>
              </fieldset>

              <!-- Section 2: Appeal Details -->
              <fieldset class="p-6 bg-white rounded-xl shadow-sm border">
                <legend class="text-lg font-semibold text-gray-800 px-2">2. Appeal Details</legend>
                <p class="text-sm text-gray-500 mb-6">Provide the grounds for your appeal and any supporting evidence.</p>
                <div class="space-y-6">
                  <div>
                    <label for="appeal-reason" class="block text-sm font-medium text-gray-700">Reason for Appeal/Type <span class="text-red-500">*</span></label>
                    <select id="appeal-reason" v-model="appeal.reason_for_appeal_master" class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm p-2.5 focus:ring-indigo-500 focus:border-indigo-500" required>
                      <option value="" disabled>Select a reason</option>
                      <option v-for="reason in appealReasonOptions" :key="reason.id" :value="reason.id">{{ reason.appeal_name }}</option>
                    </select>
                  </div>

                  <div v-if="isOtherReasonSelected">
                    <label for="other-reason" class="block text-sm font-medium text-gray-700">If "Others", please specify <span class="text-red-500">*</span></label>
                    <input id="other-reason" type="text" v-model="appeal.reason_if_others_specify_appeal" class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm p-2.5 focus:ring-indigo-500 focus:border-indigo-500" :required="isOtherReasonSelected" />
                  </div>

                  <div>
                    <label for="detailed-reason" class="block text-sm font-medium text-gray-700">Detailed Justification of Appeal <span class="text-red-500">*</span></label>
                    <textarea id="detailed-reason" v-model="appeal.detailed_reason_of_appeal_text" rows="4" class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm p-2.5 focus:ring-indigo-500 focus:border-indigo-500" required></textarea>
                  </div>

                  <div class="border-t pt-6">
                    <label class="inline-flex items-center">
                      <input type="checkbox" v-model="appeal.attempted_to_resolve_with_heqc_appeal" class="h-4 w-4 rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500" />
                      <span class="ml-3 text-sm text-gray-700">I have attempted to resolve this issue with HEQC prior to this appeal.</span>
                    </label>
                  </div>

                  <div v-if="appeal.attempted_to_resolve_with_heqc_appeal" class="grid md:grid-cols-2 gap-6 p-4 bg-gray-50 rounded-lg border">
                    <div>
                      <label for="heqc-outcome" class="block text-sm font-medium text-gray-700">Outcome of HEQC Meeting <span class="text-red-500">*</span></label>
                      <input id="heqc-outcome" type="text" v-model="appeal.outcome_if_attempted_heqc_appeal" class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm p-2.5 focus:ring-indigo-500 focus:border-indigo-500" :required="appeal.attempted_to_resolve_with_heqc_appeal" />
                    </div>
                    <div>
                      <label for="heqc-date" class="block text-sm font-medium text-gray-700">Date of Meeting <span class="text-red-500">*</span></label>
                      <input id="heqc-date" type="date" v-model="appeal.date_of_heqc_meeting_appeal" class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm p-2.5 focus:ring-indigo-500 focus:border-indigo-500" :required="appeal.attempted_to_resolve_with_heqc_appeal" />
                    </div>
                  </div>

                  <div>
                    <label for="supporting-docs" class="block text-sm font-medium text-gray-700">Supporting Documents (Optional, multiple files allowed)</label>
                    <input id="supporting-docs" type="file" multiple @change="onFileChange" ref="fileInputRef" class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
                  </div>

                  <div>
                    <label for="remarks" class="block text-sm font-medium text-gray-700">Additional Remarks (Optional)</label>
                    <textarea id="remarks" v-model="appeal.remarks" rows="3" class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm p-2.5 focus:ring-indigo-500 focus:border-indigo-500" placeholder="Add any other relevant information here"></textarea>
                  </div>
                </div>
              </fieldset>

              <!-- Section 3: Declaration -->
              <fieldset class="p-6 bg-white rounded-xl shadow-sm border">
                <legend class="text-lg font-semibold text-gray-800 px-2">3. Declaration</legend>
                <div class="mt-4">
                  <label class="flex items-start">
                    <input type="checkbox" v-model="appeal.declaration_appeal_truthfulness" class="flex-shrink-0 h-4 w-4 mt-1 rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500" required />
                    <span class="ml-3 text-sm text-gray-700">I hereby declare that the information provided in this appeal is true, complete, and accurate to the best of my knowledge. I understand that any false statement may lead to the rejection of this appeal.</span>
                  </label>
                </div>
              </fieldset>
          </form>

          <div v-else class="p-8 text-center flex justify-center items-center h-full">
              <p class="text-lg text-gray-600">Identifying eligible application...</p>
          </div>
      </div>

      <!-- Footer with Buttons -->
      <div v-if="appeal.application && !loadingError" class="flex items-center justify-end space-x-4 p-6 border-t bg-gray-100">
          <button type="button" @click="saveDraft" :disabled="isFormEmpty || isSubmitting" class="inline-flex items-center px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 transition-colors">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path></svg>
            Save as Draft
          </button>
          <button type="button" @click="closeModal" class="inline-flex items-center px-6 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button type="button" @click="handleSubmit" :disabled="!isFormFullyValid || isSubmitting" class="inline-flex items-center px-6 py-3 border border-transparent rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:bg-indigo-400 transition-colors">
            <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <svg v-else class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
            {{ isSubmitting ? 'Processing...' : 'Proceed to Payment & Submit' }}
          </button>
      </div>
    </div>

    <!-- PAYMENT INTEGRATION: Add Payment Modal Component -->
    <PaymentModal
      ref="paymentModal"
      :amount="1000"
      @payment-completed="onPaymentCompleted"
      @close="onPaymentModalClose"
    />
  </div>
</template>

<script setup>
import { ref, reactive, watch, computed, onMounted } from 'vue';
import apiService from '@/services/services';
import { useToast } from 'vue-toastification';
import PaymentModal from '@/components/common/PaymentModal.vue';
import { useAuthStore } from '@/stores/authStore';

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(['close', 'appeal-submitted']);

const toast = useToast();
const authStore = useAuthStore();
const DRAFT_KEY_PREFIX = 'appeal_draft_for_app_';
const loadingError = ref(null);
const appealedApplicationUID = ref('');
const isSubmitting = ref(false);
const paymentModal = ref(null);
const fileInputRef = ref(null);
const appealReasonOptions = ref([]);
const submissionInitiated = ref(false);

const autoFilledDetails = reactive({
    'Name of Institution': 'N/A',
    'Address/Location': 'N/A',
    'Dzongkhag/Thromde': 'N/A',
    'Contact': 'N/A',
    'Email': 'N/A',
});

const appeal = reactive({
    application: null,
    reason_for_appeal_master: '',
    reason_if_others_specify_appeal: '',
    detailed_reason_of_appeal_text: '',
    attempted_to_resolve_with_heqc_appeal: false,
    outcome_if_attempted_heqc_appeal: '',
    date_of_heqc_meeting_appeal: null,
    remarks: '',
    supporting_documents: [],
    declaration_appeal_truthfulness: false,
    is_appeal_fee_paid: false,
    appeal_payment_id_gateway_ref: null,
    status_appeal: 'draft',
});

const draftKey = computed(() => appeal.application ? `${DRAFT_KEY_PREFIX}${appeal.application}` : null);

const isOtherReasonSelected = computed(() => {
  const selectedReasonObject = appealReasonOptions.value.find(r => r.id === appeal.reason_for_appeal_master);
  return selectedReasonObject ? selectedReasonObject.is_other_option : false;
});

const isFormFullyValid = computed(() => {
  const detailsValid = appeal.application && appeal.reason_for_appeal_master && appeal.detailed_reason_of_appeal_text.trim();
  const otherValid = !isOtherReasonSelected.value || (isOtherReasonSelected.value && appeal.reason_if_others_specify_appeal.trim());
  const heqcValid = !appeal.attempted_to_resolve_with_heqc_appeal || (appeal.outcome_if_attempted_heqc_appeal.trim() && appeal.date_of_heqc_meeting_appeal);
  const declarationValid = appeal.declaration_appeal_truthfulness;
  return detailsValid && otherValid && heqcValid && declarationValid;
});

const isFormEmpty = computed(() => {
    return !appeal.reason_for_appeal_master &&
           !appeal.detailed_reason_of_appeal_text.trim() &&
           !appeal.remarks.trim() &&
           appeal.supporting_documents.length === 0;
});

const closeModal = () => {
  emit('close');
};

const resetForm = () => {
    Object.assign(appeal, {
        application: null, reason_for_appeal_master: '', reason_if_others_specify_appeal: '',
        detailed_reason_of_appeal_text: '', attempted_to_resolve_with_heqc_appeal: false,
        outcome_if_attempted_heqc_appeal: '', date_of_heqc_meeting_appeal: null, remarks: '',
        supporting_documents: [], declaration_appeal_truthfulness: false, is_appeal_fee_paid: false,
        appeal_payment_id_gateway_ref: null, status_appeal: 'draft',
    });
    Object.assign(autoFilledDetails, {
        'Name of Institution': 'N/A', 'Address/Location': 'N/A', 'Dzongkhag/Thromde': 'N/A',
        'Contact': 'N/A', 'Email': 'N/A',
    });
    loadingError.value = null;
    appealedApplicationUID.value = '';
    if (fileInputRef.value) fileInputRef.value.value = '';
};

const initializeForm = async () => {
  resetForm();
  try {
    const finalDecisionStatuses = 'rejected_not_accredited,approved_accredited,approved_conditional';
    const appResponse = await apiService.getAccreditationApplications({
      ordering: '-updated_at',
      status__in: finalDecisionStatuses,
    });
    const appealableAppsWithGrade = (appResponse.data.results || []).filter(app => app.final_grade_awarded_details);
    if (appealableAppsWithGrade.length === 0) {
        loadingError.value = "You do not have any applications with a final decision and an awarded grade that are eligible for appeal.";
        return;
    }
    const targetApp = appealableAppsWithGrade[0];
    if (targetApp.appeal_record) {
      loadingError.value = `An appeal has already been filed for application UID ${targetApp.application_uid}. You cannot file another.`;
      return;
    }
    appeal.application = targetApp.id;
    appealedApplicationUID.value = targetApp.application_uid;
    const profile = targetApp.institute_profile_details;
    if (profile) {
      autoFilledDetails['Name of Institution'] = profile.name || 'N/A';
      autoFilledDetails['Address/Location'] = profile.address || 'N/A';
      autoFilledDetails['Dzongkhag/Thromde'] = profile.dzongkhag || 'N/A';
      autoFilledDetails['Contact'] = profile.telephone || 'N/A';
      autoFilledDetails['Email'] = profile.email || 'N/A';
    }
    const reasonsResponse = await apiService.getMastersAppealReasons();
    appealReasonOptions.value = reasonsResponse.data.results || [];
    loadDraft();
  } catch (error) {
    loadingError.value = 'An error occurred while preparing the appeal form. Please try again later.';
    toast.error(loadingError.value);
  }
};

const onFileChange = (event) => {
    const files = Array.from(event.target.files);
    const maxSize = 5 * 1024 * 1024; // 5MB
    const oversizedFiles = files.filter(file => file.size > maxSize);

    if (oversizedFiles.length > 0) {
        oversizedFiles.forEach(file => {
            toast.error(`File "${file.name}" is too large. Maximum size is 5MB.`);
        });
        // Reset file input and clear selection
        event.target.value = '';
        appeal.supporting_documents = [];
        return;
    }
    
    appeal.supporting_documents = files;
};

const saveDraft = () => {
    if (!draftKey.value) return;
    try {
        const draftData = { ...appeal };
        delete draftData.supporting_documents;
        localStorage.setItem(draftKey.value, JSON.stringify(draftData));
        toast.success("Draft saved successfully!");
    } catch (e) {
        toast.error("Could not save draft.");
    }
};

const loadDraft = () => {
    if (!draftKey.value) return;
    const savedDraft = localStorage.getItem(draftKey.value);
    if (savedDraft) {
        try {
            const parsedDraft = JSON.parse(savedDraft);
            const { application, supporting_documents, ...restOfDraft } = parsedDraft;
            Object.assign(appeal, restOfDraft);
            toast.info("A saved draft has been loaded.");
        } catch (e) {
            localStorage.removeItem(draftKey.value);
        }
    }
};

const handleSubmit = () => {
  if (!isFormFullyValid.value) {
    toast.warning('Please fill out all required fields before proceeding.');
    return;
  }
  isSubmitting.value = true;
  paymentModal.value.openModal();
};

const onPaymentCompleted = (paymentData) => {
  if (paymentModal.value) {
    paymentModal.value.closeModal();
  }
  submissionInitiated.value = true;
  appeal.is_appeal_fee_paid = false;
  appeal.appeal_payment_id_gateway_ref = paymentData.paymentHash;
  handleSubmitActual();
};

const onPaymentModalClose = () => {
    if (!submissionInitiated.value) {
        toast.info('Payment was cancelled. Your appeal has not been submitted.');
        isSubmitting.value = false;
    }
};

const handleSubmitActual = async () => {
  let redirectUrl = null;
  const user = authStore.user;

  if (!user || !user.cid || !user.email || !user.contact_number || !user.id) {
    toast.error("User details are missing. Cannot proceed with payment.");
    isSubmitting.value = false;
    return;
  }

  try {
    // Step 1: Save the appeal data to our backend
    const appealFormData = new FormData();
    Object.keys(appeal).forEach(key => {
        const value = appeal[key];
        if (key === 'supporting_documents') return;
        if (typeof value === 'boolean') {
            appealFormData.append(key, value ? 'true' : 'false');
        } else if (value !== null && value !== undefined) {
            appealFormData.append(key, value);
        }
    });
    appeal.supporting_documents.forEach((file) => {
        appealFormData.append('supporting_documents', file, file.name);
    });

    appealFormData.set('status_appeal', 'pending_payment');

    await apiService.createApplicationAppeal(appealFormData);

    // Step 2: Initiate payment with the gateway
    const feeAmount = 1000.0;
    const paymentInitiationFormData = new FormData();
    paymentInitiationFormData.append('refNo', appeal.appeal_payment_id_gateway_ref);
    paymentInitiationFormData.append('serviceCode', '100195'); // Correct service code for appeals
    paymentInitiationFormData.append('taxPayerName', autoFilledDetails['Name of Institution']);
    paymentInitiationFormData.append('taxPayerNo', user.cid);
    paymentInitiationFormData.append('taxPayerDocumentNo', user.cid);
    paymentInitiationFormData.append('totalPayableAmount', feeAmount.toFixed(2));
    paymentInitiationFormData.append('payableAmount', feeAmount.toFixed(2));
    paymentInitiationFormData.append('description', 'Accreditation Institutions Appeal Fee');
    paymentInitiationFormData.append('mobileNo', user.contact_number);
    paymentInitiationFormData.append('payerEmail', user.email);
    paymentInitiationFormData.append('user', user.id);
    paymentInitiationFormData.append('application_no', appeal.appeal_payment_id_gateway_ref);
    paymentInitiationFormData.append('app_type', 'accreditation_institutions_appeal');

    try {
        const paymentResponse = await apiService.makePayment(paymentInitiationFormData);
        if (paymentResponse.data?.content?.redirectUrl) {
            redirectUrl = paymentResponse.data.content.redirectUrl;
        } else {
            throw new Error('Redirect URL not received from payment gateway.');
        }
    } catch (paymentError) {
        console.error('Error making payment:', paymentError.response?.data || paymentError);
        const errorDetail = paymentError.response?.data ? JSON.stringify(paymentError.response.data) : paymentError.message;
        toast.error('Appeal saved, but payment request failed: ' + errorDetail + '. You can try paying again later.');
        return;
    }

    // Step 3: Success! Open payment page and clean up
    toast.success(
      'Appeal submitted successfully, redirecting for payment. A link has also been sent to your email.',
      { timeout: 8000 }
    );
    if (redirectUrl) {
        window.open(redirectUrl, '_blank');
    }

    if (draftKey.value) {
        localStorage.removeItem(draftKey.value);
    }
    emit('appeal-submitted');
    closeModal();

  } catch (error) {
    const errorMsg = error.response?.data?.detail || 'An unexpected error occurred while submitting the appeal.';
    toast.error(errorMsg);
    appeal.status_appeal = 'draft';
    appeal.is_appeal_fee_paid = false;
  } finally {
    isSubmitting.value = false;
    submissionInitiated.value = false;
  }
};


watch(() => props.isVisible, (newValue) => {
  if (newValue) {
    initializeForm();
  }
});

onMounted(() => {
  if(props.isVisible) {
    initializeForm();
  }
});
</script>
