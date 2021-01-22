<template>
  <div class="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
    <StatsCard title="Pending" :count="stats.pending" :icon="Clock" color="yellow" />
    <StatsCard title="Under Review" :count="stats.underReview" :icon="Eye" color="blue" />
    <StatsCard title="QEC Issued" :count="stats.qecIssued" :icon="CheckCircle" color="green" />
    <StatsCard title="Suspend" :count="stats.suspend" :icon="XCircle" color="red" />
    <StatsCard title="Regretted" :count="stats.regretted" :icon="XCircle" color="gray" />
  </div>
  <!-- Application History Table -->
  <div class="bg-white rounded-lg shadow">
    <div class="p-4 border-b border-gray-200">
      <h2 class="text-lg font-semibold">Application History</h2>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full">
        <thead class="bg-gray-50">
          <tr>
            <th
              v-for="header in headers"
              :key="header.key"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              {{ header.label }}
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="application in applications" :key="application.id">
            <td class="px-6 py-4 whitespace-nowrap">{{ application.id }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ formatDate(application.date) }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ application.type }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="getStatusClass(application.status)">
                {{ application.status }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <router-link
                :to="{ name: 'application-details', params: { id: application.id } }"
                class="text-blue-600 hover:text-blue-900"
              >
                View
              </router-link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <TablePagination
      :current-page="currentPage"
      :total-results="totalResults"
      :per-page="perPage"
      @page-change="handlePageChange"
    />
  </div>
</template>
<script setup>
import { Clock, Eye, CheckCircle, XCircle } from 'lucide-vue-next'
import StatsCard from '../user/StatsCard.vue'
import TablePagination from '../user/TablePagination.vue'

defineProps({
  stats: {
    type: Object,
    required: true,
    default: () => ({
      pending: 25,
      underReview: 18,
      qecIssued: 12,
      suspend: 5,
      regretted: 8,
    }),
  },
})
const emit = defineEmits(['page-change'])

const headers = [
  { key: 'id', label: 'Application ID' },
  { key: 'date', label: 'Date' },
  { key: 'type', label: 'Type' },
  { key: 'status', label: 'Status' },
  { key: 'actions', label: 'Actions' },
]

const formatDate = (date) => {
  return new Date(date).toLocaleDateString()
}

const getStatusClass = (status) => {
  const classes = {
    Approved: 'text-green-800 bg-green-100',
    Pending: 'text-yellow-800 bg-yellow-100',
    Regretted: 'text-red-800 bg-red-100',
    'Under Review': 'text-blue-800 bg-blue-100',
    Suspend: 'text-gray-800 bg-gray-100',
  }
  return `px-2 py-1 text-xs font-medium rounded-full ${classes[status] || ''}`
}

const handlePageChange = (page) => {
  emit('page-change', page)
}
</script>
