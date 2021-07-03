<template>
  <div class="dashboard-container">
    <header class="dashboard-header">
      <h1>Complaint Management Dashboard</h1>
      <p>Oversee, manage, and resolve all submitted complaints.</p>
    </header>

    <!-- Key Performance Indicators (KPIs) / Stats -->
    <div class="stats-grid">
      <div class="stat-card">
        <h3>Total Complaints</h3>
        <p class="stat-number">{{ stats.total }}</p>
      </div>
      <div class="stat-card pending">
        <h3>Pending Review</h3>
        <p class="stat-number">{{ stats.pending }}</p>
      </div>
      <div class="stat-card in-progress">
        <h3>In Progress</h3>
        <p class="stat-number">{{ stats.inProgress }}</p>
      </div>
      <div class="stat-card resolved">
        <h3>Resolved</h3>
        <p class="stat-number">{{ stats.resolved }}</p>
      </div>
    </div>

    <!-- Filters and Search -->
    <div class="filter-bar">
      <input type="text" v-model="filters.search" placeholder="Search by ID, Subject, or Professional..." @keyup.enter="applyFilters" />
      <select v-model="filters.status">
        <option value="">All Statuses</option>
        <option v-for="status in masterStatuses" :key="status.id" :value="status.name">{{ status.name }}</option>
      </select>
      <button @click="applyFilters">Apply</button>
      <button @click="resetFilters" class="secondary">Reset</button>
    </div>

    <!-- Loading and Error States -->
    <div v-if="isLoading" class="loading-state">Loading complaints...</div>
    <div v-if="error" class="error-state">
      <p>Failed to load complaints: {{ error }}</p>
      <button @click="fetchComplaintsData">Try Again</button>
    </div>

    <!-- Complaints Table -->
    <div v-if="!isLoading && !error" class="complaints-table-container">
      <table class="complaints-table">
        <thead>
          <tr>
            <th>Complaint ID</th>
            <th>Subject</th>
            <th>Professional Involved</th>
            <th>Date Submitted</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="complaints.length === 0">
            <td colspan="6" class="no-data">No complaints found.</td>
          </tr>
          <tr v-for="complaint in complaints" :key="complaint.id">
            <td>{{ complaint.complaint_id }}</td>
            <td>{{ complaint.subject }}</td>
            <td>{{ complaint.professional_name }}</td>
            <td>{{ formatDate(complaint.created_at) }}</td>
            <td><span :class="['status-badge', getStatusClass(complaint.status)]">{{ complaint.status }}</span></td>
            <td>
              <button @click="viewDetails(complaint)" class="action-btn">View Details</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="pagination.totalPages > 1" class="pagination-controls">
        <button @click="changePage(pagination.currentPage - 1)" :disabled="pagination.currentPage === 1">Previous</button>
        <span>Page {{ pagination.currentPage }} of {{ pagination.totalPages }}</span>
        <button @click="changePage(pagination.currentPage + 1)" :disabled="pagination.currentPage === pagination.totalPages">Next</button>
    </div>

    <!-- Details Modal -->
    <div v-if="selectedComplaint" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <button class="modal-close" @click="closeModal">×</button>
        <h2>Complaint Details: {{ selectedComplaint.complaint_id }}</h2>

        <div class="modal-section">
          <h4>Grievance Information</h4>
          <p><strong>Subject:</strong> {{ selectedComplaint.subject }}</p>
          <p><strong>Professional Involved:</strong> {{ selectedComplaint.professional_name }} ({{ selectedComplaint.professional_designation }})</p>
          <p><strong>Workplace:</strong> {{ selectedComplaint.professional_workplace }}</p>
          <p><strong>Incident Date:</strong> {{ formatDateTime(selectedComplaint.incident_datetime) }}</p>
          <p><strong>Details:</strong></p>
          <blockquote class="grievance-details">{{ selectedComplaint.grievance_details }}</blockquote>
          <p v-if="selectedComplaint.attachment">
            <strong>Attachment:</strong> <a :href="selectedComplaint.attachment" target="_blank" rel="noopener noreferrer">View Document</a>
          </p>
        </div>

        <div class="modal-section">
            <h4>Respondent Details</h4>
            <p><strong>Full Name:</strong> {{ selectedComplaint.respondent_application_details.full_name }}</p>
            <p><strong>Registration No:</strong> {{ selectedComplaint.respondent_application_details.registration_no }}</p>
            <p><strong>Email:</strong> {{ selectedComplaint.respondent_application_details.email }}</p>
        </div>

        <div class="modal-section">
            <h4>Submitted By</h4>
            <p><strong>Name:</strong> {{ selectedComplaint.submitted_by_name }}</p>
            <p><strong>Contact:</strong> {{ selectedComplaint.submitted_by_contact_number }}</p>
            <p><strong>Email:</strong> {{ selectedComplaint.submitted_by_email }}</p>
        </div>

        <div class="modal-section update-form">
          <h4>Update Status</h4>
          <label for="status-update">Status</label>
          <select id="status-update" v-model="updateData.status">
             <option v-for="status in masterStatuses" :key="status.id" :value="status.name">{{ status.name }}</option>
          </select>

          <label for="remarks-update">Remarks</label>
          <textarea id="remarks-update" v-model="updateData.remarks" rows="3" placeholder="Add remarks for this update..."></textarea>

          <button @click="submitUpdate" :disabled="isUpdating">
            {{ isUpdating ? 'Updating...' : 'Submit Update' }}
          </button>
          <p v-if="updateError" class="error-text">{{ updateError }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import apiService from '@/services/services'; // Adjust path as needed

// Reactive State
const complaints = ref([]);
const isLoading = ref(true);
const error = ref(null);
const masterStatuses = ref([]);
const selectedComplaint = ref(null);
const isUpdating = ref(false);
const updateError = ref(null);

const stats = reactive({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0
});

const filters = reactive({
  search: '',
  status: ''
});

const pagination = reactive({
    currentPage: 1,
    totalPages: 1,
    count: 0
});

const updateData = reactive({
  status: '',
  remarks: ''
});

// Methods
const fetchComplaintsData = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    const params = {
        page: pagination.currentPage,
        search: filters.search,
        status: filters.status,
    };
    // The API response should ideally contain 'results', 'count', and 'next'/'previous' links
    const response = await apiService.getComplaints(params);
    complaints.value = response.data.results; // Assuming paginated response
    pagination.count = response.data.count;
    pagination.totalPages = Math.ceil(response.data.count / 10); // Assuming 10 items per page

    // For simplicity, we'll calculate stats from the total count.
    // A better way is to have a dedicated API endpoint for stats.
    stats.total = response.data.count;
    // You would typically get these counts from a separate API or calculate them if all data is fetched
    // This is a placeholder calculation:
    // stats.pending = ...
    // stats.resolved = ...

  } catch (err) {
    error.value = err.message || 'An unknown error occurred.';
    console.error("Error fetching complaints:", err);
  } finally {
    isLoading.value = false;
  }
};

const fetchMasterStatuses = async () => {
    try {
        const response = await apiService.getComplaintMasterStatuses();
        masterStatuses.value = response.data;
    } catch (err) {
        console.error("Error fetching master statuses:", err);
    }
};

const applyFilters = () => {
    pagination.currentPage = 1; // Reset to first page on new filter
    fetchComplaintsData();
};

const resetFilters = () => {
    filters.search = '';
    filters.status = '';
    pagination.currentPage = 1;
    fetchComplaintsData();
};

const changePage = (page) => {
    if (page > 0 && page <= pagination.totalPages) {
        pagination.currentPage = page;
        fetchComplaintsData();
    }
}

const viewDetails = (complaint) => {
  selectedComplaint.value = complaint;
  updateData.status = complaint.status;
  updateData.remarks = complaint.remarks || '';
  updateError.value = null; // Reset previous errors
};

const closeModal = () => {
  selectedComplaint.value = null;
};

const submitUpdate = async () => {
    if (!selectedComplaint.value) return;

    isUpdating.value = true;
    updateError.value = null;

    try {
        await apiService.updateComplaint(selectedComplaint.value.id, {
            status: updateData.status,
            remarks: updateData.remarks
        });
        closeModal();
        // Refresh the data to show the change
        fetchComplaintsData();
    } catch (err) {
        updateError.value = 'Failed to update. Please try again.';
        console.error("Update error:", err);
    } finally {
        isUpdating.value = false;
    }
};

// Utility Functions
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString();
};
const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleString();
};

const getStatusClass = (status) => {
    return status?.toLowerCase().replace(' ', '-') || 'default';
};

// Lifecycle Hook
onMounted(() => {
  fetchComplaintsData();
  fetchMasterStatuses();
});

</script>

<style scoped>
.dashboard-container {
  padding: 2rem;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  background-color: #f8f9fa;
}

.dashboard-header {
  margin-bottom: 2rem;
}

h1 {
  font-size: 2rem;
  font-weight: 600;
  color: #212529;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}
.stat-card {
  background: #fff;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}
.stat-card h3 {
  font-size: 1rem;
  color: #6c757d;
  margin: 0 0 0.5rem 0;
}
.stat-number {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0;
  color: #343a40;
}
.stat-card.pending .stat-number { color: #fd7e14; }
.stat-card.in-progress .stat-number { color: #007bff; }
.stat-card.resolved .stat-number { color: #28a745; }


/* Filter Bar */
.filter-bar {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  align-items: center;
}
.filter-bar input, .filter-bar select {
  padding: 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 6px;
  font-size: 1rem;
  flex-grow: 1;
}
.filter-bar button {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  background-color: #007bff;
  color: white;
  transition: background-color 0.2s;
}
.filter-bar button:hover { background-color: #0056b3; }
.filter-bar button.secondary { background-color: #6c757d; }
.filter-bar button.secondary:hover { background-color: #5a6268; }


/* Table */
.complaints-table-container {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  overflow-x: auto;
}
.complaints-table {
  width: 100%;
  border-collapse: collapse;
}
.complaints-table th, .complaints-table td {
  padding: 1rem 1.25rem;
  text-align: left;
  border-bottom: 1px solid #e9ecef;
}
.complaints-table th {
  background-color: #f8f9fa;
  font-weight: 600;
  color: #495057;
}
.complaints-table tr:last-child td {
  border-bottom: none;
}
.complaints-table tr:hover {
    background-color: #f1f3f5;
}
.no-data {
  text-align: center;
  padding: 2rem;
  color: #6c757d;
}

/* Status Badge */
.status-badge {
  padding: 0.25em 0.6em;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #fff;
}
.status-badge.resolved { background-color: #28a745; }
.status-badge.pending, .status-badge.pending-review { background-color: #fd7e14; }
.status-badge.in-progress { background-color: #007bff; }
.status-badge.default { background-color: #6c757d; }


/* Action Button */
.action-btn {
  background: none;
  border: 1px solid #007bff;
  color: #007bff;
  padding: 0.4rem 0.8rem;
  border-radius: 5px;
  cursor: pointer;
}
.action-btn:hover { background: #007bff; color: #fff; }

/* Pagination */
.pagination-controls {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 1.5rem;
    gap: 1rem;
}
.pagination-controls button {
    padding: 0.5rem 1rem;
    border: 1px solid #ddd;
    background: #fff;
    cursor: pointer;
}
.pagination-controls button:disabled {
    cursor: not-allowed;
    opacity: 0.5;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.modal-content {
  background: #fff;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}
.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  font-size: 1.5rem;
  background: none;
  border: none;
  cursor: pointer;
}
.modal-section {
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #e9ecef;
  padding-bottom: 1.5rem;
}
.modal-section:last-child {
  border-bottom: none;
  padding-bottom: 0;
}
.modal-section h4 {
  margin-top: 0;
  color: #007bff;
}
.grievance-details {
  background-color: #f8f9fa;
  border-left: 4px solid #ced4da;
  padding: 1rem;
  margin: 0.5rem 0;
}

/* Update Form in Modal */
.update-form {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}
.update-form label { font-weight: 500; }
.update-form select, .update-form textarea {
    width: 100%;
    padding: 0.75rem;
    border-radius: 6px;
    border: 1px solid #ced4da;
}
.update-form button {
  align-self: flex-end;
  padding: 0.75rem 1.5rem;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
.update-form button:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
}
.error-text { color: #dc3545; }

.loading-state, .error-state {
    text-align: center;
    padding: 3rem;
    font-size: 1.2rem;
    color: #6c757d;
}
</style>