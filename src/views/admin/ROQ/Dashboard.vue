<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div>
    <p>Welcome, {{ authStore.fullName }}!</p>
    <p>Email: {{ authStore.email }}</p>
    <p>Username: {{ authStore.username }}</p>
    <p>Role: {{ authStore.role }}</p>
    <p>Service Type: {{ authStore.serviceType }}</p>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/authStore';

const authStore = useAuthStore();
</script>
