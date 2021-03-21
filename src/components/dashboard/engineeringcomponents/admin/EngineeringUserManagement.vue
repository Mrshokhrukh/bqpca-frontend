<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 lg:p-8">
    <div class="max-w-[1600px] mx-auto">
      <h1 class="text-3xl font-bold text-slate-900 mb-6 font-serif">Engineering User Management</h1>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Left Column - Add/Edit User Form -->
        <div class="bg-white rounded-lg shadow-sm border border-slate-200 p-6 h-fit lg:col-span-1 sticky top-8">
          <h2 class="text-xl font-semibold text-slate-900 mb-4">
            {{ isEditing ? 'Edit User' : 'Add New User' }}
          </h2>
          <form @submit.prevent="handleSubmit">
            <div class="space-y-4">
              <div>
                <label for="username" class="block text-sm font-medium text-slate-700">Username</label>
                <input type="text" id="username" v-model="formData.username"
                  class="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter username" required />
              </div>
              <div>
                <label for="email" class="block text-sm font-medium text-slate-700">Email</label>
                <input type="email" id="email" v-model="formData.email"
                  class="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter email" required />
              </div>
              <div>
                <label for="fullName" class="block text-sm font-medium text-slate-700">Full Name</label>
                <input type="text" id="fullName" v-model="formData.full_name"
                  class="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter full name" required />
              </div>
              <div>
                <label for="role" class="block text-sm font-medium text-slate-700">Role</label>
                <select id="role" v-model="formData.role"
                  class="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="">Select Role</option>
                  <option value="admin">Admin</option>
                  <option value="engineer">Engineer</option>
                  <option value="reviewer">Reviewer</option>
                  <option value="client">Client</option>
                </select>
              </div>
              <div v-if="!isEditing">
                <label for="password" class="block text-sm font-medium text-slate-700">Password</label>
                <input type="password" id="password" v-model="formData.password"
                  class="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter password" required />
              </div>
              <div>
                <label for="status" class="block text-sm font-medium text-slate-700">Status</label>
                <select id="status" v-model="formData.is_active"
                  class="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option :value="true">Active</option>
                  <option :value="false">Inactive</option>
                </select>
              </div>

              <div class="flex gap-3">
                <button type="submit"
                  class="flex-1 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  {{ isEditing ? 'Update User' : 'Add User' }}
                </button>
                <button v-if="isEditing" type="button" @click="cancelEdit"
                  class="py-2 px-4 bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200">
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>

        <!-- Right Column - Users Table -->
        <div class="bg-white rounded-lg shadow-sm border border-slate-200 p-6 lg:col-span-2">
          <div class="mb-6 space-y-4">
            <div class="flex justify-between items-center">
              <h2 class="text-xl font-semibold text-slate-900">Users List</h2>
              <span class="text-sm text-slate-500">
                {{ filteredUsers.length }} User{{ filteredUsers.length !== 1 ? 's' : '' }}
              </span>
            </div>

            <!-- Search Bar -->
            <div class="relative">
              <input type="text" v-model="searchQuery" placeholder="Search users..."
                class="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              <svg class="absolute left-3 top-2.5 h-5 w-5 text-slate-400" fill="none" stroke="currentColor"
                viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <!-- Users Table -->
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-slate-200">
              <thead class="bg-slate-50">
                <tr>
                  <th scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Username
                  </th>
                  <th scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Full Name
                  </th>
                  <th scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" class="relative px-6 py-3">
                    <span class="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-slate-200">
                <tr v-for="user in paginatedUsers" :key="user.id"
                  class="hover:bg-blue-50/30 transition-colors duration-200">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    {{ user.username }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    {{ user.email }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    {{ user.full_name }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    <span
                      class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {{ user.role }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                    <span
                      :class="`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`">
                      {{ user.is_active ? 'Active' : 'Inactive' }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div class="flex justify-end">
                      <button @click="startEdit(user)" class="p-2 text-blue-600 hover:bg-blue-50 rounded-md mr-2">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button @click="openDeleteModal(user)" class="p-2 text-red-600 hover:bg-red-50 rounded-md">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="filteredUsers.length === 0">
                  <td colspan="6" class="px-6 py-4 text-center text-slate-500">
                    No users found
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div v-if="totalPages > 1" class="flex justify-center gap-2 mt-6">
            <button @click="currentPage--" :disabled="currentPage === 1"
              class="px-3 py-1 rounded border border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50">
              Previous
            </button>
            <span class="px-3 py-1 text-sm text-slate-600">
              Page {{ currentPage }} of {{ totalPages }}
            </span>
            <button @click="currentPage++" :disabled="currentPage === totalPages"
              class="px-3 py-1 rounded border border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50">
              Next
            </button>
          </div>
        </div>
      </div>

      <!-- Delete Confirmation Modal -->
      <AlertDialogRoot :open="isDeleteModalOpen" @update:open="isDeleteModalOpen = $event">
        <AlertDialogContent
          class="fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-lg bg-white p-6 shadow-lg focus:outline-none z-50">
          <AlertDialogTitle class="text-xl font-semibold text-slate-900 mb-2">
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription class="text-slate-600 mb-6">
            This action cannot be undone. This will permanently delete the user
            "{{ userToDelete?.username }}".
          </AlertDialogDescription>
          <div class="flex justify-end gap-4">
            <AlertDialogCancel class="px-4 py-2 rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200"
              @click="cancelDelete">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction class="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
              @click="confirmDelete">
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
        <AlertDialogOverlay class="fixed inset-0 bg-black/50 z-40" />
      </AlertDialogRoot>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import epcServices from '@/services/epcServices';
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogOverlay,
  AlertDialogRoot,
  AlertDialogTitle,
} from 'radix-vue';

// State
const users = ref([]);
const formData = ref({
  id: null,
  username: '',
  email: '',
  full_name: '',
  role: '',
  password: '',
  is_active: true
});
const isEditing = ref(false);
const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = 10;

const isDeleteModalOpen = ref(false);
const userToDelete = ref(null);

// Fetch users on component mount
onMounted(async () => {
  try {
    // Replace with the actual method to get users from epcServices when available
    const response = await epcServices.getEpcInstituteStaff();
    if (Array.isArray(response.data.results)) {
      users.value = response.data.results;
    } else {
      console.error('API did not return an array of results.');
      users.value = []; // Initialize to an empty array to prevent further errors
    }
  } catch (error) {
    console.error('Error fetching users:', error);
    users.value = []; // Initialize to an empty array in case of error
  }
});

// Computed
const filteredUsers = computed(() => {
  return users.value.filter(user => {
    const query = searchQuery.value.toLowerCase();
    return user.username.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.full_name.toLowerCase().includes(query) ||
      user.role.toLowerCase().includes(query);
  });
});

const totalPages = computed(() => {
  return Math.ceil(filteredUsers.value.length / itemsPerPage);
});

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredUsers.value.slice(start, end);
});

// Methods
const handleSubmit = async () => {
  try {
    if (isEditing.value) {
      // Replace with the actual method to update users from epcServices when available
      const response = await epcServices.updateEpcInstituteStaffMember(formData.value.id, formData.value);
      const index = users.value.findIndex(user => user.id === formData.value.id);
      if (index !== -1) {
        users.value[index] = response.data;
      }
    } else {
      // Replace with the actual method to create users from epcServices when available
      const response = await epcServices.createEpcInstituteStaff(formData.value);
      users.value.push(response.data);
    }
    resetForm();
  } catch (error) {
    console.error('Error saving user:', error);
  }
};

const startEdit = (user) => {
  formData.value = {
    ...user,
    password: '' // Clear password field when editing
  };
  isEditing.value = true;
};

const cancelEdit = () => {
  resetForm();
};

const openDeleteModal = (user) => {
  userToDelete.value = user;
  isDeleteModalOpen.value = true;
};

const cancelDelete = () => {
  isDeleteModalOpen.value = false;
  userToDelete.value = null;
};

const confirmDelete = async () => {
  if (!userToDelete.value) return;

  try {
    // Replace with the actual method to delete users from epcServices when available
    await epcServices.deleteEpcInstituteStaffMember(userToDelete.value.id);
    const index = users.value.findIndex(user => user.id === userToDelete.value.id);
    if (index !== -1) {
      users.value.splice(index, 1);
    }
    isDeleteModalOpen.value = false;
    userToDelete.value = null;
  } catch (error) {
    console.error('Error deleting user:', error);
  }
};

const resetForm = () => {
  formData.value = {
    id: null,
    username: '',
    email: '',
    full_name: '',
    role: '',
    password: '',
    is_active: true
  };
  isEditing.value = false;
};

// Watch for search query changes to reset pagination
watch(searchQuery, () => {
  currentPage.value = 1;
});
</script>

<style scoped>
/* Add any custom styles here */
</style>