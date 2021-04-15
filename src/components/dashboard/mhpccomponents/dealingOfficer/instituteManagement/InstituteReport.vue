<template>
  <div class="min-h-screen bg-slate-50 py-8">
    <div class="mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-white rounded-xl shadow-lg overflow-hidden">
        <!-- Header -->
        <div class="px-6 py-5 border-b border-slate-200">
          <h3 class="text-xl font-semibold text-slate-900">EOI/DPR Reports</h3>
          <p class="mt-2 text-sm text-slate-600">
            View and filter submitted Expressions of Interest and Detailed Project Proposals.
          </p>
        </div>

        <!-- Filters Section -->
        <div class="p-6 border-b border-slate-200 bg-slate-50">
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- Status Filter -->
            <div class="space-y-1.5">
              <label for="statusFilter" class="block text-sm font-medium text-slate-700"
                >Status</label
              >
              <select
                id="statusFilter"
                v-model="filters.status"
                class="w-full rounded-lg border-slate-300 bg-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">All</option>
                <option value="Submitted">Submitted</option>
                <option value="Reviewed">Reviewed</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <!-- Type Filter -->
            <div class="space-y-1.5">
              <label for="typeFilter" class="block text-sm font-medium text-slate-700">Type</label>
              <select
                id="typeFilter"
                v-model="filters.type"
                class="w-full rounded-lg border-slate-300 bg-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">All</option>
                <option value="EOI">EOI</option>
                <option value="DPR">DPR</option>
              </select>
            </div>

            <!-- Search Filter -->
            <div class="space-y-1.5">
              <label for="searchFilter" class="block text-sm font-medium text-slate-700"
                >Search</label
              >
              <input
                type="text"
                id="searchFilter"
                v-model="filters.search"
                placeholder="Search by Name"
                class="w-full rounded-lg border-slate-300 bg-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <!-- Date From -->
            <div class="space-y-1.5">
              <label for="dateFrom" class="block text-sm font-medium text-slate-700"
                >Date From</label
              >
              <input
                type="date"
                id="dateFrom"
                v-model="filters.dateFrom"
                class="w-full rounded-lg border-slate-300 bg-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <!-- Date To -->
            <div class="space-y-1.5">
              <label for="dateTo" class="block text-sm font-medium text-slate-700">Date To</label>
              <input
                type="date"
                id="dateTo"
                v-model="filters.dateTo"
                class="w-full rounded-lg border-slate-300 bg-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <!-- Region Filter -->
            <div class="space-y-1.5">
              <label for="regionFilter" class="block text-sm font-medium text-slate-700"
                >Region</label
              >
              <select
                id="regionFilter"
                v-model="filters.region"
                class="w-full rounded-lg border-slate-300 bg-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">All</option>
                <option value="Thimphu">Thimphu</option>
                <option value="Paro">Paro</option>
                <option value="Gelephu">Gelephu</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Table Section -->
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-slate-200">
            <thead class="bg-slate-50">
              <tr>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                >
                  Name
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                >
                  Type
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                >
                  Date Submitted
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th scope="col" class="px-6 py-3 text-right">
                  <span class="sr-only">View</span>
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-slate-200">
              <tr v-for="report in filteredReports" :key="report.id" class="hover:bg-slate-50">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                  {{ report.name }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                  {{ report.type }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                  {{ formatDate(report.dateSubmitted) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="[
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                      report.status === 'Approved'
                        ? 'bg-green-100 text-green-800'
                        : report.status === 'Rejected'
                          ? 'bg-red-100 text-red-800'
                          : report.status === 'Reviewed'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-100 text-yellow-800',
                    ]"
                  >
                    {{ report.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm">
                  <button
                    @click="openReportModal(report)"
                    class="text-blue-600 hover:text-blue-900 font-medium transition-colors"
                  >
                    View
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <ReportModal :isOpen="isReportModalOpen" :report="selectedReport" @close="closeReportModal" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import ReportModal from './InstituteReportModal.vue'

const reports = ref([
  {
    id: 1,
    name: 'College of Medicine',
    type: 'EOI',
    dateSubmitted: '2023-10-26',
    status: 'Submitted',
    details: 'Some long description',
    region: 'Thimphu',
  },
  {
    id: 2,
    name: 'Health Institute of Paro',
    type: 'DPR',
    dateSubmitted: '2023-10-25',
    status: 'Approved',
    details: 'Another long description',
    region: 'Paro',
  },
  {
    id: 3,
    name: 'Nursing School Thimphu',
    type: 'EOI',
    dateSubmitted: '2023-10-24',
    status: 'Rejected',
    details: 'Yet another long description',
    region: 'Thimphu',
  },
  {
    id: 4,
    name: 'Pharmacy College Gelephu',
    type: 'DPR',
    dateSubmitted: '2023-10-23',
    status: 'Reviewed',
    details: 'More details here',
    region: 'Gelephu',
  },
])

const filters = ref({
  status: '',
  type: '',
  search: '',
  dateFrom: '',
  dateTo: '',
  region: '',
})

const isReportModalOpen = ref(false)
const selectedReport = ref(null)

const openReportModal = (report) => {
  selectedReport.value = report
  isReportModalOpen.value = true
}

const closeReportModal = () => {
  isReportModalOpen.value = false
  selectedReport.value = null
}

const filteredReports = computed(() => {
  return reports.value.filter((report) => {
    const statusMatch = filters.value.status === '' || report.status === filters.value.status
    const typeMatch = filters.value.type === '' || report.type === filters.value.type
    const searchMatch =
      filters.value.search === '' ||
      report.name.toLowerCase().includes(filters.value.search.toLowerCase())

    const dateFrom = filters.value.dateFrom ? new Date(filters.value.dateFrom) : null
    const dateTo = filters.value.dateTo ? new Date(filters.value.dateTo) : null
    const submittedDate = new Date(report.dateSubmitted)

    const dateMatch =
      (!dateFrom || submittedDate >= dateFrom) && (!dateTo || submittedDate <= dateTo)
    const regionMatch = filters.value.region === '' || report.region === filters.value.region

    return statusMatch && typeMatch && searchMatch && dateMatch && regionMatch
  })
})

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString()
}
</script>
