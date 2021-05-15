<!-- NameChange.vue -->
<template>
  <div class="p-8 min-h-screen bg-gray-50">
    <div class="bg-white rounded-xl p-8 mb-10 shadow-sm border border-gray-100">
      <h1 class="text-4xl font-bold text-gray-900 mb-3">ECPF Name Change</h1>
      <p class="text-gray-600">
        Please provide the current details and the proposed new name for the ECPF.
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
            <label class="block text-sm font-medium text-gray-700">License No.</label>
            <input
              type="text"
              :value="currentDetails.licenseNo"
              readonly
              class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Location</label>
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
          <h3 class="text-lg font-medium text-gray-800 border-b pb-2 mb-3">Proposed Change</h3>
          <div>
            <label for="proposedName" class="block text-sm font-medium text-gray-700"
              >Proposed New Name of ECPF <span class="text-red-500">*</span></label
            >
            <input
              type="text"
              id="proposedName"
              v-model="proposedName"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter the new ECPF name"
            />
          </div>

          <!-- Declaration Checkbox -->
          <div class="mt-6">
            <div class="flex items-center">
              <input
                id="nameChangeDeclaration"
                type="checkbox"
                v-model="nameChangeDeclaration"
                class="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <label for="nameChangeDeclaration" class="ml-2 block text-sm font-medium text-gray-700">
                I hereby declare that the information provided is true and correct.
                <span class="text-red-500">*</span>
              </label>
            </div>
          </div>

          <div class="mt-4">
            <label for="nameChangeRemarks" class="block text-sm font-medium text-gray-700"
              >Remarks (Optional)</label
            >
            <textarea
              id="nameChangeRemarks"
              v-model="nameChangeRemarks"
              rows="3"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter any remarks regarding the name change"
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
          @click="submitApplication"
          :disabled="isSubmitting || !proposedName || !nameChangeDeclaration"
          class="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ isSubmitting ? 'Submitting...' : 'Submit Application' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'
import apiServices from '@/services/services' // Ensure this path is correct
import { useToast } from 'vue-toastification'

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

let ecpfProfileId = null

const currentDetails = reactive({
  ecpfName: '',
  licenseNo: '',
  location: '',
  proprietorName: '',
  cid: '',
  contactNo: '',
  emailAddress: '',
})

const proposedName = ref('')
const nameChangeDeclaration = ref(false)
const nameChangeRemarks = ref('')

const emit = defineEmits(['submit-success', 'save-draft-success']) // Removed 'payment-initiated'

onMounted(async () => {
  loading.value = true
  try {
    if (!authStore.isAuthenticated || !authStore.user) {
      toast.error('Authentication required. Please log in.')
      router.push('/login')
      return
    }

    if (!authStore.user.cid) {
        toast.error('User CID not found. Cannot fetch ECPF details.');
        currentDetails.ecpfName = authStore.user?.institute_name || 'N/A'
        currentDetails.licenseNo = authStore.user?.license_no || 'N/A'
        currentDetails.proprietorName = authStore.fullName || 'N/A'
        currentDetails.cid = 'N/A'
        currentDetails.contactNo = authStore.contactNumber || 'N/A'
        currentDetails.emailAddress = authStore.email || 'N/A'
        const locationParts = [authStore.dzongkhag, authStore.gewog, authStore.village].filter(
            Boolean,
        )
        currentDetails.location = locationParts.length > 0 ? locationParts.join(', ') : 'N/A'
        loading.value = false;
        return
    }

    const response = await apiServices.getEcpfDetailsByCID(authStore.user.cid)
    const fetchedEcpfData = response.data

    if (fetchedEcpfData) {
      ecpfProfileId = fetchedEcpfData.id
      currentDetails.ecpfName =
        fetchedEcpfData.institute_name || fetchedEcpfData.name || fetchedEcpfData.firm_name || 'N/A'
      currentDetails.licenseNo =
        fetchedEcpfData.license_number ||
        fetchedEcpfData.registration_no ||
        authStore.user?.license_no ||
        'N/A'
      const locationParts = [
        fetchedEcpfData.dzongkhag || authStore.dzongkhag,
        fetchedEcpfData.gewog || authStore.gewog,
        fetchedEcpfData.village || authStore.village,
      ].filter(Boolean)
      currentDetails.location =
        locationParts.length > 0 ? locationParts.join(', ') : (fetchedEcpfData.location || fetchedEcpfData.firm_location || 'N/A')

      currentDetails.proprietorName = fetchedEcpfData.applicants_name || fetchedEcpfData.proprietor_name || authStore.fullName || 'N/A'
      currentDetails.cid = fetchedEcpfData.cid_no || fetchedEcpfData.cid || authStore.user.cid || 'N/A'
      currentDetails.contactNo = fetchedEcpfData.contact_no || authStore.contactNumber || 'N/A'
      currentDetails.emailAddress = fetchedEcpfData.email || fetchedEcpfData.email_address || authStore.email || 'N/A'
    } else {
      toast.error('Could not fetch ECPF details.')
      Object.keys(currentDetails).forEach((key) => (currentDetails[key] = 'N/A (Error)'))
      currentDetails.cid = authStore.user.cid || 'N/A (Error)'
      currentDetails.licenseNo = authStore.user?.license_no || 'N/A (Error)'
    }
  } catch (error) {
    console.error('Error fetching ECPF details:', error)
    toast.error('Failed to load ECPF details. Please try again.')
    Object.keys(currentDetails).forEach((key) => (currentDetails[key] = 'N/A (Error)'))
    if (authStore.user) {
      currentDetails.cid = authStore.user.cid || 'N/A (Error)'
      currentDetails.proprietorName = authStore.fullName || 'N/A (Error)'
      currentDetails.licenseNo = authStore.user?.license_no || 'N/A (Error)'
    }
  } finally {
    loading.value = false
  }
})

watch(
  () => props.initialData,
  (newData) => {
    if (newData && Object.keys(newData).length > 0) {
      proposedName.value = newData.new_proposed_name || newData.proposed_name || newData.proposedName || ''

      if (typeof newData.declaration === 'boolean') {
        nameChangeDeclaration.value = newData.declaration;
      } else if (typeof newData.nameChangeDeclaration === 'string') {
        nameChangeDeclaration.value = newData.nameChangeDeclaration === 'agree';
      } else if (typeof newData.nameChangeDeclaration === 'boolean') {
         nameChangeDeclaration.value = newData.nameChangeDeclaration;
      } else {
        nameChangeDeclaration.value = false;
      }

      nameChangeRemarks.value = newData.remarks || newData.nameChangeRemarks || ''
      if (newData.ecpf_profile) ecpfProfileId = newData.ecpf_profile;
      if (newData.current_name) currentDetails.ecpfName = newData.current_name;
    }
  },
  { immediate: true, deep: true },
)

const validateForm = () => {
  validationErrors.value = []
  if (!proposedName.value.trim()) {
    validationErrors.value.push('Proposed New Name of ECPF is required.')
  }
  if (!nameChangeDeclaration.value) {
    validationErrors.value.push('You must agree to the declaration.')
  }
  if (!ecpfProfileId) {
    validationErrors.value.push('ECPF Profile ID is missing. Cannot link this request. Please refresh or contact support.')
  }
  return validationErrors.value.length === 0
}

const submitApplication = async () => { // Removed paymentInfo parameter
  if (!validateForm()) {
    toast.error('Please correct the form errors.')
    return
  }
  isSubmitting.value = true

  const payload = {
    ecpf_profile: ecpfProfileId,
    current_name: currentDetails.ecpfName,
    new_proposed_name: proposedName.value.trim(),
    declaration: nameChangeDeclaration.value,
    remarks: nameChangeRemarks.value.trim(),
    status: 'Submitted', // Directly set status
  }

  try {
    console.log('Submitting payload for ECPF Name Change:', payload)
    const response = await apiServices.createEcpfNameChange(payload)

    if (response.status === 201 || response.status === 200) {
      toast.success(response.data.message || 'Name change application submitted successfully!')
      emit('submit-success', response.data)
      proposedName.value = ''
      nameChangeDeclaration.value = false
      nameChangeRemarks.value = ''
      validationErrors.value = []
    } else {
      const errorMsg = response.data?.detail || response.data?.message || 'Failed to submit application. Please try again.'
      toast.error(errorMsg)
      if (response.data && typeof response.data === 'object') {
        Object.entries(response.data).forEach(([key, value]) => {
          if (Array.isArray(value)) {
            validationErrors.value.push(`${key.replace(/_/g, ' ')}: ${value.join(', ')}`);
          }
        });
      }
    }
  } catch (error) {
    console.error('Error submitting ECPF name change application:', error)
    validationErrors.value = []
    let errorMsg = 'An error occurred while submitting the application.'
    if (error.response) {
        errorMsg = error.response.data?.detail || error.response.data?.message || `Server error: ${error.response.status}`;
        if (error.response.data && typeof error.response.data === 'object') {
            Object.entries(error.response.data).forEach(([key, value]) => {
                const readableKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                if (Array.isArray(value)) {
                    validationErrors.value.push(`${readableKey}: ${value.join(', ')}`);
                } else if (typeof value === 'string') {
                     validationErrors.value.push(`${readableKey}: ${value}`);
                }
            });
            if (!validationErrors.value.length && (error.response.data?.detail || error.response.data?.message)) {
                 validationErrors.value.push(error.response.data?.detail || error.response.data?.message);
            } else if (!validationErrors.value.length) {
                 validationErrors.value.push(`Server error: ${error.response.status}`);
            }
        } else {
            validationErrors.value.push(errorMsg);
        }
    } else if (error.request) {
        errorMsg = 'No response from server. Please check your network connection.';
        validationErrors.value.push(errorMsg);
    } else {
        errorMsg = `Request setup error: ${error.message}`;
        validationErrors.value.push(errorMsg);
    }
    toast.error('Submission failed. Please see error messages below.');
  } finally {
    isSubmitting.value = false
  }
}

const saveAsDraft = async () => {
  if (!proposedName.value.trim() && !nameChangeRemarks.value.trim() && !nameChangeDeclaration.value) {
    toast.info('Please enter a proposed name, remarks, or check the declaration to save as draft.')
    return
  }
  if (!ecpfProfileId) {
    toast.error('ECPF Profile ID is missing. Cannot save draft.');
    return;
  }
  isSubmitting.value = true

  const draftPayload = {
    ecpf_profile: ecpfProfileId,
    current_name: currentDetails.ecpfName,
    new_proposed_name: proposedName.value.trim(),
    declaration: nameChangeDeclaration.value,
    remarks: nameChangeRemarks.value.trim(),
    is_draft: true,
  }

  try {
    console.log('Saving ECPF Name Change as draft:', draftPayload)
    const response = await apiServices.createEcpfNameChange(draftPayload)

    if (response.status === 200 || response.status === 201) {
        toast.success(response.data.message || 'Application saved as draft!')
        emit('save-draft-success', response.data)
    } else {
        const errorMsg = response.data?.detail || response.data?.message || 'Failed to save draft.'
        toast.error(errorMsg)
    }

  } catch (error) {
    console.error('Error saving ECPF name change as draft:', error)
    let errorMsg = 'An error occurred while saving the draft.'
     if (error.response) {
        errorMsg = error.response.data?.detail || error.response.data?.message || `Server error: ${error.response.status}`;
         if (error.response.data && typeof error.response.data === 'object' && error.response.data.new_proposed_name) {
            toast.error(`Draft Error - New Proposed Name: ${error.response.data.new_proposed_name.join(', ')}`)
            isSubmitting.value = false;
            return;
         }
    } else if (error.request) {
        errorMsg = 'No response from server. Please check your network connection.';
    } else {
        errorMsg = `Request setup error: ${error.message}`;
    }
    toast.error(errorMsg);
  } finally {
    isSubmitting.value = false
  }
}

// initiatePayment function is removed as it's no longer needed.

</script>

<style scoped>
.disabled\:opacity-50:disabled {
  opacity: 0.5;
}
.disabled\:cursor-not-allowed:disabled {
  cursor: not-allowed;
}
/* Additional styling if needed */
</style>