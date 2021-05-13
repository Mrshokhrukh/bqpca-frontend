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
                v-for="option in dzongkhagThromdeOptions"
                :key="option.id || option.value"
                :value="option.id || option.value"
              >
                {{ option.name || option.label }}
              </option>
            </select>
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
                :key="option.id || option.value"
                :value="option.id || option.value"
              >
                {{ option.name || option.label }}
              </option>
            </select>
            <p
              v-if="
                newLocationDetails.dzongkhag_thromde &&
                filteredGewogOptions.length === 0 &&
                !loadingGewogs
              "
              class="mt-1 text-xs text-gray-500"
            >
              No Gewogs/Throms available for the selected Dzongkhag/Thromde.
            </p>
            <p v-if="loadingGewogs" class="mt-1 text-xs text-indigo-500">
              Loading Gewogs/Throms...
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
            <label for="locationChangeDeclaration" class="block text-sm font-medium text-gray-700"
              >Declaration <span class="text-red-500">*</span></label
            >
            <select
              id="locationChangeDeclaration"
              v-model="locationChangeDeclaration"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Please select</option>
              <option value="agree">
                I hereby declare that the information provided for the new location is true and
                correct.
              </option>
            </select>
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
          @click="initiatePayment"
          :disabled="isSubmitting || !isFormValidForPayment()"
          class="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Proceed to Payment
        </button>
      </div>
    </div>
    <!-- Payment Modal (Assuming you will integrate one) -->
    <!-- <PaymentModal
        ref="paymentModalRef"
        :amount="LOCATION_CHANGE_FEE" // Define this constant
        @payment-completed="handlePaymentCompleted"
        @close="handlePaymentModalClose"
    /> -->
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted, computed, nextTick } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'
import apiServices from '@/services/services'
import { useToast } from 'vue-toastification'

// const LOCATION_CHANGE_FEE = 300; // Example Fee

const props = defineProps({
  // Options for dropdowns - these should be fetched by the parent component and passed down
  dzongkhagThromdeOptions: {
    type: Array,
    default: () => [],
  },
  gewogThromOptions: {
    // This will now be all gewogs, and we will filter them
    type: Array,
    default: () => [],
  },
  initialData: {
    // For loading a saved draft
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
// const paymentModalRef = ref(null);

let ecpfProfileId = null // To store the ID of the ECPF profile

const currentDetails = reactive({
  ecpfName: '',
  location: '', // This will be a concatenated string of current Dzongkhag, Gewog, Village
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

const locationChangeDeclaration = ref('')
const locationChangeRemarks = ref('') // Optional remarks

const loadingGewogs = ref(false) // For loading indicator when dzongkhag changes

const emit = defineEmits(['submit-success', 'save-draft-success', 'payment-initiated'])

// Filter Gewog/Throm options based on selected Dzongkhag/Thromde
const filteredGewogOptions = computed(() => {
  if (!newLocationDetails.dzongkhag_thromde) {
    return []
  }
  // Assuming gewogThromOptions has a 'dzongkhag_id' or similar property to filter by
  return props.gewogThromOptions.filter(
    (gewog) =>
      gewog.dzongkhag_id === newLocationDetails.dzongkhag_thromde ||
      gewog.dzongkhag === newLocationDetails.dzongkhag_thromde, // Adjust property name as needed
  )
})

const handleDzongkhagChange = () => {
  newLocationDetails.gewog_throm = '' // Reset gewog when dzongkhag changes
  // If gewogs were fetched dynamically, trigger fetch here
  // loadingGewogs.value = true;
  // fetchGewogsForDzongkhag(newLocationDetails.dzongkhag_thromde).finally(() => loadingGewogs.value = false);
}

// Fetch current ECPF details on component mount
onMounted(async () => {
  loading.value = true
  try {
    if (!authStore.isAuthenticated || !authStore.user) {
      toast.error('Authentication required. Please log in.')
      router.push('/login')
      return
    }
    if (!authStore.user.cid) {
      toast.error('User CID not found. Cannot fetch ECPF details.')
      Object.keys(currentDetails).forEach((key) => (currentDetails[key] = 'N/A'))
      currentDetails.cid = 'N/A'
      return
    }

    const response = await apiServices.getEcpfDetailsByCID(authStore.user.cid)
    const fetchedEcpfData = response.data

    if (fetchedEcpfData) {
      ecpfProfileId = fetchedEcpfData.id

      currentDetails.ecpfName =
        fetchedEcpfData.institute_name || fetchedEcpfData.name || fetchedEcpfData.firm_name || 'N/A'

      const locationParts =
        [
          fetchedEcpfData.dzongkhag, // Assuming these fields exist
          fetchedEcpfData.gewog,
          fetchedEcpfData.village,
        ]
          .filter(Boolean)
          .join(', ') ||
        fetchedEcpfData.location ||
        'N/A' // Fallback to a general location field
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

  // If initialData is provided (e.g., for editing a draft), populate the form
  if (props.initialData && Object.keys(props.initialData).length > 0) {
    newLocationDetails.dzongkhag_thromde =
      props.initialData.new_dzongkhag_thromde || props.initialData.dzongkhag_thromde || ''
    // Ensure dependent dropdowns are populated correctly if dzongkhag is set
    if (newLocationDetails.dzongkhag_thromde) {
      // Might need a slight delay or nextTick if filteredGewogOptions depends on async data
      // or if gewogThromOptions prop isn't immediately ready.
      // For now, assuming props.gewogThromOptions is fully populated.
      await nextTick() // Wait for DOM update if options are dynamic
      newLocationDetails.gewog_throm =
        props.initialData.new_gewog_throm || props.initialData.gewog_throm || ''
    }
    newLocationDetails.village_street =
      props.initialData.new_village_street || props.initialData.village_street || ''
    locationChangeDeclaration.value =
      props.initialData.declaration === true
        ? 'agree'
        : props.initialData.locationChangeDeclaration || ''
    locationChangeRemarks.value =
      props.initialData.remarks || props.initialData.locationChangeRemarks || ''
    // draftId.value = props.initialData.id; // If tracking draft ID
  }
})

const validateForm = (isDraft = false) => {
  validationErrors.value = []
  if (!ecpfProfileId) {
    validationErrors.value.push('ECPF Profile ID is missing. Cannot proceed.')
  }
  if (!isDraft) {
    // Stricter validation for final submission
    if (!newLocationDetails.dzongkhag_thromde) {
      validationErrors.value.push('New Dzongkhag/Thromde is required.')
    }
    if (!newLocationDetails.gewog_throm) {
      validationErrors.value.push('New Gewog/Throm is required.')
    }
    if (!newLocationDetails.village_street.trim()) {
      validationErrors.value.push('New Village/Street Address is required.')
    }
    if (locationChangeDeclaration.value !== 'agree') {
      validationErrors.value.push('You must agree to the declaration.')
    }
  } else {
    // Lenient validation for draft
    if (
      !newLocationDetails.dzongkhag_thromde &&
      !newLocationDetails.gewog_throm &&
      !newLocationDetails.village_street.trim() &&
      !locationChangeRemarks.value.trim()
    ) {
      validationErrors.value.push(
        'Please enter at least one field for the new location or remarks to save a draft.',
      )
    }
  }
  return validationErrors.value.length === 0
}

const isFormValidForPayment = () => {
  // Simplified version of validateForm without populating validationErrors array for UI
  // Just checks if critical fields for submission are filled
  return (
    ecpfProfileId &&
    newLocationDetails.dzongkhag_thromde &&
    newLocationDetails.gewog_throm &&
    newLocationDetails.village_street.trim() &&
    locationChangeDeclaration.value === 'agree'
  )
}

const submitApplication = async () => {
  if (!validateForm()) {
    toast.error('Please correct the form errors.')
    return
  }
  isSubmitting.value = true

  const payload = {
    ecpf_profile: ecpfProfileId,
    current_location_summary: currentDetails.location, // For record keeping
    new_dzongkhag: newLocationDetails.dzongkhag_thromde, // Send ID or name based on backend
    new_gewog: newLocationDetails.gewog_throm, // Send ID or name based on backend
    new_village_street: newLocationDetails.village_street.trim(),
    declaration: locationChangeDeclaration.value === 'agree',
    remarks: locationChangeRemarks.value.trim(),
    // payment_info: paymentInfo,
    // status: 'Submitted',
  }
  // Find the text values for Dzongkhag and Gewog if IDs are stored
  const dzongkhagObj = props.dzongkhagThromdeOptions.find(
    (opt) => (opt.id || opt.value) === newLocationDetails.dzongkhag_thromde,
  )
  const gewogObj = filteredGewogOptions.value.find(
    (opt) => (opt.id || opt.value) === newLocationDetails.gewog_throm,
  )

  if (dzongkhagObj) payload.new_dzongkhag_name = dzongkhagObj.name || dzongkhagObj.label
  if (gewogObj) payload.new_gewog_name = gewogObj.name || gewogObj.label

  try {
    console.log('Submitting ECPF Location Change payload:', payload)
    // const response = await apiServices.createEcpfLocationChange(payload)
    const response = await new Promise((resolve) =>
      setTimeout(
        () =>
          resolve({
            status: 201,
            data: {
              ...payload,
              id: Date.now(),
              message: 'Location change application submitted successfully!',
            },
          }),
        1000,
      ),
    ) // Mock API

    if (response.status === 201 || response.status === 200) {
      toast.success(response.data.message || 'Location change application submitted successfully!')
      emit('submit-success', response.data)
      // Reset form
      Object.assign(newLocationDetails, {
        dzongkhag_thromde: '',
        gewog_throm: '',
        village_street: '',
      })
      locationChangeDeclaration.value = ''
      locationChangeRemarks.value = ''
      validationErrors.value = []
    } else {
      toast.error(response.data?.detail || 'Failed to submit application.')
    }
  } catch (error) {
    console.error('Error submitting location change application:', error)
    toast.error('An error occurred while submitting the application.')
  } finally {
    isSubmitting.value = false
  }
}

const saveAsDraft = async () => {
  if (!validateForm(true)) {
    // Pass true for lenient draft validation
    toast.error(validationErrors.value.join(' ') || 'Cannot save an empty draft.')
    return
  }
  isSubmitting.value = true

  const draftPayload = {
    ecpf_profile: ecpfProfileId,
    current_location_summary: currentDetails.location,
    new_dzongkhag: newLocationDetails.dzongkhag_thromde,
    new_gewog: newLocationDetails.gewog_throm,
    new_village_street: newLocationDetails.village_street.trim(),
    declaration: locationChangeDeclaration.value === 'agree', // Save declaration state
    remarks: locationChangeRemarks.value.trim(),
    is_draft: true,
  }

  try {
    console.log('Saving ECPF Location Change as draft:', draftPayload)
    // const response = await apiServices.createOrUpdateEcpfLocationChangeDraft(draftPayload);
    const response = await new Promise((resolve) =>
      setTimeout(
        () =>
          resolve({
            status: 200,
            data: { ...draftPayload, id: Date.now(), message: 'Application saved as draft!' },
          }),
        1000,
      ),
    ) // Mock API

    toast.success(response.data.message || 'Application saved as draft!')
    emit('save-draft-success', response.data)
  } catch (error) {
    console.error('Error saving as draft:', error)
    toast.error('Failed to save as draft.')
  } finally {
    isSubmitting.value = false
  }
}

const initiatePayment = () => {
  if (!validateForm()) {
    // Use strict validation before payment
    toast.error('Please fill all required fields correctly before proceeding to payment.')
    return
  }
  toast.info('Proceeding to payment... (Payment Integration Pending)')
  emit('payment-initiated', {
    // amount: LOCATION_CHANGE_FEE,
    description: `Payment for ECPF Location Change`,
  })

  // Mock payment success and submission
  setTimeout(async () => {
    const mockPaymentData = {
      paymentHash: 'mock_payment_hash_loc_' + Date.now(),
      status: 'Completed',
    }
    toast.success('Mock payment successful for location change!')
    await submitApplication(mockPaymentData)
  }, 1500)
}

// const handlePaymentCompleted = (paymentData) => {
//   submitApplication(paymentData);
// };
// const handlePaymentModalClose = () => {
//   isSubmitting.value = false;
// };

// Watch for initialData to populate form (e.g., when editing a draft)
watch(
  () => props.initialData,
  async (newData) => {
    if (newData && Object.keys(newData).length > 0 && !loading.value) {
      // Ensure initial load is complete
      newLocationDetails.dzongkhag_thromde =
        newData.new_dzongkhag || newData.new_dzongkhag_thromde || ''
      await nextTick() // Allow filteredGewogOptions to update
      newLocationDetails.gewog_throm = newData.new_gewog || newData.new_gewog_throm || ''
      newLocationDetails.village_street = newData.new_village_street || ''
      locationChangeDeclaration.value =
        newData.declaration === true ? 'agree' : newData.locationChangeDeclaration || ''
      locationChangeRemarks.value = newData.remarks || newData.locationChangeRemarks || ''
      // draftId.value = newData.id; // If you have a draftId ref
    }
  },
  { deep: true, immediate: false }, // deep: true, immediate: false to run after mount and when prop changes
)
</script>

<style scoped>
.disabled\:opacity-50:disabled {
  opacity: 0.5;
}
.disabled\:cursor-not-allowed:disabled {
  cursor: not-allowed;
}
</style>
