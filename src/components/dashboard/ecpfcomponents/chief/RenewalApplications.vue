<template>
  <div class="bg-white rounded-lg shadow overflow-hidden">
    <!-- Header Section -->
    <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
      <h2 class="text-lg font-semibold text-gray-800">ECPF Name Change Applications</h2>
      <!-- Status Counters -->
      <div class="flex space-x-4">
        <div class="flex items-center space-x-2 text-sm text-gray-600">
          <div class="h-2 w-2 rounded-full bg-blue-500"></div>
          <span>Total Requests: {{ applications.length }}</span>
        </div>
        <div class="flex items-center space-x-2 text-sm text-gray-600">
          <div class="h-2 w-2 rounded-full bg-yellow-500"></div>
          <span>Pending Review: {{ pendingReviewCount }}</span>
        </div>
        <div class="flex items-center space-x-2 text-sm text-gray-600">
          <div class="h-2 w-2 rounded-full bg-green-500"></div>
          <span>Approved: {{ approvedCount }}</span>
        </div>
        <div class="flex items-center space-x-2 text-sm text-gray-600">
          <div class="h-2 w-2 rounded-full bg-red-500"></div>
          <span>Rejected: {{ rejectedCount }}</span>
        </div>
      </div>
    </div>

    <!-- Search and Filter Section -->
    <div class="px-6 py-3 flex justify-between items-center border-b border-gray-200">
      <div class="relative flex-1">
        <span class="absolute inset-y-0 left-0 flex items-center pl-3">
          <svg class="h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="none">
            <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </span>
        <input v-model="searchQuery" type="text" class="py-2 pl-10 pr-3 w-full border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-sm" placeholder="Search by applicant name, current ECPF, or proposed ECPF..." />
      </div>
      <div class="ml-4">
        <select v-model="statusFilter" class="block appearance-none w-full bg-white border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
          <option value="">All Statuses</option>
          <option value="Pending Review">Pending Review</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>
    </div>

    <!-- Table -->
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicant Name</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current ECPF Name</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Proposed ECPF Name</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="application in filteredApplications" :key="application.id">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="flex items-center">
                <div class="flex-shrink-0 h-10 w-10">
                  <div class="h-10 w-10 rounded-full bg-gray-500 text-white flex items-center justify-center uppercase">
                    {{ application.applicantNameInitials }}
                  </div>
                </div>
                <div class="ml-4">
                  <div class="text-sm font-medium text-gray-900">{{ application.applicantName }}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ application.currentECPFName }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ application.proposedECPFName }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" :class="statusClass(application.status)">
                {{ application.status }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
              <button @click="openModal(application)" class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                View
              </button>
              <button class="ml-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                Forward
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="px-6 py-3 border-t border-gray-200 flex justify-between items-center">
      <div class="text-sm text-gray-700">
        Showing {{ visibleApplications.length }} to {{ applications.length }} of {{ applications.length }} results
      </div>
      <div>
        <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
          <button :disabled="currentPage === 1" @click="prevPage" class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
            <span class="sr-only">Previous</span>
            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M12.79 12.79a.75.75 0 01-1.06 0l-4.75-4.75a.75.75 0 011.06-1.06L12.79 10.94l4.75-4.75a.75.75 0 011.06 1.06l-4.75 4.75z" clip-rule="evenodd" />
            </svg>
          </button>
          <button v-for="page in totalPages" :key="page" @click="currentPage = page" :class="{'z-10 bg-indigo-50 border-indigo-500 text-indigo-600': currentPage === page, 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0': currentPage !== page}" aria-current="page" class="relative inline-flex items-center px-4 py-2 text-sm font-semibold focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
            {{ page }}
          </button>
          <button :disabled="currentPage === totalPages" @click="nextPage" class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0">
            <span class="sr-only">Next</span>
            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M7.21 14.79a.75.75 0 01.02-1.06L11.168 10 7.23 6.26a.75.75 0 011.04-1.08l4.5 4.5a.75.75 0 010 1.06l-4.5 4.5a.75.75 0 01-1.06.02z" clip-rule="evenodd" />
            </svg>
          </button>
        </nav>
      </div>
    </div>

    <!-- Modal -->
    <ECPFRenewalModal :application="selectedApplication" :isOpen="isModalOpen" @close="closeModal" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import ECPFRenewalModal from './modals/ECPFRenewalModal.vue';

const isModalOpen = ref(false);
const selectedApplication = ref(null);
const searchQuery = ref('');
const statusFilter = ref('');
const currentPage = ref(1);
const applicationsPerPage = 4;

const applications = ref([
  {
    id: 1,
    applicantName: 'Alice Johnson',
    applicantNameInitials: 'AJ',
    currentECPFName: 'Johnson Enterprises',
    proposedECPFName: 'Johnson & Co.',
    status: 'Approved',
    currentDetails: {
      ecpfName: 'Johnson Enterprises',
      licenceNo: 'LEC12345',
      location: 'New York',
      proprietorName: 'Alice Johnson',
      cid: 'CID12345',
      contactNo: '+1 123 456 7890',
      emailAddress: 'alice.johnson@email.com'
    },
    proposedChange: {
      proposedName: 'Johnson & Co.',
      remarks: 'Shorten company name for branding.'
    },
    externalPartyContactDetails: {
      nameOfProprietor: 'Alice Johnson',
      nationality: 'American',
      designation: 'CEO',
      emailAddress: 'alice.j@newemail.com',
      contactNumber: '+1 987 654 3210',
      website: 'www.johnson-co.com'
    },
    collaborationDescription: 'N/A',
    supportingDocuments: 'No documents uploaded'
  },
  {
    id: 2,
    applicantName: 'Bob Williams',
    applicantNameInitials: 'BW',
    currentECPFName: 'Williams Group',
    proposedECPFName: 'Williams Holdings',
    status: 'Rejected',
    currentDetails: {
      ecpfName: 'Williams Group',
      licenceNo: 'LEC67890',
      location: 'London',
      proprietorName: 'Bob Williams',
      cid: 'CID67890',
      contactNo: '+44 20 7946 0532',
      emailAddress: 'bob.williams@email.com'
    },
    proposedChange: {
      proposedName: 'Williams Holdings',
      remarks: 'Reorganization under a holding company.'
    },
     externalPartyContactDetails: {
      nameOfProprietor: 'Bob Williams',
      nationality: 'British',
      designation: 'Director',
      emailAddress: 'bob.w@newemail.com',
      contactNumber: '+44 20 7946 0533',
      website: 'www.williams-holdings.com'
    },
    collaborationDescription: 'N/A',
    supportingDocuments: 'No documents uploaded'
  },
  {
    id: 3,
    applicantName: 'Jane Smith',
    applicantNameInitials: 'JS',
    currentECPFName: 'Smith Ltd',
    proposedECPFName: 'Smith Corporation',
    status: 'Pending Review',
    currentDetails: {
      ecpfName: 'Smith Ltd',
      licenceNo: 'LEC11223',
      location: 'Sydney',
      proprietorName: 'Jane Smith',
      cid: 'CID11223',
      contactNo: '+61 2 9123 4567',
      emailAddress: 'jane.smith@email.com'
    },
    proposedChange: {
      proposedName: 'Smith Corporation',
      remarks: 'Expansion to a corporation structure.'
    },
     externalPartyContactDetails: {
      nameOfProprietor: 'Jane Smith',
      nationality: 'Australian',
      designation: 'Managing Director',
      emailAddress: 'jane.s@newemail.com',
      contactNumber: '+61 2 9123 4568',
      website: 'www.smith-corporation.com'
    },
    collaborationDescription: 'N/A',
    supportingDocuments: 'No documents uploaded'
  },
  {
    id: 4,
    applicantName: 'John Doe',
    applicantNameInitials: 'JD',
    currentECPFName: 'Doe Inc',
    proposedECPFName: 'Doe Enterprises',
    status: 'Pending Review',
    currentDetails: {
      ecpfName: 'Doe Inc',
      licenceNo: 'LEC44556',
      location: 'Toronto',
      proprietorName: 'John Doe',
      cid: 'CID44556',
      contactNo: '+1 416 555 1212',
      emailAddress: 'john.doe@email.com'
    },
    proposedChange: {
      proposedName: 'Doe Enterprises',
      remarks: 'More encompassing business name.'
    },
     externalPartyContactDetails: {
      nameOfProprietor: 'John Doe',
      nationality: 'Canadian',
      designation: 'President',
      emailAddress: 'john.d@newemail.com',
      contactNumber: '+1 416 555 1213',
      website: 'www.doe-enterprises.com'
    },
    collaborationDescription: 'N/A',
    supportingDocuments: 'No documents uploaded'
  }
]);

const pendingReviewCount = computed(() => applications.value.filter(app => app.status === 'Pending Review').length);
const approvedCount = computed(() => applications.value.filter(app => app.status === 'Approved').length);
const rejectedCount = computed(() => applications.value.filter(app => app.status === 'Rejected').length);

const filteredApplications = computed(() => {
  let filtered = applications.value;

  if (searchQuery.value) {
    const lowerSearchQuery = searchQuery.value.toLowerCase();
    filtered = filtered.filter(app => {
      return app.applicantName.toLowerCase().includes(lowerSearchQuery) ||
             app.currentECPFName.toLowerCase().includes(lowerSearchQuery) ||
             app.proposedECPFName.toLowerCase().includes(lowerSearchQuery);
    });
  }

  if (statusFilter.value) {
    filtered = filtered.filter(app => app.status === statusFilter.value);
  }
  return filtered;
});

const totalPages = computed(() => Math.ceil(filteredApplications.value.length / applicationsPerPage));
const visibleApplications = computed(() => {
  const startIndex = (currentPage.value - 1) * applicationsPerPage;
  const endIndex = startIndex + applicationsPerPage;
  return filteredApplications.value.slice(startIndex, endIndex);
});


const openModal = (application) => {
  console.log('openModal function called', application);
  selectedApplication.value = application;
  isModalOpen.value = true;
};

const closeModal = () => {
  console.log('isModalOpen value:', isModalOpen.value);

  isModalOpen.value = false;
  selectedApplication.value = null;
};

const statusClass = (status) => {
  const classes = {
    'Pending Review': 'bg-yellow-100 text-yellow-800',
    'Approved': 'bg-green-100 text-green-800',
    'Rejected': 'bg-red-100 text-red-800'
  };
  return classes[status] || 'bg-gray-100 text-gray-800';
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};
</script>