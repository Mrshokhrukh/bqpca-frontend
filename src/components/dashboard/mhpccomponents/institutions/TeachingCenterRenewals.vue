<!-- TeachingCenterTracker.vue -->
<template>
  <div class="w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-gray-50 min-h-screen">
    <InstituteHeader
      title="Teaching Center Tracker & Renewal"
      subtitle="Track and renew your teaching center registrations"
      :show-actions="false"
    />

    <div
      v-if="!authStore.user || !authStore.user.cid"
      class="mt-8 text-center py-16 bg-white rounded-2xl border border-gray-200 shadow-sm"
    >
      <svg
        class="mx-auto h-12 w-12 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <h3 class="mt-2 text-lg font-medium text-gray-900">Waiting for User Information</h3>
      <p class="mt-1 text-sm text-gray-500">
        User profile is loading or essential information (like CID) is not yet available.
      </p>
      <div
        v-if="initialAuthCheckPending"
        class="flex items-center justify-center mt-4 text-indigo-600"
      >
        <Loader class="animate-spin h-5 w-5 mr-2" />
        <span>Checking authentication status...</span>
      </div>
    </div>

    <template v-else>
      <div v-if="isLoading" class="flex flex-col items-center justify-center min-h-[400px] mt-8">
        <Loader class="animate-spin text-indigo-600 w-10 h-10" />
        <p class="mt-4 text-lg font-medium text-gray-700">Loading teaching center data...</p>
      </div>

      <div
        v-else-if="apiError"
        class="mt-8 text-center py-16 bg-red-50 rounded-2xl border border-red-200 shadow-sm"
      >
        <p class="text-red-700 text-lg font-medium">{{ errorMessage }}</p>
        <p class="text-red-600 text-sm mt-2">Please try refreshing the page or contact support.</p>
        <button
          @click="fetchData"
          class="mt-6 btn btn-outline border-red-300 text-red-700 hover:bg-red-100 focus:ring-red-500"
        >
          Try Again
        </button>
      </div>

      <div
        v-else-if="!instituteTeachingCenters.length"
        class="mt-8 text-center py-16 bg-white rounded-2xl border border-gray-200 shadow-sm"
      >
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
        <h3 class="mt-2 text-lg font-medium text-gray-900">No Teaching Centers Found</h3>
        <p class="mt-1 text-sm text-gray-500">
          No teaching centers associated with your institute are currently registered.
        </p>
      </div>

      <div v-else class="space-y-8 mt-8">
        <div
          v-for="center in instituteTeachingCenters"
          :key="center.id"
          class="bg-white rounded-2xl shadow-md hover:shadow-lg border border-gray-200 overflow-hidden transition-all duration-300"
        >
          <div class="p-6 md:p-8">
            <div class="flex items-start justify-between flex-wrap gap-4 mb-6">
              <div>
                <h3 class="text-xl font-bold text-gray-900 mb-1">
                  {{ center.center_name }}
                </h3>
                <p class="text-sm text-gray-500 flex items-center space-x-2 flex-wrap">
                  <span :class="getStatusTextClass(center)">{{ getStatusText(center) }}</span>
                  <span class="text-gray-300">•</span>
                  <span
                    :class="[
                      'px-2.5 py-0.5 text-xs font-medium rounded-full',
                      center.has_active_capa
                        ? 'bg-red-100 text-red-800'
                        : 'bg-green-100 text-green-800',
                    ]"
                  >
                    {{ center.has_active_capa ? 'CAPA Pending' : 'No Active CAPAs' }}
                  </span>
                  <span class="text-gray-300">•</span>
                  <span
                    :class="[
                      'px-2.5 py-0.5 text-xs font-medium rounded-full whitespace-nowrap',
                      getReviewDecisionClass(
                        center.tc_review_decision_display || center.tc_review_decision,
                        'badge',
                        center.is_active,
                      ),
                    ]"
                  >
                    {{ center.tc_review_decision_display || center.tc_review_decision || 'N/A' }}
                  </span>
                </p>
              </div>
              <div class="text-right text-sm">
                <p class="text-gray-500">Center ID</p>
                <p class="font-medium text-gray-800">{{ center.id }}</p>
              </div>
            </div>

            <div
              v-if="center.has_active_capa"
              class="mb-6 p-4 rounded-lg flex items-start bg-red-100 text-red-800 border border-red-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6 flex-shrink-0 mt-0.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
              <div class="ml-3">
                <h3 class="text-sm font-semibold">Renewal Blocked: CAPA Pending</h3>
                <p class="mt-1 text-xs">
                  This teaching center cannot be renewed because there is an open Corrective and
                  Preventive Action (CAPA) request. Please resolve all pending CAPAs before
                  proceeding with the renewal.
                </p>
                <!-- Optional: Add a button to view CAPAs if you have that page -->
                <!-- <button class="mt-2 btn btn-outline btn-sm border-red-300 text-red-700 hover:bg-red-200">
                  View CAPA Details
                </button> -->
              </div>
            </div>

            <div
              v-if="
                !center.has_active_capa &&
                center.is_active &&
                center.valid_till &&
                getDaysUntilExpiration(center) <= 90
              "
              class="mb-6 p-4 rounded-lg flex items-start"
              :class="[
                getDaysUntilExpiration(center) <= 0
                  ? 'bg-red-50 text-red-700 border border-red-200'
                  : getDaysUntilExpiration(center) <= 30
                    ? 'bg-orange-50 text-orange-700 border border-orange-200'
                    : 'bg-yellow-50 text-yellow-700 border border-yellow-200',
              ]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 flex-shrink-0 mt-0.5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clip-rule="evenodd"
                />
              </svg>
              <div class="ml-3">
                <h3 class="text-sm font-semibold">
                  {{
                    getDaysUntilExpiration(center) <= 0
                      ? 'Registration Expired!'
                      : getDaysUntilExpiration(center) <= 30
                        ? 'Registration Expiring Soon!'
                        : 'Registration Renewal Recommended'
                  }}
                </h3>
                <p class="mt-1 text-xs">
                  {{
                    getDaysUntilExpiration(center) <= 0
                      ? 'Your teaching center registration has expired. Please renew immediately.'
                      : `Expires in ${getDaysUntilExpiration(center)} days (${formatDate(
                          center.valid_till,
                        )}). Please renew to maintain status.`
                  }}
                </p>
              </div>
            </div>

            <div
              v-if="isPaymentRequired(center)"
              class="mb-6 p-4 rounded-lg flex items-start bg-yellow-50 text-yellow-800 border border-yellow-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5 flex-shrink-0 mt-0.5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clip-rule="evenodd"
                />
              </svg>
              <div class="ml-3">
                <h3 class="text-sm font-semibold">Payment Required</h3>
                <p class="mt-1 text-xs">
                  Your application or renewal has been approved. Please complete the payment to
                  activate your registration.
                </p>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-6">
              <div class="space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
                <h4 class="text-sm font-semibold text-gray-700 mb-2">Registration Details</h4>
                <InfoItem
                  label="Status"
                  :value="
                    center.is_active
                      ? 'Active'
                      : center.tc_review_decision === 'Approved'
                        ? 'Approved (Inactive)'
                        : 'Pending/Inactive'
                  "
                  :valueClass="
                    center.is_active
                      ? 'text-green-600'
                      : center.tc_review_decision === 'Approved'
                        ? 'text-blue-600'
                        : 'text-yellow-600'
                  "
                />
                <InfoItem label="Valid From" :value="formatDate(center.valid_since)" />
                <InfoItem
                  label="Valid Until"
                  :value="formatDate(center.valid_till)"
                  :valueClass="getExpirationTextClass(center)"
                />
                <InfoItem
                  label="Review Decision"
                  :value="center.tc_review_decision_display || center.tc_review_decision || 'N/A'"
                  :valueClass="
                    getReviewDecisionClass(
                      center.tc_review_decision_display || center.tc_review_decision,
                      'text',
                      center.is_active,
                    )
                  "
                />
                <InfoItem
                  label="Payment Status"
                  :value="getPaymentStatusText(center)"
                  :valueClass="getPaymentStatusTextClass(center)"
                />
              </div>

              <div class="space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-100">
                <h4 class="text-sm font-semibold text-gray-700 mb-2">Center Information</h4>
                <InfoItem
                  label="Institute"
                  :value="center.institute_details?.name_of_institution || 'N/A'"
                />
                <InfoItem
                  label="Location"
                  :value="`${center.center_location || 'N/A'}, ${center.state_dzongkhag || 'N/A'}`"
                />
                <InfoItem label="City/Gewog" :value="center.city_gewog || 'N/A'" />
                <InfoItem label="Target Category" :value="center.target_category || 'N/A'" />
              </div>
            </div>

            <div class="mt-6 pt-6 border-t border-gray-100">
              <div
                v-if="isRenewalInProgress(center)"
                class="p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-sm"
              >
                <h4 class="font-semibold">Renewal In Progress</h4>
                <p class="mt-1">
                  Your renewal application is under review. You will be notified upon completion.
                </p>
              </div>
              <div
                v-else-if="
                  !center.has_active_capa &&
                  !center.is_active &&
                  center.tc_review_decision === 'Pending'
                "
                class="p-4 bg-orange-50 border border-orange-200 rounded-lg text-orange-700 text-sm"
              >
                <h4 class="font-semibold">Application In Progress</h4>
                <p class="mt-1">
                  Your application is under review. You will be notified upon completion.
                </p>
              </div>
              <div
                v-else-if="center.tc_review_decision === 'Rejected' && center.tc_reason_if_rejected"
                class="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
              >
                <h4 class="font-semibold">Application Rejected</h4>
                <p class="mt-1">Reason: {{ center.tc_reason_if_rejected }}</p>
                <button
                  @click="openRenewalDialog(center)"
                  class="mt-3 btn btn-primary bg-red-600 hover:bg-red-700 focus:ring-red-500 text-xs"
                >
                  Re-apply / Renew
                </button>
              </div>
              <div
                v-else-if="
                  !center.has_active_capa &&
                  center.is_active &&
                  getDaysUntilExpiration(center) > 90
                "
                class="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm"
              >
                <h4 class="font-semibold">Sufficient time for renewal</h4>
                <p class="mt-1">
                  Your registration is valid until {{ formatDate(center.valid_till) }}. There is no
                  need to renew at this time.
                </p>
              </div>

              <div class="flex justify-end items-center space-x-3 mt-4">
                <button
                  v-if="isPaymentRequired(center)"
                  @click="initiatePayment(center)"
                  class="btn btn-primary bg-yellow-500 hover:bg-yellow-600 focus:ring-yellow-500"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"
                    />
                  </svg>
                  Make Payment to Activate
                </button>

                <button
                  v-if="center.tc_review_decision === 'Approved' && !isPaymentRequired(center)"
                  @click="openCertificateDialog(center)"
                  class="btn btn-outline"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  View Certificate
                </button>

                <button
                  v-if="canRenew(center)"
                  @click="openRenewalDialog(center)"
                  class="btn btn-primary"
                  :class="{
                    'animate-pulse bg-orange-500 hover:bg-orange-600':
                      getDaysUntilExpiration(center) <= 30 && getDaysUntilExpiration(center) > 0,
                    'bg-red-600 hover:bg-red-700': getDaysUntilExpiration(center) <= 0,
                  }"
                >
                  {{ getDaysUntilExpiration(center) <= 0 ? 'Renew Expired' : 'Renew Center' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <div
      v-if="showRenewalDialog"
      class="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 p-4"
    >
      <div
        class="bg-white rounded-xl shadow-xl p-6 md:p-8 m-4 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <h3 class="text-xl font-bold text-gray-900 mb-6">Teaching Center Renewal Application</h3>
        <form @submit.prevent="confirmRenewal" class="space-y-6">
          <div v-if="selectedCenter" class="space-y-4">
            <div class="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p class="text-sm font-medium text-gray-700">
                Center Name:
                <span class="font-normal text-gray-900">{{ selectedCenter.center_name }}</span>
              </p>
              <p class="text-sm font-medium text-gray-700">
                Location:
                <span class="font-normal text-gray-900">{{ selectedCenter.center_location }}</span>
              </p>
            </div>

            <div>
              <label for="attachments" class="form-label">Attachments (Optional)</label>
              <input
                type="file"
                id="attachments"
                @change="handleFileUpload"
                class="form-file-input"
                accept=".pdf,.doc,.docx,.jpg,.png"
              />
              <p v-if="selectedFileName" class="mt-1.5 text-xs text-green-600">
                Selected: {{ selectedFileName }}
              </p>
            </div>

            <div>
              <label for="remarks" class="form-label">Remarks</label>
              <textarea
                id="remarks"
                v-model="renewalFormData.user_remarks"
                rows="3"
                class="form-textarea"
              ></textarea>
            </div>

            <div class="flex items-start">
              <div class="flex items-center h-5">
                <input
                  id="declaration"
                  type="checkbox"
                  v-model="renewalFormData.declaration"
                  required
                  class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                />
              </div>
              <div class="ml-3 text-sm">
                <label for="declaration" class="font-medium text-gray-700 required-label"
                  >Declaration</label
                >
                <p class="text-gray-500 text-xs">
                  I hereby declare that the information provided is true and correct.
                </p>
              </div>
            </div>
          </div>

          <div v-if="isRenewing" class="flex items-center justify-center text-sm text-indigo-600">
            <Loader class="animate-spin h-5 w-5 mr-2" />
            Processing renewal...
          </div>

          <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              @click="closeRenewalDialog"
              class="btn btn-outline"
              :disabled="isRenewing"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="btn btn-primary"
              :disabled="isRenewing || !renewalFormData.declaration"
            >
              Submit Renewal
            </button>
          </div>
        </form>
      </div>
    </div>

    <CertificateDialog
      v-if="showCertificateDialog"
      :show="showCertificateDialog"
      :center-data="selectedCenter"
      :cert-type="'teaching-center'"
      @close="closeCertificateDialog"
    />

    <PaymentModal ref="paymentModalRef" :amount="100" @payment-completed="handlePaymentCompleted" />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useToast } from 'vue-toastification'
import apiServices from '@/services/services'
import { Loader } from 'lucide-vue-next'
import CertificateDialog from './CertificateDialog.vue'
import InstituteHeader from '@/components/common/MHPC/InstituteHeader.vue'
import InfoItem from '@/components/common/MHPC/InfoItem.vue'
import PaymentModal from '@/components/common/PaymentModal.vue'

const instituteTeachingCenters = ref([])
const isLoading = ref(true)
const apiError = ref(false)
const errorMessage = ref('')
const showRenewalDialog = ref(false)
const isRenewing = ref(false)
const selectedCenter = ref(null)
const selectedFile = ref(null)
const selectedFileName = ref('')
const showCertificateDialog = ref(false)
const initialAuthCheckPending = ref(true)
const paymentModalRef = ref(null)

const renewalFormData = ref({
  renewal_document: null,
  user_remarks: '',
  declaration: false,
})

const toast = useToast()
const authStore = useAuthStore()

const fetchData = async () => {
  if (!authStore.user?.cid) {
    isLoading.value = false
    initialAuthCheckPending.value = false
    return
  }

  isLoading.value = true
  apiError.value = false
  initialAuthCheckPending.value = false
  const userCid = authStore.user?.cid
  try {
    const response = await apiServices.getMhpcTeachingCenterByCid(userCid)
    instituteTeachingCenters.value = response.data || []
  } catch (error) {
    console.error('Error fetching teaching centers:', error)
    errorMessage.value =
      error.response?.data?.message || 'Error fetching teaching center data. Please try again.'
    apiError.value = true
  } finally {
    isLoading.value = false
  }
}

watch(
  () => authStore.user,
  (newUser) => {
    initialAuthCheckPending.value = false
    if (newUser?.cid && (!instituteTeachingCenters.value.length || isLoading.value)) {
      if (isLoading.value && instituteTeachingCenters.value.length === 0) {
        fetchData()
      }
    }
  },
  { deep: true, immediate: true },
)

onMounted(async () => {
  if (authStore.user?.cid && instituteTeachingCenters.value.length === 0 && isLoading.value) {
    await fetchData()
  }
  setTimeout(() => {
    if (initialAuthCheckPending.value) {
      initialAuthCheckPending.value = false
      if (!authStore.user?.cid && isLoading.value) {
        isLoading.value = false
      }
    }
  }, 1500)
})

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  try {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  } catch (e) {
    return 'Invalid Date'
  }
}

const getDaysUntilExpiration = (center) => {
  if (!center.valid_till) return 0
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const expirationDate = new Date(center.valid_till)
    expirationDate.setHours(0, 0, 0, 0)
    const timeDiff = expirationDate.getTime() - today.getTime()
    return Math.ceil(timeDiff / (1000 * 3600 * 24))
  } catch (e) {
    return 0
  }
}

const isRenewalInProgress = (center) => {
  return ['PENDING', 'AWAITING_PAYMENT'].includes(center.latest_renewal?.renewal_status)
}

const getExpirationTextClass = (center) => {
  if (!center.valid_till || !center.is_active) return 'text-gray-700'
  const days = getDaysUntilExpiration(center)
  if (days <= 0) return 'text-red-600 font-semibold'
  if (days <= 30) return 'text-orange-600 font-semibold'
  return 'text-gray-700'
}

const getReviewDecisionClass = (decision, type = 'text', isActive = null) => {
  const decisionStr = String(decision).toLowerCase()
  if (decisionStr === 'approved') {
    if (type === 'badge')
      return isActive ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-700'
    return isActive ? 'text-green-600 font-semibold' : 'text-blue-600 font-semibold'
  }
  if (decisionStr.includes('pending')) {
    if (type === 'badge') return 'bg-yellow-100 text-yellow-800'
    return 'text-yellow-600 font-semibold'
  }
  if (decisionStr.includes('regretted')) {
    if (type === 'badge') return 'bg-red-100 text-red-800'
    return 'text-red-600 font-semibold'
  }
  if (type === 'badge') return 'bg-gray-100 text-gray-700'
  return 'text-gray-600'
}

const isPaymentRequired = (center) => {
  const initialPayment = center.payment_status === 'awaiting_payment'
  const renewalPayment = center.latest_renewal?.renewal_status === 'AWAITING_PAYMENT'
  return initialPayment || renewalPayment
}

const getStatusText = (center) => {
  if (isPaymentRequired(center)) {
    if (center.latest_renewal?.renewal_status === 'AWAITING_PAYMENT') {
      return 'Renewal Approved - Pending Payment'
    }
    return 'Approved - Pending Payment'
  }
  if (center.is_active) return 'Active Registration'
  if (center.valid_till) return 'Expired Registration'
  return 'Registration Inactive'
}

const getStatusTextClass = (center) => {
  if (isPaymentRequired(center)) return 'text-yellow-600 font-semibold'
  if (center.is_active) return 'text-green-600'
  return 'text-red-600 font-semibold'
}

const getPaymentStatusText = (center) => {
  if (center.latest_renewal?.renewal_status === 'AWAITING_PAYMENT')
    return 'Pending Payment (Renewal)'
  if (center.payment_status === 'awaiting_payment') return 'Pending Payment (Initial)'
  if (center.is_payment_complete || center.latest_renewal?.payment_status === 'completed')
    return 'Completed'
  return 'Not Applicable'
}

const getPaymentStatusTextClass = (center) => {
  if (isPaymentRequired(center)) return 'text-yellow-600 font-semibold'
  return center.is_payment_complete ? 'text-green-600 font-semibold' : 'text-gray-600'
}

const canRenew = (center) => {
  if (center.has_active_capa) return false
  const isApproved = center.tc_review_decision === 'Approved'
  const isExpiringOrExpired = getDaysUntilExpiration(center) <= 90
  return (
    isApproved && isExpiringOrExpired && !isRenewalInProgress(center) && !isPaymentRequired(center)
  )
}

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    selectedFile.value = file
    selectedFileName.value = file.name
  } else {
    selectedFile.value = null
    selectedFileName.value = ''
  }
}

const openRenewalDialog = (center) => {
  selectedCenter.value = { ...center }
  renewalFormData.value = {
    renewal_document: null,
    user_remarks: '',
    declaration: false,
  }
  selectedFile.value = null
  selectedFileName.value = ''
  showRenewalDialog.value = true
}

const closeRenewalDialog = () => {
  showRenewalDialog.value = false
  selectedCenter.value = null
}

const confirmRenewal = async () => {
  if (!selectedCenter.value || !renewalFormData.value.declaration) {
    toast.error('Please accept the declaration.')
    return
  }
  if (!selectedFile.value) {
    toast.error('A renewal document is required.')
    return
  }
  isRenewing.value = true
  try {
    const formDataPayload = new FormData()
    formDataPayload.append('user_remarks', renewalFormData.value.user_remarks || '')
    formDataPayload.append('renewal_document', selectedFile.value)

    await apiServices.createTeachingCenterRenewal(selectedCenter.value.id, formDataPayload)

    await fetchData()
    toast.success('Teaching center renewal application submitted successfully!')
    closeRenewalDialog()
  } catch (error) {
    const errorMsg =
      error.response?.data?.detail ||
      error.response?.data?.[0] ||
      'Failed to submit renewal application.'
    toast.error(errorMsg)
  } finally {
    isRenewing.value = false
  }
}

const openCertificateDialog = (center) => {
  selectedCenter.value = center
  showCertificateDialog.value = true
}

const closeCertificateDialog = () => {
  showCertificateDialog.value = false
  selectedCenter.value = null
}

const initiatePayment = (center) => {
  selectedCenter.value = center
  if (paymentModalRef.value) {
    paymentModalRef.value.openModal()
  } else {
    toast.error('Payment functionality is currently unavailable.')
    console.error('PaymentModal reference is not available.')
  }
}

const handlePaymentCompleted = async (paymentData) => {
  if (!selectedCenter.value) {
    toast.error('No center selected for payment.')
    return
  }

  isLoading.value = true
  const paymentId = paymentData.paymentHash
  const payload = { payment_id: paymentId }

  const isForRenewal = selectedCenter.value.latest_renewal?.renewal_status === 'AWAITING_PAYMENT'

  try {
    if (isForRenewal) {
      const renewalId = selectedCenter.value.latest_renewal.id
      const centerId = selectedCenter.value.id
      await apiServices.confirmTeachingCenterRenewalPayment(centerId, renewalId, payload)
      toast.success(
        `Renewal payment confirmed (Ref: ${paymentId.substring(0, 8)}...). Status will update shortly.`,
      )
    } else {
      await apiServices.confirmInitialCenterPayment(selectedCenter.value.id, payload)
      toast.success(
        `Initial payment confirmed (Ref: ${paymentId.substring(0, 8)}...). Status will update shortly.`,
      )
    }

    await fetchData()
  } catch (error) {
    console.error('Payment handling error:', error.response || error)
    const errorMsg =
      error.response?.data?.error ||
      error.response?.data?.detail ||
      'An error occurred while confirming your payment.'
    toast.error(`${errorMsg} Please contact support.`)
  } finally {
    isLoading.value = false
    selectedCenter.value = null
  }
}
</script>

<style scoped>
.form-label {
  @apply block text-sm font-medium text-gray-700 mb-1;
}
.required-label::after {
  content: ' *';
  color: #dc2626;
  margin-left: 2px;
}
.form-input,
.form-textarea {
  @apply block w-full rounded-lg border-gray-300 shadow-sm p-3 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-0 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors duration-150;
}
.form-file-input {
  @apply block w-full text-sm text-gray-600 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border file:border-gray-200 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed;
}
.btn {
  @apply inline-flex items-center justify-center rounded-lg border py-2 px-4 text-xs font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-1 transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed;
}
.btn-primary {
  @apply border-transparent bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500;
}
.btn-outline {
  @apply border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-indigo-500;
}
</style>