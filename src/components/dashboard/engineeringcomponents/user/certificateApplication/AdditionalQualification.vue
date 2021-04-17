<template>
  <div class="mx-auto px-4 py-8 h-full flex flex-col">
    <!-- Form Header -->
    <div class="bg-gradient-to-r from-indigo-100 via-blue-50 to-indigo-100 rounded-xl p-8 mb-10">
      <h2 class="text-3xl font-bold text-gray-900 mb-3 text-center">Additional Qualification</h2>
      <p class="text-gray-600 text-center max-w-2xl mx-auto">
        Complete the form below to apply for additional qualification.
      </p>
    </div>

    <!-- Confirmation Modal -->
    <TransitionRoot as="template" :show="isConfirmationModalOpen">
      <Dialog as="div" class="relative z-50" @close="isConfirmationModalOpen = false">
        <TransitionChild
          as="template"
          enter="ease-out duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="ease-in duration-200"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </TransitionChild>

        <div class="fixed inset-0 z-50 w-screen overflow-y-auto">
          <div
            class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
          >
            <TransitionChild
              as="template"
              enter="ease-out duration-300"
              enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enter-to="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leave-from="opacity-100 translate-y-0 sm:scale-100"
              leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <DialogPanel
                class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6"
              >
                <div>
                  <div
                    class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100"
                  >
                    <svg
                      class="h-6 w-6 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M4.5 12.75l6 6 9-13.5"
                      />
                    </svg>
                  </div>
                  <div class="mt-3 text-center sm:mt-5">
                    <DialogTitle as="h3" class="text-base font-semibold leading-6 text-gray-900">
                      Confirm Submission
                    </DialogTitle>
                    <div class="mt-2">
                      <p class="text-sm text-gray-500">
                        Are you sure you want to submit the application? Please review all
                        information before proceeding.
                      </p>
                    </div>
                  </div>
                </div>
                <div class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                  <button
                    type="button"
                    class="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
                    :disabled="isSubmitting"
                    @click="handleSubmitActual"
                  >
                    {{ isSubmitting ? 'Submitting...' : 'Confirm' }}
                  </button>
                  <button
                    type="button"
                    class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                    :disabled="isSubmitting"
                    @click="isConfirmationModalOpen = false"
                  >
                    Cancel
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <form
      @submit.prevent="handleSubmit"
      class="bg-white border rounded-xl shadow-sm p-6 flex-1 overflow-y-auto"
    >
      <!-- Step Header -->
      <h3 class="text-lg font-semibold text-gray-900 my-4">Addition Qualification Registration</h3>

      <!-- Application Selection -->
      <div class="mb-6">
        <label for="application" class="block text-sm font-medium text-gray-700 required"
          >Your Application:</label
        >

        <!-- Simplified Application Display -->
        <input
          type="text"
          id="application"
          class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 bg-gray-100"
          :value="
            applications.length >= 1
              ? `${applications[0].registration_no} - ${applications[0].full_name}`
              : 'Loading or No Application Found...'
          "
          readonly
          required
        />

        <span v-if="errors.application" class="text-sm text-red-500 mt-1">{{
          errors.application
        }}</span>
      </div>

      <!-- Qualification Details Section -->
      <div class="mt-12">
        <div class="bg-gray-50 p-6 rounded-xl border border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Qualification Details</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
            <!-- Qualification Type -->
            <div class="col-span-1">
              <label class="block text-sm font-medium text-gray-700 required"
                >Qualification Type</label
              >
              <select
                v-model="localFormData.qualification_type"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
                required
              >
                <option disabled value="">Select Qualification Type</option>
                <option v-for="type in qualificationTypes" :key="type.id" :value="type.id">
                  {{ type.qualification_type_name }}
                </option>
              </select>
              <span v-if="errors.qualification_type" class="text-sm text-red-500 mt-1">{{
                errors.qualification_type
              }}</span>
            </div>

            <!-- Qualification Name -->
            <div class="col-span-1">
              <label class="block text-sm font-medium text-gray-700 required"
                >Qualification Name</label
              >
              <select
                v-model="localFormData.qualification_name"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
                required
              >
                <option disabled value="">Select Qualification Name</option>
                <option
                  v-for="qualification in qualifications"
                  :key="qualification.id"
                  :value="qualification.id"
                >
                  {{ qualification.qualification }}
                </option>
              </select>
              <span v-if="errors.qualification_name" class="text-sm text-red-500 mt-1">{{
                errors.qualification_name
              }}</span>
            </div>

            <!-- Institute/University -->
            <div class="col-span-1">
              <label class="block text-sm font-medium text-gray-700 required"
                >Institute/University</label
              >
              <select
                v-model="localFormData.institute"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
                required
              >
                <option disabled value="">Select Institute/University</option>
                <option
                  v-for="university in universities"
                  :key="university.id"
                  :value="university.id"
                >
                  {{ university.country }}, {{ university.university }},
                  {{ university.institute_name }}
                </option>
              </select>
              <span v-if="errors.institute" class="text-sm text-red-500 mt-1">{{
                errors.institute
              }}</span>
            </div>

            <!-- Year of Completion -->
            <div class="col-span-1">
              <label class="block text-sm font-medium text-gray-700 required"
                >Year of Completion</label
              >
              <input
                type="number"
                v-model="localFormData.year_of_completion"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
                placeholder="YYYY"
                min="1950"
                :max="new Date().getFullYear()"
                required
              />
              <span v-if="errors.year_of_completion" class="text-sm text-red-500 mt-1">{{
                errors.year_of_completion
              }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Documents Section -->
      <div class="mt-12">
        <div class="bg-gray-50 p-6 rounded-xl border border-gray-200">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Supporting Documents</h3>
          <div class="space-y-4">
            <div
              v-for="(doc, index) in supportingDocuments"
              :key="index"
              class="flex items-start space-x-4 bg-white p-4 rounded-lg border border-gray-100"
            >
              <div class="w-1/3">
                 <label :for="'doc-type-' + index" class="sr-only">Document Type</label>
                 <select
                   :id="'doc-type-' + index"
                   v-model="doc.type"
                   class="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
                   required
                 >
                   <option disabled value="">Select Document Type</option>
                   <option v-for="type in fetchedDocumentTypes" :key="type.id" :value="type.id">
                     {{ type.document_name }}
                   </option>
                 </select>
              </div>
              <div class="flex-1 flex items-center space-x-2">
                 <label :for="'doc-file-' + index" class="sr-only">Document File</label>
                 <input
                   :id="'doc-file-' + index"
                   type="file"
                   @change="(e) => handleFileSelect(e, index)"
                   class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                   accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                   multiple
                   required
                 />
                <button
                  v-if="supportingDocuments.length > 1"
                  @click="removeDocument(index)"
                  type="button"
                  class="p-2 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                  aria-label="Remove Document"
                >
                   <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                     <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                   </svg>
                </button>
              </div>
            </div>

            <button
              type="button"
              @click="addDocument"
              class="mt-4 px-4 py-2.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors inline-flex items-center"
            >
               <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                 <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
               </svg>
              Add Another Document
            </button>
          </div>
           <p class="text-sm text-gray-500 mt-4">
             Required documents include: Graduation Certificate, CID Copy, Security Clearance, Class 10 Marksheet, Class 12 Marksheet, Graduation Marksheet. (Ensure all required types are uploaded). File types accepted: PDF, DOC, DOCX, JPG, JPEG, PNG.
           </p>
        </div>
      </div>

      <!-- Declaration Section -->
      <div class="mt-12 bg-gray-50 p-6 rounded-xl border border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Declaration</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Remarks (Optional)</label>
            <textarea
              v-model="localFormData.remarks"
              rows="3"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
              placeholder="Enter any additional remarks or comments"
            ></textarea>
          </div>

          <div class="flex items-start space-x-3 bg-white p-4 rounded-lg border">
            <input
              id="declaration-checkbox"
              type="checkbox"
              v-model="localFormData.declaration"
              required
              class="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label for="declaration-checkbox" class="text-sm text-gray-700 required">
              I hereby declare that all the information provided above is true and correct to the
              best of my knowledge. I understand that any false statements may result in the
              rejection of my registration.
            </label>
          </div>
            <span v-if="errors.declaration" class="text-sm text-red-500 mt-1">{{
              errors.declaration
            }}</span>
        </div>
      </div>

      <!-- Form Actions -->
      <div class="mt-12 flex justify-end space-x-4 pt-4 border-t border-gray-200">
        <button
          type="button"
          @click="$emit('back')"
          class="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          type="submit"
          :disabled="isSubmitting"
          class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ isSubmitting ? 'Submitting...' : 'Submit Registration' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore'; // Ensure this path is correct
import apiService from '@/services/services'; // Ensure this path is correct
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue';

// Props definition (kept for potential future use or structure)
defineProps({
  selectedType: {
    type: String,
    // required: true, // Make optional if not always needed
  },
  modelValue: {
    type: Object,
    // required: true, // Make optional if not always needed
  },
});

const emit = defineEmits(['back', 'submit']);

const toast = useToast();
const authStore = useAuthStore();
const router = useRouter();

const isSubmitting = ref(false);
const applications = ref([]); // Will hold the array of application objects
const qualificationTypes = ref([]);
const qualifications = ref([]);
const universities = ref([]);
const errors = reactive({}); // For storing validation errors
const fetchedDocumentTypes = ref([]);
const isConfirmationModalOpen = ref(false);

// Use reactive for the form data
const localFormData = reactive({
  qualification_type: '',
  qualification_name: '',
  institute: '',
  year_of_completion: '', // Store as number (year)
  remarks: '',
  declaration: false,
  application: '', // Will store the ID of the selected application
  // payment_id: null, // Removed as it's set to '' on submission
  // is_active: false, // Removed as it's set to 'False' on submission
  // registration_date: '', // Set on submission
  // expiry_date: '', // Set on submission
});

// Store documents separately for easier management
const supportingDocuments = ref([
  { type: '', files: [] }, // Start with one document row
]);

// --- Functions ---

// Fetch user's primary application
const fetchApplications = async () => {
  // Clear previous errors specific to fetching
  delete errors.application;
  try {
    const cid = authStore.user?.cid;
    if (!cid) {
      toast.error('User CID not found. Please log in again.');
      errors.application = 'User information is missing.';
      return;
    }
    // Assuming getApplicationWithCid fetches applications linked to the user's CID
    const response = await apiService.getApplicationWithCid(cid);

    // *** FIX: Assign the 'results' array from the response ***
    if (response.data && Array.isArray(response.data.results)) {
        applications.value = response.data.results;
    } else {
        // Handle unexpected response structure
        console.error("Unexpected API response structure:", response.data);
        applications.value = []; // Set to empty array
        errors.application = 'Failed to parse application data.';
        toast.error('Could not retrieve application information.');
        return;
    }

    console.log('Fetched applications (results array):', applications.value);

    // Assign the application ID if exactly one application is found
    if (applications.value.length === 1) {
      localFormData.application = applications.value[0].id;
      console.log('Assigned application ID:', localFormData.application);
    } else if (applications.value.length > 1) {
      // If multiple applications exist, maybe prompt user or use the first one?
      // For now, let's use the first one as a default assumption.
      localFormData.application = applications.value[0].id;
      console.warn('Multiple applications found, using the first one:', applications.value[0]);
      toast.info('Multiple applications found. Using the primary one.');
       // Or set an error/require user selection if multiple are not expected/handled
       // errors.application = 'Multiple applications found. Please select one.';
    } else {
      // No applications found in the results array
      errors.application = 'No existing application found for this user.';
      console.log('No applications found in the results array.');
      toast.error('No existing primary application found. Please complete primary registration first.');
    }
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to fetch your application details.');
    console.error('Error fetching applications:', error);
    errors.application = 'Failed to fetch application details.';
    applications.value = []; // Ensure it's an empty array on error
  }
};

// Add a new document row
const addDocument = () => {
  supportingDocuments.value.push({ type: '', files: [] });
};

// Remove a document row
const removeDocument = (index) => {
  if (supportingDocuments.value.length > 1) { // Prevent removing the last row
      supportingDocuments.value.splice(index, 1);
  } else {
      toast.info('At least one document row is required.');
  }
};

// Handle file selection for a document row
const handleFileSelect = (event, index) => {
  const files = event.target.files;
  if (files && files.length > 0) {
    // Replace existing files with the new selection for this row
    supportingDocuments.value[index].files = Array.from(files); // Convert FileList to Array
     console.log(`Files selected for doc ${index}:`, supportingDocuments.value[index].files);
  } else {
     // Clear files if selection is cancelled
     supportingDocuments.value[index].files = [];
  }
};

// Helper to format date as YYYY-MM-DD
const formatDateForAPI = (date) => {
  if (!(date instanceof Date) || isNaN(date)) {
     return ''; // Return empty string for invalid dates
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Form Validation Logic
const validateForm = () => {
  // Clear previous errors
  Object.keys(errors).forEach((key) => delete errors[key]);
  let isValid = true;

  // --- Validation Checks ---
  if (!localFormData.application) {
    errors.application = 'Application information is missing or could not be loaded.';
    isValid = false;
  }
  if (!localFormData.qualification_type) {
    errors.qualification_type = 'Qualification Type is required.';
    isValid = false;
  }
  if (!localFormData.qualification_name) {
    errors.qualification_name = 'Qualification Name is required.';
    isValid = false;
  }
  if (!localFormData.institute) {
    errors.institute = 'Institute/University is required.';
    isValid = false;
  }
  if (!localFormData.year_of_completion || isNaN(parseInt(localFormData.year_of_completion))) {
    errors.year_of_completion = 'Valid Year of Completion is required.';
    isValid = false;
  } else {
      const currentYear = new Date().getFullYear();
      const year = parseInt(localFormData.year_of_completion);
      if (year < 1950 || year > currentYear) {
          errors.year_of_completion = `Year must be between 1950 and ${currentYear}.`;
          isValid = false;
      }
  }


  // Validate documents
  let docError = false;
  supportingDocuments.value.forEach((doc, index) => {
    if (!doc.type) {
      toast.error(`Document type is required for row ${index + 1}.`);
      docError = true;
    }
    if (!doc.files || doc.files.length === 0) {
      toast.error(`Please select at least one file for row ${index + 1}.`);
      docError = true;
    }
  });
  if (docError) isValid = false;


  if (!localFormData.declaration) {
    errors.declaration = 'You must agree to the declaration.';
    isValid = false;
  }
  // --- End Validation Checks ---

  if (!isValid) {
    toast.error('Please review the form and correct the indicated errors.');
  }

  return isValid;
};

// Handle form submission attempt -> Show confirmation modal
const handleSubmit = (event) => {
   event.preventDefault(); // Prevent default form submission
  if (validateForm()) {
    isConfirmationModalOpen.value = true;
  }
};

// Actual submission logic after confirmation
const handleSubmitActual = async () => {
  if (isSubmitting.value) return; // Prevent double submission

  isConfirmationModalOpen.value = false; // Close modal first
  isSubmitting.value = true;

  // --- Prepare FormData ---
  const formData = new FormData();

  // Append standard fields
  formData.append('completion_year', String(localFormData.year_of_completion)); // Send as string
  formData.append('declaration', String(localFormData.declaration)); // Send as 'true' or 'false' string? API might expect boolean. Adjust if needed. API Example uses 'True'
  formData.append('remarks', localFormData.remarks || ''); // Send empty string if null/undefined
  formData.append('registration_date', formatDateForAPI(new Date()));
  formData.append('expiry_date', formatDateForAPI(new Date(new Date().setFullYear(new Date().getFullYear() + 5)))); // 5 years expiry
  formData.append('payment_id', ''); // Assuming empty initially
  formData.append('is_active', 'False'); // Assuming starts inactive until approved/paid?
  formData.append('application', String(localFormData.application));
  formData.append('qualification_name', String(localFormData.qualification_name));
  formData.append('qualification_type', String(localFormData.qualification_type));
  formData.append('institute_university', String(localFormData.institute));

  // Append file attachments with structured keys
  // API expects keys like 'attachments-0-file', 'attachments-0-file_type', etc.
  supportingDocuments.value.forEach((doc, index) => {
      if (doc.type && doc.files && doc.files.length > 0) {
          // Append file type for this document group
          formData.append(`attachments-${index}-file_type`, String(doc.type));
          // Append each file in this group
          doc.files.forEach((file) => {
             // If API supports multiple files per type, key might need adjustment (e.g., fileIndex)
             // Assuming API handles multiple files with the same key `attachments-${index}-file`
             formData.append(`attachments-${index}-file`, file, file.name);
          });
      }
  });

  // Log FormData contents for debugging (optional)
   console.log("Submitting FormData:");
   for (let [key, value] of formData.entries()) {
       console.log(`${key}:`, value);
   }


  // --- API Call ---
  try {
    // Assuming createEpcNewQualification handles the FormData submission
    const response = await apiService.createEpcNewQualification(formData);

    // Check response status for success (e.g., 201 Created)
    if (response.status === 201 || response.status === 200) {
      toast.success('Additional Qualification submitted successfully!');
      emit('submit', response.data); // Emit the successful response data
      // Navigate to a relevant dashboard or confirmation page
      router.push({ name: 'epc-user-dashboard' }); // Use route name if defined
    } else {
      // Handle non-2xx success responses if necessary
      console.warn('Submission response status:', response.status, response.data);
      toast.warning(`Submission completed with status: ${response.status}`);
      router.push({ name: 'epc-user-dashboard' }); // Navigate anyway?
    }
  } catch (error) {
    console.error('Error submitting application:', error);
    // Handle specific API errors (e.g., validation errors from backend)
    if (error.response && error.response.data) {
        const responseData = error.response.data;
        let errorMessage = 'Submission failed. ';
        if (typeof responseData === 'object') {
           // Try to extract specific field errors
           Object.keys(responseData).forEach(field => {
               if(Array.isArray(responseData[field])) {
                  errors[field] = responseData[field].join(', '); // Store specific field errors
                  errorMessage += `${field}: ${errors[field]} `;
               } else {
                  errorMessage += `${field}: ${responseData[field]} `;
               }
           });
           if (Object.keys(errors).length > 0) {
             toast.error('Please correct the errors highlighted by the server.');
           } else {
              toast.error(errorMessage || 'An unknown server error occurred.');
           }
        } else {
           // Generic error message from response
           toast.error(`Submission failed: ${responseData.message || responseData.detail || 'Unknown server error'}`);
        }
    } else {
      // Network or other errors
      toast.error(`Submission failed: ${error.message || 'Network error'}`);
    }
  } finally {
    isSubmitting.value = false; // Re-enable submit button
  }
};


// Fetch master data on component mount
onMounted(async () => {
  // Fetch primary application first
  await fetchApplications();

  // Fetch dropdown options only if primary application fetch was successful
  // or if you want to load them regardless
  // if (localFormData.application) { // Optional: only load if app exists
      try {
        // Use Promise.all for concurrent fetching
        const [
            qualificationTypesResponse,
            qualificationsResponse,
            universitiesResponse,
            documentTypesResponse
        ] = await Promise.all([
            apiService.getEpcMastersQualificationTypes(),
            apiService.getEpcMastersQualifications(),
            apiService.getEpcMastersUniversities(),
            apiService.getEpcMastersDocumentTypes()
        ]);

        // Assign results, checking for the .results array
        qualificationTypes.value = qualificationTypesResponse.data?.results || [];
        qualifications.value = qualificationsResponse.data?.results || [];
        universities.value = universitiesResponse.data?.results || [];
        fetchedDocumentTypes.value = documentTypesResponse.data?.results || [];

        console.log('Master data fetched successfully.');

      } catch (error) {
        console.error('Error fetching master data:', error);
        toast.error('Failed to load necessary selection options. Please refresh or try again later.');
        // Optionally set flags to disable parts of the form if master data fails
      }
  // } // End optional block
});

</script>

<style scoped>
/* Required field indicator */
.required::after {
  content: ' *';
  color: #ef4444; /* Tailwind red-500 */
  margin-left: 2px;
}

/* Basic scrollbar styling for the form container if needed */
.overflow-y-auto {
  scrollbar-width: thin; /* Firefox */
  scrollbar-color: #a0aec0 #e2e8f0; /* Firefox: thumb track */
}
.overflow-y-auto::-webkit-scrollbar {
  width: 8px;
}
.overflow-y-auto::-webkit-scrollbar-track {
  background: #e2e8f0;
  border-radius: 4px;
}
.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: #a0aec0;
  border-radius: 4px;
  border: 2px solid #e2e8f0;
}
</style>
