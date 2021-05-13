<template>
  <div class="w-full mx-auto px-4 py-8">
    <InstituteHeader
      title="Institute Status"
      subtitle="View and manage your institute registration status"
      :show-actions="false"
    />

    <div v-if="isLoading" class="flex justify-center my-8">
      <Loader class="inline-block animate-spin text-blue-600 w-6 h-6" />
      <p class="ml-2 text-gray-600">Loading institute data...</p>
    </div>

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

    <div
      v-else-if="!instituteData"
      class="bg-gray-50 border border-gray-200 text-gray-700 p-6 rounded-lg mb-6"
    >
      <h3 class="text-lg font-medium mb-2">No Institute Found</h3>
      <p>You don't have any registered institute associated with your account.</p>
      <p class="mt-2">Please register an institute first before attempting to renew.</p>
    </div>

    <div v-else class="bg-white rounded-xl shadow-md overflow-hidden">
      <div class="p-6 border-b border-gray-200">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-xl font-bold text-gray-800 relative">
              {{ instituteData.name_of_institution }}
              <span
                :class="statusIndicatorClass"
                class="absolute -top-1 -right-1 h-3 w-3 rounded-full"
              ></span>
            </h3>
            <p class="text-gray-600">
              <span>
                {{ isActive ? 'Active Registration' : 'Registration Pending' }}
              </span>
            </p>
          </div>
        </div>
      </div>

      <div class="p-6">
        <div
          v-if="isActive && daysUntilExpiration <= 90"
          class="mb-6 p-4 rounded-lg border"
          :class="[
            daysUntilExpiration <= 30
              ? 'border-red-400 bg-red-50'
              : 'border-yellow-400 bg-yellow-50',
          ]"
        >
          <div class="flex items-start">
            <div class="flex-shrink-0 mt-0.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                :class="[daysUntilExpiration <= 30 ? 'text-red-500' : 'text-yellow-500']"
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
              <h3
                class="text-sm font-medium"
                :class="[daysUntilExpiration <= 30 ? 'text-red-700' : 'text-yellow-700']"
              >
                {{
                  daysUntilExpiration <= 0
                    ? 'Registration Expired!'
                    : daysUntilExpiration <= 30
                      ? 'Registration Expiring Soon!'
                      : 'Registration Renewal Recommended'
                }}
              </h3>
              <div
                class="mt-1 text-sm"
                :class="[daysUntilExpiration <= 30 ? 'text-red-600' : 'text-yellow-600']"
              >
                <p v-if="daysUntilExpiration <= 0">
                  Your institute registration has expired. Please renew immediately to maintain your
                  registration status.
                </p>
                <p v-else>
                  Your institute registration will expire in
                  {{ daysUntilExpiration }} days ({{ formattedExpirationDate }}). Please renew your
                  registration to maintain your status.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h4 class="text-sm font-medium text-gray-500 mb-1">Registration Details</h4>
            <div class="p-4 bg-gray-50 rounded-lg">
              <div class="grid grid-cols-1 gap-3">
                <div>
                  <p class="text-xs text-gray-500">Registration Status</p>
                  <p class="text-sm font-medium" :class="statusTextColorClass">
                    {{ isActive ? 'Active' : 'Pending' }}
                  </p>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Valid From</p>
                  <p class="text-sm font-medium text-gray-800">
                    {{ formattedActiveDate }}
                  </p>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Valid Until</p>
                  <p class="text-sm font-medium" :class="expirationTextColorClass">
                    {{ formattedExpirationDate }}
                  </p>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Review Decision</p>
                  <p class="text-sm font-medium" :class="reviewDecisionColorClass">
                    {{ instituteData.do_dpr_review_decision }}
                  </p>
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
                  <p class="text-sm font-medium text-gray-800">
                    {{ instituteData.full_name }}
                  </p>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Location</p>
                  <p class="text-sm font-medium text-gray-800">
                    {{ instituteData.dzongkhag }}, {{ instituteData.gewog }}
                  </p>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Contact</p>
                  <p class="text-sm font-medium text-gray-800">
                    {{ instituteData.contact_no }}
                  </p>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Email</p>
                  <p class="text-sm font-medium text-gray-800">
                    {{ instituteData.email_address }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="mb-6">
          <h4 class="text-sm font-medium text-gray-500 mb-1">Head of Institution</h4>
          <div class="p-4 bg-gray-50 rounded-lg">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p class="text-xs text-gray-500">Name</p>
                <p class="text-sm font-medium text-gray-800">
                  {{ instituteData.head_of_institution_name }}
                </p>
              </div>
              <div>
                <p class="text-xs text-gray-500">Contact</p>
                <p class="text-sm font-medium text-gray-800">
                  {{ instituteData.head_of_institution_phone_number }}
                </p>
              </div>
              <div>
                <p class="text-xs text-gray-500">Email</p>
                <p class="text-sm font-medium text-gray-800">
                  {{ instituteData.head_of_institution_email }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-end mt-8" v-if="isActive">
          <button
            v-if="!isRenewalInProgress"
            @click="openRenewalDialog"
            class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline mr-4"
            :class="{ 'animate-pulse': daysUntilExpiration <= 30 && daysUntilExpiration > 0 }"
          >
            Renew Institute Registration
          </button>

          <button
            v-if="instituteData?.do_dpr_review_decision === 'Approved'"
            @click="openCertificatePopup"
            class="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline"
          >
            View Certificate
          </button>
        </div>

        <div
          v-if="isRenewalInProgress"
          class="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-700"
        >
          <h4 class="font-medium">Renewal In Progress</h4>
          <p class="mt-1 text-sm">
            Your renewal application has been submitted and is currently under review. You will be
            notified once the review is complete.
          </p>
        </div>
      </div>
    </div>

    <div
      v-if="showRenewalDialog"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg shadow-xl p-6 m-4 max-w-md w-full">
        <h3 class="text-xl font-bold text-gray-900 mb-4">Confirm Institute Renewal</h3>
        <p class="mb-6 text-gray-600">
          Are you sure you want to renew your institute registration? This will start the renewal
          process and require payment.
        </p>
        <div v-if="isRenewing" class="flex items-center justify-center mb-4">
          <Loader class="inline-block animate-spin text-blue-600 w-6 h-6 mr-2" />
          <p class="text-gray-700">Processing renewal...</p>
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
            @click="confirmRenewal"
            class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            :disabled="isRenewing"
          >
            Confirm Renewal
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="showCertificatePopup"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto print:hidden"
    >
      <div class="bg-white rounded-lg shadow-xl p-6 m-4 max-w-5xl w-full h-5/6 overflow-y-auto">
        <div class="flex justify-between items-center mb-4 print:hidden">
          <h3 class="text-xl font-bold text-gray-900">Institute Certificate</h3>
          <button @click="closeCertificatePopup" class="text-gray-500 hover:text-gray-700">
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
            :initialRegistrationDate="formattedRegistrationDate"
            :lastRenewalDate="formattedLastRenewalDate"
            :expiryDate="formattedExpirationDate"
            :programs="instituteData?.programs || '-'"
          />
        </div>

        <div class="flex justify-end mt-4 print:hidden">
          <button
            @click="closeCertificatePopup"
            class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Close
          </button>
          <button
            @click="printCertificate"
            class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-4"
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
import { useToast } from 'vue-toastification'
import apiServices from '@/services/services'
import { Loader } from 'lucide-vue-next'
import InstituteCertificate from './InstituteCertificate.vue'
import InstituteHeader from '@/components/common/MHPC/InstituteHeader.vue'

const instituteData = ref(null)
const isLoading = ref(true)
const apiError = ref(false)
const errorMessage = ref('')
const showRenewalDialog = ref(false)
const isRenewing = ref(false)
const showCertificatePopup = ref(false)

const authStore = useAuthStore()
const toast = useToast()

const userCid = computed(() => {
  return authStore.user?.cid || ''
})

const formatDateSafely = (dateString) => {
  if (!dateString) return 'N/A'
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      console.warn('Invalid date string for formatting:', dateString)
      return 'Invalid Date'
    }
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  } catch (e) {
    console.error('Error formatting date:', dateString, e)
    return 'Date Error'
  }
}

const formattedActiveDate = computed(() => formatDateSafely(instituteData.value?.valid_since))
const formattedExpirationDate = computed(() => formatDateSafely(instituteData.value?.valid_till))
const formattedRegistrationDate = computed(() =>
  formatDateSafely(instituteData.value?.registration_date),
)
const formattedLastRenewalDate = computed(() =>
  formatDateSafely(instituteData.value?.last_renewal_date),
)

const daysUntilExpiration = computed(() => {
  if (!instituteData.value?.valid_till) return 0
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  try {
    const expirationDate = new Date(instituteData.value.valid_till)
    if (isNaN(expirationDate.getTime())) return 0
    expirationDate.setHours(0, 0, 0, 0)
    const timeDiff = expirationDate.getTime() - today.getTime()
    return Math.ceil(timeDiff / (1000 * 3600 * 24))
  } catch (e) {
    console.error('Error calculating days until expiration:', e)
    return 0
  }
})

const isActive = computed(() => {
  return instituteData.value?.is_active === true && daysUntilExpiration.value > 0
})

const isRenewalInProgress = computed(() => {
  return (
    instituteData.value?.do_dpr_review_decision === 'Pending' &&
    instituteData.value?.is_active === false
  )
})

const statusIndicatorClass = computed(() => {
  if (!instituteData.value) return 'bg-gray-400'
  if (isRenewalInProgress.value) return 'bg-blue-500 animate-pulse'
  if (!isActive.value || daysUntilExpiration.value <= 0) return 'bg-red-500'
  if (daysUntilExpiration.value <= 30) return 'bg-orange-500'
  if (daysUntilExpiration.value <= 90) return 'bg-yellow-500'
  return 'bg-green-500'
})

const statusTextColorClass = computed(() => {
  if (!instituteData.value) return 'text-gray-600'
  if (isRenewalInProgress.value) return 'text-blue-600'
  if (!isActive.value || daysUntilExpiration.value <= 0) return 'text-red-600'
  return 'text-green-600'
})

const expirationTextColorClass = computed(() => {
  if (!instituteData.value) return 'text-gray-800'
  if (daysUntilExpiration.value <= 0) return 'text-red-600 font-semibold'
  if (daysUntilExpiration.value <= 30) return 'text-orange-600 font-semibold'
  return 'text-gray-800'
})

const reviewDecisionColorClass = computed(() => {
  if (!instituteData.value?.do_dpr_review_decision) return 'text-gray-600'
  const decision = instituteData.value.do_dpr_review_decision
  return {
    'text-green-600': decision === 'Approved',
    'text-yellow-600': decision === 'Pending',
    'text-red-600': decision === 'Rejected',
    'text-blue-600': decision === 'In Review',
  }
})

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
    const response = await apiServices.getMhpcInstitutes()
    if (response && response.data && Array.isArray(response.data.results)) {
      const userInstitutes = response.data.results.filter(
        (institute) => institute.CID && institute.CID.toLowerCase() === userCid.value.toLowerCase(),
      )
      instituteData.value = userInstitutes.length > 0 ? userInstitutes[0] : null
      if (!instituteData.value) {
        errorMessage.value = 'No institute found for your account.'
      }
    } else {
      errorMessage.value = 'Unable to retrieve institute data. Invalid response format.'
      apiError.value = true
      console.warn('Invalid API response structure:', response)
    }
  } catch (error) {
    console.error('Error fetching institute data:', error)
    errorMessage.value =
      error.response?.data?.message ||
      'An unexpected error occurred while fetching institute data. Please try again.'
    apiError.value = true
  } finally {
    isLoading.value = false
  }
}

const openRenewalDialog = () => {
  showRenewalDialog.value = true
}

const closeRenewalDialog = () => {
  showRenewalDialog.value = false
}

const openCertificatePopup = () => {
  showCertificatePopup.value = true
}

const closeCertificatePopup = () => {
  showCertificatePopup.value = false
}

const printCertificate = () => {
  window.print()
}

const confirmRenewal = async () => {
  if (!instituteData.value || !instituteData.value.id) {
    toast.error('No institute data available for renewal.')
    closeRenewalDialog()
    return
  }

  isRenewing.value = true

  try {
    let currentValidTill = new Date(instituteData.value.valid_till)
    if (isNaN(currentValidTill.getTime())) {
      currentValidTill = new Date() // Fallback to current date if invalid
    }

    let newValidTill = new Date(currentValidTill)
    newValidTill.setDate(newValidTill.getDate() + 1)
    newValidTill.setFullYear(newValidTill.getFullYear() + 1) // More reliable for adding a year

    const today = new Date()

    const renewalData = {
      do_dpr_review_decision: 'Pending',
      is_payment_complete: false,
      is_active: false,
      payment_id: null,
      last_renewal_date: today.toISOString().split('T')[0],
      valid_since: today.toISOString().split('T')[0],
      valid_till: newValidTill.toISOString().split('T')[0],
    }

    await apiServices.patchMhpcInstitute(instituteData.value.id, renewalData)

    Object.assign(instituteData.value, renewalData) // Update local data optimistically

    toast.success(
      'Institute renewal initiated successfully! Your application is now pending review.',
    )
    closeRenewalDialog()
    await fetchInstituteData() // Re-fetch to ensure data consistency
  } catch (error) {
    console.error('Error initiating institute renewal:', error)
    const errMsg =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      'Failed to initiate renewal. Please try again.'
    toast.error(errMsg)
  } finally {
    isRenewing.value = false
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
    overflow: visible;
  }

  .print\:hidden {
    display: none !important;
  }
}
</style>
