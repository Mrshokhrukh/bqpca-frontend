<template>
    <div class="max-w-6xl mx-auto px-4 py-8">
        <!-- Form Header -->
        <div class="bg-gradient-to-r from-green-50 to-teal-50 rounded-xl p-8 mb-10">
            <h2 class="text-3xl font-bold text-gray-900 mb-3 text-center">
                Track CPD Activity Submission
            </h2>
            <p class="text-gray-600 text-center max-w-2xl mx-auto">
                Enter your CID number and application details to track the status of your CPD activity submission.
            </p>
        </div>

        <!-- Search Form -->
        <div class="bg-white border rounded-xl shadow-sm p-6 mb-8">
            <div class="border-b border-gray-200 bg-gray-50 p-6 rounded-t-xl">
                <h3 class="text-lg font-semibold text-gray-900">Search Application</h3>
                <p class="mt-1 text-sm text-gray-500">Enter your CID and application details.</p>
            </div>

            <div class="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- CID Number Input -->
                <div class="col-span-1">
                    <label for="cidNumber" class="block text-sm font-medium text-gray-700">CID Number</label>
                    <div class="relative">
                        <input type="text" id="cidNumber" v-model="searchForm.cidNumber"
                            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500 p-2.5"
                            placeholder="Enter CID number" />
                    </div>
                </div>

                <!-- Application ID Input (Optional, can be removed if not needed) -->
                <div class="col-span-1">
                    <label for="applicationId" class="block text-sm font-medium text-gray-700">Application ID
                        (Optional)</label>
                    <input type="text" id="applicationId" v-model="searchForm.applicationId"
                        class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500 p-2.5"
                        placeholder="Enter Application ID" />
                </div>
            </div>

            <div class="mt-4 flex justify-end p-8">
                <button @click="trackApplication"
                    class="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    :disabled="isLoading">
                    <span v-if="isLoading">Loading...</span>
                    <span v-else>Track Application</span>
                </button>
            </div>
        </div>

        <!-- Results Section (Conditionally Rendered) -->
        <div v-if="applicationStatus" class="bg-white border rounded-xl shadow-sm p-6">
            <div class="border-b border-gray-200 bg-gray-50 p-6 rounded-t-xl">
                <h3 class="text-lg font-semibold text-gray-900">Application Status</h3>
                <p class="mt-1 text-sm text-gray-500">Details of your CPD activity submission.</p>
            </div>

            <div class="p-8">
                <p class="text-gray-700">
                    <strong>Application ID:</strong> {{ applicationStatus.applicationId }}
                </p>
                <p class="text-gray-700">
                    <strong>Activity Title:</strong> {{ applicationStatus.activityTitle }}
                </p>
                <p class="text-gray-700">
                    <strong>Submission Date:</strong> {{ applicationStatus.submissionDate }}
                </p>
                <p class="text-gray-700">
                    <strong>Current Status:</strong> <span :class="getStatusClass(applicationStatus.status)">{{
                        applicationStatus.status
                        }}</span>
                </p>
                <p class="text-gray-700" v-if="applicationStatus.comments">
                    <strong>Comments:</strong> {{ applicationStatus.comments }}
                </p>
            </div>
        </div>

        <div v-else-if="searchAttempted && !applicationStatus" class="bg-white border rounded-xl shadow-sm p-6">
            <div class="p-8">
                <p class="text-gray-700">No application found with the provided details.</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive, ref } from 'vue';

const searchForm = reactive({
    cidNumber: '',
    applicationId: '', // Optional
});

const applicationStatus = ref(null); // Stores the fetched application status
const isLoading = ref(false); // For loading state
const searchAttempted = ref(false); // Flag to show "no results" message after a search.

// Simulated API call (replace with your actual API endpoint)
const fetchApplicationStatus = async (cid = null) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock data based on CID
    if (cid === '11203005288') {
        return {
            applicationId: 'APP-2024-001',
            activityTitle: 'Advanced Project Management',
            submissionDate: '2024-01-15',
            status: 'Approved',
            comments: 'Approved with minor revisions.'
        };
    } else if (cid === '11201005412') {
        return {
            applicationId: 'APP-2024-002',
            activityTitle: 'Ethics in Engineering',
            submissionDate: '2024-02-20',
            status: 'Pending Review',
            comments: null
        };
    } else {
        return null; // No application found
    }
};

const trackApplication = async () => {
    isLoading.value = true;
    searchAttempted.value = true;
    applicationStatus.value = null; // Reset previous results

    try {
        const data = await fetchApplicationStatus(searchForm.cidNumber, searchForm.applicationId);
        applicationStatus.value = data;
    } catch (error) {
        console.error('Error tracking application:', error);
        // Handle error (e.g., show a toast message)
    } finally {
        isLoading.value = false;
    }
};

const getStatusClass = (status) => {
    switch (status) {
        case 'Approved':
            return 'text-green-600 font-semibold';
        case 'Pending Review':
            return 'text-yellow-600 font-semibold';
        case 'Rejected':
            return 'text-red-600 font-semibold';
        default:
            return 'text-gray-700 font-semibold';
    }
};
</script>