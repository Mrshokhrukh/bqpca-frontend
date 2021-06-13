<template>
  <div class="max-w-7xl mx-auto p-6">
    <!-- Header -->
    <div class="flex justify-between items-center mb-8">
      <div>
        <h2 class="text-3xl font-bold text-gray-900">Program Applications</h2>
        <p class="text-gray-600">Track all submitted education program applications</p>
      </div>
      <button
        @click="openProgramFormModal()"
        class="px-6 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
      >
        Add New Education Program
      </button>
    </div>

    <!-- Loading / Error / No Data States -->
    <div v-if="loading || loadingTeachingCenters" class="flex justify-center items-center py-8">
      <div class="w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
      <span class="ml-3 text-gray-600">
        {{ loading ? 'Loading applications...' : 'Loading supporting data...' }}
      </span>
    </div>
    <div v-else-if="error" class="p-4 bg-red-50 border-l-4 border-red-400 rounded-r-md">
      <p class="text-red-800">{{ error }}</p>
    </div>
    <div v-else-if="applications.length === 0" class="p-4 bg-gray-50 border-l-4 border-gray-400 rounded-r-md">
      <p class="text-gray-800">No program applications found.</p>
    </div>

    <!-- Applications Table -->
    <div v-else class="overflow-x-auto bg-white rounded-xl shadow-lg">
      <table class="min-w-full border border-gray-200">
        <thead>
          <tr class="bg-gray-100">
            <th class="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b">Application ID</th>
            <th class="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b">Institute</th>
            <th class="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b">Program Title</th>
            <th class="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b">Teaching Center</th>
            <th class="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b">Status</th>
            <th class="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b">Submission Date</th>
            <th class="py-3 px-4 text-left text-sm font-semibold text-gray-700 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="app in applications" :key="app.id" class="hover:bg-gray-50">
            <td class="py-3 px-4 border-b text-gray-800">{{ app.id }}</td>
            <td class="py-3 px-4 border-b text-gray-800">{{ app.institute?.name_of_institution || 'N/A' }}</td>
            <td class="py-3 px-4 border-b text-gray-800">{{ app.specific_program_title || 'N/A' }}</td>
            <td class="py-3 px-4 border-b text-gray-800">{{ getTeachingCenterName(app.teaching_center) || 'N/A' }}</td>
            <td class="py-3 px-4 border-b">
              <span
                :class="{
                  'px-2 py-1 rounded-full text-xs font-medium': true,
                  'bg-blue-100 text-blue-800': app.status === 'Pending',
                  'bg-green-100 text-green-800': app.status === 'Approved',
                  'bg-red-100 text-red-800': app.status === 'Rejected'
                }"
              >
                {{ app.status || 'Unknown' }}
              </span>
            </td>
            <td class="py-3 px-4 border-b text-gray-800">
              {{ formatDate(app.created_at) }}
            </td>
            <td class="py-3 px-4 border-b text-gray-800 whitespace-nowrap">
              <button
                @click.stop="openViewApplicationModal(app)"
                class="text-blue-600 hover:text-blue-800 font-medium mr-3 text-sm"
                title="View Application"
              >
                View
              </button>
              <button
                @click="openProgramFormModal(app)"
                class="text-yellow-600 hover:text-yellow-800 font-medium mr-3 text-sm"
                title="Edit Application"
              >
                Edit
              </button>
              <button
                @click.stop="promptDeleteApplication(app)"
                class="text-red-600 hover:text-red-800 font-medium text-sm"
                title="Delete Application"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal for Add/Edit Education Program Form -->
    <div
      v-if="isProgramFormModalOpen"
      class="modal-form fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4"
      @click.self="handleProgramFormModalClose"
    >
      <div class="bg-white rounded-xl shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div class="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 class="text-2xl font-bold text-gray-900">
            {{ applicationForEditing ? 'Edit Education Program' : 'Offer New Education Program' }}
          </h2>
          <button
            @click="handleProgramFormModalClose"
            class="text-gray-500 hover:text-gray-700 text-2xl font-bold"
          >
            ×
          </button>
        </div>
        <div class="p-6">
          <ApplyNewEducationProgram
            :applicationToEdit="applicationForEditing"
            @close="handleProgramFormModalClose"
            @program-saved="refreshDataAndCloseForm"
            ref="applyProgramForm"
          />
        </div>
      </div>
    </div>

    <!-- View Application Modal -->
    <ViewApplicationModal
      v-if="isViewModalOpen && applicationForViewing"
      :isVisible="isViewModalOpen"
      :application="applicationForViewing"
      :teachingCenterNameProp="getTeachingCenterName(applicationForViewing?.teaching_center)"
      @close="closeViewApplicationModal"
    />

    <!-- Confirm Delete Modal -->
    <ConfirmDialog
      v-if="isConfirmDeleteModalOpen && applicationForDeleting"
      :isVisible="isConfirmDeleteModalOpen"
      title="Confirm Deletion"
      :message="`Are you sure you want to delete the program application '${applicationForDeleting?.specific_program_title || applicationForDeleting?.id}'? This action cannot be undone.`"
      confirmButtonText="Delete"
      confirmButtonClass="bg-red-600 hover:bg-red-700"
      @confirm="executeDeleteApplication"
      @cancel="closeConfirmDeleteModal"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { useToast } from 'vue-toastification';
import apiServices from '@/services/services';
import ApplyNewEducationProgram from './ApplyNewEducationProgram.vue';
import ViewApplicationModal from './modals/ViewApplicationModal.vue';
import ConfirmDialog from './modals/ConfirmDialog.vue';

const toast = useToast();
const applications = ref([]);
const allTeachingCenters = ref([]);
const loading = ref(true);
const loadingTeachingCenters = ref(true);
const error = ref(null);

// Modal states
const isProgramFormModalOpen = ref(false);
const applicationForEditing = ref(null);
const applyProgramForm = ref(null);

const isViewModalOpen = ref(false);
const applicationForViewing = ref(null);

const isConfirmDeleteModalOpen = ref(false);
const applicationForDeleting = ref(null);

const fetchAllData = async () => {
  loading.value = true;
  loadingTeachingCenters.value = true;
  error.value = null;
  try {
    await fetchAllTeachingCenters();
    await fetchApplications();
  } catch (err) {
    console.error('Error fetching data:', err);
    toast.error('Failed to fetch data.');
  }
};

const fetchAllTeachingCenters = async () => {
  loadingTeachingCenters.value = true;
  try {
    const response = await apiServices.getMhpcTeachingCenters();
    allTeachingCenters.value = response.data.results || response.data || [];
  } catch (err) {
    console.error('Error fetching teaching centers:', err);
    toast.error('Failed to load teaching center data.');
  } finally {
    loadingTeachingCenters.value = false;
  }
};

const fetchApplications = async () => {
  loading.value = true;
  try {
    const response = await apiServices.getMhpcProgramsOffered();
    applications.value = response.data.results || response.data || [];
  } catch (err) {
    console.error('Error fetching program applications:', err);
    error.value = 'Failed to load program applications. Please try again later.';
    toast.error(error.value);
  } finally {
    loading.value = false;
  }
};

const getTeachingCenterName = (tcId) => {
  if (!tcId || !allTeachingCenters.value.length) return null;
  const center = allTeachingCenters.value.find(tc => tc.id === tcId);
  return center ? center.center_name : `ID: ${tcId}`;
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// --- Program Form Modal (Add/Edit) ---
const openProgramFormModal = async (app = null) => {
  applicationForEditing.value = app ? { ...app } : null;
  isProgramFormModalOpen.value = true;

  await nextTick();
  if (applyProgramForm.value && applyProgramForm.value.initializeForEdit && app) {
    applyProgramForm.value.initializeForEdit(applicationForEditing.value);
  } else if (applyProgramForm.value && !app && applyProgramForm.value.initializeForNew) {
    applyProgramForm.value.initializeForNew();
  }
};

const handleProgramFormModalClose = () => {
  isProgramFormModalOpen.value = false;
  applicationForEditing.value = null;
};

const refreshDataAndCloseForm = () => {
  handleProgramFormModalClose();
  fetchAllData();
};

// --- View Application Modal ---
const openViewApplicationModal = (app) => {
  console.log('Opening view modal for:', app);
  applicationForViewing.value = { ...app };
  isViewModalOpen.value = true;
  console.log('View modal state:', {
    isViewModalOpen: isViewModalOpen.value,
    applicationForViewing: applicationForViewing.value,
  });
};

const closeViewApplicationModal = () => {
  console.log('Closing view modal');
  isViewModalOpen.value = false;
  applicationForViewing.value = null;
};

// --- Delete Application ---
const promptDeleteApplication = (app) => {
  console.log('Prompting delete for:', app);
  applicationForDeleting.value = { ...app };
  isConfirmDeleteModalOpen.value = true;
  console.log('Delete modal state:', {
    isConfirmDeleteModalOpen: isConfirmDeleteModalOpen.value,
    applicationForDeleting: applicationForDeleting.value,
  });
};

const closeConfirmDeleteModal = () => {
  console.log('Closing delete modal');
  isConfirmDeleteModalOpen.value = false;
  applicationForDeleting.value = null;
};

const executeDeleteApplication = async () => {
  if (!applicationForDeleting.value) return;
  console.log('Executing delete for:', applicationForDeleting.value);
  try {
    await apiServices.deleteMhpcProgramOffered(applicationForDeleting.value.id);
    applications.value = applications.value.filter(app => app.id !== applicationForDeleting.value.id);
    console.log('Toast success triggered');
    toast.success(`Application "${applicationForDeleting.value.specific_program_title || applicationForDeleting.value.id}" deleted successfully.`);
  } catch (err) {
    console.error('Error deleting program application:', err);
    console.log('Toast error triggered');
    toast.error(`Error: ${err.response?.data?.detail || err.message || 'Failed to delete application.'}`);
  } finally {
    closeConfirmDeleteModal();
  }
};

onMounted(() => {
  fetchAllData();
});
</script>

<style scoped>
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
.animate-spin {
  animation: spin 1s linear infinite;
}
td.whitespace-nowrap {
  white-space: nowrap;
}
.modal-form {
  z-index: 50 !important;
}
</style>