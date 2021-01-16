// src/stores/userProfileStore.js
import { defineStore } from 'pinia';
import { ref } from 'vue';
import apiService from '@/services/services';

export const useUserProfileStore = defineStore('userProfile', () => {
  const userProfile = ref(null);
  const isLoading = ref(false);
  const error = ref(null);

  // Fetch user details
  const fetchUserProfile = async (userId) => {
    isLoading.value = true;
    error.value = null;

    try {
      const response = await apiService.getUserDetails(userId);
      userProfile.value = response.data;
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch user details.';
    } finally {
      isLoading.value = false;
    }
  };

  return {
    userProfile,
    isLoading,
    error,
    fetchUserProfile,
  };
});
