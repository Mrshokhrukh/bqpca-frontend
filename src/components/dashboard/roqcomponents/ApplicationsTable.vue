<template>
    <div class="bg-white rounded-lg shadow">
        <div class="p-4 border-b border-gray-200">
            <h2 class="text-lg font-semibold">Application History</h2>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="p-4 text-center">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="p-4 text-center text-red-600">
            {{ error }}
            <button @click="fetchData" class="ml-2 text-blue-600 hover:text-blue-800">
                Retry
            </button>
        </div>

        <!-- Data Table -->
        <div v-else class="overflow-x-auto">
            <table class="w-full">
                <thead class="bg-gray-50">
                    <tr>
                        <th v-for="header in headers" :key="header.key"
                            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                            @click="sortBy(header.key)">
                            {{ header.label }}
                            <span v-if="sortColumn === header.key" class="ml-1">
                                {{ sortDirection === 'asc' ? '↑' : '↓' }}
                            </span>
                        </th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="application in sortedApplications" :key="application.id">
                        <td class="px-6 py-4 whitespace-nowrap">{{ application.id }}</td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            {{ formatDate(application.date) }}
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">{{ application.type }}</td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <span :class="getStatusClass(application.status)">
                                {{ application.status }}
                            </span>
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap">
                            <router-link :to="{
                                name: 'application-details',
                                params: { id: application.id },
                            }" class="text-blue-600 hover:text-blue-900">
                                View
                            </router-link>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <TablePagination :current-page="currentPage" :total-results="totalResults" :per-page="perPage"
            @page-change="handlePageChange" />
    </div>
</template>

<script setup>
import TablePagination from './TablePagination.vue';
import { ref, computed, watch, onMounted } from 'vue';
import services from '@/services/services';

// State
const loading = ref(false);
const error = ref(null);
const currentPage = ref(1);
const totalResults = ref(0);
const perPage = ref(5);
const sortColumn = ref('date');
const sortDirection = ref('desc');

// Filter Parameters
const filterParams = ref({
    is_second_copy: '',
    save_as_draft: '',
    declaration: '',
    dealing_officer_regret: '',
    forward: '',
    chief_regret: '',
    chief_approved: '',
    dealing_officer_decision: '',
    gender: '',
    dzongkhag: '',
    village: '',
    gewog: '',
    applicants_name: '',
    cid_no: '',
    email_address: '',
    course_title: '',
    qualification: '',
    type_of_course: '',
    name_of_institute: '',
    name_of_university: '',
    country: '',
    student_id_no: '',
    year_of_completion: ''
});

// Table Headers
const headers = [
    { key: 'id', label: 'Application ID' },
    { key: 'date', label: 'Date' },
    { key: 'type', label: 'Type' },
    { key: 'status', label: 'Status' },
    { key: 'actions', label: 'Actions' }
];

// Data
const applications = ref([]);

// Computed Properties
const queryParams = computed(() => ({
    page: currentPage.value,
    per_page: perPage.value,
    ...Object.fromEntries(
        Object.entries(filterParams.value)
            .filter(([, value]) => value !== '' && value !== null)
    ),
    ordering: `${sortDirection.value === 'desc' ? '-' : ''}${sortColumn.value}`
}));

const sortedApplications = computed(() => {
    return [...applications.value].sort((a, b) => {
        const aValue = a[sortColumn.value];
        const bValue = b[sortColumn.value];
        const modifier = sortDirection.value === 'asc' ? 1 : -1;

        if (aValue < bValue) return -1 * modifier;
        if (aValue > bValue) return 1 * modifier;
        return 0;
    });
});

// Methods
const fetchData = async () => {
    loading.value = true;
    error.value = null;

    try {
        const response = await services.getRecognitions(queryParams.value);
        applications.value = response.data.results;
        totalResults.value = response.data.count;
    } catch (err) {
        error.value = 'Failed to fetch applications. Please try again.';
        console.error('Error fetching data:', err);
    } finally {
        loading.value = false;
    }
};

const sortBy = (column) => {
    if (sortColumn.value === column) {
        sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
    } else {
        sortColumn.value = column;
        sortDirection.value = 'asc';
    }
};

const handlePageChange = (page) => {
    currentPage.value = page;
};

const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
};

const getStatusClass = (status) => {
    const classes = {
        Approved: 'text-green-800 bg-green-100',
        Pending: 'text-yellow-800 bg-yellow-100',
        Regretted: 'text-red-800 bg-red-100'
    };
    return `px-2 py-1 text-xs font-medium rounded-full ${classes[status] || ''}`;
};

// Watchers
watch(queryParams, () => {
    currentPage.value = 1;
    fetchData();
}, { deep: true });

// Lifecycle
onMounted(fetchData);
</script>