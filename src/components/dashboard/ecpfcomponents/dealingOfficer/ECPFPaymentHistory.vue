<template>
  <div class="w-full p-4 bg-slate-50 rounded-lg shadow">
    <!-- Header and Filters -->
    <div class="mb-6">
      <h2 class="text-xl font-bold text-slate-800 mb-4">Payment History</h2>

      <!-- Search and Filters -->
      <div class="flex flex-col lg:flex-row gap-4 mb-4">
        <!-- Search Bar -->
        <div class="relative flex-grow">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by ID, jrnl number or description..."
            class="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10"
          />
          <div class="absolute left-3 top-2.5 text-slate-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        <!-- Date Range Filter -->
        <div class="flex gap-2">
          <div class="w-1/2">
            <label class="block text-sm font-medium text-slate-700 mb-1">From</label>
            <input
              v-model="dateRange.from"
              type="date"
              class="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div class="w-1/2">
            <label class="block text-sm font-medium text-slate-700 mb-1">To</label>
            <input
              v-model="dateRange.to"
              type="date"
              class="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <!-- Status Filter -->
        <div class="min-w-[150px]">
          <label class="block text-sm font-medium text-slate-700 mb-1">Status</label>
          <select
            v-model="statusFilter"
            class="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Statuses</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <!-- Amount Range Filter -->
        <div class="min-w-[150px]">
          <label class="block text-sm font-medium text-slate-700 mb-1">Amount Range</label>
          <select
            v-model="amountRangeFilter"
            class="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Amounts</option>
            <option value="0-100">Nu 0 - Nu 100</option>
            <option value="100-500">Nu 100 - Nu 500</option>
            <option value="500-1000">Nu 500 - Nu 1000</option>
            <option value="1000+">Nu 1000+</option>
          </select>
        </div>
      </div>

      <!-- Filter Tags -->
      <div v-if="hasActiveFilters" class="flex flex-wrap gap-2 mb-4">
        <div
          v-if="searchQuery"
          class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center"
        >
          Search: "{{ searchQuery }}"
          <button @click="searchQuery = ''" class="ml-2 focus:outline-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4"
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
        <div
          v-if="dateRange.from || dateRange.to"
          class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center"
        >
          Date: {{ formatDateFilter }}
          <button @click="clearDateFilter" class="ml-2 focus:outline-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4"
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
        <div
          v-if="statusFilter !== 'all'"
          class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center"
        >
          Status: {{ statusFilter }}
          <button @click="statusFilter = 'all'" class="ml-2 focus:outline-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4"
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
        <div
          v-if="amountRangeFilter !== 'all'"
          class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center"
        >
          Amount: {{ amountRangeFilter }}
          <button @click="amountRangeFilter = 'all'" class="ml-2 focus:outline-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4"
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
        <button
          @click="clearAllFilters"
          class="text-sm text-slate-600 underline hover:text-slate-800 focus:outline-none"
        >
          Clear All Filters
        </button>
      </div>
    </div>

    <!-- Payment Table -->
    <div class="overflow-x-auto">
      <table class="min-w-full bg-white border border-slate-200 rounded-lg overflow-hidden">
        <thead class="bg-slate-100">
          <tr>
            <th
              v-for="column in columns"
              :key="column.key"
              @click="sortBy(column.key)"
              class="px-4 py-3 text-left text-xs font-medium text-slate-700 uppercase tracking-wider cursor-pointer hover:bg-slate-200"
            >
              <div class="flex items-center">
                {{ column.label }}
                <span v-if="sortColumn === column.key" class="ml-1">
                  <svg
                    v-if="sortOrder === 'asc'"
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 15l7-7 7 7"
                    />
                  </svg>
                  <svg
                    v-else
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </span>
              </div>
            </th>
            <th
              class="px-4 py-3 text-right text-xs font-medium text-slate-700 uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-200">
          <tr v-if="isLoading" class="animate-pulse">
            <td colspan="7" class="px-4 py-3 text-center text-slate-500">Loading payments...</td>
          </tr>
          <tr v-else-if="filteredPayments.length === 0" class="hover:bg-slate-50">
            <td colspan="7" class="px-4 py-3 text-center text-slate-500">
              No payments found matching your filters.
            </td>
          </tr>
          <tr v-for="payment in paginatedPayments" :key="payment.id" class="hover:bg-slate-50">
            <td class="px-4 py-3 text-sm text-slate-900">{{ payment.id }}</td>
            <td class="px-4 py-3 text-sm text-slate-900">{{ formatDate(payment.date) }}</td>
            <td class="px-4 py-3 text-sm text-slate-900">{{ payment.jrnlNumber }}</td>
            <td class="px-4 py-3 text-sm text-slate-900">{{ payment.description }}</td>
            <td class="px-4 py-3 text-sm font-medium" :class="getAmountColorClass(payment.amount)">
              Nu {{ payment.amount.toFixed(2) }}
            </td>
            <td class="px-4 py-3 text-sm">
              <span
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                :class="getStatusColorClass(payment.status)"
              >
                {{ payment.status }}
              </span>
            </td>
            <td class="px-4 py-3 text-sm text-right">
              <button
                @click="viewPaymentDetails(payment)"
                class="text-blue-600 hover:text-blue-800 focus:outline-none mr-2"
              >
                View
              </button>
              <button
                @click="downloadReceipt(payment)"
                class="text-blue-600 hover:text-blue-800 focus:outline-none"
              >
                Receipt
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="flex items-center justify-between mt-6">
      <div class="text-sm text-slate-700">
        Showing {{ paginationStart }} to {{ paginationEnd }} of
        {{ filteredPayments.length }} entries
      </div>
      <div class="flex space-x-1">
        <button
          @click="currentPage = 1"
          :disabled="currentPage === 1"
          class="px-3 py-1 rounded border"
          :class="
            currentPage === 1
              ? 'text-slate-400 border-slate-200'
              : 'text-slate-700 border-slate-300 hover:bg-slate-100'
          "
        >
          First
        </button>
        <button
          @click="currentPage--"
          :disabled="currentPage === 1"
          class="px-3 py-1 rounded border"
          :class="
            currentPage === 1
              ? 'text-slate-400 border-slate-200'
              : 'text-slate-700 border-slate-300 hover:bg-slate-100'
          "
        >
          Prev
        </button>
        <button
          v-for="page in displayedPages"
          :key="page"
          @click="currentPage = page"
          class="px-3 py-1 rounded border"
          :class="
            currentPage === page
              ? 'bg-blue-600 text-white border-blue-600'
              : 'text-slate-700 border-slate-300 hover:bg-slate-100'
          "
        >
          {{ page }}
        </button>
        <button
          @click="currentPage++"
          :disabled="currentPage === totalPages"
          class="px-3 py-1 rounded border"
          :class="
            currentPage === totalPages
              ? 'text-slate-400 border-slate-200'
              : 'text-slate-700 border-slate-300 hover:bg-slate-100'
          "
        >
          Next
        </button>
        <button
          @click="currentPage = totalPages"
          :disabled="currentPage === totalPages"
          class="px-3 py-1 rounded border"
          :class="
            currentPage === totalPages
              ? 'text-slate-400 border-slate-200'
              : 'text-slate-700 border-slate-300 hover:bg-slate-100'
          "
        >
          Last
        </button>
      </div>
      <div class="flex items-center space-x-2">
        <span class="text-slate-700 text-sm">Items per page:</span>
        <select
          v-model="pageSize"
          class="border border-slate-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option v-for="size in pageSizeOptions" :key="size" :value="size">{{ size }}</option>
        </select>
      </div>
    </div>

    <!-- Payment Details Modal -->
    <div
      v-if="selectedPayment"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-6">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-bold text-slate-800">Payment Details</h3>
            <button
              @click="selectedPayment = null"
              class="text-slate-500 hover:text-slate-700 focus:outline-none"
            >
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

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <h4 class="text-sm font-medium text-slate-500">Payment ID</h4>
              <p class="text-slate-800">{{ selectedPayment.id }}</p>
            </div>
            <div>
              <h4 class="text-sm font-medium text-slate-500">Date</h4>
              <p class="text-slate-800">{{ formatDate(selectedPayment.date) }}</p>
            </div>
            <div>
              <h4 class="text-sm font-medium text-slate-500">Jrnl Number</h4>
              <p class="text-slate-800">{{ selectedPayment.jrnlNumber }}</p>
            </div>
            <div>
              <h4 class="text-sm font-medium text-slate-500">Status</h4>
              <p>
                <span
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="getStatusColorClass(selectedPayment.status)"
                >
                  {{ selectedPayment.status }}
                </span>
              </p>
            </div>
            <div>
              <h4 class="text-sm font-medium text-slate-500">Amount</h4>
              <p class="font-medium" :class="getAmountColorClass(selectedPayment.amount)">
                Nu {{ selectedPayment.amount.toFixed(2) }}
              </p>
            </div>
            <div>
              <h4 class="text-sm font-medium text-slate-500">Payment Method</h4>
              <p class="text-slate-800">{{ selectedPayment.paymentMethod }}</p>
            </div>
          </div>

          <div class="mb-6">
            <h4 class="text-sm font-medium text-slate-500 mb-2">Description</h4>
            <p class="text-slate-800">{{ selectedPayment.description }}</p>
          </div>

          <div class="flex justify-end space-x-3">
            <button
              @click="downloadReceipt(selectedPayment)"
              class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Download Receipt
            </button>
            <button
              @click="selectedPayment = null"
              class="px-4 py-2 border border-slate-300 text-slate-700 rounded hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'

// Sample data (replace with API calls in production)
const payments = ref([])
const isLoading = ref(true)

// Pagination
const currentPage = ref(1)
const pageSize = ref(10)
const pageSizeOptions = [5, 10, 25, 50, 100]

// Sorting
const sortColumn = ref('date')
const sortOrder = ref('desc')

// Filters
const searchQuery = ref('')
const dateRange = ref({ from: '', to: '' })
const statusFilter = ref('all')
const amountRangeFilter = ref('all')
const selectedPayment = ref(null)

// Table columns
const columns = [
  { key: 'id', label: 'Payment ID' },
  { key: 'date', label: 'Date' },
  { key: 'jrnlNumber', label: 'Jrnl Number' },
  { key: 'description', label: 'Description' },
  { key: 'amount', label: 'Amount' },
  { key: 'status', label: 'Status' },
]

// Sample data initialization - replace with your API call
onMounted(async () => {
  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock data
    payments.value = Array.from({ length: 50 }, (_, i) => ({
      id: `PAY-${String(1000 + i).padStart(4, '0')}`,
      date: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
      jrnlNumber: `JRNL-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
      description: ['ECPF Application Fee', 'Renewal Fee', 'Processing Fee', 'Change Request Fee'][
        Math.floor(Math.random() * 4)
      ],
      amount: parseFloat((Math.random() * 1500 + 50).toFixed(2)),
      status: ['approved', 'pending', 'rejected'][Math.floor(Math.random() * 3)],
      paymentMethod: ['bob', 'rma gateway'][Math.floor(Math.random() * 2)],
    }))

    isLoading.value = false
  } catch (error) {
    console.error('Failed to load payments:', error)
    isLoading.value = false
  }
})

// Reset to first page when filters change
watch([searchQuery, dateRange, statusFilter, amountRangeFilter], () => {
  currentPage.value = 1
})

// Computed properties
const hasActiveFilters = computed(() => {
  return (
    searchQuery.value !== '' ||
    dateRange.value.from !== '' ||
    dateRange.value.to !== '' ||
    statusFilter.value !== 'all' ||
    amountRangeFilter.value !== 'all'
  )
})

const formatDateFilter = computed(() => {
  const from = dateRange.value.from ? new Date(dateRange.value.from).toLocaleDateString() : 'Any'
  const to = dateRange.value.to ? new Date(dateRange.value.to).toLocaleDateString() : 'Any'
  return `${from} to ${to}`
})

const filteredPayments = computed(() => {
  let result = [...payments.value]

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(
      (payment) =>
        payment.id.toLowerCase().includes(query) ||
        payment.jrnlNumber.toLowerCase().includes(query) ||
        payment.description.toLowerCase().includes(query),
    )
  }

  // Apply date range filter
  if (dateRange.value.from) {
    const fromDate = new Date(dateRange.value.from)
    result = result.filter((payment) => new Date(payment.date) >= fromDate)
  }

  if (dateRange.value.to) {
    const toDate = new Date(dateRange.value.to)
    toDate.setHours(23, 59, 59, 999) // End of day
    result = result.filter((payment) => new Date(payment.date) <= toDate)
  }

  // Apply status filter
  if (statusFilter.value !== 'all') {
    result = result.filter((payment) => payment.status === statusFilter.value)
  }

  // Apply amount range filter
  if (amountRangeFilter.value !== 'all') {
    switch (amountRangeFilter.value) {
      case '0-100':
        result = result.filter((payment) => payment.amount >= 0 && payment.amount <= 100)
        break
      case '100-500':
        result = result.filter((payment) => payment.amount > 100 && payment.amount <= 500)
        break
      case '500-1000':
        result = result.filter((payment) => payment.amount > 500 && payment.amount <= 1000)
        break
      case '1000+':
        result = result.filter((payment) => payment.amount > 1000)
        break
    }
  }

  // Apply sorting
  result.sort((a, b) => {
    let valueA = a[sortColumn.value]
    let valueB = b[sortColumn.value]

    // Handle dates
    if (sortColumn.value === 'date') {
      valueA = new Date(valueA).getTime()
      valueB = new Date(valueB).getTime()
    }

    // String comparison
    if (typeof valueA === 'string' && typeof valueB === 'string') {
      return sortOrder.value === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA)
    }

    // Numeric comparison
    return sortOrder.value === 'asc' ? valueA - valueB : valueB - valueA
  })

  return result
})

const totalPages = computed(() => Math.ceil(filteredPayments.value.length / pageSize.value))

const paginatedPayments = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredPayments.value.slice(start, end)
})

const paginationStart = computed(() => {
  if (filteredPayments.value.length === 0) return 0
  return (currentPage.value - 1) * pageSize.value + 1
})

const paginationEnd = computed(() => {
  const end = currentPage.value * pageSize.value
  return end > filteredPayments.value.length ? filteredPayments.value.length : end
})

const displayedPages = computed(() => {
  const delta = 2
  const range = []

  if (totalPages.value <= 1) return [1]

  for (
    let i = Math.max(2, currentPage.value - delta);
    i <= Math.min(totalPages.value - 1, currentPage.value + delta);
    i++
  ) {
    range.push(i)
  }

  if (currentPage.value - delta > 2) {
    range.unshift('...')
  }

  if (currentPage.value + delta < totalPages.value - 1) {
    range.push('...')
  }

  range.unshift(1)
  if (totalPages.value > 1) {
    range.push(totalPages.value)
  }

  return range
})

// Functions
const sortBy = (column) => {
  if (sortColumn.value === column) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortColumn.value = column
    sortOrder.value = 'asc'
  }
}

const clearDateFilter = () => {
  dateRange.value = { from: '', to: '' }
}

const clearAllFilters = () => {
  searchQuery.value = ''
  dateRange.value = { from: '', to: '' }
  statusFilter.value = 'all'
  amountRangeFilter.value = 'all'
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const getStatusColorClass = (status) => {
  switch (status) {
    case 'approved':
      return 'bg-green-100 text-green-800'
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'rejected':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-slate-100 text-slate-800'
  }
}

const getAmountColorClass = (amount) => {
  if (amount >= 1000) return 'text-green-600'
  if (amount >= 500) return 'text-blue-600'
  return 'text-slate-700'
}

const viewPaymentDetails = (payment) => {
  selectedPayment.value = payment
}

const downloadReceipt = (payment) => {
  // This is a placeholder. In a real application, you would implement
  // the receipt generation and download functionality here
  alert(`Downloading receipt for payment ${payment.id}`)
}
</script>
