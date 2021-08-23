<template>
  <div class="min-h-screen bg-gray-50">
    <div class="mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div
        class="bg-gradient-to-r from-indigo-100 via-blue-50 to-indigo-100 rounded-xl p-8 mb-10 shadow-md"
      >
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Payment History</h1>
        <p class="text-gray-600">
          View payment records for EPC certifications, renewals, CPDs, and more.
        </p>
      </div>

      <!-- Filter Controls -->
      <div class="bg-white rounded-xl shadow-md p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label for="transaction-search" class="block text-sm font-medium text-gray-700"
              >Search by Payment Advice No</label
            >
            <div class="mt-1">
              <input
                id="transaction-search"
                v-model="transactionSearch"
                type="text"
                class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="Enter Payment Advice No..."
              />
            </div>
          </div>
          <div>
            <label for="payment-type-filter" class="block text-sm font-medium text-gray-700"
              >Payment Type</label
            >
            <div class="mt-1">
              <select
                id="payment-type-filter"
                v-model="paymentTypeFilter"
                class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
              >
                <option value="all">All Payment Types</option>
                <option value="certification">Certification</option>
                <option value="renewal">Renewal</option>
                <option value="cpd">CPD Activity</option>
                <option value="cogs">COGS Issuance</option>
              </select>
            </div>
          </div>
          <div>
            <label for="payment-date-range" class="block text-sm font-medium text-gray-700"
              >Payment Date Range</label
            >
            <div class="mt-1 flex gap-2">
              <input
                id="date-start"
                v-model="dateRange.start"
                type="date"
                class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-1/2 sm:text-sm border-gray-300 rounded-md"
              />
              <input
                id="date-end"
                v-model="dateRange.end"
                type="date"
                class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-1/2 sm:text-sm border-gray-300 rounded-md"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Payment Records Table -->
      <div class="bg-white rounded-xl shadow-md overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Advice No
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payer Name
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount (Nu.)
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Date
                </th>
                <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <!-- Loading State -->
              <tr v-if="loading">
                <td colspan="6" class="px-6 py-10 text-center text-gray-500">
                  Loading payment records...
                </td>
              </tr>
              <!-- Data Rows -->
              <template v-else-if="paginatedPayments.length > 0">
                <!-- *** THIS IS THE MAIN FIX: Using v-for to loop through records *** -->
                <tr v-for="record in paginatedPayments" :key="record.id || record.paymentAdviceNo">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ record.paymentAdviceNo || '-' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ record.taxPayerName || '-' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ record.description || '-' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                    {{ formatCurrency(record.payableAmount) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ formatDate(record.paymentRequestDate) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-center">
                    <span
                      :class="`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadge(record.paymentStatus)}`"
                    >
                      {{ record.paymentStatus || 'Unknown' }}
                    </span>
                  </td>
                </tr>
              </template>
              <!-- Empty State -->
              <tr v-else>
                <td colspan="6" class="px-6 py-10 text-center text-gray-500">
                  No payment records found that match your criteria.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div
          v-if="!loading && filteredPayments.length > perPage"
          class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6"
        >
          <!-- Mobile Pagination -->
          <div class="flex-1 flex justify-between sm:hidden">
            <button
              @click="previousPage"
              :disabled="currentPage === 1"
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              @click="nextPage"
              :disabled="currentPage === totalPages"
              class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          <!-- Desktop Pagination -->
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
                <button
                  @click="previousPage"
                  :disabled="currentPage === 1"
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span class="sr-only">Previous</span>
                  <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>
                </button>
                <span class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                  Page {{ currentPage }} of {{ totalPages }}
                </span>
                <button
                  @click="nextPage"
                  :disabled="currentPage === totalPages"
                  class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span class="sr-only">Next</span>
                  <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" /></svg>
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
import { ref, computed, reactive, onMounted, watch } from 'vue'
import apiServices from '@/services/services'

const paymentRecords = ref([])
const loading = ref(false)
const transactionSearch = ref('')
const paymentTypeFilter = ref('all')
const dateRange = reactive({ start: '', end: '' })
const currentPage = ref(1)
const perPage = ref(10) // This now matches a potential backend page size

// --- NEW state variables for server-side pagination ---
const totalRecords = ref(0)
const nextUrl = ref(null)
const prevUrl = ref(null)


const fetchPayments = async () => {
  loading.value = true
  try {
    // This now calls your new '/epc/payment-history/' endpoint
    const response = await apiServices.getAllPayments()

    // --- THIS IS THE KEY FIX ---
    // Check if the response has a 'results' key, which indicates pagination.
    if (response && response.data && response.data.results) {
      paymentRecords.value = response.data.results; // Assign the array from 'results'
      totalRecords.value = response.data.count;
      nextUrl.value = response.data.next;
      prevUrl.value = response.data.previous;
    }
    // Fallback for non-paginated or older API versions
    else if (response && response.data) {
      paymentRecords.value = Array.isArray(response.data) ? response.data : [response.data];
      totalRecords.value = paymentRecords.value.length;
    }
    else {
      console.warn('No payment records received from API.')
      paymentRecords.value = []
      totalRecords.value = 0;
    }
  } catch (error) {
    console.error('Error fetching payments:', error)
    paymentRecords.value = []
    totalRecords.value = 0;
  } finally {
    loading.value = false
  }
}

onMounted(fetchPayments)

// **NOTE: Client-side filtering is still active.**
// If you have thousands of records, you should move filtering to the backend.
// For a few hundred, this client-side approach is fine.
const filteredPayments = computed(() => {
  if (!Array.isArray(paymentRecords.value)) {
    return []
  }

  let filtered = [...paymentRecords.value]

  // Filter 1: By Payment Advice No (Search Term)
  if (transactionSearch.value) {
    const searchTerm = transactionSearch.value.toLowerCase()
    filtered = filtered.filter(
      (p) => p.paymentAdviceNo && p.paymentAdviceNo.toLowerCase().includes(searchTerm)
    )
  }

  // Filter 2: By Payment Type (using the 'description' field)
  if (paymentTypeFilter.value !== 'all') {
    const typeTerm = paymentTypeFilter.value.toLowerCase()
    filtered = filtered.filter((p) => p.description && p.description.toLowerCase().includes(typeTerm))
  }

  // Filter 3: By Date Range
  if (dateRange.start && dateRange.end) {
    try {
      const startDate = new Date(dateRange.start)
      const endDate = new Date(dateRange.end)
      endDate.setHours(23, 59, 59, 999)

      filtered = filtered.filter((p) => {
        if (!p.paymentRequestDate) return false
        const paymentDate = new Date(p.paymentRequestDate)
        return paymentDate >= startDate && paymentDate <= endDate
      })
    } catch (e) {
      console.error("Invalid date for filtering", e)
    }
  }

  return filtered
})

const totalPages = computed(() => {
  // If using server-side pagination, you might get total pages from the API.
  // For now, we'll stick to client-side calculation on the filtered data.
  return Math.ceil(filteredPayments.value.length / perPage.value)
})

const paginatedPayments = computed(() => {
  const start = (currentPage.value - 1) * perPage.value
  const end = start + perPage.value
  return filteredPayments.value.slice(start, end)
})

// Reset to page 1 whenever a filter changes
watch([transactionSearch, paymentTypeFilter, dateRange], () => {
  currentPage.value = 1
})

// --- Pagination Methods ---
const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

// --- Helper Functions (no changes needed here) ---
const formatDate = (dateString) => {
  if (!dateString) return '–'
  const options = { year: 'numeric', month: 'short', day: 'numeric' }
  try {
    return new Date(dateString).toLocaleDateDateString('en-GB', options)
  } catch (e) {
    return 'Invalid Date'
  }
}

const formatCurrency = (amount) => {
  const numAmount = Number(amount)
  if (isNaN(numAmount)) return '–'
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'BTN',
    minimumFractionDigits: 2,
  }).format(numAmount)
}

const statusBadge = (status) => {
  if (!status) return 'bg-gray-100 text-gray-800'
  const lowerCaseStatus = status.toLowerCase()
  if (lowerCaseStatus.includes('success') || lowerCaseStatus.includes('completed')) {
    return 'bg-green-100 text-green-800'
  }
  if (lowerCaseStatus.includes('pending')) {
    return 'bg-yellow-100 text-yellow-800'
  }
  if (lowerCaseStatus.includes('failed') || lowerCaseStatus.includes('cancelled') || lowerCaseStatus.includes('rejected')) {
    return 'bg-red-100 text-red-800'
  }
  return 'bg-gray-100 text-gray-800'
}
</script>