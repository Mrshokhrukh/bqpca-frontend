<template>
  <div class="max-w-4xl mx-auto py-8 px-4">
    <div class="bg-white shadow-lg rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl">
      <!-- Header Section with Avatar -->
      <div class="bg-gradient-to-r from-blue-600 to-blue-400 p-8 text-white">
        <div class="flex items-center space-x-4">
          <div class="w-20 h-20 bg-white rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold shadow-lg">
            {{ profileData.name ? profileData.name.charAt(0).toUpperCase() : 'U' }}
          </div>
          <div>
            <h2 class="text-2xl font-bold">Profile Information</h2>
            <p class="text-blue-100">Manage your personal details</p>
          </div>
        </div>
      </div>

      <!-- Form Section -->
      <div class="p-8">
        <form @submit.prevent="updateProfile" class="space-y-8">
          <!-- Personal Information Section -->
          <div class="bg-gray-50 p-6 rounded-lg">
            <h3 class="text-lg font-semibold text-gray-700 mb-4">Personal Details</h3>
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">Full Name</label>
                <input 
                  type="text" 
                  v-model="profileData.name"
                  class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required 
                />
              </div>

              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">Email Address</label>
                <input 
                  type="email" 
                  v-model="profileData.email"
                  class="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 cursor-not-allowed"
                  disabled 
                />
              </div>

              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">CID Number</label>
                <input 
                  type="text" 
                  v-model="profileData.cid_no"
                  class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required 
                />
              </div>

              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">Contact Number</label>
                <input 
                  type="tel" 
                  v-model="profileData.contact_number"
                  class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required 
                />
              </div>
            </div>
          </div>

          <!-- Location Information Section -->
          <div class="bg-gray-50 p-6 rounded-lg">
            <h3 class="text-lg font-semibold text-gray-700 mb-4">Location Details</h3>
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">Dzongkhag</label>
                <input 
                  type="text" 
                  v-model="profileData.dzongkhag"
                  class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required 
                />
              </div>

              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">Gewog</label>
                <input 
                  type="text" 
                  v-model="profileData.gewog"
                  class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required 
                />
              </div>

              <div class="space-y-2">
                <label class="block text-sm font-medium text-gray-700">Village</label>
                <input 
                  type="text" 
                  v-model="profileData.village"
                  class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required 
                />
              </div>
            </div>
          </div>

          <!-- Success/Error Messages -->
          <TransitionRoot appear :show="!!message" as="template">
            <div 
              :class="[
                'p-4 rounded-lg transition-all duration-300 transform',
                messageClass,
                message ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
              ]"
            >
              {{ message }}
            </div>
          </TransitionRoot>

          <!-- Submit Button -->
          <div class="flex justify-end pt-4">
            <button 
              type="submit" 
              :disabled="loading"
              class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <span v-if="loading" class="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
              <span>{{ loading ? 'Updating...' : 'Update Profile' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import apiService from '@/services/services';
import { storeToRefs } from 'pinia';
import { TransitionRoot } from '@headlessui/vue';

const { user, userId } = storeToRefs(useAuthStore());
const loading = ref(false);
const message = ref('');
const messageClass = ref('');

const profileData = ref({
  name: '',
  email: '',
  cid_no: '',
  contact_number: '',
  dzongkhag: '',
  gewog: '',
  village: ''
});

const loadProfile = async () => {
  try {
    if (!userId.value) {
      showMessage('User ID is not available. Please log in again.', 'error');
      return;
    }

    const response = await apiService.getUserProfile(userId.value);
    profileData.value = {
      ...response.data,
      email: user.value?.email
    };
  } catch (error) {
    console.error('Error loading profile:', error);
    showMessage('Failed to load profile information', 'error');
  }
};

const updateProfile = async () => {
  loading.value = true;
  try {
    if (!userId.value) {
      showMessage('User ID is not available. Please log in again.', 'error');
      return;
    }
    
    await apiService.updateUserProfile({ ...profileData.value, id: userId.value });
    showMessage('Profile updated successfully', 'success');
  } catch (error) {
    console.error('Error updating profile:', error);
    showMessage('Failed to update profile', 'error');
  } finally {
    loading.value = false;
  }
};

const showMessage = (text, type = 'success') => {
  message.value = text;
  messageClass.value = type === 'success'
    ? 'bg-green-50 text-green-800 border border-green-200'
    : 'bg-red-50 text-red-800 border border-red-200';

  setTimeout(() => {
    message.value = '';
    messageClass.value = '';
  }, 5000);
};

onMounted(() => {
  loadProfile();
});
</script>