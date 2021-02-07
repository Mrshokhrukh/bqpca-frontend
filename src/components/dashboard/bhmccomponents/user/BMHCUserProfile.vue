<template>
  <div class="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
    <div class="bg-white shadow overflow-hidden sm:rounded-lg">
      <div class="px-4 py-5 sm:px-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900">
          Profile Information
        </h3>
        <p class="mt-1 max-w-2xl text-sm text-gray-500">
          Personal details and contact information for your account.
        </p>
      </div>

      <div class="border-t border-gray-200">
        <dl>
          <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">CID No./Identity/Work Permit No.</dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ authStore.user?.cid }}</dd>
          </div>

          <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">Full Name</dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ authStore.fullName }}</dd>
          </div>

          <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">Gender</dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ authStore.gender }}</dd>
          </div>

          <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">Date of Birth</dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ formatDate(authStore.dateOfBirth) }}</dd>
          </div>

          <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">Village</dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ authStore.village }}</dd>
          </div>

          <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">Gewog</dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ authStore.gewog }}</dd>
          </div>

          <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt class="text-sm font-medium text-gray-500">Dzongkhag</dt>
            <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ authStore.dzongkhag }}</dd>
          </div>
        </dl>
      </div>

      <!-- Update Profile Section -->
      <div class="px-4 py-5 sm:px-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900">
          Update Profile
        </h3>
        <p class="mt-1 max-w-2xl text-sm text-gray-500">
          Modify your contact information and professional details.
        </p>
      </div>

      <form @submit.prevent="saveProfile" class="px-4 py-5 sm:p-6">
        <div class="grid grid-cols-6 gap-6">
          <div class="col-span-6 sm:col-span-3">
            <label for="contactNumber" class="block text-sm font-medium text-gray-700">Contact No.</label>
            <input type="number" name="contactNumber" id="contactNumber" v-model="profileForm.contactNumber"
              class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
          </div>

          <div class="col-span-6 sm:col-span-3">
            <label for="emailAddress" class="block text-sm font-medium text-gray-700">Email Address</label>
            <input type="email" name="emailAddress" id="emailAddress" v-model="profileForm.emailAddress"
              class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
          </div>

          <div class="col-span-6 sm:col-span-3">
            <label for="passportPhoto" class="block text-sm font-medium text-gray-700">Passport Format Photo</label>
            <input type="file" name="passportPhoto" id="passportPhoto" @change="handleFileUpload"
              class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md">
          </div>

          <div class="col-span-6 sm:col-span-3">
            <label for="workAddress" class="block text-sm font-medium text-gray-700">Work Address [Practice]</label>
            <select id="workAddress" name="workAddress" v-model="profileForm.workAddress"
              class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
              <option value="">Select Work Address</option>
              <option v-for="address in workAddresses" :key="address.id" :value="address.id">{{ address.name }}</option>
            </select>
          </div>
        </div>

        <div class="mt-6 flex justify-end space-x-3">
          <button type="button"
            class="bg-gray-200 border border-gray-300 text-gray-700 py-2 px-4 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
            Cancel
          </button>
          <button type="submit"
            class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Save
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import apiService from '@/services/services';
import { useToast } from 'vue-toastification';

const authStore = useAuthStore();
const toast = useToast();

const profileForm = ref({
  contactNumber: authStore.contactNumber || '',
  emailAddress: authStore.email || '',
  passportPhoto: null,
  workAddress: '',
});

const workAddresses = ref([]); // Load from API

const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  profileForm.value.passportPhoto = file;
};

const saveProfile = async () => {
  try {
    // Basic validation (add more robust validation as needed)
    if (!profileForm.value.contactNumber || !profileForm.value.emailAddress) {
      toast.error('Contact Number and Email Address are required.');
      return;
    }

    if (!isValidEmail(profileForm.value.emailAddress)) {
      toast.error('Please enter a valid email address.');
      return;
    }

    const formData = new FormData();
    formData.append('contact_number', profileForm.value.contactNumber);
    formData.append('email', profileForm.value.emailAddress);
    if (profileForm.value.passportPhoto) {
      formData.append('passport_photo', profileForm.value.passportPhoto);
    }
    formData.append('work_address', profileForm.value.workAddress);

    // Call the API to update the profile
    await apiService.updateProfile(authStore.userId, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });

    // Update the authStore
    authStore.user = {
      ...authStore.user,
      contact_number: profileForm.value.contactNumber,
      email: profileForm.value.emailAddress,
    };

    // Persist the updated user data in localStorage
    localStorage.setItem('user', JSON.stringify(authStore.user));
    toast.success('Profile updated successfully!');

  } catch (error) {
    console.error('Error updating profile:', error);
    toast.error(error.response?.data?.message || 'Failed to update profile.');
  }
};

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

onMounted(async () => {
  // Load Work Addresses
  try {
    const response = await apiService.getWorkAddresses(); // create endpoint on backend
    workAddresses.value = response.data;
  } catch (error) {
    console.error('Error loading work addresses:', error);
    toast.error('Failed to load work addresses.');
  }
});
</script>
