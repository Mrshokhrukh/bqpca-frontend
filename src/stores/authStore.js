// authStore.js
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'vue-toastification';
import apiService from '@/services/services';

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter();
  const toast = useToast();

  // State (remains largely the same)
  const accessToken = ref(localStorage.getItem('accessToken') || null);
  const refreshToken = ref(localStorage.getItem('refreshToken') || null);
  const user = ref(JSON.parse(localStorage.getItem('user')) || null);

  // Getters (remains largely the same)
  const isAuthenticated = computed(() => !!accessToken.value);
  const userId = computed(() => user.value?.id || null);
  const serviceType = computed(() => user.value?.service_type || null);
  const role = computed(() => user.value?.role || null);
  const email = computed(() => user.value?.email || null);
  const username = computed(() => user.value?.username || null);
  const fullName = computed(() => user.value?.first_name + ' ' + (user.value.middle_name ? user.value.middle_name + ' ' : '') + user.value.last_name || null);
  const dzongkhag = computed(() => user.value?.dzongkhag || null);
  const gewog = computed(() => user.value?.gewog || null);
  const village = computed(() => user.value?.village || null);
  const dateOfBirth = computed(() => user.value?.date_of_birth || null);
  const contactNumber = computed(() => user.value?.contact_number || null);
  const gender = computed(() => user.value?.gender || null);
  const isCounselor = computed(() => user.value?.is_counselor || false);
  const isStaff = computed(() => user.value?.is_staff || false);
  const isSuperuser = computed(() => user.value?.is_superuser || false);
  const isActive = computed(() => user.value?.is_active || false);


  // Fetch and set tokens from localStorage
  const initializeAuth = () => {
    accessToken.value = localStorage.getItem('accessToken') || null;
    refreshToken.value = localStorage.getItem('refreshToken') || null;
    user.value = JSON.parse(localStorage.getItem('user')) || null;
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
      user.value = response.data.user;

      // Save to localStorage
      localStorage.setItem('accessToken', response.data.access);
      localStorage.setItem('refreshToken', response.data.refresh);
      localStorage.setItem('user', JSON.stringify(user.value));

      // *** ROLE-BASED REDIRECTION LOGIC ***
      if (credentials.from === 'authSection') {
        if (user.value.role !== 'user') {
          toast.error("Admin/Internal role access is not permitted from the previous page. Please login from here");
          // Clear state
          accessToken.value = null;
          refreshToken.value = null;
          user.value = null;

          // Clear localStorage
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          router.push('/admin/login');
          return;
        }
      } else if (credentials.from === 'adminLogin') {
        if (user.value.role === 'user') {
          toast.error("User role access is not permitted from this page.");
          // Clear state
          accessToken.value = null;
          refreshToken.value = null;
          user.value = null;

          // Clear localStorage
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
          router.push('/');
          return;
        }
      }

      // Default redirection (if no role-based restrictions)
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

    router.push({ name: 'home' })

  };

  const refreshAccessToken = async () => {
    try {
      const response = await apiService.post('/users/token/refresh/', {
        refresh: refreshToken.value, // Make sure this is in the request body
      });

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
    userId,
    isAuthenticated,
    serviceType,
    role,
    email,
    username,
    fullName,
    dzongkhag,
    gewog,
    village,
    dateOfBirth,
    contactNumber,
    gender,
    isCounselor,
    isStaff,
    isSuperuser,
    isActive,
    login,
    logout,
    initializeAuth,
    refreshAccessToken,
  };
});
