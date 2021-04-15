<template>
  <div class="mx-auto p-4 sm:p-6 md:p-8 bg-gray-50 min-h-screen">
    <FormHeader />
    <LoadingOverlay :loading="loading" />

    <div class="bg-white border border-gray-200 rounded-xl shadow-lg p-4 sm:p-6 md:p-8 mt-6">
      <!-- Display Validation Errors -->
      <AlertMessage
        :messages="validationErrors"
        type="error"
        v-if="validationErrors.length > 0"
        class="mb-6"
      />
      <!-- Display Success Message -->
      <AlertMessage
        :messages="[successMessage]"
        type="success"
        v-if="successMessage"
        class="mb-6"
      />

      <!-- Applicant Details Section -->
      <ApplicantDetailsForm :applicant="applicant" class="mb-8" />

      <!-- Application Details Section -->
      <ApplicationDetailsForm
        :application="application"
        :handle-approval-letter-upload="handleApprovalLetterUpload"
        @approval-change="toggleApprovedFields"
        class="mb-8"
      />

      <!-- CPD Provider Form Section -->
      <CpdProviderForm
        v-model:cpdProvider="cpdProvider"
        :agency-options="agencyOptions"
        :reason-options="reasonOptions"
        :loading="loading"
        class="mb-8"
      />

      <!-- Resource Persons Section -->
      <ResourcePersonsForm
        :resource-persons="resourcePersons"
        :resource-person-certificate="resourcePersonCertificate"
        :fetch-resource-person-details="fetchResourcePersonDetails"
        :handle-certificate-upload="handleCertificateUpload"
        :add-resource-person="addResourcePerson"
        :remove-resource-person="removeResourcePerson"
        :user-registrations="userRegistrations"
        class="mb-8"
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
        class="mb-8"
      />

      <!-- Participant Details Section -->
      <ParticipantsDetailsForm
        v-model:participant-details="participantDetails"
        :participation-category-options="participationCategoryOptions"
        :participant-subcategory-options="participantSubcategoryOptions"
        :load-subcategories="loadSubcategories"
        :filtered-subcategories="filteredSubcategories"
        class="mb-8"
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
        class="mb-8"
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
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'
import apiService from '@/services/services'
import { useToast } from 'vue-toastification'

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

// Props (Not currently used for v-model on this parent)
/*
const props = defineProps({
  modelValue: { type: Object, default: () => ({}) }
});
const emit = defineEmits(['update:modelValue']);
const updateModelValue = () => { // Example function if needed
   emit('update:modelValue', { ... });
};
*/

const authStore = useAuthStore()
const router = useRouter()
const toast = useToast()

// --- Reactive States ---
const loading = ref(false)
const showConfirmation = ref(false)
const validationErrors = ref([])
const successMessage = ref('')
const userRegistrations = ref([]) // Stores { registration_no, full_name }

// --- Form Data Sections ---
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
const cpdProvider = reactive({ agency: '', otherAgency: '', reason: '', reasonDetails: '' })
const resourcePersons = ref([{ regNo: '', name: '' }])
const resourcePersonCertificate = ref(null)
const teachingMethod = reactive({ type: '', expectedOutcome: '' })
const selectedMethodologies = ref([])
const teachingMethods = ref([{ activity: '', duration: null }])
const totalHours = ref(0)
const calculatedCredits = ref(0)
const courseDocument = ref(null)
const participantDetails = reactive({ category: '', subcategory: '', number: null, relevance: '' })
const participants = ref([])
const isCpdApproved = ref(false) // Derived from application.isApproved
const approvalLetter = ref(null)
const attendanceSheet = ref(null)
const attachment = ref(null)

// --- Options for Dropdowns ---
const agencyOptions = ref([])
const reasonOptions = ref([])
const cpdTypeOptions = ref([])
const methodologyOptions = ref([])
const participationCategoryOptions = ref([])
const participantSubcategoryOptions = ref([]) // Holds ALL subcategories with parent ID

// --- Computed Property with FIX ---
const filteredSubcategories = computed(() => {
  // console.log("Filtering Subcategories...");
  // console.log("Selected Parent Category ID (string):", participantDetails.category, typeof participantDetails.category);
  // console.log("All Subcategory Options:", JSON.parse(JSON.stringify(participantSubcategoryOptions.value)));

  if (!participantDetails.category) {
    // console.log("No parent category selected.");
    return []
  }

  const selectedParentCategoryId = parseInt(participantDetails.category, 10)
  // console.log("Parsed Parent Category ID (number):", selectedParentCategoryId);

  if (isNaN(selectedParentCategoryId)) {
    console.error('Selected parent category ID is not a number:', participantDetails.category)
    return []
  }

  const filtered = participantSubcategoryOptions.value.filter((subcategory) => {
    const subcategoryParentId = subcategory.categoryId // This holds the parent ID assigned during mapping
    // console.log(`Comparing SubCat ParentID: ${subcategoryParentId} (type: ${typeof subcategoryParentId}) with Selected ParentID: ${selectedParentCategoryId} (type: ${typeof selectedParentCategoryId})`);

    // Robust comparison: Ensure both are compared as numbers
    return Number(subcategoryParentId) === selectedParentCategoryId
  })

  // console.log("Filtered Subcategories:", JSON.parse(JSON.stringify(filtered)));
  return filtered
})

// --- Methods ---

const toggleApprovedFields = () => {
  const approved = application.isApproved === 'true'
  isCpdApproved.value = approved
  console.log('Toggled isCpdApproved flag to:', approved)

  // Clear fields based on the *new* state
  if (approved) {
    // console.log("Clearing non-approved fields");
    application.title = ''
    application.venue = ''
    application.fromDate = ''
    application.toDate = ''
    // Keep approvalLetter, attachment, attendanceSheet as they become relevant
  } else {
    // console.log("Clearing approved-specific fields");
    participants.value = []
    attendanceSheet.value = null
    approvalLetter.value = null
    attachment.value = null
  }
  // updateModelValue(); // Call if this component uses v-model
}

const handleFileUpload = (event, targetRef, maxSizeMB = 5, allowedType = 'application/pdf') => {
  const file = event.target.files[0]
  const maxSize = maxSizeMB * 1024 * 1024

  if (file) {
    if (file.type === allowedType && file.size <= maxSize) {
      targetRef.value = file
      console.log(`File ${file.name} assigned to target ref.`)
      // updateModelValue(); // Call if relevant for v-model
    } else {
      toast.error(
        `Invalid file. Please upload a ${allowedType === 'application/pdf' ? 'PDF' : 'file'} no larger than ${maxSizeMB}MB.`,
      )
      targetRef.value = null
      event.target.value = '' // Reset file input
    }
  } else {
    targetRef.value = null // Clear if selection is cancelled
  }
}

const handleApprovalLetterUpload = (event) => handleFileUpload(event, approvalLetter)
const handleCertificateUpload = (event) => handleFileUpload(event, resourcePersonCertificate)
const handleCourseDocumentUpload = (event) => handleFileUpload(event, courseDocument)
const handleAttendanceSheetUpload = (event) => handleFileUpload(event, attendanceSheet)
const handleAttachmentUpload = (event) => handleFileUpload(event, attachment)

const fetchDetailsByRegNo = (item) => {
  if (!item.regNo) {
    item.name = ''
    return
  }
  const foundUser = userRegistrations.value.find((u) => u.registration_no === item.regNo)
  if (foundUser) {
    item.name = foundUser.full_name
  } else {
    item.name = 'Reg# not found'
    console.warn(`Registration number ${item.regNo} not found in fetched list.`)
    toast.warning(`Name for Reg# ${item.regNo} not found. Please verify the number.`, {
      timeout: 5000,
    })
  }
}

const fetchResourcePersonDetails = (person) => fetchDetailsByRegNo(person)
const fetchParticipantName = (participant) => fetchDetailsByRegNo(participant)

const addResourcePerson = () => resourcePersons.value.push({ regNo: '', name: '' })
const removeResourcePerson = (index) => {
  if (resourcePersons.value.length > 1) {
    resourcePersons.value.splice(index, 1)
  } else {
    toast.info('At least one resource person is usually required.')
    resourcePersons.value[0] = { regNo: '', name: '' } // Clear instead of removing last
  }
}

const removeTeachingMethod = (index) => {
  if (teachingMethods.value.length > 1) {
    teachingMethods.value.splice(index, 1)
  } else {
    toast.info('At least one teaching method/activity is required.')
    teachingMethods.value[0] = { activity: '', duration: null } // Clear instead of removing last
  }
  calculateTotalHours()
}

const addParticipant = () => participants.value.push({ regNo: '', name: '' })
const removeParticipant = (index) => participants.value.splice(index, 1)

const calculateTotalHours = () => {
  totalHours.value = teachingMethods.value.reduce((sum, method) => {
    const duration = Number(method.duration)
    return sum + (isNaN(duration) || duration < 0 ? 0 : duration)
  }, 0)
  calculatedCredits.value = totalHours.value // Adjust calculation rule if needed
}

const loadSubcategories = () => {
  // Primarily handled by computed property now.
  // Could be used to trigger API fetch if subcategories were loaded dynamically.
  // console.log("loadSubcategories called (handled by computed)");
}

const validateForm = () => {
  const errors = []
  const approved = application.isApproved === 'true'

  // --- Validation Logic (Simplified for brevity, keep your detailed checks) ---
  if (!applicant.agencyTrainingLocation?.trim())
    errors.push('Applicant: Agency/Training Location is required.')

  if (!approved) {
    if (!application.title?.trim()) errors.push('Application: Title of CPD is required.')
    if (!application.venue?.trim()) errors.push('Application: Venue is required.')
    if (!application.fromDate) errors.push('Application: From Date is required.')
    if (!application.toDate) errors.push('Application: To Date is required.')
    if (
      application.fromDate &&
      application.toDate &&
      new Date(application.fromDate) > new Date(application.toDate)
    )
      errors.push('Application: From Date cannot be later than To Date.')
    if (!courseDocument.value)
      errors.push('Teaching Method: Course Document (PDF) is required for new CPD.')
  } else {
    // Approved
    if (!approvalLetter.value)
      errors.push('Application: Approval Letter (PDF) is required when CPD is pre-approved.')
    if (!attachment.value) errors.push('Approved CPD: Attachment (PDF) is required.')
    if (!attendanceSheet.value) errors.push('Approved CPD: Attendance Sheet (PDF) is required.')
    if (participants.value.length === 0)
      errors.push('Approved CPD: At least one participant must be added.')
    else if (participants.value.some((p) => !p.regNo || !p.name || p.name === 'Reg# not found'))
      errors.push('Approved CPD: Reg# and valid Name are required for all Participants.')
  }

  if (!cpdProvider.agency) errors.push('CPD Provider: Agency selection is required.')
  if (cpdProvider.agency === 'other' && !cpdProvider.otherAgency?.trim())
    errors.push('CPD Provider: Specify the Other Agency name.')
  if (!cpdProvider.reason) errors.push('CPD Provider: Reason for Conducting selection is required.')
  if (!cpdProvider.reasonDetails?.trim()) errors.push('CPD Provider: Reason Details are required.')

  if (resourcePersons.value.length === 0)
    errors.push('Resource Persons: At least one resource person must be added.')
  else if (resourcePersons.value.some((p) => !p.regNo || !p.name || p.name === 'Reg# not found'))
    errors.push('Resource Persons: Reg# and valid Name are required for all Resource Persons.')
  if (!resourcePersonCertificate.value)
    errors.push('Resource Persons: Document supporting expertise (PDF) is required.')

  if (!teachingMethod.type) errors.push('Teaching Method: Type of CPD selection is required.')
  if (selectedMethodologies.value.length === 0)
    errors.push('Teaching Method: At least one Methodology must be selected.')
  if (!teachingMethod.expectedOutcome?.trim())
    errors.push('Teaching Method: Expected Outcome is required.')
  if (teachingMethods.value.length === 0)
    errors.push('Teaching Method: At least one Activity must be added.')
  else if (teachingMethods.value.some((m) => !m.activity?.trim() || !m.duration || m.duration <= 0))
    errors.push('Teaching Method: Activities require a description and positive duration.')
  if (totalHours.value <= 0) errors.push('Teaching Method: Total Duration must be greater than 0.')

  if (!participantDetails.category)
    errors.push('Participants Summary: Category selection is required.')
  if (
    participantDetails.category &&
    filteredSubcategories.value.length > 0 &&
    !participantDetails.subcategory
  )
    errors.push('Participants Summary: Sub-category selection is required for the chosen Category.')
  if (!participantDetails.number || participantDetails.number <= 0)
    errors.push('Participants Summary: Expected Number of Participants must be greater than 0.')
  if (!participantDetails.relevance?.trim())
    errors.push('Participants Summary: Relevance description is required.')

  validationErrors.value = errors
  return errors.length === 0
}

const prepareFormData = (isDraft = false) => {
  const formData = new FormData()
  const isCpdApprovedFlag = application.isApproved === 'true'

  console.log(`Preparing FormData (Draft: ${isDraft}, Approved: ${isCpdApprovedFlag})`)

  // Append basic details
  formData.append('cid_no', applicant.cidNumber)
  formData.append('registration_no', applicant.registrationNumber) // Make sure this is populated
  formData.append('full_name', applicant.fullName)
  formData.append('proposed_training_location', applicant.agencyTrainingLocation)
  formData.append('is_cpd_approved', isCpdApprovedFlag)
  formData.append('is_draft', isDraft)

  // Append conditional details
  if (!isCpdApprovedFlag) {
    formData.append('title_of_cpd', application.title || '')
    formData.append('venue', application.venue || '')
    formData.append('from_date', application.fromDate || '')
    formData.append('to_date', application.toDate || '')
  }

  // Provider Details
  formData.append(
    'cpd_providing_agency',
    cpdProvider.agency === 'other' ? '' : parseInt(cpdProvider.agency, 10) || '',
  )
  formData.append(
    'if_others_specify',
    cpdProvider.agency === 'other' ? cpdProvider.otherAgency || '' : '',
  )
  formData.append('reason_for_conducting', parseInt(cpdProvider.reason, 10) || '')
  formData.append('reason_for_details', cpdProvider.reasonDetails || '')

  // Resource Persons (JSON)
  const validResourcePersons = resourcePersons.value
    .filter((p) => p.regNo && p.name && p.name !== 'Reg# not found')
    .map((p) => ({ resource_person_reg_no: p.regNo, resource_person_name: p.name }))
  formData.append('resources', JSON.stringify(validResourcePersons))

  // Teaching Method
  formData.append('type_of_cpd', teachingMethod.type || '') // Send ID
  formData.append('expected_outcome', teachingMethod.expectedOutcome || '')

  // Methodologies (JSON array of objects with methodology_name: ID)
  const validMethodologies = selectedMethodologies.value.map((id) => ({ methodology_name: id }))
  formData.append('methodologies', JSON.stringify(validMethodologies))

  // Learning Methods (JSON array of objects)
  const validLearningMethods = teachingMethods.value
    .filter((m) => m.activity?.trim() && m.duration > 0)
    .map((m) => ({ activities: m.activity, duration: m.duration }))
  formData.append('learning_methods', JSON.stringify(validLearningMethods))

  // Participant Summary
  formData.append('number_of_participants', participantDetails.number || 0)
  formData.append('relevance_to_topic', participantDetails.relevance || '')
  formData.append('participation_category', participantDetails.category || '') // Send ID
  formData.append('participant_sub_category', participantDetails.subcategory || '') // Send ID

  // Participant List (JSON) - Send even if empty for consistency
  const validParticipants = participants.value
    .filter((p) => p.regNo && p.name && p.name !== 'Reg# not found')
    .map((p) => ({
      participant_reg_no: p.regNo,
      cpd_credits: calculatedCredits.value, // Use calculated credits
      // review_status: 'Pending' // Backend might set default
    }))
  formData.append('participants', JSON.stringify(validParticipants))

  // Files
  if (isCpdApprovedFlag) {
    if (approvalLetter.value) formData.append('approval_letter_attachment', approvalLetter.value)
    if (attachment.value) formData.append('approved_cpd_main_attachment', attachment.value) // Use specific key if needed
    if (attendanceSheet.value) formData.append('attendance_sheet_attachment', attendanceSheet.value)
  } else {
    if (courseDocument.value) formData.append('course_document', courseDocument.value)
  }
  // Common File
  if (resourcePersonCertificate.value)
    formData.append('document_supporting_expertise', resourcePersonCertificate.value)

  // Log final FormData before sending (optional)
  // console.log("--- FormData Contents ---");
  // for (let [key, value] of formData.entries()) {
  //     if (value instanceof File) console.log(`${key}: File(name=${value.name})`);
  //     else console.log(`${key}: ${value}`);
  // }
  // console.log("-------------------------");

  return formData
}

const getErrorMessages = (error) => {
  const messages = []
  if (error.response && error.response.data) {
    const errorData = error.response.data
    const extractErrors = (obj, prefix = '') => {
      if (typeof obj === 'string') messages.push(`${prefix ? prefix + ': ' : ''}${obj}`)
      else if (Array.isArray(obj)) obj.forEach((item) => extractErrors(item, prefix))
      else if (typeof obj === 'object' && obj !== null) {
        Object.keys(obj).forEach((key) => extractErrors(obj[key], key))
      }
    }
    extractErrors(errorData)
  }
  if (messages.length === 0) messages.push(error.message || 'An unknown error occurred.')
  return [...new Set(messages)] // Remove duplicates
}

const saveDraft = async () => {
  loading.value = true
  validationErrors.value = []
  successMessage.value = ''
  try {
    const formData = prepareFormData(true)
    await apiService.createEpcCpdTask(formData)
    successMessage.value = 'Draft saved successfully!'
    toast.success(successMessage.value)
    setTimeout(() => {
      successMessage.value = ''
    }, 4000)
  } catch (error) {
    console.error('Error saving draft:', error)
    validationErrors.value = getErrorMessages(error)
    window.scrollTo({ top: 0, behavior: 'smooth' })
    toast.error('Failed to save draft.')
  } finally {
    loading.value = false
  }
}

const handleSubmit = () => {
  validationErrors.value = []
  successMessage.value = ''
  if (validateForm()) {
    showConfirmation.value = true
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    toast.error('Please fix the validation errors before submitting.')
    console.log('Validation Failed:', validationErrors.value)
  }
}

const confirmSubmit = async () => {
  showConfirmation.value = false
  if (!validateForm()) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    toast.error('Validation failed. Please review the form.')
    return
  }
  loading.value = true
  validationErrors.value = []
  successMessage.value = ''
  try {
    const formData = prepareFormData(false)
    const response = await apiService.createEpcCpdTask(formData)
    console.log('Form submitted successfully:', response.data)
    successMessage.value = 'CPD application submitted successfully! Redirecting...'
    toast.success(successMessage.value)
    setTimeout(() => {
      // Navigate to tracking or dashboard page
      router.push({ name: 'TrackCpdApplications' }) // ADJUST ROUTE NAME
    }, 2500)
  } catch (error) {
    console.error('Error submitting form:', error)
    validationErrors.value = getErrorMessages(error)
    window.scrollTo({ top: 0, behavior: 'smooth' })
    toast.error('Failed to submit application.')
  } finally {
    loading.value = false
  }
}

const cancelForm = () => {
  if (confirm('Are you sure you want to cancel and discard changes?')) {
    // Navigate away, e.g., to a dashboard
    router.push({ name: 'CpdProviderDashboard' }) // ADJUST ROUTE NAME
  }
}

// Fetch list of registered users for lookups (simplified)
const fetchUserRegistrations = async () => {
  console.log('Fetching user registrations...')
  try {
    // Assuming a more direct endpoint or filtering capability if available
    // For now, using getEpcNewApplications and filtering frontend
    const response = await apiService.getEpcNewApplications({ params: { page_size: 1000 } }) // Fetch a large page

    if (response.data?.results && Array.isArray(response.data.results)) {
      userRegistrations.value = response.data.results
        .filter((app) => app.registration_no && app.full_name)
        .map((app) => ({ registration_no: app.registration_no, full_name: app.full_name }))
        .sort((a, b) => a.full_name.localeCompare(b.full_name))
      console.log(`Fetched ${userRegistrations.value.length} User Registrations.`)
    } else {
      console.warn('No user registrations found or API response format unexpected.')
      userRegistrations.value = []
    }
  } catch (error) {
    console.error('Error fetching user registrations:', error)
    validationErrors.value.push('Error fetching data for lookups.')
  }
}

// Fetch options for all dropdowns
const loadDropdownOptions = async () => {
  console.log('Loading dropdown options...')
  try {
    const [agencyRes, reasonRes, cpdTypeRes, methodologyRes, categoriesRes, subcategoriesRes] =
      await Promise.all([
        apiService.getEpcCpdProvidingAgencies(),
        apiService.getEpcCpdReasonsForConducting(),
        apiService.getEpcMastersCpdActivities(),
        apiService.getEpcMastersCpdMethodologies(),
        apiService.getEpcMastersParticipationCategories(),
        apiService.getEpcMastersParticipationSubCategories(),
      ])

    const processOptions = (response, textField, valueField, categoryField = null) => {
      const results = response.data?.results
      if (results && Array.isArray(results)) {
        return results
          .map((item) => {
            const option = {
              text: item[textField] || `Unnamed (ID: ${item[valueField]})`, // Fallback text
              value: item[valueField], // Keep original value type (string or number)
            }
            if (
              categoryField &&
              item[categoryField] !== undefined &&
              item[categoryField] !== null
            ) {
              // Ensure the parent ID is stored consistently, maybe as number if needed for comparison later
              option.categoryId = item[categoryField]
              // console.log(`Mapping subcat '${option.text}', parent ID: ${option.categoryId} (type: ${typeof option.categoryId}) from field '${categoryField}'`);
            } else if (categoryField) {
              console.warn(`Missing category field '${categoryField}' for item:`, item)
            }
            return option
          })
          .filter((opt) => opt.value !== undefined && opt.value !== null) // Filter out items with missing value
      }
      console.warn(
        `Could not process options, response invalid or empty. Target field: ${textField}`,
      )
      return []
    }

    agencyOptions.value = processOptions(agencyRes, 'name', 'id')
    reasonOptions.value = processOptions(reasonRes, 'name', 'id')
    cpdTypeOptions.value = processOptions(cpdTypeRes, 'cpd_activity_name', 'id')
    methodologyOptions.value = processOptions(methodologyRes, 'methodology_name', 'id')
    participationCategoryOptions.value = processOptions(
      categoriesRes,
      'participation_category_name',
      'id',
    )
    // **** IMPORTANT: Using 'participation_category_name' as the field containing the PARENT category ID ****
    participantSubcategoryOptions.value = processOptions(
      subcategoriesRes,
      'participation_sub_category_name',
      'id',
      'participation_category_name',
    )

    console.log(
      `Loaded Options: Agencies(${agencyOptions.value.length}), Reasons(${reasonOptions.value.length}), Types(${cpdTypeOptions.value.length}), Methods(${methodologyOptions.value.length}), Cats(${participationCategoryOptions.value.length}), SubCats(${participantSubcategoryOptions.value.length})`,
    )

    // Add warnings if critical options are missing
    if (agencyOptions.value.length === 0) console.warn('Agency options list is empty!')
    if (reasonOptions.value.length === 0) console.warn('Reason options list is empty!')
    if (cpdTypeOptions.value.length === 0) console.warn('CPD Type options list is empty!')
    if (methodologyOptions.value.length === 0) console.warn('Methodology options list is empty!')
    if (participationCategoryOptions.value.length === 0)
      console.warn('Participation Category options list is empty!')
    // Subcategory list might be empty if none exist yet
  } catch (error) {
    console.error('Error loading one or more dropdown options:', error)
    validationErrors.value.push(
      'Critical error loading form selection options. Please try refreshing the page.',
    )
    toast.error('Failed to load essential form data. Please refresh.')
  }
}

// --- Lifecycle Hooks ---

onMounted(async () => {
  loading.value = true
  validationErrors.value = []
  successMessage.value = ''

  // Populate applicant details from store
  applicant.cidNumber = authStore.user?.cid || ''
  applicant.fullName =
    [authStore.user?.first_name, authStore.user?.middle_name, authStore.user?.last_name]
      .filter(Boolean)
      .join(' ') || 'N/A'
  // Make sure registration_number is correct field name in your authStore user object
  applicant.registrationNumber = authStore.user?.registration_number || ''
  if (!applicant.registrationNumber) {
    console.warn('Registration number missing from auth store. Fetching might be needed.')
    // Potentially trigger another fetch or display warning
  }

  await Promise.all([fetchUserRegistrations(), loadDropdownOptions()])

  // Set initial derived state & calculations
  isCpdApproved.value = application.isApproved === 'true'
  calculateTotalHours()

  loading.value = false
  console.log('Component mounted and initial data loaded.')
})

// --- Watchers ---

watch(
  () => application.isApproved,
  (newVal) => {
    console.log('Watcher: application.isApproved changed to', newVal)
    toggleApprovedFields()
  },
)

watch(
  () => participantDetails.category,
  (newCategory, oldCategory) => {
    if (newCategory !== oldCategory) {
      console.log('Watcher: participantDetails.category changed, resetting subcategory.')
      participantDetails.subcategory = '' // Reset subcategory selection
    }
  },
)

watch(
  teachingMethods,
  () => {
    // console.log("Watcher: teachingMethods changed, recalculating hours.");
    calculateTotalHours()
  },
  { deep: true },
)
</script>

<style scoped>
/* Consistent spacing using mb-8 on form sections */
</style>
