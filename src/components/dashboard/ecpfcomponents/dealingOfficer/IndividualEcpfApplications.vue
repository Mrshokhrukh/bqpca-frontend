<!-- IndividualEcpfApplications.vue -->
<template>
  <div class="p-8 min-h-screen bg-gray-100">
    <div class="max-w-7xl mx-auto">
      <!-- Header with stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div>
              <p class="text-xs font-semibold text-gray-500 uppercase">Total Applications</p>
              <p class="text-xl font-bold text-gray-800">{{ applications.length }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p class="text-xs font-semibold text-gray-500 uppercase">Pending Review</p>
              <p class="text-xl font-bold text-gray-800">{{ getPendingCount() }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p class="text-xs font-semibold text-gray-500 uppercase">Shortlisted</p>
              <p class="text-xl font-bold text-gray-800">{{ getShortlistedCount() }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <p class="text-xs font-semibold text-gray-500 uppercase">Approved</p>
              <p class="text-xl font-bold text-gray-800">{{ getApprovedCount() }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Main heading -->
      <div class="mb-6">
        <h2 class="text-2xl font-bold text-gray-800">New ECPF Establishment Applications</h2>
      </div>

      <!-- Filter/Search bar -->
      <div class="mb-6 bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div class="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div class="flex-1">
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input type="text" class="block w-full rounded-lg border-gray-300 pl-10 py-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Search by name, CID, or firm...">
            </div>
          </div>
          <div class="w-full md:w-1/4">
            <select class="block w-full rounded-lg border-gray-300 py-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="">All Statuses</option>
              <option value="Pending Review">Pending Review</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Table View -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Applicant Name
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  CID No.
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Firm Name
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Contact No.
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Application Status
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white">
              <tr v-for="application in applications" :key="application.cidNo" class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-sm font-semibold mr-3">
                      {{ getInitials(application.applicantName) }}
                    </div>
                    <div>
                      <div class="text-sm font-medium text-gray-900">{{ application.applicantName }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ application.cidNo }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ application.firmName }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ application.contactNo }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getStatusClasses(application.applicationStatus)">
                    {{ application.applicationStatus }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex space-x-2">
                    <button
                      @click="viewApplication(application)"
                      class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors duration-200"
                    >
                      View
                    </button>
                    <button
                      @click="forwardApplication(application)"
                      class="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors duration-200"
                    >
                      Forward
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="applications.length === 0">
                <td colspan="6" class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">No applications found.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Pagination -->
      <div class="flex items-center justify-between py-4">
        <div class="flex-1 flex justify-between sm:hidden">
          <button class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Previous
          </button>
          <button class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            Next
          </button>
        </div>
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700">
              Showing <span class="font-medium">1</span> to <span class="font-medium">2</span> of <span class="font-medium">2</span> results
            </p>
          </div>
          <div>
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                <span class="sr-only">Previous</span>
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </button>
              <button class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                1
              </button>
              <button class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                <span class="sr-only">Next</span>
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>

    <ecpf-application-modal
      :is-open="isModalOpen"
      :application="selectedApplication"
      :close-modal="closeModal"
      @update-verification="handleVerificationUpdate"
      @update-evaluation="handleEvaluationUpdate"
      @update-mou="handleMouUpdate"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import EcpfApplicationModal from './modals/IndividualEcpfModal.vue'; // Import the modal component

// Mock Application Data (Replace with your actual data fetching logic)
const applications = ref([
  {
    cidNo: '12345678901',
    applicantName: 'Sonam Wangchuk',
    gender: 'Male',
    dateOfBirth: '1990-01-15',
    contactNo: '17123456',
    emailAddress: 'sonam@example.com',
    presentAddress: { officeNumber: '101', flatNo: 'A', buildingNo: 'XYZ Building', location: 'Thimphu', gewogThrom: 'Chang Gewog', dzongkhagThromde: 'Thimphu Thromde' },
    permanentAddress: { villageChiwog: 'Chang', gewog: 'Chang Gewog', dungkhag: '', dzongkhagThromde: 'Thimphu' },
    educationDetails: { qualification: 'Masters', instituteName: 'CST', universityName: 'RUB' },
    ecpfProposalDetails: { firmName: 'Tech Solutions ECPF', firmAddress: 'Norzin Lam', firmLocation: 'Thimphu', firmType: 'Independent' },
    purposeOfEstablishment: { vision: 'To provide quality counseling services.', mission: 'Empowering individuals through guidance.', objective: 'Reach 1000 clients in 3 years.' },
    humanResource: [{ position: 'Counselor', cid: '98765432109', fullName: 'Pema Dema', qualification: 'Bachelor in Psychology', contactNumber: '17654321', emailAddress: 'pema@example.com' }],
    financePlan: { details: 'Initial investment from personal savings.' },
    services: [{ category: 'Counseling', details: 'Individual and group counseling sessions.' }],
    swotAnalysis: { strengths: 'Experienced counselors', weaknesses: 'Limited initial funding', opportunities: 'Growing demand for mental health services', threats: 'Competition from established centers' },
    feeCharges: [{ breakup: 'Consultation Fee', description: 'Per session', amount: 500, totalAmount: 500 }],
    guarantorDetails: { fullName: 'Karma Dorji', cidNumber: '54321678901', relation: 'Brother', contactNumber: '17987654' },
    applicationStatus: 'Pending Review' // Example status
  },
  {
    cidNo: '98765432102',
    applicantName: 'Tashi Wangmo',
    gender: 'Female',
    dateOfBirth: '1992-05-20',
    firmName: 'Wellness Center',
    contactNo: '17456789',
    emailAddress: 'tashi@example.com',
    applicationStatus: 'Shortlisted', // Example status
    presentAddress: { officeNumber: '202', flatNo: 'B', buildingNo: 'PQR Building', location: 'Paro', gewogThrom: 'Dopshari Gewog', dzongkhagThromde: 'Paro Thromde' },
    permanentAddress: { villageChiwog: 'Dopshari', gewog: 'Dopshari Gewog', dungkhag: '', dzongkhagThromde: 'Paro' },
    educationDetails: { qualification: 'Masters in Counseling', instituteName: 'Paro College', universityName: 'Khesar Gyalpo University of Medical Sciences of Bhutan' },
    ecpfProposalDetails: { firmName: 'Wellness Center ECPF', firmAddress: 'Town Area', firmLocation: 'Paro', firmType: 'Collaboration' },
    purposeOfEstablishment: { vision: 'To be a leading wellness center.', mission: 'Promoting holistic wellbeing.', objective: 'Expand services to 3 Dzongkhags in 5 years.' },
    humanResource: [{ position: 'HR Manager', cid: '11223344556', fullName: 'Sangay Lhamo', qualification: 'MBA in HR', contactNumber: '17112233', emailAddress: 'sangay@example.com' }],
    financePlan: { details: 'Bank Loan and personal investment.' },
    services: [{ category: 'Yoga', details: 'Yoga and Meditation classes.' }],
    swotAnalysis: { strengths: 'Prime location', weaknesses: 'New in the market', opportunities: 'Growing health consciousness', threats: 'Economic downturn' },
    feeCharges: [{ breakup: 'Yoga Class Fee', description: 'Monthly', amount: 1500, totalAmount: 1500 }],
    guarantorDetails: { fullName: 'Dorji Phuntsho', cidNumber: '65432109876', relation: 'Friend', contactNumber: '17345678' },
  },
]);

const selectedApplication = ref(null);
const isModalOpen = ref(false);

const viewApplication = (application) => {
  selectedApplication.value = application;
  isModalOpen.value = true;
};

const forwardApplication = (application) => {
  // Implementation for forwarding the application
  console.log('Forwarding application:', application.cidNo);
  // You would implement the logic to forward the application here
  // For example, show a confirmation dialog or change the status
  alert(`Application for ${application.applicantName} has been forwarded.`);
};

const closeModal = () => {
  isModalOpen.value = false;
  selectedApplication.value = null;
};

const handleVerificationUpdate = (updateData) => {
  console.log('Verification Updated in Parent:', updateData);
  // Here you would typically update the application data in the `applications` ref
  // based on `updateData` (e.g., using CID to find the right application).
  // For mock data, you might need to find and update in the array.
  // In a real app, you'd likely refetch the applications list.
};

const handleEvaluationUpdate = (updateData) => {
  console.log('Evaluation Updated in Parent:', updateData);
  // Implement update logic similar to handleVerificationUpdate
};

const handleMouUpdate = (updateData) => {
  console.log('MoU Updated in Parent:', updateData);
  // Implement update logic similar to handleVerificationUpdate
};

const getStatusClasses = (status) => {
  return  [
    'px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap',
    {
      'bg-yellow-100 text-yellow-800': status === 'Pending Review',
      'bg-green-100 text-green-800': status === 'Shortlisted',    // Adjust status names to match your data
      'bg-red-100 text-red-800': status === 'Rejected',         // Adjust status names to match your data
      'bg-blue-100 text-blue-800': status === 'Approved',          // Adjust status names to match your data
      'bg-gray-100 text-gray-800': status === 'Draft',            // Adjust status names to match your data
      // Add more status mappings as needed based on your applicationStatus values
    }
  ];
};

// Helper functions for stats cards
const getPendingCount = () => {
  return applications.value.filter(app => app.applicationStatus === 'Pending Review').length;
};

const getShortlistedCount = () => {
  return applications.value.filter(app => app.applicationStatus === 'Shortlisted').length;
};

const getApprovedCount = () => {
  return applications.value.filter(app => app.applicationStatus === 'Approved').length;
};

// Helper function to get initials from name
const getInitials = (name) => {
  if (!name) return '';
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase();
};
</script>
