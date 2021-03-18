<template>
  <div class="ecpf-location-change-table p-8 min-h-screen bg-gray-100">
    <div class="max-w-7xl mx-auto">
      <!-- Header with stats (If you want to include stats, uncomment this section and the related methods in script) -->
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
        <h2 class="text-2xl font-bold text-gray-800">ECPF Location Change Applications</h2>
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
              <option value="all">All Statuses</option>
              <option value="pending">Pending Review</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="approved">Approved</option>
            </select>
          </div>
          <div class="w-full md:w-1/4">
            <select class="block w-full rounded-lg border-gray-300 py-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="applicant">Applicant Name</option>
              <option value="cid">CID No.</option>
              <option value="firm">Firm Name</option>
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
              <tr v-for="application in applications" :key="application.cid" class="hover:bg-gray-50 transition-colors">
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
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ application.cid }}</td>
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
                      @click="openModal(application)"
                      class="view-button"
                    >
                      View
                    </button>
                    <button
                      class="forward-button"
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
          <button class="pagination-button-mobile">
            Previous
          </button>
          <button class="pagination-button-mobile ml-3">
            Next
          </button>
        </div>
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700">
              Showing <span class="font-medium">1</span> to <span class="font-medium">2</span> of <span class="font-medium">{{ applications.length }}</span> results
            </p>
          </div>
          <div>
            <nav class="pagination-nav" aria-label="Pagination">
              <button class="pagination-button-nav prev">
                <span class="sr-only">Previous</span>
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </button>
              <button aria-current="page" class="pagination-button-nav current">
                1
              </button>
              <button class="pagination-button-nav">
                2
              </button>
              <button class="pagination-button-nav next">
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
      <LocationChangeModal
        :is-open="isModalOpen"
        :application-data="selectedApplication"
        @close-modal="closeModal"
        @approve="onApprove"
        @reject="onReject"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import LocationChangeModal from './modals/EcpfLocationChangeModal.vue';

const isModalOpen = ref(false);
const selectedApplication = ref({});

const applications = ref([
  {
    applicantName: 'Sonam Wangchuk',
    cid: '12345678901',
    firmName: 'Green Valley Organics',
    contactNo: '17123456',
    applicationStatus: 'Pending Review',
    statusClass: 'status-pending',
    ecpfName: 'Alpha ECPF',
    currentLocation: 'Thimphu',
    proprietorName: 'Sonam Wangchuk',
    emailAddress: 'sonam@example.com',
  },
  {
    applicantName: 'Tashi Wangmo',
    cid: '98765432102',
    firmName: 'Wellness Center',
    contactNo: '17456789',
    applicationStatus: 'Shortlisted',
    statusClass: 'status-shortlisted',
    ecpfName: 'Beta ECPF',
    currentLocation: 'Paro',
    proprietorName: 'Tashi Wangmo',
    emailAddress: 'tashi@example.com',
  },
]);

const openModal = (application) => {
  selectedApplication.value = application;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  selectedApplication.value = {};
};

const onApprove = () => {
  console.log('Application Approved!');
  closeModal();
};

const onReject = () => {
  console.log('Application Rejected!');
  closeModal();
};


const getStatusClasses = (status) => {
  return  [
    'status-badge',
    {
      'status-pending': status === 'Pending Review',
      'status-shortlisted': status === 'Shortlisted', // You can add more status classes as needed
      'status-approved': status === 'Approved',
      'status-rejected': status === 'Rejected',
      'status-in-review': status === 'In Review',
    }
  ];
};

// Helper functions for stats cards (If you uncommented the stats section in template)
const getPendingCount = () => {
  return applications.value.filter(app => app.applicationStatus === 'Pending Review').length;
};

const getApprovedCount = () => {
  return applications.value.filter(app => app.applicationStatus === 'Approved').length;
};

const getRejectedCount = () => {
  return applications.value.filter(app => app.applicationStatus === 'Rejected').length;
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
.ecpf-location-change-table {
  font-family: sans-serif;
}

/* General Layout and Background */
.p-8 { padding: 2rem; }
.min-h-screen { min-height: 100vh; }
.bg-gray-100 { background-color: #f7fafc; }
.max-w-7xl { max-width: 80rem; /* 1280px */ }
.mx-auto { margin-left: auto; margin-right: auto; }

/* Stats Cards */
.grid { display: grid; }
.grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
@media (min-width: 768px) { .md\:grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); } } /* md:grid-cols-4 */
.gap-4 { gap: 1rem; }
.mb-6 { margin-bottom: 1.5rem; }
.bg-white { background-color: #fff; }
.rounded-xl { border-radius: 0.75rem; }
.shadow-sm { box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); }
.border { border-width: 1px; }
.border-gray-100 { border-color: #f7fafc; }
.p-4 { padding: 1rem; }
.flex { display: flex; }
.items-center { align-items: center; }
.p-3 { padding: 0.75rem; }
.rounded-full { border-radius: 9999px; }
.bg-blue-100 { background-color: #ebf8ff; }
.text-blue-600 { color: #2563eb; }
.mr-4 { margin-right: 1rem; }
.text-xs { font-size: 0.75rem; }
.font-semibold { font-weight: 600; }
.text-gray-500 { color: #6b7280; }
.uppercase { text-transform: uppercase; }
.text-xl { font-size: 1.25rem; }
.font-bold { font-weight: 700; }
.text-gray-800 { color: #1f2937; }
.bg-yellow-100 { background-color: #fefce8; }
.text-yellow-600 { color: #d97706; }
.bg-green-100 { background-color: #f0fdf4; }
.text-green-600 { color: #16a34a; }
.bg-red-100 { background-color: #fee2e2; }
.text-red-600 { color: #dc2626; }

/* Main Heading */
.text-2xl { font-size: 1.5rem; }

/* Filter/Search Bar */
.flex-col { flex-direction: column; }
@media (min-width: 768px) { .md\:flex-row { flex-direction: row; } } /* md:flex-row */
.space-y-4 > :not([hidden] ~ [hidden]):not([hidden] ~ *) { margin-top: 1rem; }
@media (min-width: 768px) { .md\:space-y-0 > :not([hidden] ~ [hidden]):not([hidden] ~ *) { margin-top: 0px; } } /* md:space-y-0 */
@media (min-width: 768px) { .md\:space-x-4 > :not([hidden] ~ [hidden]):not([hidden] ~ *) { margin-left: 1rem; } } /* md:space-x-4 */
.flex-1 { flex-grow: 1; }
.relative { position: relative; }
.absolute { position: absolute; }
.inset-y-0 { top: 0px; bottom: 0px; }
.left-0 { left: 0px; }
.pl-3 { padding-left: 0.75rem; }
.pointer-events-none { pointer-events: none; }
.h-5 { height: 1.25rem; }
.w-5 { width: 1.25rem; }
.text-gray-400 { color: #9ca3af; }
.block { display: block; }
.w-full { width: 100%; }
.rounded-lg { border-radius: 0.5rem; }
.border-gray-300 { border-color: #d1d5db; }
.pl-10 { padding-left: 2.5rem; }
.py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
.focus\:ring-blue-500:focus { --tw-ring-color: #3b82f6; ring-color: var(--tw-ring-color); }
.focus\:border-blue-500:focus { border-color: #3b82f6; }
.w-full { width: 100%; }
@media (min-width: 768px) { .md\:w-1\/4 { width: 25%; } } /* md:w-1/4 */

/* Table View */
.overflow-hidden { overflow: hidden; }
.overflow-x-auto { overflow-x: auto; }
.min-w-full { min-width: 100%; }
.divide-y { border-top-width: 0px; border-bottom-width: 0px; }
.divide-gray-200 { border-color: #e5e7eb; }
.bg-gray-50 { background-color: #f9fafb; }
.px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
.py-4 { padding-top: 1rem; padding-bottom: 1rem; }
.text-left { text-align: left; }
.text-xs { font-size: 0.75rem; }
.font-semibold { font-weight: 600; }
.text-gray-600 { color: #4b5563; }
.uppercase { text-transform: uppercase; }
.tracking-wider { letter-spacing: 0.05em; }
.divide-y > :not([hidden] ~ [hidden]) { border-top-width: 1px; }
.bg-white { background-color: #fff; }
.hover\:bg-gray-50:hover { background-color: #f9fafb; }
.transition-colors { transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms; }
.whitespace-nowrap { whitespace: nowrap; }
.h-8 { height: 2rem; }
.w-8 { width: 2rem; }
.rounded-full { border-radius: 9999px; }
.bg-gray-200 { background-color: #e5e7eb; }
.justify-center { justify-content: center; }
.text-gray-900 { color: #111827; }
.text-sm { font-size: 0.875rem; }
.font-medium { font-weight: 500; }
.space-x-2 > :not([hidden] ~ [hidden]):not([hidden] ~ *) { margin-left: 0.5rem; }

/* Status Badge */
.status-badge {
  @apply px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap; /* Apply Tailwind classes using @apply */
}
.status-pending {
  @apply bg-yellow-100 text-yellow-800;
}
.status-shortlisted {
  @apply bg-blue-100 text-blue-800; /* Changed from green to blue to match image better */
}
.status-approved {
  @apply bg-green-100 text-green-800;
}
.status-rejected {
  @apply bg-red-100 text-red-800;
}
.status-in-review {
  @apply bg-blue-100 text-blue-800; /* Example - adjust color if needed */
}


/* Buttons */
.view-button,
.forward-button {
  @apply bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors duration-200;
}
.forward-button {
  @apply bg-green-600 hover:bg-green-700; /* Overriding blue classes for forward button */
}

/* Pagination */
.pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 1rem;
  padding-bottom: 1rem;
}
.flex-1 { flex-grow: 1; }
.justify-between { justify-content: space-between; }
.sm\:hidden { display: none; }
@media (min-width: 640px) { .sm\:flex { display: flex; } } /* sm:flex */
.text-sm { font-size: 0.875rem; }
.text-gray-700 { color: #4b5563; }
.font-medium { font-weight: 500; }
.pagination-nav {
  display: inline-flex;
  border-radius: 0.375rem; /* rounded-md */
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); /* shadow-sm */
  margin-left: -1px; /* -space-x-px */
}
.pagination-button-nav {
  position: relative;
  padding-top: 0.5rem; /* py-2 */
  padding-bottom: 0.5rem; /* py-2 */
  padding-left: 1rem; /* px-4 */
  padding-right: 1rem; /* px-4 */
  border-width: 1px; /* border */
  border-color: #d1d5db; /* border-gray-300 */
  background-color: #fff; /* bg-white */
  font-size: 0.875rem; /* text-sm */
  font-weight: 500; /* font-medium */
  color: #4b5563; /* text-gray-700 */
}
.pagination-button-nav.prev {
  border-radius: 0.375rem 0 0 0.375rem; /* rounded-l-md */
}
.pagination-button-nav.next {
  border-radius: 0 0.375rem 0.375rem 0; /* rounded-r-md */
}
.pagination-button-nav.current {
  z-index: 10;
  background-color: #eff6ff; /* bg-blue-50 */
  border-color: #3b82f6; /* border-blue-500 */
  color: #2563eb; /* text-blue-600 */
}
.pagination-button-mobile {
  position: relative;
  padding-top: 0.5rem; /* py-2 */
  padding-bottom: 0.5rem; /* py-2 */
  padding-left: 1rem; /* px-4 */
  padding-right: 1rem; /* px-4 */
  border-width: 1px; /* border */
  border-color: #d1d5db; /* border-gray-300 */
  border-radius: 0.375rem; /* rounded-md */
  background-color: #fff; /* bg-white */
  font-size: 0.875rem; /* text-sm */
  font-weight: 500; /* font-medium */
  color: #4b5563; /* text-gray-700 */
}
</style>