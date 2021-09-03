<template>
  <div class="overflow-x-auto bg-white rounded-lg shadow-md">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th
            scope="col"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Institute
          </th>
          <th
            scope="col"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Training Center
          </th>
          <th
            scope="col"
            class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Status
          </th>
          <th
            scope="col"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Last Updated
          </th>
          <th scope="col" class="relative px-6 py-3"><span class="sr-only">Actions</span></th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <!-- Assuming the prop is named 'institutes' but contains CAPA objects -->
        <tr v-for="capa in institutes" :key="capa.id" class="hover:bg-gray-50 transition-colors">
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm font-medium text-gray-900">
              {{ capa.institute.name_of_institution }}
            </div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="text-sm text-gray-700">{{ capa.teaching_center.center_name }}</div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-center">
            <span
              :class="getStatusClass(capa.status)"
              class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
            >
              <!-- FIX: Directly display the status from the API. -->
              {{ capa.status || 'Unknown' }}
            </span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {{ formatDate(capa.updated_at) }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <button
              @click="$emit('view-details', capa)"
              class="text-indigo-600 hover:text-indigo-900"
            >
              View / Edit
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
defineProps({
  // Prop name kept for compatibility if needed
  institutes: { type: Array, required: true },
})
defineEmits(['view-details'])

// FIX: Keys are changed to match the full words from the API response
const getStatusClass = (status) =>
  ({
    Pending: 'bg-yellow-100 text-yellow-800',
    Resolved: 'bg-green-100 text-green-800',
    Approved: 'bg-blue-100 text-blue-800',
  }[status] || 'bg-gray-100 text-gray-800')

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
</script>