<template>
  <div class="mx-auto p-4 md:p-8 bg-gray-50 min-h-screen">
    <div v-if="notifications.length > 0" class="fixed top-6 right-6 z-50 w-full max-w-sm space-y-3">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        class="flex items-center p-4 rounded-lg shadow-xl text-white font-semibold transition-all duration-300 transform"
        :class="{
          'bg-green-600': notification.type === 'success',
          'bg-red-600': notification.type === 'error',
          'bg-yellow-600': notification.type === 'warning',
          'bg-blue-600': notification.type === 'info',
        }"
      >
        <CheckCircle2 v-if="notification.type === 'success'" class="h-6 w-6 mr-3" />
        <AlertOctagon v-else-if="notification.type === 'error'" class="h-6 w-6 mr-3" />
        <AlertTriangle v-else-if="notification.type === 'warning'" class="h-6 w-6 mr-3" />
        <Info v-else class="h-6 w-6 mr-3" />
        <span class="flex-1">{{ notification.message }}</span>
        <button
          @click="removeNotification(notification.id)"
          class="ml-4 p-1 rounded-full hover:bg-white/20"
        >
          <X class="h-5 w-5" />
        </button>
      </div>
    </div>

    <header class="flex flex-wrap justify-between items-center mb-8 pb-4 border-b border-gray-200">
      <div>
        <h1 class="text-4xl font-bold text-gray-800 tracking-tight">Module Faculty Assignments</h1>
        <p v-if="instituteName" class="text-lg text-gray-600 mt-1">For {{ instituteName }}</p>
      </div>
      <div class="flex items-center space-x-4">
        <p
          v-if="!currentUserInstitute?.id && !isLoadingInstitute"
          class="text-sm text-red-600 flex items-center"
        >
          <AlertCircle class="w-5 h-5 mr-2" />
          Cannot manage assignments: Institute (ID: {{ instituteId }}) could not be loaded.
        </p>
        <button
          @click="openAddProgramModal"
          class="flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          :disabled="isLoadingInstitute || !currentUserInstitute?.id || isPerformingAction"
        >
          <LoaderCircle v-if="isPerformingAction" class="animate-spin h-5 w-5 mr-2" />
          <Plus v-else class="h-5 w-5 mr-2" />
          {{ isPerformingAction ? 'Processing...' : 'Configure & Assign' }}
        </button>
      </div>
    </header>

    <div
      v-if="
        isLoadingInstitute ||
        !currentUserInstitute?.id ||
        isLoadingAssignments ||
        fetchError ||
        moduleFacultyAssignments.length === 0
      "
      class="text-center py-16 px-6 bg-white rounded-lg shadow-md"
    >
      <div v-if="isLoadingInstitute">
        <LoaderCircle class="animate-spin inline-block w-12 h-12 text-indigo-600 mb-4" />
        <h2 class="text-2xl font-semibold text-gray-800">Loading Institute Profile...</h2>
        <p class="text-gray-500 mt-2">Please wait while we fetch your institute information.</p>
      </div>
      <div v-else-if="!currentUserInstitute?.id">
        <University class="inline-block w-16 h-16 text-gray-400 mb-4" />
        <h2 class="text-2xl font-semibold text-gray-800">Institute Not Found</h2>
        <p class="mt-2 text-gray-500">
          Institute profile (ID: {{ instituteId }}) could not be loaded.
        </p>
        <p class="mt-1 text-sm text-gray-500">
          Please check the API connection and ensure an institute with this ID exists.
        </p>
        <button
          @click="fetchInstitute"
          class="mt-6 flex items-center mx-auto px-5 py-2 text-sm font-semibold bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          <RefreshCw class="w-4 h-4 mr-2" />
          Retry Loading
        </button>
      </div>
      <div v-else-if="isLoadingAssignments">
        <LoaderCircle class="animate-spin inline-block w-12 h-12 text-indigo-600 mb-4" />
        <h2 class="text-2xl font-semibold text-gray-800">Loading Assignments...</h2>
        <p class="text-gray-500 mt-2">Fetching the latest assignment data for your institute.</p>
      </div>
      <div v-else-if="fetchError">
        <AlertTriangle class="inline-block w-16 h-16 text-red-500 mb-4" />
        <h2 class="text-2xl font-semibold text-red-700">Failed to Load Assignments</h2>
        <p class="mt-2 text-gray-600 bg-red-50 p-3 rounded-md">{{ fetchError }}</p>
        <div class="mt-6 space-x-4">
          <button
            @click="fetchAssignments"
            class="px-5 py-2 text-sm font-semibold bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Retry Loading
          </button>
          <button
            @click="fetchInstitute"
            class="px-5 py-2 text-sm font-semibold bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Reload Institute
          </button>
        </div>
      </div>
      <div v-else-if="moduleFacultyAssignments.length === 0">
        <BookMarked class="inline-block w-16 h-16 text-gray-400 mb-4" />
        <h2 class="text-2xl font-semibold text-gray-800">No Assignments Found</h2>
        <p class="mt-2 text-gray-500">
          No module faculty assignments have been created for this institute yet.
        </p>
        <button
          @click="openAddProgramModal"
          class="mt-6 flex items-center mx-auto px-5 py-2.5 text-sm font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          :disabled="!currentUserInstitute?.id"
        >
          <PlusCircle class="w-5 h-5 mr-2" />
          Create First Assignment
        </button>
      </div>
    </div>

    <div v-else class="overflow-hidden bg-white shadow-lg rounded-xl">
      <div
        v-if="isPerformingAction"
        class="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-20 rounded-xl"
      >
        <div class="text-center">
          <LoaderCircle class="animate-spin inline-block w-10 h-10 text-indigo-600 mb-3" />
          <p class="text-gray-700 font-semibold">{{ actionMessage }}</p>
        </div>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-100">
            <tr>
              <th
                v-for="header in tableHeaders"
                :key="header"
                scope="col"
                class="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider"
              >
                {{ header }}
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="assignment in moduleFacultyAssignments"
              :key="assignment.id"
              class="hover:bg-gray-50 transition-colors duration-150"
            >
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                {{
                  assignment.module?.semester?.program_name ||
                  'N/A'
                }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                <div class="font-medium text-gray-800">
                  {{ assignment.module?.module_master?.module_name || 'N/A' }}
                </div>
                <div class="text-xs text-gray-500">
                  {{ assignment.module?.semester?.name || 'N/A' }} (AY:
                  {{ assignment.module?.semester?.academic_year }})
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                <div class="flex items-center">
                  <div class="font-medium text-gray-800">
                    {{ assignment.faculty?.faculty_name || 'N/A' }}
                  </div>
                  <span
                    v-if="assignment.is_primary_instructor"
                    class="ml-2 px-2 py-0.5 text-xs font-semibold text-green-800 bg-green-100 rounded-full"
                  >
                    Primary
                  </span>
                </div>
                <div class="text-xs text-gray-500">
                  {{ assignment.faculty?.designation || 'No Designation' }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                <div>{{ assignment.module?.student_count ?? 'N/A' }} students</div>
                <div class="text-xs text-gray-500">
                  {{ assignment.teaching_hours ?? 'N/A' }} teaching hours
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex items-center space-x-2">
                  <button
                    @click="openViewApplicationModal(assignment)"
                    class="p-2 text-sky-600 hover:bg-sky-100 rounded-md disabled:opacity-50"
                    :disabled="isPerformingAction"
                    title="View Program Details"
                  >
                    <Eye class="h-4 w-4" />
                  </button>
                  <button
                    @click="openEditModal(assignment)"
                    class="p-2 text-indigo-600 hover:bg-indigo-100 rounded-md disabled:opacity-50"
                    :disabled="isPerformingAction"
                    title="Edit Assignment"
                  >
                    <Pencil class="h-4 w-4" />
                  </button>
                  <button
                    @click="confirmDeleteAssignment(assignment)"
                    class="p-2 text-red-600 hover:bg-red-100 rounded-md disabled:opacity-50"
                    :disabled="isPerformingAction"
                    title="Delete Assignment"
                  >
                    <Trash2 class="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div
      v-if="showConfirmModal"
      class="fixed inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center z-50"
    >
      <div class="relative mx-auto p-6 border w-full max-w-md shadow-xl rounded-lg bg-white">
        <div class="text-center">
          <div
            class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4"
          >
            <AlertTriangle class="h-8 w-8 text-red-600" />
          </div>
          <h3 class="text-xl font-bold text-gray-900">Confirm Deletion</h3>
          <div class="mt-4 px-4 py-3 bg-gray-50 rounded-lg">
            <p class="text-sm text-gray-600">Are you sure you want to delete the assignment for:</p>
            <p class="font-semibold text-gray-800 mt-2">
              {{ confirmData?.module?.module_master?.module_name || 'Unknown Module' }}
            </p>
            <p class="text-sm text-gray-500">
              Faculty: {{ confirmData?.faculty?.faculty_name || 'Unknown Faculty' }}
            </p>
          </div>
          <p class="text-sm text-red-500 mt-3 font-semibold">This action cannot be undone.</p>
          <div class="flex justify-center space-x-4 mt-6">
            <button
              @click="cancelDelete"
              class="px-6 py-2 bg-gray-200 text-gray-800 font-semibold rounded-md hover:bg-gray-300"
              :disabled="isPerformingAction"
            >
              Cancel
            </button>
            <button
              @click="executeDelete"
              class="flex items-center justify-center w-32 px-6 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 disabled:opacity-50"
              :disabled="isPerformingAction"
            >
              <LoaderCircle v-if="isPerformingAction" class="animate-spin h-5 w-5 mr-2" />
              {{ isPerformingAction ? 'Deleting...' : 'Delete' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <NewEducationProgramModal
      :is-open="isModalOpen"
      :current-user-institute-id="currentUserInstitute?.id"
      :current-institute-name="instituteName"
      @close="closeAddProgramModal"
      @program-configured="handleProgramConfigured"
    />
    <EditFacultyAssignmentModal
      :is-open="isEditModalOpen"
      :assignment="selectedAssignment"
      :faculty-list="facultyList"
      @close="closeEditModal"
      @save="saveAssignment"
    />

    <NewEducationProgramViewApplicationModal
      v-if="isViewModalOpen && applicationForViewing"
      :isVisible="isViewModalOpen"
      :application="applicationForViewing"
      :teachingCenterNameProp="applicationForViewing.teaching_center_details?.name_of_teaching_center"
      @close="closeViewApplicationModal"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import apiServices from '@/services/services'
import NewEducationProgramModal from './NewEducationProgramApplicationFormModal.vue'
import EditFacultyAssignmentModal from './NewEducationProgramEditFacultyAssignmentModal.vue'
import NewEducationProgramViewApplicationModal from './NewEducationProgramViewApplicationModal.vue'
import {
  Plus,
  LoaderCircle,
  CheckCircle2,
  AlertOctagon,
  AlertTriangle,
  Info,
  X,
  University,
  RefreshCw,
  AlertCircle,
  BookMarked,
  PlusCircle,
  Pencil,
  Trash2,
  Eye,
} from 'lucide-vue-next'

const instituteId = ref(null)
const currentUserInstitute = ref(null)
const instituteName = ref('')
const isLoadingInstitute = ref(true)
const isLoadingAssignments = ref(false)
const fetchError = ref(null)
const moduleFacultyAssignments = ref([])
const isModalOpen = ref(false)
const isEditModalOpen = ref(false)
const selectedAssignment = ref(null)
const facultyList = ref([])
const isPerformingAction = ref(false)
const actionMessage = ref('')
const showConfirmModal = ref(false)
const confirmData = ref(null)
const notifications = ref([])
const isViewModalOpen = ref(false);
const applicationForViewing = ref(null);

const user = useAuthStore().user

const tableHeaders = [
  'Program Offering',
  'Module & Semester',
  'Instructor / Role',
  'Details',
  'Actions',
]

const addNotification = (message, type = 'info', duration = 5000) => {
  const id = Date.now() + Math.random()
  notifications.value.push({ id, message, type })
  setTimeout(() => removeNotification(id), duration)
}

const removeNotification = (id) => {
  const index = notifications.value.findIndex((n) => n.id === id)
  if (index > -1) {
    notifications.value.splice(index, 1)
  }
}

const openViewApplicationModal = (assignment) => {
  // The 'application' is the program_offered object inside the assignment
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
  isLoadingInstitute.value = true
  try {
    const response = await apiServices.getMhpcInstituteByCid(user.cid)

    if (response.data?.results?.length > 0) {
      const instituteRecord = response.data.results[0]
      currentUserInstitute.value = {
        id: instituteRecord.id,
        name: instituteRecord.name_of_institution,
      }
      instituteId.value = instituteRecord.id
      instituteName.value = instituteRecord.name_of_institution || 'Unknown Institute'
    } else {
      throw new Error('Institute data not found for the current user.')
    }
  } catch (error) {
    console.error('Error fetching institute:', error)
    currentUserInstitute.value = null
    instituteName.value = ''
    fetchError.value = error.message || 'Failed to load institute profile.'
    addNotification(fetchError.value, 'error')
  } finally {
    isLoadingInstitute.value = false
  }
}

const fetchFacultyList = async () => {
  if (!instituteId.value) return
  try {
    const response = await apiServices.getMhpcTeachingFaculties({ institute: instituteId.value })
    facultyList.value = response.data.results || response.data || []
  } catch (error) {
    console.error('Error fetching faculty list:', error)
    addNotification('Failed to load faculty list.', 'warning')
  }
}

const fetchAssignments = async () => {
  if (!instituteId.value) return

  isLoadingAssignments.value = true
  fetchError.value = null
  try {
    const params = {
      expand: 'module.semester.program_offered.program_master,module.module_master,faculty',
      module__semester__program_offered__institute: instituteId.value,
    }
    const response = await apiServices.getMhpcFacultyAssignmentByCid(user.cid)
    moduleFacultyAssignments.value = response.data.results || response.data || []
  } catch (error) {
    console.error('Error fetching assignments:', error)
    fetchError.value = error.message || 'Failed to load assignments'
    addNotification('Failed to load faculty assignments. Please try again.', 'error')
  } finally {
    isLoadingAssignments.value = false
  }
}

const openAddProgramModal = () => {
  if (!currentUserInstitute.value?.id) {
    addNotification(
      `Cannot configure program: Institute profile (ID: ${instituteId.value}) not loaded.`,
      'error',
    )
    return
  }
  isModalOpen.value = true
}

const closeAddProgramModal = () => (isModalOpen.value = false)

const handleProgramConfigured = (event) => {
  console.log('Program configuration saved/updated:', event)
  addNotification('Program configured successfully! Refreshing assignments...', 'success')
  fetchAssignments()
}

const openEditModal = async (assignment) => {
  selectedAssignment.value = { ...assignment }
  if (facultyList.value.length === 0) {
    isPerformingAction.value = true
    actionMessage.value = 'Loading faculty list...'
    await fetchFacultyList()
    isPerformingAction.value = false
  }
  isEditModalOpen.value = true
}
const closeEditModal = () => {
  isEditModalOpen.value = false
  selectedAssignment.value = null
}

const saveAssignment = async (updatedData) => {
  isPerformingAction.value = true
  actionMessage.value = 'Saving assignment changes...'
  try {
    const payload = {
      faculty: updatedData.faculty_id,
      module: updatedData.module_id,
    }
    await apiServices.patchMhpcFacultyAssignment(updatedData.id, payload)

    if (updatedData.student_count !== selectedAssignment.value.module.student_count) {
      actionMessage.value = 'Updating student count...'
      await apiServices.patchMhpcModule(selectedAssignment.value.module.id, {
        student_count: updatedData.student_count,
      })
      addNotification('Assignment and student count updated successfully!', 'success')
    } else {
      addNotification('Assignment updated successfully!', 'success')
    }

    closeEditModal()
    await fetchAssignments()
  } catch (error) {
    console.error('Error saving assignment:', error)
    addNotification(`Failed to save assignment: ${error.message || 'Please try again.'}`, 'error')
  } finally {
    isPerformingAction.value = false
    actionMessage.value = ''
  }
}

const confirmDeleteAssignment = (assignment) => {
  confirmData.value = assignment
  showConfirmModal.value = true
}
const cancelDelete = () => {
  showConfirmModal.value = false
  confirmData.value = null
}

const executeDelete = async () => {
  if (!confirmData.value) return
  isPerformingAction.value = true
  actionMessage.value = 'Deleting assignment...'
  try {
    await apiServices.deleteMhpcFacultyAssignment(confirmData.value.id)
    addNotification(
      `Successfully deleted assignment for ${
        confirmData.value.module?.module_master?.module_name || 'module'
      }.`,
      'success',
    )
    cancelDelete()
    await fetchAssignments()
  } catch (error) {
    console.error('Error deleting assignment:', error)
    addNotification('Failed to delete assignment. Please try again.', 'error')
  } finally {
    isPerformingAction.value = false
    actionMessage.value = ''
  }
}

onMounted(async () => {
  await fetchInstitute()

  if (instituteId.value) {
    await Promise.all([fetchAssignments(), fetchFacultyList()])
  }
})
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
