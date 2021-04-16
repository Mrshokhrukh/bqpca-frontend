<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="mx-auto px-4">
      <div class="bg-white rounded-lg shadow-lg p-6 md:p-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-6 text-center">
          Application for Expression of Interest
        </h1>

        <form @submit.prevent="handleSubmit" class="space-y-8">
          <div class="space-y-8 pb-6 border-b border-gray-100">
            <h2 class="text-xl font-semibold text-gray-900 mb-10">Basic Information</h2>
            <div class="grid gap-6 md:grid-cols-2">
              <div>
                <label for="CID" class="block text-sm font-medium text-gray-700 mb-1 required-label">
                  CID Number (Auto-filled)
                </label>
                <input type="text" id="CID" v-model="formData.CID"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2 bg-gray-100"
                  readonly />
              </div>

              <div>
                <label for="full_name" class="block text-sm font-medium text-gray-700 mb-1 required-label">
                  Full Name
                </label>
                <input type="text" id="full_name" v-model="formData.full_name"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2" />
              </div>

              <div>
                <label for="gender" class="block text-sm font-medium text-gray-700 mb-1 required-label">
                  Gender
                </label>
                <select id="gender" v-model="formData.gender"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2">
                  <option value="">Select Gender</option>
                  <option v-for="option in genderOptions" :key="option.value" :value="option.value">
                    {{ option.label }}
                  </option>
                </select>
              </div>

              <div>
                <label for="contact_no" class="block text-sm font-medium text-gray-700 mb-1 required-label">
                  Contact Number
                </label>
                <input type="tel" id="contact_no" v-model="formData.contact_no"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2" />
              </div>

              <div>
                <label for="email_address" class="block text-sm font-medium text-gray-700 mb-1 required-label">
                  Email Address
                </label>
                <input type="email" id="email_address" v-model="formData.email_address"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2" />
              </div>
            </div>
          </div>

          <div class="space-y-8 pb-6 border-b border-gray-100">
            <h2 class="text-xl font-semibold text-gray-900 mb-10">Institution Details</h2>
            <div class="grid gap-6 md:grid-cols-2">
              <div class="col-span-2">
                <label for="name_of_institution" class="block text-sm font-medium text-gray-700 mb-1 required-label">
                  Name of Institution
                </label>
                <input type="text" id="name_of_institution" v-model="formData.name_of_institution"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2" />
              </div>

              <div>
                <label for="dzongkhag" class="block text-sm font-medium text-gray-700 mb-1 required-label">
                  Dzongkhag
                </label>
                <input type="text" id="dzongkhag" v-model="formData.dzongkhag"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2" />
              </div>

              <div>
                <label for="gewog" class="block text-sm font-medium text-gray-700 mb-1">
                  Gewog
                </label>
                <input type="text" id="gewog" v-model="formData.gewog"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2" />
              </div>

              <div>
                <label for="village" class="block text-sm font-medium text-gray-700 mb-1">
                  Village
                </label>
                <input type="text" id="village" v-model="formData.village"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2" />
              </div>

              <div>
                <label for="chiwog" class="block text-sm font-medium text-gray-700 mb-1">
                  Chiwog
                </label>
                <input type="text" id="chiwog" v-model="formData.chiwog"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2" />
              </div>

              <div class="col-span-2">
                <label for="address" class="block text-sm font-medium text-gray-700 mb-1 required-label">
                  Address
                </label>
                <textarea id="address" v-model="formData.address"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 resize-none px-3 py-2"
                  rows="3"></textarea>
              </div>

              <div>
                <label for="website" class="block text-sm font-medium text-gray-700 mb-1">
                  Website
                </label>
                <input type="url" id="website" v-model="formData.website"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2" />
              </div>
            </div>
          </div>

          <div class="space-y-8 pb-6 border-b border-gray-100">
            <h2 class="text-xl font-semibold text-gray-900 mb-10">Course Details</h2>

            <div class="grid gap-6 md:grid-cols-2">
              <div class="col-span-2 flex gap-4">
                <div class="w-1/2">
                  <label for="title_of_course" class="block text-sm font-medium text-gray-700 mb-1 required-label">
                    Title of Course
                  </label>
                  <input type="text" id="title_of_course" v-model="formData.title_of_course"
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2" />
                </div>

                <div class="w-1/2">
                  <label for="teaching_institute" class="block text-sm font-medium text-gray-700 mb-1">
                    Teaching Institution
                  </label>
                  <input type="text" id="teaching_institute" v-model="formData.teaching_institute"
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2" />
                </div>
              </div>

              <div>
                <label for="course_duration" class="block text-sm font-medium text-gray-700 mb-1 required-label">
                  Course Duration (in months)
                </label>
                <input type="number" id="course_duration" v-model="formData.course_duration"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2" />
              </div>

              <div>
                <label for="commencement_date" class="block text-sm font-medium text-gray-700 mb-1 required-label">
                  Commencement Date
                </label>
                <input type="date" id="commencement_date" v-model="formData.commencement_date"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2" />
              </div>

              <div class="col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-3 required-label">
                  Type of Program
                </label>
                <div class="space-y-3">
                  <div class="flex items-center space-x-4">
                    <label v-for="option in programTypeOptions" :key="option.value" class="flex items-center">
                      <input type="radio" :value="option.value" v-model="formData.type_of_programme"
                        class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300" />
                      <span class="ml-2 text-sm text-gray-700">{{ option.label }}</span>
                    </label>
                  </div>
                </div>
              </div>

              <div class="col-span-2">
                <label for="supporting_documents" class="block text-sm font-medium text-gray-700 mb-1">
                  Supporting Documents
                </label>
                <input type="file" id="supporting_documents"
                  @change="(e) => handleFileUpload(e, 'supporting_documents')" accept=".pdf,.doc,.docx"
                  class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
              </div>

              <div class="col-span-2">
                <label for="remarks" class="block text-sm font-medium text-gray-700 mb-1">
                  Remarks
                </label>
                <textarea id="remarks" v-model="formData.remarks"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 resize-none px-3 py-2"
                  rows="3"></textarea>
              </div>
            </div>
          </div>

          <div class="space-y-8 pb-6 border-b border-gray-100">
            <h2 class="text-xl font-semibold text-gray-900 mb-10">Head of Institution Details</h2>
            <div class="grid gap-6 md:grid-cols-2">
              <div>
                <label for="head_of_institution_name"
                  class="block text-sm font-medium text-gray-700 mb-1 required-label">
                  Name
                </label>
                <input type="text" id="head_of_institution_name" v-model="formData.head_of_institution_name"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2" />
              </div>

              <div>
                <label for="head_of_institution_gender"
                  class="block text-sm font-medium text-gray-700 mb-1 required-label">
                  Gender
                </label>
                <select id="head_of_institution_gender" v-model="formData.head_of_institution_gender"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2">
                  <option value="">Select Gender</option>
                  <option v-for="option in genderOptions" :key="option.value" :value="option.value">
                    {{ option.label }}
                  </option>
                </select>
              </div>

              <div>
                <label for="head_of_institution_phone_number"
                  class="block text-sm font-medium text-gray-700 mb-1 required-label">
                  Phone Number
                </label>
                <input type="tel" id="head_of_institution_phone_number"
                  v-model="formData.head_of_institution_phone_number"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2" />
              </div>

              <div>
                <label for="head_of_institution_email"
                  class="block text-sm font-medium text-gray-700 mb-1 required-label">
                  Email
                </label>
                <input type="email" id="head_of_institution_email" v-model="formData.head_of_institution_email"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-3 py-2" />
              </div>
            </div>
          </div>

          <div class="space-y-6 pb-6 border-b border-gray-100">
            <div class="bg-gray-50 rounded-lg p-4">
              <h2 class="text-xl font-semibold text-gray-900 mb-3">Declaration</h2>
              <div class="space-y-4">
                <p class="text-sm text-gray-700">
                  I/We certify that the information provided in this application is true, complete,
                  and accurate to the best of my knowledge. I realize that any false, fictitious, or
                  fraudulent statements may be subjected to administrative penalties. I am fully
                  aware and understand the process and requirements of relevant agencies.
                </p>
                <div class="flex items-center">
                  <input type="checkbox" id="declaration" v-model="formData.declaration"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                  <label for="declaration" class="ml-2 text-sm text-gray-700">
                    I agree to the above declaration
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-4 pt-6">
            <button type="button" @click="saveDraft"
              class="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200">
              Save as Draft
            </button>
            <button type="button" @click="handleSubmit" :disabled="isSubmitting || !formData.declaration"
              class="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
              {{ isSubmitting ? 'Submitting...' : 'Submit Application' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import epcService from '@/services/epcServices'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const toast = useToast()
const authStore = useAuthStore()

const formData = ref({
  // Basic Information
  CID: '', // Will be auto-filled
  full_name: '',
  gender: '',
  contact_no: '',
  email_address: '',

  // Institution Details
  name_of_institution: '',
  country: 'BT', // Default to Bhutan
  gewog: '',
  dzongkhag: '',
  village: '',
  address: '',
  chiwog: '',
  teaching_institute: '',
  website: '',

  // Course Details
  title_of_course: '',
  course_duration: null,
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

  // Declaration
  declaration: false,

  // Backend-set fields
  review_decision: 'Pending',
  reason_if_rejected: '',
})

const isSubmitting = ref(false)
// Removed unused errorMessage and successMessage refs

// Options for dropdowns
const genderOptions = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'others', label: 'Others' },
]

const programTypeOptions = [
  { value: 'D', label: 'Diploma' },
  { value: 'B', label: 'Bachelor' },
]

// File upload handlers
const handleFileUpload = (event, fieldName) => {
  const file = event.target.files[0]
  if (file) {
    formData.value[fieldName] = file
  } else {
    formData.value[fieldName] = null // Clear if no file selected
  }
}

// Form submission
const handleSubmit = async () => {
  // Ensure CID is set from authStore before submitting
  if (!authStore.user || !authStore.user.cid) {
    toast.error('User authentication error. Cannot submit application.', { timeout: 5000 });
    return;
  }
  // Ensure the form data CID matches the auth store CID right before submission
  formData.value.CID = authStore.user.cid;


  if (!formData.value.declaration) {
    toast.warning('Please agree to the declaration before submitting.', { timeout: 4000 });
    return;
  }

  try {
    isSubmitting.value = true

    const submitData = new FormData()

    Object.keys(formData.value).forEach((key) => {
      const value = formData.value[key];

      // Handle file fields specifically
      if (key === 'supporting_documents' || key === 'institute_eoi_supporting_documents' || key === 'do_dpr_report') {
        if (value instanceof File) {
          submitData.append(key, value);
        }
        // Do not append null/undefined file fields, or handle as empty string if backend requires
      }
      // Handle null/undefined values - append as empty string, except for files
      else if (value === null || value === undefined) {
        submitData.append(key, '');
      }
      // Handle boolean (declaration) - convert to string
      else if (typeof value === 'boolean') {
        submitData.append(key, String(value));
      }
      // Handle numbers (ensure course_duration is sent as number)
      else if (key === 'course_duration' && value !== null) {
        // Ensure it's a valid number before parsing
        const duration = parseInt(value);
        if (!isNaN(duration)) {
          submitData.append(key, duration);
        } else {
          submitData.append(key, ''); // Send empty if not a valid number
        }
      }
      // Append other values directly
      else {
        submitData.append(key, value);
      }
    });

    // --- DEBUG: Log FormData before sending ---
    console.log("Submitting FormData with keys:");
    for (let pair of submitData.entries()) {
      console.log(pair[0] + ', ' + (pair[1] instanceof File ? pair[1].name : pair[1]));
    }
    // --- END DEBUG ---


    const response = await epcService.createEpcInstitute(submitData)

    if (response.data) {
      toast.success('Application submitted successfully!')
      clearDraft() // Clear draft after successful submission
      setTimeout(() => {
        router.push('/admin/institutions/engineering_certification/dashboard') // Adjust route as needed
      }, 1500)
    } else {
      toast.warning('Submission received, but no confirmation data returned.');
    }
  } catch (error) {
    console.error('Error submitting form:', error)
    let message = 'Error submitting application. Please check your inputs and try again.'
    if (error.response?.data) {
      const errors = error.response.data
      if (typeof errors === 'object' && errors !== null) {
        message = Object.entries(errors)
          .map(([field, msg]) => `${field.replace(/_/g, ' ')}: ${Array.isArray(msg) ? msg.join(', ') : msg}`)
          .join('; ') || message;
      } else if (typeof errors === 'string') {
        message = errors;
      }
    } else if (error.message) {
      message = error.message;
    }
    toast.error(`Submission Failed: ${message}`, { timeout: 7000 })
  } finally {
    isSubmitting.value = false
  }
}

// Draft management
const saveDraft = () => {
  const draftData = { ...formData.value }
    ;['supporting_documents', 'institute_eoi_supporting_documents', 'do_dpr_report'].forEach(
      (key) => {
        draftData[key] = draftData[key] instanceof File ? draftData[key].name : null;
      },
    )
  localStorage.setItem('epcEoiFormDraft', JSON.stringify(draftData))
  toast.success('Draft saved successfully!')
}

const clearDraft = () => {
  localStorage.removeItem('epcEoiFormDraft')
}

// Load draft on component mount
onMounted(() => {
  // Set CID from auth store FIRST
  if (authStore.user && authStore.user.cid) {
    formData.value.CID = authStore.user.cid;
  } else {
    console.error("User CID not found in auth store on mount.");
    toast.error("Could not retrieve user information. Please log in again.", { timeout: 5000 });
  }

  // Now load the draft
  const savedDraft = localStorage.getItem('epcEoiFormDraft')
  if (savedDraft) {
    try {
      const parsedDraft = JSON.parse(savedDraft)
      Object.keys(parsedDraft).forEach((key) => {
        // **** MODIFICATION: Use Object.prototype.hasOwnProperty.call ****
        // Check if the key exists as an own property in formData before assigning
        if (key !== 'CID' && Object.prototype.hasOwnProperty.call(formData.value, key)) {
          // For file fields, we only stored the name; don't restore it
          if (!['supporting_documents', 'institute_eoi_supporting_documents', 'do_dpr_report'].includes(key)) {
            formData.value[key] = parsedDraft[key];
          }
        }
      })
      toast.info('Draft loaded successfully.');
    } catch (error) {
      console.error('Error loading draft:', error)
      clearDraft() // Clear corrupted draft
    }
  }
})

</script>

<style scoped>
/* Styles for required labels */
.required-label::after {
  content: ' *';
  color: #dc2626;
  /* Tailwind red-600 */
  margin-left: 2px;
}

/* Add other custom styles if needed */
</style>
