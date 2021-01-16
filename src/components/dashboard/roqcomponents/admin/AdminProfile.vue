<template>
  <div>
    <!-- Show loading state -->
    <div v-if="isLoading">Loading user profile...</div>

    <!-- Show error message -->
    <div v-if="error" class="error-message">{{ error }}</div>

    <!-- Display user profile -->
    <UserProfile v-if="userProfile" :user="userProfile" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { useUserProfileStore } from '@/stores/userProfileStore';
import UserProfile from '@/components/common/UserProfile.vue';

// Initialize stores
const authStore = useAuthStore();
const userProfileStore = useUserProfileStore();

// Reactive state
const isLoading = ref(false);
const error = ref(null);
const userProfile = computed(() => userProfileStore.userProfile);

// Fetch user profile on component mount
onMounted(async () => {
  const userId = authStore.userId;

  if (userId) {
    isLoading.value = true;
    await userProfileStore.fetchUserProfile(userId);
    isLoading.value = userProfileStore.isLoading;
    error.value = userProfileStore.error;

    // Log the userProfile to verify the data
    console.log('User Profile Data:', userProfileStore.userProfile);
  } else {
    error.value = 'User ID not found. Please log in again.';
  }
});
</script>

<style scoped>
.error-message {
  color: red;
  font-weight: bold;
}
</style>
