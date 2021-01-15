<template>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Total Applied Card -->
        <div class="bg-white p-6 rounded-lg shadow">
            <div class="flex items-center">
                <div class="p-3 rounded-full bg-blue-100">
                    <FileText class="h-6 w-6 text-blue-600" />
                </div>
                <div class="ml-4">
                    <p class="text-sm text-gray-600">Total Applied</p>
                    <p class="text-2xl font-semibold text-gray-800">{{ stats.totalApplied }}</p>
                </div>
            </div>
        </div>

        <!-- Total Approved Card -->
        <div class="bg-white p-6 rounded-lg shadow">
            <div class="flex items-center">
                <div class="p-3 rounded-full bg-green-100">
                    <CheckCircle class="h-6 w-6 text-green-600" />
                </div>
                <div class="ml-4">
                    <p class="text-sm text-gray-600">Total Approved</p>
                    <p class="text-2xl font-semibold text-gray-800">{{ stats.totalApproved }}</p>
                </div>
            </div>
        </div>

        <!-- Total Regretted Card -->
        <div class="bg-white p-6 rounded-lg shadow">
            <div class="flex items-center">
                <div class="p-3 rounded-full bg-red-100">
                    <XCircle class="h-6 w-6 text-red-600" />
                </div>
                <div class="ml-4">
                    <p class="text-sm text-gray-600">Total Regretted</p>
                    <p class="text-2xl font-semibold text-gray-800">{{ stats.totalRegretted }}</p>
                </div>
            </div>
        </div>

        <!-- Total Pending Card -->
        <div class="bg-white p-6 rounded-lg shadow">
            <div class="flex items-center">
                <div class="p-3 rounded-full bg-yellow-100">
                    <Clock class="h-6 w-6 text-yellow-600" />
                </div>
                <div class="ml-4">
                    <p class="text-sm text-gray-600">Total Pending</p>
                    <p class="text-2xl font-semibold text-gray-800">{{ stats.totalPending }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { FileText, CheckCircle, XCircle, Clock } from 'lucide-vue-next';

defineProps({
    stats: {
        type: Object,
        required: true,
    },
});
</script>