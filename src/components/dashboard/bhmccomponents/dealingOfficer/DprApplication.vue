<template>
    <div class="p-4 w-full">
        <!-- Header Section -->
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 class="text-3xl font-serif font-bold text-slate-900">
                Application List
            </h2>
        </div>

        <div class="bg-white rounded-lg shadow overflow-hidden">

            <!-- Table -->
            <div class="border-t border-gray-200">
                <!-- Search Input -->
                <div class="px-6 py-4">
                    <label for="search" class="sr-only">Search</label>
                    <div class="relative">
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg class="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20"
                                aria-hidden="true">
                                <path fill-rule="evenodd"
                                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                    clip-rule="evenodd" />
                            </svg>
                        </div>
                        <input type="text" id="search" v-model="searchQuery" placeholder="Search by App ID or Name"
                            class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                    </div>
                </div>
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th scope="col"
                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Application ID
                            </th>
                            <th scope="col"
                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Applicant Name
                            </th>
                            <th scope="col"
                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Date Submitted
                            </th>
                            <th scope="col"
                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th scope="col" class="px-6 py-3 text-right">
                                <span class="sr-only">Actions</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-for="application in filteredApplications" :key="application.id"
                            class="hover:bg-gray-50 transition-colors duration-150">
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span class="text-sm font-medium text-gray-900">#{{ application.id }}</span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span class="text-sm text-gray-700">{{ application.applicantName }}</span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span class="text-sm text-gray-600">{{ formatDate(application.dateSubmitted) }}</span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span class="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium capitalize"
                                    :class="{
                                        'bg-yellow-100 text-yellow-800': application.status === 'Pending',
                                        'bg-green-100 text-green-800': application.status === 'Approved',
                                        'bg-red-100 text-red-800': application.status === 'Rejected'
                                    }">
                                    {{ application.status }}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-right">
                                <div class="flex justify-end space-x-2">
                                    <button @click="openApplication(application)"
                                        class="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150">
                                        View
                                    </button>
                                    <button @click="openConfirmation('approve', application)"
                                        class="inline-flex items-center px-3 py-1.5 border border-transparent rounded-lg text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                                        :disabled="application.status === 'Approved' || application.status === 'Rejected'">
                                        Approve
                                    </button>
                                    <button @click="openConfirmation('reject', application)"
                                        class="inline-flex items-center px-3 py-1.5 border border-transparent rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                                        :disabled="application.status === 'Approved' || application.status === 'Rejected'">
                                        Reject
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <ApplicationModal :isOpen="isModalOpen" :application="selectedApplication" @close="closeApplication"
            @save="saveApplication" />

        <ConfirmationModal :isOpen="isConfirmationOpen" :actionType="confirmationAction"
            :application="confirmationApplication" @close="closeConfirmation" @confirm="processAction" />
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import ApplicationModal from './DprModal.vue';
import ConfirmationModal from './DprConfirmationModal.vue';

const applications = ref([
    { id: 1, applicantName: 'John Doe', dateSubmitted: '2023-10-26', status: 'Pending', details: 'Some long description' },
    { id: 2, applicantName: 'Jane Smith', dateSubmitted: '2023-10-25', status: 'Approved', details: 'Another long description' },
    { id: 3, applicantName: 'Peter Jones', dateSubmitted: '2023-10-24', status: 'Rejected', details: 'Yet another long description' },
    { id: 4, applicantName: 'Ali Khan', dateSubmitted: '2023-10-23', status: 'Pending', details: 'Another long description' },
]);

const isModalOpen = ref(false);
const selectedApplication = ref(null);
const isConfirmationOpen = ref(false);
const confirmationAction = ref('');
const confirmationApplication = ref(null);
const searchQuery = ref('');

const openApplication = (application) => {
    selectedApplication.value = { ...application };
    isModalOpen.value = true;
};

const closeApplication = () => {
    isModalOpen.value = false;
    selectedApplication.value = null;
};

const saveApplication = (applicationId, updatedApplication) => {
    console.log("Saving application", applicationId, "with updates:", updatedApplication);
    const application = applications.value.find(app => app.id === applicationId);
    if (application) {
        Object.assign(application, updatedApplication);
        closeApplication();
    }
};

const openConfirmation = (action, application) => {
    confirmationAction.value = action;
    confirmationApplication.value = application;
    isConfirmationOpen.value = true;
};

const closeConfirmation = () => {
    isConfirmationOpen.value = false;
    confirmationAction.value = '';
    confirmationApplication.value = null;
};

const processAction = (applicationId, message, actionType) => {
    console.log(`Performing ${actionType} on application ${applicationId} with message: ${message}`);
    const applicationIndex = applications.value.findIndex(app => app.id === applicationId);

    if (applicationIndex !== -1) {
        applications.value[applicationIndex] = {
            ...applications.value[applicationIndex],
            status: actionType === 'approve' ? 'Approved' : 'Rejected'
        };
        closeConfirmation();
    } else {
        console.error(`Application with ID ${applicationId} not found.`);
    }
};

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
};

const filteredApplications = computed(() => {
    const query = searchQuery.value.toLowerCase();
    return applications.value.filter(application => {
        return String(application.id).includes(query) || application.applicantName.toLowerCase().includes(query);
    });
});
</script>