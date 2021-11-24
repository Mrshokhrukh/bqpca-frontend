<template>
  <div class="mx-auto p-4 md:p-8 bg-gray-50 min-h-screen">
    <!-- Notifications -->
    <div v-if="notifications.length > 0" class="fixed top-6 right-6 z-50 w-full max-w-sm space-y-3">
      <div v-for="notification in notifications" :key="notification.id"
        class="flex items-center p-4 rounded-lg shadow-xl text-white font-semibold transition-all duration-300 transform"
        :class="{
          'bg-green-600': notification.type === 'success',
          'bg-red-600': notification.type === 'error',
          'bg-yellow-600': notification.type === 'warning',
          'bg-blue-600': notification.type === 'info',
        }">
        <CheckCircle2 v-if="notification.type === 'success'" class="h-6 w-6 mr-3" />
        <AlertOctagon v-else-if="notification.type === 'error'" class="h-6 w-6 mr-3" />
        <AlertTriangle v-else-if="notification.type === 'warning'" class="h-6 w-6 mr-3" />
        <Info v-else class="h-6 w-6 mr-3" />
        <span class="flex-1">{{ notification.message }}</span>
        <button @click="removeNotification(notification.id)" class="ml-4 p-1 rounded-full hover:bg-white/20">
          <X class="h-5 w-5" />
        </button>
      </div>
    </div>

    <!-- Header -->
    <header class="flex flex-wrap justify-between items-center mb-8 pb-4 border-b border-gray-200">
      <div>
        <h1 class="text-4xl font-bold text-gray-800 tracking-tight">Module Faculty Assignments</h1>
        <p v-if="instituteName" class="text-lg text-gray-600 mt-1">For {{ instituteName }}</p>
      </div>
      <div class="flex items-center space-x-4">
        <p v-if="!currentUserInstitute?.id && !isLoadingInstitute" class="text-sm text-red-600 flex items-center">
          <AlertCircle class="w-5 h-5 mr-2" />
          Cannot manage assignments: Institute (ID: {{ instituteId }}) could not be loaded.
        </p>
        <button @click="openAddProgramModal"
          class="flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          :disabled="isLoadingInstitute || !currentUserInstitute?.id || isPerformingAction">
          <LoaderCircle v-if="isPerformingAction" class="animate-spin h-5 w-5 mr-2" />
          <Plus v-else class="h-5 w-5 mr-2" />
          {{ isPerformingAction ? 'Processing...' : 'Configure & Assign' }}
        </button>
      </div>
    </header>

    <!-- Loading/Empty/Error States -->
    <div v-if="
      isLoadingInstitute ||
      !currentUserInstitute?.id ||
      isLoadingAssignments ||
      fetchError ||
      groupedDataByProgram.length === 0
    " class="text-center py-16 px-6 bg-white rounded-lg shadow-md">
      <!-- ... (all state displays remain unchanged) ... -->
    </div>

    <!-- Main Table -->
    <div v-else class="overflow-hidden bg-white shadow-lg rounded-xl">
      <div v-if="isPerformingAction"
        class="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-20 rounded-xl">
        <div class="text-center">
          <LoaderCircle class="animate-spin inline-block w-10 h-10 text-indigo-600 mb-3" />
          <p class="text-gray-700 font-semibold">{{ actionMessage }}</p>
        </div>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-100">
            <tr>
              <th v-for="header in tableHeaders" :key="header" scope="col"
                class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                {{ header }}
              </th>
            </tr>
          </thead>
          <tbody class="bg-white">
            <template v-for="(program, programIndex) in groupedDataByProgram" :key="program.programId">
              <!-- Program Header Row -->
              <tr :class="{ 'border-t-4 border-gray-200': programIndex > 0 }">
                <td :colspan="tableHeaders.length" class="px-4 py-3 bg-gray-100">
                  <h3 class="text-base font-bold text-gray-700 tracking-wide">
                    {{ program.programName }}
                  </h3>
                </td>
              </tr>

              <!-- Module Rows for this Program -->
              <tr v-for="group in program.modules" :key="group.moduleId"
                class="hover:bg-gray-50 transition-colors duration-150">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 border-b border-gray-200">
                  <span v-if="group.specificProgramTitle" class="text-xs text-gray-500">{{ group.specificProgramTitle
                    }}</span>
                  <span v-else class="text-xs text-gray-400 italic">Main Program</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 border-b border-gray-200">
                  <div class="font-medium text-gray-800">
                    {{ group.moduleName || 'N/A' }}
                  </div>
                  <div class="text-xs text-gray-500">
                    {{ group.semesterName || 'N/A' }} (AY:
                    {{ group.academicYear }})
                  </div>
                </td>
                <td class="px-6 py-4 text-sm text-gray-600 border-b border-gray-200">
                  <div v-for="faculty in group.faculties" :key="faculty.id" class="flex items-center mb-1 last:mb-0">
                    <div class="font-medium text-gray-800">
                      {{ faculty.faculty_name || 'N/A' }}
                    </div>
                    <span v-if="faculty.is_primary_instructor"
                      class="ml-2 px-2 py-0.5 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                      Primary
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 border-b border-gray-200">
                  <div>{{ group.studentCount ?? 'N/A' }} students</div>
                  <div class="text-xs text-gray-500">
                    {{ group.teachingHours ?? 'N/A' }} teaching hours
                  </div>

                  <!-- ============================================= -->
                  <!-- === REMARKS DISPLAY BLOCK (IMPLEMENTED) === -->
                  <!-- ============================================= -->
                  <div v-if="group.remarks" class="mt-3 pt-2 border-t border-gray-200 whitespace-normal">
                    <div class="flex items-start text-indigo-800">
                      <MessageSquare class="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                      <p class="text-xs italic">
                        <strong>Officer's Remark:</strong> {{ group.remarks }}
                      </p>
                    </div>
                  </div>
                  <!-- ============================================= -->

                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium border-b border-gray-200">
                  <div class="flex items-center space-x-2">
                    <button @click="openViewApplicationModal(group.originalAssignments[0])"
                      class="p-2 text-sky-600 hover:bg-sky-100 rounded-md disabled:opacity-50"
                      :disabled="isPerformingAction" title="View Program Details">
                      <Eye class="h-4 w-4" />
                    </button>
                    <button @click="openEditModal(group.originalAssignments)"
                      class="p-2 text-indigo-600 hover:bg-indigo-100 rounded-md disabled:opacity-50"
                      :disabled="isPerformingAction" title="Edit Assignment">
                      <Pencil class="h-4 w-4" />
                    </button>
                    <button @click="confirmDeleteAssignment(group.originalAssignments)"
                      class="p-2 text-red-600 hover:bg-red-100 rounded-md disabled:opacity-50"
                      :disabled="isPerformingAction" title="Delete Assignment">
                      <Trash2 class="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>

    <NewEducationProgramModal :is-open="isModalOpen" :current-user-institute-id="currentUserInstitute?.id"
      :current-institute-name="instituteName" @close="closeAddProgramModal"
      @program-configured="handleProgramConfigured" />
    <EditFacultyAssignmentModal :is-open="isEditModalOpen" :assignment="selectedAssignment" :faculty-list="facultyList"
      @close="closeEditModal" @save="saveAssignment" />

    <NewEducationProgramViewApplicationModal v-if="isViewModalOpen && applicationForViewing"
      :isVisible="isViewModalOpen" :application="applicationForViewing"
      :teachingCenterNameProp="applicationForViewing.teaching_center_details?.name_of_teaching_center"
      @close="closeViewApplicationModal" />
    <div v-if="showConfirmModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 class="text-lg font-bold mb-2 text-gray-800">Confirm Delete</h2>
        <p class="mb-4 text-gray-600">
          Are you sure you want to delete this assignment? This action cannot be undone.
        </p>
        <div class="flex justify-end space-x-3">
          <button @click="cancelDelete" class="px-4 py-2 rounded bg-gray-200 text-gray-700 hover:bg-gray-300">
            Cancel
          </button>
          <button @click="executeDelete" class="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700">
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import apiServices from '@/services/services';
import NewEducationProgramModal from './NewEducationProgramApplicationFormModal.vue';
import EditFacultyAssignmentModal from './NewEducationProgramEditFacultyAssignmentModal.vue';
import NewEducationProgramViewApplicationModal from './NewEducationProgramViewApplicationModal.vue';
import {
  Plus, LoaderCircle, CheckCircle2, AlertOctagon, AlertTriangle, Info, X,
  University, RefreshCw, AlertCircle, BookMarked, PlusCircle, Pencil, Trash2, Eye,
  MessageSquare, // <-- ICON IMPORTED
} from 'lucide-vue-next';

const instituteId = ref(null);
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
const isViewModalOpen = ref(false);
const applicationForViewing = ref(null);

const user = useAuthStore().user;

const tableHeaders = [
  'Specific Program Title',
  'Module & Semester',
  'Instructors',
  'Details & Remarks', // Header updated for clarity
  'Actions',
];

const groupedDataByProgram = computed(() => {
  if (!moduleFacultyAssignments.value.length) {
    return [];
  }

  const programs = {};

  moduleFacultyAssignments.value.forEach(assignment => {
    const programOffered = assignment.module?.semester?.program_offered;
    if (!programOffered || !assignment.module?.id) return;

    const programId = programOffered.program_master?.id;
    if (!programId) return;

    if (!programs[programId]) {
      programs[programId] = {
        programId: programId,
        programName: programOffered.program_master.program_name,
        modules: {},
      };
    }

    const moduleId = assignment.module.id;
    if (!programs[programId].modules[moduleId]) {
      programs[programId].modules[moduleId] = {
        moduleId: moduleId,
        specificProgramTitle: programOffered.specific_program_title,
        moduleName: assignment.module.module_master?.module_name,
        semesterName: assignment.module.semester?.name,
        academicYear: assignment.module.semester?.academic_year,
        studentCount: assignment.module.student_count,
        teachingHours: assignment.teaching_hours,
        // ===============================================
        // === REMARKS DATA CAPTURED (IMPLEMENTED) ===
        // ===============================================
        remarks: assignment.remarks,
        // ===============================================
        faculties: [],
        originalAssignments: [],
      };
    }

    programs[programId].modules[moduleId].faculties.push({
      ...assignment.faculty,
      is_primary_instructor: assignment.is_primary_instructor
    });
    programs[programId].modules[moduleId].originalAssignments.push(assignment);
  });

  return Object.values(programs).map(program => {
    program.modules = Object.values(program.modules);
    return program;
  });
});

// ... (all other script functions: addNotification, fetchInstitute, saveAssignment, etc., remain unchanged) ...
// ... (the rest of the script is exactly as you provided it) ...
const addNotification = (message, type = 'info', duration = 5000) => {
  const id = Date.now() + Math.random();
  notifications.value.push({ id, message, type });
  setTimeout(() => removeNotification(id), duration);
};

const removeNotification = (id) => {
  const index = notifications.value.findIndex((n) => n.id === id);
  if (index > -1) {
    notifications.value.splice(index, 1);
  }
};

const openViewApplicationModal = (assignment) => {
  if (assignment.module?.semester?.program_offered) {
    applicationForViewing.value = assignment.module.semester.program_offered;
    isViewModalOpen.value = true;
  } else {
    addNotification('Program details are not available for this assignment.', 'error');
  }
};

const closeViewApplicationModal = () => {
  isViewModalOpen.value = false;
  applicationForViewing.value = null;
};

const fetchInstitute = async () => {
  isLoadingInstitute.value = true;
  try {
    const response = await apiServices.getMhpcInstituteByCid(user.cid);
    if (response.data?.results?.length > 0) {
      const instituteRecord = response.data.results[0];
      currentUserInstitute.value = { id: instituteRecord.id, name: instituteRecord.name_of_institution };
      instituteId.value = instituteRecord.id;
      instituteName.value = instituteRecord.name_of_institution || 'Unknown Institute';
    } else {
      throw new Error('Institute data not found for the current user.');
    }
  } catch (error) {
    console.error('Error fetching institute:', error);
    currentUserInstitute.value = null;
    instituteName.value = '';
    fetchError.value = error.message || 'Failed to load institute profile.';
    addNotification(fetchError.value, 'error');
  } finally {
    isLoadingInstitute.value = false;
  }
};

const fetchFacultyList = async () => {
  if (!instituteId.value) return;
  try {
    const response = await apiServices.getMhpcTeachingFaculties({ institute: instituteId.value });
    facultyList.value = response.data.results || response.data || [];
  } catch (error) {
    console.error('Error fetching faculty list:', error);
    addNotification('Failed to load faculty list.', 'warning');
  }
};

const fetchAssignments = async () => {
  if (!instituteId.value) return;
  isLoadingAssignments.value = true;
  fetchError.value = null;
  try {
    const response = await apiServices.getMhpcFacultyAssignments({
      module__semester__program_offered__institute__applicant_user__cid: user.cid
    });
    moduleFacultyAssignments.value = response.data.results || response.data || [];
  } catch (error) {
    console.error('Error fetching assignments:', error);
    fetchError.value = error.message || 'Failed to load assignments';
    addNotification('Failed to load faculty assignments. Please try again.', 'error');
  } finally {
    isLoadingAssignments.value = false;
  }
};

const openAddProgramModal = () => {
  if (!currentUserInstitute.value?.id) {
    addNotification(`Cannot configure program: Institute profile (ID: ${instituteId.value}) not loaded.`, 'error');
    return;
  }
  isModalOpen.value = true;
};

const closeAddProgramModal = () => (isModalOpen.value = false);

const handleProgramConfigured = (event) => {
  console.log('Program configuration saved/updated:', event);
  addNotification('Program configured successfully! Refreshing assignments...', 'success');
  fetchAssignments();
};

const openEditModal = async (assignmentsGroup) => {
  selectedAssignment.value = { ...assignmentsGroup[0] };
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

const confirmDeleteAssignment = (assignmentsGroup) => {
  console.log("delete");

  confirmData.value = assignmentsGroup;
  showConfirmModal.value = true;
};

const cancelDelete = () => {
  showConfirmModal.value = false;
  confirmData.value = null;
};

const executeDelete = async () => {
  if (!confirmData.value || !confirmData.value.length) return;
  isPerformingAction.value = true;
  actionMessage.value = 'Deleting assignments...';
  try {
    const deletePromises = confirmData.value.map(assignment =>
      apiServices.deleteMhpcFacultyAssignment(assignment.id)
    );
    await Promise.all(deletePromises);
    addNotification(`Successfully deleted all assignments for ${confirmData.value[0].module?.module_master?.module_name || 'module'}.`, 'success');
    cancelDelete();
    await fetchAssignments();
  } catch (error) {
    console.error('Error deleting assignments:', error);
    addNotification('Failed to delete assignments. Please try again.', 'error');
  } finally {
    isPerformingAction.value = false;
    actionMessage.value = '';
  }
};

onMounted(async () => {
  await fetchInstitute();
  if (instituteId.value) {
    await Promise.all([fetchAssignments(), fetchFacultyList()]);
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