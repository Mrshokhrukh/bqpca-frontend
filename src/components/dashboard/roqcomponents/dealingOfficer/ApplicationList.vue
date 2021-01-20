<template>
  <div class="p-6">
    <h2 class="text-xl font-semibold text-gray-800 mb-6">Application History</h2>

    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="w-full overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-200">
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Application ID
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CID</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Full Name</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date of Birth
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Number
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email Address
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Study In
                Country</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course Title
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qualification
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type of Course
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student ID No
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name of
                Institute</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">University</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course Duration
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Year of
                Completion</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Country</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Website</th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(item, index) in paginatedData" :key="index" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.applicationId }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.cid }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ item.fullName }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.dateOfBirth }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.contactNumber }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.emailAddress }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.studyInCountry }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.courseTitle }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.qualification }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.type_of_course }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.studentIdNo }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.nameOfInstitute }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.university }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.course_duration }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.year_completion }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.location }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.country }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ item.website }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                <button @click="confirmAction(item)"
                  class="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                  Confirm
                </button>
                <button @click="cancelAction(item)"
                  class="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700">
                  Cancel
                </button>
                <button @click="openDialog(item)"
                  class="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700">
                  View
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
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                ]">
                Previous
              </button>
              <button @click="nextPage" :disabled="currentPage === totalPages"
                class="relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md" :class="[
                  currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
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
      <div class="bg-white rounded-lg shadow-xl w-full max-w-4xl my-8"> <!-- Increased from max-w-2xl to max-w-4xl -->
        <div class="sticky top-0 bg-white px-6 py-4 border-b border-gray-200">
          <div class="flex justify-between items-center">
            <h3 class="text-lg font-medium text-gray-900">Update Application</h3>
            <button @click="closeDialog" class="text-gray-400 hover:text-gray-500">
              <span class="sr-only">Close</span>
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div class="px-6 py-4 max-h-[calc(100vh-12rem)] overflow-y-auto">
          <!-- Increased height from -16rem to -12rem -->
          <UpadateApplication :application="selectedApplication" />
        </div>
        <div class="sticky bottom-0 bg-gray-50 px-6 py-4 border-t border-gray-200 rounded-b-lg flex justify-end">
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
// Keep your existing script code exactly as it is
import { ref, computed } from 'vue';
import UpadateApplication from './UpdateApplication.vue';

const applications = ref([
  {
    applicationId: '1',
    cid: 'CID001',
    fullName: 'John Doe',
    dateOfBirth: '1990-01-01',
    contactNumber: '1234567890',
    emailAddress: 'john@example.com',
    studyInCountry: 'USA',
    courseTitle: 'Computer Science',
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
    documentType: 'Passport',
  },
]);

const currentPage = ref(1);
const pageSize = ref(5);
const totalPages = computed(() => Math.ceil(applications.value.length / pageSize.value));

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return applications.value.slice(start, end);
});

const showDialog = ref(false);
const selectedApplication = ref(null);

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};

const openDialog = (item) => {
  selectedApplication.value = item;
  showDialog.value = true;
};

const closeDialog = () => {
  showDialog.value = false;
  selectedApplication.value = null;
};

const confirmAction = (item) => {
  alert(`Confirming application for ${item.fullName}`);
};

const cancelAction = (item) => {
  alert(`Cancelling application for ${item.fullName}`);
};
</script>

<style scoped>
.table-container {
  overflow-x: auto;
}
</style>