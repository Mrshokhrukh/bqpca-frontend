<template>
    <div class="applications-container">
        <!-- Header -->
        <div class="header">
            <h1 class="text-2xl font-bold">New Applications</h1>
            <div class="flex items-center gap-3">
                <div class="flex items-center">
                    <span class="w-2 h-2 rounded-full bg-blue-600 mr-2"></span>
                    <span>Total: {{ totalApplications }}</span>
                </div>
                <span class="text-gray-400">|</span>
                <div class="flex items-center">
                    <span class="w-2 h-2 rounded-full bg-yellow-500 mr-2"></span>
                    <span>Pending: {{ pendingApplications }}</span>
                </div>
            </div>
        </div>

        <!-- Search and Filter -->
        <div class="filters mt-5 mb-6 flex gap-4">
            <div class="search-box relative flex-1">
                <input type="text" v-model="searchQuery" placeholder="Search by name, CID or registration number..."
                    class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none">
                <span class="absolute left-3 top-2.5 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </span>
            </div>
            <select v-model="statusFilter" class="px-4 py-2 border border-gray-300 rounded-md focus:outline-none">
                <option value="All Statuses">All Statuses</option>
                <option value="Approved">Approved</option>
                <option value="Pending">Pending</option>
                <option value="Rejected">Rejected</option>
            </select>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
            <table class="min-w-full bg-white border border-gray-200 rounded-md">
                <thead class="bg-gray-50">
                    <tr>
                        <th class="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID
                        </th>
                        <th class="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            APPLICANT</th>
                        <th class="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            REGISTRATION NO.</th>
                        <th class="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            STATUS</th>
                        <th class="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DATE
                        </th>
                        <th class="py-3 px-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            ACTIONS</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-gray-200">
                    <tr v-for="(counsellor, index) in filteredCounsellors" :key="counsellor.cid"
                        class="hover:bg-gray-50">
                        <td class="py-4 px-4 text-sm">#{{ index + 1 }}</td>
                        <td class="py-4 px-4">
                            <div class="flex items-center">
                                <div class="h-10 w-10 flex-shrink-0">
                                    <img class="h-10 w-10 rounded-full"
                                        :src="`https://ui-avatars.com/api/?name=${encodeURIComponent(counsellor.full_name)}&background=random`"
                                        alt="">
                                </div>
                                <div class="ml-4">
                                    <div class="text-sm font-medium text-gray-900">{{ counsellor.full_name }}</div>
                                    <div class="text-sm text-gray-500">{{ counsellor.cid }}</div>
                                </div>
                            </div>
                        </td>
                        <td class="py-4 px-4 text-sm">{{ counsellor.application }}</td>
                        <td class="py-4 px-4 text-sm">
                            <span :class="[
                                'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                                counsellor.review_decision === 'Approved' ? 'bg-green-100 text-green-800' :
                                    counsellor.review_decision === 'Rejected' ? 'bg-red-100 text-red-800' :
                                        'bg-yellow-100 text-yellow-800'
                            ]">
                                {{ counsellor.review_decision }}
                            </span>
                        </td>
                        <td class="py-4 px-4 text-sm text-gray-500">{{ formatDate(new Date()) }}</td>
                        <td class="py-4 px-4 text-sm">
                            <button @click="viewDetails(counsellor)"
                                class="bg-blue-600 hover:bg-blue-700 text-white py-1.5 px-4 rounded-md text-sm font-medium">
                                View
                            </button>
                        </td>
                    </tr>
                    <tr v-if="loading">
                        <td colspan="6" class="py-4 px-4 text-center text-gray-500">Loading...</td>
                    </tr>
                    <tr v-else-if="filteredCounsellors.length === 0">
                        <td colspan="6" class="py-4 px-4 text-center text-gray-500">No applications found</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Pagination info -->
        <div class="mt-4 text-sm text-gray-500">
            Showing {{ filteredCounsellors.length > 0 ? 1 : 0 }} to {{ filteredCounsellors.length }} of {{
                filteredCounsellors.length }} results
        </div>

        <!-- Details Modal -->
        <div v-if="showDetailsModal"
            class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div class="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div class="p-6">
                    <div class="flex justify-between items-center mb-4">
                        <h2 class="text-xl font-bold">Application Details</h2>
                        <button @click="showDetailsModal = false" class="text-gray-500 hover:text-gray-700">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div v-if="selectedCounsellor" class="space-y-4">
                        <!-- Personal Information -->
                        <div class="border-b pb-4">
                            <h3 class="font-medium text-gray-900 mb-2">Personal Information</h3>
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <p class="text-sm text-gray-500">Full Name</p>
                                    <p class="text-sm font-medium">{{ selectedCounsellor.full_name }}</p>
                                </div>
                                <div>
                                    <p class="text-sm text-gray-500">CID</p>
                                    <p class="text-sm font-medium">{{ selectedCounsellor.cid }}</p>
                                </div>
                                <div>
                                    <p class="text-sm text-gray-500">Gender</p>
                                    <p class="text-sm font-medium">{{ selectedCounsellor.gender }}</p>
                                </div>
                                <div>
                                    <p class="text-sm text-gray-500">Registration No.</p>
                                    <p class="text-sm font-medium">{{ selectedCounsellor.application }}</p>
                                </div>
                            </div>
                        </div>

                        <!-- Contact Information -->
                        <div class="border-b pb-4">
                            <h3 class="font-medium text-gray-900 mb-2">Contact Information</h3>
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <p class="text-sm text-gray-500">Contact Number</p>
                                    <p class="text-sm font-medium">{{ selectedCounsellor.contact_no }}</p>
                                </div>
                                <div>
                                    <p class="text-sm text-gray-500">Email Address</p>
                                    <p class="text-sm font-medium">{{ selectedCounsellor.email_address }}</p>
                                </div>
                            </div>
                        </div>

                        <!-- Counselling Information -->
                        <div class="border-b pb-4">
                            <h3 class="font-medium text-gray-900 mb-2">Counselling Information</h3>
                            <div>
                                <p class="text-sm text-gray-500">Title</p>
                                <p class="text-sm font-medium mb-2">{{ selectedCounsellor.counselling_title }}</p>
                            </div>
                            <div>
                                <p class="text-sm text-gray-500">Details</p>
                                <p class="text-sm font-medium mb-2">{{ selectedCounsellor.counselling_details }}</p>
                            </div>
                            <div>
                                <p class="text-sm text-gray-500">Report</p>
                                <p class="text-sm font-medium">{{ selectedCounsellor.counselling_report }}</p>
                            </div>
                        </div>

                        <!-- Additional Information -->
                        <div class="border-b pb-4">
                            <h3 class="font-medium text-gray-900 mb-2">Additional Information</h3>
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <p class="text-sm text-gray-500">Declaration</p>
                                    <p class="text-sm font-medium">
                                        <span :class="[
                                            'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                                            selectedCounsellor.declaration ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        ]">
                                            {{ selectedCounsellor.declaration ? 'Accepted' : 'Not Accepted' }}
                                        </span>
                                    </p>
                                </div>
                                <div>
                                    <p class="text-sm text-gray-500">Review Status</p>
                                    <p class="text-sm font-medium">
                                        <span :class="[
                                            'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                                            selectedCounsellor.review_decision === 'Approved' ? 'bg-green-100 text-green-800' :
                                                selectedCounsellor.review_decision === 'Rejected' ? 'bg-red-100 text-red-800' :
                                                    'bg-yellow-100 text-yellow-800'
                                        ]">
                                            {{ selectedCounsellor.review_decision }}
                                        </span>
                                    </p>
                                </div>
                            </div>
                            <div v-if="selectedCounsellor.review_remarks" class="mt-2">
                                <p class="text-sm text-gray-500">Review Remarks</p>
                                <p class="text-sm font-medium">{{ selectedCounsellor.review_remarks }}</p>
                            </div>
                        </div>

                        <!-- Remarks -->
                        <div class="border-b pb-4">
                            <h3 class="font-medium text-gray-900 mb-2">Remarks</h3>
                            <p class="text-sm">{{ selectedCounsellor.remarks || 'No remarks' }}</p>
                        </div>

                        <!-- Decision -->
                        <div v-if="showConfirmation" class="mt-4">
                            <div class="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-4">
                                <div class="flex">
                                    <div class="flex-shrink-0">
                                        <svg class="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20" fill="currentColor">
                                            <path fill-rule="evenodd"
                                                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                                clip-rule="evenodd" />
                                        </svg>
                                    </div>
                                    <div class="ml-3">
                                        <h3 class="text-sm font-medium text-yellow-800">Confirmation</h3>
                                        <div class="mt-2 text-sm text-yellow-700">
                                            <p>Are you sure you want to {{ confirmAction === 'approve' ? 'approve' :
                                                'reject' }} this application?</p>
                                        </div>
                                        <div class="mt-4 flex space-x-3">
                                            <button @click="confirmUpdateStatus"
                                                class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none">
                                                Confirm
                                            </button>
                                            <button @click="cancelConfirmation"
                                                class="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none">
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Add Review Remarks -->
                        <div v-else-if="confirmAction" class="mt-4">
                            <div class="border-t pt-4">
                                <h3 class="font-medium text-gray-900 mb-2">Add Review Remarks</h3>
                                <textarea v-model="reviewRemarks" rows="3"
                                    placeholder="Enter remarks for this decision (optional)"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                            </div>
                            <div class="flex justify-end space-x-3 mt-4">
                                <button @click="cancelConfirmation"
                                    class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none">
                                    Cancel
                                </button>
                                <button @click="showConfirmation = true"
                                    class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none">
                                    Proceed
                                </button>
                            </div>
                        </div>

                        <!-- Action Buttons -->
                        <div v-else class="flex justify-end space-x-3 mt-4">
                            <button v-if="selectedCounsellor.review_decision !== 'Rejected'"
                                @click="promptConfirmation('reject')"
                                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none">
                                Reject
                            </button>
                            <button v-if="selectedCounsellor.review_decision !== 'Approved'"
                                @click="promptConfirmation('approve')"
                                class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none">
                                Approve
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import apiService from '@/services/services';

// State
const counsellors = ref([])
const loading = ref(true)
const searchQuery = ref('')
const statusFilter = ref('All Statuses')
const showDetailsModal = ref(false)
const selectedCounsellor = ref(null)
const showConfirmation = ref(false)
const confirmAction = ref('')
const reviewRemarks = ref('')

// Computed properties
const totalApplications = computed(() => counsellors.value.length)
const pendingApplications = computed(() => counsellors.value.filter(c => c.review_decision !== 'Approved' && c.review_decision !== 'Rejected').length)

const filteredCounsellors = computed(() => {
    let result = [...counsellors.value]

    // Apply status filter
    if (statusFilter.value !== 'All Statuses') {
        result = result.filter(c => c.review_decision === statusFilter.value)
    }

    // Apply search filter
    if (searchQuery.value.trim()) {
        const query = searchQuery.value.toLowerCase()
        result = result.filter(c =>
            c.full_name.toLowerCase().includes(query) ||
            c.cid.toLowerCase().includes(query) ||
            c.application.toLowerCase().includes(query)
        )
    }

    return result
})

// Methods
const fetchCounsellors = async () => {
    loading.value = true
    try {
        const response = await apiService.getBmhcCounsellors()
        counsellors.value = response.data.results
    } catch (error) {
        console.error('Error fetching counsellors:', error)
    } finally {
        loading.value = false
    }
}

const viewDetails = (counsellor) => {
    selectedCounsellor.value = counsellor
    showDetailsModal.value = true
    showConfirmation.value = false
    confirmAction.value = ''
    reviewRemarks.value = ''
}

const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    }).format(date)
}

const promptConfirmation = (action) => {
    confirmAction.value = action
    reviewRemarks.value = ''
}

const cancelConfirmation = () => {
    showConfirmation.value = false
    confirmAction.value = ''
    reviewRemarks.value = ''
}

const confirmUpdateStatus = async () => {
    if (!selectedCounsellor.value || !confirmAction.value) return

    const status = confirmAction.value === 'approve' ? 'Approved' : 'Rejected'

    try {
        await apiService.patchBmhcCounsellor(selectedCounsellor.value.cid, {
            review_decision: status,
            review_remarks: reviewRemarks.value || null
        })

        // Update local state
        const index = counsellors.value.findIndex(c => c.cid === selectedCounsellor.value.cid)
        if (index !== -1) {
            counsellors.value[index].review_decision = status
            counsellors.value[index].review_remarks = reviewRemarks.value || null
            selectedCounsellor.value.review_decision = status
            selectedCounsellor.value.review_remarks = reviewRemarks.value || null
        }

        showConfirmation.value = false
        confirmAction.value = ''
        reviewRemarks.value = ''
    } catch (error) {
        console.error(`Error updating status to ${status}:`, error)
    }
}

// Fetch data on component mount
onMounted(() => {
    fetchCounsellors()
})
</script>