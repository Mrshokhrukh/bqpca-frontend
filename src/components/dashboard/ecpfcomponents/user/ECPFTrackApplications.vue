<template>
  <div class="ecpf-track-applications">
    <h2 class="text-2xl font-bold mb-4">Track Your Applications</h2>
    
    <div class="applications-list">
      <!-- Search and filter section -->
      <div class="mb-4">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Search applications..." 
          class="p-2 border rounded"
        >
      </div>

      <!-- Applications table -->
      <table class="w-full border-collapse">
        <thead>
          <tr class="bg-gray-100">
            <th class="p-2 text-left">Application ID</th>
            <th class="p-2 text-left">Status</th>
            <th class="p-2 text-left">Submission Date</th>
            <th class="p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="application in applications" :key="application.id" class="border-b">
            <td class="p-2">{{ application.id }}</td>
            <td class="p-2">
              <span :class="getStatusClass(application.status)">
                {{ application.status }}
              </span>
            </td>
            <td class="p-2">{{ formatDate(application.submissionDate) }}</td>
            <td class="p-2">
              <button 
                @click="viewDetails(application.id)"
                class="bg-blue-500 text-white px-3 py-1 rounded"
              >
                View Details
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ECPFTrackApplications',
  data() {
    return {
      searchQuery: '',
      applications: [
        {
          id: 'ECPF-2023-001',
          status: 'Pending',
          submissionDate: '2023-11-01'
        },
        {
          id: 'ECPF-2023-002',
          status: 'Approved',
          submissionDate: '2023-11-02'
        },
        // Add more sample data as needed
      ]
    }
  },
  methods: {
    getStatusClass(status) {
      return {
        'text-yellow-600': status === 'Pending',
        'text-green-600': status === 'Approved',
        'text-red-600': status === 'Rejected'
      }
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString()
    },
    viewDetails(id) {
      // Implement view details logic
      console.log('Viewing details for application:', id)
    }
  }
}
</script>

<style scoped>
.ecpf-track-applications {
  padding: 20px;
}

.applications-list {
  background: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>