<template>
    <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
                <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Application ID
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions
                    </th>
                </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="application in applications" :key="application.id">
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ application.id }}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(application.date) }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ application.type }}</td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <StatusBadge :status="application.status" />
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <ApplicationActions :id="application.id" />
                    </td>
                </tr>
                <tr v-if="applications.length === 0">
                    <td colspan="5" class="px-6 py-4 text-center text-gray-500">No applications found</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<script setup>
import { useRouter } from 'vue-router';
import ApplicationActions from './ApplicationActions.vue';
import StatusBadge from './StatusBadge.vue';
defineProps({
    applications: {
        type: Array,
        required: true
    }
})

// Format date
const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};
</script>