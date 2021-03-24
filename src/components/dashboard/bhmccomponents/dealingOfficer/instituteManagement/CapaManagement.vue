<template>
  <div class="bg-gray-50 min-h-screen">
    <!-- Header & Search Bar -->
    <div class="top-0 z-10">
      <div class="mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <HeaderSection @search="handleSearch" @status-filter="handleStatusFilter" />
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <!-- Loading State -->
      <LoadingState v-if="isLoading" />

      <!-- Error State -->
      <ErrorState v-else-if="error" :message="error" @retry="retryFetch" />

      <!-- Empty State -->
      <EmptyState v-else-if="!displayedInstitutes.length && !isLoading && !error" />

      <!-- CAPA Cards Grid -->
      <CapaCards v-else :institutes="displayedInstitutes" :institute-capas="instituteCapas" @add-capa="openAddCapaModal"
        @view-details="openViewDetailsModal" @delete-capa="deleteCapa"
        @open-view-details-modal="openViewDetailsModal" />

      <!-- Pagination -->
      <div class="mt-6">
        <Pagination :current-page="currentPage" :total-pages="totalPages" @page-change="handlePageChange" />
      </div>
    </div>

    <!-- Modals -->
    <AddCapaModal :show="showCapaModal" :institute-id="selectedInstituteId" :institute-name="selectedInstituteName"
      @close="closeCapaModal" @save="handleSaveCapa" />

    <ViewCapaDetailsModal :show="showViewDetailsModal" :capa="selectedCapaForDetails"
      :institute-name="getInstituteName(selectedCapaForDetails?.institute)" @close="closeViewDetailsModal"
      @edit="handleEditCapa" />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import services from '@/services/services';
import HeaderSection from './capaComponents/HeaderSection.vue';
import LoadingState from './capaComponents/LoadingState.vue';
import ErrorState from './capaComponents/ErrorState.vue';
import CapaCards from './capaComponents/CapaCards.vue';
import EmptyState from './capaComponents/EmptyState.vue';
import Pagination from './capaComponents/Pagination.vue';
import AddCapaModal from './capaComponents/AddCapaModal.vue';
import ViewCapaDetailsModal from './capaComponents/ViewCapaDetailsModal.vue';

// State
const institutes = ref([]);
const capas = ref([]);
const instituteCapas = ref({});
const isLoading = ref(false);
const error = ref(null);
const searchQuery = ref('');
const statusFilter = ref('');
const currentPage = ref(1);
const itemsPerPage = ref(9); // Changed to 9 for better grid display with 3 columns
const showCapaModal = ref(false);
const selectedInstituteId = ref(null);
const selectedInstituteName = ref('');
const showViewDetailsModal = ref(false);
const selectedCapaForDetails = ref(null);

// Computed Properties
const filteredInstitutes = computed(() => {
  let filtered = institutes.value;

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(institute =>
      institute.name_of_institution.toLowerCase().includes(query)
    );
  }
  return filtered;
});

const totalPages = computed(() =>
  Math.ceil(filteredInstitutes.value.length / itemsPerPage.value)
);

const displayedInstitutes = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredInstitutes.value.slice(start, end);
});

// Helper Functions
const getInstituteName = (instituteId) => {
  if (!instituteId) return ''; // Handle null/undefined case
  const institute = institutes.value.find(inst => inst.id === instituteId);
  return institute ? institute.name_of_institution : 'Unknown Institute';
};

// API Functions
const fetchInstitutes = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    const response = await services.getMhpcInstitutes();
    institutes.value = response.data.results;
  } catch (err) {
    error.value = 'Failed to load institutes. Please try again later.';
    console.error('Error fetching institutes:', err);
  } finally {
    isLoading.value = false;
  }
};

const fetchCapas = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    const response = await services.getMhpcCapas();
    capas.value = response.data.results;
    processCapas();
  } catch (err) {
    error.value = 'Failed to load CAPAs. Please try again later.';
    console.error('Error fetching CAPAs:', err);
  } finally {
    isLoading.value = false;
  }
};

const processCapas = () => {
  instituteCapas.value = {};

  const filteredCapas = statusFilter.value
    ? capas.value.filter(capa => capa.status === statusFilter.value) // Fixed from previous code
    : capas.value;

  filteredCapas.forEach(capa => {
    if (!instituteCapas.value[capa.institute]) {
      instituteCapas.value[capa.institute] = [];
    }
    instituteCapas.value[capa.institute].push(capa);
  });
};

// Fetch retry function
const retryFetch = () => {
  fetchInstitutes();
  fetchCapas();
};

// Modal Functions
const openAddCapaModal = (instituteId) => {
  selectedInstituteId.value = instituteId;
  selectedInstituteName.value = getInstituteName(instituteId);
  showCapaModal.value = true;
};

const closeCapaModal = () => {
  showCapaModal.value = false;
  selectedInstituteId.value = null;
  selectedInstituteName.value = '';
};

// View Details Modal Functions
const openViewDetailsModal = (capa) => {
  selectedCapaForDetails.value = capa;
  showViewDetailsModal.value = true;
};

const closeViewDetailsModal = () => {
  selectedCapaForDetails.value = null;
  showViewDetailsModal.value = false;
};

// CRUD Operations
const handleSaveCapa = async (capaData) => {
  try {
    await services.createMhpcCapa({
      ...capaData,
      institute: selectedInstituteId.value,
    });
    await fetchCapas();
    closeCapaModal();
  } catch (err) {
    console.error('Error saving CAPA:', err.response ? err.response.data : err.message);
    error.value = 'Failed to save CAPA. Please try again.';
  }
};

const handleEditCapa = async (capaData) => {
  try {
    await services.updateMhpcCapa(capaData.id, capaData);
    await fetchCapas();
    closeViewDetailsModal();
  } catch (err) {
    console.error('Error updating CAPA:', err);
    error.value = 'Failed to update CAPA. Please try again.';
  }
};

const deleteCapa = async (id) => {
  if (confirm('Are you sure you want to delete this CAPA?')) {
    try {
      await services.deleteMhpcCapa(id);
      await fetchCapas();
    } catch (err) {
      console.error('Error deleting CAPA:', err);
      error.value = 'Failed to delete CAPA. Please try again.';
    }
  }
};

// Event Handlers
const handleSearch = (query) => {
  searchQuery.value = query;
};

const handleStatusFilter = (status) => {
  statusFilter.value = status;
};

const handlePageChange = (newPage) => {
  currentPage.value = newPage;
};

// Watchers
watch([searchQuery, statusFilter], () => {
  currentPage.value = 1;
  processCapas();
});

// Lifecycle Hooks
onMounted(() => {
  fetchInstitutes();
  fetchCapas();
});
</script>

<style scoped>
/* Modal Transition Styles (kept, but you can remove if not using transitions) */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  transition: transform 0.3s ease;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: translateY(-20px);
}
</style>
