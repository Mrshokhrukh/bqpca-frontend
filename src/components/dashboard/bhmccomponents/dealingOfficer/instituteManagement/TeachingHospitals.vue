<template>
  <div class="p-8 min-h-screen bg-gray-50">
    <div class="bg-white rounded-xl p-8 mb-10 shadow-sm border border-gray-100">
      <h1 class="text-4xl font-bold text-gray-900 mb-3">Teaching Hospitals</h1>
      <div class="flex items-center text-gray-600">
        <span class="flex items-center">
          <span class="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
          Total: {{ teachingCenters.length }}
        </span>
        <!-- You can add more status indicators here if needed -->
      </div>
    </div>

    <!-- Search and Filter (if needed for hospitals, you can add these back) -->
    <!-- ... (search/filter HTML - no changes) ... -->

    <!-- Example Dropdown for Institutes (Training Institute Name) - Add this where you want the dropdown -->
    <!--
    <div class="mb-4">
      <label for="institute-dropdown" class="block text-sm font-medium text-gray-700">Training Institute</label>
      <select id="institute-dropdown" v-model="selectedInstitute"
        class="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
        <option value="">Select Institute</option>
        <option v-for="institute in institutesDropdownOptions" :key="institute.id" :value="institute.id">
          {{ institute.name_of_institution }}
        </option>
      </select>
    </div>
    -->

    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Name
              </th>
              <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                City
              </th>
              <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Specialty
              </th>
              <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Capacity
              </th>
              <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="center in teachingCenters" :key="center.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ center.name }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ center.city }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {{ center.specialty }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ center.capacity }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-3">
                  <button @click="openModal(center)"
                    class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors duration-200">
                    View
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pagination (if needed) -->
    <!-- ... (pagination HTML - no changes) ... -->

    <TeachingHospitalsDetailsModal :is-open="isModalOpen" :hospital-details="selectedHospital" @close-modal="closeModal"
      @approve="handleApprove" @regret="handleRegret" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import TeachingHospitalsDetailsModal from '../modals/TeachingHospitalsDetailsModal.vue'; // Adjust path if needed
import apiServices from '@/services/services'; // Make sure this import path is correct

// Static data for teaching centers (replace with your actual data or API call later) - REMOVED STATIC DATA
const teachingCenters = ref([]);
const isModalOpen = ref(false);
const selectedHospital = ref({});
const institutesDropdownOptions = ref([]); // For institutes dropdown data
// const selectedInstitute = ref(''); // Example for v-model if you use the dropdown

onMounted(async () => {
  try {
    // Fetch Teaching Centers for the table
    const teachingCentersData = await apiServices.getBmhcTeachingCenters();
    teachingCenters.value = teachingCentersData.data; 

   
    const institutesData = await apiServices.getBmhcInstitutes(); 
    institutesDropdownOptions.value = institutesData.data; 
    console.log("Institutes for dropdown:", institutesDropdownOptions.value); 

  } catch (error) {
    console.error("Error fetching data:", error);
    // Handle error appropriately, e.g., display an error message
  }
});


const openModal = (center) => {
  selectedHospital.value = center;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  selectedHospital.value = {}; // Clear selected hospital data when closing
};

const handleApprove = () => {
  // Handle approve logic here (e.g., send API request)
  console.log('Approved:', selectedHospital.value.name_of_institution);
  closeModal(); // Close modal after action
};

const handleRegret = () => {
  // Handle regret logic here (e.g., send API request)
  console.log('Regretted:', selectedHospital.value.name_of_institution);
  closeModal(); // Close modal after action
};
</script>