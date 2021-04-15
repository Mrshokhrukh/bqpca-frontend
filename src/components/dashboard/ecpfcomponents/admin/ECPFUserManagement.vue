<template>
  <div class="ecpf-user-management">
    <h2 class="mb-4">ECPF User Management</h2>

    <!-- Search and Filter Section -->
    <div class="search-section mb-4">
      <div class="input-group">
        <input
          type="text"
          class="form-control"
          v-model="searchQuery"
          placeholder="Search users..."
        />
        <button class="btn btn-primary" @click="searchUsers">Search</button>
      </div>
    </div>

    <!-- Users Table -->
    <div class="users-table">
      <table class="table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.username }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.role }}</td>
            <td>{{ user.status }}</td>
            <td>
              <button class="btn btn-sm btn-info me-2">Edit</button>
              <button class="btn btn-sm btn-danger">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const users = ref([])
const searchQuery = ref('')

const searchUsers = () => {}
</script>
