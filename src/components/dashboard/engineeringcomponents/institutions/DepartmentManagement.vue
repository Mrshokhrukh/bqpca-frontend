<!-- src/components/DepartmentManagement.vue -->
<template>
  <div class="bg-white rounded-lg shadow p-6 md:p-8"> <!-- Container matching EOI form style -->
    <h3 class="text-xl font-semibold text-gray-900 mb-6">Department Management</h3>

    <!-- Add Button -->
    <div class="mb-6">
      <button @click="handleAdd"
        class="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200">
         <!-- Plus Icon (Heroicons) -->
         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 mr-2 -ml-1">
            <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
         </svg>
        Add New Department
      </button>
    </div>

    <!-- Department Table -->
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200 border border-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Head of Department</th>
            <th scope="col" class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-if="departmentList.length === 0">
              <td colspan="4" class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center italic">No departments found.</td>
          </tr>
          <tr v-for="dept in departmentList" :key="dept.id" class="hover:bg-gray-50 transition-colors duration-150">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ dept.code }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{{ dept.name }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{{ dept.head }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
              <div class="flex items-center justify-center space-x-2">
                 <!-- Edit Button -->
                 <button @click="handleEdit(dept)" title="Edit Department"
                    class="inline-flex items-center justify-center rounded border border-transparent bg-yellow-100 p-1.5 text-xs font-medium text-yellow-700 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-colors duration-200">
                    <!-- Pencil Icon (Heroicons) -->
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
                        <path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z" />
                    </svg>
                 </button>
                 <!-- Delete Button -->
                 <button @click="handleDelete(dept.id)" title="Delete Department"
                    class="inline-flex items-center justify-center rounded border border-transparent bg-red-100 p-1.5 text-xs font-medium text-red-700 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200">
                     <!-- Trash Icon (Heroicons) -->
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
                        <path fill-rule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.58.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193v-.443A2.75 2.75 0 0011.25 1H8.75zM10 4.5a.75.75 0 01.75.75v8.5a.75.75 0 01-1.5 0v-8.5A.75.75 0 0110 4.5z" clip-rule="evenodd" />
                    </svg>
                 </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Add/Edit Modal -->
    <SimpleModal :is-open="isModalOpen" :title="modalTitle" @close="closeModal">
       <form @submit.prevent="handleSave" class="space-y-4">
        <div>
          <label for="dept-code" class="block text-sm font-medium text-gray-700 mb-1 required-label">Department Code:</label>
          <input type="text" id="dept-code" v-model="formData.code" required :disabled="!!currentDeptId"
                 class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2 disabled:bg-gray-100 disabled:cursor-not-allowed" />
           <p v-if="currentDeptId" class="mt-1 text-xs text-gray-500">Department code cannot be changed after creation.</p>
        </div>
        <div>
          <label for="dept-name" class="block text-sm font-medium text-gray-700 mb-1 required-label">Department Name:</label>
          <input type="text" id="dept-name" v-model="formData.name" required
                 class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2" />
        </div>
        <div>
          <label for="dept-head" class="block text-sm font-medium text-gray-700 mb-1 required-label">Head of Department:</label>
          <!-- TODO: Consider dropdown populated from Staff list -->
          <input type="text" id="dept-head" v-model="formData.head" required
                 class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2" />
        </div>

        <!-- Modal Actions -->
        <div class="flex justify-end gap-3 pt-4 border-t border-gray-200 mt-6">
           <button type="button" @click="closeModal"
               class="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200">
               Cancel
           </button>
           <button type="submit" :disabled="isSubmitting"
               class="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50">
               {{ isSubmitting ? 'Saving...' : (currentDeptId ? 'Save Changes' : 'Add Department') }}
           </button>
        </div>
      </form>
    </SimpleModal>
  </div>
</template>

<script setup>
import { ref, computed,  } from 'vue';
import SimpleModal from './SimpleModal.vue';
import { useToast } from 'vue-toastification';

const toast = useToast();

// --- MOCK DATA & STATE ---
const initialDepartments = [
  { id: 1, code: 'CSE', name: 'Computer Science', head: 'Dr. Alan Turing' },
  { id: 2, code: 'MECH', name: 'Mechanical Engineering', head: 'Dr. James Watt' },
  { id: 3, code: 'EEE', name: 'Electrical Engineering', head: 'Dr. Nikola Tesla' },
  { id: 4, code: 'ADMIN', name: 'Administration', head: 'Ms. Ada Lovelace' },
];
const getDefaultFormData = () => ({ id: null, code: '', name: '', head: '' });
const departmentList = ref([...initialDepartments]);
const isModalOpen = ref(false);
const currentDeptId = ref(null); // Store numeric ID for editing
const formData = ref(getDefaultFormData());
const isSubmitting = ref(false);

// --- COMPUTED ---
const modalTitle = computed(() => (currentDeptId.value ? 'Edit Department' : 'Add New Department'));

// --- METHODS ---
const handleAdd = () => {
  currentDeptId.value = null;
  formData.value = getDefaultFormData();
  isModalOpen.value = true;
};

const handleEdit = (dept) => {
  currentDeptId.value = dept.id;
  formData.value = { ...dept };
  isModalOpen.value = true;
};

const handleDelete = (deptId) => {
  if (confirm(`Are you sure you want to delete department with ID ${deptId}? \nConsider implications for staff/courses.`)) {
    // TODO: API Call + handle implications (or prevent deletion if linked): DELETE /api/departments/{deptId}
    console.log('Deleting department ID:', deptId);
    departmentList.value = departmentList.value.filter(d => d.id !== deptId);
    toast.success(`Department deleted successfully.`);
  }
};

const handleSave = () => {
  isSubmitting.value = true;

   // Basic validation example
  if (!formData.value.code || !formData.value.name || !formData.value.head) {
      toast.error("Please fill in all required fields.");
      isSubmitting.value = false;
      return;
  }

  // Simulate API Call
  setTimeout(() => {
    try {
        if (currentDeptId.value) {
          // --- Update ---
          // TODO: API Call: PUT /api/departments/{currentDeptId.value} with formData.value
          console.log('Updating department:', formData.value);
          const index = departmentList.value.findIndex(d => d.id === currentDeptId.value);
          if (index !== -1) {
            // Use spread to maintain reactivity, ensure ID is correct
            departmentList.value[index] = { ...formData.value, id: currentDeptId.value };
          }
           toast.success(`Department ${formData.value.code} updated successfully.`);
        } else {
          // --- Add ---
          // Check if Code already exists
          if (departmentList.value.some(d => d.code.toUpperCase() === formData.value.code.toUpperCase())) {
              toast.error(`Department code ${formData.value.code} already exists!`);
              isSubmitting.value = false;
              return;
          }
          // TODO: API Call: POST /api/departments with formData.value
          // Get ID from backend response
          const newId = Math.max(0, ...departmentList.value.map(d => d.id)) + 1; // Mock ID
          const newDept = { ...formData.value, id: newId };
          console.log('Adding department:', newDept);
          departmentList.value.push(newDept);
           toast.success(`Department ${newDept.code} added successfully.`);
        }
        closeModal();
    } catch (error) {
         console.error("Error saving department:", error);
         toast.error("Failed to save department.");
    } finally {
        isSubmitting.value = false;
    }
  }, 500); // Simulate delay
};

const closeModal = () => {
  isModalOpen.value = false;
};

// --- LIFECYCLE ---
// onMounted(() => { /* Fetch departments if needed */ });

</script>

<!-- No <style scoped> block needed -->