<template>
  <div class="w-full mx-auto px-2 sm:px-4 py-4 sm:py-6">
    <!-- Use the common PageHeader component -->
    <PageHeader
      title="Additional Qualification"
      subtitle="Complete the form below to apply for additional qualification."
    >
      <template #icon>
        <GraduationCap class="w-6 h-6 text-indigo-600" />
      </template>
    </PageHeader>

    <!-- Confirmation Modal (remains the same) -->
    <TransitionRoot as="template" :show="isConfirmationModalOpen">
      <Dialog as="div" class="relative z-50" @close="isConfirmationModalOpen = false">
        <TransitionChild
          as="template"
          enter="ease-out duration-300"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="ease-in duration-200"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </TransitionChild>

        <div class="fixed inset-0 z-10 overflow-y-auto">
          <div
            class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
          >
            <TransitionChild
              as="template"
              enter="ease-out duration-300"
              enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enter-to="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leave-from="opacity-100 translate-y-0 sm:scale-100"
              leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <DialogPanel
                class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6"
              >
                <div>
                  <div
                    class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100"
                  >
                    <svg
                      class="h-6 w-6 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M4.5 12.75l6 6 9-13.5"
                      />
                    </svg>
                  </div>
                  <div class="mt-3 text-center sm:mt-5">
                    <DialogTitle as="h3" class="text-base font-semibold leading-6 text-gray-900">
                      Confirm Submission
                    </DialogTitle>
                    <div class="mt-2">
                      <p class="text-sm text-gray-500">
                        Are you sure you want to submit the application? Please review all
                        information before proceeding.
                      </p>
                    </div>
                  </div>
                </div>
                <div class="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                  <button
                    type="button"
                    class="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
                    @click="handleSubmitActual"
                  >
                    Confirm
                  </button>
                  <button
                    type="button"
                    class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                    @click="isConfirmationModalOpen = false"
                  >
                    Cancel
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Main Form -->
    <form @submit.prevent="handleSubmit" class="bg-white border rounded-xl shadow-sm p-4 sm:p-6">
      <!-- Step Header -->
      <h3 class="text-lg font-semibold text-gray-900 my-3">
        Additional Qualification Registration
      </h3>

      <!-- Application Selection -->
      <div class="mb-6">
        <label for="application" class="block text-sm font-medium text-gray-700 required"
          >Your Application:</label
        >

        <input
          type="text"
          id="application"
          class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
          :value="
            applications.length === 1
              ? `${applications[0].registration_no} - ${applications[0].full_name}`
              : ''
          "
          readonly
          required
        />

        <div v-if="applications.length > 1" class="mt-2 space-y-2">
          <input
            type="text"
            class="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
            :value="`${application.registration_no} - ${application.full_name}`"
            readonly
            required
            v-for="application in applications"
            :key="application.id"
            v-show="application.cid === authStore.user?.cid"
          />
        </div>

        <span v-if="errors.application" class="text-xs text-red-500 mt-1">{{
          errors.application
        }}</span>
      </div>

      <!-- Qualification Details Section -->
      <div class="mt-6">
        <div class="bg-gray-50 p-4 rounded-xl border border-gray-200">
          <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-3">
            Qualification Details
          </h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div class="col-span-1">
              <label class="block text-sm font-medium text-gray-700 required"
                >Qualification Type</label
              >
              <select
                v-model="localFormData.qualification_type"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
              >
                <option value="">Select Qualification Type</option>
                <option v-for="type in qualificationTypes" :key="type.id" :value="type.id">
                  {{ type.qualification_type_name }}
                </option>
              </select>
              <span v-if="errors.qualification_type" class="text-xs text-red-500 mt-1">{{
                errors.qualification_type
              }}</span>
            </div>

            <div class="col-span-1">
              <label class="block text-sm font-medium text-gray-700 required"
                >Qualification Name</label
              >
              <select
                v-model="localFormData.qualification_name"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
              >
                <option value="">Select Qualification Name</option>
                <option
                  v-for="qualification in qualifications"
                  :key="qualification.id"
                  :value="qualification.id"
                >
                  {{ qualification.qualification }}
                </option>
              </select>
              <span v-if="errors.qualification_name" class="text-xs text-red-500 mt-1">{{
                errors.qualification_name
              }}</span>
            </div>

            <div class="col-span-1">
              <label class="block text-sm font-medium text-gray-700 required"
                >Institute/University</label
              >
              <select
                v-model="localFormData.institute"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
              >
                <option value="">Select Institute/University</option>
                <option
                  v-for="university in universities"
                  :key="university.id"
                  :value="university.id"
                >
                  {{ university.country }}, {{ university.university }},
                  {{ university.institute_name }}
                </option>
              </select>
              <span v-if="errors.institute" class="text-xs text-red-500 mt-1">{{
                errors.institute
              }}</span>
            </div>

            <div class="col-span-1">
              <label class="block text-sm font-medium text-gray-700 required"
                >Year of Completion</label
              >
              <input
                type="month"
                v-model="localFormData.year_of_completion"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2"
                placeholder="YYYY"
              />
              <span v-if="errors.year_of_completion" class="text-xs text-red-500 mt-1">{{
                errors.year_of_completion
              }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Supporting Documents Section -->
      <div class="mt-6">
        <div class="bg-gray-50 p-4 rounded-xl border border-gray-200">
          <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-3">
            Supporting Documents
          </h3>
          <div class="space-y-3">
            <div
              v-for="(doc, index) in supportingDocuments"
              :key="index"
              class="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 bg-white p-3 rounded-lg border border-gray-100"
            >
              <div class="w-full sm:w-1/3">
                <select
                  v-model="doc.type"
                  class="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 text-sm"
                >
                  <option value="">Select Document Type</option>
                  <option v-for="type in fetchedDocumentTypes" :key="type.id" :value="type.id">
                    {{ type.document_name }}
                  </option>
                </select>
              </div>
              <div class="flex-1 flex items-center space-x-2">
                <input
                  type="file"
                  @change="(e) => handleFileSelect(e, index)"
                  class="block w-full text-xs sm:text-sm text-gray-500 file:mr-2 file:py-1 file:px-2 sm:file:py-1.5 sm:file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  multiple
                />
                <button
                  @click="removeDocument(index)"
                  type="button"
                  class="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <span class="sr-only">Remove</span>
                  ✕
                </button>
              </div>
            </div>

            <button
              type="button"
              @click="addDocument"
              class="mt-3 px-3 py-1.5 bg-blue-50 text-xs sm:text-sm text-blue-700 rounded-lg hover:bg-blue-100 transition-colors inline-flex items-center"
            >
              <span class="mr-1.5">+</span>
              Add Another Document
            </button>
          </div>
          <p class="text-xs text-gray-500 mt-2">
            Required documents are graduation certificate, cid copy, security clarance, roq
            certificate, class 10, 12 and graduation marksheets.
          </p>
        </div>
      </div>

      <!-- Declaration Section -->
      <div class="mt-6 bg-gray-50 p-4 rounded-xl border border-gray-200">
        <h3 class="text-base sm:text-lg font-semibold text-gray-900 mb-3">Declaration</h3>
        <div class="space-y-3">
          <div>
            <label class="block text-sm font-medium text-gray-700">Remarks</label>
            <textarea
              v-model="localFormData.remarks"
              rows="3"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 text-sm"
              placeholder="Enter any additional remarks or comments"
            ></textarea>
          </div>

          <div class="flex items-start space-x-3 bg-white p-3 rounded-lg">
            <input
              type="checkbox"
              v-model="localFormData.declaration"
              class="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label class="text-xs sm:text-sm text-gray-700">
              I hereby declare that all the information provided above is true and correct to the
              best of my knowledge. I understand that any false statements may result in the
              rejection of my registration.
            </label>
          </div>
        </div>
      </div>

      <!-- Form Actions -->
      <div class="mt-6 flex justify-end space-x-3">
        <button
          type="button"
          @click="$emit('back')"
          class="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors"
        >
          Back to Dashboard
        </button>
        <button
          type="button"
          @click="handleSubmit"
          class="px-4 py-2 bg-blue-600 text-sm text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Submit Registration
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import apiService from '@/services/services'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import PageHeader from '@/components/common/MHPC/PageHeader.vue' // Import the common header
import { GraduationCap } from 'lucide-vue-next' // Import the chosen icon

defineProps({
  selectedType: {
    type: String,
    required: false,
  },
  modelValue: {
    type: Object,
    required: false,
  },
})

const emit = defineEmits(['back', 'submit'])

const toast = useToast()
const authStore = useAuthStore()
const router = useRouter()

const isSubmitting = ref(false)
const applications = ref([])
const qualificationTypes = ref([])
const qualifications = ref([])
const universities = ref([])
const errors = reactive({})
const fetchedDocumentTypes = ref([])
const isConfirmationModalOpen = ref(false)

const localFormData = reactive({
  qualification_type: '',
  qualification_name: '',
  institute: '',
  year_of_completion: '',
  remarks: '',
  declaration: false,
  documents: [],
  application: '',
  payment_id: null,
})

// Fetch applications
const fetchApplications = async () => {
  try {
    const cid = authStore.user?.cid
    if (!cid) {
      toast.error('CID not found. Please ensure you are logged in.')
      return
    }
    const response = await apiService.getMhpcApplicationsByCid(cid)
    applications.value = response.data

    // Set the application ID in localFormData *if* we have one application
    if (applications.value.length === 1) {
      localFormData.application = applications.value[0].id
    } else if (applications.value.length > 1) {
      applications.value.forEach((application) => {
        if (application.cid === authStore.user?.cid) {
          localFormData.application = application.id
        }
      })
    } else {
      // Handle the case where no applications are found.
      errors.application = 'No application found for this user.'
    }
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to fetch applications.')
    console.error('Error fetching applications:', error)
    errors.application = 'Failed to fetch application.' // Set error message
  }
}

const supportingDocuments = ref([
  { type: '', files: [] }, // Initial document
])

const addDocument = () => {
  supportingDocuments.value.push({ type: '', files: [] })
}

const removeDocument = (index) => {
  supportingDocuments.value.splice(index, 1)
}

const handleFileSelect = (event, index) => {
  const files = event.target.files
  if (files.length > 0) {
    // Clear any existing files first
    supportingDocuments.value[index].files = []

    // Add all selected files
    for (let i = 0; i < files.length; i++) {
      supportingDocuments.value[index].files.push(files[i])
    }
  }
}

//format date
const formatDateForAPI = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// Form Validation
const validateForm = () => {
  Object.keys(errors).forEach((key) => delete errors[key])
  let isValid = true

  if (!localFormData.application) {
    errors.application = 'Application information is missing.'
    isValid = false
  }
  if (!localFormData.qualification_type) {
    errors.qualification_type = 'Qualification Type is required'
    isValid = false
  }
  if (!localFormData.qualification_name) {
    errors.qualification_name = 'Qualification Name is required'
    isValid = false
  }
  if (!localFormData.institute) {
    errors.institute = 'Institute/University is required'
    isValid = false
  }
  if (!localFormData.year_of_completion) {
    errors.year_of_completion = 'Year of Completion is required'
    isValid = false
  }

  if (!localFormData.declaration) {
    toast.error('Please agree to the declaration.')
    isValid = false
  }

  // Validate documents
  supportingDocuments.value.forEach((doc, index) => {
    if (!doc.type) {
      toast.error(`Please select a document type for document ${index + 1}.`)
      isValid = false
    }
    if (doc.files.length === 0) {
      toast.error(`Please select file(s) to upload for document ${index + 1}.`)
      isValid = false
    }
  })

  if (!isValid) {
    toast.error('Please correct the errors in the form.')
  }

  return isValid
}

// Form Submission (modified to show confirmation modal)
const handleSubmit = () => {
  if (validateForm()) {
    isConfirmationModalOpen.value = true // Open the confirmation modal
  }
}

// Actual submission logic (triggered by confirmation modal)
const handleSubmitActual = async () => {
  isConfirmationModalOpen.value = false // Close modal immediately
  isSubmitting.value = true // Show loading state

  try {
    const formData = new FormData()

    // Add all the regular fields to FormData
    formData.append('completion_year', new Date(localFormData.year_of_completion).getFullYear())
    formData.append('declaration', 'True')
    formData.append('remarks', localFormData.remarks)
    formData.append('registration_date', formatDateForAPI(new Date()))
    formData.append(
      'expiry_date',
      formatDateForAPI(new Date(new Date().setFullYear(new Date().getFullYear() + 5))),
    )
    formData.append('payment_id', '')
    formData.append('is_active', 'False')
    formData.append('application', localFormData.application)
    formData.append('qualification_name', localFormData.qualification_name)
    formData.append('qualification_type', localFormData.qualification_type)
    formData.append('institute_university', localFormData.institute)

    // Handle file attachments for supportingDocuments
    supportingDocuments.value.forEach((doc, index) => {
      if (doc.files && doc.files.length > 0) {
        doc.files.forEach((file) => {
          formData.append(`attachments-${index}-file`, file)
        })
        formData.append(`attachments-${index}-file_type`, doc.type)
      }
    })

    // Send everything in a single request
    const response = await apiService.createMhpcNewQualification(formData)

    if (response.status >= 200 && response.status < 300) {
      toast.success('Application submitted successfully!')
      emit('submit', formData)
      router.push('/admin/user/health_certification/dashboard') // Redirect on success
    } else {
      // Handle server-side validation errors or other issues
      toast.error(`Application submission failed: ${response.data.message || 'Unknown error'}`)
    }
  } catch (error) {
    console.error('Error submitting application:', error)
    if (error.response) {
      // Handle server-side validation errors
      if (error.response.status === 400 && error.response.data) {
        Object.keys(error.response.data).forEach((field) => {
          errors[field] = error.response.data[field].join(', ')
        })
        toast.error('Please correct the errors in the form.')
      } else {
        toast.error(
          `Application submission failed: ${error.response.data.message || 'Unknown error'}`,
        )
      }
    } else {
      toast.error(`Application submission failed: ${error.message}`)
    }
  } finally {
    isSubmitting.value = false
  }
}

onMounted(async () => {
  fetchApplications()
  try {
    const qualificationTypesResponse = await apiService.getMhpcMastersQualificationTypes()
    const qualificationsResponse = await apiService.getMhpcMastersQualifications()
    const universitiesResponse = await apiService.getMhpcMastersUniversities()

    qualificationTypes.value = qualificationTypesResponse.data.results
    qualifications.value = qualificationsResponse.data.results
    universities.value = universitiesResponse.data.results

    //Fetch Document Types
    const documentTypesResponse = await apiService.getMhpcMastersDocumentTypes()
    fetchedDocumentTypes.value = documentTypesResponse.data.results
  } catch (error) {
    console.error('Error fetching master data:', error)
    toast.error('Failed to fetch master data. Please try again.')
  }
})
</script>

<style scoped>
.required::after {
  content: ' *';
  color: #ef4444;
}

/* Responsive text styles */
@media (max-width: 640px) {
  .text-sm {
    font-size: 0.8125rem;
  }

  .text-xs {
    font-size: 0.75rem;
  }
}

/* Remove problematic overflow styles */
body {
  overflow-x: hidden;
}
</style>
