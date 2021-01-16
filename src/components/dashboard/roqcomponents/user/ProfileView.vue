<template>
  <div class="max-w-3xl mx-auto">
    <div class="bg-white shadow rounded-lg">
      <div class="p-6 border-b border-gray-200">
        <h2 class="text-lg font-semibold">Profile Information</h2>
      </div>

      <div class="p-6">
        <form @submit.prevent="updateProfile">
          <!-- Personal Information -->
          <div class="space-y-6">
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label class="block text-sm font-medium text-gray-700">Name</label>
                <input type="text" v-model="profileData.name"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" v-model="profileData.email"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required disabled />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">CID Number</label>
                <input type="text" v-model="profileData.cid_no"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">Contact Number</label>
                <input type="tel" v-model="profileData.contact_number"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">Dzongkhag</label>
                <input type="text" v-model="profileData.dzongkhag"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">Gewog</label>
                <input type="text" v-model="profileData.gewog"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">Village</label>
                <input type="text" v-model="profileData.village"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required />
              </div>
            </div>

            <!-- Success/Error Messages -->
            <div v-if="message" :class="['p-4 rounded-md', messageClass]">
              {{ message }}
            </div>

            <!-- Submit Button -->
            <div class="flex justify-end">
              <button type="submit" :disabled="loading"
                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">
                {{ loading ? 'Updating...' : 'Update Profile' }}
              </button>
            </div>
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

const { user } = useAuthStore();
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
    const response = await apiService.getUserProfile();
    profileData.value = {
      ...response.data,
      email: user.email // Email comes from auth store
    };
  } catch (error) {
    console.error('Error loading profile:', error);
    showMessage('Failed to load profile information', 'error');
  }
};

const updateProfile = async () => {
  loading.value = true;
  try {
    await apiService.updateUserProfile(profileData.value);
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
    ? 'bg-green-50 text-green-800'
    : 'bg-red-50 text-red-800';

  setTimeout(() => {
    message.value = '';
    messageClass.value = '';
  }, 5000);
};



onMounted(() => {
  loadProfile();
});
</script>