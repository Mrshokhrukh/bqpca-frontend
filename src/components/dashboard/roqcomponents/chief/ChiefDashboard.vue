<template>
  <div class="min-h-screen bg-slate-50 p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Dashboard Header -->
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-slate-900">Chief Dashboard</h1>
        <p class="text-sm text-slate-600">Overview of all applications and their statuses.</p>
      </div>

      <!-- Application Status Component -->
      <ChiefApplicationStatus />
    </div>
  </div>
</template>

<script>
import ChiefApplicationStatus from "./ChiefApplicationStatus.vue"; // Ensure the path is correct

export default {
  components: {
    ChiefApplicationStatus,
  },
};
</script>

<style scoped>
/* Custom Styles for ChiefDashboard */
.min-h-screen {
  min-height: 100vh; /* Ensure the dashboard takes up the full height of the screen */
}

.bg-slate-50 {
  background-color: #f8fafc; /* Light background color */
}

.p-6 {
  padding: 1.5rem; /* Add padding around the content */
}

.max-w-7xl {
  max-width: 80rem; /* Limit the width of the content for better readability */
}

.mx-auto {
  margin-left: auto;
  margin-right: auto; /* Center the content horizontally */
}

.mb-8 {
  margin-bottom: 2rem; /* Add spacing below the header */
}

.text-2xl {
  font-size: 1.5rem; /* Large font size for the header */
  line-height: 2rem;
}

.font-bold {
  font-weight: 700; /* Bold font for the header */
}

.text-slate-900 {
  color: #0f172a; /* Dark text color for the header */
}

.text-sm {
  font-size: 0.875rem; /* Small font size for the subtitle */
  line-height: 1.25rem;
}

.text-slate-600 {
  color: #475569; /* Medium-dark text color for the subtitle */
}
</style>