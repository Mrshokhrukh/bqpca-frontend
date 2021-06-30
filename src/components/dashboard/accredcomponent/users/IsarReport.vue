<template>
  <div class="isar-report">
    <h1>ISAR Report</h1>
    <div v-if="loading">Loading report...</div>
    <div v-else>
      <table v-if="reportData.length" class="report-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in reportData" :key="item.id">
            <td>{{ item.user }}</td>
            <td>{{ item.status }}</td>
            <td>{{ item.date }}</td>
          </tr>
        </tbody>
      </table>
      <div v-else>No report data available.</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "IsarReport",
  data() {
    return {
      loading: true,
      reportData: [],
    };
  },
  mounted() {
    // Simulate API call
    setTimeout(() => {
      this.reportData = [
        { id: 1, user: "Alice", status: "Active", date: "2024-06-01" },
        { id: 2, user: "Bob", status: "Inactive", date: "2024-05-28" },
      ];
      this.loading = false;
    }, 1000);
  },
};
</script>

<style scoped>
.isar-report {
  padding: 24px;
}
.report-table {
  width: 100%;
  border-collapse: collapse;
}
.report-table th,
.report-table td {
  border: 1px solid #ccc;
  padding: 8px;
  text-align: left;
}
</style>