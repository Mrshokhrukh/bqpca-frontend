<template>
  <div class="min-h-screen py-8">
    <InstituteHeader
      title="DPR Applications Management"
      subtitle="Manage and track Detailed Project Report applications for MHPC accreditation."
      :show-actions="false"
      class="mx-4"
    />

    <div v-if="!isLoading && !apiError" class="mx-4">
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
                      sortOrder === 'desc'
                        ? 'M19 14l-7 7m0 0l-7-7m7 7V3'
                        : 'M5 10l7-7m0 0l7 7m-7-7v18'
                    "
                  />
                </svg>
              </button>
            </div>
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
                Add New DPR
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
                  Dzongkhag
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
                  Submitted On
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
                  {{ application.dpr_name }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ application.dzongkhag }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="[
                      'px-2.5 py-0.5 text-xs font-medium rounded-full',
                      getStatusColor(application.do_dpr_review_decision),
                    ]"
                    :title="getStatusTooltip(application.do_dpr_review_decision)"
                  >
                    {{
                      application.do_dpr_review_decision || application.application_status || 'N/A'
                    }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(application.created_at) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    @click="viewApplicationDetails(application)"
                    class="text-indigo-600 hover:text-indigo-900"
                    title="View Details"
                  >
                    View
                  </button>
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

    <div v-else-if="isLoading" class="mx-4">
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

    <PaymentModal
      ref="paymentModalRef"
      :amount="dprPaymentAmount"
      @payment-completed="handleDPRPaymentCompleted"
      @close="closeDPRPaymentModal"
    />

    <DPRApplicationFormModal
      :is-visible="showAddApplicationModal"
      @close="closeNewApplicationModal"
      @application-submitted="handleApplicationSubmitted"
    />

    <div
      v-if="showDetailsModal && viewingApplication"
      class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 p-4"
    >
      <div
        class="bg-white rounded-lg shadow-xl p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-xl font-semibold text-gray-900">Application Details</h3>
          <button @click="closeDetailsModal" class="text-gray-400 hover:text-gray-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div class="space-y-6">
          <div class="pb-4 border-b border-gray-100">
            <h4 class="text-lg font-semibold text-gray-900 mb-1">
              {{ viewingApplication.name_of_institution }}
            </h4>
            <p class="text-sm text-gray-500 mb-2">
              CID: {{ viewingApplication.CID }} | DPR Name: {{ viewingApplication.dpr_name }}
            </p>
            <span
              :class="[
                'px-2.5 py-1 text-xs font-medium rounded-full',
                getStatusColor(
                  viewingApplication.do_dpr_review_decision || viewingApplication.application_status
                ),
              ]"
              :title="
                getStatusTooltip(
                  viewingApplication.do_dpr_review_decision || viewingApplication.application_status
                )
              "
            >
              {{
                viewingApplication.do_dpr_review_decision ||
                viewingApplication.application_status ||
                'N/A'
              }}
            </span>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Head of Institution
              </p>
              <p class="text-sm text-gray-700">{{ viewingApplication.head_of_institution_name }}</p>
              <p class="text-sm text-gray-700">
                {{ viewingApplication.head_of_institution_email }}
              </p>
            </div>
            <div>
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact Details
              </p>
              <p class="text-sm text-gray-700">{{ viewingApplication.contact_no }}</p>
              <p class="text-sm text-gray-700">{{ viewingApplication.email_address }}</p>
            </div>
            <div>
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wider">Location</p>
              <p class="text-sm text-gray-700">
                {{ viewingApplication.dzongkhag }}, {{ viewingApplication.gewog || 'N/A' }}
              </p>
              <p class="text-sm text-gray-700">{{ viewingApplication.address }}</p>
            </div>
            <div>
              <p class="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Course Start Date
              </p>
              <p class="text-sm text-gray-700">
                {{ formatDate(viewingApplication.commencement_date) }}
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
                <p class="text-sm text-gray-600 break-words">
                  {{ viewingApplication.executive_summary || 'Not provided' }}
                </p>
              </div>
              <div>
                <p class="text-sm font-semibold text-gray-800 mb-1">DPR Review Summary (by DO)</p>
                <p class="text-sm text-gray-600 break-words">
                  {{ viewingApplication.do_dpr_review_summary || 'Pending Review' }}
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
                    viewingApplication.program_type?.name ||
                    viewingApplication.program_type?.program_name ||
                    viewingApplication.program_type ||
                    'N/A'
                  }}
                </p>
              </div>
              <div>
                <p class="text-sm font-semibold text-gray-800">Duration</p>
                <p class="text-sm text-gray-600">
                  {{
                    viewingApplication.course_duration
                      ? `${viewingApplication.course_duration} months`
                      : 'N/A'
                  }}
                </p>
              </div>
              <div
                v-if="
                  (viewingApplication.do_dpr_review_decision === STATUS_REJECTED ||
                    viewingApplication.application_status === 'Final Rejected') &&
                  (viewingApplication.do_dpr_reason_if_rejected ||
                    viewingApplication.reason_if_rejected)
                "
              >
                <p class="text-sm font-semibold text-red-700">Rejection Reason</p>
                <p class="text-sm text-red-600 break-words">
                  {{
                    viewingApplication.do_dpr_reason_if_rejected ||
                    viewingApplication.reason_if_rejected
                  }}
                </p>
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
                v-if="getTimeline(viewingApplication).length === 0"
                class="text-sm text-gray-500"
              >
                No timeline events available.
              </div>
              <div
                v-for="(event, index) in getTimeline(viewingApplication)"
                :key="index"
                class="mb-4 relative"
              >
                <div
                  class="absolute left-[-20px] top-1 w-4 h-4 bg-blue-600 rounded-full border-2 border-white"
                ></div>
                <p class="text-sm font-medium text-gray-800">{{ event.status }}</p>
                <p class="text-xs text-gray-500">{{ formatDate(event.date) }}</p>
                <p v-if="event.remarks" class="text-xs text-gray-500 mt-0.5 italic">
                  Remarks: {{ event.remarks }}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="mt-6 flex justify-end">
          <button
            @click="closeDetailsModal"
            class="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '@/stores/authStore'
import debounce from 'lodash/debounce'
import apiServices from '@/services/services'
import InstituteHeader from '@/components/common/MHPC/InstituteHeader.vue'
import PaymentModal from '@/components/common/PaymentModal.vue'
import DPRApplicationFormModal from './InstituteDPRApplication.vue'

const toast = useToast()
const authStore = useAuthStore()

// It's good practice to define status constants to avoid typos
const ApplicationStatus = {
  EOI_APPROVED: 'EOI Approved',
  EOI_REJECTED: 'EOI Rejected',
  // --- All statuses that come AFTER EOI approval ---
  DPR_SUBMITTED: 'DPR Submitted',
  DPR_PENDING_REVIEW: 'DPR Pending Review',
  DPR_APPROVED: 'DPR Approved',
  DPR_REJECTED: 'DPR Rejected',
  PAYMENT_PENDING: 'Payment Pending',
  FULLY_APPROVED: 'Fully Approved',
  FINAL_REJECTED: 'Final Rejected',
}

const STATUS_APPROVED = 'Approved'
const STATUS_REJECTED = 'Rejected'
const STATUS_PENDING_REVIEW = 'Pending Review'
const STATUS_DPR_SUBMITTED = 'DPR Submitted'
const STATUS_PAYMENT_PENDING = 'Payment Pending'
const STATUS_FULLY_APPROVED = 'Fully Approved'
const STATUS_FINAL_REJECTED = 'Final Rejected'

// Status options for the filter dropdown
const statusOptions = [
  STATUS_DPR_SUBMITTED,
  STATUS_PENDING_REVIEW,
  STATUS_APPROVED,
  STATUS_REJECTED,
  STATUS_PAYMENT_PENDING,
  STATUS_FULLY_APPROVED,
  STATUS_FINAL_REJECTED,
]

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
const isLoading = ref(true)
const apiError = ref(false)
const errorMessage = ref('')
const searchQuery = ref('')
const filterStatus = ref('')
const filterDzongkhag = ref('')
const sortOrder = ref('desc')
const currentPage = ref(1)
const itemsPerPage = ref(10)
const isActionLoading = ref({})
const showPaymentConfirmModal = ref(false)
const showCertificateModal = ref(false)
const selectedApplication = ref(null)
const paymentModalRef = ref(null)
const selectedApplicationForPayment = ref(null)
const dprPaymentAmount = ref(1500)
const paymentOutcomeHandled = ref(false)
const showAddApplicationModal = ref(false)
const showDetailsModal = ref(false)
const viewingApplication = ref(null)

// *** NEW COMPUTED PROPERTY for checking EOI status ***
const dprEligibility = computed(() => {
  const application = applications.value[0]

  // If there's no application data yet, don't show anything definitive
  if (!application) {
    return {
      status: 'pending',
      message: 'Checking your application status...',
    }
  }

  const status = application.application_status
  const eoiRejectionReason = application.reason_if_rejected

  // List of statuses where DPR is allowed. This includes EOI Approved itself
  // and all subsequent steps in the lifecycle.
  const allowedStatuses = [
    ApplicationStatus.EOI_APPROVED,
    ApplicationStatus.DPR_SUBMITTED,
    ApplicationStatus.DPR_PENDING_REVIEW,
    ApplicationStatus.DPR_APPROVED,
    ApplicationStatus.DPR_REJECTED,
    ApplicationStatus.PAYMENT_PENDING,
    ApplicationStatus.FULLY_APPROVED,
    ApplicationStatus.FINAL_REJECTED,
  ]

  if (allowedStatuses.includes(status)) {
    return { status: 'allowed', message: '' }
  }

  if (status === ApplicationStatus.EOI_REJECTED) {
    return {
      status: 'rejected',
      message:
        'Your Expression of Interest (EOI) application was rejected. You cannot proceed with the DPR application until the EOI is approved.',
      rejectionReason: eoiRejectionReason || 'No reason provided.',
    }
  }

  // Default case for any other status (e.g., Draft, EOI Submitted, Pending Review, etc.)
  return {
    status: 'pending',
    message:
      'Your Expression of Interest (EOI) has not been approved yet. You cannot proceed with the DPR application until the EOI is approved.',
  }
})

const filteredApplications = computed(() => {
  let result = applications.value
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(
      (app) =>
        app.name_of_institution?.toLowerCase().includes(query) ||
        app.dpr_name?.toLowerCase().includes(query) ||
        app.CID?.toLowerCase().includes(query)
    )
  }
  if (filterStatus.value) {
    result = result.filter(
      (app) =>
        app.application_status === filterStatus.value ||
        app.do_dpr_review_decision === filterStatus.value
    )
  }
  if (filterDzongkhag.value) {
    result = result.filter((app) => app.dzongkhag === filterDzongkhag.value)
  }
  return result.sort((a, b) => {
    const dateA = new Date(a.updated_at || a.created_at || 0)
    const dateB = new Date(b.updated_at || b.created_at || 0)
    return sortOrder.value === 'desc' ? dateB - dateA : dateA - dateB
  })
})

const totalPages = computed(() => Math.ceil(filteredApplications.value.length / itemsPerPage.value))

const totalPagesArray = computed(() => {
  const pages = []
  for (let i = 1; i <= totalPages.value; i++) {
    pages.push(i)
  }
  return pages
})

const paginatedApplications = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredApplications.value.slice(start, end)
})

const getStatusColor = (status) => {
  if (!status) return 'bg-gray-100 text-gray-700'
  const s = status.toLowerCase()
  if (s.includes('approved') || s.includes(STATUS_FULLY_APPROVED.toLowerCase()))
    return 'bg-green-100 text-green-700'
  if (s.includes('rejected') || s.includes(STATUS_FINAL_REJECTED.toLowerCase()))
    return 'bg-red-100 text-red-700'
  if (
    s.includes('pending') ||
    s.includes('submitted') ||
    s.includes(STATUS_DPR_SUBMITTED.toLowerCase())
  )
    return 'bg-yellow-100 text-yellow-700'
  if (s.includes('review') || s === STATUS_PENDING_REVIEW.toLowerCase())
    return 'bg-blue-100 text-blue-700'
  if (s.includes(STATUS_PAYMENT_PENDING.toLowerCase())) return 'bg-purple-100 text-purple-700'
  return 'bg-gray-100 text-gray-700'
}

const getStatusTooltip = (status) => {
  if (!status) return 'Status not available.'
  switch (status) {
    case STATUS_APPROVED:
      return 'DPR review approved. Payment might be pending.'
    case STATUS_REJECTED:
      return 'DPR review rejected. Check reasons.'
    case STATUS_PENDING_REVIEW:
      return 'DPR is under review by Desk Officer.'
    case STATUS_DPR_SUBMITTED:
      return 'DPR has been submitted, awaiting review.'
    case STATUS_PAYMENT_PENDING:
      return 'DPR approved, payment is pending for final accreditation.'
    case STATUS_FULLY_APPROVED:
      return 'Application is fully approved and accredited.'
    case STATUS_FINAL_REJECTED:
      return 'Application has been finally rejected.'
    default:
      return `Status: ${status}`
  }
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      console.warn('Invalid date string received for formatDate:', dateString)
      return 'Invalid Date'
    }
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  } catch (e) {
    console.error('Error formatting date:', dateString, e)
    return 'Date Error'
  }
}

const isApplicationDPRApproved = (app) => app.do_dpr_review_decision === STATUS_APPROVED

const isPaymentPending = (app) =>
  (app.application_status === STATUS_PAYMENT_PENDING || isApplicationDPRApproved(app)) &&
  app.is_payment_complete === false

const isPaymentCompleted = (app) =>
  app.application_status === STATUS_FULLY_APPROVED ||
  (isApplicationDPRApproved(app) && app.is_payment_complete === true)

const sortApplications = () => {
  sortOrder.value = sortOrder.value === 'desc' ? 'asc' : 'desc'
  currentPage.value = 1
}

const debouncedSearch = debounce(() => {
  currentPage.value = 1
}, 300)

watch(searchQuery, debouncedSearch)
watch([filterStatus, filterDzongkhag], () => {
  currentPage.value = 1
})

const fetchApplications = async () => {
  const userCid = authStore.user?.cid
  if (!authStore.user || !userCid) {
    errorMessage.value = 'User information not available. Please log in again.'
    apiError.value = true
    isLoading.value = false
    return
  }
  isLoading.value = true
  apiError.value = false
  errorMessage.value = ''
  try {
    const response = await apiServices.getMhpcInstituteByCid(userCid)
    if (response && response.data) {
      if (response.data.results && response.data.results.length > 0) {
        applications.value = response.data.results
      } else if (response.data.id) {
        applications.value = [response.data] // Handle single object response
      } else {
        applications.value = []
      }
    } else {
      applications.value = []
    }
  } catch (error) {
    console.error('Error fetching DPR applications:', error)
    applications.value = []
    apiError.value = true
    errorMessage.value =
      error.response?.data?.message ||
      error.response?.data?.detail ||
      'Failed to fetch applications.'
    toast.error(errorMessage.value)
  } finally {
    isLoading.value = false
  }
}

const openPaymentConfirmationModal = (application) => {
  selectedApplication.value = application
  paymentOutcomeHandled.value = false
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
  const currentApp = selectedApplication.value
  if (!currentApp || !currentApp.id) {
    toast.error('No application selected for payment.')
    if (currentApp?.id) isActionLoading.value[currentApp.id] = false
    showPaymentConfirmModal.value = false
    return
  }
  showPaymentConfirmModal.value = false
  selectedApplicationForPayment.value = currentApp
  if (paymentModalRef.value && typeof paymentModalRef.value.openModal === 'function') {
    paymentModalRef.value.openModal()
  } else {
    console.error('Payment modal or openModal method not available.')
    toast.error('Could not open payment window.')
    if (currentApp?.id) isActionLoading.value[currentApp.id] = false
    selectedApplication.value = null
    selectedApplicationForPayment.value = null
  }
}

const handleDPRPaymentCompleted = async (paymentData) => {
  paymentOutcomeHandled.value = true
  const appBeingPaid = selectedApplicationForPayment.value
  if (!appBeingPaid || !appBeingPaid.id) {
    toast.error('Error: No application associated with this payment.')
    const initialAppId = selectedApplication.value?.id || appBeingPaid?.id
    if (initialAppId) isActionLoading.value[initialAppId] = false
    return
  }
  try {
    console.log('Simulating payment update for:', appBeingPaid.dpr_name, paymentData)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const appIndex = applications.value.findIndex((a) => a.id === appBeingPaid.id)
    if (appIndex !== -1) {
      applications.value[appIndex] = {
        ...applications.value[appIndex],
        is_payment_complete: true,
        application_status: STATUS_FULLY_APPROVED,
        payment_id: paymentData.transactionId,
      }
    }
    toast.success(`Payment for "${appBeingPaid.dpr_name}" completed successfully.`)
  } catch (error) {
    console.error('Error updating DPR application after payment:', error)
    toast.error(error.response?.data?.detail || 'Failed to update application after payment.')
  } finally {
    if (appBeingPaid?.id) isActionLoading.value[appBeingPaid.id] = false
  }
}

const closeDPRPaymentModal = () => {
  if (!paymentOutcomeHandled.value) {
    toast.info('Payment process cancelled.')
  }
  paymentOutcomeHandled.value = false
  const appForLoadingReset = selectedApplicationForPayment.value || selectedApplication.value
  if (appForLoadingReset?.id && isActionLoading.value[appForLoadingReset.id] !== undefined) {
    isActionLoading.value[appForLoadingReset.id] = false
  }
  selectedApplicationForPayment.value = null
  selectedApplication.value = null
}

const openCertificateModal = (application) => {
  selectedApplication.value = application
  if (application?.id) isActionLoading.value[application.id] = true
  showCertificateModal.value = true
}

const closeCertificateModal = () => {
  showCertificateModal.value = false
  if (selectedApplication.value?.id) {
    isActionLoading.value[selectedApplication.value.id] = false
  }
  selectedApplication.value = null
}

const handleViewCertificate = async (application) => {
  const currentApp = application || selectedApplication.value
  if (!currentApp || !currentApp.id) {
    toast.error('No application selected to view certificate.')
    closeCertificateModal()
    return
  }
  try {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    toast.info(`Certificate for "${currentApp.dpr_name}" would open here (simulated).`)
    closeCertificateModal()
  } catch (error) {
    console.error('Error viewing certificate:', error)
    toast.error(error.response?.data?.detail || 'Failed to view certificate.')
  } finally {
    if (currentApp?.id) isActionLoading.value[currentApp.id] = false
  }
}

const openNewApplicationModal = () => {
  showAddApplicationModal.value = true
}
const closeNewApplicationModal = () => {
  showAddApplicationModal.value = false
}

const handleApplicationSubmitted = async (newApplicationDataFromModal) => {
  isLoading.value = true
  const submittingToastId = toast.info('Submitting new DPR application...', { timeout: false })
  try {
    const response = await apiServices.createMhpcInstitute(newApplicationDataFromModal)
    toast.dismiss(submittingToastId)
    if (response && response.data) {
      toast.success(
        `New DPR Application "${
          response.data.dpr_name || newApplicationDataFromModal.dpr_name
        }" submitted successfully!`
      )
      await fetchApplications()
      closeNewApplicationModal()
    } else {
      toast.error('Failed to submit DPR application. Unexpected response from server.')
    }
  } catch (error) {
    toast.dismiss(submittingToastId)
    console.error('Error submitting DPR application from parent:', error)
    const errorMessage =
      error.response?.data?.detail ||
      (typeof error.response?.data === 'object'
        ? Object.values(error.response.data).flat().join(' ')
        : null) ||
      error.message ||
      'An error occurred during submission.'
    toast.error(`Submission failed: ${errorMessage}`)
  } finally {
    isLoading.value = false
  }
}

const viewApplicationDetails = (application) => {
  viewingApplication.value = application
  showDetailsModal.value = true
}
const closeDetailsModal = () => {
  showDetailsModal.value = false
  viewingApplication.value = null
}

const getTimeline = (app) => {
  if (!app) return []
  const timelineEvents = []
  if (app.created_at) {
    timelineEvents.push({ status: 'Application Submitted', date: app.created_at })
  }
  if (
    app.do_dpr_review_decision &&
    app.do_dpr_review_decision !== 'Pending' &&
    app.do_dpr_review_decision !== 'Submitted'
  ) {
    timelineEvents.push({
      status: `DPR Review: ${app.do_dpr_review_decision}`,
      date: app.updated_at,
      remarks: app.do_dpr_reason_if_rejected || app.do_dpr_review_summary,
    })
  } else if (
    app.application_status === STATUS_DPR_SUBMITTED ||
    app.application_status === STATUS_PENDING_REVIEW
  ) {
    if (!timelineEvents.some((e) => e.date === app.updated_at && e.status.includes('DPR'))) {
      timelineEvents.push({
        status: app.application_status,
        date: app.updated_at || app.created_at,
      })
    }
  }
  if (app.application_status === STATUS_PAYMENT_PENDING && !app.is_payment_complete) {
    timelineEvents.push({ status: 'Payment Pending', date: app.updated_at })
  }
  if (app.is_payment_complete && app.payment_id) {
    timelineEvents.push({
      status: 'Payment Completed',
      date: app.payment_completed_at || app.updated_at,
      remarks: `Ref: ${app.payment_id}`,
    })
  }
  if (app.application_status === STATUS_FULLY_APPROVED) {
    timelineEvents.push({
      status: 'Fully Approved (Accredited)',
      date: app.valid_since || app.updated_at,
    })
  } else if (app.application_status === STATUS_FINAL_REJECTED) {
    timelineEvents.push({
      status: 'Application Finally Rejected',
      date: app.updated_at,
      remarks: app.reason_if_rejected,
    })
  }
  const uniqueEvents = timelineEvents.filter(
    (event, index, self) =>
      index ===
      self.findIndex(
        (e) =>
          e.status === event.status &&
          new Date(e.date).toDateString() === new Date(event.date).toDateString()
      )
  )
  return uniqueEvents.sort((a, b) => new Date(a.date) - new Date(b.date))
}

onMounted(fetchApplications)
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
