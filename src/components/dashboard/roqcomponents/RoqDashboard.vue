<template>
    <div class="p-4">
        <StatsGrid :stats="filteredStats" />
        <ApplicationTable :applications="paginatedApplications" :current-page="currentPage"
            :total-results="filteredTotal" :per-page="perPage" @page-change="handlePageChange" />
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import StatsGrid from './StatsGrid.vue';
import ApplicationTable from './ApplicationsTable.vue';

const { role, user } = useAuthStore();

const stats = ref({
    totalApplied: 0,
    totalApproved: 0,
    totalRegretted: 0,
    totalPending: 0
});

const applications = ref([]);
const currentPage = ref(1);
const perPage = ref(10);

// Filter applications based on role
const filteredApplications = computed(() => {
    switch (role) {
        case 'user':
            return applications.value.filter(app => app.user_id === user.id);

        case 'dealing_officer':
            return applications.value.filter(app => app.dealing_officer_id === user.id);

        case 'chief':
            return applications.value.filter(app => app.department_id === user.department_id);

        case 'director':
            return applications.value;

        default:
            return [];
    }
});

// Calculate stats based on filtered applications
const filteredStats = computed(() => {
    const filtered = filteredApplications.value;
    return {
        totalApplied: filtered.length,
        totalApproved: filtered.filter(app => app.status === 'Approved').length,
        totalRegretted: filtered.filter(app => app.status === 'Regretted').length,
        totalPending: filtered.filter(app => app.status === 'Pending').length
    };
});

// Compute total for pagination
const filteredTotal = computed(() => filteredApplications.value.length);

// Get paginated data
const paginatedApplications = computed(() => {
    const start = (currentPage.value - 1) * perPage.value;
    const end = start + perPage.value;
    return filteredApplications.value.slice(start, end);
});

const loadData = async () => {
    try {
        const response = await apiService.get('/applications');
        applications.value = response.data.applications;
    } catch (error) {
        console.error('Error loading data:', error);
    }
};

const handlePageChange = (newPage) => {
    currentPage.value = newPage;
};

onMounted(() => {
    loadData();
});
</script>