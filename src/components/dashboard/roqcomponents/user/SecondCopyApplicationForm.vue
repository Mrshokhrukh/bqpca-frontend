<template>
  <div>
    <PaymentModal
      ref="paymentModal"
      :amount="1000"
      @payment-completed="onPaymentCompleted"
      @close="onPaymentModalClose"
    />
    <form @submit.prevent="handleSubmit" class="space-y-6">
      <!-- Autocomplete Dropdown for Original Application -->
      <div class="bg-white border p-6 rounded-lg shadow-sm">
        <h3 class="text-xl font-semibold mb-4 text-gray-900">Select Original Application</h3>
        <div>
          <label
            for="original_application"
            class="block text-sm font-medium text-gray-700 required"
          >
            Search by Your Name or CID
          </label>
          <input
            type="text"
            id="original_application"
            v-model="searchQuery"
            @input="onSearchInput"
            placeholder="Start typing to begin search..."
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2"
          />
          <ul
            v-if="filteredApplications.length > 0"
            class="mt-2 bg-white border rounded-lg shadow-sm"
          >
            <li
              v-for="app in filteredApplications"
              :key="app.id"
              @click="onOriginalApplicationSelect(app)"
              class="p-2 hover:bg-gray-50 cursor-pointer"
            >
              {{ app.applicants_name }} ({{ app.cid_no }}),
              {{ app.course_title }}
            </li>
          </ul>
        </div>
      </div>

      <!-- Change Details Section -->
      <div v-if="selectedOriginalApplication" class="bg-white border p-6 rounded-lg shadow-sm">
        <h3 class="text-xl font-semibold mb-4 text-gray-900">Change Details</h3>
        <div v-for="(change, index) in form.change_details_input" :key="index" class="mb-4 border-b pb-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Changed Field -->
            <div>
              <label :for="'changed_field_' + index" class="block text-sm font-medium text-gray-700 required">
                Changed Field
              </label>
              <select
                :id="'changed_field_' + index"
                v-model="change.changed_field"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2"
              >
                <option value="" disabled>Select Field</option>
                <option v-for="field in changedFieldOptions" :key="field.value" :value="field.value">
                  {{ field.label }}
                </option>
              </select>
            </div>

            <!-- Old Value -->
            <div>
              <label :for="'old_value_' + index" class="block text-sm font-medium text-gray-700 required">
                Old Value
              </label>
              <input
                type="text"
                :id="'old_value_' + index"
                v-model="change.old_value"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2"
              />
            </div>

            <!-- New Value -->
            <div>
              <label :for="'new_value_' + index" class="block text-sm font-medium text-gray-700 required">
                New Value
              </label>
              <input
                type="text"
                :id="'new_value_' + index"
                v-model="change.new_value"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2"
              />
            </div>

            <!-- Other Description (if 'other' is selected) -->
            <div v-if="change.changed_field === 'other'">
              <label :for="'other_description_' + index" class="block text-sm font-medium text-gray-700 required">
                Description of Change
              </label>
              <input
                type="text"
                :id="'other_description_' + index"
                v-model="change.other_description"
                required
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2"
              />
            </div>
          </div>
          <button
            type="button"
            @click="removeChangeDetail(index)"
            class="mt-2 text-red-600 hover:text-red-800"
          >
            Remove Change
          </button>
        </div>
        <button
          type="button"
          @click="addChangeDetail"
          class="mt-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-secondary"
        >
          Add Change Detail
        </button>
      </div>

      <!-- Personal Information Section -->
      <div class="bg-white border p-6 rounded-lg shadow-sm">
        <h3 class="text-xl font-semibold mb-4 text-gray-900">Personal Information</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- CID No. -->
          <div>
            <label for="cid" class="block text-sm font-medium text-gray-700">CID No.</label>
            <input
              type="text"
              id="cid"
              v-model="form.cid_no"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2"
            />
          </div>

          <!-- Full Name -->
          <div>
            <label for="full_name" class="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              id="full_name"
              v-model="form.applicants_name"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2"
            />
          </div>

          <!-- Date of Birth -->
          <div>
            <label for="date_of_birth" class="block text-sm font-medium text-gray-700"
              >Date of Birth</label
            >
            <input
              type="text"
              id="date_of_birth"
              v-model="form.date_of_birth"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2"
            />
          </div>

          <!-- Contact Number -->
          <div>
            <label for="contact_number" class="block text-sm font-medium text-gray-700 required"
              >Contact Number</label
            >
            <input
              type="tel"
              id="contact_number"
              v-model="form.contact_no"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2"
            />
          </div>

          <!-- Email Address -->
          <div>
            <label for="email_address" class="block text-sm font-medium text-gray-700"
              >Email Address</label
            >
            <input
              type="email"
              id="email_address"
              v-model="form.email_address"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2"
            />
          </div>

          <!-- Gender -->
          <div>
            <label for="gender" class="block text-sm font-medium text-gray-700">Gender</label>
            <input
              type="text"
              id="gender"
              v-model="form.gender"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2"
            />
          </div>

          <!-- Dzongkhag -->
          <div>
            <label for="dzongkhag" class="block text-sm font-medium text-gray-700">Dzongkhag</label>
            <input
              type="text"
              id="dzongkhag"
              v-model="form.dzongkhag"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2"
            />
          </div>

          <!-- Gewog -->
          <div>
            <label for="gewog" class="block text-sm font-medium text-gray-700">Gewog</label>
            <input
              type="text"
              id="gewog"
              v-model="form.gewog"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2"
            />
          </div>

          <!-- Village -->
          <div>
            <label for="village" class="block text-sm font-medium text-gray-700">Village</label>
            <input
              type="text"
              id="village"
              v-model="form.village"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2"
            />
          </div>
        </div>
      </div>

      <!-- Education Details Section -->
      <div class="bg-white border p-6 rounded-lg shadow-sm">
        <h3 class="text-xl font-semibold mb-4 text-gray-900">Education Details</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- From in-country? -->
          <div>
            <label class="block text-sm font-medium text-gray-700 required">From in-country?</label>
            <div class="mt-2 space-x-4">
              <label class="inline-flex items-center">
                <input
                  type="radio"
                  v-model="form.from_in_country"
                  :value="true"
                  required
                  class="form-radio text-primary"
                />
                <span class="ml-2">Yes</span>
              </label>
              <label class="inline-flex items-center">
                <input
                  type="radio"
                  v-model="form.from_in_country"
                  :value="false"
                  required
                  class="form-radio text-primary"
                />
                <span class="ml-2">No</span>
              </label>
            </div>
          </div>

          <!-- Course Title -->
          <div>
            <label for="course_title" class="block text-sm font-medium text-gray-700 required"
              >Course Title</label
            >
            <input
              type="text"
              id="course_title"
              v-model="form.course_title"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2"
            />
          </div>

          <!-- Qualification Dropdown -->
          <div>
            <label for="qualification" class="block text-sm font-medium text-gray-700 required"
              >Qualification</label
            >
            <select id="qualification" v-model="form.qualification" required>
              <option value="" disabled>Select Qualification</option>
              <option v-for="qual in qualificationOptions" :key="qual.value" :value="qual.value">
                {{ qual.label }}
              </option>
            </select>
          </div>

          <!-- Type of Course Dropdown -->
          <div>
            <label for="type_of_course" class="block text-sm font-medium text-gray-700 required"
              >Type of Course</label
            >
            <select id="type_of_course" v-model="form.type_of_course" required>
              <option value="" disabled>Select Course Type</option>
              <option v-for="type in courseTypeOptions" :key="type.value" :value="type.value">
                {{ type.label }}
              </option>
            </select>
          </div>

          <!-- Duration of Course -->
          <div>
            <label for="duration_of_course" class="block text-sm font-medium text-gray-700 required"
              >Duration of Course (Years)</label
            >
            <input
              type="number"
              id="duration_of_course"
              v-model="form.duration_of_course"
              min="1"
              max="10"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2"
            />
          </div>

          <!-- Name of Institute -->
          <div>
            <label for="name_of_institute" class="block text-sm font-medium text-gray-700 required"
              >Name of Institute</label
            >
            <input
              type="text"
              id="name_of_institute"
              v-model="form.name_of_institute"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2"
            />
          </div>

          <!-- Name of University -->
          <div>
            <label for="name_of_university" class="block text-sm font-medium text-gray-700 required"
              >Name of University</label
            >
            <input
              type="text"
              id="name_of_university"
              v-model="form.name_of_university"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2"
            />
          </div>

          <!-- Student ID No. -->
          <div>
            <label for="student_id_no" class="block text-sm font-medium text-gray-700 required"
              >Student ID No.</label
            >
            <input
              type="text"
              id="student_id_no"
              v-model="form.student_id_no"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2"
            />
          </div>

          <!-- Year of Completion -->
          <div>
            <label for="year_of_completion" class="block text-sm font-medium text-gray-700 required"
              >Year of Completion</label
            >
            <input
              type="number"
              id="year_of_completion"
              v-model="form.year_of_completion"
              :min="minYear"
              :max="currentYear"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2"
            />
          </div>

          <!-- Website -->
          <div>
            <label for="website" class="block text-sm font-medium text-gray-700">Website</label>
            <input
              type="url"
              id="website"
              v-model="form.website"
              placeholder="https://"
              pattern="https?://.+"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2"
            />
          </div>

          <!-- Location -->
          <div>
            <label for="location" class="block text-sm font-medium text-gray-700 required"
              >Location</label
            >
            <input
              type="text"
              id="location"
              v-model="form.location"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2"
            />
          </div>

          <!-- Country -->
          <div>
            <label for="country" class="block text-sm font-medium text-gray-700 required"
              >Country</label
            >
            <input
              type="text"
              id="country"
              v-model="form.country"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2"
            />
          </div>
        </div>
      </div>

      <!-- Reason for Second Copy -->
      <div class="bg-white border p-6 rounded-lg shadow-sm">
        <h3 class="text-xl font-semibold mb-4 text-gray-900">Reason for Second Copy</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Reason for Issue of Second Copy -->
          <div>
            <label
              for="reason_for_second_copy"
              class="block text-sm font-medium text-gray-700 required"
              >Reason</label
            >
            <select
              id="reason_for_second_copy"
              v-model="form.reason_for_issue_of_second_copy"
              required
            >
              <option value="" disabled>Select a reason</option>
              <option v-for="reason in reasonsForSecondCopy" :key="reason.id" :value="reason.id">
                {{ reason.name }}
              </option>
            </select>
          </div>

          <!-- Other Specify -->
          <div v-if="form.reason_for_issue_of_second_copy === othersReasonId">
            <label for="other_specify" class="block text-sm font-medium text-gray-700 required"
              >Other (Specify)</label
            >
            <input
              type="text"
              id="other_specify"
              v-model="form.second_copy_other"
              required
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2"
            />
          </div>
        </div>
      </div>

      <!-- Supporting Document for Second Copy -->
      <div class="bg-white border p-6 rounded-lg shadow-sm">
        <h3 class="text-xl font-semibold mb-4 text-gray-900">Supporting Document</h3>
        <div>
          <label class="block text-sm font-medium text-gray-700 required"
            >Upload Supporting Document</label
          >
          <FileUpload
            v-model="form.second_copy_supporting_document"
            accept=".pdf"
            :max-size="5"
            required
          />
          <p class="mt-1 text-sm text-gray-500">PDF only, max 5MB</p>
        </div>
      </div>

      <!-- Declaration -->
      <div class="bg-white border p-6 rounded-lg shadow-sm space-y-6">
        <div class="flex items-start">
          <div class="flex items-center h-5">
            <input
              type="checkbox"
              id="declaration"
              v-model="declaration"
              required
              class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
          </div>
          <div class="ml-3 text-sm">
            <label for="declaration" class="font-medium text-gray-700">Declaration</label>
            <p class="text-gray-500">
              I declare that all the information provided is true and accurate to the best of my
              knowledge.
            </p>
          </div>
        </div>
      </div>

      <!-- Form Actions -->
      <div class="flex justify-end space-x-4">
        <button
          type="button"
          @click="$emit('close-modal')"
          class="px-6 py-3 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          Cancel
        </button>
        <button
          type="button"
          @click="handleSubmit"
          :disabled="isSubmitting || !declaration"
          class="px-6 py-3 bg-primary text-white rounded-md hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ isSubmitting ? 'Submitting...' : 'Submit' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import apiService from '@/services/services'
import FileUpload from '@/components/common/FileUpload.vue'
import { useToast } from 'vue-toastification'
import PaymentModal from '@/components/common/PaymentModal.vue'

const authStore = useAuthStore()
const { user } = useAuthStore()
const toast = useToast()

const originalApplications = ref([])
const filteredApplications = ref([])
const searchQuery = ref('')
const selectedOriginalApplication = ref(null)
const reasonsForSecondCopy = ref([])
const othersReasonId = ref(null)
const qualificationOptions = ref([])
const courseTypeOptions = ref([])
const isSubmitting = ref(false)
const declaration = ref(false)
const currentYear = new Date().getFullYear()
const minYear = currentYear - 50

const userCid = user.cid

// Define available fields for change details
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
  change_details_input: [], // Array to store change details
})

const paymentModal = ref(null)

const openPaymentModal = () => {
  paymentModal.value.openModal()
}

const onPaymentModalClose = () => {
  console.log('Payment modal closed')
}

const onPaymentCompleted = (paymentData) => {
  form.is_payment_complete = false
  form.payment_id = paymentData.paymentHash
  form.status = 'processing_payment'
  handleSubmitActual()
}

// Add a new change detail entry
const addChangeDetail = () => {
  form.change_details_input.push({
    changed_field: '',
    old_value: '',
    new_value: '',
    other_description: ''
  })
}

// Remove a change detail entry
const removeChangeDetail = (index) => {
  form.change_details_input.splice(index, 1)
}

// Fetch original applications and other data
onMounted(async () => {
  try {
    const [applicationsResponse, reasonsResponse, qualificationsResponse, courseTypesResponse] =
      await Promise.all([
        apiService.getRecognitionOfQualification(userCid),
        apiService.getReasonsForIssueOfSecondCopy(),
        apiService.getQualifications(),
        apiService.getTypesOfCourse(),
      ])

    originalApplications.value = applicationsResponse.data.filter(
      (app) => app.status === 'approved' && !app.is_second_copy,
    )

    reasonsForSecondCopy.value = reasonsResponse.data.results

    const othersReason = reasonsForSecondCopy.value.find(
      (reason) => reason.name.toLowerCase() === 'others',
    )
    if (othersReason) {
      othersReasonId.value = othersReason.id
    }

    qualificationOptions.value = qualificationsResponse.data.results.map((qual) => ({
      value: qual.id,
      label: qual.name,
    }))

    courseTypeOptions.value = courseTypesResponse.data.results.map((type) => ({
      value: type.id,
      label: type.name,
    }))
  } catch (error) {
    toast.error('Failed to fetch data')
    console.error('Error fetching data:', error)
  }
})

const onSearchInput = () => {
  if (searchQuery.value) {
    filteredApplications.value = originalApplications.value.filter(
      (app) =>
        (app.applicants_name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
          app.cid_no.toLowerCase().includes(searchQuery.value.toLowerCase())) &&
        app.status === 'approved' &&
        !app.is_second_copy,
    )
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
    ...(app.qualification && { qualification: app.qualification.id }),
    ...(app.type_of_course && { type_of_course: app.type_of_course.id }),
    change_details_input: [], // Reset change details on new selection
  })
  searchQuery.value = ''
  filteredApplications.value = []
}

const handleSubmit = () => {
  // --- START VALIDATION ---
  if (!selectedOriginalApplication.value) {
    toast.error('Please select an original application first.')
    return
  }
  if (!form.reason_for_issue_of_second_copy) {
    toast.error('Please select a reason for the second copy.')
    return
  }
  if (!form.qualification) {
    toast.error('Please select a qualification.')
    return
  }
  if (!form.type_of_course) {
    toast.error('Please select the type of course.')
    return
  }
  if (!form.second_copy_supporting_document) {
    toast.error('Please upload a supporting document.')
    return
  }
  if (form.change_details_input.length === 0) {
    toast.error('Please add at least one change detail.')
    return
  }
  for (let i = 0; i < form.change_details_input.length; i++) {
    const change = form.change_details_input[i]
    if (!change.changed_field) {
      toast.error(`Please select a changed field for change detail #${i + 1}.`)
      return
    }
    if (!change.old_value) {
      toast.error(`Please provide the old value for change detail #${i + 1}.`)
      return
    }
    if (!change.new_value) {
      toast.error(`Please provide the new value for change detail #${i + 1}.`)
      return
    }
    if (change.changed_field === 'other' && !change.other_description) {
      toast.error(`Please provide a description for 'Other' change detail #${i + 1}.`)
      return
    }
  }
  if (!declaration.value) {
    toast.error('Please accept the declaration.')
    return
  }
  // --- END VALIDATION ---
  openPaymentModal()
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return dateString
  }
  const date = new Date(dateString)
  if (isNaN(date.getTime())) {
    console.error('Invalid date:', dateString)
    return ''
  }
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const handleSubmitActual = async () => {
  isSubmitting.value = true

  try {
    if (!selectedOriginalApplication.value) {
      toast.error('Please select an original application')
      isSubmitting.value = false
      return
    }

    const formData = new FormData()

    formData.append('original_application_id', selectedOriginalApplication.value.id)
    formData.append('is_second_copy', 'true')

    // Append change details with array indexing
    form.change_details_input.forEach((change, index) => {
      // Trim values to prevent whitespace issues
      const changedField = (change.changed_field || '').trim()
      const oldValue = (change.old_value || '').trim()
      const newValue = (change.new_value || '').trim()
      const otherDescription = (change.other_description || '').trim()

      if (!changedField || !oldValue || !newValue) {
        throw new Error(`Invalid change detail at index ${index}: All fields must be non-empty`)
      }

      formData.append(`change_details_input[${index}][changed_field]`, changedField)
      formData.append(`change_details_input[${index}][old_value]`, oldValue)
      formData.append(`change_details_input[${index}][new_value]`, newValue)
      if (otherDescription) {
        formData.append(`change_details_input[${index}][other_description]`, otherDescription)
      }
    })

    // Payment Request
    const paymentData = {
      platform: 'web',
      refNo: form.payment_id,
      taxPayerNo: form.cid_no,
      taxPayerDocumentNo: 'BAOW',
      payerEmail: form.email_address,
      mobileNo: form.contact_no,
      totalPayableAmount: 100.0, // Matches BIRMS payload
      serviceCode: '100193',
      description: 'Payment for Second Copy ROQ',
      payableAmount: 100.0,
      taxPayerName: form.applicants_name,
      application_no: form.payment_id,
      app_type: 'ROQ',
      user_id: authStore.userId,
    }

    // Log FormData for debugging
    console.log('FormData contents:');
    for (const [key, value] of formData.entries()) {
      console.log(`${key}: ${value} (type: ${typeof value})`);
    }

    try {
      const paymentResponse = await apiService.makePayment(paymentData)
      if (paymentResponse.status !== 201 && paymentResponse.status !== 200) {
        throw new Error('Payment request failed')
      }
      const receivedAmount = paymentResponse.data.content.totalPayableAmount
      if (receivedAmount !== 100.0) {
        throw new Error(`Unexpected payment amount: ${receivedAmount}`)
      }
      console.log('Payment response:', paymentResponse.data)
    } catch (paymentError) {
      console.error('Error making payment:', paymentError)
      toast.error(
        'Payment request failed: ' + (paymentError.response?.data?.message || paymentError.message),
      )
      isSubmitting.value = false
      return
    }

    // Append other form fields
    for (const key in form) {
      if (key === 'change_details_input') continue
      if (Object.prototype.hasOwnProperty.call(form, key)) {
        let value = form[key]
        if (value instanceof File) {
          formData.append(key, value)
        } else if (key === 'date_of_birth') {
          formData.append(key, formatDate(value))
        } else if (typeof value === 'boolean') {
          formData.append(key, value.toString())
        } else if (value !== null && value !== undefined) {
          formData.append(key, value.toString())
        }
      }
    }

    const response = await apiService.createRecognitionOfQualification(formData)
    if (response.status === 201) {
      toast.success(
        'Second copy application submitted successfully. Please check your email to complete the payment.',
      )
      emit('application-submitted')
    }
  } catch (error) {
    toast.error('Failed to submit application: ' + (error.response?.data?.message || error.message))
    console.error('Error submitting application:', error)
  } finally {
    isSubmitting.value = false
  }
}

const emit = defineEmits(['application-submitted', 'close-modal'])
</script>
