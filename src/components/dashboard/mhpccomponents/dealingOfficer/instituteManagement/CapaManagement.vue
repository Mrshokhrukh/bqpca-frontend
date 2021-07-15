<template>
  <div class="bg-gray-50 min-h-screen">
    <!-- Header & Actions -->
    <div class="top-0 z-10">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <CapaControls
          @search="handleSearch"
          @status-filter="handleStatusFilter"
          @add-capa="openAddCapaModal"
          :search-query="searchQuery"
          :status-filter="statusFilter"
          :has-capas="hasCapas"
        />
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <LoadingState v-if="isLoading" />
      <ErrorState v-else-if="error" :message="error" @retry="fetchAllData" />
      <div v-else>
        <div v-if="hasCapas">
          <!-- This component now receives the fully processed CAPA objects -->
          <InstituteTable
            :capas="displayedCapas"
            @view-details="openViewDetailsModal"
          />

          <div class="mt-6">
            <Pagination
              :current-page="currentPage"
              :total-pages="totalPages"
              @page-change="handlePageChange"
            />
          </div>
        </div>
        <div v-else class="text-center py-16 px-4">
          <h3 class="text-lg font-medium text-gray-900">No CAPA records found for any institute.</h3>
          <p class="mt-2 text-sm text-gray-500 max-w-md mx-auto">
            Click the button below to add the first CAPA record.
          </p>
          <button
            @click="openAddCapaModal"
            class="mt-6 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
            </svg>
            Add New CAPA
          </button>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <AddCapaModal
      :show="showAddCapaModal"
      :institutes="institutes"
      :teaching-centers="teachingCenters"
      @close="closeAddCapaModal"
      @save="handleSaveCapa"
    />

    <!-- FIX: Removed the redundant :institute-name prop. The modal now gets this from the :capa object itself. -->
    <ViewCapaDetailsModal
      :show="showViewDetailsModal"
      :capa="selectedCapaForDetails"
      @close="closeViewDetailsModal"
      @capa-updated="fetchAllData"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import services from '@/services/services';
import CapaControls from './capaComponents/CapaControls.vue';
import LoadingState from './capaComponents/LoadingState.vue';
import ErrorState from './capaComponents/ErrorState.vue';

import Pagination from './capaComponents/Pagination.vue';
import AddCapaModal from './capaComponents/AddCapaModal.vue';
import ViewCapaDetailsModal from './capaComponents/ViewCapaDetailsModal.vue';
import InstituteTable from './capaComponents/InstituteTable.vue';
import { useToast } from 'vue-toastification';

const toast = useToast();

// State
const institutes = ref([]);
const teachingCenters = ref([]);
const allCapas = ref([]);
const isLoading = ref(false);
const error = ref(null);
const searchQuery = ref('');
const statusFilter = ref('');
const currentPage = ref(1);
const itemsPerPage = ref(10);
const showAddCapaModal = ref(false);
const showViewDetailsModal = ref(false);
const selectedCapaForDetails = ref(null);

// API Functions
const fetchAllData = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    const [instRes, tcRes, capaRes] = await Promise.all([
      services.getMhpcInstitutes(),
      services.getMhpcTeachingCenters(),
      services.getMhpcCapas(),
    ]);
    institutes.value = instRes.data.results || instRes.data || [];
    teachingCenters.value = tcRes.data.results || tcRes.data || [];
    allCapas.value = (capaRes.data.results || capaRes.data || []).sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
  } catch (err) {
    error.value = 'Failed to load data. Please try again.';
    console.error('Data fetch error:', err);
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchAllData);

// Data Processing
const processedCapas = computed(() => {
  // The API already provides 'institute' and 'teaching_center' as nested objects.
  // No need for re-mapping. Just ensure they are present.
  return allCapas.value;
});

// Filtering logic
const filteredCapas = computed(() => {
  let capas = processedCapas.value;

  if (statusFilter.value) {
    capas = capas.filter(c => c.status === statusFilter.value);
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    capas = capas.filter(c =>
      (c.institute?.name_of_institution || '').toLowerCase().includes(query) ||
      (c.teaching_center?.center_name || '').toLowerCase().includes(query)
    );
  }
  return capas;
});

const totalPages = computed(() => Math.ceil(filteredCapas.value.length / itemsPerPage.value));

const displayedCapas = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredCapas.value.slice(start, end);
});

const hasCapas = computed(() => allCapas.value.length > 0);

// Event Handlers
const handleSearch = (query) => {
  searchQuery.value = query;
  currentPage.value = 1;
};
const handleStatusFilter = (status) => {
  statusFilter.value = status;
  currentPage.value = 1;
};
const handlePageChange = (newPage) => {
  currentPage.value = newPage;
};

// Modal Handlers
const openAddCapaModal = () => { showAddCapaModal.value = true; };
const closeAddCapaModal = () => { showAddCapaModal.value = false; };
const openViewDetailsModal = (capa) => {
  selectedCapaForDetails.value = capa;
  showViewDetailsModal.value = true;
};
const closeViewDetailsModal = () => {
  showViewDetailsModal.value = false;
  selectedCapaForDetails.value = null;
};

// CRUD Operations
const handleSaveCapa = async (capaPayload) => {
  isLoading.value = true;
  try {
    await services.createMhpcCapa(capaPayload);
    await fetchAllData();
    closeAddCapaModal();
    toast.success('CAPA saved successfully!');
  } catch (err) {
    console.error('Error saving CAPA:', err.response?.data || err.message);
    toast.error('Failed to save CAPA. Please check the console for details.');
  } finally {
    isLoading.value = false;
  }
};

</script>