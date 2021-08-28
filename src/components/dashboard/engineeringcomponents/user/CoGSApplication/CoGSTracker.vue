<template>
  <div class="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-gray-50 min-h-screen">
    <!-- Header Section -->
    <div
      class="bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 rounded-2xl p-8 mb-10 shadow-sm border border-gray-200"
    >
      <h2 class="text-3xl font-bold text-gray-900 mb-2 text-center">Your Applications</h2>
      <p class="text-gray-600 text-center max-w-2xl mx-auto">
        Track the status and details of your submitted Certificate of Good Standing (CoGS)
        applications.
      </p>
    </div>

    <div v-if="isLoading" class="flex justify-center py-12">
      <div class="flex items-center space-x-2 text-gray-500">
        <div class="h-4 w-4 bg-blue-600 rounded-full animate-pulse"></div>
        <div class="h-4 w-4 bg-blue-600 rounded-full animate-pulse [animation-delay:0.2s]"></div>
        <div class="h-4 w-4 bg-blue-600 rounded-full animate-pulse [animation-delay:0.4s]"></div>
        <span class="ml-2">Loading Applications...</span>
      </div>
    </div>

    <div v-else-if="apiError" class="text-center py-12 bg-red-50 rounded-xl border border-red-200">
      <p class="text-red-700 font-semibold">An error occurred.</p>
      <p class="text-red-600 mt-1">Could not fetch application data. Please try again later.</p>
    </div>

    <div
      v-else-if="filteredApplications.length === 0"
      class="text-center py-16 bg-white rounded-2xl border border-gray-200 shadow-sm"
    >
      <FileSearch class="w-16 h-16 mx-auto text-gray-300" />
      <h3 class="mt-4 text-xl font-semibold text-gray-800">No Records Found</h3>
      <p class="mt-2 text-gray-500">
        We couldn't find any CoGS application records associated with your account.
      </p>
    </div>

    <!-- Results Section -->
    <div v-else class="space-y-8">
      <div
        v-for="application in filteredApplications"
        :key="application.id"
        class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl"
      >
        <!-- Card Header -->
        <div
          class="bg-gray-50/70 p-5 border-b border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div>
            <h3 class="text-xl font-bold text-gray-900 flex items-center">
              <span class="text-gray-500 font-medium mr-2">Reg #</span
              >{{ application.registration_no }}
            </h3>
            <p class="text-sm text-gray-500 mt-1">
              Submitted on {{ formatDate(application.created_at) }}
            </p>
          </div>
          <div class="flex items-center space-x-4 w-full sm:w-auto">
            <status-badge :status="application.endorsement_decision" />

            <button
              v-if="!application.is_payment_complete && !application.payment_id"
              @click="initiatePayment(application)"
              class="px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 transition-colors flex items-center shadow-sm"
            >
              <CreditCard class="w-4 h-4 mr-2" />
              <span>Proceed to Payment</span>
            </button>

            <div
              v-else-if="!application.is_payment_complete && application.payment_id"
              class="px-4 py-2 bg-orange-100 text-orange-700 text-sm font-semibold rounded-lg flex items-center border border-orange-200 cursor-not-allowed animate-pulse"
            >
              <svg
                class="animate-spin -ml-1 mr-3 h-4 w-4 text-orange-600"
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
              <span>Processing Payment...</span>
            </div>

            <div
              v-else-if="application.is_payment_complete"
              class="px-4 py-2 bg-blue-100 text-blue-700 text-sm font-semibold rounded-lg flex items-center border border-blue-200"
            >
              <CreditCard class="w-4 h-4 mr-2" />
              <span>Payment Complete</span>
            </div>
          </div>
        </div>

        <!-- Card Body -->
        <div class="p-6">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <!-- Left Side: Applicant and Workplace -->
            <div class="lg:col-span-8 space-y-8">
              <!-- Recipient Information -->
              <div>
                <h4
                  class="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b flex items-center gap-2"
                >
                  <User class="w-5 h-5 text-blue-600" />
                  Recipient Information
                </h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <detail-row label="Full Name" :value="application.recipient_name" />
                  <detail-row
                    label="Contact Number"
                    :value="application.recipient_contact_number"
                  />
                  <detail-row label="Email Address" :value="application.recipient_email" />
                  <detail-row label="Address" :value="application.address" />
                  <detail-row label="Post Box Number" :value="application.po_box" />
                  <detail-row label="ZIP code" :value="application.zip_code" />
                </div>
              </div>

              <!-- Workplace & Supervisor Information -->
              <div>
                <h4
                  class="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b flex items-center gap-2"
                >
                  <Building2 class="w-5 h-5 text-blue-600" />
                  Workplace & Supervisor
                </h4>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <!-- NEW: Added Agency, Dept, Workplace with optional chaining for safety -->
                  <detail-row label="Agency" :value="application.agency?.name || 'Not Specified'" />
                  <detail-row
                    label="Department"
                    :value="application.department?.name || 'Not Specified'"
                  />
                  <detail-row
                    label="Workplace"
                    :value="application.workplace?.name || 'Not Specified'"
                  />
                  <detail-row label="Supervisor Name" :value="application.supervisor_name" />
                  <detail-row
                    label="Supervisor Designation"
                    :value="application.supervisor_designation"
                  />
                </div>
              </div>
            </div>

            <!-- Right Side: Status and Remarks -->
            <div class="lg:col-span-4 bg-gray-50 rounded-xl p-5 border">
              <h4
                class="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b flex items-center gap-2"
              >
                <ClipboardList class="w-5 h-5 text-blue-600" />
                Application Status
              </h4>
              <div class="space-y-4">
                <status-detail-row label="Review Status" :status="application.review_status" />
                <status-detail-row label="Endorsement" :status="application.endorsement_decision" />
                <status-detail-row
                  label="Payment"
                  :status="application.is_payment_complete ? 'Completed' : 'Pending'"
                />
              </div>

              <div v-if="application.review_remark" class="mt-6 pt-4 border-t">
                <h5 class="font-semibold text-gray-700 mb-2">Review Remarks:</h5>
                <p class="text-sm text-gray-600 bg-white p-3 rounded-md border italic">
                  "{{ application.review_remark }}"
                </p>
              </div>
              <div v-if="application.endorsement_remark" class="mt-4">
                <h5 class="font-semibold text-gray-700 mb-2">Endorsement Remarks:</h5>
                <p class="text-sm text-gray-600 bg-white p-3 rounded-md border italic">
                  "{{ application.endorsement_remark }}"
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Payment Modal -->
    <PaymentModal
      ref="paymentModal"
      :amount="500"
      @payment-completed="handlePaymentCompleted"
      @close="closePaymentModal"
    />
  </div>
</template>

<script setup>
import { ref, h, defineComponent, onMounted, computed } from 'vue'
import apiService from '@/services/services'
import { User, CreditCard, FileSearch, Building2, ClipboardList } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/authStore'
import PaymentModal from '@/components/common/PaymentModal.vue'
import { useToast } from 'vue-toastification'

const toast = useToast()

const applications = ref([])
const isLoading = ref(true)
const apiError = ref(false)
const authStore = useAuthStore()
const paymentModal = ref(null)
const selectedApplication = ref(null)

const filteredApplications = computed(() => {
  if (!authStore.user || !authStore.user.cid) {
    return []
  }
  return applications.value.filter((app) => app.cid_no === authStore.user.cid)
})

const fetchApplications = async () => {
  isLoading.value = true
  apiError.value = false
  try {
    const response = await apiService.getEpcCogs()
    if (response.data && Array.isArray(response.data.results)) {
      applications.value = response.data.results.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      )
    } else {
      applications.value = []
      console.error('API did not return an array in results:', response.data)
      apiError.value = true
    }
  } catch (error) {
    console.error('Error fetching applications:', error)
    applications.value = []
    apiError.value = true
  } finally {
    isLoading.value = false
  }
}

// --- Child Components for better structure ---

const StatusBadge = defineComponent({
  props: { status: String },
  render() {
    const statusClasses = {
      Pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      Approved: 'bg-green-100 text-green-800 border-green-200',
      Regretted: 'bg-red-100 text-red-800 border-red-200',
    }
    return h(
      'span',
      {
        class: `px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border ${
          statusClasses[this.status] || 'bg-gray-100 text-gray-800'
        }`,
      },
      this.status
    )
  },
})

const DetailRow = defineComponent({
  props: { label: String, value: String },
  render() {
    return h('div', { class: 'flex flex-col' }, [
      h('p', { class: 'text-xs text-gray-500 font-medium' }, this.label),
      h('p', { class: 'text-sm text-gray-800 font-semibold' }, this.value || '-'),
    ])
  },
})

const StatusDetailRow = defineComponent({
  props: { label: String, status: String },
  render() {
    const statusClasses = {
      Pending: 'bg-yellow-100 text-yellow-800',
      Approved: 'bg-green-100 text-green-800',
      Completed: 'bg-green-100 text-green-800',
      Regretted: 'bg-red-100 text-red-800',
    }
    return h('div', { class: 'flex items-center justify-between' }, [
      h('p', { class: 'text-sm font-medium text-gray-700' }, this.label),
      h(
        'span',
        {
          class: `px-2.5 py-0.5 rounded-full text-xs font-semibold ${
            statusClasses[this.status] || 'bg-gray-100 text-gray-800'
          }`,
        },
        this.status
      ),
    ])
  },
})

// --- Helper and Handler Functions ---

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const initiatePayment = (application) => {
  selectedApplication.value = application
  paymentModal.value.openModal()
}

const closePaymentModal = () => {
  selectedApplication.value = null
}

const handlePaymentCompleted = async (paymentData) => {
  if (!selectedApplication.value) {
    toast.error('No application selected for payment.')
    return
  }

  const applicationId = selectedApplication.value.id
  const paymentId = paymentData.paymentHash
  const user = authStore.user

  if (!user || !user.contact_number || !user.email || !user.cid) {
    toast.error('Missing user information. Please update your profile.')
    return
  }

  try {
    isLoading.value = true

    const paymentInitiationFormData = new FormData()
    paymentInitiationFormData.append('refNo', paymentId)
    paymentInitiationFormData.append('serviceCode', '100247')
    paymentInitiationFormData.append('taxPayerName', user.cid)
    paymentInitiationFormData.append('taxPayerNo', user.cid)
    paymentInitiationFormData.append('taxPayerDocumentNo', user.cid)
    paymentInitiationFormData.append('totalPayableAmount', 500)
    paymentInitiationFormData.append('description', 'CoGS Application Fee')
    paymentInitiationFormData.append('mobileNo', user.contact_number)
    paymentInitiationFormData.append('payerEmail', user.email)
    paymentInitiationFormData.append('user', user.id)
    paymentInitiationFormData.append('payableAmount', 500)
    paymentInitiationFormData.append('application_no', selectedApplication.value.id)
    paymentInitiationFormData.append('app_type', 'certificate_of_good_standing_fee')

    await apiService.makePayment(paymentInitiationFormData)

    const updateFormData = new FormData()
    updateFormData.append('is_payment_complete', 'false')
    updateFormData.append('payment_id', paymentId)

    await apiService.patchEpcCogs(applicationId, updateFormData)

    toast.success(`Payment successful! Your application status has been updated.`)
  } catch (error) {
    console.error('Payment update error:', error)
    if (error.response) {
      toast.error(error.response.data.detail || 'An API error occurred during payment.')
    } else {
      toast.error('A network error occurred. Please try again.')
    }
  } finally {
    isLoading.value = false
    selectedApplication.value = null
    fetchApplications()
  }
}

onMounted(fetchApplications)
</script>
