<!-- Parent Component: CpdProviderApplication.vue -->
<template>
  <div class="mx-auto py-8">
    <FormHeader />
    <LoadingOverlay :loading="loading" />
    <AlertMessage :messages="validationErrors" type="error" />
    <AlertMessage :messages="[successMessage]" type="success" v-if="successMessage" />

    <div class="bg-white border rounded-xl shadow-lg p-6">
      <div class="space-y-8">
        <div>
          <ApplicantDetailsForm
            :applicant="applicant"
            @update:applicant="(updatedData) => Object.assign(applicant, updatedData)"
          />
        </div>
        <div>
          <ApplicationDetailsForm
            :application="application"
            :handle-approval-letter-upload="handleApprovalLetterUpload"
            @update:modelValue="handleApplicationUpdate"
            @approval-change="toggleApprovedFields"
          />
        </div>
        <div>
          <CpdProviderForm
            :cpd-provider="cpdProvider"
            :agency-options="agencyOptions"
            :reason-options="reasonOptions"
            @update:cpdProvider="(updatedData) => Object.assign(cpdProvider, updatedData)"
          />
        </div>
        <div>
          <ResourcePersonsForm
            v-model:resource-persons="resourcePersons"
            :fetch-resource-person-details="fetchResourcePersonDetails"
            :user-registrations="userRegistrations"
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
import { ref, reactive, onMounted, watch, computed } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'vue-router';
import apiService from '@/services/services';

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

const authStore = useAuthStore();
const router = useRouter();

const loading = ref(false);
const showConfirmation = ref(false);
const validationErrors = ref([]);
const participantDetailsErrors = ref({});
const successMessage = ref('');
const userRegistrations = ref([]);

const applicant = reactive({
  registrationNumber: '',
  cidNumber: '',
  fullName: '',
  agencyTrainingLocation: '',
});

const application = reactive({
  isApproved: 'false',
  title: '',
  venue: '',
  fromDate: '',
  toDate: '',
});

const cpdProvider = reactive({
  agency: '',
  otherAgency: '',
  reason: '',
  reasonDetails: '',
});

const resourcePersons = ref([{ regNo: '', name: '', certificate: null }]);
const teachingMethod = reactive({
  type: '',
  expectedOutcome: '',
});
const selectedMethodologies = ref([]);
const teachingMethods = ref([{ activity: '', duration: null }]);
const totalHours = ref(0);
const calculatedCredits = ref(0);

const participantDetails = reactive({
  category: [],
  subcategory: [],
  number: null,
  relevance: '',
});

const participants = ref([]);
const isCpdApproved = ref(false);

const approvalLetter = ref(null);
const courseDocument = ref(null);
const attendanceSheet = ref(null);
const attachment = ref(null);

const agencyOptions = ref([]);
const reasonOptions = ref([]);
const cpdTypeOptions = ref([]);
const methodologyOptions = ref([]);
const participationCategoryOptions = ref([]);
const participantSubcategoryOptions = ref([]);
const areOptionsLoaded = ref(false);
const participantFormKey = ref(0);

const updateModelValue = () => {
  emit('update:modelValue', {
    isApproved: application.isApproved === 'true',
    title: application.title,
    venue: application.venue,
    fromDate: application.fromDate,
    toDate: application.toDate,
    approvalLetter: approvalLetter.value,
  });
};

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
    number: Number(updatedDetails.number) || null,
    relevance: updatedDetails.relevance?.trim() || '',
  });
};

const toggleApprovedFields = () => {
  if (application.isApproved === 'true') {
    application.title = '';
    application.venue = '';
    application.fromDate = '';
    application.toDate = '';
  } else {
    approvalLetter.value = null;
    attachment.value = null;
  }
  updateModelValue();
};

const handleApprovalLetterUpload = (event) => {
  const file = event.target.files?.[0];
  if (file && file.type === 'application/pdf' && file.size <= 5 * 1024 * 1024) {
    approvalLetter.value = file;
  } else {
    approvalLetter.value = null;
    event.target.value = '';
    validationErrors.value.push('Please upload a valid PDF file less than 5MB for Approval Letter.');
  }
  updateModelValue();
};

const handleCourseDocumentUpload = (event) => {
  const file = event.target.files?.[0];
  if (file && file.type === 'application/pdf' && file.size <= 5 * 1024 * 1024) {
    courseDocument.value = file;
  } else {
    courseDocument.value = null;
    event.target.value = '';
    validationErrors.value.push('Please upload a valid PDF file less than 5MB for Course Document.');
  }
};

const handleAttendanceSheetUpload = (event) => {
  const file = event.target.files?.[0];
  if (file && file.type === 'application/pdf' && file.size <= 5 * 1024 * 1024) {
    attendanceSheet.value = file;
  } else {
    attendanceSheet.value = null;
    event.target.value = '';
    validationErrors.value.push('Please upload a valid PDF file less than 5MB for Attendance Sheet.');
  }
};

const handleAttachmentUpload = (event) => {
  const file = event.target.files?.[0];
  if (file && file.type === 'application/pdf' && file.size <= 5 * 1024 * 1024) {
    attachment.value = file;
  } else {
    attachment.value = null;
    event.target.value = '';
    validationErrors.value.push('Please upload a valid PDF file less than 5MB for Attachment.');
  }
};

const fetchResourcePersonDetails = async (person) => {
  if (!person.regNo) {
    person.name = '';
    return;
  }
  try {
    loading.value = true;
    const response = await apiService.getMhpcFullApplicationListByCid('');
    if (response.data && response.data.results && Array.isArray(response.data.results)) {
      const matchingApplication = response.data.results.find(
        (app) => app.registration_no === person.regNo
      );
      person.name = matchingApplication ? matchingApplication.full_name || 'Unknown' : '';
    } else {
      person.name = '';
      validationErrors.value.push(`Invalid registration number: ${person.regNo}`);
    }
  } catch (error) {
    console.error('Error fetching resource person details:', error);
    person.name = '';
    validationErrors.value.push('Error fetching resource person details.');
  } finally {
    loading.value = false;
  }
};

const addTeachingMethod = () => {
  teachingMethods.value.push({ activity: '', duration: null });
};

const removeTeachingMethod = (index) => {
  teachingMethods.value.splice(index, 1);
  if (teachingMethods.value.length === 0) {
    teachingMethods.value.push({ activity: '', duration: null });
  }
  calculateTotalHours();
};

const calculateTotalHours = () => {
  totalHours.value = teachingMethods.value.reduce((sum, method) => {
    return sum + (Number(method.duration) || 0);
  }, 0);
  calculatedCredits.value = totalHours.value;
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
    const response = await apiService.getMhpcFullApplicationListByCid('');
    if (response.data && response.data.results && Array.isArray(response.data.results)) {
      const matchingApplication = response.data.results.find(
        (app) => app.registration_no === participant.regNo
      );
      participant.name = matchingApplication ? matchingApplication.full_name || 'Unknown' : '';
    } else {
      participant.name = '';
      validationErrors.value.push(`Invalid participant registration number: ${participant.regNo}`);
    }
  } catch (error) {
    console.error('Error fetching participant name:', error);
    participant.name = '';
    validationErrors.value.push('Error fetching participant details.');
  } finally {
    loading.value = false;
  }
};

const validateForm = () => {
  validationErrors.value = [];
  participantDetailsErrors.value = {};

  // Debug: Log critical state for validation errors
  console.log('Validating Form State:', {
    application: {
      title: application.title,
      isApproved: application.isApproved,
    },
    teachingMethod: {
      type: teachingMethod.type,
      expectedOutcome: teachingMethod.expectedOutcome,
    },
    selectedMethodologies: selectedMethodologies.value,
    teachingMethods: teachingMethods.value,
    courseDocument: courseDocument.value,
    participantDetails: {
      category: participantDetails.category,
      subcategory: participantDetails.subcategory,
      number: participantDetails.number,
      relevance: participantDetails.relevance,
    },
  });

  // ApplicantDetailsForm
  if (!applicant.agencyTrainingLocation?.trim()) {
    validationErrors.value.push('Agency/Training Location is required.');
  }

  // ApplicationDetailsForm
  if (application.isApproved === null || application.isApproved === undefined) {
    validationErrors.value.push('Please specify if CPD is validated.');
  } else if (application.isApproved === 'false') {
    if (!application.title?.trim()) {
      validationErrors.value.push('Title of CPD is required.');
    }
    if (!application.venue?.trim()) {
      validationErrors.value.push('Venue is required.');
    }
    if (!application.fromDate) {
      validationErrors.value.push('From Date is required.');
    }
    if (!application.toDate) {
      validationErrors.value.push('To Date is required.');
    }
    if (
      application.fromDate &&
      application.toDate &&
      new Date(application.fromDate) > new Date(application.toDate)
    ) {
      validationErrors.value.push('To Date must be after From Date.');
    }
  } else if (application.isApproved === 'true' && !approvalLetter.value) {
    validationErrors.value.push('Approval Letter is required for approved CPD.');
  }

  // CpdProviderForm
  if (!cpdProvider.agency) {
    validationErrors.value.push('CPD Providing Agency is required.');
  }
  if (cpdProvider.agency === 'other' && !cpdProvider.otherAgency?.trim()) {
    validationErrors.value.push('Please specify the Other Agency.');
  }
  if (!cpdProvider.reason) {
    validationErrors.value.push('Reason for Conducting is required.');
  }
  if (!cpdProvider.reasonDetails?.trim()) {
    validationErrors.value.push('Reason Details are required.');
  }

  // ResourcePersonsForm
  resourcePersons.value.forEach((person, index) => {
    if (!person.regNo?.trim()) {
      validationErrors.value.push(`Registration Number is required for Resource Person ${index + 1}.`);
    }
    if (!person.certificate) {
      validationErrors.value.push(`Document supporting expertise is required for Resource Person ${index + 1}.`);
    }
  });

  // TeachingLearningMethodForm
  if (!teachingMethod.type?.trim()) {
    validationErrors.value.push('Type of CPD is required.');
  }
  if (!selectedMethodologies.value?.length) {
    validationErrors.value.push('At least one Methodology must be selected.');
  }
  if (!teachingMethod.expectedOutcome?.trim()) {
    validationErrors.value.push('Expected Outcome is required.');
  }
  const hasValidTeachingMethod = teachingMethods.value.some(
    (method) => method.activity?.trim() && Number(method.duration) > 0
  );
  if (!hasValidTeachingMethod) {
    validationErrors.value.push('At least one Teaching Method with activity and positive duration is required.');
  }
  if (!courseDocument.value) {
    validationErrors.value.push('Course Document is required.');
  }

  // ParticipantsDetailsForm
  if (areOptionsLoaded.value) {
    if (!participantDetails.category?.length) {
      participantDetailsErrors.value.categories = 'At least one Participation Category is required.';
      validationErrors.value.push('At least one Participation Category is required.');
    }
    if (participantSubcategoryOptions.value?.length > 0 && !participantDetails.subcategory?.length) {
      participantDetailsErrors.value.subcategories = 'At least one Participant Sub-Category is required.';
      validationErrors.value.push('At least one Participant Sub-Category is required.');
    }
    if (!participantDetails.number || participantDetails.number <= 0) {
      participantDetailsErrors.value.number = 'Number of Participants must be a positive number.';
      validationErrors.value.push('Number of Participants must be a positive number.');
    }
    if (participantDetails.category?.length > 1 && !participantDetails.relevance?.trim()) {
      participantDetailsErrors.value.relevance = 'Relevance to profession is required when multiple categories are selected.';
      validationErrors.value.push('Relevance to profession is required when multiple categories are selected.');
    }
  }

  // ApprovedCpdForm
  if (application.isApproved === 'true') {
    if (!attachment.value) {
      validationErrors.value.push('General Attachment is required for approved CPD.');
    }
    if (participants.value.length > 0 && !attendanceSheet.value) {
      validationErrors.value.push('Attendance Sheet is required when participants are listed for an approved CPD.');
    }
  }

  // Ensure at least one resource person
  if (resourcePersons.value.length === 0) {
    validationErrors.value.push('At least one Resource Person is required.');
  }

  console.log('Validation Errors:', validationErrors.value);
  return validationErrors.value.length === 0;
};

const isFormValid = computed(() => validateForm());

const prepareFormData = (isDraft = false) => {
  const formData = new FormData();
  formData.append('cid_no', applicant.cidNumber || '');
  formData.append('full_name', applicant.fullName || '');
  formData.append('proposed_training_location', applicant.agencyTrainingLocation?.trim() || '');

  const isCpdApprovedFlag = application.isApproved === 'true';
  formData.append('is_cpd_approved', isCpdApprovedFlag);

  if (!isCpdApprovedFlag) {
    formData.append('title_of_cpd', application.title?.trim() || '');
    formData.append('venue', application.venue?.trim() || '');
    formData.append('from_date', application.fromDate || '');
    formData.append('to_date', application.toDate || '');
  } else {
    if (approvalLetter.value) formData.append('approval_letter_attachment', approvalLetter.value);
    if (attachment.value) formData.append('general_approved_cpd_attachment', attachment.value);
  }

  formData.append('cpd_providing_agency', cpdProvider.agency === 'other' ? '' : cpdProvider.agency || '');
  if (cpdProvider.agency === 'other') {
    formData.append('if_others_specify', cpdProvider.otherAgency?.trim() || '');
  }
  formData.append('reason_for_conducting', cpdProvider.reason || '');
  formData.append('reason_for_details', cpdProvider.reasonDetails?.trim() || '');

  const validResourcePersons = resourcePersons.value
    .filter((person) => person.regNo?.trim() && person.name && person.certificate)
    .map((person) => ({
      resource_person_reg_no: person.regNo,
      resource_person_name: person.name,
      document_supporting_expertise: person.certificate,
    }));
  if (validResourcePersons.length > 0) {
    validResourcePersons.forEach((person, index) => {
      formData.append(`resources[${index}][resource_person_reg_no]`, person.resource_person_reg_no);
      formData.append(`resources[${index}][resource_person_name]`, person.resource_person_name);
      formData.append(`resources[${index}][document_supporting_expertise]`, person.document_supporting_expertise);
    });
  }

  formData.append('type_of_cpd', teachingMethod.type || '');
  if (selectedMethodologies.value.length > 0) {
    formData.append('methodologies', JSON.stringify(
      selectedMethodologies.value.map((methodId) => ({ methodology_name: methodId }))
    ));
  }

  const validLearningMethods = teachingMethods.value
    .filter((method) => method.activity?.trim() && Number(method.duration) > 0)
    .map((method) => ({
      activities: method.activity.trim(),
      duration: Number(method.duration),
    }));
  if (validLearningMethods.length > 0) {
    formData.append('learning_methods', JSON.stringify(validLearningMethods));
  }
  formData.append('expected_outcome', teachingMethod.expectedOutcome?.trim() || '');
  if (courseDocument.value) formData.append('course_document', courseDocument.value);

  if (areOptionsLoaded.value) {
    formData.append('participation_category', JSON.stringify(participantDetails.category));
    formData.append('participant_sub_category', JSON.stringify(participantDetails.subcategory));
    formData.append('number_of_participants', participantDetails.number || 0);
    formData.append('relevance_to_topic', participantDetails.relevance?.trim() || '');
  }

  if (isCpdApprovedFlag && participants.value.length > 0) {
    const validParticipants = participants.value
      .filter((p) => p.regNo && p.name)
      .map((p) => ({
        participant_reg_no: p.regNo,
        cpd_credits: calculatedCredits.value,
        review_status: 'Pending',
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
  if (!applicant.agencyTrainingLocation?.trim() && !application.title?.trim()) {
    validationErrors.value = [
      'Please fill in at least Agency/Training Location or Title to save a draft.',
    ];
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  try {
    loading.value = true;
    const formData = prepareFormData(true);
    await apiService.createMhpcCpdTask(formData);
    successMessage.value = 'Draft saved successfully!';
    validationErrors.value = [];
    setTimeout(() => {
      successMessage.value = '';
    }, 3000);
  } catch (error) {
    console.error('Error saving draft:', error);
    validationErrors.value = ['An error occurred while saving the draft.'];
    if (error.response && error.response.data) {
      const errorMessages = Object.values(error.response.data).flat();
      validationErrors.value = errorMessages.length > 0 ? errorMessages : validationErrors.value;
    }
  } finally {
    loading.value = false;
  }
};

const handleSubmit = () => {
  if (isFormValid.value) {
    showConfirmation.value = true;
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

const confirmSubmit = async () => {
  showConfirmation.value = false;
  if (!isFormValid.value) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }
  try {
    loading.value = true;
    const formData = prepareFormData(false);
    const response = await apiService.createMhpcCpdTask(formData);
    console.log('Form submitted successfully', response.data);
    successMessage.value = 'CPD application submitted successfully!';
    validationErrors.value = [];
    setTimeout(() => {
      router.push('/health_certification/track_cpd_applications');
    }, 2000);
  } catch (error) {
    console.error('Error submitting form:', error);
    validationErrors.value = ['An error occurred while submitting the form.'];
    if (error.response && error.response.data) {
      const backendErrorMessages = Object.entries(error.response.data).map(([key, value]) => {
        if (Array.isArray(value)) return `${key}: ${value.join(', ')}`;
        return `${key}: ${value}`;
      });
      validationErrors.value = [...validationErrors.value, ...backendErrorMessages];
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } finally {
    loading.value = false;
  }
};

const cancelForm = () => {
  router.push('/health_certification/dashboard');
};

const fetchUserRegistrations = async () => {
  try {
    const response = await apiService.getMhpcNewApplications();
    if (response.data && response.data.results && Array.isArray(response.data.results)) {
      userRegistrations.value = response.data.results.map((app) => ({
        id: app.id,
        registration_no: app.registration_no,
        full_name: app.full_name,
        cid_no: app.cid_no,
      }));
      userRegistrations.value.sort((a, b) => a.full_name.localeCompare(b.full_name));
    }
  } catch (error) {
    console.error('Error fetching user registrations:', error);
    validationErrors.value.push('Error fetching user registrations.');
  }
};

const loadDropdownOptions = async () => {
  loading.value = true;
  participantFormKey.value++;
  areOptionsLoaded.value = false;

  try {
    const [
      agencyResponse,
      reasonResponse,
      cpdTypeResponse,
      methodologyResponse,
      categoriesResponse,
      subcategoriesResponse,
    ] = await Promise.all([
      apiService.getProvidingAgency(),
      apiService.getReasonForCoducting(),
      apiService.getMhpcMastersCpdActivities(),
      apiService.getMhpcMastersCpdMethodologies(),
      apiService.getMhpcMasterData('personnel-categories'),
      apiService.getMhpcMastersSubCategories(),
    ]);

    agencyOptions.value =
      agencyResponse?.data?.results.map((item) => ({ text: item.name, value: item.id })) || [];
    reasonOptions.value =
      reasonResponse?.data?.results.map((item) => ({ text: item.name, value: item.id })) || [];
    cpdTypeOptions.value =
      cpdTypeResponse?.data?.results.map((item) => ({
        text: item.cme_activity_name,
        value: item.id,
      })) || [];
    methodologyOptions.value =
      methodologyResponse?.data?.results.map((item) => ({
        text: item.methodology_name,
        value: item.id,
      })) || [];
    participationCategoryOptions.value =
      categoriesResponse?.data?.results.map((category) => ({
        text: category.category_name,
        value: category.id,
      })) || [];
    participantSubcategoryOptions.value =
      subcategoriesResponse?.data?.results.map((subcategory) => ({
        text: subcategory.sub_category_name,
        value: subcategory.id,
        categoryId: subcategory.category_id || subcategory.category,
      })) || [];
  } catch (error) {
    console.error('Error loading dropdown options:', error);
    validationErrors.value = ['Error loading form data. Please refresh the page.'];
  } finally {
    loading.value = false;
    areOptionsLoaded.value = true;
  }
};

onMounted(async () => {
  applicant.cidNumber = authStore.user?.cid || '';
  applicant.fullName =
    [authStore.user?.first_name, authStore.user?.middle_name, authStore.user?.last_name]
      .filter(Boolean)
      .join(' ') || '';

  await fetchUserRegistrations();
  await loadDropdownOptions();

  if (props.modelValue) {
    application.isApproved = props.modelValue.isApproved ? 'true' : 'false';
    application.title = props.modelValue.title || '';
    application.venue = props.modelValue.venue || '';
    application.fromDate = props.modelValue.fromDate || '';
    application.toDate = props.modelValue.toDate || '';
    if (props.modelValue.approvalLetter instanceof File) {
      approvalLetter.value = props.modelValue.approvalLetter;
    }
  }

  isCpdApproved.value = application.isApproved === 'true';

  watch(
    () => application.isApproved,
    (newIsApprovedString) => {
      isCpdApproved.value = newIsApprovedString === 'true';
    },
    { immediate: true }
  );

  watch(
    [
      () => applicant.agencyTrainingLocation,
      () => application.isApproved,
      () => application.title,
      () => application.venue,
      () => application.fromDate,
      () => application.toDate,
      () => approvalLetter.value,
      () => cpdProvider.agency,
      () => cpdProvider.otherAgency,
      () => cpdProvider.reason,
      () => cpdProvider.reasonDetails,
      () => resourcePersons.value,
      () => teachingMethod.type,
      () => teachingMethod.expectedOutcome,
      () => selectedMethodologies.value,
      () => teachingMethods.value,
      () => courseDocument.value,
      () => participantDetails.category,
      () => participantDetails.subcategory,
      () => participantDetails.number,
      () => participantDetails.relevance,
      () => participants.value,
      () => attendanceSheet.value,
      () => attachment.value,
    ],
    () => {
      console.log('Form state changed, re-validating...');
      validateForm();
    },
    { deep: true }
  );
});
</script>