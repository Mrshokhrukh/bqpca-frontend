<!-- BranchEcpfApplications.vue (or your table component file) -->
<template>
  <div class="p-8 min-h-screen ">
    <div class="mx-auto">
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
              <p class="text-xs font-semibold text-gray-500 uppercase">Pending</p>
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
              <p class="text-xs font-semibold text-gray-500 uppercase">Approved</p>
              <p class="text-xl font-bold text-gray-800">{{ getApprovedCount() }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div class="flex items-center">
            <div class="p-3 rounded-full bg-red-100 text-red-600 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p class="text-xs font-semibold text-gray-500 uppercase">Rejected</p>
              <p class="text-xl font-bold text-gray-800">{{ getRejectedCount() }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Main heading -->
      <div class="mb-6">
        <h2 class="text-2xl font-bold text-gray-800">ECPF Collaboration Applications</h2>
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
              <input type="text" class="block w-full rounded-lg border-gray-300 pl-10 py-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Search by name, ECPF, or external party...">
            </div>
          </div>
          <div class="w-full md:w-1/4">
            <select class="block w-full rounded-lg border-gray-300 py-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="in-review">In Review</option>
            </select>
          </div>
          <div class="w-full md:w-1/4">
            <select class="block w-full rounded-lg border-gray-300 py-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="applicant">Applicant Name</option>
              <option value="ecpf">Proposed ECPF Name</option>
              <option value="external">External Party</option>
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
                  Proposed ECPF Name
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  External Party
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white">
              <tr v-for="application in applications" :key="application.id" class="hover:bg-gray-50 transition-colors">
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
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ application.proposedECPFName }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ application.externalParty }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getStatusClasses(application.status)">
                    {{ application.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div class="flex space-x-2">
                    <button
                      @click="openModal(application)"
                      class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors duration-200"
                    >
                      View
                    </button>
                    <button
                      class="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors duration-200"
                    >
                      Forward
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="applications.length === 0">
                <td colspan="5" class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">No applications found.</td>
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
              Showing <span class="font-medium">1</span> to <span class="font-medium">4</span> of <span class="font-medium">{{ applications.length }}</span> results
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
              <button aria-current="page" class="z-10 bg-blue-50 border-blue-500 text-blue-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                1
              </button>
              <button class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                2
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

      <!--  Use the Modal Component Here -->
      <ecpf-application-modal
        :is-open="isModalOpen"
        :application="selectedApplication"
        @close-modal="closeModal"
        @save-actions="saveApplicationActions"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import EcpfApplicationModal from './modals/EcpfBranchModal.vue'; // Import the modal component

const isModalOpen = ref(false);
const selectedApplication = ref(null);

const applications = ref([
  {
    id: 1,
    applicantName: 'Alice Johnson',
    applicantInitials: 'AJ',
    proposedECPFName: 'Johnson Enterprises',
    externalParty: 'QRS Pty Ltd',
    status: 'Approved',
    statusClass: 'status-approved',
    personalInfo: {
      cidNo: '12345678901',
      applicantsName: 'Alice Johnson',
      gender: 'Female',
      dateOfBirth: '1990-01-15',
      contactNo: '17123456',
      emailAddress: 'alice.johnson@example.com',
    },
    residentialAddress: {
      officeNumber: '101',
      flatNo: 'Apt 2B',
      buildingNo: 'Building 5',
      location: 'Thimphu',
      gewogThrom: 'Chang Gewog',
      dzongkhagThromde: 'Thimphu Thromde',
    },
    permanentAddress: {
      villageChiwog: 'Changangkha',
      gewog: 'Chang Gewog',
      dungkhag: '',
      dzongkhagThromde: 'Thimphu',
    },
    existingECPFDetails: {
      nameOfExistingECPF: 'N/A',
    },
    proposalDetails: {
      addressOfProposedFirm: 'New Industrial Area',
      locationOfProposedFirm: 'Paro',
      typeOfFirm: 'Sole Proprietorship',
    },
    infrastructure: [
      { particulars: 'Office Space', description: '500 sqft', quantity: '1', remarks: 'Rented' },
      { particulars: 'Computers', description: 'Desktop PCs', quantity: '5', remarks: 'New' },
    ],
    humanResource: [
      { position: 'Manager', cid: '98765432109',
        fullName: 'John Manager', qualification: 'MBA', contactNumber: '17654321',
        emailAddress: 'john.manager@example.com', cvCertificates: '#' },
    ],
    financePlan: {
      financePlanDetails: 'Detailed finance plan document...',
    },
    services: [
      { serviceCategory: 'Consulting', details: 'Business consulting services' },
      { serviceCategory: 'Training', details: 'Professional training programs' },
    ],
    swotAnalysis: {
      strengths: 'Strong market knowledge',
      weaknesses: 'Limited initial capital',
      opportunities: 'Growing demand for services',
      threats: 'Competition from established firms',
    },
    feeCharges: [
      { feeBreakup: 'Registration Fee', description: 'One-time registration', amount: 500 },
      { feeBreakup: 'Annual Fee', description: 'Yearly renewal', amount: 200 },
    ],
    supportingDocuments: {
      cvApplicant: '#',
      declaration: '#',
    },
  },
  {
    id: 2,
    applicantName: 'Bob Williams',
    applicantInitials: 'BW',
    proposedECPFName: 'Williams Group',
    externalParty: 'TUV Inc',
    status: 'Rejected',
    statusClass: 'status-rejected',
     personalInfo: {
      cidNo: '98765432102',
      applicantsName: 'Bob Williams',
      gender: 'Male',
      dateOfBirth: '1985-05-20',
      contactNo: '17456789',
      emailAddress: 'bob.williams@example.com',
    },
    residentialAddress: {
      officeNumber: '201',
      flatNo: 'Apt 3A',
      buildingNo: 'Building 2',
      location: 'Paro',
      gewogThrom: 'Paro Thromde',
      dzongkhagThromde: 'Paro Thromde',
    },
    permanentAddress: {
      villageChiwog: 'Drugyel Dzong',
      gewog: 'Dopshari Gewog',
      dungkhag: '',
      dzongkhagThromde: 'Paro',
    },
    existingECPFDetails: {
      nameOfExistingECPF: 'Williams Enterprises',
    },
    proposalDetails: {
      addressOfProposedFirm: 'Industrial Park',
      locationOfProposedFirm: 'Phuentsholing',
      typeOfFirm: 'Partnership',
    },
    infrastructure: [
      { particulars: 'Warehouse', description: '1000 sqft', quantity: '1', remarks: 'Owned' },
      { particulars: 'Vehicles', description: 'Delivery Vans', quantity: '2', remarks: 'Leased' },
    ],
    humanResource: [
      { position: 'Supervisor', cid: '11223344556',
        fullName: 'Sarah Supervisor', qualification: 'B.Com', contactNumber: '17112233',
        emailAddress: 'sarah.supervisor@example.com', cvCertificates: '#' },
    ],
    financePlan: {
      financePlanDetails: 'Detailed finance plan document for Williams Group...',
    },
    services: [
      { serviceCategory: 'Distribution', details: 'Product distribution services' },
    ],
    swotAnalysis: {
      strengths: 'Established distribution network',
      weaknesses: 'High operational costs',
      opportunities: 'Expanding market reach',
      threats: 'Economic downturn',
    },
    feeCharges: [
      { feeBreakup: 'Application Fee', description: 'Initial application processing', amount: 300 },
    ],
    supportingDocuments: {
      cvApplicant: '#',
      declaration: '#',
    },
  },
  {
    id: 3,
    applicantName: 'Jane Smith',
    applicantInitials: 'JS',
    proposedECPFName: 'Smith Ltd',
    externalParty: 'XYZ Ltd',
    status: 'In Review',
    statusClass: 'status-in-review',
     personalInfo: {
      cidNo: '1234567892',
      applicantsName: 'Jane Smith',
      gender: 'Female',
      dateOfBirth: '1992-08-10',
      contactNo: '17987654',
      emailAddress: 'jane.smith@example.com',
    },
    residentialAddress: {
      officeNumber: '301',
      flatNo: 'Apt 1C',
      buildingNo: 'Building 7',
      location: 'Gelephu',
      gewogThrom: 'Gelephu Thromde',
      dzongkhagThromde: 'Sarpang',
    },
    permanentAddress: {
      villageChiwog: 'Pelrithang',
      gewog: 'Gelephu Gewog',
      dungkhag: 'Sarpang Dungkhag',
      dzongkhagThromde: 'Sarpang',
    },
    existingECPFDetails: {
      nameOfExistingECPF: 'N/A',
    },
    proposalDetails: {
      addressOfProposedFirm: 'Commercial Area',
      locationOfProposedFirm: 'Samdrup Jongkhar',
      typeOfFirm: 'Limited Company',
    },
    infrastructure: [
      { particulars: 'Showroom', description: '800 sqft', quantity: '1', remarks: 'Rented' },
      { particulars: 'Display Units', description: 'Custom made', quantity: '10', remarks: 'Purchased' },
    ],
    humanResource: [
      { position: 'Sales Representative', cid: '65432109876',
        fullName: 'Peter Sales', qualification: 'High School', contactNumber: '17345678',
        emailAddress: 'peter.sales@example.com', cvCertificates: '#' },
    ],
    financePlan: {
      financePlanDetails: 'Detailed finance plan document for Smith Ltd...',
    },
    services: [
      { serviceCategory: 'Retail', details: 'Retail sales of goods' },
    ],
    swotAnalysis: {
      strengths: 'Prime location',
      weaknesses: 'New brand in the market',
      opportunities: 'Growing local market',
      threats: 'Established retail chains',
    },
    feeCharges: [
      { feeBreakup: 'License Fee', description: 'Business license', amount: 400 },
    ],
    supportingDocuments: {
      cvApplicant: '#',
      declaration: '#',
    },
  },
  {
    id: 4,
    applicantName: 'John Doe',
    applicantInitials: 'JD',
    proposedECPFName: 'Doe Inc',
    externalParty: 'ABC Corp',
    status: 'Pending',
    statusClass: 'status-pending',
     personalInfo: {
      cidNo: '54321678901',
      applicantsName: 'John Doe',
      gender: 'Male',
      dateOfBirth: '1988-11-25',
      contactNo: '17121212',
      emailAddress: 'john.doe@example.com',
    },
    residentialAddress: {
      officeNumber: '401',
      flatNo: 'Apt 4D',
      buildingNo: 'Building 1',
      location: 'Trashigang',
      gewogThrom: 'Trashigang Thromde',
      dzongkhagThromde: 'Trashigang',
    },
    permanentAddress: {
      villageChiwog: 'Kanglung',
      gewog: 'Kanglung Gewog',
      dungkhag: 'Trashigang Dungkhag',
      dzongkhagThromde: 'Trashigang',
    },
    existingECPFDetails: {
      nameOfExistingECPF: 'Doe Company',
    },
    proposalDetails: {
      addressOfProposedFirm: 'Main Market Area',
      locationOfProposedFirm: 'Mongar',
      typeOfFirm: 'Corporation',
    },
    infrastructure: [
      { particulars: 'Office Furniture', description: 'Desks and Chairs', quantity: '10', remarks: 'Existing' },
      { particulars: 'Server Room', description: 'Climate controlled', quantity: '1', remarks: 'Dedicated' },
    ],
    humanResource: [
      { position: 'IT Technician', cid: '98765000000',
        fullName: 'Emily Tech', qualification: 'BSc IT', contactNumber: '17000000',
        emailAddress: 'emily.tech@example.com', cvCertificates: '#' },
    ],
    financePlan: {
      financePlanDetails: 'Detailed finance plan document for Doe Inc...',
    },
    services: [
      { serviceCategory: 'IT Services', details: 'Software development and support' },
    ],
    swotAnalysis: {
      strengths: 'Experienced IT team',
      weaknesses: 'Limited client base',
      opportunities: 'Growing IT sector',
      threats: 'Rapid technological changes',
    },
    feeCharges: [
      { feeBreakup: 'Processing Fee', description: 'Application processing', amount: 250 },
    ],
    supportingDocuments: {
      cvApplicant: '#',
      declaration: '#',
    },
  },
]);

const openModal = (application) => {
  selectedApplication.value = application;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  selectedApplication.value = null;
};

const saveApplicationActions = (actionData) => {
  // Handle saving actions received from the modal
  console.log('Saving application actions:', actionData);
  closeModal(); // Close modal after save
  // Here you would typically send the actionData to your backend API
  // to update the application with the dealing officer's actions.
};


const getStatusClasses = (status) => {
  return  [
    'px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap',
    {
      'bg-yellow-100 text-yellow-800': status === 'Pending',
      'bg-green-100 text-green-800': status === 'Approved',
      'bg-red-100 text-red-800': status === 'Rejected',
      'bg-blue-100 text-blue-800': status === 'In Review',
    }
  ];
};

// Helper functions for stats cards
const getPendingCount = () => {
  return applications.value.filter(app => app.status === 'Pending').length;
};

const getApprovedCount = () => {
  return applications.value.filter(app => app.status === 'Approved').length;
};

const getRejectedCount = () => {
  return applications.value.filter(app => app.status === 'Rejected').length;
};

const getInitials = (name) => {
  if (!name) return '';
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase();
};
</script>

<style scoped>
/* Table-specific styles - Keep these styles in the table component */
.filters {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
  align-items: center;
}

.filters input[type="search"],
.filters select {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

th,
td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f4f4f4;
  font-weight: bold;
}

tbody tr:nth-child(even) {
  background-color: #f9f9f9;
}

.applicant-initials {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background-color: #ddd;
  color: #333;
  font-weight: bold;
  margin-right: 5px;
  font-size: 0.8em;
}

.status {
  display: inline-block;
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 0.8em;
  font-weight: bold;
  color: white;
}

.status-approved {
  background-color: green;
}

.status-pending {
  background-color: gold;
  color: black;
}

.status-rejected {
  background-color: red;
}

.status-in-review {
  background-color: blue;
}

.view-button,
.forward-button {
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  margin-right: 5px;
}

.view-button {
  background-color: blue;
}

.forward-button {
  background-color: green;
}
</style>