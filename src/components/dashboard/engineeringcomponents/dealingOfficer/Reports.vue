<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <div class="p-6 bg-gray-50 min-h-screen">
        <!-- Header -->
        <div class="flex justify-between items-center mb-8">
            <h1 class="text-2xl font-bold text-gray-800">ECP Reports Dashboard</h1>
            <div class="flex gap-4">
                <button @click="exportToCSV" class="btn-success" :disabled="isLoading">
                    <span v-if="isLoading" class="mr-2">
                        <i class="fas fa-spinner fa-spin"></i>
                    </span>
                    📄 Export CSV
                </button>
                <button @click="printReport" class="btn-danger" :disabled="isLoading">
                    <span v-if="isLoading" class="mr-2">
                        <i class="fas fa-spinner fa-spin"></i>
                    </span>
                    🖨️ Print Report
                </button>
            </div>
        </div>

        <!-- Report Type Selector -->
        <div class="mb-6">
            <label for="report-type" class="filter-label">Select Report Type</label>
            <select
                id="report-type"
                v-model="activeReport"
                class="report-type-selector"
                @change="handleReportTypeChange"
            >
                <option v-for="report in reportTypes" :key="report.value" :value="report.value">
                    {{ report.label }}
                </option>
            </select>
        </div>

        <!-- Filters -->
        <div
            class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200"
        >
            <!-- Global Search -->
            <div>
                <label for="global-search" class="filter-label">Global Search</label>
                <input
                    id="global-search"
                    v-model="filters.search"
                    type="text"
                    class="filter-input"
                    placeholder="Search..."
                    @input="debouncedFetchData"
                />
            </div>

            <!-- Date Range -->
            <div>
                <label class="filter-label">Date Range (Based on Creation/Relevant Date)</label>
                <div class="flex gap-2">
                    <input
                        v-model="filters.startDate"
                        type="date"
                        class="filter-input"
                        @change="fetchData"
                        :max="filters.endDate || undefined"
                    />
                    <input
                        v-model="filters.endDate"
                        type="date"
                        class="filter-input"
                        @change="fetchData"
                        :min="filters.startDate || undefined"
                    />
                </div>
            </div>

            <!-- Status Filter -->
            <div>
                <label for="status-filter" class="filter-label">Status</label>
                <select
                    id="status-filter"
                    v-model="filters.status"
                    class="filter-input"
                    @change="fetchData"
                >
                    <option value="">All Statuses</option>
                    <option v-for="status in statusOptions" :key="status" :value="status">
                        {{ status }}
                    </option>
                </select>
            </div>
            <!-- Clear Filters Button (Optional but Recommended) -->
            <div class="flex items-end">
                <button @click="clearFilters" class="btn-secondary w-full">Clear Filters</button>
            </div>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="flex justify-center items-center py-16">
            <div class="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-500"></div>
            <p class="ml-4 text-gray-600">Loading Report Data...</p>
        </div>

        <!-- Error State -->
        <div
            v-else-if="error"
            class="bg-red-50 border border-red-200 rounded-lg p-6 mb-6 text-center shadow"
        >
            <p class="text-red-800 font-semibold text-lg">Failed to Load Report</p>
            <p class="text-red-700 mt-2">{{ error }}</p>
            <button
                @click="fetchData"
                class="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition duration-200 text-sm font-medium"
            >
                <i class="fas fa-redo mr-1"></i> Try Again
            </button>
        </div>

        <!-- Empty State -->
        <div
            v-else-if="!reportData.length"
            class="bg-white rounded-lg shadow p-12 text-center border border-gray-200"
        >
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
                    d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2z"
                />
            </svg>
            <h3 class="mt-2 text-lg font-medium text-gray-900">No Data Found</h3>
            <p class="mt-1 text-sm text-gray-500">
                There is no data available for the current report type and selected filters.
            </p>
            <p
                v-if="filters.search || filters.startDate || filters.endDate || filters.status"
                class="mt-2 text-sm text-gray-500"
            >
                Try adjusting or clearing your filters.
            </p>
        </div>

        <!-- Report Table -->
        <div v-else class="bg-white rounded-lg shadow overflow-x-auto border border-gray-200">
            <table class="min-w-full divide-y divide-gray-200" ref="reportTable">
                <thead class="bg-gray-100">
                    <tr>
                        <th
                            v-for="header in activeHeaders"
                            :key="header.key"
                            scope="col"
                            class="table-header group"
                            :class="{ 'cursor-pointer hover:bg-gray-200': header.sortable }"
                            @click="header.sortable ? handleSort(header.key) : null"
                        >
                            <div class="flex items-center justify-between">
                                <span>{{ header.label }}</span>
                                <template v-if="header.sortable">
                                    <span class="ml-2 text-gray-400 group-hover:text-gray-600">
                                        <i
                                            :class="[
                                                'fas',
                                                sortBy === header.key ||
                                                (activeReport === 'renewals' &&
                                                    header.key === 'registration_no' &&
                                                    sortBy === 'user_qualification.registration_no') // Highlight if backend key matches
                                                    ? sortOrder === 'asc'
                                                        ? 'fa-sort-up text-gray-700'
                                                        : 'fa-sort-down text-gray-700'
                                                    : 'fa-sort',
                                            ]"
                                        ></i>
                                    </span>
                                </template>
                            </div>
                        </th>
                    </tr>
                </thead>

                <tbody class="bg-white divide-y divide-gray-200">
                    <tr
                        v-for="(item, index) in reportData"
                        :key="item.id || index"
                        class="hover:bg-gray-50 transition duration-150"
                    >
                        <td v-for="header in activeHeaders" :key="header.key" class="table-cell">
                            <template
                                v-if="
                                    header.key === 'status' ||
                                    header.key === 'application_review_status' ||
                                    header.key === 'renewal_review_status' ||
                                    header.key === 'review_status' ||
                                    header.key === 'is_cpd_approved' ||
                                    header.key === 'payment_status'
                                "
                            >
                                <!-- Standardize Status Display -->
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
                                <!-- Use nullish coalescing for default 'N/A' -->
                                {{ getNestedValue(item, header.key) ?? 'N/A' }}
                            </template>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Pagination -->
        <div
            v-if="!isLoading && !error && reportData.length"
            class="mt-6 flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-lg shadow-sm border border-gray-200"
        >
            <div class="text-sm text-gray-700 mb-2 sm:mb-0">
                Showing
                <span class="font-medium">{{ totalItems > 0 ? startIndex + 1 : 0 }}</span> to
                <span class="font-medium">{{ endIndex + 1 }}</span>
                <!-- Display count correctly -->
                of <span class="font-medium">{{ totalItems }}</span> results
            </div>
            <div v-if="totalPages > 1" class="flex gap-2">
                <button
                    @click="prevPage"
                    :disabled="currentPage === 1 || isLoading"
                    class="pagination-btn"
                >
                    <i class="fas fa-chevron-left mr-1 text-xs"></i> Previous
                </button>
                <span class="px-4 py-1 text-sm font-medium text-gray-700"
                    >Page {{ currentPage }} of {{ totalPages }}</span
                >
                <button
                    @click="nextPage"
                    :disabled="currentPage >= totalPages || isLoading"
                    class="pagination-btn"
                >
                    Next <i class="fas fa-chevron-right ml-1 text-xs"></i>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, reactive, watch, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import debounce from 'lodash/debounce'
import apiServices from '@/services/services' // Ensure this path is correct

const toast = useToast()

// --- Constants ---
const ITEMS_PER_PAGE = 10

const reportTypes = [
    { label: 'Registrations', value: 'registrations' },
    { label: 'Renewals', value: 'renewals' },
    { label: 'CPD Activities', value: 'cpd' },
    { label: 'CoGS Issuance', value: 'cogs' },
]

// --- Headers Definition ---
const headers = {
    registrations: [
        // Key should match the property name in the *transformed* data object.
        { key: 'registration_no', label: 'Reg Number', sortable: true }, // Key from transform (matches API)
        { key: 'applicant_name', label: 'Applicant Name', sortable: true }, // Key from transform (will be 'N/A' until backend fix)
        { key: 'registration_type', label: 'Type', sortable: true }, // Key directly from API
        { key: 'registration_date', label: 'Reg Date', type: 'date', sortable: true }, // Key directly from API
        { key: 'expiry_date', label: 'Expiry Date', type: 'date', sortable: true }, // Key directly from API
        { key: 'application_review_status', label: 'Status', sortable: true }, // Key directly from API
        { key: 'payment_status', label: 'Payment Status', sortable: true }, // Key from transform (matches API)
    ],
    renewals: [
        { key: 'id', label: 'Renewal ID', sortable: true },
        {
            key: 'registration_no',
            label: 'Reg Number',
            sortable: true,
            backendSortKey: 'user_qualification.registration_no',
        },
        { key: 'renewal_review_status', label: 'Status', sortable: true },
        { key: 'new_expiry_date', label: 'New Expiry Date', type: 'date', sortable: true },
        { key: 'created_at', label: 'Renewal Date', type: 'date', sortable: true },
    ],
    cpd: [
        { key: 'title_of_cpd', label: 'Activity Name', sortable: true, backendSortKey: 'title' },
        { key: 'credit', label: 'Credits', sortable: true, backendSortKey: 'credit_value' },
        {
            key: 'number_of_participants',
            label: 'Participants',
            sortable: true,
            backendSortKey: 'participants_count',
        },
        {
            key: 'from_date',
            label: 'Start Date',
            type: 'date',
            sortable: true,
            backendSortKey: 'start_date',
        },
        {
            key: 'to_date',
            label: 'End Date',
            type: 'date',
            sortable: true,
            backendSortKey: 'end_date',
        },
        { key: 'status', label: 'Status', sortable: true, backendSortKey: 'is_approved' },
    ],
    cogs: [
        { key: 'registration_no', label: 'CoGS Number', sortable: true },
        { key: 'full_name', label: 'Applicant Name', sortable: true },
        { key: 'department_name', label: 'Department Name', sortable: true },
        {
            key: 'created_at',
            label: 'Issuance Date',
            type: 'date',
            sortable: true,
            backendSortKey: 'approved_date',
        },
        { key: 'payment_status', label: 'Payment Status', sortable: true },
        { key: 'endorsement_decision', label: 'Status', sortable: true },
    ],
}

// --- Reactive State ---
const activeReport = ref(reportTypes[0].value)
const reportData = ref([])
const isLoading = ref(false)
const error = ref(null)
const currentPage = ref(1)
const totalItems = ref(0)
const sortBy = ref('')
const sortOrder = ref('asc')
const reportTable = ref(null)

const filters = reactive({
    search: '',
    startDate: '',
    endDate: '',
    status: '',
})

// --- API Methods & Transformation ---
// *** IMPLEMENTED FIX BASED ON USER'S API RESPONSE ***
const apiMethods = {
    registrations: {
        fetch: apiServices.getEpcNewQualifications,
        transform: (data) => {
            const transformed = {
                ...data, // Spread all original fields from the API response first
                registration_no: data.application?.registration_no ?? 'N/A',
                applicant_name: data.application?.full_name ?? 'N/A',

                // Access 'payment_status' directly from API data. Handle null/undefined with 'N/A'.
                payment_status: data.payment_status ?? 'N/A',
            }

            // Log the final transformed object for verification
            // console.log('[Transform Registrations] Transformed Data:', JSON.parse(JSON.stringify(transformed)));
            return transformed
        },
    },
    renewals: {
        fetch: apiServices.getEpcRenewals, // Verify this API call
        transform: (data) => {
            // console.log('[Transform Renewals] Raw Data:', JSON.parse(JSON.stringify(data)));
            const transformed = {
                ...data,
                // Verify the structure of `user_qualification` in the actual Renewals API response
                registration_no: data.user_qualification?.registration_no ?? 'N/A',
            }
            // console.log('[Transform Renewals] Transformed Data:', JSON.parse(JSON.stringify(transformed)));
            return transformed
        },
    },
    cpd: {
        fetch: apiServices.getEpcCpdTasks, // Verify this API call
        transform: (data) => {
            // console.log('[Transform CPD] Raw Data:', JSON.parse(JSON.stringify(data)));
            const transformed = {
                ...data,
                registration_no: data.registration_no ?? 'N/A',
                title_of_cpd: data.title_of_cpd ?? 'N/A',
                credit: data.credit ?? 0,
                number_of_participants: data.number_of_participants ?? 0,
                from_date: data.from_date ?? null,
                to_date: data.to_date ?? null,
                // Map backend boolean 'is_approved' to frontend status string
                status:
                    data.is_cpd_approved === true
                        ? 'Approved'
                        : data.is_approved === false
                        ? 'Rejected'
                        : 'Pending',
            }
            // console.log('[Transform CPD] Transformed Data:', JSON.parse(JSON.stringify(transformed)));
            return transformed
        },
    },
    cogs: {
        fetch: apiServices.getEpcCogs, // Verify this API call
        transform: (data) => {
            // console.log('[Transform CoGS] Raw Data:', JSON.parse(JSON.stringify(data)));
            const transformed = {
                ...data,
                // Verify 'registration_no' and structure of 'application' in CoGS API response
                registration_no: data.registration_no || (data.id ? `COGS-${data.id}` : 'N/A'),
                full_name: data.full_name ?? 'N/A', // Requires backend change if application is just an ID
                department_name: data.department?.name ?? 'N/A', // Requires backend change if application is just an ID
                created_at: data.created_at ?? data.cogs_approved_date ?? null, // Verify field name
                payment_status:
                    data.is_payment_complete === true
                        ? 'Approved'
                        : data.is_approved === false
                        ? 'Rejected'
                        : 'Pending',
                status:
                    data.endorsement_decision === true
                        ? 'Approved'
                        : data.is_approved === false
                        ? 'Rejected'
                        : 'Pending',
            }
            // console.log('[Transform CoGS] Transformed Data:', JSON.parse(JSON.stringify(transformed)));
            return transformed
        },
    },
}

// --- Computed Properties ---
const activeHeaders = computed(() => headers[activeReport.value] || [])
const totalPages = computed(() => Math.ceil(totalItems.value / ITEMS_PER_PAGE))
const startIndex = computed(() => (currentPage.value - 1) * ITEMS_PER_PAGE)
// Corrected endIndex calculation for 0-based index
const endIndex = computed(() =>
    Math.min(startIndex.value + ITEMS_PER_PAGE - 1, totalItems.value - 1)
)

// Status options based on report type - adjust as needed for your system's statuses
const statusOptions = computed(() => {
    // Use statuses directly from API responses where possible for accuracy
    const options = {
        registrations: ['Pending', 'Processing', 'Approved', 'Rejected', 'Queried'], // Example, align with actual API values for application_review_status
        renewals: ['Pending', 'Processing', 'Approved', 'Rejected', 'Queried'], // Example, align with actual API values for renewal_review_status
        cpd: ['Pending', 'Approved', 'Rejected'], // Matches transform logic for is_approved
        cogs: ['Pending', 'Processing', 'Approved', 'Rejected', 'Expired'], // Example, align with actual API values for review_status
    }
    return options[activeReport.value] || []
})

// --- Methods ---

// Utility to safely get nested values
const getNestedValue = (obj, path) => {
    if (!path || typeof path !== 'string') return obj
    try {
        // Avoid splitting if path is not nested
        if (!path.includes('.')) {
            return obj?.[path]
        }
        return path.split('.').reduce((acc, part) => acc && acc[part], obj)
    } catch (error) {
        console.warn(`Could not get nested value for path "${path}" from object:`, obj, error)
        return undefined // Return undefined, template handles with '?? N/A'
    }
}

const fetchData = async (isExport = false) => {
    if (!isExport) {
        isLoading.value = true
    }
    error.value = null
    // console.log(`%cFetching data for report: ${activeReport.value}`, 'color: blue; font-weight: bold;');
    // console.log('Using filters:', JSON.parse(JSON.stringify(filters)));
    // console.log('Using pagination/sort:', { page: currentPage.value, sortBy: sortBy.value, sortOrder: sortOrder.value });

    const currentSortKey = sortBy.value // Get the key used for sorting from state
    const sortHeader = activeHeaders.value.find((h) => h.key === currentSortKey)
    const backendSortKey = sortHeader?.backendSortKey || currentSortKey // Use specific backend key if defined

    try {
        const params = {
            page: currentPage.value,
            page_size: ITEMS_PER_PAGE,
            ordering: backendSortKey
                ? `${sortOrder.value === 'desc' ? '-' : ''}${backendSortKey}`
                : undefined,
            search: filters.search || undefined,
            start_date: filters.startDate || undefined,
            end_date: filters.endDate || undefined,
        }

        const statusFilterValue = filters.status
        if (statusFilterValue) {
            switch (activeReport.value) {
                case 'registrations':
                    params.application_review_status = statusFilterValue
                    break
                case 'renewals':
                    params.renewal_review_status = statusFilterValue
                    break
                case 'cpd':
                    if (statusFilterValue === 'Approved') params.is_approved = true
                    else if (statusFilterValue === 'Rejected') params.is_approved = false
                    else if (statusFilterValue === 'Pending') params.is_approved = null // Adjust if backend expects different value for Pending
                    break
                case 'cogs':
                    params.review_status = statusFilterValue
                    break
            }
        }

        Object.keys(params).forEach((key) => params[key] === undefined && delete params[key])
        // console.log('API Request Params:', params);

        const api = apiMethods[activeReport.value]
        if (!api || !api.fetch) {
            throw new Error(`API method not defined for report type: ${activeReport.value}`)
        }

        const response = await api.fetch(params)
        // console.log('Raw API Response:', response);

        if (response.data && Array.isArray(response.data.results)) {
            // console.log('Raw API Results Array (Before Transform):', JSON.parse(JSON.stringify(response.data.results)));

            reportData.value = response.data.results.map((item, index) => {
                try {
                    // Call the correct transform function for the active report
                    return api.transform(item)
                } catch (transformError) {
                    console.error(
                        `Error transforming item ${index} for report ${activeReport.value}:`,
                        transformError,
                        'Raw item:',
                        item
                    )
                    return { ...item, transformation_error: true, id: item.id || `error-${index}` } // Ensure item has an ID for key prop
                }
            })
            totalItems.value = response.data.count ?? 0
            // console.log('Final Processed reportData:', JSON.parse(JSON.stringify(reportData.value)));
            // console.log('Total items:', totalItems.value);
        } else {
            console.warn('API response did not contain a valid results array:', response.data)
            reportData.value = []
            totalItems.value = 0
        }
    } catch (err) {
        console.error(
            `%cError fetching ${activeReport.value} data:`,
            'color: red; font-weight: bold;',
            err.response?.data || err.message || err
        )
        error.value = `Failed to load ${
            reportTypes.find((r) => r.value === activeReport.value)?.label || 'report'
        } data. ${err.response?.data?.detail || err.message || 'Please check console for details.'}`
        toast.error(error.value, { timeout: 5000 })
        reportData.value = []
        totalItems.value = 0
    } finally {
        if (!isExport) {
            isLoading.value = false
        }
    }
}

const debouncedFetchData = debounce(() => fetchData(false), 500)

const handleSort = (key) => {
    const header = activeHeaders.value.find((h) => h.key === key)
    if (!header?.sortable) return

    const newSortBy = key // Use the display key clicked by user

    if (sortBy.value === newSortBy) {
        sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
    } else {
        sortBy.value = newSortBy
        sortOrder.value = 'asc'
    }
    fetchData() // fetchData will resolve the backendSortKey based on the new sortBy state
}

const handleReportTypeChange = () => {
    currentPage.value = 1
    sortBy.value = ''
    sortOrder.value = 'asc'
    // Keep filters active when changing report type
    reportData.value = []
    totalItems.value = 0
    error.value = null
    fetchData()
}

const clearFilters = () => {
    filters.search = ''
    filters.startDate = ''
    filters.endDate = ''
    filters.status = ''
    // Reset pagination and sorting when clearing filters
    currentPage.value = 1
    sortBy.value = ''
    sortOrder.value = 'asc'
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

// --- Export Methods ---

const fetchAllData = async () => {
    const allData = []
    let currentPageForExport = 1
    let hasMore = true
    const EXPORT_PAGE_SIZE = 100

    const globalLoadingToastId = toast.info('Preparing export data... This may take a while.', {
        timeout: false, // Keep open until dismissed
        closeButton: false,
        icon: 'fas fa-spinner fa-spin',
    })
    isLoading.value = true // Set main loading state as well

    const currentSortKey = sortBy.value
    const sortHeader = activeHeaders.value.find((h) => h.key === currentSortKey)
    const backendSortKey = sortHeader?.backendSortKey || currentSortKey

    while (hasMore) {
        const params = {
            page: currentPageForExport,
            page_size: EXPORT_PAGE_SIZE,
            ordering: backendSortKey
                ? `${sortOrder.value === 'desc' ? '-' : ''}${backendSortKey}`
                : undefined,
            search: filters.search || undefined,
            start_date: filters.startDate || undefined,
            end_date: filters.endDate || undefined,
        }

        const statusFilterValue = filters.status
        if (statusFilterValue) {
            switch (activeReport.value) {
                case 'registrations':
                    params.application_review_status = statusFilterValue
                    break
                case 'renewals':
                    params.renewal_review_status = statusFilterValue
                    break
                case 'cpd':
                    if (statusFilterValue === 'Approved') params.is_approved = true
                    else if (statusFilterValue === 'Rejected') params.is_approved = false
                    else if (statusFilterValue === 'Pending') params.is_approved = null
                    break
                case 'cogs':
                    params.review_status = statusFilterValue
                    break
            }
        }

        Object.keys(params).forEach((key) => params[key] === undefined && delete params[key])

        try {
            // console.log(`Fetching export page ${currentPageForExport} with params:`, params);
            const api = apiMethods[activeReport.value]
            if (!api || !api.fetch)
                throw new Error(`API method not defined for export: ${activeReport.value}`)

            const response = await api.fetch(params)

            if (response.data && Array.isArray(response.data.results)) {
                const transformedData = response.data.results.map((item) => {
                    try {
                        return api.transform(item)
                    } catch (transformError) {
                        console.error(`Export Transform Error:`, transformError, 'Raw item:', item)
                        return {
                            ...item,
                            transformation_error: true,
                            id: item.id || `export-error-${allData.length}`,
                        }
                    }
                })
                allData.push(...transformedData)
                hasMore = response.data.next !== null
                currentPageForExport++
                // Update progress toast
                toast.update(
                    globalLoadingToastId,
                    { content: `Fetched ${allData.length} records...` },
                    true
                )
            } else {
                console.warn('Invalid response structure during export fetch:', response.data)
                hasMore = false
            }
        } catch (err) {
            console.error(
                'Error fetching all data for export:',
                err.response?.data || err.message || err
            )
            toast.dismiss(globalLoadingToastId)
            toast.error('Error fetching data for export. Export may be incomplete.', {
                timeout: 5000,
            })
            isLoading.value = false // Ensure loading state is reset on error
            throw err
        }
    }

    toast.dismiss(globalLoadingToastId)
    isLoading.value = false
    console.log(`Fetched a total of ${allData.length} records for export.`)
    if (allData.length === 0) {
        toast.warning('No data found to export for the current filters.', { timeout: 3000 })
    }
    return allData
}

const exportToCSV = async () => {
    isLoading.value = true // Indicate loading on the button specifically
    const exportButton = document.querySelector('.btn-success') // Crude way to disable, better if bound to a specific ref
    if (exportButton) exportButton.disabled = true

    try {
        const allRawData = await fetchAllData()
        if (!allRawData || allRawData.length === 0) return // Stop if fetchAllData showed warning

        // Prepare headers and data for CSV
        const headers = activeHeaders.value.map((header) => header.label)

        // Prepare rows
        const rows = allRawData.map((item) => {
            return activeHeaders.value.map((header) => {
                const value = getNestedValue(item, header.key)
                let csvValue = ''

                if (header.type === 'date') {
                    csvValue = formatDate(value) !== '-' ? formatDate(value) : ''
                } else if (header.type === 'currency') {
                    csvValue =
                        formatCurrency(value) !== '-'
                            ? formatCurrency(value).replace(/[^\d.-]/g, '')
                            : ''
                } else if (typeof value === 'object' && value !== null) {
                    csvValue = JSON.stringify(value)
                } else {
                    csvValue = value ?? ''
                }

                // Proper CSV escaping for cells with commas, quotes, or newlines
                if (
                    typeof csvValue === 'string' &&
                    (csvValue.includes(',') || csvValue.includes('"') || csvValue.includes('\n'))
                ) {
                    return `"${csvValue.replace(/"/g, '""')}"`
                }

                return csvValue
            })
        })

        // Create CSV content
        const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n')

        // Create file and trigger download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        const reportTitle =
            reportTypes.find((r) => r.value === activeReport.value)?.label || 'Report'

        link.setAttribute('href', url)
        link.setAttribute(
            'download',
            `${reportTitle}_Report_${formatDate(new Date(), 'yyyy-mm-dd')}.csv`
        )
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        toast.success('CSV report exported successfully', { timeout: 3000 })
    } catch (err) {
        // Error already handled/logged by fetchAllData or shown in toast
        console.error('CSV Export failed:', err)
        // Ensure toast indicates failure if not already shown by fetchAllData
        if (!toast.isActive('export-toast')) {
            toast.error('Failed to export CSV report.', { timeout: 4000 })
        }
    } finally {
        isLoading.value = false
        if (exportButton) exportButton.disabled = false
    }
}

const printReport = async () => {
    isLoading.value = true
    const exportButton = document.querySelector('.btn-danger')
    if (exportButton) exportButton.disabled = true

    try {
        const allRawData = await fetchAllData()
        if (!allRawData || allRawData.length === 0) return // Stop if fetchAllData showed warning

        const reportTitle =
            reportTypes.find((r) => r.value === activeReport.value)?.label || 'Report'

        // Create a new window for printing
        const printWindow = window.open('', '_blank')
        if (!printWindow) {
            toast.error('Please allow popups to print reports', { timeout: 4000 })
            return
        }

        // Generate headers and rows HTML
        const headerCells = activeHeaders.value
            .map(
                (header) =>
                    `<th style="padding: 8px; text-align: left; border: 1px solid #ddd; background-color: #f2f2f2; font-weight: bold;">${header.label}</th>`
            )
            .join('')

        const rows = allRawData
            .map((item) => {
                const rowCells = activeHeaders.value
                    .map((header) => {
                        const value = getNestedValue(item, header.key)
                        let cellContent = ''
                        let cellClass = ''

                        // Handle different column types
                        if (header.type === 'date') {
                            cellContent = formatDate(value)
                        } else if (header.type === 'currency') {
                            cellContent = formatCurrency(value)
                        } else if (
                            header.key === 'status' ||
                            header.key === 'application_review_status' ||
                            header.key === 'review_status' ||
                            header.key === 'payment_status'
                        ) {
                            // Add styling for status cells
                            const status = (value || '').toString().toLowerCase().trim()
                            if (status === 'approved' || status === 'active') {
                                cellClass = 'background-color: #d4edda; color: #155724;'
                            } else if (status === 'pending' || status === 'processing') {
                                cellClass = 'background-color: #fff3cd; color: #856404;'
                            } else if (status === 'rejected' || status === 'cancelled') {
                                cellClass = 'background-color: #f8d7da; color: #721c24;'
                            }
                            cellContent = value ?? 'N/A'
                        } else {
                            cellContent = value ?? 'N/A'
                        }

                        return `<td style="padding: 8px; text-align: left; border: 1px solid #ddd; ${cellClass}">${cellContent}</td>`
                    })
                    .join('')

                return `<tr>${rowCells}</tr>`
            })
            .join('')

        // Generate the full HTML content
        const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${reportTitle} Report</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { color: #333; text-align: center; }
          .report-info { margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          .print-button {
            display: block;
            margin: 20px auto;
            padding: 10px 20px;
            background: #007bff;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 16px;
          }
          .print-button:hover { background: #0069d9; }
          @media print {
            .print-button { display: none; }
            body { margin: 0; }
            h1 { margin-top: 0; }
          }
        </style>
      </head>
      <body>
        <h1>${reportTitle} Report</h1>

        <div class="report-info">
          <p><strong>Generated:</strong> ${formatDate(new Date(), 'datetime')}</p>
          ${filters.search ? `<p><strong>Search:</strong> "${filters.search}"</p>` : ''}
          ${
              filters.startDate || filters.endDate
                  ? `<p><strong>Date Range:</strong> ${
                        filters.startDate ? formatDate(filters.startDate) : 'Any'
                    } to ${filters.endDate ? formatDate(filters.endDate) : 'Present'}</p>`
                  : ''
          }
          ${filters.status ? `<p><strong>Status:</strong> ${filters.status}</p>` : ''}
          <p><strong>Total Records:</strong> ${allRawData.length}</p>
        </div>

        <table>
          <thead>
            <tr>${headerCells}</tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>

        <button class="print-button" onclick="window.print()">Print Report</button>
      </body>
      </html>
    `

        // Write to the window and trigger printing
        printWindow.document.open()
        printWindow.document.write(printContent)
        printWindow.document.close()

        printWindow.onload = function () {
            // Give the browser a moment to render before printing
            setTimeout(() => {
                printWindow.focus()
            }, 250)
        }

        toast.success('Print report prepared successfully', { timeout: 3000 })
    } catch (err) {
        console.error('Print Report failed:', err)
        if (!toast.isActive('print-toast')) {
            toast.error('Failed to prepare print report.', { timeout: 4000 })
        }
    } finally {
        isLoading.value = false
        if (exportButton) exportButton.disabled = false
    }
}

// --- Helper Functions ---

const formatDate = (dateString, format = 'default') => {
    if (!dateString) return '-'
    try {
        const date = new Date(dateString)
        if (isNaN(date.getTime())) return '-' // Invalid date check

        if (format === 'yyyy-mm-dd') {
            const year = date.getFullYear()
            const month = (date.getMonth() + 1).toString().padStart(2, '0')
            const day = date.getDate().toString().padStart(2, '0')
            return `${year}-${month}-${day}`
        }
        if (format === 'datetime') {
            // Format: DD/MM/YYYY, HH:MM:SS (24hr)
            return date
                .toLocaleString('en-GB', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false,
                })
                .replace(',', '')
        }

        // Default format DD/MM/YYYY
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        })
    } catch (e) {
        console.error('Error formatting date:', dateString, e)
        return '-' // Return fallback on error
    }
}

const formatCurrency = (value) => {
    const num = Number(value)
    if (value === null || value === undefined || isNaN(num)) return '-'
    try {
        return new Intl.NumberFormat('en-IN', {
            // Using en-IN as proxy for BTN formatting
            style: 'currency',
            currency: 'BTN',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(num)
    } catch (e) {
        console.error('Error formatting currency:', value, e)
        return '-' // Fallback
    }
}

const statusBadge = (status) => {
    const lowerStatus = String(status ?? '')
        .toLowerCase()
        .trim() // Handle null/undefined/whitespace
    let baseClasses =
        'px-2.5 py-0.5 rounded-full text-xs font-medium inline-block whitespace-nowrap border' // Added border base

    // Define colors based on common status keywords - Prioritize specific matches
    switch (lowerStatus) {
        case 'approved':
        case 'paid':
        case 'active':
            return `${baseClasses} bg-green-100 text-green-800 border-green-200`
        case 'pending':
        case 'processing':
        case 'unpaid':
            return `${baseClasses} bg-yellow-100 text-yellow-800 border-yellow-200`
        case 'queried':
        case 'review': // Added 'review'
        case 'submitted': // Added 'submitted'
            return `${baseClasses} bg-blue-100 text-blue-800 border-blue-200`
        case 'rejected':
        case 'cancelled': // Added 'cancelled'
            return `${baseClasses} bg-red-100 text-red-800 border-red-200`
        case 'expired':
        case 'inactive':
            return `${baseClasses} bg-gray-200 text-gray-800 border-gray-300` // Darker gray for expired
        case 'n/a':
            return `${baseClasses} bg-gray-100 text-gray-500 border-gray-200` // Lighter gray for N/A
        default:
            // Fallback for unknown statuses
            return `${baseClasses} bg-gray-100 text-gray-700 border-gray-200`
    }
}

// --- Lifecycle Hooks ---
watch(activeReport, (newValue, oldValue) => {
    if (newValue !== oldValue) {
        handleReportTypeChange()
    }
})

// Initialize data on mount
onMounted(() => {
    console.log('ECP Reports Dashboard Mounted. Initial Fetch.')
    fetchData()
})
</script>

<style scoped>
/* Styles remain the same as the previous complete code version */
.filter-label {
    display: block;
    font-size: 0.875rem; /* 14px */
    font-weight: 500;
    color: #4b5563; /* gray-600 */
    margin-bottom: 0.25rem;
}

.filter-input,
.report-type-selector {
    width: 100%;
    padding: 0.625rem 0.75rem; /* 10px 12px */
    border: 1px solid #d1d5db; /* gray-300 */
    border-radius: 0.375rem; /* 6px */
    background-color: #ffffff;
    font-size: 0.875rem;
    color: #111827; /* gray-900 */
    transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.filter-input::placeholder {
    color: #9ca3af; /* gray-400 */
}

.filter-input:focus,
.report-type-selector:focus {
    outline: none;
    border-color: #3b82f6; /* blue-500 */
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
}

.table-header {
    padding: 0.75rem 1.5rem; /* 12px 24px */
    text-align: left;
    font-size: 0.75rem; /* 12px */
    font-weight: 600; /* Semibold */
    color: #4b5563; /* gray-600 */
    text-transform: uppercase;
    letter-spacing: 0.05em;
    background-color: #f9fafb; /* gray-50 */
    border-bottom: 2px solid #e5e7eb; /* gray-200 */
}

.table-cell {
    padding: 1rem 1.5rem; /* 16px 24px */
    white-space: nowrap;
    font-size: 0.875rem; /* 14px */
    color: #374151; /* gray-700 */
    border-bottom: 1px solid #e5e7eb; /* gray-200 */
    /* Add vertical alignment */
    vertical-align: middle;
}

/* Button base styles */
.btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.625rem 1.25rem; /* 10px 20px */
    border-radius: 0.5rem; /* 8px */
    font-weight: 500;
    font-size: 0.875rem;
    transition: background-color 0.2s ease-in-out, opacity 0.2s ease-in-out,
        box-shadow 0.2s ease-in-out;
    border: none;
    cursor: pointer;
    white-space: nowrap; /* Prevent wrapping */
}
.btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    box-shadow: none;
}
.btn i.fas {
    /* Target font awesome icons */
    margin-right: 0.5rem; /* Space between icon and text */
    font-size: 0.875em; /* Slightly smaller icon */
}
.btn span.mr-2 {
    /* Specifically for loading spinner span */
    display: inline-flex;
    align-items: center;
}

.btn-success {
    @apply btn;
    background-color: #10b981; /* green-500 */
    color: white;
}
.btn-success:hover:not(:disabled) {
    background-color: #059669; /* green-600 */
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
}

.btn-danger {
    @apply btn;
    background-color: #ef4444; /* red-500 */
    color: white;
}
.btn-danger:hover:not(:disabled) {
    background-color: #dc2626; /* red-600 */
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
}

.btn-secondary {
    @apply btn;
    background-color: #6b7280; /* gray-500 */
    color: white;
}
.btn-secondary:hover:not(:disabled) {
    background-color: #4b5563; /* gray-600 */
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
}

.pagination-btn {
    padding: 0.5rem 1rem; /* 8px 16px */
    border: 1px solid #d1d5db; /* gray-300 */
    border-radius: 0.375rem; /* 6px */
    background-color: white;
    color: #374151; /* gray-700 */
    font-size: 0.875rem;
    transition: background-color 0.2s, border-color 0.2s;
    display: inline-flex;
    align-items: center;
}
.pagination-btn:hover:not(:disabled) {
    background-color: #f9fafb; /* gray-50 */
    border-color: #9ca3af; /* gray-400 */
}
.pagination-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background-color: #f9fafb;
}
.pagination-btn i {
    font-size: 0.75rem; /* smaller chevron */
}

/* Ensure report type selector has some bottom margin */
.report-type-selector {
    margin-bottom: 1rem; /* Add some space below the selector */
}
</style>
