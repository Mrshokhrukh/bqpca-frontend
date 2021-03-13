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
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="bg-white px-6 py-4 border-t border-gray-200">
          <div class="flex items-center justify-between">
            <div class="text-sm text-gray-700">
              Showing <span class="font-medium">1</span> to <span class="font-medium">{{ appeals.length }}</span> of <span class="font-medium">{{ appeals.length }}</span> entries
            </div>
            <div class="flex-1 flex justify-end">
              <button class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 mx-1">
                Previous
              </button>
              <button class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 mx-1">
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
                      <input type="file" class="text-sm mt-1" />
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
            <button type="button" class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" @click="closeModal">
              Cancel
            </button>
            <button type="button" class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" @click="saveDecision(selectedAppeal)">
              Save Decision
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'AppealsView',
  setup() {
    // Mock Appeal Data (Replace with your actual data fetching logic)
    const appeals = ref([
      {
        id: 1,
        institutionName: 'Royal Institute of Awesome Studies',
        address: 'Thimphu TechPark',
        dzongkhag: 'Thimphu',
        contact: '17XXXXXXX',
        email: 'info@rias.bt',
        reasonType: 'Course Accreditation',
        reason: 'Appeal against initial accreditation outcome for BSc. CS',
        resolvedWithHEQC: 'Yes',
        resolutionOutcome: 'Meeting held with HEQC panel. Clarifications provided.',
        meetingDate: '2023-11-15',
        supportingDocument: 'document.pdf', // Replace with actual URL or path if needed
        remarks: 'Initial appeal submitted after review.',
        declaration: true,
        decisionBAC: '', // Initially no decision
        decisionDetails: '',
      },
      {
        id: 2,
        institutionName: 'Bhutan College of Innovation',
        address: 'Paro Valley',
        dzongkhag: 'Paro',
        contact: '17YYYYYYY',
        email: 'admissions@bci.bt',
        reasonType: 'Recognition',
        reason: 'Appeal for recognition of new diploma program.',
        resolvedWithHEQC: 'No',
        resolutionOutcome: '',
        meetingDate: '',
        supportingDocument: null,
        remarks: 'Seeking recognition for the first time.',
        declaration: true,
        decisionBAC: 'Approved', // Example: Already approved
        decisionDetails: 'Program meets all recognition criteria.',
      },
      {
        id: 3,
        institutionName: 'Gedu College of Business Studies',
        address: 'Gedu, Chukha',
        dzongkhag: 'Chukha',
        contact: '17ZZZZZZZ',
        email: 'principal@gcbs.bt',
        reasonType: 'Others',
        reasonOthers: 'Program Review',
        reason: 'Appeal against program review recommendations.',
        resolvedWithHEQC: 'Yes',
        resolutionOutcome: 'Review panel recommendations reconsidered. Some modifications accepted.',
        meetingDate: '2023-12-01',
        supportingDocument: 'review_report.pdf',
        remarks: 'Appeal related to program review.',
        declaration: true,
        decisionBAC: 'Rejected', // Example: Rejected
        decisionDetails: 'Appeal did not provide sufficient justification to overturn review findings.',
      },
    ]);

    const isModalOpen = ref(false);
    const selectedAppeal = ref(null);
    const isEditMode = ref(false);
    const nextId = ref(4); // Track next ID for new appeals

    const viewAppeal = (appeal) => {
      selectedAppeal.value = { ...appeal }; // Create a copy to avoid direct mutation
      isModalOpen.value = true;
      isEditMode.value = false; // Reset edit mode when opening modal
    };

    const closeModal = () => {
      isModalOpen.value = false;
      selectedAppeal.value = null;
      isEditMode.value = false; // Reset edit mode when closing modal
    };

    const saveDecision = (appeal) => {
      // Find the appeal in the array and update it
      const index = appeals.value.findIndex(a => a.id === appeal.id);
      if (index !== -1) {
        // If in edit mode, update all fields
        if (isEditMode.value) {
          appeals.value[index] = { ...appeal };
          isEditMode.value = false; // Exit edit mode after saving
        } else {
          // Otherwise just update decision related fields
          appeals.value[index].decisionBAC = appeal.decisionBAC;
          appeals.value[index].decisionDetails = appeal.decisionDetails;
        }
      }

      // In a real application, you would send this updated appeal data to your backend.
      console.log('Decision Saved for Appeal ID:', appeal.id);
      closeModal(); // Close modal after saving
    };

    const generateCertificate = (appeal) => {
      // In a real application, this would trigger the certificate generation process.
      console.log('Generate Certificate for Appeal ID:', appeal.id);
      alert(`Certificate generation initiated for ${appeal.institutionName}'s appeal.`);
      // You would typically redirect to a certificate download page or handle it in a more sophisticated way.
    };

    // Edit mode functions
    const toggleEditMode = () => {
      if (isEditMode.value) {
        // If already in edit mode, save changes
        saveDecision(selectedAppeal.value);
      } else {
        // Enter edit mode
        isEditMode.value = true;
      }
    };

    const addNewAppeal = () => {
      const newAppeal = {
        id: nextId.value++,
        institutionName: 'New Institution',
        address: 'Address',
        dzongkhag: 'Dzongkhag',
        contact: 'Contact Number',
        email: 'email@example.bt',
        reasonType: 'Course Accreditation',
        reason: 'Reason for appeal',
        resolvedWithHEQC: 'No',
        resolutionOutcome: '',
        meetingDate: '',
        supportingDocument: null,
        remarks: '',
        declaration: true,
        decisionBAC: '',
        decisionDetails: '',
      };
      appeals.value.push(newAppeal);

      // Open the modal for the new appeal
      viewAppeal(newAppeal);
      isEditMode.value = true; // Automatically enter edit mode for new appeals
    };

    const removeAppeal = (id) => {
      if (confirm('Are you sure you want to delete this appeal?')) {
        const index = appeals.value.findIndex(a => a.id === id);
        if (index !== -1) {
          appeals.value.splice(index, 1);
        }
        closeModal(); // Close modal after deletion
      }
    };

    return {
      appeals,
      isModalOpen,
      selectedAppeal,
      isEditMode,
      viewAppeal,
      closeModal,
      saveDecision,
      generateCertificate,
      toggleEditMode,
      addNewAppeal,
      removeAppeal
    };
  }
}
</script>