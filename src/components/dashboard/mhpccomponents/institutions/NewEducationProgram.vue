<template>
  <div class="w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-gray-50 min-h-screen">
    <InstituteHeader
      title="Educational Programme Applications"
      subtitle="Manage and view applications for new educational programmes."
      :show-actions="false"
    />

    <div class="mt-8">
      <div class="flex justify-end mb-6">
        <button @click="openAddProgrammeModal" type="button" class="btn btn-primary">
          <PlusIcon class="h-5 w-5 mr-2" />
          Add New Programme
        </button>
      </div>

      <!-- Table display -->
      <div v-if="isLoading" class="flex flex-col items-center justify-center min-h-[300px]">
        <Loader class="animate-spin text-indigo-600 w-10 h-10" />
        <p class="mt-4 text-lg font-medium text-gray-700">Loading applications...</p>
      </div>
      <div v-else-if="apiError" class="text-center py-12 rounded-2xl border shadow-sm bg-red-50 border-red-200">
        <ExclamationTriangleIcon class="mx-auto h-12 w-12 text-red-400" />
        <h3 class="mt-2 text-lg font-medium text-red-900">Error Loading Applications</h3>
        <p class="mt-1 text-sm text-red-700">{{ errorMessage }}</p>
      </div>
      <div v-else-if="applications.length === 0" class="text-center py-12 rounded-2xl border shadow-sm bg-white">
        <DocumentMagnifyingGlassIcon class="mx-auto h-12 w-12 text-gray-400" />
        <h3 class="mt-2 text-lg font-medium text-gray-900">No Applications Found</h3>
        <p class="mt-1 text-sm text-gray-500">
          There are currently no educational programme applications.
        </p>
        <div class="mt-6">
            <button @click="openAddProgrammeModal" type="button" class="btn btn-primary">
              <PlusIcon class="h-5 w-5 mr-2" />
              Submit First Application
            </button>
        </div>
      </div>
      <div v-else class="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-200">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Proposal Title
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Institute
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Commencement
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applied On
                </th>
                <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="app in applications" :key="app.id" class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ app.course_title }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ app.institute_name }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ app.duration_in_months }} months</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(app.commencement_date) }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getStatusClass(app.ins_review_decision)" class="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full">
                    {{ app.ins_review_decision }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(app.created_at) }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <button @click="viewApplication(app.id)" class="text-indigo-600 hover:text-indigo-900">View</button>
                  <button v-if="canEdit(app)" @click="openEditProgrammeModal(app.id)" class="text-yellow-600 hover:text-yellow-900">Edit</button>
                  <button v-if="canDelete(app)" @click="confirmDeleteApplication(app.id)" class="text-red-600 hover:text-red-900">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Add/Edit Programme Modal -->
    <div v-if="showProgrammeModal" class="fixed inset-0 z-50 overflow-y-auto bg-gray-600 bg-opacity-75 transition-opacity flex items-center justify-center p-4">
      <div
        class="bg-transparent rounded-xl shadow-xl transform transition-all sm:w-full sm:max-w-3xl"
        role="dialog" aria-modal="true" aria-labelledby="modal-headline"
      >
         <NewProgrammeForm 
            v-if="showProgrammeModal"
            :key="formInstanceKey"
            :application-id="currentApplicationId"
            :is-modal-mode="true"
            @programme-saved="handleProgrammeSaved"
            @draft-saved="handleProgrammeSaved"
            @close-modal="closeProgrammeModal"
            @load-error="handleFormLoadError"
            ref="programmeFormRef"
          />
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity flex items-center justify-center z-[60]">
        <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h3 class="text-lg font-medium text-gray-900">Confirm Deletion</h3>
            <p class="mt-2 text-sm text-gray-500">Are you sure you want to delete this application? This action cannot be undone.</p>
            <div class="mt-4 flex justify-end space-x-3">
                <button @click="showDeleteModal = false" type="button" class="btn btn-outline">Cancel</button>
                <button @click="deleteApplication" type="button" class="btn bg-red-600 text-white hover:bg-red-700 focus:ring-red-500">Delete</button>
            </div>
        </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useToast } from 'vue-toastification'
import apiServices from '@/services/services' // Ensure this path is correct
import { Loader } from 'lucide-vue-next'
import InstituteHeader from '@/components/common/MHPC/InstituteHeader.vue'
import NewProgrammeForm from './NewEducationProgramModal.vue' // This is the modal form component
import {
    PlusIcon,
    ExclamationTriangleIcon,
    DocumentMagnifyingGlassIcon
} from '@heroicons/vue/24/outline'

const toast = useToast()

const applications = ref([])
const isLoading = ref(true)
const apiError = ref(false)
const errorMessage = ref('')

const showProgrammeModal = ref(false)
const currentApplicationId = ref(null) // Used to pass to the modal for ADD (null) or EDIT (id)
const programmeFormRef = ref(null)
const formInstanceKey = ref(0); // To re-render the form component

const showDeleteModal = ref(false);
const applicationToDeleteId = ref(null);

const fetchApplications = async () => {
  isLoading.value = true
  apiError.value = false
  try {
    // MODIFIED: Changed to use getMhpcProgramsOffered
    const response = await apiServices.getMhpcProgramsOffered({ params: { ordering: '-created_at' } })
    applications.value = response.data?.results || response.data || []
    // Ensure field names match what ProgramOfferedSerializer returns
    // e.g., if it's 'program_title' instead of 'course_title', adjust the template <td>{{ app.program_title }}</td>
  } catch (error) {
    console.error('Error fetching applications:', error)
    errorMessage.value = error.response?.data?.message || 'Failed to load applications. Please try again.'
    apiError.value = true
  } finally {
    isLoading.value = false
  }
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const options = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

const getStatusClass = (status) => {
  const s = status?.toLowerCase();
  if (s === 'pending') return 'bg-yellow-100 text-yellow-800';
  if (s === 'approved') return 'bg-green-100 text-green-800';
  if (s === 'rejected') return 'bg-red-100 text-red-800';
  if (s === 'draft') return 'bg-gray-100 text-gray-800';
  return 'bg-blue-100 text-blue-800'; // Default or other statuses
}

const openAddProgrammeModal = async () => {
  currentApplicationId.value = null; // Important for distinguishing Add from Edit
  formInstanceKey.value++; // Force re-render of the modal form component
  showProgrammeModal.value = true;
  await nextTick();
  if (programmeFormRef.value && typeof programmeFormRef.value.initializeForm === 'function') {
    // The modal form should have an initializeForm method to reset/prepare itself
    programmeFormRef.value.initializeForm(); // Call if 'add' mode
  } else {
    console.warn("programmeFormRef or initializeForm not available on NewProgrammeForm for 'add'");
  }
}

const openEditProgrammeModal = async (id) => {
  currentApplicationId.value = id; // Set the ID for edit mode
  formInstanceKey.value++; // Force re-render of the modal form component
  showProgrammeModal.value = true;
  await nextTick();
  // The modal form component should fetch its own data if currentApplicationId is set
  if (programmeFormRef.value && typeof programmeFormRef.value.initializeForm === 'function') {
     // initializeForm should ideally check currentApplicationId and fetch data if it's an edit
    programmeFormRef.value.initializeForm();
  } else {
     console.warn("programmeFormRef or initializeForm not available on NewProgrammeForm for 'edit'");
  }
}

const closeProgrammeModal = () => {
  showProgrammeModal.value = false
  currentApplicationId.value = null // Reset ID on close
}

const handleProgrammeSaved = () => {
  closeProgrammeModal()
  fetchApplications() // Refresh the list
}

const handleFormLoadError = (errorMsg) => {
    toast.error(`Error preparing form: ${errorMsg}. Please try again.`);
    closeProgrammeModal();
}

const viewApplication = (id) => {
  // Typically, "View" might open a read-only display or the edit modal.
  // Here it reuses the edit modal logic.
  openEditProgrammeModal(id);
}

const canEdit = (application) => {
  // Adjust based on your status field from ProgramOffered model
  const status = application.ins_review_decision?.toLowerCase();
  return ['draft', 'pending'].includes(status); // Example editable statuses
}

const canDelete = (application) => {
  // Adjust based on your status field
  return application.ins_review_decision?.toLowerCase() === 'draft'; // Example deletable status
}

const confirmDeleteApplication = (id) => {
    applicationToDeleteId.value = id;
    showDeleteModal.value = true;
}

const deleteApplication = async () => {
    if (!applicationToDeleteId.value) return;

    const deletingToastId = toast.info("Deleting application...", { timeout: false });
    try {
        // MODIFIED: Changed to use deleteMhpcProgramOffered
        await apiServices.deleteMhpcProgramOffered(applicationToDeleteId.value);
        toast.dismiss(deletingToastId);
        toast.success('Application deleted successfully!');
        fetchApplications(); // Refresh the list
    } catch (error) {
        toast.dismiss(deletingToastId);
        console.error('Error deleting application:', error);
        toast.error(error.response?.data?.message || 'Failed to delete application.');
    } finally {
        showDeleteModal.value = false;
        applicationToDeleteId.value = null;
    }
}

onMounted(fetchApplications)
</script>

<style scoped>
.btn {
  @apply inline-flex items-center justify-center rounded-lg border py-2.5 px-5 text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed;
}
.btn-primary {
  @apply border-transparent bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500;
}
.btn-outline {
  @apply border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-indigo-500;
}
th, td {
  vertical-align: middle;
}
.fixed.inset-0 .sm\:max-w-3xl {
    max-height: 90vh; /* Ensure modal is scrollable if content is too long */
}
</style>