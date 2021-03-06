<template>
  <div class="ecpf-change-requests">
    <h2>ECPF Change Requests</h2>
    <div class="requests-container">
      <table v-if="requests.length">
        <thead>
          <tr>
            <th>Request ID</th>
            <th>Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="request in requests" :key="request.id">
            <td>{{ request.id }}</td>
            <td>{{ formatDate(request.date) }}</td>
            <td>{{ request.status }}</td>
            <td>
              <button @click="viewRequest(request.id)">View</button>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-else>No change requests found.</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ECPFChangeRequests',
  data() {
    return {
      requests: []
    }
  },
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleDateString()
    },
    viewRequest(id) {
      // Handle viewing request details
      console.log(`Viewing request ${id}`)
    },
    async fetchRequests() {
      try {
        // Add API call here to fetch requests
        this.requests = [] // Replace with actual API call
      } catch (error) {
        console.error('Error fetching requests:', error)
      }
    }
  },
  mounted() {
    this.fetchRequests()
  }
}
</script>

<style scoped>
.ecpf-change-requests {
  padding: 20px;
}

.requests-container {
  margin-top: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
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