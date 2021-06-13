<template>
  <div class="mx-auto py-8">
    <FormHeader />
    <LoadingOverlay :loading="loading" />
    <!-- General errors displayed at the top -->
    <AlertMessage :messages="validationErrors" type="error" v-if="validationErrors.length > 0" />
    <AlertMessage :messages="[successMessage]" type="success" v-if="successMessage" />

    <div class="bg-white border rounded-xl shadow-lg p-6">
      <div class="space-y-8">
        <div>
          <ApplicantDetailsForm
            :applicant="applicant"
            @update:applicant="(updatedData) => Object.assign(applicant, updatedData)"
            :errors="applicantDetailsErrors"
          />
        </div>
        <div>
          <ApplicationDetailsForm
            :application="application"
            :handle-approval-letter-upload="handleApprovalLetterUpload"
            @update:modelValue="handleApplicationUpdate"
            @approval-change="toggleApprovedFields"
            :errors="applicationDetailsErrors"
          />
        </div>
        <div>
          <CpdProviderForm
            :cpd-provider="cpdProvider"
            :agency-options="agencyOptions"
            :reason-options="reasonOptions"
            @update:cpdProvider="(updatedData) => Object.assign(cpdProvider, updatedData)"
            :errors="cpdProviderErrors"
          />
        </div>
        <div>
          <ResourcePersonsForm
            v-model:modelValue="resourcePersons"
            :fetch-resource-person-details="fetchResourcePersonDetails"
            :user-registrations="userRegistrations"
            :errors="resourcePersonsErrors"
          />
        </div>
        <div>
          <TeachingLearningMethodForm
            :teaching-method="teachingMethod"
            :cpd-type-options="cpdTypeOptions"
            :methodology-options="methodologyOptions"
            v-model:selected-methodologies="selectedMethodologies"
            v-model:teaching-methods="teachingMethods"
            :total-hours="totalHours"
            :course-document="courseDocument"
            :handle-course-document-upload="handleCourseDocumentUpload"
            :add-teaching-method="addTeachingMethod"
            :remove-teaching-method="removeTeachingMethod"
            :calculate-total-hours="calculateTotalHours"
            @update-teaching-method-property="handleTeachingMethodPropertyUpdate"
            :errors="teachingLearningErrors"
          />
        </div>
        <template v-if="areOptionsLoaded">
          <div>
            <ParticipantsDetailsForm
              :key="participantFormKey"
              :participant-details="participantDetails"
              @update:participantDetails="handleParticipantDetailsUpdate"
              :participation-category-options="participationCategoryOptions"
              :participant-subcategory-options="participantSubcategoryOptions"
              :errors="participantDetailsErrors"
            />
          </div>
        </template>
        <div v-else class="bg-white border rounded-xl shadow-sm p-6 text-center my-4">
          <p class="text-gray-600 font-semibold">Loading participation options...</p>
        </div>
        <div>
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
            :errors="approvedCpdErrors"
          />
        </div>
        <div>
          <FormActions
            :loading="loading"
            :save-draft="saveDraft"
            :handle-submit="handleSubmit"
            :cancel-form="cancelForm"
            :is-valid="isFormValid"
          />
        </div>
      </div>
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
const successMessage = ref('');
const userRegistrations = ref([]);

// State for form data
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

// Dropdown options
const agencyOptions = ref([]);
const reasonOptions = ref([]);
const cpdTypeOptions = ref([]);
const methodologyOptions = ref([]);
const participationCategoryOptions = ref([]);
const participantSubcategoryOptions = ref([]);
const areOptionsLoaded = ref(false);
const participantFormKey = ref(0);

// Error state management
const validationErrors = ref([]);
const applicantDetailsErrors = ref({});
const applicationDetailsErrors = ref({});
const cpdProviderErrors = ref({});
const resourcePersonsErrors = ref([]);
const teachingLearningErrors = ref({});
const participantDetailsErrors = ref({});
const approvedCpdErrors = ref({});


const handleApplicationUpdate = (updatedData) => {
  console.log('Received application update:', updatedData);
  Object.assign(application, updatedData);
  updateModelValue();
};

const handleParticipantDetailsUpdate = (updatedDetails) => {
  console.log('Received participantDetails update:', updatedDetails);
  Object.assign(participantDetails, {
    category: Array.isArray(updatedDetails.category) ? updatedDetails.category : [],
    subcategory: Array.isArray(updatedDetails.subcategory) ? updatedDetails.subcategory : [],
    number: Number.isFinite(updatedDetails.number) ? Number(updatedDetails.number) : null,
    relevance: updatedDetails.relevance?.trim() || '',
  });
};
function handleTeachingMethodPropertyUpdate({ property, value }) {
  if (Object.hasOwn(teachingMethod, property)) {
    teachingMethod[property] = value;
  }
}

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
  updateModelValue();
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
  if (!person.regNo?.trim()) {
    person.name = '';
    console.log('fetchResourcePersonDetails: Empty regNo, clearing name');
    return;
  }
  try {
    loading.value = true;
    console.log('fetchResourcePersonDetails: Fetching for regNo:', person.regNo);
    let response = await apiService.getMhpcFullApplicationListByCid(person.regNo);
    console.log('fetchResourcePersonDetails: API response (registration_no):', response.data);
    if (response.data?.results?.length > 0) {
      const matchingApplication = response.data.results.find(
        (app) => app.registration_no === person.regNo,
      );
      if (matchingApplication) {
        person.name = matchingApplication.full_name || '';
        console.log('fetchResourcePersonDetails: Found name:', person.name);
        return;
      }
    }
    console.log('fetchResourcePersonDetails: No results for registration_no, trying cid_no');
    response = await apiService.getMhpcFullApplicationListByCid(person.regNo, true);
    console.log('fetchResourcePersonDetails: API response (cid_no):', response.data);
    if (response.data?.results?.length > 0) {
      const matchingApplication = response.data.results.find(
        (app) => app.cid_no === person.regNo
      );
      person.name = matchingApplication?.full_name || '';
      console.log('fetchResourcePersonDetails: Found name (cid_no):', person.name);
    } else {
      person.name = ''; // Allow manual entry
      console.warn('fetchResourcePersonDetails: No records found for:', person.regNo);
    }
  } catch (error) {
    console.error('fetchResourcePersonDetails: Error:', error);
    person.name = ''; // Allow manual entry
    validationErrors.value.push(`Failed to fetch details for '${person.regNo}'. You may enter the name manually.`);
  } finally {
    loading.value = false;
    console.log('fetchResourcePersonDetails: Completed, loading:', loading.value);
  }
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
      participant.name = '';
    }
  } catch (error) {
    console.error('Error fetching participant name:', error);
    participant.name = '';
  } finally {
    loading.value = false;
  }
};

const validateForm = (forDraft = false) => {
  validationErrors.value = [];
  applicantDetailsErrors.value = {};
  applicationDetailsErrors.value = {};
  cpdProviderErrors.value = {};
  resourcePersonsErrors.value = resourcePersons.value.map(() => ({}));
  teachingLearningErrors.value = {};
  participantDetailsErrors.value = {};
  approvedCpdErrors.value = {};

  let isValid = true;

  console.log('Validating Form State (forDraft:', forDraft, '):', {
    applicant, application, cpdProvider, resourcePersons: resourcePersons.value,
    teachingMethod, selectedMethodologies: selectedMethodologies.value, teachingMethods: teachingMethods.value,
    courseDocument: courseDocument.value, participantDetails, approvalLetter: approvalLetter.value,
    attachment: attachment.value, attendanceSheet: attendanceSheet.value
  });

  // --- ApplicantDetailsForm ---
  if (!forDraft && !applicant.agencyTrainingLocation?.trim()) {
    applicantDetailsErrors.value.agencyTrainingLocation = 'Agency/Training Location is required.';
    isValid = false;
  }

  // --- ApplicationDetailsForm ---
  if (!forDraft && application.isApproved === 'false') {
    if (!application.title?.trim()) {
      applicationDetailsErrors.value.title = 'Title of CPD is required.';
      isValid = false;
    }
    if (!application.venue?.trim()) {
      applicationDetailsErrors.value.venue = 'Venue is required.';
      isValid = false;
    }
    if (!application.fromDate) {
      applicationDetailsErrors.value.fromDate = 'From Date is required.';
      isValid = false;
    }
    if (!application.toDate) {
      applicationDetailsErrors.value.toDate = 'To Date is required.';
      isValid = false;
    }
    if (application.fromDate && application.toDate && new Date(application.fromDate) > new Date(application.toDate)) {
      applicationDetailsErrors.value.toDate = 'To Date must be after From Date.';
      isValid = false;
    }
  } else if (!forDraft && application.isApproved === 'true' && !approvalLetter.value) {
    applicationDetailsErrors.value.approvalLetter = 'Approval Letter is required for approved CPD.';
    isValid = false;
  }

  // --- CpdProviderForm ---
  if (!forDraft && !cpdProvider.agency) {
    cpdProviderErrors.value.agency = 'CPD Providing Agency is required.';
    isValid = false;
  }
  if (!forDraft && cpdProvider.agency === 'other' && !cpdProvider.otherAgency?.trim()) {
    cpdProviderErrors.value.otherAgency = 'Please specify the Other Agency.';
    isValid = false;
  }
  if (!forDraft && !cpdProvider.reason) {
    cpdProviderErrors.value.reason = 'Reason for Conducting is required.';
    isValid = false;
  }
  if (!forDraft && !cpdProvider.reasonDetails?.trim()) {
    cpdProviderErrors.value.reasonDetails = 'Reason Details are required.';
    isValid = false;
  }

  // --- ResourcePersonsForm ---
  if (!forDraft && resourcePersons.value.length === 0) {
    validationErrors.value.push('At least one Resource Person is required.');
    isValid = false;
  } else if (!forDraft) {
    resourcePersons.value.forEach((person, index) => {
      let personError = {};
      if (!person.regNo?.trim()) {
        personError.regNo = `Registration Number is required.`;
        isValid = false;
      }
      if (!person.certificate) {
        personError.certificate = `Document supporting expertise is required.`;
        isValid = false;
      }
      if (Object.keys(personError).length > 0) {
        resourcePersonsErrors.value[index] = { ...resourcePersonsErrors.value[index], ...personError };
      }
    });
  }

  // --- TeachingLearningMethodForm ---
  if (!forDraft && !teachingMethod.type?.trim()) {
    teachingLearningErrors.value.type = 'Type of CPD is required.';
    isValid = false;
  }
  if (!forDraft && !selectedMethodologies.value.length) {
    teachingLearningErrors.value.selectedMethodologies = 'At least one Methodology must be selected.';
    isValid = false;
  }
  if (!forDraft && !teachingMethod.expectedOutcome?.trim()) {
    teachingLearningErrors.value.expectedOutcome = 'Expected Outcome is required.';
    isValid = false;
  }
  if (!forDraft) {
    const hasValidTeachingMethod = teachingMethods.value.some(
      (method) => method.activity?.trim() && method.duration !== null && Number(method.duration) > 0
    );
    if (!hasValidTeachingMethod) {
      teachingLearningErrors.value.teachingMethods = 'At least one Teaching Method with activity and positive duration is required.';
      isValid = false;
    }
  }
  if (!forDraft && !courseDocument.value) {
    teachingLearningErrors.value.courseDocument = 'Course Document is required.';
    isValid = false;
  }

  // --- ParticipantsDetailsForm ---
  if (areOptionsLoaded.value && !forDraft) {
    if (!participantDetails.category?.length) {
      participantDetailsErrors.value.categories = 'At least one Participation Category is required.';
      isValid = false;
    }
    const selectedCategoriesHaveSubcategories = participantDetails.category.some(catId =>
      participantSubcategoryOptions.value.some(subOpt => subOpt.categoryId === catId)
    );
    if (selectedCategoriesHaveSubcategories && (!participantDetails.subcategory || participantDetails.subcategory.length === 0)) {
      participantDetailsErrors.value.subcategories = 'At least one Participant Sub-Category is required.';
      isValid = false;
    }
    if (participantDetails.number === null || participantDetails.number === undefined || Number(participantDetails.number) <= 0) {
      participantDetailsErrors.value.number = 'Number of participants must be a positive number.';
      isValid = false;
    }
    if (participantDetails.category.length > 1 && !participantDetails.relevance?.trim()) {
      participantDetailsErrors.value.relevance = 'Relevance is required when multiple categories are selected.';
      isValid = false;
    }
  } else if (!forDraft) {
    validationErrors.value.push('Participation options are still loading.');
    isValid = false;
  }

  // --- ApprovedCpdForm ---
  if (!forDraft && application.isApproved === 'true') {
    if (!attachment.value) {
      approvedCpdErrors.value.attachment = 'General Attachment is required for approved CPD.';
      isValid = false;
    }
    if (participants.value.length > 0 && !attendanceSheet.value) {
      approvedCpdErrors.value.attendanceSheet = 'Attendance Sheet is required when participants are listed.';
      isValid = false;
    }
  }

  if (!isValid && !forDraft) {
    validationErrors.value.push('Please correct the errors indicated in the form sections.');
  }

  console.log('Validation Errors Output:', {
    general: validationErrors.value,
    applicant: applicantDetailsErrors.value,
    application: applicationDetailsErrors.value,
    cpdProvider: cpdProviderErrors.value,
    resourcePersons: resourcePersonsErrors.value,
    teachingLearning: teachingLearningErrors.value,
    participant: participantDetailsErrors.value,
    approvedCpd: approvedCpdErrors.value
  });
  return isValid;
};
const isFormValid = computed(() => {
  const errors = {
    general: validationErrors.value.length > 0,
    applicant: Object.keys(applicantDetailsErrors.value).length > 0,
    application: Object.keys(applicationDetailsErrors.value).length > 0,
    cpdProvider: Object.keys(cpdProviderErrors.value).length > 0,
    resourcePersons: !resourcePersonsErrors.value.every(err => Object.keys(err).length === 0),
    teachingLearning: Object.keys(teachingLearningErrors.value).length > 0,
    participantDetails: Object.keys(participantDetailsErrors.value).length > 0,
    approvedCpd: Object.keys(approvedCpdErrors.value).length > 0,
  };
  console.log('isFormValid checks:', errors);
  return (
    validationErrors.value.length === 0 &&
    Object.keys(applicantDetailsErrors.value).length === 0 &&
    Object.keys(applicationDetailsErrors.value).length === 0 &&
    Object.keys(cpdProviderErrors.value).length === 0 &&
    resourcePersonsErrors.value.every(err => Object.keys(err).length === 0) &&
    Object.keys(teachingLearningErrors.value).length === 0 &&
    Object.keys(participantDetailsErrors.value).length === 0 &&
    Object.keys(approvedCpdErrors.value).length === 0
  );
});

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
    .filter((person) => person.regNo?.trim() && person.name?.trim() && person.certificate)
    .map((person) => ({
      resource_person_reg_no: person.regNo,
      resource_person_name: person.name,
      // cpd_task: null, // Add if your backend expects this
    }));

  if (validResourcePersons.length > 0) {
    validResourcePersons.forEach((person, index) => {
      formData.append(`resources[${index}][resource_person_reg_no]`, person.resource_person_reg_no);
      formData.append(`resources[${index}][resource_person_name]`, person.resource_person_name);
      formData.append(`resources[${index}][document_supporting_expertise]`, person.document_supporting_expertise);
    });
  } else if (!isDraft && resourcePersons.value.some(p => p.regNo || p.certificate)) { // If not draft and some incomplete RPs exist
    // This case should be caught by validation, ensures no partial invalid RP data is sent unless drafting
  }


  formData.append('type_of_cpd', teachingMethod.type || '');
  if (selectedMethodologies.value.length > 0) {
    formData.append('methodologies', JSON.stringify(
      selectedMethodologies.value.map((methodId) => ({ methodology_name: methodId }))
    ));
  }

  const validLearningMethods = teachingMethods.value
    .filter((method) => method.activity?.trim() && method.duration !== null && Number(method.duration) > 0)
    .map((method) => ({
      activities: method.activity.trim(),
      duration: Number(method.duration),
    }));
  if (validLearningMethods.length > 0) {
    formData.append('learning_methods', JSON.stringify(validLearningMethods));
  } else if (!isDraft && teachingMethods.value.some(m => m.activity || m.duration)) {
    // caught by validation
  }

  formData.append('expected_outcome', teachingMethod.expectedOutcome?.trim() || '');
  if (courseDocument.value) formData.append('course_document', courseDocument.value);

  if (areOptionsLoaded.value || isDraft) {
    formData.append('participation_category', JSON.stringify(participantDetails.category || []));
    formData.append('participant_sub_category', JSON.stringify(participantDetails.subcategory || []));
    formData.append('number_of_participants', (participantDetails.number !== null && participantDetails.number !== undefined) ? participantDetails.number : (isDraft ? '' : 0));
    formData.append('relevance_to_topic', participantDetails.relevance?.trim() || '');
  }


  if (isCpdApprovedFlag && participants.value.length > 0) {
    const validParticipants = participants.value
      .filter((p) => p.regNo?.trim() && p.name?.trim())
      .map((p) => ({
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
  console.log('SAVE DRAFT: Starting', { agencyTrainingLocation: applicant.agencyTrainingLocation, title: application.title });
  if (!applicant.agencyTrainingLocation?.trim() && !application.title?.trim()) {
    console.log('SAVE DRAFT: Validation failed');
    validationErrors.value = ['Please fill in at least Agency/Training Location or Title to save a draft.'];
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return false;
  }
  try {
    loading.value = true;
    console.log('SAVE DRAFT: Preparing form data');
    const formData = prepareFormData(true);
    console.log('SAVE DRAFT: FormData prepared');
    await apiService.createMhpcCpdTask(formData);
    console.log('SAVE DRAFT: Success');
    successMessage.value = 'Draft saved successfully!';
    validationErrors.value = [];
    applicantDetailsErrors.value = {};
    applicationDetailsErrors.value = {};
    cpdProviderErrors.value = {};
    resourcePersonsErrors.value = resourcePersons.value.map(() => ({}));
    teachingLearningErrors.value = {};
    participantDetailsErrors.value = {};
    approvedCpdErrors.value = {};
    setTimeout(() => {
      successMessage.value = '';
    }, 3000);
    return true;
  } catch (error) {
    console.error('SAVE DRAFT: Error:', error);
    validationErrors.value = ['An error occurred while saving the draft.'];
    if (error.response?.data) {
      const errorMessages = Object.values(error.response.data).flat();
      validationErrors.value = [...validationErrors.value, ...errorMessages];
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return false;
  } finally {
    loading.value = false;
    console.log('SAVE DRAFT: Completed, loading:', loading.value);
  }
};


const handleSubmit = () => {
  console.log('HANDLE SUBMIT CLICKED - Function Entry');
  const isValidNow = validateForm(false);
  console.log('HANDLE SUBMIT - isValidNow:', isValidNow);// false means not for draft
  if (isValidNow) {
    console.log('HANDLE SUBMIT - Form is valid, showing confirmation');
    showConfirmation.value = true;
  } else {
    console.log('HANDLE SUBMIT - Form is INVALID');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

const confirmSubmit = async () => {
  console.log('CONFIRM SUBMIT CLICKED - Function Entry');
  showConfirmation.value = false;
  const isValidNow = validateForm(false);
  console.log('CONFIRM SUBMIT - isValidNow (re-validation):', isValidNow); // Re-validate before actual submission
  if (!isValidNow) {
    console.log('CONFIRM SUBMIT - Form is INVALID on re-validation');
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
    validationErrors.value = [];
    applicantDetailsErrors.value = {}; applicationDetailsErrors.value = {}; cpdProviderErrors.value = {};
    resourcePersonsErrors.value = []; teachingLearningErrors.value = {}; participantDetailsErrors.value = {};
    approvedCpdErrors.value = {};

    setTimeout(() => {
      router.push('/health_certification/track_cpd_applications');
    }, 2000);
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
    validationErrors.value.push('Error fetching user registrations for lookup.');
  }
};

const loadDropdownOptions = async () => {
  console.log('loadDropdownOptions: Starting...');
  loading.value = true;
  areOptionsLoaded.value = false;

  participationCategoryOptions.value = [];
  participantSubcategoryOptions.value = [];

  try {
    console.log('loadDropdownOptions: About to call Promise.all');
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
      apiService.getMhpcMastersSingleCpdActivity(),
      apiService.getMhpcMastersCpdMethodologies(),
      apiService.getMhpcMasterData('personnel-categories'),
      apiService.getMhpcMastersSubCategories(),
    ]);

    console.log('loadDropdownOptions: Promise.all resolved.');
    // console.log('RAW categoriesResponse:', JSON.stringify(categoriesResponse, null, 2));
    // console.log('RAW subcategoriesResponse:', JSON.stringify(subcategoriesResponse, null, 2));


    if (categoriesResponse && categoriesResponse.data && categoriesResponse.data.results) {
      // console.log('categoriesResponse.data.results:', JSON.stringify(categoriesResponse.data.results, null, 2));
      participationCategoryOptions.value = categoriesResponse.data.results.map((category) => ({
        text: category.category_name,
        value: category.id,
      }));
      // console.log('MAPPED participationCategoryOptions.value:', JSON.stringify(participationCategoryOptions.value, null, 2));
    } else {
      console.error('loadDropdownOptions: categoriesResponse structure is NOT as expected.');
      participationCategoryOptions.value = [];
    }

    if (subcategoriesResponse && subcategoriesResponse.data && subcategoriesResponse.data.results) {
      // console.log('subcategoriesResponse.data.results:', JSON.stringify(subcategoriesResponse.data.results, null, 2));
      participantSubcategoryOptions.value = subcategoriesResponse.data.results.map((subcategory) => ({
        text: subcategory.sub_category_name,
        value: subcategory.id,
        categoryId: subcategory.category_name, // Backend field, maps to category ID
      }));
      // console.log('MAPPED participantSubcategoryOptions.value:', JSON.stringify(participantSubcategoryOptions.value, null, 2));
    } else {
      console.error('loadDropdownOptions: subcategoriesResponse structure is NOT as expected.');
      participantSubcategoryOptions.value = [];
    }

    agencyOptions.value =
      agencyResponse?.data?.results.map((item) => ({ text: item.name, value: item.id })) || [];
    reasonOptions.value =
      reasonResponse?.data?.results.map((item) => ({ text: item.name, value: item.id })) || [];
    cpdTypeOptions.value =
      cpdTypeResponse?.data?.results.map((item) => ({
        text: item.cpd_activity_name,
        value: item.id,
      })) || [];
    methodologyOptions.value =
      methodologyResponse?.data?.results.map((item) => ({
        text: item.methodology_name,
        value: item.id,
      })) || [];

  } catch (error) {
    console.error('loadDropdownOptions: CRITICAL ERROR:', error);
    validationErrors.value.push('Error loading critical form data. Please refresh.');
    participationCategoryOptions.value = [];
    participantSubcategoryOptions.value = [];
    agencyOptions.value = []; reasonOptions.value = []; cpdTypeOptions.value = []; methodologyOptions.value = [];
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
    console.log('loadDropdownOptions: FINALLY block. areOptionsLoaded:', areOptionsLoaded.value);
    console.log('------------------- END loadDropdownOptions -------------------');
  }
};

onMounted(async () => {
  console.log('onMounted: Initial modelValue:', props.modelValue);
  // Clear initial errors
  validationErrors.value = [];
  applicantDetailsErrors.value = {};
  applicationDetailsErrors.value = {};
  cpdProviderErrors.value = {};
  resourcePersonsErrors.value = resourcePersons.value.map(() => ({}));
  teachingLearningErrors.value = {};
  participantDetailsErrors.value = {};
  approvedCpdErrors.value = {};

  if (props.modelValue && Object.keys(props.modelValue).length > 0) {
    application.isApproved = props.modelValue.isApproved ? 'true' : 'false';
    application.title = props.modelValue.title || '';
    application.venue = props.modelValue.venue || '';
    application.fromDate = props.modelValue.fromDate || '';
    application.toDate = props.modelValue.toDate || '';
    if (props.modelValue.approvalLetter instanceof File) {
      approvalLetter.value = props.modelValue.approvalLetter;
    }
  } else {
    console.warn('No modelValue provided, using default application state');
  }

  applicant.cidNumber = authStore.user?.cid || '';
  applicant.fullName = [authStore.user?.first_name, authStore.user?.middle_name, authStore.user?.last_name]
    .filter(Boolean)
    .join(' ') || '';

  await fetchUserRegistrations();
  await loadDropdownOptions();
});
watch(teachingMethod, (newMethod) => {
  console.log('teachingMethod:', newMethod);
}, { deep: true });
watch(selectedMethodologies, (newMethods) => {
  console.log('selectedMethodologies:', newMethods);
}, { deep: true });
watch(teachingMethods, (newMethods) => {
  console.log('teachingMethods:', newMethods);
}, { deep: true });
console.log('courseDocument:', courseDocument.value);
watch(applicant, (newApplicant) => {
  console.log('applicant:', newApplicant);
}, { deep: true });
watch(cpdProvider, (newProvider) => {
  console.log('cpdProvider:', newProvider);
}, { deep: true });
watch([loading, isFormValid], ([newLoading, newIsFormValid]) => {
  console.log('FormActions: loading:', newLoading, 'isValid:', newIsFormValid);
});

// Optional: If you want initial validation errors to show on load (e.g., for an empty form)
// Be cautious with this if loading existing data that might initially be invalid before user interaction.
// if (!props.modelValue || Object.keys(props.modelValue).length === 0) { // Example: only for new forms
//   validateForm(false);
// }
</script>