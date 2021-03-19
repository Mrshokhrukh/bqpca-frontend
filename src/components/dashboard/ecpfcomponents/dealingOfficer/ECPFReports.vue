<template>
  <div class="container mx-auto p-4">
      <h2 class="text-2xl font-bold mb-4">Dealing Officer Reports</h2>

      <!-- Tabs Navigation -->
      <div class="border-b border-gray-200">
          <ul class="flex -mb-px">
              <li class="mr-2">
                  <button
                      @click="activeTab = 'applicationStatus'"
                      :class="activeTab === 'applicationStatus' ? 'inline-block p-4 border-b-2 border-blue-500 rounded-t-lg active' : 'inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:border-gray-300 hover:bg-gray-50 focus:outline-none'"
                  >
                      Application Status
                  </button>
              </li>
              <li class="mr-2">
                  <button
                      @click="activeTab = 'hrData'"
                      :class="activeTab === 'hrData' ? 'inline-block p-4 border-b-2 border-blue-500 rounded-t-lg active' : 'inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:border-gray-300 hover:bg-gray-50 focus:outline-none'"
                  >
                      HR Data
                  </button>
              </li>
              <li class="mr-2">
                  <button
                      @click="activeTab = 'studentData'"
                      :class="activeTab === 'studentData' ? 'inline-block p-4 border-b-2 border-blue-500 rounded-t-lg active' : 'inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:border-gray-300 hover:bg-gray-50 focus:outline-none'"
                  >
                      Student Data
                  </button>
              </li>
              <li class="mr-2">
                  <button
                      @click="activeTab = 'nonCompliance'"
                      :class="activeTab === 'nonCompliance' ? 'inline-block p-4 border-b-2 border-blue-500 rounded-t-lg active' : 'inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:border-gray-300 hover:bg-gray-50 focus:outline-none'"
                  >
                      Non-Compliance
                  </button>
              </li>
              <li>
                  <button
                      @click="activeTab = 'linkage'"
                      :class="activeTab === 'linkage' ? 'inline-block p-4 border-b-2 border-blue-500 rounded-t-lg active' : 'inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:border-gray-300 hover:bg-gray-50 focus:outline-none'"
                  >
                      Linkage Establishment
                  </button>
              </li>
          </ul>
      </div>

      <!-- Report Content -->
      <div class="mt-4">

          <!-- Application Status Report -->
          <div v-if="activeTab === 'applicationStatus'">
              <div class="relative"> <div class="flex justify-between items-start mb-2">
                  <h3 class="text-lg font-semibold">Application Status Reports</h3>
                  <button @click="exportToExcel('Application Status')" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Export to Excel</button>
              </div></div>


              <div class="mb-4 flex space-x-4">
                  <!-- Filters for Application Status -->
                  <div>
                      <label for="serviceTypeFilter" class="block text-sm font-medium text-gray-700">Service Type</label>
                      <select id="serviceTypeFilter" v-model="filters.applicationStatus.serviceType" class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                          <option value="">All Service Types</option>
                          <option v-for="type in serviceTypes" :key="type" :value="type">{{ type }}</option>
                      </select>
                  </div>
                  <div>
                      <label for="statusFilter" class="block text-sm font-medium text-gray-700">Status</label>
                      <select id="statusFilter" v-model="filters.applicationStatus.status" class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                          <option value="">All Statuses</option>
                          <option v-for="status in applicationStatuses" :key="status" :value="status">{{ status }}</option>
                      </select>
                  </div>
                  <div>
                      <label for="dateRangeFrom" class="block text-sm font-medium text-gray-700">Date Range From</label>
                      <input type="date" id="dateRangeFrom" v-model="filters.applicationStatus.dateRange.from" class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                  </div>
                  <div>
                      <label for="dateRangeTo" class="block text-sm font-medium text-gray-700">Date Range To</label>
                      <input type="date" id="dateRangeTo" v-model="filters.applicationStatus.dateRange.to" class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                  </div>
                  <div>
                      <button @click="applyApplicationFilters" class="mt-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Apply Filters</button>
                  </div>
              </div>

              <div class="overflow-x-auto">
                  <table class="min-w-full divide-y divide-gray-200">
                      <thead class="bg-gray-50">
                          <tr>
                              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Type</th>
                              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submission Date</th>
                              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ECPF Name</th>
                              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          </tr>
                      </thead>
                      <tbody class="bg-white divide-y divide-gray-200">
                          <tr v-for="app in filteredApplications" :key="app.id">
                              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ app.id }}</td>
                              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ app.serviceType }}</td>
                              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ app.submissionDate }}</td>
                              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ app.ecpfName }}</td>
                              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ app.status }}</td>
                          </tr>
                      </tbody>
                  </table>
              </div>
          </div>

          <!-- HR Data Report -->
          <div v-if="activeTab === 'hrData'">
              <div class="relative"> <div class="flex justify-between items-start mb-2">
                  <h3 class="text-lg font-semibold">HR Data Reports</h3>
                  <button @click="exportToExcel('HR Data')" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Export to Excel</button>
              </div></div>

              <div class="mb-4 flex space-x-4">
                  <!-- Filters for HR Data -->
                  <div>
                      <label for="hrEcpfNameFilter" class="block text-sm font-medium text-gray-700">ECPF Name</label>
                      <input type="text" id="hrEcpfNameFilter" v-model="filters.hrData.ecpfName" class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Search ECPF Name">
                  </div>
                  <div>
                      <label for="hrBranchFilter" class="block text-sm font-medium text-gray-700">Branch</label>
                      <input type="text" id="hrBranchFilter" v-model="filters.hrData.branch" class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Search Branch">
                  </div>
                  <div>
                      <button @click="applyHrDataFilters" class="mt-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Apply Filters</button>
                  </div>
              </div>


              <div class="overflow-x-auto">
                  <table class="min-w-full divide-y divide-gray-200">
                      <thead class="bg-gray-50">
                          <tr>
                              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee Name</th>
                              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ECPF Name</th>
                              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Branch</th>
                          </tr>
                      </thead>
                      <tbody class="bg-white divide-y divide-gray-200">
                          <tr v-for="hr in filteredHrData" :key="hr.id">
                              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ hr.id }}</td>
                              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ hr.employeeName }}</td>
                              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ hr.ecpfName }}</td>
                              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ hr.branch }}</td>
                          </tr>
                      </tbody>
                  </table>
              </div>
          </div>

          <!-- Student Data Report -->
          <div v-if="activeTab === 'studentData'">
              <div class="relative"> <div class="flex justify-between items-start mb-2">
                  <h3 class="text-lg font-semibold">Student Data Reports</h3>
                  <button @click="exportToExcel('Student Data')" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Export to Excel</button>
              </div></div>

              <div class="mb-4 flex space-x-4">
                  <!-- Filters for Student Data -->
                  <div>
                      <label for="studentEcpfNameFilter" class="block text-sm font-medium text-gray-700">ECPF Name</label>
                      <input type="text" id="studentEcpfNameFilter" v-model="filters.studentData.ecpfName" class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Search ECPF Name">
                  </div>
                  <div>
                      <label for="studentBranchFilter" class="block text-sm font-medium text-gray-700">Branch</label>
                      <input type="text" id="studentBranchFilter" v-model="filters.studentData.branch" class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Search Branch">
                  </div>
                  <div>
                      <button @click="applyStudentDataFilters" class="mt-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Apply Filters</button>
                  </div>
              </div>

              <div class="overflow-x-auto">
                  <table class="min-w-full divide-y divide-gray-200">
                      <thead class="bg-gray-50">
                          <tr>
                              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ECPF Name</th>
                              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Branch</th>
                              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                          </tr>
                      </thead>
                      <tbody class="bg-white divide-y divide-gray-200">
                          <tr v-for="student in filteredStudentData" :key="student.id">
                              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ student.id }}</td>
                              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ student.studentName }}</td>
                              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ student.ecpfName }}</td>
                              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ student.branch }}</td>
                              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ student.course }}</td>
                          </tr>
                      </tbody>
                  </table>
              </div>
          </div>

          <!-- Non-Compliance Report -->
          <div v-if="activeTab === 'nonCompliance'">
              <div class="relative"> <div class="flex justify-between items-start mb-2">
                  <h3 class="text-lg font-semibold">Non-Compliance Reports</h3>
                  <button @click="exportToExcel('Non-Compliance Records')" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Export to Excel</button>
              </div></div>

              <div class="mb-4 flex space-x-4">
                  <!-- Filters for Non-Compliance -->
                  <div>
                      <label for="nonComplianceStatusFilter" class="block text-sm font-medium text-gray-700">Status</label>
                      <select id="nonComplianceStatusFilter" v-model="filters.nonCompliance.status" class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                          <option value="">All Statuses</option>
                          <option value="Pending Action">Pending Action</option>
                          <option value="Action Taken">Action Taken</option>
                      </select>
                  </div>
                  <div>
                      <button @click="applyNonComplianceFilters" class="mt-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Apply Filters</button>
                  </div>
              </div>

              <div class="overflow-x-auto">
                  <table class="min-w-full divide-y divide-gray-200">
                      <thead class="bg-gray-50">
                          <tr>
                              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ECPF Name</th>
                              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Record Date</th>
                              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          </tr>
                      </thead>
                      <tbody class="bg-white divide-y divide-gray-200">
                          <tr v-for="nc in filteredNonComplianceData" :key="nc.id">
                              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ nc.id }}</td>
                              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ nc.ecpfName }}</td>
                              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ nc.recordDate }}</td>
                              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ nc.description }}</td>
                              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ nc.status }}</td>
                          </tr>
                      </tbody>
                  </table>
              </div>
          </div>

           <!-- Linkage Establishment Report -->
           <div v-if="activeTab === 'linkage'">
              <div class="relative"> <div class="flex justify-between items-start mb-2">
                  <h3 class="text-lg font-semibold">Linkage Establishment Reports</h3>
                  <button @click="exportToExcel('Linkage Data')" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Export to Excel</button>
              </div></div>

              <div class="mb-4 flex space-x-4">
                  <!-- Filters for Linkage Data -->
                  <div>
                      <label for="linkageCountryFilter" class="block text-sm font-medium text-gray-700">Country</label>
                      <input type="text" id="linkageCountryFilter" v-model="filters.linkage.country" class="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Search Country">
                  </div>
                  <div>
                      <button @click="applyLinkageFilters" class="mt-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Apply Filters</button>
                  </div>
              </div>

              <div class="overflow-x-auto">
                  <table class="min-w-full divide-y divide-gray-200">
                      <thead class="bg-gray-50">
                          <tr>
                              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ECPF Name</th>
                              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Linked Name</th>
                              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                          </tr>
                      </thead>
                      <tbody class="bg-white divide-y divide-gray-200">
                          <tr v-for="linkage in filteredLinkageData" :key="linkage.id">
                              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ linkage.id }}</td>
                              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ linkage.ecpfName }}</td>
                              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ linkage.linkedName }}</td>
                              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ linkage.location }}</td>
                          </tr>
                      </tbody>
                  </table>
              </div>
          </div>

          <div v-if="activeTab !== 'applicationStatus' && activeTab !== 'hrData' && activeTab !== 'studentData' && activeTab !== 'nonCompliance' && activeTab !== 'linkage'">
              <p>Select a report category to view reports.</p>
          </div>
      </div>
  </div>
</template>
<script setup>
import { ref } from 'vue';

// Mock Data (Replace with actual data fetching in a real application)
const applicationStatuses = ['Draft', 'Pending', 'Under Review', 'Shortlisted', 'Evaluation', 'Operation Confirmation', 'Approved', 'Suspended', 'Regretted'];
const serviceTypes = ['New Establishment', 'Renewal', 'Name Change', 'Location Change', 'Ownership Change', 'Linkage Establishment', 'Education Fair', 'Promotional Events'];

const applicationsData = ref([
    { id: 1, serviceType: 'New Establishment', submissionDate: '2024-08-01', ecpfName: 'ECPF Alpha', status: 'Pending' },
    { id: 2, serviceType: 'Renewal', submissionDate: '2024-07-15', ecpfName: 'ECPF Beta', status: 'Approved' },
    { id: 3, serviceType: 'Name Change', submissionDate: '2024-08-10', ecpfName: 'ECPF Gamma', status: 'Under Review' },
    { id: 4, serviceType: 'New Establishment', submissionDate: '2024-08-15', ecpfName: 'ECPF Delta', status: 'Draft' },
    { id: 5, serviceType: 'Location Change', submissionDate: '2024-07-20', ecpfName: 'ECPF Epsilon', status: 'Approved' },
]);

const hrData = ref([
    { id: 101, employeeName: 'John Doe', ecpfName: 'ECPF Alpha', branch: 'Main Branch' },
    { id: 102, employeeName: 'Jane Smith', ecpfName: 'ECPF Beta', branch: 'Branch A' },
    { id: 103, employeeName: 'Peter Jones', ecpfName: 'ECPF Alpha', branch: 'Branch B' },
]);

const studentData = ref([
    { id: 201, studentName: 'Alice Wonderland', ecpfName: 'ECPF Alpha', branch: 'Main Branch', course: 'Course X' },
    { id: 202, studentName: 'Bob Builder', ecpfName: 'ECPF Beta', branch: 'Branch A', course: 'Course Y' },
    { id: 203, studentName: 'Charlie Chaplin', ecpfName: 'ECPF Alpha', branch: 'Branch B', course: 'Course Z' },
]);

const nonComplianceData = ref([
    { id: 301, ecpfName: 'ECPF Gamma', recordDate: '2024-08-05', description: 'Missing Document X', status: 'Pending Action' },
    { id: 302, ecpfName: 'ECPF Delta', recordDate: '2024-07-25', description: 'Late Submission Y', status: 'Action Taken' },
]);

const linkageData = ref([
    { id: 401, ecpfName: 'ECPF Alpha', linkedName: 'Partner Org 1', location: 'Country A' },
    { id: 402, ecpfName: 'ECPF Beta', linkedName: 'Partner Org 2', location: 'Country B' },
]);


const activeTab = ref('applicationStatus'); // Default active tab

const filters = ref({ // Example filters - expand as needed
    applicationStatus: {
        serviceType: '',
        status: '',
        dateRange: { from: null, to: null } // Example date range filter
    },
    hrData: {
        ecpfName: '',
        branch: ''
    },
    studentData: {
        ecpfName: '',
        branch: ''
    },
    nonCompliance: {
        status: ''
    },
    linkage: {
        country: ''
    }
});

const filteredApplications = ref([...applicationsData.value]); // Initially show all applications - filtering logic will be added later
const filteredHrData = ref([...hrData.value]);
const filteredStudentData = ref([...studentData.value]);
const filteredNonComplianceData = ref([...nonComplianceData.value]);
const filteredLinkageData = ref([...linkageData.value]);


// --- Placeholder Filtering Functions (Implement actual filtering logic based on 'filters.value') ---
const applyApplicationFilters = () => {
    filteredApplications.value = applicationsData.value.filter(app => {
        const serviceTypeFilter = filters.value.applicationStatus.serviceType;
        const statusFilter = filters.value.applicationStatus.status;
        const dateRangeFrom = filters.value.applicationStatus.dateRange.from;
        const dateRangeTo = filters.value.applicationStatus.dateRange.to;

        const serviceTypeMatch = !serviceTypeFilter || app.serviceType === serviceTypeFilter;
        const statusMatch = !statusFilter || app.status === statusFilter;
        const dateRangeMatch = (!dateRangeFrom || !dateRangeTo) || (app.submissionDate >= dateRangeFrom && app.submissionDate <= dateRangeTo);

        return serviceTypeMatch && statusMatch && dateRangeMatch;
    });
};

const applyHrDataFilters = () => {
    filteredHrData.value = hrData.value.filter(hr => {
        const ecpfNameFilter = filters.value.hrData.ecpfName.toLowerCase();
        const branchFilter = filters.value.hrData.branch.toLowerCase();

        const ecpfNameMatch = !ecpfNameFilter || hr.ecpfName.toLowerCase().includes(ecpfNameFilter);
        const branchMatch = !branchFilter || hr.branch.toLowerCase().includes(branchFilter);

        return ecpfNameMatch && branchMatch;
    });
};
const applyStudentDataFilters = () => {
    filteredStudentData.value = studentData.value.filter(student => {
        const ecpfNameFilter = filters.value.studentData.ecpfName.toLowerCase();
        const branchFilter = filters.value.studentData.branch.toLowerCase();

        const ecpfNameMatch = !ecpfNameFilter || student.ecpfName.toLowerCase().includes(ecpfNameFilter);
        const branchMatch = !branchFilter || student.branch.toLowerCase().includes(branchFilter);

        return ecpfNameMatch && branchMatch;
    });
};
const applyNonComplianceFilters = () => {
    filteredNonComplianceData.value = nonComplianceData.value.filter(nc => {
        const statusFilter = filters.value.nonCompliance.status;
        const statusMatch = !statusFilter || nc.status === statusFilter;
        return statusMatch;
    });
};
const applyLinkageFilters = () => {
    filteredLinkageData.value = linkageData.value.filter(linkage => {
        const countryFilter = filters.value.linkage.country.toLowerCase();
        const countryMatch = !countryFilter || linkage.location.toLowerCase().includes(countryFilter);
        return countryMatch;
    });
};


const exportToExcel = (reportType) => {
    // Placeholder for export to Excel functionality
    console.log(`Exporting ${reportType} to Excel`);
    alert(`Exporting ${reportType} to Excel (Not Implemented)`); // Replace with actual export logic
};

</script>



<style scoped>
/* You can add component-specific styles here if needed */
.active {
    @apply bg-gray-50; /* Example active tab style */
}
</style>