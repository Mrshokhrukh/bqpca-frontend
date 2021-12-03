<template>
  <div class="w-full mx-auto px-2 sm:px-4 py-6 sm:py-8">
    <TrackerTabs :tabs="tabs" :currentTab="currentTab" @update:currentTab="handleTabChange" />

    <PageHeader :title="pageHeaderTitle" :subtitle="pageHeaderSubtitle">
      <template #icon>
        <ClipboardList class="w-6 h-6 text-indigo-600" />
      </template>
    </PageHeader>

    <!-- Initial loading state (before any data is fetched) -->
    <div v-if="initialLoading && !hasAttemptedFetch" class="my-8 flex justify-center">
      <div class="flex flex-col items-center space-y-3">
        <svg
          class="animate-spin h-8 w-8 text-blue-600"
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
        <p class="text-gray-600 font-medium">Loading your application tracker...</p>
      </div>
    </div>

    <!-- Main content area -->
    <div v-if="!initialLoading && hasAttemptedFetch">
      <!-- Tab-specific loading state -->
      <div v-if="isLoading && !apiError" class="my-8 flex justify-center">
        <div class="flex flex-col items-center space-y-3">
          <svg
            class="animate-spin h-8 w-8 text-blue-600"
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
          <p class="text-gray-600 font-medium">Loading your {{ loadingText }} data...</p>
        </div>
      </div>

      <div v-if="!isLoading && !apiError">
        <!-- New Applications Tab -->
        <NewApplicationsTracker
          v-if="currentTab === 'new' && newApplications.length > 0"
          :applications="newApplications"
          @open-certificate="openCertificateModal"
          @initiate-payment="initiatePayment($event.application, $event.qualification)"
        />

        <!-- Renewal Applications Tab -->
        <RenewalApplicationsTracker
          v-if="currentTab === 'renewal' && renewalApplications.length > 0"
          :applications="renewalApplications"
          @initiate-payment="initiatePayment(null, $event)"
        />

        <!-- Additional Qualifications Tab -->
        <AdditionalQualificationsTracker
          v-if="currentTab === 'additional' && additionalApplications.length > 0"
          :applications="additionalApplications"
          @open-certificate="openCertificateModal"
          @initiate-payment="initiatePayment($event.application, $event.qualification)"
        />

        <!-- Empty state -->
        <div
          v-if="!apiError && currentDataIsEmpty"
          class="text-center py-8 sm:py-12 bg-gray-50 rounded-xl border border-gray-200 shadow-md"
        >
          <div class="flex flex-col items-center justify-center">
            <div class="p-3 bg-gray-100 rounded-full mb-3">
              <SearchX class="w-6 h-6 text-gray-400" />
            </div>
            <h3 class="text-lg sm:text-xl font-semibold text-gray-700 mb-2">
              No {{ noResultsText }} Found
            </h3>
            <p class="text-gray-600 max-w-md mx-auto text-sm px-4">
              We couldn't find any {{ noResultsText.toLowerCase() }} matching your details.
            </p>
          </div>
        </div>
      </div>

      <!-- Error state -->
      <div
        v-if="apiError && hasAttemptedFetch"
        class="text-center py-8 sm:py-12 bg-red-50 rounded-xl border border-red-200 shadow-md"
      >
        <div class="flex flex-col items-center justify-center">
          <div class="p-3 bg-red-100 rounded-full mb-3">
            <AlertTriangle class="w-6 h-6 text-red-500" />
          </div>
          <h3 class="text-lg sm:text-xl font-semibold text-red-700 mb-2">Error Loading Data</h3>
          <p class="text-red-600 max-w-md mx-auto text-sm px-4">
            {{ errorMessage || 'An error occurred while fetching your data. Please try again later or contact support if the problem persists.' }}
          </p>
          <button
            @click="retryFetch"
            class="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>

    <CertificateModal
      :application="selectedCertificateData"
      @close="closeCertificateModal"
      :showModal="showCertificateModal"
    />

    <PaymentModal
      ref="paymentModalRef"
      :amount="1000"
      @payment-completed="handlePaymentCompleted"
      @close="closePaymentModal"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import apiService from '@/services/services'
import CertificateModal from '@/components/common/MHPC/MHPCCertificateModal.vue'
import PaymentModal from '@/components/common/PaymentModal.vue'
import PageHeader from '@/components/common/MHPC/PageHeader.vue'
import TrackerTabs from './TrackerTabs.vue'
import NewApplicationsTracker from './NewApplicationsTracker.vue'
import RenewalApplicationsTracker from './RenewalApplicationsTracker.vue'
import AdditionalQualificationsTracker from './AdditionalQualificationsTracker.vue'

import { AlertTriangle, SearchX, ClipboardList } from 'lucide-vue-next'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '@/stores/authStore'

const toast = useToast()
const authStore = useAuthStore()

// --- State Management ---
const newApplications = ref([])
const renewalApplications = ref([])
const additionalApplications = ref([])
const initialLoading = ref(true)
const isLoading = ref(false) 
const hasAttemptedFetch = ref(false)
const apiError = ref(false)
const errorMessage = ref('')
const showCertificateModal = ref(false)
const selectedCertificateData = ref(null)
const paymentModalRef = ref(null)
const selectedQualificationForPayment = ref(null)

// --- Tab Configuration (Updated) ---
const currentTab = ref('new') // Default to the new applications tab
const tabs = [
  { name: 'new', label: 'New Applications' },
  { name: 'renewal', label: 'Renewals' },
  { name: 'additional', label: 'Additional Qualifications' },
]

const userCid = computed(() => {
  // Try multiple possible properties for CID
  return authStore.user?.cid || authStore.user?.username || authStore.user?.user_cid
})

// --- Computed Properties for Dynamic UI Text (Updated) ---
const pageHeaderTitle = computed(() => {
  if (currentTab.value === 'new') return 'Track Your Application'
  if (currentTab.value === 'renewal') return 'Track Your Renewal'
  return 'Track Additional Qualifications'
})

const pageHeaderSubtitle = computed(() => {
  if (currentTab.value === 'new') return 'Your application status is displayed below.'
  if (currentTab.value === 'renewal') return 'Your renewal status is displayed below.'
  return 'Your additional qualifications status is displayed below.'
})

const loadingText = computed(() => {
  if (currentTab.value === 'new') return 'application'
  if (currentTab.value === 'renewal') return 'renewal'
  return 'additional qualifications'
})

const noResultsText = computed(() => {
  if (currentTab.value === 'new') return 'Applications'
  if (currentTab.value === 'renewal') return 'Renewals'
  return 'Additional Qualifications'
})

const currentDataIsEmpty = computed(() => {
  if (!hasAttemptedFetch.value) return false
  if (currentTab.value === 'new') {
    return newApplications.value.length === 0
  }
  if (currentTab.value === 'renewal') {
    return renewalApplications.value.length === 0
  }
  if (currentTab.value === 'additional') {
    return additionalApplications.value.length === 0
  }
  return true
})

// --- Methods ---
const handleTabChange = (tabName) => {
  currentTab.value = tabName
}

const fetchNewApplications = async () => {
  if (!userCid.value) {
    errorMessage.value = 'User CID not available. Please ensure you are logged in.'
    throw new Error(errorMessage.value)
  }

  try {
    const response = await apiService.getMhpcFullApplicationListByCid(userCid.value)
    if (response?.data?.results) {
      newApplications.value = response.data.results.filter((app) =>
        app.user_qualifications?.some((q) => q.is_primary_qualification === true),
      )
    } else {
      newApplications.value = []
    }
  } catch (error) {
    console.error('Error fetching new applications:', error)
    newApplications.value = []
    errorMessage.value = error.response?.data?.detail || error.message || 'Failed to load new application data.'
    throw error
  }
}

const fetchRenewalApplications = async () => {
  if (!userCid.value) {
    errorMessage.value = 'User CID not available. Please ensure you are logged in.'
    throw new Error(errorMessage.value)
  }

  try {
    const response = await apiService.getMhpcRenewals(userCid.value)
    if (response?.data?.results) {
      renewalApplications.value = response.data.results
    } else {
      renewalApplications.value = []
    }
  } catch (error) {
    console.error('Error fetching renewal applications:', error)
    renewalApplications.value = []
    errorMessage.value = error.response?.data?.detail || error.message || 'Failed to load renewal data.'
    throw error
  }
}

const fetchAdditionalApplications = async () => {
  if (!userCid.value) {
    errorMessage.value = 'User CID not available. Please ensure you are logged in.'
    throw new Error(errorMessage.value)
  }

  try {
    const response = await apiService.getMhpcFullApplicationListByCid(userCid.value)
    if (response?.data?.results) {
      additionalApplications.value = response.data.results.filter((app) =>
        app.user_qualifications?.some((q) => q.is_primary_qualification === false),
      )
    } else {
      additionalApplications.value = []
    }
  } catch (error) {
    console.error('Error fetching additional applications:', error)
    additionalApplications.value = []
    errorMessage.value = error.response?.data?.detail || error.message || 'Failed to load additional qualifications data.'
    throw error
  }
}

// --- Modal and Payment Logic ---
const openCertificateModal = (application) => {
  selectedCertificateData.value = application
  showCertificateModal.value = true
}

const closeCertificateModal = () => {
  showCertificateModal.value = false
  selectedCertificateData.value = null
}

const initiatePayment = (application, qualification) => {
  if (qualification) {
    selectedQualificationForPayment.value = qualification
    if (paymentModalRef.value) {
      paymentModalRef.value.openModal()
    } else {
      console.error('Payment modal reference is not available.')
      toast.error('Payment modal could not be opened.')
    }
  } else {
    toast.error('No specific item provided for payment.')
  }
}

const closePaymentModal = () => {
  selectedQualificationForPayment.value = null
}

const handlePaymentCompleted = async (paymentData) => {
  if (!selectedQualificationForPayment.value) {
    toast.error('No item selected for payment.')
    return
  }
  const user = authStore.user
  if (!user || !user.contact_number || !user.email || !user.cid || !user.id) {
    toast.error('Missing user information. Please log in again or update your profile.')
    return
  }

  isLoading.value = true
  const paymentId = paymentData.paymentHash
  const itemForPayment = selectedQualificationForPayment.value
  let redirectUrl = null
  const isRenewal = Object.hasOwn(itemForPayment, 'renewal_status')

  try {
    const paymentInitiationFormData = new FormData()
    paymentInitiationFormData.append('refNo', paymentId)
    paymentInitiationFormData.append('serviceCode', '100201')
    paymentInitiationFormData.append('taxPayerName', user.cid)
    paymentInitiationFormData.append('taxPayerNo', user.cid)
    paymentInitiationFormData.append('taxPayerDocumentNo', user.cid)
    paymentInitiationFormData.append('totalPayableAmount', 1000)
    paymentInitiationFormData.append(
      'description',
      isRenewal ? 'MHPC Renewal Fee' : 'MHPC Qualification Registration Fee',
    )
    paymentInitiationFormData.append('mobileNo', user.contact_number)
    paymentInitiationFormData.append('payerEmail', user.email)
    paymentInitiationFormData.append('user', user.id)
    paymentInitiationFormData.append('payableAmount', 1000)
    paymentInitiationFormData.append('application_no', itemForPayment.id)
    paymentInitiationFormData.append('app_type', 'specification_for_health_certification')

    const paymentResponse = await apiService.makePayment(paymentInitiationFormData)
    if (paymentResponse.data?.content?.redirectUrl) {
      redirectUrl = paymentResponse.data.content.redirectUrl
    }

    const updateFormData = new FormData()
    updateFormData.append('payment_id', paymentId)
    updateFormData.append('payment_status', 'processing_payment')

    if (isRenewal) {
      await apiService.patchMhpcRenewal(itemForPayment.id, updateFormData)
    } else {
      await apiService.patchMhpcNewQualification(itemForPayment.id, updateFormData)
    }

    toast.success(
      'Payment initiated successfully. Redirecting for payment completion. A link has also been sent to your email.',
      { timeout: 8000 },
    )

    if (redirectUrl) {
      window.open(redirectUrl, '_blank')
    }

    await fetchAllData()
  } catch (error) {
    console.error('Payment handling error:', error.response || error.request || error)
    let errorMsg = 'An error occurred while processing the payment confirmation.'
    if (error.response?.data) {
      const detail = error.response.data.detail || JSON.stringify(error.response.data)
      errorMsg = `Payment API Error: ${detail}`
    } else if (error.request) {
      errorMsg = 'Network Error: Could not reach the server to confirm payment.'
    }
    toast.error(`${errorMsg} Contact support with payment ref ${paymentId} if the issue persists.`)

    if (selectedQualificationForPayment.value) {
      selectedQualificationForPayment.value.payment_status = 'failed'
    }
  } finally {
    isLoading.value = false
    if (paymentModalRef.value) {
      paymentModalRef.value.closeModal()
    }
  }
}

const fetchAllData = async () => {
  initialLoading.value = true
  apiError.value = false
  errorMessage.value = ''

  try {
    // Check if user is authenticated
    if (!authStore.isAuthenticated) {
      throw new Error('Please log in to view your application status.')
    }

    if (!userCid.value) {
      throw new Error('User CID not available. Please ensure your profile has a valid CID.')
    }

    // Fetch all data sources concurrently
    await Promise.all([
      fetchNewApplications(),
      fetchRenewalApplications(),
      fetchAdditionalApplications(),
    ])

    hasAttemptedFetch.value = true
    apiError.value = false
  } catch (err) {
    console.error('Error during initial data fetch:', err)
    apiError.value = true
    errorMessage.value = err.message || 'Failed to load application data. Please try again.'
    toast.error(errorMessage.value)
  } finally {
    initialLoading.value = false
    isLoading.value = false
  }
}

const retryFetch = async () => {
  await fetchAllData()
}

// --- Lifecycle Hook ---
onMounted(async () => {
  await fetchAllData()
})
</script>

<style scoped>
button {
  cursor: pointer;
}

[v-if='initialLoading'] {
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

[v-if='isLoading'] {
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>