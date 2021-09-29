<template>
  <div class="min-h-screen bg-gray-50/50 p-4 sm:p-6 lg:p-8">
    <div class="mx-auto">
      <!-- Header -->
      <div class="bg-white rounded-2xl shadow-lg border border-gray-200/80 mb-8 p-6">
        <h1 class="text-3xl font-bold text-gray-900">Payment History</h1>
        <p class="mt-1 text-gray-600">Track and manage all payment transactions for accreditation applications.</p>
      </div>

      <!-- Filters Card -->
      <div class="bg-white rounded-2xl shadow-lg border border-gray-200/80 p-6 mb-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
          <div class="lg:col-span-2">
            <label for="search" class="block text-sm font-medium text-gray-700 mb-1">Search Transactions</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              </div>
              <input
                id="search"
                type="text"
                v-model="searchQuery"
                placeholder="By institute name or reference number..."
                class="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
              />
            </div>
          </div>
          <div>
            <label for="status" class="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
            <select
              id="status"
              v-model="statusFilter"
              class="block w-full py-2.5 px-3 border border-gray-300 bg-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
            >
              <option value="">All Statuses</option>
              <option value="true">Completed</option>
              <option value="false">Pending</option>
            </select>
          </div>
          <div class="flex justify-end">
            <div class="bg-indigo-50 text-indigo-900 px-4 py-3 rounded-lg text-center">
              <p class="text-sm font-medium">Total Records</p>
              <p class="text-2xl font-bold">{{ paymentHistory.length }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Data Table Card -->
      <div class="bg-white rounded-2xl shadow-lg border border-gray-200/80 overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Transaction Details</th>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Institute</th>
                <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Payment Date</th>
                <th class="px-6 py-4 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Status</th>
                <th class="px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-if="isLoading">
                <td colspan="5" class="px-6 py-24 text-center">
                  <div class="flex flex-col items-center text-gray-500">
                    <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
                    <p class="mt-3 text-sm font-medium">Loading payment history...</p>
                  </div>
                </td>
              </tr>
              <tr v-else-if="error">
                <td colspan="5" class="px-6 py-24 text-center">
                  <div class="flex flex-col items-center text-red-500">
                     <svg class="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.232 15.5c-.77.833.192 2.5 1.732 2.5z"/></svg>
                    <p class="mt-3 font-semibold">{{ error }}</p>
                  </div>
                </td>
              </tr>
              <tr v-else-if="paymentHistory.length === 0">
                <td colspan="5" class="px-6 py-24 text-center">
                  <div class="flex flex-col items-center text-gray-500">
                    <svg class="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                    <p class="mt-3 font-semibold">No payment records found</p>
                    <p class="text-sm">Try adjusting your search criteria or filters.</p>
                    <button @click="searchQuery = ''; statusFilter = ''" class="mt-4 text-sm text-indigo-600 hover:text-indigo-500 font-medium">Clear filters</button>
                  </div>
                </td>
              </tr>
              <tr v-else v-for="payment in paymentHistory" :key="payment.id" class="hover:bg-gray-50/70 transition-colors duration-150">
                <td class="px-6 py-5 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900 font-mono">{{ payment.transactionId }}</div>
                  <div class="text-xs text-gray-500">App Ref: {{ payment.referenceNo }}</div>
                </td>
                <td class="px-6 py-5">
                  <div class="text-sm font-medium text-gray-900">{{ payment.instituteName }}</div>
                </td>
                <td class="px-6 py-5 whitespace-nowrap">
                  <div class="text-sm text-gray-800">{{ payment.paymentDate }}</div>
                </td>
                <td class="px-6 py-5 whitespace-nowrap text-center">
                  <span
                    class="inline-flex px-3 py-1 text-xs font-semibold rounded-full"
                    :class="payment.isPaid ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'"
                  >
                    {{ payment.status }}
                  </span>
                </td>
                <td class="px-6 py-5 whitespace-nowrap text-right">
                  <button
                    @click="viewDetails(payment.id)"
                    class="inline-flex items-center gap-1.5 rounded-md bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-600 shadow-sm hover:bg-indigo-100"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
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
      <div class="bg-gray-50 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div v-if="selectedApplication">
          <!-- Modal Header -->
          <div class="bg-white px-6 py-4 border-b border-gray-200">
            <div class="flex justify-between items-center">
              <div>
                <h3 class="text-xl font-bold text-gray-900">Payment & Application Details</h3>
                <p class="text-sm text-gray-500 mt-1">Complete transaction and application information</p>
              </div>
              <button @click="isModalOpen = false" class="p-2 text-gray-400 rounded-full hover:bg-gray-200 hover:text-gray-600 transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
          </div>

          <!-- Modal Content -->
          <div class="p-6 overflow-y-auto flex-grow">
            <div class="space-y-6">
              <!-- Institute & Payment Info Cards -->
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- Institute Information Card -->
                <div class="bg-white rounded-xl p-6 border shadow-sm">
                  <div class="flex items-center mb-4">
                    <div class="bg-blue-100 p-2 rounded-lg">
                      <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
                    </div>
                    <h4 class="text-lg font-semibold text-gray-900 ml-3">Institute Information</h4>
                  </div>
                  <dl class="space-y-3 text-sm">
                    <div class="flex justify-between"><dt class="text-gray-500">Institute Name</dt><dd class="text-gray-900 font-semibold text-right">{{ selectedApplication.institute_profile_details?.name || 'N/A' }}</dd></div>
                    <div class="flex justify-between"><dt class="text-gray-500">Focal Person</dt><dd class="text-gray-900 text-right">{{ selectedApplication.institute_profile_details?.focal_person || 'N/A' }}</dd></div>
                    <div class="flex justify-between"><dt class="text-gray-500">Email Address</dt><dd class="text-gray-900 text-right">{{ selectedApplication.institute_profile_details?.email || 'N/A' }}</dd></div>
                    <div class="flex justify-between"><dt class="text-gray-500">Contact Number</dt><dd class="text-gray-900 text-right">{{ selectedApplication.institute_profile_details?.telephone || 'N/A' }}</dd></div>
                  </dl>
                </div>

                <!-- Payment Information Card -->
                <div class="bg-white rounded-xl p-6 border shadow-sm">
                  <div class="flex items-center mb-4">
                    <div class="bg-green-100 p-2 rounded-lg">
                      <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/></svg>
                    </div>
                    <h4 class="text-lg font-semibold text-gray-900 ml-3">Payment Information</h4>
                  </div>
                  <dl class="space-y-3 text-sm">
                    <div class="flex justify-between"><dt class="text-gray-500">Reference Number</dt><dd class="text-gray-900 font-semibold font-mono text-right">{{ selectedApplication.application_reference_no || 'N/A' }}</dd></div>
                    <div class="flex justify-between"><dt class="text-gray-500">Transaction ID</dt><dd class="text-gray-900 font-mono text-right">{{ selectedApplication.payment_id_gateway || 'Offline/Pending' }}</dd></div>
                    <div class="flex justify-between items-baseline"><dt class="text-gray-500">Amount Payable</dt><dd class="text-xl font-bold text-gray-900 text-right">Nu. {{ parseFloat(selectedApplication.fee_amount_payable || 0).toFixed(2) }}</dd></div>
                    <div class="flex justify-between items-center"><dt class="text-gray-500">Payment Status</dt>
                      <dd>
                        <span class="inline-flex px-3 py-1 text-sm font-semibold rounded-full" :class="selectedApplication.is_payment_complete ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'">
                          {{ selectedApplication.is_payment_complete ? 'Completed' : 'Pending' }}
                        </span>
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

              <!-- Courses & Documents Section -->
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <!-- Courses Section -->
                  <div class="bg-white rounded-xl border p-6 shadow-sm">
                    <h4 class="text-lg font-semibold text-gray-900 mb-4">Associated Courses</h4>
                    <div v-if="selectedApplication.application_courses?.length" class="space-y-3 max-h-60 overflow-y-auto pr-2">
                      <div v-for="course in selectedApplication.application_courses" :key="course.id" class="bg-gray-50 rounded-lg p-3 border">
                        <h5 class="font-semibold text-gray-800">{{ course.course_programme_title }}</h5>
                        <p class="text-sm text-gray-600 mt-1">BQF Level: {{ course.level_as_per_bqf }}</p>
                      </div>
                    </div>
                    <p v-else class="text-sm text-gray-500 italic mt-4">No courses were submitted with this application.</p>
                  </div>

                  <!-- Documents Section -->
                  <div class="bg-white rounded-xl border p-6 shadow-sm">
                    <h4 class="text-lg font-semibold text-gray-900 mb-4">Submitted Documents</h4>
                    <div v-if="selectedApplication.application_documents?.length" class="space-y-2 max-h-60 overflow-y-auto pr-2">
                      <a v-for="doc in selectedApplication.application_documents" :key="doc.id" :href="doc.document_file" target="_blank" rel="noopener noreferrer" class="group flex items-center justify-between p-3 bg-gray-50 rounded-lg border hover:bg-indigo-50 transition-colors">
                        <span class="font-medium text-indigo-700 text-sm">{{ doc.document_type_details?.name || 'Document' }}</span>
                        <svg class="w-5 h-5 text-gray-400 group-hover:text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                      </a>
                    </div>
                    <p v-else class="text-sm text-gray-500 italic mt-4">No documents were submitted with this application.</p>
                  </div>
              </div>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="bg-white px-6 py-4 border-t border-gray-200 flex justify-end">
            <button @click="isModalOpen = false" class="px-6 py-2 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors">
              Close
            </button>
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
    const params = {};
    if (searchQuery.value) params.search = searchQuery.value;
    if (statusFilter.value !== '') params.is_payment_complete = statusFilter.value;

    const response = await apiService.getAccreditationApplications(params);
    const allApps = response.data.results || response.data || [];
    // Filter out draft applications on the frontend
    applications.value = allApps.filter(app => app.status !== 'draft_initial');

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
    paymentDate: new Date(app.updated_at).toLocaleDateString(),
    status: app.is_payment_complete ? 'Completed' : 'Pending',
    isPaid: app.is_payment_complete,
  }));
});

// --- UI HELPERS ---
const viewDetails = (applicationId) => {
  const app = applications.value.find(a => a.id === applicationId);
  if (app) {
    selectedApplication.value = app;
    isModalOpen.value = true;
  } else {
    console.error('Application not found for ID:', applicationId);
  }
};

watch(isModalOpen, (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
    selectedApplication.value = null;
  }
});
</script>