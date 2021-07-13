<template>
  <div class="mx-auto px-4 py-8">
    <!-- Page Header -->
    <div class="bg-gradient-to-r from-indigo-100 via-blue-50 to-indigo-100 rounded-xl p-8 mb-10">
      <h2 class="text-3xl font-bold text-gray-900 mb-3 text-center">
        Teaching Center Tracker & Renewal
      </h2>
      <p class="text-gray-600 text-center max-w-2xl mx-auto">
        Track and renew your teaching center registration
      </p>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center my-8">
      <Loader class="inline-block animate-spin text-blue-600 w-6 h-6" />
      <p class="ml-2 text-gray-600">Loading teaching center data...</p>
    </div>

    <!-- Error State -->
    <div
      v-else-if="apiError"
      class="bg-red-50 border border-red-200 text-red-700 p-6 rounded-lg mb-6"
    >
      <h3 class="text-lg font-medium mb-2">Error Loading Data</h3>
      <p>{{ errorMessage }}</p>
      <button
        @click="fetchData"
        class="mt-4 bg-red-100 hover:bg-red-200 text-red-800 font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Try Again
      </button>
    </div>

    <!-- No Teaching Centers Found -->
    <div
      v-else-if="!filteredTeachingCenters.length"
      class="bg-yellow-50 border border-yellow-200 text-yellow-700 p-6 rounded-lg mb-6"
    >
      <h3 class="text-lg font-medium mb-2">No Teaching Centers Found</h3>
      <p>You don't have any registered teaching centers associated with your institute.</p>
      <p class="mt-2">Please register a teaching center first before attempting to renew.</p>
    </div>

    <!-- Teaching Centers List -->
    <div v-else>
      <!-- Teaching Center Cards -->
      <div
        v-for="center in filteredTeachingCenters"
        :key="center.id"
        class="bg-white rounded-xl shadow-md overflow-hidden mb-6 relative"
      >
        <!-- Center Status Header -->
        <div class="p-6">
          <!-- Status Indicator -->
          <div
            :class="getStatusIndicatorClass(center)"
            class="absolute top-0 right-0 h-full w-2 rounded-r-xl"
          ></div>
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-xl font-bold text-gray-800">{{ center.center_name }}</h3>
              <p class="text-gray-600">
                <span>
                  {{ center.is_active ? 'Active Registration' : 'Registration Pending' }}
                </span>
                <span
                  v-if="isRenewal(center)"
                  class="ml-2 text-xs bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full"
                  >Renewal</span
                >
                <span
                  v-else
                  class="ml-2 text-xs bg-green-200 text-green-800 px-2 py-0.5 rounded-full"
                  >New Application</span
                >
              </p>
            </div>
            <div class="bg-gray-100 rounded-lg px-4 py-2 text-gray-700">
              <p class="text-sm font-medium">ID: {{ center.id }}</p>
            </div>
          </div>
        </div>

        <!-- Center Details -->
        <div class="p-6">
          <!-- Expiration Alert -->
          <div
            v-if="center.is_active && getDaysUntilExpiration(center) <= 90"
            class="mb-6 p-4 rounded-lg"
            :class="[
              getDaysUntilExpiration(center) <= 0
                ? 'bg-red-50 text-red-700 border border-red-200'
                : getDaysUntilExpiration(center) <= 30
                  ? 'bg-red-50 text-red-700 border border-red-200'
                  : 'bg-yellow-50 text-yellow-700 border border-yellow-200',
            ]"
          >
            <div class="flex items-start">
              <div class="flex-shrink-0 mt-0.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
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
                <h3 class="text-sm font-medium">
                  {{
                    getDaysUntilExpiration(center) <= 0
                      ? 'Registration Expired!'
                      : getDaysUntilExpiration(center) <= 30
                        ? 'Registration Expiring Soon!'
                        : 'Registration Renewal Recommended'
                  }}
                </h3>
                <div class="mt-1 text-sm">
                  <p v-if="getDaysUntilExpiration(center) <= 0">
                    Your teaching center registration has expired on
                    {{ formatDate(center.valid_till) }}. Please renew immediately to maintain your
                    registration status.
                  </p>
                  <p v-else>
                    Your teaching center registration will expire in
                    {{ getDaysUntilExpiration(center) }} days ({{ formatDate(center.valid_till) }}).
                    Please renew your registration to maintain your status.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Center Information -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <!-- Registration Details Block -->
            <div>
              <h4 class="text-sm font-medium text-gray-500 mb-1">Registration Details</h4>
              <div class="p-4 bg-gray-50 rounded-lg">
                <div class="grid grid-cols-1 gap-3">
                  <div>
                    <p class="text-xs text-gray-500">Registration Status</p>
                    <p
                      class="text-sm font-medium"
                      :class="center.is_active ? 'text-green-600' : 'text-yellow-600'"
                    >
                      {{ center.is_active ? 'Active' : 'Pending Review' }}
                    </p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500">Valid From</p>
                    <p class="text-sm font-medium text-gray-800">
                      {{ formatDate(center.created_at) }}
                    </p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500">Valid Until</p>
                    <p
                      class="text-sm font-medium"
                      :class="[
                        !center.valid_till
                          ? 'text-gray-800'
                          : getDaysUntilExpiration(center) <= 0
                            ? 'text-red-600 font-bold'
                            : getDaysUntilExpiration(center) <= 30
                              ? 'text-orange-600'
                              : 'text-gray-800',
                      ]"
                    >
                      {{ formatDate(center.valid_till) }}
                    </p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500">Review Decision</p>
                    <p
                      class="text-sm font-medium"
                      :class="{
                        'text-green-600': center.tc_review_decision === 'Approved',
                        'text-yellow-600': center.tc_review_decision === 'Pending',
                        'text-red-600': center.tc_review_decision === 'Rejected',
                      }"
                    >
                      {{ center.tc_review_decision || 'N/A' }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Center Information Block -->
            <div>
              <h4 class="text-sm font-medium text-gray-500 mb-1">Center Information</h4>
              <div class="p-4 bg-gray-50 rounded-lg">
                <div class="grid grid-cols-1 gap-3">
                  <div>
                    <p class="text-xs text-gray-500">Institute Name</p>
                    <p class="text-sm font-medium text-gray-800">
                      {{ center.institute.name_of_institution }}
                    </p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500">Location</p>
                    <p class="text-sm font-medium text-gray-800">
                      {{ center.center_location }}, {{ center.state_dzongkhag }}
                    </p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500">City/Gewog</p>
                    <p class="text-sm font-medium text-gray-800">{{ center.city_gewog }}</p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500">Target Category</p>
                    <p class="text-sm font-medium text-gray-800">{{ center.target_category }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Payment Status (if applicable) -->
          <div v-if="center.payment_id" class="mb-6">
            <h4 class="text-sm font-medium text-gray-500 mb-1">Payment Information</h4>
            <div class="p-4 bg-gray-50 rounded-lg">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p class="text-xs text-gray-500">Payment ID</p>
                  <p class="text-sm font-medium text-gray-800">{{ center.payment_id }}</p>
                </div>
                <div>
                  <p class="text-xs text-gray-500">Payment Status</p>
                  <p
                    class="text-sm font-medium"
                    :class="center.is_payment_complete ? 'text-green-600' : 'text-yellow-600'"
                  >
                    {{ center.is_payment_complete ? 'Completed' : 'Pending' }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- RENEWAL ACTION AREA -->
          <div
            class="flex justify-center mt-8"
            v-if="
              center.is_active &&
              getDaysUntilExpiration(center) <= 90 &&
              !isRenewalInProgress(center)
            "
          >
            <button
              @click="openRenewalDialog(center)"
              :class="[
                'text-white font-semibold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline transition duration-150 ease-in-out',
                getDaysUntilExpiration(center) <= 0
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-blue-600 hover:bg-blue-700',
                { 'animate-pulse': getDaysUntilExpiration(center) <= 30 },
              ]"
            >
              {{
                getDaysUntilExpiration(center) <= 0
                  ? 'Renew Expired Registration'
                  : 'Renew Teaching Center'
              }}
            </button>
          </div>
          <!-- END RENEWAL ACTION AREA -->

          <!-- Renewal in progress message / Application in progress -->
          <div
            v-if="isRenewalInProgress(center)"
            class="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-700"
          >
            <h4 class="font-medium">Renewal In Progress</h4>
            <p class="mt-1 text-sm">
              Your renewal application has been submitted and is currently under review. You will be
              notified once the review is complete.
            </p>
          </div>
          <div
            v-else-if="!center.is_active && center.tc_review_decision === 'Pending'"
            class="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-700"
          >
            <h4 class="font-medium">Application In Progress</h4>
            <p class="mt-1 text-sm">
              Your application has been submitted and is currently under review. You will be
              notified once the review is complete.
            </p>
          </div>

          <!-- If rejected, show reason -->
          <div
            v-if="center.tc_review_decision === 'Rejected' && center.tc_reason_if_rejected"
            class="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700"
          >
            <h4 class="font-medium">Application Rejected</h4>
            <p class="mt-1 text-sm">Reason: {{ center.tc_reason_if_rejected }}</p>
            <div class="mt-3 flex justify-center">
              <button
                @click="openRenewalDialog(center)"
                class="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
              >
                Apply Again
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Renewal Confirmation Dialog -->
    <div
      v-if="showRenewalDialog"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg shadow-xl p-6 m-4 max-w-2xl w-full">
        <h3 class="text-xl font-bold text-gray-900 mb-4">Teaching Center Renewal Application</h3>
        <form @submit.prevent="confirmRenewal" class="space-y-6">
          <div v-if="selectedCenter">
            <!-- Teaching Center Details -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Center Name</label>
                <div class="mt-1 p-2 bg-gray-100 rounded-md border border-gray-200">
                  {{ selectedCenter.center_name }}
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Center Location</label>
                <div class="mt-1 p-2 bg-gray-100 rounded-md border border-gray-200">
                  {{ selectedCenter.center_location }}
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">City/Gewog</label>
                <div class="mt-1 p-2 bg-gray-100 rounded-md border border-gray-200">
                  {{ selectedCenter.city_gewog }}
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">State/Dzongkhag</label>
                <div class="mt-1 p-2 bg-gray-100 rounded-md border border-gray-200">
                  {{ selectedCenter.state_dzongkhag }}
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Target Category</label>
                <div class="mt-1 p-2 bg-gray-100 rounded-md border border-gray-200">
                  {{ selectedCenter.target_category }}
                </div>
              </div>
            </div>

            <!-- Attachments -->
            <div class="mb-4">
              <label for="attachments" class="block text-sm font-medium text-gray-700">
                Attachments (if any)
              </label>
              <input
                type="file"
                id="attachments"
                @change="handleFileUpload"
                class="mt-1 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
              <p class="mt-1 text-sm text-gray-500">You can attach relevant documents here.</p>
              <p v-if="selectedFileName" class="mt-1 text-sm text-green-600">
                Selected: {{ selectedFileName }}
              </p>
            </div>

            <!-- Remarks -->
            <div class="mb-4">
              <label for="remarks" class="block text-sm font-medium text-gray-700"> Remarks </label>
              <textarea
                id="remarks"
                v-model="renewalFormData.remarks"
                rows="3"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              ></textarea>
            </div>

            <!-- Declaration -->
            <div class="flex items-start mb-4">
              <div class="flex items-center h-5">
                <input
                  id="declaration"
                  type="checkbox"
                  v-model="renewalFormData.tc_declaration"
                  required
                  class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                />
              </div>
              <div class="ml-3 text-sm">
                <label for="declaration" class="font-medium text-gray-700">Declaration</label>
                <p class="text-gray-500">
                  I hereby declare that the information provided is true and correct to the best of
                  my knowledge.
                </p>
              </div>
            </div>
          </div>

          <div v-if="isRenewing" class="flex items-center justify-center mb-4">
            <Loader class="inline-block animate-spin text-blue-600 w-6 h-6 mr-2" />
            <p class="text-gray-600">Processing renewal...</p>
          </div>

          <div class="flex justify-end space-x-4">
            <button
              type="button"
              @click="closeRenewalDialog"
              class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              :disabled="isRenewing"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              :disabled="isRenewing || !renewalFormData.tc_declaration"
            >
              Submit Renewal
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useToast } from 'vue-toastification'
import apiServices from '@/services/services'
import { Loader } from 'lucide-vue-next'

// State variables
const teachingCenters = ref([])
const isLoading = ref(true)
const apiError = ref(false)
const errorMessage = ref('')
const showRenewalDialog = ref(false)
const isRenewing = ref(false)
const selectedCenter = ref(null)
const selectedFile = ref(null)
const selectedFileName = ref('')

// Renewal form data
const renewalFormData = ref({
  tc_attachments: null,
  remarks: '',
  tc_declaration: false,
})

const toast = useToast()
const authStore = useAuthStore()

// Computed property for filtered teaching centers
const filteredTeachingCenters = computed(() => {
  if (!authStore.user || !authStore.user.cid) {
    console.warn('User CID not available in authStore')
    return []
  }
  return teachingCenters.value.filter((center) => {
    const centerCid = center.institute?.CID
    return centerCid === authStore.user.cid
  })
})

// Format date function
const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date string provided')
    }
    if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const [year, month, day] = dateString.split('-').map(Number)
      return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString()
    }
    return date.toLocaleDateString()
  } catch (e) {
    console.error('Error formatting date:', dateString, e)
    return 'Invalid Date'
  }
}

// Calculate days until expiration
const getDaysUntilExpiration = (center) => {
  if (!center.valid_till) return 0
  if (!center.is_active) return Infinity

  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    let expirationDate
    if (String(center.valid_till).match(/^\d{4}-\d{2}-\d{2}$/)) {
      const [year, month, day] = center.valid_till.split('-').map(Number)
      expirationDate = new Date(Date.UTC(year, month - 1, day))
    } else {
      expirationDate = new Date(center.valid_till)
    }

    if (isNaN(expirationDate.getTime())) {
      console.error('Invalid expiration date parsed:', center.valid_till)
      return 0
    }
    expirationDate.setHours(0, 0, 0, 0)

    const timeDiff = expirationDate.getTime() - today.getTime()
    return Math.ceil(timeDiff / (1000 * 3600 * 24))
  } catch (e) {
    console.error('Error calculating days until expiration:', e)
    return 0
  }
}

// Check if renewal is in progress
const isRenewalInProgress = (center) => {
  return center.tc_review_decision === 'Pending' && !center.is_active
}

// Function to check if the application record represents a renewal
const isRenewal = (center) => {
  return !!center.valid_since
}

// Get status indicator class based on status and expiration
const getStatusIndicatorClass = (center) => {
  if (!center.is_active) {
    if (center.tc_review_decision === 'Rejected') {
      return 'bg-red-600'
    }
    return 'bg-yellow-600'
  }
  const daysLeft = getDaysUntilExpiration(center)
  if (daysLeft <= 0) {
    return 'bg-red-600'
  }
  if (daysLeft <= 30) {
    return 'bg-orange-500'
  }
  if (daysLeft <= 90) {
    return 'bg-yellow-500'
  }
  return 'bg-green-600'
}

// File upload handler
const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    selectedFile.value = file
    selectedFileName.value = file.name
    renewalFormData.value.tc_attachments = file
  } else {
    selectedFile.value = null
    selectedFileName.value = ''
    renewalFormData.value.tc_attachments = null
  }
}

// Open renewal dialog
const openRenewalDialog = (center) => {
  selectedCenter.value = center
  renewalFormData.value = {
    tc_attachments: null,
    remarks: '',
    tc_declaration: false,
  }
  selectedFile.value = null
  selectedFileName.value = ''
  showRenewalDialog.value = true
}

// Close renewal dialog
const closeRenewalDialog = () => {
  showRenewalDialog.value = false
  selectedCenter.value = null
  selectedFile.value = null
  selectedFileName.value = ''
  renewalFormData.value = {
    tc_attachments: null,
    remarks: '',
    tc_declaration: false,
  }
}

// Submit renewal request
const confirmRenewal = async () => {
  if (!selectedCenter.value) {
    toast.error('No teaching center selected for renewal')
    closeRenewalDialog()
    return
  }

  if (!renewalFormData.value.tc_declaration) {
    toast.warning('Please accept the declaration before submitting.')
    return
  }

  isRenewing.value = true

  try {
    const formData = new FormData()

    formData.append('tc_review_decision', 'Pending')
    formData.append('is_payment_complete', false)
    formData.append('is_active', false)
    formData.append('remarks', renewalFormData.value.remarks || '')
    formData.append('tc_declaration', renewalFormData.value.tc_declaration)
    formData.append('valid_since', new Date().toISOString().split('T')[0])

    if (selectedFile.value) {
      formData.append('tc_attachments', selectedFile.value, selectedFileName.value)
    }

    if (selectedCenter.value.institute?.id) {
      formData.append('institute', selectedCenter.value.institute.id)
    } else {
      console.warn('Institute ID not found for selected center. Renewal might fail if required.')
    }

    console.log('Submitting renewal data for center ID:', selectedCenter.value.id)
    for (let pair of formData.entries()) {
      console.log(pair[0] + ': ' + (pair[1] instanceof File ? pair[1].name : pair[1]))
    }

    const response = await apiServices.patchEpcTeachingCenter(selectedCenter.value.id, formData)
    console.log('Renewal API Response:', response)

    await fetchData()

    toast.success('Teaching center renewal submitted successfully! Status is pending review.')
    closeRenewalDialog()
  } catch (error) {
    console.error('Error initiating teaching center renewal:', error)
    if (error.response) {
      console.error('Error Response Data:', error.response.data)
      const apiErrorMessage =
        typeof error.response.data === 'string'
          ? error.response.data
          : error.response.data?.message ||
            error.response.data?.detail ||
            'Detailed error message not provided by server.'
      errorMessage.value = `Renewal failed: ${apiErrorMessage} (Status: ${error.response.status})`
    } else if (error.request) {
      errorMessage.value =
        'Renewal failed: No response received from server. Check network connection.'
    } else {
      errorMessage.value = `Renewal failed: ${error.message}`
    }
    toast.error(errorMessage.value)
  } finally {
    isRenewing.value = false
  }
}

// Fetch teaching centers data
const fetchData = async () => {
  isLoading.value = true
  apiError.value = false
  errorMessage.value = ''

  try {
    console.log('Fetching teaching centers...')
    const response = await apiServices.getEpcTeachingCenters()
    console.log('API Response:', response)

    if (response?.data?.results) {
      teachingCenters.value = response.data.results
      console.log('Teaching centers loaded:', teachingCenters.value.length)
      teachingCenters.value.forEach((c) =>
        console.log(`Loaded Center ID: ${c.id}, Institute CID: ${c.institute?.CID}`),
      )
    } else {
      teachingCenters.value = []
      console.log('No teaching center results found in response.')
    }
  } catch (error) {
    console.error('Error fetching teaching centers:', error)
    if (error.response) {
      errorMessage.value = `Error fetching data: ${error.response.data?.detail || error.response.statusText} (Status: ${error.response.status})`
    } else if (error.request) {
      errorMessage.value = 'Error fetching data: No response from server.'
    } else {
      errorMessage.value = `Error fetching data: ${error.message}`
    }
    apiError.value = true
    teachingCenters.value = []
  } finally {
    isLoading.value = false
  }
}

// Fetch data on component mount
onMounted(() => {
  if (authStore.user && authStore.user.cid) {
    fetchData()
  } else {
    console.warn('User info not available on mount, delaying fetch or handle appropriately.')
    isLoading.value = false
    apiError.value = true
    errorMessage.value = 'User information not loaded. Please ensure you are logged in.'
  }
})
</script>

<style scoped>
button {
  transition: background-color 0.2s ease-in-out;
}
</style>
