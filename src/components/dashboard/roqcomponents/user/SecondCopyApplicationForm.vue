<template>
  <div>
    <PaymentModal
      ref="paymentModal"
      :amount="paymentAmount"
      @payment-completed="onPaymentCompleted"
      @close="onPaymentModalClose"
    />

    <form @submit.prevent="handleSubmit" class="space-y-8">
      <div class="bg-gray-50/50 border p-8 rounded-xl shadow-sm">
        <h3 class="text-xl font-semibold mb-6 text-gray-900 border-b pb-4">
          1. Find Original Certificate
        </h3>
        <div>
          <label
            for="original_application"
            class="block text-sm font-medium text-gray-700 mb-2 required"
          >
            Search by Your Name or CID to find the certificate you want a copy of.
          </label>
          <div class="relative">
            <input
              type="text"
              id="original_application"
              v-model="searchQuery"
              @input="onSearchInput"
              :disabled="!!selectedOriginalApplication"
              placeholder="Start typing to search..."
              class="w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50 p-4 pl-10"
            />
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clip-rule="evenodd"
                />
              </svg>
            </span>
          </div>

          <ul
            v-if="filteredApplications.length > 0 && !selectedOriginalApplication"
            class="mt-2 bg-white border rounded-lg shadow-lg z-10"
          >
            <li
              v-for="app in filteredApplications"
              :key="app.id"
              @click="onOriginalApplicationSelect(app)"
              class="p-3 hover:bg-primary-50 cursor-pointer transition-colors"
            >
              <span class="font-semibold">{{ app.applicants_name }}</span> ({{ app.cid_no }}) -
              <span class="text-gray-600">{{ app.course_title }}</span>
            </li>
          </ul>

          <div
            v-if="selectedOriginalApplication"
            class="mt-4 bg-primary-50 border border-primary-200 p-4 rounded-lg flex justify-between items-center"
          >
            <div>
              <p class="font-semibold text-primary-800">
                {{ selectedOriginalApplication.applicants_name }} ({{
                  selectedOriginalApplication.course_title
                }})
              </p>
              <p class="text-sm text-gray-600">
                QEC No: {{ selectedOriginalApplication.qec_number }}
              </p>
            </div>
            <button
              @click="clearSelectedApplication"
              class="text-gray-500 hover:text-red-600 font-semibold"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      <div
        v-if="selectedOriginalApplication"
        class="bg-white border p-8 rounded-xl shadow-sm space-y-6"
      >
        <h3 class="text-xl font-semibold mb-2 text-gray-900 border-b pb-4">2. Specify Changes</h3>
        <div
          v-for="(change, index) in form.change_details_input"
          :key="index"
          class="space-y-4 border-b pb-6"
        >
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
            <div class="lg:col-span-1">
              <label :for="'changed_field_' + index" class="form-label required"
                >Field to Change</label
              >
              <select
                :id="'changed_field_' + index"
                v-model="change.changed_field"
                required
                class="form-input"
              >
                <option value="" disabled>Select Field</option>
                <option
                  v-for="field in changedFieldOptions"
                  :key="field.value"
                  :value="field.value"
                >
                  {{ field.label }}
                </option>
              </select>
            </div>

            <div class="lg:col-span-1">
              <label :for="'old_value_' + index" class="form-label required">Old Value</label>
              <input
                type="text"
                :id="'old_value_' + index"
                v-model="change.old_value"
                required
                class="form-input"
              />
            </div>

            <div class="lg:col-span-1">
              <label :for="'new_value_' + index" class="form-label required">New Value</label>
              <input
                type="text"
                :id="'new_value_' + index"
                v-model="change.new_value"
                @input="syncFormValue(change.changed_field, change.new_value)"
                required
                class="form-input"
              />
            </div>

            <div v-if="change.changed_field === 'other'" class="md:col-span-2 lg:col-span-3">
              <label :for="'other_description_' + index" class="form-label required"
                >Description of Other Change</label
              >
              <input
                type="text"
                :id="'other_description_' + index"
                v-model="change.other_description"
                required
                class="form-input"
              />
            </div>
          </div>
          <button
            type="button"
            @click="removeChangeDetail(index)"
            class="text-sm text-red-600 hover:text-red-800 transition-colors"
          >
            Remove Change
          </button>
        </div>
        <button
          type="button"
          @click="addChangeDetail"
          class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          + Add Another Change
        </button>
      </div>

      <div
        v-if="selectedOriginalApplication"
        class="bg-white border p-8 rounded-xl shadow-sm space-y-8"
      >
        <div>
          <h3 class="text-xl font-semibold mb-6 text-gray-900 border-b pb-4">
            3. Updated Personal Information
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <InputField label="CID No." v-model="form.cid_no" :readonly="isFieldLocked('cid_no')" />
            <InputField
              label="Full Name"
              v-model="form.applicants_name"
              :readonly="isFieldLocked('applicants_name')"
            />
            <InputField
              label="Date of Birth"
              v-model="form.date_of_birth"
              :readonly="isFieldLocked('date_of_birth')"
            />
            <InputField
              label="Contact Number"
              v-model="form.contact_no"
              :readonly="isFieldLocked('contact_no')"
              required
            />
            <InputField
              label="Email Address"
              v-model="form.email_address"
              type="email"
              :readonly="isFieldLocked('email_address')"
              required
            />
            <InputField label="Gender" v-model="form.gender" :readonly="isFieldLocked('gender')" />
            <InputField
              label="Dzongkhag"
              v-model="form.dzongkhag"
              :readonly="isFieldLocked('dzongkhag')"
            />
            <InputField label="Gewog" v-model="form.gewog" :readonly="isFieldLocked('gewog')" />
            <InputField
              label="Village"
              v-model="form.village"
              :readonly="isFieldLocked('village')"
            />
          </div>
        </div>

        <div>
          <h3 class="text-xl font-semibold mb-6 text-gray-900 border-b pb-4">
            4. Updated Education Details
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <InputField
              label="Course Title"
              v-model="form.course_title"
              :readonly="isFieldLocked('course_title')"
              required
            />
            <InputField
              label="Name of Institute"
              v-model="form.name_of_institute"
              :readonly="isFieldLocked('name_of_institute')"
              required
            />
            <InputField
              label="Name of University"
              v-model="form.name_of_university"
              :readonly="isFieldLocked('name_of_university')"
              required
            />
            <InputField
              label="Student ID No."
              v-model="form.student_id_no"
              :readonly="isFieldLocked('student_id_no')"
              required
            />
          </div>
        </div>
        <div v-if="selectedOriginalApplication" class="bg-white border p-8 rounded-xl shadow-sm">
          <h3 class="text-xl font-semibold mb-6 text-gray-900 border-b pb-4">
            5. Reason for Second Copy
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="reason_for_second_copy" class="form-label required">Reason</label>
              <select
                id="reason_for_second_copy"
                v-model="form.reason_for_issue_of_second_copy"
                required
                class="form-input"
              >
                <option value="" disabled>Select a reason</option>
                <option v-for="reason in reasonsForSecondCopy" :key="reason.id" :value="reason.id">
                  {{ reason.name }}
                </option>
              </select>
            </div>

            <div v-if="form.reason_for_issue_of_second_copy === othersReasonId">
              <label for="other_specify" class="form-label required">Other (Please Specify)</label>
              <input
                type="text"
                id="other_specify"
                v-model="form.second_copy_other"
                required
                class="form-input"
              />
            </div>
          </div>
        </div>
        <div v-if="selectedOriginalApplication" class="bg-white border p-8 rounded-xl shadow-sm">
          <h3 class="text-xl font-semibold mb-6 text-gray-900 border-b pb-4">
            6. Supporting Document
          </h3>
          <div>
            <label class="form-label required"
              >Upload a supporting document for your reason (e.g., FIR for lost certificate).</label
            >
            <FileUpload
              v-model="form.second_copy_supporting_document"
              accept=".pdf"
              :max-size="5"
              required
            />
            <p class="mt-2 text-sm text-gray-500">PDF format only, maximum 5MB.</p>
          </div>
        </div>
        <div v-if="selectedOriginalApplication" class="bg-white border p-8 rounded-xl shadow-sm">
          <div class="flex items-start">
            <div class="flex items-center h-5">
              <input
                type="checkbox"
                id="declaration"
                v-model="declaration"
                required
                class="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
            </div>
            <div class="ml-3 text-sm">
              <label for="declaration" class="font-medium text-gray-700">Declaration</label>
              <p class="text-gray-500 mt-1">
                I hereby declare that the information provided is true and correct to the best of my
                knowledge.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="flex justify-end space-x-4 pt-4 border-t">
        <button
          type="button"
          @click="$emit('close-modal')"
          class="px-8 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all"
        >
          Cancel
        </button>
        <button
          type="submit"
          :disabled="isSubmitting || !declaration"
          class="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {{ isSubmitting ? 'Submitting...' : 'Proceed to Payment' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useToast } from 'vue-toastification'
import apiService from '@/services/services'
import PaymentModal from '@/components/common/PaymentModal.vue'
import FileUpload from '@/components/common/FileUpload.vue'
import InputField from '@/components/common/InputField.vue'

//======================================================================
// Component Emits
//======================================================================
const emit = defineEmits(['application-submitted', 'close-modal'])

//======================================================================
// Store and Plugin Initialization
//======================================================================
const authStore = useAuthStore()
const { user } = authStore
const toast = useToast()

//======================================================================
// Component State (Refs & Reactive)
//======================================================================
const form = reactive({
  cid_no: '',
  applicants_name: '',
  date_of_birth: '',
  contact_no: '',
  email_address: '',
  gender: '',
  dzongkhag: '',
  gewog: '',
  village: '',
  from_in_country: null,
  course_title: '',
  qualification: '',
  type_of_course: '',
  duration_of_course: '',
  name_of_institute: '',
  name_of_university: '',
  student_id_no: '',
  year_of_completion: '',
  website: '',
  location: '',
  country: '',
  reason_for_issue_of_second_copy: '',
  second_copy_other: '',
  second_copy_supporting_document: null,
  is_payment_complete: false,
  payment_id: null,
  status: 'applied',
  change_details_input: [],
})

const originalApplications = ref([])
const filteredApplications = ref([])
const qualificationOptions = ref([])
const courseTypeOptions = ref([])
const reasonsForSecondCopy = ref([])
const selectedOriginalApplication = ref(null)

const searchQuery = ref('')
const isSubmitting = ref(false)
const declaration = ref(false)
const paymentAmount = ref(0)
const othersReasonId = ref(null)
const lockedFields = ref(new Set())
const paymentModal = ref(null)

//======================================================================
// Constants & Static Data
//======================================================================
const serviceCodeForSecondCopy = '100193'
const changedFieldOptions = [
  { value: 'cid_no', label: 'CID Number' },
  { value: 'applicants_name', label: 'Name' },
  { value: 'date_of_birth', label: 'Date of Birth' },
  { value: 'contact_no', label: 'Contact Number' },
  { value: 'email_address', label: 'Email Address' },
  { value: 'course_title', label: 'Course Title' },
  { value: 'name_of_institute', label: 'Name of Institute' },
  { value: 'name_of_university', label: 'Name of University' },
  { value: 'student_id_no', label: 'Student ID Number' },
  { value: 'other', label: 'Other' },
]

//======================================================================
// Lifecycle Hooks
//======================================================================
onMounted(async () => {
  try {
    const [appsRes, reasonsRes, qualsRes, courseTypesRes, feeRes] = await Promise.all([
      apiService.getRecognitionOfQualification(user.cid),
      apiService.getReasonsForIssueOfSecondCopy(),
      apiService.getQualifications(),
      apiService.getTypesOfCourse(),
      apiService.getServiceFee(serviceCodeForSecondCopy),
    ])

    originalApplications.value = appsRes.data.filter(
      (app) => app.status === 'approved' && !app.is_second_copy
    )
    reasonsForSecondCopy.value = reasonsRes.data.results
    qualificationOptions.value = qualsRes.data.results.map((q) => ({ value: q.id, label: q.name }))
    courseTypeOptions.value = courseTypesRes.data.results.map((t) => ({
      value: t.id,
      label: t.name,
    }))

    const othersReason = reasonsForSecondCopy.value.find((r) => r.name.toLowerCase() === 'others')
    if (othersReason) {
      othersReasonId.value = othersReason.id
    }

    if (feeRes.data && feeRes.data.fees) {
      paymentAmount.value = feeRes.data.fees
    } else {
      toast.error('Failed to fetch payment amount. Using default.')
      paymentAmount.value = 1000 // Fallback
    }
  } catch (error) {
    toast.error('Failed to fetch initial data: ' + error.message)
    console.error('Error fetching data:', error)
    paymentAmount.value = 1000 // Fallback
  }
})

//======================================================================
// Watchers
//======================================================================
watch(
  () => form.change_details_input,
  () => updateLockedFields(),
  { deep: true }
)

//======================================================================
// Methods - Search & Selection Logic
//======================================================================
const onSearchInput = () => {
  if (searchQuery.value) {
    const results = originalApplications.value.filter(
      (app) =>
        (app.applicants_name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          app.cid_no.toLowerCase().includes(searchQuery.value.toLowerCase())) &&
        app.status === 'approved' &&
        !app.is_second_copy
    )

    if (results.length === 1) {
      onOriginalApplicationSelect(results[0])
    } else {
      filteredApplications.value = results
    }
  } else {
    filteredApplications.value = []
  }
}

const onOriginalApplicationSelect = (app) => {
  selectedOriginalApplication.value = app
  Object.assign(form, {
    cid_no: app.cid_no,
    applicants_name: app.applicants_name,
    date_of_birth: app.date_of_birth,
    contact_no: app.contact_no,
    email_address: app.email_address,
    gender: app.gender,
    dzongkhag: app.dzongkhag,
    gewog: app.gewog,
    village: app.village,
    from_in_country: app.from_in_country,
    course_title: app.course_title,
    duration_of_course: app.duration_of_course,
    name_of_institute: app.name_of_institute,
    name_of_university: app.name_of_university,
    student_id_no: app.student_id_no,
    year_of_completion: app.year_of_completion,
    website: app.website,
    location: app.location,
    country: app.country,
    qualification: app.qualification?.id || '',
    type_of_course: app.type_of_course?.id || '',
    change_details_input: [],
  })

  searchQuery.value = ''
  filteredApplications.value = []
  updateLockedFields()
}

const clearSelectedApplication = () => {
  selectedOriginalApplication.value = null
  Object.keys(form).forEach((key) => {
    const initialValue = form[key]
    if (Array.isArray(initialValue)) {
      form[key] = []
    } else if (typeof initialValue === 'boolean') {
      form[key] = false
    } else if (typeof initialValue === 'number') {
      form[key] = 0
    } else {
      form[key] = ''
    }
  })
  lockedFields.value.clear()
}

//======================================================================
// Methods - Change Details Logic
//======================================================================
const addChangeDetail = () => {
  form.change_details_input.push({
    changed_field: '',
    old_value: '',
    new_value: '',
    other_description: '',
  })
}

const removeChangeDetail = (index) => {
  const removedField = form.change_details_input[index].changed_field
  form.change_details_input.splice(index, 1)

  const isStillLocked = form.change_details_input.some((c) => c.changed_field === removedField)
  if (!isStillLocked && selectedOriginalApplication.value) {
    form[removedField] = selectedOriginalApplication.value[removedField]
  }
  updateLockedFields()
}

const updateLockedFields = () => {
  lockedFields.value.clear()
  form.change_details_input.forEach((change) => {
    if (change.changed_field) {
      lockedFields.value.add(change.changed_field)
    }
  })
}

const isFieldLocked = (fieldName) => {
  return lockedFields.value.has(fieldName)
}

const syncFormValue = (field, value) => {
  if (field in form) {
    form[field] = value
  }
}

//======================================================================
// Methods - Form Submission & Payment Logic
//======================================================================
const handleSubmit = () => {
  if (!selectedOriginalApplication.value)
    return toast.error('Please select an original application.')
  if (form.change_details_input.length === 0)
    return toast.error('Please add at least one change detail.')

  for (const change of form.change_details_input) {
    if (!change.changed_field || !change.old_value || !change.new_value) {
      return toast.error('Please fill all fields in the Change Details section.')
    }
    if (change.changed_field === 'other' && !change.other_description) {
      return toast.error("Please provide a description for the 'Other' change.")
    }
  }

  if (!form.reason_for_issue_of_second_copy) return toast.error('Please select a reason.')
  if (!form.second_copy_supporting_document)
    return toast.error('Please upload a supporting document.')
  if (!declaration.value) return toast.error('Please accept the declaration.')

  openPaymentModal()
}

const openPaymentModal = () => {
  paymentModal.value.openModal()
}

const onPaymentCompleted = (paymentData) => {
  form.is_payment_complete = false // This will be set on server callback
  form.payment_id = paymentData.paymentHash
  form.status = 'processing_payment'
  handleSubmitActual()
}

const onPaymentModalClose = () => {
  // Can add logic here if needed
}

const handleSubmitActual = async () => {
  isSubmitting.value = true
  try {
    const formData = new FormData()

    // Append core details
    formData.append('original_application_id', selectedOriginalApplication.value.id)
    formData.append('is_second_copy', 'true')

    // Append all other form fields
    for (const key in form) {
      if (key === 'change_details_input') continue // Handled separately
      const value = form[key]
      if (value instanceof File) {
        formData.append(key, value)
      } else if (key === 'date_of_birth') {
        formData.append(key, formatDate(value))
      } else if (value !== null && value !== undefined) {
        formData.append(key, String(value))
      }
    }

    // Append change details in the format the backend expects
    form.change_details_input.forEach((change, index) => {
      formData.append(
        `change_details_input[${index}][changed_field]`,
        (change.changed_field || '').trim()
      )
      formData.append(`change_details_input[${index}][old_value]`, (change.old_value || '').trim())
      formData.append(`change_details_input[${index}][new_value]`, (change.new_value || '').trim())
      if (change.other_description) {
        formData.append(
          `change_details_input[${index}][other_description]`,
          (change.other_description || '').trim()
        )
      }
    })

    // Create a separate FormData for the payment initiation
    const paymentFormData = new FormData()
    paymentFormData.append('refNo', form.payment_id)
    paymentFormData.append('serviceCode', serviceCodeForSecondCopy)
    paymentFormData.append('taxPayerName', form.applicants_name)
    paymentFormData.append('taxPayerNo', form.cid_no)
    paymentFormData.append('mobileNo', form.contact_no)
    paymentFormData.append('payerEmail', form.email_address)
    paymentFormData.append('totalPayableAmount', paymentAmount.value)
    paymentFormData.append('payableAmount', paymentAmount.value)
    paymentFormData.append('description', 'Payment for Second Copy ROQ')
    paymentFormData.append('user', authStore.userId)
    paymentFormData.append('application_no', form.payment_id)
    paymentFormData.append('app_type', 'recognition_of_qualification')
    paymentFormData.append('taxPayerDocumentNo', 'BAOW') // As per original code

    // 1. Initiate payment
    const paymentResponse = await apiService.makePayment(paymentFormData)
    const redirectUrl = paymentResponse.data?.content?.redirectUrl
    if (!redirectUrl) {
      throw new Error('Redirect URL not received from payment gateway.')
    }

    // 2. Submit the application form data
    const appResponse = await apiService.createRecognitionOfQualification(formData)
    if (appResponse.status === 201) {
      toast.success('Application submitted! Redirecting for payment...', { timeout: 5000 })
      window.open(redirectUrl, '_blank')
      emit('application-submitted')
    }
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message
    toast.error(`Submission failed: ${errorMessage}`)
    console.error('Error during submission:', error)
  } finally {
    isSubmitting.value = false
  }
}

//======================================================================
// Utility Functions
//======================================================================
const formatDate = (dateString) => {
  if (!dateString) return ''
  // Check if already in YYYY-MM-DD format
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return dateString
  }
  const date = new Date(dateString)
  if (isNaN(date.getTime())) {
    console.error('Invalid date for formatting:', dateString)
    return ''
  }
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
</script>


<style>
/* Add some global styles for form elements for consistency */
.form-label {
  @apply block text-sm font-medium text-gray-700 mb-1;
}
.form-input,
select.form-input {
  @apply mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50 p-3;
}
input[readonly].form-input {
  @apply bg-gray-100 cursor-not-allowed;
}
.required:after {
  content: ' *';
  color: red;
}
</style>
