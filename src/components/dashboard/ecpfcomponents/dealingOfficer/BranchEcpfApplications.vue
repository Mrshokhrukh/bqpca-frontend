<template>
  <div class="branch-ecpf-applications">
    <h2 class="text-h5 mb-4">Branch ECPF Applications</h2>
    
    <!-- Search and Filter Section -->
    <v-card class="mb-4 pa-4">
      <v-row>
        <v-col cols="12" sm="6" md="4">
          <v-text-field
            v-model="search"
            label="Search Applications"
            prepend-inner-icon="mdi-magnify"
            clearable
            outlined
            dense
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="4">
          <v-select
            v-model="statusFilter"
            :items="statusOptions"
            label="Filter by Status"
            outlined
            dense
          ></v-select>
        </v-col>
      </v-row>
    </v-card>

    <!-- Applications Table -->
    <v-data-table
      :headers="headers"
      :items="applications"
      :search="search"
      :loading="loading"
      :items-per-page="10"
      class="elevation-1"
    >
      <template v-slot:[`item.status`]="{ item }">
        <v-chip :color="getStatusColor(item.status)" small>
          {{ item.status }}
        </v-chip>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-btn
          small
          color="primary"
          text
          @click="viewApplication(item)"
        >
          View
        </v-btn>
      </template>
    </v-data-table>
  </div>
</template>

<script>
export default {
  name: 'BranchEcpfApplications',
  
  data() {
    return {
      search: '',
      loading: false,
      statusFilter: 'all',
      statusOptions: [
        { text: 'All', value: 'all' },
        { text: 'Pending', value: 'pending' },
        { text: 'Approved', value: 'approved' },
        { text: 'Rejected', value: 'rejected' }
      ],
      headers: [
        { text: 'Application ID', value: 'id' },
        { text: 'Applicant Name', value: 'applicantName' },
        { text: 'Submission Date', value: 'submissionDate' },
        { text: 'Status', value: 'status' },
        { text: 'Actions', value: 'actions', sortable: false }
      ],
      applications: [] // This will store the applications data
    }
  },

  methods: {
    getStatusColor(status) {
      switch (status.toLowerCase()) {
        case 'approved':
          return 'success'
        case 'pending':
          return 'warning'
        case 'rejected':
          return 'error'
        default:
          return 'grey'
      }
    },

    viewApplication(application) {
      // Add logic to view application details
      console.log('Viewing application:', application)
    },

    async fetchApplications() {
      try {
        this.loading = true
        // Add API call to fetch applications
        // Example:
        // const response = await this.$axios.get('/api/branch-applications')
        // this.applications = response.data
      } catch (error) {
        console.error('Error fetching applications:', error)
      } finally {
        this.loading = false
      }
    }
  },

  created() {
    this.fetchApplications()
  }
}
</script>

<style scoped>
.branch-ecpf-applications {
  padding: 20px;
}
</style>