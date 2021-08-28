<template>
  <div class="w-full mx-auto px-4 sm:px-6 py-8 bg-gray-50 min-h-screen">
    <PageHeader
      title="Application Status"
      subtitle="Review the status and details of your submitted Certificate of Good Standing (CoGS) applications."
    >
      <template #icon>
        <ClipboardList class="w-6 h-6 text-blue-600" />
      </template>
    </PageHeader>

    <div class="mt-8">
      <!-- Loading State -->
      <div v-if="isLoading" class="flex justify-center items-center h-64">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p class="ml-3 text-gray-600">Loading applications...</p>
      </div>

      <!-- Error State -->
      <div
        v-else-if="apiError"
        class="bg-red-50 border border-red-200 rounded-xl p-8 text-center shadow-sm"
      >
        <AlertTriangle class="h-12 w-12 mx-auto text-red-500 mb-4" />
        <h3 class="text-xl font-semibold text-red-700 mb-2">Data Retrieval Error</h3>
        <p class="text-red-600">
          We couldn't fetch your application records. Please refresh the page or try again later.
        </p>
      </div>

      <!-- Empty State -->
      <div
        v-else-if="filteredApplications.length === 0"
        class="bg-white shadow-lg rounded-xl p-8 text-center border border-gray-100"
      >
        <FileX2 class="h-16 w-16 mx-auto text-blue-500 mb-4" />
        <h3 class="text-xl font-semibold text-gray-800 mb-2">No Applications Found</h3>
        <p class="text-gray-600">You haven't submitted any CoGS applications yet.</p>
      </div>

      <!-- Application List -->
      <transition-group v-else name="list" tag="div" class="space-y-6">
        <div
          v-for="application in filteredApplications"
          :key="application.id"
          class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl"
        >
          <!-- Card Header -->
          <div
            class="p-5 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100"
          >
            <div
              class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div>
                <h3 class="text-lg sm:text-xl font-semibold text-gray-900 mb-1">
                  Application #{{ application.registration_no || 'N/A' }}
                </h3>
                <p class="text-xs sm:text-sm text-gray-500">
                  Submitted on: {{ formatDate(application.created_at) }}
                </p>
              </div>
              <div class="flex items-center space-x-3 flex-shrink-0">
                <status-badge :status="application.endorsement_decision" />
                <!-- Payment Button -->
                <button
                  v-if="
                    application.review_status === 'Approved' &&
                    !application.is_payment_complete &&
                    !application.payment_id
                  "
                  @click="initiatePayment(application)"
                  :disabled="isLoadingPayment"
                  class="btn btn-success text-xs px-3 py-1.5 disabled:opacity-60 disabled:cursor-wait"
                >
                  <CreditCard class="w-4 h-4 mr-1.5" />
                  {{ isLoadingPayment ? 'Processing...' : 'Pay Fee' }}
                </button>

                <span
                  v-else-if="
                    application.review_status === 'Approved' &&
                    !application.is_payment_complete &&
                    application.payment_id
                  "
                  class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 animate-pulse"
                >
                  <Activity class="w-4 h-4 mr-1.5" />
                  Processing Payment...
                </span>

                <span
                  v-else-if="
                    application.review_status === 'Approved' && application.is_payment_complete
                  "
                  class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  <CheckCircle class="w-4 h-4 mr-1.5" />
                  Payment Complete
                </span>
              </div>
            </div>
          </div>

          <!-- Card Body Grid -->
          <div class="p-6">
            <div class="grid md:grid-cols-3 gap-x-6 gap-y-8">
              <div>
                <h4 class="detail-heading">
                  <User class="w-5 h-5 mr-2 text-blue-600" /> Personal Information
                </h4>
                <div class="space-y-4 mt-3 pl-1">
                  <detail-row label="Full Name" :value="application.full_name" />
                  <detail-row label="CID Number" :value="application.cid_no" />
                  <detail-row label="Gender" :value="application.gender || 'N/A'" />
                </div>
              </div>

              <div>
                <h4 class="detail-heading">
                  <Contact class="w-5 h-5 mr-2 text-blue-600" /> Contact & Work
                </h4>
                <div class="space-y-4 mt-3 pl-1">
                  <detail-row
                    label="Supervisor Email"
                    :value="application.email_address || 'N/A'"
                    icon="Mail"
                  />
                  <detail-row
                    label="Supervisor Contact"
                    :value="application.contact_number || 'N/A'"
                    icon="Phone"
                  />
                  <detail-row
                    label="Workplace"
                    :value="application.workplace || 'Not Specified'"
                    icon="Building"
                  />
                </div>
              </div>

              <div>
                <h4 class="detail-heading">
                  <Activity class="w-5 h-5 mr-2 text-blue-600" /> Application Status
                </h4>
                <div class="space-y-4 mt-3 pl-1">
                  <detail-row
                    label="Review Status"
                    :value="application.review_status || 'N/A'"
                    icon="FileText"
                  />
                  <detail-row
                    label="Endorsement"
                    :value="application.endorsement_decision || 'Pending'"
                    icon="Target"
                  />
                  <detail-row
                    label="Payment Status"
                    :value="application.is_payment_complete ? 'Completed' : 'Pending'"
                    icon="CreditCard"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Remarks Section -->
          <div
            v-if="application.review_remark || application.endorsement_remark"
            class="border-t border-gray-100 bg-gray-50 px-6 py-4"
          >
            <h4 class="text-sm font-semibold text-gray-700 mb-2 flex items-center">
              <MessageSquare class="w-4 h-4 mr-2 text-gray-500" /> Remarks
            </h4>
            <p v-if="application.review_remark" class="text-sm text-gray-600 italic mb-2">
              <span class="font-medium text-gray-700">Review:</span>
              {{ application.review_remark }}
            </p>
            <p v-if="application.endorsement_remark" class="text-sm text-gray-600 italic">
              <span class="font-medium text-gray-700">Endorsement:</span>
              {{ application.endorsement_remark }}
            </p>
          </div>
        </div>
      </transition-group>
    </div>

    <!-- Payment Modal -->
    <PaymentModal
      ref="paymentModal"
      :amount="1000"
      serviceCode="100247"
      description="CoGS Application Fee"
      appType="certificate_of_good_standing_fee"
      :applicationId="selectedApplication?.id"
      @payment-completed="handlePaymentCompleted"
      @close="closePaymentModal"
    />
  </div>
</template>

<script setup>
import { ref, h, defineComponent, onMounted, computed } from 'vue'
import apiService from '@/services/services' // Ensure this path is correct
import PageHeader from '@/components/common/MHPC/PageHeader.vue'
import PaymentModal from '@/components/common/PaymentModal.vue' // Ensure this path is correct
import { useAuthStore } from '@/stores/authStore'
import { useToast } from 'vue-toastification'
import {
  User,
  IdCard,
  Phone,
  Mail,
  FileText,
  Target,
  BookOpen,
  CreditCard,
  Info,
  ClipboardList,
  AlertTriangle,
  FileX2,
  Contact,
  Building,
  Activity,
  MessageSquare,
  CheckCircle,
} from 'lucide-vue-next'

const toast = useToast()
const authStore = useAuthStore()

const applications = ref([])
const isLoading = ref(false)
const apiError = ref(false)
const paymentModal = ref(null)
const selectedApplication = ref(null)
const isLoadingPayment = ref(false)

const COGS_PAYMENT_AMOUNT = 1000
const COGS_SERVICE_CODE = '100247'
const COGS_DESCRIPTION = 'CoGS Application Fee'
const COGS_APP_TYPE = 'certificate_of_good_standing_fee'

const filteredApplications = computed(() => {
  if (!authStore.user?.cid) {
    return []
  }
  const userCid = authStore.user.cid
  return applications.value
    .filter((app) => app.cid_no === userCid)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
})

const fetchApplications = async () => {
  /* ... Sames as before ... */
  isLoading.value = true
  apiError.value = false
  try {
    const response = await apiService.getMhpcCogs({ limit: 1000 })
    if (response.data && Array.isArray(response.data.results)) {
      applications.value = response.data.results
    } else {
      console.error('API did not return an array in results:', response.data)
      applications.value = []
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

const StatusBadge = defineComponent({
  /* ... Sames as before ... */ props: { status: String },
  render() {
    const statusClasses = {
      Pending: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
      Approved: 'bg-green-100 text-green-800 border border-green-200',
      Rejected: 'bg-red-100 text-red-800 border border-red-200',
      'Payment Pending': 'bg-blue-100 text-blue-800 border border-blue-200',
    }
    const currentStatus = this.status || 'Pending'
    return h(
      'span',
      {
        class: `inline-flex items-center px-3 py-1 rounded-full text-xs font-medium capitalize shadow-sm ${
          statusClasses[currentStatus] || 'bg-gray-100 text-gray-800 border border-gray-200'
        }`,
      },
      currentStatus
    )
  },
})

const DetailRow = defineComponent({
  /* ... Sames as before ... */
  props: { label: String, value: [String, Number], icon: { type: String, default: 'Info' } },
  render() {
    const icons = {
      User,
      IdCard,
      Phone,
      Mail,
      FileText,
      Target,
      BookOpen,
      CreditCard,
      Info,
      Contact,
      Building,
      Activity,
    }
    const IconComponent = icons[this.icon] || icons['Info']
    return h('div', { class: 'flex items-start space-x-2.5' }, [
      h(IconComponent, { class: 'w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5' }),
      h('div', [
        h('p', { class: 'text-xs text-gray-500' }, this.label),
        h('p', { class: 'text-sm text-gray-800 font-medium break-words' }, this.value || 'N/A'),
      ]),
    ])
  },
})

const formatDate = (dateString) => {
  /* ... Sames as before ... */
  if (!dateString) return 'N/A'
  try {
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(new Date(dateString))
  } catch (e) {
    console.error('Error formatting date:', dateString, e)
    return 'Invalid Date'
  }
}

const initiatePayment = (application) => {
  if (!application) return
  selectedApplication.value = application
  if (paymentModal.value) {
    paymentModal.value.openModal()
  } else {
    console.error('Payment modal reference is not available.')
    toast.error('Could not open payment details. Please refresh.')
  }
}

const closePaymentModal = () => {
  selectedApplication.value = null
  if (isLoadingPayment.value) {
    isLoadingPayment.value = false
  }
}

const executeMakePayment = async (clientSidePaymentRef, user, application) => {
  const paymentInitiationFormData = new FormData()
  paymentInitiationFormData.append('refNo', clientSidePaymentRef)
  paymentInitiationFormData.append('serviceCode', COGS_SERVICE_CODE)
  paymentInitiationFormData.append('taxPayerName', user.cid)
  paymentInitiationFormData.append('taxPayerNo', user.cid)
  paymentInitiationFormData.append('taxPayerDocumentNo', user.cid)
  paymentInitiationFormData.append('totalPayableAmount', COGS_PAYMENT_AMOUNT.toString())
  paymentInitiationFormData.append('description', COGS_DESCRIPTION)
  paymentInitiationFormData.append('mobileNo', user.contact_number)
  paymentInitiationFormData.append('payerEmail', user.email)
  paymentInitiationFormData.append('user', user.id.toString())
  paymentInitiationFormData.append('payableAmount', COGS_PAYMENT_AMOUNT.toString())
  paymentInitiationFormData.append('application_no', application.id.toString())
  paymentInitiationFormData.append('app_type', COGS_APP_TYPE)

  try {
    const makePaymentFullApiResponse = await apiService.makePayment(paymentInitiationFormData)

    // CHANGE HERE: Access the data payload correctly
    const responseData = makePaymentFullApiResponse.data // Assuming Axios response

    if (!responseData || !responseData.content || !responseData.content.refNo) {
      console.error(
        'makePayment API response is missing expected content or refNo in responseData:',
        responseData,
        'Full response:',
        makePaymentFullApiResponse
      )
      toast.error(
        'Failed to get a confirmed payment reference from the server during payment submission.'
      )
      return null
    }
    toast.info(
      `Payment details submitted to gateway (Client Ref: ${clientSidePaymentRef.substring(
        0,
        8
      )}). Confirmed Server Ref: ${responseData.content.refNo.substring(0, 8)}.`
    )
    return responseData.content.refNo
  } catch (error) {
    // Log the full error object from Axios if available
    console.error('Error calling makePayment API:', error.response || error.request || error)
    let errorMsg = 'An error occurred while submitting payment details to the gateway.'
    if (error.response?.data?.detail) errorMsg = `Gateway API Error: ${error.response.data.detail}`
    else if (typeof error.response?.data === 'string')
      errorMsg = `Gateway API Error: ${error.response.data}`
    else if (error.response?.data?.message)
      errorMsg = `Gateway API Error: ${error.response.data.message}` // Check for message property too
    toast.error(errorMsg)
    return null
  }
}

const updateCogsApplicationWithPayment = async (applicationId, confirmedPaymentServerRefNo) => {
  const updateApplicationData = new FormData()
  updateApplicationData.append('payment_id', confirmedPaymentServerRefNo)
  updateApplicationData.append('is_payment_complete', 'false')

  try {
    await apiService.patchMhpcCogs(applicationId, updateApplicationData)
    return true
  } catch (error) {
    console.error('Error calling patchMhpcCogs API:', error.response || error.request || error)
    let errorMsg = 'An error occurred while updating the application status after payment.'
    if (error.response?.data?.detail) errorMsg = `Update API Error: ${error.response.data.detail}`
    else if (typeof error.response?.data === 'string')
      errorMsg = `Update API Error: ${error.response.data}`
    else if (error.response?.data?.message)
      errorMsg = `Update API Error: ${error.response.data.message}`
    toast.error(errorMsg)
    return false
  }
}

const handlePaymentCompleted = async (paymentData) => {
  // Store application details before it might be nulled
  const currentApplicationForProcessing = selectedApplication.value
  const applicationRegNo = currentApplicationForProcessing?.registration_no // Safely access
  const applicationId = currentApplicationForProcessing?.id

  if (!currentApplicationForProcessing) {
    toast.error('No application selected for payment update. Please try again.')
    return
  }

  if (!paymentData || !paymentData.paymentHash) {
    toast.error('Payment reference (paymentHash) not found from modal. Cannot update status.')
    return
  }

  const user = authStore.user
  if (!user || !user.contact_number || !user.email || !user.cid || !user.id) {
    toast.error('User information is incomplete. Please update your profile and try again.')
    return
  }

  isLoadingPayment.value = true
  const clientSidePaymentRef = paymentData.paymentHash

  try {
    const confirmedServerRefNo = await executeMakePayment(
      clientSidePaymentRef,
      user,
      currentApplicationForProcessing
    )

    if (confirmedServerRefNo) {
      toast.info(
        `Attempting to update application #${
          applicationRegNo || 'N/A'
        } with payment ref ${confirmedServerRefNo.substring(0, 8)}...`
      )
      const updateSuccess = await updateCogsApplicationWithPayment(
        applicationId,
        confirmedServerRefNo
      )

      if (updateSuccess) {
        toast.success(
          `Payment for Application #${
            applicationRegNo || 'N/A'
          } (Ref: ${confirmedServerRefNo.substring(0, 8)}) successful and status updated!`
        )
        await fetchApplications()
      } else {
        toast.warning(
          `Application #${
            applicationRegNo || 'N/A'
          } status might not be updated. Please check or contact support with payment ref ${confirmedServerRefNo.substring(
            0,
            8
          )}.`
        )
      }
    } else {
      toast.error(
        `Payment processing failed for Application #${
          applicationRegNo || 'N/A'
        }. Application status not updated. Initial Ref: ${clientSidePaymentRef.substring(0, 8)}.`
      )
    }
  } catch (error) {
    console.error('Unexpected error in handlePaymentCompleted orchestration:', error)
    toast.error(
      `An unexpected error occurred during the payment process for Application #${
        applicationRegNo || 'N/A'
      }. Please try again.`
    )
  } finally {
    isLoadingPayment.value = false
    selectedApplication.value = null // Clear selected application
  }
}

onMounted(() => {
  fetchApplications()
})
</script>

<style scoped>
/* Reusable button styles (similar to previous example) */
.btn {
  @apply inline-flex justify-center items-center rounded-md border border-transparent shadow-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-150 ease-in-out;
}
.btn-success {
  @apply bg-green-600 text-white hover:bg-green-700 focus:ring-green-500;
}

/* Style for detail headings */
.detail-heading {
  @apply text-base font-semibold text-gray-800 pb-2 flex items-center border-b border-gray-100 mb-3;
}

/* List Transition Animations (same as first example) */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
