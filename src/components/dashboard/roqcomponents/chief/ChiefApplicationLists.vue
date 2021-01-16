<template>
    <div>
      <!-- Stats Cards -->
      <ChiefStatsCard
        :totalApplications="applications.length"
        :totalApproved="approvedCount"
        :totalRegretted="regrettedCount"
        :totalPending="pendingCount"
      />
  
      <!-- Filter Dropdown -->
      <div class="mb-4">
        <label for="filterStatus" class="mr-2">Filter by Status:</label>
        <select id="filterStatus" v-model="filterStatus" class="p-2 border rounded">
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Regretted">Regretted</option>
        </select>
      </div>
  
      <!-- Table -->
      <table class="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead class="bg-gray-200">
          <tr>
            <th class="py-2 px-4">ID</th>
            <th class="py-2 px-4">Applicant Name</th>
            <th class="py-2 px-4">Status</th>
            <th class="py-2 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="app in filteredApplications" :key="app.id">
            <td class="py-2 px-4 text-center">{{ app.id }}</td>
            <td class="py-2 px-4 text-center">{{ app.name }}</td>
            <td class="py-2 px-4 text-center">
              {{ app.status }}
              <span v-if="app.status === 'Regretted' && app.regretReason" class="text-red-500 block text-sm">
                Reason: {{ app.regretReason }}
              </span>
            </td>
            <td class="py-2 px-4 text-center">
              <button
                v-if="app.status === 'Pending'"
                @click="viewApplication(app)"
                class="bg-blue-500 text-white px-3 py-1 rounded mr-2"
              >
                View
              </button>
              <button
                v-if="app.status === 'Pending'"
                @click="openApproveModal(app)"
                class="bg-green-500 text-white px-3 py-1 rounded mr-2"
              >
                Approve
              </button>
              <button
                v-if="app.status === 'Pending'"
                @click="openRejectModal(app)"
                class="bg-red-500 text-white px-3 py-1 rounded"
              >
                Reject
              </button>
            </td>
          </tr>
        </tbody>
      </table>
  
      <!-- Modal for Viewing/Editing Application Details -->
      <div v-if="selectedApplication" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div class="bg-white p-8 rounded-lg w-1/2 max-h-[90vh] overflow-y-auto relative">
          <h2 class="text-2xl font-bold mb-4">Application Details</h2>
          <div class="space-y-4">
            <!-- Editable Fields -->
            <div v-for="(value, key) in selectedApplication" :key="key">
              <label :for="key" class="block font-semibold">{{ key }}</label>
              <input
                v-if="isEditable(key) && isEditing"
                v-model="selectedApplication[key]"
                :id="key"
                class="w-full p-2 border rounded"
              />
              <p v-else>{{ value }}</p>
            </div>
          </div>
          <div class="sticky bottom-0 bg-white py-4">
            <button
              @click="toggleEdit"
              :class="isEditing ? 'bg-green-500' : 'bg-blue-500'"
              class="text-white px-4 py-2 rounded mr-2"
            >
              {{ isEditing ? "Save" : "Edit" }}
            </button>
            <button @click="closeModal" class="bg-gray-500 text-white px-4 py-2 rounded">Close</button>
          </div>
        </div>
      </div>
  
      <!-- Approve Modal -->
      <div v-if="isApproveModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div class="bg-white p-8 rounded-lg w-1/3">
          <h2 class="text-2xl font-bold mb-4">Approve Application</h2>
          <p class="mb-4">Are you sure you want to approve this application?</p>
          <div class="flex justify-end">
            <button @click="closeApproveModal" class="bg-gray-500 text-white px-4 py-2 rounded mr-2">Cancel</button>
            <button @click="confirmApprove" class="bg-green-500 text-white px-4 py-2 rounded">Approve</button>
          </div>
        </div>
      </div>
  
      <!-- Reject Modal -->
      <div v-if="isRejectModalOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div class="bg-white p-8 rounded-lg w-1/3">
          <h2 class="text-2xl font-bold mb-4">Reject Application</h2>
          <p class="mb-4">Please provide a reason for rejection:</p>
          <textarea
            v-model="rejectReason"
            class="w-full p-2 border rounded mb-4"
            placeholder="Enter reason..."
          ></textarea>
          <div class="flex justify-end">
            <button @click="closeRejectModal" class="bg-gray-500 text-white px-4 py-2 rounded mr-2">Cancel</button>
            <button @click="confirmReject" class="bg-red-500 text-white px-4 py-2 rounded">Reject</button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import ChiefStatsCard from "./ChiefStatsCard.vue";
  
  export default {
    components: {
      ChiefStatsCard,
    },
    data() {
      return {
        applications: [
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
          {
            id: 5,
            cidNo: "50505050505",
            name: "Charlie Brown",
            dob: "05/05/1994",
            contactNo: "21212121",
            email: "charlie.brown@example.com",
            courseTitle: "Civil Engineering",
            qualification: "Bachelor's Degree",
            typeOfCourse: "Full-time",
            duration: "4 years",
            institute: "College of Science and Technology",
            university: "Royal University of Bhutan",
            website: "www.cst.edu.bt",
            location: "Phuentsholing",
            country: "Bhutan",
            studentId: "STU11223",
            yearOfCompletion: "2024",
            degreeCertificate: "degree.pdf",
            academicTranscript: "transcript.pdf",
            remarks: "No remarks",
            confirmationDocument: "confirmation.pdf",
            status: "Pending",
            qecNumber: null,
            regretReason: null,
          },
          {
            id: 6,
            cidNo: "60606060606",
            name: "Diana Evans",
            dob: "06/06/1995",
            contactNo: "22222222",
            email: "diana.evans@example.com",
            courseTitle: "Architecture",
            qualification: "Bachelor's Degree",
            typeOfCourse: "Full-time",
            duration: "5 years",
            institute: "College of Science and Technology",
            university: "Royal University of Bhutan",
            website: "www.cst.edu.bt",
            location: "Phuentsholing",
            country: "Bhutan",
            studentId: "STU33445",
            yearOfCompletion: "2025",
            degreeCertificate: "degree.pdf",
            academicTranscript: "transcript.pdf",
            remarks: "No remarks",
            confirmationDocument: "confirmation.pdf",
            status: "Regretted",
            qecNumber: null,
            regretReason: "Incomplete documentation",
          },
        ],
        selectedApplication: null, // To store the application being viewed/edited
        filterStatus: "All", // For filtering applications
        isEditing: false, // To toggle between edit and save modes
        isApproveModalOpen: false, // To control the approve modal
        isRejectModalOpen: false, // To control the reject modal
        rejectReason: "", // To store the rejection reason
        applicationToProcess: null, // To store the application being approved/rejected
      };
    },
    computed: {
      approvedCount() {
        return this.applications.filter((app) => app.status === "Approved").length;
      },
      regrettedCount() {
        return this.applications.filter((app) => app.status === "Regretted").length;
      },
      pendingCount() {
        return this.applications.filter((app) => app.status === "Pending").length;
      },
      filteredApplications() {
        if (this.filterStatus === "All") {
          return this.applications;
        }
        return this.applications.filter((app) => app.status === this.filterStatus);
      },
    },
    methods: {
      // Check if a field is editable
      isEditable(key) {
        const nonEditableFields = ["id", "status", "qecNumber", "regretReason"];
        return !nonEditableFields.includes(key);
      },
  
      // View application details
      viewApplication(app) {
        this.selectedApplication = { ...app }; // Create a copy of the application for editing
        this.isEditing = false; // Reset edit mode when viewing a new application
      },
  
      // Toggle between edit and save modes
      toggleEdit() {
        if (this.isEditing) {
          // Save changes
          const index = this.applications.findIndex((app) => app.id === this.selectedApplication.id);
          if (index !== -1) {
            this.applications[index] = { ...this.selectedApplication }; // Update the application
          }
        }
        this.isEditing = !this.isEditing; // Toggle edit mode
      },
  
      // Close the modal
      closeModal() {
        this.selectedApplication = null;
        this.isEditing = false; // Reset edit mode
      },
  
      // Open Approve Modal
      openApproveModal(app) {
        this.applicationToProcess = app;
        this.isApproveModalOpen = true;
      },
  
      // Close Approve Modal
      closeApproveModal() {
        this.isApproveModalOpen = false;
        this.applicationToProcess = null;
      },
  
      // Confirm Approval
      confirmApprove() {
        if (this.applicationToProcess) {
          this.applicationToProcess.status = "Approved";
          this.applicationToProcess.qecNumber = `QEC-${Math.floor(1000 + Math.random() * 9000)}`; // Generate a unique QEC number
        }
        this.closeApproveModal();
      },
  
      // Open Reject Modal
      openRejectModal(app) {
        this.applicationToProcess = app;
        this.isRejectModalOpen = true;
      },
  
      // Close Reject Modal
      closeRejectModal() {
        this.isRejectModalOpen = false;
        this.applicationToProcess = null;
        this.rejectReason = "";
      },
  
      // Confirm Rejection
      confirmReject() {
        if (this.applicationToProcess && this.rejectReason) {
          this.applicationToProcess.status = "Regretted";
          this.applicationToProcess.regretReason = this.rejectReason;
        }
        this.closeRejectModal();
      },
    },
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