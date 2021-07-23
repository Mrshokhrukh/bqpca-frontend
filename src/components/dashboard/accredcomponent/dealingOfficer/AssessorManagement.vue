<template>
  <div class="mx-auto px-4 sm:px-8">
    <div class="py-8">
      <!-- Header, Filter, and other UI elements (unchanged) -->
      <div class="flex justify-between items-center mb-4">
        <div>
          <h2 class="text-2xl font-bold text-gray-800">Assessors Management</h2>
          <p class="text-gray-500 mt-1">Manage HEQC Assessors from the pool.</p>
        </div>
        <div class="flex justify-end">
          <button
            @click="openAddModal"
            class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-colors"
          >
            Add Assessor
          </button>
        </div>
      </div>

      <div class="mb-4">
        <input
          type="text"
          v-model="filterText"
          placeholder="Filter assessors by name, CID, email, or specialisation..."
          class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
        />
      </div>

      <!-- Assessor Table -->
      <div class="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
        <div class="inline-block min-w-full shadow rounded-lg overflow-hidden">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-100">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Name</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">CID</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Email</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Specialisation</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">CV</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-if="isLoading">
                <td colspan="7" class="text-center py-4">Loading assessors...</td>
              </tr>
              <tr v-else-if="filteredAssessors.length === 0">
                 <td colspan="7" class="text-center py-4">
                  {{ assessors.length === 0 ? 'No assessors have been added yet.' : 'No assessors match your filter.' }}
                </td>
              </tr>
              <tr
                v-else
                v-for="assessor in filteredAssessors"
                :key="assessor.id"
                class="hover:bg-gray-50 transition-colors"
              >
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{{ assessor.name }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{{ assessor.cid }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{{ assessor.email }}</td>
                <td class="px-6 py-4 text-sm text-gray-800 max-w-xs truncate" :title="assessor.relevant_experience_specialization">{{ assessor.relevant_experience_specialization }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="[assessor.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800', 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full']">
                    {{ assessor.is_active ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                   <a v-if="assessor.cv_document_url" :href="assessor.cv_document_url" target="_blank" class="text-indigo-600 hover:text-indigo-900">
                    Download
                  </a>
                  <span v-else class="text-gray-400">N/A</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button @click="editAssessor(assessor)" class="text-indigo-600 hover:text-indigo-900 mr-2">Edit</button>
                  <button @click="viewAssessor(assessor)" class="text-blue-600 hover:text-blue-900 mr-2">View</button>
                  <button
                    @click="triggerDeleteConfirmation(assessor)"
                    class="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Add/Edit Assessor Modal (unchanged) -->
    <div v-if="isModalOpen" class="fixed z-20 inset-0 overflow-y-auto">
      <!-- ... modal content from your original file ... -->
    </div>

    <!-- View Assessor Modal (unchanged) -->
    <div v-if="isViewModalOpen" class="fixed z-20 inset-0 overflow-y-auto">
       <!-- ... modal content from your original file ... -->
    </div>

    <!-- *** NEW INLINE CONFIRMATION MODAL *** -->
    <div v-if="isConfirmModalVisible" class="fixed z-50 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <!-- Background overlay -->
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="cancelDelete"></div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">​</span>
        <!-- Modal panel -->
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg class="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                </svg>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">Delete Assessor</h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    Are you sure you want to permanently delete '{{ assessorToDelete?.name }}'? This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button @click="handleDeleteConfirmation" type="button" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm">
              Confirm Delete
            </button>
            <button @click="cancelDelete" type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import apiService from '@/services/services';

// --- State Management ---
const assessors = ref([]);
const isLoading = ref(true);
const isModalOpen = ref(false);
const isViewModalOpen = ref(false);
const isEditing = ref(false);
const filterText = ref('');

// --- New state for the deletion flow ---
const isConfirmModalVisible = ref(false);
const assessorToDelete = ref(null);

// --- Initialize Toast instance ---
const toast = useToast();

const initialAssessorState = {
  id: null, name: '', cid: '', contact_number: '', email: '',
  qualification: '', relevant_experience_specialization: '',
  cv_document: null, is_active: true,
};
const currentAssessor = ref({ ...initialAssessorState });
const viewedAssessor = ref({});
const selectedFile = ref(null);

// --- API Calls ---
onMounted(() => {
  loadAssessors();
});

async function loadAssessors() {
  isLoading.value = true;
  try {
    const response = await apiService.getMastersAssessorPools();
    assessors.value = response.data.results || response.data || [];
  } catch (error) {
    console.error('Failed to load assessors:', error);
    toast.error('Could not fetch assessor data. Please try again later.');
  } finally {
    isLoading.value = false;
  }
}

// --- CRUD Operations with Toasts ---
async function saveAssessor() {
  const formData = new FormData();
  Object.keys(currentAssessor.value).forEach(key => {
    if (key !== 'cv_document' && key !== 'id' && key !== 'cv_document_url') {
      const value = currentAssessor.value[key];
      formData.append(key, value !== null ? value : '');
    }
  });

  if (selectedFile.value) {
    formData.append('cv_document', selectedFile.value);
  }

  try {
    if (isEditing.value) {
      await apiService.updateMastersAssessor(currentAssessor.value.id, formData);
      toast.success(`Assessor "${currentAssessor.value.name}" updated successfully.`);
    } else {
      await apiService.createMastersAssessor(formData);
      toast.success(`Assessor "${currentAssessor.value.name}" added successfully.`);
    }
    closeModal();
    await loadAssessors();
  } catch (error) {
    console.error('Failed to save assessor:', error.response?.data || error);
    const errorDetail = error.response?.data?.detail || 'Please check the form for errors.';
    toast.error(`Failed to save assessor: ${errorDetail}`);
  }
}

// --- NEW DELETION FLOW ---
// Step 1: User clicks the delete button in the table row.
function triggerDeleteConfirmation(assessor) {
  assessorToDelete.value = assessor;
  isConfirmModalVisible.value = true;
}

// Step 2: User clicks "Confirm Delete" in the modal.
async function handleDeleteConfirmation() {
  if (!assessorToDelete.value) return;

  try {
    // Attempt the API call
    await apiService.deleteMastersAssessor(assessorToDelete.value.id);

    // Show success toast
    toast.success(`Assessor "${assessorToDelete.value.name}" has been deleted.`);

    // Refresh the data
    await loadAssessors();

  } catch (error) {
    // Show error toast with specific message from backend if available
    if (error.response && error.response.status === 409) {
      toast.error(error.response.data.detail, { timeout: 8000 }); // Longer timeout for important errors
    } else {
      console.error("An unexpected error occurred during deletion:", error);
      toast.error("Could not delete the assessor due to an unexpected server error.");
    }
  } finally {
    // Always clean up by closing the modal and resetting the state
    cancelDelete();
  }
}

// Step 3: User clicks "Cancel" or the modal overlay.
function cancelDelete() {
  isConfirmModalVisible.value = false;
  assessorToDelete.value = null;
}

// --- Modal Controls (unchanged) ---
function openAddModal() {
  isEditing.value = false;
  currentAssessor.value = { ...initialAssessorState };
  selectedFile.value = null;
  isModalOpen.value = true;
}

function editAssessor(assessor) {
  isEditing.value = true;
  currentAssessor.value = JSON.parse(JSON.stringify(assessor));
  selectedFile.value = null;
  isModalOpen.value = true;
}

function viewAssessor(assessor) {
  viewedAssessor.value = { ...assessor };
  isViewModalOpen.value = true;
}

function closeModal() {
  isModalOpen.value = false;
}

function closeViewModal() {
  isViewModalOpen.value = false;
}

// --- Event Handlers & Computed (unchanged) ---
function handleFileChange(event) {
  const file = event.target.files[0];
  if (file) {
    selectedFile.value = file;
  }
}

const filteredAssessors = computed(() => {
  const validAssessors = assessors.value.filter(assessor => assessor);
  if (!filterText.value) {
    return validAssessors;
  }
  const filter = filterText.value.toLowerCase().trim();
  return validAssessors.filter((assessor) =>
    (assessor.name?.toLowerCase() || '').includes(filter) ||
    (assessor.cid?.toLowerCase() || '').includes(filter) ||
    (assessor.email?.toLowerCase() || '').includes(filter) ||
    (assessor.relevant_experience_specialization?.toLowerCase() || '').includes(filter)
  );
});
</script>