<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <div class="p-6 bg-gray-50 min-h-screen">
        <!-- Use DOPageHeader Component -->
        <DOPageHeader
            title="MHPC Reports Dashboard"
            :search-query="filters.search"
            @update:searchQuery="handleSearchUpdate"
            search-placeholder="Search reports..."
            :filter-value="filters.status"
            @update:filterValue="handleStatusUpdate"
            :filter-options="computedStatusFilterOptions"
        >
            <!-- Slot for custom actions like the export button -->
            <template #actions>
                <button
                    @click="exportToCSV"
                    class="btn-primary ml-4"
                    :disabled="isLoading || !reportData.length"
                >
                    <span v-if="isLoadingExport" class="mr-2">
                        <i class="fas fa-spinner fa-spin"></i>
                    </span>
                    <span v-else class="mr-1">📄</span>
                    Export CSV
                </button>
            </template>
        </DOPageHeader>

        <!-- Filters Section -->
        <div class="mb-6 bg-white p-5 rounded-lg shadow-sm border border-gray-200">
            <h2 class="text-lg font-medium text-gray-800 mb-4">Filters</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <!-- Search and Status filters are now handled by DOPageHeader -->
                <!-- Keep Report Type Selector -->
                <div>
                    <label for="reportTypeFilter" class="filter-label">Report Type</label>
                    <select
                        id="reportTypeFilter"
                        v-model="activeReport"
                        class="filter-input"
                        @change="handleReportTypeChange"
                    >
                        <option
                            v-for="report in reportTypes"
                            :key="report.value"
                            :value="report.value"
                        >
                            {{ report.label }}
                        </option>
                    </select>
                </div>

                <!-- Keep Date Range Filter -->
                <div>
                    <label class="filter-label">Date Range</label>
                    <div class="flex gap-2">
                        <input
                            v-model="filters.startDate"
                            type="date"
                            class="filter-input"
                            @change="fetchData(true)"
                            aria-label="Start Date"
                        />
                        <input
                            v-model="filters.endDate"
                            type="date"
                            class="filter-input"
                            @change="fetchData(true)"
                            aria-label="End Date"
                        />
                    </div>
                </div>

                <!-- Empty div for grid alignment if needed -->
                <div></div>
            </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading && !reportData.length" class="flex justify-center items-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p class="text-red-800">{{ error }}</p>
            <button @click="fetchData(true)" class="text-red-600 underline mt-2">Try Again</button>
        </div>

        <!-- Empty State -->
        <div
            v-else-if="!reportData.length && !isLoading"
            class="bg-white rounded-lg shadow p-8 text-center"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                class="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
            </svg>
            <p class="mt-2 text-sm font-medium">No data available</p>
            <p class="mt-1 text-sm text-gray-500">Try adjusting your filters.</p>
        </div>

        <!-- Report Table -->
        <div v-else class="bg-white rounded-lg shadow overflow-x-auto relative">
            <div
                v-if="isLoading"
                class="absolute inset-0 bg-white bg-opacity-75 flex justify-center items-center z-10"
            >
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th v-for="header in activeHeaders" :key="header.key" class="table-header">
                            <div class="flex items-center">
                                {{ header.label }}
                                <button
                                    v-if="header.sortable"
                                    @click="handleSort(header.key)"
                                    class="ml-1 focus:outline-none text-gray-400 hover:text-gray-600"
                                    :aria-label="`Sort by ${header.label}`"
                                >
                                    <i
                                        :class="[
                                            'fas',
                                            sortBy === header.key
                                                ? sortOrder === 'asc'
                                                    ? 'fa-sort-up'
                                                    : 'fa-sort-down'
                                                : 'fa-sort text-gray-300',
                                        ]"
                                    ></i>
                                </button>
                            </div>
                        </th>
                    </tr>
                </thead>

                <tbody class="bg-white divide-y divide-gray-200">
                    <tr
                        v-for="(item, index) in reportData"
                        :key="item.id || index"
                        class="hover:bg-gray-50"
                    >
                        <td v-for="header in activeHeaders" :key="header.key" class="table-cell">
                            <template
                                v-if="
                                    header.key === 'status' ||
                                    header.key.endsWith('_status') ||
                                    header.key === 'is_cpd_approved'
                                "
                            >
                                <span :class="statusBadge(getNestedValue(item, header.key))">
                                    {{ getNestedValue(item, header.key) || 'N/A' }}
                                </span>
                            </template>
                            <template v-else-if="header.type === 'date'">
                                {{ formatDate(getNestedValue(item, header.key)) }}
                            </template>
                            <template v-else-if="header.type === 'currency'">
                                {{ formatCurrency(getNestedValue(item, header.key)) }}
                            </template>
                            <template v-else>
                                {{ getNestedValue(item, header.key) ?? 'N/A' }}
                            </template>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Pagination -->
        <div class="mt-4 flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
            <div class="text-sm text-gray-700">
                <span v-if="totalItems > 0">
                    Showing {{ startIndex + 1 }} to {{ endIndex }} of {{ totalItems }} results
                </span>
                <span v-else> No results </span>
            </div>
            <div class="flex gap-2">
                <button
                    @click="prevPage"
                    :disabled="currentPage === 1 || isLoading"
                    class="pagination-btn"
                >
                    Previous
                </button>
                <button
                    @click="nextPage"
                    :disabled="currentPage >= totalPages || isLoading || totalItems === 0"
                    class="pagination-btn"
                >
                    Next
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, reactive, watch, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import debounce from 'lodash/debounce'
import Papa from 'papaparse'
import bmhcServices from '@/services/services'
import DOPageHeader from '@/components/common/MHPC/DOPageHeader.vue' // Import the header

const toast = useToast()

const ITEMS_PER_PAGE = 10

const reportTypes = [
    { label: 'Registrations', value: 'registrations' },
    { label: 'Renewals', value: 'renewals' },
    { label: 'CPD Activities', value: 'cpd' },
    { label: 'CoGS Issuance', value: 'cogs' },
]

const headers = {
    registrations: [
        { key: 'registration_no', label: 'Reg Number', sortable: true },
        { key: 'applicant_name', label: 'Applicant Name', sortable: true },
        { key: 'registration_type', label: 'Type', sortable: true },
        { key: 'registration_date', label: 'Reg Date', type: 'date', sortable: true },
        { key: 'expiry_date', label: 'Expiry Date', type: 'date', sortable: true },
        { key: 'application_review_status', label: 'Status', sortable: true },
        { key: 'payment_status', label: 'Payment Status', sortable: true },
    ],
    renewals: [
        { key: 'renewal_id', label: 'Renewal ID', sortable: true },
        { key: 'user_qualification.registration_no', label: 'Reg Number', sortable: true },
        { key: 'applicant_name', label: 'Applicant Name', sortable: true },
        { key: 'renewal_review_status', label: 'Status', sortable: true },
        { key: 'new_expiry_date', label: 'New Expiry Date', type: 'date', sortable: true },
        { key: 'created_at', label: 'Renewal Date', type: 'date', sortable: true },
    ],
    cpd: [
        { key: 'id', label: 'CPD ID', sortable: true },
        { key: 'applicant_name', label: 'Applicant Name', sortable: true },
        { key: 'title_of_cpd', label: 'Activity Name', sortable: true },
        { key: 'cpd_credit', label: 'Credits', sortable: true },
        { key: 'start_date', label: 'Start Date', type: 'date', sortable: true },
        { key: 'end_date', label: 'End Date', type: 'date', sortable: true },
        { key: 'review_status', label: 'Status', sortable: true },
    ],
    cogs: [
        { key: 'cogs_number', label: 'CoGS Number', sortable: true },
        { key: 'full_name', label: 'Applicant Name', sortable: true },
        { key: 'cogs_approved_date', label: 'Issuance Date', type: 'date', sortable: true },
        { key: 'review_status', label: 'Status', sortable: true },
    ],
}

const activeReport = ref('registrations')
const reportData = ref([])
const isLoading = ref(false)
const isLoadingExport = ref(false) // Separate loading state for export
const error = ref(null)
const currentPage = ref(1)
const totalItems = ref(0)
const sortBy = ref('')
const sortOrder = ref('asc')

const filters = reactive({
    search: '',
    startDate: '',
    endDate: '',
    status: '', // Default to empty string, representing "All Statuses"
})

const activeHeaders = computed(() => headers[activeReport.value] || [])
const totalPages = computed(() => Math.ceil(totalItems.value / ITEMS_PER_PAGE))
const startIndex = computed(() => (currentPage.value - 1) * ITEMS_PER_PAGE)
const endIndex = computed(() =>
    Math.min(startIndex.value + ITEMS_PER_PAGE, totalItems.value > 0 ? totalItems.value : 0)
)

const getNestedValue = (obj, path) => {
    if (!path || !obj) return obj
    return path.split('.').reduce((acc, part) => acc && acc[part], obj)
}

const apiMethods = {
    registrations: {
        fetch: bmhcServices.getMhpcNewQualifications,
        transform: (item) => ({
            ...item,
            id: item.id || item.registration_no,
            applicant_name: item.application?.full_name || item.full_name || 'N/A',
            payment_status: item.is_payment_complete ? 'Paid' : 'Unpaid',
        }),
        statusField: 'application_review_status',
    },
    renewals: {
        fetch: bmhcServices.getMhpcRenewals,
        transform: (item) => ({
            ...item,
            id: item.id || `renewal-${item.user_qualification?.registration_no}`,
            renewal_id: `REN-${item.id}`,
            applicant_name: item.user_qualification?.user?.full_name || 'N/A',
            'user_qualification.registration_no': item.user_qualification?.registration_no,
        }),
        statusField: 'renewal_review_status',
    },
    cpd: {
        fetch: bmhcServices.getEpcCpdRecords,
        transform: (item) => ({
            ...item,
            id: item.id,
            applicant_name: item.full_name || 'N/A',
            start_date: item.from_date,
            end_date: item.to_date,
        }),
        statusField: 'review_status',
    },
    cogs: {
        fetch: bmhcServices.getMhpcCogs,
        transform: (item) => ({
            ...item,
            id: item.id || item.registration_no,
            cogs_number: `COGS-${item.registration_no}`,
        }),
        statusField: 'review_status',
    },
}

const statusOptionsMap = {
    registrations: ['Pending', 'Approved', 'Rejected', 'Cancelled'],
    renewals: ['Pending', 'Approved', 'Rejected', 'Cancelled'],
    cpd: ['Pending', 'Approved', 'Rejected'],
    cogs: ['Pending', 'Approved', 'Rejected', 'Expired', 'Cancelled'],
}

// Computed property for the status filter options used by DOPageHeader
const computedStatusFilterOptions = computed(() => {
    const options = statusOptionsMap[activeReport.value] || []
    // Add "All Statuses" option at the beginning
    return [
        { value: '', text: 'All Statuses' }, // Empty value for "All"
        ...options.map((status) => ({ value: status, text: status })),
    ]
})

const fetchData = async (resetPage = false) => {
    if (resetPage) {
        currentPage.value = 1
    }
    isLoading.value = true
    error.value = null
    const reportConfig = apiMethods[activeReport.value]

    if (!reportConfig || typeof reportConfig.fetch !== 'function') {
        error.value = `Configuration error: API fetch method for report type "${activeReport.value}" is not defined.`
        toast.error(error.value)
        isLoading.value = false
        reportData.value = []
        totalItems.value = 0
        return
    }

    try {
        const statusFilterKey = reportConfig.statusField || 'status'
        const params = {
            page: currentPage.value,
            page_size: ITEMS_PER_PAGE,
            ordering: sortBy.value ? `${sortOrder.value === 'desc' ? '-' : ''}${sortBy.value}` : '',
            search: filters.search,
            ...(filters.status && { [statusFilterKey]: filters.status }),
            ...(filters.startDate && { start_date: filters.startDate }),
            ...(filters.endDate && { end_date: filters.endDate }),
        }

        Object.keys(params).forEach((key) => {
            if (params[key] === '' || params[key] === null || params[key] === undefined) {
                delete params[key]
            }
        })

        const response = await reportConfig.fetch(params)

        if (response && response.data && Array.isArray(response.data.results)) {
            reportData.value = response.data.results.map((item) =>
                reportConfig.transform ? reportConfig.transform(item) : item
            )
            totalItems.value = response.data.count !== undefined ? response.data.count : 0
            if (currentPage.value > totalPages.value && totalPages.value > 0) {
                currentPage.value = totalPages.value
            } else if (totalItems.value === 0) {
                currentPage.value = 1
            }
        } else {
            console.error('Invalid API response structure:', response)
            throw new Error('Received invalid data structure from API.')
        }
    } catch (err) {
        error.value = 'Error fetching data. Please check console for details.'
        toast.error(error.value)
        console.error(`Error fetching ${activeReport.value} data:`, err)
        reportData.value = []
        totalItems.value = 0
    } finally {
        isLoading.value = false
    }
}

const debouncedFetchData = debounce(() => fetchData(true), 500)

// Event Handlers specific to DOPageHeader updates
const handleSearchUpdate = (newValue) => {
    filters.search = newValue
    debouncedFetchData() // Use debounce for search
}

const handleStatusUpdate = (newValue) => {
    filters.status = newValue
    fetchData(true) // Fetch immediately for status change, reset page
}

const handleSort = (key) => {
    if (!activeHeaders.value.find((h) => h.key === key)?.sortable) return

    if (sortBy.value === key) {
        sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
    } else {
        sortBy.value = key
        sortOrder.value = 'asc'
    }
    fetchData() // Don't reset page when sorting
}

const handleReportTypeChange = () => {
    currentPage.value = 1
    sortBy.value = ''
    sortOrder.value = 'asc'
    filters.search = ''
    filters.status = '' // Reset status filter
    filters.startDate = ''
    filters.endDate = ''
    error.value = null
    fetchData()
}

const prevPage = () => {
    if (currentPage.value > 1) {
        currentPage.value--
        fetchData()
    }
}

const nextPage = () => {
    if (currentPage.value < totalPages.value) {
        currentPage.value++
        fetchData()
    }
}

const exportToCSV = async () => {
    if (isLoadingExport.value) return
    if (reportData.value.length === 0) {
        toast.info('No data available to export.')
        return
    }
    isLoadingExport.value = true // Use separate loading state
    toast.info('Preparing export...', { timeout: 1500 })

    try {
        const allData = await fetchAllData()

        if (!allData || allData.length === 0) {
            toast.warning('No data found for the selected filters to export.')
            isLoadingExport.value = false
            return
        }

        const dataToExport = allData.map((item) => {
            const row = {}
            activeHeaders.value.forEach((header) => {
                const rawValue = getNestedValue(item, header.key)
                let formattedValue = rawValue

                if (header.type === 'date') {
                    formattedValue = formatDate(rawValue)
                } else if (header.type === 'currency') {
                    formattedValue = formatCurrency(rawValue)
                } else if (
                    header.key === 'status' ||
                    header.key.endsWith('_status') ||
                    header.key === 'is_cpd_approved'
                ) {
                    formattedValue = rawValue
                }

                row[header.label] =
                    formattedValue === null || formattedValue === undefined
                        ? ''
                        : String(formattedValue)
            })
            return row
        })

        const csv = Papa.unparse(dataToExport)

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')
        const url = URL.createObjectURL(blob)
        const filename = `${activeReport.value}_report_${formatDate(new Date(), true)}.csv`

        link.setAttribute('href', url)
        link.setAttribute('download', filename)
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)

        toast.success('Report exported successfully!')
    } catch (err) {
        console.error('Export error:', err)
        toast.error('Failed to export report. Check console for details.')
        error.value = 'Export failed.'
    } finally {
        isLoadingExport.value = false // Reset export loading state
    }
}

const fetchAllData = async () => {
    toast.info('Fetching all data for export, this may take a moment...', { autoClose: 3000 })
    const allData = []
    let page = 1
    let hasMore = true
    const reportConfig = apiMethods[activeReport.value]

    if (!reportConfig || typeof reportConfig.fetch !== 'function') {
        console.error(
            `Configuration error: API fetch method for report type "${activeReport.value}" is not defined.`
        )
        throw new Error('Export configuration error.')
    }

    const statusFilterKey = reportConfig.statusField || 'status'

    while (hasMore) {
        const params = {
            page,
            page_size: 100,
            ordering: sortBy.value ? `${sortOrder.value === 'desc' ? '-' : ''}${sortBy.value}` : '',
            search: filters.search,
            ...(filters.status && { [statusFilterKey]: filters.status }),
            ...(filters.startDate && { start_date: filters.startDate }),
            ...(filters.endDate && { end_date: filters.endDate }),
        }
        Object.keys(params).forEach((key) => {
            if (params[key] === '' || params[key] === null || params[key] === undefined) {
                delete params[key]
            }
        })

        try {
            const response = await reportConfig.fetch(params)
            if (response && response.data && Array.isArray(response.data.results)) {
                const transformedData = response.data.results.map((item) =>
                    reportConfig.transform ? reportConfig.transform(item) : item
                )
                allData.push(...transformedData)

                hasMore = response.data.next !== null && response.data.next !== undefined
                if (
                    !hasMore &&
                    response.data.results.length === params.page_size &&
                    response.data.count > allData.length
                ) {
                    console.warn(
                        'API indicates no next page, but fetched count might be incomplete.'
                    )
                }

                page++
                if (hasMore) await new Promise((resolve) => setTimeout(resolve, 50))
            } else {
                console.error("Invalid API response structure during 'fetchAllData':", response)
                hasMore = false
                throw new Error('Received invalid data structure from API during export fetch.')
            }
        } catch (err) {
            console.error(`Error fetching page ${page} for export:`, err)
            throw err
        }
    }

    return allData
}

const formatDate = (date, forFilename = false) => {
    if (!date) return '-'
    const d = new Date(date)
    if (isNaN(d.getTime())) return '-'

    if (forFilename) {
        const year = d.getFullYear()
        const month = (d.getMonth() + 1).toString().padStart(2, '0')
        const day = d.getDate().toString().padStart(2, '0')
        return `${year}-${month}-${day}`
    } else {
        return d.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short', // Use short month name for display
            year: 'numeric',
        })
    }
}

const formatCurrency = (value) => {
    if (value === null || value === undefined || value === '') return '-'
    const numValue = Number(value)
    if (isNaN(numValue)) return '-'

    return numValue.toLocaleString('en-IN', {
        // Example: Indian Rupee format
        style: 'currency',
        currency: 'INR', // Change as needed
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })
}

const statusBadge = (status) => {
    const lowerStatus = String(status ?? '').toLowerCase() // Handle null/undefined safely
    let baseClasses = 'px-2 py-1 rounded-full text-xs font-medium inline-block'

    if (lowerStatus.includes('approve') || lowerStatus === 'paid' || lowerStatus === 'active') {
        return `${baseClasses} bg-green-100 text-green-800`
    } else if (lowerStatus.includes('pending') || lowerStatus === 'unpaid') {
        return `${baseClasses} bg-yellow-100 text-yellow-800`
    } else if (lowerStatus.includes('reject') || lowerStatus.includes('cancel')) {
        return `${baseClasses} bg-red-100 text-red-800`
    } else if (lowerStatus.includes('expire')) {
        return `${baseClasses} bg-purple-100 text-purple-800`
    } else {
        return `${baseClasses} bg-gray-100 text-gray-800`
    }
}

// Watch only relevant filters for triggering fetch, debounce search separately
watch(
    () => [filters.startDate, filters.endDate],
    () => {
        fetchData(true) // Fetch immediately when date changes, reset page
    },
    { deep: true }
)

// Initial data fetch on mount
onMounted(() => {
    fetchData()
})
</script>

<style scoped>
/* Styles from the original component (kept for consistency) */
.filter-label {
    display: block;
    font-size: 0.875rem; /* 14px */
    font-weight: 500;
    color: #374151; /* gray-700 */
    margin-bottom: 0.25rem; /* 4px */
}

.filter-input,
.report-type-selector {
    display: block;
    width: 100%;
    padding: 0.5rem 0.75rem;
    border: 1px solid #d1d5db; /* gray-300 */
    border-radius: 0.375rem; /* rounded-md */
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); /* shadow-sm */
    background-color: #ffffff; /* white */
    font-size: 0.875rem; /* 14px */
}

.filter-input:focus,
.report-type-selector:focus {
    outline: none;
    border-color: #3b82f6; /* blue-500 */
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3); /* ring-blue-500 */
}

.table-header {
    padding: 0.75rem 1.5rem;
    text-align: left;
    font-size: 0.75rem; /* 12px */
    font-weight: 500;
    color: #6b7280; /* gray-500 */
    text-transform: uppercase;
    letter-spacing: 0.05em;
    background-color: #f9fafb; /* gray-50 */
    white-space: nowrap;
}

.table-cell {
    padding: 1rem 1.5rem;
    white-space: nowrap;
    font-size: 0.875rem; /* 14px */
    color: #1f2937; /* gray-800 */
}

/* Primary Button (from original) */
.btn-primary {
    display: inline-flex;
    align-items: center;
    background-color: #3b82f6;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 0.375rem;
    font-weight: 500;
    font-size: 0.875rem;
    border: none;
    cursor: pointer;
    transition: background-color 0.2s ease-in-out;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.btn-primary:hover:not(:disabled) {
    background-color: #2563eb;
}

.btn-primary:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.4);
}

.btn-primary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

/* Pagination Button (from original) */
.pagination-btn {
    padding: 0.5rem 1rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    background-color: white;
    font-size: 0.875rem;
    color: #374151;
    transition: background-color 0.2s;
    cursor: pointer;
}

.pagination-btn:hover:not(:disabled) {
    background-color: #f9fafb;
}

.pagination-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

/* Ensure Font Awesome icons display correctly */
[class*='fa-'] {
    display: inline-block;
    line-height: 1;
}
</style>
