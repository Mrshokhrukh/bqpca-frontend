<template>
  <div class="overflow-x-auto bg-white rounded-lg shadow-md">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Institute</th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teaching Center</th>
          <th scope="col" class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
          <th scope="col" class="relative px-6 py-3"><span class="sr-only">Actions</span></th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <!-- FIX: The prop is named 'institutes', but we iterate it as 'capa' for clarity -->
        <tr v-for="capa in institutes" :key="capa.id" class="hover:bg-gray-50 transition-colors">
          <td class="px-6 py-4 whitespace-nowrap">
            <!-- FIX: Accessing nested data correctly from the API response object -->
            <div class="text-sm font-medium text-gray-900">{{ capa.institute?.name_of_institution || 'N/A' }}</div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
             <!-- FIX: Accessing nested data correctly. Show '—' if it's an institute-level CAPA with no TC. -->
            <div class="text-sm text-gray-700">{{ capa.teaching_center?.center_name || '—' }}</div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-center">
            <span :class="getStatusClass(capa.status)" class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full">
              {{ capa.status || 'Unknown' }}
            </span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {{ formatDate(capa.updated_at) }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <button @click="$emit('view-details', capa)" class="text-indigo-600 hover:text-indigo-900">
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
  // This prop receives an array of full CAPA objects
  institutes: { type: Array, required: true },
});
defineEmits(['view-details']);

// Using full word status from API
const getStatusClass = (status) => ({
    'Pending': 'bg-yellow-100 text-yellow-800',
    'Resolved': 'bg-green-100 text-green-800',
    'Approved': 'bg-blue-100 text-blue-800',
})[status] || 'bg-gray-100 text-gray-800';

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-GB', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
};
</script>