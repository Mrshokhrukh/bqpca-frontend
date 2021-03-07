<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div class="bg-gradient-to-r from-indigo-100 via-blue-50 to-indigo-100 rounded-xl p-8 mb-10 shadow-md">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Payment History</h1>
        <p class="text-gray-600">View payment records for BMHC certifications, renewals, CPDs, and more.</p>
      </div>

      <div class="bg-white rounded-xl shadow-md p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label for="transaction-search" class="block text-sm font-medium text-gray-700">Search by Payment Advice
              No</label>
            <div class="mt-1">
              <input id="transaction-search" v-model="transactionSearch" type="text"
                class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="Enter Payment Advice No...">
            </div>
          </div>
          <div>
            <label for="payment-type-filter" class="block text-sm font-medium text-gray-700">Payment Type</label>
            <div class="mt-1">
              <select id="payment-type-filter" v-model="paymentTypeFilter"
                class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md">
                <option value="all">All Payment Types</option>
                <option value="certification">Certification</option>
                <option value="renewal">Renewal</option>
                <option value="cpd">CPD Activity</option>
                <option value="cogs">COGS Issuance</option>
                <!--  Dynamically generate options if descriptions are consistent -->
              </select>
            </div>
          </div>
          <div>
            <label for="payment-date-range" class="block text-sm font-medium text-gray-700">Payment Date Range</label>
            <div class="mt-1 flex gap-2">
              <input id="date-start" v-model="dateRange.start" type="date"
                class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-1/2 sm:text-sm border-gray-300 rounded-md">
              <input id="date-end" v-model="dateRange.end" type="date"
                class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-1/2 sm:text-sm border-gray-300 rounded-md">
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-md overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment
                  Advice
                  No
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payer Name
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description
                  (Payment For)
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount (Nu.)
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment
                  Request
                  Date
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <!-- Use v-if to conditionally render the row only if paymentRecords is available -->
              <tr v-if="paymentRecords">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ paymentRecords.paymentAdviceNo || '-'
                  }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ paymentRecords.taxPayerName }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ paymentRecords.description }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{
                formatCurrency(paymentRecords.payableAmount) }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{
                formatDate(paymentRecords.paymentRequestDate) }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span
                    :class="`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadge(paymentRecords.paymentStatus || paymentRecords.status)}`">
                    {{ paymentRecords.paymentStatus || paymentRecords.status || "Pending" }}
                  </span>
                </td>
              </tr>
              <tr v-else>
                <td colspan="6" class="px-6 py-4 text-center text-gray-500">No payment record found.</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-if="loading" class="p-4 text-gray-500 text-center">Loading payment records...</div>
        <!-- Removed the v-else-if since we handle the no records case in the tbody -->
        <!-- Pagination (Conditional) -->
        <div v-if="Array.isArray(paymentRecords) && paymentRecords.length > 1"
          class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <!-- Pagination controls (same as before) -->
          <div class="flex-1 flex justify-between sm:hidden">
            <button @click="previousPage" :disabled="currentPage === 1"
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
              Previous
            </button>
            <button @click="nextPage" :disabled="currentPage === totalPages"
              class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
              Next
            </button>
          </div>
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                Showing
                <span class="font-medium">{{ (currentPage - 1) * perPage + 1 }}</span>
                to
                <span class="font-medium">{{ Math.min(currentPage * perPage, filteredPayments.length) }}</span>
                of
                <span class="font-medium">{{ filteredPayments.length }}</span>
                results
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button @click="previousPage" :disabled="currentPage === 1"
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                  <span class="sr-only">Previous</span>
                  <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                    aria-hidden="true">
                    <path fill-rule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clip-rule="evenodd" />
                  </svg>
                </button>
                <!-- Current Page Number -->
                <span
                  class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                  {{ currentPage }}
                </span>

                <button @click="nextPage" :disabled="currentPage === totalPages"
                  class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                  <span class="sr-only">Next</span>
                  <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                    aria-hidden="true">
                    <path fill-rule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clip-rule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, reactive, onMounted, watch } from 'vue';
import apiServices from '@/services/services';

const appName = 'certificate_of_good_standing_fee';

const paymentRecords = ref(null); // Initialize as null, not an empty array.
const loading = ref(false);
const transactionSearch = ref('');
const paymentTypeFilter = ref('all');
const dateRange = reactive({ start: '', end: '' });
const currentPage = ref(1);
const perPage = ref(10);


const fetchPayments = async () => {
  loading.value = true;
  try {
    const response = await apiServices.getAllPayments(appName);

    // Check for a successful response status (usually 200-299)
    if (response && response.status >= 200 && response.status < 300) {
      // Access the data within the response
      paymentRecords.value = response.data;  // Correctly extracts the data

        if (!paymentRecords.value) {
            console.warn('No payment records received from API.');
            paymentRecords.value = null;
        }
    } else {
      // Handle non-successful response statuses (e.g., 404, 500)
      console.error('API request failed:', response);
      paymentRecords.value = null; // Set to null on error
      // Optionally show a user-friendly error message here
    }

  } catch (error) {
    // Handle network errors or other exceptions during the request
    console.error('Error fetching payments:', error);
    paymentRecords.value = null; // Set to null on error
     // Optionally show a user-friendly error message here
  } finally {
    loading.value = false;
  }
};

onMounted(fetchPayments);

// Computed Properties (adapted for single object or array)
const filteredPayments = computed(() => {
  // Handle the case where paymentRecords.value is a single object
  if (!Array.isArray(paymentRecords.value) && paymentRecords.value) {
    let payment = paymentRecords.value;

    if (transactionSearch.value) {
      if (!payment.paymentAdviceNo || !payment.paymentAdviceNo.toLowerCase().includes(transactionSearch.value.toLowerCase())) {
        return []; // Return empty array if it doesn't match
      }
    }
    if (paymentTypeFilter.value !== 'all') {
      if (!payment.description.toLowerCase().includes(paymentTypeFilter.value.toLowerCase())) {
        return [];
      }
    }
    if (dateRange.start && dateRange.end) {
      const paymentDate = new Date(payment.paymentRequestDate);
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      endDate.setHours(23, 59, 59, 999);
      if (!(paymentDate >= startDate && paymentDate <= endDate)) {
        return [];
      }
    }
    return [payment]; // Wrap in an array for consistency
  }
  return [];
});


const totalPages = computed(() => {
  if (!filteredPayments.value) return 0;
  return Math.ceil(filteredPayments.value.length / perPage.value);
});

// Watchers (keep the same)
watch([transactionSearch, paymentTypeFilter, dateRange], () => {
  currentPage.value = 1;
});

// Pagination Methods (keep the same)
const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

// Helper Functions (keep the same)
const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return '-';
  }
  return date.toLocaleDateString('en-GB');
};

const formatCurrency = (amount) => {
  if (isNaN(amount)) return '-';
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'BTN' }).format(amount);
};

const statusBadge = (status) => {
  if (!status) {
    return 'bg-gray-100 text-gray-800';
  }
  const lowercaseStatus = status;
  const classes = {
    'success': 'bg-green-100 text-green-800',
    'pending': 'bg-yellow-100 text-yellow-800',
    'failed': 'bg-red-100 text-red-800',
  };
  return classes[lowercaseStatus] || 'bg-gray-100 text-gray-800';
};
</script>
