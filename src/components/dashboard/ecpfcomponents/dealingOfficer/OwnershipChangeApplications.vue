<template>
  <div class="ownership-change-applications">
    <h2 class="text-h5 mb-4">Ownership Change Applications</h2>

    <!-- Search and Filter Section -->
    <v-card class="mb-4">
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="4">
            <v-text-field
              v-model="search"
              label="Search Applications"
              prepend-inner-icon="mdi-magnify"
              clearable
              outlined
              dense
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="4">
            <v-select
              v-model="statusFilter"
              :items="statusOptions"
              label="Status Filter"
              outlined
              dense
            ></v-select>
          </v-col>
        </v-row>
      </v-card-text>
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
          View Details
        </v-btn>
      </template>
    </v-data-table>
  </div>
</template>

<script>
export default {
  name: 'OwnershipChangeApplications',
  
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
      applications: [
        {
          id: 'APP001',
          applicantName: 'John Doe',
          submissionDate: '2023-05-01',
          status: 'pending'
        },
        // Add more sample data as needed
      ]
    }
  },

  methods: {
    getStatusColor(status) {
      switch (status) {
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
      // Implement view details logic
      console.log('Viewing application:', application.id)
    },

    async fetchApplications() {
      try {
        this.loading = true
        // Implement API call to fetch applications
        // This is where you would make an axios call to your backend
        await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API delay
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
.ownership-change-applications {
  padding: 20px;
}
</style>