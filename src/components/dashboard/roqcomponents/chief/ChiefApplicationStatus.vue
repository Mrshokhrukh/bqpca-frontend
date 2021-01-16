<template>
    <div class="min-h-screen bg-slate-50 p-6">
      <div class="max-w-7xl mx-auto space-y-8">
<<<<<<< Updated upstream
        <!-- Stats Grid with Icons on the Right -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- Total Applications Card -->
          <div class="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
            <div class="flex justify-between items-center">
              <div>
                <p class="text-base font-medium text-slate-600">Total Applications</p>
                <p class="mt-2 text-3xl font-bold text-slate-900">{{ applications.length }}</p>
                <p class="text-sm text-slate-500">Total submissions</p>
              </div>
              <div class="p-4 rounded-full bg-blue-100">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
          </div>
  
          <!-- Approved Applications Card -->
          <div class="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
            <div class="flex justify-between items-center">
              <div>
                <p class="text-base font-medium text-slate-600">Approved Applications</p>
                <p class="mt-2 text-3xl font-bold text-green-600">{{ approvedCount }}</p>
                <p class="text-sm text-slate-500">Successfully processed</p>
              </div>
              <div class="p-4 rounded-full bg-green-100">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>
  
          <!-- Pending Applications Card -->
          <div class="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
            <div class="flex justify-between items-center">
              <div>
                <p class="text-base font-medium text-slate-600">Pending Applications</p>
                <p class="mt-2 text-3xl font-bold text-yellow-600">{{ pendingCount }}</p>
                <p class="text-sm text-slate-500">Awaiting review</p>
              </div>
              <div class="p-4 rounded-full bg-yellow-100">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
  
          <!-- Regretted Applications Card -->
          <div class="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
            <div class="flex justify-between items-center">
              <div>
                <p class="text-base font-medium text-slate-600">Regretted Applications</p>
                <p class="mt-2 text-3xl font-bold text-red-600">{{ regrettedCount }}</p>
                <p class="text-sm text-slate-500">Not approved</p>
              </div>
              <div class="p-4 rounded-full bg-red-100">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
=======
        <!-- Stats Grid with Icons and Modern Design -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="(stat, index) in stats" :key="index" class="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
            <div class="flex items-center gap-4">
              <div :class="[
                'p-3 rounded-full',
                {
                  'bg-blue-100': stat.colorClass === 'text-blue-600',
                  'bg-yellow-100': stat.colorClass === 'text-yellow-600',
                  'bg-red-100': stat.colorClass === 'text-red-600',
                  'bg-slate-100': stat.colorClass === 'text-slate-900',
                }
              ]">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" :class="stat.colorClass" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div>
                <p class="text-sm font-medium text-slate-600">{{ stat.title }}</p>
                <p :class="[
                  'mt-1 text-2xl font-bold',
                  stat.colorClass
                ]">{{ stat.value }}</p>
>>>>>>> Stashed changes
              </div>
            </div>
          </div>
        </div>
  
<<<<<<< Updated upstream
        <!-- Header with Filter
=======
        <!-- Header with Filter -->
>>>>>>> Stashed changes
        <div class="flex justify-between items-center">
          <div class="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <select 
              v-model="filterStatus" 
              class="p-2 border border-slate-200 rounded-lg bg-white text-slate-600 focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            >
              <option value="All">All Applications</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Regretted">Regretted</option>
            </select>
          </div>
<<<<<<< Updated upstream
        </div> -->
=======
        </div>
>>>>>>> Stashed changes
  
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
                        'bg-blue-100 text-blue-800': app.status === 'Approved',
                        'bg-yellow-100 text-yellow-800': app.status === 'Pending',
                        'bg-red-100 text-red-800': app.status === 'Regretted'
                      }
                    ]">
                      {{ app.status }}
                    </span>
<<<<<<< Updated upstream
                    <!-- Display regret reason if status is Regretted -->
                    <span v-if="app.status === 'Regretted' && app.regretReason" class="block text-sm text-red-500 mt-1">
                      Reason: {{ app.regretReason }}
                    </span>
=======
>>>>>>> Stashed changes
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        // Data from ChiefApplication
        chiefApplications: [
          {
            id: 1,
            cidNo: "10101010101",
            name: "John Doe",
            dob: "01/01/1990",
            contactNo: "17171717",
            email: "john.doe@example.com",
            courseTitle: "Computer Science",
            qualification: "Bachelor's Degree",
            typeOfCourse: "Full-time",
            duration: "4 years",
            institute: "Royal University of Bhutan",
            university: "Royal University of Bhutan",
            website: "www.rub.edu.bt",
            location: "Thimphu",
            country: "Bhutan",
            studentId: "STU12345",
            yearOfCompletion: "2022",
            degreeCertificate: "degree.pdf",
            academicTranscript: "transcript.pdf",
            remarks: "No remarks",
            confirmationDocument: "confirmation.pdf",
            status: "Pending",
            qecNumber: null,
            regretReason: null,
          },
          {
            id: 2,
            cidNo: "20202020202",
            name: "Jane Smith",
            dob: "02/02/1991",
            contactNo: "18181818",
            email: "jane.smith@example.com",
            courseTitle: "Business Administration",
            qualification: "Master's Degree",
            typeOfCourse: "Part-time",
            duration: "2 years",
            institute: "Royal Institute of Management",
            university: "Royal University of Bhutan",
            website: "www.rim.edu.bt",
            location: "Thimphu",
            country: "Bhutan",
            studentId: "STU67890",
            yearOfCompletion: "2021",
            degreeCertificate: "degree.pdf",
            academicTranscript: "transcript.pdf",
            remarks: "No remarks",
            confirmationDocument: "confirmation.pdf",
            status: "Approved",
            qecNumber: "QEC-1234",
            regretReason: null,
          },
        ],
        // Data from the second copy list
        secondCopyApplications: [
          {
            id: 3,
            cidNo: "30303030303",
            name: "Alice Johnson",
            dob: "03/03/1992",
            contactNo: "19191919",
            email: "alice.johnson@example.com",
            courseTitle: "Electrical Engineering",
            qualification: "Bachelor's Degree",
            typeOfCourse: "Full-time",
            duration: "4 years",
            institute: "College of Science and Technology",
            university: "Royal University of Bhutan",
            website: "www.cst.edu.bt",
            location: "Phuentsholing",
            country: "Bhutan",
            studentId: "STU54321",
            yearOfCompletion: "2023",
            degreeCertificate: "degree.pdf",
            academicTranscript: "transcript.pdf",
            remarks: "No remarks",
            confirmationDocument: "confirmation.pdf",
            status: "Pending",
            qecNumber: null,
            regretReason: null,
          },
          {
            id: 4,
            cidNo: "40404040404",
            name: "Bob Williams",
            dob: "04/04/1993",
            contactNo: "20202020",
            email: "bob.williams@example.com",
            courseTitle: "Mechanical Engineering",
            qualification: "Bachelor's Degree",
            typeOfCourse: "Full-time",
            duration: "4 years",
            institute: "College of Science and Technology",
            university: "Royal University of Bhutan",
            website: "www.cst.edu.bt",
            location: "Phuentsholing",
            country: "Bhutan",
            studentId: "STU98765",
            yearOfCompletion: "2023",
            degreeCertificate: "degree.pdf",
            academicTranscript: "transcript.pdf",
            remarks: "No remarks",
            confirmationDocument: "confirmation.pdf",
            status: "Approved",
            qecNumber: "QEC-5678",
            regretReason: null,
          },
        ],
        filterStatus: "All",
      };
    },
    computed: {
      // Combine data from both sources
      applications() {
        return [...this.chiefApplications, ...this.secondCopyApplications];
      },
<<<<<<< Updated upstream
      approvedCount() {
        return this.applications.filter((app) => app.status === "Approved").length;
      },
      regrettedCount() {
        return this.applications.filter((app) => app.status === "Regretted").length;
      },
      pendingCount() {
        return this.applications.filter((app) => app.status === "Pending").length;
=======
      stats() {
        return [
          {
            title: "Total Applications",
            value: this.applications.length,
            colorClass: "text-slate-900",
          },
          {
            title: "Approved",
            value: this.applications.filter((app) => app.status === "Approved").length,
            colorClass: "text-blue-600",
          },
          {
            title: "Pending",
            value: this.applications.filter((app) => app.status === "Pending").length,
            colorClass: "text-yellow-600",
          },
          {
            title: "Regretted",
            value: this.applications.filter((app) => app.status === "Regretted").length,
            colorClass: "text-red-600",
          },
        ];
>>>>>>> Stashed changes
      },
      filteredApplications() {
        if (this.filterStatus === "All") {
          return this.applications;
        }
        return this.applications.filter((app) => app.status === this.filterStatus);
      },
    },
  };
  </script>
  
  <style scoped>
<<<<<<< Updated upstream
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
=======
  /* Add any additional custom styles here if needed */
>>>>>>> Stashed changes
  </style>