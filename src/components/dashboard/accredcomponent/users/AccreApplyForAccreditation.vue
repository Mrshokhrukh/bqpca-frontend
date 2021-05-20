<template>
  <div class="mx-auto px-4 py-8 w-full">
    <!-- Header -->
    <div class="bg-gradient-to-r from-indigo-100 via-blue-50 to-indigo-100 rounded-xl p-8 mb-10 shadow">
      <h2 class="text-3xl font-bold text-gray-900 mb-3 text-center">
        New Accreditation Application (Annexure IV)
      </h2>
      <p class="text-gray-600 text-center max-w-2xl mx-auto">
        Please provide all required information accurately. Fields marked with <span class="text-red-500">*</span> are mandatory.
      </p>
      <div v-if="loadingInitialData" class="text-center mt-4">
        <p class="text-indigo-600">Loading application details...</p>
        <div class="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-indigo-500 mt-2"></div>
      </div>
      <div v-else>
        <p v-if="activeSchedule" class="text-sm text-green-700 mt-3 text-center bg-green-100 p-2 rounded-md">
          Current Application Cycle: <strong>{{ activeSchedule.schedule_name }}</strong>
          (Open from {{ formatDate(activeSchedule.from_date) }} to {{ formatDate(activeSchedule.end_date) }})
        </p>
        <p v-else-if="!currentApplicationId" class="text-sm text-red-700 mt-3 text-center bg-red-100 p-2 rounded-md">
          No active accreditation application cycle. You can save a draft but cannot submit a new application at this time.
        </p>
         <p v-else-if="currentApplicationId && formData.status !== 'draft'" class="text-sm text-yellow-700 mt-3 text-center bg-yellow-100 p-2 rounded-md">
          You are editing an existing application. Schedule restrictions for new submissions may not apply.
        </p>
      </div>
    </div>

    <!-- Payment Modal -->
    <PaymentModal
      ref="paymentModalRef"
      :amount="applicationFeeAmount"
      :serviceCode="PAYMENT_SERVICE_CODE_ACCREDITATION"
      @payment-completed="handlePaymentCompleted"
      @close="handlePaymentModalClose"
    />

    <!-- Main Form -->
    <div v-if="!loadingInitialData && authStore.isAuthenticated && instituteProfile" class="bg-white border border-gray-200 rounded-xl shadow-lg p-6 sm:p-8">
      <form @submit.prevent="validateAndPromptPayment">
        <!-- Section 0: Institute Details -->
        <div class="form-section">
          <h3 class="form-section-title">Institute Details</h3>
          <p class="form-section-subtitle">
            These details are from your institute's main profile.
            <router-link v-if="authStore.user?.user_type === 'institute_user'" :to="{ name: 'user-accreditation-profile' }" class="text-indigo-600 hover:underline">Edit Main Institute Profile</router-link>
            <span v-else class="text-gray-500">(View only for non-institute users)</span>
            if changes are needed.
          </p>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mt-4">
            <!-- Name of HEI: Displayed as read-only, pre-filled from profile -->
            <FormField label="Name of HEI" :value="instituteProfile.name_of_institution" :isReadonly="true" />
            <FormField label="Email Address" :value="instituteProfile.email_address" :isReadonly="true" />
            <FormField label="Contact Number" :value="instituteProfile.contact_number" :isReadonly="true" />
            <FormField label="Dzongkhag/Thromde City" :value="instituteProfile.dzongkhag_thromde_city" :isReadonly="true" />
          </div>
        </div>

        <!-- Section 1: Accreditation Cycle -->
        <div class="form-section">
          <h3 class="form-section-title required">1. Accreditation Cycle</h3>
          <p class="form-section-subtitle">Select the applicable accreditation cycle(s).</p>
          <div class="mt-4 space-y-3">
            <div class="flex items-start">
              <input type="checkbox" id="first_cycle" value="first" v-model="formData.accreditation_cycles" class="form-checkbox mt-1" :disabled="isSubmitting" />
              <label for="first_cycle" class="ml-3 text-sm text-gray-700">First Cycle</label>
            </div>
            <div class="flex items-start">
              <input type="checkbox" id="second_cycle" value="second" v-model="formData.accreditation_cycles" class="form-checkbox mt-1" :disabled="isSubmitting" />
              <label for="second_cycle" class="ml-3 text-sm text-gray-700">Second Cycle</label>
            </div>
            <div class="flex items-start">
              <input type="checkbox" id="third_cycle" value="third" v-model="formData.accreditation_cycles" class="form-checkbox mt-1" :disabled="isSubmitting" />
              <label for="third_cycle" class="ml-3 text-sm text-gray-700">Third Cycle</label>
            </div>
            <p v-if="formSubmittedAttempt && formData.accreditation_cycles.length === 0" class="text-red-500 text-xs mt-1">
              Please select at least one accreditation cycle.
            </p>
          </div>
        </div>

        <!-- Section 2: Prerequisite for Accreditation -->
        <div class="form-section">
          <h3 class="form-section-title required">2. Prerequisite for Accreditation</h3>
          <p class="form-section-subtitle">Confirm that your institute meets these prerequisites by checking the boxes. These align with the documents required in Part I.</p>
          <div class="mt-4 space-y-3">
            <div v-for="prereq in availablePrerequisites" :key="prereq.key" class="flex items-start">
              <input type="checkbox" :id="`prereq_${prereq.key}`" :value="prereq.key" v-model="formData.prerequisites_confirmed" class="form-checkbox mt-1" :disabled="isSubmitting" />
              <label :for="`prereq_${prereq.key}`" class="ml-3 text-sm text-gray-700">{{ prereq.label }}</label>
            </div>
            <p v-if="formSubmittedAttempt && (!formData.prerequisites_confirmed || formData.prerequisites_confirmed.length !== availablePrerequisites.length) && availablePrerequisites.length > 0" class="text-red-500 text-xs mt-1">
              Please confirm all prerequisites.
            </p>
          </div>
        </div>

        <!-- Section 3: Part I - Checklist of Documents -->
        <div class="form-section">
          <h3 class="form-section-title">3. Part I: Document Uploads</h3>
          <p class="form-section-subtitle">
            Upload the required documents. (PDF, DOC, DOCX, JPG, PNG, ZIP - Max 5MB each).
            <br /><strong>Note:</strong> The list of documents to upload here is fetched from the system. If you don't see the expected upload fields, ensure your institute profile is complete or contact support.
            The "Receipt of Accreditation Fee" is NOT required at this stage; it's handled after payment.
          </p>
          <div class="mt-4 space-y-6">
            <div v-if="requiredApplicationDocTypes.length > 0">
              <div v-for="docType in requiredApplicationDocTypes" :key="docType.id">
                <label :for="`file_${docType.id}`" class="form-label required">{{ docType.name }}</label>
                <input :id="`file_${docType.id}`" type="file" @change="handleDocumentUpload($event, docType.id)" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.zip" class="form-file-input" :disabled="isSubmitting" />
                <div v-if="getUploadedDocumentName(docType.id)" class="text-sm text-green-700 mt-1">
                  <span class="font-medium">File:</span> {{ getUploadedDocumentName(docType.id) }}
                  <button @click="removeDocumentUpload(docType.id)" type="button" class="text-red-500 hover:text-red-700 text-xs ml-2 font-semibold" :disabled="isSubmitting">× Remove</button>
                </div>
                <p v-else-if="formSubmittedAttempt && !isDocumentUploadedOrExisting(docType.id)" class="text-red-500 text-xs mt-1">
                  This document is required.
                </p>
              </div>
            </div>
            <!-- Informative message if no document types are loaded -->
            <div v-else-if="!loadingInitialData && requiredApplicationDocTypes.length === 0">
              <p class="text-orange-600 bg-orange-50 p-3 rounded-md text-sm">
                No specific document upload fields are currently listed. This might be because they are not required for this application type,
                are managed elsewhere, or the list of required documents could not be loaded. If you believe documents are missing, please contact support.
              </p>
            </div>
             <div v-else-if="loadingInitialData">
                <p class="text-gray-500">Loading document requirements...</p>
            </div>
          </div>
        </div>

        <!-- Section 4: Part II - Course/Programme Details -->
        <div class="form-section">
          <h3 class="form-section-title required">4. Part II: Course/Programme Details</h3>
          <p class="form-section-subtitle">List all courses/programmes offered for which accreditation is sought.</p>
          <div class="mt-4">
            <div v-for="(course, index) in formData.application_courses" :key="course.temp_id || course.id || index" class="mb-6 p-4 border border-gray-200 rounded-md bg-gray-50 relative shadow-sm">
              <h4 class="text-sm font-semibold text-gray-700 mb-3">Programme #{{ index + 1 }}</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div>
                  <label :for="`course_title_${index}`" class="form-label-sm required">Course/Programme Title</label>
                  <input :id="`course_title_${index}`" type="text" v-model.trim="course.course_programme_title" required class="form-input" :disabled="isSubmitting" placeholder="e.g., BSc in Computer Science" />
                </div>
                <div>
                  <label :for="`awarding_body_${index}`" class="form-label-sm">Awarding Body</label>
                  <input :id="`awarding_body_${index}`" type="text" v-model.trim="course.awarding_body" class="form-input" :disabled="isSubmitting" placeholder="e.g., Royal University of Bhutan" />
                </div>
                <div>
                  <label :for="`level_bqf_${index}`" class="form-label-sm required">Level(s) as per BQF</label>
                  <input :id="`level_bqf_${index}`" type="text" v-model.trim="course.level_as_per_bqf" required placeholder="e.g., BQF Level 7, Masters" class="form-input" :disabled="isSubmitting" />
                </div>
                <div>
                  <label :for="`student_no_${index}`" class="form-label-sm required">Current Student Number</label>
                  <input :id="`student_no_${index}`" type="number" min="0" v-model.number="course.current_student_number" required class="form-input" :disabled="isSubmitting" placeholder="e.g., 150" />
                </div>
              </div>
              <button
                v-if="formData.application_courses.length > 1"
                @click="removeCourse(index)"
                type="button"
                class="absolute top-3 right-3 text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
                aria-label="Remove Programme"
                :disabled="isSubmitting"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
            <button @click="addCourse" type="button" class="btn-secondary text-sm py-2 px-4 mt-2" :disabled="isSubmitting">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline-block mr-1 -ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clip-rule="evenodd" />
              </svg>
              Add Another Programme
            </button>
            <p v-if="formSubmittedAttempt && formData.application_courses.some(c => !c.course_programme_title || !c.level_as_per_bqf || c.current_student_number === null || c.current_student_number < 0)" class="text-red-500 text-xs mt-1">
              Please complete all required fields for each course/programme with valid student numbers (must be 0 or greater).
            </p>
             <p v-if="formSubmittedAttempt && formData.application_courses.length === 0" class="text-red-500 text-xs mt-1">
              At least one course/programme must be added.
            </p>
          </div>
        </div>

        <!-- Declaration -->
        <div class="form-section border-t border-gray-200 pt-6">
          <div class="flex items-start">
            <div class="flex items-center h-5">
              <input id="declaration" type="checkbox" v-model="declarationAccepted" required class="form-checkbox" :disabled="isSubmitting" />
            </div>
            <div class="ml-3 text-sm">
              <label for="declaration" class="font-medium text-gray-700 required">Declaration</label>
              <p class="text-gray-500">
                I, on behalf of the institute, declare that all information and documents provided in this application are true, correct, and complete to the best of my knowledge and belief.
                I understand that any false or misleading information may lead to rejection of this application or revocation of accreditation.
              </p>
            </div>
          </div>
          <p v-if="formSubmittedAttempt && !declarationAccepted" class="text-red-500 text-xs mt-1 ml-8">You must accept the declaration to proceed.</p>
        </div>

        <!-- Action Buttons -->
        <div class="mt-10 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-100">
          <button @click="saveApplicationDraft" type="button" :disabled="isSubmitting || paymentProcessing" class="btn-secondary w-full sm:w-auto">
            Save as Draft
          </button>
          <button
            type="submit"
            :disabled="!canEffectivelySubmit || isSubmitting || paymentProcessing"
            class="btn-primary w-full sm:w-auto"
            :class="{ 'opacity-50 cursor-not-allowed': !canEffectivelySubmit || isSubmitting || paymentProcessing }"
          >
            <span v-if="isSubmitting" class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ paymentProcessing ? 'Processing Payment...' : 'Submitting...' }}
            </span>
            <span v-else>
              {{ (currentApplicationId && formData.id) ? 'Update & Proceed' : 'Proceed to Payment & Submit' }}
            </span>
          </button>
        </div>
        <p v-if="!canEffectivelySubmit && !currentApplicationId && !loadingInitialData" class="text-sm text-red-600 mt-4 text-right">
            Cannot submit a new application: No active accreditation cycle or user not authenticated. You can save a draft.
        </p>
      </form>
    </div>
    <div v-else-if="!loadingInitialData && authStore.isAuthenticated && !instituteProfile" class="text-center py-10 bg-white border rounded-xl shadow p-6">
      <p class="text-red-600 text-lg font-semibold">Institute Profile Not Found or Not Loaded</p>
      <p class="text-gray-600 mt-2">We could not load your institute's profile. This is required to submit an accreditation application.</p>
      <p class="mt-1 text-gray-600">Please ensure your profile is set up correctly or contact support if this issue persists.</p>
      <router-link v-if="authStore.user?.user_type === 'institute_user'" :to="{ name: 'user-accreditation-profile' }" class="mt-4 inline-block btn-primary text-sm">
        Setup Institute Profile
      </router-link>
    </div>
    <div v-else-if="!loadingInitialData && !authStore.isAuthenticated" class="text-center py-10 bg-white border rounded-xl shadow p-6">
      <p class="text-orange-600 text-lg font-semibold">Authentication Required</p>
      <p class="text-gray-600 mt-2">You need to be logged in to submit an accreditation application.</p>
      <router-link :to="{ name: 'Login' }" class="mt-4 inline-block btn-primary text-sm">
        Login
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
// Assuming apiService, PaymentModal, authStore, etc., are correctly imported as in your original code
import apiService from '@/services/services'; // Replace with your actual path
import PaymentModal from '@/components/common/PaymentModal.vue'; // Replace with your actual path
import { useAuthStore } from '@/stores/authStore'; // Replace with your actual path
import { useToast } from 'vue-toastification';
import { useRouter, useRoute } from 'vue-router';

// --- Configuration & Constants ---
const DRAFT_ACCREDITATION_APP_KEY = 'newAccreditationApplicationDraft_v5';
const PAYMENT_SERVICE_CODE_ACCREDITATION = 'BQPCA_ACCR_FEE_INITIAL';
const ACCREDITATION_FEE_CATEGORY_NAME = 'ACCREDITATION_INITIAL_APP';

// --- Reactive State & Refs ---
const toast = useToast();
const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

const paymentModalRef = ref(null);
const isSubmitting = ref(false);
const paymentProcessing = ref(false);
const formSubmittedAttempt = ref(false);
const declarationAccepted = ref(false);
const loadingInitialData = ref(true);

const instituteProfile = ref(null);
const activeSchedule = ref(null);
const applicationFeeAmount = ref(0);
const feeDetails = ref(null);
const requiredApplicationDocTypes = ref([]); // This will be populated by API
const currentApplicationId = ref(route.params.id || null);

// Prerequisite labels should match the documents expected in Part I for consistency
const availablePrerequisites = ref([
  { key: 'legal_status_docs_available', label: 'Documents authenticating the legal status of the institute (including list of directors, partners and/or legal owners) are available and correct.' },
  { key: 'lease_agreement_available', label: 'A valid lease agreement is in place, if premises are leased and applicable.' },
  { key: 'audited_accounts_3yrs_available', label: 'Copies of the last three years audited annual accounts are prepared and available.' },
  { key: 'student_admission_data_3yrs_available', label: 'Data on the number of students admitted during the last three years, categorized by gender, is compiled and available.' },
]);

let courseTempIdCounter = 0;
const getInitialFormData = () => ({
  institute_profile: null,
  application_schedule: null,
  application_fee_category: null,
  accreditation_cycles: [],
  prerequisites_confirmed: [], // Stores keys from availablePrerequisites
  application_documents: [], // Stores { document_type: docTypeId (PK from API), file: File, file_name: String, id: existing_doc_id (optional) }
  application_courses: [{ temp_id: courseTempIdCounter++, id: null, course_programme_title: '', awarding_body: '', level_as_per_bqf: '', current_student_number: null }],
  is_payment_complete: false,
  payment_id_gateway: '',
  payment_status: 'not_initiated',
  status: 'draft',
  id: null, // Application ID if editing
});

const formData = reactive(getInitialFormData());

// --- Computed Properties ---
const canEffectivelySubmit = computed(() => {
  // Allow submission if editing an existing application OR if there's an active schedule for new ones
  return (!!activeSchedule.value || !!currentApplicationId.value) && authStore.isAuthenticated;
});

// --- Methods ---
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  } catch (e) {
    console.error("Error formatting date:", dateString, e);
    return dateString;
  }
};

const handleDocumentUpload = (event, docTypeId) => {
  const file = event.target.files[0];
  if (!file) return;
  if (file.size > 5 * 1024 * 1024) { // 5MB limit
    toast.error(`${file.name} exceeds 5MB file size limit.`);
    event.target.value = ''; // Reset file input
    return;
  }
  // Ensure docTypeId is valid (e.g., comes from requiredApplicationDocTypes)
  if (!requiredApplicationDocTypes.value.find(dt => dt.id === docTypeId)) {
      toast.error("Invalid document type for upload.");
      return;
  }

  const existingDocIndex = formData.application_documents.findIndex(d => d.document_type === docTypeId);
  const newDocEntry = { document_type: docTypeId, file: file, file_name: file.name, id: null };

  if (existingDocIndex > -1) {
    newDocEntry.id = formData.application_documents[existingDocIndex].id; // Preserve ID if replacing existing uploaded doc
    formData.application_documents.splice(existingDocIndex, 1, newDocEntry);
  } else {
    formData.application_documents.push(newDocEntry);
  }
  event.target.value = ''; // Reset file input to allow re-uploading the same file
};

const removeDocumentUpload = (docTypeId) => {
  const docIndex = formData.application_documents.findIndex(d => d.document_type === docTypeId);
  if (docIndex > -1) {
    formData.application_documents.splice(docIndex, 1);
    toast.info(`File for ${requiredApplicationDocTypes.value.find(dt => dt.id === docTypeId)?.name || 'document'} removed.`);
  }
};

const getUploadedDocumentName = (docTypeId) => {
  const doc = formData.application_documents.find(d => d.document_type === docTypeId);
  return doc ? doc.file_name : null;
};

const isDocumentUploadedOrExisting = (docTypeId) => {
  const doc = formData.application_documents.find(d => d.document_type === docTypeId);
  // True if a new file is selected OR if editing an app and this doc type had a file previously (even if not re-selected now)
  return !!doc?.file || (!!currentApplicationId.value && !!doc?.id && !doc?.file && doc?.file_name?.toLowerCase() !== 'previously uploaded');
};


const addCourse = () => {
  formData.application_courses.push({ temp_id: courseTempIdCounter++, id: null, course_programme_title: '', awarding_body: '', level_as_per_bqf: '', current_student_number: null });
};

const removeCourse = (index) => {
  if (formData.application_courses.length > 1) {
    formData.application_courses.splice(index, 1);
  } else {
    toast.info('At least one course/programme entry is required.');
  }
};

const saveApplicationDraft = () => {
  if (!instituteProfile.value?.id) {
    toast.warn("Institute profile not loaded. Cannot save draft effectively.");
    return;
  }
  try {
    // Create a deep copy for saving, excluding actual File objects from local storage
    const draftToSave = JSON.parse(JSON.stringify(formData));
    draftToSave.application_documents = formData.application_documents.map(d => ({
      document_type: d.document_type,
      file_name: d.file_name, // Keep file_name to indicate a file was there
      // file: null, // Don't store actual File object
      id: d.id
    }));

    localStorage.setItem(DRAFT_ACCREDITATION_APP_KEY, JSON.stringify(draftToSave));
    toast.success('Draft saved locally. Remember to re-select document files if you refresh or leave the page.');
  } catch (e) {
    toast.error('Error saving draft to local storage.');
    console.error("Error saving draft:", e);
  }
};

const loadApplicationDraft = () => {
  const draftJson = localStorage.getItem(DRAFT_ACCREDITATION_APP_KEY);
  if (draftJson) {
    try {
      const parsedDraft = JSON.parse(draftJson);
      const defaultForm = getInitialFormData();

      // Merge draft into formData carefully
      for (const key in defaultForm) {
        if (Object.hasOwn(parsedDraft, key)) {
          // Handle arrays: if draft has non-array for an array field, use default
          if (Array.isArray(defaultForm[key]) && !Array.isArray(parsedDraft[key])) {
            formData[key] = Array.isArray(defaultForm[key]) ? [...defaultForm[key]] : defaultForm[key];
          } else {
            formData[key] = parsedDraft[key];
          }
        } else {
          // If key not in draft, use default
          formData[key] = defaultForm[key];
        }
      }
      // Restore application_documents structure, files will need re-selection
      formData.application_documents = (parsedDraft.application_documents || []).map(d => ({ ...d, file: null })); // file must be null initially

      if (!formData.application_courses || formData.application_courses.length === 0) {
        formData.application_courses = [{ temp_id: courseTempIdCounter++, id: null, course_programme_title: '', awarding_body: '', level_as_per_bqf: '', current_student_number: null }];
      } else {
        // Ensure temp_id is present for reactivity keys
        formData.application_courses = formData.application_courses.map(c => ({ ...c, temp_id: c.temp_id || courseTempIdCounter++ }));
      }

      if (parsedDraft.id) { // If draft was from a saved application
        currentApplicationId.value = parsedDraft.id;
        formData.id = parsedDraft.id;
      }
      // Do not automatically accept declaration from draft
      declarationAccepted.value = false;

      toast.info('Draft loaded from local storage. Please review all fields and re-select all document files.');
    } catch (e) {
      toast.error('Could not parse or load draft from local storage. Starting fresh.');
      console.error("Error loading draft:", e);
      localStorage.removeItem(DRAFT_ACCREDITATION_APP_KEY);
      Object.assign(formData, getInitialFormData()); // Reset to initial state
    }
  }
};


const clearApplicationDraft = () => {
  localStorage.removeItem(DRAFT_ACCREDITATION_APP_KEY);
  Object.assign(formData, getInitialFormData()); // Reset form data
  declarationAccepted.value = false;
  formSubmittedAttempt.value = false;
  // Reset file inputs visually if possible (not directly easy without component refs for each)
  // requiredApplicationDocTypes.value.forEach(docType => {
  //   const inputEl = document.getElementById(`file_${docType.id}`);
  //   if (inputEl) inputEl.value = '';
  // });
  toast.info("Local draft cleared and form reset.");
};


const validateForm = () => {
  formSubmittedAttempt.value = true; // Mark that a submission attempt was made

  if (!authStore.isAuthenticated) {
    toast.error('You must be logged in to submit an application.');
    router.push({ name: 'Login' });
    return false;
  }

  if (!declarationAccepted.value) {
    toast.error('You must accept the declaration to proceed.');
    return false;
  }

  if (formData.accreditation_cycles.length === 0) {
    toast.error('Please select at least one Accreditation Cycle.');
    return false;
  }

  // Validate prerequisites
  if (availablePrerequisites.value.length > 0 && formData.prerequisites_confirmed.length !== availablePrerequisites.value.length) {
    toast.error('Please confirm all prerequisites for accreditation.');
    return false;
  }

  // Validate document uploads based on requiredApplicationDocTypes from API
  for (const docType of requiredApplicationDocTypes.value) {
    // Assuming all docTypes returned by API for 'application' category are required
    if (!isDocumentUploadedOrExisting(docType.id)) {
      toast.error(`The document "${docType.name}" is required.`);
      return false;
    }
  }

  if (!formData.application_courses || formData.application_courses.length === 0) {
    toast.error('At least one course/programme must be added.');
    return false;
  }

  if (formData.application_courses.some(c => !c.course_programme_title?.trim() || !c.level_as_per_bqf?.trim() || c.current_student_number === null || c.current_student_number < 0)) {
    toast.error('Please complete all required fields for each course/programme with valid student numbers (0 or greater).');
    return false;
  }

  return true;
};

const validateAndPromptPayment = async () => {
  if (!validateForm()) {
    isSubmitting.value = false; // Ensure isSubmitting is false if validation fails
    return;
  }

  if (!canEffectivelySubmit.value && !currentApplicationId.value) {
     toast.error("Cannot submit new application: No active accreditation cycle or user not authorized. You can save a draft.");
     isSubmitting.value = false;
     return;
  }
  isSubmitting.value = true; // Set submitting true before async operations

  if (formData.is_payment_complete) {
    // If payment already marked complete (e.g., editing a previously paid app), proceed to submit data
    await prepareAndSubmitApplicationData();
  } else if (applicationFeeAmount.value > 0 && paymentModalRef.value) {
    // If fee is applicable and modal exists, open payment modal
    paymentModalRef.value.openModal();
  } else if (applicationFeeAmount.value <= 0) {
    // If no fee or fee is zero, mark payment as complete (or not applicable) and proceed
    toast.info("No application fee is applicable or fee is zero. Proceeding with submission.");
    formData.is_payment_complete = true; // Or a specific status like 'not_applicable'
    formData.payment_status = applicationFeeAmount.value === 0 ? 'not_applicable_zero_fee' : 'not_applicable';
    await prepareAndSubmitApplicationData();
  } else {
    toast.error('Payment modal could not be opened or fee details are missing.');
    isSubmitting.value = false; // Reset submitting state
  }
};

const handlePaymentCompleted = async (paymentData) => {
  // This function is called AFTER the payment gateway interaction is successful (from PaymentModal emit)
  paymentProcessing.value = true; // Indicate payment processing is happening
  formData.payment_status = 'processing_gateway_confirmation';

  // Save application as 'pending_payment' if it's a new one, to get an ID
  // This ensures we have an application ID to link the payment to.
  if (!currentApplicationId.value && !formData.id) {
    const success = await prepareAndSubmitApplicationData(true); // Pass true for isPendingPayment
    if (!success) {
      toast.error("Failed to create initial application record before confirming payment.");
      paymentProcessing.value = false;
      isSubmitting.value = false; // Reset main submission flag
      if (paymentModalRef.value) paymentModalRef.value.closeModal();
      return;
    }
  }

  const paymentId = paymentData.paymentHash; // Assuming paymentData contains this
  const user = authStore.user;

  if (!user || !user.contact_number || !user.email || !user.cid || !user.id) {
    toast.error('Missing user information for payment processing. Please update your profile.');
    formData.payment_status = 'failed_missing_user_info';
    paymentProcessing.value = false;
    isSubmitting.value = false;
    if (paymentModalRef.value) paymentModalRef.value.closeModal();
    return;
  }

  try {
    const paymentConfirmationPayload = new FormData();
    paymentConfirmationPayload.append('refNo', paymentId);
    paymentConfirmationPayload.append('serviceCode', PAYMENT_SERVICE_CODE_ACCREDITATION);
    paymentConfirmationPayload.append('taxPayerName', user.cid); // Or institute name if more appropriate
    paymentConfirmationPayload.append('taxPayerNo', user.cid);
    paymentConfirmationPayload.append('taxPayerDocumentNo', user.cid);
    paymentConfirmationPayload.append('totalPayableAmount', applicationFeeAmount.value.toString());
    paymentConfirmationPayload.append('description', `Accreditation Application Fee - App ID: ${formData.id || 'NEW'}`);
    paymentConfirmationPayload.append('mobileNo', user.contact_number);
    paymentConfirmationPayload.append('payerEmail', user.email);
    paymentConfirmationPayload.append('user', user.id.toString());
    paymentConfirmationPayload.append('payableAmount', applicationFeeAmount.value.toString());
    paymentConfirmationPayload.append('application_no', formData.id ? formData.id.toString() : (currentApplicationId.value ? currentApplicationId.value.toString() : 'NEW_APP_PAYMENT'));
    paymentConfirmationPayload.append('app_type', 'accreditation_application');

    // This API call should ideally confirm the payment with your backend
    // and associate it with the application.
    await apiService.makeAccreditationPayment(paymentConfirmationPayload); // Or a more specific confirmPayment API

    formData.is_payment_complete = true;
    formData.payment_id_gateway = paymentId;
    formData.payment_status = 'completed';
    toast.success(`Payment confirmed (Ref: ${paymentId.substring(0, 8)}...). Finalizing application submission.`);

    // Now submit the application data with payment marked as complete
    await prepareAndSubmitApplicationData();

  } catch (error) {
    console.error('Payment confirmation/handling error:', error.response?.data || error.request || error.message || error);
    let errorMsg = 'An error occurred while confirming the payment with our system.';
    if (error.response?.data) {
      const detail = error.response.data.detail || JSON.stringify(error.response.data);
      errorMsg = `Payment Confirmation Error: ${detail}`;
    } else if (error.request) {
      errorMsg = 'Network Error: Could not reach the server to confirm payment.';
    }
    toast.error(`${errorMsg} Contact support with payment ref ${paymentId} if issue persists. Your application might be in a pending state.`);
    formData.payment_status = 'failed_confirmation_error';
    // Decide if form status should change or if user should retry
  } finally {
    paymentProcessing.value = false;
    // isSubmitting.value will be set to false by prepareAndSubmitApplicationData
    if (paymentModalRef.value) {
      paymentModalRef.value.closeModal();
    }
  }
};


const handlePaymentModalClose = () => {
  if (!formData.is_payment_complete) {
    toast.info('Payment process was cancelled or closed.');
    isSubmitting.value = false; // Reset submission flag if payment was aborted
    paymentProcessing.value = false;
  }
};

const prepareAndSubmitApplicationData = async (isPrePaymentSave = false) => {
  // isSubmitting should already be true if called from validateAndPromptPayment
  // If called directly (e.g., fee is 0), ensure isSubmitting is true
  if (!isSubmitting.value && !isPrePaymentSave) isSubmitting.value = true;


  const payload = new FormData();

  if (!instituteProfile.value?.id) {
    toast.error("Institute profile is not loaded. Cannot submit.");
    if (!isPrePaymentSave) isSubmitting.value = false;
    return false; // Indicate failure
  }
  payload.append('institute_profile', instituteProfile.value.id.toString());

  // Use active schedule if available and it's a new app, otherwise use form's stored schedule (for edits)
  if (activeSchedule.value?.id && (!currentApplicationId.value || !formData.id) ) {
    payload.append('application_schedule', activeSchedule.value.id.toString());
  } else if (formData.application_schedule) { // For edits or if activeSchedule somehow null but was loaded
    payload.append('application_schedule', formData.application_schedule.toString());
  }

  if (feeDetails.value?.id) {
    payload.append('application_fee_category', feeDetails.value.id.toString());
  } else if (formData.application_fee_category) { // For edits
     payload.append('application_fee_category', formData.application_fee_category.toString());
  }

  payload.append('accreditation_cycles', JSON.stringify(formData.accreditation_cycles));
  payload.append('prerequisites_confirmed', JSON.stringify(formData.prerequisites_confirmed));
  payload.append('is_payment_complete', formData.is_payment_complete.toString());
  payload.append('payment_status', formData.payment_status);
  if (formData.payment_id_gateway) {
    payload.append('payment_id_gateway', formData.payment_id_gateway);
  }

  // Append course details
  payload.append('application_courses_json', JSON.stringify(formData.application_courses.map(c => ({
    id: c.id || null, // Send null if it's a new course for an existing app
    course_programme_title: c.course_programme_title.trim(),
    awarding_body: c.awarding_body?.trim() || '',
    level_as_per_bqf: c.level_as_per_bqf.trim(),
    current_student_number: c.current_student_number
  }))));

  // Append document files
  formData.application_documents.forEach(doc => {
    if (doc.file) { // Only append if a new file is actually selected
      payload.append(`document_file_type_${doc.document_type}`, doc.file, doc.file_name);
      // If doc.id exists, it means this file replaces an existing one with that document_type for this app.
      // Backend logic will handle update or create for ApplicationDocument.
    }
    // If editing and doc.file is null but doc.id exists, it means user hasn't changed an existing file.
    // The backend should not delete existing files unless explicitly told (e.g., by a separate 'deleted_docs' array).
  });

  // Determine submission status
  let submissionStatus = formData.status || 'draft'; // Default to draft
  if (isPrePaymentSave) {
    submissionStatus = 'pending_payment';
  } else if (formData.is_payment_complete) {
    // If payment is complete, and current status is draft or pending, move to submitted
    if (submissionStatus === 'draft' || submissionStatus === 'pending_payment' || submissionStatus === 'not_initiated') {
        submissionStatus = 'submitted_awaits_isar'; // Or your initial post-submission status
    }
    // If already submitted_awaits_isar or further, it's an update, keep current status or let backend decide.
    // For simplicity here, we just ensure it's at least 'submitted_awaits_isar'.
    // A more complex state machine might be needed on the backend.
  }
  payload.append('status', submissionStatus);

  if (authStore.userId) {
    payload.append('user', authStore.userId.toString());
  }

  try {
    let response;
    if (currentApplicationId.value && formData.id) { // Existing application being updated
      response = await apiService.updateAccreditationApplication(formData.id, payload);
      toast.success(`Application ${isPrePaymentSave ? 'draft saved' : 'updated successfully'}!`);
    } else { // New application
      response = await apiService.createAccreditationApplication(payload);
      toast.success(`Application ${isPrePaymentSave ? 'draft created' : 'submitted successfully'}!`);
      if (response.data && response.data.id) {
        // Update local state with the new application ID
        currentApplicationId.value = response.data.id;
        formData.id = response.data.id;
        // If it was a pre-payment save, we now have an ID.
      }
    }

    if (!isPrePaymentSave) {
      clearApplicationDraft(); // Clear draft only on final successful submission
      // Navigate to a confirmation/dashboard page
      router.push({ name: 'user-accreditation-dashboard', query: { highlight: formData.id } }); // Example route
    }
    return true; // Indicate success

  } catch (error) {
    console.error('Error submitting application:', error.response?.data || error.message || error);
    let errorMessage = `Failed to ${currentApplicationId.value && formData.id ? 'update' : 'submit'} application. Please try again.`;
    if (error.response?.data) {
      const messages = [];
      if (typeof error.response.data === 'object') {
        for (const key in error.response.data) {
          if (Array.isArray(error.response.data[key])) {
            messages.push(`${key}: ${error.response.data[key].join(', ')}`);
          } else {
            messages.push(`${key}: ${String(error.response.data[key])}`);
          }
        }
        if (messages.length > 0) errorMessage = messages.join('; ');
      } else if (typeof error.response.data === 'string') {
        errorMessage = error.response.data;
      }
    }
    toast.error(errorMessage);
    return false; // Indicate failure
  } finally {
    if (!isPrePaymentSave) { // Only reset main submission flag on final attempt
        isSubmitting.value = false;
    }
    // paymentProcessing is handled in handlePaymentCompleted
  }
};


// --- Lifecycle Hooks ---
onMounted(async () => {
  loadingInitialData.value = true;
  if (!authStore.isAuthenticated) {
    toast.error("You need to be logged in to access this page.");
    router.push({ name: 'Login' }); // Make sure 'Login' is your login route name
    loadingInitialData.value = false;
    return;
  }

  try {
    // Fetch institute profile first
    const profileRes = await apiService.getMyInstituteProfile();
    if (profileRes.data) {
      instituteProfile.value = profileRes.data;
      formData.institute_profile = instituteProfile.value.id; // Store ID in formData
    } else {
      toast.error("Could not load your institute's profile. Please ensure it's set up or contact support.");
      loadingInitialData.value = false;
      // Optionally, redirect to profile setup if critical and not just informational
      // if (authStore.user?.user_type === 'institute_user') router.push({ name: 'user-accreditation-profile' });
      return;
    }

    // Fetch other necessary data in parallel
    const [scheduleRes, feeRes, docTypesRes] = await Promise.all([
      apiService.getActiveApplicationSchedule(),
      apiService.getFeeDetailsByName(ACCREDITATION_FEE_CATEGORY_NAME),
      apiService.getDocumentTypesByCategory('application') // CRITICAL: This populates upload fields
    ]);

    if (scheduleRes.data) {
      activeSchedule.value = scheduleRes.data;
      formData.application_schedule = activeSchedule.value.id; // Store ID
    } else if (!currentApplicationId.value) { // Only warn for new applications
      toast.warn("No active accreditation application cycle found. You can save a draft but may not be able to submit a new application.");
    }

    if (feeRes.data) {
      feeDetails.value = feeRes.data;
      applicationFeeAmount.value = parseFloat(feeRes.data.fee_amount);
      formData.application_fee_category = feeDetails.value.id; // Store ID
    } else {
      toast.warn('Could not load accreditation fee details. Fee might be 0 or not applicable for this application.');
      applicationFeeAmount.value = 0; // Default to 0 if not found
    }

    if (docTypesRes.data && Array.isArray(docTypesRes.data.results) && docTypesRes.data.results.length > 0) {
      requiredApplicationDocTypes.value = docTypesRes.data.results;
    } else {
      // This means "no place to upload files" might occur.
      // The message in the template will handle informing the user.
      console.warn('No document types returned for category "application" or API error.');
      requiredApplicationDocTypes.value = []; // Ensure it's an empty array
    }

    // If editing an existing application (ID in route params)
    if (currentApplicationId.value) {
      const appDataRes = await apiService.getAccreditationApplication(currentApplicationId.value);
      const appData = appDataRes.data;

      // Populate formData with existing application data
      const initialKeys = Object.keys(getInitialFormData());
      initialKeys.forEach(key => {
        if (Object.hasOwn(appData, key)) {
          if (key === 'application_documents') {
            // Map existing documents. 'file' will be null, 'file_name' shows original.
            formData.application_documents = (appData.application_documents_display || []).map(d => ({
              document_type: d.document_type, // This should be the ID of the DocumentType model
              file_name: d.document_file ? d.document_file.substring(d.document_file.lastIndexOf('/') + 1) : 'Previously Uploaded',
              file: null, // File object is null until user re-selects
              id: d.id // ID of the ApplicationDocument instance
            }));
          } else if (key === 'application_courses') {
            formData.application_courses = (appData.application_courses_display && appData.application_courses_display.length > 0
              ? appData.application_courses_display.map(c => ({ ...c, temp_id: courseTempIdCounter++ })) // Add temp_id for keys
              : getInitialFormData().application_courses); // Default if empty
          } else if (key === 'accreditation_cycles' || key === 'prerequisites_confirmed') {
             // Ensure these are arrays, even if API returns null or malformed
            formData[key] = Array.isArray(appData[key]) ? appData[key] : [];
          } else if (key === 'institute_profile' && appData.institute_profile && typeof appData.institute_profile === 'object') {
            formData.institute_profile = appData.institute_profile.id; // Store ID
          } else if (key === 'application_schedule' && appData.application_schedule && typeof appData.application_schedule === 'object') {
            formData.application_schedule = appData.application_schedule.id; // Store ID
          } else if (key === 'application_fee_category' && appData.application_fee_category && typeof appData.application_fee_category === 'object') {
            formData.application_fee_category = appData.application_fee_category.id; // Store ID
          } else {
            formData[key] = appData[key];
          }
        }
      });
      formData.id = appData.id; // Ensure main application ID is set
      declarationAccepted.value = true; // Assume declaration was accepted if editing a submitted/paid app
      // If app is already submitted and paid, reflect that
      if (appData.is_payment_complete) formData.is_payment_complete = true;
      if (appData.payment_id_gateway) formData.payment_id_gateway = appData.payment_id_gateway;
      if (appData.payment_status) formData.payment_status = appData.payment_status;


      toast.info(`Editing Application: ${appData.application_uid?.hex?.substring(0, 8) || appData.id}. Review all fields. Re-upload files if changes are needed.`);
    } else {
      // Not editing, try to load from local draft
      loadApplicationDraft();
    }

  } catch (error) {
    toast.error('Failed to load initial data for the application form. Please try refreshing the page.');
    console.error('Error in onMounted:', error.response?.data || error.message || error);
    // Potentially set a global error state or redirect
  } finally {
    loadingInitialData.value = false;
  }
});

// --- Simple Reusable FormField Component (inline for brevity, consider moving to own file) ---
// This component is already defined in your script, so it's fine as is.
// Make sure it's correctly registered if it were in a separate file.
const FormField = {
  props: ['label', 'value', 'isReadonly'],
  template: `
    <div>
      <label class="form-label">{{ label }}</label>
      <input type="text" :value="value || 'N/A'" :readonly="isReadonly"
             class="form-input" :class="{ 'bg-gray-100 cursor-not-allowed': isReadonly }"/>
    </div>
  `
};
</script>

<style scoped>
.form-section { @apply mb-10; }
.form-section-title { @apply text-xl font-semibold text-gray-800 border-b border-gray-300 pb-3 mb-6; }
.form-section-subtitle { @apply mt-1 text-sm text-gray-600 mb-4; }
.form-label { @apply block text-sm font-medium text-gray-700 mb-1; }
.form-label.required::after { content: ' *'; color: theme('colors.red.500'); }
.form-label-sm { @apply block text-xs font-medium text-gray-600 mb-1; }
.form-label-sm.required::after { content: ' *'; color: theme('colors.red.500'); }

.form-input, .form-select, .form-textarea {
  @apply block w-full rounded-md border-gray-300 shadow-sm sm:text-sm p-2.5;
  @apply focus:ring-indigo-500 focus:border-indigo-500;
  @apply disabled:bg-gray-100 disabled:cursor-not-allowed; /* Added disabled styles */
}
.form-checkbox {
  @apply h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500;
  @apply disabled:bg-gray-200 disabled:border-gray-300 disabled:cursor-not-allowed; /* Added disabled styles */
}
.form-file-input {
  @apply mt-1 block w-full text-sm text-gray-500 border border-gray-300 p-2 rounded-md cursor-pointer;
  @apply file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold;
  @apply file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100;
  @apply disabled:opacity-50 disabled:cursor-not-allowed; /* Added disabled styles */
}

.btn-primary {
  @apply inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 transition-colors;
  @apply hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500;
  @apply disabled:opacity-50 disabled:cursor-not-allowed; /* Added disabled styles */
}
.btn-secondary {
  @apply inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md shadow-sm text-gray-700 bg-white transition-colors;
  @apply hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500;
  @apply disabled:opacity-50 disabled:cursor-not-allowed; /* Added disabled styles */
}
</style>