<!-- EcpfLocationChange.vue -->
<template>
  <div class="p-8 min-h-screen bg-gray-50">
    <div class="bg-white rounded-xl p-8 mb-10 shadow-sm border border-gray-100">
      <h1 class="text-4xl font-bold text-gray-900 mb-3">ECPF Location Change</h1>
      <p class="text-gray-600">
        Please provide the current location details and the proposed new location for the ECPF.
      </p>
    </div>

    <div v-if="loading" class="text-center py-10">
      <!-- Loading Spinner -->
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
        <p class="text-gray-600 font-medium">Loading current ECPF details...</p>
      </div>
    </div>

    <div v-else class="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
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
              v-model="newLocationDetails.gewog_throm"
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
            <p
              v-if="
                newLocationDetails.dzongkhag_thromde &&
                filteredGewogOptions.length === 0
              "
              class="mt-1 text-xs text-gray-500"
            >
              No Gewogs/Throms available for the selected Dzongkhag/Thromde or select a Dzongkhag first.
            </p>
          </div>
          <div>
            <label for="newVillage" class="block text-sm font-medium text-gray-700"
              >New Village/Street Address <span class="text-red-500">*</span></label
            >
            <input
              type="text"
              id="newVillage"
              v-model="newLocationDetails.village_street"
              placeholder="e.g., Changzamtog, Thimphu"
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
          :disabled="isSubmitting"
          class="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
        >
          Save as Draft
        </button>
        <button
          @click="handleFinalSubmit"
          :disabled="isSubmitting || !isFormValidForSubmission()" 
          class="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Submit Application <!-- CHANGED: Button text -->
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted, computed, nextTick } from 'vue'
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
  gewog_throm: '',
  village_street: '',
})

const locationChangeDeclaration = ref(false)
const locationChangeRemarks = ref('')

const emit = defineEmits(['submit-success', 'save-draft-success']) // REMOVED: 'payment-initiated'

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
  newLocationDetails.gewog_throm = ''
}

onMounted(async () => {
  loading.value = true
  try {
    if (!authStore.isAuthenticated || !authStore.user) {
      toast.error('Authentication required. Please log in.')
      router.push('/login')
      loading.value = false
      return
    }
    if (!authStore.user.cid) {
      toast.error('User CID not found. Cannot fetch ECPF details.')
      Object.keys(currentDetails).forEach((key) => (currentDetails[key] = 'N/A'))
      currentDetails.cid = 'N/A'
      loading.value = false
      return
    }

    const response = await apiServices.getEcpfDetailsByCID(authStore.user.cid)
    const fetchedEcpfData = response.data

    if (fetchedEcpfData) {
      ecpfProfileId = fetchedEcpfData.id
      currentDetails.ecpfName =
        fetchedEcpfData.institute_name || fetchedEcpfData.name || fetchedEcpfData.firm_name || 'N/A'
      const locationParts = [
        fetchedEcpfData.dzongkhag,
        fetchedEcpfData.gewog,
        fetchedEcpfData.village,
      ]
        .filter(Boolean)
        .join(', ') || fetchedEcpfData.location || 'N/A'
      currentDetails.location = locationParts
      currentDetails.proprietorName = fetchedEcpfData.proprietor_name || authStore.fullName || 'N/A'
      currentDetails.cid = fetchedEcpfData.cid || authStore.user.cid || 'N/A'
      currentDetails.contactNo = fetchedEcpfData.contact_no || authStore.contactNumber || 'N/A'
      currentDetails.emailAddress = fetchedEcpfData.email_address || authStore.email || 'N/A'
    } else {
      toast.error('Could not fetch ECPF details.')
      Object.keys(currentDetails).forEach((key) => (currentDetails[key] = 'N/A (Error)'))
      currentDetails.cid = authStore.user.cid || 'N/A (Error)'
    }
  } catch (error) {
    console.error('Error fetching ECPF details:', error)
    toast.error('Failed to load ECPF details. Please try again.')
    Object.keys(currentDetails).forEach((key) => (currentDetails[key] = 'N/A (Error)'))
    if (authStore.user) currentDetails.cid = authStore.user.cid || 'N/A (Error)'
  } finally {
    loading.value = false
  }
})

watch(
  () => props.initialData,
  async (newData) => {
    if (newData && Object.keys(newData).length > 0 && !loading.value) {
      draftId.value = newData.id || null
      newLocationDetails.dzongkhag_thromde = newData.new_dzongkhag_throm || newData.new_dzongkhag || ''
      await nextTick()
      newLocationDetails.gewog_throm = newData.new_geowg_throm || newData.new_gewog || ''
      newLocationDetails.village_street = newData.new_location || newData.new_village_street || ''
      locationChangeDeclaration.value = newData.declaration === true
      locationChangeRemarks.value = newData.remarks || ''
    }
  },
  { deep: true, immediate: true },
)

const validateForm = (isDraft = false) => {
  validationErrors.value = []
  if (!ecpfProfileId) {
    validationErrors.value.push('ECPF Profile ID is missing. Cannot proceed.')
  }
  // For final submission (not draft), all fields are required
  if (!isDraft) {
    if (!newLocationDetails.dzongkhag_thromde) {
      validationErrors.value.push('New Dzongkhag/Thromde is required.')
    }
    if (!newLocationDetails.gewog_throm) {
      validationErrors.value.push('New Gewog/Throm is required.')
    }
    if (!newLocationDetails.village_street.trim()) {
      validationErrors.value.push('New Village/Street Address is required.')
    }
    if (!locationChangeDeclaration.value) {
      validationErrors.value.push('You must agree to the declaration.')
    }
  } else { // Lenient validation for draft
    if (
      !newLocationDetails.dzongkhag_thromde &&
      !newLocationDetails.gewog_throm &&
      !newLocationDetails.village_street.trim() &&
      !locationChangeRemarks.value.trim() &&
      !locationChangeDeclaration.value
    ) {
      validationErrors.value.push(
        'Please enter at least one field for the new location, remarks, or check the declaration to save a draft.',
      )
    }
  }
  return validationErrors.value.length === 0
}

// RENAMED and SIMPLIFIED: No payment specific logic needed
const isFormValidForSubmission = () => {
  // This is essentially the same as non-draft validation
  return (
    ecpfProfileId &&
    newLocationDetails.dzongkhag_thromde &&
    newLocationDetails.gewog_throm &&
    newLocationDetails.village_street.trim() &&
    locationChangeDeclaration.value === true
  )
}

// MODIFIED: Removed paymentInfo parameter
const preparePayload = (isDraft = false) => {
  const payload = {
    ecpf_profile: ecpfProfileId,
    current_location_summary: currentDetails.location,
    new_dzongkhag_throm: newLocationDetails.dzongkhag_thromde,
    new_geowg_throm: newLocationDetails.gewog_throm,
    new_location: newLocationDetails.village_street.trim(),
    declaration: locationChangeDeclaration.value,
    remarks: locationChangeRemarks.value.trim(),
  };

  if (isDraft) {
    payload.status = 'Draft';
    payload.is_draft = true;
  } else {
    payload.status = 'Submitted';
    payload.is_draft = false;
    // REMOVED: paymentInfo related fields
  }
  return payload;
};

// This function will now be called directly for final submission
// MODIFIED: Removed paymentInfo parameter
const submitApplicationToServer = async () => {
  // Validation should be done by handleFinalSubmit before calling this
  isSubmitting.value = true

  const payload = preparePayload(false) // isDraft = false, no paymentInfo
  console.log('Submitting ECPF Location Change payload:', JSON.stringify(payload, null, 2))

  try {
    let response;
    response = await apiServices.createEcpfLocationChange(payload)

    if (response.status === 201 || response.status === 200) {
      toast.success(response.data.message || 'Location change application submitted successfully!')
      emit('submit-success', response.data)
      Object.assign(newLocationDetails, {
        dzongkhag_thromde: '',
        gewog_throm: '',
        village_street: '',
      })
      locationChangeDeclaration.value = false
      locationChangeRemarks.value = ''
      validationErrors.value = []
      draftId.value = null
    } else {
      const errorData = response.data;
      if (errorData && typeof errorData === 'object') {
        const messages = Object.values(errorData).flat().join(' ');
        toast.error(messages || 'Failed to submit application.');
      } else {
        toast.error(errorData?.detail || errorData?.message || 'Failed to submit application.');
      }
    }
  } catch (error) {
    console.error('Error submitting location change application:', error);
    if (error.response && error.response.data) {
        const errorData = error.response.data;
        if (typeof errorData === 'object') {
            const messages = Object.entries(errorData).map(([field, errs]) => `${field}: ${Array.isArray(errs) ? errs.join(', ') : errs}`).join('; ');
            validationErrors.value = Object.entries(errorData).map(([field, errs]) => `${field}: ${Array.isArray(errs) ? errs.join(', ') : errs}`);
            toast.error('Please correct the validation errors: ' + messages);
        } else {
            toast.error(errorData.detail || errorData.message || 'An error occurred while submitting the application.');
        }
    } else {
        toast.error('An network error or unexpected issue occurred while submitting the application.');
    }
  } finally {
    isSubmitting.value = false
  }
}

const saveAsDraft = async () => {
  if (!validateForm(true)) { // true for lenient draft validation
    toast.error(validationErrors.value.join(' ') || 'Cannot save an empty draft.')
    return
  }
  isSubmitting.value = true

  const draftPayload = preparePayload(true) // isDraft = true
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
      const errorData = response.data;
      if (errorData && typeof errorData === 'object') {
        const messages = Object.values(errorData).flat().join(' ');
        toast.error(messages || 'Failed to save draft.');
      } else {
        toast.error(errorData?.detail || errorData?.message || 'Failed to save draft.');
      }
    }
  } catch (error) {
    console.error('Error saving as draft:', error)
     if (error.response && error.response.data) {
        const errorData = error.response.data;
        if (typeof errorData === 'object') {
            const messages = Object.entries(errorData).map(([field, errs]) => `${field}: ${Array.isArray(errs) ? errs.join(', ') : errs}`).join('; ');
            validationErrors.value = Object.entries(errorData).map(([field, errs]) => `${field}: ${Array.isArray(errs) ? errs.join(', ') : errs}`);
            toast.error('Validation errors: ' + messages);
        } else {
            toast.error(errorData.detail || errorData.message || 'Failed to save as draft.');
        }
    } else {
        toast.error('An network error or unexpected issue occurred while saving draft.');
    }
  } finally {
    isSubmitting.value = false
  }
}

// NEW: Handler for the "Submit Application" button
const handleFinalSubmit = async () => {
  if (!validateForm(false)) { // false for strict final submission validation
    toast.error('Please fill all required fields correctly before submitting.')
    return
  }
  // Optional: Add a confirmation dialog here if needed
  // const confirmed = confirm("Are you sure you want to submit this application?");
  // if (!confirmed) {
  //   return;
  // }
  await submitApplicationToServer(); // Call the actual submission logic
}

// REMOVED: initiatePayment function entirely

</script>

<style scoped>
.disabled\:opacity-50:disabled {
  opacity: 0.5;
}
.disabled\:cursor-not-allowed:disabled {
  cursor: not-allowed;
}
</style>