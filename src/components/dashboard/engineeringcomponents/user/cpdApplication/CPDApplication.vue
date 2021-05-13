```vue
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

            <!-- Participation Category -->
            <div class="space-y-2">
              <label
                for="participation_category"
                class="text-sm font-medium text-gray-700 flex items-center"
              >
                Participation Category <span class="text-red-500 ml-1">*</span>
              </label>
              <select
                id="participation_category"
                v-model="form.participation_category"
                class="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 shadow-sm hover:border-indigo-300 appearance-none"
                required
                @change="fetchSubCategories"
              >
                <option value="" disabled selected>Select participation category</option>
                <option
                  v-for="category in participationCategories"
                  :key="category.id"
                  :value="category.id"
                >
                  {{ category.name }}
                </option>
              </select>
              <span v-if="errors.participation_category" class="text-sm text-red-500 block">{{
                errors.participation_category
              }}</span>
            </div>

            <!-- Participant Sub-category -->
            <div class="space-y-2">
              <label
                for="participant_sub_category"
                class="text-sm font-medium text-gray-700 flex items-center"
              >
                Participant Sub-category <span class="text-red-500 ml-1">*</span>
              </label>
              <select
                id="participant_sub_category"
                v-model="form.participant_sub_category"
                class="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 shadow-sm hover:border-indigo-300 appearance-none"
                required
              >
                <option value="" disabled selected>Select participant sub-category</option>
                <option
                  v-for="subCategory in filteredParticipantSubCategories"
                  :key="subCategory.id"
                  :value="subCategory.id"
                >
                  {{ subCategory.name }}
                </option>
              </select>
              <span v-if="errors.participant_sub_category" class="text-sm text-red-500 block">{{
                errors.participant_sub_category
              }}</span>
            </div>

            <!-- Type of CPD Activity -->
            <div class="space-y-2">
              <label
                for="type_of_cpd_activity"
                class="text-sm font-medium text-gray-700 flex items-center"
              >
                Type of CPD Activity <span class="text-red-500 ml-1">*</span>
              </label>
              <select
                id="type_of_cpd_activity"
                v-model="form.type_of_cpd_activity"
                class="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 shadow-sm hover:border-indigo-300 appearance-none"
                required
              >
                <option value="" disabled selected>Select activity type</option>
                <option v-for="activity in cpdActivities" :key="activity.id" :value="activity.id">
                  {{ activity.name }}
                </option>
              </select>
              <span v-if="errors.type_of_cpd_activity" class="text-sm text-red-500 block">{{
                errors.type_of_cpd_activity
              }}</span>
            </div>

            <!-- File Upload -->
            <div class="space-y-2 md:col-span-2">
              <label for="attachment" class="text-sm font-medium text-gray-700">
                Supporting Documents <span class="text-red-500 ml-1">*</span>
              </label>
              <div class="relative">
                <input
                  id="attachment"
                  type="file"
                  @change="handleFileUpload"
                  class="w-full px-4 py-3 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 text-gray-900 placeholder-gray-400 hover:border-indigo-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-indigo-100 file:text-indigo-700 hover:file:bg-indigo-200"
                  required
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
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
                  PDF, DOC, JPG, PNG (Max: 2MB)
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
import { reactive, onMounted, ref, computed, watch } from 'vue'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '@/stores/authStore'
import apiServices from '@/services/services'
import { useRouter } from 'vue-router'

const toast = useToast()
const authStore = useAuthStore()
const router = useRouter()

const participationCategories = ref([])
const participantSubCategories = ref([])
const cpdActivities = ref([])
const isSubmitting = ref(false)
const applicationData = ref(null)

const form = reactive({
  registration_no: '',
  cid_no: '',
  full_name: '',
  gender: '',
  title: '',
  description: '',
  participation_category: '',
  participant_sub_category: '',
  type_of_cpd_activity: '',
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
    errors.description = 'Professional Relevance is required'
    isValid = false
  }
  if (!form.participation_category) {
    errors.participation_category = 'Participation Category is required'
    isValid = false
  }
  if (!form.participant_sub_category) {
    errors.participant_sub_category = 'Participant Sub-category is required'
    isValid = false
  }
  if (!form.type_of_cpd_activity) {
    errors.type_of_cpd_activity = 'Type of CPD Activity is required'
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
  if (!cid) {
    console.warn('Cannot fetch registration number without CID.')
    return null
  }
  try {
    const response = await apiServices.getEpcApplicationsByCid(cid)
    if (response?.data?.results?.length > 0) {
      const activeRegistration = response.data.results.find(
        (record) =>
          (record.cid_no === cid || record.application?.cid_no === cid) &&
          (record.is_active || record.application?.is_active),
      )
      if (activeRegistration) {
        const app = activeRegistration.application || activeRegistration
        applicationData.value = app
        console.log('Found active application:', app)
        return app.id
      }
      const firstResultApp = response.data.results[0].application || response.data.results[0]
      applicationData.value = firstResultApp
      console.log('Using first application result:', firstResultApp)
      return firstResultApp.id
    }
    console.warn('No application found for CID:', cid)
    toast.warn('No active engineering registration found for your CID.')
    return null
  } catch (error) {
    toast.error('Failed to fetch registration details.')
    console.error('Error fetching registration number:', error)
    return null
  }
}

const fetchSubCategories = async () => {
  form.participant_sub_category = '' // Reset sub-category when category changes
  participantSubCategories.value = []
  try {
    const response = await apiServices.getEpcMastersSubCategories()
    if (response?.data?.results) {
      participantSubCategories.value = response.data.results.map((item) => ({
        id: item.id,
        name: item.name || `Sub-category ${item.id}`,
        category_id: item.category_id || null, // Assuming backend returns category_id
      }))
      if (participantSubCategories.value.length === 0) {
        console.warn('API returned 0 participant sub-categories.')
      }
    } else {
      console.error('Invalid or empty data for Participant Sub-categories.', response?.data)
      toast.error('Failed to load Participant Sub-categories options.')
    }
  } catch (error) {
    toast.error('Failed to fetch Participant Sub-categories: ' + error.message)
    console.error('Error fetching sub-categories:', error)
  }
}

// Computed property to filter sub-categories based on selected category
const filteredParticipantSubCategories = computed(() => {
  if (!form.participation_category) {
    return participantSubCategories.value
  }
  return participantSubCategories.value.filter(
    (subCategory) => subCategory.category_id === form.participation_category,
  )
})

const handleSubmit = async () => {
  if (!validateForm()) {
    toast.error('Please correct the errors in the form.')
    return
  }
  if (!form.registration_no) {
    toast.error('Could not find associated Application ID. Cannot submit.')
    console.error('Missing registration_no (Application ID)')
    return
  }

  isSubmitting.value = true
  const formData = new FormData()

  // Append fields expected by EnggCPDRecordSerializer
  formData.append('registration_no', form.registration_no)
  formData.append('cid_no', form.cid_no)
  formData.append('full_name', form.full_name || '')
  formData.append('gender', form.gender || 'Others')
  formData.append('title_of_cpd', form.title)
  formData.append('relevance_to_profession', form.description)
  formData.append('participation_category', form.participation_category)
  formData.append('participant_sub_category', form.participant_sub_category)
  formData.append('type_of_cpd_activity', form.type_of_cpd_activity)

  if (form.attachment) {
    formData.append('attachment', form.attachment)
  }

  console.log('Submitting FormData:')
  for (let pair of formData.entries()) {
    console.log(pair[0] + ': ' + (pair[1] instanceof File ? pair[1].name : pair[1]))
  }

  try {
    const response = await apiServices.createEpcCpdRecord(formData)

    if (response.status === 201 || response.status === 200) {
      toast.success('CPD application submitted successfully!')
      router.push('/admin/user/engineering_certification/dashboard')
    } else {
      toast.warning(`Submission completed with status: ${response.status}`)
      console.warn('Server returned non-standard success status:', response)
      router.push('/admin/user/engineering_certification/dashboard')
    }
  } catch (error) {
    console.error('Error submitting form:', error)
    let errorMessage = 'Submission failed.'
    if (error.response) {
      console.error('Backend Error Response:', error.response.data)
      const backendErrors = error.response.data
      if (typeof backendErrors === 'object' && backendErrors !== null) {
        let messages = []
        for (const key in backendErrors) {
          if (Object.prototype.hasOwnProperty.call(backendErrors, key)) {
            const errorValue = backendErrors[key]
            messages.push(
              `${key}: ${Array.isArray(errorValue) ? errorValue.join(', ') : errorValue}`,
            )
            if (
              Object.prototype.hasOwnProperty.call(form, key) ||
              Object.prototype.hasOwnProperty.call(errors, key)
            ) {
              errors[key] = Array.isArray(errorValue) ? errorValue[0] : errorValue
            } else if (key === 'non_field_errors') {
              messages.push(Array.isArray(errorValue) ? errorValue.join(', ') : errorValue)
            }
          }
        }
        errorMessage = messages.join('; ') || errorMessage
      } else if (typeof backendErrors === 'string') {
        errorMessage = backendErrors
      }
    } else if (error.request) {
      errorMessage = 'Network error. Please check your connection.'
    } else {
      errorMessage = error.message
    }
    toast.error(errorMessage)
  } finally {
    isSubmitting.value = false
  }
}

const handleCancel = () => {
  form.title = ''
  form.description = ''
  form.participation_category = ''
  form.participant_sub_category = ''
  form.type_of_cpd_activity = ''
  form.attachment = null
  Object.keys(errors).forEach((key) => delete errors[key])
  toast.info('Form cancelled.')
}

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  delete errors.attachment
  form.attachment = null

  if (file) {
    if (file.size > 2 * 1024 * 1024) {
      errors.attachment = 'Attachment size should not exceed 2MB'
      event.target.value = ''
    } else {
      form.attachment = file
    }
  }
}

const fetchMasterData = async () => {
  participationCategories.value = []
  participantSubCategories.value = []
  cpdActivities.value = []

  try {
    const [participationCategoriesResponse, participantSubCategoriesResponse, activitiesResponse] =
      await Promise.all([
        apiServices.getEpcMastersParticipationCategories(),
        apiServices.getEpcMastersSubCategories(),
        apiServices.getEpcMastersCpdActivities(),
      ])

    // Process Participation Categories
    if (participationCategoriesResponse?.data?.results) {
      participationCategories.value = participationCategoriesResponse.data.results.map((item) => ({
        id: item.id,
        name: item.name || `Category ${item.id}`,
      }))
      if (participationCategories.value.length === 0)
        console.warn('API returned 0 participation categories.')
    } else {
      console.error(
        'Invalid or empty data for Participation Categories.',
        participationCategoriesResponse?.data,
      )
      toast.error('Failed to load Participation Categories options.')
    }

    // Process Participant Sub-categories
    if (participantSubCategoriesResponse?.data?.results) {
      participantSubCategories.value = participantSubCategoriesResponse.data.results.map(
        (item) => ({
          id: item.id,
          name: item.name || `Sub-category ${item.id}`,
          category_id: item.category_id || null, // Assuming backend returns category_id
        }),
      )
      if (participantSubCategories.value.length === 0)
        console.warn('API returned 0 participant sub-categories.')
    } else {
      console.error(
        'Invalid or empty data for Participant Sub-categories.',
        participantSubCategoriesResponse?.data,
      )
      toast.error('Failed to load Participant Sub-categories options.')
    }

    // Process CPD Activities
    if (activitiesResponse?.data?.results) {
      cpdActivities.value = activitiesResponse.data.results.map((item) => ({
        id: item.id,
        name: item.cpd_activity_name || `Activity ${item.id}`,
      }))
      if (cpdActivities.value.length === 0) console.warn('API returned 0 CPD activities.')
    } else {
      console.error('Invalid or empty data for CPD Activities.', activitiesResponse?.data)
      toast.error('Failed to load CPD Activities options.')
    }
  } catch (error) {
    toast.error('Failed to fetch master data options: ' + error.message)
    console.error('Error fetching master data:', error)
  }
}

onMounted(async () => {
  let fetchedRegNo = null
  if (authStore.user && authStore.user.cid) {
    form.cid_no = authStore.user.cid
    form.full_name =
      authStore.fullName ||
      `${authStore.user.first_name || ''} ${authStore.user.middle_name || ''} ${authStore.user.last_name || ''}`.trim()
    form.gender = authStore.user.gender || ''
    fetchedRegNo = await fetchRegistrationNumber(form.cid_no)
    form.registration_no = fetchedRegNo ?? ''
  } else {
    console.warn('User or CID not found in auth store.')
    toast.error('User information not found. Please log in again.')
    form.registration_no = ''
  }
  await fetchMasterData()
  console.log('Form state after mount:', JSON.parse(JSON.stringify(form)))
  console.log('Fetched Application ID:', fetchedRegNo)
})

// Watch for changes in participation_category to reset sub-category
watch(
  () => form.participation_category,
  () => {
    form.participant_sub_category = ''
    fetchSubCategories()
  },
)
</script>

<style scoped>
.required::after {
  content: ' *';
  color: #ef4444; /* Tailwind red-500 */
}

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

select {
  background-image: url('data:image/svg+xml;charset=US-ASCII,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>');
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}
</style>
```
