<!-- components/dashboard/roqcomponents/admin/AdminDashboard.vue -->
<template>
  <div class="p-4 max-w-7xl mx-auto">
    <h1 class="text-5xl font-serif font-bold text-slate-900 mb-8">Admin Dashboard</h1>

    <!-- Grid of Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      <!-- Decisions Card -->
      <router-link
        to="/admin/admin/roq/decisions"
        class="bg-white rounded-lg p-8 shadow-xl hover:shadow-2xl transition-shadow duration-300"
      >
        <div class="text-center">
          <h3 class="text-2xl font-serif font-bold text-slate-900 mb-4">Decisions</h3>
          <p class="text-6xl font-bold text-blue-600">42</p>
          <p class="text-slate-600 mt-2">Pending Decisions</p>
        </div>
      </router-link>

      <!-- Learning Types Card -->
      <router-link
        to="/admin/admin/roq/learning_types"
        class="bg-white rounded-lg p-8 shadow-xl hover:shadow-2xl transition-shadow duration-300"
      >
        <div class="text-center">
          <h3 class="text-2xl font-serif font-bold text-slate-900 mb-4">Learning Types</h3>
          <p class="text-6xl font-bold text-blue-600">15</p>
          <p class="text-slate-600 mt-2">Active Learning Types</p>
        </div>
      </router-link>

      <!-- Qualifications Card -->
      <router-link
        to="/admin/admin/roq/qualifications"
        class="bg-white rounded-lg p-8 shadow-xl hover:shadow-2xl transition-shadow duration-300"
      >
        <div class="text-center">
          <h3 class="text-2xl font-serif font-bold text-slate-900 mb-4">Qualifications</h3>
          <p class="text-6xl font-bold text-blue-600">78</p>
          <p class="text-slate-600 mt-2">Total Qualifications</p>
        </div>
      </router-link>

      <!-- Approved Applications Card -->
      <router-link
        to="/admin/admin/roq/reason_for_issue_of_second_copy"
        class="bg-white rounded-lg p-8 shadow-xl hover:shadow-2xl transition-shadow duration-300"
      >
        <div class="text-center">
          <h3 class="text-2xl font-serif font-bold text-slate-900 mb-4">Approved Applications</h3>
          <p class="text-6xl font-bold text-blue-600">120</p>
          <p class="text-slate-600 mt-2">Approved Applications</p>
        </div>
      </router-link>

      <!-- Type of Courses Card -->
      <router-link
        to="/admin/admin/roq/type_of_courses"
        class="bg-white rounded-lg p-8 shadow-xl hover:shadow-2xl transition-shadow duration-300"
      >
        <div class="text-center">
          <h3 class="text-2xl font-serif font-bold text-slate-900 mb-4">Type of Courses</h3>
          <p class="text-6xl font-bold text-blue-600">9</p>
          <p class="text-slate-600 mt-2">Course Types</p>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script setup>
// You can add any admin-specific logic here
</script>
