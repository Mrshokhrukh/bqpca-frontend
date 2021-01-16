import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import apiService from '@/services/services';

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter();
  const toast = useToast();

  // State
  const accessToken = ref(localStorage.getItem('accessToken') || null);
  const refreshToken = ref(localStorage.getItem('refreshToken') || null);
  const user = ref(JSON.parse(localStorage.getItem('user')) || null);

  // Getters
  const isAuthenticated = computed(() => !!accessToken.value);
  const serviceType = computed(() => user.value?.service_type || null);
  const role = computed(() => user.value?.role || null);
  const email = computed(() => user.value?.email || null);
  const username = computed(() => user.value?.username || null);
  const fullName = computed(() => user.value?.full_name || null);
  const userId = computed(() => user.value?.id || null); // Add a getter for user ID

  // Fetch and set tokens from localStorage
  const initializeAuth = () => {
    accessToken.value = localStorage.getItem('accessToken') || null;
    refreshToken.value = localStorage.getItem('refreshToken') || null;
  };

  // Actions
  const login = async (credentials) => {
    try {
      const response = await apiService.login({
        email: credentials.email,
        password: credentials.password,
        service_type: credentials.service_type,
      });

      // Update state
      accessToken.value = response.data.access;
      refreshToken.value = response.data.refresh;
      user.value = {
<<<<<<< Updated upstream
        id: response.data.user_id, // Ensure this is included
=======
        id: response.data.user_id, // Store the user ID
>>>>>>> Stashed changes
        email: response.data.email,
        username: response.data.username,
        full_name: response.data.full_name,
        service_type: response.data.service_type,
        role: response.data.role,
      };

      // Save to localStorage
      localStorage.setItem('accessToken', response.data.access);
      localStorage.setItem('refreshToken', response.data.refresh);
      localStorage.setItem('user', JSON.stringify(user.value));

      toast.success('Login successful!');
      router.push(`/admin/${user.value.role}/${user.value.service_type}/dashboard`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed. Please try again.');
      throw error;
    }
  };

  const logout = () => {
    // Clear state
    accessToken.value = null;
    refreshToken.value = null;
    user.value = null;

    // Clear localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');

    toast.success('Logged out successfully!');
    router.push('/');
  };

  const refreshAccessToken = async () => {
    try {
<<<<<<< Updated upstream
=======
      console.log("Refreshing access token. Refresh token:", refreshToken.value);
>>>>>>> Stashed changes
      const response = await apiService.post('/users/token/refresh/', {
        refresh: refreshToken.value, // Make sure this is in the request body
      });

<<<<<<< Updated upstream
=======
      console.log("Refresh token response:", response.data);

>>>>>>> Stashed changes
      accessToken.value = response.data.access;
      localStorage.setItem('accessToken', response.data.access);

      return response.data.access;
    } catch (error) {
      console.error('Error refreshing token:', error);
      logout();
      throw error;
    }
  };

  return {
    accessToken,
    refreshToken,
    user,
    userId, // Add this
    isAuthenticated,
    serviceType,
    role,
    email,
    username,
    fullName,
    userId, // Expose the user ID getter
    login,
    logout,
    initializeAuth,
    refreshAccessToken,
  };
});
