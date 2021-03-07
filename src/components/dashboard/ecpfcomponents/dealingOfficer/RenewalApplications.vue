<template>
  <div class="renewal-applications">
    <h2 class="text-2xl font-bold mb-4">Renewal Applications</h2>
    
    <!-- Search and Filter Section -->
    <div class="mb-4 flex gap-4">
      <input 
        type="text" 
        v-model="searchQuery" 
        placeholder="Search applications..."
        class="p-2 border rounded"
      />
      <select v-model="statusFilter" class="p-2 border rounded">
        <option value="">All Status</option>
        <option value="pending">Pending</option>
        <option value="approved">Approved</option>
        <option value="rejected">Rejected</option>
      </select>
    </div>

    <!-- Applications Table -->
    <table class="w-full border-collapse border">
      <thead>
        <tr class="bg-gray-100">
          <th class="border p-2">Application ID</th>
          <th class="border p-2">Company Name</th>
          <th class="border p-2">Submission Date</th>
          <th class="border p-2">Status</th>
          <th class="border p-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="application in filteredApplications" :key="application.id">
          <td class="border p-2">{{ application.id }}</td>
          <td class="border p-2">{{ application.companyName }}</td>
          <td class="border p-2">{{ formatDate(application.submissionDate) }}</td>
          <td class="border p-2">
            <span :class="getStatusClass(application.status)">
              {{ application.status }}
            </span>
          </td>
          <td class="border p-2">
            <button 
              @click="viewApplication(application.id)"
              class="bg-blue-500 text-white px-3 py-1 rounded mr-2"
            >
              View
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'RenewalApplications',
  data() {
    return {
      searchQuery: '',
      statusFilter: '',
      applications: [
        // Sample data - replace with actual API call
        {
          id: 'RA001',
          companyName: 'Sample Company 1',
          submissionDate: '2024-01-15',
          status: 'pending'
        },
        // Add more sample data
      ]
    }
  },
  computed: {
    filteredApplications() {
      return this.applications.filter(app => {
        const matchesSearch = app.companyName.toLowerCase().includes(this.searchQuery.toLowerCase())
        const matchesStatus = this.statusFilter ? app.status === this.statusFilter : true
        return matchesSearch && matchesStatus
      })
    }
  },
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleDateString()
    },
    getStatusClass(status) {
      const classes = {
        pending: 'text-yellow-600',
        approved: 'text-green-600',
        rejected: 'text-red-600'
      }
      return classes[status] || ''
    },
    viewApplication(id) {
      // Implement view logic here
      console.log('Viewing application:', id)
    }
  },
  mounted() {
    // Fetch actual data when component mounts
    // this.fetchApplications()
  }
}
</script>

<style scoped>
.renewal-applications {
  padding: 20px;
}
</style>