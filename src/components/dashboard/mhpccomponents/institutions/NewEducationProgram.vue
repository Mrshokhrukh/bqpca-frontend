<template>
  <div class="container mx-auto p-4 md:p-8">
    <!-- Toast Notifications -->
    <div v-if="notifications.length > 0" class="fixed top-4 right-4 z-50 space-y-2">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        :class="[
          'px-6 py-4 rounded-lg shadow-lg text-white font-medium transition-all duration-300 transform',
          notification.type === 'success' ? 'bg-green-500' :
          notification.type === 'error' ? 'bg-red-500' :
          notification.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
        ]"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <span v-if="notification.type === 'success'" class="mr-2">✓</span>
            <span v-else-if="notification.type === 'error'" class="mr-2">✗</span>
            <span v-else-if="notification.type === 'warning'" class="mr-2">⚠</span>
            <span v-else class="mr-2">ℹ</span>
            {{ notification.message }}
          </div>
          <button @click="removeNotification(notification.id)" class="ml-4 text-white hover:text-gray-200">
            ×
          </button>
        </div>
      </div>
    </div>

    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-800">
        Module Faculty Assignments
        <span v-if="instituteName" class="text-xl text-gray-600">for {{ instituteName }}</span>
      </h1>
      <button
        @click="openAddProgramModal"
        class="px-6 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        :disabled="isLoadingInstitute || !currentUserInstitute?.id || isPerformingAction"
      >
        <span v-if="isPerformingAction" class="mr-2">⏳</span>
        <span v-else class="mr-2">+</span>
        {{ isPerformingAction ? 'Processing...' : 'Configure Program & Assign Faculty' }}
      </button>
      <p v-if="!currentUserInstitute?.id && !isLoadingInstitute" class="text-sm text-red-500 ml-4">
        Cannot manage assignments: Institute (ID: {{ SPECIFIC_INSTITUTE_ID }}) could not be loaded.
      </p>
    </div>

    <!-- Loading Institute State -->
    <div v-if="isLoadingInstitute" class="text-center text-gray-500 py-10">
      <div class="animate-spin inline-block w-8 h-8 border-4 border-gray-300 border-t-indigo-600 rounded-full mb-4"></div>
      <p class="text-xl">Loading institute profile (ID: {{ SPECIFIC_INSTITUTE_ID }})...</p>
      <p class="text-sm mt-2">Please wait while we fetch your institute information.</p>
    </div>
    <!-- Institute Not Found -->
    <div v-else-if="!currentUserInstitute?.id" class="text-center text-gray-500 py-10">
      <div class="text-6xl mb-4">🏫</div>
      <p class="text-xl font-semibold">Institute Not Found</p>
      <p class="mt-2 text-sm">Institute profile (ID: {{ SPECIFIC_INSTITUTE_ID }}) could not be loaded.</p>
      <p class="mt-1 text-sm">Please check the API connection and ensure an institute with this ID exists.</p>
      <button @click="fetchInstitute" class="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">
        Retry Loading Institute
      </button>
    </div>
    <!-- Loading Assignments State -->
    <div v-else-if="isLoadingAssignments" class="text-center text-gray-500 py-10">
      <div class="animate-spin inline-block w-8 h-8 border-4 border-gray-300 border-t-indigo-600 rounded-full mb-4"></div>
      <p class="text-xl">Loading module faculty assignments...</p>
      <p class="text-sm mt-2">Fetching the latest assignment data for your institute.</p>
    </div>
    <!-- Error State -->
    <div v-else-if="fetchError" class="text-center text-red-500 py-10">
      <div class="text-6xl mb-4">⚠️</div>
      <p class="text-xl font-semibold">Failed to Load Assignments</p>
      <p class="mt-2">{{ fetchError }}</p>
      <div class="mt-4 space-x-2">
        <button @click="fetchAssignments" class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
          Retry Loading
        </button>
        <button @click="fetchInstitute" class="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
          Reload Institute
        </button>
      </div>
    </div>
    <!-- Empty State -->
    <div v-else-if="moduleFacultyAssignments.length === 0" class="text-center text-gray-500 py-10">
      <div class="text-6xl mb-4">📚</div>
      <p class="text-xl font-semibold">No Faculty Assignments Found</p>
      <p class="mt-2">No module faculty assignments have been created for this institute yet.</p>
      <p class="mt-1 text-sm">Get started by configuring a program and assigning faculty members to modules.</p>
      <button
        @click="openAddProgramModal"
        class="mt-4 px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        :disabled="!currentUserInstitute?.id"
      >
        Create Your First Assignment
      </button>
    </div>
    <!-- Table -->
    <div v-else class="overflow-x-auto bg-white shadow-lg rounded-lg">
      <div v-if="isPerformingAction" class="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded-lg">
        <div class="text-center">
          <div class="animate-spin inline-block w-8 h-8 border-4 border-gray-300 border-t-indigo-600 rounded-full mb-2"></div>
          <p class="text-gray-600">{{ actionMessage }}</p>
        </div>
      </div>

      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-100">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
              Program Offering
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
              Semester
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
              Module
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
              Assigned Faculty
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
              Number of Students
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="assignment in moduleFacultyAssignments" :key="assignment.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
              {{ assignment.module?.semester?.program_offered?.program_master?.program_name || 'N/A' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
              {{ assignment.module?.semester?.name || 'N/A' }}
              <div v-if="assignment.module?.semester?.academic_year" class="text-xs text-gray-500">
                (AY: {{ assignment.module.semester.academic_year }})
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
              {{ assignment.module?.module_master?.module_name || 'N/A' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
              {{ assignment.faculty?.faculty_name || 'N/A' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
              {{ assignment.module?.student_count ?? 'N/A' }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <button
                @click="openEditModal(assignment)"
                class="text-indigo-600 hover:text-indigo-900 mr-2 disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="isPerformingAction"
              >
                Edit
              </button>
              <button
                @click="confirmDeleteAssignment(assignment)"
                class="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="isPerformingAction"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Confirmation Modal -->
    <div v-if="showConfirmModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div class="mt-3 text-center">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <span class="text-red-600 text-2xl">⚠️</span>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mt-4">Confirm Deletion</h3>
          <div class="mt-2 px-7 py-3">
            <p class="text-sm text-gray-500">
              Are you sure you want to delete the assignment for:
            </p>
            <div class="mt-2 p-3 bg-gray-50 rounded">
              <p class="font-medium">{{ confirmData?.module?.module_master?.module_name || 'Unknown Module' }}</p>
              <p class="text-sm text-gray-600">Faculty: {{ confirmData?.faculty?.faculty_name || 'Unknown Faculty' }}</p>
            </div>
            <p class="text-sm text-red-600 mt-2">This action cannot be undone.</p>
          </div>
          <div class="items-center px-4 py-3">
            <button
              @click="executeDelete"
              class="px-4 py-2 bg-red-600 text-white text-base font-medium rounded-md w-24 mr-2 hover:bg-red-700 disabled:opacity-50"
              :disabled="isPerformingAction"
            >
              {{ isPerformingAction ? '...' : 'Deleting' }}
            </button>
            <button
              @click="cancelDelete"
              class="px-4 py-2 bg-gray-300 text-gray-800 text-base font-medium rounded-md w-24 hover:bg-gray-400"
              :disabled="isPerformingAction"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal for Adding New Assignment -->
    <NewEducationProgramModal
      :is-open="isModalOpen"
      :current-user-institute-id="currentUserInstitute?.id"
      :current-institute-name="instituteName"
      @close="closeAddProgramModal"
      @program-configured="handleProgramConfigured"
    />

    <!-- Modal for Editing Assignment -->
    <EditFacultyAssignmentModal
      :is-open="isEditModalOpen"
      :assignment="selectedAssignment"
      :faculty-list="facultyList"
      @close="closeEditModal"
      @save="saveAssignment"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import apiServices from '@/services/services';
import NewEducationProgramModal from './NewEducationProgramModal.vue';
import EditFacultyAssignmentModal from './EditFacultyAssignmentModal.vue';

// --- DYNAMIC INSTITUTE ID ---
// Get the current route object to access URL parameters
const route = useRoute();
// Create a computed property to get the institute ID from the URL.
// This is more robust than a simple const as it's reactive.
// parseInt ensures we are working with a number.
const SPECIFIC_INSTITUTE_ID = computed(() => parseInt(route.params.instituteId, 10));

// --- STATE MANAGEMENT ---
const currentUserInstitute = ref(null);
const instituteName = ref('');
const isLoadingInstitute = ref(true);
const isLoadingAssignments = ref(false);
const fetchError = ref(null);
const moduleFacultyAssignments = ref([]);
const isModalOpen = ref(false);
const isEditModalOpen = ref(false);
const selectedAssignment = ref(null);
const facultyList = ref([]);
const isPerformingAction = ref(false);
const actionMessage = ref('');
const showConfirmModal = ref(false);
const confirmData = ref(null);
const notifications = ref([]);

// --- NOTIFICATION SYSTEM ---
const addNotification = (message, type = 'info', duration = 5000) => {
  const id = Date.now() + Math.random();
  notifications.value.push({ id, message, type });
  setTimeout(() => removeNotification(id), duration);
};

const removeNotification = (id) => {
  const index = notifications.value.findIndex(n => n.id === id);
  if (index > -1) {
    notifications.value.splice(index, 1);
  }
};

// --- DATA FETCHING ---
const fetchInstitute = async () => {
  if (!SPECIFIC_INSTITUTE_ID.value) {
    console.error("No Institute ID found in URL.");
    isLoadingInstitute.value = false;
    return;
  }
  isLoadingInstitute.value = true;
  try {
    const response = await apiServices.getMhpcInstitute(SPECIFIC_INSTITUTE_ID.value);
    if (response.data) {
      currentUserInstitute.value = {
        id: response.data.id,
        name: response.data.name_of_institution,
      };
      instituteName.value = response.data.name_of_institution || 'Unknown Institute';
    } else {
      throw new Error('Institute data not found in response');
    }
  } catch (error) {
    console.error('Error fetching institute:', error);
    currentUserInstitute.value = null;
    instituteName.value = '';
    fetchError.value = 'Failed to load institute profile.';
    addNotification(`Failed to load institute (ID: ${SPECIFIC_INSTITUTE_ID.value}). Please check the ID and your connection.`, 'error');
  } finally {
    isLoadingInstitute.value = false;
  }
};

const fetchFacultyList = async () => {
  try {
    const response = await apiServices.getMhpcTeachingFaculties({ institute: SPECIFIC_INSTITUTE_ID.value });
    facultyList.value = response.data.results || response.data || [];
  } catch (error) {
    console.error('Error fetching faculty list:', error);
    addNotification('Failed to load faculty list.', 'warning');
  }
};

const fetchAssignments = async () => {
  if (!currentUserInstitute.value?.id) {
    console.log('Skipping fetchAssignments: Institute not loaded');
    return;
  }
  isLoadingAssignments.value = true;
  fetchError.value = null;
  try {
    const params = {
      // Expanding related fields to get all necessary data in one request
      expand: 'module.semester.program_offered.program_master,module.semester.program_offered.institute,module.module_master,faculty',
    };
    const response = await apiServices.getMhpcFacultyAssignments(params);
    const allAssignments = response.data.results || response.data || [];

    // --- CORRECTED FILTERING LOGIC ---
    // Filter assignments to only show those belonging to the current institute.
    // Optional chaining (?.) prevents errors if the nested data path doesn't exist.
    moduleFacultyAssignments.value = allAssignments.filter(asgn =>
      asgn.module?.semester?.program_offered?.institute?.id === SPECIFIC_INSTITUTE_ID.value
    );

    console.log('Filtered Assignments:', moduleFacultyAssignments.value);
  } catch (error) {
    console.error('Error fetching assignments:', error);
    fetchError.value = error.message || 'Failed to load assignments';
    moduleFacultyAssignments.value = [];
    addNotification('Failed to load faculty assignments. Please try again.', 'error');
  } finally {
    isLoadingAssignments.value = false;
  }
};

// --- MODAL AND ACTION HANDLERS ---
const openAddProgramModal = () => {
  if (!currentUserInstitute.value?.id) {
    addNotification(`Cannot configure program: Institute profile (ID: ${SPECIFIC_INSTITUTE_ID.value}) not loaded.`, 'error');
    return;
  }
  isModalOpen.value = true;
};
const closeAddProgramModal = () => isModalOpen.value = false;

const handleProgramConfigured = (event) => {
  console.log('Program configuration saved/updated:', event);
  addNotification('Program configured successfully! Refreshing assignments...', 'success');
  fetchAssignments();
};

const openEditModal = async (assignment) => {
  selectedAssignment.value = { ...assignment };
  if (facultyList.value.length === 0) {
    isPerformingAction.value = true;
    actionMessage.value = 'Loading faculty list...';
    await fetchFacultyList();
    isPerformingAction.value = false;
  }
  isEditModalOpen.value = true;
};
const closeEditModal = () => {
  isEditModalOpen.value = false;
  selectedAssignment.value = null;
};

const saveAssignment = async (updatedData) => {
  isPerformingAction.value = true;
  actionMessage.value = 'Saving assignment changes...';
  try {
    const payload = {
      faculty: updatedData.faculty_id,
      module: updatedData.module_id,
    };
    await apiServices.patchMhpcFacultyAssignment(updatedData.id, payload);

    if (updatedData.student_count !== selectedAssignment.value.module.student_count) {
        actionMessage.value = 'Updating student count...';
        await apiServices.patchMhpcModule(selectedAssignment.value.module.id, {
          student_count: updatedData.student_count,
        });
        addNotification('Assignment and student count updated successfully!', 'success');
    } else {
      addNotification('Assignment updated successfully!', 'success');
    }

    closeEditModal();
    await fetchAssignments();
  } catch (error) {
    console.error('Error saving assignment:', error);
    addNotification(`Failed to save assignment: ${error.message || 'Please try again.'}`, 'error');
  } finally {
    isPerformingAction.value = false;
    actionMessage.value = '';
  }
};

const confirmDeleteAssignment = (assignment) => {
  confirmData.value = assignment;
  showConfirmModal.value = true;
};
const cancelDelete = () => {
  showConfirmModal.value = false;
  confirmData.value = null;
};

const executeDelete = async () => {
  if (!confirmData.value) return;
  isPerformingAction.value = true;
  actionMessage.value = 'Deleting assignment...';
  try {
    await apiServices.deleteMhpcFacultyAssignment(confirmData.value.id);
    addNotification(`Successfully deleted assignment for ${confirmData.value.module?.module_master?.module_name || 'module'}.`, 'success');
    cancelDelete(); // Closes modal and resets data
    await fetchAssignments(); // Refresh the list
  } catch (error) {
    console.error('Error deleting assignment:', error);
    addNotification('Failed to delete assignment. Please try again.', 'error');
  } finally {
    isPerformingAction.value = false;
    actionMessage.value = '';
  }
};

// --- LIFECYCLE HOOK ---
onMounted(async () => {
  await fetchInstitute();
  // Only proceed if the institute was successfully loaded
  if (currentUserInstitute.value?.id) {
    // Fetch assignments and the faculty list in parallel for efficiency
    await Promise.all([
        fetchFacultyList(),
        fetchAssignments()
    ]);
  }
});
</script>

<style scoped>
.container {
  max-width: 1400px;
}
.disabled\:opacity-50:disabled {
  opacity: 0.5;
}
.disabled\:cursor-not-allowed:disabled {
  cursor: not-allowed;
}
</style>