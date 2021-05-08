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
          <div class="mt-4"> <!-- Adjusted margin-top -->
            <label for="nameChangeDeclaration" class="block text-sm font-medium text-gray-700"
              >Declaration <span class="text-red-500">*</span></label
            >
            <select
              id="nameChangeDeclaration"
              v-model="nameChangeDeclaration"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Please select</option>
              <option value="agree">I hereby declare that the information provided is true and correct.</option>
              <!-- <option value="disagree">Disagree</option> -->
            </select>
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
        <!-- The "Edit" button's purpose in this context might be to allow editing a previously saved draft,
             or simply to signify the form is editable. Current form is always editable.
             If it's for loading a draft, that logic would be separate.
        <button
          @click="editApplication"
          :disabled="isSubmitting"
          class="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-yellow-500 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50"
        >
          Edit
        </button> -->
        <button
          @click="initiatePayment"
          :disabled="isSubmitting || !proposedName || nameChangeDeclaration !== 'agree'"
          class="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Proceed to Payment
        </button>
        <!-- The onSubmit button is now effectively replaced by the payment flow -->
        <!-- <button
          @click="onSubmit"
          :disabled="nameChangeDeclaration !== 'agree' || !proposedName || isSubmitting"
          class="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <svg v-if="isSubmitting" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ isSubmitting ? 'Submitting...' : 'Submit Application' }}
        </button> -->
      </div>
    </div>
     <!-- Payment Modal (Assuming you have one or will create one) -->
    <!-- <PaymentModal
        ref="paymentModalRef"
        :amount="NAME_CHANGE_FEE" // Define this constant
        @payment-completed="handlePaymentCompleted"
        @close="handlePaymentModalClose"
    /> -->
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore' // Adjust path if needed
import { useRouter } from 'vue-router' // If navigation is needed
import apiServices from '@/services/services'
import { useToast } from 'vue-toastification' // Optional: for notifications

// const NAME_CHANGE_FEE = 200; // Example Fee, define appropriately

const props = defineProps({
  // initialData prop can be used if you want to load a saved draft for editing
  initialData: {
    type: Object,
    default: () => ({}),
  },
})

const authStore = useAuthStore()
const router = useRouter() // If you need to navigate
const toast = useToast()

const loading = ref(true)
const isSubmitting = ref(false)
const validationErrors = ref([])
// const paymentModalRef = ref(null); // If using a payment modal

let ecpfProfileId = null // To store the ID of the ECPF profile

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
const nameChangeDeclaration = ref('') // For the "Agree" select
const nameChangeRemarks = ref('') // For the optional remarks textarea


const emit = defineEmits(['submit-success', 'save-draft-success', 'payment-initiated']) // Adjusted emit names

// Fetch current ECPF details on component mount
onMounted(async () => {
  loading.value = true
  try {
    if (!authStore.isAuthenticated || !authStore.user) {
      toast.error('Authentication required. Please log in.')
      router.push('/login') // Redirect to login
      return
    }

    if (!authStore.user.cid) {
      toast.error('User CID not found. Cannot fetch ECPF details.')
      // Populate with N/A or fallbacks from authStore if available
      currentDetails.ecpfName = authStore.user?.institute_name || 'N/A'
      currentDetails.licenseNo = authStore.user?.license_no || 'N/A'
      currentDetails.proprietorName = authStore.fullName || 'N/A'
      currentDetails.cid = 'N/A'
      currentDetails.contactNo = authStore.contactNumber || 'N/A'
      currentDetails.emailAddress = authStore.email || 'N/A'
      const locationParts = [authStore.dzongkhag, authStore.gewog, authStore.village].filter(Boolean)
      currentDetails.location = locationParts.length > 0 ? locationParts.join(', ') : 'N/A'
      return
    }

    // Fetch ECPF details using CID (similar to renewal form)
    const response = await apiServices.getEcpfDetailsByCID(authStore.user.cid)
    const fetchedEcpfData = response.data

    if (fetchedEcpfData) {
      ecpfProfileId = fetchedEcpfData.id // Store the ECPF profile ID

      currentDetails.ecpfName = fetchedEcpfData.institute_name || fetchedEcpfData.name || fetchedEcpfData.firm_name || 'N/A'
      currentDetails.licenseNo = fetchedEcpfData.license_no || fetchedEcpfData.registration_no || authStore.user?.license_no || 'N/A'

      const locationParts = [
        fetchedEcpfData.dzongkhag || authStore.dzongkhag,
        fetchedEcpfData.gewog || authStore.gewog,
        fetchedEcpfData.village || authStore.village,
      ].filter(Boolean)
      currentDetails.location = locationParts.length > 0 ? locationParts.join(', ') : fetchedEcpfData.location || 'N/A'

      currentDetails.proprietorName = fetchedEcpfData.proprietor_name || authStore.fullName || 'N/A'
      currentDetails.cid = fetchedEcpfData.cid || authStore.user.cid || 'N/A'
      currentDetails.contactNo = fetchedEcpfData.contact_no || authStore.contactNumber || 'N/A'
      currentDetails.emailAddress = fetchedEcpfData.email_address || authStore.email || 'N/A'
    } else {
      toast.error('Could not fetch ECPF details.')
      // Populate with N/A or fallbacks
       Object.keys(currentDetails).forEach(key => currentDetails[key] = 'N/A (Error)');
       currentDetails.cid = authStore.user.cid || 'N/A (Error)';
    }
  } catch (error) {
    console.error('Error fetching ECPF details:', error)
    toast.error('Failed to load ECPF details. Please try again.')
    // Populate with N/A or fallbacks in case of error
    Object.keys(currentDetails).forEach(key => currentDetails[key] = 'N/A (Error)');
    if (authStore.user) {
        currentDetails.cid = authStore.user.cid || 'N/A (Error)';
        currentDetails.proprietorName = authStore.fullName || 'N/A (Error)';
        // ... other fallbacks from authStore if desired
    }
  } finally {
    loading.value = false
  }
})

// Watch for initialData prop to populate form for editing a draft
watch(
  () => props.initialData,
  (newData) => {
    if (newData && Object.keys(newData).length > 0) {
        proposedName.value = newData.proposed_name || newData.proposedName || '' // Check for both possible backend field names
        nameChangeDeclaration.value = newData.declaration === true ? 'agree' : (newData.declaration === false ? '' : (newData.nameChangeDeclaration || ''))
        nameChangeRemarks.value = newData.remarks || newData.nameChangeRemarks || ''
        // If initialData contains an ID for the draft, store it for updates
        // e.g., draftId.value = newData.id;
    }
  },
  { immediate: true, deep: true },
)

const validateForm = () => {
  validationErrors.value = []
  if (!proposedName.value.trim()) {
    validationErrors.value.push('Proposed New Name of ECPF is required.')
  }
  if (nameChangeDeclaration.value !== 'agree') {
    validationErrors.value.push('You must agree to the declaration.')
  }
  if (!ecpfProfileId) {
      validationErrors.value.push('ECPF Profile ID is missing. Cannot proceed.')
  }
  return validationErrors.value.length === 0
}

// This function would be called after payment is successful
const submitApplication = async (paymentInfo) => {
  if (!validateForm()) {
    // This check is more for programmatic calls, UI should prevent this
    toast.error('Please correct the form errors.')
    return
  }
  isSubmitting.value = true

  const payload = {
    ecpf_profile: ecpfProfileId, // Link to the ECPF profile
    current_name: currentDetails.ecpfName, // For record/logging
    proposed_name: proposedName.value.trim(),
    declaration: nameChangeDeclaration.value === 'agree',
    remarks: nameChangeRemarks.value.trim(),
    payment_info: paymentInfo, // Include payment details from payment modal
    status: 'Submitted'
  }

  try {
    // const response = await apiServices.createEcpfNameChange(payload) // Or update if editing a draft
    // For now, let's assume create. If editing, you'd need a draftId and use patch/put.
    // Replace with actual API call to create/update ECPF Name Change request
    console.log("Submitting payload:", payload)
    const response = await new Promise(resolve => setTimeout(() => resolve({ status: 201, data: { ...payload, id: Date.now(), message: 'Application submitted successfully!' } }), 1000)); // Mock API call

    if (response.status === 201 || response.status === 200) {
      toast.success(response.data.message || 'Name change application submitted successfully!')
      emit('submit-success', response.data)
      // Reset form fields
      proposedName.value = ''
      nameChangeDeclaration.value = ''
      nameChangeRemarks.value = ''
      validationErrors.value = []
      // Optionally, navigate to a success page or dashboard
      // router.push('/dashboard/tracker');
    } else {
      toast.error(response.data?.detail || 'Failed to submit application. Please try again.')
      if(response.data && typeof response.data === 'object'){
        // Populate validationErrors.value from response.data if backend sends field errors
      }
    }
  } catch (error) {
    console.error('Error submitting application:', error)
    toast.error('An error occurred while submitting the application. Please check console for details.')
     if (error.response?.data) {
        // Populate validationErrors.value
     }
  } finally {
    isSubmitting.value = false
  }
}

const saveAsDraft = async () => {
  if (!proposedName.value.trim() && !nameChangeRemarks.value.trim()){
      toast.info("Please enter a proposed name or remarks to save as draft.");
      return;
  }
  isSubmitting.value = true; // Use same flag to disable buttons

  const draftPayload = {
    ecpf_profile: ecpfProfileId,
    current_name: currentDetails.ecpfName,
    proposed_name: proposedName.value.trim(),
    declaration: nameChangeDeclaration.value === 'agree', // Store declaration state
    remarks: nameChangeRemarks.value.trim(),
    is_draft: true, // Or status: 'Draft'
  }
  // If editing an existing draft, include its ID:
  // if (draftId.value) draftPayload.id = draftId.value;

  try {
    // Replace with actual API call to save/update draft
    // const response = draftId.value
    //   ? await apiServices.updateEcpfNameChangeDraft(draftId.value, draftPayload)
    //   : await apiServices.createEcpfNameChangeDraft(draftPayload);
    console.log("Saving draft:", draftPayload);
    const response = await new Promise(resolve => setTimeout(() => resolve({ status: 200, data: { ...draftPayload, id: Date.now(), message: 'Application saved as draft!' } }), 1000)); // Mock API call

    toast.success(response.data.message || 'Application saved as draft!');
    emit('save-draft-success', response.data);
    // draftId.value = response.data.id; // Store new/updated draft ID
  } catch (error) {
    console.error('Error saving as draft:', error);
    toast.error('Failed to save as draft. Please try again.');
  } finally {
    isSubmitting.value = false;
  }
}

const initiatePayment = () => {
  if (!validateForm()) {
    toast.error("Please fill all required fields correctly before proceeding to payment.");
    return;
  }
  toast.info('Proceeding to payment... (Payment Integration Pending)');
  emit('payment-initiated', {
    amount: 200, // NAME_CHANGE_FEE
    description: `Payment for ECPF Name Change to "${proposedName.value}"`,
    // ... other relevant data for payment modal/page
  });
  // Here you would typically open a payment modal or redirect to a payment page
  // For example:
  // if (paymentModalRef.value) {
  //   paymentModalRef.value.openModal();
  // } else {
  //   toast.error("Payment module not available.");
  // }

  // For now, let's simulate payment success and then submit
  // In a real scenario, submitApplication would be called by the payment modal's @payment-completed event
  setTimeout(async () => {
    const mockPaymentData = { paymentHash: 'mock_payment_hash_' + Date.now(), status: 'Completed' };
    toast.success("Mock payment successful!");
    await submitApplication(mockPaymentData);
  }, 1500);
}

// const handlePaymentCompleted = (paymentData) => {
//   toast.success("Payment completed successfully! Submitting application...");
//   submitApplication(paymentData); // Submit the form with payment data
// };

// const handlePaymentModalClose = () => {
//   toast.info("Payment process was cancelled or closed.");
//   isSubmitting.value = false; // Re-enable submit button if needed
// };


// The "Edit" button functionality depends on your workflow.
// If it's to load a draft, that should happen via props or a separate load mechanism.
// If it's just to indicate the form is editable, it's not strictly needed as inputs are live.
// const editApplication = () => {
//   toast.info('The form is currently editable. Make your changes and save or submit.');
// }
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