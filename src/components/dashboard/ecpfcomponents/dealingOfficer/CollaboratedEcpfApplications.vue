<template>
  <div class="collaborated-applications">
    <h2 class="text-h5 mb-4">Collaborated ECPF Applications</h2>
    
    <!-- Search and Filter Section -->
    <v-card class="mb-4 pa-4">
      <v-row>
        <v-col cols="12" sm="4">
          <v-text-field
            v-model="search"
            label="Search Applications"
            prepend-icon="mdi-magnify"
            clearable
          ></v-text-field>
        </v-col>
        <v-col cols="12" sm="4">
          <v-select
            v-model="statusFilter"
            :items="statusOptions"
            label="Status Filter"
            clearable
          ></v-select>
        </v-col>
      </v-row>
    </v-card>

    <!-- Applications Table -->
    <v-data-table
      :headers="headers"
      :items="filteredApplications"
      :loading="loading"
      :search="search"
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
  name: 'CollaboratedEcpfApplications',
  
  data() {
    return {
      search: '',
      loading: false,
      statusFilter: null,
      statusOptions: ['Pending', 'In Progress', 'Completed', 'Rejected'],
      headers: [
        { text: 'Application ID', value: 'id' },
        { text: 'Applicant Name', value: 'applicantName' },
        { text: 'Submission Date', value: 'submissionDate' },
        { text: 'Status', value: 'status' },
        { text: 'Actions', value: 'actions', sortable: false }
      ],
      applications: [] // Will be populated from API
    }
  },

  computed: {
    filteredApplications() {
      if (!this.statusFilter) return this.applications
      return this.applications.filter(app => app.status === this.statusFilter)
    }
  },

  methods: {
    async fetchApplications() {
      this.loading = true
      try {
        // API call would go here
        // this.applications = await api.getCollaboratedApplications()
        this.applications = [] // Replace with actual API call
      } catch (error) {
        console.error('Error fetching applications:', error)
      } finally {
        this.loading = false
      }
    },

    getStatusColor(status) {
      const colors = {
        'Pending': 'warning',
        'In Progress': 'info',
        'Completed': 'success',
        'Rejected': 'error'
      }
      return colors[status] || 'grey'
    },

    viewApplication(item) {
      // Navigate to application details page
      this.$router.push(`/applications/${item.id}`)
    }
  },

  created() {
    this.fetchApplications()
  }
}
</script>

<style scoped>
.collaborated-applications {
  padding: 20px;
}
</style>