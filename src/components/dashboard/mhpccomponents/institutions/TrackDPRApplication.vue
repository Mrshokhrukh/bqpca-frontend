<template>
  <div class="min-h-screen py-8">
    <InstituteHeader
      title="DPR Applications Management"
      subtitle="Manage and track Detailed Project Report applications for MHPC accreditation."
      :show-actions="false"
      class="mx-4"
    />

    <div class="sticky top-0 bg-white shadow-sm z-10 p-4 mx-4 rounded-lg mb-6">
      <div class="flex flex-col md:flex-row gap-4 items-center justify-between">
        <!-- Filters and Sort -->
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
          <select
            v-model="filterDzongkhag"
            class="w-full sm:w-auto md:w-40 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm py-2"
            aria-label="Filter by Dzongkhag"
          >
            <option value="">All Dzongkhags</option>
            <option v-for="dzongkhag in dzongkhagOptions" :key="dzongkhag" :value="dzongkhag">
              {{ dzongkhag }}
            </option>
          </select>
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
        </div>
        <!-- Actions -->
        <div class="flex gap-4 w-full sm:w-auto justify-end">
          <button
            @click="fetchApplications"
            class="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
            aria-label="Refresh applications"
          >
            Refresh
          </button>
          <button
            @click="openNewApplicationModal"
            class="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700"
            aria-label="Add New DPR Application"
          >
             <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
            </svg>
            Add New DPR
          </button>
        </div>
      </div>
    </div>

    <div class="mx-4">
      <!-- Loading Skeleton for Table -->
      <div v-if="isLoading">
        <div class="bg-white rounded-xl shadow-lg p-6 animate-pulse">
          <div class="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div v-for="n in 5" :key="n" class="flex items-center space-x-4 py-3 border-b border-gray-200">
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

      <!-- Applications Table -->
      <div v-else-if="filteredApplications.length > 0" class="bg-white rounded-xl shadow-lg overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S.N.</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Institution Name</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DPR Name</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dzongkhag</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted On</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(application, index) in paginatedApplications" :key="application.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ application.name_of_institution }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ application.dpr_name }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ application.dzongkhag }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="['px-2.5 py-0.5 text-xs font-medium rounded-full', getStatusColor(application.do_dpr_review_decision)]"
                  :title="getStatusTooltip(application.do_dpr_review_decision)"
                >
                  {{ application.do_dpr_review_decision || 'N/A' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(application.created_at || application.commencement_date) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <button @click="viewApplicationDetails(application)" class="text-indigo-600 hover:text-indigo-900" title="View Details">View</button>
                 <button
                  v-if="isPaymentPending(application)"
                  @click="openPaymentConfirmationModal(application)"
                  :disabled="isActionLoading[application.id]"
                  class="text-blue-600 hover:text-blue-900 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Make Payment"
                >
                  Pay
                </button>
                <button
                  v-if="isPaymentCompleted(application)"
                  @click="openCertificateModal(application)"
                  :disabled="isActionLoading[application.id]"
                  class="text-green-600 hover:text-green-900 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="View Certificate"
                >
                  Certificate
                </button>
              </td>
            </tr>
          </tbody>
        </table>
         <!-- Pagination -->
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
          @click="openNewApplicationModal"
          class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Start New Application
        </button>
      </div>
    </div>

    <!-- Payment Confirmation Modal -->
    <div
      v-if="showPaymentConfirmModal"
      class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4"
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
      class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">View Certificate</h3>
        <p class="text-sm text-gray-600 mb-6">
          View the certificate for "{{ selectedApplication?.name_of_institution }}" (DPR:
          {{ selectedApplication?.dpr_name }}).
        </p>
        <div class="flex justify-end gap-4">
          <button
            @click="showCertificateModal = false, selectedApplication = null"
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

    <!-- New DPR Application Modal -->
    <DPRApplicationFormModal
      :is-visible="showAddApplicationModal"
      @close="closeNewApplicationModal"
      @application-submitted="handleApplicationSubmitted"
    />

    <!-- Application Details Modal (Placeholder) -->
     <div v-if="showDetailsModal && viewingApplication" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-lg shadow-xl p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-xl font-semibold text-gray-900">Application Details</h3>
                <button @click="closeDetailsModal" class="text-gray-400 hover:text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <div class="space-y-6">
                <div class="pb-4 border-b border-gray-100">
                    <h4 class="text-lg font-semibold text-gray-900 mb-1">{{ viewingApplication.name_of_institution }}</h4>
                    <p class="text-sm text-gray-500 mb-2">CID: {{ viewingApplication.CID }} | DPR Name: {{ viewingApplication.dpr_name }}</p>
                    <span :class="['px-2.5 py-1 text-xs font-medium rounded-full', getStatusColor(viewingApplication.do_dpr_review_decision)]" :title="getStatusTooltip(viewingApplication.do_dpr_review_decision)">
                        {{ viewingApplication.do_dpr_review_decision || 'N/A' }}
                    </span>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <p class="text-xs font-medium text-gray-500 uppercase tracking-wider">Head of Institution</p>
                        <p class="text-sm text-gray-700">{{ viewingApplication.head_of_institution_name }}</p>
                        <p class="text-sm text-gray-700">{{ viewingApplication.head_of_institution_email }}</p>
                    </div>
                    <div>
                        <p class="text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Details</p>
                        <p class="text-sm text-gray-700">{{ viewingApplication.contact_no }}</p>
                        <p class="text-sm text-gray-700">{{ viewingApplication.email_address }}</p>
                    </div>
                    <div>
                        <p class="text-xs font-medium text-gray-500 uppercase tracking-wider">Location</p>
                        <p class="text-sm text-gray-700">{{ viewingApplication.dzongkhag }}, {{ viewingApplication.gewog || 'N/A' }}</p>
                    </div>
                    <div>
                        <p class="text-xs font-medium text-gray-500 uppercase tracking-wider">Course Start Date</p>
                        <p class="text-sm text-gray-700">{{ formatDate(viewingApplication.commencement_date) }}</p>
                    </div>
                </div>

                <div class="pt-4 border-t border-gray-100">
                    <p class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">DPR Details</p>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <p class="text-sm font-semibold text-gray-800 mb-1">Executive Summary</p>
                            <p class="text-sm text-gray-600 break-words">{{ viewingApplication.executive_summary || 'Not provided' }}</p>
                        </div>
                        <div>
                            <p class="text-sm font-semibold text-gray-800 mb-1">DPR Review Summary</p>
                            <p class="text-sm text-gray-600 break-words">{{ viewingApplication.do_dpr_review_summary || 'Pending Review' }}</p>
                        </div>
                    </div>
                </div>

                <div class="pt-4 border-t border-gray-100">
                    <p class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Program Information</p>
                    <div class="flex flex-wrap gap-x-6 gap-y-4">
                        <div>
                            <p class="text-sm font-semibold text-gray-800">Program Type</p>
                            <p class="text-sm text-gray-600">{{ viewingApplication.type_of_programme === 'D' ? 'Diploma' : viewingApplication.type_of_programme === 'B' ? 'Bachelor' : 'Other' }}</p>
                        </div>
                        <div>
                            <p class="text-sm font-semibold text-gray-800">Duration</p>
                            <p class="text-sm text-gray-600">{{ viewingApplication.course_duration }} months</p>
                        </div>
                        <div v-if="viewingApplication.do_dpr_review_decision === STATUS_REJECTED && viewingApplication.do_dpr_reason_if_rejected">
                            <p class="text-sm font-semibold text-red-700">Rejection Reason</p>
                            <p class="text-sm text-red-600 break-words">{{ viewingApplication.do_dpr_reason_if_rejected }}</p>
                        </div>
                    </div>
                </div>

                <div class="pt-4 border-t border-gray-100">
                  <p class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Application Timeline</p>
                  <div class="relative pl-6">
                      <div class="absolute left-2 top-0 h-full w-0.5 bg-gray-200"></div>
                      <div v-for="(event, index) in getTimeline(viewingApplication)" :key="index" class="mb-4 relative">
                          <div class="absolute left-[-20px] top-1 w-4 h-4 bg-blue-600 rounded-full border-2 border-white"></div>
                          <p class="text-sm font-medium text-gray-800">{{ event.status }}</p>
                          <p class="text-xs text-gray-500">{{ formatDate(event.date) }}</p>
                      </div>
                  </div>
                </div>
            </div>
            <div class="mt-6 flex justify-end">
                <button @click="closeDetailsModal" class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Close</button>
            </div>
        </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
// Removed useRouter as startNewApplication now opens a modal
import { useToast } from 'vue-toastification'
import { useAuthStore } from '@/stores/authStore'
import debounce from 'lodash/debounce'
import apiServices from '@/services/services'
import InstituteHeader from '@/components/common/MHPC/InstituteHeader.vue'
import PaymentModal from '@/components/common/PaymentModal.vue'
import DPRApplicationFormModal from './InstituteDPRApplication.vue'

const toast = useToast()
const authStore = useAuthStore()

const STATUS_APPROVED = 'Approved'
const STATUS_REJECTED = 'Rejected'
const STATUS_PENDING = 'Pending' // Could add more like 'In Review', 'Submitted'
const statusOptions = [STATUS_APPROVED, STATUS_REJECTED, STATUS_PENDING, 'In Review', 'Submitted']
const dzongkhagOptions = [
  'Bumthang', 'Chukha', 'Dagana', 'Gasa', 'Haa', 'Lhuntse', 'Mongar', 'Paro',
  'Pemagatshel', 'Punakha', 'Samdrup Jongkhar', 'Samtse', 'Sarpang', 'Thimphu',
  'Trashigang', 'Trashiyangtse', 'Trongsa', 'Tsirang', 'Wangdue Phodrang', 'Zhemgang',
]

const applications = ref([])
const isLoading = ref(false)
const apiError = ref(false)
const errorMessage = ref('')
const searchQuery = ref('')
const filterStatus = ref('')
const filterDzongkhag = ref('')
const sortOrder = ref('desc') // 'desc' for newest first
const currentPage = ref(1)
const itemsPerPage = ref(10) // Made this a ref in case you want to change it

const isActionLoading = ref({}) // For individual application buttons loading state

const showPaymentConfirmModal = ref(false)
const showCertificateModal = ref(false)
const selectedApplication = ref(null) // For payment/certificate modals

const paymentModalRef = ref(null)
const selectedApplicationForPayment = ref(null)
const dprPaymentAmount = ref(1500) // Example DPR Payment Amount
const paymentOutcomeHandled = ref(false);


// For New Application Modal
const showAddApplicationModal = ref(false)

// For Details Modal
const showDetailsModal = ref(false)
const viewingApplication = ref(null)


const filteredApplications = computed(() => {
  let result = applications.value
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(
      (app) =>
        app.name_of_institution?.toLowerCase().includes(query) ||
        app.dpr_name?.toLowerCase().includes(query)  ||
        app.CID?.toLowerCase().includes(query)
    )
  }
  if (filterStatus.value) {
    result = result.filter((app) => app.do_dpr_review_decision === filterStatus.value)
  }
  if (filterDzongkhag.value) {
    result = result.filter((app) => app.dzongkhag === filterDzongkhag.value)
  }
  // Sorting by created_at or commencement_date as fallback
  return result.sort((a, b) => {
    const dateA = new Date(a.created_at || a.commencement_date || 0)
    const dateB = new Date(b.created_at || b.commencement_date || 0)
    return sortOrder.value === 'desc' ? dateB - dateA : dateA - dateB
  })
})

const totalPages = computed(() => Math.ceil(filteredApplications.value.length / itemsPerPage.value))

const paginatedApplications = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredApplications.value.slice(start, end)
})

const getStatusColor = (status) => {
  switch (status) {
    case STATUS_APPROVED: return 'bg-green-100 text-green-700'
    case STATUS_REJECTED: return 'bg-red-100 text-red-700'
    case STATUS_PENDING: return 'bg-yellow-100 text-yellow-700'
    case 'In Review': return 'bg-blue-100 text-blue-700'
    case 'Submitted': return 'bg-gray-100 text-gray-700'
    default: return 'bg-gray-100 text-gray-700'
  }
}

const getStatusTooltip = (status) => {
  switch (status) {
    case STATUS_APPROVED: return 'Application has been approved. Proceed to payment if pending.'
    case STATUS_REJECTED: return 'Application was rejected. Review the reason for rejection.'
    case STATUS_PENDING: return 'Application is awaiting review.'
    case 'In Review': return 'Application is currently under review.'
    case 'Submitted': return 'Application has been submitted and is pending processing.'
    default: return 'Status not available.'
  }
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'Invalid Date'
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) // dd-mmm-yyyy
  } catch (e) {
    console.error('Error formatting date:', e, dateString) // Log the error for debugging
    
    return 'Date Error'
  }
}

const isApplicationApproved = (app) => app.do_dpr_review_decision === STATUS_APPROVED
const isPaymentPending = (app) => isApplicationApproved(app) && !app.is_payment_complete
const isPaymentCompleted = (app) => isApplicationApproved(app) && app.is_payment_complete === true


const sortApplications = () => {
  sortOrder.value = sortOrder.value === 'desc' ? 'asc' : 'desc'
  currentPage.value = 1 // Reset to first page after sorting
}

const debouncedSearch = debounce(() => {
  currentPage.value = 1 // Reset to first page on search
}, 300)

watch(searchQuery, debouncedSearch)
watch([filterStatus, filterDzongkhag], () => {
  currentPage.value = 1 // Reset to first page on filter change
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
    const response = await apiServices.getMhpcInstitutes() // Ensure this API fetches relevant fields
    if (response && response.data && Array.isArray(response.data.results)) {
      const userCid = authStore.user.cid.toLowerCase();
      applications.value = response.data.results
        .filter(app => app && typeof app.CID === 'string' && app.CID.toLowerCase() === userCid)
        .map(app => ({ ...app, is_payment_complete: app.is_payment_complete || false }));
    } else {
      applications.value = []
    }
  } catch (error) {
    console.error('Error fetching DPR applications:', error)
    applications.value = []
    apiError.value = true
    errorMessage.value = error.response?.data?.message || 'Failed to fetch applications.'
    toast.error(errorMessage.value)
  } finally {
    isLoading.value = false
  }
}

// --- Payment Flow Functions ---
const openPaymentConfirmationModal = (application) => {
  selectedApplication.value = application
  paymentOutcomeHandled.value = false;
  if (application && application.id) isActionLoading.value[application.id] = true
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
    toast.error('No application selected for payment.')
    if(selectedApplication.value?.id) isActionLoading.value[selectedApplication.value.id] = false;
    return
  }
  showPaymentConfirmModal.value = false
  selectedApplicationForPayment.value = selectedApplication.value

  if (paymentModalRef.value && typeof paymentModalRef.value.openModal === 'function') {
    paymentModalRef.value.openModal()
  } else {
    console.error('Payment modal or openModal method not available.')
    toast.error('Could not open payment window.')
    if(selectedApplication.value?.id) isActionLoading.value[selectedApplication.value.id] = false;
    selectedApplication.value = null;
    selectedApplicationForPayment.value = null;
  }
}

const handleDPRPaymentCompleted = async (paymentData) => {
  paymentOutcomeHandled.value = true;
  if (!selectedApplicationForPayment.value) {
    toast.error('Error: No application associated with this payment.')
    const initialAppId = selectedApplication.value?.id;
    if (initialAppId && isActionLoading.value[initialAppId]) {
        isActionLoading.value[initialAppId] = false;
    }
    return
  }
  const appBeingPaid = selectedApplicationForPayment.value
  try {
    // --- TODO: API CALL TO UPDATE PAYMENT STATUS ON BACKEND ---
    // Example: await apiServices.updateDprApplicationPaymentStatus(appBeingPaid.id, { is_payment_complete: true, payment_reference: paymentData.transactionId });
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    console.log('Simulated payment update for:', appBeingPaid.dpr_name, paymentData)

    const appIndex = applications.value.findIndex((a) => a.id === appBeingPaid.id)
    if (appIndex !== -1) {
      applications.value[appIndex] = { ...applications.value[appIndex], is_payment_complete: true }
    }
    toast.success(`Payment for "${appBeingPaid.dpr_name}" completed.`)
    // PaymentModal will emit 'close', which calls closeDPRPaymentModal
  } catch (error) {
    console.error('Error updating DPR application after payment:', error)
    toast.error('Failed to update application after payment.')
  } finally {
     if (appBeingPaid && appBeingPaid.id) {
        isActionLoading.value[appBeingPaid.id] = false
     }
    // selectedApplicationForPayment.value = null // Done in closeDPRPaymentModal
    // selectedApplication.value = null; // Done in closeDPRPaymentModal
  }
}

const closeDPRPaymentModal = () => {
    if (!paymentOutcomeHandled.value) { // Only show 'cancelled' if not completed
        toast.info('Payment process cancelled.')
    }
    paymentOutcomeHandled.value = false; // Reset for next time

    const appForLoadingReset = selectedApplicationForPayment.value || selectedApplication.value;
    if (appForLoadingReset && appForLoadingReset.id && isActionLoading.value[appForLoadingReset.id] !== undefined) {
        isActionLoading.value[appForLoadingReset.id] = false;
    }
    selectedApplicationForPayment.value = null
    selectedApplication.value = null
}

// --- Certificate Flow ---
const openCertificateModal = (application) => {
  selectedApplication.value = application
  if (application && application.id) isActionLoading.value[application.id] = true;
  showCertificateModal.value = true
}

const handleViewCertificate = async (application) => {
  if (!application || !application.id) {
    const currentSelectedAppId = selectedApplication.value?.id;
    if (currentSelectedAppId && isActionLoading.value[currentSelectedAppId]) {
        isActionLoading.value[currentSelectedAppId] = false;
    }
    selectedApplication.value = null;
    return;
  }
  try {
    // Simulate certificate generation/fetch
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.info(`Certificate for "${application.dpr_name}" would open here (simulated).`);
    // window.open(`/api/certificate/${application.id}`, '_blank');
    showCertificateModal.value = false;
  } catch (error) {
    console.error('Error viewing certificate:', error);
    toast.error('Failed to view certificate.');
  } finally {
    if (application && application.id) isActionLoading.value[application.id] = false;
    selectedApplication.value = null;
  }
}

// --- New Application Modal ---
const openNewApplicationModal = () => {
  showAddApplicationModal.value = true
}

const closeNewApplicationModal = () => {
  showAddApplicationModal.value = false
}

const handleApplicationSubmitted = (newApplicationData) => {
  // Assuming the form modal returns the newly created application data
  // or just signals success, requiring a refetch.
  toast.success(`New DPR Application "${newApplicationData?.dpr_name || 'Application'}" submitted successfully!`);
  fetchApplications(); // Refresh the list
  closeNewApplicationModal();
}

// --- View Details Modal ---
const viewApplicationDetails = (application) => {
    viewingApplication.value = application;
    showDetailsModal.value = true;
}
const closeDetailsModal = () => {
    showDetailsModal.value = false;
    viewingApplication.value = null;
}

const getTimeline = (app) => {
  // This function is now used by the details modal
  if (!app) return [];
  return [
    { status: 'Submitted', date: app.created_at || new Date().toISOString() },
    // Add more timeline events if available in your data model
    {
      status: `Status: ${app.do_dpr_review_decision || 'Pending'}`,
      date: app.updated_at || app.created_at || new Date().toISOString(),
    },
     ...(app.is_payment_complete ? [{ status: 'Payment Completed', date: app.payment_completed_at || app.updated_at }] : []) // Assuming you have payment_completed_at
  ].sort((a,b) => new Date(a.date) - new Date(b.date));
}


onMounted(fetchApplications)
</script>

<style scoped>
/* Additional scoped styles if needed */
.disabled\:opacity-50:disabled {
  opacity: 0.5;
}
.disabled\:cursor-not-allowed:disabled {
  cursor: not-allowed;
}
</style>