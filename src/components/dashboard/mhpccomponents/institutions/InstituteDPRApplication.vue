<template>
  <div class="min-h-screen py-8">
    <InstituteHeader
      title="Your DPR Applications"
      subtitle="Manage and track your Detailed Project Report applications for MHPC accreditation."
      :show-actions="false"
      class="mx-4"
    />

    <div class="sticky top-0 bg-white shadow-sm z-10 p-4 mx-4 rounded-lg mb-6">
      <!-- Filter and Sort Controls -->
      <div class="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div class="flex gap-4 w-full md:w-auto">
          <div class="relative w-full md:w-64">
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
            class="w-full md:w-40 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2"
            aria-label="Filter by status"
          >
            <option value="">All Statuses</option>
            <option v-for="status in statusOptions" :key="status" :value="status">
              {{ status }}
            </option>
          </select>
          <select
            v-model="filterDzongkhag"
            class="w-full md:w-40 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2"
            aria-label="Filter by Dzongkhag"
          >
            <option value="">All Dzongkhags</option>
            <option v-for="dzongkhag in dzongkhagOptions" :key="dzongkhag" :value="dzongkhag">
              {{ dzongkhag }}
            </option>
          </select>
        </div>
        <div class="flex gap-4">
          <button
            @click="sortApplications"
            class="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            aria-label="Sort applications"
          >
            Sort by {{ sortOrder === 'desc' ? 'Newest' : 'Oldest' }}
            <svg class="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                :d="
                  sortOrder === 'desc' ? 'M19 14l-7 7m0 0l-7-7m7 7V3' : 'M5 10l7-7m0 0l7 7m-7-7v18'
                "
              />
            </svg>
          </button>
          <button
            @click="fetchApplications"
            class="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
            aria-label="Refresh applications"
          >
            Refresh
          </button>
        </div>
      </div>
    </div>

    <div class="mx-4">
      <!-- Loading Skeleton -->
      <div v-if="isLoading" class="space-y-6">
        <div v-for="n in 3" :key="n" class="bg-white rounded-xl shadow-lg p-6 animate-pulse">
          <div class="flex justify-between mb-4">
            <div class="space-y-2">
              <div class="h-6 bg-gray-200 rounded w-3/4"></div>
              <div class="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div class="space-y-2">
              <div class="h-4 bg-gray-200 rounded w-24"></div>
              <div class="h-4 bg-gray-200 rounded w-32"></div>
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="space-y-2">
              <div class="h-4 bg-gray-200 rounded w-20"></div>
              <div class="h-4 bg-gray-200 rounded w-28"></div>
            </div>
            <div class="space-y-2">
              <div class="h-4 bg-gray-200 rounded w-20"></div>
              <div class="h-4 bg-gray-200 rounded w-24"></div>
            </div>
            <div class="space-y-2">
              <div class="h-4 bg-gray-200 rounded w-20"></div>
              <div class="h-4 bg-gray-200 rounded w-28"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- API Error -->
      <div
        v-else-if="apiError"
        class="text-center py-12 bg-red-50 rounded-xl border border-red-200"
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

      <!-- Applications List -->
      <div v-else-if="filteredApplications.length > 0" class="space-y-6">
        <div
          v-for="application in paginatedApplications"
          :key="application.id"
          class="bg-white rounded-xl shadow-lg border border-gray-200 hover:border-blue-300 transition-all duration-300"
        >
          <div class="p-6 md:p-8">
            <div class="flex flex-col sm:flex-row items-start justify-between mb-4">
              <div class="mb-4 sm:mb-0">
                <h3 class="text-xl font-semibold text-gray-900 mb-1">
                  {{ application.name_of_institution }}
                </h3>
                <p class="text-sm text-gray-500 mb-2">
                  CID: {{ application.CID }} | DPR Name: {{ application.dpr_name }}
                </p>
                <span
                  :class="[
                    'px-2.5 py-1 text-xs font-medium rounded-full cursor-help',
                    getStatusColor(application.do_dpr_review_decision),
                  ]"
                  :title="getStatusTooltip(application.do_dpr_review_decision)"
                >
                  {{ application.do_dpr_review_decision || 'N/A' }}
                </span>
              </div>
              <div class="text-left sm:text-right w-full sm:w-auto">
                <p class="text-sm font-medium text-gray-800">Head of Institution</p>
                <p class="text-sm text-gray-600">{{ application.head_of_institution_name }}</p>
                <p class="text-sm text-gray-600">{{ application.head_of_institution_email }}</p>
              </div>
            </div>

            <button
              @click="toggleDetails(application.id)"
              class="w-full flex items-center justify-between text-sm font-medium text-blue-600 hover:text-blue-800 mb-4"
              :aria-expanded="expandedApplications[application.id]"
              :aria-controls="'details-' + application.id"
            >
              {{ expandedApplications[application.id] ? 'Hide Details' : 'Show Details' }}
              <svg
                class="w-5 h-5 transform transition-transform"
                :class="{ 'rotate-180': expandedApplications[application.id] }"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            <div
              v-if="expandedApplications[application.id]"
              :id="'details-' + application.id"
              class="space-y-6"
            >
              <!-- Details Content -->
              <div
                class="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4 pt-4 border-t border-gray-100"
              >
                <div>
                  <p class="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact Details
                  </p>
                  <p class="text-sm text-gray-700">{{ application.contact_no }}</p>
                  <p class="text-sm text-gray-700">{{ application.email_address }}</p>
                </div>
                <div>
                  <p class="text-xs font-medium text-gray-500 uppercase tracking-wider">Location</p>
                  <p class="text-sm text-gray-700">
                    {{ application.dzongkhag }}, {{ application.gewog || 'N/A' }}
                  </p>
                </div>
                <div>
                  <p class="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course Start Date
                  </p>
                  <p class="text-sm text-gray-700">
                    {{ formatDate(application.commencement_date) }}
                  </p>
                </div>
              </div>

              <div class="pt-4 border-t border-gray-100">
                <p class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                  DPR Details
                </p>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p class="text-sm font-semibold text-gray-800 mb-1">Executive Summary</p>
                    <p class="text-sm text-gray-600">
                      {{ application.executive_summary || 'Not provided' }}
                    </p>
                  </div>
                  <div>
                    <p class="text-sm font-semibold text-gray-800 mb-1">DPR Review Summary</p>
                    <p class="text-sm text-gray-600">
                      {{ application.do_dpr_review_summary || 'Pending Review' }}
                    </p>
                  </div>
                </div>
              </div>

              <div class="pt-4 border-t border-gray-100">
                <p class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                  Program Information
                </p>
                <div class="flex flex-wrap gap-x-6 gap-y-4">
                  <div>
                    <p class="text-sm font-semibold text-gray-800">Program Type</p>
                    <p class="text-sm text-gray-600">
                      {{
                        application.type_of_programme === 'D'
                          ? 'Diploma'
                          : application.type_of_programme === 'B'
                            ? 'Bachelor'
                            : 'Other'
                      }}
                    </p>
                  </div>
                  <div>
                    <p class="text-sm font-semibold text-gray-800">Duration</p>
                    <p class="text-sm text-gray-600">{{ application.course_duration }} months</p>
                  </div>
                  <div
                    v-if="
                      application.do_dpr_review_decision === STATUS_REJECTED &&
                      application.do_dpr_reason_if_rejected
                    "
                  >
                    <p class="text-sm font-semibold text-red-700">Rejection Reason</p>
                    <p class="text-sm text-red-600">{{ application.do_dpr_reason_if_rejected }}</p>
                  </div>
                </div>
              </div>

              <div class="pt-4 border-t border-gray-100">
                <p class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                  Application Timeline
                </p>
                <div class="relative pl-6">
                  <div class="absolute left-2 top-0 h-full w-0.5 bg-gray-200"></div>
                  <div
                    v-for="(event, index) in getTimeline(application)"
                    :key="index"
                    class="mb-4 relative"
                  >
                    <div
                      class="absolute left-[-20px] top-1 w-4 h-4 bg-blue-600 rounded-full border-2 border-white"
                    ></div>
                    <p class="text-sm font-medium text-gray-800">{{ event.status }}</p>
                    <p class="text-xs text-gray-500">{{ formatDate(event.date) }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Payment and Certificate Actions -->
            <div
              v-if="isPaymentPending(application) || isPaymentCompleted(application)"
              class="mt-6 pt-4 border-t border-gray-100"
            >
              <div class="flex flex-col sm:flex-row items-center justify-end gap-3">
                <p
                  v-if="isPaymentPending(application)"
                  class="text-sm text-yellow-800 bg-yellow-100 px-3 py-1.5 rounded-md font-medium mr-0 sm:mr-auto text-center sm:text-left w-full sm:w-auto"
                >
                  <span class="font-semibold">Action Required:</span> Payment pending for approved
                  application.
                </p>
                <button
                  v-if="isPaymentPending(application)"
                  @click="openPaymentConfirmationModal(application)"
                  :disabled="isActionLoading[application.id]"
                  class="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors w-full sm:w-auto disabled:opacity-50"
                >
                  <svg
                    v-if="isActionLoading[application.id]"
                    class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                  Make Payment
                </button>
                <button
                  v-if="isPaymentCompleted(application)"
                  @click="openCertificateModal(application)"
                  :disabled="isActionLoading[application.id]"
                  class="inline-flex items-center justify-center px-4 py-2 border border-green-600 text-sm font-medium rounded-md text-green-700 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors w-full sm:w-auto disabled:opacity-50"
                >
                  <svg
                    v-if="isActionLoading[application.id]"
                    class="animate-spin -ml-1 mr-3 h-5 w-5 text-green-700"
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
                  View Certificate
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div class="flex justify-between items-center mt-6">
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
              aria-label="Previous page"
            >
              Previous
            </button>
            <button
              v-for="page in totalPages"
              :key="page"
              @click="currentPage = page"
              :class="[
                'px-3 py-1 rounded-md border text-sm font-medium',
                currentPage === page
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50',
              ]"
              :aria-label="'Page ' + page"
            >
              {{ page }}
            </button>
            <button
              @click="currentPage++"
              :disabled="currentPage === totalPages"
              class="px-3 py-1 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              aria-label="Next page"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <!-- No Applications Found -->
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
        <h3 class="mt-2 text-lg font-medium text-gray-900">No DPR Applications Found</h3>
        <p class="mt-1 text-sm text-gray-500">
          You currently don't have any DPR applications matching your records in the system.
        </p>
        <button
          @click="startNewApplication"
          class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Start New Application
        </button>
      </div>
    </div>

    <!-- Payment Confirmation Modal -->
    <div
      v-if="showPaymentConfirmModal"
      class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Confirm Payment</h3>
        <p class="text-sm text-gray-600 mb-6">
          You are about to initiate payment for "{{ selectedApplication?.name_of_institution }}"
          (DPR: {{ selectedApplication?.dpr_name }}). Proceed to the payment gateway?
        </p>
        <div class="flex justify-end gap-4">
          <button
            @click="cancelPaymentConfirmation"
            class="inline-flex items-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            @click="handleProceedWithPaymentFlow"
            class="inline-flex items-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
          >
            Proceed
          </button>
        </div>
      </div>
    </div>

    <!-- Certificate Modal -->
    <div
      v-if="showCertificateModal"
      class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">View Certificate</h3>
        <p class="text-sm text-gray-600 mb-6">
          View the certificate for "{{ selectedApplication?.name_of_institution }}" (DPR:
          {{ selectedApplication?.dpr_name }}). The certificate will be watermarked with the BHMC
          logo.
        </p>
        <div class="flex justify-end gap-4">
          <button
            @click="
              showCertificateModal = false
              selectedApplication = null
            "
            class="inline-flex items-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            @click="handleViewCertificate(selectedApplication)"
            class="inline-flex items-center rounded-md border border-transparent bg-green-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-green-700"
          >
            View Certificate
          </button>
        </div>
      </div>
    </div>

    <!-- Actual Payment Modal (Imported) -->
    <PaymentModal
      ref="paymentModalRef"
      :amount="dprPaymentAmount"
      @payment-completed="handleDPRPaymentCompleted"
      @close="closeDPRPaymentModal"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '@/stores/authStore'
import debounce from 'lodash/debounce'
import apiServices from '@/services/services'
import InstituteHeader from '@/components/common/MHPC/InstituteHeader.vue'
import PaymentModal from '@/components/common/PaymentModal.vue'

const router = useRouter()
const toast = useToast()
const authStore = useAuthStore()

const STATUS_APPROVED = 'Approved'
const STATUS_REJECTED = 'Rejected'
const STATUS_PENDING = 'Pending'
const statusOptions = [STATUS_APPROVED, STATUS_REJECTED, STATUS_PENDING, 'In Review', 'Submitted']
const dzongkhagOptions = [
  'Bumthang',
  'Chukha',
  'Dagana',
  'Gasa',
  'Haa',
  'Lhuntse',
  'Mongar',
  'Paro',
  'Pemagatshel',
  'Punakha',
  'Samdrup Jongkhar',
  'Samtse',
  'Sarpang',
  'Thimphu',
  'Trashigang',
  'Trashiyangtse',
  'Trongsa',
  'Tsirang',
  'Wangdue Phodrang',
  'Zhemgang',
]

const applications = ref([])
const isLoading = ref(false)
const apiError = ref(false)
const errorMessage = ref('')
const searchQuery = ref('')
const filterStatus = ref('')
const filterDzongkhag = ref('')
const sortOrder = ref('desc')
const currentPage = ref(1)
const itemsPerPage = 10
const expandedApplications = ref({})
const isActionLoading = ref({})
const showPaymentConfirmModal = ref(false)
const showCertificateModal = ref(false)
const selectedApplication = ref(null)

const paymentModalRef = ref(null)
const selectedApplicationForPayment = ref(null)
const dprPaymentAmount = ref(1500)

const paymentOutcomeHandled = ref(false)

const filteredApplications = computed(() => {
  let result = applications.value
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(
      (app) =>
        app.name_of_institution?.toLowerCase().includes(query) ||
        app.dpr_name?.toLowerCase().includes(query),
    )
  }
  if (filterStatus.value) {
    result = result.filter((app) => app.do_dpr_review_decision === filterStatus.value)
  }
  if (filterDzongkhag.value) {
    result = result.filter((app) => app.dzongkhag === filterDzongkhag.value)
  }
  return result.sort((a, b) => {
    const dateA = new Date(a.commencement_date || a.created_at || 0)
    const dateB = new Date(b.commencement_date || b.created_at || 0)
    return sortOrder.value === 'desc' ? dateB - dateA : dateA - dateB
  })
})

const totalPages = computed(() => Math.ceil(filteredApplications.value.length / itemsPerPage))

const paginatedApplications = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredApplications.value.slice(start, end)
})

const getStatusColor = (status) => {
  switch (status) {
    case STATUS_APPROVED:
      return 'bg-green-100 text-green-700'
    case STATUS_REJECTED:
      return 'bg-red-100 text-red-700'
    case STATUS_PENDING:
      return 'bg-yellow-100 text-yellow-700'
    case 'In Review':
      return 'bg-blue-100 text-blue-700'
    case 'Submitted':
      return 'bg-gray-100 text-gray-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

const getStatusTooltip = (status) => {
  switch (status) {
    case STATUS_APPROVED:
      return 'Application has been approved. Proceed to payment if pending.'
    case STATUS_REJECTED:
      return 'Application was rejected. Review the reason for rejection.'
    case STATUS_PENDING:
      return 'Application is awaiting review by the dealing officer.'
    case 'In Review':
      return 'Application is currently under review.'
    case 'Submitted':
      return 'Application has been submitted and is pending processing.'
    default:
      return 'Status not available.'
  }
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      console.warn(`Invalid date string received: ${dateString}`)
      return 'Invalid Date'
    }
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  } catch (e) {
    console.error(`Error formatting date: ${dateString}`, e)
    return 'Date Error'
  }
}

const isApplicationApproved = (app) => app.do_dpr_review_decision === STATUS_APPROVED
const isPaymentPending = (app) => isApplicationApproved(app) && app.is_payment_complete === false
const isPaymentCompleted = (app) => isApplicationApproved(app) && app.is_payment_complete === true

const getTimeline = (app) => {
  return [
    { status: 'Submitted', date: app.created_at || new Date().toISOString() },
    {
      status: app.do_dpr_review_decision || 'Pending',
      date: app.updated_at || new Date().toISOString(),
    },
  ]
}

const toggleDetails = (id) => {
  expandedApplications.value[id] = !expandedApplications.value[id]
}

const sortApplications = () => {
  sortOrder.value = sortOrder.value === 'desc' ? 'asc' : 'desc'
}

const debouncedSearch = debounce(() => {
  currentPage.value = 1
}, 300)

watch(searchQuery, () => {
  debouncedSearch()
})

const fetchApplications = async () => {
  if (!authStore.user || !authStore.user.cid) {
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
      const userCid = authStore.user.cid.toLowerCase()
      applications.value = response.data.results
        .filter((app) => app && typeof app.CID === 'string' && app.CID.toLowerCase() === userCid)
        .map((app) => ({ ...app, is_payment_complete: app.is_payment_complete || false }))
    } else {
      console.warn('Unexpected API response structure:', response)
      applications.value = []
    }
  } catch (error) {
    console.error('Error fetching DPR applications:', error)
    applications.value = []
    apiError.value = true
    errorMessage.value =
      error.response?.data?.message ||
      (error.request
        ? 'Network error. Please check your connection and try again.'
        : 'An unexpected error occurred while fetching applications. Please try again.')
    toast.error(errorMessage.value)
  } finally {
    isLoading.value = false
  }
}

// --- Payment Flow Functions ---

const openPaymentConfirmationModal = (application) => {
  selectedApplication.value = application
  paymentOutcomeHandled.value = false
  if (application && application.id) {
    isActionLoading.value[application.id] = true
  }
  showPaymentConfirmModal.value = true
}

const cancelPaymentConfirmation = () => {
  showPaymentConfirmModal.value = false
  if (selectedApplication.value && selectedApplication.value.id) {
    isActionLoading.value[selectedApplication.value.id] = false
  }
  selectedApplication.value = null
}

const handleProceedWithPaymentFlow = async () => {
  if (!selectedApplication.value || !selectedApplication.value.id) {
    toast.error('No application selected to proceed with payment.')
    if (selectedApplication.value?.id && isActionLoading.value[selectedApplication.value.id]) {
      isActionLoading.value[selectedApplication.value.id] = false
    }
    return
  }

  const appId = selectedApplication.value.id
  showPaymentConfirmModal.value = false
  selectedApplicationForPayment.value = selectedApplication.value

  if (paymentModalRef.value && typeof paymentModalRef.value.openModal === 'function') {
    paymentModalRef.value.openModal()
  } else {
    console.error('Payment modal reference or openModal method is not available.')
    toast.error('Could not open payment window. Please try again.')
    if (isActionLoading.value[appId] !== undefined) {
      isActionLoading.value[appId] = false
    }
    selectedApplication.value = null
    selectedApplicationForPayment.value = null
  }
}

const handleDPRPaymentCompleted = async (paymentData) => {
  paymentOutcomeHandled.value = true

  if (!selectedApplicationForPayment.value) {
    toast.error('Error: No application was associated with this payment.')
    const initialAppId = selectedApplication.value?.id
    if (initialAppId && isActionLoading.value[initialAppId]) {
      isActionLoading.value[initialAppId] = false
    }
    return
  }

  const appBeingPaid = selectedApplicationForPayment.value

  try {
    console.log('DPR Payment completed event received:', paymentData)
    console.log('For application:', appBeingPaid.name_of_institution, appBeingPaid.dpr_name)

    // Simulate API call to update payment status
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Update the application in the local state
    const appIndex = applications.value.findIndex((a) => a.id === appBeingPaid.id)
    if (appIndex !== -1) {
      applications.value[appIndex] = { ...applications.value[appIndex], is_payment_complete: true }
    } else {
      throw new Error('Application not found in local state.')
    }

    // Show success message only after successful update
    toast.success(`Payment for "${appBeingPaid.dpr_name}" completed successfully!`)

    // Rely on PaymentModal to emit 'close' event, which triggers closeDPRPaymentModal
  } catch (error) {
    console.error('Error updating DPR application after payment:', error)
    toast.error(
      `Failed to update application for "${appBeingPaid.dpr_name}" after payment. Please contact support.`,
    )
  } finally {
    if (appBeingPaid && appBeingPaid.id) {
      isActionLoading.value[appBeingPaid.id] = false
    }
    selectedApplicationForPayment.value = null
    // The modal should close itself and emit 'close', which calls closeDPRPaymentModal
  }
}

const closeDPRPaymentModal = () => {
  if (!paymentOutcomeHandled.value) {
    toast.info('Payment process cancelled.')
  }
  paymentOutcomeHandled.value = false

  const initialAppId = selectedApplication.value?.id || selectedApplicationForPayment.value?.id
  if (initialAppId && isActionLoading.value[initialAppId] !== undefined) {
    isActionLoading.value[initialAppId] = false
  }

  selectedApplicationForPayment.value = null
  selectedApplication.value = null
}
// --- End Payment Flow Functions ---

const openCertificateModal = (application) => {
  selectedApplication.value = application
  if (application && application.id) {
    isActionLoading.value[application.id] = true
  }
  showCertificateModal.value = true
}

const handleViewCertificate = async (application) => {
  if (!application || !application.id) {
    const currentSelectedAppId = selectedApplication.value?.id
    if (currentSelectedAppId && isActionLoading.value[currentSelectedAppId]) {
      isActionLoading.value[currentSelectedAppId] = false
    }
    selectedApplication.value = null
    return
  }

  try {
    console.log('Viewing certificate for application ID:', application.id, application.dpr_name)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    toast.success(`Certificate for "${application.dpr_name}" opened in new tab (simulated).`)
    showCertificateModal.value = false
  } catch (error) {
    console.error('Error viewing certificate:', error)
    toast.error('Failed to view certificate. Please try again.')
  } finally {
    if (application && application.id) {
      isActionLoading.value[application.id] = false
    }
    selectedApplication.value = null
  }
}

const startNewApplication = () => {
  router.push('/eoi-form')
}

onMounted(fetchApplications)
</script>

<style scoped>
.cursor-help:hover {
  opacity: 0.8;
}
</style>
