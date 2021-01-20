<template>
  <div class="min-h-screen bg-slate-50 p-6">
    <div class="max-w-7xl mx-auto space-y-8">
      <!-- Stats Grid with Interactive Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Total Applications Card -->
        <div 
          @click="setFilter('All')"
          class="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow duration-300 cursor-pointer"
          :class="{'ring-2 ring-blue-500': currentFilter === 'All'}"
        >
          <div class="flex justify-between items-center">
            <div>
              <p class="text-base font-medium text-slate-600">Total Applications</p>
              <p class="mt-2 text-3xl font-bold text-slate-900">{{ applications.length }}</p>
              <p class="text-sm text-slate-500">Total submissions</p>
            </div>
            <div class="p-4 rounded-full bg-blue-100">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Pending Applications Card -->
        <div 
          @click="setFilter('Pending')"
          class="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow duration-300 cursor-pointer"
          :class="{'ring-2 ring-yellow-500': currentFilter === 'Pending'}"
        >
          <div class="flex justify-between items-center">
            <div>
              <p class="text-base font-medium text-slate-600">Pending</p>
              <p class="mt-2 text-3xl font-bold text-yellow-600">{{ pendingCount }}</p>
              <p class="text-sm text-slate-500">Awaiting initial review</p>
            </div>
            <div class="p-4 rounded-full bg-yellow-100">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Under Review Applications Card -->
        <div 
          @click="setFilter('Under Review')"
          class="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow duration-300 cursor-pointer"
          :class="{'ring-2 ring-orange-500': currentFilter === 'Under Review'}"
        >
          <div class="flex justify-between items-center">
            <div>
              <p class="text-base font-medium text-slate-600">Under Review</p>
              <p class="mt-2 text-3xl font-bold text-orange-600">{{ underReviewCount }}</p>
              <p class="text-sm text-slate-500">Applications under review</p>
            </div>
            <div class="p-4 rounded-full bg-orange-100">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-orange-600" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <!-- QEC Issued Applications Card -->
        <div 
          @click="setFilter('QEC Issued')"
          class="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow duration-300 cursor-pointer"
          :class="{'ring-2 ring-green-500': currentFilter === 'QEC Issued'}"
        >
          <div class="flex justify-between items-center">
            <div>
              <p class="text-base font-medium text-slate-600">QEC Issued</p>
              <p class="mt-2 text-3xl font-bold text-green-600">{{ qecIssuedCount }}</p>
              <p class="text-sm text-slate-500">QEC issued applications</p>
            </div>
            <div class="p-4 rounded-full bg-green-100">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Suspended Applications Card -->
        <div 
          @click="setFilter('Suspended')"
          class="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow duration-300 cursor-pointer"
          :class="{'ring-2 ring-red-500': currentFilter === 'Suspended'}"
        >
          <div class="flex justify-between items-center">
            <div>
              <p class="text-base font-medium text-slate-600">Suspended</p>
              <p class="mt-2 text-3xl font-bold text-red-600">{{ suspendedCount }}</p>
              <p class="text-sm text-slate-500">Suspended applications</p>
            </div>
            <div class="p-4 rounded-full bg-red-100">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Regretted Applications Card -->
        <div 
          @click="setFilter('Regretted')"
          class="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow duration-300 cursor-pointer"
          :class="{'ring-2 ring-purple-500': currentFilter === 'Regretted'}"
        >
          <div class="flex justify-between items-center">
            <div>
              <p class="text-base font-medium text-slate-600">Regretted</p>
              <p class="mt-2 text-3xl font-bold text-purple-600">{{ regrettedCount }}</p>
              <p class="text-sm text-slate-500">Regretted applications</p>
            </div>
            <div class="p-4 rounded-full bg-purple-100">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
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
            'bg-blue-100 text-blue-800': currentFilter === 'All',
            'bg-yellow-100 text-yellow-800': currentFilter === 'Pending',
            'bg-orange-100 text-orange-800': currentFilter === 'Under Review',
            'bg-green-100 text-green-800': currentFilter === 'QEC Issued',
            'bg-red-100 text-red-800': currentFilter === 'Suspended',
            'bg-purple-100 text-purple-800': currentFilter === 'Regretted'
          }"
        >
          {{ currentFilter }}
        </span>
        <button 
          v-if="currentFilter !== 'All'"
          @click="setFilter('All')"
          class="text-sm text-slate-500 hover:text-slate-700"
        >
          Clear filter
        </button>
      </div>

      
      <!-- Applications Table -->
      <div class="bg-white rounded-lg shadow-sm">
        <div class="overflow-x-auto">
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
                <td class="px-6 py-4 text-sm text-slate-900">{{ app.cid }}</td>
                <td class="px-6 py-4 text-sm text-slate-900">{{ app.qecNumber || 'N/A' }}</td>
                <td class="px-6 py-4">
                  <span :class="[
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    {
                      'bg-green-100 text-green-800': app.status === 'QEC Issued',
                      'bg-yellow-100 text-yellow-800': app.status === 'Pending',
                      'bg-orange-100 text-orange-800': app.status === 'Under Review',
                      'bg-red-100 text-red-800': app.status === 'Suspended' || app.status === 'Regretted'
                    }
                  ]">
                    {{ app.status }}
                  </span>
                  <span v-if="app.status === 'Regretted' && app.regretReason" class="block text-sm text-red-500 mt-1">
                    Reason: {{ app.regretReason }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <div v-if="app.status === 'Pending'" class="flex space-x-2">
                    <!-- View Button -->
                    <button 
                      @click="openViewModal(app)"
                      class="px-3 py-1.5 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors"
                    >
                      View
                    </button>

                    <!-- Approve Button -->
                    <button 
                      @click="openApproveModal(app)"
                      class="px-3 py-1.5 text-sm text-white bg-green-500 rounded-md hover:bg-green-600 transition-colors"
                    >
                      Approve
                    </button>

                    <!-- Reject Button -->
                    <button 
                      @click="openRejectModal(app)"
                      class="px-3 py-1.5 text-sm text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- View Modal -->
    <div v-if="isViewModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6">
        <h2 class="text-xl font-bold text-slate-900 mb-4">Application Details</h2>
        <div class="space-y-4">
          <p><strong>Name:</strong> {{ selectedApplication.name }}</p>
          <p><strong>Email:</strong> {{ selectedApplication.email }}</p>
          <p><strong>CID:</strong> {{ selectedApplication.cid }}</p>
          <p><strong>QEC Number:</strong> {{ selectedApplication.qecNumber || 'N/A' }}</p>
          <p><strong>Status:</strong> {{ selectedApplication.status }}</p>
        </div>
        <div class="mt-6 flex justify-end">
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
            @click="approveApplication"
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
            @click="rejectApplication"
            class="px-4 py-2 text-sm text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// Current filter state
const currentFilter = ref('All')

// Sample data - replace with your actual data
const applications = ref([
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    cid: "10101010101",
    qecNumber: "N/A",
    status: "Pending"
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    cid: "20202020202",
    qecNumber: "N/A",
    status: "Under Review"
  },
  {
    id: 3,
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    cid: "30303030303",
    qecNumber: "QEC-1234",
    status: "QEC Issued"
  },
  {
    id: 4,
    name: "Bob Williams",
    email: "bob.williams@example.com",
    cid: "40404040404",
    qecNumber: "N/A",
    status: "Suspended"
  },
  {
    id: 5,
    name: "Charlie Brown",
    email: "charlie.brown@example.com",
    cid: "50505050505",
    qecNumber: "N/A",
    status: "Regretted",
    regretReason: "Incomplete documentation"
  }
])

// Modal states
const isViewModalOpen = ref(false)
const isApproveModalOpen = ref(false)
const isRejectModalOpen = ref(false)

// Selected application and rejection reason
const selectedApplication = ref(null)
const rejectReason = ref('')

// Open modals
const openViewModal = (app) => {
  selectedApplication.value = app
  isViewModalOpen.value = true
}

const openApproveModal = (app) => {
  selectedApplication.value = app
  isApproveModalOpen.value = true
}

const openRejectModal = (app) => {
  selectedApplication.value = app
  isRejectModalOpen.value = true
}

// Close modals
const closeViewModal = () => {
  isViewModalOpen.value = false
}

const closeApproveModal = () => {
  isApproveModalOpen.value = false
}

const closeRejectModal = () => {
  isRejectModalOpen.value = false
  rejectReason.value = ''
}

// Approve application
const approveApplication = () => {
  selectedApplication.value.status = 'QEC Issued'
  closeApproveModal()
}

// Reject application
const rejectApplication = () => {
  selectedApplication.value.status = 'Regretted'
  selectedApplication.value.regretReason = rejectReason.value
  closeRejectModal()
}

// Computed properties for counts
const pendingCount = computed(() => 
  applications.value.filter(app => app.status === 'Pending').length
)

const underReviewCount = computed(() => 
  applications.value.filter(app => app.status === 'Under Review').length
)

const qecIssuedCount = computed(() => 
  applications.value.filter(app => app.status === 'QEC Issued').length
)

const suspendedCount = computed(() => 
  applications.value.filter(app => app.status === 'Suspended').length
)

const regrettedCount = computed(() => 
  applications.value.filter(app => app.status === 'Regretted').length
)

// Filtered applications based on current filter
const filteredApplications = computed(() => {
  if (currentFilter.value === 'All') return applications.value
  return applications.value.filter(app => app.status === currentFilter.value)
})

// Method to set the current filter
const setFilter = (filter) => {
  currentFilter.value = filter
}
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

tr:hover {
  background-color: #f5f5f5;
}

/* Modal styles */
.fixed {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.bg-opacity-50 {
  background-color: rgba(0, 0, 0, 0.5);
}

.rounded-lg {
  border-radius: 0.5rem;
}

.shadow-md {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* Button styles */
button {
  transition: background-color 0.3s ease;
}

button:hover {
  opacity: 0.9;
}

.bg-blue-500 {
  background-color: #3b82f6;
}

.bg-green-500 {
  background-color: #10b981;
}

.bg-red-500 {
  background-color: #ef4444;
}

.bg-gray-500 {
  background-color: #6b7280;
}

.text-white {
  color: white;
}

.px-4 {
  padding-left: 1rem;
  padding-right: 1rem;
}

.py-2 {
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}

.rounded {
  border-radius: 0.25rem;
}

/* Scrollable modal content */
.max-h-[90vh] {
  max-height: 90vh;
}

.overflow-y-auto {
  overflow-y: auto;
}

/* Sticky buttons at the bottom */
.sticky {
  position: sticky;
  bottom: 0;
}
</style>
