<template>
  <div class="p-4 sm:p-6 md:p-8 min-h-screen bg-gray-50">
    <!-- Header Section -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-8 border border-gray-200">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-10 w-10 text-blue-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
          <div>
            <h1 class="text-3xl font-bold text-gray-800">Institute Profiles</h1>
            <p class="text-sm text-gray-500">
              A total of
              <span class="font-semibold text-blue-600">{{ institutes.length }}</span>
              institutes in the system.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filter Controls Section -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div class="relative md:col-span-2">
        <input
          v-model="searchTerm"
          type="text"
          placeholder="Search by name, CID..."
          class="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
      <div class="md:col-span-1">
        <select
          v-model="selectedStatus"
          class="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        >
          <option value="all">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>
    </div>

    <!-- Institutes Table -->
    <div class="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-100">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                Institution Name
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                CID
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                Dzongkhag
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" class="px-6 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <!-- Loading State -->
            <tr v-if="loading">
              <td colspan="5" class="px-6 py-12 text-center">
                <div class="flex justify-center items-center gap-2">
                  <div class="h-2 w-2 bg-blue-500 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                  <div class="h-2 w-2 bg-blue-500 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                  <div class="h-2 w-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span class="text-sm text-gray-500 ml-2">Loading institutes...</span>
                </div>
              </td>
            </tr>
            <!-- Error State -->
            <tr v-else-if="error">
              <td colspan="5" class="px-6 py-12 text-center">
                <div class="text-red-500">
                  <p class="font-semibold">Oops! Something went wrong.</p>
                  <p class="text-sm">{{ error }}</p>
                </div>
              </td>
            </tr>
            <!-- Empty State -->
            <tr v-else-if="filteredInstitutes.length === 0">
              <td colspan="5" class="px-6 py-12 text-center">
                <div class="flex flex-col items-center justify-center text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mb-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <p class="font-semibold">No Institutes Found</p>
                  <p class="text-sm">Try adjusting your search or filter criteria.</p>
                </div>
              </td>
            </tr>
            <!-- Data Rows -->
            <tr v-else v-for="institute in filteredInstitutes" :key="institute.id" class="hover:bg-gray-50 transition-colors duration-150">
              <td class="px-6 py-4 whitespace-nowrap"><div class="text-sm font-medium text-gray-900">{{ institute.name_of_institution }}</div></td>
              <td class="px-6 py-4 whitespace-nowrap"><div class="text-sm text-gray-700">{{ institute.CID }}</div></td>
              <td class="px-6 py-4 whitespace-nowrap"><div class="text-sm text-gray-600">{{ institute.dzongkhag }}</div></td>
              <td class="px-6 py-4 whitespace-nowrap"><span :class="getStatusClasses(institute.do_dpr_review_decision)">{{ getStatusText(institute.do_dpr_review_decision) }}</span></td>
              <td class="px-6 py-4 whitespace-nowrap text-center">
                <button @click="openModal(institute)" class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-sm transition-all duration-200 ease-in-out transform hover:scale-105">View</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pagination & Results Count (Placeholder) -->
    <div class="mt-6 flex items-center justify-between bg-white px-4 py-3 rounded-lg shadow-md border border-gray-200">
      <div class="text-sm text-gray-700">Showing <span class="font-medium">{{ filteredInstitutes.length > 0 ? 1 : 0 }}</span> to <span class="font-medium">{{ filteredInstitutes.length }}</span> of <span class="font-medium">{{ filteredInstitutes.length }}</span> results</div>
      <div class="flex items-center gap-2">
        <button class="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed" :disabled="true">Previous</button>
        <button class="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed" :disabled="true">Next</button>
      </div>
    </div>

    <!-- Modal Component -->
    <InstituteProfileDetailsModal
      :is-open="isModalOpen"
      :institute-details="selectedInstitute"
      @close-modal="closeModal"
      @save-changes="handleSaveChanges"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import InstituteProfileDetailsModal from '../modals/InstituteProfileDetailsModal.vue';
import apiServices from '@/services/services';

const institutes = ref([]);
const isModalOpen = ref(false);
const selectedInstitute = ref(null);
const loading = ref(true);
const error = ref(null);
const searchTerm = ref('');
const selectedStatus = ref('all');

const filteredInstitutes = computed(() => {
  let filtered = [...institutes.value];
  const lowerCaseSearch = searchTerm.value.trim().toLowerCase();
  if (lowerCaseSearch) {
    filtered = filtered.filter(institute =>
      (institute.name_of_institution && institute.name_of_institution.toLowerCase().includes(lowerCaseSearch)) ||
      (institute.CID && institute.CID.toLowerCase().includes(lowerCaseSearch))
    );
  }
  if (selectedStatus.value !== 'all') {
    filtered = filtered.filter(institute => getStatusText(institute.do_dpr_review_decision) === selectedStatus.value);
  }
  return filtered;
});

onMounted(() => {
  fetchInstitutes();
});

async function fetchInstitutes() {
  loading.value = true;
  error.value = null;
  try {
    const response = await apiServices.getMhpcInstitutes();
    if (response && response.data && Array.isArray(response.data.results)) {
      institutes.value = response.data.results;
    } else if (response && Array.isArray(response.data)) {
      institutes.value = response.data;
    } else {
      console.error('Unexpected API response structure:', response);
      error.value = 'The data received from the server was in an unexpected format.';
    }
  } catch (err) {
    console.error('Error fetching institutes:', err);
    error.value = 'Failed to connect to the server. Please check your connection and try again.';
  } finally {
    loading.value = false;
  }
}

async function handleSaveChanges(updatedInstituteData) {
  console.log('Saving changes for institute:', updatedInstituteData.id);

  const payload = {
    // *** THE FIX IS HERE ***
    // Add the required name_of_institution field to the payload.
    name_of_institution: updatedInstituteData.name_of_institution,

    // Basic Info
    CID: updatedInstituteData.CID,
    full_name: updatedInstituteData.full_name,
    gender: updatedInstituteData.gender,
    contact_no: updatedInstituteData.contact_no,
    email_address: updatedInstituteData.email_address,

    // Location Details
    country: updatedInstituteData.country,
    gewog: updatedInstituteData.gewog,
    dzongkhag: updatedInstituteData.dzongkhag,
    village: updatedInstituteData.village,
    address: updatedInstituteData.address,
    chiwog: updatedInstituteData.chiwog,
    website: updatedInstituteData.website,

    // Head of Institution
    head_of_institution_name: updatedInstituteData.head_of_institution_name,
    head_of_institution_gender: updatedInstituteData.head_of_institution_gender,
    head_of_institution_phone_number: updatedInstituteData.head_of_institution_phone_number,
    head_of_institution_email: updatedInstituteData.head_of_institution_email,
  };

  try {
    // If your backend API method for updates is PATCH, you should use it.
    // If it's PUT, the payload must be complete as above.
    // Assuming your service file has updateMhpcInstitute (PUT) and patchMhpcInstitute (PATCH)

    // OPTION 1 (Current Fix): Send the complete payload with PUT
    await apiServices.updateMhpcInstitute(updatedInstituteData.id, payload);

    // OPTION 2 (Better Practice): Change service to use PATCH for partial updates
    // await apiServices.patchMhpcInstitute(updatedInstituteData.id, payload);


    alert('Institute profile updated successfully!');
    closeModal();
    await fetchInstitutes();

  } catch (err) {
    console.error('Error updating institute:', err.response?.data || err.message);
    const errorDetail = JSON.stringify(err.response?.data) || 'Please check the console for details.';
    alert(`Failed to update institute. Server responded with: ${errorDetail}`);
  }
}

const openModal = (institute) => {
  selectedInstitute.value = institute;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  selectedInstitute.value = null;
};

const getStatusText = (decision) => {
  if (decision === 'Approved') return 'Approved';
  if (decision === 'Regretted') return 'Rejected';
  return 'Pending';
};

const getStatusClasses = (decision) => {
  const baseClasses = 'px-3 py-1 inline-block rounded-full text-xs font-semibold leading-tight';
  const status = getStatusText(decision);
  const statusClasses = {
    Pending: 'bg-yellow-100 text-yellow-800',
    Approved: 'bg-green-100 text-green-800',
    Rejected: 'bg-red-100 text-red-800',
  };
  return `${baseClasses} ${statusClasses[status]}`;
};
</script>