<template>
  <div class="name-change-applications">
    <h2 class="page-title">Name Change Applications</h2>
    
    <!-- Search and Filter Section -->
    <div class="filters">
      <v-text-field
        v-model="search"
        label="Search applications"
        prepend-icon="mdi-magnify"
        clearable
      ></v-text-field>
    </div>

    <!-- Applications Table -->
    <v-data-table
      :headers="headers"
      :items="applications"
      :search="search"
      :loading="loading"
      class="applications-table"
    >
      <template v-slot:[`item.status`]="{ item }">
        <v-chip :color="getStatusColor(item.status)" small>
          {{ item.status }}
        </v-chip>
      </template>

      <template v-slot:[`item.actions`]="{ item }">
        <v-btn
          small
          text
          color="primary"
          @click="viewApplication(item)"
        >
          View Details
        </v-btn>
      </template>
    </v-data-table>
  </div>
</template>

<script>
export default {
  name: 'NameChangeApplications',
  
  data() {
    return {
      search: '',
      loading: false,
      headers: [
        { text: 'Application ID', value: 'id' },
        { text: 'Applicant Name', value: 'applicantName' },
        { text: 'Submission Date', value: 'submissionDate' },
        { text: 'Status', value: 'status' },
        { text: 'Actions', value: 'actions', sortable: false }
      ],
      applications: [
        // Sample data - replace with actual API data
        {
          id: '001',
          applicantName: 'John Doe',
          submissionDate: '2023-05-20',
          status: 'Pending'
        },
        // Add more sample items as needed
      ]
    }
  },

  methods: {
    getStatusColor(status) {
      switch (status.toLowerCase()) {
        case 'pending':
          return 'warning'
        case 'approved':
          return 'success'
        case 'rejected':
          return 'error'
        default:
          return 'grey'
      }
    },

    viewApplication(application) {
      // Handle viewing application details
      console.log('Viewing application:', application)
    },

    async fetchApplications() {
      this.loading = true
      try {
        // Replace with actual API call
        // const response = await axios.get('/api/name-change-applications')
        // this.applications = response.data
      } catch (error) {
        console.error('Error fetching applications:', error)
      } finally {
        this.loading = false
      }
    }
  },

  mounted() {
    this.fetchApplications()
  }
}
</script>

<style scoped>
.name-change-applications {
  padding: 20px;
}

.page-title {
  margin-bottom: 20px;
}

.filters {
  margin-bottom: 20px;
}

.applications-table {
  background-color: white;
  border-radius: 4px;
}
</style>