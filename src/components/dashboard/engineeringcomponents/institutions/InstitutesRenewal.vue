<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <!-- Page Header -->
    <div class="bg-gray-100 rounded-xl p-8 mb-10">
      <h2 class="text-3xl font-bold text-gray-900 mb-3 text-center">
        Expired Engineering Institute Status
      </h2>
      <p class="text-gray-600 text-center max-w-2xl mx-auto">
        View and renew your expired engineering institute registration
      </p>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center my-8">
      <Loader class="inline-block animate-spin text-blue-600 w-6 h-6" />
      <p class="ml-2 text-gray-600">Loading institute data...</p>
    </div>

    <!-- Error State -->
    <div
      v-else-if="apiError"
      class="bg-gray-50 border border-gray-200 text-gray-700 p-6 rounded-lg mb-6"
    >
      <h3 class="text-lg font-medium mb-2">Error Loading Institute Data</h3>
      <p>{{ errorMessage }}</p>
      <button
        @click="fetchInstituteData"
        class="mt-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Try Again
      </button>
    </div>

    <!-- No Expired Institute Found -->
    <div
      v-else-if="!instituteData"
      class="bg-gray-50 border border-gray-200 text-gray-700 p-6 rounded-lg mb-6"
    >
      <h3 class="text-lg font-medium mb-2">No Expired Institutes Found</h3>
      <p>No engineering institutes associated with your account have expired.</p>
    </div>

    <!-- Expired Institute Card -->
    <div v-else class="bg-white rounded-xl shadow-md overflow-hidden">
      <!-- Institute Header -->
      <div class="p-6 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-xl font-bold text-gray-800 relative">
              {{ instituteData.name_of_institution }}
              <!-- Expired Status Indicator -->
              <span class="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500"></span>
            </h3>
            <p class="text-gray-600">Registration Expired</p>
          </div>
        </div>
      </div>

      <!-- Institute Details -->
      <div class="p-6">
        <!-- Expiration Alert -->
        <div class="mb-6 p-4 rounded-lg border border-red-400">
          <div class="flex items-start">
            <div class="flex-shrink-0 mt-0.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 text-red-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-700">Registration Expired!</h3>
              <p class="mt-1 text-sm text-gray-600">
                Your engineering institute registration expired on
                {{ formattedExpirationDate }}. Please renew immediately to restore your registration
                status.
              </p>
            </div>
          </div>
        </div>

        <!-- Institute Information -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h4 class="text-sm font-medium text-gray-500 mb-1">Registration Details</h4>
            <div class="p-4 bg-gray-50 rounded-lg">
              <div class="grid grid-cols-1 gap-3">
                <div>
                  <p class="text-xs text-gray-500">Registration Status</p>
                  <p class="text-sm font-medium text-red-600">Expired</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Valid From</p>
                  <p class="text-sm font-medium text-gray-800">{{ formattedActiveDate }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Valid Until</p>
                  <p class="text-sm font-medium text-red-600">{{ formattedExpirationDate }}</p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h4 class="text-sm font-medium text-gray-500 mb-1">Institute Information</h4>
            <div class="p-4 bg-gray-50 rounded-lg">
              <div class="grid grid-cols-1 gap-3">
                <div>
                  <p class="text-xs text-gray-500">Contact Person</p>
                  <p class="text-sm font-medium text-gray-800">{{ instituteData.full_name }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Location</p>
                  <p class="text-sm font-medium text-gray-800">
                    {{ instituteData.dzongkhag }}, {{ instituteData.gewog }}
                  </p>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Contact</p>
                  <p class="text-sm font-medium text-gray-800">{{ instituteData.contact_no }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Email</p>
                  <p class="text-sm font-medium text-gray-800">{{ instituteData.email_address }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Renew Button -->
        <!-- Renew Button Section -->
        <div class="mt-8">
          <div class="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-6">
            <div class="flex items-start">
              <div class="flex-shrink-0 mt-0.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 text-blue-600"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-blue-800">Ready to Renew?</h3>
                <p class="mt-1 text-sm text-gray-600">
                  Restore your engineering institute's active status by renewing your registration
                  now. The renewal fee is Nu. 1,000.
                </p>
              </div>
            </div>
          </div>

          <div class="flex justify-center">
            <button
              @click="openRenewalDialog"
              class="group relative bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-md transform transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
            >
              <div class="flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 mr-2 group-hover:animate-spin"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                    clip-rule="evenodd"
                  />
                </svg>
                Renew Registration
                <span
                  class="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full"
                  >Expired</span
                >
              </div>
            </button>
          </div>

          <p class="text-center text-sm text-gray-500 mt-4">
            Your renewal will be valid for one year from the date of approval
          </p>
        </div>
      </div>
    </div>

    <!-- Renewal Confirmation Dialog -->
    <div
      v-if="showRenewalDialog"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg shadow-xl p-6 m-4 max-w-md w-full">
        <h3 class="text-xl font-bold text-gray-900 mb-4">Confirm Institute Renewal</h3>
        <p class="mb-6 text-gray-600">
          Are you sure you want to renew your engineering institute registration? You will be
          prompted to make a payment to complete the renewal process.
        </p>
        <div v-if="isRenewing" class="flex items-center justify-center mb-4">
          <Loader class="inline-block animate-spin text-blue-600 w-6 h-6" />
          <p>Processing...</p>
        </div>
        <div class="flex justify-end space-x-4">
          <button
            @click="closeRenewalDialog"
            class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            :disabled="isRenewing"
          >
            Cancel
          </button>
          <button
            @click="initiatePayment"
            class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            :disabled="isRenewing"
          >
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>

    <!-- Payment Modal -->
    <PaymentModal
      ref="paymentModal"
      :amount="1000"
      @payment-completed="handlePaymentCompleted"
      @close="closePaymentModal"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useToast } from 'vue-toastification'
import apiServices from '@/services/services'
import PaymentModal from '@/components/common/PaymentModal.vue'
import { Loader } from 'lucide-vue-next'

// State variables
const instituteData = ref(null)
const isLoading = ref(true)
const apiError = ref(false)
const errorMessage = ref('')
const showRenewalDialog = ref(false)
const isRenewing = ref(false)
const paymentModal = ref(null)

// Get auth store and toast notification
const authStore = useAuthStore()
const toast = useToast()

// Get user CID from auth store
const userCid = computed(() => {
  return authStore.user?.cid || ''
})

// Format dates
const formattedActiveDate = computed(() => {
  if (!instituteData.value?.valid_since) return 'N/A'
  return new Date(instituteData.value.valid_since).toLocaleDateString()
})

const formattedExpirationDate = computed(() => {
  if (!instituteData.value?.valid_till) return 'N/A'
  return new Date(instituteData.value.valid_till).toLocaleDateString()
})

// Fetch institute data and filter for expired institutes
const fetchInstituteData = async () => {
  if (!userCid.value) {
    errorMessage.value = 'User information not available. Please log in again.'
    apiError.value = true
    isLoading.value = false
    return
  }

  isLoading.value = true
  apiError.value = false

  try {
    const response = await apiServices.getEpcInstitutes()

    if (response && response.data && response.data.results) {
      // Filter institutes to find one matching the user's CID and expired status
      const userInstitutes = response.data.results.filter(
        (institute) => institute.CID.toLowerCase() === userCid.value.toLowerCase(),
      )

      // Find the first expired institute
      const expiredInstitute = userInstitutes.find((institute) => {
        const expirationDate = new Date(institute.valid_till)
        return expirationDate < new Date()
      })

      instituteData.value = expiredInstitute || null
    } else {
      errorMessage.value = 'Unable to retrieve institute data.'
      apiError.value = true
    }
  } catch (error) {
    console.error('Error fetching institute data:', error)
    errorMessage.value =
      error.response?.data?.message || 'Error fetching institute data. Please try again.'
    apiError.value = true
  } finally {
    isLoading.value = false
  }
}

// Open renewal dialog
const openRenewalDialog = () => {
  showRenewalDialog.value = true
}

// Close renewal dialog
const closeRenewalDialog = () => {
  showRenewalDialog.value = false
}

// Initiate payment
const initiatePayment = () => {
  if (!instituteData.value) {
    toast.error('No institute data available for payment.')
    closeRenewalDialog()
    return
  }
  isRenewing.value = true
  paymentModal.value.openModal()
  closeRenewalDialog()
}

// Close payment modal
const closePaymentModal = () => {
  isRenewing.value = false
}

// Handle payment completion
const handlePaymentCompleted = async (paymentData) => {
  if (!instituteData.value) {
    toast.error('No institute data available for renewal.')
    isRenewing.value = false
    return
  }

  const instituteId = instituteData.value.id
  const paymentId = paymentData.paymentHash
  const user = authStore.user

  if (!user || !user.contact_number || !user.email || !user.cid) {
    toast.error('Missing user information. Please update your profile.')
    isRenewing.value = false
    return
  }

  try {
    isLoading.value = true

    // 1. Initiate Payment
    const paymentInitiationFormData = new FormData()
    paymentInitiationFormData.append('refNo', paymentId)
    paymentInitiationFormData.append('serviceCode', 'registration_fee_for_engineering_institute')
    paymentInitiationFormData.append('taxPayerName', user.cid)
    paymentInitiationFormData.append('taxPayerNo', user.cid)
    paymentInitiationFormData.append('taxPayerDocumentNo', user.cid)
    paymentInitiationFormData.append('totalPayableAmount', 1000)
    paymentInitiationFormData.append('description', 'Engineering Institute Renewal Fee')
    paymentInitiationFormData.append('mobileNo', user.contact_number)
    paymentInitiationFormData.append('payerEmail', user.email)
    paymentInitiationFormData.append('user', user.id)
    paymentInitiationFormData.append('payableAmount', 1000)
    paymentInitiationFormData.append('application_no', instituteId)
    paymentInitiationFormData.append('app_type', 'engineering_institute_renewal')

    await apiServices.makePayment(paymentInitiationFormData)

    // 2. Update Institute
    const today = new Date()
    const newValidTill = new Date(today)
    newValidTill.setFullYear(today.getFullYear() + 1)

    const renewalData = {
      do_dpr_review_decision: 'Pending',
      is_payment_complete: false,
      is_active: false,
      payment_id: paymentId,
      payment_status: 'processing_payment',
      valid_since: today.toISOString().split('T')[0],
      valid_till: newValidTill.toISOString().split('T')[0],
    }

    await apiServices.patchEpcInstitute(instituteId, renewalData)

    // 3. Update local state
    Object.assign(instituteData.value, renewalData)

    toast.success(`Payment initiated! ID: ${paymentId}. Renewal process started.`)
    instituteData.value = null // Clear to show no expired institutes
  } catch (error) {
    console.error('Payment update error:', error)
    if (error.response) {
      toast.error(
        error.response.data?.detail ||
          JSON.stringify(error.response.data) ||
          error.response.statusText,
      )
    } else if (error.request) {
      toast.error('Network Error: No response from server')
    } else {
      toast.error(
        `Payment request generated successfully, but there was an error confirming the payment. Contact support with payment ID: ${paymentId}`,
      )
    }
  } finally {
    isLoading.value = false
    isRenewing.value = false
  }
}

// Fetch institute data on component mount
onMounted(fetchInstituteData)
</script>

<style scoped>
/* Component-specific styles */
</style>
