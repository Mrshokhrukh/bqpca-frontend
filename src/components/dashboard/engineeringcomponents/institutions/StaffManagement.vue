<!-- src/components/StaffManagement.vue -->
<template>
  <div class="bg-white rounded-lg shadow p-6 md:p-8"> <!-- Container matching EOI form style -->
    <h3 class="text-xl font-semibold text-gray-900 mb-6">Staff Management</h3>

    <!-- Add Button -->
    <div class="mb-6">
        <button @click="handleAdd"
            class="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200">
             <!-- Plus Icon (Heroicons) -->
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 mr-2 -ml-1">
                <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
             </svg>
            Add New Staff
        </button>
    </div>

    <!-- Staff Table -->
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200 border border-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
            <th scope="col" class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-if="staffList.length === 0">
              <td colspan="5" class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center italic">No staff members found.</td>
          </tr>
          <tr v-for="staff in staffList" :key="staff.id" class="hover:bg-gray-50 transition-colors duration-150">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ staff.name }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{{ staff.department }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{{ staff.email }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{{ staff.role }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
              <div class="flex items-center justify-center space-x-2">
                 <!-- Edit Button -->
                 <button @click="handleEdit(staff)" title="Edit Staff"
                    class="inline-flex items-center justify-center rounded border border-transparent bg-yellow-100 p-1.5 text-xs font-medium text-yellow-700 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-colors duration-200">
                    <!-- Pencil Icon (Heroicons) -->
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
                        <path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z" />
                    </svg>
                 </button>
                 <!-- Delete Button -->
                 <button @click="handleDelete(staff.id)" title="Delete Staff"
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
          <label for="staff-name" class="block text-sm font-medium text-gray-700 mb-1 required-label">Name:</label>
          <input type="text" id="staff-name" v-model="formData.name" required
                 class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2" />
        </div>
        <div>
          <label for="staff-department" class="block text-sm font-medium text-gray-700 mb-1 required-label">Department:</label>
          <!-- Using basic text input as before, replace with select if department list is available -->
          <input type="text" id="staff-department" v-model="formData.department" required
                 class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2" />
            <!-- Example Select:
             <select id="staff-department" v-model="formData.department" required class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2">
                <option disabled value="">Please select</option>
                 <-- Populate options here ->
            </select>
            -->
        </div>
        <div>
          <label for="staff-email" class="block text-sm font-medium text-gray-700 mb-1 required-label">Email:</label>
          <input type="email" id="staff-email" v-model="formData.email" required
                 class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-3 py-2" />
        </div>
        <div>
          <label for="staff-role" class="block text-sm font-medium text-gray-700 mb-1 required-label">Role:</label>
          <input type="text" id="staff-role" v-model="formData.role" required
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
               {{ isSubmitting ? 'Saving...' : (currentStaffId ? 'Save Changes' : 'Add Staff') }}
           </button>
        </div>
      </form>
    </SimpleModal>
  </div>
</template>

<script setup>
import { ref, computed,  } from 'vue';
import SimpleModal from './SimpleModal.vue';
import { useToast } from 'vue-toastification'; // Assuming you use vue-toastification like in EOI form

const toast = useToast(); // Initialize toast

// --- MOCK DATA & STATE (Keep your existing data and state refs) ---
const initialStaff = [
  { id: 1, name: 'Dr. Alice Wonderland', department: 'Computer Science', email: 'alice.w@institute.edu', role: 'Professor' },
  { id: 2, name: 'Bob The Builder', department: 'Civil Engineering', email: 'bob.b@institute.edu', role: 'Lab Technician' },
  { id: 3, name: 'Charlie Chaplin', department: 'Administration', email: 'charlie.c@institute.edu', role: 'Admin Assistant' },
];
const getDefaultFormData = () => ({ id: null, name: '', department: '', email: '', role: '' });
const staffList = ref([...initialStaff]);
const isModalOpen = ref(false);
const currentStaffId = ref(null);
const formData = ref(getDefaultFormData());
const isSubmitting = ref(false); // Added for button state

const modalTitle = computed(() => (currentStaffId.value ? 'Edit Staff Member' : 'Add New Staff Member'));

// --- METHODS (Keep your existing methods, potentially add isSubmitting logic and toasts) ---

const handleAdd = () => {
  currentStaffId.value = null;
  formData.value = getDefaultFormData();
  isModalOpen.value = true;
};

const handleEdit = (staff) => {
  currentStaffId.value = staff.id;
  formData.value = { ...staff };
  isModalOpen.value = true;
};

const handleDelete = (staffId) => {
  if (confirm(`Are you sure you want to delete staff member with ID ${staffId}?`)) {
    console.log('Deleting staff ID:', staffId);
    // TODO: API Call
    staffList.value = staffList.value.filter(s => s.id !== staffId);
    toast.success('Staff member deleted successfully.'); // Example toast
  }
};

const handleSave = () => {
  isSubmitting.value = true;
  // Simulate API call delay
  setTimeout(() => {
      try {
        if (currentStaffId.value) {
          // --- Update ---
          console.log('Updating staff:', formData.value);
          const index = staffList.value.findIndex(s => s.id === currentStaffId.value);
          if (index !== -1) {
            staffList.value[index] = { ...formData.value };
          }
           toast.success('Staff member updated successfully.');
        } else {
          // --- Add ---
          const newId = Math.max(0, ...staffList.value.map(s => s.id)) + 1;
          const newStaff = { ...formData.value, id: newId };
          console.log('Adding staff:', newStaff);
          staffList.value.push(newStaff);
          toast.success('Staff member added successfully.');
        }
        closeModal();
      } catch (error) {
           console.error("Error saving staff:", error);
           toast.error("Failed to save staff member.");
      } finally {
          isSubmitting.value = false;
      }
  }, 500); // Simulate 0.5 second delay
};

const closeModal = () => {
  isModalOpen.value = false;
  // Optional: Reset form only after modal fully closed if needed,
  // but usually resetting on handleAdd/handleEdit open is sufficient.
  // formData.value = getDefaultFormData();
  // currentStaffId.value = null;
};

// --- LIFECYCLE ---
// onMounted(() => { /* Fetch data if needed */ });

</script>

<!-- No <style scoped> block needed -->