<template>
  <div class="container mx-auto p-4 md:p-8">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-800">Education Programs</h1>
      <button
        @click="openAddProgramModal"
        class="px-6 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-md"
        :disabled="isLoadingCurrentUserInstitute || !currentUserInstitute?.id"
      >
        <span class="mr-2">+</span> Add New Program
      </button>
      <p v-if="!currentUserInstitute?.id && !isLoadingCurrentUserInstitute" class="text-sm text-red-500 ml-4">
        Cannot add programs: User's institute information is unavailable.
      </p>
    </div>

    <div v-if="isLoadingCurrentUserInstitute" class="text-center text-gray-500 py-10">
      <p class="text-xl">Loading user institute information...</p>
    </div>
    <div v-else-if="isLoading" class="text-center text-gray-500 py-10">
      <p class="text-xl">Loading programs...</p>
    </div>
    <div v-else-if="educationPrograms.length === 0" class="text-center text-gray-500 py-10">
      <p class="text-xl">No education programs added yet for {{ currentUserInstitute?.name || 'your institute' }}.</p>
      <p class="mt-2" v-if="currentUserInstitute?.id">Click "Add New Program" to get started.</p>
    </div>

    <div v-else class="overflow-x-auto bg-white shadow-lg rounded-lg">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-100">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
              Program Name
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
              Institute
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
              Semesters
            </th>
             <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
              Total Modules
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <template v-for="program in educationPrograms" :key="program.id">
            <tr @click="toggleExpand(program.id)" class="hover:bg-gray-50 cursor-pointer">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ program.program_master_details?.name || program.program_master?.name || 'N/A' }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <!-- Display name from fetched currentUserInstitute or from program data if available -->
                <div class="text-sm text-gray-700">{{ program.institute_details?.name || currentUserInstitute?.name || 'N/A' }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                {{ program.number_of_semesters }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                {{ getTotalModules(program) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusClass(program.status)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
                  {{ program.status || 'N/A' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button @click.stop="viewDetails(program)" class="text-indigo-600 hover:text-indigo-900 mr-2">View</button>
                <button @click.stop="editProgram(program)" class="text-yellow-600 hover:text-yellow-900 mr-2 disabled:opacity-50" disabled>Edit</button>
                <button @click.stop="deleteProgram(program.id)" class="text-red-600 hover:text-red-900">Delete</button>
              </td>
            </tr>
            <tr v-if="expandedRows.includes(program.id)">
              <td colspan="6" class="p-0">
                <div class="p-4 bg-gray-50 border-t border-l-4 border-l-indigo-500">
                  <h4 class="text-md font-semibold text-gray-800 mb-2">Program Details: {{ program.program_master_details?.name || 'N/A' }}</h4>
                  <div v-for="semester in (program.semesters_details || program.semesters || [])" :key="semester.id || semester.semester_number" class="mb-3 pl-2">
                    <p class="font-medium text-gray-700">Semester {{ semester.semester_number }}:</p>
                    <ul class="list-disc list-inside ml-4 text-sm text-gray-600 space-y-1">
                      <li v-for="(assignment, index) in (semester.module_assignments || semester.faculty_assignments || [])" :key="assignment.id || index">
                        {{ assignment.module_details?.module_master?.module_name || assignment.module?.module_master?.module_name || 'N/A' }}
                        - Faculty: {{ assignment.teaching_faculty_details?.faculty_name || assignment.teaching_faculty?.faculty_name || 'N/A' }}
                        (Students: {{ assignment.number_of_students }})
                      </li>
                      <li v-if="!(semester.module_assignments || semester.faculty_assignments || []).length">No modules assigned to this semester.</li>
                    </ul>
                  </div>
                   <div v-if="!(program.semesters_details || program.semesters || []).length">No semester details available.</div>
                </div>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <NewEducationProgramModal
      :is-open="isModalOpen"
      :current-user-institute-id="currentUserInstitute?.id"
      :current-institute-name="currentUserInstitute?.name"
      @close="closeAddProgramModal"
      @program-added="handleProgramAdded"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import NewEducationProgramModal from './NewEducationProgramModal.vue';
import apiServices from '@/services/services';

const isModalOpen = ref(false);
const isLoading = ref(false);
const isLoadingCurrentUserInstitute = ref(false);
const educationPrograms = ref([]);
const expandedRows = ref([]);

const currentUserInstitute = ref(null); // To store { id: ..., name: ... }

// Simulate fetching logged-in user's institute info
// In a real app, this would come from an auth store or a profile API call
const fetchCurrentUserInstitute = async () => {
    isLoadingCurrentUserInstitute.value = true;
    try {
        // OPTION 1: If you have a dedicated endpoint like /api/auth/me/ or /api/user-profile/
        // const response = await apiClient.get('/auth/me/'); // Replace with your actual endpoint
        // currentUserInstitute.value = response.data.institute; // Assuming response has { ..., institute: {id: 1, name: 'My Uni'} }

        // OPTION 2: Simulate or hardcode for now if no direct endpoint for user's institute
        // This is a placeholder. Replace with actual logic.
        // For example, if all institutes are in getMhpcInstitutes and you know which one the user belongs to.
        // Or, if the institute ID is stored in localStorage after login.
        const institutesResponse = await apiServices.getMhpcInstitutes();
        const allInstitutes = institutesResponse.data.results || institutesResponse.data;
        if (allInstitutes && allInstitutes.length > 0) {
            // For DEMO: picking the first institute as the "current user's institute"
            // REPLACE THIS with actual logic to identify the current user's institute
            currentUserInstitute.value = allInstitutes.find(inst => inst.id === 1); // Example: user belongs to institute with ID 1
            if (!currentUserInstitute.value && allInstitutes.length > 0) {
                 currentUserInstitute.value = allInstitutes[0]; // Fallback to first if ID 1 not found
                 console.warn("Using fallback institute. Implement proper current user institute fetching.");
            }
        }
        if (!currentUserInstitute.value) {
            console.error("Could not determine current user's institute.");
            // alert("Error: Could not determine your institute. Please contact support.");
        }

    } catch (error) {
        console.error("Error fetching current user's institute:", error);
        // alert("Failed to load your institute information.");
    } finally {
        isLoadingCurrentUserInstitute.value = false;
    }
};


const openAddProgramModal = () => {
  if (!currentUserInstitute.value?.id) {
    alert("Cannot add program: Your institute information is not available. Please try refreshing or contact support.");
    return;
  }
  isModalOpen.value = true;
};

const closeAddProgramModal = () => {
  isModalOpen.value = false;
};

const handleProgramAdded = () => {
  fetchEducationPrograms(); // Re-fetch list
};

const fetchEducationPrograms = async () => {
  // Only fetch if currentUserInstitute.id is available, as programs are likely filtered by institute
  if (!currentUserInstitute.value?.id && !isLoadingCurrentUserInstitute.value) {
    // Wait for institute info to load or if it failed, don't attempt to load programs
    educationPrograms.value = []; // Clear programs if no institute
    return;
  }
  // If still loading institute info, wait for it
  if (isLoadingCurrentUserInstitute.value) {
    // Could use a watcher or re-call after institute info is fetched
    return;
  }

  isLoading.value = true;
  try {
    // Adjust API call if it needs to be filtered by institute_id on the frontend,
    // though backend should ideally handle this based on authenticated user.
    // For now, assuming getMhpcProgramsOffered() returns programs for the logged-in user's institute.
    const response = await apiServices.getMhpcProgramsOffered({ institute: currentUserInstitute.value?.id }); // Example: if API supports institute filter
    educationPrograms.value = response.data.results || response.data;
  } catch (error) {
    console.error('Error fetching education programs:', error);
    alert('Failed to load education programs.');
    educationPrograms.value = [];
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  await fetchCurrentUserInstitute(); // Fetch institute info first
  if (currentUserInstitute.value?.id) { // Then fetch programs if institute info is available
    fetchEducationPrograms();
  }
});

// Watch for currentUserInstitute to change (e.g., after async fetch) and then load programs
watch(currentUserInstitute, (newInstitute) => {
    if (newInstitute?.id && educationPrograms.value.length === 0 && !isLoading.value) {
        fetchEducationPrograms();
    }
}, { immediate: false }); // immediate:false because onMounted handles initial load

const getStatusClass = (status) => { /* ... (same as before) ... */
  if (!status) return 'bg-gray-100 text-gray-800';
  status = status.toLowerCase();
  if (status.includes('active')) return 'bg-green-100 text-green-800';
  if (status.includes('pending')) return 'bg-yellow-100 text-yellow-800';
  if (status.includes('inactive') || status.includes('rejected')) return 'bg-red-100 text-red-800';
  return 'bg-gray-100 text-gray-800';
};
const getTotalModules = (program) => { /* ... (same as before, but check paths) ... */
  if (!program || !(program.semesters_details || program.semesters)) return 0;
  const semestersArray = program.semesters_details || program.semesters;
  return semestersArray.reduce((total, semester) => {
    const assignmentsArray = semester.module_assignments || semester.faculty_assignments || [];
    return total + assignmentsArray.length;
  }, 0);
};
const toggleExpand = (programId) => { /* ... (same as before) ... */
  const index = expandedRows.value.indexOf(programId);
  if (index > -1) {
    expandedRows.value.splice(index, 1);
  } else {
    expandedRows.value.push(programId);
  }
};
const viewDetails = (program) => { /* ... (same as before, check paths in console) ... */
  console.log("Program Details:", program);
  if (!expandedRows.value.includes(program.id)) {
    expandedRows.value.push(program.id);
  }
};
const editProgram = () => {
  // TODO: Implement edit functionality
  console.log('Edit functionality not implemented yet');
};
const deleteProgram = async (programId) => { /* ... (same as before) ... */
  if (confirm('Are you sure you want to delete this program? This action cannot be undone.')) {
    try {
      await apiServices.deleteMhpcProgramOffered(programId);
      alert('Program deleted successfully.');
      fetchEducationPrograms();
      const index = expandedRows.value.indexOf(programId);
      if (index > -1) expandedRows.value.splice(index, 1);
    } catch (error) {
      console.error('Error deleting program:', error);
      alert('Failed to delete program.');
    }
  }
};
</script>

<style scoped>
.container { max-width: 1200px; }
</style>