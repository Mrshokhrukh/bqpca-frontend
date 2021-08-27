<template>
  <div class="min-h-screen bg-gray-50">
    <div class="mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div class="bg-white border border-gray-200 rounded-xl p-8 mb-10 shadow-sm">
        <div class="flex items-center space-x-4">
          <div class="flex-shrink-0 bg-indigo-500 text-white rounded-lg p-3">
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
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
          </div>
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Payment History</h1>
            <p class="text-gray-600 mt-1">
              View and filter all payment records for engineering professionals.
            </p>
          </div>
        </div>
      </div>

      <div class="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <label for="transaction-search" class="block text-sm font-medium text-gray-700"
              >Search by Payment Advice No</label
            >
            <div class="mt-1 relative">
              <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg
                  class="h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <input
                id="transaction-search"
                v-model="transactionSearch"
                type="text"
                class="block w-full rounded-md border-gray-300 pl-10 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2"
                placeholder="Enter Payment Advice No..."
              />
            </div>
          </div>

          <div>
            <label for="payment-type-filter" class="block text-sm font-medium text-gray-700"
              >Payment Type</label
            >
            <select
              id="payment-type-filter"
              v-model="paymentTypeFilter"
              class="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm shadow-sm"
            >
              <option value="all">All Payment Types</option>
              <option v-for="desc in paymentTypeOptions" :key="desc" :value="desc">
                {{ desc }}
              </option>
            </select>
          </div>

          <div>
            <label for="status-filter" class="block text-sm font-medium text-gray-700"
              >Payment Status</label
            >
            <select
              id="status-filter"
              v-model="statusFilter"
              class="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm shadow-sm"
            >
              <option value="all">All Statuses</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          <div>
            <label for="payment-date-range" class="block text-sm font-medium text-gray-700"
              >Payment Date Range</label
            >
            <div class="mt-1 flex items-center gap-2">
              <input
                id="date-start"
                v-model="dateRange.start"
                type="date"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2"
              />
              <span class="text-gray-500">to</span>
              <input
                id="date-end"
                v-model="dateRange.end"
                type="date"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm py-2"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  Payment Advice No
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  Payer Name
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  Description
                </th>
                <th
                  class="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  Amount (Nu.)
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  Payment Date
                </th>
                <th
                  class="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider"
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <template v-if="paginatedPayments.length > 0">
                <tr
                  v-for="record in paginatedPayments"
                  :key="record.id + record.source_model"
                  class="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {{ record.paymentAdviceNo || '-' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {{ record.taxPayerName || '-' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                    {{ record.description || '-' }}
                  </td>
                  <td
                    class="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900"
                  >
                    {{ formatCurrency(record.payableAmount) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {{ formatDate(record.paymentRequestDate) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-center">
                    <span
                      :class="`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadge(
                        record.paymentStatus
                      )}`"
                    >
                      {{ record.paymentStatus || 'Unknown' }}
                    </span>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>

        <div
          v-if="!loading && filteredPayments.length > perPage"
          class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6"
        >
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                Showing
                <span class="font-medium">{{ (currentPage - 1) * perPage + 1 }}</span>
                to
                <span class="font-medium">{{
                  Math.min(currentPage * perPage, filteredPayments.length)
                }}</span>
                of
                <span class="font-medium">{{ filteredPayments.length }}</span>
                results
              </p>
            </div>
            <div>
              <nav
                class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                aria-label="Pagination"
              >
                <button
                  @click="previousPage"
                  :disabled="currentPage === 1"
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  <span class="sr-only">Previous</span>
                  <svg
                    class="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </button>
                <span
                  class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                >
                  Page {{ currentPage }} of {{ totalPages }}
                </span>
                <button
                  @click="nextPage"
                  :disabled="currentPage === totalPages"
                  class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  <span class="sr-only">Next</span>
                  <svg
                    class="h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clip-rule="evenodd"
                    />
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
import { ref, computed, reactive, onMounted, watch } from 'vue'
import apiServices from '@/services/services'

// --- State for data and UI controls ---
const paymentRecords = ref([])
const loading = ref(true)
const transactionSearch = ref('')
const paymentTypeFilter = ref('all')
const dateRange = reactive({ start: '', end: '' })
const currentPage = ref(1)
const perPage = ref(10)
const statusFilter = ref('all')

// --- API and data fetching ---
const fetchPayments = async () => {
  loading.value = true
  try {
    const response = await apiServices.getAllPayments()
    // CORRECTED: Use the 'results' key from the paginated response
    paymentRecords.value = response?.data?.results || []
  } catch (error) {
    console.error('Error fetching payments:', error)
    paymentRecords.value = []
  } finally {
    loading.value = false
  }
}

onMounted(fetchPayments)

// --- DYNAMIC DROPDOWN ---
const paymentTypeOptions = computed(() => {
  if (!paymentRecords.value.length) return []
  const uniqueDescriptions = new Set(paymentRecords.value.map((p) => p.description).filter(Boolean))
  return Array.from(uniqueDescriptions)
})

// --- FILTERING & SORTING LOGIC ---
const filteredPayments = computed(() => {
  let filtered = [...paymentRecords.value]

  // Filter 1: By search term
  if (transactionSearch.value) {
    const searchTerm = transactionSearch.value.toLowerCase()
    // CORRECTED: Use 'paymentAdviceNo'
    filtered = filtered.filter(
      (p) => p.paymentAdviceNo && p.paymentAdviceNo.toLowerCase().includes(searchTerm)
    )
  }

  // Filter 2: By payment type
  if (paymentTypeFilter.value !== 'all') {
    filtered = filtered.filter((p) => p.description === paymentTypeFilter.value)
  }

  // Filter 3: By payment status
  if (statusFilter.value !== 'all') {
    const status = statusFilter.value.toLowerCase()
    // CORRECTED: Use 'paymentStatus'
    filtered = filtered.filter(
      (p) => p.paymentStatus && p.paymentStatus.toLowerCase().includes(status)
    )
  }

  // Filter 4: By date range
  if (dateRange.start && dateRange.end) {
    try {
      const startDate = new Date(dateRange.start)
      const endDate = new Date(dateRange.end)
      endDate.setHours(23, 59, 59, 999)
      filtered = filtered.filter((p) => {
        // CORRECTED: Use 'paymentRequestDate'
        if (!p.paymentRequestDate) return false
        const paymentDate = new Date(p.paymentRequestDate)
        return paymentDate >= startDate && paymentDate <= endDate
      })
    } catch (e) {
      console.error('Invalid date for filtering', e)
    }
  }

  // SORTING LOGIC
  filtered.sort((a, b) => {
    // CORRECTED: Use 'paymentRequestDate'
    const dateA = new Date(a.paymentRequestDate)
    const dateB = new Date(b.paymentRequestDate)
    return dateB - dateA // Descending order
  })

  return filtered
})

// --- PAGINATION LOGIC (Unchanged) ---
const totalPages = computed(() => Math.ceil(filteredPayments.value.length / perPage.value))

const paginatedPayments = computed(() => {
  const start = (currentPage.value - 1) * perPage.value
  const end = start + perPage.value
  return filteredPayments.value.slice(start, end)
})

watch([transactionSearch, paymentTypeFilter, dateRange, statusFilter], () => {
  currentPage.value = 1
})

const previousPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

// --- HELPER FUNCTIONS (Unchanged) ---
const formatDate = (dateString) => {
  if (!dateString) return '–'
  return new Date(dateString).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
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
  const s = status.toLowerCase()
  if (s.includes('completed')) return 'bg-green-100 text-green-800'
  if (s.includes('pending')) return 'bg-yellow-100 text-yellow-800'
  if (s.includes('failed')) return 'bg-red-100 text-red-800'
  return 'bg-gray-100 text-gray-800'
}
</script>
