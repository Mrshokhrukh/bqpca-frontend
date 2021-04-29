<!-- ChiefReport.vue -->
<template>
    <div class="p-4 bg-gray-50 min-h-screen">
        <!-- Added background and min-height -->
        <!-- Loading Overlay -->
        <div
            v-if="loading"
            class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
        >
            <div class="flex flex-col items-center text-white">
                <i class="pi pi-spin pi-spinner text-4xl mb-2"></i>
                <span class="text-lg font-semibold">Loading Data...</span>
            </div>
        </div>

        <!-- Header with Export Button -->
        <div class="flex justify-between items-center mb-4">
            <h1 class="text-2xl font-bold text-gray-900">Chief's Report</h1>
            <!-- Changed Button -->
            <button
                @click="exportToCSV"
                :disabled="loading || filteredData.length === 0"
                class="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <i class="pi pi-file-csv mr-2"></i>
                <!-- Changed icon -->
                Export CSV
            </button>
        </div>

        <!-- Quick Stats -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div
                v-for="(stat, index) in statsArray"
                :key="index"
                class="bg-white p-4 rounded-lg shadow border border-gray-100"
            >
                <div class="flex items-center justify-between mb-2">
                    <span class="text-sm font-medium text-gray-500">{{ stat.label }}</span>
                    <component :is="stat.icon" class="w-5 h-5 text-gray-400" />
                    <!-- Increased icon size -->
                </div>
                <p class="text-2xl font-semibold text-gray-800">{{ stat.value }}</p>
                <!-- Changed font weight/color -->
                <p v-if="stat.trend" class="text-xs text-gray-500 mt-1">{{ stat.trend }}</p>
                <!-- Adjusted trend style -->
            </div>
        </div>

        <!-- Filter Section -->
        <div class="bg-white p-4 rounded-lg shadow border border-gray-100 mb-4">
            <div class="flex flex-wrap items-end gap-4">
                <!-- Use items-end for alignment -->
                <div class="flex-grow min-w-[200px]">
                    <label
                        for="dateRangeSelect"
                        class="block text-sm font-medium text-gray-700 mb-1"
                        >Date Range</label
                    >
                    <select
                        id="dateRangeSelect"
                        v-model="dateRange"
                        class="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                    >
                        <option value="all">All Time</option>
                        <option value="today">Today</option>
                        <option value="week">This Week</option>
                        <option value="month">This Month</option>
                        <option value="year">This Year</option>
                    </select>
                </div>
                <div class="flex-grow min-w-[250px]">
                    <label for="searchInput" class="block text-sm font-medium text-gray-700 mb-1"
                        >Search</label
                    >
                    <div class="relative">
                        <span
                            class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                        >
                            <i class="pi pi-search text-gray-400"></i>
                        </span>
                        <input
                            id="searchInput"
                            type="text"
                            v-model="searchQuery"
                            placeholder="Search ID, Name, Officer, Status..."
                            class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                        />
                    </div>
                </div>
                <!-- Optional: Clear Filters Button -->
                <!-- <button @click="clearFilters" class="px-4 py-2 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Clear</button> -->
            </div>
        </div>

        <!-- Applications Table -->
        <div class="bg-white rounded-lg shadow border border-gray-100 overflow-hidden">
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th
                                v-for="header in tableHeaders"
                                :key="header.key"
                                class="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer whitespace-nowrap"
                                @click="sortBy(header.key)"
                                :class="{ 'hover:bg-gray-100': true }"
                            >
                                <div class="flex items-center">
                                    <span>{{ header.label }}</span>
                                    <i
                                        v-if="sortKey === header.key"
                                        :class="[
                                            'pi',
                                            sortOrder === 'asc' ? 'pi-sort-up' : 'pi-sort-down',
                                            'ml-1.5 text-gray-700',
                                        ]"
                                    ></i>
                                    <i
                                        v-else
                                        class="pi pi-sort-alt ml-1.5 text-gray-400 group-hover:text-gray-500"
                                    ></i>
                                </div>
                            </th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-if="loading && applications.length === 0">
                            <!-- Initial Loading state -->
                            <td
                                :colspan="tableHeaders.length"
                                class="text-center py-10 text-gray-500"
                            >
                                <i class="pi pi-spin pi-spinner text-2xl"></i> Loading
                                applications...
                            </td>
                        </tr>
                        <tr v-else-if="!loading && filteredData.length === 0">
                            <!-- No data/filtered state -->
                            <td
                                :colspan="tableHeaders.length"
                                class="text-center py-10 text-gray-500"
                            >
                                No applications match your current filters.
                            </td>
                        </tr>
                        <tr
                            v-else
                            v-for="app in paginatedData"
                            :key="app.id"
                            class="hover:bg-gray-50 transition-colors duration-150"
                        >
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                {{ app.id }}
                            </td>
                            <td
                                class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                            >
                                {{ app.full_name }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {{ formatDate(app.created_at) }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {{ app.user?.username || '-' }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm">
                                <span :class="getStatusClass(getQualificationStatus(app))">
                                    {{ getQualificationStatus(app) }}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {{ app.registration_no || '-' }}
                            </td>
                            <td class="px-6 py-4 text-sm text-gray-500">
                                <div
                                    class="truncate max-w-xs"
                                    :title="getDealingOfficerRemarks(app)"
                                >
                                    {{ getDealingOfficerRemarks(app) || '-' }}
                                </div>
                            </td>
                            <td class="px-6 py-4 text-sm text-gray-500">
                                <div class="truncate max-w-xs" :title="getChiefRemarks(app)">
                                    {{ getChiefRemarks(app) || '-' }}
                                </div>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {{ calculateProcessingDays(app) }} days
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Pagination -->
            <div class="px-4 py-3 border-t border-gray-200 bg-white">
                <!-- Ensure bg is white -->
                <div class="flex items-center justify-between flex-wrap gap-y-2">
                    <div class="text-sm text-gray-600">
                        <span v-if="filteredData.length > 0">
                            Showing {{ startIndex + 1 }} to {{ endIndex }} of
                            {{ filteredData.length }} entries
                        </span>
                        <span v-else> No entries found </span>
                    </div>
                    <div v-if="totalPages > 1" class="flex items-center space-x-2 sm:space-x-4">
                        <!-- Show only if multiple pages -->
                        <button
                            @click="previousPage"
                            :disabled="currentPage === 1 || loading"
                            class="px-3 py-1.5 text-sm rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed disabled:bg-gray-100"
                        >
                            Previous
                        </button>
                        <span class="text-sm text-gray-600"
                            >Page {{ currentPage }} of {{ totalPages }}</span
                        >
                        <button
                            @click="nextPage"
                            :disabled="currentPage === totalPages || loading"
                            class="px-3 py-1.5 text-sm rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed disabled:bg-gray-100"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useToast } from 'vue-toastification'
import { Clock, CheckCircle, XCircle, ClipboardList } from 'lucide-vue-next'
import {
    format,
    startOfDay, // Use startOfDay for accuracy
    endOfDay, // Use endOfDay for accuracy
    startOfWeek,
    endOfWeek,
    startOfMonth,
    endOfMonth,
    startOfYear,
    endOfYear,
    isWithinInterval,
    differenceInCalendarDays, // More accurate than differenceInDays
    parseISO, // Use parseISO for robust date parsing
    isValid, // Check if date is valid
} from 'date-fns'
import Papa from 'papaparse' // Import Papa Parse
import apiService from '@/services/services'

// Remove jsPDF imports
// import jsPDF from 'jspdf'
// import 'jspdf-autotable'

// State variables
const searchQuery = ref('')
const dateRange = ref('all') // Default to 'all'
const currentPage = ref(1)
const itemsPerPage = ref(10) // Keep consistent pagination size
const sortKey = ref('created_at') // Default sort key
const sortOrder = ref('desc') // Default sort order
const applications = ref([]) // Holds the raw data from API
const loading = ref(false)
const toast = useToast()
let refreshInterval = null
const AUTO_REFRESH_INTERVAL = 5 * 60 * 1000 // 5 minutes in milliseconds

// Table configuration (Adjusted keys based on previous examples and likely API structure)
const tableHeaders = [
    { key: 'id', label: 'App ID' },
    { key: 'full_name', label: 'Applicant Name' },
    { key: 'created_at', label: 'Submitted' },
    { key: 'user.username', label: 'Dealing Officer' }, // Nested property access
    { key: 'status', label: 'Status' }, // Will derive from getQualificationStatus
    { key: 'registration_no', label: 'QEC Number' },
    { key: 'dealing_officer_remarks', label: 'DO Remarks' }, // Derived
    { key: 'chief_remarks', label: 'Chief Remarks' }, // Derived
    { key: 'processing_time', label: 'Processing Time' }, // Calculated
]

// --- Computed Properties ---

// Calculate stats based on the full unfiltered dataset
const stats = computed(() => {
    const total = applications.value.length
    let approved = 0
    let regretted = 0
    let pending = 0

    applications.value.forEach((app) => {
        const status = getQualificationStatus(app) // Use helper consistently
        if (status === 'Approved') approved++
        else if (status === 'Regretted') regretted++
        else pending++ // Everything else is considered pending review by the chief
    })

    const approvalRate = total > 0 ? ((approved / total) * 100).toFixed(1) : '0.0'

    return {
        total,
        approved,
        regretted,
        pending,
        approvalRate,
    }
})

const statsArray = computed(() => [
    {
        label: 'Total Reviews',
        value: stats.value.total,
        icon: ClipboardList,
        trend: 'All applications received',
    },
    {
        label: 'Pending Review',
        value: stats.value.pending,
        icon: Clock,
        trend: 'Awaiting Chief decision',
    },
    {
        label: 'Approved',
        value: stats.value.approved,
        icon: CheckCircle,
        trend: `${stats.value.approvalRate}% approval rate`,
    },
    {
        label: 'Regretted',
        value: stats.value.regretted,
        icon: XCircle,
        trend: `${(100 - parseFloat(stats.value.approvalRate)).toFixed(1)}% regret rate`,
    },
])

// Calculate date range interval for filtering
const dateRangeFilter = computed(() => {
    const now = new Date()
    try {
        switch (dateRange.value) {
            case 'today':
                return { start: startOfDay(now), end: endOfDay(now) }
            case 'week':
                // Ensure week starts on Sunday or Monday depending on locale if needed
                return {
                    start: startOfWeek(now, { weekStartsOn: 1 }),
                    end: endOfWeek(now, { weekStartsOn: 1 }),
                }
            case 'month':
                return { start: startOfMonth(now), end: endOfMonth(now) }
            case 'year':
                return { start: startOfYear(now), end: endOfYear(now) }
            default: // 'all' or invalid
                return null
        }
    } catch (e) {
        console.error('Error calculating date range:', e)
        return null // Fallback to no filter on error
    }
})

// Filtered and Sorted Data (Client-Side)
const filteredData = computed(() => {
    let filtered = [...applications.value]

    // 1. Date Range Filter
    const interval = dateRangeFilter.value
    if (interval) {
        filtered = filtered.filter((app) => {
            try {
                const appDate = parseISO(app.created_at) // Use parseISO
                return isValid(appDate) && isWithinInterval(appDate, interval)
            } catch {
                return false // Exclude if date is invalid
            }
        })
    }

    // 2. Search Filter (more comprehensive)
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase().trim()
        if (query) {
            filtered = filtered.filter((app) => {
                return (
                    String(app.id).toLowerCase().includes(query) ||
                    app.full_name?.toLowerCase().includes(query) ||
                    app.user?.username?.toLowerCase().includes(query) ||
                    getQualificationStatus(app).toLowerCase().includes(query) ||
                    (app.registration_no &&
                        String(app.registration_no).toLowerCase().includes(query)) ||
                    getDealingOfficerRemarks(app)?.toLowerCase().includes(query) ||
                    getChiefRemarks(app)?.toLowerCase().includes(query)
                )
            })
        }
    }

    // 3. Sorting
    return filtered.sort((a, b) => {
        let aValue = getNestedValue(a, sortKey.value)
        let bValue = getNestedValue(b, sortKey.value)

        // Handle specific types for sorting
        if (sortKey.value === 'created_at') {
            aValue = aValue ? parseISO(aValue).getTime() : 0
            bValue = bValue ? parseISO(bValue).getTime() : 0
        } else if (sortKey.value === 'processing_time') {
            aValue = calculateProcessingDays(a)
            bValue = calculateProcessingDays(b)
        } else if (sortKey.value === 'status') {
            aValue = getQualificationStatus(a)
            bValue = getQualificationStatus(b)
        }

        // Basic comparison after potential transformation
        const comparison = String(aValue ?? '').localeCompare(String(bValue ?? ''), undefined, {
            numeric: true,
            sensitivity: 'base',
        })

        return sortOrder.value === 'asc' ? comparison : -comparison
    })
})

// Pagination Computeds
const totalPages = computed(() =>
    Math.max(1, Math.ceil(filteredData.value.length / itemsPerPage.value))
)
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value)
const endIndex = computed(() =>
    Math.min(startIndex.value + itemsPerPage.value, filteredData.value.length)
)
const paginatedData = computed(() => filteredData.value.slice(startIndex.value, endIndex.value))

// --- Methods ---

// Fetch all applications (since filtering is client-side)
const fetchApplications = async () => {
    loading.value = true
    try {
        // Assuming this endpoint returns *all* applications relevant to the chief
        const response = await apiService.getMhpcNewApplications() // Verify endpoint returns necessary data

        if (response?.data?.results && Array.isArray(response.data.results)) {
            applications.value = response.data.results
            // Reset page to 1 if current page becomes invalid after data refresh
            if (currentPage.value > totalPages.value && totalPages.value > 0) {
                currentPage.value = totalPages.value
            } else if (filteredData.value.length === 0 && applications.value.length > 0) {
                // If filters result in no data, stay on page 1
                currentPage.value = 1
            }
        } else {
            applications.value = []
            console.error('Unexpected API response format:', response)
            toast.error('Failed to load applications: Invalid data format.')
        }
    } catch (error) {
        console.error('Error fetching applications:', error)
        applications.value = []
        const errorMsg =
            error.response?.data?.detail ||
            error.response?.data?.message ||
            error.message ||
            'An unknown error occurred'
        toast.error(`Failed to load applications: ${errorMsg}`)
    } finally {
        loading.value = false
    }
}

// Sorting logic
const sortBy = (key) => {
    if (sortKey.value === key) {
        sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
    } else {
        sortKey.value = key
        sortOrder.value = 'asc' // Default to ascending when changing column
    }
    // Reset to first page when sorting changes
    currentPage.value = 1
}

// Helper to get nested values safely (for sorting)
const getNestedValue = (obj, path) => {
    if (!path) return obj
    return path.split('.').reduce((acc, part) => acc && acc[part], obj)
}

// Data extraction helpers (ensure these match your actual data structure)
const getQualificationStatus = (app) => {
    // Prioritize chief's decision if available
    const qual = app?.user_qualifications?.[0]
    if (qual?.endorsement_decision) {
        // endorsement_decision by Chief
        return (
            qual.endorsement_decision.charAt(0).toUpperCase() + qual.endorsement_decision.slice(1)
        )
    }
    // Fallback to physical review status if no chief decision yet
    if (qual?.physical_review_status) {
        // physical_review_status by DO
        // Map DO status to broader categories if needed, or return directly
        // Example mapping: 'Recommend Approval' -> 'Pending', 'Recommend Rejection' -> 'Pending'
        // For this report, maybe just indicate it's processed by DO:
        // return `Pending (${qual.physical_review_status})`;
        return 'Pending' // Simplification: If DO reviewed but Chief hasn't, it's Pending Chief review
    }
    // Default if no qualification data or relevant statuses
    return 'Pending'
}

const getDealingOfficerRemarks = (app) => {
    return app?.user_qualifications?.[0]?.physical_review_remark || ''
}

const getChiefRemarks = (app) => {
    return app?.user_qualifications?.[0]?.endorsement_remarks || ''
}

// Pagination handlers
const previousPage = () => {
    if (currentPage.value > 1) currentPage.value--
}

const nextPage = () => {
    if (currentPage.value < totalPages.value) currentPage.value++
}

// Date and Time helpers
const calculateProcessingDays = (application) => {
    try {
        if (!application?.created_at) return 0
        const submissionDate = parseISO(application.created_at)
        if (!isValid(submissionDate)) return 0

        // Use completion_date if available (from qualification), otherwise today
        let endDate = new Date()
        const completionDateStr = application?.user_qualifications?.[0]?.completion_date // Assuming completion date is here
        if (completionDateStr) {
            const parsedCompletionDate = parseISO(completionDateStr)
            if (isValid(parsedCompletionDate)) {
                endDate = parsedCompletionDate
            }
        }
        return differenceInCalendarDays(endDate, submissionDate)
    } catch (e) {
        console.error('Error calculating processing days:', e)
        return 0 // Return 0 on error
    }
}

const formatDate = (dateString, forFilename = false) => {
    if (!dateString) return 'N/A'
    try {
        const date = parseISO(dateString)
        if (!isValid(date)) return 'N/A'
        if (forFilename) {
            return format(date, 'yyyy-MM-dd')
        }
        return format(date, 'dd MMM yyyy') // e.g., 15 Jul 2023
    } catch (e) {
        console.error('Error formatting date:', e)
        return 'N/A' // Return N/A on error
    }
}

// Status styling helper
const getStatusClass = (status) => {
    const lowerStatus = status?.toLowerCase() || 'pending'
    const classes = {
        approved:
            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800',
        regretted:
            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800',
        pending:
            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800',
        // Add other statuses if needed based on getQualificationStatus logic
    }
    return (
        classes[lowerStatus] ||
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800'
    )
}

// --- NEW CSV Export Function ---
const exportToCSV = async () => {
    if (loading.value) return
    if (filteredData.value.length === 0) {
        toast.info('No data available to export for the current filters.')
        return
    }
    loading.value = true
    toast.info('Generating CSV report...', { timeout: 1500 })

    try {
        // Data to export is the currently filtered and sorted data
        const dataToExport = filteredData.value

        // Map data to CSV format using helper functions for consistency
        const csvData = dataToExport.map((app) => ({
            'Application ID': app.id,
            'Applicant Name': app.full_name,
            'Submission Date': formatDate(app.created_at),
            'Dealing Officer': app.user?.username || '-',
            Status: getQualificationStatus(app),
            'QEC Number': app.registration_no || '-',
            'DO Remarks': getDealingOfficerRemarks(app) || '-',
            'Chief Remarks': getChiefRemarks(app) || '-',
            'Processing Time (days)': calculateProcessingDays(app),
            // Add other raw fields if needed, e.g.,
            'DO Decision Raw': app?.user_qualifications?.[0]?.physical_review_status || '',
            'Chief Decision Raw': app?.user_qualifications?.[0]?.endorsement_decision || '',
        }))

        // Get headers from the first object keys
        const headers = Object.keys(csvData[0] || {})
        if (headers.length === 0) {
            throw new Error('No data could be prepared for export.')
        }

        // Convert to CSV string using Papa Parse
        const csv = Papa.unparse(csvData, {
            header: true,
            columns: headers, // Ensure order
        })

        // Create Blob and trigger download
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')
        const url = URL.createObjectURL(blob)
        const filename = `chief_report_${formatDate(new Date(), true)}.csv` // Use helper

        link.setAttribute('href', url)
        link.setAttribute('download', filename)
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)

        toast.success('CSV report exported successfully!')
    } catch (err) {
        console.error('Error generating CSV:', err)
        toast.error('Failed to export CSV report. See console for details.')
    } finally {
        loading.value = false
    }
}

// Remove the old PDF export function
// const downloadReport = () => { ... } // REMOVE

// --- Lifecycle Hooks ---
onMounted(async () => {
    await fetchApplications()
    // Start auto-refresh timer
    refreshInterval = setInterval(fetchApplications, AUTO_REFRESH_INTERVAL)
})

onBeforeUnmount(() => {
    // Clear the interval when the component is destroyed
    if (refreshInterval) {
        clearInterval(refreshInterval)
    }
})

// Watch for filter changes to reset pagination
watch([searchQuery, dateRange], () => {
    currentPage.value = 1
})
</script>

<style scoped>
/* Basic icon styles (replace with your library if needed) */
.pi {
    display: inline-block;
    font-style: normal;
    line-height: 1;
    vertical-align: middle;
}
.pi-file-csv::before {
    content: '📄';
    margin-right: 0.4em;
}
.pi-search::before {
    content: '🔍';
}
.pi-sort-up::before {
    content: '▲';
    font-size: 0.75em;
}
.pi-sort-down::before {
    content: '▼';
    font-size: 0.75em;
}
.pi-sort-alt::before {
    content: '↕';
    font-size: 0.75em;
}
.pi-spinner::before {
    content: ''; /* Use border for spinner */
    display: inline-block;
    width: 1em;
    height: 1em;
    border: 2px solid currentColor;
    border-right-color: transparent;
    border-radius: 50%;
    animation: pi-spin 1s linear infinite;
}

@keyframes pi-spin {
    to {
        transform: rotate(360deg);
    }
}

/* Improve table layout */
th,
td {
    vertical-align: middle;
}

/* Custom scrollbar (optional) */
::-webkit-scrollbar {
    width: 6px;
    height: 6px;
}
::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
}
::-webkit-scrollbar-thumb {
    background: #bdbdbd;
    border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
    background: #888;
}
</style>
