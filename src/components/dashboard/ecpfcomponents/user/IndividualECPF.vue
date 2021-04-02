<template>
  <div class="container mx-auto p-4 sm:p-6 lg:p-8 bg-gray-50">
    <h1 class="text-2xl sm:text-3xl font-bold mb-6 text-gray-800 border-b pb-4">
      New ECPF Establishment Application
    </h1>

    <!-- Loading Indicator -->
    <div v-if="isLoading" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
      <p class="ml-4 text-white text-xl">Processing...</p>
    </div>

    <!-- Error Message -->
    <div v-if="errorMessage" class="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded break-words">
      <p><strong>Error:</strong> {{ errorMessage }}</p>
    </div>

    <!-- Success Message -->
    <div v-if="successMessage" class="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
      <p>{{ successMessage }}</p>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-8">

      <!-- Applicant Details Section -->
      <!-- It will now receive the populated data reactively -->
      <ApplicantDetailsSection v-model:applicant-data="formData.applicant" />

      <!-- Contact & Address Section -->
      <!-- Use v-model to enable two-way binding -->
      <ContactAddressSection v-model:contact-data="formData.contact" v-model:present-address="formData.presentAddress"
        v-model:permanent-address="formData.permanentAddress" :dzongkhag-options="dzongkhagOptions" />

      <!-- Education Section -->
      <!-- Use v-model for two-way binding -->
      <EducationSection v-model:education-data="formData.education" />

      <!-- Proposal Details Section -->
      <ProposalDetailsSection v-model:proposal-data="formData.proposal" :dzongkhag-options="dzongkhagOptions"
        :firm-type-options="masterData.firmTypes" />

      <!-- Purpose Section -->
      <PurposeSection v-model:purpose-data="formData.purpose" />

      <!-- Linkages Section -->
      <LinkagesSection v-model:linkages="formData.linkages" />

      <!-- Financial Capacity Section -->
      <FinancialCapacitySection v-model:financial-data="formData.financial"
        :financial-statement-file-name="formData.financialStatementFile?.name"
        :budget-plan-file-name="formData.budgetPlanFile?.name" @update:file="handleChildFileUpload" />

      <!-- SWOT Analysis Section -->
      <SwotAnalysisSection v-model:swot-data="formData.swot" />

      <!-- Fee & Charges Section -->
      <FeesChargesSection v-model:fees="formData.fees" :total-fee-amount="totalFeeAmount" />

      <!-- Guarantor Details Section -->
      <GuarantorDetailsSection v-model:guarantor-data="formData.guarantor"
        :cid-copy-file-name="formData.guarantorCidCopyFile?.name" @update:file="handleChildFileUpload" />

      <!-- Supporting Documents Section -->
      <SupportingDocumentsSection :cv-file-name="formData.cvFile?.name" @update:file="handleChildFileUpload" />

      <!-- Declaration -->
      <section class="p-6 bg-white rounded-lg shadow">
        <h2 class="text-xl font-semibold mb-4 text-blue-700">Declaration</h2>
        <div class="flex items-start">
          <div class="flex items-center h-5">
            <input id="declaration" name="declaration" type="checkbox" v-model="formData.declarationAgreed" required
              class="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded">
          </div>
          <div class="ml-3 text-sm">
            <label for="declaration" class="font-medium text-gray-700">I hereby declare that the information provided
              above is true and correct to the best of my knowledge and I agree to the terms and conditions. <span
                class="text-red-500">*</span></label>
            <p class="text-gray-500">Agreeing to this declaration is mandatory for submission.</p>
          </div>
        </div>
      </section>

      <!-- Action Buttons -->
      <div
        class="pt-6 border-t border-gray-200 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
        <button type="button" @click="handleSaveDraft" :disabled="isLoading"
          class="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
          {{ isLoading ? 'Saving...' : 'Save as Draft' }}
        </button>
        <button type="submit" :disabled="!formData.declarationAgreed || isLoading" :class="[
      'inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white',
      formData.declarationAgreed && !isLoading
        ? 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer'
        : 'bg-blue-300 cursor-not-allowed',
      'disabled:opacity-50 disabled:cursor-not-allowed'
    ]">
          {{ isLoading ? 'Submitting...' : 'Submit Application' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification'; // <-- 1. Import useToast
import apiServices from '@/services/services';
import { useAuthStore } from '@/stores/authStore';

// Import Child Components
import ApplicantDetailsSection from './ApplicationChilds/ApplicantDetailsSection.vue';
import ContactAddressSection from './ApplicationChilds/ContactAddressSection.vue';
import EducationSection from './ApplicationChilds/EducationSection.vue';
import ProposalDetailsSection from './ApplicationChilds/ProposalDetailsSection.vue';
import PurposeSection from './ApplicationChilds/PurposeSection.vue';
import LinkagesSection from './ApplicationChilds/LinkagesSection.vue';
import FinancialCapacitySection from './ApplicationChilds/FinancialCapacitySection.vue';
import SwotAnalysisSection from './ApplicationChilds/SwotAnalysisSection.vue';
import FeesChargesSection from './ApplicationChilds/FeesChargesSection.vue';
import GuarantorDetailsSection from './ApplicationChilds/GuarantorDetailsSection.vue';
import SupportingDocumentsSection from './ApplicationChilds/SupportingDocumentsSection.vue';

// --- Component State ---
const isLoading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');
const draftId = ref(null);

// --- Instantiate Auth Store ---
const router = useRouter();
const toast = useToast(); // <-- 2. Get toast instance
const authStore = useAuthStore();

// --- Static Master Data ---
const dzongkhagOptions = ref([
    { id: '1', name: 'Bumthang' }, { id: '2', name: 'Chhukha' },
    { id: '3', name: 'Dagana' }, { id: '4', name: 'Gasa' },
    { id: '5', name: 'Haa' }, { id: '6', name: 'Lhuentse' },
    { id: '7', name: 'Mongar' }, { id: '8', name: 'Paro' },
    { id: '9', name: 'Pema Gatshel' }, { id: '10', name: 'Punakha' },
    { id: '11', name: 'Samdrup Jongkhar' }, { id: '12', name: 'Samtse' },
    { id: '13', name: 'Sarpang' }, { id: '14', name: 'Thimphu' },
    { id: '15', name: 'Trashigang' }, { id: '16', name: 'Trashiyangtse' },
    { id: '17', name: 'Trongsa' }, { id: '18', name: 'Tsirang' },
    { id: '19', name: 'Wangdue Phodrang' }, { id: '20', name: 'Zhemgang' },
]);

// --- Initial Form State ---
const getInitialFormData = () => ({
  applicant: { cid: '', name: '', gender: '', dob: '' },
  contact: { contactNo: '', email: '' },
  presentAddress: { officeNumber: '', flatNo: '', buildingNo: '', location: '', gewogThrom: '', dzongkhagThromde: '' },
  permanentAddress: { villageChiwog: '', gewog: '', dungkhag: '', dzongkhagThromde: '' },
  education: { qualification: '', instituteName: '', universityName: '' },
  proposal: { name: '', address: '', location: '', firmType: '' },
  purpose: { vision: '', mission: '', objective: '' },
  linkages: [],
  financial: { sourceOfFunding: '' },
  swot: { strengths: '', weaknesses: '', opportunities: '', threats: '' },
  fees: [{ breakup: '', description: '', amount: null }],
  guarantor: { fullName: '', cidNumber: '', relation: '', contactNumber: '' },
  financialStatementFile: null,
  budgetPlanFile: null,
  guarantorCidCopyFile: null,
  cvFile: null,
  declarationAgreed: false,
});

// --- Reactive Form Data ---
const formData = reactive(getInitialFormData());

// --- Master Data (Only Firm Types needed now) ---
const masterData = reactive({
  firmTypes: [],
});

// --- Computed Properties ---
const totalFeeAmount = computed(() => {
  return formData.fees.reduce((total, fee) => (total + (Number(fee.amount) || 0)), 0);
});

// --- Methods ---

/** Fetch initial data on component mount */
onMounted(async () => {
  isLoading.value = true;

  // Populate Applicant Details
  if (authStore.isAuthenticated) {
    formData.applicant.cid = authStore.user?.cid || '';
    formData.applicant.name = authStore.fullName || '';
    formData.applicant.gender = authStore.gender || '';
    formData.applicant.dob = authStore.dateOfBirth || '';
    formData.contact.email = authStore.email || '';
    formData.contact.contactNo = authStore.contactNumber || '';
  } else {
    console.warn("User not authenticated.");
  }

  try {
    // Fetch Firm Types
    if (typeof apiServices.getMastersTypesOfFirm === 'function') {
      const firmTypesRes = await apiServices.getMastersTypesOfFirm();
      masterData.firmTypes = firmTypesRes?.data || [];
    } else {
      masterData.firmTypes = [];
      console.warn("apiServices.getMastersTypesOfFirm not found.");
    }
  } catch (error) {
    console.error("Error fetching firm types:", error);
    toast.error(`Failed to load firm types: ${error.message || 'Unknown error'}.`); // <-- Use toast for errors
    masterData.firmTypes = [];
  } finally {
    isLoading.value = false;
  }
});

/** Resets the form to its initial state */
const resetForm = () => {
  Object.assign(formData, getInitialFormData());
  // ... (reset files and draftId) ...
  formData.financialStatementFile = null;
  formData.budgetPlanFile = null;
  formData.guarantorCidCopyFile = null;
  formData.cvFile = null;
  draftId.value = null;

  // Re-populate applicant details on reset
  if (authStore.isAuthenticated) {
    // ... (re-populate applicant/contact details) ...
    formData.applicant.cid = authStore.user?.cid || '';
    formData.applicant.name = authStore.fullName || '';
    formData.applicant.gender = authStore.gender || '';
    formData.applicant.dob = authStore.dateOfBirth || '';
    formData.contact.email = authStore.email || '';
    formData.contact.contactNo = authStore.contactNumber || '';
  }
};

/** Handles file updates emitted from child components */
const handleChildFileUpload = ({ file, field }) => {
  if (field in formData) {
    formData[field] = file;
  } else {
    console.warn(`Received file update for unknown field: ${field}`);
  }
};

/** Prepares the FormData object for API submission */
const prepareFormData = (status) => {
  const submissionData = new FormData();

  // Append standard fields (USING BACKEND EXPECTED KEYS)
  submissionData.append('cid_no', formData.applicant.cid);
  submissionData.append('applicants_name', formData.applicant.name);
  submissionData.append('gender', formData.applicant.gender);
  submissionData.append('date_of_birth', formData.applicant.dob);
  submissionData.append('contact_no', formData.contact.contactNo);
  submissionData.append('email', formData.contact.email);
  submissionData.append('office_number', formData.presentAddress.officeNumber);
  submissionData.append('flat_no', formData.presentAddress.flatNo);
  submissionData.append('building_no', formData.presentAddress.buildingNo);
  submissionData.append('location', formData.presentAddress.location);
  submissionData.append('gewog_throm', formData.presentAddress.gewogThrom);
  submissionData.append('dzongkhag_thromde', formData.presentAddress.dzongkhagThromde);
  submissionData.append('permanent_village', formData.permanentAddress.villageChiwog);
  submissionData.append('permanent_gewog', formData.permanentAddress.gewog);
  submissionData.append('permanent_dungkhag', formData.permanentAddress.dungkhag);
  submissionData.append('permanent_dzongkhag', formData.permanentAddress.dzongkhagThromde);
  submissionData.append('qualification', formData.education.qualification);
  submissionData.append('institute_name', formData.education.instituteName);
  submissionData.append('university_name', formData.education.universityName || '');
  submissionData.append('proposed_firm_name', formData.proposal.name);
  submissionData.append('firm_address', formData.proposal.address);
  submissionData.append('firm_location', formData.proposal.location);
  submissionData.append('type_of_firm', formData.proposal.firmType);
  submissionData.append('vision', formData.purpose.vision);
  submissionData.append('mission', formData.purpose.mission);
  submissionData.append('objective', formData.purpose.objective);
  submissionData.append('finance_plan', formData.financial.sourceOfFunding);
  submissionData.append('strengths', formData.swot.strengths);
  submissionData.append('weaknesses', formData.swot.weaknesses);
  submissionData.append('opportunities', formData.swot.opportunities);
  submissionData.append('threats', formData.swot.threats);
  submissionData.append('guarantor_name', formData.guarantor.fullName);
  submissionData.append('guarantor_cid', formData.guarantor.cidNumber);
  submissionData.append('guarantor_relation', formData.guarantor.relation);
  submissionData.append('guarantor_contact', formData.guarantor.contactNumber);
  submissionData.append('linkages', JSON.stringify(formData.linkages));
  submissionData.append('fees', JSON.stringify(formData.fees));

  // Append Files (USING BACKEND EXPECTED KEYS)
  if (formData.financialStatementFile) {
    submissionData.append('financial_statement_file', formData.financialStatementFile, formData.financialStatementFile.name);
  }
  if (formData.budgetPlanFile) {
    submissionData.append('budget_plan_file', formData.budgetPlanFile, formData.budgetPlanFile.name);
  }
  if (formData.guarantorCidCopyFile) {
    submissionData.append('guarantor_cid_copy', formData.guarantorCidCopyFile, formData.guarantorCidCopyFile.name);
  }
  if (formData.cvFile) {
    submissionData.append('cv', formData.cvFile, formData.cvFile.name);
  }

  submissionData.append('status', status);
  submissionData.append('declaration_agreed', formData.declarationAgreed ? 'true' : 'false');

  return submissionData;
};


/** Handles the final form submission */
const handleSubmit = async () => {
  if (!formData.declarationAgreed) {
    toast.warning('Please agree to the declaration before submitting.'); // <-- 3. Use toast instance
    window.scrollTo(0, document.body.scrollHeight);
    return;
  }

  isLoading.value = true;
  console.log('Submitting application...');

  try {
    const payload = prepareFormData('submitted');
    let response;

    if (draftId.value && typeof apiServices.patchEcpfProfile === 'function') {
      response = await apiServices.patchEcpfProfile(draftId.value, payload);
    } else if (typeof apiServices.createEcpfProfile === 'function') {
      response = await apiServices.createEcpfProfile(payload);
    } else {
      throw new Error("Required API submission method not found.");
    }

    console.log('Submission successful:', response?.data);
    draftId.value = null; // Clear draft ID

    // --- SUCCESS ACTION ---
    toast.success('Application submitted successfully!'); // <-- 3. Use toast instance
    await router.push('/admin/user/ecpf/dashboard'); // <-- 4. Redirect
    resetForm(); // <-- 5. Reset form after navigation starts
    // --- END SUCCESS ACTION ---

  } catch (error) {
    console.error('Error submitting form:', error);
    const errorData = error.response?.data;
    let detailMessage = "An unexpected error occurred during submission.";

    // Extract specific error details if available (same logic as before)
    if (typeof errorData === 'object' && errorData !== null) {
      const fieldErrors = Object.entries(errorData)
        .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
        .join('; ');
      if (fieldErrors) detailMessage = `Submission failed: ${fieldErrors}`;
      else if (errorData.detail) detailMessage = errorData.detail;
    } else if (typeof errorData === 'string' && errorData.length > 0 && errorData.length < 200) {
      detailMessage = errorData;
    } else if (error.message) {
      detailMessage = error.message;
    }

    // --- ERROR ACTION ---
    toast.error(`Error: ${detailMessage}`); // <-- 3. Use toast instance
    window.scrollTo(0, 0);
    // --- END ERROR ACTION ---

  } finally {
    isLoading.value = false;
  }
};

/** Handles saving the form as a draft */
const handleSaveDraft = async () => {
  isLoading.value = true;
  console.log('Saving as draft...');

  try {
    const payload = prepareFormData('draft');
    let response;

    if (draftId.value && typeof apiServices.patchEcpfProfile === 'function') {
      response = await apiServices.patchEcpfProfile(draftId.value, payload);
    } else if (typeof apiServices.createEcpfProfile === 'function') {
      response = await apiServices.createEcpfProfile(payload);
      const newId = response?.data?.id || response?.data?.profile?.id;
      if (newId) {
        draftId.value = newId;
        console.log("Stored new draft ID:", draftId.value);
      }
    } else {
      throw new Error("Required API draft save method not found.");
    }

    console.log('Draft save successful:', response?.data);
    // --- DRAFT SUCCESS ACTION ---
    toast.success(`Application saved as draft successfully.${draftId.value ? ` (Draft ID: ${draftId.value})` : ''}`); // <-- Use toast instance
    window.scrollTo(0, 0);
    // --- END DRAFT SUCCESS ACTION ---

  } catch (error) {
    console.error('Error saving draft:', error);
    const errorData = error.response?.data;
    let detailMessage = "An unexpected error occurred while saving the draft.";
    // Extract specific error details (same logic as before)
    if (typeof errorData === 'object' && errorData !== null) {
      const fieldErrors = Object.entries(errorData).map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`).join('; ');
      if (fieldErrors) detailMessage = `Draft save failed: ${fieldErrors}`;
      else if (errorData.detail) detailMessage = errorData.detail;
    } else if (typeof errorData === 'string' && errorData.length > 0 && errorData.length < 200) {
      detailMessage = errorData;
    } else if (error.message) {
      detailMessage = error.message;
    }

    // --- DRAFT ERROR ACTION ---
    toast.error(`Error: ${detailMessage}`); // <-- Use toast instance
    window.scrollTo(0, 0);
    // --- END DRAFT ERROR ACTION ---

  } finally {
    isLoading.value = false;
  }
};

</script>

<style scoped>
/* Add specific styles if needed */
button:disabled {
  opacity: 0.6;
}

/* Improve file input styling slightly */
input[type="file"] {
  @apply block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer;
}
</style>