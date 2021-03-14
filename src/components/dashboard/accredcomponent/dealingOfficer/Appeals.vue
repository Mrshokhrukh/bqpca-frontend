<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="container mx-auto px-4">
      <!-- Header Card -->
      <div class="bg-white rounded-xl shadow-sm mb-8 p-6 border border-gray-100 relative">
        <div class="flex justify-between items-start">
          <div>
            <h2 class="text-2xl font-bold text-gray-800">Appeal Applications</h2>
            <p class="text-gray-500 mt-1">Manage and review institution appeal requests</p>
          </div>
          <!-- Edit button removed from here -->
        </div>
      </div>

      <!-- Table Card -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div class="p-6 border-b border-gray-100">
          <div class="flex justify-between items-center">
            <h3 class="font-semibold text-gray-800">Applications Overview</h3>
            <div class="flex space-x-2">
              <button class="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm flex items-center hover:bg-gray-50 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filter
              </button>
              <button class="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm flex items-center hover:bg-gray-50 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Export
              </button>
            </div>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Institution</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Appeal Reason</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resolution Attempt</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Meeting Date</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="appeal in appeals" :key="appeal.id" class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="font-medium text-gray-900">{{ appeal.institutionName }}</div>
                  <div class="text-sm text-gray-500">{{ appeal.dzongkhag }}</div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-900">{{ appeal.reasonType }}</div>
                  <div v-if="appeal.reasonType === 'Others'" class="text-sm text-gray-500">{{ appeal.reasonOthers }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="appeal.resolvedWithHEQC === 'Yes' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'" class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full">
                    {{ appeal.resolvedWithHEQC }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ appeal.meetingDate || 'N/A' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="{
                    'bg-green-100 text-green-800': appeal.decisionBAC === 'Approved',
                    'bg-red-100 text-red-800': appeal.decisionBAC === 'Rejected',
                    'bg-blue-100 text-blue-800': appeal.decisionBAC === 'Query',
                    'bg-gray-100 text-gray-800': !appeal.decisionBAC || appeal.decisionBAC === 'Pending'
                  }" class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full">
                    {{ appeal.decisionBAC || 'Pending' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button @click="viewAppeal(appeal)" class="text-indigo-600 hover:text-indigo-900 mr-3">
                    View
                  </button>
                  <button
                    v-if="appeal.decisionBAC === 'Approved'"
                    @click="generateCertificate(appeal)"
                    class="text-green-600 hover:text-green-900"
                  >
                    Certificate
                  </button>
                   <button @click="removeAppeal(appeal.id)" class="text-red-600 hover:text-red-900">
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="bg-white px-6 py-4 border-t border-gray-200">
          <div class="flex items-center justify-between">
            <div class="text-sm text-gray-700">
            Showing <span class="font-medium">{{ (currentPage - 1) * perPage + 1 }}</span> to <span class="font-medium">{{ Math.min(currentPage * perPage, totalAppeals) }}</span> of <span class="font-medium">{{ totalAppeals }}</span> entries
            </div>
            <div class="flex-1 flex justify-end">
              <button @click="previousPage" :disabled="currentPage === 1" class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 mx-1">
                Previous
              </button>
              <button @click="nextPage" :disabled="currentPage * perPage >= totalAppeals" class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 mx-1">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Appeal Details Modal -->
    <div v-if="isModalOpen" class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-center justify-center min-h-screen px-4 text-center sm:block sm:p-0">
        <!-- Overlay -->
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="closeModal"></div>
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true"> </span>

        <!-- Modal Content -->
        <div class="inline-block align-bottom bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <!-- Header -->
          <div class="bg-indigo-600 px-6 py-4">
            <div class="flex items-center justify-between">
              <h3 class="text-lg leading-6 font-medium text-white" id="modal-title">
                Appeal Application Details
              </h3>
              <div class="flex items-center">
                <!-- Edit button added here -->
                <button
                  @click="toggleEditMode"
                  class="bg-white text-indigo-600 px-3 py-1 rounded-lg text-sm flex items-center hover:bg-gray-100 transition-colors mr-3"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  {{ isEditMode ? 'Save' : 'Edit' }}
                </button>
                <button @click="closeModal" class="text-white hover:text-gray-200 focus:outline-none">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Modal Body -->
          <div class="px-6 py-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Appellant Card -->
              <div class="bg-white rounded-lg border border-gray-100 shadow-sm p-4">
                <h4 class="text-sm uppercase text-gray-500 font-semibold tracking-wider mb-3">Appellant Details</h4>
                <div class="space-y-2">
                  <div>
                    <p class="text-xs text-gray-500">Institution Name</p>
                    <div v-if="isEditMode">
                      <input v-model="selectedAppeal.institutionName" class="border-gray-300 rounded p-1 w-full text-sm" />
                    </div>
                    <p v-else class="font-medium">{{ selectedAppeal.institutionName }}</p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500">Address</p>
                    <div v-if="isEditMode">
                      <input v-model="selectedAppeal.address" class="border-gray-300 rounded p-1 w-full text-sm" />
                    </div>
                    <p v-else>{{ selectedAppeal.address }}</p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500">Dzongkhag/Thromde</p>
                    <div v-if="isEditMode">
                      <input v-model="selectedAppeal.dzongkhag" class="border-gray-300 rounded p-1 w-full text-sm" />
                    </div>
                    <p v-else>{{ selectedAppeal.dzongkhag }}</p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500">Contact</p>
                    <div v-if="isEditMode">
                      <input v-model="selectedAppeal.contact" class="border-gray-300 rounded p-1 w-full text-sm" />
                    </div>
                    <p v-else>{{ selectedAppeal.contact }}</p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500">Email</p>
                    <div v-if="isEditMode">
                      <input v-model="selectedAppeal.email" class="border-gray-300 rounded p-1 w-full text-sm" />
                    </div>
                    <p v-else>{{ selectedAppeal.email }}</p>
                  </div>
                </div>
              </div>

              <!-- Appeal Details Card -->
              <div class="bg-white rounded-lg border border-gray-100 shadow-sm p-4">
                <h4 class="text-sm uppercase text-gray-500 font-semibold tracking-wider mb-3">Appeal Information</h4>
                <div class="space-y-2">
                  <div>
                    <p class="text-xs text-gray-500">Reason Type</p>
                    <div v-if="isEditMode">
                      <select v-model="selectedAppeal.reasonType" class="border-gray-300 rounded p-1 w-full text-sm">
                        <option value="Course Accreditation">Course Accreditation</option>
                        <option value="Recognition">Recognition</option>
                        <option value="Others">Others</option>
                      </select>
                      <input v-if="selectedAppeal.reasonType === 'Others'" v-model="selectedAppeal.reasonOthers" class="border-gray-300 rounded p-1 w-full text-sm mt-1" placeholder="Specify reason..." />
                    </div>
                    <p v-else class="font-medium">{{ selectedAppeal.reasonType }} <span v-if="selectedAppeal.reasonType === 'Others'">({{ selectedAppeal.reasonOthers }})</span></p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500">Appeal Reason</p>
                    <div v-if="isEditMode">
                      <textarea v-model="selectedAppeal.reason" class="border-gray-300 rounded p-1 w-full text-sm" rows="2"></textarea>
                    </div>
                    <p v-else>{{ selectedAppeal.reason }}</p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500">Resolved with HEQC</p>
                    <div v-if="isEditMode">
                      <select v-model="selectedAppeal.resolvedWithHEQC" class="border-gray-300 rounded p-1 w-full text-sm">
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                    <p v-else>{{ selectedAppeal.resolvedWithHEQC }}</p>
                  </div>
                  <div v-if="selectedAppeal.resolvedWithHEQC === 'Yes'">
                    <p class="text-xs text-gray-500">Meeting Date</p>
                    <div v-if="isEditMode">
                      <input type="date" v-model="selectedAppeal.meetingDate" class="border-gray-300 rounded p-1 w-full text-sm" />
                    </div>
                    <p v-else>{{ selectedAppeal.meetingDate }}</p>
                  </div>
                  <div v-if="selectedAppeal.resolvedWithHEQC === 'Yes'">
                    <p class="text-xs text-gray-500">Resolution Outcome</p>
                    <div v-if="isEditMode">
                      <textarea v-model="selectedAppeal.resolutionOutcome" class="border-gray-300 rounded p-1 w-full text-sm" rows="2"></textarea>
                    </div>
                    <p v-else>{{ selectedAppeal.resolutionOutcome }}</p>
                  </div>
                </div>
              </div>

              <!-- Supporting Documents Card -->
              <div class="bg-white rounded-lg border border-gray-100 shadow-sm p-4">
                <h4 class="text-sm uppercase text-gray-500 font-semibold tracking-wider mb-3">Supporting Information</h4>
                <div class="space-y-2">
                  <div>
                    <p class="text-xs text-gray-500">Documents</p>
                    <div v-if="isEditMode">
                      <input type="file" @change="handleFileUpload" ref="fileInput" class="text-sm mt-1" />
                    </div>
                    <a v-else-if="selectedAppeal.supportingDocument" :href="selectedAppeal.supportingDocument" target="_blank" class="text-indigo-600 hover:text-indigo-800 flex items-center mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      View Document
                    </a>
                    <p v-else class="text-gray-500 text-sm italic">No documents uploaded</p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500">Remarks</p>
                    <div v-if="isEditMode">
                      <textarea v-model="selectedAppeal.remarks" class="border-gray-300 rounded p-1 w-full text-sm" rows="2"></textarea>
                    </div>
                    <p v-else>{{ selectedAppeal.remarks || 'None' }}</p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500">Declaration</p>
                    <div v-if="isEditMode">
                      <label class="inline-flex items-center mt-1">
                        <input type="checkbox" v-model="selectedAppeal.declaration" class="form-checkbox h-4 w-4 text-indigo-600" />
                        <span class="ml-2 text-sm text-gray-700">Signed</span>
                      </label>
                    </div>
                    <span v-else :class="selectedAppeal.declaration ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'" class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full mt-1">
                      {{ selectedAppeal.declaration ? 'Signed' : 'Not Signed' }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Decision Card -->
              <div class="bg-white rounded-lg border border-gray-100 shadow-sm p-4">
                <h4 class="text-sm uppercase text-gray-500 font-semibold tracking-wider mb-3">BAC Decision</h4>
                <div class="space-y-4">
                  <div>
                    <label for="decisionBAC" class="block text-xs text-gray-500 mb-1">Decision Status</label>
                    <select v-model="selectedAppeal.decisionBAC" id="decisionBAC" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                      <option value="">-- Select Decision --</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                      <option value="Pending">Pending</option>
                      <option value="Query">Query</option>
                    </select>
                  </div>
                  <div>
                    <label for="decisionDetails" class="block text-xs text-gray-500 mb-1">Decision Details</label>
                    <textarea v-model="selectedAppeal.decisionDetails" id="decisionDetails" rows="4" class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border-gray-300 rounded-md" placeholder="Enter details about your decision..."></textarea>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
          <button v-if="!isEditMode" type="button" class="inline-flex items-center px-4 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500" @click="removeAppeal(selectedAppeal.id)">
             Delete
          </button>

            <button type="button" class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" @click="closeModal">
              Cancel
            </button>
             <button type="button" class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" @click="saveAppeal">
                Save
            </button>

          </div>
        </div>
      </div>
    </div>
     <button @click="addNewAppeal" class="fixed bottom-4 right-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
      + Add Appeal
    </button>
  </div>
</template>

<script>
import { ref, onMounted,  } from 'vue';
import axios from 'axios';

export default {
  name: 'AppealsView',
  setup() {
    const appeals = ref([]);
    const isModalOpen = ref(false);
    const selectedAppeal = ref(null);
    const isEditMode = ref(false);
    const loading = ref(false); //for loading
    const fileInput = ref(null);  //for file upload.
    const currentPage = ref(1);
    const perPage = ref(10);
    const totalAppeals = ref(0);

    // Fetch Appeals
    const fetchAppeals = async () => {
      loading.value = true;
      try {
         const response = await axios.get('/api/accrediations/masters-appeal-reason/',{
          params: {
            page: currentPage.value,
            per_page: perPage.value
          }
         });
         appeals.value = response.data.results; // Use response.data.results for DRF paginated response
         totalAppeals.value = response.data.count;  // Get total count from DRF
      } catch (error) {
        console.error('Error fetching appeals:', error);
        // Handle error appropriately, e.g., show a notification
        alert('Failed to fetch appeals. Please try again later.');
      } finally {
        loading.value = false;
      }
    };

     const previousPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--;
        fetchAppeals(); // Fetch appeals for the new page
      }
    };

    const nextPage = () => {
      // Check if there is a next page based on total count and current page/perPage
      if (currentPage.value * perPage.value < totalAppeals.value) {
        currentPage.value++;
        fetchAppeals();  //fetch appeals for the new page.
      }
    };


    // View Appeal
    const viewAppeal = (appeal) => {
      selectedAppeal.value = { ...appeal };
      isModalOpen.value = true;
      isEditMode.value = false;
    };

    // Close Modal
   const closeModal = () => {
      isModalOpen.value = false;
      if(selectedAppeal.value && !selectedAppeal.value.id){ //If a new appeal was added but not saved.
          const index = appeals.value.findIndex(a => a.id === undefined);
          if(index !== -1) {
            appeals.value.splice(index, 1)
          }
      }
      selectedAppeal.value = null;
      isEditMode.value = false;
      if(fileInput.value){
        fileInput.value.value = "";
      }
    };


   const handleFileUpload = (event) => {
      const file = event.target.files[0];
      if (file) {
        selectedAppeal.value.supportingDocument = file; // Store the File object directly
        // Or if you need a base64 string (less efficient for large files):
        // const reader = new FileReader();
        // reader.onload = (e) => {
        //   selectedAppeal.value.supportingDocument = e.target.result;
        // }
        // reader.readAsDataURL(file);
      }
    };

     // Save Appeal (Create/Update)
  const saveAppeal = async () => {
      loading.value = true;
      try {
        let formData = new FormData();
        for (let key in selectedAppeal.value) {
          if (key === 'supportingDocument' && selectedAppeal.value[key] instanceof File) {
            formData.append(key, selectedAppeal.value[key]);  //append the actual file.
          } else if(selectedAppeal.value[key] !== null && selectedAppeal.value[key] !== undefined){ //append only if it is not null.
              formData.append(key, selectedAppeal.value[key]);
          }
        }


        let response;
        if (selectedAppeal.value.id) {
          // Update existing appeal
          response = await axios.patch(`/api/accrediations/masters-appeal-reason/${selectedAppeal.value.id}/`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data', // Important for file uploads
            },
          });
           // Find the index and update.
          const index = appeals.value.findIndex(a => a.id === selectedAppeal.value.id);
          if(index != -1) {
            appeals.value[index] = response.data;
          }

        } else {
          // Create new appeal
          response = await axios.post('/api/accrediations/masters-appeal-reason/', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          appeals.value.push(response.data);
        }
         totalAppeals.value = (await axios.get('/api/accrediations/masters-appeal-reason/')).data.count; //Refetch the total count.

        console.log('Appeal saved:', response.data);
        closeModal();
         fetchAppeals();
      } catch (error) {
        console.error('Error saving appeal:', error);
         let errorMessage = 'Failed to save appeal. Please try again later.';
        if (error.response && error.response.data) {
            // Extract and display specific error messages from the backend
            errorMessage = Object.values(error.response.data).flat().join('\n');
        }
        alert(errorMessage);
      } finally {
        loading.value = false;
      }
    };



    // Generate Certificate (Placeholder)
    const generateCertificate = (appeal) => {
      console.log('Generate Certificate for Appeal ID:', appeal.id);
      alert(`Certificate generation initiated for ${appeal.institutionName}'s appeal.`);
    };

    // Toggle Edit Mode
    const toggleEditMode = () => {
        if(!isEditMode.value) {
            isEditMode.value = true;
        } else {
            saveAppeal(); //save on toggling to view.
        }

    };

    // Add New Appeal (Open Modal in Edit Mode)
    const addNewAppeal = () => {

      const newAppeal = {
        institutionName: '', // Initialize with empty strings or defaults
        address: '',
        dzongkhag: '',
        contact: '',
        email: '',
        reasonType: '',
        reasonOthers: '',
        reason: '',
        resolvedWithHEQC: '',
        resolutionOutcome: '',
        meetingDate: '',
        supportingDocument: null, // Important for file uploads
        remarks: '',
        declaration: false,
        decisionBAC: '',
        decisionDetails: ''
      };
        appeals.value.unshift(newAppeal); // Add to the beginning of the array for immediate visibility
        viewAppeal(newAppeal);
      isEditMode.value = true;

    };

    // Remove Appeal
    const removeAppeal = async (id) => {
      if (confirm('Are you sure you want to delete this appeal?')) {
        loading.value = true;
        try {
          await axios.delete(`/api/accrediations/masters-appeal-reason/${id}/`);

          const index = appeals.value.findIndex(a => a.id === id);
          if (index !== -1) {
            appeals.value.splice(index, 1);
          }
          totalAppeals.value--; //reduce the total count.
          closeModal(); //close only if deletion is successful.
          // Optionally, re-fetch appeals or update the local list
        } catch (error) {
          console.error('Error deleting appeal:', error);
          alert('Failed to delete appeal. Please try again later.');
        } finally {
          loading.value = false;
        }
      }
    };

    onMounted(fetchAppeals);

    return {
      appeals,
      isModalOpen,
      selectedAppeal,
      isEditMode,
      loading,
      viewAppeal,
      closeModal,
      saveAppeal,
      generateCertificate,
      toggleEditMode,
      addNewAppeal,
      removeAppeal,
      fileInput,
      handleFileUpload,
      currentPage,
      perPage,
      totalAppeals,
      previousPage,
      nextPage
    };
  }
};
</script>