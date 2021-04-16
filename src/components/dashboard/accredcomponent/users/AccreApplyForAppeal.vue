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
              </p>
            </div>

            <div class="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div v-for="(value, key) in autoFilledDetails" :key="key">
                <label class="block text-sm font-medium text-gray-700">{{ key }}</label>
                <input
                  type="text"
                  v-model="autoFilledDetails[key]"
                  readonly
                  class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 bg-gray-50"
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
                  class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
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
                  class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
                />
              </div>

              <div class="mb-4">
                <label class="block text-sm font-medium text-gray-700">Reason of Appeal</label>
                <textarea
                  v-model="appeal.reason"
                  rows="3"
                  class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
                ></textarea>
              </div>

              <div class="mb-4">
                <label class="inline-flex items-center">
                  <input
                    type="checkbox"
                    v-model="appeal.attemptedToResolve"
                    class="rounded border-gray-300 text-blue-600 shadow-sm focus:ring-blue-500"
                  />
                  <span class="ml-2 text-gray-700">Attempted to Resolve with HEQC</span>
                </label>
              </div>

              <div v-if="appeal.attemptedToResolve" class="mb-4">
                <label class="block text-sm font-medium text-gray-700">Outcome (if yes)</label>
                <input
                  type="text"
                  v-model="appeal.outcome"
                  class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">Supporting Documents</label>
                <input
                  type="file"
                  multiple
                  @change="onFileChange"
                  class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
                <ul class="mt-2 list-disc list-inside">
                  <li
                    v-for="(file, index) in appeal.supportingDocuments"
                    :key="index"
                    class="text-gray-600 text-sm"
                  >
                    {{ file.name }}
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Declaration -->
          <div class="mb-6">
            <label class="inline-flex items-center">
              <input
                type="checkbox"
                v-model="appeal.declaration"
                class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                required
              />
              <span class="ml-2 text-gray-700"
                >I hereby declare that the information provided is true and accurate to the best of
                my knowledge.</span
              >
            </label>
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-end space-x-4 mt-8 pt-6 border-t p-8">
            <button
              type="button"
              @click="saveDraft"
              class="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              Save as Draft
            </button>
            <!-- <button type="submit"
              class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
              Submit Appeal
            </button> -->
            <button
              type="button"
              @click="openPaymentModal"
              :disabled="!appeal.declaration || isSubmitting"
              class="px-6 py-3 bg-primary text-white rounded-md hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ isSubmitting ? 'Submitting...' : 'Submit' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import apiService from '@/services/services'
import { useToast } from 'vue-toastification'
import PaymentModal from '@/components/common/PaymentModal.vue'
import { useAuthStore } from '@/stores/authStore'
import { useRoute } from 'vue-router' // Import useRoute

const autoFilledDetails = reactive({
  'Name of Institution': '',
  'Address/Location': '',
  'Dzongkhag/Thromde': '',
  Contact: '',
  Email: '',
})

const appeal = reactive({
  reasonType: null,
  reasonOther: '',
  reason: '',
  attemptedToResolve: false,
  outcome: '',
  supportingDocuments: [],
  remarks: '',
  declaration: false,
  is_payment_complete: false,
  payment_id: null,
  status: 'applied',
})

const appealReason = ref([])
const toast = useToast()
const isSubmitting = ref(false)
const authStore = useAuthStore()
const route = useRoute() // Use useRoute

const onFileChange = (event) => {
  appeal.supportingDocuments = Array.from(event.target.files)
}

const saveDraft = async () => {
  appeal.status = 'draft'
  submitAppealActual()
}

const paymentModal = ref(null)

const openPaymentModal = () => {
  paymentModal.value.openModal()
}

const onPaymentModalClose = () => {
  console.log('Payment modal closed')
}

const onPaymentCompleted = (paymentData) => {
  appeal.is_payment_complete = true
  appeal.payment_id = paymentData.paymentHash
  appeal.status = 'processing_payment'
  submitAppealActual()
}

const handleSubmit = () => {
  if (appeal.declaration) {
    openPaymentModal()
  } else {
    toast.error('Please accept the declaration')
  }
}

const submitAppealActual = async () => {
  isSubmitting.value = true
  try {
    const formData = new FormData()
    for (const key in appeal) {
      if (Object.prototype.hasOwnProperty.call(appeal, key)) {
        let value = appeal[key]

        if (key === 'supportingDocuments') {
          value.forEach((file) => {
            formData.append('supporting_documents', file)
          })
        } else if (typeof value === 'boolean') {
          formData.append(key, value.toString())
        } else if (value !== null && value !== undefined) {
          formData.append(key.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase(), value)
        }
      }
    }

    if (appeal.status === 'draft' || appeal.is_payment_complete) {
      if (appeal.status !== 'draft') {
        const paymentData = {
          platform: 'BQPCA e-Zhapto',
          refNo: appeal.payment_id,
          taxPayerNo: autoFilledDetails['Contact'],
          taxPayerDocumentNo: autoFilledDetails['Contact'],
          payerEmail: autoFilledDetails['Email'],
          mobileNo: autoFilledDetails['Contact'],
          totalPayableAmount: 1000.0,
          serviceCode: '100195',
          description: 'Payment for Accreditation Appeal Application',
          payableAmount: 1000.0,
          taxPayerName: autoFilledDetails['Name of Institution'],
          application_no: appeal.payment_id,
          app_type: 'Accreditation Appeal',
          user_id: authStore.userId,
        }
        try {
          const paymentResponse = await apiService.makePayment(paymentData)
          console.log('Payment Response:', paymentResponse)

          if (paymentResponse.status !== 201 && paymentResponse.status !== 200) {
            throw new Error('Payment request failed')
          }
        } catch (paymentError) {
          console.error('Error making payment:', paymentError)
          toast.error(
            'Payment request failed: ' +
              (paymentError.response?.data?.message || paymentError.message),
          )
          isSubmitting.value = false
          return
        }
      }

      const appealResponse = await apiService.createProfileAppeal(formData)
      console.log('Appeal Response:', appealResponse)
      if (appeal.status === 'draft') {
        toast.success('Appeal saved as draft')
      } else {
        toast.success(
          'Appeal submitted successfully! Please check your email to complete the payment',
        )
      }
    } else {
      toast.error('Payment is not complete. Cannot submit Appeal.')
    }
  } catch (error) {
    console.error('Error submitting appeal:', error)
    const errorMessage = error.response?.data?.message || error.message || 'Unknown error'
    toast.error(`Failed to submit appeal: ${errorMessage}`)
  } finally {
    isSubmitting.value = false
  }
}

const fetchAppealReason = async () => {
  try {
    const response = await apiService.getMastersAppealReasons()
    console.log('Appeal Reasons Response:', response)

    if (response.status === 200) {
      if (response.data && response.data.results) {
        appealReason.value = response.data.results.map((reason) => ({
          text: reason.appeal_name, // Use 'appeal_name' for text
          value: reason.id, // Use 'id' for value
        }))
      } else {
        console.error("API response data is missing 'results' array:", response.data)
        toast.error("Error fetching appeal reasons: Data format incorrect (missing 'results').")
      }
    } else {
      console.error('API request failed with status:', response.status, response)
      toast.error(`Failed to fetch appeal reasons. Status: ${response.status}`)
    }
  } catch (error) {
    console.error('Error fetching appeal reasons:', error)
    toast.error(`Failed to fetch appeal reasons. Please check the console for details.`)
  }
}

// const fetchInstitutionProfile = async () => { // Removed fetchInstitutionProfile
//   try {
//     const response = await apiService.getProfileAppeals();
//     const profiles = response.data;

//     if (profiles && profiles.length > 0) {
//       const profileData = profiles[0];
//       autoFilledDetails['Name of Institution'] = profileData.institution_name || '';
//       autoFilledDetails['Address/Location'] = profileData.address || '';
//       autoFilledDetails['Dzongkhag/Thromde'] = profileData.dzongkhag || '';
//       autoFilledDetails['Contact'] = profileData.contact_number || '';
//       autoFilledDetails['Email'] = profileData.email || '';
//     } else {
//       console.warn('No institution profiles found.');
//     }

//   } catch (error) {
//     console.error('Error fetching institution profile:', error);
//     toast.error("Failed to fetch institution profile.");
//   }
// };

onMounted(() => {
  fetchAppealReason()
  // fetchInstitutionProfile(); //removed and replaced with below

  // Populate autoFilledDetails directly from route.query
  autoFilledDetails['Name of Institution'] = route.query.institutionName || ''
  autoFilledDetails['Address/Location'] = route.query.address || ''
  autoFilledDetails['Dzongkhag/Thromde'] = route.query.dzongkhagThromde || ''
  autoFilledDetails['Contact'] = route.query.contact || ''
  autoFilledDetails['Email'] = route.query.email || ''
})
</script>

<style scoped>
/* Your component-specific styles here if needed */
.bg-primary {
  background-color: #3b82f6;
  /* Example primary color - blue-500 from Tailwind */
}

.bg-secondary {
  background-color: #2563eb;
  /* Example secondary color - blue-700 from Tailwind */
}
</style>
