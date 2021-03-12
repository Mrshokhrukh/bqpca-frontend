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
            <th scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Facility
            </th>
            <th scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teaching Center
            </th>
            <th scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inspection Date
            </th>
            <th scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Observation
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="capaItem in filteredCapas" :key="capaItem.id">
            <td class="px-6 py-4 whitespace-nowrap">{{ capaItem.teaching_center.institute_name }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ capaItem.teaching_center.center_name }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ capaItem.inspection_from_date }} - {{ capaItem.inspection_to_date
            }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ truncateText(capaItem.observation_description, 50) }}</td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span :class="getStatusClass(capaItem.status)"
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ">
                {{ getStatusText(capaItem.status) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <button @click="openModal(capaItem)" class="text-indigo-600 hover:text-indigo-900">View Details</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Card View -->
    <div v-if="viewType === 'cards'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="capaItem in filteredCapas" :key="capaItem.id" class="bg-white shadow-md rounded-md p-4">
        <h3 class="text-lg font-semibold mb-2">{{ capaItem.teaching_center.institute_name }}</h3>
        <p class="text-gray-600 mb-1"><strong>Inspection Date:</strong> {{ capaItem.inspection_from_date }} - {{
          capaItem.inspection_to_date }}</p>
        <p class="text-gray-600 mb-2"><strong>Observation:</strong> {{ truncateText(capaItem.observation_description,
          80) }}</p>
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-medium text-gray-700">Status:</span>
          <span :class="getStatusClass(capaItem.status)"
            class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ">
            {{ getStatusText(capaItem.status) }}
          </span>
        </div>
        <button @click="openModal(capaItem)"
          class="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">
          View Details
        </button>
      </div>
    </div>

    <CapaDetailModal v-if="selectedCapa" :capa="selectedCapa" @close="closeModal" @capa-updated="updateCapa" />
  </div>
</template>


<script setup>
import { ref, onMounted, computed } from 'vue'; // Import computed
import CapaDetailModal from './CapaModal.vue';
import apiservice from '@/services/bmhcservices';
import { useAuthStore } from '@/stores/authStore';

const capas = ref([]);
const viewType = ref('table');
const selectedCapa = ref(null);
const authStore = useAuthStore();

const fetchCapas = async () => {
  try {
    const response = await apiservice.getBmhcCapas();
    capas.value = response.data.results;
    console.log(capas.value);
  } catch (error) {
    console.error('Error fetching CAPA data:', error);
  }
};

// Use onMounted to fetch data after the component is mounted
onMounted(fetchCapas);

// Computed property to filter CAPAs based on user's CID
const filteredCapas = computed(() => {
  if (!authStore.user || !authStore.user.cid) {
    return []; // Return empty array if user or CID is not available
  }
  return capas.value.filter(capaItem => capaItem.teaching_center?.institute?.CID === authStore.user.cid);
});


const openModal = (capaItem) => {
  selectedCapa.value = capaItem;
};

const closeModal = () => {
  selectedCapa.value = null;
};

const updateCapa = (updatedCapa) => {
  const index = capas.value.findIndex((capaItem) => capaItem.id === updatedCapa.id);
  if (index !== -1) {
    capas.value.splice(index, 1, updatedCapa);
  }
  closeModal();
  console.log('Updated CAPA:', updatedCapa);
};

const truncateText = (text, maxLength) => {
  if (text && text.length > maxLength) {
    return text.substring(0, maxLength) + '...';
  }
  return text;
};

const getStatusClass = (status) => {
  status = status || 'Unknown';
  switch (status) {
    case 'P':
      return 'bg-yellow-100 text-yellow-800';
    case 'R':
      return 'bg-green-100 text-green-800';
    case 'C':  // Corrected 'Resolved' color
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusText = (status) => {
  switch (status) {
    case 'P':
      return 'Pending';
    case 'R':
      return 'Resolved';
    case 'C':
      return 'Cancelled'; // Or whatever your "cancelled" status text should be
    default:
      return 'Unknown';
  }
};

</script>
