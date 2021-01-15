<!-- components/roq/StatsGrid.vue -->
<template>
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatsCard title="Total Applied" :count="stats.totalApplied" :icon="FileText" color="blue" />
        <StatsCard title="Total Approved" :count="stats.totalApproved" :icon="CheckCircle" color="green" />
        <StatsCard title="Total Regretted" :count="stats.totalRegretted" :icon="XCircle" color="red" />
        <StatsCard title="Total Pending" :count="stats.totalPending" :icon="Clock" color="yellow" />
    </div>
</template>

<script setup>
import { FileText, CheckCircle, XCircle, Clock } from 'lucide-vue-next';
import StatsCard from './StatsCards.vue';

defineProps({
    stats: {
        type: Object,
        required: true,
        default: () => ({
            totalApplied: 0,
            totalApproved: 0,
            totalRegretted: 0,
            totalPending: 0
        })
    }
});
</script>