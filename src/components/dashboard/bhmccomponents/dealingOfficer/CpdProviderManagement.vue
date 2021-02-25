<template>
  <div class="bg-gray-50 min-h-screen">
    <div class="container mx-auto px-4 py-8">
      <!-- Header -->
      <div class="text-center mb-8">
        <h2 class="text-3xl font-extrabold text-gray-900 mb-4">Manage CPD Providers</h2>
        <p class="text-gray-600 text-lg">Add and manage CPD providers</p>
      </div>

      <!-- Add Provider Button -->
      <div class="flex justify-end mb-4">
        <button @click="openAddProviderModal"
          class="bg-blue-600 text-white rounded-md py-3 px-6 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
          Add Provider
        </button>
      </div>

      <!-- Providers Table Card -->
      <div class="bg-white rounded-2xl shadow-xl p-8">
        <h3 class="text-2xl font-semibold text-gray-800 mb-4">CPD Providers List</h3>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Provider Name
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact Number
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gender
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  CPD Activity Title
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Venue
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(provider, index) in providers" :key="index" class="hover:bg-gray-100 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ `${provider.first_name} ${provider.last_name}` }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ provider.email }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ provider.contact_number }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ provider.gender }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ provider.cpdActivityTitle }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ provider.venue }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex space-x-2">
                    <button @click="openEditProviderModal(index)"
                      class="text-blue-600 hover:text-blue-800 transition-colors">Edit</button>
                    <button @click="deleteProvider(index)"
                      class="text-red-600 hover:text-red-800 transition-colors">Delete</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Add Provider Modal -->
      <div v-if="isAddProviderModalOpen" class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title"
        role="dialog" aria-modal="true">
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

          <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

          <div
            class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6">
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">Add New CPD Provider</h3>
                <div class="mt-2">
                  <form @submit.prevent="submitProvider" class="space-y-6">
                    <!-- Basic Information -->
                    <div class="grid grid-cols-3 gap-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-700">First Name</label>
                        <input type="text" v-model="formData.first_name" required
                          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" />
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700">Middle Name</label>
                        <input type="text" v-model="formData.middle_name"
                          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" />
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700">Last Name</label>
                        <input type="text" v-model="formData.last_name" required
                          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" />
                      </div>
                    </div>

                    <!-- Gender Selection -->
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                      <div class="flex space-x-4">
                        <label class="inline-flex items-center">
                          <input type="radio" v-model="formData.gender" value="male"
                            class="form-radio h-4 w-4 text-primary focus:ring-primary border-gray-300" />
                          <span class="ml-2 text-gray-700">Male</span>
                        </label>
                        <label class="inline-flex items-center">
                          <input type="radio" v-model="formData.gender" value="female"
                            class="form-radio h-4 w-4 text-primary focus:ring-primary border-gray-300" />
                          <span class="ml-2 text-gray-700">Female</span>
                        </label>
                        <label class="inline-flex items-center">
                          <input type="radio" v-model="formData.gender" value="other"
                            class="form-radio h-4 w-4 text-primary focus:ring-primary border-gray-300" />
                          <span class="ml-2 text-gray-700">Other</span>
                        </label>
                      </div>
                    </div>

                    <!-- Contact Information -->
                    <div class="grid grid-cols-2 gap-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-700">Date of Birth</label>
                        <input type="date" v-model="formData.date_of_birth" required
                          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" />
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700">Contact Number</label>
                        <input type="tel" v-model="formData.contact_number" required
                          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" />
                      </div>
                    </div>

                    <!-- Email and Password -->
                    <div class="grid grid-cols-2 gap-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" v-model="formData.email" required
                          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" />
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700">Password</label>
                        <input type="password" v-model="formData.password" required
                          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" />
                      </div>
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700">Confirm Password</label>
                      <input type="password" v-model="formData.confirm_password" required
                        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" />
                    </div>

                    <!-- Provider Details -->
                    <div>
                      <label class="block text-sm font-medium text-gray-700">CPD Activity Title</label>
                      <input type="text" v-model="formData.cpdActivityTitle" required
                        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" />
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700">Venue</label>
                      <input type="text" v-model="formData.venue" required
                        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" />
                    </div>

                    <div class="flex justify-end space-x-3">
                      <button type="button" @click="closeAddProviderModal"
                        class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        Cancel
                      </button>
                      <button type="submit"
                        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        Add Provider
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Edit Provider Modal -->
      <div v-if="isEditProviderModalOpen" class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title"
        role="dialog" aria-modal="true">
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

          <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

          <div
            class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6">
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:mt-0 sm:text-left w-full">
                <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">Edit CPD Provider</h3>
                <div class="mt-2">
                  <form @submit.prevent="updateProvider" class="space-y-6">
                    <!-- Basic Information -->
                    <div class="grid grid-cols-3 gap-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-700">First Name</label>
                        <input type="text" v-model="editFormData.first_name" required
                          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" />
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700">Middle Name</label>
                        <input type="text" v-model="editFormData.middle_name"
                          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" />
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700">Last Name</label>
                        <input type="text" v-model="editFormData.last_name" required
                          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" />
                      </div>
                    </div>

                    <!-- Gender Selection -->
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                      <div class="flex space-x-4">
                        <label class="inline-flex items-center">
                          <input type="radio" v-model="editFormData.gender" value="male"
                            class="form-radio h-4 w-4 text-primary focus:ring-primary border-gray-300" />
                          <span class="ml-2 text-gray-700">Male</span>
                        </label>
                        <label class="inline-flex items-center">
                          <input type="radio" v-model="editFormData.gender" value="female"
                            class="form-radio h-4 w-4 text-primary focus:ring-primary border-gray-300" />
                          <span class="ml-2 text-gray-700">Female</span>
                        </label>
                        <label class="inline-flex items-center">
                          <input type="radio" v-model="editFormData.gender" value="other"
                            class="form-radio h-4 w-4 text-primary focus:ring-primary border-gray-300" />
                          <span class="ml-2 text-gray-700">Other</span>
                        </label>
                      </div>
                    </div>

                    <!-- Contact Information -->
                    <div class="grid grid-cols-2 gap-4">
                      <div>
                        <label class="block text-sm font-medium text-gray-700">Date of Birth</label>
                        <input type="date" v-model="editFormData.date_of_birth" required
                          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" />
                      </div>
                      <div>
                        <label class="block text-sm font-medium text-gray-700">Contact Number</label>
                        <input type="tel" v-model="editFormData.contact_number" required
                          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" />
                      </div>
                    </div>

                    <!-- Email -->
                    <div>
                      <label class="block text-sm font-medium text-gray-700">Email</label>
                      <input type="email" v-model="editFormData.email" required
                        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" />
                    </div>

                    <!-- Provider Details -->
                    <div>
                      <label class="block text-sm font-medium text-gray-700">CPD Activity Title</label>
                      <input type="text" v-model="editFormData.cpdActivityTitle" required
                        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" />
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-gray-700">Venue</label>
                      <input type="text" v-model="editFormData.venue" required
                        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" />
                    </div>

                    <div class="flex justify-end space-x-3">
                      <button type="button" @click="closeEditProviderModal"
                        class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        Cancel
                      </button>
                      <button type="submit"
                        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        Update Provider
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useToast } from 'vue-toastification';
import apiService from '@/services/services';

const toast = useToast();

const isAddProviderModalOpen = ref(false);
const isEditProviderModalOpen = ref(false);
const editingIndex = ref(null);

const formData = reactive({
  // User registration fields
  first_name: '',
  middle_name: '',
  last_name: '',
  gender: '',
  date_of_birth: '',
  contact_number: '',
  email: '',
  password: '',
  confirm_password: '',
  role: 'cpd_cme_provider',
  service_type: 'health_certification',

  // Provider specific fields
  cpdActivityTitle: '',
  venue: '',
});

const providers = ref([]);

const openAddProviderModal = () => {
  isAddProviderModalOpen.value = true;
};

const closeAddProviderModal = () => {
  isAddProviderModalOpen.value = false;
  Object.keys(formData).forEach(key => {
    if (key !== 'role' && key !== 'service_type') {
      formData[key] = '';
    }
  });
};

const submitProvider = async () => {
  if (formData.password !== formData.confirm_password) {
    toast.error('Passwords do not match');
    return;
  }

  try {
    const payload = {
      first_name: formData.first_name,
      middle_name: formData.middle_name,
      last_name: formData.last_name,
      gender: formData.gender,
      date_of_birth: formData.date_of_birth,
      contact_number: formData.contact_number,
      email: formData.email,
      password: formData.password,
      confirm_password: formData.confirm_password,
      role: 'cpd_cme_provider',
      service_type: 'health_certification',
    };

    await apiService.register(payload);
    await fetchProviders(); // Refresh the providers list

    toast.success('Provider registration successful!');
    closeAddProviderModal();
  } catch (error) {
    console.error('Registration error:', error);
    toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
  }
};

const editFormData = reactive({
  first_name: '',
  middle_name: '',
  last_name: '',
  gender: '',
  date_of_birth: '',
  contact_number: '',
  email: '',
  cpdActivityTitle: '',
  venue: '',
});

const openEditProviderModal = (index) => {
  editingIndex.value = index;
  const provider = providers.value[index];
  Object.keys(editFormData).forEach(key => {
    editFormData[key] = provider[key];
  });
  isEditProviderModalOpen.value = true;
};

const closeEditProviderModal = () => {
  isEditProviderModalOpen.value = false;
  editingIndex.value = null;
  Object.keys(editFormData).forEach(key => {
    editFormData[key] = '';
  });
};

const updateProvider = async () => {
  try {
    // Update the provider data
    const updatePayload = {
      first_name: editFormData.first_name,
      middle_name: editFormData.middle_name,
      last_name: editFormData.last_name,
      gender: editFormData.gender,
      date_of_birth: editFormData.date_of_birth,
      contact_number: editFormData.contact_number,
      email: editFormData.email,
      cpdActivityTitle: editFormData.cpdActivityTitle,
      venue: editFormData.venue,
    };

    const providerId = providers.value[editingIndex.value].id;
    await apiService.updateProvider(providerId, updatePayload);

    // Update the local data
    Object.assign(providers.value[editingIndex.value], updatePayload);

    toast.success('Provider updated successfully!');
    closeEditProviderModal();
  } catch (error) {
    toast.error(error.response?.data?.message || 'Update failed. Please try again.');
  }
};

const deleteProvider = async (index) => {
  if (!confirm('Are you sure you want to delete this provider?')) {
    return;
  }

  try {
    const providerId = providers.value[index].id;
    await apiService.deleteProvider(providerId);

    providers.value.splice(index, 1);
    toast.success('Provider deleted successfully!');
  } catch (error) {
    toast.error(error.response?.data?.message || 'Delete failed. Please try again.');
  }
};

// Load initial data
const fetchProviders = async () => {
  try {
    const response = await apiService.getAllUsers();

    // Access the users from the results array
    if (response && response.data && Array.isArray(response.data.results)) {
      // Filter for CPD providers only
      providers.value = response.data.results.filter(user => user.role === 'cpd_cme_provider');
    } else {
      console.error('Unexpected API response structure:', response);
      providers.value = [];
    }
  } catch (error) {
    console.error('Error fetching providers:', error);
    toast.error('Failed to load providers. Please try again.');
  }
};

// Fetch providers when component mounts
fetchProviders();
</script>