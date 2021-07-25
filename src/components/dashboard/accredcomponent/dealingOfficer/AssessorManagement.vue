<template>
  <div class="mx-auto px-4 sm:px-8">
    <div class="py-8">
      <!-- Header and Filter (Unchanged) -->
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
              <tr v-else v-for="assessor in filteredAssessors" :key="assessor.id" class="hover:bg-gray-50 transition-colors">
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
                  <!-- VIEW BUTTON REMOVED FROM HERE -->
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

    <!-- Add/Edit Assessor Modal -->
    <div v-if="isModalOpen" class="fixed z-20 inset-0 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen px-4 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="closeModal"></div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen">​</span>
        <div class="inline-block align-bottom bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form @submit.prevent="saveAssessor">
            <div class="bg-indigo-600 px-6 py-4 flex items-center justify-between">
              <h3 class="text-lg leading-6 font-medium text-white">{{ isEditing ? 'Edit Assessor' : 'Add New Assessor' }}</h3>
              <button @click="closeModal" type="button" class="text-white hover:text-gray-200 focus:outline-none"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>
            <div class="px-6 py-4 text-left max-h-[70vh] overflow-y-auto">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label for="name" class="block text-sm font-medium text-gray-700">Name</label><input type="text" v-model="currentAssessor.name" id="name" required class="mt-1 block w-full border-gray-300 rounded-md shadow-sm" /></div>
                <div><label for="cid" class="block text-sm font-medium text-gray-700">CID</label><input type="text" v-model="currentAssessor.cid" id="cid" required class="mt-1 block w-full border-gray-300 rounded-md shadow-sm" /></div>
                <div><label for="contact_number" class="block text-sm font-medium text-gray-700">Contact Number</label><input type="text" v-model="currentAssessor.contact_number" id="contact_number" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm" /></div>
                <div><label for="email" class="block text-sm font-medium text-gray-700">Email</label><input type="email" v-model="currentAssessor.email" id="email" required class="mt-1 block w-full border-gray-300 rounded-md shadow-sm" /></div>
              </div>
              <div class="mt-4"><label for="qualification" class="block text-sm font-medium text-gray-700">Qualification</label><input type="text" v-model="currentAssessor.qualification" id="qualification" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm" /></div>
              <div class="mt-4"><label for="specialisation" class="block text-sm font-medium text-gray-700">Relevant Experience/Specialisation</label><textarea v-model="currentAssessor.relevant_experience_specialization" id="specialisation" rows="3" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm"></textarea></div>
              <div class="mt-4"><label for="cv_document" class="block text-sm font-medium text-gray-700">CV Document (PDF, DOC, DOCX)</label><input type="file" @change="handleFileChange" id="cv_document" accept=".pdf,.doc,.docx" class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"/><p v-if="isEditing && currentAssessor.cv_document_url" class="text-xs text-gray-500 mt-1">Current file: <a :href="currentAssessor.cv_document_url" target="_blank" class="text-indigo-600">{{ currentAssessor.cv_document_url.split('/').pop() }}</a>. Uploading a new file will replace it.</p></div>
              <div class="mt-4 flex items-center"><input type="checkbox" v-model="currentAssessor.is_active" id="is_active" class="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"><label for="is_active" class="ml-2 block text-sm text-gray-900">Is Active</label></div>
            </div>
            <div class="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
              <button :disabled="isSubmitting" type="button" class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 disabled:opacity-50" @click="closeModal">Cancel</button>
              <button :disabled="isSubmitting" type="submit" class="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed flex items-center">
                <span v-if="isSubmitting">Saving...</span>
                <span v-else>{{ isEditing ? 'Save Changes' : 'Save Assessor' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- VIEW ASSESSOR MODAL REMOVED FROM HERE -->

    <!-- Delete Confirmation Modal -->
    <div v-if="isConfirmModalVisible" class="fixed z-50 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="cancelDelete"></div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">​</span>
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg class="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
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
            <button @click="handleDeleteConfirmation" :disabled="isSubmitting" type="button" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm disabled:bg-red-400 disabled:cursor-not-allowed">
              {{ isSubmitting ? 'Deleting...' : 'Confirm Delete' }}
            </button>
            <button @click="cancelDelete" :disabled="isSubmitting" type="button" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm disabled:opacity-50">
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

// --- Initialize Toast ---
const toast = useToast();

// --- State Management ---
const assessors = ref([]);
const isLoading = ref(true);
const isSubmitting = ref(false); // For disabling buttons during API calls
const isModalOpen = ref(false);
// const isViewModalOpen = ref(false); // REMOVED
const isEditing = ref(false);
const filterText = ref('');

// --- State for the new confirmation modal ---
const isConfirmModalVisible = ref(false);
const assessorToDelete = ref(null);

const initialAssessorState = {
  id: null, name: '', cid: '', contact_number: '', email: '',
  qualification: '', relevant_experience_specialization: '',
  cv_document: null, is_active: true,
};
const currentAssessor = ref({ ...initialAssessorState });
// const viewedAssessor = ref({}); // REMOVED
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
    assessors.value = [];
  } finally {
    isLoading.value = false;
  }
}

// --- CRUD Operations (with Toasts and Submitting state) ---
async function saveAssessor() {
  if (isSubmitting.value) return;
  isSubmitting.value = true;

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
  } finally {
    isSubmitting.value = false;
  }
}

// --- Robust Deletion Flow ---
function triggerDeleteConfirmation(assessor) {
  assessorToDelete.value = assessor;
  isConfirmModalVisible.value = true;
}

async function handleDeleteConfirmation() {
  if (!assessorToDelete.value || isSubmitting.value) return;
  isSubmitting.value = true;

  try {
    await apiService.deleteMastersAssessor(assessorToDelete.value.id);
    toast.success(`Assessor "${assessorToDelete.value.name}" has been deleted.`);
    await loadAssessors();
  } catch (error) {
    const errorDetail = error.response?.data?.detail || "Could not delete the assessor.";
    console.error("Error during deletion:", error);
    toast.error(errorDetail, { timeout: 8000 });
  } finally {
    isSubmitting.value = false;
    cancelDelete();
  }
}

function cancelDelete() {
  isConfirmModalVisible.value = false;
  assessorToDelete.value = null;
}

// --- Modal Controls ---
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

// function viewAssessor(assessor) { ... } // REMOVED

function closeModal() {
  if (isSubmitting.value) return;
  isModalOpen.value = false;
}

// function closeViewModal() { ... } // REMOVED

// --- Event Handlers & Computed ---
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