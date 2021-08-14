<template>
  <div class="w-full mx-auto px-4 py-8">
    <InstituteHeader
      title="Institute Status"
      subtitle="View and manage your institute registration status"
      :show-actions="false"
    />

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center my-8">
      <Loader class="inline-block animate-spin text-blue-600 w-6 h-6" />
      <p class="ml-2 text-gray-600">Loading institute data...</p>
    </div>

    <!-- Error State -->
    <div
      v-else-if="apiError"
      class="bg-red-50 border border-red-200 text-red-700 p-6 rounded-lg mb-6"
    >
      <h3 class="text-lg font-medium mb-2">Error Loading Institute Data</h3>
      <p>{{ errorMessage }}</p>
      <button
        @click="fetchInstituteData"
        class="mt-4 bg-red-100 hover:bg-red-200 text-red-800 font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Try Again
      </button>
    </div>

    <!-- No Data State -->
    <div
      v-else-if="!instituteData"
      class="bg-gray-50 border border-gray-200 text-gray-700 p-6 rounded-lg mb-6"
    >
      <h3 class="text-lg font-medium mb-2">No Institute Found</h3>
      <p>No institute registration was found for your account.</p>
    </div>

    <!-- Main Content -->
    <div v-else class="bg-white rounded-xl shadow-md overflow-hidden">
      <!-- Header -->
      <div class="p-6 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-xl font-bold text-gray-800 relative">
              {{ instituteData.name_of_institution }}
              <span
                class="absolute -top-1 -right-4 h-3 w-3 rounded-full"
                :class="statusIndicatorClass"
              ></span>
            </h3>
            <p class="text-gray-600">
              <span :class="statusTextColorClass">{{ mainStatusText }}</span>
            </p>
          </div>
        </div>
      </div>

      <div class="p-6">
        <!-- Banners for different states -->
        <div
          v-if="!isRenewalWindowOpen && !instituteData.has_active_capa && !isRenewalInProgress"
          class="mb-6 p-4 rounded-lg border border-green-400 bg-green-50"
        >
          <div class="flex items-start">
            <div class="flex-shrink-0 mt-0.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 text-green-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-green-700">All Good!</h3>
              <div class="mt-1 text-sm text-green-600">
                <p>
                  Your registration is valid until {{ formattedExpirationDate }}. The renewal window
                  opens 90 days before this date. No action is needed at this time.
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- <<< NEW BANNER FOR RENEWAL IN PROGRESS >>> -->
        <div
          v-if="isRenewalInProgress && !isPaymentRequired"
          class="mb-6 p-4 rounded-lg border border-blue-400 bg-blue-50"
        >
          <div class="flex items-start">
            <div class="flex-shrink-0 mt-0.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 text-blue-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-blue-800">Renewal in Progress</h3>
              <div class="mt-1 text-sm text-blue-700">
                <p>
                  Your renewal application has been submitted and is currently under review. The
                  renew button is disabled. You will be notified once the review is complete.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div
          v-if="instituteData.has_active_capa"
          class="mb-6 p-4 rounded-lg border border-rose-400 bg-rose-50"
        >
          <div class="flex items-start">
            <div class="flex-shrink-0 mt-0.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 text-rose-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 1.944A1.944 1.944 0 008.056 0H2.944A1.944 1.944 0 001 1.944v5.112A1.944 1.944 0 002.944 9H8.056A1.944 1.944 0 0010 7.056V1.944zM18.056 0H12.944A1.944 1.944 0 0011 1.944v5.112A1.944 1.944 0 0012.944 9H18.056A1.944 1.944 0 0020 7.056V1.944A1.944 1.944 0 0018.056 0zM10 12.944A1.944 1.944 0 008.056 11H2.944A1.944 1.944 0 001 12.944v5.112A1.944 1.944 0 002.944 20H8.056A1.944 1.944 0 0010 18.056v-5.112zM18.056 11H12.944A1.944 1.944 0 0011 12.944v5.112A1.944 1.944 0 0012.944 20H18.056A1.944 1.944 0 0020 18.056v-5.112A1.944 1.944 0 0018.056 11z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-rose-700">Renewal Blocked</h3>
              <div class="mt-1 text-sm text-rose-600">
                <p>
                  This institute has one or more unresolved Corrective and Preventive Actions
                  (CAPAs). You must resolve all pending CAPAs before a renewal can be processed.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div
          v-if="isExpired && !isRenewalInProgress"
          class="mb-6 p-4 rounded-lg border border-red-400 bg-red-50"
        >
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
              <h3 class="text-sm font-medium text-red-700">Registration Expired</h3>
              <div class="mt-1 text-sm text-red-600">
                <p>
                  Your registration expired on {{ formattedExpirationDate }}. Please renew
                  immediately to continue operations.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div
          v-if="isPaymentRequired"
          class="mb-6 p-4 rounded-lg border border-yellow-400 bg-yellow-50"
        >
          <div class="flex items-start">
            <div class="flex-shrink-0 mt-0.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 text-yellow-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-yellow-800">Payment Required</h3>
              <div class="mt-1 text-sm text-yellow-700">
                <p>
                  Your renewal application has been approved. Please complete the payment to
                  activate your registration and view your new certificate.
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Details Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h4 class="text-sm font-medium text-gray-500 mb-1">Registration Details</h4>
            <div class="p-4 bg-gray-50 rounded-lg">
              <div class="grid grid-cols-1 gap-3">
                <div>
                  <p class="text-xs text-gray-500">Overall Status</p>
                  <p class="text-sm font-medium" :class="statusTextColorClass">
                    {{ mainStatusText }}
                  </p>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Valid From</p>
                  <p class="text-sm font-medium text-gray-800">{{ formattedActiveDate }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Valid Until</p>
                  <p class="text-sm font-medium" :class="expirationTextColorClass">
                    {{ formattedExpirationDate }}
                  </p>
                </div>
                <div v-if="latestRenewal">
                  <p class="text-xs text-gray-500">Latest Renewal Status</p>
                  <p class="text-sm font-medium" :class="renewalStatusColorClass">
                    {{ renewalStatusDisplayText }}
                  </p>
                </div>
                <div v-if="latestRenewal">
                  <p class="text-xs text-gray-500">Renewal Payment</p>
                  <p class="text-sm font-medium" :class="paymentStatusColorClass">
                    {{ paymentStatusDisplayText }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-end mt-8">
          <button
            v-if="showRenewButton"
            @click="showRenewalModal = true"
            :disabled="instituteData.has_active_capa"
            :title="
              instituteData.has_active_capa
                ? 'Cannot renew: Please resolve pending CAPAs first.'
                : renewButtonTitle
            "
            class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg mr-4 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Renew Registration
          </button>
          <button
            v-if="canViewCertificate"
            @click="handleViewCertificateClick"
            class="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg"
          >
            View Certificate
          </button>
          <button
            v-if="isPaymentRequired"
            @click="handleViewCertificateClick"
            class="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-6 rounded-lg"
          >
            Make Payment to View Certificate
          </button>
        </div>
      </div>
    </div>

    <!-- Modals and Popups -->
    <InstituteRenewalModal
      v-if="instituteData"
      :show="showRenewalModal"
      :institute="instituteData"
      @close="showRenewalModal = false"
      @renewal-submitted="handleRenewalSuccess"
    />

    <PaymentModal ref="paymentModalRef" :amount="100" @payment-completed="handlePaymentCompleted" />

    <div
      v-if="showCertificatePopup"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto print:hidden"
    >
      <div class="bg-white rounded-lg shadow-xl p-6 m-4 max-w-5xl w-full h-5/6 overflow-y-auto">
        <div class="flex justify-between items-center mb-4 print:hidden">
          <h3 class="text-xl font-bold text-gray-900">Institute Certificate</h3>
          <button @click="showCertificatePopup = false" class="text-gray-500 hover:text-gray-700">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div class="certificate-wrapper">
          <InstituteCertificate
            :instituteName="instituteData?.name_of_institution"
            :initialRegistrationDate="formatDateSafely(instituteData?.created_at)"
            :lastRenewalDate="formatDateSafely(instituteData?.updated_at)"
            :expiryDate="formattedExpirationDate"
          />
        </div>
        <div class="flex justify-end mt-4 print:hidden">
          <button
            @click="showCertificatePopup = false"
            class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded"
          >
            Close
          </button>
          <button
            @click="window.print()"
            class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded ml-4"
          >
            Print Certificate
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import apiServices from '@/services/services'
import { useToast } from 'vue-toastification'
import { Loader } from 'lucide-vue-next'
import InstituteHeader from '@/components/common/MHPC/InstituteHeader.vue'
import InstituteRenewalModal from './InstituteRenewalModal.vue'
import InstituteCertificate from './InstituteCertificate.vue'
import PaymentModal from '@/components/common/PaymentModal.vue'

// --- Component State ---
const instituteData = ref(null)
const isLoading = ref(true)
const apiError = ref(false)
const errorMessage = ref('')
const showRenewalModal = ref(false)
const showCertificatePopup = ref(false)
const paymentModalRef = ref(null)

const authStore = useAuthStore()
const toast = useToast()
const userCid = computed(() => authStore.user?.cid || '')

// --- Helper Functions ---
const formatDateSafely = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return isNaN(date.getTime())
    ? 'Invalid Date'
    // <<< FIX: Corrected method name from toLocaleDate to toLocaleDateString
    : date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

// --- Computed Properties ---
const latestRenewal = computed(() => instituteData.value?.latest_renewal || null)
const formattedActiveDate = computed(() => formatDateSafely(instituteData.value?.valid_since))
const formattedExpirationDate = computed(() => formatDateSafely(instituteData.value?.valid_till))

const daysUntilExpiration = computed(() => {
  if (!instituteData.value?.valid_till) return -9999
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const expirationDate = new Date(instituteData.value.valid_till)
  if (isNaN(expirationDate.getTime())) return -9999
  return Math.ceil((expirationDate.getTime() - today.getTime()) / (1000 * 3600 * 24))
})

const isActive = computed(() => instituteData.value?.is_currently_active === true)
const isExpired = computed(
  () => instituteData.value?.application_status === 'Fully Approved' && !isActive.value,
)
const isRenewalWindowOpen = computed(() => daysUntilExpiration.value <= 90)
const isRenewalInProgress = computed(() => {
  if (!latestRenewal.value) return false
  return ['PENDING', 'AWAITING_PAYMENT'].includes(latestRenewal.value.renewal_status)
})
const isPaymentRequired = computed(() => latestRenewal.value?.renewal_status === 'AWAITING_PAYMENT')
const showRenewButton = computed(() => isRenewalWindowOpen.value && !isRenewalInProgress.value)
const canViewCertificate = computed(() => isActive.value)

const renewalStatusDisplayText = computed(() => {
  // Priority 1: A renewal is actively in process. Show its status.
  if (isRenewalInProgress.value) {
    const statusMap = {
      PENDING: 'Pending Review',
      AWAITING_PAYMENT: 'Approved - Awaiting Payment'
    }
    return statusMap[latestRenewal.value.renewal_status] || 'In Progress'
  }

  // Priority 2: If not in progress, but expired, show that.
  if (isExpired.value) {
    return 'Expired - Renewal Required'
  }

  // Priority 3: If there's a past renewal, show its completed status.
  if (latestRenewal.value) {
    const statusMap = {
      COMPLETED: 'Completed & Active',
      REJECTED: 'Rejected'
    }
    return statusMap[latestRenewal.value.renewal_status] || 'Not Initiated'
  }

  // Fallback for new institutes with no renewals yet.
  return 'Not Initiated'
})

const paymentStatusDisplayText = computed(() => {
  // Priority 1: Is payment explicitly pending right now?
  if (isPaymentRequired.value) {
    return 'Pending Payment'
  }

  // Priority 2: Is a renewal in progress but not yet at payment stage?
  if (isRenewalInProgress.value) {
    return 'N/A' // Payment is not applicable until approval
  }

  // Priority 3: Is it expired (and not in progress)?
  if (isExpired.value) {
    return 'N/A'
  }

  // Fallback: Show the status from the last completed renewal, if any.
  if (latestRenewal.value && latestRenewal.value.payment_status) {
    const status = latestRenewal.value.payment_status
    return status.charAt(0).toUpperCase() + status.slice(1)
  }

  return 'N/A'
})

const mainStatusText = computed(() => {
  if (instituteData.value?.has_active_capa) return 'Renewal Blocked (Pending CAPA)'
  // Check for in-progress statuses first, as they are more current than 'Expired'
  if (isPaymentRequired.value) return 'Renewal Approved - Awaiting Payment'
  if (isRenewalInProgress.value) return 'Renewal in Progress'
  // Then check for terminal statuses
  if (isExpired.value) return 'Registration Expired'
  if (isActive.value) return 'Active Registration'
  return instituteData.value?.application_status || 'Status Unknown'
})

const renewButtonTitle = computed(() =>
  isActive.value ? 'Renew your institute registration' : 'Renew your expired registration',
)

// --- Color and Style Computed Properties ---
const getDecisionColor = (decision) => {
  if (!decision) return 'text-gray-600'
  const lowerDecision = decision.toLowerCase()
  if (lowerDecision.includes('active') || lowerDecision.includes('completed'))
    return 'text-green-600'
  if (lowerDecision.includes('payment')) return 'text-yellow-600'
  if (lowerDecision.includes('pending') || lowerDecision.includes('progress'))
    return 'text-blue-600'
  if (lowerDecision.includes('rejected') || lowerDecision.includes('expired')) return 'text-red-600'
  if (lowerDecision.includes('capa')) return 'text-rose-600'
  return 'text-gray-600'
}

const statusIndicatorClass = computed(() => {
  if (instituteData.value?.has_active_capa) return 'bg-rose-500'
  if (isPaymentRequired.value) return 'bg-yellow-500 animate-pulse'
  if (isRenewalInProgress.value) return 'bg-blue-500 animate-pulse'
  if (isExpired.value) return 'bg-red-500'
  if (daysUntilExpiration.value <= 30 && isActive.value) return 'bg-orange-500'
  if (isActive.value) return 'bg-green-500'
  return 'bg-gray-400'
})

const statusTextColorClass = computed(() => getDecisionColor(mainStatusText.value))
const expirationTextColorClass = computed(() => {
  if (daysUntilExpiration.value <= 0) return 'text-red-600 font-semibold'
  if (daysUntilExpiration.value <= 30) return 'text-orange-600'
  return 'text-gray-800'
})
const renewalStatusColorClass = computed(() => getDecisionColor(renewalStatusDisplayText.value))
const paymentStatusColorClass = computed(() => getDecisionColor(paymentStatusDisplayText.value))

// --- Methods ---
const fetchInstituteData = async () => {
  isLoading.value = true
  apiError.value = false
  try {
    const response = await apiServices.getMhpcInstitutes({ params: { CID: userCid.value } })
    if (response?.data?.results?.length > 0) {
      instituteData.value = response.data.results[0]
    } else {
      instituteData.value = null
      errorMessage.value = 'No institute found for your account.'
    }
  } catch (error) {
    apiError.value = true
    errorMessage.value = 'An error occurred while fetching institute data.'
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

const handleRenewalSuccess = () => {
  toast.info('Renewal submitted! Refreshing institute status...')
  fetchInstituteData()
}

const handleViewCertificateClick = () => {
  if (isPaymentRequired.value) {
    initiatePayment()
  } else if (canViewCertificate.value) {
    showCertificatePopup.value = true
  }
}

const initiatePayment = () => {
  if (paymentModalRef.value) {
    paymentModalRef.value.openModal()
  } else {
    toast.error('Payment modal could not be opened.')
  }
}

const handlePaymentCompleted = async (paymentData) => {
  if (!latestRenewal.value) {
    toast.error('No pending renewal found to apply payment to.')
    return
  }
  isLoading.value = true
  try {
    await apiServices.confirmInstituteRenewalPayment(latestRenewal.value.id, {
      payment_id: paymentData.paymentHash
    })

    toast.success('Payment confirmed! Your certificate has been renewed successfully.')
    await fetchInstituteData()
  } catch (error) {
    console.error('Payment confirmation error:', error)
    toast.error('An error occurred while confirming your payment. Please contact support.')
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchInstituteData)
</script>

<style scoped>
@media print {
  body * {
    visibility: hidden;
  }
  .certificate-wrapper,
  .certificate-wrapper * {
    visibility: visible;
  }
  .certificate-wrapper {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }
  .print\:hidden {
    display: none !important;
  }
}
</style>