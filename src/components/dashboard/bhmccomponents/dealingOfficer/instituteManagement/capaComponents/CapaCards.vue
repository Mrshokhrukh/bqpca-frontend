<template>
  <div class=" min-h-screen bg-gray-50">

    <!-- CAPA Table -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Institute
              </th>
              <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                CAPA ID
              </th>
              <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Inspection Dates
              </th>
              <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Description
              </th>
              <th scope="col" class="relative px-6 py-4">
                <span class="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <template v-for="institute in institutes" :key="institute.id">
              <tr v-if="!instituteCapas[institute.id] || instituteCapas[institute.id].length === 0">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ institute.name_of_institution }}</td>
                <td colspan="5" class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div class="flex items-center">
                    <InboxIcon class="w-4 h-4 text-gray-400 mr-2" />
                    No CAPAs for this institute
                  </div>
                </td>
                <td class="whitespace-nowrap px-3 py-4 text-right text-sm font-medium">
                  <button @click="$emit('add-capa', institute.id)"
                    class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors duration-200">
                    <PlusIcon class="w-4 h-4 mr-1" />
                    Create First CAPA
                  </button>
                </td>
              </tr>
              <tr v-for="capa in instituteCapas[institute.id]" :key="capa.id"
                class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ institute.name_of_institution }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">CAPA #{{ capa.id }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <span :class="[getStatusClass(capa.status), 'px-2.5 py-0.5 rounded-full text-xs font-medium']">
                    {{ getStatusText(capa.status) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ getDateRangeText(capa.inspection_from_date, capa.inspection_to_date) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500" :title="capa.observation_description">
                  {{ truncateText(capa.observation_description || 'No description available', 50) }}
                </td>
                <td class="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                  <button @click="$emit('open-view-details-modal', capa)"
                    class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors duration-200 mr-2">
                    View
                  </button>
                  <button @click="$emit('delete-capa', capa.id)"
                    class="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors duration-200">
                    <TrashIcon class="w-4 h-4" />
                  </button>
                </td>
              </tr>
              <tr v-if="instituteCapas[institute.id] && instituteCapas[institute.id].length > 0" class="bg-gray-100">
                <td colspan="6" class="px-6 py-2 text-right">
                  <button @click="$emit('add-capa', institute.id)"
                    class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors duration-200">
                    <PlusIcon class="w-4 h-4 mr-1" />
                    Add CAPA
                  </button>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { PlusIcon, TrashIcon, InboxIcon } from 'lucide-vue-next';

defineProps({
  institutes: {
    type: Array,
    required: true,
  },
  instituteCapas: {
    type: Object,
    required: true,
  },
});

defineEmits(['add-capa', 'view-details', 'delete-capa', 'open-view-details-modal']);

// Helper functions (same as before)
const getStatusClass = (status) => {
  const classes = {
    P: 'bg-yellow-100 text-yellow-800',
    R: 'bg-green-100 text-green-800',
    A: 'bg-blue-100 text-blue-800',
  };
  return classes[status] || 'bg-gray-100 text-gray-800';
};

const getStatusText = (status) => {
  const statusTexts = {
    P: 'Pending',
    R: 'Resolved',
    A: 'Approved',
  };
  return statusTexts[status] || 'Unknown';
};

const truncateText = (text, maxLength) => {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

const getDateRangeText = (fromDate, toDate) => {
  if (!fromDate && !toDate) return 'No date range specified';
  if (fromDate && toDate) return `${formatDate(fromDate)} - ${formatDate(toDate)}`;
  if (fromDate) return `From: ${formatDate(fromDate)}`;
  return `To: ${formatDate(toDate)}`;
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};
</script>
