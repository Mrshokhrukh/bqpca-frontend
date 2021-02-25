<template>
  <div class="p-4 w-full">
      <!-- Header Section -->
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 class="text-3xl font-serif font-bold text-slate-900">
              EOI Applications
          </h2>
          <button
              class="inline-flex items-center px-6 py-3 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
              @click="handleApplicationSubmitted" :disabled="loading">
              <RefreshCw class="w-4 h-4 mr-2" :class="{ 'animate-spin': loading }" />
              {{ loading ? 'Refreshing...' : 'Refresh Application List' }}
          </button>
      </div>
      <!-- Search Input -->
      <div class="px-6 py-4">
          <label for="search" class="sr-only">Search</label>
          <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fill-rule="evenodd"
                          d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                          clip-rule="evenodd" />
                  </svg>
              </div>
              <input type="text" id="search" v-model="searchQuery" placeholder="Search by App ID or Name"
                  class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
          </div>
      </div>

      <!-- Application Table with Loading State -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div v-if="loading" class="flex justify-center items-center py-12">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
          <div v-else class="w-full overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                      <tr>
                          <th scope="col"
                              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Application ID
                          </th>
                          <th scope="col"
                              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Institute Name
                          </th>
                          <th scope="col"
                              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Program Type
                          </th>
                          <th scope="col"
                              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Date Submitted
                          </th>
                          <th scope="col"
                              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                          </th>
                          <th scope="col" class="px-6 py-3 text-right">
                              <span class="sr-only">Actions</span>
                          </th>
                          <th scope="col" class="px-6 py-3 text-left">
                              <span class="sr-only">Notes</span>
                          </th>
                      </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                      <tr v-for="eoi in filteredEois" :key="eoi.applicationId"
                          class="hover:bg-gray-50 transition-colors duration-150">
                          <td class="px-6 py-4 whitespace-nowrap">
                              <span class="text-sm font-medium text-gray-900">{{ eoi.applicationId }}</span>
                          </td>
                          <td class="px-6 py-4 whitespace-nowrap">
                              <span class="text-sm text-gray-700">{{ eoi.instituteName }}</span>
                          </td>
                          <td class="px-6 py-4 whitespace-nowrap">
                              <span class="text-sm text-gray-700">{{ eoi.programType }}</span>
                          </td>
                          <td class="px-6 py-4 whitespace-nowrap">
                              <span class="text-sm text-gray-600">{{ eoi.dateSubmitted }}</span>
                          </td>
                          <td class="px-6 py-4 whitespace-nowrap">
                              <span class="text-sm text-gray-700">
                                  {{ eoi.status }}
                                  <span v-if="eoi.status === 'Rejected' && eoi.rejectionReason">
                                      (Reason: {{ eoi.rejectionReason }})
                                  </span>
                              </span>
                          </td>
                          <td class="px-6 py-4 whitespace-nowrap text-right">
                              <div class="flex justify-end space-x-2">
                                  <button @click="openModal(eoi)"
                                      class="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-150">
                                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                          stroke-width="1.5" stroke="currentColor" class="w-4 h-4 mr-1">
                                          <path stroke-linecap="round" stroke-linejoin="round"
                                              d="m2.036 12.322 1.397-1.398a2.124 2.124 0 0 1 3 0l.896.897a2.124 2.124 0 0 0 3 0l1.398-1.398A2.124 2.124 0 0 1 22 12c0 .662-.259 1.311-.741 1.793l-1.398 1.398a2.124 2.124 0 0 0-3 0l-.896-.897a2.124 2.124 0 0 1-3 0l-1.398 1.398A2.124 2.124 0 0 1 2.036 12.322Z" />
                                          <path stroke-linecap="round" stroke-linejoin="round"
                                              d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                      </svg>
                                      View
                                  </button>
                                  <button @click="openApprovalModal(eoi)"
                                      class="inline-flex items-center px-3 py-1.5 border border-transparent rounded-lg text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed">
                                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                          stroke-width="1.5" stroke="currentColor" class="w-4 h-4 mr-1">
                                          <path stroke-linecap="round" stroke-linejoin="round"
                                              d="M4.5 12.75 12 4.5m0 0 7.5 8.25-7.5 8.25M5.25 10.5h13.5" />
                                      </svg>
                                      Approve
                                  </button>
                                  <button @click="openRejectModal(eoi)"
                                      class="inline-flex items-center px-3 py-1.5 border border-transparent rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed">
                                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                          stroke-width="1.5" stroke="currentColor" class="w-4 h-4 mr-1">
                                          <path stroke-linecap="round" stroke-linejoin="round"
                                              d="M6 18 18 6M6 6l12 12" />
                                      </svg>
                                      Reject
                                  </button>
                              </div>
                          </td>
                          <td class="px-6 py-4 whitespace-nowrap">
                              <span class="text-sm text-gray-700">
                                  <span v-if="eoi.approvalNotes">{{ eoi.approvalNotes }}</span>
                              </span>
                          </td>
                      </tr>
                  </tbody>
              </table>
          </div>
      </div>

      <!-- View Modal -->
      <div v-if="isModalOpen" class="fixed z-50 inset-0 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-start justify-center pt-4 px-4 pb-20 sm:p-0">
          <div class="relative w-full max-w-3xl mx-auto mt-10">
              <div class="relative bg-white rounded-2xl shadow-2xl overflow-hidden">
                  <!-- Modal Header -->
                  <div class="bg-gray-50 px-8 py-4 border-b border-gray-200 flex justify-between items-center">
                      <div>
                          <h2 class="text-2xl font-bold text-gray-900">EOI Application Details</h2>
                          <p class="text-sm text-gray-500 mt-1">Application ID: {{ selectedEoi.applicationId }}</p>
                      </div>
                      <button @click="closeModal"
                          class="rounded-full p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
                          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                  d="M6 18L18 6M6 6l12 12"></path>
                          </svg>
                      </button>
                  </div>

                  <!-- Modal Body -->
                  <div class="px-8 py-6 space-y-4">
                      <div>
                          <label class="block text-sm font-medium text-gray-700">Institute Name:</label>
                          <input v-if="isEditing" v-model="selectedEoi.instituteName"
                              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                          <span v-else class="mt-1 block text-sm text-gray-900">{{ selectedEoi.instituteName }}</span>
                      </div>
                      <div>
                          <label class="block text-sm font-medium text-gray-700">Institute Address:</label>
                          <input v-if="isEditing" v-model="selectedEoi.instituteAddress"
                              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                          <span v-else class="mt-1 block text-sm text-gray-900">{{ selectedEoi.instituteAddress }}</span>
                      </div>
                      <div>
                          <label class="block text-sm font-medium text-gray-700">Correspondence Address:</label>
                          <input v-if="isEditing" v-model="selectedEoi.correspondenceAddress"
                              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                          <span v-else class="mt-1 block text-sm text-gray-900">{{
                              selectedEoi.correspondenceAddress
                          }}</span>
                      </div>
                      <div>
                          <label class="block text-sm font-medium text-gray-700">Location:</label>
                          <input v-if="isEditing" v-model="selectedEoi.location"
                              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                          <span v-else class="mt-1 block text-sm text-gray-900">{{ selectedEoi.location }}</span>
                      </div>
                      <div>
                          <label class="block text-sm font-medium text-gray-700">Phone (Office):</label>
                          <input v-if="isEditing" v-model="selectedEoi.phoneOffice"
                              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                          <span v-else class="mt-1 block text-sm text-gray-900">{{ selectedEoi.phoneOffice }}</span>
                      </div>
                      <div>
                          <label class="block text-sm font-medium text-gray-700">Mobile:</label>
                          <input v-if="isEditing" v-model="selectedEoi.mobile"
                              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                          <span v-else class="mt-1 block text-sm text-gray-900">{{ selectedEoi.mobile }}</span>
                      </div>
                      <div>
                          <label class="block text-sm font-medium text-gray-700">Fax:</label>
                          <input v-if="isEditing" v-model="selectedEoi.fax"
                              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                          <span v-else class="mt-1 block text-sm text-gray-900">{{ selectedEoi.fax }}</span>
                      </div>
                      <div>
                          <label class="block text-sm font-medium text-gray-700">Email:</label>
                          <input v-if="isEditing" v-model="selectedEoi.email"
                              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                          <span v-else class="mt-1 block text-sm text-gray-900">{{ selectedEoi.email }}</span>
                      </div>
                      <div>
                          <label class="block text-sm font-medium text-gray-700">Webpage:</label>
                          <input v-if="isEditing" v-model="selectedEoi.webpage"
                              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                          <span v-else class="mt-1 block text-sm text-gray-900">{{ selectedEoi.webpage }}</span>
                      </div>

                      <h4 class="text-lg font-semibold text-gray-900 mt-6">Program Information</h4>
                      <div>
                          <label class="block text-sm font-medium text-gray-700">Title of Course:</label>
                          <input v-if="isEditing" v-model="selectedEoi.courseTitle"
                              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                          <span v-else class="mt-1 block text-sm text-gray-900">{{ selectedEoi.courseTitle }}</span>
                      </div>
                      <div>
                          <label class="block text-sm font-medium text-gray-700">Duration:</label>
                          <input v-if="isEditing" v-model="selectedEoi.duration"
                              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                          <span v-else class="mt-1 block text-sm text-gray-900">{{ selectedEoi.duration }}</span>
                      </div>
                      <div>
                          <label class="block text-sm font-medium text-gray-700">Proposed Date:</label>
                          <input v-if="isEditing" v-model="selectedEoi.proposedDate"
                              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                          <span v-else class="mt-1 block text-sm text-gray-900">{{ selectedEoi.proposedDate }}</span>
                      </div>
                      <div>
                          <label class="block text-sm font-medium text-gray-700">Type of Program:</label>
                          <input v-if="isEditing" v-model="selectedEoi.programType"
                              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
                          <span v-else class="mt-1 block text-sm text-gray-900">{{ selectedEoi.programType }}</span>
                      </div>

                      <!-- Documents (Placeholder) -->
                      <h4 class="text-lg font-semibold text-gray-900 mt-6">Documents</h4>
                      <p class="text-gray-600">No documents uploaded (Placeholder)</p>

                      <!-- Declaration (Placeholder) -->
                      <h4 class="text-lg font-semibold text-gray-900 mt-6">Declaration</h4>
                      <p class="text-gray-600">Declaration Text Here (Placeholder)</p>
                  </div>

                  <!-- Action Buttons at Bottom -->
                  <div class="mt-8 flex justify-end gap-4 border-t pt-6 px-8">
                      <button @click="approveEoiInModal()"
                          class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors">
                          Approve
                      </button>
                      <button @click="rejectEoiInModal()"
                          class="inline-flex items-center px-4 py-2 border border-red-300 text-red-700 bg-white rounded-lg hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors">
                          Reject
                      </button>
                      <button v-if="!isEditing" @click="startEditing"
                          class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                          Edit
                      </button>
                      <button v-if="isEditing" @click="saveChanges"
                          class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                          Save
                      </button>
                      <button v-if="isEditing" @click="cancelEditing"
                          class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                          Cancel
                      </button>
                      <button @click="closeModal"
                          class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                          Close
                      </button>
                  </div>
              </div>
          </div>
      </div>

      <!-- Reject Modal -->
      <div v-if="isRejectModalOpen" class="fixed z-50 inset-0 overflow-y-auto bg-black/75 flex items-center justify-center">
          <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
              <div class="flex justify-between items-center mb-4">
                  <h3 class="text-xl font-semibold text-red-700">Reject Application</h3>
                  <button @click="closeRejectModal" class="text-gray-500 hover:text-gray-700 focus:outline-none">
                      <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                  </button>
              </div>
              <p class="text-gray-700 mb-4">Are you sure you want to reject application {{ selectedEoi.applicationId
              }}?</p>
              <label for="rejectionReason" class="block text-sm font-medium text-gray-700">Reason for
                  Rejection:</label>
              <textarea id="rejectionReason" v-model="rejectionReason"
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
              <div class="mt-6 flex justify-end space-x-2">
                  <button @click="confirmReject"
                      class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                      Confirm Reject
                  </button>
                  <button @click="closeRejectModal"
                      class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                      Cancel
                  </button>
              </div>
          </div>
      </div>

      <!-- Approval Modal -->
      <div v-if="isApprovalModalOpen" class="fixed z-50 inset-0 overflow-y-auto bg-black/75 flex items-center justify-center">
          <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
              <div class="flex justify-between items-center mb-4">
                  <h3 class="text-xl font-semibold text-green-700">Approve Application</h3>
                  <button @click="closeApprovalModal" class="text-gray-500 hover:text-gray-700 focus:outline-none">
                      <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                  </button>
              </div>
              <p class="text-gray-700 mb-4">Enter any notes or remarks for application {{ selectedEoi.applicationId
              }}:</p>
              <label for="approvalNotes" class="block text-sm font-medium text-gray-700">Approval
                  Notes:</label>
              <textarea id="approvalNotes" v-model="approvalNotes"
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea>
              <div class="mt-6 flex justify-end space-x-2">
                  <button @click="confirmApprove"
                      class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
                      Confirm Approve
                  </button>
                  <button @click="closeApprovalModal"
                      class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                      Cancel
                  </button>
              </div>
          </div>
      </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { RefreshCw } from 'lucide-vue-next';
import { useToast } from 'vue-toastification';
const toast = useToast();

export default {
  components: {
      RefreshCw
  },
  setup() {
      const eois = ref([]);
      const isModalOpen = ref(false);
      const selectedEoi = ref(null);
      const isEditing = ref(false);

      const isRejectModalOpen = ref(false);
      const rejectionReason = ref('');

      const isApprovalModalOpen = ref(false);
      const approvalNotes = ref('');
      const loading = ref(false);
      const searchQuery = ref('');

      onMounted(async () => {
          // Fetch EOIs from API here
          // Example data
          eois.value = [
              {
                  applicationId: 'AP100',
                  instituteName: 'Test Institute',
                  instituteAddress: 'Some Address',
                  correspondenceAddress: 'Corr Address',
                  location: 'Some Location',
                  phoneOffice: '123-456-7890',
                  mobile: '987-654-3210',
                  fax: 'N/A',
                  email: 'test@example.com',
                  webpage: 'www.example.com',
                  courseTitle: 'Medical Course',
                  duration: '4 years',
                  proposedDate: '2024-12-01',
                  programType: 'Bachelor',
                  dateSubmitted: '10/10/2024',
                  status: 'Submitted',
              },
              {
                  applicationId: 'AP101',
                  instituteName: 'Test Institute 2',
                  instituteAddress: 'Another Address',
                  correspondenceAddress: 'Another Corr Address',
                  location: 'Another Location',
                  phoneOffice: '111-222-3333',
                  mobile: '444-555-6666',
                  fax: 'N/A',
                  email: 'test2@example.com',
                  webpage: 'www.example2.com',
                  courseTitle: 'Nursing Program',
                  duration: '3 years',
                  proposedDate: '2025-01-15',
                  programType: 'Diploma',
                  dateSubmitted: '10/10/2024',
                  status: 'Submitted',
              },
          ];
      });

      const openModal = (eoi) => {
          selectedEoi.value = { ...eoi }; // Make a copy
          isModalOpen.value = true;
          isEditing.value = false;
      };

      const closeModal = () => {
          isModalOpen.value = false;
      };

      const startEditing = () => {
          isEditing.value = true;
      };

      const saveChanges = () => {
          // Implement API call to save changes
          console.log('Saving changes:', selectedEoi.value);
          isEditing.value = false;
          closeModal();
      };

      const cancelEditing = () => {
          isEditing.value = false;
      };

      // --- Approval Functions ---
      const openApprovalModal = (eoi) => {
          selectedEoi.value = { ...eoi };
          isApprovalModalOpen.value = true;
      };

      const closeApprovalModal = () => {
          isApprovalModalOpen.value = false;
      };

      const confirmApprove = () => {
          // Implement API call to approve the application
          console.log(
              'Approving application',
              selectedEoi.value.applicationId,
              'with notes:',
              approvalNotes.value
          );

          // Update the status and approval notes in the eois array
          const index = eois.value.findIndex(
              (e) => e.applicationId === selectedEoi.value.applicationId
          );
          if (index !== -1) {
              eois.value[index] = {
                  ...eois.value[index],
                  status: 'Approved',
                  approvalNotes: approvalNotes.value,
              };
          }
          closeApprovalModal();
          approvalNotes.value = ''; // Clear the notes
          closeModal(); // Close the view modal as well after action
      };

      const approveEoiInModal = () => {
          closeModal(); // Close the view modal first
          openApprovalModal(selectedEoi.value); // Then open the approval modal
      };


      // --- Rejection Functions ---
      const openRejectModal = (eoi) => {
          selectedEoi.value = { ...eoi };
          isRejectModalOpen.value = true;
      };

      const closeRejectModal = () => {
          isRejectModalOpen.value = false;
          rejectionReason.value = ''; // Clear the rejection reason
      };

      const confirmReject = () => {
          // Implement API call to reject the application
          console.log(
              'Rejecting application',
              selectedEoi.value.applicationId,
              'with reason:',
              rejectionReason.value
          );
          // Update the status and rejection reason in the eois array
          const index = eois.value.findIndex(
              (e) => e.applicationId === selectedEoi.value.applicationId
          );
          if (index !== -1) {
              eois.value[index] = {
                  ...eois.value[index],
                  status: 'Rejected',
                  rejectionReason: rejectionReason.value,
              };
          }

          closeRejectModal();
          closeModal(); // Close the view modal as well after action
      };
      const rejectEoiInModal = () => {
          closeModal(); // Close the view modal first
          openRejectModal(selectedEoi.value); // Then open the reject modal
      };


      const handleApplicationSubmitted = async () => {
          if (loading.value) return;

          loading.value = true;
          toast.info("Refreshing application list", {
              timeout: 2000,
          });
          setTimeout(() => {
              toast.success("Application List refreshed", {
                  timeout: 2000,
              });
              loading.value = false;
          }, 2000);

          //loadData();
      };
      const filteredEois = computed(() => {
          const query = searchQuery.value.toLowerCase();
          return eois.value.filter(eoi => {
              return String(eoi.applicationId).includes(query) || eoi.instituteName.toLowerCase().includes(query);
          });
      });

      return {
          eois,
          isModalOpen,
          selectedEoi,
          isEditing,
          openModal,
          closeModal,
          startEditing,
          saveChanges,
          cancelEditing,

          isRejectModalOpen,
          rejectionReason,
          openRejectModal,
          closeRejectModal,
          confirmReject,
          rejectEoiInModal, // Added to component methods

          isApprovalModalOpen,
          approvalNotes,
          openApprovalModal,
          closeApprovalModal,
          confirmApprove,
          approveEoiInModal, // Added to component methods

          loading,
          handleApplicationSubmitted,
          searchQuery,
          filteredEois
      };
  },
};
</script>

<style scoped>
/* Tailwind styles - no need for custom styles here, Tailwind classes are used in the template */
</style>
