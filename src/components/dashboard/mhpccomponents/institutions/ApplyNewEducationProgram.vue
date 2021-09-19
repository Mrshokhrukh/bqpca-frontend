<template>
  <div>
    <form @submit.prevent="handleSubmit" class="space-y-8">
      <fieldset class="p-6 bg-white border border-gray-200 rounded-xl">
        <legend class="text-lg font-semibold text-gray-800 px-2">Institutional Information</legend>
        <div class="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6">
          <div class="sm:col-span-2">
            <label for="institute" class="block text-sm font-medium text-gray-700">Institute</label>
            <input
              type="text"
              id="institute"
              :value="formData.institute_name"
              disabled
              class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
            />
          </div>
          <div class="sm:col-span-2">
            <label for="teachingCenter" class="block text-sm font-medium text-gray-700"
              >Training Center <span class="text-red-500">*</span></label
            >
            <select
              id="teachingCenter"
              v-model="formData.teaching_center_id"
              required
              class="mt-1 w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
            >
              <option :value="null" disabled>Select a center...</option>
              <option
                v-for="center in availableTeachingCenters"
                :key="center.id"
                :value="center.id"
              >
                {{ center.center_name }} - {{ center.center_location }}
              </option>
            </select>
          </div>
        </div>
      </fieldset>

      <fieldset class="p-6 bg-white border border-gray-200 rounded-xl">
        <legend class="text-lg font-semibold text-gray-800 px-2">Program Details</legend>
        <div class="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-6">
          <div class="sm:col-span-2">
            <label for="programMaster" class="block text-sm font-medium text-gray-700"
              >Program Category <span class="text-red-500">*</span></label
            >
            <select
              id="programMaster"
              v-model="formData.program_master_id"
              required
              class="mt-1 w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
            >
              <option :value="null" disabled>Select a category...</option>
              <option v-for="program in programMasters" :key="program.id" :value="program.id">
                {{ program.program_name }}
              </option>
            </select>
          </div>
          <div
            v-if="selectedProgramDetails"
            class="sm:col-span-2 mt-2 p-3 bg-indigo-50 border-l-4 border-indigo-400 rounded-r-md"
          >
            <p class="text-sm text-indigo-800">
              <span class="font-medium">Duration:</span>
              {{ selectedProgramDetails.duration_years }} years.
              <span class="font-medium">Description:</span> {{ selectedProgramDetails.description }}
            </p>
          </div>
          <div class="sm:col-span-2">
            <label for="specificProgramTitle" class="block text-sm font-medium text-gray-700"
              >Specific Program Title <span class="text-red-500">*</span></label
            >
            <input
              type="text"
              id="specificProgramTitle"
              v-model.trim="formData.specific_program_title"
              placeholder="e.g., BSc in Clinical Psychology"
              required
              class="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </fieldset>

      <fieldset class="p-6 bg-white border border-gray-200 rounded-xl">
        <legend class="text-lg font-semibold text-gray-800 px-2">Required Documents</legend>
        <p class="text-sm text-gray-500 mb-4">
          Upload all required documents in PDF format (max 10MB each).
        </p>
        <div class="mt-4 grid grid-cols-1 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Curriculum Validation Letter
              <span
                v-if="!isEditing || !formData.existing_validation_letter_url"
                class="text-red-500"
                >*</span
              ></label
            >
            <div
              v-if="
                isEditing &&
                formData.existing_validation_letter_url &&
                !formData.curriculum_validation_letter_file
              "
              class="flex items-center justify-between p-2 text-sm text-gray-600 bg-gray-50 border rounded-lg"
            >
              <span
                >Current file:
                <a
                  :href="formData.existing_validation_letter_url"
                  target="_blank"
                  class="font-medium text-indigo-600 hover:underline"
                  >View Letter</a
                ></span
              >
              <button
                type="button"
                @click="removeFile('validationLetter')"
                class="text-red-500 hover:text-red-700 font-bold text-lg"
              >
                ×
              </button>
            </div>
            <div
              v-else-if="formData.curriculum_validation_letter_file"
              class="flex items-center justify-between p-2 text-sm text-gray-600 bg-green-50 border border-green-200 rounded-lg"
            >
              <span class="font-medium text-green-800 truncate"
                >📄 {{ formData.curriculum_validation_letter_file.name }}</span
              >
              <button
                type="button"
                @click="removeFile('validationLetter')"
                class="text-red-500 hover:text-red-700 font-bold text-lg"
              >
                ×
              </button>
            </div>
            <input
              v-else
              type="file"
              id="validationLetter"
              @change="handleFileChange($event, 'validationLetter')"
              class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Curriculum Document
              <span v-if="!isEditing || !formData.existing_document_url" class="text-red-500"
                >*</span
              ></label
            >
            <div
              v-if="
                isEditing && formData.existing_document_url && !formData.curriculum_document_file
              "
              class="flex items-center justify-between p-2 text-sm text-gray-600 bg-gray-50 border rounded-lg"
            >
              <span
                >Current file:
                <a
                  :href="formData.existing_document_url"
                  target="_blank"
                  class="font-medium text-indigo-600 hover:underline"
                  >View Document</a
                ></span
              >
              <button
                type="button"
                @click="removeFile('document')"
                class="text-red-500 hover:text-red-700 font-bold text-lg"
              >
                ×
              </button>
            </div>
            <div
              v-else-if="formData.curriculum_document_file"
              class="flex items-center justify-between p-2 text-sm text-gray-600 bg-green-50 border border-green-200 rounded-lg"
            >
              <span class="font-medium text-green-800 truncate"
                >📄 {{ formData.curriculum_document_file.name }}</span
              >
              <button
                type="button"
                @click="removeFile('document')"
                class="text-red-500 hover:text-red-700 font-bold text-lg"
              >
                ×
              </button>
            </div>
            <input
              v-else
              type="file"
              id="curriculumDocument"
              @change="handleFileChange($event, 'document')"
              class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
            />
          </div>
        </div>
      </fieldset>

      <div class="flex justify-end space-x-4 pt-5 border-t border-gray-200">
        <button
          type="button"
          @click="emit('close')"
          :disabled="isSubmitting"
          class="px-6 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-lg font-semibold text-sm shadow-sm hover:bg-gray-100 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          :disabled="isSubmitting || !isFormValid"
          class="px-6 py-2.5 bg-indigo-600 text-white rounded-lg font-semibold text-sm shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          <span v-if="isSubmitting" class="flex items-center">
            <svg
              class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Processing...
          </span>
          <span v-else>{{ isEditing ? 'Update Program' : 'Submit Program' }}</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import apiServices from '@/services/services'
import { useToast } from 'vue-toastification'

const props = defineProps({
  applicationToEdit: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['close', 'program-saved'])
const authStore = useAuthStore()
const toast = useToast()

const initialFormData = () => ({
  id: null,
  institute_id: null,
  institute_name: '',
  teaching_center_id: null,
  program_master_id: null,
  specific_program_title: '',
  curriculum_validation_letter_file: null,
  curriculum_document_file: null,
  existing_validation_letter_url: null,
  existing_document_url: null,
})

const formData = ref(initialFormData())
const programMasters = ref([])
const loadingProgramMasters = ref(false)
const availableTeachingCenters = ref([])
const loadingInstituteData = ref(false)
const isSubmitting = ref(false)

const isEditing = computed(() => !!formData.value.id)

const selectedProgramDetails = computed(() => {
  if (!formData.value.program_master_id) return null
  return programMasters.value.find((p) => p.id === formData.value.program_master_id)
})

const isFormValid = computed(() => {
  const filesValid = isEditing.value
    ? (formData.value.existing_validation_letter_url ||
        formData.value.curriculum_validation_letter_file) &&
      (formData.value.existing_document_url || formData.value.curriculum_document_file)
    : formData.value.curriculum_validation_letter_file && formData.value.curriculum_document_file

  return !!(
    formData.value.institute_id &&
    formData.value.program_master_id &&
    formData.value.specific_program_title.trim() &&
    formData.value.teaching_center_id &&
    filesValid
  )
})

// --- DATA FETCHING (Corrected) ---

const fetchInstituteAndTeachingCenters = async () => {
  loadingInstituteData.value = true
  const userCid = authStore.user?.cid

  if (!userCid) {
    toast.error('User identifier not found. Cannot fetch data.')
    loadingInstituteData.value = false
    return
  }

  try {
    const instituteResponse = await apiServices.getMhpcInstituteByCid(userCid)
    const instituteData = instituteResponse.data?.results?.[0] ?? instituteResponse.data ?? {}
    const actualInstituteId = instituteData.id

    if (!actualInstituteId) {
      toast.error('Could not determine your institution.')
      loadingInstituteData.value = false
      return
    }

    formData.value.institute_id = actualInstituteId
    formData.value.institute_name =
      instituteData.name_of_institution || `Institute ID: ${actualInstituteId}`

    const centersResponse = await apiServices.getMhpcTeachingCenterByCid(userCid)
    const allCentersForInstitute = centersResponse.data?.results ?? centersResponse.data ?? []

    // *** THE FINAL FIX IS HERE ***
    // The filter now checks the 'tc_review_decision' field, which is guaranteed
    // to be in the API response, instead of the missing 'is_active' field.
    availableTeachingCenters.value = allCentersForInstitute
      .filter((center) => center.tc_review_decision === 'Approved')
      .sort((a, b) => a.center_name.localeCompare(b.center_name))

    if (availableTeachingCenters.value.length === 0) {
      toast.warning('No approved teaching centers were found for this institution.')
    }
  } catch (error) {
    console.error('Error fetching institution data:', error)
    toast.error('A failure occurred while loading institution data.')
  } finally {
    loadingInstituteData.value = false
  }
}

const fetchProgramMastersData = async () => {
  loadingProgramMasters.value = true
  try {
    const response = await apiServices.getMhpcProgramMasters()
    programMasters.value = (response.data.results || response.data || []).sort((a, b) =>
      a.program_name.localeCompare(b.program_name)
    )
  } catch (error) {
    console.error('Error fetching program masters:', error)
    toast.error('Failed to load program categories.')
  } finally {
    loadingProgramMasters.value = false
  }
}

// --- FORM HANDLING & INITIALIZATION ---

const clearFileInputsDOM = () => {
  const validationInput = document.getElementById('validationLetter')
  if (validationInput) validationInput.value = ''
  const documentInput = document.getElementById('curriculumDocument')
  if (documentInput) documentInput.value = ''
}

const resetForm = () => {
  formData.value = initialFormData()
  availableTeachingCenters.value = []
  programMasters.value = []
  clearFileInputsDOM()
}

const initializeForEdit = async (appData) => {
  resetForm()
  if (!appData) return initializeForNew()

  await Promise.all([fetchInstituteAndTeachingCenters(), fetchProgramMastersData()])

  formData.value.id = appData.id
  formData.value.teaching_center_id = appData.teaching_center?.id || appData.teaching_center
  formData.value.program_master_id = appData.program_master?.id || appData.program_master
  formData.value.specific_program_title = appData.specific_program_title
  formData.value.existing_validation_letter_url = appData.curriculum_validation_letter
  formData.value.existing_document_url = appData.curriculum_document
}

const initializeForNew = async () => {
  resetForm()
  if (!authStore.user?.id) {
    toast.info('Waiting for user information...')
    return
  }
  await Promise.all([fetchInstituteAndTeachingCenters(), fetchProgramMastersData()])
}

watch(
  () => props.applicationToEdit,
  (appData) => {
    if (appData) {
      initializeForEdit(appData)
    } else {
      if (authStore.user?.id) {
        initializeForNew()
      } else {
        const unwatch = watch(
          () => authStore.user,
          (newUser) => {
            if (newUser?.id) {
              initializeForNew()
              unwatch()
            }
          },
          { immediate: true }
        )
      }
    }
  },
  { immediate: true }
)

const handleSubmit = async () => {
  if (!isFormValid.value) {
    toast.error('Please fill in all required fields and ensure valid PDF files are attached.')
    return
  }
  isSubmitting.value = true
  const submissionPayload = new FormData()

  submissionPayload.append('institute_id', formData.value.institute_id)
  submissionPayload.append('program_master_id', formData.value.program_master_id)
  submissionPayload.append('specific_program_title', formData.value.specific_program_title.trim())
  submissionPayload.append('teaching_center_id', formData.value.teaching_center_id)

  if (formData.value.curriculum_validation_letter_file) {
    submissionPayload.append(
      'curriculum_validation_letter',
      formData.value.curriculum_validation_letter_file
    )
  }
  if (formData.value.curriculum_document_file) {
    submissionPayload.append('curriculum_document', formData.value.curriculum_document_file)
  }

  try {
    if (isEditing.value) {
      await apiServices.patchMhpcProgramOffered(formData.value.id, submissionPayload)
      toast.success('Program offering updated successfully!')
    } else {
      await apiServices.createMhpcProgramOffered(submissionPayload)
      toast.success('Program offering submitted successfully!')
    }
    emit('program-saved')
  } catch (error) {
    console.error(`Error ${isEditing.value ? 'updating' : 'submitting'} program offering:`, error)
    const errorData = error.response?.data
    let errorMessage = `Failed to ${isEditing.value ? 'update' : 'submit'} program offering.`
    if (errorData && typeof errorData === 'object') {
      const messages = Object.entries(errorData).map(
        ([key, value]) =>
          `${key.replace(/_/g, ' ')}: ${Array.isArray(value) ? value.join(', ') : value}`
      )
      errorMessage = messages.join('\n') || errorMessage
    } else if (errorData?.detail) {
      errorMessage = errorData.detail
    }
    toast.error(errorMessage, { timeout: 8000 })
  } finally {
    isSubmitting.value = false
  }
}

const handleFileChange = (event, fileType) => {
  const file = event.target.files[0]
  const targetKey =
    fileType === 'validationLetter'
      ? 'curriculum_validation_letter_file'
      : 'curriculum_document_file'

  if (!file) {
    formData.value[targetKey] = null
    return
  }
  if (file.type !== 'application/pdf') {
    toast.error('Only PDF files are allowed.')
    event.target.value = ''
    formData.value[targetKey] = null
    return
  }
  const maxSize = 10 * 1024 * 1024 // 10MB
  if (file.size > maxSize) {
    toast.error('File size must be less than 10MB.')
    event.target.value = ''
    formData.value[targetKey] = null
    return
  }

  formData.value[targetKey] = file
}

const removeFile = (fileType) => {
  if (fileType === 'validationLetter') {
    formData.value.curriculum_validation_letter_file = null
    formData.value.existing_validation_letter_url = null
    const input = document.getElementById('validationLetter')
    if (input) input.value = ''
  } else if (fileType === 'document') {
    formData.value.curriculum_document_file = null
    formData.value.existing_document_url = null
    const input = document.getElementById('curriculumDocument')
    if (input) input.value = ''
  }
}

defineExpose({ initializeForEdit, initializeForNew, resetForm })
</script>