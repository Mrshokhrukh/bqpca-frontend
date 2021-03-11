<template>
  <div class="p-8 min-h-screen bg-gray-50">
    <div class="bg-white rounded-xl p-8 mb-10 shadow-sm border border-gray-100">
      <h1 class="text-4xl font-bold text-gray-900 mb-3">Teaching Hospitals</h1>
      <div class="flex items-center text-gray-600">
        <span class="flex items-center">
          <span class="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
          Total: {{ teachingCenters.length }}
        </span>
        <!-- You can add more status indicators here if needed, e.g., for approved/pending hospitals -->
      </div>
    </div>

    <!-- Search and Filter (if needed for hospitals, you can add these back) -->
    <!--
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      <div class="relative">
        <input type="text" placeholder="Search hospitals..."
          class="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2"
          fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <div class="flex gap-4">
        <select
          class="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          <option value="all">All Specialties</option>
          <option value="Cardiology">Cardiology</option>
          <option value="Pediatrics">Pediatrics</option>
          </select>
      </div>
    </div>
    -->

    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Name
              </th>
              <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                City
              </th>
              <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Specialty
              </th>
              <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Capacity
              </th>
              <th scope="col" class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="center in teachingCenters" :key="center.id" class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900">{{ center.name }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ center.city }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {{ center.specialty }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ center.capacity }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div class="flex space-x-3">
                  <button @click="openModal(center)"
                    class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors duration-200">
                    View
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pagination (if needed) -->
    <!--
    <div class="mt-6 flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-100">
      <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p class="text-sm text-gray-700">
            Showing
            <span class="font-medium">1</span>
            to
            <span class="font-medium">5</span>
            of
            <span class="font-medium">{{ teachingCenters.length }}</span>
            results
          </p>
        </div>
        <div>
          <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <button class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50">
              <span class="sr-only">Previous</span>
              <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd"
                  d="M12 1.586l-9.707 9.707a1 1 0 0 1-1.414-1.414l10.414-10.414a1 1 0 0 1 1.414 0l10.414 10.414a1 1 0 0 1-1.414 1.414L12 1.586z"
                  clip-rule="evenodd" />
              </svg>
            </button>
            <button class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50">
              <span class="sr-only">Next</span>
              <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd"
                  d="M12 18.414l9.707-9.707a1 1 0 0 0-1.414-1.414L12 15.586 3.707 7.293a1 1 0 0 0-1.414 1.414l9.707 9.707z"
                  clip-rule="evenodd" />
              </svg>
            </button>
          </nav>
        </div>
      </div>
    </div>
    -->

    <TeachingHospitalsDetailsModal :is-open="isModalOpen" :hospital-details="selectedHospital" @close-modal="closeModal"
      @approve="handleApprove" @regret="handleRegret" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import TeachingHospitalsDetailsModal from '../modals/TeachingHospitalsDetailsModal.vue'; // Adjust path if needed

// Static data for teaching centers (replace with your actual data or API call later)
const teachingCenters = ref([
  {
    id: 1, name: 'General Hospital of City A', city: 'City A', specialty: 'General Medicine', capacity: 15,
    // Example data matching the Institute model fields for demonstration
    CID: 'CID123', name_of_institution: 'General Hospital of City A', contact_no: '123-456-7890', email_address: 'info@hospitalA.com', country: 'Country A', address: 'Hospital Address A', teaching_institute: 'General Medicine Institute', title_of_course: 'General Medicine Course', website: 'www.hospitalA.com', remarks: 'Some remarks about Hospital A'
  },
  {
    id: 2, name: 'Specialized Heart Center', city: 'City B', specialty: 'Cardiology', capacity: 8,
    CID: 'CID456', name_of_institution: 'Specialized Heart Center', contact_no: '987-654-3210', email_address: 'cardio@heartcenter.com', country: 'Country B', address: 'Heart Center Road', teaching_institute: 'Cardiology Institute', title_of_course: 'Cardiology Specialization', website: 'www.heartcenter.com', remarks: 'Remarks for Heart Center'
  },
  {
    id: 3, name: 'Children\'s Medical Institute', city: 'City C', specialty: 'Pediatrics', capacity: 20,
    CID: 'CID789', name_of_institution: 'Children\'s Medical Institute', contact_no: '555-123-4567', email_address: 'pediatrics@childrens.org', country: 'Country C', address: 'Childrens Institute Lane', teaching_institute: 'Pediatrics Institute', title_of_course: 'Pediatric Medicine Program', website: 'www.childrens-institute.com', remarks: 'Notes on Childrens Institute'
  },
  {
    id: 4, name: 'Neuroscience Teaching Hospital', city: 'City D', specialty: 'Neurology', capacity: 12,
    CID: 'CID101', name_of_institution: 'Neuroscience Teaching Hospital', contact_no: '111-222-3333', email_address: 'neuro@brainhospital.com', country: 'Country D', address: 'Neuro Hospital Drive', teaching_institute: 'Neuroscience Institute', title_of_course: 'Advanced Neurology Studies', website: 'www.neurohospital.com', remarks: 'Hospital for Neuroscience'
  },
  {
    id: 5, name: 'Orthopedic & Trauma Center', city: 'City E', specialty: 'Orthopedics', capacity: 10,
    CID: 'CID202', name_of_institution: 'Orthopedic & Trauma Center', contact_no: '444-555-6666', email_address: 'ortho@bonescenter.com', country: 'Country E', address: 'Orthopedic Plaza', teaching_institute: 'Orthopedics Institute', title_of_course: 'Orthopedic Surgery Training', website: 'www.orthocenter.com', remarks: 'Trauma and Orthopedic specialization'
  },
]);

const isModalOpen = ref(false);
const selectedHospital = ref({});

const openModal = (center) => {
  selectedHospital.value = center;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  selectedHospital.value = {}; // Clear selected hospital data when closing
};

const handleApprove = () => {
  // Handle approve logic here (e.g., send API request)
  console.log('Approved:', selectedHospital.value.name_of_institution);
  closeModal(); // Close modal after action
};

const handleRegret = () => {
  // Handle regret logic here (e.g., send API request)
  console.log('Regretted:', selectedHospital.value.name_of_institution);
  closeModal(); // Close modal after action
};
</script>
