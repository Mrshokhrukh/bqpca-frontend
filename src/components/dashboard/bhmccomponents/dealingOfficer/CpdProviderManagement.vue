<template>
  <div class="bg-gray-50 min-h-screen">
    <div class="container">
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
                  Contact Information
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  CPD Activity Title
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Venue
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  From Date
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  To Date
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(provider, index) in providers" :key="index" class="hover:bg-gray-100 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ provider.providerName
                }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ provider.contactInfo }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ provider.cpdActivityTitle }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ provider.venue }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ provider.fromDate }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ provider.toDate }}</td>
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
      <div v-if="isAddProviderModalOpen" class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="add-modal-title"
        role="dialog" aria-modal="true">
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <!-- Background overlay, when the modal is open -->
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

          <!-- Modal container -->
          <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true"> </span>
          <div
            class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div class="sm:flex sm:items-start">
              <div
                class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-lg leading-6 font-medium text-gray-900" id="add-modal-title">
                  Add New CPD Provider
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    Fill in the details for the new CPD provider below.
                  </p>
                </div>
              </div>
            </div>
            <div class="mt-4">
              <form @submit.prevent="submitProvider" class="space-y-4">
                <div>
                  <label for="providerName" class="block text-sm font-medium text-gray-700">Provider Name</label>
                  <input type="text" id="providerName" v-model="formData.providerName" required
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter provider name" />
                </div>
                <div>
                  <label for="contactInfo" class="block text-sm font-medium text-gray-700">Contact
                    Information</label>
                  <input type="text" id="contactInfo" v-model="formData.contactInfo" required
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter contact details" />
                </div>
                <div>
                  <label for="cpdActivityTitle" class="block text-sm font-medium text-gray-700">CPD Activity
                    Title</label>
                  <input type="text" id="cpdActivityTitle" v-model="formData.cpdActivityTitle" required
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter activity title" />
                </div>
                <div>
                  <label for="venue" class="block text-sm font-medium text-gray-700">Venue</label>
                  <input type="text" id="venue" v-model="formData.venue" required
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter venue" />
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label for="fromDate" class="block text-sm font-medium text-gray-700">From Date</label>
                    <input type="date" id="fromDate" v-model="formData.fromDate" required
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label for="toDate" class="block text-sm font-medium text-gray-700">To Date</label>
                    <input type="date" id="toDate" v-model="formData.toDate" required
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                  </div>
                </div>

                <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button type="submit"
                    class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm">
                    Add Provider
                  </button>
                  <button type="button" @click="closeAddProviderModal"
                    class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <!-- Edit Provider Modal -->
      <div v-if="isEditProviderModalOpen" class="fixed z-10 inset-0 overflow-y-auto"
        aria-labelledby="edit-modal-title" role="dialog" aria-modal="true">
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <!-- Background overlay, when the modal is open -->
          <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>

          <!-- Modal container -->
          <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true"> </span>
          <div
            class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <div class="sm:flex sm:items-start">
              <div
                class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg class="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-lg leading-6 font-medium text-gray-900" id="edit-modal-title">
                  Edit CPD Provider
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    Edit the details of the CPD provider below.
                  </p>
                </div>
              </div>
            </div>
            <div class="mt-4">
              <form @submit.prevent="updateProvider" class="space-y-4">
                <div>
                  <label for="editProviderName" class="block text-sm font-medium text-gray-700">Provider Name</label>
                  <input type="text" id="editProviderName" v-model="editFormData.providerName" required
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter provider name" />
                </div>
                <div>
                  <label for="editContactInfo" class="block text-sm font-medium text-gray-700">Contact
                    Information</label>
                  <input type="text" id="editContactInfo" v-model="editFormData.contactInfo" required
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter contact details" />
                </div>
                <div>
                  <label for="editCpdActivityTitle" class="block text-sm font-medium text-gray-700">CPD Activity
                    Title</label>
                  <input type="text" id="editCpdActivityTitle" v-model="editFormData.cpdActivityTitle" required
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter activity title" />
                </div>
                <div>
                  <label for="editVenue" class="block text-sm font-medium text-gray-700">Venue</label>
                  <input type="text" id="editVenue" v-model="editFormData.venue" required
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter venue" />
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label for="editFromDate" class="block text-sm font-medium text-gray-700">From Date</label>
                    <input type="date" id="editFromDate" v-model="editFormData.fromDate" required
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label for="editToDate" class="block text-sm font-medium text-gray-700">To Date</label>
                    <input type="date" id="editToDate" v-model="editFormData.toDate" required
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                  </div>
                </div>

                <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button type="submit"
                    class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm">
                    Update Provider
                  </button>
                  <button type="button" @click="closeEditProviderModal"
                    class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';

const formData = reactive({
  providerName: '',
  contactInfo: '',
  cpdActivityTitle: '',
  venue: '',
  fromDate: '',
  toDate: ''
});

const editFormData = reactive({
  providerName: '',
  contactInfo: '',
  cpdActivityTitle: '',
  venue: '',
  fromDate: '',
  toDate: ''
});

const providers = ref([
  {
    providerName: 'ABC Training Institute',
    contactInfo: 'contact@abctraining.com',
    cpdActivityTitle: 'Workshop on Microbiology',
    venue: 'Conference Hall A',
    fromDate: '2023-11-01',
    toDate: '2023-11-03'
  },
  {
    providerName: 'XYZ Seminars',
    contactInfo: 'info@xyzseminars.com',
    cpdActivityTitle: 'ISO Standards Seminar',
    venue: 'Online',
    fromDate: '2023-12-10',
    toDate: '2023-12-12'
  }
]);

const isAddProviderModalOpen = ref(false);
const isEditProviderModalOpen = ref(false);
const editingIndex = ref(null);

const openAddProviderModal = () => {
  isAddProviderModalOpen.value = true;
};

const closeAddProviderModal = () => {
  isAddProviderModalOpen.value = false;
  Object.keys(formData).forEach(key => formData[key] = '');
};

const openEditProviderModal = (index) => {
  editingIndex.value = index;
  Object.assign(editFormData, providers.value[index]); // Load data into edit form
  isEditProviderModalOpen.value = true;
};

const closeEditProviderModal = () => {
  isEditProviderModalOpen.value = false;
  editingIndex.value = null;
};

const submitProvider = () => {
  providers.value.push({ ...formData });
  closeAddProviderModal();
  Object.keys(formData).forEach(key => formData[key] = '');
};

const updateProvider = () => {
  if (editingIndex.value !== null) {
    Object.assign(providers.value[editingIndex.value], editFormData);
    closeEditProviderModal();
  }
};

const deleteProvider = (index) => {
  if (confirm('Are you sure you want to delete this provider?')) {
    providers.value.splice(index, 1);
  }
};
</script>

<style scoped>
/* Any component specific styling can be placed here */
</style>