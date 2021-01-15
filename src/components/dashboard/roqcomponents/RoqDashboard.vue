<template>
    <div class="space-y-6">
        <StatsCards :stats="stats" />
        <ApplicationHistoryTable :applications="applications" />
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import StatsCards from './StatsCards.vue';
import ApplicationHistoryTable from './ApplicationHistoryTable.vue';

const authStore = useAuthStore();

// Stats data
const stats = ref({
    totalApplied: 0,
    totalApproved: 0,
    totalRegretted: 0,
    totalPending: 0
});

// Applications data
const applications = ref([]);

// Fetch dashboard data
const fetchDashboardData = async () => {
    try {
        // Replace with actual API calls
        stats.value = {
            totalApplied: 125,
            totalApproved: 80,
            totalRegretted: 15,
            totalPending: 30
        };

        // Mock applications data
        applications.value = [
            {
                id: 'APP001',
                date: '2024-01-10',
                type: 'New Application',
                status: 'Approved'
            },
            {
                id: 'APP002',
                date: '2024-01-15',
                type: 'Renewal',
                status: 'Pending'
            },
            // Add more mock data as needed
        ];
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
    }
};

onMounted(() => {
    fetchDashboardData();
});
</script>