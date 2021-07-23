<template>
  <div v-if="isVisible" class="fixed inset-0 bg-black bg-opacity-60 z-40 flex justify-center items-center p-4" @click.self="closeModal">
    <div class="bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-4xl max-h-[95vh] flex flex-col">
      <div class="bg-gradient-to-r from-indigo-100 via-blue-50 to-indigo-100 p-6 flex justify-between items-center border-b">
        <div>
            <h2 class="text-2xl font-bold text-gray-900">Accreditation Appeal</h2>
            <p v-if="appeal.application" class="text-gray-600 text-sm mt-1">
                Filing an appeal for Application UID: <strong class="text-indigo-700">{{ appealedApplicationUID }}</strong>
            </p>
        </div>
        <button @click="closeModal" class="text-gray-500 hover:text-gray-800 text-3xl leading-none">×</button>
      </div>

      <div class="overflow-y-auto flex-grow">
          <div v-if="loadingError" class="p-8 text-center">
              <p class="text-lg text-red-600 font-semibold">Cannot Proceed with Appeal</p>
              <p class="text-gray-700 mt-2">{{ loadingError }}</p>
              <button @click="closeModal" class="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg">Close</button>
          </div>

          <form v-else-if="appeal.application" @submit.prevent="handleSubmit" class="p-6">
              <div class="mb-6">
                <h3 class="text-lg font-semibold text-gray-900 px-2">1. Appellant Details</h3>
                <p class="mt-1 text-sm text-gray-500 px-2">These details are auto-filled from your institution profile.</p>
                <div class="mt-4 p-6 grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 rounded-lg">
                  <div v-for="(value, key) in autoFilledDetails" :key="key">
                    <label class="block text-sm font-medium text-gray-700">{{ key }}</label>
                    <input type="text" :value="value" readonly class="mt-1 block w-full rounded-lg border-gray-300 p-2.5 bg-gray-100 cursor-not-allowed" />
                  </div>
                </div>
              </div>

              <div class="mb-6">
                <h3 class="text-lg font-semibold text-gray-900 px-2">2. Appeal Details</h3>
                <div class="p-2 space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Reason for Appeal/Type</label>
                    <select v-model="appeal.reason_for_appeal_master" class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm" required>
                      <option value="" disabled>Select Reason</option>
                      <option v-for="reason in appealReasonOptions" :key="reason.id" :value="reason.id">{{ reason.appeal_name }}</option>
                    </select>
                  </div>

                  <div v-if="isOtherReasonSelected">
                    <label class="block text-sm font-medium text-gray-700">If Others (specify)</label>
                    <input type="text" v-model="appeal.reason_if_others_specify_appeal" class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm" :required="isOtherReasonSelected" />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700">Reason of Appeal</label>
                    <textarea v-model="appeal.detailed_reason_of_appeal_text" rows="3" class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm" required></textarea>
                  </div>

                  <div>
                    <label class="inline-flex items-center">
                      <input type="checkbox" v-model="appeal.attempted_to_resolve_with_heqc_appeal" class="rounded border-gray-300 text-blue-600 shadow-sm" />
                      <span class="ml-2 text-gray-700">Attempted to Resolve with HEQC</span>
                    </label>
                  </div>

                  <div v-if="appeal.attempted_to_resolve_with_heqc_appeal" class="grid md:grid-cols-2 gap-6">
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Outcome</label>
                      <input type="text" v-model="appeal.outcome_if_attempted_heqc_appeal" class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm" :required="appeal.attempted_to_resolve_with_heqc_appeal" />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Date of Meeting</label>
                      <input type="date" v-model="appeal.date_of_heqc_meeting_appeal" class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm" :required="appeal.attempted_to_resolve_with_heqc_appeal" />
                    </div>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700">Supporting Document (multiple files allowed)</label>
                    <input type="file" multiple @change="onFileChange" ref="fileInputRef" class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700">Remarks (if any)</label>
                    <textarea v-model="appeal.remarks" rows="3" class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm" placeholder="Add any additional remarks here"></textarea>
                  </div>
                </div>
              </div>

              <div class="mb-6 px-2">
                <label class="inline-flex items-center">
                  <input type="checkbox" v-model="appeal.declaration_appeal_truthfulness" class="rounded border-gray-300 text-blue-600 shadow-sm" required />
                  <span class="ml-2 text-gray-700">I hereby declare that the information provided is true and accurate.</span>
                </label>
              </div>
          </form>

          <div v-else class="p-8 text-center flex justify-center items-center h-full">
              <p class="text-lg text-gray-600">Identifying eligible application...</p>
          </div>
      </div>

      <div v-if="appeal.application && !loadingError" class="flex items-center justify-end space-x-4 p-6 border-t bg-gray-50">
          <button type="button" @click="saveDraft" :disabled="isFormEmpty" class="px-6 py-3 border rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">Save as Draft</button>
          <button type="button" @click="closeModal" class="px-6 py-3 border rounded-lg text-gray-700 bg-white hover:bg-gray-50">Cancel</button>
          <button type="button" @click="handleSubmit" :disabled="!isFormFullyValid || isSubmitting" class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
            <span v-if="isSubmitting">Processing...</span>
            <span v-else>Proceed to Payment & Submit</span>
          </button>
      </div>
    </div>

    <PaymentModal
      ref="paymentModal"
      :amount="1000"
      :close-on-success="true"
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

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(['close', 'appeal-submitted']);

const toast = useToast();
const DRAFT_KEY_PREFIX = 'appeal_draft_for_app_';
const loadingError = ref(null);
const appealedApplicationUID = ref('');
const isSubmitting = ref(false);
const paymentModal = ref(null);
const fileInputRef = ref(null);
const appealReasonOptions = ref([]);

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
    const appealableApps = appResponse.data.results || [];
    if (appealableApps.length === 0) {
        loadingError.value = "You do not have any applications with a final decision that are eligible for appeal.";
        return;
    }
    const targetApp = appealableApps[0];
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
    appeal.supporting_documents = Array.from(event.target.files);
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
  paymentModal.value.openModal();
};

const onPaymentCompleted = (paymentData) => {
  isSubmitting.value = true;
  appeal.is_appeal_fee_paid = paymentData.paymentDone;
  appeal.appeal_payment_id_gateway_ref = paymentData.paymentHash;
  appeal.status_appeal = 'submitted';
  submitAppealData();
};

const onPaymentModalClose = () => {
    toast.info('Payment was cancelled. Your appeal has not been submitted.');
    isSubmitting.value = false;
};

const submitAppealData = async () => {
  const formData = new FormData();
  Object.keys(appeal).forEach(key => {
    const value = appeal[key];
    if (key === 'supporting_documents') return;
    if (typeof value === 'boolean') {
      formData.append(key, value ? 'true' : 'false');
    } else if (value !== null && value !== undefined) {
      formData.append(key, value);
    }
  });
  appeal.supporting_documents.forEach((file) => {
    formData.append('supporting_documents', file, file.name);
  });
  try {
    toast.info("Submitting your appeal...");
    await apiService.createApplicationAppeal(formData);
    if (draftKey.value) {
        localStorage.removeItem(draftKey.value);
    }
    toast.success('Your appeal has been submitted successfully!');
    emit('appeal-submitted');
    closeModal();
  } catch (error) {
    const errorMsg = error.response?.data?.detail || 'An unexpected error occurred while submitting the appeal.';
    toast.error(errorMsg);
    appeal.status_appeal = 'draft';
    appeal.is_appeal_fee_paid = false;
  } finally {
    isSubmitting.value = false;
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