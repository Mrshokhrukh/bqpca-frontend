<template>
  <div class="p-6">
    <h2 class="text-xl font-semibold text-gray-800 mb-6">Application History</h2>

    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="w-full overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-200">
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Application ID
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Full Name
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Course Title
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Study In Country
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(item, index) in paginatedData" :key="index" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.applicationId }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.fullName }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.courseTitle }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.studyInCountry }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 space-x-2">
                <!-- Primary/View action -->
                <button @click="handleView(item)"
                  class="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-blue-600 hover:bg-blue-700">
                  View
                </button>
                <!-- Informational action -->
                <button @click="handleAddNote(item)"
                  class="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-cyan-600 hover:bg-cyan-700">
                  Add Note
                </button>
                <!-- File management -->
                <button @click="handleReUpload(item)"
                  class="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-indigo-600 hover:bg-indigo-700">
                  Re-upload
                </button>
                <!-- Process action -->
                <button @click="handleReProcess(item)"
                  class="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700">
                  Re-process
                </button>
                <!-- Forward/progress action -->
                <button @click="handleForward(item)"
                  class="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-teal-600 hover:bg-teal-700">
                  Forward
                </button>
                <!-- Destructive action -->
                <button @click="handleRegret(item)"
                  class="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700">
                  Regret
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
        <div class="flex items-center justify-between">
          <div class="flex-1 flex items-center justify-between">
            <div class="text-sm text-gray-700">
              Page {{ currentPage }} of {{ totalPages }}
            </div>
            <div class="flex space-x-2">
              <button @click="prevPage" :disabled="currentPage === 1"
                class="relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md" :class="[
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300',
                ]">
                Previous
              </button>
              <button @click="nextPage" :disabled="currentPage === totalPages"
                class="relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md" :class="[
                  currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300',
                ]">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Dialog -->
    <div v-if="showDialog"
      class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 overflow-y-auto">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-4xl my-8">
        <div class="sticky top-0 bg-white px-6 py-4 border-b border-gray-200">
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-medium text-gray-900">{{ dialogTitle }}</h3>
            <button @click="closeDialog" class="text-gray-400 hover:text-gray-500">
              <span class="sr-only">Close</span>
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div class="px-6 py-4 max-h-[calc(100vh-12rem)] overflow-y-auto">
          <UpdateApplication v-if="dialogMode === 'edit'" :application="selectedApplication"
            :isViewMode="dialogTitle === 'View Application'" />
          <div v-else-if="dialogMode === 'note'" class="space-y-4">
            <textarea
              class="w-full h-32 px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
              v-model="noteContent" placeholder="Enter your note here..."></textarea>
          </div>
          <div v-else-if="dialogMode === 'reupload'" class="space-y-4">
            <!-- Add your re-upload form here -->
            <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input type="file" class="hidden" ref="fileInput" @change="handleFileChange" multiple />
              <button @click="$refs.fileInput.click()"
                class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                Select Files
              </button>
              <p class="mt-2 text-sm text-gray-500">or drag and drop files here</p>
            </div>
          </div>
          <div v-else-if="dialogMode === 'forward'" class="space-y-4">
            <!-- Add your forward form here -->
            <div class="space-y-4">
              <select v-model="selectedForwardTo"
                class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500">
                <option value="">Select recipient</option>
                <option value="supervisor">Supervisor</option>
                <option value="manager">Manager</option>
                <option value="director">Director</option>
              </select>
              <textarea
                class="w-full h-32 px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:border-blue-500"
                v-model="forwardComment" placeholder="Add a comment (optional)"></textarea>
            </div>
          </div>
        </div>
        <div
          class="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-200 rounded-b-lg flex justify-end space-x-3">
          <button v-if="dialogMode === 'note'" @click="saveNote"
            class="bg-blue-600 py-2 px-4 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700">
            Save Note
          </button>
          <button v-if="dialogMode === 'reupload'" @click="submitFiles"
            class="bg-blue-600 py-2 px-4 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700">
            Upload Files
          </button>
          <button v-if="dialogMode === 'forward'" @click="submitForward"
            class="bg-blue-600 py-2 px-4 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700">
            Forward
          </button>
          <button @click="closeDialog"
            class="bg-white py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import UpdateApplication from './UpdateApplication.vue';

// State
const applications = ref([
  {
    applicationId: '1',
    cid: 'CID001',
    fullName: 'John Doe',
    courseTitle: 'Computer Science',
    studyInCountry: 'USA',
    status: 'Pending',
    // Additional fields for dialog
    dateOfBirth: '1990-01-01',
    contactNumber: '1234567890',
    emailAddress: 'john@example.com',
    qualification: 'Bachelor',
    type_of_course: 'Full-time',
    studentIdNo: 'S123456',
    nameOfInstitute: 'XYZ Institute',
    university: 'XYZ University',
    course_duration: '4 years',
    year_completion: '2025',
    location: 'New York',
    country: 'USA',
    website: 'https://example.com',
    documentType: 'Passport'
  },
  {
    applicationId: '2',
    cid: 'CID002',
    fullName: 'Jane Smith',
    courseTitle: 'MBA',
    studyInCountry: 'Canada',
    status: 'Approved',
    // Additional fields for dialog
    dateOfBirth: '1995-05-10',
    contactNumber: '9876543210',
    emailAddress: 'jane@example.com',
    qualification: 'Master',
    type_of_course: 'Part-time',
    studentIdNo: 'S654321',
    nameOfInstitute: 'ABC Institute',
    university: 'ABC University',
    course_duration: '2 years',
    year_completion: '2024',
    location: 'Toronto',
    country: 'Canada',
    website: 'https://example2.com',
    documentType: 'ID Card',
  },
  {
    applicationId: '3',
    cid: 'CID003',
    fullName: 'Bob Johnson',
    courseTitle: 'Medicine',
    studyInCountry: 'UK',
    status: 'Rejected',
    // Additional fields for dialog
    dateOfBirth: '1992-11-20',
    contactNumber: '7890123456',
    emailAddress: 'bob@example.com',
    qualification: 'PHD',
    type_of_course: 'Full-time',
    studentIdNo: 'S789012',
    nameOfInstitute: 'LMN Institute',
    university: 'LMN University',
    course_duration: '5 years',
    year_completion: '2026',
    location: 'London',
    country: 'UK',
    website: 'https://example3.com',
    documentType: 'Visa',
  },
]);


// UI State
const currentPage = ref(1);
const pageSize = ref(5);
const showDialog = ref(false);
const selectedApplication = ref(null);
const dialogMode = ref('');
const dialogTitle = ref('');
const noteContent = ref('');
const selectedFiles = ref([]);
const selectedForwardTo = ref('');
const forwardComment = ref('');

// Computed
const totalPages = computed(() => Math.ceil(applications.value.length / pageSize.value));

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return applications.value.slice(start, end);
});

// Navigation Methods
const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};

// Dialog Management
const openDialog = (mode, item, title) => {
  selectedApplication.value = item;
  dialogMode.value = mode;
  dialogTitle.value = title;
  showDialog.value = true;
};

const closeDialog = () => {
  showDialog.value = false;
  selectedApplication.value = null;
  dialogMode.value = '';
  dialogTitle.value = '';
  noteContent.value = '';
  selectedFiles.value = [];
  selectedForwardTo.value = '';
  forwardComment.value = '';
};

// Action Handlers
const handleView = (item) => {
  openDialog('edit', item, 'View Application'); // Using 'edit' mode to show UpdateApplication component
};

const handleAddNote = (item) => {
  openDialog('note', item, 'Add Note');
};

const handleReUpload = (item) => {
  openDialog('reupload', item, 'Re-upload Documents');
};

const handleReProcess = (item) => {
  if (confirm('Are you sure you want to re-process this application?')) {
    // Add your re-process logic here
    console.log('Re-processing application:', item.applicationId);
  }
};

const handleForward = (item) => {
  openDialog('forward', item, 'Forward Application');
};

const handleRegret = (item) => {
  if (confirm('Are you sure you want to regret this application?\nThis action cannot be undone.')) {
    // Add your regret logic here
    console.log('Regretting application:', item.applicationId);
  }
};

// File Handling
const handleFileChange = (event) => {
  selectedFiles.value = Array.from(event.target.files);
};

const submitFiles = async () => {
  if (selectedFiles.value.length === 0) {
    alert('Please select files to upload');
    return;
  }

  try {
    // Add your file upload logic here
    console.log('Uploading files for application:', selectedApplication.value.applicationId);
    console.log('Files:', selectedFiles.value);
    closeDialog();
  } catch (error) {
    console.error('Error uploading files:', error);
    alert('Error uploading files. Please try again.');
  }
};

// Note Handling
const saveNote = async () => {
  if (!noteContent.value.trim()) {
    alert('Please enter a note before saving.');
    return;
  }

  try {
    // Add your note saving logic here
    console.log('Saving note for application:', selectedApplication.value.applicationId);
    console.log('Note content:', noteContent.value);
    closeDialog();
  } catch (error) {
    console.error('Error saving note:', error);
    alert('Error saving note. Please try again.');
  }
};

// Forward Handling
const submitForward = async () => {
  if (!selectedForwardTo.value) {
    alert('Please select a recipient');
    return;
  }

  try {
    // Add your forward logic here
    console.log('Forwarding application:', selectedApplication.value.applicationId);
    console.log('Forward to:', selectedForwardTo.value);
    console.log('Comment:', forwardComment.value);
    closeDialog();
  } catch (error) {
    console.error('Error forwarding application:', error);
    alert('Error forwarding application. Please try again.');
  }
};
</script>

<style scoped>
.table-container {
  overflow-x: auto;
}
</style>
