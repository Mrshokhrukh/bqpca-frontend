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
            :disabled="isLoading"
            class="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50"
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
                  {{ application.do_dpr_review_decision || application.application_status || 'N/A' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(application.created_at) }}</td>
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
              v-for="page in totalPagesArray"
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
          No DPR applications found matching your records or filters.
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
            :disabled="isActionLoading[selectedApplication?.id || '']"
            class="inline-flex items-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
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
            @click="closeCertificateModal"
            class="inline-flex items-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            @click="handleViewCertificate(selectedApplication)"
            :disabled="isActionLoading[selectedApplication?.id || '']"
            class="inline-flex items-center rounded-md border border-transparent bg-green-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-green-700 disabled:opacity-50"
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

    <!-- Application Details Modal -->
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
                    <span :class="['px-2.5 py-1 text-xs font-medium rounded-full', getStatusColor(viewingApplication.do_dpr_review_decision || viewingApplication.application_status)]" :title="getStatusTooltip(viewingApplication.do_dpr_review_decision || viewingApplication.application_status)">
                        {{ viewingApplication.do_dpr_review_decision || viewingApplication.application_status || 'N/A' }}
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
                         <p class="text-sm text-gray-700">{{ viewingApplication.address }}</p>
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
                            <p class="text-sm font-semibold text-gray-800 mb-1">DPR Review Summary (by DO)</p>
                            <p class="text-sm text-gray-600 break-words">{{ viewingApplication.do_dpr_review_summary || 'Pending Review' }}</p>
                        </div>
                    </div>
                </div>

                <div class="pt-4 border-t border-gray-100">
                    <p class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Program Information</p>
                    <div class="flex flex-wrap gap-x-6 gap-y-4">
                        <div>
                            <p class="text-sm font-semibold text-gray-800">Program Type</p>
                            <!-- Assuming program_type is an object with a name after fetch, or just the ID if not expanded -->
                            <p class="text-sm text-gray-600">{{ viewingApplication.program_type?.name || viewingApplication.program_type?.program_name || viewingApplication.program_type || 'N/A' }}</p>
                        </div>
                        <div>
                            <p class="text-sm font-semibold text-gray-800">Duration</p>
                            <p class="text-sm text-gray-600">{{ viewingApplication.course_duration ? `${viewingApplication.course_duration} months` : 'N/A' }}</p>
                        </div>
                        <div v-if="(viewingApplication.do_dpr_review_decision === STATUS_REJECTED || viewingApplication.application_status === 'Final Rejected') && (viewingApplication.do_dpr_reason_if_rejected || viewingApplication.reason_if_rejected)">
                            <p class="text-sm font-semibold text-red-700">Rejection Reason</p>
                            <p class="text-sm text-red-600 break-words">{{ viewingApplication.do_dpr_reason_if_rejected || viewingApplication.reason_if_rejected }}</p>
                        </div>
                    </div>
                </div>

                <div class="pt-4 border-t border-gray-100">
                  <p class="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Application Timeline</p>
                  <div class="relative pl-6">
                      <div class="absolute left-2 top-0 h-full w-0.5 bg-gray-200"></div>
                      <div v-if="getTimeline(viewingApplication).length === 0" class="text-sm text-gray-500">No timeline events available.</div>
                      <div v-for="(event, index) in getTimeline(viewingApplication)" :key="index" class="mb-4 relative">
                          <div class="absolute left-[-20px] top-1 w-4 h-4 bg-blue-600 rounded-full border-2 border-white"></div>
                          <p class="text-sm font-medium text-gray-800">{{ event.status }}</p>
                          <p class="text-xs text-gray-500">{{ formatDate(event.date) }}</p>
                          <p v-if="event.remarks" class="text-xs text-gray-500 mt-0.5 italic">Remarks: {{ event.remarks }}</p>
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
import { ref, computed, onMounted, watch } from 'vue';
import { useToast } from 'vue-toastification';
import { useAuthStore } from '@/stores/authStore';
import debounce from 'lodash/debounce';
import apiServices from '@/services/services';
import InstituteHeader from '@/components/common/MHPC/InstituteHeader.vue';
import PaymentModal from '@/components/common/PaymentModal.vue';
import DPRApplicationFormModal from './InstituteDPRApplication.vue'; // Corrected self-reference

const toast = useToast();
const authStore = useAuthStore();

const STATUS_APPROVED = 'Approved';
const STATUS_REJECTED = 'Rejected';
const STATUS_PENDING_REVIEW = 'Pending Review'; // Example specific status
const STATUS_DPR_SUBMITTED = 'DPR Submitted'; // From your model's ApplicationStatusChoices
const STATUS_PAYMENT_PENDING = 'Payment Pending';
const STATUS_FULLY_APPROVED = 'Fully Approved';
const STATUS_FINAL_REJECTED = 'Final Rejected';


// Status options for the filter dropdown
const statusOptions = [
    STATUS_DPR_SUBMITTED, STATUS_PENDING_REVIEW, STATUS_APPROVED, STATUS_REJECTED,
    STATUS_PAYMENT_PENDING, STATUS_FULLY_APPROVED, STATUS_FINAL_REJECTED
];

const dzongkhagOptions = [
  'Bumthang', 'Chukha', 'Dagana', 'Gasa', 'Haa', 'Lhuntse', 'Mongar', 'Paro',
  'Pemagatshel', 'Punakha', 'Samdrup Jongkhar', 'Samtse', 'Sarpang', 'Thimphu',
  'Trashigang', 'Trashiyangtse', 'Trongsa', 'Tsirang', 'Wangdue Phodrang', 'Zhemgang',
];

const applications = ref([]);
const isLoading = ref(false);
const apiError = ref(false);
const errorMessage = ref('');
const searchQuery = ref('');
const filterStatus = ref('');
const filterDzongkhag = ref('');
const sortOrder = ref('desc');
const currentPage = ref(1);
const itemsPerPage = ref(10);

const isActionLoading = ref({});

const showPaymentConfirmModal = ref(false);
const showCertificateModal = ref(false);
const selectedApplication = ref(null);

const paymentModalRef = ref(null);
const selectedApplicationForPayment = ref(null);
const dprPaymentAmount = ref(1500); // Example DPR Payment Amount
const paymentOutcomeHandled = ref(false);

const showAddApplicationModal = ref(false);
const showDetailsModal = ref(false);
const viewingApplication = ref(null);

const filteredApplications = computed(() => {
  let result = applications.value;
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (app) =>
        app.name_of_institution?.toLowerCase().includes(query) ||
        app.dpr_name?.toLowerCase().includes(query) ||
        app.CID?.toLowerCase().includes(query)
    );
  }
  if (filterStatus.value) {
    // Filter by overall application_status or do_dpr_review_decision
    result = result.filter((app) =>
        app.application_status === filterStatus.value ||
        app.do_dpr_review_decision === filterStatus.value
    );
  }
  if (filterDzongkhag.value) {
    result = result.filter((app) => app.dzongkhag === filterDzongkhag.value);
  }
  return result.sort((a, b) => {
    const dateA = new Date(a.updated_at || a.created_at || 0); // Prefer updated_at for sorting
    const dateB = new Date(b.updated_at || b.created_at || 0);
    return sortOrder.value === 'desc' ? dateB - dateA : dateA - dateB;
  });
});

const totalPages = computed(() => Math.ceil(filteredApplications.value.length / itemsPerPage.value));
const totalPagesArray = computed(() => {
    const pages = [];
    for (let i = 1; i <= totalPages.value; i++) {
        pages.push(i);
    }
    return pages;
});


const paginatedApplications = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredApplications.value.slice(start, end);
});

const getStatusColor = (status) => {
  if (!status) return 'bg-gray-100 text-gray-700';
  const s = status.toLowerCase();
  if (s.includes('approved') || s.includes(STATUS_FULLY_APPROVED.toLowerCase())) return 'bg-green-100 text-green-700';
  if (s.includes('rejected') || s.includes(STATUS_FINAL_REJECTED.toLowerCase())) return 'bg-red-100 text-red-700';
  if (s.includes('pending') || s.includes('submitted') || s.includes(STATUS_DPR_SUBMITTED.toLowerCase())) return 'bg-yellow-100 text-yellow-700';
  if (s.includes('review') || s === STATUS_PENDING_REVIEW.toLowerCase()) return 'bg-blue-100 text-blue-700';
  if (s.includes(STATUS_PAYMENT_PENDING.toLowerCase())) return 'bg-purple-100 text-purple-700';
  return 'bg-gray-100 text-gray-700';
};

const getStatusTooltip = (status) => {
  if (!status) return 'Status not available.';
  switch (status) {
    case STATUS_APPROVED: return 'DPR review approved. Payment might be pending.';
    case STATUS_REJECTED: return 'DPR review rejected. Check reasons.';
    case STATUS_PENDING_REVIEW: return 'DPR is under review by Desk Officer.';
    case STATUS_DPR_SUBMITTED: return 'DPR has been submitted, awaiting review.';
    case STATUS_PAYMENT_PENDING: return 'DPR approved, payment is pending for final accreditation.';
    case STATUS_FULLY_APPROVED: return 'Application is fully approved and accredited.';
    case STATUS_FINAL_REJECTED: return 'Application has been finally rejected.';
    default: return `Status: ${status}`;
  }
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.warn('Invalid date string received for formatDate:', dateString);
      return 'Invalid Date';
    }
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch (e) {
    console.error('Error formatting date:', dateString, e);
    return 'Date Error';
  }
};

const isApplicationDPRApproved = (app) => app.do_dpr_review_decision === STATUS_APPROVED;
const isPaymentPending = (app) =>
    (app.application_status === STATUS_PAYMENT_PENDING || isApplicationDPRApproved(app)) &&
    app.is_payment_complete === false; // Explicitly check for false

const isPaymentCompleted = (app) =>
    app.application_status === STATUS_FULLY_APPROVED ||
    (isApplicationDPRApproved(app) && app.is_payment_complete === true);


const sortApplications = () => {
  sortOrder.value = sortOrder.value === 'desc' ? 'asc' : 'desc';
  currentPage.value = 1;
};

const debouncedSearch = debounce(() => {
  currentPage.value = 1;
}, 300);

watch(searchQuery, debouncedSearch);
watch([filterStatus, filterDzongkhag], () => {
  currentPage.value = 1;
});

const fetchApplications = async () => {
  if (!authStore.user || !authStore.user.cid) {
    errorMessage.value = 'User information not available. Please log in again.';
    apiError.value = true;
    isLoading.value = false;
    return;
  }
  isLoading.value = true;
  apiError.value = false;
  errorMessage.value = '';
  try {
    const response = await apiServices.getMhpcInstitutes();
    if (response && response.data && Array.isArray(response.data.results)) {
      const userCid = authStore.user.cid.toLowerCase();
      applications.value = response.data.results
        .filter(app =>
          app &&
          typeof app.CID === 'string' && app.CID.toLowerCase() === userCid &&
          (app.dpr_name !== undefined && app.dpr_name !== null) // Ensure it's a DPR app
        )
        .map(app => ({
            ...app,
            is_payment_complete: app.is_payment_complete === true // Normalize boolean
        }));
    } else {
      applications.value = [];
    }
  } catch (error) {
    console.error('Error fetching DPR applications:', error);
    applications.value = [];
    apiError.value = true;
    errorMessage.value = error.response?.data?.message || error.response?.data?.detail || 'Failed to fetch applications.';
    toast.error(errorMessage.value);
  } finally {
    isLoading.value = false;
  }
};

const openPaymentConfirmationModal = (application) => {
  selectedApplication.value = application;
  paymentOutcomeHandled.value = false;
  if (application && application.id) isActionLoading.value[application.id] = true;
  showPaymentConfirmModal.value = true;
};

const cancelPaymentConfirmation = () => {
  showPaymentConfirmModal.value = false;
  if (selectedApplication.value && selectedApplication.value.id) {
    isActionLoading.value[selectedApplication.value.id] = false;
  }
  selectedApplication.value = null;
};

const handleProceedWithPaymentFlow = async () => {
  const currentApp = selectedApplication.value;
  if (!currentApp || !currentApp.id) {
    toast.error('No application selected for payment.');
    if (currentApp?.id) isActionLoading.value[currentApp.id] = false;
    showPaymentConfirmModal.value = false; // Close confirm modal
    return;
  }
  showPaymentConfirmModal.value = false;
  selectedApplicationForPayment.value = currentApp;

  if (paymentModalRef.value && typeof paymentModalRef.value.openModal === 'function') {
    paymentModalRef.value.openModal();
  } else {
    console.error('Payment modal or openModal method not available.');
    toast.error('Could not open payment window.');
    if (currentApp?.id) isActionLoading.value[currentApp.id] = false;
    selectedApplication.value = null;
    selectedApplicationForPayment.value = null;
  }
};

const handleDPRPaymentCompleted = async (paymentData) => {
  paymentOutcomeHandled.value = true;
  const appBeingPaid = selectedApplicationForPayment.value; // Use the one stored before opening payment modal

  if (!appBeingPaid || !appBeingPaid.id) {
    toast.error('Error: No application associated with this payment.');
     // Reset loading for the initially selected app if it's different or still set
    const initialAppId = selectedApplication.value?.id || appBeingPaid?.id;
    if (initialAppId) isActionLoading.value[initialAppId] = false;
    return;
  }

  try {
    // API CALL TO UPDATE PAYMENT STATUS ON BACKEND
    // Replace with your actual API call:
    // await apiServices.updateDprApplicationPaymentStatus(appBeingPaid.id, { is_payment_complete: true, payment_id: paymentData.transactionId, application_status: STATUS_FULLY_APPROVED });
    console.log('Simulating payment update for:', appBeingPaid.dpr_name, paymentData);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

    // Update local data optimistically or refetch
    const appIndex = applications.value.findIndex((a) => a.id === appBeingPaid.id);
    if (appIndex !== -1) {
      applications.value[appIndex] = {
        ...applications.value[appIndex],
        is_payment_complete: true,
        application_status: STATUS_FULLY_APPROVED, // Assume backend sets this
        payment_id: paymentData.transactionId // Store payment ID if available
      };
    }
    toast.success(`Payment for "${appBeingPaid.dpr_name}" completed successfully.`);
  } catch (error) {
    console.error('Error updating DPR application after payment:', error);
    toast.error(error.response?.data?.detail || 'Failed to update application after payment.');
  } finally {
    if (appBeingPaid?.id) isActionLoading.value[appBeingPaid.id] = false;
    // selectedApplicationForPayment is reset in closeDPRPaymentModal
    // selectedApplication (from the confirm modal) is also reset there
  }
};

const closeDPRPaymentModal = () => {
  if (!paymentOutcomeHandled.value) {
    toast.info('Payment process cancelled.');
  }
  paymentOutcomeHandled.value = false;

  const appForLoadingReset = selectedApplicationForPayment.value || selectedApplication.value;
  if (appForLoadingReset?.id && isActionLoading.value[appForLoadingReset.id] !== undefined) {
    isActionLoading.value[appForLoadingReset.id] = false;
  }
  selectedApplicationForPayment.value = null;
  selectedApplication.value = null; // Also reset the one from confirm modal
};

const openCertificateModal = (application) => {
  selectedApplication.value = application;
  if (application?.id) isActionLoading.value[application.id] = true;
  showCertificateModal.value = true;
};

const closeCertificateModal = () => {
    showCertificateModal.value = false;
    if (selectedApplication.value?.id) {
        isActionLoading.value[selectedApplication.value.id] = false;
    }
    selectedApplication.value = null;
};

const handleViewCertificate = async (application) => {
    const currentApp = application || selectedApplication.value;
    if (!currentApp || !currentApp.id) {
        toast.error("No application selected to view certificate.");
        closeCertificateModal();
        return;
    }
    try {
        // Simulate certificate generation/fetch or API call
        // const certificateUrl = await apiServices.getDprCertificateUrl(currentApp.id);
        // window.open(certificateUrl, '_blank');
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate
        toast.info(`Certificate for "${currentApp.dpr_name}" would open here (simulated).`);
        closeCertificateModal();
    } catch (error) {
        console.error('Error viewing certificate:', error);
        toast.error(error.response?.data?.detail ||'Failed to view certificate.');
    } finally {
        if (currentApp?.id) isActionLoading.value[currentApp.id] = false;
        // selectedApplication is reset by closeCertificateModal
    }
};


const openNewApplicationModal = () => {
  showAddApplicationModal.value = true;
};

const closeNewApplicationModal = () => {
  showAddApplicationModal.value = false;
};

const handleApplicationSubmitted = async (newApplicationDataFromModal) => {
  // The child modal now emits the actual data from the API response
  // if the API call was made in the child.
  // If API call is made here (parent), newApplicationDataFromModal is the form data.

  // Assuming API call is made in the parent now (as per earlier suggestion)
  isLoading.value = true; // For overall page loading state
  const submittingToastId = toast.info("Submitting new DPR application...", { timeout: false });

  try {
    // The 'payload' is newApplicationDataFromModal if child only emits form data
    const response = await apiServices.createMhpcInstitute(newApplicationDataFromModal);

    toast.dismiss(submittingToastId);
    if (response && response.data) { // Check for actual response data
      toast.success(`New DPR Application "${response.data.dpr_name || newApplicationDataFromModal.dpr_name}" submitted successfully!`);
      await fetchApplications(); // Refresh the list to include the new entry
      closeNewApplicationModal();
    } else {
      toast.error('Failed to submit DPR application. Unexpected response from server.');
    }
  } catch (error) {
    toast.dismiss(submittingToastId);
    console.error("Error submitting DPR application from parent:", error);
    const errorMessage = error.response?.data?.detail ||
                         (typeof error.response?.data === 'object' ? Object.values(error.response.data).flat().join(' ') : null) ||
                         error.message ||
                         "An error occurred during submission.";
    toast.error(`Submission failed: ${errorMessage}`);
  } finally {
    isLoading.value = false;
  }
};


const viewApplicationDetails = (application) => {
  viewingApplication.value = application;
  showDetailsModal.value = true;
};
const closeDetailsModal = () => {
  showDetailsModal.value = false;
  viewingApplication.value = null;
};

const getTimeline = (app) => {
  if (!app) return [];
  const timelineEvents = [];

  // Initial Submission
  if (app.created_at) {
    timelineEvents.push({ status: 'Application Submitted', date: app.created_at });
  }

  // DPR Review Status (if available and different from initial submission)
  if (app.do_dpr_review_decision && app.do_dpr_review_decision !== 'Pending' && app.do_dpr_review_decision !== 'Submitted') {
     timelineEvents.push({
      status: `DPR Review: ${app.do_dpr_review_decision}`,
      date: app.updated_at, // Assuming updated_at reflects this change
      remarks: app.do_dpr_reason_if_rejected || app.do_dpr_review_summary
    });
  } else if (app.application_status === STATUS_DPR_SUBMITTED || app.application_status === STATUS_PENDING_REVIEW) {
    // If no explicit decision yet, but status indicates it's in DPR phase
    if (!timelineEvents.some(e => e.date === app.updated_at && e.status.includes('DPR'))) {
         timelineEvents.push({ status: app.application_status, date: app.updated_at || app.created_at});
    }
  }


  // Payment Status
  if (app.application_status === STATUS_PAYMENT_PENDING && !app.is_payment_complete) {
    timelineEvents.push({ status: 'Payment Pending', date: app.updated_at });
  }
  if (app.is_payment_complete && app.payment_id) {
    // Ideally, you'd have a `payment_completed_at` timestamp.
    // Using `updated_at` as a fallback.
    timelineEvents.push({ status: 'Payment Completed', date: app.payment_completed_at || app.updated_at, remarks: `Ref: ${app.payment_id}` });
  }

  // Final Approval/Rejection
  if (app.application_status === STATUS_FULLY_APPROVED) {
    timelineEvents.push({ status: 'Fully Approved (Accredited)', date: app.valid_since || app.updated_at });
  } else if (app.application_status === STATUS_FINAL_REJECTED) {
     timelineEvents.push({ status: 'Application Finally Rejected', date: app.updated_at, remarks: app.reason_if_rejected });
  }


  // Remove duplicate events based on status and date (within a small threshold if needed)
  const uniqueEvents = timelineEvents.filter((event, index, self) =>
    index === self.findIndex((e) => (
      e.status === event.status && new Date(e.date).toDateString() === new Date(event.date).toDateString()
    ))
  );

  return uniqueEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
};

onMounted(fetchApplications);
</script>

<style scoped>
.disabled\:opacity-50:disabled {
  opacity: 0.5;
}
.disabled\:cursor-not-allowed:disabled {
  cursor: not-allowed;
}
.max-h-\[90vh\] {
  max-height: 90vh;
}
.overflow-y-auto {
  overflow-y: auto;
}
</style>