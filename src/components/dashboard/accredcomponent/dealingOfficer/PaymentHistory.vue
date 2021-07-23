<template>
  <div class="min-h-screen bg-gray-50">
    <div class="mx-auto px-4 sm:px-6 lg:px-8">
      <div class="py-8">
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900">Payment History</h1>
          <p class="mt-2 text-sm text-gray-600">Track and manage all your payment transactions</p>
        </div>

        <!-- Filters Card -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
            <div class="lg:col-span-2">
              <label for="search" class="block text-sm font-medium text-gray-700 mb-2">Search Transactions</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                  </svg>
                </div>
                <input
                  id="search"
                  type="text"
                  v-model="searchQuery"
                  placeholder="Search by institute name or reference number"
                  class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>
            <div>
              <label for="status" class="block text-sm font-medium text-gray-700 mb-2">Payment Status</label>
              <select
                id="status"
                v-model="statusFilter"
                class="block w-full py-3 px-3 border border-gray-300 bg-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">All Statuses</option>
                <option value="true">Completed</option>
                <option value="false">Pending</option>
              </select>
            </div>
            <div class="flex justify-end">
              <div class="bg-indigo-50 px-4 py-2 rounded-lg">
                <p class="text-sm font-medium text-indigo-900">Total Records</p>
                <p class="text-2xl font-bold text-indigo-600">{{ paymentHistory.length }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Data Table Card -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Transaction</th>
                  <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Institute Details</th>
                  <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                  <th class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Payment Date</th>
                  <th class="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th class="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-if="isLoading">
                  <td colspan="6" class="px-6 py-12 text-center">
                    <div class="flex flex-col items-center">
                      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                      <p class="mt-2 text-sm text-gray-500">Loading payment history...</p>
                    </div>
                  </td>
                </tr>
                <tr v-else-if="error">
                  <td colspan="6" class="px-6 py-12 text-center">
                    <div class="flex flex-col items-center">
                      <svg class="h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.232 15.5c-.77.833.192 2.5 1.732 2.5z"/>
                      </svg>
                      <p class="mt-2 text-sm text-red-600">{{ error }}</p>
                    </div>
                  </td>
                </tr>
                <tr v-else-if="paymentHistory.length === 0">
                  <td colspan="6" class="px-6 py-12 text-center">
                    <div class="flex flex-col items-center">
                      <svg class="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                      </svg>
                      <p class="mt-2 text-sm text-gray-500">No payment records match your current filters</p>
                      <button @click="searchQuery = ''; statusFilter = ''" class="mt-2 text-sm text-indigo-600 hover:text-indigo-500">Clear filters</button>
                    </div>
                  </td>
                </tr>
                <tr v-else v-for="payment in paymentHistory" :key="payment.id" class="hover:bg-gray-50 transition-colors duration-150">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm">
                      <p class="font-mono text-gray-900 font-medium">{{ payment.transactionId }}</p>
                      <p class="text-xs text-gray-500">ID: {{ payment.id }}</p>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="text-sm">
                      <p class="font-semibold text-gray-900">{{ payment.instituteName }}</p>
                      <p class="text-gray-600 text-xs mt-1">{{ payment.referenceNo }}</p>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-semibold text-gray-900">{{ payment.amount }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ payment.paymentDate }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-center">
                    <span
                      class="inline-flex px-3 py-1 text-xs font-semibold rounded-full"
                      :class="payment.isPaid
                        ? 'bg-green-100 text-green-800'
                        : 'bg-orange-100 text-orange-800'"
                    >
                      {{ payment.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-center">
                    <button
                      @click="viewDetails(payment.id)"
                      class="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-150"
                    >
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                      </svg>
                      View
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Enhanced Details Modal -->
      <div v-if="isModalOpen" class="fixed inset-0 bg-gray-900 bg-opacity-75 z-50 flex items-center justify-center p-4" @click.self="isModalOpen = false">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
          <div v-if="selectedApplication">
            <!-- Modal Header -->
            <div class="bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-6 text-white">
              <div class="flex justify-between items-center">
                <div>
                  <h3 class="text-2xl font-bold">Payment & Application Details</h3>
                  <p class="text-indigo-100 mt-1">Complete transaction information</p>
                </div>
                <button
                  @click="isModalOpen = false"
                  class="text-white hover:text-gray-200 transition-colors duration-150 p-2 hover:bg-white hover:bg-opacity-20 rounded-full"
                >
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Modal Content -->
            <div class="p-8 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div class="space-y-8">
                <!-- Institute & Payment Info Cards -->
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <!-- Institute Information Card -->
                  <div class="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <div class="flex items-center mb-4">
                      <div class="bg-blue-100 p-2 rounded-lg">
                        <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                        </svg>
                      </div>
                      <h4 class="text-lg font-semibold text-gray-900 ml-3">Institute Information</h4>
                    </div>
                    <div class="space-y-3">
                      <div>
                        <p class="text-sm font-medium text-gray-500">Institute Name</p>
                        <p class="text-gray-900 font-semibold">{{ selectedApplication.institute_profile_details?.name || 'N/A' }}</p>
                      </div>
                      <div>
                        <p class="text-sm font-medium text-gray-500">Focal Person</p>
                        <p class="text-gray-900">{{ selectedApplication.institute_profile_details?.focal_person || 'N/A' }}</p>
                      </div>
                      <div>
                        <p class="text-sm font-medium text-gray-500">Email Address</p>
                        <p class="text-gray-900">{{ selectedApplication.institute_profile_details?.email || 'N/A' }}</p>
                      </div>
                      <div>
                        <p class="text-sm font-medium text-gray-500">Contact Number</p>
                        <p class="text-gray-900">{{ selectedApplication.institute_profile_details?.telephone || 'N/A' }}</p>
                      </div>
                    </div>
                  </div>

                  <!-- Payment Information Card -->
                  <div class="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                    <div class="flex items-center mb-4">
                      <div class="bg-green-100 p-2 rounded-lg">
                        <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
                        </svg>
                      </div>
                      <h4 class="text-lg font-semibold text-gray-900 ml-3">Payment Information</h4>
                    </div>
                    <div class="space-y-3">
                      <div>
                        <p class="text-sm font-medium text-gray-500">Reference Number</p>
                        <p class="text-gray-900 font-semibold font-mono">{{ selectedApplication.application_reference_no || 'N/A' }}</p>
                      </div>
                      <div>
                        <p class="text-sm font-medium text-gray-500">Transaction ID</p>
                        <p class="text-gray-900 font-mono">{{ selectedApplication.payment_id_gateway || 'Offline/Pending' }}</p>
                      </div>
                      <div>
                        <p class="text-sm font-medium text-gray-500">Amount Payable</p>
                        <p class="text-2xl font-bold text-gray-900">Nu. {{ parseFloat(selectedApplication.fee_amount_payable || 0).toFixed(2) }}</p>
                      </div>
                      <div>
                        <p class="text-sm font-medium text-gray-500">Payment Status</p>
                        <span
                          class="inline-flex px-4 py-2 text-sm font-semibold rounded-lg mt-1"
                          :class="selectedApplication.is_payment_complete
                            ? 'bg-green-100 text-green-800'
                            : 'bg-orange-100 text-orange-800'"
                        >
                          <svg v-if="selectedApplication.is_payment_complete" class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                          </svg>
                          <svg v-else class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
                          </svg>
                          {{ selectedApplication.is_payment_complete ? 'Completed' : 'Pending' }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Courses Section -->
                <div class="bg-white rounded-xl border-2 border-dashed border-gray-200 p-6">
                  <div class="flex items-center mb-4">
                    <div class="bg-purple-100 p-2 rounded-lg">
                      <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                      </svg>
                    </div>
                    <h4 class="text-lg font-semibold text-gray-900 ml-3">Associated Courses</h4>
                  </div>
                  <div v-if="selectedApplication.application_courses?.length" class="grid gap-4">
                    <div
                      v-for="course in selectedApplication.application_courses"
                      :key="course.id"
                      class="bg-purple-50 rounded-lg p-4 border border-purple-200"
                    >
                      <h5 class="font-semibold text-purple-900">{{ course.course_programme_title }}</h5>
                      <p class="text-sm text-purple-700 mt-1">BQF Level: {{ course.level_as_per_bqf }}</p>
                    </div>
                  </div>
                  <div v-else class="text-center py-6">
                    <svg class="w-12 h-12 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                    </svg>
                    <p class="text-gray-500">No courses were submitted with this application</p>
                  </div>
                </div>

                <!-- Documents Section -->
                <div class="bg-white rounded-xl border-2 border-dashed border-gray-200 p-6">
                  <div class="flex items-center mb-4">
                    <div class="bg-indigo-100 p-2 rounded-lg">
                      <svg class="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                      </svg>
                    </div>
                    <h4 class="text-lg font-semibold text-gray-900 ml-3">Submitted Documents</h4>
                  </div>
                  <div v-if="selectedApplication.application_documents?.length" class="grid gap-3">
                    <a
                      v-for="doc in selectedApplication.application_documents"
                      :key="doc.id"
                      :href="doc.document_file"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="flex items-center p-4 bg-indigo-50 rounded-lg border border-indigo-200 hover:bg-indigo-100 transition-colors duration-150 group"
                    >
                      <div class="bg-indigo-100 p-2 rounded-lg group-hover:bg-indigo-200 transition-colors duration-150">
                        <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                        </svg>
                      </div>
                      <div class="ml-3 flex-grow">
                        <p class="font-medium text-indigo-900">{{ doc.document_type_details?.name || 'Document' }}</p>
                        <p class="text-sm text-indigo-600">Click to download</p>
                      </div>
                      <svg class="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                      </svg>
                    </a>
                  </div>
                  <div v-else class="text-center py-6">
                    <svg class="w-12 h-12 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                    <p class="text-gray-500">No documents were submitted with this application</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Modal Footer -->
            <div class="bg-gray-50 px-8 py-4 flex justify-end">
              <button
                @click="isModalOpen = false"
                class="px-6 py-2 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-150"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import apiService from '@/services/services';

// --- STATE ---
const applications = ref([]);
const isLoading = ref(true);
const error = ref(null);
const isModalOpen = ref(false);
const selectedApplication = ref(null);

const searchQuery = ref('');
const statusFilter = ref('');

// --- DATA FETCHING ---
const fetchPayments = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    const params = {
      status__in: 'pending_payment,initial_app_submitted_heqc_review,initial_app_rejected,initial_app_approved_awaiting_isar,isar_submitted_heqc_review,isar_queried_by_heqc,isar_accepted_by_heqc,coi_pending_declaration,coi_conflict_declared,coi_resolved_scheduling_visit,site_visit_scheduled,site_visit_confirmed,site_visit_completed,assessment_report_submitted,approved_accredited,approved_conditional,rejected_not_accredited,appealed,closed_withdrawn,closed_completed'
    };
    if (searchQuery.value) params.search = searchQuery.value;
    if (statusFilter.value !== '') params.is_payment_complete = statusFilter.value;

    const response = await apiService.getAccreditationApplications(params);
    applications.value = response.data.results || response.data;
  } catch (e) {
    console.error('Failed to fetch payment history:', e);
    error.value = 'Failed to load data. Please check your connection and try again.';
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchPayments);

watch(statusFilter, fetchPayments);

let searchDebounceTimer = null;
watch(searchQuery, () => {
  clearTimeout(searchDebounceTimer);
  searchDebounceTimer = setTimeout(fetchPayments, 500);
});

// --- DATA TRANSFORMATION ---
const paymentHistory = computed(() => {
  if (!Array.isArray(applications.value)) return [];
  return applications.value.map(app => ({
    id: app.id,
    transactionId: app.payment_id_gateway || 'Offline/Pending',
    instituteName: app.institute_profile_details?.name || 'N/A',
    referenceNo: app.application_reference_no || `APP-${app.id}`,
    amount: app.fee_amount_payable ? `Nu. ${parseFloat(app.fee_amount_payable).toFixed(2)}` : 'N/A',
    paymentDate: new Date(app.updated_at).toLocaleDateString(),
    status: app.is_payment_complete ? 'Completed' : 'Pending',
    isPaid: app.is_payment_complete,
  }));
});

// --- UI HELPERS ---
const getStatusClass = (isPaid) => isPaid ? 'text-green-900' : 'text-orange-900';
const getStatusBackgroundClass = (isPaid) => isPaid ? 'bg-green-200' : 'bg-orange-200';

const viewDetails = (applicationId) => {
  // Find the full application object from our original data source
  const app = applications.value.find(a => a.id === applicationId);
  if (app) {
    selectedApplication.value = app;
    isModalOpen.value = true;
  } else {
    console.error('Application not found for ID:', applicationId);
  }
};

// Prevent body scroll when modal is open
watch(isModalOpen, (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
    // Clear selected application when closing the modal
    selectedApplication.value = null;
  }
});
</script>