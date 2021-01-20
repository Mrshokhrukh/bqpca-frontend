<template>
  <div class="table-container p-4">
    <table class="w-full border-collapse border border-gray-300">
      <thead class="bg-gray-200">
        <tr>
          <th class="border border-gray-300 p-2">Application ID</th>
          <th class="border border-gray-300 p-2">CID</th>
          <th class="border border-gray-300 p-2">Full Name</th>
          <th class="border border-gray-300 p-2">Date of Birth</th>
          <th class="border border-gray-300 p-2">Contact Number</th>
          <th class="border border-gray-300 p-2">Email Address</th>
          <th class="border border-gray-300 p-2">Study In Country</th>
          <th class="border border-gray-300 p-2">Course Title</th>
          <th class="border border-gray-300 p-2">Qualification</th>
          <th class="border border-gray-300 p-2">Type of Course</th>
          <th class="border border-gray-300 p-2">Student ID No</th>
          <th class="border border-gray-300 p-2">Name of Institute</th>
          <th class="border border-gray-300 p-2">University</th>
          <th class="border border-gray-300 p-2">Course Duration</th>
          <th class="border border-gray-300 p-2">Year of Completion</th>
          <th class="border border-gray-300 p-2">Location</th>
          <th class="border border-gray-300 p-2">Country</th>
          <th class="border border-gray-300 p-2">Website</th>
          <th class="border border-gray-300 p-2">Secondcopy</th>
          <th class="border border-gray-300 p-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in paginatedData" :key="index" class="odd:bg-white even:bg-gray-50">
          <td class="border border-gray-300 p-2">{{ item.applicationId }}</td>
          <td class="border border-gray-300 p-2">{{ item.cid }}</td>
          <td class="border border-gray-300 p-2">{{ item.fullName }}</td>
          <td class="border border-gray-300 p-2">{{ item.dateOfBirth }}</td>
          <td class="border border-gray-300 p-2">{{ item.contactNumber }}</td>
          <td class="border border-gray-300 p-2">{{ item.emailAddress }}</td>
          <td class="border border-gray-300 p-2">{{ item.studyInCountry }}</td>
          <td class="border border-gray-300 p-2">{{ item.courseTitle }}</td>
          <td class="border border-gray-300 p-2">{{ item.qualification }}</td>
          <td class="border border-gray-300 p-2">{{ item.type_of_course }}</td>
          <td class="border border-gray-300 p-2">{{ item.studentIdNo }}</td>
          <td class="border border-gray-300 p-2">{{ item.nameOfInstitute }}</td>
          <td class="border border-gray-300 p-2">{{ item.university }}</td>
          <td class="border border-gray-300 p-2">{{ item.course_duration }}</td>
          <td class="border border-gray-300 p-2">{{ item.year_completion }}</td>
          <td class="border border-gray-300 p-2">{{ item.location }}</td>
          <td class="border border-gray-300 p-2">{{ item.country }}</td>
          <td class="border border-gray-300 p-2">{{ item.website }}</td>
          <td class="border border-gray-300 p-2">{{ item.secondcopy_status }}</td>
          <td class="border border-gray-300 p-2 flex gap-2">
            <button class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600" @click="confirmAction(item)">Confirm</button>
            <button class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600" @click="cancelAction(item)">Cancel</button>
            <button class="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600" @click="openDialog(item)">View</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Pagination -->
    <div class="mt-4 flex justify-between items-center">
      <button class="bg-gray-300 text-gray-700 px-3 py-1 rounded hover:bg-gray-400" :disabled="currentPage === 1" @click="prevPage">Previous</button>
      <div>Page {{ currentPage }} of {{ totalPages }}</div>
      <button class="bg-gray-300 text-gray-700 px-3 py-1 rounded hover:bg-gray-400" :disabled="currentPage === totalPages" @click="nextPage">Next</button>
    </div>

    <!-- Dialog Box -->
    <div v-if="showDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white p-6 rounded shadow-md w-3/4 max-h-[90vh] overflow-y-auto">
        <h2 class="text-lg font-bold mb-4"> Second Copy Update Application</h2>
        <secondcopyUpadateApplication :application="selectedApplication" />
        <div class="mt-4 flex justify-end gap-2">
          <button class="bg-gray-300 text-gray-700 px-3 py-1 rounded hover:bg-gray-400" @click="closeDialog">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import secondcopyUpadateApplication from './SecondCopylUpdateApplication.vue';

// Sample data for the table
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
    secondcopy_status: true,
    documentType: 'Passport',
  },
  // Add more sample objects as needed
]);

// Pagination state
const currentPage = ref(1);
const pageSize = ref(5);
const totalPages = computed(() => Math.ceil(applications.value.length / pageSize.value));

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return applications.value.slice(start, end);
});

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};

// Dialog state
const showDialog = ref(false);
const selectedApplication = ref(null);

const openDialog = (item) => {
  selectedApplication.value = item;
  showDialog.value = true;
};

const closeDialog = () => {
  showDialog.value = false;
  selectedApplication.value = null;
};

// Button action handlers
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
