<template>
  <div class="assignments-container">
    <header class="page-header">
      <h1>Faculty Assignment Overview</h1>
      <p>A summary of modules, assigned faculty, and student counts for each program.</p>
    </header>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <p>Loading assignment overview...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-state">
      <h2>An Error Occurred</h2>
      <p>{{ error }}</p>
      <button @click="fetchAssignments">Try Again</button>
    </div>

    <!-- Data Table -->
    <div v-else-if="assignments.length > 0" class="table-wrapper">
      <table class="assignments-table">
        <thead>
          <tr>
            <th>Program Name</th>
            <th>Semester</th>
            <th>Module</th>
            <th>Assigned Faculty</th>
            <th>Student Count</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="assignment in assignments" :key="assignment.id">
            <!-- Program Name -->
            <td>{{ assignment.module?.module_master?.program_master?.program_name || 'N/A' }}</td>

            <!-- Semester -->
            <td>{{ assignment.module?.semester?.name || 'N/A' }}</td>

            <!-- Module Name -->
            <td>{{ assignment.module?.module_master?.module_name || 'N/A' }}</td>

            <!-- Faculty Name -->
            <td>{{ assignment.faculty?.faculty_name || 'N/A' }}</td>

            <!-- Number of Students -->
            <td class="student-count">{{ assignment.module?.student_count ?? 'N/A' }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state">
      <h2>No Assignments Found</h2>
      <p>There are currently no faculty assignments recorded in the system.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
// Ensure this path is correct for your project
import apiServices from '@/services/services';

// --- STATE ---
const assignments = ref([]);
const loading = ref(true);
const error = ref(null);

// --- API METHOD ---

/**
 * Fetches the complete list of faculty assignments.
 */
const fetchAssignments = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await apiServices.getMhpcFacultyAssignments();
    // The data is nested in the `results` property
    assignments.value = response.data.results;
  } catch (err) {
    console.error('Failed to fetch assignments:', err);
    error.value = 'Could not retrieve assignment data. Please try again later.';
  } finally {
    loading.value = false;
  }
};

// --- LIFECYCLE HOOK ---

// Fetch the data when the component is first created and mounted
onMounted(() => {
  fetchAssignments();
});
</script>

<style scoped>
.assignments-container {
  padding: 2rem;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: #f9fafb;
}

.page-header {
  margin-bottom: 2rem;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 1rem;
}

.page-header h1 {
  font-size: 1.8rem;
  font-weight: 600;
  color: #111827;
}

.page-header p {
  color: #6b7280;
  margin-top: 0.5rem;
}

.table-wrapper {
  overflow-x: auto;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  border-radius: 8px;
  background-color: #ffffff;
}

.assignments-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.assignments-table th,
.assignments-table td {
  padding: 12px 16px;
  border-bottom: 1px solid #e5e7eb;
  vertical-align: middle;
  white-space: nowrap;
}

.assignments-table th {
  background-color: #f3f4f6;
  font-weight: 600;
  font-size: 0.8rem;
  text-transform: uppercase;
  color: #374151;
}

.assignments-table tbody tr:hover {
  background-color: #f9fafb;
}

.assignments-table tbody tr:last-child td {
  border-bottom: none;
}

.student-count {
  text-align: center;
  font-weight: 500;
}

/* State Messages */
.loading-state, .error-state, .empty-state {
  text-align: center;
  padding: 4rem;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  color: #4b5563;
}

.error-state button {
  margin-top: 1rem;
  padding: 8px 16px;
  border: none;
  background-color: #3b82f6;
  color: white;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.error-state button:hover {
  background-color: #2563eb;
}
</style>