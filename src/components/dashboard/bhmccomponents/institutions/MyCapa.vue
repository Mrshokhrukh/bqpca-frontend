<template>
  <div class="p-4">
    <h2 class="text-2xl font-semibold mb-4">Corrective Action & Preventive Action (CAPA)</h2>

    <div class="mb-4">
      <label for="view-type" class="mr-2">View:</label>
      <select id="view-type" v-model="viewType" class="border rounded px-2 py-1">
        <option value="table">Table</option>
        <option value="cards">Cards</option>
      </select>
    </div>

    <!-- Table View -->
    <div v-if="viewType === 'table'" class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Facility</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inspection Date</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Observation</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="capa in capas" :key="capa.id">
            <td class="px-6 py-4 whitespace-nowrap">{{ capa.facilityName }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ capa.inspectionDateFrom }} - {{ capa.inspectionDateTo }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ truncateText(capa.observationDescription, 50) }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="getStatusClass(capa.status)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ">
                {{ capa.status }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <button @click="openModal(capa)" class="text-indigo-600 hover:text-indigo-900">View Details</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Card View -->
    <div v-if="viewType === 'cards'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="capa in capas" :key="capa.id" class="bg-white shadow-md rounded-md p-4">
        <h3 class="text-lg font-semibold mb-2">{{ capa.facilityName }}</h3>
        <p class="text-gray-600 mb-1"><strong>Inspection Date:</strong> {{ capa.inspectionDateFrom }} - {{ capa.inspectionDateTo }}</p>
        <p class="text-gray-600 mb-2"><strong>Observation:</strong> {{ truncateText(capa.observationDescription, 80) }}</p>
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium text-gray-700">Status:</span>
          <span :class="getStatusClass(capa.status)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ">
            {{ capa.status }}
          </span>
        </div>
        <button @click="openModal(capa)" class="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">
          View Details
        </button>
      </div>
    </div>

    <CapaDetailModal
      v-if="selectedCapa"
      :capa="selectedCapa"
      @close="closeModal"
      @capa-updated="updateCapa"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import CapaDetailModal from './CapaModal.vue';

// Mock CAPA Data (Replace with your actual data fetching logic)
const capas = ref([
  {
    id: 1,
    facilityName: 'Facility A',
    dzongkhag: 'Thimphu',
    city: 'Thimphu City',
    address: 'Norzin Lam',
    inspectionDateFrom: '2024-07-20',
    inspectionDateTo: '2024-07-21',
    observationDescription: 'Storage temperature exceeded limits.',
    rootCause: 'Malfunctioning refrigerator.',
    capaPlan: '', // User will input this
    implementationTimeline: '', // User will input this
    managementComment: 'Initial observation by DO',
    remarks: '', // User can add remarks
    status: 'Pending User Response', // Status will be managed by the system
  },
  {
    id: 2,
    facilityName: 'Facility B',
    dzongkhag: 'Paro',
    city: 'Paro Town',
    address: 'Main Street',
    inspectionDateFrom: '2024-07-15',
    inspectionDateTo: '2024-07-15',
    observationDescription: 'Expired reagents found.',
    rootCause: 'Lack of inventory management.',
    capaPlan: 'Implement FIFO system and regular stock checks.', // Example CAPA
    implementationTimeline: '2024-08-15', // Example Timeline
    managementComment: 'Needs user action',
    remarks: 'Please provide detailed action plan.',
    status: 'Under Review by DO',
  },
  // ... more CAPA objects
]);

const viewType = ref('table'); // Default view is table
const selectedCapa = ref(null);

const openModal = (capa) => {
  selectedCapa.value = capa;
};

const closeModal = () => {
  selectedCapa.value = null;
};

const updateCapa = (updatedCapa) => {
  // In a real application, you would send this updatedCapa to your backend
  // and then refresh the capas list from the backend.
  // For this example, we'll just update the local data.
  const index = capas.value.findIndex((capa) => capa.id === updatedCapa.id);
  if (index !== -1) {
    capas.value.splice(index, 1, updatedCapa);
  }
  closeModal(); // Close modal after update
  console.log('Updated CAPA:', updatedCapa); // For demonstration
};

const truncateText = (text, maxLength) => {
  if (text && text.length > maxLength) {
    return text.substring(0, maxLength) + '...';
  }
  return text;
};

const getStatusClass = (status) => {
  switch (status) {
    case 'Pending User Response':
      return 'bg-yellow-100 text-yellow-800';
    case 'Under Review by DO':
      return 'bg-blue-100 text-blue-800';
    case 'Resolved':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};
</script>
