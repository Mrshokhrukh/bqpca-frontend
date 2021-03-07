<template>
  <div class="location-change-applications">
    <h2 class="section-title">Location Change Applications</h2>
    <div class="applications-container">
      <!-- Add table or list of applications -->
      <table v-if="applications.length" class="applications-table">
        <thead>
          <tr>
            <th>Application ID</th>
            <th>Business Name</th>
            <th>Current Location</th>
            <th>Proposed Location</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="application in applications" :key="application.id">
            <td>{{ application.id }}</td>
            <td>{{ application.businessName }}</td>
            <td>{{ application.currentLocation }}</td>
            <td>{{ application.proposedLocation }}</td>
            <td>{{ application.status }}</td>
            <td>
              <button @click="viewDetails(application.id)">View Details</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else class="no-applications">
        No location change applications found
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LocationChangeApplications',
  data() {
    return {
      applications: []
    }
  },
  methods: {
    async fetchApplications() {
      try {
        // TODO: Replace with actual API call
        this.applications = await this.getApplications()
      } catch (error) {
        console.error('Error fetching applications:', error)
      }
    },
    viewDetails(applicationId) {
      // TODO: Implement view details functionality
      console.log('Viewing details for application:', applicationId)
    },
    async getApplications() {
      // TODO: Implement API call to get applications
      return []
    }
  },
  mounted() {
    this.fetchApplications()
  }
}
</script>

<style scoped>
.location-change-applications {
  padding: 20px;
}

.section-title {
  margin-bottom: 20px;
  color: #333;
}

.applications-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.applications-table th,
.applications-table td {
  padding: 12px;
  border: 1px solid #ddd;
  text-align: left;
}

.applications-table th {
  background-color: #f5f5f5;
  font-weight: bold;
}

.no-applications {
  text-align: center;
  padding: 20px;
  color: #666;
}

button {
  padding: 6px 12px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}
</style>