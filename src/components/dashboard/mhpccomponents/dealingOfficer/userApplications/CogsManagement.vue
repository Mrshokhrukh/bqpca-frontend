<template>
    <div class="min-h-screen">
        <div class="mx-auto w-full py-12 px-4 sm:px-6 lg:px-8">
            <!-- Header Section with Glassmorphism -->
            <div
                class="backdrop-blur-md bg-white/80 rounded-2xl p-8 mb-10 shadow-lg border border-indigo-100 overflow-hidden relative"
            >
                <div
                    class="absolute -top-16 -right-16 w-64 h-64 bg-indigo-200 rounded-full opacity-20"
                ></div>
                <div
                    class="absolute -bottom-8 -left-8 w-32 h-32 bg-blue-200 rounded-full opacity-20"
                ></div>

                <div
                    class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10"
                >
                    <div>
                        <h1
                            class="text-3xl font-bold text-gray-900 bg-gradient-to-r from-indigo-700 to-blue-700 bg-clip-text text-transparent"
                        >
                            Certificate of Good Standing
                        </h1>
                        <p class="text-gray-600 mt-1">
                            Manage and review COGS applications efficiently
                        </p>
                    </div>
                    <div
                        class="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full md:w-auto"
                    >
                        <div class="relative flex-grow">
                            <input
                                v-model.trim="searchQuery"
                                type="text"
                                placeholder="Search by name, CID, or registration number..."
                                class="pl-10 pr-4 py-3 border-0 rounded-xl focus:ring-2 focus:ring-indigo-500 w-full shadow-md text-sm bg-white"
                            />
                            <span class="absolute left-3 top-3 text-gray-400">
                                <SearchIcon class="w-5 h-5" />
                            </span>
                        </div>
                        <select
                            v-model="statusFilter"
                            class="border-0 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 shadow-md text-sm bg-white"
                        >
                            <option value="">All Status</option>
                            <option value="Pending">Pending</option>
                            <option value="Approved">Approved</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                    </div>
                </div>
            </div>

            <!-- Applications List Card -->
            <div class="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-8">
                <!-- Header with status indicators -->
                <div
                    class="p-6 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-blue-50"
                >
                    <div class="flex items-center justify-between">
                        <h2 class="text-xl font-semibold text-gray-800">Applications</h2>

                        <div class="flex space-x-4">
                            <div class="flex items-center">
                                <span class="w-3 h-3 rounded-full bg-yellow-400 mr-2"></span>
                                <!-- CORRECTED: Removed the misplaced JS code -->
                                <span class="text-sm text-gray-600">
                                    Pending ({{ getPendingCount() }})
                                </span>
                            </div>
                            <div class="flex items-center">
                                <span class="w-3 h-3 rounded-full bg-green-400 mr-2"></span>
                                <span class="text-sm text-gray-600"
                                    >Approved ({{ getApprovedCount() }})</span
                                >
                            </div>
                            <div class="flex items-center">
                                <span class="w-3 h-3 rounded-full bg-red-400 mr-2"></span>
                                <span class="text-sm text-gray-600"
                                    >Rejected ({{ getRejectedCount() }})</span
                                >
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Loading State -->
                <div
                    v-if="isLoading"
                    class="flex flex-col justify-center items-center py-24 bg-white"
                >
                    <div class="w-16 h-16 relative">
                        <div
                            class="absolute top-0 left-0 w-full h-full border-4 border-indigo-200 rounded-full"
                        ></div>
                        <div
                            class="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-indigo-600 rounded-full animate-spin"
                        ></div>
                    </div>
                    <p class="text-gray-600 font-medium mt-4">Loading applications...</p>
                </div>

                <!-- Error State -->
                <div v-else-if="error" class="bg-white p-8">
                    <div
                        class="mx-auto max-w-md bg-red-50 border-l-4 border-red-500 rounded-xl p-6 shadow-md"
                    >
                        <div class="flex items-center">
                            <CircleAlert class="w-8 h-8 text-red-500 mr-4 flex-shrink-0" />
                            <div>
                                <h3 class="text-lg font-bold text-red-800">An error occurred</h3>
                                <p class="text-red-700 mt-1">{{ error }}</p>
                                <button
                                    @click="fetchData"
                                    class="mt-4 px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors font-medium"
                                >
                                    Try Again
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Applications Table -->
                <div v-else class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr class="bg-gradient-to-r from-gray-50 to-gray-100">
                                <th
                                    class="group px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                                >
                                    <div class="flex items-center">
                                        Registration No.
                                        <ArrowUpDownIcon
                                            class="ml-1 h-4 w-4 text-gray-400 group-hover:text-gray-600"
                                        />
                                    </div>
                                </th>
                                <th
                                    class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Applicant Details
                                </th>
                                <th
                                    class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Supervisor
                                </th>
                                <th
                                    class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Status
                                </th>
                                <th
                                    class="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-100">
                            <tr
                                v-for="application in displayedApplications"
                                :key="application.id"
                                class="hover:bg-indigo-50/50 transition-colors duration-150 group"
                            >
                                <td class="px-6 py-5 whitespace-nowrap">
                                    <div class="text-sm font-semibold text-gray-900">
                                        {{ application.registration_no }}
                                    </div>
                                    <div class="text-xs text-gray-500">
                                        ID: {{ application.id }}
                                    </div>
                                </td>
                                <td class="px-6 py-5">
                                    <div class="flex items-start">
                                        <div
                                            class="flex-shrink-0 h-12 w-12 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 group-hover:from-indigo-600 group-hover:to-blue-700 transition-colors flex items-center justify-center text-white font-bold shadow-md"
                                        >
                                            {{ getInitials(application.full_name) }}
                                        </div>
                                        <div class="ml-4">
                                            <div class="text-sm font-medium text-gray-900">
                                                {{ application.full_name }}
                                            </div>
                                            <div class="grid grid-cols-2 gap-x-4 gap-y-1 mt-1">
                                                <div
                                                    class="text-xs text-gray-500 flex items-center"
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        class="h-3 w-3 mr-1 text-gray-400"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path
                                                            stroke-linecap="round"
                                                            stroke-linejoin="round"
                                                            stroke-width="2"
                                                            d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0"
                                                        />
                                                    </svg>
                                                    {{ application.cid_no }}
                                                </div>
                                                <div
                                                    class="text-xs text-gray-500 flex items-center"
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        class="h-3 w-3 mr-1 text-gray-400"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path
                                                            stroke-linecap="round"
                                                            stroke-linejoin="round"
                                                            stroke-width="2"
                                                            d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                                                        />
                                                    </svg>
                                                    {{ application.email_address }}
                                                </div>
                                                <div
                                                    class="text-xs text-gray-500 flex items-center"
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        class="h-3 w-3 mr-1 text-gray-400"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path
                                                            stroke-linecap="round"
                                                            stroke-linejoin="round"
                                                            stroke-width="2"
                                                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                                        />
                                                    </svg>
                                                    {{ application.contact_number }}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-6 py-5">
                                    <div
                                        class="text-sm font-medium text-gray-900 flex items-center"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            class="h-4 w-4 mr-1 text-indigo-500"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                            />
                                        </svg>
                                        {{ application.supervisor_name }}
                                    </div>
                                    <div class="text-xs text-gray-500 mt-1 flex items-center">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            class="h-3 w-3 mr-1 text-gray-400"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                            />
                                        </svg>
                                        {{ application.supervisor_designation }}
                                    </div>
                                </td>
                                <td class="px-6 py-5 whitespace-nowrap">
                                    <div class="space-y-2">
                                        <div class="flex items-center">
                                            <span
                                                :class="getStatusClass(application.review_status)"
                                                class="h-7 px-3 py-1 inline-flex items-center justify-center text-xs leading-5 font-semibold rounded-full shadow-sm"
                                            >
                                                <span
                                                    class="w-2 h-2 rounded-full mr-1"
                                                    :class="
                                                        getStatusDotClass(application.review_status)
                                                    "
                                                ></span>
                                                Review: {{ application.review_status }}
                                            </span>
                                        </div>
                                        <div class="flex items-center">
                                            <span
                                                :class="
                                                    getStatusClass(application.endorsement_decision)
                                                "
                                                class="h-7 px-3 py-1 inline-flex items-center justify-center text-xs leading-5 font-semibold rounded-full shadow-sm"
                                            >
                                                <span
                                                    class="w-2 h-2 rounded-full mr-1"
                                                    :class="
                                                        getStatusDotClass(
                                                            application.endorsement_decision
                                                        )
                                                    "
                                                ></span>
                                                Endorsement: {{ application.endorsement_decision }}
                                            </span>
                                        </div>
                                        <div class="flex items-center">
                                            <span
                                                v-if="application.is_payment_complete"
                                                class="h-7 px-3 py-1 inline-flex items-center justify-center text-xs leading-5 font-semibold rounded-full shadow-sm bg-green-100 text-green-800"
                                            >
                                                <span
                                                    class="w-2 h-2 rounded-full bg-green-500 mr-1"
                                                ></span>
                                                Payment Complete
                                            </span>
                                            <span
                                                v-else
                                                class="h-7 px-3 py-1 inline-flex items-center justify-center text-xs leading-5 font-semibold rounded-full shadow-sm bg-yellow-100 text-yellow-800"
                                            >
                                                <span
                                                    class="w-2 h-2 rounded-full bg-yellow-500 mr-1"
                                                ></span>
                                                Payment Pending
                                            </span>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-6 py-5 whitespace-nowrap text-sm font-medium">
                                    <div class="flex flex-col space-y-2">
                                        <button
                                            @click="reviewApplication(application)"
                                            class="inline-flex items-center justify-center bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-all duration-200 transform hover:translate-y-[-1px] hover:shadow-md"
                                        >
                                            <EyeIcon class="h-4 w-4 mr-1" />
                                            View / Edit
                                        </button>
                                        <button
                                            v-if="application.endorsement_decision === 'Approved'"
                                            @click="downloadCertificate(application.id)"
                                            class="inline-flex items-center justify-center bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-all duration-200 transform hover:translate-y-[-1px] hover:shadow-md"
                                        >
                                            <DownloadIcon class="h-4 w-4 mr-1" />
                                            Certificate
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Empty State -->
                <!-- CORRECTED: Refined v-if condition for empty state -->
                <div
                    v-if="!displayedApplications.length && !isLoading && !error"
                    class="text-center py-16 px-4"
                >
                    <div
                        class="mx-auto h-32 w-32 text-indigo-300 bg-indigo-50 rounded-full flex items-center justify-center mb-6 shadow-inner"
                    >
                        <InboxIcon class="h-16 w-16" />
                    </div>
                    <h3 class="mt-2 text-xl font-medium text-gray-900">No applications found</h3>
                    <p class="mt-1 text-gray-500 max-w-md mx-auto">
                        <template v-if="applications.length === 0">
                            There are no applications to display.
                        </template>
                        <template v-else>
                            No COGS applications match your current search criteria. Try adjusting
                            your filters or search terms.
                        </template>
                    </p>
                    <button
                        @click="resetFilters"
                        class="mt-6 px-6 py-3 bg-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-200 transition-all duration-200 font-medium transform hover:scale-105"
                    >
                        Reset Filters
                    </button>
                </div>
            </div>

            <!-- Pagination -->
            <div
                v-if="totalPages > 1"
                class="bg-white rounded-2xl p-4 shadow-lg border border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4"
            >
                <div class="text-sm text-gray-700 flex items-center">
                    <div class="bg-indigo-100 text-indigo-800 font-bold rounded-lg px-3 py-1 mr-3">
                        Page {{ currentPage }} of {{ totalPages }}
                    </div>
                    <span class="text-gray-500">
                        Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to
                        {{ Math.min(currentPage * itemsPerPage, filteredApplications.length) }}
                        of {{ filteredApplications.length }} applications
                    </span>
                </div>
                <div class="flex space-x-2">
                    <button
                        @click="currentPage = 1"
                        :disabled="currentPage === 1"
                        class="bg-white border border-gray-200 text-gray-700 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                        aria-label="First page"
                    >
                        <ChevronsLeftIcon class="w-5 h-5" />
                    </button>
                    <button
                        @click="currentPage--"
                        :disabled="currentPage === 1"
                        class="bg-white border border-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center shadow-sm"
                    >
                        <ChevronLeftIcon class="w-5 h-5 mr-1" />
                        Prev
                    </button>
                    <div class="flex space-x-1">
                        <template v-for="page in paginationRange" :key="page">
                            <button
                                v-if="page !== '...'"
                                @click="currentPage = page"
                                :class="[
                                    currentPage === page
                                        ? 'bg-indigo-600 text-white border-indigo-600'
                                        : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50',
                                ]"
                                class="border py-2 px-4 rounded-lg transition-colors duration-200 font-medium shadow-sm"
                            >
                                {{ page }}
                            </button>
                            <span
                                v-else
                                class="flex items-center justify-center py-2 px-4 text-gray-500"
                                >...</span
                            >
                        </template>
                    </div>
                    <button
                        @click="currentPage++"
                        :disabled="currentPage === totalPages"
                        class="bg-white border border-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center shadow-sm"
                    >
                        Next
                        <ChevronRightIcon class="w-5 h-5 ml-1" />
                    </button>
                    <button
                        @click="currentPage = totalPages"
                        :disabled="currentPage === totalPages"
                        class="bg-white border border-gray-200 text-gray-700 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                        aria-label="Last page"
                    >
                        <ChevronsRightIcon class="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>

        <!-- Modals -->
        <CogsReviewModal
            v-if="isModalOpen"
            :isOpen="isModalOpen"
            :application="selectedApplication"
            @close="closeReviewModal"
            @update="handleUpdate"
        />

        <CogsConfirmationModal
            v-if="showConfirmation"
            :message="confirmationMessage"
            @confirm="confirmReviewAction"
            @cancel="cancelReviewAction"
        />

        <!-- Toast Notification -->
        <div
            v-if="showSuccessToast"
            class="fixed bottom-4 right-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-4 rounded-xl shadow-xl flex items-center gap-3 transition-all duration-300 max-w-md transform"
            :class="{
                'opacity-100 translate-y-0': showSuccessToast,
                'opacity-0 translate-y-8': !showSuccessToast,
            }"
        >
            <CheckCircleIcon class="w-6 h-6 flex-shrink-0" />
            <span class="flex-grow">{{ toastMessage }}</span>
            <button
                @click="showSuccessToast = false"
                class="p-1 rounded-full hover:bg-white/20 transition-colors"
                aria-label="Close notification"
            >
                <XIcon class="w-4 h-4" />
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import {
    SearchIcon,
    CircleAlert,
    InboxIcon,
    CheckCircleIcon,
    EyeIcon,
    DownloadIcon,
    ArrowUpDownIcon, // Icon used, but no sorting logic
    ChevronLeftIcon,
    ChevronRightIcon,
    ChevronsLeftIcon,
    ChevronsRightIcon,
    XIcon,
} from 'lucide-vue-next'
// Assuming apiServices and modal components are correctly located
import apiServices from '@/services/services'
import CogsReviewModal from '../modals/CogsReviewModal.vue'
import CogsConfirmationModal from '../modals/CogsConfirmationModal.vue'

// --- State ---
const applications = ref([])
const isLoading = ref(false)
const error = ref(null)
const searchQuery = ref('')
const statusFilter = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(10)
const selectedApplication = ref(null)
const isModalOpen = ref(false)
const showConfirmation = ref(false)
const confirmationMessage = ref('')
const showSuccessToast = ref(false)
const toastMessage = ref('')
const confirmData = ref(null)

// --- Computed Properties ---

// Calculate counts for application stats
const getPendingCount = () =>
    applications.value.filter(
        (app) => app.review_status === 'Pending' || app.endorsement_decision === 'Pending'
    ).length
const getApprovedCount = () =>
    applications.value.filter((app) => app.endorsement_decision === 'Approved').length
const getRejectedCount = () =>
    applications.value.filter(
        (app) => app.review_status === 'Rejected' || app.endorsement_decision === 'Rejected'
    ).length

// Get initials for avatar placeholder
const getInitials = (name) => {
    if (!name) return '??'
    // Split by space and hyphen, then take first char of first two parts
    const parts = name.split(/[\s-]+/).filter(Boolean)
    if (parts.length === 0) return '??'
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
    return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase()
}

// Filter applications based on search query and status filter
const filteredApplications = computed(() => {
    let filtered = applications.value
    if (statusFilter.value) {
        // Apply status filter: check *either* review_status or endorsement_decision
        filtered = filtered.filter(
            (app) =>
                app.review_status === statusFilter.value ||
                app.endorsement_decision === statusFilter.value
        )
    }
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(
            (app) =>
                (app.full_name && app.full_name.toLowerCase().includes(query)) ||
                (app.cid_no && String(app.cid_no).toLowerCase().includes(query)) || // Ensure CID is string
                (app.registration_no && String(app.registration_no).toLowerCase().includes(query)) // Ensure registration_no is string
        )
    }
    return filtered
})

// Calculate total pages for pagination
const totalPages = computed(() =>
    Math.max(1, Math.ceil(filteredApplications.value.length / itemsPerPage.value))
)

// Get applications for the current page
const displayedApplications = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value
    const end = start + itemsPerPage.value
    return filteredApplications.value.slice(start, end)
})

// Generate pagination range with ellipsis for many pages
const paginationRange = computed(() => {
    const total = totalPages.value
    const current = currentPage.value
    const delta = 2 // How many pages to show around the current page

    const range = []
    let l = 1
    let r = total
    let i

    // Add initial pages and potentially ellipsis
    for (i = l; i <= Math.min(current - delta, total); i++) {
        if (i < l + 1) range.push(i)
        else if (i === l + 1 && i < current - delta) range.push('...')
    }

    // Add pages around the current page
    for (i = Math.max(1, current - delta); i <= Math.min(current + delta, total); i++) {
        range.push(i)
    }

    // Add final pages and potentially ellipsis
    for (i = Math.max(current + delta, 1); i <= r; i++) {
        if (i > total - 1) range.push(i)
        else if (i === total - 1 && i > current + delta) range.push('...')
    }

    // Ensure the range starts with 1 and ends with total, adding ellipsis if needed
    const finalRange = []
    if (total > 0) {
        finalRange.push(1)
        if (current > delta + 2 && total > 2 * delta + 1) {
            finalRange.push('...')
        }

        const start = Math.max(2, current - delta)
        const end = Math.min(total - 1, current + delta)

        for (let i = start; i <= end; i++) {
            if (i !== 1 && i !== total) {
                finalRange.push(i)
            }
        }

        if (current < total - delta - 1 && total > 2 * delta + 1) {
            finalRange.push('...')
        }
        if (total > 1) {
            finalRange.push(total)
        }
    }

    // Remove duplicates and ensure correct order
    // A simpler, more robust pagination range generator logic:
    const pages = []
    let lastPage = 0
    // Always include first page
    if (total > 0) pages.push(1)

    // Pages around current
    for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
        pages.push(i)
    }

    // Always include last page if more than 1
    if (total > 1) pages.push(total)

    // Add ellipsis
    let result = []
    for (let i = 0; i < pages.length; i++) {
        if (pages[i] - lastPage > 1) {
            result.push('...')
        }
        result.push(pages[i])
        lastPage = pages[i]
    }

    return result
})

// --- Methods ---

// Fetch COGS applications from the API
const fetchData = async () => {
    isLoading.value = true
    error.value = null
    try {
        // Assuming apiServices.getMhpcCogs returns { data: { results: [...] } } or { data: [...] }
        const response = await apiServices.getMhpcCogs()
        applications.value = response.data?.results || response.data || []
    } catch (err) {
        error.value = 'Failed to load applications. Please try again later.'
        console.error('Error fetching applications:', err)
        applications.value = [] // Clear previous data on error
    } finally {
        isLoading.value = false
    }
}

// Get CSS classes for status badges
const getStatusClass = (status) => {
    const classes = {
        Pending: 'bg-yellow-100 text-yellow-800',
        Approved: 'bg-green-100 text-green-800',
        Rejected: 'bg-red-100 text-red-800',
        Processing: 'bg-blue-100 text-blue-800',
        // Add any other statuses you might have
        Submitted: 'bg-gray-100 text-gray-800', // Example: initial state
    }
    // Fallback to a default class if status is not recognized or null/undefined
    return classes[status] || 'bg-gray-100 text-gray-800'
}

// Get CSS classes for status indicator dots
const getStatusDotClass = (status) => {
    const classes = {
        Pending: 'bg-yellow-500',
        Approved: 'bg-green-500',
        Rejected: 'bg-red-500',
        Processing: 'bg-blue-500',
        // Add any other statuses you might have
        Submitted: 'bg-gray-500', // Example: initial state
    }
    // Fallback to a default class
    return classes[status] || 'bg-gray-500'
}

// Reset search and filter controls
const resetFilters = () => {
    searchQuery.value = ''
    statusFilter.value = ''
    // Page will be reset by the watch effect
}

// Open the review modal
const reviewApplication = (application) => {
    selectedApplication.value = application
    isModalOpen.value = true
}

// Close the review modal
const closeReviewModal = () => {
    selectedApplication.value = null
    isModalOpen.value = false
}

// Handle the update event from the Review Modal
const handleUpdate = (data) => {
    confirmData.value = data

    const action = data.review_status || data.endorsement_decision || 'update' // Determine action for message
    const type = data.review_status
        ? 'Review'
        : data.endorsement_decision
        ? 'Endorsement'
        : 'Application' // Determine type for message

    confirmationMessage.value = `Are you sure you want to change the ${type} status to ${action}?`
    showConfirmation.value = true
}

// Confirm the update action
const confirmReviewAction = async () => {
    showConfirmation.value = false // Close confirmation modal

    if (!confirmData.value || !selectedApplication.value) {
        // Should not happen if logic is correct, but safety check
        console.error('Confirm action called without data or selected application')
        return
    }

    isLoading.value = true // Show loading state for the update
    error.value = null // Clear previous errors

    try {
        // Assuming patchMhpcCogs expects the application ID and the data object
        const response = await apiServices.patchMhpcCogs(
            selectedApplication.value.id,
            confirmData.value
        )

        if (response.status === 200) {
            // Update the local application list reactively
            const index = applications.value.findIndex(
                (app) => app.id === selectedApplication.value.id
            )
            if (index !== -1) {
                // Merge existing data with response data to ensure all fields are updated
                const updatedApp = { ...applications.value[index], ...response.data }
                // Create a new array to trigger reactivity update for the list
                applications.value = [
                    ...applications.value.slice(0, index),
                    updatedApp,
                    ...applications.value.slice(index + 1),
                ]
            }

            // Show success feedback
            const action =
                confirmData.value.review_status ||
                confirmData.value.endorsement_decision ||
                'updated' // Get actual action word
            const type = confirmData.value.review_status
                ? 'Review'
                : confirmData.value.endorsement_decision
                ? 'Endorsement'
                : 'Application' // Get type word
            toastMessage.value = `${type} status changed to ${action} successfully.`
            showSuccessToast.value = true
            setTimeout(() => {
                showSuccessToast.value = false
            }, 3000) // Auto-hide toast

            closeReviewModal() // Close the review modal after successful update
        } else {
            // Handle unexpected success statuses if needed (e.g., 201 Created etc. depending on API)
            // For PATCH, 200 or 204 are typical. 200 with data is handled above.
            error.value = `Update failed: Server responded with status ${response.status}.`
            console.error('Update API returned non-200 status:', response.status, response.data)
        }
    } catch (err) {
        // Handle API errors (network issues, 400, 500 responses)
        console.error('Error updating application:', err.response?.data || err.message || err)
        // Provide a user-friendly error message
        error.value = `Failed to update application: ${
            err.response?.data?.detail ||
            err.response?.data?.message ||
            err.message ||
            'Please try again.'
        }`
        // Maybe keep the modal open with an error? Or just show the error banner.
    } finally {
        isLoading.value = false // Hide loading state
        confirmData.value = null // Clear staged data regardless of success/failure
    }
}

// --- Methods (from misplaced code) ---

// Cancel the update action
const cancelReviewAction = () => {
    showConfirmation.value = false
    confirmData.value = null // Clear staged data
}

// Download certificate function
const downloadCertificate = async (id) => {
    isLoading.value = true // Optionally show loading while downloading
    error.value = null // Clear previous errors
    try {
        const response = await apiServices.downloadCogsCertificate(id)

        // Check for successful response and that data is a Blob (typical for files)
        if (response.status === 200 && response.data instanceof Blob) {
            const url = window.URL.createObjectURL(
                new Blob([response.data], {
                    type: response.headers['content-type'] || 'application/pdf',
                })
            )
            const link = document.createElement('a')
            link.href = url

            // Attempt to get filename from Content-Disposition header
            const contentDisposition = response.headers['content-disposition']
            let filename = `COGS_Certificate_${id}.pdf` // Default filename
            if (contentDisposition) {
                const filenameMatch = contentDisposition.match(
                    /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
                )
                if (filenameMatch && filenameMatch[1]) {
                    // Remove quotes from filename if present
                    filename = filenameMatch[1].replace(/['"]/g, '')
                }
            }

            link.setAttribute('download', filename)
            document.body.appendChild(link) // Required for Firefox
            link.click()
            document.body.removeChild(link) // Clean up
            window.URL.revokeObjectURL(url) // Release the object URL

            // Show success feedback
            toastMessage.value = 'Certificate downloaded successfully'
            showSuccessToast.value = true
            setTimeout(() => {
                showSuccessToast.value = false
            }, 3000) // Auto-hide toast
        } else if (response.status === 204) {
            // Handle cases where the API might return 204 No Content if the cert isn't ready/found
            error.value = 'Certificate not available yet or not found.'
            console.warn('Download API returned 204 No Content', response)
        } else {
            // Handle other non-200/204 responses
            const errorData = await response.data.text() // Try to read response as text for error message
            throw new Error(
                `Download failed: Server responded with status ${response.status}. ${
                    errorData || ''
                }`
            )
        }
    } catch (err) {
        console.error('Error downloading certificate:', err.response?.data || err.message || err)
        error.value = `Failed to download certificate: ${
            err.response?.data?.detail ||
            err.response?.data?.message ||
            err.message ||
            'Please try again.'
        }`
    } finally {
        isLoading.value = false // Hide loading
    }
}

// --- Watchers ---

// Reset pagination when filters change
watch([searchQuery, statusFilter], () => {
    if (currentPage.value !== 1) {
        currentPage.value = 1
    }
})

// --- Lifecycle Hooks ---

// Fetch initial data when component mounts
onMounted(fetchData)
</script>
