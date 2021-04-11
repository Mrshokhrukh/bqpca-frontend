
<template>
  <div class="application-status-tracker">
    <h2>{{ title }}</h2>
    <div v-if="applications.length > 0">
      <table>
        <thead>
          <tr>
            <th>Application ID</th>
            <th>Institute Name</th>
            <th>Submission Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="application in applications" :key="application.applicationId">
            <td>{{ application.applicationId }}</td>
            <td>{{ application.instituteName }}</td>
            <td>{{ formatDate(application.submissionDate) }}</td>
            <td>{{ application.status }}</td>
            <td>
              <button @click="viewDetails(application)">View Details</button>
              <!-- Add more action buttons as needed (e.g., Edit, Cancel, etc.) -->
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else class="no-applications">
      <p>No applications to display.</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  applications: {
    type: Array,
    required: true,
    // Example structure of an application object (adjust based on your actual data)
    // default: () => [
    //   { applicationId: 'APP-123', applicationType: 'Accreditation', instituteName: 'Example Institute A', submissionDate: '2024-01-15', status: 'Submitted' },
    //   { applicationId: 'APP-456', applicationType: 'Appeal', instituteName: 'Example Institute B', submissionDate: '2024-02-01', status: 'Under Review' },
    // ],
  },
  applicationType: {
    type: String,
    default: 'Application', // Default to "Application" if not specified, can be "Appeal"
  },
});

const title = computed(() => {
  return `${props.applicationType} Status Tracker`;
});

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString(); // You can customize the date format
};

const emit = defineEmits(['view-application-details']); // Example of emitting an event for viewing details

const viewDetails = (application) => {
  emit('view-application-details', application);
  // In a real application, you would likely navigate to a detailed view of the application
  console.log('View Details clicked for:', application);
};
</script>

<style scoped>
.application-status-tracker {
  font-family: sans-serif;
  padding: 20px;
}

h2 {
  margin-bottom: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

th,
td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f0f0f0;
  font-weight: bold;
}

tbody tr:nth-child(even) {
  background-color: #f9f9f9;
}

button {
  padding: 8px 12px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

.no-applications {
  padding: 15px;
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
  margin-top: 10px;
}
</style>
