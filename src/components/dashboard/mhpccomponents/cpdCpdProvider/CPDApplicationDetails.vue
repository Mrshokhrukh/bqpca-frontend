<template>
  <div class="mx-auto py-8">
    <FormHeader />
    <LoadingOverlay :loading="loading" />
    <AlertMessage :messages="validationErrors" type="error" />
    <AlertMessage :messages="[successMessage]" type="success" v-if="successMessage" />

    <div class="bg-white border rounded-xl shadow-lg p-6">
      <ApplicantDetailsForm :applicant="applicant" />
      <ApplicationDetailsForm
        :application="application"
        :handle-approval-letter-upload="handleApprovalLetterUpload"
        @approval-change="toggleApprovedFields"
      />
      <CpdProviderForm
        :cpd-provider="cpdProvider"
        :agency-options="agencyOptions"
        :reason-options="reasonOptions"
      />
      <ResourcePersonsForm
        :resource-persons="resourcePersons"
        :resource-person-certificate="resourcePersonCertificate"
        :fetch-resource-person-details="fetchResourcePersonDetails"
        :handle-certificate-upload="handleCertificateUpload"
        :add-resource-person="addResourcePerson"
        :remove-resource-person="removeResourcePerson"
        :user-registrations="userRegistrations"
      />
      <TeachingLearningMethodForm
        :teaching-method="teachingMethod"
        :cpd-type-options="cpdTypeOptions"
        :methodology-options="methodologyOptions"
        :selected-methodologies="selectedMethodologies"
        :teaching-methods="teachingMethods"
        :total-hours="totalHours"
        :course-document="courseDocument"
        :handle-course-document-upload="handleCourseDocumentUpload"
        :add-teaching-method="addTeachingMethod"
        :remove-teaching-method="removeTeachingMethod"
        :calculate-total-hours="calculateTotalHours"
      />

      <template v-if="areOptionsLoaded">
        <ParticipantsDetailsForm
          :key="participantFormKey"
          :participant-details="participantDetails"
          @update:participantDetails="handleParticipantDetailsUpdate"
          :participation-category-options="participationCategoryOptions"
          :participant-subcategory-options="participantSubcategoryOptions"
        />
      </template>
      <div v-else class="bg-white border rounded-xl shadow-sm p-6 text-center my-4">
        <p class="text-gray-600 font-semibold">
          <svg aria-hidden="true" class="inline w-6 h-6 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
          </svg>
          Loading participation options...
        </p>
      </div>

      <ApprovedCpdForm
        :is-cpd-approved="isCpdApproved"
        :participants="participants"
        :attendance-sheet="attendanceSheet"
        :handle-attendance-sheet-upload="handleAttendanceSheetUpload"
        :add-participant="addParticipant"
        :remove-participant="removeParticipant"
        :fetch-participant-name="fetchParticipantName"
        :attachment="attachment"
        :handle-attachment-upload="handleAttachmentUpload"
        :application="application"
      />
      <FormActions
        :loading="loading"
        :save-draft="saveDraft"
        :handle-submit="handleSubmit"
        :cancel-form="cancelForm"
      />
    </div>

    <ConfirmationModal
      :show-confirmation="showConfirmation"
      :loading="loading"
      :confirm-submit="confirmSubmit"
      @update:showConfirmation="showConfirmation = $event"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch, nextTick, toRaw } from 'vue'; // Added toRaw
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'vue-router';
import apiService from '@/services/services';

// Import child components (ensure these paths are correct)
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

// defineProps and defineEmits are compiler macros and should be called at the top level
const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
    default: () => ({
      isApproved: false,
      title: '',
      venue: '',
      fromDate: '',
      toDate: '',
      approvalLetter: null,
    }),
  },
});

const emit = defineEmits(['update:modelValue']);

// Helper function for safe logging
const safeLogValue = (value) => {
  try {
    return JSON.parse(JSON.stringify(value === undefined ? null : toRaw(value)));
  } catch (e) {
    console.error("Error during safeLogValue (PARENT):", e, "Original value:", toRaw(value));
    return toRaw(value); // Fallback to raw value
  }
};

function updateModelValue() {
  emit('update:modelValue', {
    isApproved: application.isApproved === 'true',
    title: application.title,
    venue: application.venue,
    fromDate: application.fromDate,
    toDate: application.toDate,
    approvalLetter: approvalLetter.value,
  });
}

const authStore = useAuthStore();
const router = useRouter();

// Reactive States
const loading = ref(false);
const showConfirmation = ref(false);
const validationErrors = ref([]);
const successMessage = ref('');
const userRegistrations = ref([]);

// Applicant details
const applicant = reactive({
  registrationNumber: '',
  cidNumber: '',
  fullName: '',
  agencyTrainingLocation: '',
});

// Application details
const application = reactive({
  isApproved: 'false',
  title: '',
  venue: '',
  fromDate: '',
  toDate: '',
});

// CPD Provider details
const cpdProvider = reactive({
  agency: '',
  otherAgency: '',
  reason: '',
  reasonDetails: '',
});

// Resource Persons
const resourcePersons = ref([{ regNo: '', name: '' }]);
const resourcePersonCertificate = ref(null);

// Teaching Method details
const teachingMethod = reactive({
  type: '',
  expectedOutcome: '',
});
const selectedMethodologies = ref([]);
const teachingMethods = ref([{ activity: '', duration: null }]);
const totalHours = ref(0);
const calculatedCredits = ref(0);

// Participant details
const participantDetails = reactive({
  category: '',
  subcategory: '',
  number: null,
  relevance: '',
});

// Participants list for approved CPD
const participants = ref([]);
const isCpdApproved = ref(false);

// File uploads
const approvalLetter = ref(null);
const courseDocument = ref(null);
const attendanceSheet = ref(null);
const attachment = ref(null);

// Options for dropdowns
const agencyOptions = ref([]);
const reasonOptions = ref([]);
const cpdTypeOptions = ref([]);
const methodologyOptions = ref([]);
const participationCategoryOptions = ref([]);
const participantSubcategoryOptions = ref([]);
const areOptionsLoaded = ref(false);
const participantFormKey = ref(0); // Key for ParticipantsDetailsForm

const handleParticipantDetailsUpdate = (updatedDetails) => {
  console.log("PARENT: Received update:participantDetails event with:", safeLogValue(updatedDetails));
  Object.assign(participantDetails, updatedDetails);
  console.log("PARENT: participantDetails.category after update:", participantDetails.category);
  console.log("PARENT: participantDetails.subcategory after update:", participantDetails.subcategory);
};

const toggleApprovedFields = () => {
  application.title = application.isApproved === 'true' ? '' : application.title;
  application.venue = application.isApproved === 'true' ? '' : application.venue;
  application.fromDate = application.isApproved === 'true' ? '' : application.fromDate;
  application.toDate = application.isApproved === 'true' ? '' : application.toDate;
  approvalLetter.value = application.isApproved === 'false' ? null : approvalLetter.value;
  attachment.value = application.isApproved === 'false' ? null : attachment.value;
  updateModelValue();
};

const handleApprovalLetterUpload = (event) => {
  const file = event.target.files[0];
  if (file && file.type === 'application/pdf' && file.size <= 5 * 1024 * 1024) {
    approvalLetter.value = file;
    updateModelValue();
  } else {
    alert('Please upload a PDF file less than 5MB');
    event.target.value = '';
  }
};

const handleCertificateUpload = (event) => {
  const file = event.target.files[0];
  if (file && file.type === 'application/pdf' && file.size <= 5 * 1024 * 1024) {
    resourcePersonCertificate.value = file;
  } else {
    alert('Please upload a PDF file less than 5MB');
    event.target.value = '';
  }
};
const handleCourseDocumentUpload = (event) => {
  const file = event.target.files[0];
  if (file && file.type === 'application/pdf' && file.size <= 5 * 1024 * 1024) {
    courseDocument.value = file;
  } else {
    alert('Please upload a PDF file less than 5MB');
    event.target.value = '';
  }
};

const handleAttendanceSheetUpload = (event) => {
  const file = event.target.files[0];
  if (file && file.type === 'application/pdf' && file.size <= 5 * 1024 * 1024) {
    attendanceSheet.value = file;
  } else {
    alert('Please upload a PDF file less than 5MB');
    event.target.value = '';
  }
};

const handleAttachmentUpload = (event) => {
  const file = event.target.files[0];
  if (file && file.type === 'application/pdf' && file.size <= 5 * 1024 * 1024) {
    attachment.value = file;
  } else {
    alert('Please upload a PDF file less than 5MB');
    event.target.value = '';
  }
};

const fetchResourcePersonDetails = async (person) => {
  if (!person.regNo) {
    person.name = '';
    return;
  }
  try {
    loading.value = true;
    // TODO: Replace '' with actual CID or relevant parameter if needed for getMhpcFullApplicationListByCid
    const response = await apiService.getMhpcFullApplicationListByCid('');
    if (response.data && response.data.results && Array.isArray(response.data.results)) {
      const matchingApplication = response.data.results.find(
        (app) => app.registration_no === person.regNo,
      );
      person.name = matchingApplication ? matchingApplication.full_name || 'Unknown' : '';
    } else {
      const manualName = prompt(
        `Please enter name for resource person with registration number ${person.regNo}:`,
      );
      person.name = manualName || '';
    }
  } catch (error) {
    console.error('Error fetching resource person details:', error);
    const manualName = prompt(
      `Could not fetch details for registration number ${person.regNo}. Please enter the name manually:`,
    );
    person.name = manualName || '';
  } finally {
    loading.value = false;
  }
};

const addResourcePerson = () => {
  resourcePersons.value.push({ regNo: '', name: '' });
};

const removeResourcePerson = (index) => {
  resourcePersons.value.splice(index, 1);
};

const calculateTotalHours = () => {
  totalHours.value = teachingMethods.value.reduce((sum, method) => {
    return sum + (Number(method.duration) || 0);
  }, 0);
  calculatedCredits.value = totalHours.value; // Or your specific credit calculation logic
};

const addTeachingMethod = () => {
  teachingMethods.value.push({ activity: '', duration: null });
};

const removeTeachingMethod = (index) => {
  teachingMethods.value.splice(index, 1);
  calculateTotalHours();
};

const addParticipant = () => {
  participants.value.push({ regNo: '', name: '' });
};

const removeParticipant = (index) => {
  participants.value.splice(index, 1);
};

const fetchParticipantName = async (participant) => {
  if (!participant.regNo) {
    participant.name = '';
    return;
  }
  try {
    loading.value = true;
    // TODO: Replace '' with actual CID or relevant parameter if needed for getMhpcFullApplicationListByCid
    const response = await apiService.getMhpcFullApplicationListByCid('');
    if (response.data && response.data.results && Array.isArray(response.data.results)) {
      const matchingApplication = response.data.results.find(
        (app) => app.registration_no === participant.regNo,
      );
      participant.name = matchingApplication ? matchingApplication.full_name || 'Unknown' : '';
    } else {
      const manualName = prompt(
        `Please enter name for participant with registration number ${participant.regNo}:`,
      );
      participant.name = manualName || '';
    }
  } catch (error) {
    console.error('Error fetching participant name:', error);
    const manualName = prompt(
      `Could not fetch details for registration number ${participant.regNo}. Please enter the name manually:`,
    );
    participant.name = manualName || '';
  } finally {
    loading.value = false;
  }
};

const validateForm = () => {
  validationErrors.value = [];
  // Basic Validations
  if (!applicant.agencyTrainingLocation) validationErrors.value.push('Agency/Training Location is required.');

  // Validations for 'Not Approved' CPD
  if (application.isApproved === 'false') {
    if (!application.title) validationErrors.value.push('Title of CPD is required.');
    if (!application.venue) validationErrors.value.push('Venue is required.');
    if (!application.fromDate) validationErrors.value.push('From Date is required.');
    if (!application.toDate) validationErrors.value.push('To Date is required.');
    if (application.fromDate && application.toDate && new Date(application.fromDate) > new Date(application.toDate)) {
      validationErrors.value.push('From Date cannot be later than To Date.');
    }
  } else if (application.isApproved === 'true' && !approvalLetter.value) { // Validations for 'Approved' CPD
    validationErrors.value.push('Approval Letter is required.');
  }

  // CPD Provider Validations
  if (!cpdProvider.agency) validationErrors.value.push('CPD Providing Agency is required.');
  if (cpdProvider.agency === 'other' && !cpdProvider.otherAgency) validationErrors.value.push('Please specify the Other Agency.');
  if (!cpdProvider.reason) validationErrors.value.push('Reason for Conducting is required.');
  if (!cpdProvider.reasonDetails) validationErrors.value.push('Reason Details are required.');

  // Resource Persons Validations
  if (resourcePersons.value.some((person) => !person.regNo)) validationErrors.value.push('Registration Number is required for all Resource Persons.');
  if (!resourcePersonCertificate.value) validationErrors.value.push('Document supporting expertise of Resource Persons is required.');

  // Teaching Method Validations
  if (!teachingMethod.type) validationErrors.value.push('Type of CPD is required.');
  if (selectedMethodologies.value.length === 0) validationErrors.value.push('At least one Methodology must be selected.');
  if (!teachingMethod.expectedOutcome) validationErrors.value.push('Expected Outcome is required.');
  if (!teachingMethods.value.some((method) => method.activity && method.duration > 0)) {
    validationErrors.value.push('At least one Teaching Method with activity and positive duration is required.');
  }
  if (!courseDocument.value) validationErrors.value.push('Course Document is required.');

  // Participant Details Validations (only if the section is loaded/visible)
  if (areOptionsLoaded.value) {
    if (!participantDetails.category) validationErrors.value.push('Participation Category is required.');
    if (!participantDetails.subcategory) validationErrors.value.push('Participant Sub-Category is required.');
    if (!participantDetails.number || participantDetails.number <= 0) validationErrors.value.push('Number of Participants must be a positive number.');
    if (!participantDetails.relevance) validationErrors.value.push('Relevance to profession is required.');
  }

  // Approved CPD Specific Validations
  if (application.isApproved === 'true') {
    if (!attachment.value) validationErrors.value.push('General Attachment is required for approved CPD.');
    // Assuming `isCpdApproved.value` correctly reflects `application.isApproved`
    // and you want to validate attendance sheet only when participants are added for an approved CPD.
    if (participants.value.length > 0 && !attendanceSheet.value) {
        validationErrors.value.push('Attendance Sheet is required when participants are listed for an approved CPD.');
    }
  }
  return validationErrors.value.length === 0;
};

const prepareFormData = (isDraft = false) => {
  const formData = new FormData();
  // Applicant
  formData.append('cid_no', applicant.cidNumber);
  formData.append('full_name', applicant.fullName);
  formData.append('proposed_training_location', applicant.agencyTrainingLocation);

  // Application
  const isCpdApprovedFlag = application.isApproved === 'true';
  formData.append('is_cpd_approved', isCpdApprovedFlag);

  if (!isCpdApprovedFlag) {
    formData.append('title_of_cpd', application.title);
    formData.append('venue', application.venue);
    formData.append('from_date', application.fromDate);
    formData.append('to_date', application.toDate);
  } else {
    if (approvalLetter.value) formData.append('approval_letter_attachment', approvalLetter.value);
    if (attachment.value) formData.append('general_approved_cpd_attachment', attachment.value);
  }

  // CPD Provider
  formData.append('cpd_providing_agency', cpdProvider.agency === 'other' ? '' : (parseInt(cpdProvider.agency, 10) || ''));
  if (cpdProvider.agency === 'other') {
    formData.append('if_others_specify', cpdProvider.otherAgency || '');
  }
  formData.append('reason_for_conducting', parseInt(cpdProvider.reason, 10) || '');
  formData.append('reason_for_details', cpdProvider.reasonDetails);

  // Resource Persons
  const validResourcePersons = resourcePersons.value
    .filter(person => person.regNo && person.name)
    .map(person => ({
      resource_person_reg_no: person.regNo,
      resource_person_name: person.name,
      // cpd_task: null, // Add if your backend expects this
    }));
  if (validResourcePersons.length > 0) {
    formData.append('resources', JSON.stringify(validResourcePersons));
  }
  if (resourcePersonCertificate.value) formData.append('document_supporting_expertise', resourcePersonCertificate.value);


  // Teaching/Learning Methods
  formData.append('type_of_cpd', teachingMethod.type); // Ensure this is an ID if backend expects ID
  const validMethodologies = selectedMethodologies.value.map(methodId => ({
    methodology_name: methodId, // Ensure this is an ID if backend expects ID
    // cpd_task: null,
  }));
  if (validMethodologies.length > 0) {
    formData.append('methodologies', JSON.stringify(validMethodologies));
  }

  const validLearningMethods = teachingMethods.value
    .filter(method => method.activity && method.duration > 0)
    .map(method => ({
      activities: method.activity,
      duration: method.duration,
      // cpd_task: null,
    }));
  if (validLearningMethods.length > 0) {
    formData.append('learning_methods', JSON.stringify(validLearningMethods));
  }
  formData.append('expected_outcome', teachingMethod.expectedOutcome);
  if (courseDocument.value) formData.append('course_document', courseDocument.value);


  // Participant Details (if loaded)
  if (areOptionsLoaded.value) {
    formData.append('participation_category', participantDetails.category); // Ensure this is an ID
    formData.append('participant_sub_category', participantDetails.subcategory); // Ensure this is an ID
    formData.append('number_of_participants', participantDetails.number || 0);
    formData.append('relevance_to_topic', participantDetails.relevance || '');
  }

  // Approved CPD - Participants list
  if (isCpdApprovedFlag && participants.value.length > 0) {
    const validParticipants = participants.value
      .filter(p => p.regNo && p.name)
      .map(p => ({
        participant_reg_no: p.regNo,
        // participant_name: p.name, // Backend might fetch name based on reg_no
        cpd_credits: calculatedCredits.value, // Or specific logic
        review_status: 'Pending',
        // cpd_task: null,
      }));
    if (validParticipants.length > 0) {
        formData.append('participants', JSON.stringify(validParticipants));
    }
    if (attendanceSheet.value) formData.append('attendance_sheet_attachment', attendanceSheet.value);
  }

  formData.append('is_draft', isDraft);
  return formData;
};


const saveDraft = async () => {
  // Basic check, can be expanded
  if (!applicant.agencyTrainingLocation && !application.title) {
    validationErrors.value = ["Please fill in at least Agency/Training Location or Title to save a draft."];
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }
  validationErrors.value = []; // Clear previous errors

  try {
    loading.value = true;
    const formData = prepareFormData(true);
    // Log formData entries for debugging
    // for (let [key, value] of formData.entries()) {
    //   console.log(`Draft FormData: ${key}: ${value instanceof File ? value.name : value}`);
    // }
    await apiService.createMhpcCpdTask(formData);
    successMessage.value = 'Draft saved successfully!';
    setTimeout(() => { successMessage.value = ''; }, 3000);
  } catch (error) {
    console.error('Error saving draft:', error);
    validationErrors.value = ['An error occurred while saving the draft.'];
    if (error.response && error.response.data) {
      const errorData = error.response.data; const errorMessages = [];
      const extractErrors = (obj, prefix = '') => {
        for (const key in obj) {
          if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
            extractErrors(obj[key], `${prefix}${key}.`);
          } else if (Array.isArray(obj[key])) {
             errorMessages.push(`${prefix}${key}: ${obj[key].join(', ')}`);
          } else {
            errorMessages.push(`${prefix}${key}: ${obj[key]}`);
          }
        }
      };
      extractErrors(errorData);
      if (errorMessages.length > 0) validationErrors.value = errorMessages;
      else validationErrors.value = ['Error saving draft. Please check your input.'];
    }
  } finally {
    loading.value = false;
  }
};

const handleSubmit = () => {
  if (validateForm()) {
    showConfirmation.value = true;
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

const confirmSubmit = async () => {
  showConfirmation.value = false;
  if (!validateForm()) { // Re-validate before actual submission
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }
  try {
    loading.value = true;
    validationErrors.value = [];
    const formData = prepareFormData(false);
    // Log formData entries for debugging
    // for (let [key, value] of formData.entries()) {
    //   console.log(`Submit FormData: ${key}: ${value instanceof File ? value.name : value}`);
    // }
    const response = await apiService.createMhpcCpdTask(formData);
    console.log('Form submitted successfully', response.data);
    successMessage.value = 'CPD application submitted successfully!';
    setTimeout(() => { router.push('/health_certification/track_cpd_applications'); }, 2000);
  } catch (error) {
    console.error('Error submitting form:', error);
    validationErrors.value = ['An error occurred while submitting the form.'];
     if (error.response && error.response.data) {
      const errorData = error.response.data; const errorMessages = [];
      const extractErrors = (obj, prefix = '') => {
        for (const key in obj) {
          if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
            extractErrors(obj[key], `${prefix}${key}.`);
          } else if (Array.isArray(obj[key])) {
             errorMessages.push(`${prefix}${key}: ${obj[key].join(', ')}`);
          } else {
            errorMessages.push(`${prefix}${key}: ${obj[key]}`);
          }
        }
      };
      extractErrors(errorData);
      if (errorMessages.length > 0) validationErrors.value = errorMessages;
      else validationErrors.value = ['Error submitting form. Please check your input.'];
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } finally {
    loading.value = false;
  }
};

const cancelForm = () => {
  router.push('/health_certification/dashboard'); // Or a more appropriate route
};

const fetchUserRegistrations = async () => {
  try {
    const allApplicationsResponse = await apiService.getMhpcNewApplications(); // Assuming this endpoint is correct
    if (allApplicationsResponse.data && allApplicationsResponse.data.results && Array.isArray(allApplicationsResponse.data.results)) {
      userRegistrations.value = allApplicationsResponse.data.results.map((app) => ({
        id: app.id,
        registration_no: app.registration_no,
        full_name: app.full_name,
        cid_no: app.cid_no,
      }));
      userRegistrations.value.sort((a, b) => a.full_name.localeCompare(b.full_name));
    }
  } catch (error) {
    console.error('Error fetching user registrations:', error);
  }
};

const loadDropdownOptions = async () => {
  loading.value = true;
  participantFormKey.value++; // Increment key to force re-mount of child if this is called again
  areOptionsLoaded.value = false;

  // Clear existing options
  agencyOptions.value = [];
  reasonOptions.value = [];
  cpdTypeOptions.value = [];
  methodologyOptions.value = [];
  participationCategoryOptions.value = [];
  participantSubcategoryOptions.value = [];

  console.log("PARENT: loadDropdownOptions START. participantSubcategoryOptions cleared.");

  try {
    const [
      agencyResponse,
      reasonResponse,
      cpdTypeResponse,
      methodologyResponse,
      categoriesResponse,
      subcategoriesApiResponse
    ] = await Promise.all([
      apiService.getProvidingAgency(),
      apiService.getReasonForCoducting(),
      apiService.getMhpcMastersCpdActivities(),
      apiService.getMhpcMastersCpdMethodologies(),
      apiService.getMhpcMasterData('personnel-categories'),
      apiService.getMhpcMastersSubCategories()
    ]);

    agencyOptions.value = agencyResponse?.data?.results.map(item => ({ text: item.name, value: item.id })) || [];
    reasonOptions.value = reasonResponse?.data?.results.map(item => ({ text: item.name, value: item.id })) || [];
    cpdTypeOptions.value = cpdTypeResponse?.data?.results.map(item => ({ text: item.cme_activity_name, value: item.id })) || [];
    methodologyOptions.value = methodologyResponse?.data?.results.map(item => ({ text: item.methodology_name, value: item.id })) || [];

    if (categoriesResponse?.data?.results) {
      participationCategoryOptions.value = categoriesResponse.data.results.map(category => ({
        text: category.category_name,
        value: category.id,
      }));
    }
    console.log("PARENT: Loaded participationCategoryOptions.value:", safeLogValue(participationCategoryOptions.value));
    console.log("PARENT: RAW all subcategories API response data:", safeLogValue(subcategoriesApiResponse?.data));

    if (subcategoriesApiResponse?.data?.results && Array.isArray(subcategoriesApiResponse.data.results)) {
      participantSubcategoryOptions.value = subcategoriesApiResponse.data.results.map(subcategory => ({
        text: subcategory.sub_category_name,
        value: subcategory.id,
        categoryId: subcategory.category_id || subcategory.category, // Adjust if API field name is different
      }));
      console.log("PARENT: MAPPED participantSubcategoryOptions.value:", safeLogValue(participantSubcategoryOptions.value));
    } else {
      console.error("PARENT: No results in subcategoriesApiResponse or not an array. Setting subcategories to empty.");
      participantSubcategoryOptions.value = [];
    }

  } catch (error) {
    console.error('PARENT: Error in loadDropdownOptions (Promise.all):', error);
    validationErrors.value = ['Error loading form data. Please refresh the page.'];
    // Ensure options are empty on error
    participantSubcategoryOptions.value = [];
    participationCategoryOptions.value = []; // etc. for other options
  } finally {
    console.log("PARENT: loadDropdownOptions FINALLY block. Current participantSubcategoryOptions.value:", safeLogValue(participantSubcategoryOptions.value));
    await nextTick();
    console.log("PARENT: After nextTick. Current participantSubcategoryOptions.value:", safeLogValue(participantSubcategoryOptions.value));

    loading.value = false;

    // Key incremented at the start of the function to ensure re-mount
    console.log(
      "%cPARENT: KEY TRICK - participantFormKey value:",
      "color: orange; font-weight: bold;",
      participantFormKey.value
    );

    console.log(
      "%cPARENT: IMMEDIATELY BEFORE areOptionsLoaded = true. participantSubcategoryOptions.value:",
      "color: blue; font-weight: bold;",
      safeLogValue(participantSubcategoryOptions.value)
    );
    areOptionsLoaded.value = true;
    console.log("PARENT: areOptionsLoaded set to true. participantSubcategoryOptions.value still:", safeLogValue(participantSubcategoryOptions.value));
  }
};

onMounted(async () => {
  applicant.cidNumber = authStore.user?.cid || '';
  applicant.fullName = [authStore.user?.first_name, authStore.user?.middle_name, authStore.user?.last_name].filter(Boolean).join(' ') || '';

  watch(() => participantDetails.category, (newVal, oldVal) => {
    console.log(`PARENT: participantDetails.category changed from ${safeLogValue(oldVal)} to ${safeLogValue(newVal)}`);
    // If subcategory depends on category, you might want to clear it here:
    // if (newVal !== oldVal) {
    //   participantDetails.subcategory = '';
    // }
  }, { deep: true }); // Add deep if category is an object, not needed for simple value

  await fetchUserRegistrations();
  await loadDropdownOptions(); // This will also increment the key

  // Initialize form from modelValue if provided (e.g., for editing)
  if (props.modelValue) {
    application.isApproved = props.modelValue.isApproved ? 'true' : 'false';
    application.title = props.modelValue.title || '';
    application.venue = props.modelValue.venue || '';
    application.fromDate = props.modelValue.fromDate || '';
    application.toDate = props.modelValue.toDate || '';
    // approvalLetter is a ref, handle its initialization if needed from modelValue
  }
  isCpdApproved.value = application.isApproved === 'true'; // Sync based on application state

  watch(() => application.isApproved, (newIsApproved) => {
    isCpdApproved.value = newIsApproved === 'true';
    // Potentially reset fields if isApproved changes, handled by toggleApprovedFields
  }, { immediate: true });
});
</script>