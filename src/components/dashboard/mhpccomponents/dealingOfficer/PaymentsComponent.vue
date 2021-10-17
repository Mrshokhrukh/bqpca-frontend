<!-- <template>
  <div class="min-h-screen bg-gray-50">
    <div class="mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <DOPageHeader title="Payment History"
        description="View payment records for BMHC certifications, renewals, CPDs, and more."
        :search-query="transactionSearch" @update:searchQuery="transactionSearch = $event"
        search-placeholder="Search by Payment Advice No..." :filter-value="paymentTypeFilter"
        @update:filterValue="paymentTypeFilter = $event" :filter-options="paymentTypeFilterOptions" />

      <div class="bg-white rounded-xl shadow-md p-6 mb-6">
        <h2 class="text-lg font-medium text-gray-800 mb-4">Additional Filters </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label for="payment-date-range" class="block text-sm font-medium text-gray-700">Payment Date Range</label>
            <div class="mt-1 flex gap-2">
              <input id="date-start" v-model="dateRange.start" type="date"
                class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                aria-label="Start Date" />
              <input id="date-end" v-model="dateRange.end" type="date"
                class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                aria-label="End Date" />
            </div>
          </div>
          <div></div>
          <div></div>
        </div>
      </div>

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
                  Description (Payment For)
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount (Nu.)
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment Request Date
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-if="loading">
                <td colspan="6" class="px-6 py-12 text-center text-gray-500">
                  <div class="flex justify-center items-center">
                    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg"
                      fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                      </path>
                    </svg>
                    Loading payment records...
                  </div>
                </td>
              </tr>
              <tr v-else-if="filteredPayments.length === 0">
                <td colspan="6" class="px-6 py-12 text-center text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-12 w-12 text-gray-400" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p class="mt-2 text-sm font-medium">No payment records found.</p>
                  <p class="mt-1 text-sm text-gray-500">
                    Try adjusting your search or filter criteria.
                  </p>
                </td>
              </tr>
              <tr v-else v-for="payment in paginatedPayments" :key="payment.paymentAdviceNo || payment.id"
                class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {{ payment.paymentAdviceNo || '-' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ payment.taxPayerName || 'N/A' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {{ displayDescription(payment) || 'N/A' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800 text-right">
                  {{ formatCurrency(payment.payableAmount) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {{ formatDate(payment.paymentRequestDate) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <span
                    :class="`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadge(payment.paymentStatus || payment.status)}`">
                    {{ payment.paymentStatus || payment.status || 'Pending' }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-if="!loading && totalPages > 1"
          class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div class="flex-1 flex justify-between sm:hidden">
            <button @click="previousPage" :disabled="currentPage === 1"
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              Previous
            </button>
            <button @click="nextPage" :disabled="currentPage === totalPages"
              class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              Next
            </button>
          </div>
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
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button @click="previousPage" :disabled="currentPage === 1"
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                  <span class="sr-only">Previous</span>
                  <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                    aria-hidden="true">
                    <path fill-rule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clip-rule="evenodd" />
                  </svg>
                </button>
                <span aria-current="page"
                  class="z-10 bg-blue-50 border-blue-500 text-blue-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                  {{ currentPage }}
                </span>
                <button @click="nextPage" :disabled="currentPage === totalPages"
                  class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
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
import { ref, computed, reactive, onMounted, watch, onUnmounted } from 'vue'
import mhpcservices from '@/services/mhpcservices'
import DOPageHeader from '@/components/common/MHPC/DOPageHeader.vue'

/* --------------------
   Reactive state
   -------------------- */
const allPaymentRecords = ref([])
const loading = ref(false)

const transactionSearch = ref('')
const debouncedSearch = ref('')
let searchDebounceTimer = null

const paymentTypeFilter = ref('all')
const dateRange = reactive({ start: '', end: '' })
const currentPage = ref(1)
const perPage = ref(10)

const paymentTypeFilterOptions = ref([
  { value: 'all', text: 'All Payment Types' },
  { value: 'certification', text: 'Certification' },
  { value: 'renewal', text: 'Renewal' },
  { value: 'cpd', text: 'CPD Activity' },
  { value: 'cogs', text: 'COGS Issuance' },
  { value: 'good standing', text: 'Good Standing' },
])

const fetchPayments = async () => {
  loading.value = true
  allPaymentRecords.value = []
  try {
    const response = await mhpcservices.getAllMhpcPayments()

    if (response && response.data && Array.isArray(response.data.results)) {
      allPaymentRecords.value = response.data.results;

    } else if (response && Array.isArray(response.data)) {
      allPaymentRecords.value = response.data
    } else {
      console.warn('API returned unexpected data format:', response && response.data)
      allPaymentRecords.value = []
    }
  } catch (error) {
    console.error('Error fetching payments:', error)
    allPaymentRecords.value = []
  } finally {
    loading.value = false
    currentPage.value = 1
  }
}

onMounted(fetchPayments)

const filteredPayments = computed(() => {
  let payments = allPaymentRecords.value.slice()

  if (transactionSearch.value) {
    const query = transactionSearch.value.toLowerCase()
    payments = payments.filter(
      (p) => p.paymentAdviceNo && p.paymentAdviceNo.toLowerCase().includes(query),
    )
  }

  if (paymentTypeFilter.value !== 'all') {
    const filterText = paymentTypeFilter.value.toLowerCase()
    payments = payments.filter(
      (p) => p.description && p.description.toLowerCase().includes(filterText),
    )
  }

  // date range filter (if both start and end provided)
  if (dateRange.start && dateRange.end) {
    try {
      const startDate = new Date(dateRange.start)
      startDate.setHours(0, 0, 0, 0)
      const endDate = new Date(dateRange.end)
      endDate.setHours(23, 59, 59, 999)
      if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
        payments = payments.filter((p) => {
          const raw = p.paymentRequestDate ?? p.payment_request_date ?? p.requestDate
          if (!raw) return false
          const pd = new Date(raw)
          return !isNaN(pd.getTime()) && pd >= startDate && pd <= endDate
        })
      }
    } catch (e) {
      console.error('Error parsing date range:', e)
    }
  }

  return payments
})

const totalPages = computed(() => {
  return Math.max(1, Math.ceil(filteredPayments.value.length / perPage.value))
})

const paginatedPayments = computed(() => {
  const start = (currentPage.value - 1) * perPage.value
  return filteredPayments.value.slice(start, start + perPage.value)
})

// reset to page 1 when filters/search/date change
watch([debouncedSearch, paymentTypeFilter, () => dateRange.start, () => dateRange.end], () => {
  currentPage.value = 1
})

const previousPage = () => {
  if (currentPage.value > 1) currentPage.value--
}
const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return '-'
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  } catch (e) {
    console.error('Error formatting date:', e)
    return '-'
  }
}

const formatCurrency = (amount) => {
  const numAmount = parseAmount(amount)
  if (isNaN(numAmount)) return '-'
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'BTN',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numAmount)
  } catch (e) {
    return numAmount.toFixed(2)
  }
}

const statusBadge = (status) => {
  const lowercaseStatus = String(status || '').toLowerCase()
  if (lowercaseStatus.includes('success') || lowercaseStatus.includes('paid') || lowercaseStatus.includes('completed')) {
    return 'bg-green-100 text-green-800'
  } else if (lowercaseStatus.includes('pending')) {
    return 'bg-yellow-100 text-yellow-800'
  } else if (lowercaseStatus.includes('failed') || lowercaseStatus.includes('rejected')) {
    return 'bg-red-100 text-red-800'
  } else {
    return 'bg-gray-100 text-gray-800'
  }
}
</script> -->


<template>
  <div class="min-h-screen bg-gray-50">
    <div class="mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <DOPageHeader title="Payment History"
        description="View payment records for BMHC certifications, renewals, CPDs, and more."
        :search-query="transactionSearch" @update:searchQuery="transactionSearch = $event"
        search-placeholder="Search by Payment Advice No..." :filter-value="paymentTypeFilter"
        @update:filterValue="paymentTypeFilter = $event" :filter-options="paymentTypeFilterOptions" />

      <!-- Additional Filters -->
      <div class="bg-white rounded-xl shadow-md p-6 mb-6">
        <h2 class="text-lg font-medium text-gray-800 mb-4"> Additional Filters </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700"> Payment Date Range </label>
            <div class="mt-1 flex gap-2">
              <input v-model="dateRange.start" type="date"
                class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                aria-label="Start Date" />
              <input v-model="dateRange.end" type="date"
                class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                aria-label="End Date" />
            </div>
          </div>
        </div>
      </div>

      <!-- Table -->
      <div class="bg-white rounded-xl shadow-md overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">

            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment
                  Advice No</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payer Name
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description
                  (Payment For)</th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount (Nu.)
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment
                  Request Date</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>

            <tbody class="bg-white divide-y divide-gray-200">
              <!-- Loading -->
              <tr v-if="loading">
                <td colspan="6" class="px-6 py-12 text-center text-gray-500">
                  <div class="flex justify-center items-center">
                    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg"
                      fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                      <path class="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Loading payment records...
                  </div>
                </td>
              </tr>

              <!-- Empty -->
              <tr v-else-if="filteredPayments.length === 0">
                <td colspan="6" class="px-6 py-12 text-center text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-12 w-12 text-gray-400" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p class="mt-2 text-sm font-medium">No payment records found.</p>
                  <p class="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
                </td>
              </tr>

              <!-- Data Rows -->
              <tr v-else v-for="payment in paginatedPayments" :key="payment.paymentAdviceNo || payment.id"
                class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{{ payment.paymentAdviceNo || '-' }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ payment.taxPayerName ||
                  'N/A' }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ payment.description || 'N/A' }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800 text-right">{{
                  formatCurrency(payment.payableAmount) }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ formatDate(payment.paymentRequestDate)
                  }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <span
                    :class="`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadge(payment.paymentStatus || payment.status)}`">
                    {{ payment.paymentStatus || payment.status || 'Pending' }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="!loading && totalPages > 1"
          class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
           
            <p class="text-sm text-gray-700">
              Showing
              <span class="font-medium">{{ (currentPage - 1) * perPage + 1 }}</span>
              to
              <span class="font-medium">{{ Math.min(currentPage * perPage, filteredPayments.length) }}</span>
              of
              <span class="font-medium">{{ filteredPayments.length }}</span>
              results
            </p>
            
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button @click="previousPage" :disabled="currentPage === 1"
                class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50">
                <span class="sr-only">Previous</span>
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clip-rule="evenodd" />
                </svg>
              </button>
              <span aria-current="page"
                class="z-10 bg-blue-50 border-blue-500 text-blue-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                {{ currentPage }}
              </span>
              <button @click="nextPage" :disabled="currentPage === totalPages"
                class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50">
                <span class="sr-only">Next</span>
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
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
</template>

<script setup>
import { ref, computed, reactive, onMounted, watch } from 'vue'
import mhpcservices from '@/services/mhpcservices'
import DOPageHeader from '@/components/common/MHPC/DOPageHeader.vue'

const allPaymentRecords = ref([])
const loading = ref(false)
const transactionSearch = ref('')
const paymentTypeFilter = ref('all')
const dateRange = reactive({ start: '', end: '' })
const currentPage = ref(1)
const perPage = ref(10)

const paymentTypeFilterOptions = ref([{ value: 'all', text: 'All Payment Types' }])

//  Fetch data
const fetchPayments = async () => {
  loading.value = true
  allPaymentRecords.value = []
  try {
    const response = await mhpcservices.getAllMhpcPayments()
    let data = Array.isArray(response?.data?.results)
      ? response.data.results
      : Array.isArray(response?.data)
        ? response.data
        : []

    allPaymentRecords.value = data
    buildDynamicCategories(data)
  } catch (error) {
    console.error('Error fetching payments:', error)
  } finally {
    loading.value = false
    currentPage.value = 1
  }
}

//  Build dynamic dropdown from payment descriptions
const buildDynamicCategories = (data) => {
  const categories = new Set()
  data.forEach((p) => {
    const desc = (p.description || '').trim()
    if (!desc) return
    const lower = desc.toLowerCase()

    if (lower.includes('certification')) categories.add('Certification')
    else if (lower.includes('renewal')) categories.add('Renewal')
    else if (lower.includes('cpd')) categories.add('CPD Activity')
    else if (lower.includes('cogs')) categories.add('COGS Issuance')
    else if (lower.includes('good standing')) categories.add('Good Standing')
    else if (lower.includes('institute')) categories.add('Institute Registration')
    else if (lower.includes('provider')) categories.add('CPD Provider Registration')
    else categories.add(desc)
  })

  paymentTypeFilterOptions.value = [
    { value: 'all', text: 'All Payment Types' },
    ...Array.from(categories).map((cat) => ({
      value: cat.toLowerCase(),
      text: cat,
    })),
  ]
}

//  Filters
const filteredPayments = computed(() => {
  let payments = [...allPaymentRecords.value]
  if (transactionSearch.value) {
    const q = transactionSearch.value.toLowerCase()
    payments = payments.filter((p) => p.paymentAdviceNo?.toLowerCase().includes(q))
  }
  if (paymentTypeFilter.value !== 'all') {
    const f = paymentTypeFilter.value.toLowerCase()
    payments = payments.filter((p) => (p.description || '').toLowerCase().includes(f))
  }
  if (dateRange.start && dateRange.end) {
    const start = new Date(dateRange.start)
    const end = new Date(dateRange.end)
    start.setHours(0, 0, 0, 0)
    end.setHours(23, 59, 59, 999)
    payments = payments.filter((p) => {
      const d = new Date(p.paymentRequestDate)
      return d >= start && d <= end
    })
  }
  return payments
})

//  Pagination
const totalPages = computed(() => Math.ceil(filteredPayments.value.length / perPage.value))
const paginatedPayments = computed(() => {
  const start = (currentPage.value - 1) * perPage.value
  return filteredPayments.value.slice(start, start + perPage.value)
})
const previousPage = () => currentPage.value > 1 && currentPage.value--
const nextPage = () => currentPage.value < totalPages.value && currentPage.value++
watch([transactionSearch, paymentTypeFilter, dateRange], () => (currentPage.value = 1))

//  Utilities
const formatDate = (d) => {
  if (!d) return '-'
  const date = new Date(d)
  return isNaN(date.getTime())
    ? '-'
    : date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}
const formatCurrency = (a) =>
  isNaN(+a)
    ? '-'
    : new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'BTN' }).format(+a)
const statusBadge = (s) => {
  const st = (s || '').toLowerCase()
  if (st.includes('success') || st.includes('paid') || st.includes('completed')) return 'bg-green-100 text-green-800'
  if (st.includes('pending')) return 'bg-yellow-100 text-yellow-800'
  if (st.includes('failed') || st.includes('rejected')) return 'bg-red-100 text-red-800'
  return 'bg-gray-100 text-gray-800'
}

onMounted(fetchPayments)
</script>
