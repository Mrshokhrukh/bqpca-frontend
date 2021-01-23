<template>
    <div class="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        <!-- Header Section -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900">Generate Reports</h1>
          <p class="mt-2 text-gray-600">View and export CPD activity reports</p>
        </div>
  
        <!-- Filters Card -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
          <div class="bg-gradient-to-r from-indigo-500 to-indigo-600 px-6 py-4 rounded-t-xl">
            <h2 class="text-xl font-semibold text-white flex items-center gap-2">
              <i class="fas fa-filter"></i> Report Filters
            </h2>
          </div>
  
          <form @submit.prevent="generateReport" class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <!-- From Date -->
              <div class="space-y-2">
                <label class="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <i class="fas fa-calendar text-indigo-500"></i> From Date
                </label>
                <input 
                  v-model="filters.fromDate"
                  type="date"
                  class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>
  
              <!-- To Date -->
              <div class="space-y-2">
                <label class="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <i class="fas fa-calendar text-indigo-500"></i> To Date
                </label>
                <input 
                  v-model="filters.toDate"
                  type="date"
                  class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>
  
              <!-- Status -->
              <div class="space-y-2">
                <label class="text-sm font-medium text-gray-700 flex items-center gap-1">
                  <i class="fas fa-tag text-indigo-500"></i> Status
                </label>
                <select 
                  v-model="filters.status"
                  class="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                >
                  <option value="">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
  
              <!-- Action Buttons -->
              <div class="space-y-2 flex items-end">
                <div class="flex gap-2 w-full">
                  <button 
                    type="submit"
                    class="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
                  >
                    <i class="fas fa-search mr-2"></i> Generate
                  </button>
                </div>
              </div>
            </div>
  
            <!-- Export Buttons -->
            <div class="mt-6 flex gap-4">
              <button 
                type="button" 
                @click="exportToExcel"
                class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
              >
                <i class="fas fa-file-excel text-green-600 mr-2"></i> Export to Excel
              </button>
              <button 
                type="button" 
                @click="exportToPDF"
                class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
              >
                <i class="fas fa-file-pdf text-red-600 mr-2"></i> Export to PDF
              </button>
            </div>
          </form>
        </div>
  
        <!-- Results Section -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div class="bg-gradient-to-r from-indigo-500 to-indigo-600 px-6 py-4">
            <h2 class="text-xl font-semibold text-white flex items-center gap-2">
              <i class="fas fa-table"></i> Report Results
            </h2>
          </div>
  
          <div class="p-6">
            <!-- Results Table -->
            <div v-if="filteredReports.length > 0" class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr class="bg-gray-50">
                    <th v-for="header in ['CPD ID', 'Title', 'Applicant Name', 'Status', 'Date']" 
                        :key="header"
                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {{ header }}
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="report in filteredReports" 
                      :key="report.id"
                      class="hover:bg-gray-50 transition-colors"
                  >
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{{ report.id }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {{ report.title }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {{ report.applicantName }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span 
                        :class="{
                          'px-2 py-1 text-xs font-medium rounded-full': true,
                          'bg-yellow-100 text-yellow-800': report.status === 'Pending',
                          'bg-green-100 text-green-800': report.status === 'Approved',
                          'bg-red-100 text-red-800': report.status === 'Rejected'
                        }"
                      >
                        {{ report.status }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {{ formatDate(report.date) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
  
            <!-- No Results Message -->
            <div v-else class="text-center py-8">
              <i class="fas fa-search text-gray-400 text-4xl mb-4"></i>
              <p class="text-gray-500 text-lg">No reports found for the selected filters.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, reactive } from 'vue'
  
  const filters = reactive({
    fromDate: '',
    toDate: '',
    status: ''
  })
  
  const reports = [
    { id: 1, title: 'Microbiology Workshop', applicantName: 'John Doe', status: 'Approved', date: '2023-11-01' },
    { id: 2, title: 'ISO Standards Seminar', applicantName: 'Jane Smith', status: 'Pending', date: '2023-12-10' },
    { id: 3, title: 'Advanced Lab Techniques', applicantName: 'Alice Johnson', status: 'Rejected', date: '2024-01-15' },
    { id: 4, title: 'Clinical Research Methods', applicantName: 'Bob Brown', status: 'Approved', date: '2024-02-01' }
  ]
  
  const filteredReports = ref([])
  
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }
  
  const generateReport = () => {
    filteredReports.value = reports.filter((report) => {
      const reportDate = new Date(report.date)
      const fromDate = filters.fromDate ? new Date(filters.fromDate) : null
      const toDate = filters.toDate ? new Date(filters.toDate) : null
  
      const isWithinDateRange =
        (!fromDate || reportDate >= fromDate) && (!toDate || reportDate <= toDate)
      const matchesStatus = !filters.status || report.status === filters.status
  
      return isWithinDateRange && matchesStatus
    })
  }
  
  const exportToExcel = () => {
    alert('Exporting to Excel...')
    console.log('Exported Data:', filteredReports.value)
  }
  
  const exportToPDF = () => {
    alert('Exporting to PDF...')
    console.log('Exported Data:', filteredReports.value)
  }
  </script>
  
  <style scoped>
  .generate-reports {
    max-width: 1000px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .filters-form {
    margin-bottom: 20px;
  }
  
  .form-group {
    margin-bottom: 15px;
  }
  
  label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
  }
  
  input,
  select {
    padding: 8px;
    margin-right: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
  }
  
  button {
    padding: 10px 20px;
    margin-right: 10px;
    cursor: pointer;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
  }
  
  button:hover {
    background-color: #0056b3;
  }
  
  .reports-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
  }
  
  th,
  td {
    padding: 10px;
    border: 1px solid #ddd;
    text-align: left;
  }
  
  th {
    background-color: #f0f0f0;
  }
  
  .no-results {
    margin-top: 20px;
    text-align: center;
    color: #888;
  }
  </style>