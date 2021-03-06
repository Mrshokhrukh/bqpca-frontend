<template>
  <div class="ecpf-reports">
    <h2>ECPF Reports</h2>
    <div class="reports-container">
      <div class="filters">
        <v-select
          v-model="selectedYear"
          :items="years"
          label="Select Year"
          outlined
          dense
        ></v-select>
        <v-select
          v-model="selectedQuarter"
          :items="quarters"
          label="Select Quarter"
          outlined
          dense
        ></v-select>
      </div>
      <v-data-table
        :headers="headers"
        :items="reports"
        :loading="loading"
        class="reports-table"
      >
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn small text color="primary" @click="viewReport(item)">
            View
          </v-btn>
        </template>
      </v-data-table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ECPFReports',
  data() {
    return {
      loading: false,
      selectedYear: new Date().getFullYear(),
      selectedQuarter: 1,
      years: [2023, 2022, 2021, 2020],
      quarters: [1, 2, 3, 4],
      headers: [
        { text: 'Report ID', value: 'id' },
        { text: 'Title', value: 'title' },
        { text: 'Date', value: 'date' },
        { text: 'Status', value: 'status' },
        { text: 'Actions', value: 'actions', sortable: false }
      ],
      reports: []
    }
  },
  methods: {
    async fetchReports() {
      this.loading = true
      try {
        // API call simulation
        // Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        this.reports = [
          {
            id: 1,
            title: 'Q1 ECPF Report',
            date: '2023-03-31',
            status: 'Completed'
          },
          // Add more sample data as needed
        ]
      } catch (error) {
        console.error('Error fetching reports:', error)
      } finally {
        this.loading = false
      }
    },
    viewReport(report) {
      // Implement view report logic
      console.log('Viewing report:', report)
    }
  },
  created() {
    this.fetchReports()
  }
}
</script>

<style scoped>
.ecpf-reports {
  padding: 20px;
}

.reports-container {
  margin-top: 20px;
}

.filters {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
}

.reports-table {
  background-color: white;
}
</style>