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
  const serviceType = ref(localStorage.getItem('serviceType') || null);
  const role = ref(localStorage.getItem('role') || null);

  // Getters
  const isAuthenticated = computed(() => !!accessToken.value);

  // Actions
  const login = async (credentials) => {
    try {
      const response = await apiService.login({
        email: credentials.email,
        password: credentials.password,
        service_type: credentials.service_type,
      });

      // Access properties directly from response.data
      console.log('Full API Response:', response);
      console.log('Response Data:', response.data);
      console.log('Service Type from API:', response.data.service_type); // Correct access

      // Update state
      accessToken.value = response.data.access;
      refreshToken.value = response.data.refresh;
      serviceType.value = response.data.service_type;
      role.value = response.data.role;

      // Save to localStorage
      localStorage.setItem('accessToken', response.data.access);
      localStorage.setItem('refreshToken', response.data.refresh);
      localStorage.setItem('serviceType', response.data.service_type);
      localStorage.setItem('role', response.data.role);

      toast.success('Login successful!');
      console.log('Redirecting to:', `/dashboard/${response.data.service_type}/`);
      router.push(`/dashboard/${response.data.service_type}/`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed. Please try again.');
      throw error;
    }
  };

  const logout = () => {
    // Clear state
    accessToken.value = null;
    refreshToken.value = null;
    serviceType.value = null;
    role.value = null;

    // Clear localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('serviceType');
    localStorage.removeItem('role');

    toast.success('Logged out successfully!');
    router.push('/admin/login');
  };

  return {
    accessToken,
    refreshToken,
    serviceType,
    role,
    isAuthenticated,
    login,
    logout,
  };
});
