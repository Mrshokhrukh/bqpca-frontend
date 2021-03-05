<template>
  <div class="bg-gray-50 min-h-screen">
    <div class="max-w-7xl mx-auto px-4 py-8"> <!-- Added padding and mx-auto -->
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
            <button type="button" @click="resetFilters"
              class="bg-gray-200 text-gray-700 rounded-md py-3 px-6 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500">
              Reset Filters
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
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  CPD ID</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Applicant
                  Name</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="report in filteredReports" :key="report.id" class="hover:bg-gray-100 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{{ report.id }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ report.title }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ report.applicantName }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="[
          { 'bg-yellow-100 text-yellow-800': report.reviewStatus === 'Pending' },
          { 'bg-green-100 text-green-800': report.reviewStatus === 'Approved' },
          { 'bg-red-100 text-red-800': report.reviewStatus === 'Rejected' },
          'px-2 py-1 text-xs font-medium rounded-full'
        ]">
                    {{ report.reviewStatus }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(report.date) }}</td>
              </tr>
              <!-- Loading State -->
              <tr v-if="isLoading">
                <td colspan="5" class="text-center py-4">Loading reports...</td>
              </tr>
            </tbody>

          </table>
        </div>
        <!-- No Results Message -->
        <div v-if="!isLoading && filteredReports.length === 0" class="text-center py-8">
          <p class="text-gray-500 text-lg">No reports found for the selected filters.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import apiServices from '@/services/services';
import * as XLSX from 'xlsx';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';

const filters = reactive({
  fromDate: '',
  toDate: '',
  status: ''
});

const reports = ref([]);  // Store the raw API data
const filteredReports = ref([]); // Store the filtered data for display
const isLoading = ref(false);

// Format date for display
const formatDate = (dateString) => {
  if (!dateString) return ''; // Handle null/undefined dates.
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

// Fetch data on component mount
onMounted(async () => {
  isLoading.value = true;
  try {
    const response = await apiServices.getBmhcCpdRecords();
    if (response && response.data && response.data.results) {
      reports.value = response.data.results.map(item => ({
        id: item.id,
        title: item.title_of_cpd,
        applicantName: item.full_name,
        reviewStatus: item.review_status, // Use review_status
        date: item.created_at,  // Keep the original date
        registrationNumber: item.registration_no,
        cidNumber: item.cid_no,
        fullName: item.full_name,
        gender: item.gender,
        cpdTitle: item.title_of_cpd,
        relevance: item.relevance_to_profession,
        participationCategory: item.participation_category?.participation_category_name,
        participantSubCategory: item.participant_sub_category?.participation_sub_category_name,
        activityType: item.type_of_cpd_activity?.cpd_activity_name,
        attachment: item.attachment ? { url: item.attachment } : null,
        cpdCredits: item.cpd_credit,
        remarks: item.remark,
      }));
      generateReport(); // Apply filters on initial load
    } else {
      console.error('Unexpected API response format:', response);
      reports.value = [];

    }
  } catch (error) {
    console.error('Error fetching CPD records:', error);
    reports.value = []; // Set to empty array on error

  } finally {
    isLoading.value = false;
  }
});



const generateReport = () => {
  filteredReports.value = reports.value.filter(report => {
    const reportDate = report.date ? new Date(report.date) : null;
    const fromDate = filters.fromDate ? new Date(filters.fromDate) : null;
    const toDate = filters.toDate ? new Date(filters.toDate) : null;
    // Adjust toDate to include the full day
    if (toDate) {
      toDate.setHours(23, 59, 59, 999);
    }

    const isWithinDateRange =
      (!fromDate || (reportDate && reportDate >= fromDate)) &&
      (!toDate || (reportDate && reportDate <= toDate));

    const matchesStatus = !filters.status || report.reviewStatus === filters.status;

    return isWithinDateRange && matchesStatus;
  });
};

const resetFilters = () => {
  filters.fromDate = '';
  filters.toDate = '';
  filters.status = '';
  generateReport(); // Re-apply filters (which will now show all data)
};

const exportToExcel = () => {
  //Prepare data
  const excelData = filteredReports.value.map(report => ({
    'CPD ID': report.id,
    'Title': report.title,
    'Applicant Name': report.applicantName,
    'Status': report.reviewStatus,
    'Date': formatDate(report.date) // Use the formatDate function
  }));
  //Create worksheet
  const ws = XLSX.utils.json_to_sheet(excelData);
  //create workbook
  const wb = XLSX.utils.book_new();
  //append worksheet
  XLSX.utils.book_append_sheet(wb, ws, "CPD_Reports");
  //export
  XLSX.writeFile(wb, "CPD_Reports.xlsx");
};

const exportToPDF = () => {
  if (filteredReports.value.length === 0) {
    alert('No data to export.'); // Or use a more sophisticated notification
    return;
  }

  const doc = new jsPDF();

  // Define columns for autoTable
  const columns = [
    { header: 'CPD ID', dataKey: 'id' },
    { header: 'Title', dataKey: 'title' },
    { header: 'Applicant Name', dataKey: 'applicantName' },
    { header: 'Status', dataKey: 'reviewStatus' },
    { header: 'Date', dataKey: 'date' },
  ];

  // Prepare data for autoTable
  const data = filteredReports.value.map(report => ({
    id: report.id,
    title: report.title,
    applicantName: report.applicantName,
    reviewStatus: report.reviewStatus,
    date: formatDate(report.date) // Use consistent date format
  }));
  doc.text("CPD Activity Report", 14, 15);
  // Use autoTable to generate the table in the PDF
  autoTable(doc, {
    columns: columns,
    body: data,
    startY: 20, // Adjust start position as needed
    didDrawPage: (data) => { //header for each page
      if (data.pageNumber !== 1) {
        doc.text("CPD Activity Report", 14, 15); //header
      }
    }
  });

  // Save the PDF
  doc.save('CPD_Reports.pdf');
};

</script>

<style scoped>
/* Add any component-specific styles here */
</style>
