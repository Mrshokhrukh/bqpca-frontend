<template>
  <div class="min-h-screen bg-slate-50 p-6">
    <div class="max-w-7xl mx-auto space-y-8">
      <!-- Stats Grid with Interactive Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- First Row -->
        <div 
          @click="filterByStatus('All')"
          class="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 cursor-pointer"
          :class="{'ring-2 ring-blue-500': filterStatus === 'All'}"
        >
          <div class="flex justify-between items-center">
            <div>
              <p class="text-base font-medium text-slate-600">Total</p>
              <p class="mt-2 text-3xl font-bold text-slate-900">{{ applications.length }}</p>
              <p class="text-sm text-slate-500">All applications</p>
            </div>
            <div class="p-3 rounded-full bg-blue-100">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div 
          @click="filterByStatus('Pending')"
          class="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 cursor-pointer"
          :class="{'ring-2 ring-yellow-500': filterStatus === 'Pending'}"
        >
          <div class="flex justify-between items-center">
            <div>
              <p class="text-base font-medium text-slate-600">Pending</p>
              <p class="mt-2 text-3xl font-bold text-yellow-600">{{ pendingCount }}</p>
              <p class="text-sm text-slate-500">New applications</p>
            </div>
            <div class="p-3 rounded-full bg-yellow-100">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div 
          @click="filterByStatus('Under Review')"
          class="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 cursor-pointer"
          :class="{'ring-2 ring-indigo-500': filterStatus === 'Under Review'}"
        >
          <div class="flex justify-between items-center">
            <div>
              <p class="text-base font-medium text-slate-600">Under Review</p>
              <p class="mt-2 text-3xl font-bold text-indigo-600">{{ underReviewCount }}</p>
              <p class="text-sm text-slate-500">In progress</p>
            </div>
            <div class="p-3 rounded-full bg-indigo-100">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Second Row -->
        <div 
          @click="filterByStatus('QEC Issued')"
          class="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 cursor-pointer"
          :class="{'ring-2 ring-green-500': filterStatus === 'QEC Issued'}"
        >
          <div class="flex justify-between items-center">
            <div>
              <p class="text-base font-medium text-slate-600">QEC Issued</p>
              <p class="mt-2 text-3xl font-bold text-green-600">{{ qecIssuedCount }}</p>
              <p class="text-sm text-slate-500">Approved</p>
            </div>
            <div class="p-3 rounded-full bg-green-100">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>

        <div 
          @click="filterByStatus('Suspended')"
          class="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 cursor-pointer"
          :class="{'ring-2 ring-orange-500': filterStatus === 'Suspended'}"
        >
          <div class="flex justify-between items-center">
            <div>
              <p class="text-base font-medium text-slate-600">Suspended</p>
              <p class="mt-2 text-3xl font-bold text-orange-600">{{ suspendedCount }}</p>
              <p class="text-sm text-slate-500">On hold</p>
            </div>
            <div class="p-3 rounded-full bg-orange-100">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
        </div>

        <div 
          @click="filterByStatus('Regretted')"
          class="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 cursor-pointer"
          :class="{'ring-2 ring-red-500': filterStatus === 'Regretted'}"
        >
          <div class="flex justify-between items-center">
            <div>
              <p class="text-base font-medium text-slate-600">Regretted</p>
              <p class="mt-2 text-3xl font-bold text-red-600">{{ regrettedCount }}</p>
              <p class="text-sm text-slate-500">Rejected</p>
            </div>
            <div class="p-3 rounded-full bg-red-100">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Active Filter Indicator -->
      <div class="flex items-center space-x-2">
        <span class="text-sm text-slate-600">Active Filter:</span>
        <span 
          class="px-3 py-1 rounded-full text-sm font-medium"
          :class="{
            'bg-blue-100 text-blue-800': filterStatus === 'All',
            'bg-yellow-100 text-yellow-800': filterStatus === 'Pending',
            'bg-indigo-100 text-indigo-800': filterStatus === 'Under Review',
            'bg-green-100 text-green-800': filterStatus === 'QEC Issued',
            'bg-orange-100 text-orange-800': filterStatus === 'Suspended',
            'bg-red-100 text-red-800': filterStatus === 'Regretted'
          }"
        >
          {{ filterStatus }}
        </span>
        <button 
          v-if="filterStatus !== 'All'"
          @click="filterByStatus('All')"
          class="text-sm text-slate-500 hover:text-slate-700"
        >
          Clear filter
        </button>
      </div>

      <!-- Search Bar -->
      <div class="w-full">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Search by QEC, Name, or CID..." 
          class="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <!-- Applications Table -->
      <div class="bg-white rounded-lg shadow-sm overflow-hidden">
        <table class="w-full">
          <thead class="bg-slate-50 border-b border-slate-200">
            <tr>
              <th class="px-6 py-4 text-left text-sm font-medium text-slate-600">ID</th>
              <th class="px-6 py-4 text-left text-sm font-medium text-slate-600">Name</th>
              <th class="px-6 py-4 text-left text-sm font-medium text-slate-600">CID</th>
              <th class="px-6 py-4 text-left text-sm font-medium text-slate-600">QEC Number</th>
              <th class="px-6 py-4 text-left text-sm font-medium text-slate-600">Status</th>
              <th class="px-6 py-4 text-left text-sm font-medium text-slate-600">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200">
            <tr v-for="app in filteredApplications" :key="app.id" class="hover:bg-slate-50 transition-colors">
              <td class="px-6 py-4 text-sm text-slate-600">{{ app.id }}</td>
              <td class="px-6 py-4">
                <div class="text-sm font-medium text-slate-900">{{ app.name }}</div>
                <div class="text-sm text-slate-600">{{ app.email }}</div>
              </td>
              <td class="px-6 py-4 text-sm text-slate-900">{{ app.cidNo }}</td>
              <td class="px-6 py-4 text-sm text-slate-900">{{ app.qecNumber || 'N/A' }}</td>
              <td class="px-6 py-4">
                <span :class="[
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                  {
                    'bg-yellow-100 text-yellow-800': app.status === 'Pending',
                    'bg-indigo-100 text-indigo-800': app.status === 'Under Review',
                    'bg-green-100 text-green-800': app.status === 'QEC Issued',
                    'bg-orange-100 text-orange-800': app.status === 'Suspended',
                    'bg-red-100 text-red-800': app.status === 'Regretted'
                  }
                ]">
                  {{ app.status }}
                </span>
                <span v-if="app.status === 'Regretted' && app.regretReason" class="block text-sm text-red-500 mt-1">
                  Reason: {{ app.regretReason }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center space-x-4">
                  <!-- View Button -->
                  <ViewButton v-if="app.status === 'Pending'" @click="viewApplication(app)" />

                  <!-- Approve Button -->
                  <ApproveButton v-if="app.status === 'Pending'" @click="openApproveModal(app)" />

                  <!-- Reject Button -->
                  <RejectButton v-if="app.status === 'Pending'" @click="openRejectModal(app)" />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- View Modal -->
      <div v-if="isViewModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6">
          <h2 class="text-xl font-bold text-slate-900 mb-4">Application Details</h2>
          <div class="space-y-4">
            <p><strong>Name:</strong> {{ selectedApplication.name }}</p>
            <p><strong>Email:</strong> {{ selectedApplication.email }}</p>
            <p><strong>CID:</strong> {{ selectedApplication.cidNo }}</p>
            <p><strong>QEC Number:</strong> {{ selectedApplication.qecNumber || 'N/A' }}</p>
            <p><strong>Status:</strong> {{ selectedApplication.status }}</p>
            <p v-if="selectedApplication.regretReason"><strong>Regret Reason:</strong> {{ selectedApplication.regretReason }}</p>
          </div>
          <div class="mt-6 flex justify-end space-x-4">
            <!-- Edit Button -->
            <button 
              @click="openEditModal(selectedApplication)"
              class="px-4 py-2 text-sm text-yellow-500 bg-yellow-100 rounded-md hover:bg-yellow-200 transition-colors"
            >
              Edit
            </button>
            <!-- Close Button -->
            <button 
              @click="closeViewModal"
              class="px-4 py-2 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      <!-- Approve Modal -->
      <div v-if="isApproveModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
          <h2 class="text-xl font-bold text-slate-900 mb-4">Approve Application</h2>
          <p class="text-slate-600 mb-6">Are you sure you want to approve this application?</p>
          <div class="flex justify-end space-x-4">
            <button 
              @click="closeApproveModal"
              class="px-4 py-2 text-sm text-slate-600 bg-slate-100 rounded-md hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button 
              @click="confirmApprove"
              class="px-4 py-2 text-sm text-white bg-green-500 rounded-md hover:bg-green-600 transition-colors"
            >
              Approve
            </button>
          </div>
        </div>
      </div>

      <!-- Reject Modal -->
      <div v-if="isRejectModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
          <h2 class="text-xl font-bold text-slate-900 mb-4">Reject Application</h2>
          <textarea
            v-model="rejectReason"
            placeholder="Enter rejection reason..."
            class="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
          ></textarea>
          <div class="mt-6 flex justify-end space-x-4">
            <button 
              @click="closeRejectModal"
              class="px-4 py-2 text-sm text-slate-600 bg-slate-100 rounded-md hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button 
              @click="confirmReject"
              class="px-4 py-2 text-sm text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors"
            >
              Reject
            </button>
          </div>
        </div>
      </div>

      <!-- Edit Modal -->
      <div v-if="isEditModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6">
          <h2 class="text-xl font-bold text-slate-900 mb-4">Edit Application</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-slate-700">Name</label>
              <input v-model="editableApplication.name" class="w-full p-2 border border-slate-300 rounded-md" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700">Email</label>
              <input v-model="editableApplication.email" class="w-full p-2 border border-slate-300 rounded-md" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700">CID</label>
              <input v-model="editableApplication.cidNo" class="w-full p-2 border border-slate-300 rounded-md" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700">QEC Number</label>
              <input v-model="editableApplication.qecNumber" class="w-full p-2 border border-slate-300 rounded-md" />
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700">Status</label>
              <select v-model="editableApplication.status" class="w-full p-2 border border-slate-300 rounded-md">
                <option value="Pending">Pending</option>
                <option value="Under Review">Under Review</option>
                <option value="QEC Issued">QEC Issued</option>
                <option value="Suspended">Suspended</option>
                <option value="Regretted">Regretted</option>
              </select>
            </div>
            <div v-if="editableApplication.status === 'Regretted'">
              <label class="block text-sm font-medium text-slate-700">Regret Reason</label>
              <textarea v-model="editableApplication.regretReason" class="w-full p-2 border border-slate-300 rounded-md"></textarea>
            </div>
          </div>
          <div class="mt-6 flex justify-end space-x-4">
            <button 
              @click="closeEditModal"
              class="px-4 py-2 text-sm text-slate-600 bg-slate-100 rounded-md hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button 
              @click="saveEdits"
              class="px-4 py-2 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import ViewButton from './buttons/ViewButton.vue';
import ApproveButton from './buttons/ApproveButton.vue';
import RejectButton from './buttons/RejectButton.vue';

const applications = ref([
  {
    id: 1,
    cidNo: "10101010101",
    name: "John Doe",
    email: "john.doe@example.com",
    status: "Pending",
    qecNumber: null,
    regretReason: null,
  },
  {
    id: 2,
    cidNo: "20202020202",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    status: "Under Review",
    qecNumber: null,
    regretReason: null,
  },
  {
    id: 3,
    cidNo: "30303030303",
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    status: "QEC Issued",
    qecNumber: "QEC-1234",
    regretReason: null,
  },
  {
    id: 4,
    cidNo: "40404040404",
    name: "Bob Williams",
    email: "bob.williams@example.com",
    status: "Suspended",
    qecNumber: null,
    regretReason: "Pending further verification",
  },
  {
    id: 5,
    cidNo: "50505050505",
    name: "Charlie Brown",
    email: "charlie.brown@example.com",
    status: "Regretted",
    qecNumber: null,
    regretReason: "Incomplete documentation",
  },
  {
    id: 6,
    cidNo: "60606060606",
    name: "David Wilson",
    email: "david.wilson@example.com",
    status: "Pending",
    qecNumber: null,
    regretReason: null,
  },
  {
    id: 7,
    cidNo: "70707070707",
    name: "Eva Green",
    email: "eva.green@example.com",
    status: "Under Review",
    qecNumber: null,
    regretReason: null,
  },
  {
    id: 8,
    cidNo: "80808080808",
    name: "Frank White",
    email: "frank.white@example.com",
    status: "QEC Issued",
    qecNumber: "QEC-5678",
    regretReason: null,
  },
  {
    id: 9,
    cidNo: "90909090909",
    name: "Grace Black",
    email: "grace.black@example.com",
    status: "Suspended",
    qecNumber: null,
    regretReason: "Pending additional information",
  },
  {
    id: 10,
    cidNo: "10101010110",
    name: "Henry Brown",
    email: "henry.brown@example.com",
    status: "Regretted",
    qecNumber: null,
    regretReason: "Insufficient qualifications",
  },
  {
    id: 11,
    cidNo: "11111111111",
    name: "Ivy Davis",
    email: "ivy.davis@example.com",
    status: "Pending",
    qecNumber: null,
    regretReason: null,
  },
  {
    id: 12,
    cidNo: "12121212121",
    name: "Jack Evans",
    email: "jack.evans@example.com",
    status: "Under Review",
    qecNumber: null,
    regretReason: null,
  },
  {
    id: 13,
    cidNo: "13131313131",
    name: "Karen Harris",
    email: "karen.harris@example.com",
    status: "QEC Issued",
    qecNumber: "QEC-9101",
    regretReason: null,
  },
  {
    id: 14,
    cidNo: "14141414141",
    name: "Leo Clark",
    email: "leo.clark@example.com",
    status: "Suspended",
    qecNumber: null,
    regretReason: "Pending background check",
  },
  {
    id: 15,
    cidNo: "15151515151",
    name: "Mia Lewis",
    email: "mia.lewis@example.com",
    status: "Regretted",
    qecNumber: null,
    regretReason: "Incomplete application form",
  },
  {
    id: 16,
    cidNo: "16161616161",
    name: "Noah Walker",
    email: "noah.walker@example.com",
    status: "Pending",
    qecNumber: null,
    regretReason: null,
  },
  {
    id: 17,
    cidNo: "17171717171",
    name: "Olivia Hall",
    email: "olivia.hall@example.com",
    status: "Under Review",
    qecNumber: null,
    regretReason: null,
  },
  {
    id: 18,
    cidNo: "18181818181",
    name: "Paul Young",
    email: "paul.young@example.com",
    status: "QEC Issued",
    qecNumber: "QEC-1121",
    regretReason: null,
  },
  {
    id: 19,
    cidNo: "19191919191",
    name: "Quinn Allen",
    email: "quinn.allen@example.com",
    status: "Suspended",
    qecNumber: null,
    regretReason: "Pending verification of documents",
  },
  {
    id: 20,
    cidNo: "20202020220",
    name: "Rachel King",
    email: "rachel.king@example.com",
    status: "Regretted",
    qecNumber: null,
    regretReason: "Ineligible due to age",
  },
]);

const selectedApplication = ref(null);
const editableApplication = ref(null);
const searchQuery = ref("");
const filterStatus = ref("All");
const isViewModalOpen = ref(false);
const isApproveModalOpen = ref(false);
const isRejectModalOpen = ref(false);
const isEditModalOpen = ref(false);
const rejectReason = ref("");
const applicationToProcess = ref(null);

// Computed properties
const pendingCount = computed(() => applications.value.filter((app) => app.status === "Pending").length);
const underReviewCount = computed(() => applications.value.filter((app) => app.status === "Under Review").length);
const qecIssuedCount = computed(() => applications.value.filter((app) => app.status === "QEC Issued").length);
const suspendedCount = computed(() => applications.value.filter((app) => app.status === "Suspended").length);
const regrettedCount = computed(() => applications.value.filter((app) => app.status === "Regretted").length);

const filteredApplications = computed(() => {
  let filtered = applications.value;

  // Filter by status
  if (filterStatus.value !== "All") {
    filtered = filtered.filter((app) => app.status === filterStatus.value);
  }

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (app) =>
        app.name.toLowerCase().includes(query) ||
        app.cidNo.includes(query) ||
        (app.qecNumber && app.qecNumber.toLowerCase().includes(query))
    );
  }

  return filtered;
});

const viewApplication = (app) => {
  selectedApplication.value = { ...app };
  isViewModalOpen.value = true;
};

const closeViewModal = () => {
  isViewModalOpen.value = false;
};

const openApproveModal = (app) => {
  applicationToProcess.value = app;
  isApproveModalOpen.value = true;
};

const closeApproveModal = () => {
  isApproveModalOpen.value = false;
  applicationToProcess.value = null;
};

const confirmApprove = () => {
  if (applicationToProcess.value) {
    applicationToProcess.value.status = "QEC Issued";
    applicationToProcess.value.qecNumber = `QEC-${Math.floor(1000 + Math.random() * 9000)}`;
  }
  closeApproveModal();
};

const openRejectModal = (app) => {
  applicationToProcess.value = app;
  isRejectModalOpen.value = true;
};

const closeRejectModal = () => {
  isRejectModalOpen.value = false;
  applicationToProcess.value = null;
  rejectReason.value = "";
};

const confirmReject = () => {
  if (applicationToProcess.value && rejectReason.value) {
    applicationToProcess.value.status = "Regretted";
    applicationToProcess.value.regretReason = rejectReason.value;
  }
  closeRejectModal();
};

const openEditModal = (app) => {
  editableApplication.value = { ...app };
  isEditModalOpen.value = true;
};

const closeEditModal = () => {
  isEditModalOpen.value = false;
  editableApplication.value = null;
};

const saveEdits = () => {
  const index = applications.value.findIndex(app => app.id === editableApplication.value.id);
  if (index !== -1) {
    applications.value[index] = { ...editableApplication.value };
  }
  closeEditModal();
};

const filterByStatus = (status) => {
  filterStatus.value = status;
};
</script>

<style scoped>
/* Custom styles for the table */
table {
  border-collapse: collapse;
  width: 100%;
}

th,
td {
  border: 1px solid #ddd;
  padding: 8px;
}

th {
  background-color: #f2f2f2;
}
</style>