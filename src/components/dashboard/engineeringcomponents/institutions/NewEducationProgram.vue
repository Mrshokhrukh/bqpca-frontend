<template>
  <div class="p-8 rounded-xl bg-gray-50 min-h-screen">
    <h2 class="text-3xl font-bold text-gray-800 mb-8">New Educational Programme Application</h2>

    <!-- Loading state -->
    <div v-if="isLoading" class="flex justify-center items-center my-16">
      <Loader class="inline-block animate-spin text-blue-600 w-8 h-8" />
      <p class="ml-3 text-lg text-gray-600">Loading institute data...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="apiError" class="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
      <p class="font-medium">Error:</p>
      <p class="mt-1">{{ errorMessage }}</p>
      <p class="mt-2 text-sm">Please try again later or contact support.</p>
    </div>

    <!-- No institute found -->
    <div v-else-if="!userInstitute && !isLoading"
      class="bg-yellow-50 border border-yellow-200 text-yellow-700 p-4 rounded-lg mb-6">
      <p class="font-medium">No institute information found</p>
      <p class="mt-2">Please ensure you have registered your institute before applying for a new educational program.
      </p>
    </div>

    <!-- Form -->
    <form v-else @submit.prevent="handleSubmit" class="space-y-8">

      <!-- Proponent Details (Read Only) -->
      <section class="p-6 bg-white rounded-lg shadow">
        <h3 class="text-2xl font-semibold text-gray-700 mb-6 border-b pb-2">Proponent Details</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-600">
              Training Institute Name
            </label>
            <div class="mt-2 px-3 py-2 bg-gray-100 rounded-md border border-gray-200 text-gray-700">
              {{ userInstitute.name_of_institution || 'N/A' }}
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-600">
              Country
            </label>
            <div class="mt-2 px-3 py-2 bg-gray-100 rounded-md border border-gray-200 text-gray-700">
              {{ userInstitute.country || 'N/A' }}
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-600">
              Dzongkhag/Throme
            </label>
            <div class="mt-2 px-3 py-2 bg-gray-100 rounded-md border border-gray-200 text-gray-700">
              {{ userInstitute.dzongkhag || 'N/A' }}
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-600">
              City/Gewog
            </label>
            <div class="mt-2 px-3 py-2 bg-gray-100 rounded-md border border-gray-200 text-gray-700">
              {{ userInstitute.gewog || 'N/A' }}
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-600">
              Address/Location
            </label>
            <div class="mt-2 px-3 py-2 bg-gray-100 rounded-md border border-gray-200 text-gray-700">
              {{ userInstitute.address || 'N/A' }}
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-600">
              Contact No.
            </label>
            <div class="mt-2 px-3 py-2 bg-gray-100 rounded-md border border-gray-200 text-gray-700">
              {{ userInstitute.contact_no || 'N/A' }}
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-600">
              Email Address
            </label>
            <div class="mt-2 px-3 py-2 bg-gray-100 rounded-md border border-gray-200 text-gray-700">
              {{ userInstitute.email_address || 'N/A' }}
            </div>
          </div>
        </div>
      </section>

      <!-- Head of Institution Details (Read Only) -->
      <section class="p-6 bg-white rounded-lg shadow">
        <h3 class="text-2xl font-semibold text-gray-700 mb-6 border-b pb-2">Head of Institution Details</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-600">
              Name
            </label>
            <div class="mt-2 px-3 py-2 bg-gray-100 rounded-md border border-gray-200 text-gray-700">
              {{ userInstitute.head_of_institution_name || 'N/A' }}
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-600">
              Mobile Number
            </label>
            <div class="mt-2 px-3 py-2 bg-gray-100 rounded-md border border-gray-200 text-gray-700">
              {{ userInstitute.head_of_institution_phone_number || 'N/A' }}
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-600">
              Email Address
            </label>
            <div class="mt-2 px-3 py-2 bg-gray-100 rounded-md border border-gray-200 text-gray-700">
              {{ userInstitute.head_of_institution_email || 'N/A' }}
            </div>
          </div>
        </div>
      </section>

      <!-- Website (Read Only) -->
      <section class="p-6 bg-white rounded-lg shadow">
        <h3 class="text-2xl font-semibold text-gray-700 mb-6 border-b pb-2">Website</h3>
        <div>
          <label class="block text-sm font-medium text-gray-600">
            Website URL
          </label>
          <div class="mt-2 px-3 py-2 bg-gray-100 rounded-md border border-gray-200 text-gray-700">
            {{ userInstitute.website || 'N/A' }}
          </div>
        </div>
      </section>


      <!-- Proposal & Review Details - Editable by user -->
      <section class="p-6 bg-white rounded-lg shadow">
        <h3 class="text-2xl font-semibold text-gray-700 mb-6 border-b pb-2">Proposal & Review Details</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <!-- Course Title -->
          <div>
            <label for="proposalTitle" class="block text-sm font-medium text-gray-600">
              Course Title <span class="text-red-500">*</span>
            </label>
            <input type="text" id="proposalTitle" v-model.trim="formData.course_title" required
              :class="['mt-2 block w-full px-3 py-2 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm', validationErrors.course_title ? 'border-red-500' : 'border-gray-300']" />
            <p v-if="validationErrors.course_title" class="mt-1 text-sm text-red-600">{{ validationErrors.course_title[0] }}</p>
          </div>

          <!-- Duration -->
          <div>
            <label for="duration" class="block text-sm font-medium text-gray-600">
              Duration (in months) <span class="text-red-500">*</span>
            </label>
            <input type="number" id="duration" v-model.number="formData.duration_in_months" required min="1"
              :class="['mt-2 block w-full px-3 py-2 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm', validationErrors.duration_in_months ? 'border-red-500' : 'border-gray-300']" />
            <p v-if="validationErrors.duration_in_months" class="mt-1 text-sm text-red-600">{{ validationErrors.duration_in_months[0] }}</p>
          </div>

          <!-- Commencement Date -->
          <div>
            <label for="commencementDate" class="block text-sm font-medium text-gray-600">
              Proposed Commencement Date <span class="text-red-500">*</span>
            </label>
            <input type="date" id="commencementDate" v-model="formData.commencement_date" required :min="todayDate"
              :class="['mt-2 block w-full px-3 py-2 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm', validationErrors.commencement_date ? 'border-red-500' : 'border-gray-300']" />
            <p v-if="validationErrors.commencement_date" class="mt-1 text-sm text-red-600">{{ validationErrors.commencement_date[0] }}</p>
          </div>

          <!-- Attachments (User Upload) -->
          <div>
            <label for="attachments" class="block text-sm font-medium text-gray-600">
              Proposal Attachments (if any)
            </label>
            <input type="file" id="attachments" @change="handleFileUpload"
              class="mt-2 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer" />
             <p class="mt-1 text-xs text-gray-500">Max file size: 5MB. Allowed types: PDF, DOC, DOCX, JPG, PNG.</p>
            <p v-if="selectedFileName" class="mt-1 text-sm text-green-700 font-medium">Selected: {{ selectedFileName }}</p>
             <p v-if="validationErrors.institute_attachments" class="mt-1 text-sm text-red-600">{{ validationErrors.institute_attachments[0] }}</p>
          </div>

          <!-- Valid Till -->
          <div>
            <label for="validTill" class="block text-sm font-medium text-gray-600">
              Valid Till <span class="text-red-500">*</span>
            </label>
            <input type="date" id="validTill" v-model="formData.valid_till" required :min="todayDate"
              :class="['mt-2 block w-full px-3 py-2 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm', validationErrors.valid_till ? 'border-red-500' : 'border-gray-300']" />
            <p v-if="validationErrors.valid_till" class="mt-1 text-sm text-red-600">{{ validationErrors.valid_till[0] }}</p>
          </div>

          <!-- Payment ID -->
          <div>
            <label for="paymentId" class="block text-sm font-medium text-gray-600">
              Payment ID <span class="text-red-500">*</span>
            </label>
            <input type="text" id="paymentId" v-model.trim="formData.payment_id" required
              :class="['mt-2 block w-full px-3 py-2 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm', validationErrors.payment_id ? 'border-red-500' : 'border-gray-300']" />
            <p v-if="validationErrors.payment_id" class="mt-1 text-sm text-red-600">{{ validationErrors.payment_id[0] }}</p>
          </div>

          <!-- ***** NEWLY REQUIRED FIELDS (Added based on API errors) ***** -->
          <div>
            <label for="insRenewalReviewName" class="block text-sm font-medium text-gray-600">
              Renewal Review Name <span class="text-red-500">*</span>
              <!-- Adjust label text based on actual meaning -->
            </label>
            <input type="text" id="insRenewalReviewName" v-model.trim="formData.ins_renewal_review_name" required
              :class="['mt-2 block w-full px-3 py-2 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm', validationErrors.ins_renewal_review_name ? 'border-red-500' : 'border-gray-300']" />
            <p v-if="validationErrors.ins_renewal_review_name" class="mt-1 text-sm text-red-600">{{ validationErrors.ins_renewal_review_name[0] }}</p>
          </div>

           <!-- Inspection Report File Upload (Keep as file upload based on previous error) -->
           <div>
            <label for="insReport" class="block text-sm font-medium text-gray-600">
              Inspection Report File (if applicable)
              <!-- Add required span if this also becomes mandatory -->
            </label>
            <input type="file" id="insReport" @change="handleInsReportUpload"
              class="mt-2 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer" />
              <p class="mt-1 text-xs text-gray-500">Upload if you have a pre-inspection report.</p>
             <p v-if="selectedInsReportFileName" class="mt-1 text-sm text-green-700 font-medium">Selected: {{ selectedInsReportFileName }}</p>
             <p v-if="validationErrors.ins_report" class="mt-1 text-sm text-red-600">{{ validationErrors.ins_report[0] }}</p>
           </div>


          <!-- Review Summary (Text Area - Spanning 2 cols) -->
          <div class="md:col-span-2">
            <label for="insReviewSummary" class="block text-sm font-medium text-gray-600">
              Review Summary <span class="text-red-500">*</span>
               <!-- Adjust label text based on actual meaning -->
            </label>
            <textarea id="insReviewSummary" v-model.trim="formData.ins_review_summary" rows="4" required
              :class="['mt-2 block w-full px-3 py-2 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm', validationErrors.ins_review_summary ? 'border-red-500' : 'border-gray-300']"></textarea>
            <p v-if="validationErrors.ins_review_summary" class="mt-1 text-sm text-red-600">{{ validationErrors.ins_review_summary[0] }}</p>
          </div>

          <!-- Inspection Remarks (Text Area - Spanning 2 cols) -->
          <div class="md:col-span-2">
             <label for="insRemarks" class="block text-sm font-medium text-gray-600">
              Inspection Remarks <span class="text-red-500">*</span>
               <!-- Adjust label text based on actual meaning -->
            </label>
            <textarea id="insRemarks" v-model.trim="formData.ins_remarks" rows="4" required
              :class="['mt-2 block w-full px-3 py-2 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm', validationErrors.ins_remarks ? 'border-red-500' : 'border-gray-300']"></textarea>
            <p v-if="validationErrors.ins_remarks" class="mt-1 text-sm text-red-600">{{ validationErrors.ins_remarks[0] }}</p>
             <p class="mt-1 text-xs text-gray-500">Provide remarks related to the inspection or review process.</p>
          </div>
          <!-- ***** END OF NEWLY REQUIRED FIELDS ***** -->

        </div>

        <!-- General Remarks (User Input - Likely Optional) -->
        <div class="mt-6 md:col-span-2">
          <label for="remarks" class="block text-sm font-medium text-gray-600">
            General Remarks (Optional)
          </label>
          <textarea id="remarks" v-model="formData.remarks" rows="3"
            class="mt-2 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Add any additional comments here..."></textarea>
             <p v-if="validationErrors.remarks" class="mt-1 text-sm text-red-600">{{ validationErrors.remarks[0] }}</p>
        </div>
      </section>

      <!-- Declaration -->
      <div class="flex items-start p-6 bg-white rounded-lg shadow">
        <div class="flex items-center h-5">
          <input id="declaration" aria-describedby="declaration-description" type="checkbox"
            v-model="formData.ins_declaration" required
            class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded" />
        </div>
        <div class="ml-3 text-sm">
          <label for="declaration" class="font-medium text-gray-700">Declaration <span
              class="text-red-500">*</span></label>
          <p id="declaration-description" class="text-gray-500">
            I hereby declare that the information provided above is true and correct to the best of my knowledge and belief.
          </p>
           <p v-if="validationErrors.ins_declaration" class="mt-1 text-sm text-red-600">{{ validationErrors.ins_declaration[0] }}</p>
        </div>
      </div>

      <!-- Buttons -->
      <div class="flex justify-end space-x-4 pt-6 border-t mt-8">
        <button type="button"
          class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          @click="handleCancel" :disabled="isSubmitting">
          Cancel
        </button>
        <button type="button"
          class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-700 bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
          @click="handleSaveDraft" :disabled="isSubmitting">
          <Loader v-if="isSubmitting && draftSaveInProgress" class="animate-spin -ml-1 mr-2 h-5 w-5 text-gray-700" />
          {{ isSubmitting && draftSaveInProgress ? 'Saving...' : 'Save as Draft' }}
        </button>
        <button type="submit" :disabled="isSubmitting || !formData.ins_declaration"
          class="inline-flex justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          :class="{ 'opacity-50 cursor-not-allowed': isSubmitting || !formData.ins_declaration }">
          <Loader v-if="isSubmitting && !draftSaveInProgress" class="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
          {{ isSubmitting && !draftSaveInProgress ? 'Submitting...' : 'Submit Application' }}
        </button>
      </div>

       <!-- Display general API errors not tied to a specific field -->
        <div v-if="validationErrors.detail || (typeof validationErrors === 'string')" class="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            <p class="font-medium">Submission Error:</p>
            <p>{{ validationErrors.detail || validationErrors }}</p>
        </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore'; // Adjust path as needed
import { useToast } from 'vue-toastification';
import apiService from '@/services/services'; // Adjust path as needed
import { Loader } from 'lucide-vue-next';

const router = useRouter();
const authStore = useAuthStore();
const toast = useToast();

const userInstitute = ref(null);
const isLoading = ref(true);
const isSubmitting = ref(false);
const draftSaveInProgress = ref(false); // Separate flag for draft save visual feedback
const apiError = ref(false);
const errorMessage = ref('');
const validationErrors = ref({}); // Stores field-specific validation errors

// Refs for selected files
const selectedFile = ref(null); // For institute_attachments
const selectedFileName = ref('');
const selectedInsReportFile = ref(null); // For ins_report
const selectedInsReportFileName = ref('');

// --- Form Data State ---
const formData = ref({
  course_title: '',
  duration_in_months: null,
  commencement_date: '',
  remarks: '', // General remarks (optional likely)
  ins_declaration: false,

  // --- Fields required by the API (based on error messages) ---
  valid_till: '',
  payment_id: '',
  ins_renewal_review_name: '', // REQUIRED - Initialize as empty string
  ins_review_summary: '',    // REQUIRED - Initialize as empty string
  ins_remarks: '',           // REQUIRED - Initialize as empty string

  // --- Optional/Reviewer fields (or file placeholders) ---
  ins_report: null, // File Placeholder; actual file handled by selectedInsReportFile

  // --- Fields with default values or handled elsewhere ---
  institute_attachments: null, // File Placeholder; handled by selectedFile
  ins_review_decision: 'Pending', // Default status
  ins_reason_if_rejected: '',
  is_active: true,
  institute: null,       // Will be populated from fetched institute data
  institute_name: ''     // Will be populated from fetched institute data
});

// Get today's date for min attribute on date inputs
const todayDate = computed(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
});


const userCid = computed(() => {
  // Ensure user data is loaded and has CID
  return authStore.user?.cid || '';
});

const fetchInstituteData = async () => {
  if (!userCid.value) {
    errorMessage.value = 'User information not available. Please log in again.';
    apiError.value = true;
    isLoading.value = false;
    console.error("User CID not found in auth store.");
    return;
  }

  isLoading.value = true;
  apiError.value = false;
  errorMessage.value = ''; // Clear previous error

  try {
    // Assuming getEpcInstitutes gets ALL institutes and we need to filter
    const response = await apiService.getEpcInstitutes(); // Adjust if there's a more direct endpoint

    if (response && response.data && Array.isArray(response.data.results)) {
       // Find institute matching the logged-in user's CID (case-insensitive comparison)
      const foundInstitute = response.data.results.find(institute =>
        institute.CID && userCid.value && institute.CID.toLowerCase() === userCid.value.toLowerCase()
      );

      if (foundInstitute) {
        userInstitute.value = foundInstitute;
        // Populate formData with non-editable institute details
        formData.value.institute = userInstitute.value.id; // Assuming 'id' is the primary key
        formData.value.institute_name = userInstitute.value.name_of_institution;
      } else {
        errorMessage.value = 'No registered institute found associated with your account (CID). Please register your institute first.';
        // Keep apiError as false, this is a specific "not found" state, not a connection error
        userInstitute.value = null; // Explicitly set to null
      }
    } else {
      console.error('Invalid response structure from getEpcInstitutes:', response);
      errorMessage.value = 'Failed to retrieve institute data due to an unexpected response format.';
      apiError.value = true;
    }
  } catch (error) {
    console.error('Error fetching institute data:', error);
     errorMessage.value = error.response?.data?.message || error.response?.data?.detail || 'An error occurred while fetching institute data. Please check your connection and try again.';
    apiError.value = true;
  } finally {
    isLoading.value = false;
  }
};

// --- File Handling ---
const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    // Basic validation (optional)
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error("Proposal attachment file size exceeds 5MB limit.");
        event.target.value = ''; // Clear the input
        selectedFile.value = null;
        selectedFileName.value = '';
        return;
    }
    selectedFile.value = file;
    selectedFileName.value = file.name;
  } else {
    selectedFile.value = null;
    selectedFileName.value = '';
  }
};

const handleInsReportUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
     if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error("Inspection report file size exceeds 5MB limit.");
        event.target.value = ''; // Clear the input
        selectedInsReportFile.value = null;
        selectedInsReportFileName.value = '';
        return;
    }
    selectedInsReportFile.value = file;
    selectedInsReportFileName.value = file.name;
  } else {
    selectedInsReportFile.value = null;
    selectedInsReportFileName.value = '';
  }
};

// --- Form Validation ---
const validateForm = () => {
  const errors = {};
  validationErrors.value = {}; // Clear previous errors

  if (!formData.value.course_title?.trim()) errors.course_title = ['Proposal title is required'];
  if (!formData.value.duration_in_months || formData.value.duration_in_months <= 0) errors.duration_in_months = ['Duration must be a positive number'];
  if (!formData.value.commencement_date) errors.commencement_date = ['Commencement date is required'];
  else if (new Date(formData.value.commencement_date) < new Date(todayDate.value)) errors.commencement_date = ['Commencement date cannot be in the past'];
  if (!formData.value.valid_till) errors.valid_till = ['Valid till date is required'];
   else if (new Date(formData.value.valid_till) < new Date(todayDate.value)) errors.valid_till = ['Valid till date cannot be in the past'];
  if (!formData.value.payment_id?.trim()) errors.payment_id = ['Payment ID is required'];

  // ***** VALIDATE NEWLY REQUIRED FIELDS *****
  if (!formData.value.ins_renewal_review_name?.trim()) errors.ins_renewal_review_name = ['Renewal review name is required'];
  if (!formData.value.ins_review_summary?.trim()) errors.ins_review_summary = ['Review summary is required'];
  if (!formData.value.ins_remarks?.trim()) errors.ins_remarks = ['Inspection remarks are required'];

  // Validate Declaration
   if (!formData.value.ins_declaration) errors.ins_declaration = ['You must accept the declaration'];


  if (Object.keys(errors).length > 0) {
      validationErrors.value = errors;
      return false;
  }

  return true;
};

// --- Form Submission Logic ---
const prepareFormData = (status = 'Pending') => {
    const submissionData = new FormData();

    // Append non-file fields from formData, skipping nulls/undefined
    // Empty strings ('') ARE appended for the newly required text fields
    Object.keys(formData.value).forEach(key => {
        // Skip file placeholders explicitly
        if (key === 'institute_attachments' || key === 'ins_report') {
            return;
        }

        const value = formData.value[key];

        // Append if value is not null or undefined
        // This allows sending empty strings '' for required text fields
        if (value !== null && value !== undefined) {
             // Handle boolean specifically for FormData
             if (typeof value === 'boolean') {
                 submissionData.append(key, value ? 'true' : 'false');
             }
             // Convert number explicitly (duration)
             else if (key === 'duration_in_months') {
                  submissionData.append(key, Number(value));
             }
             // Append others as they are (including empty strings)
             else {
                submissionData.append(key, value);
            }
        }
        // If API strictly needs null for optional empty fields (like 'remarks'), add logic here
        // else if (key === 'remarks' && value === '') {
        //     submissionData.append(key, null); // Or omit entirely if API prefers
        // }
    });

     // Override status if saving as draft or ensure Pending for submit
    submissionData.set('ins_review_decision', status);

    // Append files if they exist
    if (selectedFile.value) {
        submissionData.append('institute_attachments', selectedFile.value, selectedFile.value.name);
    }
    if (selectedInsReportFile.value) {
        submissionData.append('ins_report', selectedInsReportFile.value, selectedInsReportFile.value.name);
    }

     // Log for debugging (remove in production)
     console.log(`--- FormData being sent (Status: ${status}) ---`);
     for (let [key, value] of submissionData.entries()) {
         console.log(`${key}:`, value instanceof File ? `File: ${value.name}` : value);
     }
     console.log("--------------------------");


    return submissionData;
}

const handleSubmit = async () => {
  draftSaveInProgress.value = false; // Ensure draft flag is off
  if (!validateForm()) {
    toast.error('Please correct the errors highlighted in the form.');
    // Scroll to the first error (optional enhancement)
     const firstError = document.querySelector('.border-red-500');
     if (firstError) {
         firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
     }
    return;
  }
   // Double check declaration
   if (!formData.value.ins_declaration) {
    toast.error('Please accept the declaration before submitting.');
    // Attempt to focus declaration checkbox if possible
    document.getElementById('declaration')?.focus();
    return;
  }


  isSubmitting.value = true;
  validationErrors.value = {}; // Clear previous errors

  try {
    const finalFormData = prepareFormData('Pending'); // Status 'Pending' for final submit
    await apiService.createEpcCourseDetail(finalFormData); // Use your actual API service method

    toast.success('Educational programme application submitted successfully!');
    router.push('/admin/institutions/engineering_certification/dashboard');  
  } catch (error) {
    console.error('Error submitting form:', error);
    // Parse API validation errors
    if (error.response && error.response.data) {
         console.error('API Error Response:', error.response.data);
         const errors = error.response.data.errors || error.response.data; // Adjust based on your API's error structure

        if (typeof errors === 'object' && errors !== null && !Array.isArray(errors)) {
             // Handle specific field errors
             validationErrors.value = errors;
             toast.error('Submission failed. Please review the errors shown on the form.');

             // Handle general non-field errors (like 'detail' in DRF)
             if (errors.detail) {
                 // Display general error message somewhere if needed
                 // Assign to validationErrors for display at the bottom
                 validationErrors.value.detail = errors.detail;
             } else if (!Object.keys(errors).some(k => Object.keys(formData.value).includes(k) || k === 'institute_attachments' || k === 'ins_report')) {
                 // If error object exists but has no keys matching known form fields, display it as general error
                 validationErrors.value.detail = `An unexpected error occurred: ${JSON.stringify(errors)}`;
             }

        } else if (typeof errors === 'string') {
             // Handle simple string error messages
            validationErrors.value = { detail: errors }; // Assign to 'detail' for generic display
            toast.error(errors);
        }
         else {
             toast.error('An unexpected error occurred during submission. Please try again.');
              validationErrors.value = { detail: 'An unexpected error occurred.' };
         }
    } else {
      // Network error or other issues
      toast.error('Failed to connect to the server. Please check your network and try again.');
       validationErrors.value = { detail: 'Network error or server unavailable.' };
    }
  } finally {
    isSubmitting.value = false;
  }
};

const handleSaveDraft = async () => {
    // Basic check: require at least a course title (Optional)
    if (!formData.value.course_title?.trim()) {
        toast.warn('Please enter at least a Course Title to save a draft.');
        document.getElementById('proposalTitle')?.focus();
        return;
    }

    isSubmitting.value = true; // Use same flag to disable buttons
    draftSaveInProgress.value = true; // Set draft flag for UI feedback
    validationErrors.value = {}; // Clear previous errors

    try {
        const draftFormData = prepareFormData('Draft'); // Prepare with 'Draft' status
        await apiService.createEpcCourseDetail(draftFormData); // Use the same endpoint

        toast.success('Draft saved successfully!');
        // Optional: Stay on the page or redirect
        // router.push('/mhpc/draft-applications');

    } catch (error) {
        console.error('Error saving draft:', error);
        if (error.response && error.response.data) {
             const errors = error.response.data.errors || error.response.data;
             let errorMsg = 'Failed to save draft.';
             if (typeof errors === 'object' && errors !== null && errors.detail) {
                 errorMsg = `Failed to save draft: ${errors.detail}`;
             } else if (typeof errors === 'string') {
                 errorMsg = `Failed to save draft: ${errors}`;
             } else {
                 // Attempt to show field errors even for draft save
                 if (typeof errors === 'object' && errors !== null && !Array.isArray(errors)) {
                     validationErrors.value = errors;
                     errorMsg = 'Failed to save draft due to validation issues.';
                 } else {
                    errorMsg = 'An unknown error occurred while saving the draft.';
                 }
             }
             toast.error(errorMsg);
             if (typeof errors === 'object' && errors !== null) { validationErrors.value = errors; }
             else { validationErrors.value = { detail: errorMsg }; }

        } else {
            toast.error('An error occurred while saving the draft. Please check network and try again.');
             validationErrors.value = { detail: 'Network error or server unavailable.' };
        }
    } finally {
        isSubmitting.value = false;
        draftSaveInProgress.value = false; // Reset draft flag
    }
};


const handleCancel = () => {
  // Check if form has data (more robust check)
  const hasData = Object.keys(formData.value).some(key => {
    const value = formData.value[key];
    // Check against initial values or non-empty/non-null/non-false state
    return value !== '' && value !== null && value !== false && !(Array.isArray(value) && value.length === 0);
  }) || selectedFile.value || selectedInsReportFile.value;


  if (hasData) {
      if (confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
           router.go(-1); // Or redirect: router.push('/dashboard');
      }
  } else {
      router.go(-1);
  }
};

// Fetch institute data when the component mounts
onMounted(fetchInstituteData);

</script>

<style scoped>
/* Style for required fields indicator */
label span.text-red-500 {
    margin-left: 2px;
}

/* Style for disabled button */
button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Improve file input appearance */
input[type="file"] {
  color: #64748b; /* text-slate-500 */
}
input[type="file"]::file-selector-button {
    margin-right: 1rem;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem; /* rounded-md */
    border-width: 0px;
    font-size: 0.875rem; /* text-sm */
    font-weight: 600; /* font-semibold */
    background-color: #eef2ff; /* bg-indigo-50 */
    color: #4338ca; /* text-indigo-700 */
    cursor: pointer;
    transition: background-color 0.2s ease-in-out;
}

input[type="file"]::file-selector-button:hover {
     background-color: #e0e7ff; /* hover:bg-indigo-100 */
}

/* Style for inputs with validation errors */
.border-red-500 {
    border-color: #ef4444; /* Tailwind red-500 */
}
.border-red-500:focus {
    border-color: #ef4444;
    box-shadow: 0 0 0 1px #ef4444;
}

</style>