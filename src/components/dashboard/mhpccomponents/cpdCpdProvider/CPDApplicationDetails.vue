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
        :handle-approval-letter-upload="handleFileUpload('approvalLetter')"
        @approval-change="toggleApprovedFields"
      />
      <CpdProviderForm
        :cpd-provider="cpdProvider"
        :agency-options="agencyOptions"
        :reason-options="reasonOptions"
        @update:cpd-provider="cpdProvider = $event"
      />
      <ResourcePersonsForm
        :resource-persons="resourcePersons"
        :resource-person-certificate="resourcePersonCertificate"
        :fetch-resource-person-details="fetchPersonDetails"
        :handle-certificate-upload="handleFileUpload('resourcePersonCertificate')"
        :add-resource-person="addItem(resourcePersons)"
        :remove-resource-person="removeItem(resourcePersons)"
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
        :handle-course-document-upload="handleFileUpload('courseDocument')"
        :add-teaching-method="addItem(teachingMethods)"
        :remove-teaching-method="removeTeachingMethod"
      />
      <ParticipantsDetailsForm
        :participant-details="participantDetails"
        @update:participantDetails="handleParticipantDetailsUpdate"
        :participation-category-options="participationCategoryOptions"
        :participant-subcategory-options="participantSubcategoryOptions"
        :key="participantFormKey"
      />
      <ApprovedCpdForm
        :is-cpd-approved="isCpdApproved"
        :participants="participants"
        :attendance-sheet="attendanceSheet"
        :handle-attendance-sheet-upload="handleFileUpload('attendanceSheet')"
        :add-participant="addItem(participants)"
        :remove-participant="removeItem(participants)"
        :fetch-participant-name="fetchPersonDetails"
        :attachment="attachment"
        :handle-attachment-upload="handleFileUpload('attachment')"
        :application="application"
      />
      <FormActions
        :loading="loading"
        :save-draft="saveDraft"
        :handle-submit="handleSubmit"
        :cancel-form="() => router.push('/health_certification/dashboard')"
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
import { ref, reactive, onMounted, watch } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'
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
const authStore = useAuthStore()
const router = useRouter()

const loading = ref(false)
const showConfirmation = ref(false)
const validationErrors = ref([])
const successMessage = ref('')
const userRegistrations = ref([])
const participantFormKey = ref(0)

const applicant = reactive({
  registrationNumber: '',
  cidNumber: '',
  fullName: '',
  agencyTrainingLocation: '',
})

const application = reactive({
  isApproved: 'false',
  title: '',
  venue: '',
  fromDate: '',
  toDate: '',
})

const cpdProvider = ref({
  agency: '',
  otherAgency: '',
  reason: '',
  reasonDetails: '',
})

const resourcePersons = ref([{ regNo: '', name: '' }])
const resourcePersonCertificate = ref(null)
const teachingMethod = reactive({ type: '', expectedOutcome: '' })
const selectedMethodologies = ref([])
const teachingMethods = ref([{ activity: '', duration: null }])
const totalHours = ref(0)
const calculatedCredits = ref(0)
const participantDetails = reactive({
  category: '',
  subcategory: '',
  number: null,
  relevance: '',
})
const participants = ref([])
const isCpdApproved = ref(false)
const approvalLetter = ref(null)
const courseDocument = ref(null)
const attendanceSheet = ref(null)
const attachment = ref(null)
const agencyOptions = ref([])
const reasonOptions = ref([])
const cpdTypeOptions = ref([])
const methodologyOptions = ref([])
const participationCategoryOptions = ref([])
const participantSubcategoryOptions = ref([])

const updateModelValue = () =>
  emit('update:modelValue', {
    isApproved: application.isApproved === 'true',
    title: application.title,
    venue: application.venue,
    fromDate: application.fromDate,
    toDate: application.toDate,
    approvalLetter: approvalLetter.value,
  })

const handleFileUpload = (refName) => (event) => {
  const file = event.target.files?.[0]
  if (file?.type === 'application/pdf' && file.size <= 5 * 1024 * 1024) {
    ref(refName).value = file
    if (refName === 'approvalLetter') updateModelValue()
  } else {
    alert('Please upload a PDF file less than 5MB')
    event.target.value = ''
  }
}

const fetchPersonDetails = async (person) => {
  if (!person.regNo) return (person.name = '')
  try {
    loading.value = true
    const { data } = await apiService.getMhpcFullApplicationListByCid('')
    const match = data?.results?.find((app) => app.registration_no === person.regNo)
    person.name =
      match?.full_name || prompt(`Enter name for registration number ${person.regNo}:`) || ''
  } catch (error) {
    console.error('Error fetching person details:', error)
    person.name = prompt(`Could not fetch details for ${person.regNo}. Enter name manually:`) || ''
  } finally {
    loading.value = false
  }
}

const addItem = (collection) => () => collection.value.push({ regNo: '', name: '' })
const removeItem = (collection) => (index) => collection.value.splice(index, 1)

const removeTeachingMethod = (index) => {
  teachingMethods.value.splice(index, 1)
  totalHours.value = teachingMethods.value.reduce(
    (sum, { duration }) => sum + (Number(duration) || 0),
    0
  )
  calculatedCredits.value = totalHours.value
}

const handleParticipantDetailsUpdate = (updatedDetails) =>
  Object.assign(participantDetails, updatedDetails)

const toggleApprovedFields = () => {
  if (application.isApproved === 'true') {
    application.title = application.venue = application.fromDate = application.toDate = ''
    approvalLetter.value = attachment.value = null
  }
  updateModelValue()
}

const validateForm = () => {
  validationErrors.value = []
  const errors = []

  if (!applicant.agencyTrainingLocation) errors.push('Agency/Training Location is required.')
  if (application.isApproved === 'false') {
    if (!application.title) errors.push('Title of CPD is required.')
    if (!application.venue) errors.push('Venue is required.')
    if (!application.fromDate) errors.push('From Date is required.')
    if (!application.toDate) errors.push('To Date is required.')
    if (
      application.fromDate &&
      application.toDate &&
      new Date(application.fromDate) > new Date(application.toDate)
    ) {
      errors.push('From Date cannot be later than To Date.')
    }
  } else if (!approvalLetter.value) {
    errors.push('Approval Letter is required.')
  }

  if (!cpdProvider.value.agency) errors.push('CPD Providing Agency is required.')
  if (cpdProvider.value.agency === 'other' && !cpdProvider.value.otherAgency)
    errors.push('Please specify the Other Agency.')
  if (!cpdProvider.value.reason) errors.push('Reason for Conducting is required.')
  if (!cpdProvider.value.reasonDetails) errors.push('Reason Details are required.')

  if (resourcePersons.value.some(({ regNo }) => !regNo))
    errors.push('Registration Number is required for all Resource Persons.')
  if (!resourcePersonCertificate.value)
    errors.push('Document supporting expertise of CPD is required.')
  if (!teachingMethod.type) errors.push('Type of CPD is required.')
  if (!selectedMethodologies.value.length) errors.push('At least one Methodology must be selected.')
  if (!teachingMethod.expectedOutcome) errors.push('Expected Outcome is required.')
  if (!teachingMethods.value.some(({ activity, duration }) => activity && duration > 0)) {
    errors.push('At least one Teaching Method with activity and duration is required.')
  }
  if (!courseDocument.value) errors.push('Course Document is required.')
  if (!participantDetails.category) errors.push('Participation Category is required.')
  if (!participantDetails.subcategory) errors.push('Participant sub-category is required.')
  if (!participantDetails.number || participantDetails.number <= 0)
    errors.push('Number of Participants must be greater than 0.')
  if (!participantDetails.relevance) errors.push('Relevance to profession is required.')
  if (application.isApproved === 'true') {
    if (!attachment.value) errors.push('Attachment is required for approved CPD.')
    if (isCpdApproved.value && !attendanceSheet.value) errors.push('Attendance Sheet is required.')
  }

  validationErrors.value = errors
  return !errors.length
}

const prepareFormData = (isDraft = false) => {
  const formData = new FormData()
  formData.append('cid_no', applicant.cidNumber)
  formData.append('full_name', applicant.fullName)
  formData.append('proposed_training_location', applicant.agencyTrainingLocation)
  formData.append('is_cpd_approved', application.isApproved === 'true')

  if (application.isApproved === 'false') {
    formData.append('title_of_cpd', application.title)
    formData.append('venue', application.venue)
    formData.append('from_date', application.fromDate)
    formData.append('to_date', application.toDate)
  } else {
    if (approvalLetter.value) formData.append('approval_letter_attachment', approvalLetter.value)
    if (attachment.value) formData.append('general_approved_cpd_attachment', attachment.value)
  }

  formData.append(
    'cpd_providing_agency',
    cpdProvider.value.agency === 'other' ? '' : parseInt(cpdProvider.value.agency, 10) || ''
  )
  formData.append(
    'if_others_specify',
    cpdProvider.value.agency === 'other' ? cpdProvider.value.otherAgency || '' : ''
  )
  formData.append('reason_for_conducting', parseInt(cpdProvider.value.reason, 10) || '')
  formData.append('reason_for_details', cpdProvider.value.reasonDetails)

  const resources = resourcePersons.value
    .filter((p) => p.regNo && p.name)
    .map((p) => ({
      resource_person_reg_no: p.regNo,
      resource_person_name: p.name,
    }))
  if (resources.length) formData.append('resources', JSON.stringify(resources))
  if (resourcePersonCertificate.value)
    formData.append('document_supporting_expertise', resourcePersonCertificate.value)

  formData.append('type_of_cpd', teachingMethod.type)
  const methodologies = selectedMethodologies.value.map((id) => ({ methodology_name: id }))
  if (methodologies.length) formData.append('methodologies', JSON.stringify(methodologies))

  const learningMethods = teachingMethods.value
    .filter((m) => m.activity && m.duration > 0)
    .map((m) => ({
      activities: m.activity,
      duration: m.duration,
    }))
  if (learningMethods.length) formData.append('learning_methods', JSON.stringify(learningMethods))

  formData.append('expected_outcome', teachingMethod.expectedOutcome)
  if (courseDocument.value) formData.append('course_document', courseDocument.value)
  formData.append('number_of visualization', participantDetails.number || 0)
  formData.append('relevance_to_topic', participantDetails.relevance || '')
  formData.append('participation_category', participantDetails.category)
  formData.append('participant_sub_category', participantDetails.subcategory)

  if (isCpdApproved.value && participants.value.length) {
    const validParticipants = participants.value
      .filter((p) => p.regNo && p.name)
      .map((p) => ({
        participant_reg_no: p.regNo,
        cpd_credits: calculatedCredits.value,
        review_status: 'Pending',
      }))
    if (validParticipants.length) formData.append('participants', JSON.stringify(validParticipants))
    if (attendanceSheet.value) formData.append('attendance_sheet_attachment', attendanceSheet.value)
  }

  formData.append('is_draft', isDraft)
  return formData
}

const saveDraft = async () => {
  validationErrors.value = []
  try {
    loading.value = true
    await apiService.createMhpcCpdTask(prepareFormData(true))
    successMessage.value = 'Draft saved successfully!'
    setTimeout(() => (successMessage.value = ''), 3000)
  } catch (error) {
    console.error('Error saving draft:', error)
    validationErrors.value = error.response?.data
      ? Object.entries(error.response.data).flatMap(([key, value]) =>
          Array.isArray(value) ? [`${key}: ${value.join(', ')}`] : [`${key}: ${value}`]
        )
      : ['Error saving draft. Please check your input.']
  } finally {
    loading.value = false
  }
}

const handleSubmit = () => {
  if (validateForm()) showConfirmation.value = true
  else window.scrollTo({ top: 0, behavior: 'smooth' })
}

const confirmSubmit = async () => {
  showConfirmation.value = false
  if (!validateForm()) return window.scrollTo({ top: 0, behavior: 'smooth' })
  try {
    loading.value = true
    validationErrors.value = []
    await apiService.createMhpcCpdTask(prepareFormData(false))
    successMessage.value = 'CPD application submitted successfully!'
    setTimeout(() => router.push('/health_certification/track_cpd_applications'), 2000)
  } catch (error) {
    console.error('Error submitting form:', error)
    validationErrors.value = error.response?.data
      ? Object.entries(error.response.data).flatMap(([key, value]) =>
          Array.isArray(value) ? [`${key}: ${value.join(', ')}`] : [`${key}: ${value}`]
        )
      : ['Error submitting form. Please check your input.']
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } finally {
    loading.value = false
  }
}

const fetchUserRegistrations = async () => {
  try {
    const { data } = await apiService.getMhpcNewApplications()
    userRegistrations.value =
      data?.results
        ?.map((app) => ({
          id: app.id,
          registration_no: app.registration_no,
          full_name: app.full_name,
          cid_no: app.cid_no,
        }))
        .sort((a, b) => a.full_name.localeCompare(b.full_name)) || []
  } catch (error) {
    console.error('Error fetching user registrations:', error)
  }
}

const loadDropdownOptions = async () => {
  loading.value = true
  participantFormKey.value++
  try {
    const [agency, reason, cpdType, methodology, categories, subcategories] = await Promise.all([
      apiService.getProvidingAgency(),
      apiService.getReasonForCoducting(),
      apiService.getMhpcMastersCpdActivities(),
      apiService.getMhpcMastersCpdMethodologies(),
      apiService.getMhpcMasterData('personnel-categories'),
      apiService.getMhpcMastersSubCategories(),
    ])

    agencyOptions.value =
      agency?.data?.results?.map((item) => ({ text: item.name, value: item.id })) || []
    reasonOptions.value =
      reason?.data?.results?.map((item) => ({ text: item.name, value: item.id })) || []
    cpdTypeOptions.value =
      cpdType?.data?.results?.map((item) => ({ text: item.cme_activity_name, value: item.id })) ||
      []
    methodologyOptions.value =
      methodology?.data?.results?.map((item) => ({
        text: item.methodology_name,
        value: item.id,
      })) || []
    participationCategoryOptions.value =
      categories?.data?.results?.map((category) => ({
        text: category.category_name,
        value: category.id,
      })) || []
    participantSubcategoryOptions.value =
      subcategories?.data?.results?.map((subcategory) => ({
        text: subcategory.sub_category_name,
        value: subcategory.id,
        categoryId: subcategory.category_id || subcategory.category,
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
    Object.assign(application, {
      isApproved: props.modelValue.isApproved ? 'true' : 'false',
      title: props.modelValue.title || '',
      venue: props.modelValue.venue || '',
      fromDate: props.modelValue.fromDate || '',
      toDate: props.modelValue.toDate || '',
    })
  }

  isCpdApproved.value = application.isApproved === 'true'
  watch(
    () => application.isApproved,
    (value) => (isCpdApproved.value = value === 'true'),
    { immediate: true }
  )
})
</script>
