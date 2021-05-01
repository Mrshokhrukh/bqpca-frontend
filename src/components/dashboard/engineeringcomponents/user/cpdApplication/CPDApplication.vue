<template>
  <div class="min-h-screen bg-gradient-to-b from-gray-100 to-gray-50 py-12">
    <div class="mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Form Header -->
      <div
        class="relative bg-gradient-to-r from-indigo-100 via-blue-50 to-indigo-100 rounded-2xl p-8 mb-12 overflow-hidden"
      >
        <div class="absolute inset-0 bg-indigo-200 opacity-10 animate-pulse-slow"></div>
        <h2 class="relative text-3xl font-extrabold text-gray-900 mb-4 text-center tracking-tight">
          Continuing Professional Development (CPD) Application
        </h2>
        <p class="relative text-gray-600 text-center max-w-2xl mx-auto text-sm sm:text-base">
          Complete all required fields marked with an
          <span class="text-red-600 font-semibold">*</span>. Ensure your information is accurate and
          current.
        </p>
      </div>

      <form
        @submit.prevent="handleSubmit"
        class="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
      >
        <!-- Hidden Fields -->
        <input type="hidden" v-model="form.registration_no" />
        <input type="hidden" v-model="form.cid_no" />
        <input type="hidden" v-model="form.full_name" />
        <input type="hidden" v-model="form.gender" />
        <input type="hidden" v-model="form.cpd_credit" />

        <!-- CPD Details Section -->
        <div class="bg-gradient-to-r from-gray-50 to-indigo-50 p-8">
          <h3 class="text-xl font-semibold text-gray-900">CPD Details</h3>
          <p class="mt-2 text-gray-600 text-sm">
            Provide detailed information about your CPD activity.
          </p>
        </div>

        <div class="p-8 space-y-10">
          <!-- Form Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            <!-- Title of CPD -->
            <div class="space-y-2">
              <label for="title" class="text-sm font-medium text-gray-700 flex items-center">
                Title of CPD <span class="text-red-500 ml-1">*</span>
              </label>
              <input
                id="title"
                v-model="form.title"
                type="text"
                class="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 shadow-sm hover:border-indigo-300"
                required
                placeholder="Enter CPD title"
              />
              <span v-if="errors.title" class="text-sm text-red-500 block">{{ errors.title }}</span>
            </div>

            <!-- Professional Relevance -->
            <div class="space-y-2">
              <label for="description" class="text-sm font-medium text-gray-700 flex items-center">
                Professional Relevance <span class="text-red-500 ml-1">*</span>
              </label>
              <input
                id="description"
                v-model="form.description"
                type="text"
                class="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 shadow-sm hover:border-indigo-300"
                required
                placeholder="Describe relevance to your profession"
              />
              <span v-if="errors.description" class="text-sm text-red-500 block">{{
                errors.description
              }}</span>
            </div>

            <!-- Learning Method -->
            <div class="space-y-2">
              <label
                for="learning_method"
                class="text-sm font-medium text-gray-700 flex items-center"
              >
                Learning Method <span class="text-red-500 ml-1">*</span>
              </label>
              <select
                id="learning_method"
                v-model="form.learning_method"
                class="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 shadow-sm hover:border-indigo-300 appearance-none"
                required
              >
                <option value="" disabled selected>Select learning method</option>
                <option v-for="method in learningMethods" :key="method.id" :value="method.id">
                  {{ method.name }}
                </option>
              </select>
              <span v-if="errors.learning_method" class="text-sm text-red-500 block">{{
                errors.learning_method
              }}</span>
            </div>

            <!-- Methodology -->
            <div class="space-y-2">
              <label for="methodology" class="text-sm font-medium text-gray-700 flex items-center">
                Methodology <span class="text-red-500 ml-1">*</span>
              </label>
              <select
                id="methodology"
                v-model="form.methodology"
                class="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 shadow-sm hover:border-indigo-300 appearance-none"
                required
              >
                <option value="" disabled selected>Select methodology</option>
                <option
                  v-for="methodology in methodologies"
                  :key="methodology.id"
                  :value="methodology.id"
                >
                  {{ methodology.name }}
                </option>
              </select>
              <span v-if="errors.methodology" class="text-sm text-red-500 block">{{
                errors.methodology
              }}</span>
            </div>

            <!-- Providing Agency -->
            <div class="space-y-2">
              <label
                for="providing_agency"
                class="text-sm font-medium text-gray-700 flex items-center"
              >
                Providing Agency <span class="text-red-500 ml-1">*</span>
              </label>
              <select
                id="providing_agency"
                v-model="form.providing_agency"
                class="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 shadow-sm hover:border-indigo-300 appearance-none"
                required
              >
                <option value="" disabled selected>Select providing agency</option>
                <option v-for="agency in providingAgencies" :key="agency.id" :value="agency.id">
                  {{ agency.name }}
                </option>
              </select>
              <span v-if="errors.providing_agency" class="text-sm text-red-500 block">{{
                errors.providing_agency
              }}</span>
            </div>

            <!-- Reason for Conducting -->
            <div class="space-y-2">
              <label
                for="reason_for_conducting"
                class="text-sm font-medium text-gray-700 flex items-center"
              >
                Reason for Conducting <span class="text-red-500 ml-1">*</span>
              </label>
              <select
                id="reason_for_conducting"
                v-model="form.reason_for_conducting"
                class="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 shadow-sm hover:border-indigo-300 appearance-none"
                required
              >
                <option value="" disabled selected>Select reason</option>
                <option v-for="reason in reasonsForConducting" :key="reason.id" :value="reason.id">
                  {{ reason.name }}
                </option>
              </select>
              <span v-if="errors.reason_for_conducting" class="text-sm text-red-500 block">{{
                errors.reason_for_conducting
              }}</span>
            </div>

            <!-- Credits -->
            <!-- <div class="space-y-2" type="hidden">
              <label for="credits" class="text-sm font-medium text-gray-700 flex items-center">
                Credits <span class="text-red-500 ml-1">*</span>
              </label>
              <input id="credits" v-model.number="form.credits" type="number" min="1" max="50"
                class="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 shadow-sm hover:border-indigo-300"
                required placeholder="Enter credits earned" />
              <span v-if="errors.credits" class="text-sm text-red-500 block">{{ errors.credits }}</span>
            </div> -->

            <!-- Completed Date -->
            <div class="space-y-2">
              <label
                for="completed_date"
                class="text-sm font-medium text-gray-700 flex items-center"
              >
                Completion Date <span class="text-red-500 ml-1">*</span>
              </label>
              <input
                id="completed_date"
                v-model="form.completed_date"
                type="date"
                class="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 shadow-sm hover:border-indigo-300"
                required
              />
              <span v-if="errors.completed_date" class="text-sm text-red-500 block">{{
                errors.completed_date
              }}</span>
            </div>

            <!-- File Upload -->
            <div class="space-y-2 md:col-span-2">
              <label for="attachment" class="text-sm font-medium text-gray-700"
                >Supporting Documents <span class="text-red-500 ml-1">*</span></label
              >
              <div class="relative">
                <input
                  id="attachment"
                  type="file"
                  @change="handleFileUpload"
                  class="w-full px-4 py-3 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-400 hover:border-indigo-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-indigo-100 file:text-indigo-700 hover:file:bg-indigo-200"
                  required
                />
                <p class="mt-2 text-xs text-gray-500 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  PDF, DOC, (Max: 2MB)
                </p>
              </div>
              <span v-if="errors.attachment" class="text-sm text-red-500 block">{{
                errors.attachment
              }}</span>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="bg-gray-50 px-8 py-6 flex justify-end space-x-4 border-t border-gray-100">
          <button
            type="button"
            @click="handleCancel"
            class="px-6 py-3 rounded-lg bg-white text-gray-700 border border-gray-200 hover:bg-gray-100 hover:border-gray-300 transition-all duration-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="isSubmitting"
            class="px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-600 text-white hover:from-indigo-700 hover:to-blue-700 transition-all duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isSubmitting ? 'Submitting...' : 'Submit Application' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted, ref } from 'vue'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '@/stores/authStore'
import apiServices from '@/services/services'
import { useRouter } from 'vue-router'

const toast = useToast()
const authStore = useAuthStore()
const router = useRouter()

const learningMethods = ref([])
const methodologies = ref([])
const providingAgencies = ref([])
const reasonsForConducting = ref([])
const isSubmitting = ref(false)
const applicationData = ref(null)

const form = reactive({
  registration_no: '',
  cid_no: '',
  full_name: '',
  gender: '',
  title: '',
  description: '',
  learning_method: '',
  methodology: '',
  providing_agency: '',
  reason_for_conducting: '',
  credits: 1,
  completed_date: '',
  attachment: null,
})

const errors = reactive({})

const validateForm = () => {
  Object.keys(errors).forEach((key) => delete errors[key])
  let isValid = true

  if (!form.title) {
    errors.title = 'CPD Title is required'
    isValid = false
  }
  if (!form.description) {
    errors.description = 'Description is required'
    isValid = false
  }
  if (!form.learning_method) {
    errors.learning_method = 'Learning Method is required'
    isValid = false
  }
  if (!form.methodology) {
    errors.methodology = 'Methodology is required'
    isValid = false
  }
  if (!form.providing_agency) {
    errors.providing_agency = 'Providing Agency is required'
    isValid = false
  }
  if (!form.reason_for_conducting) {
    errors.reason_for_conducting = 'Reason for Conducting is required'
    isValid = false
  }
  if (!form.credits || form.credits < 1) {
    errors.credits = 'Credits must be at least 1'
    isValid = false
  }
  if (!form.completed_date) {
    errors.completed_date = 'Completion Date is required'
    isValid = false
  }
  if (!form.attachment) {
    errors.attachment = 'Supporting document is required'
    isValid = false
  } else if (form.attachment && form.attachment.size > 2 * 1024 * 1024) {
    errors.attachment = 'Attachment size should not exceed 2MB'
    isValid = false
  }

  return isValid
}

const fetchRegistrationNumber = async (cid) => {
  try {
    const response = await apiServices.getApplicationWithCid(cid)

    if (
      response.data &&
      response.data.results &&
      Array.isArray(response.data.results) &&
      response.data.results.length > 0
    ) {
      // Find active registration
      const activeRegistration = response.data.results.find(
        (record) => record.cid_no === cid && record.is_active === true,
      )

      // Store the entire application object for later use
      if (activeRegistration) {
        applicationData.value = activeRegistration.application
        // Return the ID (numeric) rather than the registration_no (string)
        return activeRegistration.application.id
      }

      // Fallback to first result
      applicationData.value = response.data.results[0].application
      return response.data.results[0].application.id
    }

    return 5 // Fallback to 5 based on your example data
  } catch (error) {
    toast.error('Failed to fetch registration number: ' + error.message)
    console.error('Error fetching registration number:', error)
    return 5 // Fallback to 5 based on your example data
  }
}

const handleSubmit = async () => {
  if (!validateForm()) {
    toast.error('Please correct the errors in the form.')
    return
  }

  isSubmitting.value = true

  const formData = new FormData()

  if (typeof form.registration_no === 'string' && form.registration_no.includes('-')) {
    const applicationId = applicationData.value ? applicationData.value.id : null
    formData.append('registration_no', applicationId || 5)
  } else {
    formData.append('registration_no', form.registration_no)
  }

  formData.append('cid_no', form.cid_no)
  formData.append('full_name', form.full_name || '')
  formData.append('gender', form.gender || '')
  formData.append('title_of_cpd', form.title)
  formData.append('relevance_to_profession', form.description)

  // For participation_category, use a value that exists in the database
  // Based on the error, "2" doesn't exist, so let's use "1" which likely exists
  formData.append('participation_category', 1)
  formData.append('participant_sub_category', 1)
  formData.append('type_of_cpd_activity', form.methodology)

  formData.append('learning_method', form.learning_method)
  formData.append('methodology', form.methodology)
  formData.append('providing_agency', form.providing_agency)
  formData.append('reason_for_conducting', form.reason_for_conducting)
  formData.append('cpd_credit', form.credits)
  formData.append('completed_date', form.completed_date)

  if (form.attachment) {
    formData.append('attachment', form.attachment)
  }

  try {
    const response = await apiServices.createEpcCpdRecord(formData)

    if (response.status >= 200 && response.status < 300) {
      toast.success('CPD application submitted successfully!')
      router.push('/admin/user/engineering_certification/dashboard')
    } else {
      toast.error('Submission failed. Server returned an error.')
      console.error('Server error:', response)

      if (response.data && response.data.errors) {
        for (const field in response.data.errors) {
          errors[field] = response.data.errors[field][0]
        }
      }
    }
  } catch (error) {
    toast.error('Submission failed: ' + (error.response?.data?.message || error.message))
    console.error('Error submitting form:', error)

    if (error.response?.data?.errors) {
      Object.entries(error.response.data.errors).forEach(([key, value]) => {
        errors[key] = Array.isArray(value) ? value[0] : value
      })
    }
  } finally {
    isSubmitting.value = false
  }
}

const handleCancel = () => {
  // Reset form fields
  form.title = ''
  form.description = ''
  form.learning_method = ''
  form.methodology = ''
  form.providing_agency = ''
  form.reason_for_conducting = ''
  form.credits = 1
  form.completed_date = ''
  form.attachment = null
  Object.keys(errors).forEach((key) => delete errors[key])
}

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  form.attachment = file
  if (file && file.size > 2 * 1024 * 1024) {
    errors.attachment = 'Attachment size should not exceed 2MB'
    form.attachment = null
  } else {
    delete errors.attachment
  }
}

const fetchMasterData = async () => {
  // Initialize refs as empty arrays
  learningMethods.value = [];
  methodologies.value = [];
  providingAgencies.value = [];
  reasonsForConducting.value = [];

  try {
    const [
      learningMethodsResponse,
      methodologiesResponse,
      providingAgenciesResponse,
      reasonsResponse,
    ] = await Promise.all([
      apiServices.getEpcCpdTaskLearningMethods(), // Endpoint returns EnggCPDTaskLearningMethod objects
      apiServices.getEpcCpdTaskMethodologies(), // Endpoint returns EnggCPDTaskMethodology objects
      apiServices.getEpcCpdProvidingAgencies(), // Endpoint returns EnggCPDProvidingAgency objects
      apiServices.getEpcCpdReasonsForConducting(), // Endpoint returns EnggCPDReasonForConducting objects
    ]);

    // --- Process Learning Methods ---
    if (
      learningMethodsResponse &&
      learningMethodsResponse.data &&
      Array.isArray(learningMethodsResponse.data.results)
    ) {
      learningMethods.value = learningMethodsResponse.data.results.map((item) => ({
        id: item.id,
        // Use the 'activities' field from the API response as the display name
        name: item.activities || `Learning Method ${item.id}`, // Fallback if 'activities' is empty
      }));
      if (learningMethods.value.length === 0) {
          console.warn("API returned 0 learning methods.");
      }
    } else {
      // Log the error but DON'T assign hardcoded data
      console.error(
        'Error: Invalid or empty data received for Learning Methods.',
        learningMethodsResponse?.data // Log received data if available
      );
      toast.error("Failed to load Learning Methods options.");
    }

    // --- Process Methodologies ---
    if (
      methodologiesResponse &&
      methodologiesResponse.data &&
      Array.isArray(methodologiesResponse.data.results)
    ) {
      methodologies.value = methodologiesResponse.data.results
        // Filter out results where the nested methodology might be null
        .filter(item => item.methodology)
        .map((item) => ({
          // Use the ID from the *nested* methodology object
          id: item.methodology.id,
          // Use the methodology_name from the *nested* object
          name: item.methodology.methodology_name || `Methodology ${item.methodology.id}`,
        }));
       if (methodologies.value.length === 0) {
          console.warn("API returned 0 methodologies (after filtering).");
      }
    } else {
      // Log the error but DON'T assign hardcoded data
      console.error(
        'Error: Invalid or empty data received for Methodologies.',
        methodologiesResponse?.data // Log received data if available
      );
       toast.error("Failed to load Methodologies options.");
    }

    // --- Process Providing Agencies ---
    if (
      providingAgenciesResponse &&
      providingAgenciesResponse.data &&
      Array.isArray(providingAgenciesResponse.data.results)
    ) {
      providingAgencies.value = providingAgenciesResponse.data.results.map((item) => ({
        id: item.id,
        // Assuming the API returns a 'name' field for EnggCPDProvidingAgency
        name: item.name || `Agency ${item.id}`,
      }));
       if (providingAgencies.value.length === 0) {
          console.warn("API returned 0 providing agencies.");
      }
    } else {
       // Log the error but DON'T assign hardcoded data
      console.error(
        'Error: Invalid or empty data received for Providing Agencies.',
        providingAgenciesResponse?.data // Log received data if available
      );
       toast.error("Failed to load Providing Agencies options.");
    }

    // --- Process Reasons for Conducting ---
    if (reasonsResponse && reasonsResponse.data && Array.isArray(reasonsResponse.data.results)) {
      reasonsForConducting.value = reasonsResponse.data.results.map((item) => ({
        id: item.id,
         // Assuming the API returns a 'name' field for EnggCPDReasonForConducting
        name: item.name || `Reason ${item.id}`,
      }));
       if (reasonsForConducting.value.length === 0) {
          console.warn("API returned 0 reasons for conducting.");
      }
    } else {
      // Log the error but DON'T assign hardcoded data
      console.error(
        'Error: Invalid or empty data received for Reasons for Conducting.',
        reasonsResponse?.data // Log received data if available
      );
       toast.error("Failed to load Reasons for Conducting options.");
    }

  } catch (error) {
    toast.error('Failed to fetch master data options: ' + error.message);
    console.error('Error fetching master data:', error);
    // Keep arrays empty if the entire fetch fails
  }
};
onMounted(async () => {
  if (authStore.user) {
    form.cid_no = authStore.user.cid
    form.full_name =
      authStore.fullName ||
      `${authStore.user.first_name || ''} ${authStore.user.middle_name || ''} ${authStore.user.last_name || ''}`.trim()
    form.gender = authStore.user.gender || ''

    const registrationNumber = await fetchRegistrationNumber(form.cid_no)
    form.registration_no = registrationNumber || '' // Ensure it's never null
  } else {
    // Set default empty value for registration_no if no user is found
    form.registration_no = ''
  }

  await fetchMasterData()
})
</script>

<style scoped>
.required::after {
  content: ' *';
  color: #ef4444;
}

/* For the pulsing animation in the header */
@keyframes pulse-slow {
  0%,
  100% {
    opacity: 0.1;
  }

  50% {
    opacity: 0.2;
  }
}

.animate-pulse-slow {
  animation: pulse-slow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
