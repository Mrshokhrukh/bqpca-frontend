<template>
  <div class="w-full mx-auto px-4 py-8">
    <!-- Header Section -->
    <div class="bg-gradient-to-r from-indigo-100 via-blue-50 to-indigo-100 rounded-xl p-8 mb-10">
      <h2 class="text-3xl font-bold text-gray-900 mb-3 text-center">Track Your Application</h2>
      <p class="text-gray-600 text-center max-w-2xl mx-auto">Your CoGS application status.</p>
    </div>

    <div class="w-full mx-auto px-4 py-8">
      <!-- Results Section -->
      <div v-if="filteredApplications.length > 0" class="space-y-6">
        <div
          v-for="application in filteredApplications"
          :key="application.id"
          class="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
        >
          <!-- Header with Registration Number and Status -->
          <div
            class="bg-gradient-to-r from-indigo-100 via-blue-50 to-indigo-100 p-6 flex items-center justify-between"
          >
            <div>
              <h3 class="text-xl font-bold text-gray-900 flex items-center">
                <span>Application #{{ application.registration_no }}</span>
                <status-badge :status="application.review_status" class="ml-3" />
              </h3>
              <p class="text-sm text-gray-600 mt-1">
                Submitted on {{ formatDate(application.created_at) }}
              </p>
            </div>

            <!-- Action Buttons -->
            <div class="flex space-x-3">
              <!-- Payment Button -->
              <button
                v-if="application.review_status === 'Approved' && !application.is_payment_complete"
                @click="initiatePayment(application)"
                class="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center"
              >
                <CreditCard class="w-4 h-4 mr-2" />
                {{ getPaymentButtonText(application) }}
              </button>
            </div>
          </div>

          <!-- Application Details Grid -->
          <div class="grid md:grid-cols-3 gap-6 p-6 bg-white">
            <!-- Personal Information Column -->
            <div>
              <h4 class="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
                Personal Information
              </h4>
              <div class="space-y-3">
                <detail-row icon="User" label="Full Name" :value="application.full_name" />
                <detail-row icon="IdCard" label="CID Number" :value="application.cid_no" />
                <detail-row icon="Target" label="Gender" :value="application.gender" />
              </div>
            </div>

            <!-- Contact Information Column -->
            <div>
              <h4 class="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
                Contact Details
              </h4>
              <div class="space-y-3">
                <detail-row
                  icon="Phone"
                  label="Contact Number"
                  :value="application.contact_number"
                />
                <detail-row icon="Mail" label="Email" :value="application.email_address" />
                <detail-row
                  icon="BookOpen"
                  label="Workplace"
                  :value="application.workplace || 'Not Specified'"
                />
              </div>
            </div>

            <!-- Application Status Column -->
            <div>
              <h4 class="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
                Application Status
              </h4>
              <div class="space-y-3">
                <detail-row
                  icon="FileText"
                  label="Review Status"
                  :value="application.review_status"
                />
                <detail-row
                  icon="Target"
                  label="Endorsement"
                  :value="application.endorsement_decision"
                />
                <detail-row
                  icon="CreditCard"
                  label="Payment"
                  :value="application.is_payment_complete ? 'Completed' : 'Pending'"
                />
              </div>
            </div>
          </div>

          <!-- Additional Details and Remarks -->
          <div v-if="application.review_remark" class="bg-gray-50 p-6 border-t">
            <h4 class="text-lg font-semibold text-gray-800 mb-3">Review Remarks</h4>
            <p class="text-gray-600 italic">{{ application.review_remark }}</p>
          </div>
        </div>
      </div>

      <!-- No Results Message -->
      <div
        v-if="filteredApplications.length === 0 && !isLoading && !apiError"
        class="text-center py-12 bg-gray-50 rounded-xl border border-gray-200"
      >
        <p class="text-gray-600">No CoGS records found for your account.</p>
      </div>
      <!-- API Error Message (Optional) -->
      <div
        v-else-if="apiError"
        class="text-center py-12 bg-red-50 rounded-xl border border-red-200"
      >
        <p class="text-red-600">An error occurred while fetching data. Please try again later.</p>
      </div>
      <!-- Loading Indicator -->
      <div v-if="isLoading" class="mt-4 flex justify-center">
        <div class="flex items-center space-x-2 text-sm text-gray-500">
          <span class="inline-block w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
          <span
            class="inline-block w-2 h-2 bg-blue-600 rounded-full animate-pulse delay-100"
          ></span>
          <span
            class="inline-block w-2 h-2 bg-blue-600 rounded-full animate-pulse delay-200"
          ></span>
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
} from 'lucide-vue-next'
import { useAuthStore } from '@/stores/authStore' // Import Auth Store
import PaymentModal from '@/components/common/PaymentModal.vue' // Import PaymentModal
import { useToast } from 'vue-toastification'

const toast = useToast()

// State
const applications = ref([])
const isLoading = ref(false)
const apiError = ref(false)
const authStore = useAuthStore() // Use the auth store
const paymentModal = ref(null)
const selectedApplication = ref(null) // Track the application for payment

// Computed Property for filtered applications
const filteredApplications = computed(() => {
  if (!authStore.user || !authStore.user.cid) {
    return [] // Return empty if user or cid is not available
  }

  return applications.value.filter((app) => app.cid_no === authStore.user.cid)
})

// Methods
const fetchApplications = async () => {
  isLoading.value = true
  apiError.value = false

  try {
    const response = await apiService.getEpcCogs()
    // Access the 'results' property of the response data.
    if (Array.isArray(response.data.results)) {
      applications.value = response.data.results
    } else {
      applications.value = []
      console.error('API did not return an array in results:', response.data)
      apiError.value = true // Set apiError if the results are not as expected
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
  props: {
    status: String,
  },
  render() {
    const statusClasses = {
      Pending: 'bg-yellow-100 text-yellow-800',
      Approved: 'bg-green-100 text-green-800',
      Rejected: 'bg-red-100 text-red-800',
    }

    return h(
      'span',
      {
        class: `px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider ${
          statusClasses[this.status] || ''
        }`,
      },
      this.status,
    )
  },
})

// Detail Row Component
const DetailRow = defineComponent({
  props: {
    icon: String,
    label: String,
    value: String,
  },
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
    }

    const IconComponent = icons[this.icon]

    return h('div', { class: 'flex items-center space-x-3' }, [
      h(IconComponent, { class: 'w-5 h-5 text-blue-500' }),
      h('div', [
        h('p', { class: 'text-xs text-gray-500' }, this.label),
        h('p', { class: 'text-sm text-gray-800 font-medium' }, this.value),
      ]),
    ])
  },
})

// Helper function to format date
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const getPaymentButtonText = (application) => {
  if (application.is_payment_complete) {
    return 'Payment Completed'
  } else if (application.review_status === 'Approved' && !application.is_payment_complete) {
    return 'Proceed to Payment'
  } else {
    return 'Complete Payment'
  }
}

const initiatePayment = (application) => {
  selectedApplication.value = application
  paymentModal.value.openModal()
}

const closePaymentModal = () => {
  selectedApplication.value = null // Reset on close
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

    // 1. Initiate Payment (Actual payment processing) - Using FormData, as in your example
    const paymentInitiationFormData = new FormData()
    paymentInitiationFormData.append('refNo', paymentId) // Use paymentId from paymentData
    paymentInitiationFormData.append('serviceCode', 'cogs_application_fee') // Correct service code
    paymentInitiationFormData.append('taxPayerName', user.cid) // Or user.full_name if appropriate
    paymentInitiationFormData.append('taxPayerNo', user.cid)
    paymentInitiationFormData.append('taxPayerDocumentNo', user.cid)
    paymentInitiationFormData.append('totalPayableAmount', 500) // Correct amount
    paymentInitiationFormData.append('description', 'CoGS Application Fee') // Correct Description
    paymentInitiationFormData.append('mobileNo', user.contact_number)
    paymentInitiationFormData.append('payerEmail', user.email)
    paymentInitiationFormData.append('user', user.id)
    paymentInitiationFormData.append('payableAmount', 500) // Correct amount
    paymentInitiationFormData.append('application_no', selectedApplication.value.id)
    paymentInitiationFormData.append('app_type', 'certificate_of_good_standing_fee') // Correct app_type

    // Make the payment *before* updating the application
    await apiService.makePayment(paymentInitiationFormData)

    // 2. Update Application - PATCH request with FormData
    const updateFormData = new FormData()
    updateFormData.append('is_payment_complete', 'true') // Use string 'true'
    updateFormData.append('payment_id', paymentId)

    //PATCH COGS application
    await apiService.patchMhpcCogs(applicationId, updateFormData)

    // 3.  Update local state to reflect changes
    const updatedApplicationIndex = applications.value.findIndex((app) => app.id === applicationId)
    if (updatedApplicationIndex !== -1) {
      applications.value[updatedApplicationIndex].is_payment_complete = true
      applications.value[updatedApplicationIndex].payment_id = paymentId
    }

    toast.success(`Payment initiated! ID: ${paymentId}. ${paymentData.message}`)
  } catch (error) {
    console.error('Payment update error:', error)
    // Error handling (as in your provided code)
    if (error.response) {
      if (error.response.data) {
        if (error.response.data.detail) {
          toast.error('API Error: ' + error.response.data.detail)
        } else {
          toast.error('API Error: ' + JSON.stringify(error.response.data))
        }
      } else {
        toast.error('API Error: ' + error.response.statusText)
      }
    } else if (error.request) {
      toast.error('Network Error: No response from server')
    } else {
      toast.error(
        'Payment request generated successfully, but there was an error confirming the payment.  Contact us with the payment id for the next course of action: ' +
          paymentId,
      )
    }
  } finally {
    isLoading.value = false
    selectedApplication.value = null // Reset after processing
    fetchApplications()
  }
}

onMounted(async () => {
  await fetchApplications()
})
</script>
