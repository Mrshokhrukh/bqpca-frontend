<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="mx-auto px-4">
      <div class="bg-white rounded-2xl shadow-lg overflow-hidden">
        <!-- Header -->
        <div
          class="bg-gradient-to-r from-indigo-100 via-blue-50 to-indigo-100 rounded-xl p-8 mb-10"
        >
          <h2 class="text-3xl font-bold text-gray-900 mb-3 text-center">Accreditation Appeal</h2>
          <p class="text-gray-600 text-center max-w-2xl mx-auto">
            File an appeal against the accreditation decision.
          </p>
        </div>

        <!-- Payment Modal -->
        <PaymentModal
          ref="paymentModal"
          :amount="1000"
          @payment-completed="onPaymentCompleted"
          @close="onPaymentModalClose"
        />

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="p-6">
          <!-- 1. Appellant Details -->
          <div class="mb-6">
            <div class="border-b border-gray-200 bg-gray-50 p-6 rounded-t-xl">
              <h3 class="text-lg font-semibold text-gray-900">1. Appellant Details</h3>
              <p class="mt-1 text-sm text-gray-500">
                These details are auto-filled from your institution profile.
                <span v-if="isLoadingProfile" class="ml-2 text-gray-500 italic"
                  >Loading profile...</span
                >
              </p>
            </div>

            <div class="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Loop through autoFilledDetails -->
              <div v-for="(value, key) in autoFilledDetails" :key="key">
                <label class="block text-sm font-medium text-gray-700">{{ key }}</label>
                <input
                  type="text"
                  :value="value"
                  readonly
                  class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 bg-gray-100 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          <!-- 2. Appeal Details -->
          <div class="mb-6">
            <div class="border-b border-gray-200 bg-gray-50 p-6 rounded-t-xl">
              <h3 class="text-lg font-semibold text-gray-900">2. Appeal Details</h3>
            </div>
            <div class="p-8">
              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700"
                  >Reason for Appeal/Type</label
                >
                <select
                  v-model="appeal.reasonType"
                  @change="saveDraftToLocalStorage"
                  class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
                  required
                >
                  <option value="" disabled>Select Reason</option>
                  <option v-for="reason in appealReason" :key="reason.value" :value="reason.value">
                    {{ reason.text }}
                  </option>
                </select>
              </div>

              <div v-if="appeal.reasonType === 'Other'" class="mb-4">
                <label class="block text-sm font-medium text-gray-700">If Others (specify)</label>
                <input
                  type="text"
                  v-model="appeal.reasonOther"
                  @input="saveDraftToLocalStorage"
                  class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
                  :required="appeal.reasonType === 'Other'"
                />
              </div>

              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700"
                  >Reason of Appeal (Detailed Explanation)</label
                >
                <textarea
                  v-model="appeal.reason"
                  @input="saveDraftToLocalStorage"
                  rows="4"
                  class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
                  required
                ></textarea>
              </div>

              <div class="mb-4">
                <label class="inline-flex items-center">
                  <input
                    type="checkbox"
                    v-model="appeal.attemptedToResolve"
                    @change="saveDraftToLocalStorage"
                    class="rounded border-gray-300 text-blue-600 shadow-sm focus:ring-blue-500"
                  />
                  <span class="ml-2 text-gray-700">Attempted to Resolve with HEQC</span>
                </label>
              </div>

              <div v-if="appeal.attemptedToResolve" class="mb-4">
                <label class="block text-sm font-medium text-gray-700"
                  >Outcome (if attempted to resolve)</label
                >
                <input
                  type="text"
                  v-model="appeal.outcome"
                  @input="saveDraftToLocalStorage"
                  class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
                  :required="appeal.attemptedToResolve"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">Supporting Documents</label>
                <input
                  type="file"
                  multiple
                  @change="onFileChange"
                  ref="fileInputRef"
                  class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <ul class="mt-2 list-disc list-inside">
                  <li
                    v-for="(file, index) in selectedFileNames"
                    :key="index"
                    class="text-gray-600 text-sm"
                  >
                    {{ file }}
                  </li>
                </ul>
                <p
                  v-if="hasDraft && selectedFileNames.length > 0"
                  class="text-xs text-orange-600 mt-1"
                >
                  Note: Files are not saved in draft. Please re-select files if needed before
                  submitting.
                </p>
              </div>
            </div>
          </div>

          <!-- Declaration -->
          <div class="mb-6 px-8">
            <label class="inline-flex items-center">
              <input
                type="checkbox"
                v-model="appeal.declaration"
                @change="saveDraftToLocalStorage"
                class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                required
              />
              <span class="ml-2 text-gray-700"
                >I hereby declare that the information provided is true and accurate to the best of
                my knowledge.</span
              >
            </label>
          </div>

          <!-- Draft notification -->
          <div
            v-if="hasDraft"
            class="mb-6 mx-8 p-4 bg-yellow-50 border border-yellow-300 rounded-lg"
          >
            <p class="text-sm text-yellow-700">
              You have a saved draft. Your form has been pre-filled with your draft data.
              <button
                @click="clearDraftAndReset"
                type="button"
                class="ml-2 text-red-600 hover:text-red-800 underline font-medium text-sm"
              >
                Clear draft and reset form
              </button>
            </p>
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-end space-x-4 mt-8 pt-6 border-t px-8 pb-8">
            <button
              type="button"
              @click="saveDraft"
              :disabled="isFormEmpty"
              class="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save as Draft
            </button>
            <button
              type="submit"
              :disabled="!isFormFullyValid || isSubmitting"
              class="relative px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg hover:from-blue-700 hover:to-indigo-800 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              <svg
                v-if="isSubmitting"
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
              {{ isSubmitting ? 'Processing...' : 'Proceed to Payment & Submit' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed, watch } from 'vue'
import apiService from '@/services/services' // Adjust path as needed
import { useToast } from 'vue-toastification'
import PaymentModal from '@/components/common/PaymentModal.vue' // Adjust path as needed
import { useAuthStore } from '@/stores/authStore' // Adjust path as needed

// Local Storage Keys
const DRAFT_KEY = 'accreditation_appeal_draft'

const authStore = useAuthStore()
const toast = useToast()

// Use reactive for appellant details to ensure reactivity
const autoFilledDetails = reactive({
  'Name of Institution': 'N/A', // Initialize with N/A
  'Address/Location': 'N/A',
  'Dzongkhag/Thromde': 'N/A',
  Contact: 'N/A',
  Email: 'N/A',
})

// Use reactive for the main appeal form data
const appeal = reactive({
  reasonType: '', // Use appropriate ID or value for the dropdown
  reasonOther: '',
  reason: '',
  attemptedToResolve: false,
  outcome: '',
  supportingDocuments: [], // Store actual File objects here
  declaration: false,
  is_payment_complete: false,
  payment_id: null,
  status: 'draft', // Default status before submission attempt
  user_id: null, // Will be populated from authStore
})

const selectedFileNames = ref([]) // Only store names for display
const appealReason = ref([]) // To store fetched reasons { text: 'Name', value: 'id' }
const isSubmitting = ref(false)
const hasDraft = ref(false)
const paymentModal = ref(null)
const institutionProfile = ref(null)
const isLoadingProfile = ref(false)
const fileInputRef = ref(null) // Ref for the file input element

// --- Computed Properties ---
const isFormFullyValid = computed(() => {
  // Basic info
  const basicInfoValid = appeal.reasonType && appeal.reason.trim() !== ''
  // 'Other' reason validation
  const otherReasonValid =
    appeal.reasonType !== 'Other' ||
    (appeal.reasonType === 'Other' && appeal.reasonOther.trim() !== '')
  // Outcome validation if attempted to resolve
  const outcomeValid =
    !appeal.attemptedToResolve || (appeal.attemptedToResolve && appeal.outcome.trim() !== '')
  // Check if files need re-selection after loading draft
  const filesOk =
    !hasDraft.value ||
    selectedFileNames.value.length === 0 ||
    (selectedFileNames.value.length > 0 && appeal.supportingDocuments.length > 0)
  // Declaration
  const declarationValid = appeal.declaration

  return basicInfoValid && otherReasonValid && outcomeValid && filesOk && declarationValid
})

// Check if user-editable fields are empty (for disabling Save Draft)
const isFormEmpty = computed(() => {
  return (
    !appeal.reasonType &&
    !appeal.reasonOther.trim() &&
    !appeal.reason.trim() &&
    !appeal.attemptedToResolve &&
    !appeal.outcome.trim() &&
    appeal.supportingDocuments.length === 0 && // Check actual files
    !appeal.declaration
  )
})

// --- Methods ---

// Fetch institution profile data
const fetchInstitutionProfile = async () => {
  if (!authStore.userId) {
    console.warn('Cannot fetch institution profile: User ID is not available.')
    populateAppellantDetails() // Try populating with auth store data as fallback
    return
  }

  isLoadingProfile.value = true
  try {
    console.log(`Fetching institution profile for user ID: ${authStore.userId}`)
    const response = await apiService.getInstitutionProfile(authStore.userId)
    console.log('Institution Profile API Response:', response)

    if (response.data) {
      institutionProfile.value = response.data
      populateAppellantDetails()
    } else {
      throw new Error('No data received in profile response.')
    }
  } catch (error) {
    console.error('Error fetching institution profile:', error)
    toast.error('Failed to fetch institution profile. Using user data as fallback.')
    populateAppellantDetails()
  } finally {
    isLoadingProfile.value = false
  }
}

// Populate auto-filled details from Institution Profile or Auth Store
const populateAppellantDetails = () => {
  console.log('Populating appellant details...')
  console.log('Fetched Institution Profile:', institutionProfile.value)
  console.log('Auth Store User:', authStore.user)

  if (institutionProfile.value) {
    autoFilledDetails['Name of Institution'] = institutionProfile.value.name_of_institution || 'N/A'
    autoFilledDetails['Address/Location'] = institutionProfile.value.address || 'N/A'
    autoFilledDetails['Dzongkhag/Thromde'] = institutionProfile.value.dzongkhag_throm || 'N/A' // Adjusted key based on previous logs
    autoFilledDetails['Contact'] = institutionProfile.value.contact_number || 'N/A'
  } else if (authStore.user) {
    console.log('Falling back to auth store data for appellant details.')
    // Make sure these keys exist in your authStore.user object
    autoFilledDetails['Name of Institution'] = authStore.user.institution_name || 'N/A'
    autoFilledDetails['Address/Location'] = authStore.user.address || 'N/A'
    autoFilledDetails['Dzongkhag/Thromde'] = authStore.user.dzongkhag_thromde_name || 'N/A'
    autoFilledDetails['Contact'] = authStore.user.contact_number || 'N/A'
  }

  autoFilledDetails['Email'] = authStore.user?.email || 'N/A'

  console.log('Populated appellant details:', JSON.parse(JSON.stringify(autoFilledDetails)))
}

// Reset the appeal form fields (excluding auto-filled ones)
const resetAppealForm = () => {
  appeal.reasonType = ''
  appeal.reasonOther = ''
  appeal.reason = ''
  appeal.attemptedToResolve = false
  appeal.outcome = ''
  appeal.supportingDocuments = []
  appeal.declaration = false
  appeal.is_payment_complete = false
  appeal.payment_id = null
  appeal.status = 'draft'
  selectedFileNames.value = []

  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

// Handle file selection
const onFileChange = (event) => {
  const files = Array.from(event.target.files)
  appeal.supportingDocuments = files
  selectedFileNames.value = files.map((file) => file.name)
  // No need to save draft automatically on file change, user can explicitly save
}

// Save draft to localStorage
const saveDraftToLocalStorage = () => {
  console.log('Saving draft to local storage...')
  const draftData = {
    appeal: {
      reasonType: appeal.reasonType,
      reasonOther: appeal.reasonOther,
      reason: appeal.reason,
      attemptedToResolve: appeal.attemptedToResolve,
      outcome: appeal.outcome,
      declaration: appeal.declaration,
      selectedFileNames: selectedFileNames.value, // Save only names
    },
  }

  localStorage.setItem(DRAFT_KEY, JSON.stringify(draftData))
  hasDraft.value = true // Make sure hasDraft is true after saving
}

// Load draft from localStorage
const loadDraftFromLocalStorage = () => {
  const savedDraft = localStorage.getItem(DRAFT_KEY)
  if (savedDraft) {
    try {
      const draftData = JSON.parse(savedDraft)
      console.log('Loading draft:', draftData)

      let hasDraftContent = false

      if (draftData.appeal) {
        appeal.reasonType = draftData.appeal.reasonType ?? ''
        appeal.reasonOther = draftData.appeal.reasonOther ?? ''
        appeal.reason = draftData.appeal.reason ?? ''
        appeal.attemptedToResolve = draftData.appeal.attemptedToResolve ?? false
        appeal.outcome = draftData.appeal.outcome ?? ''
        appeal.declaration = draftData.appeal.declaration ?? false
        selectedFileNames.value = draftData.appeal.selectedFileNames ?? []
        appeal.supportingDocuments = [] // Clear actual files

        hasDraftContent =
          appeal.reasonType ||
          appeal.reasonOther.trim() ||
          appeal.reason.trim() ||
          appeal.attemptedToResolve ||
          appeal.outcome.trim() ||
          selectedFileNames.value.length > 0 ||
          appeal.declaration
      }

      hasDraft.value = hasDraftContent

      if (hasDraft.value) {
        if (selectedFileNames.value.length > 0) {
          toast.info('Draft loaded. Please re-select supporting documents.')
        } else {
          toast.info('Draft loaded.')
        }
        return true
      } else {
        localStorage.removeItem(DRAFT_KEY)
        return false
      }
    } catch (error) {
      console.error('Error parsing draft data:', error)
      localStorage.removeItem(DRAFT_KEY)
      return false
    }
  }
  return false
}

// Clear draft from storage and reset the form
const clearDraftAndReset = () => {
  localStorage.removeItem(DRAFT_KEY)
  hasDraft.value = false
  resetAppealForm()
  toast.success('Draft cleared and form reset.')
}

// Manual Save as draft button action
const saveDraft = () => {
  if (!isFormEmpty.value) {
    saveDraftToLocalStorage()
    toast.success('Appeal saved as draft')
  } else {
    toast.info('Form is empty, nothing to save as draft.')
  }
}

// --- Payment and Submission Logic ---

const openPaymentModal = () => {
  if (paymentModal.value) {
    paymentModal.value.openModal()
  } else {
    console.error('Payment modal reference is not available')
    toast.error('Could not open payment modal. Please try again later.')
    isSubmitting.value = false // Reset submitting state if modal fails to open
  }
}

const onPaymentModalClose = () => {
  console.log('Payment modal closed without completion')
  // Only reset if it wasn't already handled by onPaymentCompleted/error
  if (isSubmitting.value) {
    isSubmitting.value = false
    toast.info('Payment process cancelled.')
  }
}

// Orchestrator function called after successful payment modal completion
const onPaymentCompleted = async (paymentData) => {
  console.log('Payment completed event received:', paymentData)
  if (!paymentData || !paymentData.paymentHash) {
    console.error('Payment completed event did not provide necessary data:', paymentData)
    toast.error('Payment confirmation failed. Please check your payment status or contact support.')
    isSubmitting.value = false // Reset submission state
    return
  }

  appeal.is_payment_complete = true
  appeal.payment_id = paymentData.paymentHash // Store the payment reference
  appeal.status = 'payment_complete' // Update status temporarily

  toast.info(
    `Payment successful (Ref: ${appeal.payment_id}). Recording payment and submitting appeal...`,
  )

  // Proceed with the two-step submission process
  await recordPaymentAndSubmitAppeal()
}

// Function to handle the two API calls sequentially
const recordPaymentAndSubmitAppeal = async () => {
  if (!appeal.payment_id) {
    toast.error('Internal Error: Payment ID missing. Cannot proceed.')
    isSubmitting.value = false
    return
  }

  // --- Data Validation ---
  let contactNumber = autoFilledDetails['Contact'] || authStore.user?.contact_number
  if (!contactNumber || contactNumber.trim() === '' || contactNumber === 'N/A') {
    console.warn('Contact number for taxPayerNo/mobileNo is missing or invalid. Using placeholder.')
    // Decide on a sensible placeholder or if submission should halt
    contactNumber = 'MISSING_CONTACT' // Example placeholder
    // Optionally add toast.error and return if contact is absolutely required
  }
  let email = autoFilledDetails['Email'] || authStore.user?.email
  if (!email || email.trim() === '' || !/\S+@\S+\.\S+/.test(email)) {
    // Basic email format check
    console.warn('Payer email is missing or invalid. Using placeholder.')
    email = 'missing@example.com' // Example placeholder
    // Optionally add toast.error and return if email is absolutely required
  }
  let name = autoFilledDetails['Name of Institution'] || authStore.user?.institution_name
  if (!name || name.trim() === '' || name === 'N/A') {
    console.warn('Tax Payer Name is missing or invalid. Using placeholder.')
    name = 'Missing Institution Name' // Example placeholder
    // Optionally add toast.error and return if name is absolutely required
  }
  // --- End Data Validation ---

  // Step 1: Record Payment using makePayment API
  // ** CRITICAL: Confirm ALL key names and casing with backend **
  const paymentRecordData = {
    platform: 'BQPCA e-Zhapto',

    // --- CamelCase Keys (Based on previous errors/fixes & assumptions) ---
    refNo: appeal.payment_id,
    payerEmail: email, // Use validated email
    mobileNo: contactNumber, // Use validated contact number
    taxPayerName: name, // Use validated name
    serviceCode: '100195', // Confirm this code is correct
    taxPayerNo: contactNumber, // Corrected based on previous error
    userId: appeal.user_id, // Assumed camelCase, VERIFY with backend

    // --- Snake_case Keys (Based on previous errors/fixes) ---
    application_no: appeal.payment_id, // Corrected based on previous error
    app_type: 'Accreditation Appeal', // Corrected based on previous error

    // --- Fields needing VERIFICATION (Key Name, Casing & Value) ---
    // Check if backend expects snake_case or camelCase (e.g., totalPayableAmount)
    // Check if backend expects 1000.00 or a different fee (like 100.0 from BIRMS log?)
    total_payable_amount: 1000.0, // VERIFY KEY NAME & VALUE
    description: 'Payment for Accreditation Appeal Application', // VERIFY KEY NAME
    payable_amount: 1000.0, // VERIFY KEY NAME & VALUE
  }

  try {
    console.log(
      'Attempting to record payment with payload:',
      JSON.stringify(paymentRecordData, null, 2),
    )
    // *** Ensure 'makePayment' is the correct method name in your apiService ***
    const paymentResponse = await apiService.makePayment(paymentRecordData)
    console.log('Payment Record Response:', paymentResponse)

    // Check for successful status codes (e.g., 200 OK, 201 Created)
    if (paymentResponse.status !== 201 && paymentResponse.status !== 200) {
      const errorDetail =
        paymentResponse.data?.detail ||
        paymentResponse.data?.message ||
        JSON.stringify(paymentResponse.data) ||
        `Status ${paymentResponse.status}`
      throw new Error(`Failed to record payment: ${errorDetail}`)
    }
    toast.success('Payment recorded successfully.')

    // Proceed to Step 2: Submit the actual appeal data
    await submitAppealData()
  } catch (paymentError) {
    console.error('Error recording payment:', paymentError)
    // Extract error message more robustly
    const payErrMsg = paymentError.response?.data
      ? JSON.stringify(paymentError.response.data) || paymentError.message
      : paymentError.message || 'Unknown payment recording error'

    toast.error(
      `Critical Error: Payment successful but failed to record in our system. Please contact support immediately with Payment Reference: ${appeal.payment_id}. Error: ${payErrMsg}`,
      { timeout: 15000 }, // Longer timeout for critical errors
    )
    isSubmitting.value = false // Stop the process here
  }
}

// Function to prepare and submit the appeal form data (called after successful payment recording)
const submitAppealData = async () => {
  console.log('Attempting to submit appeal form data...')

  const formData = new FormData()

  try {
    // Append appeal data (excluding files)
    Object.keys(appeal).forEach((key) => {
      if (key === 'supportingDocuments') return // Handle files separately

      // Convert camelCase to snake_case ONLY if your APPEAL submission backend expects it
      // const backendKey = key.replace(/([A-Z])/g, "_$1").toLowerCase();
      const backendKey = key // Use original key if appeal backend handles camelCase
      let value = appeal[key]

      // Set status to 'submitted' for the final submission
      if (key === 'status') {
        value = 'submitted'
      }
      // Ensure boolean values are sent correctly
      if (typeof value === 'boolean') {
        formData.append(backendKey, value ? 'true' : 'false')
      } else if (value !== null && value !== undefined) {
        formData.append(backendKey, value)
      }
    })

    // Append files
    appeal.supportingDocuments.forEach((file) => {
      // Use a key the appeal backend expects, e.g., 'supporting_documents'
      formData.append('supporting_documents', file, file.name)
    })

    // Log FormData for debugging if needed
    // for (let [key, value] of formData.entries()) {
    //     console.log(`Appeal FormData -> ${key}:`, value instanceof File ? value.name : value);
    // }

    // *** Ensure 'createProfileAppeal' is the correct method name in your apiService ***
    const appealResponse = await apiService.createProfileAppeal(formData)
    console.log('Appeal Submission Response:', appealResponse)

    // Check for successful status (e.g., 201 Created)
    if (appealResponse.status !== 201) {
      const errorDetail =
        appealResponse.data?.detail ||
        appealResponse.data?.message ||
        `Status ${appealResponse.status}`
      throw new Error(`Appeal submission failed: ${errorDetail}`)
    }

    // Final Success!
    localStorage.removeItem(DRAFT_KEY) // Clear draft only on full success
    hasDraft.value = false
    toast.success('Accreditation Appeal submitted successfully!')
    resetAppealForm() // Reset form
  } catch (error) {
    console.error('Error submitting appeal data:', error)
    const errorMessage =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      error.message ||
      'An unknown error occurred during appeal submission.'
    toast.error(`Submission Failed: ${errorMessage}`)
    // Indicate that payment was done but submission failed
    appeal.status = 'payment_complete_submission_failed'
    toast.warning(
      'Payment was recorded, but the final appeal submission failed. Please save your details and contact support or try submitting again later.',
      { timeout: 10000 },
    )
  } finally {
    isSubmitting.value = false // Ensure submission state is reset regardless of outcome
  }
}

// Main submit handler (triggered by form submit event)
const handleSubmit = () => {
  // Perform validation
  if (!isFormFullyValid.value) {
    if (
      hasDraft.value &&
      selectedFileNames.value.length > 0 &&
      appeal.supportingDocuments.length === 0
    ) {
      toast.warning(
        'Please re-select the supporting documents listed in your draft before proceeding.',
      )
    } else {
      toast.error(
        'Please fill all required fields, select supporting documents if needed, and accept the declaration.',
      )
    }
    return // Stop if validation fails
  }

  // If validation passes, mark as submitting and open the payment modal
  isSubmitting.value = true // Set submitting state
  openPaymentModal() // Trigger payment process
}

// Fetch appeal reasons from API
const fetchAppealReason = async () => {
  try {
    // *** Ensure 'getMastersAppealReasons' is correct ***
    const response = await apiService.getMastersAppealReasons()
    console.log('Appeal Reasons Response:', response)

    let reasons = []
    // Adjust based on actual API response structure (direct array or nested under 'data'/'results')
    if (response.data && Array.isArray(response.data)) {
      reasons = response.data
    } else if (response.data?.results && Array.isArray(response.data.results)) {
      reasons = response.data.results // Handle paginated response
    } else if (response.status === 200 && Array.isArray(response.data)) {
      // Check root if no 'data' key
      reasons = response.data
    } else {
      console.warn('Unexpected format for appeal reasons:', response.data)
      reasons = [] // Default to empty array if format is wrong
      // throw new Error(`Invalid data format or status: ${response.status}`);
    }

    appealReason.value = reasons.map((reason) => ({
      // *** MATCH these keys to your API response for reasons ***
      text: reason.appeal_name || 'Unnamed Reason', // Display text (provide fallback)
      value: reason.id, // ID or unique value to submit
    }))

    // Manually add 'Other' if not present in API response
    if (!appealReason.value.some((r) => r.text.toLowerCase() === 'other')) {
      appealReason.value.push({ text: 'Other', value: 'Other' }) // Special value
    }
  } catch (error) {
    console.error('Error fetching appeal reasons:', error)
    toast.error(`Failed to load appeal reasons: ${error.message || 'Unknown error'}`)
    // Provide a default 'Other' if fetch fails?
    if (appealReason.value.length === 0) {
      appealReason.value.push({ text: 'Other', value: 'Other' })
    }
  }
}

// --- Lifecycle Hooks ---
onMounted(async () => {
  if (authStore.initializeAuth && typeof authStore.initializeAuth === 'function') {
    await authStore.initializeAuth()
  } else {
    console.warn(
      'authStore.initializeAuth is not defined or not a function. Assuming auth is already initialized.',
    )
  }

  if (authStore.userId) {
    appeal.user_id = authStore.userId
    await fetchInstitutionProfile() // Fetches profile & populates details
  } else {
    console.warn('User ID not found on mount. Appellant details might be incomplete.')
    populateAppellantDetails() // Populate with fallback
  }

  await fetchAppealReason()
  loadDraftFromLocalStorage() // Load draft after everything else is ready
})

// Watch for changes in authStore user (e.g., after login/logout)
watch(
  () => authStore.userId,
  (newUserId, oldUserId) => {
    console.log(`Auth User ID changed from ${oldUserId} to ${newUserId}`)
    if (newUserId) {
      appeal.user_id = newUserId
      fetchInstitutionProfile() // Re-fetch profile
    } else {
      // Handle logout
      institutionProfile.value = null
      appeal.user_id = null
      populateAppellantDetails() // Will use N/A or fallback
      clearDraftAndReset() // Clear draft and reset form on logout
      toast.info('User logged out. Form has been reset.')
    }
  },
  { immediate: false },
)

// Watch for changes in institutionProfile (after fetch) - optional if populateAppellantDetails covers it
watch(
  () => institutionProfile.value,
  (newProfile) => {
    if (newProfile) {
      console.log('Institution profile watcher triggered, re-populating details.')
      populateAppellantDetails()
    }
  },
  { deep: true },
)
</script>

<style scoped>
.bg-primary {
  background-color: #3b82f6; /* Tailwind blue-500 */
}
.bg-secondary {
  background-color: #2563eb; /* Tailwind blue-600 */
}
input[readonly] {
  background-color: #f3f4f6; /* gray-100 */
  cursor: not-allowed;
  opacity: 0.8;
}
/* Add focus styles for accessibility */
select:focus,
input:focus,
textarea:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
  --tw-ring-color: #3b82f6; /* blue-500 */
  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width)
    var(--tw-ring-offset-color);
  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(1px + var(--tw-ring-offset-width))
    var(--tw-ring-color);
  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
  border-color: #3b82f6; /* blue-500 */
}

/* Style for loading spinner inside button */
button svg.animate-spin {
  display: inline-block; /* Ensure spinner is treated like text */
}
</style>
