<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div>
    <h1>Applications</h1>
    <table>
      <thead>
        <tr>
          <th>Application ID</th>
          <th>Applicant Name</th>
          <th>Type</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="app in applications" :key="app.id">
          <td>{{ app.id }}</td>
          <td>{{ app.name }}</td>
          <td>{{ app.type }}</td>
          <td>{{ app.status }}</td>
          <td>
            <button @click="reviewApplication(app.id)">Review</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router' // Import useRouter

const applications = ref([
  { id: 1, name: 'John Doe', type: 'Registration', status: 'Pending' },
  { id: 2, name: 'Jane Smith', type: 'Renewal', status: 'Pending' },
]) // Fetch this from an API  (You'd typically use a fetch call in onMounted)

const router = useRouter() // Get the router instance

const reviewApplication = (id) => {
  router.push(`/health_certification/application/${id}`)
}
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  border: 1px solid #ddd;
  padding: 8px;
}
</style>
