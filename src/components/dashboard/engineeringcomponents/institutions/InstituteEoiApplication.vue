<template>
  <div v-if="showForm" class="min-h-screen bg-gray-50 py-8">
    <div class="mx-auto px-4">
      <div class="bg-white rounded-lg shadow-lg p-6 md:p-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-6 text-center">
          Application for Expression of Interest
        </h1>

        <form @submit.prevent="handleSubmit" class="space-y-8">
          <!-- Applicant Information -->
          <div class="space-y-8 pb-6 border-b border-gray-100">
            <h2 class="text-xl font-semibold text-gray-900 mb-10">Applicant Information</h2>
            <div class="grid gap-6 md:grid-cols-2">
              <div>
                <label
                  for="CID"
                  class="block text-sm font-medium text-gray-700 mb-1 required-label"
                >
                  CID.
                </label>
                <input
                  type="text"
                  id="CID"
                  v-model="formData.CID"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 bg-gray-100"
                  readonly
                />
              </div>
              <div>
                <label
                  for="full_name"
                  class="block text-sm font-medium text-gray-700 mb-1 required-label"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="full_name"
                  v-model.trim="formData.full_name"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
                />
              </div>
              <div>
                <label
                  for="gender"
                  class="block text-sm font-medium text-gray-700 mb-1 required-label"
                >
                  Gender
                </label>
                <select
                  id="gender"
                  v-model="formData.gender"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
                >
                  <option value="">Select Gender</option>
                  <option v-for="option in genderOptions" :key="option.value" :value="option.value">
                    {{ option.label }}
                  </option>
                </select>
              </div>
              <div>
                <label
                  for="contact_no"
                  class="block text-sm font-medium text-gray-700 mb-1 required-label"
                >
                  Contact Number
                </label>
                <input
                  type="tel"
                  id="contact_no"
                  v-model.trim="formData.contact_no"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
                />
              </div>
              <div>
                <label
                  for="email_address"
                  class="block text-sm font-medium text-gray-700 mb-1 required-label"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email_address"
                  v-model.trim="formData.email_address"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
                />
              </div>
            </div>
          </div>

          <!-- Institution Details -->
          <div class="space-y-8 pb-6 border-b border-gray-100">
            <h2 class="text-xl font-semibold text-gray-900 mb-10">Institution Details</h2>
            <div class="grid gap-6 md:grid-cols-2">
              <div class="col-span-2">
                <label
                  for="name_of_institution"
                  class="block text-sm font-medium text-gray-700 mb-1 required-label"
                >
                  Name of Institution
                </label>
                <input
                  type="text"
                  id="name_of_institution"
                  v-model.trim="formData.name_of_institution"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
                />
              </div>
              <div>
                <label
                  for="dzongkhag"
                  class="block text-sm font-medium text-gray-700 mb-1 required-label"
                >
                  Dzongkhag
                </label>
                <select
                  id="dzongkhag"
                  v-model="formData.dzongkhag"
                  @change="handleDzongkhagChange"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
                >
                  <option value="">Select Dzongkhag</option>
                  <option
                    v-for="d in bhutanDzongkhagsGewogs"
                    :key="d.dzongkhag"
                    :value="d.dzongkhag"
                  >
                    {{ d.dzongkhag }}
                  </option>
                </select>
              </div>
              <div>
                <label
                  for="gewog"
                  class="block text-sm font-medium text-gray-700 mb-1 required-label"
                >
                  Gewog
                </label>
                <select
                  id="gewog"
                  v-model="formData.gewog"
                  :disabled="!formData.dzongkhag"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">Select Gewog</option>
                  <option v-for="g in availableGewogs" :key="g" :value="g">
                    {{ g }}
                  </option>
                </select>
              </div>
              <div>
                <label
                  for="village"
                  class="block text-sm font-medium text-gray-700 mb-1 required-label"
                >
                  Village
                </label>
                <input
                  type="text"
                  id="village"
                  v-model.trim="formData.village"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
                />
              </div>
              <div>
                <label
                  for="chiwog"
                  class="block text-sm font-medium text-gray-700 mb-1 required-label"
                >
                  Chiwog
                </label>
                <input
                  type="text"
                  id="chiwog"
                  v-model.trim="formData.chiwog"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
                />
              </div>
              <div class="col-span-2">
                <label
                  for="address"
                  class="block text-sm font-medium text-gray-700 mb-1 required-label"
                >
                  Address
                </label>
                <textarea
                  id="address"
                  v-model.trim="formData.address"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 resize-none px-3 py-2"
                  rows="3"
                ></textarea>
              </div>
              <div>
                <label
                  for="teaching_institute"
                  class="block text-sm font-medium text-gray-700 mb-1"
                >
                  Training Institute Name, Engineering Institution (If different from above)
                </label>
                <input
                  type="text"
                  id="teaching_institute"
                  v-model.trim="formData.teaching_institute"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
                />
              </div>
              <div>
                <label for="website" class="block text-sm font-medium text-gray-700 mb-1">
                  Website
                </label>
                <input
                  type="url"
                  id="website"
                  v-model.trim="formData.website"
                  placeholder="https://example.com"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
                />
              </div>
              <div>
                <label
                  for="country"
                  class="block text-sm font-medium text-gray-700 mb-1 required-label"
                >
                  Country
                </label>
                <select
                  id="country"
                  v-model="formData.country"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
                >
                  <option value="">Select Country</option>
                  <option v-for="c in countryData" :key="c.code" :value="c.name">
                    {{ c.name }}
                  </option>
                </select>
              </div>
            </div>
          </div>

          <!-- Course Details -->
          <div class="space-y-8 pb-6 border-b border-gray-100">
            <h2 class="text-xl font-semibold text-gray-900 mb-10">Course Details</h2>
            <div class="grid gap-6 md:grid-cols-2">
              <div class="col-span-2">
                <label
                  for="title_of_course"
                  class="block text-sm font-medium text-gray-700 mb-1 required-label"
                >
                  Title of Course
                </label>
                <input
                  type="text"
                  id="title_of_course"
                  v-model.trim="formData.title_of_course"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
                />
              </div>
              <div>
                <label
                  for="course_duration"
                  class="block text-sm font-medium text-gray-700 mb-1 required-label"
                >
                  Course Duration (in months)
                </label>
                <input
                  type="number"
                  id="course_duration"
                  v-model="formData.course_duration"
                  min="1"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
                />
              </div>
              <div>
                <label
                  for="commencement_date"
                  class="block text-sm font-medium text-gray-700 mb-1 required-label"
                >
                  Proposed Commencement Date
                </label>
                <input
                  type="date"
                  id="commencement_date"
                  v-model="formData.commencement_date"
                  :min="todayDate"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
                />
              </div>
              <div class="col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-3 required-label">
                  Type of Program
                </label>
                <div class="flex items-center space-x-6">
                  <label
                    v-for="option in programTypeOptions"
                    :key="option.value"
                    class="flex items-center"
                  >
                    <input
                      type="radio"
                      :value="option.value"
                      v-model="formData.type_of_programme"
                      class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span class="ml-2 text-sm text-gray-700">{{ option.label }}</span>
                  </label>
                </div>
              </div>
              <div class="col-span-2">
                <label
                  for="supporting_documents"
                  class="block text-sm font-medium text-gray-700 mb-1 required-label"
                >
                  Supporting Documents (e.g., Curriculum Outline, if available)
                </label>
                <input
                  type="file"
                  id="supporting_documents"
                  @change="(e) => handleFileUpload(e, 'supporting_documents')"
                  accept=".pdf,.doc,.docx"
                  class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <p class="mt-1 text-xs text-gray-500">PDF, DOC, DOCX files allowed.</p>
              </div>
              <div class="col-span-2">
                <label for="remarks" class="block text-sm font-medium text-gray-700 mb-1">
                  Remarks (Optional)
                </label>
                <textarea
                  id="remarks"
                  v-model="formData.remarks"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 resize-none px-3 py-2"
                  rows="3"
                ></textarea>
              </div>
            </div>
          </div>

          <!-- Head of Institution Details -->
          <div class="space-y-8 pb-6 border-b border-gray-100">
            <h2 class="text-xl font-semibold text-gray-900 mb-10">Head of Institution Details</h2>
            <div class="grid gap-6 md:grid-cols-2">
              <div>
                <label
                  for="head_of_institution_name"
                  class="block text-sm font-medium text-gray-700 mb-1 required-label"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="head_of_institution_name"
                  v-model.trim="formData.head_of_institution_name"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
                />
              </div>
              <div>
                <label
                  for="head_of_institution_gender"
                  class="block text-sm font-medium text-gray-700 mb-1 required-label"
                >
                  Gender
                </label>
                <select
                  id="head_of_institution_gender"
                  v-model="formData.head_of_institution_gender"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
                >
                  <option value="">Select Gender</option>
                  <option v-for="option in genderOptions" :key="option.value" :value="option.value">
                    {{ option.label }}
                  </option>
                </select>
              </div>
              <div>
                <label
                  for="head_of_institution_phone_number"
                  class="block text-sm font-medium text-gray-700 mb-1 required-label"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="head_of_institution_phone_number"
                  v-model.trim="formData.head_of_institution_phone_number"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
                />
              </div>
              <div>
                <label
                  for="head_of_institution_email"
                  class="block text-sm font-medium text-gray-700 mb-1 required-label"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="head_of_institution_email"
                  v-model.trim="formData.head_of_institution_email"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2"
                />
              </div>
            </div>
          </div>

          <!-- Declaration -->
          <div class="space-y-6 pb-6 border-b border-gray-100">
            <div class="bg-gray-50 rounded-lg p-4">
              <h2 class="text-xl font-semibold text-gray-900 mb-3 required-label">Declaration</h2>
              <div class="space-y-4">
                <p class="text-sm text-gray-700">
                  I/We certify that the information provided in this application is true, complete,
                  and accurate to the best of my knowledge. I realize that any false, fictitious, or
                  fraudulent statements may be subjected to administrative penalties. I am fully
                  aware and understand the process and requirements of relevant agencies.
                </p>
                <div class="flex items-center">
                  <input
                    type="checkbox"
                    id="declaration"
                    v-model="formData.declaration"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label for="declaration" class="ml-3 block text-sm font-medium text-gray-700">
                    I agree to the above declaration <span class="text-red-600">*</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- Form Actions -->
          <div class="flex justify-end gap-4 pt-6">
            <button
              type="button"
              @click="saveDraft"
              :disabled="isSubmitting"
              class="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50"
            >
              Save as Draft
            </button>
            <button
              type="submit"
              :disabled="isSubmitting || !formData.declaration"
              class="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ isSubmitting ? 'Submitting...' : 'Submit Application' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  <div v-else class="min-h-screen flex items-center justify-center">
    <div class="bg-white rounded-lg shadow-lg p-8 text-center">
      <h2 class="text-2xl font-bold text-green-700 mb-4">Application Already Approved</h2>
      <p class="text-gray-700">
        You have already submitted and your application is approved. You cannot submit again.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import apiService from '@/services/services'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '@/stores/authStore'
import { countryData } from '@/constants/countries.js'
import { bhutanDzongkhagsGewogs } from '@/constants/dzongkhags.js'

const router = useRouter()
const toast = useToast()
const authStore = useAuthStore()
const availableGewogs = ref([])
const showForm = ref(true)
const existingApplication = ref(null)

const todayDate = computed(() => {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
})

const formData = ref({
  // Basic Information
  CID: '',
  full_name: '',
  gender: '',
  contact_no: '',
  email_address: '',

  // Institution Details
  name_of_institution: '',
  country: 'Bhutan',
  gewog: '',
  dzongkhag: '',
  village: '',
  address: '',
  chiwog: '',
  teaching_institute: '',
  website: '',

  // Course Details
  title_of_course: '',
  course_duration: '',
  commencement_date: '',
  type_of_programme: '',
  supporting_documents: null,
  remarks: '',

  // Head of Institution Details
  head_of_institution_name: '',
  head_of_institution_gender: '',
  head_of_institution_phone_number: '',
  head_of_institution_email: '',

  // DPR related fields
  dpr_name: '',
  executive_summary: '',
  institute_eoi_supporting_documents: null,
  institute_dpr_remarks: '',
  do_dpr_review_report: '',
  do_dpr_review_summary: '',
  do_dpr_report: null,
  do_dpr_review_decision: 'Pending',
  do_dpr_reason_if_rejected: '',

  declaration: '',

  review_decision: 'Pending',
  reason_if_rejected: '',
})

const handleDzongkhagChange = () => {
  const selectedDzongkhag = bhutanDzongkhagsGewogs.find(
    (d) => d.dzongkhag === formData.value.dzongkhag
  )
  availableGewogs.value = selectedDzongkhag ? selectedDzongkhag.gewogs : []
  formData.value.gewog = ''
}

const isSubmitting = ref(false)

const genderOptions = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'others', label: 'Others' },
]

const programTypeOptions = [
  { value: 'D', label: 'Diploma' },
  { value: 'B', label: 'Bachelor' },
]
const handleFileUpload = (event, fieldName) => {
  const file = event.target.files[0]
  formData.value[fieldName] = file || null
}

const validateForm = () => {
  const requiredFields = [
    { field: 'full_name', label: 'Full Name' },
    { field: 'gender', label: 'Gender' },
    { field: 'contact_no', label: 'Contact Number' },
    { field: 'email_address', label: 'Email Address' },
    { field: 'name_of_institution', label: 'Name of Institution' },
    { field: 'dzongkhag', label: 'Dzongkhag' },
    { field: 'address', label: 'Address' },
    { field: 'title_of_course', label: 'Title of Course' },
    { field: 'course_duration', label: 'Course Duration' },
    { field: 'commencement_date', label: 'Commencement Date' },
    { field: 'type_of_programme', label: 'Type of Program' },
    { field: 'head_of_institution_name', label: 'Head of Institution Name' },
    { field: 'head_of_institution_gender', label: 'Head of Institution Gender' },
    { field: 'head_of_institution_phone_number', label: 'Head of Institution Phone Number' },
    { field: 'head_of_institution_email', label: 'Head of Institution Email' },
    { field: 'country', label: 'Country' },
  ]

  for (const { field, label } of requiredFields) {
    const value = formData.value[field]
    if (
      value === null ||
      value === undefined ||
      (typeof value === 'string' && value.trim() === '')
    ) {
      toast.error(`${label} is required.`)
      return false
    }
  }
  const duration = Number(formData.value.course_duration)
  if (!Number.isInteger(duration) || duration <= 0) {
    toast.error('Course Duration must be a positive integer (in months).')
    return false
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(formData.value.email_address)) {
    toast.error('Please enter a valid Email Address.')
    return false
  }
  if (!emailRegex.test(formData.value.head_of_institution_email)) {
    toast.error('Please enter a valid Head of Institution Email.')
    return false
  }
  if (new Date(formData.value.commencement_date) < new Date(todayDate.value)) {
    toast.error('Commencement Date cannot be in the past.')
    return false
  }

  return true
}

const handleSubmit = async () => {
  if (!authStore.user || !authStore.user.cid) {
    toast.error('User authentication error. Please log in again.', { timeout: 5000 })
    return
  }
  formData.value.CID = authStore.user.cid

  if (!formData.value.declaration) {
    toast.warning('Please agree to the declaration before submitting.', { timeout: 4000 })
    return
  }
  if (!validateForm()) {
    return
  }

  isSubmitting.value = true
  const submitData = new FormData()

  Object.keys(formData.value).forEach((key) => {
    const value = formData.value[key]
    if (key === 'review_decision' || key === 'reason_if_rejected') {
      return
    }

    if (key === 'declaration') {
      submitData.append('declaration', value ? 'true' : 'false')
    } else if (value instanceof File) {
      submitData.append(key, value, value.name)
    } else if (key === 'course_duration') {
      const duration = Number(value)
      if (!isNaN(duration) && duration > 0) {
        submitData.append(key, String(duration))
      } else {
        submitData.append(key, '')
      }
    } else if (value !== null && value !== undefined) {
      submitData.append(key, String(value).trim())
    } else {
      submitData.append(key, '')
    }
  })

  console.log('Submitting FormData:')
  for (let pair of submitData.entries()) {
    console.log(`${pair[0]}: ${pair[1]}`)
  }

  try {
    const response = await apiService.createEpcInstitute(submitData)
    if (response.data) {
      toast.success('Expression of Interest submitted successfully!')
      clearDraft()
      setTimeout(() => {
        router.push('/admin/institutions/engineering_certification/dashboard')
      }, 1500)
    } else {
      toast.warning('Submission received, but confirmation unclear. Please check status later.')
    }
  } catch (error) {
    console.error('Error submitting EOI form:', error)
    let message = 'Error submitting application. Please try again.'
    if (error.response?.data) {
      if (
        typeof error.response.data === 'string' &&
        error.response.data.includes('<!DOCTYPE html>')
      ) {
        message = 'Server returned an unexpected HTML error page. Please contact support.'
      } else if (error.response.data.error) {
        message = `Submission Failed: ${error.response.data.error}`
      } else if (typeof error.response.data === 'object') {
        const errors = Object.entries(error.response.data)
          .map(
            ([field, messages]) =>
              `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`
          )
          .join('; ')
        message = `Submission Failed: ${errors || 'Please check your inputs.'}`
      } else {
        message = `Submission Failed: ${JSON.stringify(error.response.data)}`
      }
    } else if (error.request) {
      message = 'Submission Failed: No response received from server. Check network connection.'
    } else if (error.message) {
      message = `Submission Failed: ${error.message}`
    }
    toast.error(message, { timeout: 7000 })
  } finally {
    isSubmitting.value = false
  }
}

const saveDraft = () => {
  const draftData = { ...formData.value }
  ;['supporting_documents', 'institute_eoi_supporting_documents', 'do_dpr_report'].forEach(
    (key) => {
      if (draftData[key] instanceof File) {
        draftData[key] = { name: draftData[key].name, type: draftData[key].type }
      } else {
        draftData[key] = null
      }
    }
  )
  localStorage.setItem('epcEoiFormDraft', JSON.stringify(draftData))
  toast.success('Draft saved successfully!')
}

const clearDraft = () => {
  localStorage.removeItem('epcEoiFormDraft')
}

onMounted(async () => {
  if (authStore.user?.cid) {
    formData.value.CID = authStore.user.cid

    try {
      const response = await apiService.getEpcInstitutes()
      const applications = response.data.results
      if (!Array.isArray(applications)) {
        throw new Error("API response did not contain a 'results' array.")
      }
      const userApplication = applications.find((app) => app.CID === authStore.user.cid)
      if (userApplication) {
        existingApplication.value = userApplication
        if (
          userApplication.review_decision &&
          userApplication.review_decision.toLowerCase() === 'approved'
        ) {
          showForm.value = false
          toast.info('Your application has already been approved.')
        } else {
          showForm.value = true
        }
      } else {
        showForm.value = true
      }
    } catch (err) {
      console.error('Error fetching EOI applications:', err)
      toast.error('Could not check your application status. Please try again later.')
      showForm.value = true
    }
  } else {
    console.error('User CID not found in auth store on mount.')
    toast.error('Could not retrieve user information. Please log in again.', { timeout: 5000 })
  }

  const savedDraft = localStorage.getItem('epcEoiFormDraft')
  if (savedDraft) {
    try {
      const parsedDraft = JSON.parse(savedDraft)
      Object.keys(parsedDraft).forEach((key) => {
        if (key !== 'CID' && Object.prototype.hasOwnProperty.call(formData.value, key)) {
          if (
            ![
              'supporting_documents',
              'institute_eoi_supporting_documents',
              'do_dpr_report',
            ].includes(key)
          ) {
            formData.value[key] = parsedDraft[key]
          } else {
            formData.value[key] = null
          }
        }
      })

      if (formData.value.dzongkhag) {
        const selectedDzongkhag = bhutanDzongkhagsGewogs.find(
          (d) => d.dzongkhag === formData.value.dzongkhag
        )
        availableGewogs.value = selectedDzongkhag ? selectedDzongkhag.gewogs : []
      }
      toast.info('Draft loaded. Please re-select any required files.')
    } catch (error) {
      console.error('Error loading draft:', error)
      clearDraft()
    }
  }
})
</script>

<style scoped>
.required-label::after {
  content: ' *';
  color: #dc2626;
  margin-left: 2px;
}
</style>
