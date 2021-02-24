<template>
  <div class="bg-gray-50 min-h-screen">
    <div class="container">
      <!-- Header -->
      <div class="text-center mb-8">
        <h2 class="text-3xl font-extrabold text-gray-900 mb-4">CPD Activity Reports</h2>
        <p class="text-gray-600 text-lg">Generate and export reports on CPD activities</p>
      </div>

      <!-- Filters Card -->
      <div class="bg-white rounded-2xl shadow-xl p-8 mb-8">
        <h3 class="text-2xl font-semibold text-gray-800 mb-4">Report Filters</h3>
        <form @submit.prevent="generateReport" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label for="fromDate" class="block text-sm font-medium text-gray-700">From Date</label>
              <input type="date" id="fromDate" v-model="filters.fromDate"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
            </div>
            <div>
              <label for="toDate" class="block text-sm font-medium text-gray-700">To Date</label>
              <input type="date" id="toDate" v-model="filters.toDate"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
            </div>
            <div>
              <label for="status" class="block text-sm font-medium text-gray-700">Status</label>
              <select id="status" v-model="filters.status"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                <option value="">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>
          <div class="flex justify-end space-x-4">
            <button type="submit"
              class="bg-blue-600 text-white rounded-md py-3 px-6 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
              Generate Report
            </button>
          </div>
        </form>

        <!-- Export Buttons -->
        <div class="flex justify-end space-x-4 mt-6">
          <button type="button" @click="exportToExcel"
            class="bg-green-100 text-green-700 rounded-md py-3 px-6 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-green-500">
            Export to Excel
          </button>
          <button type="button" @click="exportToPDF"
            class="bg-red-100 text-red-700 rounded-md py-3 px-6 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500">
            Export to PDF
          </button>
        </div>
      </div>

      <!-- Results Section -->
      <div class="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CPD ID</th>
                <th scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicant
                  Name</th>
                <th scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="report in filteredReports" :key="report.id" class="hover:bg-gray-100 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{{ report.id }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ report.title }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ report.applicantName }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="[
                    {'bg-yellow-100 text-yellow-800': report.status === 'Pending'},
                    {'bg-green-100 text-green-800': report.status === 'Approved'},
                    {'bg-red-100 text-red-800': report.status === 'Rejected'},
                    'px-2 py-1 text-xs font-medium rounded-full'
                  ]">
                    {{ report.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(report.date) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- No Results Message -->
        <div v-if="filteredReports.length === 0" class="text-center py-8">
          <p class="text-gray-500 text-lg">No reports found for the selected filters.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';

const filters = reactive({
  fromDate: '',
  toDate: '',
  status: ''
});

const reports = [
  { id: 1, title: 'Microbiology Workshop', applicantName: 'John Doe', status: 'Approved', date: '2023-11-01' },
  { id: 2, title: 'ISO Standards Seminar', applicantName: 'Jane Smith', status: 'Pending', date: '2023-12-10' },
  { id: 3, title: 'Advanced Lab Techniques', applicantName: 'Alice Johnson', status: 'Rejected', date: '2024-01-15' },
  { id: 4, title: 'Clinical Research Methods', applicantName: 'Bob Brown', status: 'Approved', date: '2024-02-01' }
];

const filteredReports = ref([]);

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

const generateReport = () => {
  filteredReports.value = reports.filter((report) => {
    const reportDate = new Date(report.date);
    const fromDate = filters.fromDate ? new Date(filters.fromDate) : null;
    const toDate = filters.toDate ? new Date(filters.toDate) : null;

    const isWithinDateRange =
      (!fromDate || reportDate >= fromDate) && (!toDate || reportDate <= toDate);
    const matchesStatus = !filters.status || report.status === filters.status;

    return isWithinDateRange && matchesStatus;
  });
};

const exportToExcel = () => {
  alert('Exporting to Excel...');
  console.log('Exported Data:', filteredReports.value);
};

const exportToPDF = () => {
  alert('Exporting to PDF...');
  console.log('Exported Data:', filteredReports.value);
};
</script>

<style scoped>
/* Move specific styles here if needed */
</style>