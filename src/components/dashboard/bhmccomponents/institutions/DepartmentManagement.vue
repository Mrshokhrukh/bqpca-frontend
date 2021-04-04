<template>
  <div class="container mx-auto p-4 sm:p-6 lg:p-8">
      <h1 class="text-2xl font-bold text-gray-800 mb-6">Department Management</h1>

      <!-- Add Department Button -->
      <button
          @click="openAddModal"
          class="mb-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow"
      >
          Add Department
      </button>

      <!-- Loading Indicator for Institutes -->
      <div v-if="isLoadingInstitutes && !showModal" class="text-center text-gray-500 py-4">
          Loading institute data...
      </div>

      <!-- Error Display for fetching institutes -->
      <div v-if="error" class="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {{ error }}
      </div>

      <!-- Success message area -->
      <div v-if="successMessage" class="mt-4 mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          {{ successMessage }}
      </div>

      <!-- Departments Table -->
      <div class="mt-6 overflow-hidden shadow-md rounded-lg">
          <div v-if="isLoadingDepartments" class="text-center text-gray-500 py-4">
              Loading departments...
          </div>
          <div v-else-if="departments.length === 0" class="text-center text-gray-500 py-4">
              No departments found. Add your first department using the button above.
          </div>
          <div v-else class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                      <tr>
                          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department Name</th>
                          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Institution</th>
                          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                      <tr v-for="department in departments" :key="department.id">
                          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ department.id }}</td>
                          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ department.department_name }}</td>
                          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ department.institute?.name_of_institution }}</td>
                          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <button
                                  @click="viewDepartmentDetails(department)"
                                  class="text-blue-600 hover:text-blue-900 mr-2"
                              >
                                  View
                              </button>
                          </td>
                      </tr>
                  </tbody>
              </table>
          </div>
      </div>

      <!-- Add Department Modal -->
      <Transition name="modal-fade">
          <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" @click.self="closeModal">
              <div class="bg-white rounded-lg shadow-xl overflow-hidden w-full max-w-md mx-4">
                  <form @submit.prevent="addDepartment">
                      <!-- Modal Header -->
                      <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                          <h5 class="text-lg font-semibold text-gray-800">Add Department</h5>
                          <button type="button" class="text-gray-400 hover:text-gray-600" @click="closeModal" aria-label="Close">
                              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                          </button>
                      </div>

                      <!-- Modal Body -->
                      <div class="p-6 space-y-4">
                          <!-- Error within modal -->
                          <div v-if="modalError" class="p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
                              {{ modalError }}
                          </div>

                          <div>
                              <label for="departmentName" class="block text-sm font-medium text-gray-700 mb-1">Department Name</label>
                              <input
                                  type="text"
                                  id="departmentName"
                                  v-model="newDepartment.department_name"
                                  required
                                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              />
                          </div>
                          <div>
                              <label for="instituteSelect" class="block text-sm font-medium text-gray-700 mb-1">Name of Institution</label>
                              <select
                                  id="instituteSelect"
                                  v-model="newDepartment.institute_id"
                                  required
                                  class="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md appearance-none"
                              >
                                  <option :value="null" disabled>-- Select Institute --</option>
                                  <option v-for="institute in institutes" :key="institute.id" :value="institute.id">
                                      {{ institute.name_of_institution }}
                                  </option>
                              </select>
                              <div v-if="isLoadingInstitutes" class="text-xs text-gray-500 mt-1">Loading institutes...</div>
                          </div>
                      </div>

                      <!-- Modal Footer -->
                      <div class="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3 bg-gray-50 rounded-b-lg">
                          <button
                              type="button"
                              @click="closeModal"
                              class="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 text-sm font-medium"
                          >
                              Cancel
                          </button>
                          <button
                              type="submit"
                              :disabled="isSaving"
                              class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                              {{ isSaving ? 'Saving...' : 'Save Department' }}
                          </button>
                      </div>
                  </form>
              </div>
          </div>
      </Transition>

      <!-- Department Details Modal -->
      <Transition name="modal-fade">
          <div v-if="showDetailsModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" @click.self="closeDetailsModal">
              <div class="bg-white rounded-lg shadow-xl overflow-hidden w-full max-w-2xl mx-4">
                  <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                      <h5 class="text-lg font-semibold text-gray-800">Department Details</h5>
                      <button type="button" class="text-gray-400 hover:text-gray-600" @click="closeDetailsModal" aria-label="Close">
                          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                      </button>
                  </div>

                  <div class="p-6 space-y-4 max-h-96 overflow-y-auto">
                      <div v-if="selectedDepartment">
                          <div class="mb-4">
                              <h3 class="text-lg font-semibold mb-2">Department Information</h3>
                              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div class="bg-gray-50 p-3 rounded">
                                      <p class="text-sm text-gray-500">ID</p>
                                      <p class="font-medium">{{ selectedDepartment.id }}</p>
                                  </div>
                                  <div class="bg-gray-50 p-3 rounded">
                                      <p class="text-sm text-gray-500">Department Name</p>
                                      <p class="font-medium">{{ selectedDepartment.department_name }}</p>
                                  </div>
                              </div>
                          </div>

                          <div v-if="selectedDepartment.institute" class="mb-4">
                              <h3 class="text-lg font-semibold mb-2">Institution Information</h3>
                              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div class="bg-gray-50 p-3 rounded">
                                      <p class="text-sm text-gray-500">Institution Name</p>
                                      <p class="font-medium">{{ selectedDepartment.institute.name_of_institution }}</p>
                                  </div>
                                  <div class="bg-gray-50 p-3 rounded">
                                      <p class="text-sm text-gray-500">Institution ID</p>
                                      <p class="font-medium">{{ selectedDepartment.institute.id }}</p>
                                  </div>
                                  <div class="bg-gray-50 p-3 rounded">
                                      <p class="text-sm text-gray-500">Head of Institution</p>
                                      <p class="font-medium">{{ selectedDepartment.institute.head_of_institution_name }}</p>
                                  </div>
                                  <div class="bg-gray-50 p-3 rounded">
                                      <p class="text-sm text-gray-500">Contact</p>
                                      <p class="font-medium">{{ selectedDepartment.institute.head_of_institution_phone_number }}</p>
                                  </div>
                                  <div class="bg-gray-50 p-3 rounded">
                                      <p class="text-sm text-gray-500">Email</p>
                                      <p class="font-medium">{{ selectedDepartment.institute.head_of_institution_email }}</p>
                                  </div>
                                  <div class="bg-gray-50 p-3 rounded">
                                      <p class="text-sm text-gray-500">Location</p>
                                      <p class="font-medium">{{ selectedDepartment.institute.address }}</p>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>

                  <div class="px-6 py-4 border-t border-gray-200 flex justify-end bg-gray-50 rounded-b-lg">
                      <button
                          type="button"
                          @click="closeDetailsModal"
                          class="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 text-sm font-medium"
                      >
                          Close
                      </button>
                  </div>
              </div>
          </div>
      </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import services from '@/services/services.js';

// --- Reactive State ---
const institutes = ref([]);
const departments = ref([]);
const showModal = ref(false);
const showDetailsModal = ref(false);
const selectedDepartment = ref(null);
const newDepartment = ref({
  department_name: '',
  institute_id: null,
});
const isLoadingInstitutes = ref(false);
const isLoadingDepartments = ref(false);
const isSaving = ref(false);
const error = ref(null);
const modalError = ref(null);
const successMessage = ref('');

// --- Methods ---

// Fetch institutes for the dropdown
const fetchInstitutes = async () => {
    isLoadingInstitutes.value = true;
    // Reset error specific to institutes if needed, or keep general page error
    // error.value = null;
    try {
        const response = await services.getMhpcInstitutes();
        console.log('Raw response from getMhpcInstitutes:', response); // Verify this log output!

        let instituteList = []; // Initialize

        // === Check for the specific paginated structure: response.data.results ===
        // === !!! Adjust this based on the ACTUAL console log for getMhpcInstitutes !!! ===
        if (response && response.data && Array.isArray(response.data.results)) {
            instituteList = response.data.results; // <--- Assumed path
            console.log("Interpreted: Institute array found in response.data.results.");
        }
        // === Example Fallback: If institutes API returns array directly in data ===
        // else if (response && Array.isArray(response.data)) {
        //    instituteList = response.data;
        //    console.log("Interpreted: Institute array found directly in response.data.");
        // }
        // === Example Fallback: If institutes API returns array directly ===
        // else if (Array.isArray(response)) {
        //     instituteList = response;
        //     console.log("Interpreted: Institute response is the array itself.");
        // }
         else {
            // If the expected structure isn't found
             console.warn("Could not find institute array in the expected location:", response);
             // Set error only if institutes are crucial and failed to load
             if (!error.value) { // Avoid overwriting a more severe error from departments fetch
                error.value = "Unexpected data format for institutes. Dropdown may be empty.";
             }
             // instituteList remains []
        }

        // Assign the processed list (filtering nulls is safe practice)
        institutes.value = (instituteList || []).filter(inst => inst != null);

        if (institutes.value.length === 0 && !error.value) {
            if (response?.data?.count > 0 && instituteList.length === 0) {
               console.warn("API reported institutes (count > 0), but the 'results' array was empty or contained only nulls.");
            } else {
               console.log("No institutes found or loaded for the dropdown.");
            }
        }
    } catch (err) {
        console.error("Error fetching institutes:", err);
        // Set a general error if institutes failed, as they are needed for adding departments
        error.value = "Failed to load institute data. Cannot add new departments.";
        institutes.value = []; // Ensure empty array on error
    } finally {
        isLoadingInstitutes.value = false;
    }
};

// Fetch departments
const fetchDepartments = async () => {
    isLoadingDepartments.value = true;
    error.value = null;
    try {
        const response = await services.getMhpcInstituteDepartments();
        // Log the raw response structure for verification during debugging
        console.log('Raw response from getMhpcInstituteDepartments:', response);

        let departmentList = []; // Initialize with an empty array

        // === Check for the specific paginated structure: response.data.results ===
        if (response && response.data && Array.isArray(response.data.results)) {
            departmentList = response.data.results; // <--- Correct path to the array
            console.log("Interpreted: Department array found in response.data.results.");
        } else {
            // If the expected structure isn't found
             console.warn("Could not find department array in the expected location (response.data.results):", response);
             error.value = "Unexpected data format received for departments. Expected an array within 'data.results'.";
             // departmentList remains []
        }

        // Filter out any null/undefined entries *within* the array
        // This handles cases like [ {dept1}, null, {dept3} ] if the API ever sends them
        departments.value = (departmentList || []).filter(dept => dept != null);

        // Log if empty, considering pagination info
        if (departments.value.length === 0 && !error.value) {
             if (response?.data?.count > 0 && departmentList.length === 0) {
                console.warn("API reported items (count > 0), but the 'results' array was empty or contained only nulls.");
             } else {
                console.log("No departments found or loaded."); // Normal empty state if count is 0 or API structure was wrong
             }
        }

        // Optional: Warn if filtering removed items
        if (departmentList && departments.value.length < departmentList.length) {
            console.warn("Filtered out null/undefined entries from the departments list.");
        }

    } catch (err) {
        console.error("Error fetching departments:", err);
         let errorMessage = "Failed to load departments.";
         if (err.response) {
             errorMessage += ` Server status: ${err.response.status}.`;
             // Attempt to extract a more specific error message from DRF/backend
             const detail = err.response.data?.detail || err.response.data?.message || (typeof err.response.data === 'string' ? err.response.data : null);
             if (detail) {
                errorMessage += ` Message: ${detail}`;
             } else if (typeof err.response.data === 'object' && err.response.data !== null) {
                // Handle potential validation errors (show first one)
                 const firstErrorKey = Object.keys(err.response.data)[0];
                 if (firstErrorKey && Array.isArray(err.response.data[firstErrorKey])) {
                     errorMessage += ` Error: ${firstErrorKey} - ${err.response.data[firstErrorKey][0]}`;
                 }
             }
         } else if (err.request) {
             errorMessage += " No response from server.";
         } else {
             errorMessage += ` Error: ${err.message}`;
         }
         error.value = errorMessage;
        departments.value = []; // Ensure it's an empty array on error
    } finally {
        isLoadingDepartments.value = false;
    }
};

// Reset the new department form
const resetNewDepartmentForm = () => {
  newDepartment.value = {
      department_name: '',
      institute_id: null,
  };
  modalError.value = null;
};

// Open the modal to add a new department
const openAddModal = () => {
  resetNewDepartmentForm();
  successMessage.value = '';
  showModal.value = true;
};

// Close the modal
const closeModal = () => {
  showModal.value = false;
};

// View department details
const viewDepartmentDetails = (department) => {
  selectedDepartment.value = department;
  showDetailsModal.value = true;
};

// Close details modal
const closeDetailsModal = () => {
  showDetailsModal.value = false;
  selectedDepartment.value = null;
};

// Add the new department
const addDepartment = async () => {
  isSaving.value = true;
  modalError.value = null;
  successMessage.value = '';

  const payload = {
      department_name: newDepartment.value.department_name?.trim(),
      institute_id: newDepartment.value.institute_id,
  };

  // Basic validation
  if (!payload.department_name || payload.institute_id === null) {
      modalError.value = "Please fill in all fields.";
      isSaving.value = false;
      return;
  }

  try {
      const response = await services.createMhpcInstituteDepartment(payload);
      console.log("Department added successfully:", response.data);
      successMessage.value = `Department "${payload.department_name}" added successfully!`;
      closeModal();

      // Refresh departments list after adding
      await fetchDepartments();
  } catch (err) {
      console.error("Error adding department:", err);
      modalError.value = err.response?.data?.message || err.message || "Failed to add department. Please check the details and try again.";
  } finally {
      isSaving.value = false;
  }
};

// --- Lifecycle Hooks ---
onMounted(async () => {
  await Promise.all([fetchInstitutes(), fetchDepartments()]);
});
</script>

<style scoped>
/* Modal Fade Transition */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
