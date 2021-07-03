<template>
  <div class="application-status-tracker">
    <h2>{{ title }}</h2>

    <!-- Filter Controls -->
    <div class="filters-container">
      <div class="filter-group">
        <label for="filter-app-id">Filter by Application ID:</label>
        <input id="filter-app-id" v-model="filterApplicationId" type="text" placeholder="Enter Application ID" />
      </div>
      <div class="filter-group">
        <label for="filter-license-num">Filter by License Number:</label>
        <input id="filter-license-num" v-model="filterLicenseNumber" type="text" placeholder="Enter License Number" />
      </div>
    </div>

    <div v-if="filteredApplications.length > 0">
      <table>
        <thead>
          <tr>
            <th>Application ID</th>
            <th>License Number</th>
            <th>Institute Name</th>
            <th>Submission Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="application in filteredApplications" :key="application.applicationId">
            <td>{{ application.applicationId }}</td>
            <td>{{ application.licenseNumber || 'N/A' }}</td>
            <td>{{ application.instituteName }}</td>
            <td>{{ formatDate(application.submissionDate) }}</td>
            <td>{{ application.status }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else class="no-applications">
      <p>No applications match the current filters.</p>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  applications: {
    type: Array,
    required: true,
    // Example structure of an application object (adjust based on your actual data)
    // default: () => [
    //   { applicationId: 'APP-123', licenseNumber: 'LIC-A1', applicationType: 'Accreditation', instituteName: 'Example Institute A', submissionDate: '2024-01-15', status: 'Submitted' },
    //   { applicationId: 'APP-456', licenseNumber: 'LIC-B2', applicationType: 'Appeal', instituteName: 'Example Institute B', submissionDate: '2024-02-01', status: 'Under Review' },
    // ],
  },
  applicationType: {
    type: String,
    default: 'Application', // Default to "Application" if not specified, can be "Appeal"
  },
})

// Refs for filter input values
const filterApplicationId = ref('')
const filterLicenseNumber = ref('')

const title = computed(() => {
  return `${props.applicationType} Status Tracker`
})

// Computed property to filter applications based on input values
const filteredApplications = computed(() => {
  let apps = props.applications

  // Filter by Application ID
  if (filterApplicationId.value) {
    apps = apps.filter(app =>
      app.applicationId.toLowerCase().includes(filterApplicationId.value.toLowerCase())
    )
  }

  // Filter by License Number
  if (filterLicenseNumber.value) {
    apps = apps.filter(app =>
      app.licenseNumber && app.licenseNumber.toLowerCase().includes(filterLicenseNumber.value.toLowerCase())
    )
  }

  return apps
})

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString() // You can customize the date format
}
</script>

<style scoped>
.application-status-tracker {
  font-family: sans-serif;
  padding: 20px;
}

h2 {
  margin-bottom: 20px;
}

.filters-container {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.filter-group label {
  font-size: 0.9em;
  color: #555;
}

.filter-group input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
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

.no-applications {
  padding: 15px;
  background-color: #e9ecef;
  color: #495057;
  border: 1px solid #ced4da;
  border-radius: 4px;
  margin-top: 10px;
  text-align: center;
}
</style>