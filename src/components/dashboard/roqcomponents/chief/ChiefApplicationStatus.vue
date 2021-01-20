<template>
  <div class="min-h-screen bg-slate-50 p-6">
    <div class="max-w-7xl mx-auto space-y-8">
      <!-- Stats Grid with Interactive Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- First Row -->
        <div 
          @click="setFilter('All')"
          class="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow duration-300 cursor-pointer"
          :class="{'ring-2 ring-blue-500': currentFilter === 'All'}"
        >
          <div class="flex justify-between items-center">
            <div>
              <p class="text-base font-medium text-slate-600">Total Applications</p>
              <p class="mt-2 text-3xl font-bold text-slate-900">{{ applications.length }}</p>
              <p class="text-sm text-slate-500">All submissions</p>
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

        <div 
          @click="setFilter('Pending')"
          class="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow duration-300 cursor-pointer"
          :class="{'ring-2 ring-yellow-500': currentFilter === 'Pending'}"
        >
          <div class="flex justify-between items-center">
            <div>
              <p class="text-base font-medium text-slate-600">Pending Applications</p>
              <p class="mt-2 text-3xl font-bold text-yellow-600">{{ pendingCount }}</p>
              <p class="text-sm text-slate-500">Awaiting review</p>
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

        <div 
          @click="setFilter('Under Review')"
          class="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow duration-300 cursor-pointer"
          :class="{'ring-2 ring-indigo-500': currentFilter === 'Under Review'}"
        >
          <div class="flex justify-between items-center">
            <div>
              <p class="text-base font-medium text-slate-600">Under Review Applications</p>
              <p class="mt-2 text-3xl font-bold text-indigo-600">{{ underReviewCount }}</p>
              <p class="text-sm text-slate-500">In progress</p>
            </div>
            <div class="p-4 rounded-full bg-indigo-100">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Second Row -->
        <div 
          @click="setFilter('QEC Issued')"
          class="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow duration-300 cursor-pointer"
          :class="{'ring-2 ring-green-500': currentFilter === 'QEC Issued'}"
        >
          <div class="flex justify-between items-center">
            <div>
              <p class="text-base font-medium text-slate-600">QEC Issued Applications</p>
              <p class="mt-2 text-3xl font-bold text-green-600">{{ qecIssuedCount }}</p>
              <p class="text-sm text-slate-500">Approved</p>
            </div>
            <div class="p-4 rounded-full bg-green-100">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>

        <div 
          @click="setFilter('Suspended')"
          class="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow duration-300 cursor-pointer"
          :class="{'ring-2 ring-orange-500': currentFilter === 'Suspended'}"
        >
          <div class="flex justify-between items-center">
            <div>
              <p class="text-base font-medium text-slate-600">Suspended Applications</p>
              <p class="mt-2 text-3xl font-bold text-orange-600">{{ suspendedCount }}</p>
              <p class="text-sm text-slate-500">On hold</p>
            </div>
            <div class="p-4 rounded-full bg-orange-100">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-orange-600" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
        </div>

        <div 
          @click="setFilter('Regretted')"
          class="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow duration-300 cursor-pointer"
          :class="{'ring-2 ring-red-500': currentFilter === 'Regretted'}"
        >
          <div class="flex justify-between items-center">
            <div>
              <p class="text-base font-medium text-slate-600">Regretted Applications</p>
              <p class="mt-2 text-3xl font-bold text-red-600">{{ regrettedCount }}</p>
              <p class="text-sm text-slate-500">Rejected</p>
            </div>
            <div class="p-4 rounded-full bg-red-100">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24"
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
            'bg-blue-100 text-blue-800': currentFilter === 'All',
            'bg-yellow-100 text-yellow-800': currentFilter === 'Pending',
            'bg-indigo-100 text-indigo-800': currentFilter === 'Under Review',
            'bg-green-100 text-green-800': currentFilter === 'QEC Issued',
            'bg-orange-100 text-orange-800': currentFilter === 'Suspended',
            'bg-red-100 text-red-800': currentFilter === 'Regretted'
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
                <th class="px-6 py-4 text-left text-sm font-medium text-slate-600">Course</th>
                <th class="px-6 py-4 text-left text-sm font-medium text-slate-600">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200">
              <tr v-for="app in filteredApplications" :key="app.id" class="hover:bg-slate-50 transition-colors">
                <td class="px-6 py-4 text-sm text-slate-600">{{ app.id }}</td>
                <td class="px-6 py-4">
                  <div class="text-sm font-medium text-slate-900">{{ app.name }}</div>
                  <div class="text-sm text-slate-600">{{ app.email }}</div>
                </td>
                <td class="px-6 py-4 text-sm text-slate-900">{{ app.courseTitle }}</td>
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
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

// Sample data
const applications = ref([
  {
    id: 1,
    cidNo: "10101010101",
    name: "John Doe",
    email: "john.doe@example.com",
    courseTitle: "Computer Science",
    status: "Pending",
    qecNumber: null,
    regretReason: null,
  },
  {
    id: 2,
    cidNo: "20202020202",
    name: "Jane Smith",
    email: "jane.smith@example.com",
    courseTitle: "Business Administration",
    status: "Under Review",
    qecNumber: null,
    regretReason: null,
  },
  {
    id: 3,
    cidNo: "30303030303",
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    courseTitle: "Electrical Engineering",
    status: "QEC Issued",
    qecNumber: "QEC-1234",
    regretReason: null,
  },
  {
    id: 4,
    cidNo: "40404040404",
    name: "Bob Williams",
    email: "bob.williams@example.com",
    courseTitle: "Mechanical Engineering",
    status: "Suspended",
    qecNumber: null,
    regretReason: "Pending further verification",
  },
  {
    id: 5,
    cidNo: "50505050505",
    name: "Charlie Brown",
    email: "charlie.brown@example.com",
    courseTitle: "Civil Engineering",
    status: "Regretted",
    qecNumber: null,
    regretReason: "Incomplete documentation",
  },
  {
    id: 6,
    cidNo: "60606060606",
    name: "David Wilson",
    email: "david.wilson@example.com",
    courseTitle: "Chemical Engineering",
    status: "Pending",
    qecNumber: null,
    regretReason: null,
  },
  {
    id: 7,
    cidNo: "70707070707",
    name: "Eva Green",
    email: "eva.green@example.com",
    courseTitle: "Biomedical Engineering",
    status: "Under Review",
    qecNumber: null,
    regretReason: null,
  },
  {
    id: 8,
    cidNo: "80808080808",
    name: "Frank White",
    email: "frank.white@example.com",
    courseTitle: "Aerospace Engineering",
    status: "QEC Issued",
    qecNumber: "QEC-5678",
    regretReason: null,
  },
  {
    id: 9,
    cidNo: "90909090909",
    name: "Grace Black",
    email: "grace.black@example.com",
    courseTitle: "Environmental Engineering",
    status: "Suspended",
    qecNumber: null,
    regretReason: "Awaiting additional documents",
  },
  {
    id: 10,
    cidNo: "101010101010",
    name: "Henry Brown",
    email: "henry.brown@example.com",
    courseTitle: "Software Engineering",
    status: "Regretted",
    qecNumber: null,
    regretReason: "Incorrect information provided",
  },
]);

// New reactive reference for the current filter
const currentFilter = ref('All');

// Function to set the active filter
const setFilter = (filter) => {
  currentFilter.value = filter;
};

// Computed properties
const pendingCount = computed(() => applications.value.filter((app) => app.status === "Pending").length);
const underReviewCount = computed(() => applications.value.filter((app) => app.status === "Under Review").length);
const qecIssuedCount = computed(() => applications.value.filter((app) => app.status === "QEC Issued").length);
const suspendedCount = computed(() => applications.value.filter((app) => app.status === "Suspended").length);
const regrettedCount = computed(() => applications.value.filter((app) => app.status === "Regretted").length);

// Modified filtered applications computed property
const filteredApplications = computed(() => {
  if (currentFilter.value === "All") {
    return applications.value;
  }
  return applications.value.filter((app) => app.status === currentFilter.value);
});
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
