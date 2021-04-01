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
      <ApplicantDetailsSection :applicant-data="formData.applicant" />

      <!-- Contact & Address Section -->
      <ContactAddressSection :contact-data="formData.contact" :present-address="formData.presentAddress"
        :permanent-address="formData.permanentAddress" :dzongkhag-options="dzongkhagOptions" />

      <!-- Education Section -->
      <EducationSection :education-data="formData.education" />

      <!-- Proposal Details Section -->
      <ProposalDetailsSection :proposal-data="formData.proposal" :dzongkhag-options="dzongkhagOptions"
        :firm-type-options="masterData.firmTypes" />

      <!-- Purpose Section -->
      <PurposeSection :purpose-data="formData.purpose" />

      <!-- Linkages Section -->
      <LinkagesSection :linkages="formData.linkages" />

      <!-- Financial Capacity Section -->
      <FinancialCapacitySection :financial-data="formData.financial"
        :financial-statement-file-name="formData.financialStatementFile?.name"
        :budget-plan-file-name="formData.budgetPlanFile?.name" @update:file="handleChildFileUpload" />

      <!-- SWOT Analysis Section -->
      <SwotAnalysisSection :swot-data="formData.swot" />

      <!-- Fee & Charges Section -->
      <FeesChargesSection :fees="formData.fees" :total-fee-amount="totalFeeAmount" />

      <!-- Guarantor Details Section -->
      <GuarantorDetailsSection :guarantor-data="formData.guarantor"
        :cid-copy-file-name="formData.guarantorCidCopyFile?.name" @update:file="handleChildFileUpload" />

      <!-- Supporting Documents Section -->
      <SupportingDocumentsSection :cv-file-name="formData.cvFile?.name" @update:file="handleChildFileUpload" />

      <!-- Declaration -->
      <section class="p-6 bg-white rounded-lg shadow">
        <h2 class="text-xl font-semibold mb-4 text-indigo-700">Declaration</h2>
        <div class="flex items-start">
          <div class="flex items-center h-5">
            <input id="declaration" name="declaration" type="checkbox" v-model="formData.declarationAgreed" required
              class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded">
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
          class="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed">
          {{ isLoading ? 'Saving...' : 'Save as Draft' }}
        </button>
        <button type="submit" :disabled="!formData.declarationAgreed || isLoading" :class="[
      'inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white',
      formData.declarationAgreed && !isLoading
        ? 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer'
        : 'bg-indigo-300 cursor-not-allowed',
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
import apiServices from '@/services/services'; // Adjust path as needed

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
  // Add Thromdes if needed, ensure IDs/names are unique and match backend expectations
  // { id: 'T1', name: 'Thimphu Thromde' },
  // { id: 'T2', name: 'Phuentsholing Thromde' },
  // { id: 'T3', name: 'Gelephu Thromde' },
  // { id: 'T4', name: 'Samdrup Jongkhar Thromde' },
]);

// --- Initial Form State ---
const getInitialFormData = () => ({
  applicant: { cid: '11001001234', name: 'Dorji Wangchuk', gender: 'Male', dob: '1985-06-15' }, // Fetch dynamically
  contact: { contactNo: '', email: '' },
  presentAddress: { officeNumber: '', flatNo: '', buildingNo: '', location: '', gewogThrom: '', dzongkhagThromde: '' }, // gewogThrom is now text
  permanentAddress: { villageChiwog: '', gewog: '', dungkhag: '', dzongkhagThromde: '' }, // gewog & dungkhag are now text
  education: { qualification: '', instituteName: '' },
  proposal: { name: '', address: '', location: '', firmType: '' },
  purpose: { vision: '', mission: '', objective: '' },
  linkages: [],
  financial: { sourceOfFunding: '' },
  swot: { strengths: '', weaknesses: '', opportunities: '', threats: '' },
  fees: [{ breakup: '', description: '', amount: null }],
  guarantor: { fullName: '', cidNumber: '', relation: '', contactNumber: '' },
  // File refs managed directly in formData
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
  return formData.fees.reduce((total, fee) => {
    const amount = Number(fee.amount) || 0;
    return total + amount;
  }, 0);
});

// --- Methods ---

/** Fetch initial data on component mount */
onMounted(async () => {
  // --- TODO: Implement logic to fetch auto-populated applicant data ---
  // Example: const applicantData = await apiServices.getCurrentApplicant();
  // Object.assign(formData.applicant, applicantData.data);

  isLoading.value = true;
  errorMessage.value = '';
  successMessage.value = '';
  console.log("Fetching firm types...");
  try {
    // Fetch only Firm Types now
    if (typeof apiServices.getMastersTypesOfFirm === 'function') {
      const firmTypesRes = await apiServices.getMastersTypesOfFirm();
      masterData.firmTypes = firmTypesRes?.data || [];
      console.log("Firm types fetched.");
    } else {
      console.warn("apiServices.getMastersTypesOfFirm method not found. Firm types dropdown will be empty.");
      masterData.firmTypes = []; // Ensure it's an empty array
    }

  } catch (error) {
    console.error("Error fetching firm types:", error);
    errorMessage.value = `Failed to load firm types: ${error.message || 'Unknown error'}.`;
    masterData.firmTypes = []; // Set to empty on error
  } finally {
    isLoading.value = false;
  }
});

/** Resets the form to its initial state */
const resetForm = () => {
  Object.assign(formData, getInitialFormData());
  // Ensure file refs are explicitly nulled
  formData.financialStatementFile = null;
  formData.budgetPlanFile = null;
  formData.guarantorCidCopyFile = null;
  formData.cvFile = null;
  draftId.value = null;
  errorMessage.value = '';
  successMessage.value = '';
  console.log("Form reset to initial state.");
};

/** Handles file updates emitted from child components */
const handleChildFileUpload = ({ file, field }) => {
  console.log(`Updating file for field: ${field}`);
  if (field in formData) {
    formData[field] = file;
  } else {
    console.warn(`Received file update for unknown field: ${field}`);
  }
};

/** Prepares the FormData object for API submission */
const prepareFormData = (status) => {
  const submissionData = new FormData();

  // Append standard fields (Ensure keys match backend expectations)
  submissionData.append('applicant_cid', formData.applicant.cid);
  submissionData.append('applicant_name', formData.applicant.name);
  submissionData.append('applicant_gender', formData.applicant.gender);
  submissionData.append('applicant_dob', formData.applicant.dob);
  submissionData.append('contact_no', formData.contact.contactNo);
  submissionData.append('email', formData.contact.email);
  submissionData.append('present_address_office_number', formData.presentAddress.officeNumber);
  submissionData.append('present_address_flat_no', formData.presentAddress.flatNo);
  submissionData.append('present_address_building_no', formData.presentAddress.buildingNo);
  submissionData.append('present_address_location', formData.presentAddress.location);
  submissionData.append('present_address_gewog_throm', formData.presentAddress.gewogThrom); // Text input
  submissionData.append('present_address_dzongkhag_thromde', formData.presentAddress.dzongkhagThromde); // ID or Name based on backend
  submissionData.append('permanent_address_village_chiwog', formData.permanentAddress.villageChiwog);
  submissionData.append('permanent_address_gewog', formData.permanentAddress.gewog); // Text input
  submissionData.append('permanent_address_dungkhag', formData.permanentAddress.dungkhag); // Text input
  submissionData.append('permanent_address_dzongkhag_thromde', formData.permanentAddress.dzongkhagThromde); // ID or Name
  submissionData.append('education_qualification', formData.education.qualification);
  submissionData.append('education_institute_name', formData.education.instituteName);
  submissionData.append('proposal_name', formData.proposal.name);
  submissionData.append('proposal_address', formData.proposal.address);
  submissionData.append('proposal_location', formData.proposal.location); // ID or Name
  submissionData.append('proposal_firm_type', formData.proposal.firmType); // ID or Name
  submissionData.append('purpose_vision', formData.purpose.vision);
  submissionData.append('purpose_mission', formData.purpose.mission);
  submissionData.append('purpose_objective', formData.purpose.objective);
  submissionData.append('financial_source_of_funding', formData.financial.sourceOfFunding);
  submissionData.append('swot_strengths', formData.swot.strengths);
  submissionData.append('swot_weaknesses', formData.swot.weaknesses);
  submissionData.append('swot_opportunities', formData.swot.opportunities);
  submissionData.append('swot_threats', formData.swot.threats);
  submissionData.append('guarantor_full_name', formData.guarantor.fullName);
  submissionData.append('guarantor_cid_number', formData.guarantor.cidNumber);
  submissionData.append('guarantor_relation', formData.guarantor.relation);
  submissionData.append('guarantor_contact_number', formData.guarantor.contactNumber);

  // Append Arrays as JSON strings
  submissionData.append('linkages', JSON.stringify(formData.linkages));
  submissionData.append('fees', JSON.stringify(formData.fees));

  // Append Files (use correct backend field names)
  if (formData.financialStatementFile) {
    submissionData.append('financial_statement_file', formData.financialStatementFile, formData.financialStatementFile.name);
  }
  if (formData.budgetPlanFile) {
    submissionData.append('budget_plan_file', formData.budgetPlanFile, formData.budgetPlanFile.name);
  }
  if (formData.guarantorCidCopyFile) {
    submissionData.append('guarantor_cid_copy_file', formData.guarantorCidCopyFile, formData.guarantorCidCopyFile.name);
  }
  if (formData.cvFile) {
    submissionData.append('cv_file', formData.cvFile, formData.cvFile.name);
  }

  submissionData.append('status', status);
  submissionData.append('declaration_agreed', formData.declarationAgreed);

  return submissionData;
};

/** Handles the final form submission */
const handleSubmit = async () => {
  if (!formData.declarationAgreed) {
    errorMessage.value = 'Please agree to the declaration before submitting.';
    successMessage.value = '';
    window.scrollTo(0, document.body.scrollHeight);
    return;
  }
  isLoading.value = true;
  errorMessage.value = '';
  successMessage.value = '';
  console.log('Submitting application...');
  try {
    const payload = prepareFormData('submitted');
    // Log FormData for debugging
    console.log("FormData for submission:");
    for (let [key, value] of payload.entries()) {
      if (value instanceof File) { console.log(key, `File: ${value.name}`); }
      else { console.log(key, value); }
    }

    let response;
    if (draftId.value && typeof apiServices.patchEcpfProfile === 'function') {
      response = await apiServices.patchEcpfProfile(draftId.value, payload);
    } else if (typeof apiServices.createEcpfProfile === 'function') {
      response = await apiServices.createEcpfProfile(payload);
    } else {
      throw new Error("Required API method not found in apiServices.");
    }
    console.log('Submission successful:', response?.data);
    successMessage.value = 'Application submitted successfully!';
    draftId.value = null;
    resetForm();
    window.scrollTo(0, 0);
  } catch (error) {
    console.error('Error submitting form:', error);
    const errorData = error.response?.data;
    let detailMessage = "An unexpected error occurred during submission.";
    if (typeof errorData === 'object' && errorData !== null) {
      const fieldErrors = Object.entries(errorData).map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`).join('; ');
      if (fieldErrors) detailMessage = `Submission failed: ${fieldErrors}`;
      else if (errorData.detail) detailMessage = errorData.detail;
    } else if (error.message) {
      detailMessage = error.message;
    }
    errorMessage.value = `Error: ${detailMessage}`;
    window.scrollTo(0, 0);
  } finally {
    isLoading.value = false;
  }
};

/** Handles saving the form as a draft */
const handleSaveDraft = async () => {
  isLoading.value = true;
  errorMessage.value = '';
  successMessage.value = '';
  console.log('Saving as draft...');
  try {
    const payload = prepareFormData('draft');
    // Log FormData for debugging
    console.log("FormData for draft save:");
    for (let [key, value] of payload.entries()) {
      if (value instanceof File) { console.log(key, `File: ${value.name}`); }
      else { console.log(key, value); }
    }

    let response;
    if (draftId.value && typeof apiServices.patchEcpfProfile === 'function') {
      response = await apiServices.patchEcpfProfile(draftId.value, payload);
    } else if (typeof apiServices.createEcpfProfile === 'function') {
      response = await apiServices.createEcpfProfile(payload);
      if (response?.data?.id) { // Adjust 'id' based on your backend response
        draftId.value = response.data.id;
        console.log("Stored new draft ID:", draftId.value);
      }
    } else {
      throw new Error("Required API method not found in apiServices.");
    }
    console.log('Draft save successful:', response?.data);
    successMessage.value = `Application saved as draft successfully. ${draftId.value ? `(Draft ID: ${draftId.value})` : ''}`;
    window.scrollTo(0, 0);
  } catch (error) {
    console.error('Error saving draft:', error);
    const errorData = error.response?.data;
    let detailMessage = "An unexpected error occurred while saving the draft.";
    if (typeof errorData === 'object' && errorData !== null) {
      const fieldErrors = Object.entries(errorData).map(([key, value]) => `${key}: ${value}`).join('; ');
      if (fieldErrors) detailMessage = `Draft save failed: ${fieldErrors}`;
      else if (errorData.detail) detailMessage = errorData.detail;
    } else if (error.message) {
      detailMessage = error.message;
    }
    errorMessage.value = `Error: ${detailMessage}`;
    window.scrollTo(0, 0);
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
  @apply block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer;
}
</style>