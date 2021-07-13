<template>
  <div class="bg-gray-50 min-h-screen">
    <!-- Header & Actions -->
    <div class="top-0 z-10">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <HeaderSection
          @search="handleSearch"
          @status-filter="handleStatusFilter"
          @add-capa="openAddCapaModal"
        />
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <LoadingState v-if="isLoading" />
      <ErrorState v-else-if="error" :message="error" @retry="fetchAllData" />
      <EmptyState v-else-if="!displayedCapas.length && !isLoading && !error" />

      <!-- This component now receives the fully processed CAPA objects -->
      <InstituteTable
        v-else
        :institutes="displayedCapas"
        @view-details="openViewDetailsModal"
      />

      <div class="mt-6" v-if="!isLoading && !error && filteredCapas.length > 0">
        <Pagination
          :current-page="currentPage"
          :total-pages="totalPages"
          @page-change="handlePageChange"
        />
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
import HeaderSection from './capaComponents/HeaderSection.vue';
import LoadingState from './capaComponents/LoadingState.vue';
import ErrorState from './capaComponents/ErrorState.vue';
import EmptyState from './capaComponents/EmptyState.vue';
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
    institutes.value = instRes.data.results || [];
    teachingCenters.value = tcRes.data.results || [];
    // Sort by most recently updated
    allCapas.value = (capaRes.data.results || []).sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
  } catch (err) {
    error.value = 'Failed to load data. Please try again.';
    console.error('Data fetch error:', err);
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchAllData);

// Filtering logic
const filteredCapas = computed(() => {
  let capas = allCapas.value; // Start with the raw, sorted CAPAs

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
  selectedCapaForDetails.value = capa; // Pass the whole CAPA object
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
    await fetchAllData(); // Refetch to get the latest data
    closeAddCapaModal();
    toast.success('CAPA saved successfully!');
  } catch (err) {
    console.error('Error saving CAPA:', err.response?.data || err.message);
    // You might want to show a more specific error message to the user
    toast.error('Failed to save CAPA. Please check the console for details.');
  } finally {
    isLoading.value = false;
  }
};

</script>