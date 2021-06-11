<!-- EcpfLocationChange.vue -->
<template>
  <div class="p-8 min-h-screen bg-gray-50">
    <!-- Page Header -->
    <div class="bg-white rounded-xl p-8 mb-6 shadow-sm border border-gray-100">
      <h1 class="text-4xl font-bold text-gray-900 mb-3">ECPF Location Change</h1>
      <p class="text-gray-600">
        Please provide the current location details and the proposed new location for the ECPF.
      </p>
    </div>

    <!-- Head Office / Branch Office Toggle Buttons -->
    <div class="flex justify-center mb-6">
      <div class="inline-flex rounded-md shadow-sm" role="group">
        <button
          @click="selectOfficeType('head_office')"
          type="button"
          :class="[
            'px-6 py-2 text-sm font-medium rounded-l-lg border',
            activeOfficeType === 'head_office'
              ? 'bg-indigo-600 text-white border-indigo-600 z-10'
              : 'bg-white text-gray-900 border-gray-200 hover:bg-gray-100',
          ]"
        >
          Head Office
        </button>
        <button
          @click="selectOfficeType('branch_office')"
          type="button"
          :class="[
            'px-6 py-2 text-sm font-medium rounded-r-md border-t border-b border-r',
            activeOfficeType === 'branch_office'
              ? 'bg-indigo-600 text-white border-indigo-600 z-10'
              : 'bg-white text-gray-900 border-gray-200 hover:bg-gray-100',
          ]"
        >
          Branch Office
        </button>
      </div>
    </div>

    <!-- Loading Spinner -->
    <div v-if="loading" class="text-center py-10">
      <div class="flex flex-col items-center space-y-3">
        <svg
          class="animate-spin h-8 w-8 text-indigo-600"
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
        <p class="text-gray-600 font-medium">Loading details...</p>
      </div>
    </div>

    <!-- Form Content -->
    <div v-else class="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
      <!-- Branch Selector Dropdown -->
      <div v-if="activeOfficeType === 'branch_office'" class="mb-6">
        <label for="branchSelector" class="block text-sm font-medium text-gray-700"
          >Select Branch</label
        >
        <select
          id="branchSelector"
          v-model="selectedBranchId"
          @change="handleBranchSelection"
          class="mt-1 block w-full md:w-1/2 px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          :disabled="isFetchingBranches"
        >
          <option value="">
            {{ isFetchingBranches ? 'Loading branches...' : '--- Please select a branch ---' }}
          </option>
          <option v-for="branch in branchList" :key="branch.id" :value="branch.id">
            {{ branch.institute_name }} - ({{ branch.location }})
          </option>
        </select>
        <p v-if="!isFetchingBranches && branchList.length === 0" class="mt-2 text-sm text-gray-500">
          No branches found for this account.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        <!-- Current Details (Readonly Inputs) -->
        <div class="space-y-4">
          <h3 class="text-lg font-medium text-gray-800 border-b pb-2 mb-3">Current Details</h3>
          <div>
            <label class="block text-sm font-medium text-gray-700">ECPF Name</label>
            <input
              type="text"
              :value="currentDetails.ecpfName"
              readonly
              class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Current Location</label>
            <input
              type="text"
              :value="currentDetails.location"
              readonly
              class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Name of Proprietor</label>
            <input
              type="text"
              :value="currentDetails.proprietorName"
              readonly
              class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">CID</label>
            <input
              type="text"
              :value="currentDetails.cid"
              readonly
              class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Contact No.</label>
            <input
              type="text"
              :value="currentDetails.contactNo"
              readonly
              class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              :value="currentDetails.emailAddress"
              readonly
              class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
        </div>

        <!-- Proposed Change (Editable Fields) -->
        <div class="space-y-4">
          <h3 class="text-lg font-medium text-gray-800 border-b pb-2 mb-3">
            Proposed New Location
          </h3>
          <div>
            <label for="newDzongkhagThromde" class="block text-sm font-medium text-gray-700"
              >New Dzongkhag/Thromde <span class="text-red-500">*</span></label
            >
            <select
              id="newDzongkhagThromde"
              v-model="newLocationDetails.dzongkhag_thromde"
              @change="handleDzongkhagChange"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select Dzongkhag/Thromde</option>
              <option
                v-for="option in dzongkhagOptions"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
            <p v-if="dzongkhagOptions.length === 0 && !loading" class="mt-1 text-xs text-red-500">
              No Dzongkhag options available. Please check configuration.
            </p>
          </div>
          <div>
            <label for="newGewogThrom" class="block text-sm font-medium text-gray-700"
              >New Gewog/Throm <span class="text-red-500">*</span></label
            >
            <select
              id="newGewogThrom"
              v-model="newLocationDetails.permanent_gewog"
              :disabled="!newLocationDetails.dzongkhag_thromde || filteredGewogOptions.length === 0"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select Gewog/Throm</option>
              <option
                v-for="option in filteredGewogOptions"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
          </div>
          <div>
            <label for="newVillage" class="block text-sm font-medium text-gray-700"
              >New Village <span class="text-red-500">*</span></label
            >
            <input
              type="text"
              id="newVillage"
              v-model="newLocationDetails.permanent_village"
              placeholder="e.g., Changzamtog, Thimphu"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label for="newLocation" class="block text-sm font-medium text-gray-700"
              >Location <span class="text-red-500">*</span></label
            >
            <input
              type="text"
              id="newLocation"
              v-model="newLocationDetails.location"
              placeholder="e.g., place that is known by"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div class="mt-4">
            <label class="block text-sm font-medium text-gray-700"
              >Declaration <span class="text-red-500">*</span></label
            >
            <div class="mt-1 flex items-center">
              <input
                id="locationChangeDeclaration"
                type="checkbox"
                v-model="locationChangeDeclaration"
                class="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <label for="locationChangeDeclaration" class="ml-2 block text-sm text-gray-900">
                I hereby declare that the information provided for the new location is true and
                correct.
              </label>
            </div>
          </div>
          <div class="mt-4">
            <label for="locationChangeRemarks" class="block text-sm font-medium text-gray-700"
              >Remarks (Optional)</label
            >
            <textarea
              id="locationChangeRemarks"
              v-model="locationChangeRemarks"
              rows="3"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter any remarks regarding the location change"
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Validation Errors -->
      <div v-if="validationErrors.length" class="mt-6 text-red-600 bg-red-50 p-3 rounded-md">
        <p class="font-medium">Please correct the following errors:</p>
        <ul class="list-disc list-inside ml-4">
          <li v-for="(error, index) in validationErrors" :key="index">{{ error }}</li>
        </ul>
      </div>

      <!-- Action Buttons -->
      <div class="mt-8 flex flex-wrap justify-end space-x-0 sm:space-x-3 space-y-2 sm:space-y-0">
        <button
          @click="saveAsDraft"
          :disabled="isSubmitting || !ecpfProfileId"
          class="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
        >
          Save as Draft
        </button>
        <button
          @click="handleFinalSubmit"
          :disabled="isSubmitting || !isFormValidForSubmission()"
          class="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Submit Application
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, nextTick } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'
import apiServices from '@/services/services'
import { useToast } from 'vue-toastification'
import { bhutanDzongkhagsGewogs } from '@/constants/dzongkhags.js'

const props = defineProps({
  initialData: {
    type: Object,
    default: () => ({}),
  },
})

const authStore = useAuthStore()
const router = useRouter()
const toast = useToast()

const loading = ref(true)
const isSubmitting = ref(false)
const validationErrors = ref([])
const draftId = ref(null)

const activeOfficeType = ref('head_office') // 'head_office' or 'branch_office'
const branchList = ref([])
const selectedBranchId = ref('')
const isFetchingBranches = ref(false)
let ecpfProfileId = null

const currentDetails = reactive({
  ecpfName: '',
  location: '',
  proprietorName: '',
  cid: '',
  contactNo: '',
  emailAddress: '',
})

const newLocationDetails = reactive({
  dzongkhag_thromde: '',
  permanent_gewog: '',
  permanent_village: '',
  location: '',
})

const locationChangeDeclaration = ref(false)
const locationChangeRemarks = ref('')

const emit = defineEmits(['submit-success', 'save-draft-success'])

const resetCurrentDetails = () => {
  ecpfProfileId = null
  Object.keys(currentDetails).forEach((key) => (currentDetails[key] = ''))
}

const populateDetails = (data) => {
  if (!data) return
  ecpfProfileId = data.id

  // Use a chain of fallbacks to find the correct field name from different API responses
  currentDetails.ecpfName =
    data.institute_name || data.proposed_firm_branch_name || data.name || data.firm_name || 'N/A'

  // Construct a detailed location string from available fields
  const locationParts = [
    data.dzongkhag || data.dzongkhag_thromde,
    data.gewog || data.gewog_throm,
    data.village || data.location,
  ]
    .filter(Boolean)
    .join(', ')
  currentDetails.location = locationParts || 'N/A'

  currentDetails.proprietorName =
    data.proprietor_name || data.applicants_name || authStore.fullName || 'N/A'
  currentDetails.cid = data.cid || data.applicant_cid_no || authStore.user.cid || 'N/A'
  currentDetails.contactNo = data.contact_no || authStore.contactNumber || 'N/A'
  currentDetails.emailAddress = data.email || data.email_address || authStore.email || 'N/A'
}

const fetchHeadOfficeDetails = async () => {
  loading.value = true
  resetCurrentDetails()
  try {
    const response = await apiServices.getEcpfDetailsByCID(authStore.user.cid)
    if (response.data) {
      populateDetails(response.data)
    } else {
      toast.error('Could not fetch Head Office details.')
      Object.keys(currentDetails).forEach((key) => (currentDetails[key] = 'N/A (Error)'))
    }
  } catch (error) {
    console.error('Error fetching Head Office details:', error)
    toast.error('Failed to load Head Office details.')
    Object.keys(currentDetails).forEach((key) => (currentDetails[key] = 'N/A (Error)'))
  } finally {
    loading.value = false
  }
}

const fetchBranchList = async () => {
  isFetchingBranches.value = true
  branchList.value = []
  resetCurrentDetails()
  try {
    // Calling the actual API service provided
    const response = await apiServices.getEcpfBranches()

    // The API returns data inside a 'results' array
    if (response.data && response.data.results) {
      branchList.value = response.data.results
    } else {
      branchList.value = []
      console.warn(
        'Branch API response was successful but did not contain a results array.',
        response.data,
      )
      toast.info('No branches found.')
    }
  } catch (error) {
    console.error('Error fetching branch list:', error)
    toast.error('Failed to load branch list. Please try again.')
  } finally {
    isFetchingBranches.value = false
  }
}

const selectOfficeType = async (type) => {
  if (activeOfficeType.value === type) return // Do nothing if already selected

  activeOfficeType.value = type
  selectedBranchId.value = '' // Reset branch selection
  resetCurrentDetails() // Clear the form

  if (type === 'head_office') {
    await fetchHeadOfficeDetails()
  } else if (type === 'branch_office') {
    loading.value = false // Main loader is not needed here, only the dropdown's loader
    await fetchBranchList()
  }
}

const handleBranchSelection = () => {
  resetCurrentDetails()
  const selectedBranch = branchList.value.find((b) => b.id === selectedBranchId.value)
  if (selectedBranch) {
    populateDetails(selectedBranch)
  }
}

onMounted(async () => {
  if (!authStore.isAuthenticated || !authStore.user) {
    toast.error('Authentication required. Please log in.')
    router.push('/login')
    return
  }
  // Load Head Office details by default when the component mounts
  await fetchHeadOfficeDetails()
})

const dzongkhagOptions = computed(() => {
  if (!bhutanDzongkhagsGewogs || bhutanDzongkhagsGewogs.length === 0) {
    return []
  }
  return bhutanDzongkhagsGewogs.map((item) => ({
    value: item.dzongkhag,
    label: item.dzongkhag,
  }))
})

const filteredGewogOptions = computed(() => {
  if (!newLocationDetails.dzongkhag_thromde || !bhutanDzongkhagsGewogs) {
    return []
  }
  const selectedDzongkhagObj = bhutanDzongkhagsGewogs.find(
    (d) => d.dzongkhag === newLocationDetails.dzongkhag_thromde,
  )
  if (selectedDzongkhagObj && selectedDzongkhagObj.gewogs) {
    return selectedDzongkhagObj.gewogs.map((gewogName) => ({
      value: gewogName,
      label: gewogName,
    }))
  }
  return []
})

const handleDzongkhagChange = () => {
  newLocationDetails.permanent_gewog = ''
}

const validateForm = (isDraft = false) => {
  validationErrors.value = []
  if (!ecpfProfileId) {
    validationErrors.value.push('Please select a Head Office or a Branch to proceed.')
  }
  if (!isDraft) {
    if (!newLocationDetails.dzongkhag_thromde) {
      validationErrors.value.push('New Dzongkhag/Thromde is required.')
    }
    if (!newLocationDetails.permanent_gewog) {
      validationErrors.value.push('New Gewog/Throm is required.')
    }
    if (!newLocationDetails.permanent_village.trim()) {
      validationErrors.value.push('New Village is required.')
    }
    if (!locationChangeDeclaration.value) {
      validationErrors.value.push('You must agree to the declaration.')
    }
  }
  return validationErrors.value.length === 0
}

const isFormValidForSubmission = () => {
  return (
    ecpfProfileId &&
    newLocationDetails.dzongkhag_thromde &&
    newLocationDetails.permanent_gewog &&
    newLocationDetails.permanent_village.trim() &&
    locationChangeDeclaration.value === true
  )
}

const preparePayload = (isDraft = false) => {
  const payload = {
    ecpf_profile: ecpfProfileId,
    current_location_summary: currentDetails.location,
    new_dzongkhag_throm: newLocationDetails.dzongkhag_thromde,
    new_geowg_throm: newLocationDetails.permanent_gewog,
    new_location: newLocationDetails.permanent_village.trim(),
    declaration: locationChangeDeclaration.value,
    remarks: locationChangeRemarks.value.trim(),
    changed_entity_type: activeOfficeType.value,
  }

  if (isDraft) {
    payload.status = 'Draft'
    payload.is_draft = true
  } else {
    payload.status = 'Submitted'
    payload.is_draft = false
  }
  return payload
}

const submitApplicationToServer = async () => {
  isSubmitting.value = true
  const payload = preparePayload(false)
  console.log('Submitting ECPF Location Change payload:', JSON.stringify(payload, null, 2))

  try {
    const response = await apiServices.createEcpfLocationChange(payload)
    if (response.status === 201 || response.status === 200) {
      toast.success(response.data.message || 'Location change application submitted successfully!')
      emit('submit-success', response.data)
      // Reset form fields after successful submission
      Object.assign(newLocationDetails, {
        dzongkhag_thromde: '',
        permanent_gewog: '',
        permanent_village: '',
        location: '',
      })
      locationChangeDeclaration.value = false
      locationChangeRemarks.value = ''
      validationErrors.value = []
      draftId.value = null
    } else {
      throw new Error('Submission failed with status: ' + response.status)
    }
  } catch (error) {
    console.error('Error submitting location change application:', error)
    const errorData = error.response?.data
    if (errorData && typeof errorData === 'object') {
      const messages = Object.values(errorData).flat().join(' ')
      toast.error(messages || 'Failed to submit application.')
    } else {
      toast.error(errorData?.detail || errorData?.message || 'An error occurred.')
    }
  } finally {
    isSubmitting.value = false
  }
}

const saveAsDraft = async () => {
  if (!validateForm(true)) {
    toast.error(validationErrors.value.join(' ') || 'Cannot save an empty draft.')
    return
  }
  isSubmitting.value = true
  const draftPayload = preparePayload(true)
  console.log('Saving ECPF Location Change as draft:', JSON.stringify(draftPayload, null, 2))

  try {
    let response
    if (draftId.value) {
      response = await apiServices.updateEcpfLocationChange(draftId.value, draftPayload)
    } else {
      response = await apiServices.createEcpfLocationChange(draftPayload)
    }

    if ((response.status === 200 || response.status === 201) && response.data) {
      toast.success(response.data.message || 'Application saved as draft!')
      if (response.data.id) {
        draftId.value = response.data.id
      }
      emit('save-draft-success', response.data)
    } else {
      throw new Error('Failed to save draft.')
    }
  } catch (error) {
    console.error('Error saving as draft:', error)
    const errorData = error.response?.data
    if (errorData && typeof errorData === 'object') {
      const messages = Object.values(errorData).flat().join(' ')
      toast.error(messages || 'Failed to save draft.')
    } else {
      toast.error(errorData?.detail || errorData?.message || 'Failed to save draft.')
    }
  } finally {
    isSubmitting.value = false
  }
}

const handleFinalSubmit = async () => {
  if (!validateForm(false)) {
    toast.error('Please fill all required fields correctly before submitting.')
    return
  }
  await submitApplicationToServer()
}
</script>

<style scoped>
.disabled\:opacity-50:disabled {
  opacity: 0.5;
}
.disabled\:cursor-not-allowed:disabled {
  cursor: not-allowed;
}
</style>
