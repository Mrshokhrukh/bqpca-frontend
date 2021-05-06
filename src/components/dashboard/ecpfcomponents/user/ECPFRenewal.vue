<template>
  <div class="p-8 min-h-screen bg-gray-50">
    <div class="bg-white rounded-xl p-8 mb-10 shadow-sm border border-gray-100">
      <h1 class="text-4xl font-bold text-gray-900 mb-3">ECPF Renewal</h1>
      <p class="text-gray-600">Please fill in the following details for ECPF renewal.</p>
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
        <p class="text-gray-600 font-medium">Loading form data...</p>
      </div>
    </div>

    <div v-else class="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Auto-populated Fields -->
        <div>
          <label class="block text-sm font-medium text-gray-700">ECPF Name</label>
          <input
            type="text"
            :value="ecpfData.institute_name"
            readonly
            class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Location</label>
          <input
            type="text"
            :value="ecpfData.location"
            readonly
            class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Name of Proprietor</label>
          <input
            type="text"
            :value="ecpfData.proprietor_name"
            readonly
            class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">CID</label>
          <input
            type="text"
            :value="ecpfData.cid"
            readonly
            class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Contact No</label>
          <input
            type="text"
            :value="ecpfData.contact_no"
            readonly
            class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Email Address</label>
          <input
            type="email"
            :value="ecpfData.email_address"
            readonly
            class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        <!-- Subject (Dropdown) -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Subject <span class="text-red-500">*</span></label>
          <select
            v-model="renewalData.subject"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Select Renewal Type</option>
            <option value="Independent ECPF renewal">Independent ECPF renewal</option>
            <option value="ECPF in Collaboration renewal">ECPF in Collaboration renewal</option>
            <option value="Branch Renewal">Branch Renewal</option>
          </select>
        </div>

        <!-- Remarks (Textarea) -->
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700">Remarks</label>
          <textarea
            v-model="renewalData.remarks"
            rows="3"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          ></textarea>
        </div>
      </div>

      <!-- Declaration (Checkbox) -->
      <div class="mt-6">
        <label class="flex items-center text-sm font-medium text-gray-700">
          <input
            type="checkbox"
            v-model="renewalData.declaration"
            class="mr-2 h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
          />
          I agree to the terms and conditions of the ECPF renewal. <span class="text-red-500">*</span>
        </label>
      </div>

      <!-- License Validity Check (Conditional Message) -->
      <div v-if="licenseValidityMessage" :class="licenseMessageClass" class="mt-4 p-3 rounded-md text-sm">
        {{ licenseValidityMessage }}
      </div>

      <!-- Validation Errors -->
      <div v-if="validationErrors.length" class="mt-4 text-red-600 bg-red-50 p-3 rounded-md">
        <p class="font-medium">Please correct the following errors:</p>
        <ul class="list-disc list-inside ml-4">
          <li v-for="(error, index) in validationErrors" :key="index">{{ error }}</li>
        </ul>
      </div>

      <!-- Action Buttons -->
      <div class="mt-6 flex flex-wrap justify-end space-x-0 sm:space-x-4 space-y-2 sm:space-y-0">
        <button
          @click="saveAsDraft"
          :disabled="isSubmittingRenewal"
          class="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
        >
          Save as Draft
        </button>
        <button
          @click="editApplication"
          :disabled="isSubmittingRenewal"
          class="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-yellow-500 rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50"
        >
          Edit
        </button>
        <button
          @click="handleSubmitFlow"
          :disabled="!canSubmit() || isSubmittingRenewal"
          class="w-full sm:w-auto px-6 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center justify-center"
        >
          <svg v-if="isSubmittingRenewal" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {{ isSubmittingRenewal ? 'Processing...' : 'Submit & Pay' }}
        </button>
      </div>
    </div>

    <!-- Payment Modal -->
    <PaymentModal
        ref="paymentModalRef"
        :amount="RENEWAL_FEE_ECPF"
        @payment-completed="handlePaymentCompleted"
        @close="handlePaymentModalClose"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/authStore' // Adjust the import path
import { useRouter } from 'vue-router'
import apiServices from '@/services/services' // Adjust the import path
import PaymentModal from '@/components/common/PaymentModal.vue' // Import PaymentModal
import { useToast } from 'vue-toastification'

const RENEWAL_FEE_ECPF = 500; // Example ECPF Renewal Fee
// const ECPF_RENEWAL_SERVICE_CODE = 'ECPF_RENEWAL_SVC'; // Example service code for makePayment if implemented more deeply later

let ecpfProfileId = null

const authStore = useAuthStore()
const router = useRouter()
const toast = useToast()

const paymentModalRef = ref(null)
const pendingRenewalData = ref(null) // To store form data while payment modal is active
const isSubmittingRenewal = ref(false) // Loading state for the submission process

const ecpfData = reactive({
  institute_name: '',
  location: '',
  proprietor_name: '',
  cid: '',
  contact_no: '',
  email_address: '',
})

const renewalData = reactive({
  ecpf_profile: null, // Will be set to ecpfProfileId before submission
  subject: '',
  remarks: '',
  declaration: false,
  validity: '', // This will be the *new* proposed validity date after renewal
})

const licenseValidityMessage = ref('')
const licenseMessageType = ref('info') // 'info', 'warning', 'error'
const validationErrors = ref([])
const loading = ref(true) // For initial form data loading

const licenseMessageClass = computed(() => {
  if (licenseMessageType.value === 'error') {
    return 'bg-red-50 text-red-700 border border-red-300';
  }
  if (licenseMessageType.value === 'warning') {
    return 'bg-yellow-50 text-yellow-700 border border-yellow-300';
  }
  return 'bg-blue-50 text-blue-700 border border-blue-300'; // Default to info
});


onMounted(async () => {
  loading.value = true;
  try {
    if (!authStore.isAuthenticated || !authStore.user) {
      toast.error('Please log in to access the ECPF renewal form.');
      router.push('/login'); // Adjust login route if necessary
      loading.value = false;
      return;
    }

    let fetchedEcpfData = null;

    if (!authStore.user.cid) {
      toast.error('Unable to fetch ECPF profile: User CID not found.');
      ecpfData.institute_name = 'N/A';
      validationErrors.value.push('Unable to fetch ECPF profile: CID not found in your user profile. Please contact support.');
      const defaultExpiry = new Date();
      defaultExpiry.setFullYear(defaultExpiry.getFullYear() + 1);
      renewalData.validity = defaultExpiry.toISOString().split('T')[0];
    } else {
      try {
        const response = await apiServices.getEcpfDetailsByCID(authStore.user.cid);
        fetchedEcpfData = response.data;
        ecpfData.institute_name = fetchedEcpfData.institute_name || fetchedEcpfData.name || fetchedEcpfData.firm_name || 'N/A';
        ecpfProfileId = fetchedEcpfData.id; // Store the ECPF Profile ID
        if (!ecpfProfileId) {
           toast.warn('ECPF profile ID not found. Renewal submission might fail.');
        }
        // renewalData.ecpf_profile = ecpfProfileId; // This will be set in the payload before submission
      } catch (apiError) {
        console.error('Error fetching ECPF profile by CID:', apiError);
        toast.error('Failed to fetch ECPF profile data. Please try again or contact support.');
        ecpfData.institute_name = 'N/A (Error fetching)';
        // Set a default validity for the form to not break, even if data is incomplete
        const defaultExpiry = new Date();
        defaultExpiry.setFullYear(defaultExpiry.getFullYear() + 1);
        renewalData.validity = defaultExpiry.toISOString().split('T')[0];
      }
    }

    // Populate other ecpfData from authStore as fallbacks or primary source
    ecpfData.location = [authStore.dzongkhag, authStore.gewog, authStore.village]
      .filter(Boolean)
      .join(', ') || fetchedEcpfData?.location || 'N/A'; // Prefer fetched data if available
    ecpfData.proprietor_name = authStore.fullName || fetchedEcpfData?.proprietor_name || 'N/A';
    ecpfData.cid = authStore.user.cid || 'N/A';
    ecpfData.contact_no = authStore.contactNumber || fetchedEcpfData?.contact_no || 'N/A';
    ecpfData.email_address = authStore.email || fetchedEcpfData?.email_address || 'N/A';

    // --- Updated Date Logic for license validity and new proposed expiry ---
    const activationDateSource = fetchedEcpfData?.mou_sign_date || authStore.user?.mou_sign_date || authStore.user?.license_activation_date;
    const currentExpirySource = fetchedEcpfData?.mou_validity_date || authStore.user?.mou_validity_date || authStore.user?.license_expiry_date;

    licenseValidityMessage.value = '';
    licenseMessageType.value = 'info';


    if (activationDateSource) {
      const activationDate = new Date(activationDateSource);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (currentExpirySource) {
        const currentExpiry = new Date(currentExpirySource);
        currentExpiry.setHours(0,0,0,0);
        const newProposedExpiry = new Date(currentExpiry);
        newProposedExpiry.setFullYear(currentExpiry.getFullYear() + 1); // Set new validity to 1 year from current expiry
        renewalData.validity = newProposedExpiry.toISOString().split('T')[0];

        // Check if license is already expired
        if (currentExpiry < today) {
            licenseValidityMessage.value = `Your license expired on ${currentExpiry.toLocaleDateString()}. Please check renewal policies for expired licenses. `;
            licenseMessageType.value = 'warning';
        }
        // Optionally, add more checks here, e.g., renewal window (e.g., 3 months before expiry)

      } else {
        // Fallback if current expiry is unknown: 1 year from today.
        const newProposedExpiry = new Date(today);
        newProposedExpiry.setFullYear(today.getFullYear() + 1);
        renewalData.validity = newProposedExpiry.toISOString().split('T')[0];
        const warningMsg = 'Current license expiry date not found. Proposed new validity is an estimate (1 year from today). Please verify.';
        licenseValidityMessage.value = licenseValidityMessage.value ? licenseValidityMessage.value + warningMsg : warningMsg;
        licenseMessageType.value = 'warning';
        console.warn('Current license expiry date (e.g., mou_validity_date) not found. Proposed new validity for renewal set to one year from today.');
      }

      // Check if ECPF has been active for more than six months
      const sixMonthsAgo = new Date(today);
      sixMonthsAgo.setMonth(today.getMonth() - 6);

      if (activationDate < sixMonthsAgo) {
        // This message was previously "You must submit a new application."
        // Adjust if this is a strict block or just informational
        const msg = 'This ECPF has been active for more than six months. Ensure you are following the correct renewal procedure.';
        licenseValidityMessage.value = licenseValidityMessage.value ? licenseValidityMessage.value + msg : msg;
        if (licenseMessageType.value === 'info') licenseMessageType.value = 'info'; // Or 'warning'
      }
    } else {
      licenseValidityMessage.value = 'Critical: License start date (e.g., MoU Sign Date) not found. Cannot accurately determine renewal eligibility or calculate new validity. Please contact support.';
      licenseMessageType.value = 'error';
      // Set a default validity to prevent form breakage
      const defaultExpiry = new Date();
      defaultExpiry.setFullYear(defaultExpiry.getFullYear() + 1);
      renewalData.validity = defaultExpiry.toISOString().split('T')[0];
      console.error('CRITICAL: License activation-like date (mou_sign_date or license_activation_date) not found.');
    }
    // console.log('Proposed new validity for renewal (renewalData.validity to be sent):', renewalData.validity);

  } catch (error) {
    console.error('Error during onMounted initialization:', error);
    toast.error('Failed to initialize form. Please try refreshing the page.');
    const defaultExpiry = new Date();
    defaultExpiry.setFullYear(defaultExpiry.getFullYear() + 1);
    renewalData.validity = defaultExpiry.toISOString().split('T')[0];
    licenseValidityMessage.value = 'An error occurred while loading form data.';
    licenseMessageType.value = 'error';
  } finally {
    loading.value = false;
  }
});

const canSubmit = () => {
  if (!renewalData.declaration || !renewalData.subject) return false; // Basic required fields
  // If there's a critical error message from date logic, prevent submission
  if (licenseMessageType.value === 'error' && licenseValidityMessage.value.toLowerCase().includes('critical')) {
    return false;
  }
  // Add other conditions that might block submission based on licenseValidityMessage if needed
  // e.g., if "must submit a new application" is a hard block.
  // if (licenseValidityMessage.value.includes("must submit a new application")) {
  //   return false;
  // }
  return true;
};

const validateForm = () => {
  validationErrors.value = []
  if (!renewalData.subject) {
    validationErrors.value.push('Please select a Subject for renewal.');
  }
  if (!renewalData.declaration) {
    validationErrors.value.push('You must agree to the declaration before submitting.')
  }
  if (!ecpfProfileId) {
    // This should ideally be caught earlier or be a non-issue if form loads correctly
    validationErrors.value.push('ECPF profile ID is missing. Cannot submit renewal. Please contact support.')
  }
  if (!renewalData.validity) {
    validationErrors.value.push('License validity date is missing. Cannot submit renewal.')
  }
  // Check specific license messages if they are hard blockers
  if (licenseMessageType.value === 'error' && licenseValidityMessage.value.toLowerCase().includes('critical')) {
     validationErrors.value.push("Cannot submit renewal due to: " + licenseValidityMessage.value);
  }

  return validationErrors.value.length === 0;
}

// Renamed from submitRenewal to trigger payment flow
const handleSubmitFlow = () => {
  if (!validateForm()) {
    toast.error("Please correct the errors in the form before proceeding.");
    return;
  }
  if (!canSubmit()) { // Double check, though button should be disabled
      toast.warning("Submission is currently not allowed. Please check messages and form inputs.");
      return;
  }

  pendingRenewalData.value = { ...renewalData }; // Store current form data
  if (paymentModalRef.value) {
    paymentModalRef.value.openModal();
  } else {
    toast.error("Payment module is not available. Please try again later.");
    console.error("PaymentModal ref (paymentModalRef) is not available.");
  }
};

// This function is called after payment is "completed" in the modal
const handlePaymentCompleted = async (paymentData) => {
  if (!pendingRenewalData.value) {
    toast.error("No renewal data found to submit. Please try initiating the process again.");
    isSubmittingRenewal.value = false;
    return;
  }
  isSubmittingRenewal.value = true;
  validationErrors.value = []; // Clear previous validation errors

  // Construct the payload for the API
  const payload = {
    ...pendingRenewalData.value,
    ecpf_profile: ecpfProfileId, // Ensure ECPF Profile ID is correctly assigned
    validity: pendingRenewalData.value.validity, // Proposed new validity date
    // Backend might expect payment info structured, e.g.:
    payment_info: {
        reference_hash: paymentData.paymentHash, // from payment modal
        amount: RENEWAL_FEE_ECPF,
        status: 'Completed' // Or 'Processing', depending on backend flow
    },
    // Or simply a flat payment reference:
    // payment_reference: paymentData.paymentHash,
    // status: 'Submitted' // Or whatever initial status backend expects
  };
  // IMPORTANT: Adjust the `payment_info` or `payment_reference` field name and structure
  // based on what your `createEcpfRenewal` API endpoint expects.

  try {
    console.log('Submitting ECPF renewal with payment:', payload);
    const response = await apiServices.createEcpfRenewal(payload);
    console.log('Renewal submitted successfully:', response.data);

    toast.success(`ECPF Renewal submitted successfully! Payment Reference: ${paymentData.paymentHash.substring(0,8)}... Your application is being processed.`);

    // Reset form fields to initial state
    renewalData.subject = '';
    renewalData.remarks = '';
    renewalData.declaration = false;
    // renewalData.validity might need to be recalculated or cleared depending on UX flow
    // For now, we clear main input fields.
    pendingRenewalData.value = null; // Clear the stored data
    validationErrors.value = []; // Clear any displayed errors
    // Optionally, re-fetch data or navigate the user
    // e.g., router.push('/ecpf-dashboard/tracker'); // If you have a tracker page

  } catch (error) {
    console.error('Error submitting renewal after payment:', error.response || error);
    if (error.response?.data) {
      const errors = error.response.data;
      if (typeof errors === 'object' && errors !== null) {
        for (const [field, messages] of Object.entries(errors)) {
          // Prepend field name unless it's a general detail/non_field_error
          const messagePrefix = field === 'detail' || field === 'non_field_errors' ? '' : `${field}: `;
          if (Array.isArray(messages)) {
            messages.forEach((msg) => validationErrors.value.push(`${messagePrefix}${msg}`));
          } else {
            validationErrors.value.push(`${messagePrefix}${messages}`);
          }
        }
        if (validationErrors.value.length === 0 && !errors.detail && !errors.non_field_errors) {
            // Fallback for unhandled object errors that don't fit common patterns
             validationErrors.value.push('An unexpected error structure received from the server.');
        }
      } else if (typeof errors === 'string') {
        validationErrors.value.push(errors);
      } else {
        validationErrors.value.push('An unknown error occurred during submission.');
      }
      toast.error("Failed to submit renewal: " + (validationErrors.value[0] || "Please check errors and try again."));
    } else {
      // Network error or other unexpected issue
      toast.error('Failed to submit renewal. An unexpected error occurred. Please try again.');
      validationErrors.value.push('An unexpected network or server error occurred.');
    }
  } finally {
    isSubmittingRenewal.value = false;
  }
};

const handlePaymentModalClose = () => {
  // This is called if the user closes the payment modal without "completing" payment
  // You might want to clear pendingRenewalData or inform the user
  // toast.info("Payment process was cancelled.");
  // pendingRenewalData.value = null; // Uncomment if you want to clear data upon modal close
  console.log("Payment modal closed by user.");
};


const saveAsDraft = async () => {
  validationErrors.value = []
  if (!ecpfProfileId) {
    toast.error('ECPF profile ID is missing. Cannot save draft.');
    return;
  }
  // Basic check for subject, as drafts usually need some core info
  if (!renewalData.subject) {
    toast.warning('Please select a Subject before saving as draft.');
    validationErrors.value.push('Subject is required to save a draft.');
    return;
  }

  isSubmittingRenewal.value = true; // Use same flag to disable buttons during API call
  try {
    const draftPayload = {
        ...renewalData,
        ecpf_profile: ecpfProfileId,
        is_draft_user: true, // Assuming backend field for draft status
        // validity field should also be present in drafts if calculated
    };

    console.log('Saving as draft:', draftPayload);
    // This might be a POST if no draft exists, or PATCH if updating existing draft.
    // Assuming createEcpfRenewal can handle draft submissions or you have a specific endpoint.
    // If using patchEcpfRenewal, it would need a draft renewal ID.
    // For simplicity, let's assume createEcpfRenewal handles 'is_draft_user: true'
    const response = await apiServices.createEcpfRenewal(draftPayload); // Or specific draft API
    console.log('Saved as draft successfully:', response.data);
    toast.success('Renewal application saved as draft.');
  } catch (error) {
    console.error('Error saving as draft:', error.response || error);
    if (error.response?.data) {
      // ... (simplified error handling for brevity, can be expanded like in submit) ...
      toast.error('Failed to save draft. Please check details and try again.');
    } else {
      toast.error('Failed to save as draft. An unexpected error occurred.');
    }
  } finally {
    isSubmittingRenewal.value = false;
  }
}

const editApplication = () => {
  // The form is generally always editable. This button is more of a conceptual placeholder.
  toast.info('The form is currently editable. Make your changes and save or submit.');
}

</script>

<style scoped>
/* Add any specific styles if needed */
.disabled\:opacity-50:disabled {
  opacity: 0.5;
}
.disabled\:cursor-not-allowed:disabled {
  cursor: not-allowed;
}
</style>