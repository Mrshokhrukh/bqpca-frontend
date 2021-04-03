<template>
  <div class="mx-auto p-8">
    <FormHeader />
    <LoadingOverlay :loading="loading" />
    <!-- Display Validation Errors -->
    <AlertMessage :messages="validationErrors" type="error" v-if="validationErrors.length > 0" />
    <!-- Display Success Message -->
    <AlertMessage :messages="[successMessage]" type="success" v-if="successMessage" />

    <div class="bg-white border rounded-xl shadow-lg p-6">
      <!-- Applicant Details Section -->
      <ApplicantDetailsForm :applicant="applicant" />

      <!-- Application Details Section -->
      <ApplicationDetailsForm :application="application" :handle-approval-letter-upload="handleApprovalLetterUpload"
        @approval-change="toggleApprovedFields" />

      <!-- **** CPD Provider Form Section - V-MODEL IMPLEMENTED **** -->
      <CpdProviderForm
        v-model:cpdProvider="cpdProvider" 
        :agency-options="agencyOptions"
        :reason-options="reasonOptions"
        :loading="loading" 
      />
      <!-- ********************************************************* -->

      <!-- Resource Persons Section -->
      <ResourcePersonsForm
        :resource-persons="resourcePersons"
        :resource-person-certificate="resourcePersonCertificate"
        :fetch-resource-person-details="fetchResourcePersonDetails"
        :handle-certificate-upload="handleCertificateUpload"
        :add-resource-person="addResourcePerson"
        :remove-resource-person="removeResourcePerson"
        :user-registrations="userRegistrations"
      />

      <!-- Teaching & Learning Method Section -->
      <TeachingLearningMethodForm
        :teaching-method="teachingMethod"
        v-model:selected-methodologies="selectedMethodologies"
        v-model:teaching-methods="teachingMethods"
        :cpd-type-options="cpdTypeOptions"
        :methodology-options="methodologyOptions"
        :total-hours="totalHours"
        :calculated-credits="calculatedCredits"
        :course-document="courseDocument"
        :handle-course-document-upload="handleCourseDocumentUpload"
        @add="teachingMethods.push({ activity: '', duration: null })"
        :remove-teaching-method="removeTeachingMethod"
        :calculate-total-hours="calculateTotalHours"
      />

      <!-- Participant Details Section -->
      <ParticipantsDetailsForm
        v-model:participant-details="participantDetails"
        :participation-category-options="participationCategoryOptions"
        :participant-subcategory-options="participantSubcategoryOptions"
        :load-subcategories="loadSubcategories"
        :filtered-subcategories="filteredSubcategories"
      />

      <!-- Approved CPD Section (Conditional) -->
      <ApprovedCpdForm
        :is-cpd-approved="isCpdApproved"
        v-model:participants="participants"
        :attendance-sheet="attendanceSheet"
        :handleAttendanceSheetUpload="handleAttendanceSheetUpload"
        :add-participant="addParticipant"
        :remove-participant="removeParticipant"
        :fetch-participant-name="fetchParticipantName"
        :attachment="attachment"
        :handle-attachment-upload="handleAttachmentUpload"
        :application="application"
      />

      <!-- Form Actions Section -->
      <FormActions
        :loading="loading"
        :save-draft="saveDraft"
        :handle-submit="handleSubmit"
        :cancel-form="cancelForm"
      />
    </div>

    <!-- Confirmation Modal -->
    <ConfirmationModal
      :show-confirmation="showConfirmation"
      :loading="loading"
      :confirm-submit="confirmSubmit"
      @update:showConfirmation="showConfirmation = $event"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'vue-router';
import apiService from '@/services/services';

// Import child components (ensure paths are correct)
import FormHeader from './cpdProviderApplicationComponents/FormHeader.vue';
import LoadingOverlay from './cpdProviderApplicationComponents/LoadingOverlay.vue';
import AlertMessage from './cpdProviderApplicationComponents/AlertMessage.vue';
import ApplicantDetailsForm from './cpdProviderApplicationComponents/ApplicantDetailsForm.vue';
import ApplicationDetailsForm from './cpdProviderApplicationComponents/ApplicationDetailsForm.vue';
import CpdProviderForm from './cpdProviderApplicationComponents/CpdProviderForm.vue';
import ResourcePersonsForm from './cpdProviderApplicationComponents/ResourcePersonsForm.vue';
import TeachingLearningMethodForm from './cpdProviderApplicationComponents/TeachingLearningMethodForm.vue';
import ParticipantsDetailsForm from './cpdProviderApplicationComponents/ParticipantsDetailsForm.vue';
import ApprovedCpdForm from './cpdProviderApplicationComponents/ApprovedCpdForm.vue';
import FormActions from './cpdProviderApplicationComponents/FormActions.vue';
import ConfirmationModal from './cpdProviderApplicationComponents/ConfirmationModal.vue';

// Props (if this component itself is used with v-model)
const props = defineProps({
  modelValue: {
    type: Object,
    // required: true, // Might not be required depending on usage
    default: () => ({
      isApproved: false,
      title: '',
      venue: '',
      fromDate: '',
      toDate: '',
      approvalLetter: null
    })
  }
});

// Emits (if this component itself is used with v-model)
const emit = defineEmits(['update:modelValue']);

// Update model value when form data changes
const updateModelValue = () => {
  emit('update:modelValue', {
    isApproved: application.isApproved === 'true',
    title: application.title,
    venue: application.venue,
    fromDate: application.fromDate,
    toDate: application.toDate,
    approvalLetter: approvalLetter.value
  });
};

const authStore = useAuthStore();
const router = useRouter();

// --- Reactive States ---
const loading = ref(false);
const showConfirmation = ref(false);
const validationErrors = ref([]); // Array for multiple errors
const successMessage = ref('');
const userRegistrations = ref([]); // Holds { registration_no, full_name } objects

// --- Form Data Sections (Reactive Objects/Refs) ---

// Applicant details
const applicant = reactive({
  registrationNumber: '', // Populated from authStore
  cidNumber: '',          // Populated from authStore
  fullName: '',           // Populated from authStore
  agencyTrainingLocation: '', // User input
});

// Application details
const application = reactive({
  isApproved: 'false', // 'true' or 'false' string
  title: '',
  venue: '',
  fromDate: '',
  toDate: '',
});

// CPD Provider details (This object is modified by CpdProviderForm via v-model)
const cpdProvider = reactive({
  agency: '',        // ID or 'other'
  otherAgency: '',   // Text if agency is 'other'
  reason: '',        // ID
  reasonDetails: '', // Text
});

// Resource Persons
const resourcePersons = ref([{ regNo: '', name: '' }]); // Array of objects
const resourcePersonCertificate = ref(null); // File object

// Teaching Method details
const teachingMethod = reactive({
  type: '',             // ID from cpdTypeOptions
  expectedOutcome: '',  // Text
});
const selectedMethodologies = ref([]); // Array of methodology IDs
const teachingMethods = ref([{ activity: '', duration: null }]); // Array of objects
const totalHours = ref(0); // Calculated
const calculatedCredits = ref(0); // Calculated (potentially same as totalHours or based on rules)
const courseDocument = ref(null); // File object

// Participant details (Summary section)
const participantDetails = reactive({
  category: '',       // ID from participationCategoryOptions
  subcategory: '',    // ID from filteredSubcategories
  number: null,       // Number
  relevance: '',      // Text
});

// Participants list (Actual list, primarily for approved CPD)
const participants = ref([]); // Array of { regNo: '', name: '' } objects
const isCpdApproved = ref(false); // Boolean flag derived from application.isApproved

// File uploads
const approvalLetter = ref(null); // File object (for pre-approved CPD)
const attendanceSheet = ref(null); // File object (for pre-approved CPD)
const attachment = ref(null); // File object (generic or for pre-approved CPD)

// --- Options for Dropdowns ---
const agencyOptions = ref([]); // { text: 'Name', value: ID }
const reasonOptions = ref([]); // { text: 'Name', value: ID }
const cpdTypeOptions = ref([]); // { text: 'Name', value: ID }
const methodologyOptions = ref([]); // { text: 'Name', value: ID }
const participationCategoryOptions = ref([]); // { text: 'Name', value: ID }
const participantSubcategoryOptions = ref([]); // { text: 'Name', value: ID, categoryId: ID }

// --- Computed Properties ---
const filteredSubcategories = computed(() => {
  if (!participantDetails.category) {
      return []; // Return empty if no category selected
  }
  const categoryIdNumber = parseInt(participantDetails.category, 10);
  return participantSubcategoryOptions.value.filter(
    // Ensure comparison is reliable (e.g., both numbers or both strings)
    // Assuming subcategory.categoryId is the ID of the parent category from the API
    subcategory => subcategory.categoryId === categoryIdNumber
  );
});

// --- Methods ---

// Toggle fields based on 'Is CPD Approved?' radio button
const toggleApprovedFields = () => {
    const approved = application.isApproved === 'true';
    isCpdApproved.value = approved; // Update the separate flag

    // Clear fields specific to the *other* state when toggling
    if (approved) {
        // Clear fields usually filled when NOT pre-approved
        application.title = '';
    // Notify parent when approval status changes
    updateModelValue();
        application.toDate = '';
        // Keep approvalLetter and attachment as they are relevant now
    } else {
        // Clear fields specific to pre-approved
        participants.value = [];
        attendanceSheet.value = null;
        approvalLetter.value = null;
        attachment.value = null; // Or decide if attachment applies to both flows
    }
    // Notify parent if this component uses v-model
    // updateModelValue(); // Uncomment if needed
};


// File Upload Handlers (with basic validation)
const handleFileUpload = (event, targetRef, maxSizeMB = 5) => {
  const file = event.target.files[0];
  const maxSize = maxSizeMB * 1024 * 1024;
  if (file) {
    if (file.type === 'application/pdf' && file.size <= maxSize) {
      targetRef.value = file;
      // Potentially call updateModelValue() if the file is part of the v-model data
      if (targetRef === approvalLetter.value) {
          // updateModelValue(); // Uncomment if needed
      }
    } else {
      alert(`Please upload a PDF file no larger than ${maxSizeMB}MB.`);
      targetRef.value = null; // Clear the ref
      event.target.value = ''; // Clear the file input visually
    }
  } else {
    targetRef.value = null; // Clear the ref if selection is cancelled
  }
};

const handleApprovalLetterUpload = (event) => handleFileUpload(event, approvalLetter);
const handleCertificateUpload = (event) => handleFileUpload(event, resourcePersonCertificate);
const handleCourseDocumentUpload = (event) => handleFileUpload(event, courseDocument);
const handleAttendanceSheetUpload = (event) => handleFileUpload(event, attendanceSheet);
const handleAttachmentUpload = (event) => handleFileUpload(event, attachment);


// Fetch Resource Person/Participant Name Logic (using pre-fetched userRegistrations)
const fetchDetailsByRegNo = (item) => {
  if (!item.regNo) {
    item.name = '';
    return;
  }
  const foundUser = userRegistrations.value.find(u => u.registration_no === item.regNo);
  if (foundUser) {
    item.name = foundUser.full_name;
  } else {
    item.name = 'Reg# not found'; // Indicate failure to find
    console.warn(`Registration number ${item.regNo} not found in fetched list.`);
    // Avoid prompts in async loops if possible, consider alternative UX
    // const manualName = prompt(`Could not auto-fill name for registration number ${item.regNo}. Please enter the name manually:`);
    // item.name = manualName || 'Not Found';
  }
};

const fetchResourcePersonDetails = (person) => fetchDetailsByRegNo(person);
const fetchParticipantName = (participant) => fetchDetailsByRegNo(participant);


// Add/Remove items from lists
const addResourcePerson = () => {
  resourcePersons.value.push({ regNo: '', name: '' });
};
const removeResourcePerson = (index) => {
  if (resourcePersons.value.length > 1) { // Prevent removing the last one easily
    resourcePersons.value.splice(index, 1);
  } else {
      alert("At least one resource person is usually required."); // Or just clear the fields
      resourcePersons.value[0] = { regNo: '', name: '' };
  }
};

const removeTeachingMethod = (index) => {
   if (teachingMethods.value.length > 1) {
       teachingMethods.value.splice(index, 1);
   } else {
       alert("At least one teaching method/activity is required.");
       teachingMethods.value[0] = { activity: '', duration: null };
   }
   calculateTotalHours(); // Recalculate after removal
};

const addParticipant = () => {
  participants.value.push({ regNo: '', name: '' });
};
const removeParticipant = (index) => {
  participants.value.splice(index, 1); // Allow removing all if needed
};

// Calculation
const calculateTotalHours = () => {
  totalHours.value = teachingMethods.value.reduce((sum, method) => {
    const duration = Number(method.duration);
    return sum + (isNaN(duration) || duration < 0 ? 0 : duration); // Add only valid positive numbers
  }, 0);
  // Simple 1:1 credit calculation, adjust if needed
  calculatedCredits.value = totalHours.value;
};

// Load subcategories (potentially triggered by category change)
const loadSubcategories = async () => {
  // This is currently handled by the computed property `filteredSubcategories`.
  // If you needed to fetch subcategories dynamically from an API based on
  // participantDetails.category, the API call would go here.
  console.log("Subcategory filtering triggered for category:", participantDetails.category);
};

// --- Form Validation ---
const validateForm = () => {
  const errors = []; // Use a local array for errors

  // Applicant Details
  if (!applicant.agencyTrainingLocation?.trim()) {
    errors.push('Applicant: Agency/Training Location is required.');
  }

  // Application Details
  if (application.isApproved === 'false') {
    if (!application.title?.trim()) errors.push('Application: Title of CPD is required.');
    if (!application.venue?.trim()) errors.push('Application: Venue is required.');
    if (!application.fromDate) errors.push('Application: From Date is required.');
    if (!application.toDate) errors.push('Application: To Date is required.');
    if (application.fromDate && application.toDate && new Date(application.fromDate) > new Date(application.toDate)) {
      errors.push('Application: From Date cannot be later than To Date.');
    }
  } else { // isApproved === 'true'
      if (!approvalLetter.value) errors.push('Application: Approval Letter (PDF) is required when CPD is pre-approved.');
      // Also validate fields specific to ApprovedCpdForm when isApproved is true
      if (!attachment.value) {
          errors.push('Approved CPD: Attachment (PDF) is required for approved CPD.');
      }
      if (!attendanceSheet.value) {
          errors.push('Approved CPD: Attendance Sheet (PDF) is required for approved CPD.');
      }
      if (participants.value.length === 0) {
           errors.push('Approved CPD: At least one participant must be added.');
      } else if (participants.value.some(p => !p.regNo || !p.name || p.name === 'Reg# not found')) {
          errors.push('Approved CPD: Registration Number and valid Name are required for all added Participants.');
      }
  }


  // CPD Provider Details
  if (!cpdProvider.agency) errors.push('CPD Provider: Agency selection is required.');
  if (cpdProvider.agency === 'other' && !cpdProvider.otherAgency?.trim()) errors.push('CPD Provider: Please specify the Other Agency name.');
  if (!cpdProvider.reason) errors.push('CPD Provider: Reason for Conducting selection is required.');
  if (!cpdProvider.reasonDetails?.trim()) errors.push('CPD Provider: Reason Details are required.');

  // Resource Persons
   if (resourcePersons.value.length === 0) {
        errors.push('Resource Persons: At least one resource person must be added.');
   } else if (resourcePersons.value.some(person => !person.regNo || !person.name || person.name === 'Reg# not found')) {
       errors.push('Resource Persons: Registration Number and valid Name are required for all added Resource Persons.');
   }
  if (!resourcePersonCertificate.value) errors.push('Resource Persons: Document supporting expertise (PDF) is required.');

  // Teaching Method
  if (!teachingMethod.type) errors.push('Teaching Method: Type of CPD selection is required.');
  if (selectedMethodologies.value.length === 0) errors.push('Teaching Method: At least one Methodology must be selected.');
  if (!teachingMethod.expectedOutcome?.trim()) errors.push('Teaching Method: Expected Outcome is required.');
  if (teachingMethods.value.length === 0) {
       errors.push('Teaching Method: At least one Activity/Teaching Method must be added.');
  } else if (teachingMethods.value.some(method => !method.activity?.trim() || !method.duration || method.duration <= 0)) {
      errors.push('Teaching Method: All added Activities must have a description and a positive duration (hours).');
  }
   if (totalHours.value <= 0) {
       errors.push('Teaching Method: Total Duration (Hours) must be calculated and greater than 0.');
   }
  if (!courseDocument.value) errors.push('Teaching Method: Course Document (PDF) is required.');

  // Participant Details (Summary Section)
  if (!participantDetails.category) errors.push('Participants Summary: Participation Category selection is required.');
  // Check if subcategory is needed based on category - API might define this
   if (participantDetails.category && filteredSubcategories.value.length > 0 && !participantDetails.subcategory) {
       errors.push('Participants Summary: Participant Sub-category selection is required for the chosen Category.');
   } else if (!participantDetails.subcategory && filteredSubcategories.value.length === 0) {
       // If no subcategories exist for the chosen category, maybe it's not required? Adjust logic based on requirements.
       // console.log("No subcategories available/required for category:", participantDetails.category);
   }

  if (!participantDetails.number || participantDetails.number <= 0) errors.push('Participants Summary: Expected Number of Participants must be greater than 0.');
  if (!participantDetails.relevance?.trim()) errors.push('Participants Summary: Relevance to profession description is required.');

  // Assign errors to the reactive ref
  validationErrors.value = errors;
  return errors.length === 0; // Return true if valid
};


// --- Prepare FormData for API ---
const prepareFormData = (isDraft = false) => {
  const formData = new FormData();
  const isCpdApprovedFlag = application.isApproved === 'true';

  console.log("--- Preparing FormData ---");
  console.log("Is Draft:", isDraft);
  console.log("Is CPD Approved:", isCpdApprovedFlag);

  // Append Applicant Details
  formData.append('cid_no', applicant.cidNumber);
  formData.append('full_name', applicant.fullName);
  formData.append('proposed_training_location', applicant.agencyTrainingLocation);

  // Append Application Details
  formData.append('is_cpd_approved', isCpdApprovedFlag);
  if (!isCpdApprovedFlag) {
    formData.append('title_of_cpd', application.title);
    formData.append('venue', application.venue);
    formData.append('from_date', application.fromDate);
    formData.append('to_date', application.toDate);
  }
  // No else needed if backend ignores these when is_cpd_approved is true

  // Append CPD Provider Details
  formData.append('cpd_providing_agency', cpdProvider.agency === 'other' ? '' : parseInt(cpdProvider.agency, 10) || '');
  formData.append('if_others_specify', cpdProvider.agency === 'other' ? cpdProvider.otherAgency || '' : '');
  formData.append('reason_for_conducting', parseInt(cpdProvider.reason, 10) || '');
  formData.append('reason_for_details', cpdProvider.reasonDetails);

  // Append Resource Persons (JSON stringified array)
  const resourcePersonsData = resourcePersons.value
    .filter(person => person.regNo && person.name && person.name !== 'Reg# not found') // Filter out incomplete/invalid entries
    .map(person => ({
      resource_person_reg_no: person.regNo,
      resource_person_name: person.name,
      // cpd_task: null // Backend usually handles linking via foreign key
    }));
  formData.append('resources', JSON.stringify(resourcePersonsData));
  console.log("Resources JSON:", JSON.stringify(resourcePersonsData));

  // Append Teaching Method Details
  formData.append('type_of_cpd', teachingMethod.type); // Send ID
  formData.append('expected_outcome', teachingMethod.expectedOutcome);

  // Append Methodologies (JSON stringified array of objects)
  const methodologyData = selectedMethodologies.value.map(methodId => ({
       methodology_name: methodId, // Assuming backend wants ID here, adjust if it needs name
       // cpd_task: null
   }));
   formData.append('methodologies', JSON.stringify(methodologyData));
   console.log("Methodologies JSON:", JSON.stringify(methodologyData));

   // Append Learning Methods/Activities (JSON stringified array of objects)
   const learningMethodsData = teachingMethods.value
    .filter(method => method.activity?.trim() && method.duration > 0) // Filter valid entries
    .map(method => ({
      activities: method.activity,
      duration: method.duration,
      // cpd_task: null
    }));
  formData.append('learning_methods', JSON.stringify(learningMethodsData));
  console.log("Learning Methods JSON:", JSON.stringify(learningMethodsData));


  // Append Participant Details (Summary)
  formData.append('number_of_participants', participantDetails.number || 0);
  formData.append('relevance_to_topic', participantDetails.relevance || '');
  formData.append('participation_category', participantDetails.category); // Send ID
  formData.append('participant_sub_category', participantDetails.subcategory); // Send ID (might be empty string if none selected/available)

  // Append Participants List (Actual list, especially for approved CPD)
  // Send even if empty array, backend should handle
  const participantsData = participants.value
      .filter(p => p.regNo && p.name && p.name !== 'Reg# not found') // Filter valid entries
      .map(p => ({
          participant_reg_no: p.regNo,
          // participant_name: p.name, // Send name if backend needs it, otherwise reg_no might suffice
          cpd_credits: calculatedCredits.value, // Send calculated credits
          review_status: 'Pending', // Default status, backend might override
          // cpd_task: null
      }));
  formData.append('participants', JSON.stringify(participantsData));
  console.log("Participants JSON:", JSON.stringify(participantsData));

  // Append Files (Check if file exists before appending)
  // Use distinct names if backend requires, e.g., for approved vs. non-approved attachments
  if (isCpdApprovedFlag) {
      if (approvalLetter.value) formData.append('approval_letter_attachment', approvalLetter.value);
      if (attachment.value) formData.append('approved_cpd_main_attachment', attachment.value); // Specific key for approved
      if (attendanceSheet.value) formData.append('attendance_sheet_attachment', attendanceSheet.value);
  } else {
      // Potentially a different attachment field for non-approved, or none
      // if (attachment.value) formData.append('general_attachment', attachment.value);
  }

  // Common files
  if (resourcePersonCertificate.value) formData.append('document_supporting_expertise', resourcePersonCertificate.value);
  if (courseDocument.value) formData.append('course_document', courseDocument.value);

  // Append Draft Status
  formData.append('is_draft', isDraft);

  // --- Log Final FormData for Debugging ---
  console.log("--- FormData Contents ---");
  for (let [key, value] of formData.entries()) {
      if (value instanceof File) {
          console.log(`${key}: File(name=${value.name}, size=${value.size}, type=${value.type})`);
      } else {
          console.log(`${key}: ${value}`);
      }
  }
  console.log("-------------------------");
  // --- End Debug Log ---

  return formData;
};


// --- API Interaction ---

// Helper to extract backend error messages
const getErrorMessages = (error) => {
    const messages = [];
    if (error.response && error.response.data) {
        const errorData = error.response.data;
        const extractErrors = (obj, prefix = '') => {
            if (typeof obj === 'string') {
                messages.push(`${prefix ? prefix + ': ' : ''}${obj}`);
            } else if (Array.isArray(obj)) {
                obj.forEach(item => extractErrors(item, prefix)); // Recursively handle arrays
            } else if (typeof obj === 'object' && obj !== null) {
                Object.keys(obj).forEach(key => {
                    const newPrefix = key; // Use key as prefix for field errors
                    extractErrors(obj[key], newPrefix);
                });
            }
        };
        extractErrors(errorData);
    }
    if (messages.length === 0) {
        messages.push('An unknown error occurred. Please check the console.');
    }
    // Simple deduplication
    return [...new Set(messages)];
};


// Save Draft
const saveDraft = async () => {
  // Basic check: ensure at least something identifiable exists? Optional.
  // if (!applicant.agencyTrainingLocation?.trim() && !application.title?.trim()) {
  //   alert("Please enter at least the Agency/Training Location or Title before saving a draft.");
  //   return;
  // }

  loading.value = true;
  validationErrors.value = []; // Clear previous errors
  successMessage.value = '';
  try {
    const formData = prepareFormData(true); // true for draft
    await apiService.createEpcCpdTask(formData); // Use your actual API service method
    successMessage.value = 'Draft saved successfully!';
    setTimeout(() => { successMessage.value = ''; }, 4000); // Hide after 4s

  } catch (error) {
    console.error('Error saving draft:', error);
    validationErrors.value = getErrorMessages(error);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Show errors
  } finally {
    loading.value = false;
  }
};

// Handle Final Submit Button Click
const handleSubmit = () => {
  validationErrors.value = []; // Clear previous errors
  successMessage.value = '';
  if (validateForm()) {
    showConfirmation.value = true; // Show confirmation modal
  } else {
    // Scroll to top to show validation errors
    window.scrollTo({ top: 0, behavior: 'smooth' });
    console.log("Validation Failed:", validationErrors.value);
  }
};

// Confirm Final Submit (from Modal)
const confirmSubmit = async () => {
  showConfirmation.value = false; // Hide modal
  if (!validateForm()) { // Re-validate just in case state changed
      window.scrollTo({ top: 0, behavior: 'smooth' });
      console.log("Re-validation Failed before submit.");
      return;
  }

  loading.value = true;
  validationErrors.value = [];
  successMessage.value = '';

  try {
    const formData = prepareFormData(false); // false for final submit
    const response = await apiService.createEpcCpdTask(formData); // Use your actual API service method
    console.log('Form submitted successfully:', response.data);
    successMessage.value = 'CPD application submitted successfully! Redirecting...';
    // Redirect after a short delay to allow user to see success message
    setTimeout(() => {
      // Navigate to a tracking or dashboard page
      router.push({ name: 'TrackCpdApplications' }); // Use route name if available
    }, 2500);

  } catch (error) {
    console.error('Error submitting form:', error);
    validationErrors.value = getErrorMessages(error);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Show errors
  } finally {
    loading.value = false;
  }
};


// Cancel Form Action
const cancelForm = () => {
  // Add a confirmation dialog before navigating away
  if (confirm("Are you sure you want to cancel and discard changes?")) {
    router.push({ name: 'CpdDashboard' }); // Use route name if available, adjust as needed
  }
};


// --- Data Fetching for Setup ---

// Fetch list of registered users for lookups
const fetchUserRegistrations = async () => {
  console.log("Fetching user registrations...");
  try {
    // Adjust API call and pagination as needed
    const response = await apiService.getEpcNewApplications({ params: { page_size: 1000 } });

    if (response.data?.results && Array.isArray(response.data.results)) {
      userRegistrations.value = response.data.results
        .filter(app => app.registration_no && app.full_name) // Ensure needed data exists
        .map(app => ({
          registration_no: app.registration_no,
          full_name: app.full_name,
        }))
        .sort((a, b) => a.full_name.localeCompare(b.full_name)); // Sort for dropdowns/lookup lists
      console.log(`Fetched ${userRegistrations.value.length} User Registrations.`);
    } else {
      console.warn("No user registrations found or API response format unexpected.");
      userRegistrations.value = [];
      // Optionally add a non-blocking validation error
      // validationErrors.value.push('Warning: Could not load list of registered engineers for auto-fill.');
    }
  } catch (error) {
    console.error('Error fetching user registrations:', error);
    validationErrors.value.push('Error fetching data for Resource Person/Participant lookup.');
  }
};

// Fetch options for all dropdowns
const loadDropdownOptions = async () => {
    console.log("Loading dropdown options...");
    try {
        const [
            agencyRes, reasonRes, cpdTypeRes, methodologyRes, categoriesRes, subcategoriesRes
        ] = await Promise.all([
            apiService.getProvidingAgency(),
            apiService.getReasonForCoducting(),
            apiService.getMastersCmeActivities(),
            apiService.getMastersCmeMethodologies(),
            apiService.getMastersParticipationCategories(),
            apiService.getMastersParticipationSubCategories()
        ]);

        const processOptions = (response, textField, valueField, categoryField = null) => {
            const results = response.data?.results;
            if (results && Array.isArray(results)) {
                return results.map(item => ({
                    text: item[textField],
                    value: item[valueField],
                    ...(categoryField && { categoryId: item[categoryField] }) // Add categoryId if field name provided
                }));
            }
            return [];
        };

        agencyOptions.value = processOptions(agencyRes, 'name', 'id');
        reasonOptions.value = processOptions(reasonRes, 'name', 'id');
        cpdTypeOptions.value = processOptions(cpdTypeRes, 'cme_activity_name', 'id');
        methodologyOptions.value = processOptions(methodologyRes, 'methodology_name', 'id');
        participationCategoryOptions.value = processOptions(categoriesRes, 'participation_category_name', 'id');
        // **** IMPORTANT: Ensure 'participation_category_name' in the subcategory API response contains the PARENT category ID ****
        participantSubcategoryOptions.value = processOptions(subcategoriesRes, 'participation_sub_category_name', 'id', 'participation_category'); // Use 'participation_category' assuming it holds the parent ID


        console.log(`Loaded: ${agencyOptions.value.length} Agencies, ${reasonOptions.value.length} Reasons, ${cpdTypeOptions.value.length} CPD Types, ${methodologyOptions.value.length} Methodologies, ${participationCategoryOptions.value.length} Categories, ${participantSubcategoryOptions.value.length} Subcategories.`);

        // Log warnings if any options list is empty
        if (agencyOptions.value.length === 0) console.warn("Agency options are empty!");
        if (reasonOptions.value.length === 0) console.warn("Reason options are empty!");
        if (cpdTypeOptions.value.length === 0) console.warn("CPD Type options are empty!");
        if (methodologyOptions.value.length === 0) console.warn("Methodology options are empty!");
        if (participationCategoryOptions.value.length === 0) console.warn("Category options are empty!");
        // Subcategories might be empty legitimately if none exist initially
        // if (participantSubcategoryOptions.value.length === 0) console.warn("Subcategory options are empty!");


    } catch (error) {
        console.error('Error loading one or more dropdown options:', error);
        validationErrors.value.push('Critical error loading form selection options. Please refresh.');
    }
};


// --- Lifecycle Hooks ---

onMounted(async () => {
  console.log("CPD Provider Application Component Mounted");
  loading.value = true;
  validationErrors.value = [];
  successMessage.value = '';

  // Set initial applicant details from auth store
  applicant.cidNumber = authStore.user?.cid || '';
  applicant.fullName = [authStore.user?.first_name, authStore.user?.middle_name, authStore.user?.last_name].filter(Boolean).join(' ') || 'N/A';
  applicant.registrationNumber = authStore.user?.registration_number || ''; // Or fetch if not in store

  // Fetch initial data concurrently
  await Promise.all([
      fetchUserRegistrations(),
      loadDropdownOptions()
  ]);

  // Apply initial values from props.modelValue (e.g., when editing an existing application)
  // This part needs careful handling, especially for complex objects and files
  if (props.modelValue && props.modelValue.id) { // Check if it looks like existing data
      console.log("Applying modelValue:", props.modelValue);
      application.isApproved = props.modelValue.isApproved ? 'true' : 'false';
      if(application.isApproved === 'false') {
          application.title = props.modelValue.title || '';
          application.venue = props.modelValue.venue || '';
          application.fromDate = props.modelValue.fromDate || ''; // Ensure format matches date input
          application.toDate = props.modelValue.toDate || '';
      }
      // TODO: Populate other fields (cpdProvider, resourcePersons, teachingMethod, etc.)
      // This often requires fetching the full application details by ID if modelValue is just a summary
      // File objects (approvalLetter, etc.) cannot be restored directly from props.modelValue
  }

  // Set initial derived state
  isCpdApproved.value = application.isApproved === 'true';
  calculateTotalHours(); // Calculate initial hours based on default teachingMethods

  loading.value = false;
  console.log("Initial data load complete.");
});

// --- Watchers ---

// Watch for changes in approval status to update the derived flag and potentially clear fields
watch(() => application.isApproved, (newIsApprovedStr) => {
    console.log("Approval status changed to:", newIsApprovedStr);
    toggleApprovedFields(); // Use the existing function to handle state changes
    // updateModelValue(); // Notify parent if using v-model
});

// Watch for category changes to clear subcategory selection
watch(() => participantDetails.category, (newCategory, oldCategory) => {
    if (newCategory !== oldCategory) {
        console.log("Participant category changed, resetting subcategory.");
        participantDetails.subcategory = ''; // Reset subcategory
        // No need to call loadSubcategories if using the computed property for filtering
    }
});

// Watch teaching methods array deeply to recalculate totals automatically
watch(teachingMethods, () => {
    console.log("Teaching methods changed, recalculating total hours.");
    calculateTotalHours();
}, { deep: true }); // deep watch is necessary for array of objects


</script>

<style scoped>
/* Add any component-specific styles here */
</style>