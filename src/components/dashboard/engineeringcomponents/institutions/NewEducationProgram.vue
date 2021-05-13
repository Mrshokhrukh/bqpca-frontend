<template>
  <div class="p-8 rounded-xl bg-gradient-to-b from-gray-50 to-white min-h-screen">
    <h2 class="text-3xl font-bold text-gray-800 mb-8 border-b pb-3 flex items-center">
      <DocumentIcon class="w-8 h-8 mr-3 text-indigo-600" />
      EPC New Educational Programme Application
    </h2>

    <!-- Loading state for Institute Data -->
    <div
      v-if="isLoading"
      class="flex justify-center items-center my-16 bg-white p-10 rounded-xl shadow-sm"
    >
      <Loader class="inline-block animate-spin text-indigo-600 w-8 h-8" />
      <p class="ml-3 text-lg text-gray-600">Loading institute data...</p>
    </div>

    <!-- Error state for Institute Data -->
    <div
      v-else-if="apiError"
      class="bg-red-50 border-l-4 border-red-400 text-red-700 p-6 rounded-lg mb-8 shadow-sm"
    >
      <div class="flex">
        <AlertCircle class="w-6 h-6 mr-3" />
        <div>
          <p class="font-medium">Error:</p>
          <p class="mt-1">{{ errorMessage }}</p>
          <p class="mt-2 text-sm">Please try again later or contact support.</p>
        </div>
      </div>
    </div>

    <!-- No institute found -->
    <div
      v-else-if="!userInstitute && !isLoading"
      class="bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700 p-6 rounded-lg mb-8 shadow-sm"
    >
      <div class="flex">
        <AlertTriangle class="w-6 h-6 mr-3" />
        <div>
          <p class="font-medium">No institute information found</p>
          <p class="mt-2">
            Please ensure you have registered your institute before applying for a new educational
            program.
          </p>
        </div>
      </div>
    </div>

    <!-- Form Section -->
    <div v-else>
      <form @submit.prevent="handleSubmit" class="space-y-8">
        <!-- Proponent Details (Read Only) -->
        <section class="p-6 bg-white rounded-xl shadow transition-shadow hover:shadow-md">
          <h3 class="text-xl font-semibold text-gray-700 mb-6 border-b pb-2 flex items-center">
            <BuildingIcon class="w-5 h-5 mr-2 text-indigo-500" />
            Proponent Details
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-600">
                Training Institute Name
              </label>
              <div
                class="mt-2 px-3 py-2 bg-gray-50 rounded-md border border-gray-200 text-gray-700 font-medium"
              >
                {{ userInstitute.name_of_institution || 'N/A' }}
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-600"> Country </label>
              <div
                class="mt-2 px-3 py-2 bg-gray-50 rounded-md border border-gray-200 text-gray-700"
              >
                {{ userInstitute.country || 'N/A' }}
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-600"> Dzongkhag/Throme </label>
              <div
                class="mt-2 px-3 py-2 bg-gray-50 rounded-md border border-gray-200 text-gray-700"
              >
                {{ userInstitute.dzongkhag || 'N/A' }}
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-600"> City/Gewog </label>
              <div
                class="mt-2 px-3 py-2 bg-gray-50 rounded-md border border-gray-200 text-gray-700"
              >
                {{ userInstitute.gewog || 'N/A' }}
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-600"> Address/Location </label>
              <div
                class="mt-2 px-3 py-2 bg-gray-50 rounded-md border border-gray-200 text-gray-700"
              >
                {{ userInstitute.address || 'N/A' }}
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-600"> Contact No. </label>
              <div
                class="mt-2 px-3 py-2 bg-gray-50 rounded-md border border-gray-200 text-gray-700"
              >
                {{ userInstitute.contact_no || 'N/A' }}
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-600"> Email Address </label>
              <div
                class="mt-2 px-3 py-2 bg-gray-50 rounded-md border border-gray-200 text-gray-700"
              >
                {{ userInstitute.email_address || 'N/A' }}
              </div>
            </div>
          </div>
        </section>

        <!-- Head of Institution Details (Read Only) -->
        <section class="p-6 bg-white rounded-xl shadow transition-shadow hover:shadow-md">
          <h3 class="text-xl font-semibold text-gray-700 mb-6 border-b pb-2 flex items-center">
            <UserIcon class="w-5 h-5 mr-2 text-indigo-500" />
            Head of Institution Details
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div>
              <label class="block text-sm font-medium text-gray-600"> Name </label>
              <div
                class="mt-2 px-3 py-2 bg-gray-50 rounded-md border border-gray-200 text-gray-700"
              >
                {{ userInstitute.head_of_institution_name || 'N/A' }}
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-600"> Mobile Number </label>
              <div
                class="mt-2 px-3 py-2 bg-gray-50 rounded-md border border-gray-200 text-gray-700"
              >
                {{ userInstitute.head_of_institution_phone_number || 'N/A' }}
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-600"> Email Address </label>
              <div
                class="mt-2 px-3 py-2 bg-gray-50 rounded-md border border-gray-200 text-gray-700"
              >
                {{ userInstitute.head_of_institution_email || 'N/A' }}
              </div>
            </div>
          </div>
        </section>

        <!-- Website (Read Only) -->
        <section class="p-6 bg-white rounded-xl shadow transition-shadow hover:shadow-md">
          <h3 class="text-xl font-semibold text-gray-700 mb-6 border-b pb-2 flex items-center">
            <GlobeIcon class="w-5 h-5 mr-2 text-indigo-500" />
            Website
          </h3>
          <div>
            <label class="block text-sm font-medium text-gray-600"> Website URL </label>
            <div class="mt-2 px-3 py-2 bg-gray-50 rounded-md border border-gray-200 text-gray-700">
              {{ userInstitute.website || 'N/A' }}
            </div>
          </div>
        </section>

        <!-- Proposal Details - Editable by user -->
        <section class="p-6 bg-white rounded-xl shadow-md border border-indigo-100">
          <h3
            class="text-xl font-semibold text-indigo-700 mb-6 border-b border-indigo-100 pb-2 flex items-center"
          >
            <ClipboardIcon class="w-5 h-5 mr-2 text-indigo-500" />
            Proposal Details
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div>
              <label for="proposalTitle" class="block text-sm font-medium text-gray-700">
                Proposal Title <span class="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="proposalTitle"
                v-model.trim="formData.proposal_title"
                required
                :class="[
                  'mt-2 block w-full px-4 py-2 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm',
                  validationErrors.proposal_title ? 'border-red-500' : 'border-gray-300',
                ]"
                placeholder="Enter proposal title"
              />
              <p
                v-if="validationErrors.proposal_title"
                class="mt-1 text-sm text-red-600 flex items-center"
              >
                <AlertCircle class="w-4 h-4 mr-1" />
                {{ validationErrors.proposal_title[0] }}
              </p>
            </div>

            <div>
              <label for="duration" class="block text-sm font-medium text-gray-700">
                Duration (in months) <span class="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="duration"
                v-model.number="formData.duration_in_months"
                required
                min="1"
                :class="[
                  'mt-2 block w-full px-4 py-2 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm',
                  validationErrors.duration_in_months ? 'border-red-500' : 'border-gray-300',
                ]"
                placeholder="Enter duration"
              />
              <p
                v-if="validationErrors.duration_in_months"
                class="mt-1 text-sm text-red-600 flex items-center"
              >
                <AlertCircle class="w-4 h-4 mr-1" />
                {{ validationErrors.duration_in_months[0] }}
              </p>
            </div>

            <div>
              <label for="commencementDate" class="block text-sm font-medium text-gray-700">
                Commencement Date <span class="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="commencementDate"
                v-model="formData.commencement_date"
                required
                :min="todayDate"
                :class="[
                  'mt-2 block w-full px-4 py-2 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm',
                  validationErrors.commencement_date ? 'border-red-500' : 'border-gray-300',
                ]"
              />
              <p
                v-if="validationErrors.commencement_date"
                class="mt-1 text-sm text-red-600 flex items-center"
              >
                <AlertCircle class="w-4 h-4 mr-1" />
                {{ validationErrors.commencement_date[0] }}
              </p>
            </div>

            <div>
              <label for="attachments" class="block text-sm font-medium text-gray-700">
                Attachments (if any)
              </label>
              <div class="mt-2 flex items-center">
                <label
                  for="attachments"
                  class="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                >
                  <div
                    class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm flex items-center hover:bg-gray-50 w-full"
                  >
                    <UploadIcon class="w-5 h-5 mr-2 text-indigo-500" />
                    <span>Choose file</span>
                  </div>
                  <input type="file" id="attachments" @change="handleFileUpload" class="sr-only" />
                </label>
              </div>
              <p class="mt-2 text-xs text-gray-500 flex items-center">
                <InfoIcon class="w-4 h-4 mr-1 text-gray-400" />
                Max file size: 5MB. Allowed types: PDF, DOC, DOCX, JPG, PNG.
              </p>
              <p
                v-if="selectedFileName"
                class="mt-2 text-sm text-green-700 font-medium flex items-center"
              >
                <CheckCircleIcon class="w-4 h-4 mr-1" />
                Selected: {{ selectedFileName }}
              </p>
              <p
                v-if="validationErrors.institute_attachments"
                class="mt-1 text-sm text-red-600 flex items-center"
              >
                <AlertCircle class="w-4 h-4 mr-1" />
                {{ validationErrors.institute_attachments[0] }}
              </p>
            </div>
          </div>

          <!-- General Remarks -->
          <div class="mt-6 md:col-span-2">
            <label for="remarks" class="block text-sm font-medium text-gray-700">
              Remarks (Optional)
            </label>
            <textarea
              id="remarks"
              v-model="formData.remarks"
              rows="4"
              class="mt-2 block w-full px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Add any additional comments or notes here..."
            ></textarea>
            <p v-if="validationErrors.remarks" class="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle class="w-4 h-4 mr-1" />
              {{ validationErrors.remarks[0] }}
            </p>
          </div>
        </section>

        <!-- Declaration -->
        <div class="flex items-start p-6 bg-white rounded-xl shadow border-l-4 border-indigo-400">
          <div class="flex items-center h-5 mt-1">
            <input
              id="declaration"
              aria-describedby="declaration-description"
              type="checkbox"
              v-model="formData.ins_declaration"
              required
              class="focus:ring-indigo-500 h-5 w-5 text-indigo-600 border-gray-300 rounded"
            />
          </div>
          <div class="ml-3 text-sm">
            <label for="declaration" class="font-medium text-gray-700 text-base"
              >Declaration <span class="text-red-500">*</span></label
            >
            <p id="declaration-description" class="text-gray-500 mt-1">
              I hereby declare that the information provided above is true and correct to the best
              of my knowledge and belief.
            </p>
            <p
              v-if="validationErrors.ins_declaration"
              class="mt-1 text-sm text-red-600 flex items-center"
            >
              <AlertCircle class="w-4 h-4 mr-1" />
              {{ validationErrors.ins_declaration[0] }}
            </p>
          </div>
        </div>

        <!-- Buttons -->
        <div class="flex justify-end space-x-4 pt-6 border-t mt-8 items-center">
          <button
            type="button"
            class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center"
            @click="handleCancel"
            :disabled="isSubmitting"
          >
            <XIcon class="w-4 h-4 mr-2" />
            Cancel
          </button>
          <button
            type="button"
            class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-700 bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 flex items-center"
            @click="handleSaveDraft"
            :disabled="isSubmitting"
          >
            <SaveIcon class="w-4 h-4 mr-2" />
            <Loader
              v-if="isSubmitting && draftSaveInProgress"
              class="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700"
            />
            {{ isSubmitting && draftSaveInProgress ? 'Saving...' : 'Save as Draft' }}
          </button>

          <button
            type="submit"
            :disabled="isSubmitting || !formData.ins_declaration"
            class="inline-flex justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            :class="{ 'opacity-50 cursor-not-allowed': isSubmitting || !formData.ins_declaration }"
          >
            <SendIcon class="w-4 h-4 mr-2" />
            <Loader
              v-if="isSubmitting && !draftSaveInProgress"
              class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
            />
            {{ isSubmitting && !draftSaveInProgress ? 'Submitting...' : 'Submit Application' }}
          </button>
        </div>

        <!-- General Form Errors -->
        <div
          v-if="validationErrors.detail || typeof validationErrors === 'string'"
          class="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-start"
        >
          <AlertOctagonIcon class="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <p class="font-medium">Submission Error:</p>
            <p>{{ validationErrors.detail || validationErrors }}</p>
          </div>
        </div>
      </form>

      <!-- Application Status Table Section -->
      <section class="mt-16 p-6 bg-white rounded-xl shadow-md">
        <h3 class="text-xl font-semibold text-gray-700 mb-6 border-b pb-3 flex items-center">
          <ListIcon class="w-5 h-5 mr-2 text-indigo-500" />
          Submitted Application Status
        </h3>

        <!-- Search Input -->
        <div class="mb-6">
          <label for="searchApplication" class="block text-sm font-medium text-gray-600 mb-2">
            Search Applications
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search class="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              id="searchApplication"
              v-model.trim="searchQuery"
              placeholder="Enter proposal title or application ID..."
              class="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <p class="mt-1 text-xs text-gray-500">Search by proposal title or application ID</p>
        </div>

        <!-- Loading state for Table -->
        <div v-if="isTableLoading" class="flex justify-center items-center py-10">
          <Loader class="inline-block animate-spin text-indigo-600 w-6 h-6" />
          <p class="ml-3 text-gray-600">Loading applications...</p>
        </div>

        <!-- Error state for Table -->
        <div
          v-else-if="tableApiError"
          class="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-center"
        >
          <AlertOctagonIcon class="w-6 h-6 mx-auto mb-2" />
          <p>Could not load application status. Please try again later.</p>
        </div>

        <!-- Table -->
        <div v-else class="overflow-x-auto rounded-lg border border-gray-200">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-100">
              <tr>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  App ID
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Proposal Title
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Submitted Date
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-if="filteredApplications.length === 0">
                <td colspan="5" class="px-6 py-8 text-center text-sm text-gray-500">
                  <FolderIcon class="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <div v-if="searchQuery">No applications match your search criteria.</div>
                  <div v-else>No educational programme applications submitted yet.</div>
                </td>
              </tr>
              <tr
                v-for="application in filteredApplications"
                :key="application.id"
                class="hover:bg-gray-50 transition-colors duration-150"
              >
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">
                  {{ application.id }}
                </td>
                <td class="px-6 py-4 text-sm text-gray-700">
                  {{ application.proposal_title || 'N/A' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{
                    application.created_at
                      ? new Date(application.created_at).toLocaleDateString()
                      : 'N/A'
                  }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <span
                    :class="getStatusClass(application.review_decision)"
                    class="px-2 py-1 rounded-full text-xs font-medium flex items-center w-fit"
                  >
                    <span
                      class="w-2 h-2 rounded-full mr-1"
                      :class="{
                        'bg-green-500': application.review_decision === 'Approved',
                        'bg-red-500': application.review_decision === 'Rejected',
                        'bg-yellow-500': application.review_decision === 'Pending',
                        'bg-blue-500': application.review_decision === 'Under Review',
                        'bg-gray-500': !application.review_decision,
                      }"
                    ></span>
                    {{ application.review_decision || 'Unknown' }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useToast } from 'vue-toastification'
import apiService from '@/services/services'
import { Loader, Search } from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

// Form related state
const userInstitute = ref(null)
const isLoading = ref(true)
const isSubmitting = ref(false)
const draftSaveInProgress = ref(false)
const apiError = ref(false)
const errorMessage = ref('')
const validationErrors = ref({})
const selectedFile = ref(null)
const selectedFileName = ref('')
const formData = ref({
  proposal_title: '',
  duration_in_months: null,
  commencement_date: '',
  remarks: '',
  ins_declaration: false,
  institute_attachments: null,
  ins_review_decision: 'Pending',
  is_active: true,
  institute: null,
  institute_name: '',
})

// State for Application Status Table
const submittedApplications = ref([])
const isTableLoading = ref(false)
const tableApiError = ref(false)
const searchQuery = ref('')

// Computed property for filtering applications
const filteredApplications = computed(() => {
  if (!searchQuery.value) {
    return submittedApplications.value
  }
  const lowerSearch = searchQuery.value.toLowerCase()
  return submittedApplications.value.filter((app) => {
    const titleMatch = app.proposal_title?.toLowerCase().includes(lowerSearch)
    const idMatch = String(app.id).includes(lowerSearch)
    return titleMatch || idMatch
  })
})

// Get today's date
const todayDate = computed(() => {
  const today = new Date()
  const yyyy = today.getFullYear()
  const mm = String(today.getMonth() + 1).padStart(2, '0')
  const dd = String(today.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
})

const userCid = computed(() => {
  return authStore.user?.cid || ''
})

// Fetch Institute Data and Submitted Applications
const fetchInstituteData = async () => {
  if (!userCid.value) {
    errorMessage.value = 'User information not available. Please log in again.'
    apiError.value = true
    isLoading.value = false
    return
  }

  isLoading.value = true
  apiError.value = false
  errorMessage.value = ''

  try {
    const response = await apiService.getEpcInstitutes()
    if (response && response.data && Array.isArray(response.data.results)) {
      const foundInstitute = response.data.results.find(
        (institute) =>
          institute.CID &&
          userCid.value &&
          institute.CID.toLowerCase() === userCid.value.toLowerCase(),
      )

      if (foundInstitute) {
        userInstitute.value = foundInstitute
        formData.value.institute = userInstitute.value.id
        formData.value.institute_name = userInstitute.value.name_of_institution
        await fetchSubmittedApplications()
      } else {
        errorMessage.value = 'No registered institute found associated with your account (CID).'
        userInstitute.value = null
      }
    } else {
      errorMessage.value = 'Failed to retrieve institute data.'
      apiError.value = true
    }
  } catch (error) {
    console.error('Error fetching institute data:', error)
    errorMessage.value = 'An error occurred while fetching institute data.'
    apiError.value = true
  } finally {
    isLoading.value = false
  }
}

// Fetch Submitted Applications for the Table
const fetchSubmittedApplications = async () => {
  if (!userInstitute.value?.id) {
    console.warn('Cannot fetch applications without institute ID.')
    return
  }

  isTableLoading.value = true
  tableApiError.value = false
  try {
    const filterParams = {
      institute: userInstitute.value.id,
    }
    const response = await apiService.getEpcNewEducationPrograms(filterParams)

    if (response && response.data) {
      submittedApplications.value = response.data.results || response.data || []
    } else {
      submittedApplications.value = []
    }
  } catch (error) {
    console.error('Error fetching submitted applications:', error)
    tableApiError.value = true
    submittedApplications.value = []
  } finally {
    isTableLoading.value = false
  }
}

// File Handling
const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Attachment file size exceeds 5MB limit.')
      event.target.value = ''
      selectedFile.value = null
      selectedFileName.value = ''
      return
    }
    selectedFile.value = file
    selectedFileName.value = file.name
  } else {
    selectedFile.value = null
    selectedFileName.value = ''
  }
}

// Form Validation
const validateForm = (isDraft = false) => {
  const errors = {}
  validationErrors.value = {}

  if (!formData.value.proposal_title?.trim()) errors.proposal_title = ['Proposal title is required']

  if (!isDraft) {
    if (!formData.value.duration_in_months || formData.value.duration_in_months <= 0)
      errors.duration_in_months = ['Duration must be a positive number']
    if (!formData.value.commencement_date)
      errors.commencement_date = ['Commencement date is required']
    else if (new Date(formData.value.commencement_date) < new Date(todayDate.value))
      errors.commencement_date = ['Commencement date cannot be in the past']
    if (!formData.value.ins_declaration)
      errors.ins_declaration = ['You must accept the declaration']
  }

  if (Object.keys(errors).length > 0) {
    validationErrors.value = errors
    return false
  }
  return true
}

// Form Submission Logic
const prepareFormData = (status = 'Pending') => {
  const submissionData = new FormData()
  Object.keys(formData.value).forEach((key) => {
    if (key === 'institute_attachments') return
    const value = formData.value[key]
    if (value !== null && value !== undefined) {
      if (typeof value === 'boolean') {
        submissionData.append(key, value ? 'true' : 'false')
      } else if (key === 'duration_in_months') {
        submissionData.append(key, Number(value))
      } else {
        submissionData.append(key, value)
      }
    }
  })
  submissionData.set('ins_review_decision', status)
  if (selectedFile.value) {
    submissionData.append('institute_attachments', selectedFile.value, selectedFile.value.name)
  }
  return submissionData
}

const handleSubmit = async () => {
  draftSaveInProgress.value = false
  if (!validateForm()) {
    toast.error('Please correct the errors highlighted in the form.')
    const firstError = document.querySelector('.border-red-500, .text-red-600')
    firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    return
  }
  if (!formData.value.ins_declaration) {
    toast.error('Please accept the declaration before submitting.')
    document.getElementById('declaration')?.focus()
    return
  }

  isSubmitting.value = true
  validationErrors.value = {}

  try {
    const finalFormData = prepareFormData('Pending')
    await apiService.createEpcproposalDetail(finalFormData)
    toast.success('Educational programme application submitted successfully for review!')

    Object.keys(formData.value).forEach((key) => {
      if (
        key !== 'institute' &&
        key !== 'institute_name' &&
        key !== 'ins_review_decision' &&
        key !== 'is_active'
      ) {
        if (typeof formData.value[key] === 'boolean') formData.value[key] = false
        else if (typeof formData.value[key] === 'number') formData.value[key] = null
        else formData.value[key] = ''
      }
    })
    selectedFile.value = null
    selectedFileName.value = ''
    document.getElementById('attachments').value = null

    await fetchSubmittedApplications()
    document.getElementById('statusTableSection')?.scrollIntoView({ behavior: 'smooth' })
  } catch (error) {
    console.error('Error submitting form:', error)
    if (error.response && error.response.data) {
      const errors = error.response.data.errors || error.response.data
      if (typeof errors === 'object' && errors !== null && !Array.isArray(errors)) {
        validationErrors.value = errors
        toast.error('Submission failed. Please review the errors shown on the form.')
        if (errors.detail) validationErrors.value.detail = errors.detail
      } else if (typeof errors === 'string') {
        validationErrors.value = { detail: errors }
        toast.error(errors)
      } else {
        toast.error('An unexpected error occurred during submission.')
        validationErrors.value = { detail: 'An unexpected error occurred.' }
      }
    } else {
      toast.error('Failed to connect to the server.')
      validationErrors.value = { detail: 'Network error or server unavailable.' }
    }
  } finally {
    isSubmitting.value = false
  }
}

const handleSaveDraft = async () => {
  if (!formData.value.proposal_title?.trim()) {
    toast.warn('Please enter at least a Proposal Title to save a draft.')
    document.getElementById('proposalTitle')?.focus()
    validationErrors.value = { proposal_title: ['Proposal title is required to save a draft'] }
    return
  }

  isSubmitting.value = true
  draftSaveInProgress.value = true
  validationErrors.value = {}

  try {
    const draftFormData = prepareFormData('Draft')
    await apiService.createEpcproposalDetail(draftFormData)
    toast.success('Draft saved successfully!')
    await fetchSubmittedApplications()
  } catch (error) {
    console.error('Error saving draft:', error)
    if (error.response && error.response.data) {
      const errors = error.response.data.errors || error.response.data
      let errorMsg = 'Failed to save draft.'
      if (typeof errors === 'string') {
        errorMsg = errors
      } else if (errors && typeof errors === 'object') {
        errorMsg = errors.detail || JSON.stringify(errors)
      }
      validationErrors.value = { detail: errorMsg }
      toast.error(`Draft save failed: ${errorMsg}`)
    } else {
      validationErrors.value = { detail: 'Network error or server unavailable.' }
      toast.error('An error occurred while saving the draft.')
    }
  } finally {
    isSubmitting.value = false
    draftSaveInProgress.value = false
  }
}

const handleCancel = () => {
  const hasData =
    Object.keys(formData.value).some((key) => {
      const value = formData.value[key]
      return (
        value !== '' &&
        value !== null &&
        value !== false &&
        !(Array.isArray(value) && value.length === 0) &&
        !(key === 'institute' && value === null) &&
        !(key === 'institute_name' && value === '') &&
        !(key === 'ins_review_decision' && value === 'Pending') &&
        !(key === 'is_active' && value === true)
      )
    }) || selectedFile.value

  if (hasData) {
    if (confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
      router.go(-1)
    }
  } else {
    router.go(-1)
  }
}

// Helper function for status styling
const getStatusClass = (status) => {
  status = status?.toLowerCase()
  if (
    status === 'approved' ||
    status === 'approved, pending payment' ||
    status === 'active' ||
    status === 'completed'
  ) {
    return 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800'
  } else if (status === 'rejected' || status === 'failed') {
    return 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800'
  } else if (
    status === 'pending' ||
    status === 'under review' ||
    status === 'draft' ||
    status === 'processing_payment'
  ) {
    return 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800'
  } else {
    return 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800'
  }
}

// Lifecycle Hook
onMounted(fetchInstituteData)
</script>

<style scoped>
label span.text-red-500 {
  margin-left: 2px;
}
button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
input[type='file'] {
  color: #64748b;
}
input[type='file']::file-selector-button {
  margin-right: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  border-width: 0px;
  font-size: 0.875rem;
  font-weight: 600;
  background-color: #eef2ff;
  color: #4338ca;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
}
input[type='file']::file-selector-button:hover {
  background-color: #e0e7ff;
}
.border-red-500 {
  border-color: #ef4444;
}
.border-red-500:focus {
  border-color: #ef4444;
  box-shadow: 0 0 0 1px #ef4444;
}
</style>
