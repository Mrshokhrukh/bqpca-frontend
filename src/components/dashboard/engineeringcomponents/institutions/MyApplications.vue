<template>
    <div class="p-6 bg-gray-50 rounded-lg shadow-md">
        <h2 class="text-2xl font-semibold text-gray-900 mb-6">Track Applications</h2>

        <div class="mb-4">
            <label for="search" class="block text-sm font-medium text-gray-700 mb-1">Search by Application ID:</label>
            <input type="text" id="search" v-model="searchTerm"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="Enter Application ID" />
        </div>

        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 shadow-sm rounded-lg">
                <thead class="bg-gray-100">
                    <tr>
                        <th scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Application ID
                        </th>
                        <th scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Institute Name
                        </th>
                        <th scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Center/Program Name
                        </th>
                        <th scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Application Type
                        </th>
                        <th scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                        </th>
                        <th scope="col"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Submission Date
                        </th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="application in filteredApplications" :key="application.id">
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="text-sm text-gray-900">{{ application.id }}</div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="text-sm text-gray-900">{{ application.instituteName }}</div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="text-sm text-gray-900">{{ application.centerProgramName }}</div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="text-sm text-gray-900">{{ application.applicationType }}</div>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <span :class="[
                                application.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                    application.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                        application.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                                            'bg-gray-100 text-gray-800',
                                'px-2 inline-flex text-xs leading-5 font-semibold rounded-full'
                            ]">
                                {{ application.status }}
                            </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <div class="text-sm text-gray-900">{{ application.submissionDate }}</div>
                        </td>
                    </tr>
                    <tr v-if="filteredApplications.length === 0">
                        <td colspan="6" class="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                            No applications found.
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const searchTerm = ref('');

const applications = ref([
    {
        id: 'APP-2024-001',
        instituteName: 'Royal Institute of Health Sciences',
        centerProgramName: 'RIHS Teaching Center',
        applicationType: 'New Teaching Center',
        status: 'Pending',
        submissionDate: '2024-07-20',
    },
    {
        id: 'APP-2024-002',
        instituteName: 'Khesar Gyalpo University of Medical Sciences of Bhutan',
        centerProgramName: 'KGUMSB Simulation Center',
        applicationType: 'Renewal',
        status: 'Approved',
        submissionDate: '2024-07-15',
    },
    {
        id: 'APP-2024-003',
        instituteName: 'Royal Institute of Health Sciences',
        centerProgramName: 'Advanced Medical Imaging Program',
        applicationType: 'New Education Program',
        status: 'Rejected',
        submissionDate: '2024-07-10',
    },
    {
        id: 'APP-2024-004',
        instituteName: 'Other Institute',
        centerProgramName: 'General Health Program',
        applicationType: 'New Education Program',
        status: 'Pending',
        submissionDate: '2024-07-05',
    },
    {
        id: 'APP-2024-005',
        instituteName: 'Khesar Gyalpo University of Medical Sciences of Bhutan',
        centerProgramName: 'Psychology Renewal Center',
        applicationType: 'Renewal',
        status: 'Approved',
        submissionDate: '2024-06-28',
    },
    // ... more applications can be added here
]);

const filteredApplications = computed(() => {
    const term = searchTerm.value.toLowerCase();
    return applications.value.filter(application => {
        return application.id.toLowerCase().includes(term);
    });
});
</script>

<style scoped></style>