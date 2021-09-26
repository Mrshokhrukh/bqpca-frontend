<template>
  <div class="mx-auto py-8">
    <FormHeader />
    <LoadingOverlay :loading="loading" />
    <AlertMessage :messages="validationErrors" type="error" />
    <AlertMessage :messages="[successMessage]" type="success" v-if="successMessage" />

    <div class="bg-white border rounded-xl shadow-lg p-6">
      <div :key="formKey" class="space-y-8">
        <div>
          <ApplicantDetailsForm :applicant="applicant"
            @update:applicant="(updatedData) => Object.assign(applicant, updatedData)" />
        </div>
        <div>
          <ApplicationDetailsForm :application="application" :handle-approval-letter-upload="handleApprovalLetterUpload"
            @update:modelValue="handleApplicationUpdate" @approval-change="toggleApprovedFields" />
          <CpdProviderForm :cpd-provider="cpdProvider" :agency-options="agencyOptions" :reason-options="reasonOptions"
            @update:cpdProvider="handleCpdProviderUpdate" />
          <ResourcePersonsForm :resource-persons="resourcePersons"
            :resource-person-certificate="resourcePersonCertificate"
            :fetch-resource-person-details="fetchResourcePersonDetails"
            :handle-certificate-upload="handleCertificateUpload" :add-resource-person="addResourcePerson"
            :remove-resource-person="removeResourcePerson" :user-registrations="userRegistrations"
            @update:resourcePersons="handleResourcePersonsUpdate" />
        </div>
        <div>
          <TeachingLearningMethodForm :teaching-method="teachingMethod" :cpd-type-options="cpdTypeOptions"
            :methodology-options="methodologyOptions" :selected-methodologies="selectedMethodologies"
            :teaching-methods="teachingMethods" :total-hours="totalHours" :course-document-file="courseDocument"
            :handle-course-document-upload="handleCourseDocumentUpload" :add-teaching-method="addTeachingMethod"
            :remove-teaching-method="removeTeachingMethod"
            @update:teachingMethod="(data) => Object.assign(teachingMethod, data)"
            @update:selectedMethodologies="handleMethodologiesUpdate"
            @update:teachingMethods="handleTeachingMethodsUpdate" />
        </div>
        <template v-if="areOptionsLoaded">
          <div>
            <ParticipantsDetailsForm :key="participantFormKey" :participant-details="participantDetails"
              @update:participantDetails="handleParticipantDetailsUpdate"
              :participation-category-options="participationCategoryOptions"
              :participant-subcategory-options="participantSubcategoryOptions" />
          </div>
        </template>
        <div v-else class="bg-white border rounded-xl shadow-sm p-6 text-center my-4">
          <p class="text-gray-600 font-semibold">
            <svg aria-hidden="true"
              class="inline w-6 h-6 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
              viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor" />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill" />
            </svg>
            Loading participation options...
          </p>
        </div>
        <div>
          <ApprovedCpdForm :is-cpd-approved="isCpdApproved" :participants="participants"
            :attendance-sheet="attendanceSheet" :handle-attendance-sheet-upload="handleAttendanceSheetUpload"
            :add-participant="addParticipant" :remove-participant="removeParticipant"
            :fetch-participant-name="fetchParticipantName" :attachment="attachment"
            :handle-attachment-upload="handleAttachmentUpload" :application="application" />
        </div>
        <div>
          <FormActions :loading="loading" :form-valid="isFormValid" @save-draft="saveDraft" @submit="handleSubmit"
            @cancel="cancelForm" />
        </div>
      </div>
    </div>

    <ConfirmationModal :show-confirmation="showConfirmation" :loading="loading" :confirm-submit="confirmSubmit"
      @update:showConfirmation="showConfirmation = $event" />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch, computed } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useRouter, useRoute } from 'vue-router'
import apiService from '@/services/services'

import FormHeader from './cpdProviderApplicationComponents/FormHeader.vue'
import LoadingOverlay from './cpdProviderApplicationComponents/LoadingOverlay.vue'
import AlertMessage from './cpdProviderApplicationComponents/AlertMessage.vue'
import ApplicantDetailsForm from './cpdProviderApplicationComponents/ApplicantDetailsForm.vue'
import ApplicationDetailsForm from './cpdProviderApplicationComponents/ApplicationDetailsForm.vue'
import CpdProviderForm from './cpdProviderApplicationComponents/CpdProviderForm.vue'
import ResourcePersonsForm from './cpdProviderApplicationComponents/ResourcePersonsForm.vue'
import TeachingLearningMethodForm from './cpdProviderApplicationComponents/TeachingLearningMethodForm.vue'
import ParticipantsDetailsForm from './cpdProviderApplicationComponents/ParticipantsDetailsForm.vue'
import ApprovedCpdForm from './cpdProviderApplicationComponents/ApprovedCpdForm.vue'
import FormActions from './cpdProviderApplicationComponents/FormActions.vue'
import ConfirmationModal from './cpdProviderApplicationComponents/ConfirmationModal.vue'

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
})

const emit = defineEmits(['update:modelValue'])

function updateModelValue() {
  emit('update:modelValue', {
    isApproved: application.isApproved === 'true',
    title: application.title,
    venue: application.venue,
    fromDate: application.fromDate,
    toDate: application.toDate,
    approvalLetter: approvalLetter.value,
  })
}

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

// --- Reactive State ---
const loading = ref(false)
const showConfirmation = ref(false)
const validationErrors = ref([])
const successMessage = ref('')
const userRegistrations = ref([])

const applicant = reactive({
  registrationNumber: '',
  cidNumber: '', // Will be populated by watcher
  fullName: '',  // Will be populated by watcher
  agencyTrainingLocation: '',
})

const application = reactive({
  isApproved: 'false',
  title: '',
  venue: '',
  fromDate: '',
  toDate: '',
})

const cpdProvider = reactive({
  agency: '',
  otherAgency: '',
  reason: '',
  reasonDetails: '',
})

const resourcePersons = ref([{ regNo: '', name: '' }])
const resourcePersonCertificate = ref(null)

const teachingMethod = reactive({
  type: '',
  expectedOutcome: '',
})
const selectedMethodologies = ref([])
const teachingMethods = ref([{ activity: '', duration: null }])
const totalHours = ref(0)

const participantDetails = reactive({
  category: [],
  subcategory: [],
  number: null,
  relevance: '',
})

const participants = ref([])

// File refs
const approvalLetter = ref(null)
const courseDocument = ref(null)
const attendanceSheet = ref(null)
const attachment = ref(null)

// Dropdown options
const agencyOptions = ref([])
const reasonOptions = ref([])
const cpdTypeOptions = ref([])
const methodologyOptions = ref([])
const participationCategoryOptions = ref([])
const participantSubcategoryOptions = ref([])

// UI State
const areOptionsLoaded = ref(false)
const participantFormKey = ref(0)
const formKey = ref(0)

// --- Computed Properties ---
const isCpdApproved = computed(() => application.isApproved === 'true')
const calculatedCredits = computed(() => totalHours.value)

const isFormValid = computed(() => {
  return performValidation()
})

const populateFormWithDraft = (draftData) => {
  if (!draftData) return

  // Applicant Details
  applicant.cidNumber = draftData.cid_no || ''
  applicant.fullName = draftData.full_name || ''
  applicant.agencyTrainingLocation = draftData.proposed_training_location || ''

  // Application Details
  application.isApproved = draftData.is_cpd_approved ? 'true' : 'false'
  application.title = draftData.title_of_cpd || ''
  application.venue = draftData.venue || ''
  application.fromDate = draftData.from_date || ''
  application.toDate = draftData.to_date || ''

  // CPD Provider
  cpdProvider.agency = draftData.cpd_providing_agency || ''
  cpdProvider.otherAgency = draftData.if_others_specify || ''
  cpdProvider.reason = draftData.reason_for_conducting || ''
  cpdProvider.reasonDetails = draftData.reason_for_details || ''

  // Teaching & Learning
  teachingMethod.type = draftData.type_of_cpd || ''
  teachingMethod.expectedOutcome = draftData.expected_outcome || ''
  if (draftData.methodologies && draftData.methodologies.length > 0) {
    selectedMethodologies.value = draftData.methodologies.map(m => m.methodology_name)
  }
  if (draftData.learning_methods && draftData.learning_methods.length > 0) {
    teachingMethods.value = draftData.learning_methods.map(lm => ({
      activity: lm.activities,
      duration: lm.duration
    }))
  } else {
    teachingMethods.value = [{ activity: '', duration: null }]
  }

  // Participant Details
  participantDetails.number = draftData.number_of_participants || null
  participantDetails.relevance = draftData.relevance_to_topic || ''
  if (draftData.participation_category && draftData.participation_category.length > 0) {
    participantDetails.category = draftData.participation_category;
  }
  if (draftData.participant_sub_category && draftData.participant_sub_category.length > 0) {
    participantDetails.subcategory = draftData.participant_sub_category;
  }

  // Resource Persons
  if (draftData.resources && draftData.resources.length > 0) {
    resourcePersons.value = draftData.resources.map(r => ({
      regNo: r.resource_person_reg_no,
      name: r.resource_person_name
    }))
  } else {
    resourcePersons.value = [{ regNo: '', name: '' }]
  }

  // Set the application ID for updates
  application.id = draftData.id

  // Recalculate total hours after populating teaching methods
  calculateTotalHours()
}

// --- Watchers ---

// Watch for changes in authStore.user to reactively update applicant details
watch(
  () => authStore.user,
  (currentUser) => {
    if (currentUser) {
      applicant.cidNumber = currentUser.cid || '';
      applicant.fullName = [currentUser.first_name, currentUser.middle_name, currentUser.last_name]
        .filter(Boolean)
        .join(' ') || '';
      // If applicant.registrationNumber also comes from authStore.user, set it here.
      // e.g., applicant.registrationNumber = currentUser.registrationNumber || '';
    } else {
      // Clear fields if user becomes null (e.g., logout)
      applicant.cidNumber = '';
      applicant.fullName = '';
      // applicant.registrationNumber = ''; // Also clear if it's from authStore
    }
  },
  { immediate: true, deep: true } // immediate ensures it runs on mount, deep for nested changes
)

watch(
  () => application.isApproved,
  () => {
    // This watcher can be kept if there are specific side effects tied to application.isApproved
    // that are not covered by toggleApprovedFields or computed properties.
    // For example, if other parts of the application need to react directly.
  },
  { immediate: true }
)


// --- Methods ---

const handleApplicationUpdate = (updatedDataFromChild) => {
  Object.assign(application, updatedDataFromChild)
}

const handleParticipantDetailsUpdate = (updatedDetails) => {
  Object.assign(participantDetails, updatedDetails)
}

const handleCpdProviderUpdate = (updatedData) => {
  Object.assign(cpdProvider, updatedData)
}

const handleResourcePersonsUpdate = (updatedResourcePersons) => {
  resourcePersons.value = [...updatedResourcePersons]
}

const handleTeachingMethodsUpdate = (updatedMethods) => {
  teachingMethods.value = [...updatedMethods];
  calculateTotalHours();
}

const handleMethodologiesUpdate = (updatedMethodologies) => {
  selectedMethodologies.value = [...updatedMethodologies];
}

const genericFileHandler = (event, fileRef, fieldName) => {
  const files = event.target.files
  if (!files || files.length === 0) {
    fileRef.value = null
    if (fieldName === 'Approval Letter') updateModelValue()
    return
  }
  const file = files[0]
  if (file && file.type === 'application/pdf' && file.size <= 5 * 1024 * 1024) {
    fileRef.value = file
    if (fieldName === 'Approval Letter') updateModelValue()
  } else {
    event.target.value = ''
    fileRef.value = null
    validationErrors.value.push(`${fieldName}: Invalid file. Must be a PDF, max 5MB.`)
    if (fieldName === 'Approval Letter') updateModelValue()
  }
}

const handleApprovalLetterUpload = (event) => genericFileHandler(event, approvalLetter, 'Approval Letter')
const handleCertificateUpload = (event) => genericFileHandler(event, resourcePersonCertificate, 'Resource Person Certificate')
const handleCourseDocumentUpload = (event) => genericFileHandler(event, courseDocument, 'Course Document')
const handleAttendanceSheetUpload = (event) => genericFileHandler(event, attendanceSheet, 'Attendance Sheet')
const handleAttachmentUpload = (event) => genericFileHandler(event, attachment, 'General Attachment')

const fetchResourcePersonDetails = async (person) => {
  if (!person.regNo) {
    person.name = ''
    return
  }
  loading.value = true
  try {
    const response = await apiService.getMhpcFullApplicationListByCid('')
    if (response.data && response.data.results && Array.isArray(response.data.results)) {
      const matchingApplication = response.data.results.find(app => app.registration_no === person.regNo)
      person.name = matchingApplication ? matchingApplication.full_name || '' : ''
    } else {
      person.name = ''
    }
  } catch {

    person.name = ''
  } finally {
    loading.value = false
  }
}

const fetchParticipantName = async (participant) => {
  if (!participant.regNo) {
    participant.name = ''
    return
  }
  loading.value = true
  try {
    const response = await apiService.getMhpcFullApplicationListByCid('')
    if (response.data && response.data.results && Array.isArray(response.data.results)) {
      const matchingApplication = response.data.results.find(app => app.registration_no === participant.regNo)
      participant.name = matchingApplication ? matchingApplication.full_name || '' : ''
    } else {
      participant.name = ''
    }
  } catch {
    participant.name = ''
  } finally {
    loading.value = false
  }
}

const fetchUserRegistrations = async () => {
  try {
    const response = await apiService.getMhpcNewApplications()
    if (response.data && response.data.results && Array.isArray(response.data.results)) {
      userRegistrations.value = response.data.results.map((app) => ({
        id: app.id,
        registration_no: app.registration_no,
        full_name: app.full_name,
        cid_no: app.cid_no,
      }))
      userRegistrations.value.sort((a, b) => a.full_name.localeCompare(b.full_name))
      // If applicant.registrationNumber needs to be set from this fetch, do it here.
      // For example, if the logged-in user's registration number is found in this list:
      // const currentUserRegistration = userRegistrations.value.find(reg => reg.cid_no === applicant.cidNumber);
      // if (currentUserRegistration) {
      //   applicant.registrationNumber = currentUserRegistration.registration_no;
      // }
    }
  } catch {
    validationErrors.value.push('Error fetching user registration data.')
  }
}

const loadDropdownOptions = async () => {
  // Removed loading.value = true here, will be handled by onMounted or specific callers
  areOptionsLoaded.value = false
  participantFormKey.value++
  try {
    const responses = await Promise.all([
      apiService.getMhpcCpdProvidingAgencies(),
      apiService.getMhpcCpdReasonsForConducting(),
      apiService.getMhpcMastersCpdActivities(),
      apiService.getMhpcMastersCpdMethodologies(),
      apiService.getMhpcMastersParticipationCategories(),
      apiService.getMhpcMastersParticipationSubCategories(),
    ])
    const mapToOptions = (data, textField, valueField) =>
      data?.results?.map((item) => ({ text: item[textField], value: item[valueField] })) || []

    agencyOptions.value = mapToOptions(responses[0]?.data, 'name', 'id')
    reasonOptions.value = mapToOptions(responses[1]?.data, 'name', 'id')
    cpdTypeOptions.value = mapToOptions(responses[2]?.data, 'cpd_activity_name', 'id')
    methodologyOptions.value = mapToOptions(responses[3]?.data, 'methodology_name', 'id')
    participationCategoryOptions.value = responses[4]?.data?.results?.map(cat => ({
      text: cat.participation_category_name || cat.category_name,
      value: cat.id
    })) || []
    participantSubcategoryOptions.value = responses[5]?.data?.results?.map(sub => ({
      text: sub.participation_sub_category_name || sub.sub_category_name,
      value: sub.id,
      categoryId: sub.participation_category_name || sub.category_id || sub.category
    })) || []
  } catch {
    validationErrors.value = ['Error loading form data. Please refresh the page.']
  } finally {
    // Removed loading.value = false here
    areOptionsLoaded.value = true
  }
}

const toggleApprovedFields = () => {
  if (isCpdApproved.value) {
    application.title = ''
    application.venue = ''
    application.fromDate = ''
    application.toDate = ''
  } else {
    approvalLetter.value = null
    attachment.value = null
  }
  updateModelValue()
}

const addResourcePerson = () => resourcePersons.value.push({ regNo: '', name: '' })
const removeResourcePerson = (index) => resourcePersons.value.splice(index, 1)

const calculateTotalHours = () => {
  totalHours.value = teachingMethods.value.reduce((sum, method) => {
    return sum + (Number(method.duration) || 0)
  }, 0)
}

const addTeachingMethod = () => teachingMethods.value.push({ activity: '', duration: null })
const removeTeachingMethod = (index) => {
  teachingMethods.value.splice(index, 1)
  calculateTotalHours()
}

const addParticipant = () => participants.value.push({ regNo: '', name: '' })
const removeParticipant = (index) => participants.value.splice(index, 1)

const performValidation = () => {
  validationErrors.value = []

  // Basic validations
  if (!applicant.agencyTrainingLocation) validationErrors.value.push('Agency/Training Location is required.')

  if (!isCpdApproved.value) {
    if (!application.title) validationErrors.value.push('Title of CPD is required.')
    if (!application.venue) validationErrors.value.push('Venue is required.')
    if (!application.fromDate) validationErrors.value.push('From Date is required.')
    if (!application.toDate) validationErrors.value.push('To Date is required.')
    if (application.fromDate && application.toDate && new Date(application.fromDate) > new Date(application.toDate)) {
      validationErrors.value.push('From Date cannot be later than To Date.')
    }
  } else if (isCpdApproved.value && !approvalLetter.value) {
    validationErrors.value.push('Approval Letter is required for approved CPD.')
  }

  // CPD Provider validations
  if (!cpdProvider.agency) validationErrors.value.push('CPD Providing Agency is required.')
  if (cpdProvider.agency === 'other' && !cpdProvider.otherAgency) validationErrors.value.push('Please specify the Other Agency.')
  if (!cpdProvider.reason) validationErrors.value.push('Reason for Conducting is required.')
  if (!cpdProvider.reasonDetails) validationErrors.value.push('Reason Details are required.')

  // Resource Persons validations
  if (resourcePersons.value.some((person) => !person.regNo)) validationErrors.value.push('Registration Number is required for all Resource Persons.')
  if (!resourcePersonCertificate.value) validationErrors.value.push('Document supporting expertise of Resource Persons is required.')

  // Teaching Method validations (FIXED)
  if (!teachingMethod.type) validationErrors.value.push('Type of CPD is required.')

  // Check selectedMethodologies array properly
  console.log('Validation - selectedMethodologies:', selectedMethodologies.value); // Debug log
  if (!Array.isArray(selectedMethodologies.value) || selectedMethodologies.value.length === 0) {
    validationErrors.value.push('At least one Methodology must be selected.')
  }

  if (!teachingMethod.expectedOutcome) validationErrors.value.push('Expected Outcome is required.')

  // Check teachingMethods array properly
  console.log('Validation - teachingMethods:', teachingMethods.value); // Debug log
  const validTeachingMethods = teachingMethods.value.filter(method =>
    method.activity && method.activity.trim() !== '' &&
    method.duration && Number(method.duration) > 0
  );

  if (validTeachingMethods.length === 0) {
    validationErrors.value.push('At least one Teaching Method with activity and positive duration is required.')
  }

  if (!courseDocument.value) validationErrors.value.push('Course Document/Program Outline is required.')

  // Participant Details validations (only if options are loaded)
  if (areOptionsLoaded.value) {
    if (!Array.isArray(participantDetails.category) || participantDetails.category.length === 0) {
      validationErrors.value.push('At least one Participation Category is required.')
    }
    if (!Array.isArray(participantDetails.subcategory) || participantDetails.subcategory.length === 0) {
      validationErrors.value.push('At least one Participant Sub-Category is required.')
    }
    if (!participantDetails.number || participantDetails.number <= 0) {
      validationErrors.value.push('Number of Participants must be a positive number.')
    }
    if (Array.isArray(participantDetails.category) && participantDetails.category.length > 1 && !participantDetails.relevance) {
      validationErrors.value.push('Relevance to profession is required when multiple participation categories are selected.')
    }
  }

  // Approved CPD specific validations
  if (isCpdApproved.value) {
    if (!attachment.value) validationErrors.value.push('General Attachment is required for approved CPD.')
    if (participants.value.length > 0 && !attendanceSheet.value) {
      validationErrors.value.push('Attendance Sheet is required when participants are listed for an approved CPD.')
    }
  }

  console.log('Validation errors:', validationErrors.value); // Debug log
  return validationErrors.value.length === 0
}


const prepareFormData = (isDraft = false) => {
  const formData = new FormData()
  formData.append('cid_no', applicant.cidNumber)
  formData.append('full_name', applicant.fullName)
  formData.append('proposed_training_location', applicant.agencyTrainingLocation)
  formData.append('is_cpd_approved', isCpdApproved.value)
  if (!isCpdApproved.value) {
    formData.append('title_of_cpd', application.title)
    formData.append('venue', application.venue)
    formData.append('from_date', application.fromDate)
    formData.append('to_date', application.toDate)
  } else {
    if (approvalLetter.value) formData.append('approval_letter_attachment', approvalLetter.value)
    if (attachment.value) formData.append('general_approved_cpd_attachment', attachment.value)
  }
  formData.append('cpd_providing_agency', cpdProvider.agency === 'other' ? '' : parseInt(cpdProvider.agency, 10) || '')
  if (cpdProvider.agency === 'other') formData.append('if_others_specify', cpdProvider.otherAgency || '')
  formData.append('reason_for_conducting', parseInt(cpdProvider.reason, 10) || '')
  formData.append('reason_for_details', cpdProvider.reasonDetails)
  const validResourcePersons = resourcePersons.value
    .filter((person) => person.regNo && person.name)
    .map((person) => ({ resource_person_reg_no: person.regNo, resource_person_name: person.name }))
  if (validResourcePersons.length > 0) formData.append('resources', JSON.stringify(validResourcePersons))
  if (resourcePersonCertificate.value) formData.append('document_supporting_expertise', resourcePersonCertificate.value)
  formData.append('type_of_cpd', teachingMethod.type)
  const validMethodologies = selectedMethodologies.value.map((methodId) => ({ methodology_name: methodId }))
  if (validMethodologies.length > 0) formData.append('methodologies', JSON.stringify(validMethodologies))
  const validLearningMethods = teachingMethods.value
    .filter((method) => method.activity && method.duration > 0)
    .map((method) => ({ activities: method.activity, duration: method.duration }))
  if (validLearningMethods.length > 0) formData.append('learning_methods', JSON.stringify(validLearningMethods))
  formData.append('duration_in_hours', totalHours.value || 0)
  formData.append('expected_outcome', teachingMethod.expectedOutcome)
  if (courseDocument.value) formData.append('course_document', courseDocument.value)
  if (areOptionsLoaded.value) {
    formData.append('participation_category', JSON.stringify(participantDetails.category.map(c => c.value || c)))
    formData.append('participant_sub_category', JSON.stringify(participantDetails.subcategory.map(s => s.value || s)))
    formData.append('number_of_participants', participantDetails.number || 0)
    formData.append('relevance_to_topic', participantDetails.relevance || '')
  }
  if (isCpdApproved.value && participants.value.length > 0) {
    const validParticipants = participants.value
      .filter((p) => p.regNo && p.name)
      .map((p) => ({
        participant_reg_no: p.regNo,
        cpd_credits: calculatedCredits.value,
        review_status: 'Pending',
      }))
    if (validParticipants.length > 0) formData.append('participants', JSON.stringify(validParticipants))
    if (attendanceSheet.value) formData.append('attendance_sheet_attachment', attendanceSheet.value)
  }
  formData.append('is_draft', isDraft)
  return formData
}

const saveDraft = async () => {
  if (!applicant.agencyTrainingLocation && !application.title) {
    validationErrors.value = ['Please fill in at least Agency/Training Location or Title of CPD to save a draft.'];
    window.scrollTo({ top: 0, behavior: 'smooth' }); return;
  }
  if (isCpdApproved.value && !approvalLetter.value) {
    validationErrors.value = ['Please upload the Approval Letter to save a draft for a pre-approved CPD.']
    window.scrollTo({ top: 0, behavior: 'smooth' })
    return
  }
  validationErrors.value = []
  loading.value = true

  try {
    const formData = prepareFormData(true)

    // Check if we are updating an existing draft or creating a new one
    if (application.id) {
      await apiService.updateMhpcCpdTask(application.id, formData)
      successMessage.value = 'Draft updated successfully!'
    } else {
      const response = await apiService.createMhpcCpdTask(formData)

      if (response.data && response.data.id) {
        application.id = response.data.id
      }
      successMessage.value = 'Draft saved successfully!'
    }

    setTimeout(() => { successMessage.value = '' }, 3000)
  } catch (error) {
    validationErrors.value = ['Error saving draft. Please check fields.'];
  } finally {
    loading.value = false;
  }
};

const handleSubmit = () => { if (isFormValid.value) showConfirmation.value = true; else window.scrollTo({ top: 0, behavior: 'smooth' }); };

const confirmSubmit = async () => {
  showConfirmation.value = false
  if (!isFormValid.value) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    return
  }
  loading.value = true

  try {
    const formData = prepareFormData(false) // isDraft is false for final submission

    // Check if we are updating a final submission or creating a new one
    if (application.id) {
      await apiService.updateMhpcCpdTask(application.id, formData);
    } else {
      await apiService.createMhpcCpdTask(formData);
    }

    successMessage.value = 'CPD application submitted successfully!'
    setTimeout(() => {
      router.push('/engineering_certification/track_cpd_applications')
    }, 2000)
  } catch (error) {
    validationErrors.value = ['Submission failed. Please review errors.'];
    if (error.response?.data) {
      const errorMessages = Object.values(error.response.data).flat();
      validationErrors.value.push(...errorMessages);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } finally {
    loading.value = false;
  }
};

const cancelForm = () => {
  localStorage.removeItem('cpdDraftToEdit');
  router.push('/engineering_certification/dashboard');
};

onMounted(async () => {
  loading.value = true

  // Always load dropdown options and user registrations first
  await loadDropdownOptions()
  await fetchUserRegistrations()

  const draftId = route.query.id

  if (draftId) {
    // If an ID is in the URL, we are in "edit mode".
    try {
      // Fetch the specific draft application from the backend.
      const response = await apiService.getMhpcCpdTaskDetails(draftId)
      if (response.data) {
        // Use the fetched data to populate the form.
        populateFormWithDraft(response.data)
        formKey.value++ // Force re-render of children with populated data
      } else {
        console.error(`Draft with ID ${draftId} not found.`)
        router.push('/admin/cme_cpd_provider/engineering_certification/cpd_application_details')
      }
    } catch (error) {
      console.error("Error fetching draft data:", error)
    }
  }

  calculateTotalHours() // Recalculate hours in case a draft was loaded
  loading.value = false
})
</script>
