<template>
  <div class="mx-auto py-8">
    <FormHeader />
    <LoadingOverlay :loading="loading" />
    <AlertMessage :messages="validationErrors" type="error" />
    <AlertMessage :messages="[successMessage]" type="success" v-if="successMessage" />

    <div class="bg-white border rounded-xl shadow-lg p-6">
      <ApplicantDetailsForm :applicant="applicant" />
      <ApplicationDetailsForm :application="application" :handle-approval-letter-upload="handleApprovalLetterUpload"
        @approval-change="toggleApprovedFields" />
      <CpdProviderForm :cpd-provider="cpdProvider" :agency-options="agencyOptions" :reason-options="reasonOptions" />
      <!-- Pass userRegistrations to ResourcePersonsForm -->
      <ResourcePersonsForm :resource-persons="resourcePersons" :resource-person-certificate="resourcePersonCertificate"
        :fetch-resource-person-details="fetchResourcePersonDetails" :handle-certificate-upload="handleCertificateUpload"
        :add-resource-person="addResourcePerson" :remove-resource-person="removeResourcePerson"
        :user-registrations="userRegistrations" />
      <TeachingLearningMethodForm :teaching-method="teachingMethod" :cpd-type-options="cpdTypeOptions"
        :methodology-options="methodologyOptions" :selected-methodologies="selectedMethodologies"
        :teaching-methods="teachingMethods" :total-hours="totalHours" :calculated-credits="calculatedCredits"
        :course-document="courseDocument" :handle-course-document-upload="handleCourseDocumentUpload"
        :add-teaching-method="addTeachingMethod" :remove-teaching-method="removeTeachingMethod"
        :calculate-total-hours="calculateTotalHours" />
      <ParticipantsDetailsForm :participant-details="participantDetails"
        :participation-category-options="participationCategoryOptions"
        :participant-subcategory-options="participantSubcategoryOptions" :load-subcategories="loadSubcategories"
        :filtered-subcategories="filteredSubcategories" />
      <ApprovedCpdForm :is-cpd-approved="isCpdApproved" :participants="participants" :attendance-sheet="attendanceSheet"
        :handle-attendance-sheet-upload="handleAttendanceSheetUpload" :add-participant="addParticipant"
        :remove-participant="removeParticipant" :fetch-participant-name="fetchParticipantName" :attachment="attachment"
        :handle-attachment-upload="handleAttachmentUpload" :application="application" />
      <FormActions :loading="loading" :save-draft="saveDraft" :handle-submit="handleSubmit" :cancel-form="cancelForm" />
    </div>

    <ConfirmationModal :show-confirmation="showConfirmation" :loading="loading" :confirm-submit="confirmSubmit"
      @update:showConfirmation="showConfirmation = $event" />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'
import apiService from '@/services/services' // Changed import to apiService - assuming the provided apiService.js is placed here

// Import child components
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

// Reactive States
const loading = ref(false)
const showConfirmation = ref(false)
const validationErrors = ref([])
const successMessage = ref('')
const userRegistrations = ref([]) // Keep this!

// Applicant details
const applicant = reactive({
  registrationNumber: '', //  Keep, but will be less central
  cidNumber: '',
  fullName: '',
  agencyTrainingLocation: '',
})

// Application details
const application = reactive({
  isApproved: 'false',
  title: '',
  venue: '',
  fromDate: '',
  toDate: '',
})

// CPD Provider details
const cpdProvider = reactive({
  agency: '',
  otherAgency: '',
  reason: '',
  reasonDetails: '',
})

// Resource Persons
const resourcePersons = ref([{ regNo: '', name: '' }])

const resourcePersonCertificate = ref(null)

// Teaching Method details
const teachingMethod = reactive({
  type: '',
  expectedOutcome: '',
})

// Selected methodologies (multiple)
const selectedMethodologies = ref([])

const teachingMethods = ref([{ activity: '', duration: null }])
const totalHours = ref(0)
const calculatedCredits = ref(0)

// Participant details
const participantDetails = reactive({
  category: '',
  subcategory: '',
  number: null,
  relevance: '',
})

// Participants list for approved CPD
const participants = ref([])
const isCpdApproved = ref(false)

// File uploads
const approvalLetter = ref(null)
const courseDocument = ref(null)
const attendanceSheet = ref(null)
const attachment = ref(null)

// Options for dropdowns
const agencyOptions = ref([])
const reasonOptions = ref([])
const cpdTypeOptions = ref([])
const methodologyOptions = ref([])
const participationCategoryOptions = ref([])
const participantSubcategoryOptions = ref([])

// Computed
const filteredSubcategories = computed(() => {
  if (!participantDetails.category) return []

  return participantSubcategoryOptions.value.filter(
    (subcategory) => subcategory.categoryId === parseInt(participantDetails.category),
  )
})

// --- Methods ---

const toggleApprovedFields = () => {
  application.title = application.isApproved === 'true' ? '' : application.title
  application.venue = application.isApproved === 'true' ? '' : application.venue
  application.fromDate = application.isApproved === 'true' ? '' : application.fromDate
  application.toDate = application.isApproved === 'true' ? '' : application.toDate
  approvalLetter.value = application.isApproved === 'false' ? null : approvalLetter.value
  attachment.value = application.isApproved === 'false' ? null : attachment.value
  updateModelValue()
}

const handleApprovalLetterUpload = (event) => {
  const file = event.target.files[0]
  if (file && file.type === 'application/pdf' && file.size <= 5 * 1024 * 1024) {
    approvalLetter.value = file
    updateModelValue()
  } else {
    alert('Please upload a PDF file less than 5MB')
    event.target.value = '' // Clear the input
  }
}

const handleCertificateUpload = (event) => {
  const file = event.target.files[0]
  if (file && file.type === 'application/pdf' && file.size <= 5 * 1024 * 1024) {
    resourcePersonCertificate.value = file
  } else {
    alert('Please upload a PDF file less than 5MB')
    event.target.value = ''
    event.target.value = ''
  }
}
const handleCourseDocumentUpload = (event) => {
  const file = event.target.files[0]
  if (file && file.type === 'application/pdf' && file.size <= 5 * 1024 * 1024) {
    courseDocument.value = file
  } else {
    alert('Please upload a PDF file less than 5MB')
    event.target.value = '' // Clear the input
  }
}

const handleAttendanceSheetUpload = (event) => {
  const file = event.target.files[0]
  if (file && file.type === 'application/pdf' && file.size <= 5 * 1024 * 1024) {
    attendanceSheet.value = file
  } else {
    alert('Please upload a PDF file less than 5MB')
    event.target.value = ''
  }
}

const handleAttachmentUpload = (event) => {
  const file = event.target.files[0]
  if (file && file.type === 'application/pdf' && file.size <= 5 * 1024 * 1024) {
    attachment.value = file
  } else {
    alert('Please upload a PDF file less than 5MB')
    event.target.value = ''
  }
}

const fetchResourcePersonDetails = async (person) => {
  if (!person.regNo) {
    person.name = '' // Clear the name if regNo is empty
    return
  }

  try {
    loading.value = true
    // Use getMhpcFullApplicationListByCid to fetch all applications and then filter
    const response = await apiService.getMhpcFullApplicationListByCid('')
    if (response.data && response.data.results && Array.isArray(response.data.results)) {
      // Find the application by registration number
      const matchingApplication = response.data.results.find(
        (app) => app.registration_no === person.regNo,
      )
      person.name = matchingApplication ? matchingApplication.full_name || 'Unknown' : ''
    } else {
      const manualName = prompt(
        `Please enter name for resource person with registration number ${person.regNo}:`,
      )
      person.name = manualName || '' // Use provided name or default to empty string
    }
  } catch (error) {
    console.error('Error fetching resource person details:', error)
    const manualName = prompt(
      `Could not fetch details for registration number ${person.regNo}. Please enter the name manually:`,
    )
    person.name = manualName || ''
  } finally {
    loading.value = false
  }
}

const addResourcePerson = () => {
  resourcePersons.value.push({ regNo: '', name: '' })
}

const removeResourcePerson = (index) => {
  resourcePersons.value.splice(index, 1)
}

const calculateTotalHours = () => {
  totalHours.value = teachingMethods.value.reduce((sum, method) => {
    return sum + (Number(method.duration) || 0)
  }, 0)
  calculatedCredits.value = totalHours.value
}

const addTeachingMethod = () => {
  teachingMethods.value.push({ activity: '', duration: null })
}

const removeTeachingMethod = (index) => {
  teachingMethods.value.splice(index, 1)
  calculateTotalHours()
}

const loadSubcategories = async () => {
  if (!participantDetails.category) return
  // In a real implementation, you would fetch filtered subcategories from your API.
  // Here we assume the subcategories are pre-loaded and just filter them.
}

const addParticipant = () => {
  participants.value.push({ regNo: '', name: '' })
}

const removeParticipant = (index) => {
  participants.value.splice(index, 1)
}

const fetchParticipantName = async (participant) => {
  if (!participant.regNo) {
    participant.name = '' // Clear name if regNo is empty
    return
  }

  try {
    loading.value = true
    // Use getMhpcFullApplicationListByCid to fetch all applications and then filter
    const response = await apiService.getMhpcFullApplicationListByCid('')
    if (response.data && response.data.results && Array.isArray(response.data.results)) {
      // Find the application by registration number
      const matchingApplication = response.data.results.find(
        (app) => app.registration_no === participant.regNo,
      )
      participant.name = matchingApplication ? matchingApplication.full_name || 'Unknown' : ''
    } else {
      const manualName = prompt(
        `Please enter name for participant with registration number ${participant.regNo}:`,
      )
      participant.name = manualName || ''
    }
  } catch (error) {
    console.error('Error fetching participant name:', error)
    const manualName = prompt(
      `Could not fetch details for registration number ${participant.regNo}.  Please enter the name manually:`,
    )
    participant.name = manualName || ''
  } finally {
    loading.value = false
  }
}

const validateForm = () => {
  validationErrors.value = []

  // Applicant Details
  if (!applicant.agencyTrainingLocation) {
    validationErrors.value.push('Agency/Training Location is required.')
  }

  // Application Details
  if (application.isApproved === 'false') {
    if (!application.title) validationErrors.value.push('Title of CPD is required.')
    if (!application.venue) validationErrors.value.push('Venue is required.')
    if (!application.fromDate) validationErrors.value.push('From Date is required.')
    if (!application.toDate) validationErrors.value.push('To Date is required.')
    if (
      application.fromDate &&
      application.toDate &&
      new Date(application.fromDate) > new Date(application.toDate)
    ) {
      validationErrors.value.push('From Date cannot be later than To Date.')
    }
  } else if (application.isApproved === 'true' && !approvalLetter.value) {
    validationErrors.value.push('Approval Letter is required.')
  }

  // CPD Provider Details
  if (!cpdProvider.agency) validationErrors.value.push('CPD Providing Agency is required.')
  if (cpdProvider.agency === 'other' && !cpdProvider.otherAgency)
    validationErrors.value.push('Please specify the Other Agency.')
  if (!cpdProvider.reason) validationErrors.value.push('Reason for Conducting is required.')
  if (!cpdProvider.reasonDetails) validationErrors.value.push('Reason Details are required.')

  // Resource Persons
  if (resourcePersons.value.some((person) => !person.regNo)) {
    validationErrors.value.push('Registration Number is required for all Resource Persons.')
  }
  if (!resourcePersonCertificate.value)
    validationErrors.value.push('Document supporting expertise of CPD is required.')

  // Teaching Method
  if (!teachingMethod.type) validationErrors.value.push('Type of CPD is required.')
  if (selectedMethodologies.value.length === 0)
    validationErrors.value.push('At least one Methodology must be selected.')
  if (!teachingMethod.expectedOutcome) validationErrors.value.push('Expected Outcome is required.')
  if (!teachingMethods.value.some((method) => method.activity && method.duration)) {
    validationErrors.value.push(
      'At least one Teaching Method with activity and duration is required.',
    )
  }
  if (!courseDocument.value) validationErrors.value.push('Course Document is required.')

  // Participant Details
  if (!participantDetails.category)
    validationErrors.value.push('Participation Category is required.')
  if (!participantDetails.subcategory)
    validationErrors.value.push('Participant sub-category is required.')
  if (!participantDetails.number || participantDetails.number <= 0)
    validationErrors.value.push('Number of Participants must be greater than 0.')
  if (!participantDetails.relevance)
    validationErrors.value.push('Relevance to profession is required.')

  // Approved CPD
  if (application.isApproved === 'true') {
    if (!attachment.value) {
      validationErrors.value.push('Attachment is required for approved CPD')
    }
    if (isCpdApproved.value && !attendanceSheet.value)
      validationErrors.value.push('Attendance Sheet is required.')
  }

  return validationErrors.value.length === 0
}

const prepareFormData = (isDraft = false) => {
  const formData = new FormData()

  // Applicant Details
  formData.append('cid_no', applicant.cidNumber)
  formData.append('full_name', applicant.fullName)
  formData.append('proposed_training_location', applicant.agencyTrainingLocation)

  // Application Details
  formData.append('is_cpd_approved', application.isApproved === 'true')
  if (application.isApproved === 'false') {
    formData.append('title_of_cpd', application.title)
    formData.append('venue', application.venue)
    formData.append('from_date', application.fromDate)
    formData.append('to_date', application.toDate)
  }

  // CPD Provider
  formData.append(
    'cpd_providing_agency',
    cpdProvider.agency === 'other' ? '' : parseInt(cpdProvider.agency, 10) || '',
  )
  formData.append(
    'if_others_specify',
    cpdProvider.agency === 'other' ? cpdProvider.otherAgency || '' : '',
  )
  formData.append('reason_for_conducting', parseInt(cpdProvider.reason, 10) || '')
  formData.append('reason_for_details', cpdProvider.reasonDetails)

  // Resource Persons
  const resourcePersonsData = resourcePersons.value
    .filter((person) => person.regNo && person.name)
    .map((person) => ({
      resource_person_reg_no: person.regNo,
      resource_person_name: person.name,
      cpd_task: null, // Let the backend handle this
    }))
  formData.append('resources', JSON.stringify(resourcePersonsData))

  // Teaching Method
  formData.append('type_of_cpd', teachingMethod.type)
  formData.append(
    'methodologies',
    JSON.stringify(
      selectedMethodologies.value.map((methodId) => ({
        methodology_name: methodId,
        cpd_task: null,
      })),
    ),
  )
  formData.append(
    'learning_methods',
    JSON.stringify(
      teachingMethods.value
        .filter((method) => method.activity && method.duration)
        .map((method) => ({
          activities: method.activity,
          duration: method.duration,
          cpd_task: null,
        })),
    ),
  )
  formData.append('expected_outcome', teachingMethod.expectedOutcome)

  // Participant Details
  formData.append('number_of_participants', participantDetails.number || 0)
  formData.append('relevance_to_topic', participantDetails.relevance || '')
  formData.append('participation_category', participantDetails.category)
  formData.append('participant_sub_category', participantDetails.subcategory)

  // Participants (for approved CPD)
  if (isCpdApproved.value) {
    const participantsData = participants.value
      .filter((participant) => participant.regNo && participant.name)
      .map((participant) => ({
        participant_reg_no: participant.regNo,
        cpd_credits: calculatedCredits.value,
        review_status: 'Pending', // Or appropriate status
        cpd_task: null,
      }))
    formData.append('participants', JSON.stringify(participantsData))
  }

  // Files
  if (approvalLetter.value) formData.append('attachment', approvalLetter.value)
  if (resourcePersonCertificate.value)
    formData.append('document_supporting_expertise', resourcePersonCertificate.value)
  if (courseDocument.value) formData.append('course_document', courseDocument.value)
  if (attendanceSheet.value) formData.append('attendance_sheet_attachment', attendanceSheet.value)
  if (attachment.value) formData.append('attachment', attachment.value)

  // Draft status
  formData.append('is_draft', isDraft)

  return formData
}

const saveDraft = async () => {
  try {
    loading.value = true
    validationErrors.value = []
    const formData = prepareFormData(true)
    await apiService.createMhpcCpdTask(formData) // Changed to createMhpcCpdTask
    successMessage.value = 'Draft saved successfully!'
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  } catch (error) {
    console.error('Error saving draft:', error)
    validationErrors.value = ['An error occurred while saving the draft.']
    if (error.response && error.response.data) {
      const errorData = error.response.data
      const errorMessages = []
      const extractErrors = (obj, prefix = '') => {
        if (typeof obj === 'string') {
          errorMessages.push(`${prefix}: ${obj}`)
        } else if (Array.isArray(obj)) {
          obj.forEach((item) => {
            if (typeof item === 'string') {
              errorMessages.push(`${prefix}: ${item}`)
            } else if (typeof item === 'object') {
              extractErrors(item, prefix)
            }
          })
        } else if (typeof obj === 'object' && obj !== null) {
          Object.keys(obj).forEach((key) => {
            const newPrefix = prefix ? `${prefix}.${key}` : key
            extractErrors(obj[key], newPrefix)
          })
        }
      }
      extractErrors(errorData)
      if (errorMessages.length > 0) {
        validationErrors.value = errorMessages
      }
    }
  } finally {
    loading.value = false
  }
}

const handleSubmit = () => {
  if (validateForm()) {
    showConfirmation.value = true
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const confirmSubmit = async () => {
  showConfirmation.value = false
  try {
    loading.value = true
    validationErrors.value = []
    const formData = prepareFormData(false)
    const response = await apiService.createMhpcCpdTask(formData) // Changed to createMhpcCpdTask
    console.log('Form submitted successfully', response.data)
    successMessage.value = 'CPD application submitted successfully!'
    setTimeout(() => {
      router.push('/health_certification/track_cpd_applications') // Make sure this path is correct for MHPC
    }, 2000)
  } catch (error) {
    console.error('Error submitting form:', error)
    validationErrors.value = ['An error occurred while submitting the form.']
    if (error.response && error.response.data) {
      const errorData = error.response.data
      const errorMessages = []
      const extractErrors = (obj, prefix = '') => {
        if (typeof obj === 'string') {
          errorMessages.push(`${prefix}: ${obj}`)
        } else if (Array.isArray(obj)) {
          obj.forEach((item) => {
            if (typeof item === 'string') {
              errorMessages.push(`${prefix}: ${item}`)
            } else if (typeof item === 'object') {
              extractErrors(item, prefix)
            }
          })
        } else if (typeof obj === 'object' && obj !== null) {
          Object.keys(obj).forEach((key) => {
            const newPrefix = prefix ? `${prefix}.${key}` : key
            extractErrors(obj[key], newPrefix)
          })
        }
      }
      extractErrors(errorData)
      if (errorMessages.length > 0) {
        validationErrors.value = errorMessages
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } finally {
    loading.value = false
  }
}

const cancelForm = () => {
  router.push('/health_certification/dashboard') // Make sure this path is correct for MHPC
}

const fetchUserRegistrations = async () => {
  try {
    loading.value = true
    // Use getMhpcNewApplications to fetch MHPC applications
    const allApplicationsResponse = await apiService.getMhpcNewApplications() // Changed to getMhpcNewApplications

    if (
      allApplicationsResponse.data &&
      allApplicationsResponse.data.results &&
      Array.isArray(allApplicationsResponse.data.results)
    ) {
      userRegistrations.value = allApplicationsResponse.data.results.map((app) => ({
        id: app.id,
        registration_no: app.registration_no,
        full_name: app.full_name,
        cid_no: app.cid_no, // Keep this for potential use elsewhere
      }))
      userRegistrations.value.sort((a, b) => a.full_name.localeCompare(b.full_name))
    }
  } catch (error) {
    console.error('Error fetching user registrations:', error)
    validationErrors.value = ['Could not fetch available registrations. Please try again.']
  } finally {
    loading.value = false
  }
}

const loadDropdownOptions = async () => {
  try {
    loading.value = true

    const agencyResponse = await apiService.getProvidingAgency()
    agencyOptions.value =
      agencyResponse.data?.results.map((agency) => ({ text: agency.name, value: agency.id })) || []

    const reasonResponse = await apiService.getReasonForCoducting()
    reasonOptions.value =
      reasonResponse.data?.results.map((reason) => ({ text: reason.name, value: reason.id })) || []

    const cpdTypeResponse = await apiService.getMhpcMastersCpdActivities()
    cpdTypeOptions.value =
      cpdTypeResponse.data?.results.map((type) => ({
        text: type.cme_activity_name,
        value: type.id,
      })) || []

    const methodologyResponse = await apiService.getMhpcMastersCpdMethodologies()
    methodologyOptions.value =
      methodologyResponse.data?.results.map((method) => ({
        text: method.methodology_name,
        value: method.id,
      })) || []

    const categoriesResponse = await apiService.getMhpcMastersMHPCParticipationCategories()
    participationCategoryOptions.value =
      categoriesResponse.data?.results.map((category) => ({
        text: category.participation_category_name,
        value: category.id,
      })) || []

    const subcategoriesResponse = await apiService.getMhpcMastersMhpcParticipationSubCategories()
    participantSubcategoryOptions.value =
      subcategoriesResponse.data?.results.map((subcategory) => ({
        text: subcategory.participation_sub_category_name,
        value: subcategory.id,
        categoryId: subcategory.participation_category_name,
      })) || []
  } catch (error) {
    console.error('Error loading dropdown options:', error)
    validationErrors.value = ['Error loading form data. Please refresh the page.']
  } finally {
    loading.value = false
  }
}


onMounted(async () => {
  applicant.cidNumber = authStore.user?.cid || ''
  applicant.fullName =
    [authStore.user?.first_name, authStore.user?.middle_name, authStore.user?.last_name]
      .filter(Boolean)
      .join(' ') || ''
  await Promise.all([fetchUserRegistrations(), loadDropdownOptions()])
  if (props.modelValue) {
    application.isApproved = props.modelValue.isApproved ? 'true' : 'false'
    application.title = props.modelValue.title || ''
    application.venue = props.modelValue.venue || ''
    application.fromDate = props.modelValue.fromDate || ''
    application.toDate = props.modelValue.toDate || ''
  }
  isCpdApproved.value = application.isApproved === 'true'
  watch(
    () => application.isApproved,
    (newIsApproved) => {
      isCpdApproved.value = newIsApproved === 'true'
    },
  )
})
</script>
