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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const applications = ref([]) // Start with an empty array
const router = useRouter()

const reviewApplication = (id) => {
  router.push(`/engineering_certification/application/${id}`)
}

onMounted(async () => {
  try {
    // Replace with your actual API endpoint
    const response = await fetch('/api/applications')
    applications.value = await response.json()
  } catch (error) {
    console.error('Error fetching applications:', error)
    // Handle errors appropriately (e.g., show an error message)
  }
})
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
