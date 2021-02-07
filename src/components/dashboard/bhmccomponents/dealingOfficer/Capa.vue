<template>
  <div class="p-4 md:p-6">
    <!-- Header -->
    <div class="mb-4 md:mb-6 flex flex-col md:flex-row justify-between items-center">
      <h1 class="text-xl md:text-2xl font-bold text-gray-900 mb-2 md:mb-0">BMHC Capa</h1>
      <div class="flex flex-col md:flex-row md:space-x-4 w-full md:w-auto">
        <div class="relative mb-2 md:mb-0 w-full md:w-auto">
          <input v-model.trim="searchQuery" type="text" placeholder="Search..."
            class="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full" />
          <span class="absolute left-3 top-2.5 text-gray-400">
            <SearchIcon class="w-5 h-5" />
          </span>
        </div>
        <select v-model="statusFilter"
          class="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-2 md:mb-0 w-full md:w-auto">
          <option value="">All Status</option>
          <option value="R">Rejected</option>
          <option value="A">Approved</option>
          <option value="P">Pending</option>
        </select>
        <button @click="openAddCapaModal"
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full md:w-auto">
          Add CAPA
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center items-center py-8">
      <Loader2Icon class="w-8 h-8 animate-spin text-blue-500" />
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 md:mb-6">
      <div class="flex items-center">
        <AlertCircleIcon class="w-5 h-5 text-red-500 mr-2" />
        <p class="text-red-700">{{ error }}</p>
      </div>
    </div>

    <!-- Data Table -->
    <div v-else class="bg-white rounded-lg shadow overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col"
              class="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ID
            </th>
            <th scope="col"
              class="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Inspection Dates
            </th>
            <th scope="col"
              class="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Observation
            </th>
            <th scope="col"
              class="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Root Cause
            </th>
            <th scope="col"
              class="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              CAPA
            </th>
            <th scope="col"
              class="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Timeline
            </th>
            <th scope="col"
              class="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col"
              class="px-3 py-2 md:px-6 md:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="capa in displayedCapas" :key="capa.id" class="hover:bg-gray-100 transition-colors duration-200">
            <td class="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ capa.id }}
            </td>
            <td class="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap text-sm text-gray-500">
              {{ capa.inspection_from_date }} - {{ capa.inspection_to_date }}
            </td>
            <!-- Use a div with max-width and overflow handling -->
            <td class="px-3 py-2 md:px-6 md:py-4 text-sm text-gray-500">
              <div class="max-w-xs overflow-hidden whitespace-nowrap overflow-ellipsis"
                :title="capa.observation_description">
                {{ capa.observation_description }}
              </div>
            </td>
            <td class="px-3 py-2 md:px-6 md:py-4 text-sm text-gray-500">
              <div class="max-w-xs overflow-hidden whitespace-nowrap overflow-ellipsis" :title="capa.root_cause">
                {{ capa.root_cause }}
              </div>
            </td>
            <td class="px-3 py-2 md:px-6 md:py-4 text-sm text-gray-500">
              <div class="max-w-xs overflow-hidden whitespace-nowrap overflow-ellipsis" :title="capa.capa">
                {{ capa.capa }}
              </div>
            </td>
            <td class="px-3 py-2 md:px-6 md:py-4 text-sm text-gray-500">
              <div class="max-w-xs overflow-hidden whitespace-nowrap overflow-ellipsis"
                :title="capa.implementation_timeline">
                {{ capa.implementation_timeline }}
              </div>
            </td>
            <td class="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap">
              <span :class="getStatusClass(capa.status)"
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                {{ getStatusText(capa.status) }}
              </span>
            </td>
            <td class="px-3 py-2 md:px-6 md:py-4 whitespace-nowrap text-sm font-medium">
              <button @click="editCapa(capa)"
                class="text-blue-600 hover:text-blue-800 hover:underline mr-3">Edit</button>
              <button @click="deleteCapa(capa.id)"
                class="text-red-600 hover:text-red-800 hover:underline">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Empty State -->
      <div v-if="!displayedCapas.length && !isLoading" class="text-center py-8">
        <InboxIcon class="mx-auto h-12 w-12 text-gray-400" />
        <h3 class="mt-2 text-sm font-medium text-gray-900">No CAPAs found</h3>
        <p class="mt-1 text-sm text-gray-500">No CAPAs found matching your criteria.</p>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="flex justify-between items-center mt-4 px-4">
      <div class="text-sm text-gray-700">
        Page {{ currentPage }} of {{ totalPages }}
      </div>
      <div class="flex space-x-2">
        <button @click="currentPage--" :disabled="currentPage === 1"
          class="px-3 py-1 border rounded-md disabled:opacity-50 hover:bg-gray-100">
          Previous
        </button>
        <button @click="currentPage++" :disabled="currentPage === totalPages"
          class="px-3 py-1 border rounded-md disabled:opacity-50 hover:bg-gray-100">
          Next
        </button>
      </div>
    </div>

    <!-- Add/Edit CAPA Modal -->
    <Transition name="modal">
      <div v-if="showCapaModal"
        class="fixed z-50 inset-0 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-start justify-center pt-4 px-4 pb-20 sm:p-0">
        <div class="relative w-full max-w-4xl mx-auto mt-10">
          <div class="relative bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div
              class="bg-gray-50 px-4 py-3 md:px-8 md:py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 class="text-lg md:text-2xl font-bold text-gray-900">{{ isEditMode ? 'Edit CAPA' : 'Add CAPA' }}</h2>
              <button @click="closeCapaModal"
                class="rounded-full p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <XIcon class="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </div>

            <div class="px-4 py-3 md:px-8 md:py-6 overflow-y-auto max-h-[70vh]">
              <form @submit.prevent="saveCapa" class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <!-- Inspection Dates -->
                <div>
                  <label for="inspection_from_date" class="block text-sm font-medium text-gray-700">Inspection From Date
                    <span class="text-red-500">*</span></label>
                  <input type="date" id="inspection_from_date" v-model="capaForm.inspection_from_date"
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required />
                </div>

                <div>
                  <label for="inspection_to_date" class="block text-sm font-medium text-gray-700">Inspection To Date
                    <span class="text-red-500">*</span></label>
                  <input type="date" id="inspection_to_date" v-model="capaForm.inspection_to_date"
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required />
                </div>

                <!-- Observation Description -->
                <div>
                  <label for="observation_description" class="block text-sm font-medium text-gray-700">Observation
                    Description <span class="text-red-500">*</span></label>
                  <textarea id="observation_description" v-model="capaForm.observation_description"
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required></textarea>
                </div>

                <!-- Root Cause -->
                <div>
                  <label for="root_cause" class="block text-sm font-medium text-gray-700">Root Cause <span
                      class="text-red-500">*</span></label>
                  <textarea id="root_cause" v-model="capaForm.root_cause"
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required></textarea>
                </div>
                <!-- CAPA -->
                <div>
                  <label for="capa" class="block text-sm font-medium text-gray-700">CAPA <span
                      class="text-red-500">*</span></label>
                  <textarea id="capa" v-model="capaForm.capa"
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required></textarea>
                </div>

                <!-- Implementation Timeline -->
                <div>
                  <label for="implementation_timeline" class="block text-sm font-medium text-gray-700">Implementation
                    Timeline <span class="text-red-500">*</span></label>
                  <input type="text" id="implementation_timeline" v-model="capaForm.implementation_timeline"
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required />
                </div>
                <!-- Management Comment -->
                <div>
                  <label for="management_comment" class="block text-sm font-medium text-gray-700">Management
                    Comment</label>
                  <textarea id="management_comment" v-model="capaForm.management_comment"
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
                </div>

                <!-- DO Remarks -->
                <div>
                  <label for="DO_remarks" class="block text-sm font-medium text-gray-700">DO Remarks</label>
                  <textarea id="DO_remarks" v-model="capaForm.DO_remarks"
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
                </div>

                <!-- User Remarks -->
                <div>
                  <label for="user_remarks" class="block text-sm font-medium text-gray-700">User Remarks</label>
                  <textarea id="user_remarks" v-model="capaForm.user_remarks"
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
                </div>

                <!-- Status -->
                <div>
                  <label for="status" class="block text-sm font-medium text-gray-700">Status <span
                      class="text-red-500">*</span></label>
                  <select id="status" v-model="capaForm.status"
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required>
                    <option value="R">Rejected</option>
                    <option value="A">Approved</option>
                    <option value="P">Pending</option>
                  </select>
                </div>

                <!-- Teaching Center (assuming this is a select dropdown) -->
                <div>
                  <label for="teaching_center" class="block text-sm font-medium text-gray-700">Teaching Center <span
                      class="text-red-500">*</span></label>
                  <input type="number" id="teaching_center" v-model.number="capaForm.teaching_center"
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required />
                </div>

                <!-- Institute (assuming this is a select dropdown) -->
                <div>
                  <label for="institute" class="block text-sm font-medium text-gray-700">Institute <span
                      class="text-red-500">*</span></label>
                  <input type="number" id="institute" v-model.number="capaForm.institute"
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required />
                </div>
                <div class="md:col-span-2 flex justify-end">
                  <button type="button" @click="closeCapaModal"
                    class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded mr-2">Cancel</button>
                  <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">{{
                    isEditMode ? 'Update'
                    : 'Create' }}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import {
  Loader2Icon,
  SearchIcon,
  AlertCircleIcon,
  InboxIcon,
  XIcon
} from 'lucide-vue-next'
import services from '@/services/services'


const capas = ref([])  // Store the raw API response
const isLoading = ref(false)
const error = ref(null)
const searchQuery = ref('')
const statusFilter = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(10); //  Set items per page
const showCapaModal = ref(false);
const isEditMode = ref(false);

const capaForm = ref({
  inspection_from_date: '',
  inspection_to_date: '',
  observation_description: '',
  root_cause: '',
  capa: '',
  implementation_timeline: '',
  management_comment: '',
  DO_remarks: '',
  user_remarks: '',
  status: 'P', // Default to Pending
  teaching_center: null,
  institute: null,
});

const router = useRouter()
// --- Computed Properties ---
const filteredCapas = computed(() => {
  let filtered = capas.value;

  if (statusFilter.value) {
    filtered = filtered.filter(c => c.status === statusFilter.value);
  }
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(c =>
      c.observation_description.toLowerCase().includes(query) ||
      c.root_cause.toLowerCase().includes(query) ||
      c.capa.toLowerCase().includes(query)
    );
  }
  return filtered;
});

const totalPages = computed(() => Math.ceil(filteredCapas.value.length / itemsPerPage.value));

const displayedCapas = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredCapas.value.slice(start, end);
});

// --- Helper Function for Status Classes and Text ---
const getStatusClass = (status) => {
  const classes = {
    'P': 'bg-yellow-100 text-yellow-800',
    'A': 'bg-green-100 text-green-800',
    'R': 'bg-red-100 text-red-800',
    // Add more status mappings as needed
  };
  return classes[status] || 'bg-gray-100 text-gray-800'; // Default class
};

const getStatusText = (status) => {
  const statusTexts = {
    'P': 'Pending',
    'A': 'Approved',
    'R': 'Rejected',
  };
  return statusTexts[status] || 'Unknown'; // Return human-readable text
};



// --- Data Fetching ---
const fetchData = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    const response = await services.getBmhcCapas();  // Use the new API function
    capas.value = response.data.results;
  } catch (err) {
    error.value = 'Failed to load CAPAs. Please try again later.';
    console.error('Error fetching CAPAs:', err);
  } finally {
    isLoading.value = false;
  }
};

// --- Watchers ---
watch([searchQuery, statusFilter], () => {
  currentPage.value = 1; // Reset to first page on search/filter change
});

// --- Lifecycle Hooks ---
onMounted(fetchData);

// --- Modal Methods ---
const openAddCapaModal = () => {
  isEditMode.value = false;
  resetCapaForm();
  showCapaModal.value = true;
};

const editCapa = (capa) => {
  isEditMode.value = true;
  // Create a deep copy to avoid modifying the original data directly
  capaForm.value = JSON.parse(JSON.stringify(capa));
  showCapaModal.value = true;
};


const closeCapaModal = () => {
  showCapaModal.value = false;
  resetCapaForm();
};
const resetCapaForm = () => {
  capaForm.value = {
    inspection_from_date: '',
    inspection_to_date: '',
    observation_description: '',
    root_cause: '',
    capa: '',
    implementation_timeline: '',
    management_comment: '',
    DO_remarks: '',
    user_remarks: '',
    status: 'P',
    teaching_center: null,
    institute: null,
  };
};


// --- CRUD Operations ---
const saveCapa = async () => {
  try {
    let response;
    if (isEditMode.value) {
      // Update existing CAPA
      response = await services.updateBmhcCapa(capaForm.value.id, capaForm.value);
      // Find and update the specific capa in the capas array
      const index = capas.value.findIndex(c => c.id === capaForm.value.id);
      if (index !== -1) {
        capas.value = [
          ...capas.value.slice(0, index),
          { ...capas.value[index], ...response.data }, // Merge the updated data
          ...capas.value.slice(index + 1)
        ];
      }
    } else {
      // Create new CAPA
      response = await services.createBmhcCapa(capaForm.value);
      capas.value.push(response.data);  // Add the new CAPA to the list
    }
    closeCapaModal();
    // Optionally, show a success message
  } catch (err) {
    console.error('Error saving CAPA:', err);
    error.value = 'Failed to save CAPA. Please try again.';  // Show error to user
  }
};


const deleteCapa = async (id) => {
  if (confirm('Are you sure you want to delete this CAPA?')) {
    try {
      await services.deleteBmhcCapa(id);
      capas.value = capas.value.filter(c => c.id !== id); // Remove from the list
    } catch (err) {
      console.error('Error deleting CAPA:', err);
      error.value = 'Failed to delete CAPA. Please try again.';
    }
  }
};

</script>

<style scoped>
/* Modal Transition Styles */
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