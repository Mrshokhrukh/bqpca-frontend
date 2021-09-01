<template>
  <div class="min-h-screen py-8">
    <InstituteHeader
      title="DPR Applications Management"
      subtitle="Manage and track Detailed Project Report applications for MHPC accreditation."
      :show-actions="false"
      class="mx-4"
    />

    <div v-if="isLoading" class="mx-4">
      <div class="bg-white rounded-xl shadow-lg p-6 animate-pulse">
        <div class="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div
          v-for="n in 5"
          :key="n"
          class="flex items-center space-x-4 py-3 border-b border-gray-200"
        >
          <div class="h-4 bg-gray-200 rounded w-1/12"></div>
          <div class="h-4 bg-gray-200 rounded w-2/12"></div>
          <div class="h-4 bg-gray-200 rounded w-2/12"></div>
          <div class="h-4 bg-gray-200 rounded w-2/12"></div>
          <div class="h-4 bg-gray-200 rounded w-1/12"></div>
          <div class="h-4 bg-gray-200 rounded w-2/12"></div>
          <div class="h-4 bg-gray-200 rounded w-2/12"></div>
        </div>
      </div>
    </div>

    <div
      v-else-if="apiError"
      class="text-center py-12 bg-red-50 rounded-xl border border-red-200 mx-4"
    >
      <h3 class="text-xl font-semibold text-red-700 mb-2">Oops! Something went wrong.</h3>
      <p class="text-red-600">{{ errorMessage }}</p>
      <button
        @click="fetchApplications"
        class="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
      >
        Try Again
      </button>
    </div>

    <div v-else class="mx-4">
      <div v-if="dprEligibility.status === 'allowed'">
        <div class="sticky top-0 bg-white shadow-sm z-10 p-4 rounded-lg mb-6">
          <div class="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div class="flex gap-4 w-full md:w-auto flex-wrap">
              <div class="relative w-full sm:w-auto md:w-64">
                <input
                  type="text"
                  v-model="searchQuery"
                  placeholder="Search by institution or DPR name..."
                  class="w-full pl-10 pr-4 py-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                  aria-label="Search applications"
                />
                <svg
                  class="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <select
                v-model="filterStatus"
                class="w-full sm:w-auto md:w-40 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2"
                aria-label="Filter by status"
              >
                <option value="">All Statuses</option>
                <option v-for="status in statusOptions" :key="status" :value="status">
                  {{ status }}
                </option>
              </select>
            </div>
            <div class="flex gap-4 w-full sm:w-auto justify-end">
              <button
                @click="fetchApplications"
                :disabled="isDataRefreshing"
                class="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50"
                aria-label="Refresh applications"
              >
                {{ isDataRefreshing ? 'Refreshing...' : 'Refresh' }}
              </button>
              <button
                v-if="showDprButton"
                @click="openDprApplicationModal"
                class="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700"
                aria-label="Add New DPR Application"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    clip-rule="evenodd"
                  />
                </svg>
                {{ dprButtonText }}
              </button>
            </div>
          </div>
        </div>

        <div
          v-if="filteredApplications.length > 0"
          class="bg-white rounded-xl shadow-lg overflow-x-auto"
        >
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  S.N.
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Institution Name
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  DPR Name
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Last Updated
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(application, index) in paginatedApplications" :key="application.id">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ (currentPage - 1) * itemsPerPage + index + 1 }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ application.name_of_institution }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ application.dpr_name || 'Not Submitted' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="[
                      'px-2.5 py-0.5 text-xs font-medium rounded-full',
                      getStatusColor(application.application_status),
                    ]"
                    :title="getStatusTooltip(application.application_status)"
                  >
                    {{ application.application_status || 'N/A' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(application.updated_at) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    v-if="isPaymentPending(application)"
                    @click="openPaymentConfirmationModal(application)"
                    class="text-blue-600 hover:text-blue-900"
                    title="Make Payment"
                  >
                    Pay
                  </button>
                  <button
                    v-if="isPaymentCompleted(application)"
                    @click="openCertificateModal()"
                    class="text-green-600 hover:text-green-900"
                    title="View Certificate"
                  >
                    View Certificate
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="flex justify-between items-center p-4 border-t border-gray-200">
            <div class="text-sm text-gray-600">
              Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to
              {{ Math.min(currentPage * itemsPerPage, filteredApplications.length) }} of
              {{ filteredApplications.length }} applications
            </div>
            <div class="flex gap-2">
              <button
                @click="currentPage--"
                :disabled="currentPage === 1"
                class="px-3 py-1 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                @click="currentPage++"
                :disabled="currentPage === totalPages"
                class="px-3 py-1 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
          <svg
            class="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              vector-effect="non-scaling-stroke"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
            />
          </svg>
          <h3 class="mt-2 text-lg font-medium text-gray-900">Start your DPR Application</h3>
          <p class="mt-1 text-sm text-gray-500">
            Your EOI has been approved. You can now proceed to submit your Detailed Project Report.
          </p>
          <button
            @click="openDprApplicationModal"
            class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Start DPR Application
          </button>
        </div>
      </div>

      <div v-else class="text-center py-12 px-6 bg-white rounded-xl shadow-lg border">
        <div
          class="w-16 h-16 rounded-full mx-auto flex items-center justify-center"
          :class="{
            'bg-yellow-100': dprEligibility.status === 'pending',
            'bg-red-100': dprEligibility.status === 'rejected',
          }"
        >
          <svg
            v-if="dprEligibility.status === 'pending'"
            class="h-8 w-8 text-yellow-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
          <svg
            v-if="dprEligibility.status === 'rejected'"
            class="h-8 w-8 text-red-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636"
            />
          </svg>
        </div>
        <h3 class="mt-4 text-xl font-semibold text-gray-800">Cannot Proceed with DPR</h3>
        <p class="mt-2 text-md text-gray-600 max-w-2xl mx-auto">{{ dprEligibility.message }}</p>
        <p
          v-if="dprEligibility.rejectionReason"
          class="mt-3 text-sm text-red-600 bg-red-50 p-3 rounded-md max-w-2xl mx-auto"
        >
          <strong>Reason:</strong> {{ dprEligibility.rejectionReason }}
        </p>
      </div>
    </div>

    <DPRApplicationFormModal
      :is-visible="showDprModal"
      @close="closeDprApplicationModal"
      @application-submitted="handleSubmissionSuccess"
    />

    <!-- <InstituteCertificate
      :application="selectedApplicationForCertificate"
      :showModal="showCertificateModal"
      @close="closeCertificateModal"
    /> -->

    <PaymentModal
      ref="paymentModalRef"
      :amount="5000"
      @payment-completed="handlePaymentCompleted"
      @close="closePaymentModal"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'
import debounce from 'lodash/debounce'
import apiServices from '@/services/services'
import InstituteHeader from '@/components/common/MHPC/InstituteHeader.vue'
import DPRApplicationFormModal from './InstituteDPRApplication.vue'
import PaymentModal from '@/components/common/PaymentModal.vue'
// import InstituteCertificate from './InstituteCertificate.vue'

const toast = useToast()
const authStore = useAuthStore()
const router = useRouter()

// --- STATE MANAGEMENT ---
const applications = ref([])
const isLoading = ref(true)
const isDataRefreshing = ref(false)
const apiError = ref(false)
const errorMessage = ref('')
const showDprModal = ref(false)
const searchQuery = ref('')
const filterStatus = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(10)

// --- NEW STATE FOR MODALS & PAYMENT ---
const paymentModalRef = ref(null)
const selectedApplicationForPayment = ref(null)
const showCertificateModal = ref(false)
const selectedApplicationForCertificate = ref(null)

// --- CONSTANTS ---
const ApplicationStatus = {
  EOI_APPROVED: 'EOI Approved',
  EOI_REJECTED: 'EOI Rejected',
  DPR_SUBMITTED: 'DPR Submitted',
  DPR_PENDING_REVIEW: 'DPR Pending Review',
  DPR_APPROVED: 'DPR Approved',
  DPR_REJECTED: 'DPR Rejected',
  PAYMENT_PENDING: 'Payment Pending',
  PAYMENT_PROCESSING: 'Payment Processing', // Added for better UX
  FULLY_APPROVED: 'Fully Approved',
  EOI_SUBMITTED: 'EOI Submitted',
  EOI_PENDING_REVIEW: 'EOI Pending Review',
}

const statusOptions = [
  ApplicationStatus.DPR_SUBMITTED,
  ApplicationStatus.DPR_PENDING_REVIEW,
  ApplicationStatus.DPR_REJECTED,
  ApplicationStatus.PAYMENT_PENDING,
  ApplicationStatus.FULLY_APPROVED,
]

// --- COMPUTED PROPERTIES ---
const dprEligibility = computed(() => {
  if (isLoading.value) {
    return { status: 'loading', message: '' }
  }
  if (applications.value.length === 0) {
    return {
      status: 'rejected',
      message: 'You have not initiated an Expression of Interest (EOI) application.',
    }
  }
  const app = applications.value[0]
  const status = app.application_status
  const allowedStatuses = [
    ApplicationStatus.EOI_APPROVED,
    ApplicationStatus.DPR_SUBMITTED,
    ApplicationStatus.DPR_PENDING_REVIEW,
    ApplicationStatus.DPR_APPROVED,
    ApplicationStatus.DPR_REJECTED,
    ApplicationStatus.PAYMENT_PENDING,
    ApplicationStatus.PAYMENT_PROCESSING,
    ApplicationStatus.FULLY_APPROVED,
  ]

  if (allowedStatuses.includes(status)) {
    return { status: 'allowed', message: '' }
  }
  if (status === ApplicationStatus.EOI_REJECTED) {
    return {
      status: 'rejected',
      message:
        'Your Expression of Interest (EOI) was rejected. You cannot proceed with the DPR application.',
      rejectionReason: app.reason_if_rejected || 'No specific reason was provided.',
    }
  }
  return {
    status: 'pending',
    message: `Your EOI application is currently in the '${status}' stage. You can only proceed with the DPR once the EOI is approved.`,
  }
})

const currentApplicationStatus = computed(() => applications.value[0]?.application_status)

const showDprButton = computed(() => {
  return (
    dprEligibility.value.status === 'allowed' &&
    (currentApplicationStatus.value === ApplicationStatus.EOI_APPROVED ||
      currentApplicationStatus.value === ApplicationStatus.DPR_REJECTED)
  )
})

const dprButtonText = computed(() => {
  if (currentApplicationStatus.value === ApplicationStatus.DPR_REJECTED) {
    return 'Revise and Resubmit DPR'
  }
  return 'Start DPR Application'
})

const filteredApplications = computed(() => {
  let result = applications.value.filter(() => dprEligibility.value.status === 'allowed')
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(
      (app) =>
        app.name_of_institution?.toLowerCase().includes(query) ||
        app.dpr_name?.toLowerCase().includes(query),
    )
  }
  if (filterStatus.value) {
    result = result.filter((app) => app.application_status === filterStatus.value)
  }
  return result
})

const totalPages = computed(() => Math.ceil(filteredApplications.value.length / itemsPerPage.value))
const paginatedApplications = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredApplications.value.slice(start, end)
})

// --- METHODS ---
const fetchApplications = async () => {
  const userCid = authStore.user?.cid
  if (!userCid) {
    errorMessage.value = 'User not found. Please log in.'
    apiError.value = true
    isLoading.value = false
    return
  }
  if (!isLoading.value) isDataRefreshing.value = true

  try {
    const response = await apiServices.getMhpcInstituteByCid(userCid)
    if (response.data?.results?.length > 0) {
      applications.value = response.data.results.sort(
        (a, b) => new Date(b.updated_at) - new Date(a.updated_at),
      )
    } else {
      applications.value = []
    }
    apiError.value = false
  } catch (error) {
    console.error('Error fetching applications:', error)
    apiError.value = true
    errorMessage.value = 'Failed to load application data.'
    toast.error(errorMessage.value)
  } finally {
    isLoading.value = false
    isDataRefreshing.value = false
  }
}

const handleSubmissionSuccess = (updatedApplication) => {
  closeDprApplicationModal()
  toast.success(`DPR for "${updatedApplication.name_of_institution}" submitted successfully!`)
  fetchApplications()
}

const openDprApplicationModal = () => (showDprModal.value = true)
const closeDprApplicationModal = () => (showDprModal.value = false)

// --- NEW METHODS FOR PAYMENT AND CERTIFICATE ---

const openPaymentConfirmationModal = (application) => {
  if (application) {
    selectedApplicationForPayment.value = application
    if (paymentModalRef.value) {
      paymentModalRef.value.openModal()
    } else {
      console.error('Payment modal reference is not available.')
      toast.error('Payment modal could not be opened.')
    }
  } else {
    toast.error('Application data is missing for payment.')
  }
}

const closePaymentModal = () => {
  selectedApplicationForPayment.value = null
}

const openCertificateModal = () => {
  router.push('/admin/institutions/health_certification/institution_profile')
}


const handlePaymentCompleted = async (paymentData) => {
  if (!selectedApplicationForPayment.value) {
    toast.error('No application selected for payment.');
    return;
  }

  const user = authStore.user;

  if (!user) {
    toast.error('User session not found. Please log in again.');
    return;
  }

  const missingFields = [];
  if (!user.id) missingFields.push('User ID');
  if (!user.cid) missingFields.push('User CID');
  if (!user.email) missingFields.push('User Email');

  if (missingFields.length > 0) {
    const errorMessage = `Cannot proceed. Missing essential information: [${missingFields.join(', ')}].`;
    toast.error(errorMessage);
    return;
  }

  isDataRefreshing.value = true;
  const paymentId = paymentData.paymentHash;
  const appForPayment = selectedApplicationForPayment.value;

  const appIndex = applications.value.findIndex((a) => a.id === appForPayment.id);
  if (appIndex > -1) {
    applications.value[appIndex].application_status = ApplicationStatus.PAYMENT_PROCESSING;
  }

  try {
    const paymentGatewayFormData = new FormData();
    paymentGatewayFormData.append('refNo', paymentId);
    paymentGatewayFormData.append('serviceCode', '100248');
    paymentGatewayFormData.append('taxPayerName', user.cid);
    paymentGatewayFormData.append('taxPayerNo', user.cid);
    paymentGatewayFormData.append('taxPayerDocumentNo', user.cid);
    paymentGatewayFormData.append('totalPayableAmount', 5000);
    paymentGatewayFormData.append('description', 'MHPC DPR Accreditation Fee');
    paymentGatewayFormData.append('payerEmail', user.email);
    paymentGatewayFormData.append('user', user.id);
    paymentGatewayFormData.append('payableAmount', 5000);
    paymentGatewayFormData.append('application_no', appForPayment.id);
    paymentGatewayFormData.append('app_type', 'dpr_accreditation');

    // --- UPDATED LINE WITH DEFAULT MOBILE NUMBER ---
    // If user.contact_number exists, use it. If not, use the default value '17110000'.
    paymentGatewayFormData.append('mobileNo', user.contact_number || '17110000');

    await apiServices.makePayment(paymentGatewayFormData);

    const backendUpdateFormData = new FormData();
    backendUpdateFormData.append('payment_id', paymentId);
    backendUpdateFormData.append('payment_status', 'processing_payment');
    backendUpdateFormData.append('is_payment_complete', true);

    await apiServices.patchMhpcInstitute(appForPayment.id, backendUpdateFormData);

    toast.success(
      `Payment initiated (Ref: ${paymentId.substring(0, 8)}...). Your application status will update shortly.`,
    );
  } catch (error) {
    console.error('Payment handling error:', error.response || error);
    toast.error('An error occurred while processing the payment. Please contact support.');
    if (appIndex > -1) {
      applications.value[appIndex].application_status = ApplicationStatus.PAYMENT_PENDING;
    }
  } finally {
    await fetchApplications();
    isDataRefreshing.value = false;
    selectedApplicationForPayment.value = null;
    closePaymentModal();
  }
};

// Helper functions
const getStatusColor = (status) => {
  if (!status) return 'bg-gray-100 text-gray-700'
  const s = status.toLowerCase()
  if (s.includes('approved') || s.includes('fully')) return 'bg-green-100 text-green-700'
  if (s.includes('rejected')) return 'bg-red-100 text-red-700'
  if (s.includes('payment pending')) return 'bg-purple-100 text-purple-700'
  if (s.includes('processing')) return 'bg-blue-100 text-blue-700'
  if (s.includes('pending') || s.includes('submitted') || s.includes('review'))
    return 'bg-yellow-100 text-yellow-700'
  return 'bg-gray-100 text-gray-700'
}
const getStatusTooltip = (status) => `Current application status: ${status}`
const formatDate = (dateString) =>
  dateString
    ? new Date(dateString).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : 'N/A'

const isPaymentPending = (app) =>
  app.application_status === ApplicationStatus.PAYMENT_PENDING && !app.is_payment_complete
const isPaymentCompleted = (app) => app.application_status === ApplicationStatus.FULLY_APPROVED

// --- WATCHERS ---
watch(
  searchQuery,
  debounce(() => {
    currentPage.value = 1
  }, 300),
)
watch(filterStatus, () => {
  currentPage.value = 1
})

// --- LIFECYCLE HOOK ---
onMounted(async () => {
  await fetchApplications();
});
</script>

<style scoped>
.disabled\:opacity-50:disabled {
  opacity: 0.5;
}
.max-h-\[90vh\] {
  max-height: 90vh;
}
.overflow-y-auto {
  overflow-y: auto;
}
</style>
