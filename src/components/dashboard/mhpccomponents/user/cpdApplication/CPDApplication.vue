<template>
  <div class="w-full mx-auto px-4 sm:px-6 py-8 pb-10">
    <PageHeader
      title="CPD Application"
      subtitle="Complete required fields *. Ensure information is accurate."
    >
      <template #icon>
        <ClipboardList class="w-6 h-6 text-indigo-600" />
      </template>
      <template #subtitle>
        Complete required fields <span class="text-red-600 font-semibold">*</span>. Ensure
        information is accurate.
      </template>
    </PageHeader>

    <form
      @submit.prevent="handleSubmit"
      class="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100"
    >
      <!-- Form Header - CPD Details -->
      <div class="bg-gray-50/70 p-6 border-b border-gray-100">
        <h3 class="text-lg font-semibold text-gray-800">CPD Details</h3>
        <p class="mt-1 text-gray-500 text-sm">Provide information about your CPD activity.</p>
      </div>

      <!-- Form Body - CPD Details -->
      <div class="p-6 space-y-8">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-6">
          <div class="space-y-1.5">
            <label for="title_of_cpd" class="text-xs font-medium text-gray-700 flex items-center">
              Title of CPD <span class="text-red-500 ml-1">*</span>
            </label>
            <input
              id="title_of_cpd"
              v-model="form.title_of_cpd"
              type="text"
              class="w-full px-3 py-2 rounded-md border border-gray-200 bg-gray-50 text-gray-900 text-sm placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 shadow-sm hover:border-gray-300"
              required
              placeholder="Enter CPD title"
            />
            <span v-if="errors.title_of_cpd" class="text-xs text-red-500 block">{{ errors.title_of_cpd }}</span>
          </div>

          <div class="space-y-1.5">
            <label for="relevance_to_profession" class="text-xs font-medium text-gray-700 flex items-center">
              Professional Relevance <span class="text-red-500 ml-1">*</span>
            </label>
            <input
              id="relevance_to_profession"
              v-model="form.relevance_to_profession"
              type="text"
              class="w-full px-3 py-2 rounded-md border border-gray-200 bg-gray-50 text-gray-900 text-sm placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 shadow-sm hover:border-gray-300"
              required
              placeholder="Describe relevance"
            />
            <span v-if="errors.relevance_to_profession" class="text-xs text-red-500 block">{{ errors.relevance_to_profession }}</span>
          </div>

          <div class="space-y-1.5">
            <label for="type_of_cpd_activity" class="text-xs font-medium text-gray-700 flex items-center">
              CPD Activity Type <span class="text-red-500 ml-1">*</span>
            </label>
            <select
              id="type_of_cpd_activity"
              v-model="form.type_of_cpd_activity"
              class="w-full px-3 py-2 rounded-md border border-gray-200 bg-gray-50 text-gray-900 text-sm focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 shadow-sm hover:border-gray-300 appearance-none"
              required
            >
              <option value="" disabled>Select activity type</option>
              <option v-for="activity in cpdActivities" :key="activity.id" :value="activity.id">
                {{ activity.cpd_activity_name }}
              </option>
            </select>
            <span v-if="errors.type_of_cpd_activity" class="text-xs text-red-500 block">{{ errors.type_of_cpd_activity }}</span>
          </div>

          <div class="space-y-1.5">
            <label for="cpd_hours" class="text-xs font-medium text-gray-700 flex items-center">
              CPD Hours <span class="text-red-500 ml-1">*</span>
            </label>
            <div class="relative">
              <input
                id="cpd_hours"
                v-model.number="form.cpd_hours"
                type="number"
                min="0"
                step="0.5"
                class="w-full px-3 py-2 rounded-md border border-gray-200 bg-gray-50 text-gray-900 text-sm placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 shadow-sm hover:border-gray-300"
                required
                placeholder="Enter CPD hours"
              />
              <span class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">hours</span>
            </div>
            <span v-if="errors.cpd_hours" class="text-xs text-red-500 block">{{ errors.cpd_hours }}</span>
          </div>

          <div class="space-y-1.5">
            <label for="attachment" class="text-xs font-medium text-gray-700">Supporting Documents</label>
            <div class="relative">
              <input
                id="attachment"
                type="file"
                ref="fileInputRef"
                @change="handleFileUpload"
                class="w-full px-3 py-2 rounded-md border-2 border-dashed border-gray-200 bg-gray-50/50 text-gray-800 text-sm placeholder-gray-400 hover:border-indigo-300 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 transition duration-200 cursor-pointer file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
              <p class="mt-1.5 text-xs text-gray-500 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                PDF, DOC, JPG, PNG (Max: 2MB)
              </p>
              <p v-if="attachmentFileName" class="mt-1 text-xs text-indigo-600 font-medium">
                Selected: {{ attachmentFileName }}
              </p>
            </div>
            <span v-if="errors.attachment" class="text-xs text-red-500 block">{{ errors.attachment }}</span>
          </div>
        </div>
      </div>

      <!-- Form Footer / Actions -->
      <div class="bg-gray-50/70 px-6 py-4 flex justify-end space-x-3 border-t border-gray-100">
        <button
          type="button"
          @click="handleCancel"
          class="px-4 py-2 rounded-md bg-white text-gray-700 text-sm border border-gray-200 hover:bg-gray-100 hover:border-gray-300 transition duration-200 shadow-sm focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-gray-400"
        >
          Cancel
        </button>
        <button
          type="button"
          @click="handleSaveDraft"
          :disabled="isSubmitting"
          class="px-4 py-2 rounded-md bg-yellow-500 text-white text-sm hover:bg-yellow-600 transition duration-200 shadow-sm focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-yellow-400 disabled:opacity-60"
        >
          Save Draft
        </button>
        <button
          type="button"
          @click="handleDeleteDraft"
          v-if="draftId"
          :disabled="isSubmitting"
          class="px-4 py-2 rounded-md bg-red-600 text-white text-sm hover:bg-red-700 transition duration-200 shadow-sm focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-red-500 disabled:opacity-60"
        >
          Delete Draft
        </button>
        <button
          type="submit"
          :disabled="isSubmitting"
          class="px-4 py-2 rounded-md bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-sm hover:from-indigo-700 hover:to-blue-700 transition duration-200 shadow-sm focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]"
        >
          <span v-if="isSubmitting" class="flex items-center">
            <svg class="animate-spin -ml-0.5 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Submitting...
          </span>
          <span v-else>Submit</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, onMounted, ref } from 'vue'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '@/stores/authStore'
import apiService from '@/services/services'
import { useRouter } from 'vue-router'
import PageHeader from '@/components/common/MHPC/PageHeader.vue'
import { ClipboardList } from 'lucide-vue-next'

const toast = useToast()
const authStore = useAuthStore()
const router = useRouter()
const fileInputRef = ref(null)
const attachmentFileName = ref('')
const isSubmitting = ref(false)
const isLoadingRegistrationNo = ref(false)
const draftId = ref(null) // To store the ID of the server-side draft

const cpdActivities = ref([])

const form = reactive({
  registration_record_id: null,
  display_registration_no: '',
  cid_no: '',
  full_name: '',
  gender: '',
  title_of_cpd: '',
  relevance_to_profession: '',
  personnel_category: '',
  personnel_sub_category: '',
  type_of_cpd_activity: '',
  cpd_hours: '',
  attachment: null,
})

const errors = reactive({})

const populateFormWithDraft = (draftData) => {
  if (!draftData) return
  draftId.value = draftData.id
  form.title_of_cpd = draftData.title_of_cpd || ''
  form.relevance_to_profession = draftData.relevance_to_profession || ''
  form.type_of_cpd_activity = draftData.type_of_cpd_activity || ''
  form.cpd_hours = draftData.cpd_hours || ''
  attachmentFileName.value = draftData.attachment ? draftData.attachment.split('/').pop() : ''
  // Personal details are populated from authStore, so we don't load them from the draft
}

const validateForm = (isDraft = false) => {
  Object.keys(errors).forEach((key) => delete errors[key])
  let isValid = true

  if (!form.title_of_cpd.trim()) {
    errors.title_of_cpd = 'Title of CPD is required.'
    isValid = false
  }

  if (isDraft) return isValid // For drafts, only title is required

  if (!form.relevance_to_profession.trim()) {
    errors.relevance_to_profession = 'Professional relevance is required.'
    isValid = false
  }
  if (!form.type_of_cpd_activity) {
    errors.type_of_cpd_activity = 'CPD activity type is required.'
    isValid = false
  }
  if (form.cpd_hours === null || form.cpd_hours === '' || parseFloat(form.cpd_hours) <= 0) {
    errors.cpd_hours = 'CPD hours must be a positive number.'
    isValid = false
  }
  if (!form.personnel_category) {
    toast.error('Personnel Category is missing. Please ensure your registration details are fully loaded.')
    isValid = false
  }
  if (!form.personnel_sub_category) {
    toast.error('Personnel Sub-Category is missing. Please ensure your registration details are fully loaded.')
    isValid = false
  }
  if (!form.registration_record_id) {
    errors.general_registration = 'Registration information (Application ID) is missing. Cannot submit.'
    toast.error(errors.general_registration)
    isValid = false
  }
  return isValid
}

const buildFormData = (status) => {
  const formData = new FormData()
  formData.append('review_status', status)
  formData.append('registration_no', String(form.display_registration_no))
  formData.append('cid_no', form.cid_no || '')
  formData.append('full_name', form.full_name || '')
  formData.append('gender', form.gender ? form.gender.toLowerCase() : 'others')
  formData.append('title_of_cpd', form.title_of_cpd)
  formData.append('relevance_to_profession', form.relevance_to_profession)
  if (form.personnel_category) formData.append('personnel_category', form.personnel_category)
  if (form.personnel_sub_category) formData.append('personnel_sub_category', form.personnel_sub_category)
  formData.append('type_of_cpd_activity', form.type_of_cpd_activity)
  formData.append('cpd_hours', String(form.cpd_hours))
  formData.append('cpd_credit', String(form.cpd_hours)) // Assuming credit is same as hours
  if (form.attachment) formData.append('attachment', form.attachment, form.attachment.name)
  return formData
}

const handleSaveDraft = async () => {
  if (!validateForm(true)) {
    toast.error('Please enter at least a title to save a draft.')
    return
  }
  isSubmitting.value = true
  const formData = buildFormData('Draft')

  try {
    let response
    if (draftId.value) {
      response = await apiService.patchMhpcCpdRecord(draftId.value, formData)
    } else {
      response = await apiService.createMhpcCpdRecord(formData)
      draftId.value = response.data.id // Save new draft ID
    }
    toast.success('Draft saved successfully!')
  } catch (error) {
    console.error('Error saving draft:', error)
    toast.error('Could not save draft.')
  } finally {
    isSubmitting.value = false
  }
}

const handleDeleteDraft = async () => {
  if (!draftId.value) {
    toast.warning('No draft selected to delete.')
    return
  }

  if (!window.confirm('Are you sure you want to permanently delete this draft?')) {
    return
  }

  isSubmitting.value = true
  try {
    await apiService.deleteMhpcCpdRecord(draftId.value)
    toast.success('Draft deleted successfully.')
    resetForm() // Clears the form and draftId
  } catch (error) {
    console.error('Error deleting draft:', error)
    toast.error('Failed to delete draft. It may have already been removed.')
  } finally {
    isSubmitting.value = false
  }
}

const handleSubmit = async () => {
  if (!validateForm()) {
    toast.error('Please correct the errors in the form before submitting.')
    return
  }
  isSubmitting.value = true
  const formData = buildFormData('Pending')

  try {
    let response
    if (draftId.value) {
      response = await apiService.patchMhpcCpdRecord(draftId.value, formData)
    } else {
      response = await apiService.createMhpcCpdRecord(formData)
    }
    toast.success('CPD application submitted successfully!')
    resetForm()
    router.push('/admin/user/health_certification/dashboard')
  } catch (error) {
    console.error('Submission error:', error)
    toast.error('Submission failed. Please check the details and try again.')
  } finally {
    isSubmitting.value = false
  }
}

const resetForm = () => {
  draftId.value = null
  form.title_of_cpd = ''
  form.relevance_to_profession = ''
  form.type_of_cpd_activity = ''
  form.cpd_hours = ''
  form.attachment = null
  attachmentFileName.value = ''
  if (fileInputRef.value) fileInputRef.value.value = ''
  Object.keys(errors).forEach((key) => delete errors[key])
}

const handleCancel = () => {
  resetForm()
  toast.info('Form cleared.')
}

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (!file) {
    form.attachment = null
    attachmentFileName.value = ''
    return
  }
  if (file.size > 2 * 1024 * 1024) {
    errors.attachment = 'File size must not exceed 2MB.'
    toast.error(errors.attachment)
    event.target.value = ''
    return
  }
  form.attachment = file
  attachmentFileName.value = file.name
  delete errors.attachment
}

const fetchMasterData = async () => {
  try {
    const activitiesResponse = await apiService.getMhpcMastersSingleCpdActivity()
    cpdActivities.value = activitiesResponse.data?.results || []
  } catch (error) {
    toast.error('Failed to fetch CPD activity types.')
    console.error('Error fetching CPD activities:', error)
  }
}

const fetchRegistrationDetails = async (cid) => {
  if (!cid) return null
  isLoadingRegistrationNo.value = true
  try {
    const response = await apiService.getMhpcFullApplicationListByCid(cid)
    if (response.data?.results?.length > 0) {
      const mainApplication = response.data.results[0]
      const primaryQual = mainApplication.user_qualifications.find((q) => q.is_primary_qualification) || mainApplication.user_qualifications[0]
      if (primaryQual) {
        return {
          recordId: mainApplication.id,
          displayNo: mainApplication.registration_no || `App. ID: ${mainApplication.id}`,
          personnelCategory: primaryQual.personnel_category,
          personnelSubCategory: primaryQual.personnel_sub_category,
        }
      }
    }
    return null
  } catch (error) {
    console.error('Error fetching registration details:', error)
    return null
  } finally {
    isLoadingRegistrationNo.value = false
  }
}

onMounted(async () => {
  if (!authStore.user?.cid) {
    toast.error('User data not found. Please log in again.')
    return
  }

  form.cid_no = authStore.user.cid
  form.full_name = `${authStore.user.first_name || ''} ${authStore.user.middle_name || ''} ${authStore.user.last_name || ''}`.trim()
  form.gender = authStore.user.gender || ''

  await fetchMasterData()

  const regDetails = await fetchRegistrationDetails(form.cid_no)
  if (regDetails) {
    form.registration_record_id = regDetails.recordId
    form.display_registration_no = regDetails.displayNo
    form.personnel_category = regDetails.personnelCategory
    form.personnel_sub_category = regDetails.personnelSubCategory
  }

  try {
    const draftResponse = await apiService.getMhpcCpdRecordsByCid(form.cid_no, 'Draft')
    if (draftResponse.data?.length > 0) {
      populateFormWithDraft(draftResponse.data[0])
      toast.info('Existing draft loaded.')
    }
  } catch (error) {
    console.error('Could not fetch existing draft:', error)
  }
})
</script>

<style scoped>
select:required:invalid {
  color: #9ca3af;
}
option[value=''][disabled] {
  color: #9ca3af;
}
option {
  color: #1f2937;
}
select:disabled {
  background-color: #f3f4f6;
  cursor: not-allowed;
  opacity: 0.7;
}
input[type='file']:focus-within {
  outline: none;
}
.min-h-\[38px\] {
  min-height: 38px;
}
</style>