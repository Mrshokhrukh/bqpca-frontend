<template>
  <div class="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

      <!-- Left Column: Profile Card (Sticky) -->
      <div class="lg:col-span-1">
        <div class="bg-white rounded-xl shadow-lg overflow-hidden sticky top-6">
          <div class="bg-gradient-to-r from-blue-500 to-blue-400 p-6 text-white">
            <div class="flex flex-col items-center">
              <div class="relative group mb-4">
                <div
                  class="w-28 h-28 rounded-full bg-white flex items-center justify-center text-blue-500 text-4xl font-bold shadow-lg transition-all duration-300 group-hover:shadow-xl">
                  {{ authStore.fullName ? authStore.fullName.charAt(0).toUpperCase() : 'U' }}
                </div>
              </div>
              <h2 class="text-2xl font-bold text-center">{{ profileData.first_name }} {{ profileData.last_name }}</h2>
              <p class="text-sm text-blue-100 flex items-center justify-center mt-1">
                <Mail class="w-4 h-4 mr-1" />
                {{ profileData.email }}
              </p>
              <div v-if="profileData.contact_number"
                class="text-sm text-blue-100 flex items-center justify-center mt-1">
                <Phone class="w-4 h-4 mr-1" />
                {{ profileData.contact_number }}
              </div>
            </div>
          </div>

          <div class="p-6">

            <button @click="toggleEditMode"
              class="w-full mt-4 flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              :class="[isEditing ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white']">
              <Edit v-if="!isEditing" class="w-4 h-4 mr-2" />
              <X v-else class="w-4 h-4 mr-2" />
              {{ isEditing ? 'Cancel' : 'Edit Profile' }}
            </button>
          </div>
        </div>
      </div>


      <!-- Right Column: Main Content (Forms and Certificates) -->
      <div class="lg:col-span-2 space-y-6">
        <form @submit.prevent="updateProfile" class="space-y-6">

          <!-- ... (Personal Information and Location - No Changes Here) ... -->
          <div class="bg-white rounded-xl shadow-lg p-6">
            <div class="flex items-center mb-4">
              <User class="w-5 h-5 text-blue-500 mr-2" />
              <h3 class="text-xl font-semibold text-gray-800">Personal Information</h3>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700">First Name <span
                    class="text-red-500">*</span></label>
                <div v-if="!isEditing" class="text-gray-600 px-4 py-2.5 bg-gray-50 rounded-md mt-1">{{
                    profileData.first_name }}</div>
                <input v-else v-model="profileData.first_name" type="text" required
                  class="mt-1 block w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Middle Name</label>
                <div v-if="!isEditing" class="text-gray-600 px-4 py-2.5 bg-gray-50 rounded-md mt-1">{{
                    profileData.middle_name || '-' }}</div>
                <input v-else v-model="profileData.middle_name" type="text"
                  class="mt-1 block w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Last Name <span
                    class="text-red-500">*</span></label>
                <div v-if="!isEditing" class="text-gray-600 px-4 py-2.5 bg-gray-50 rounded-md mt-1">{{
                    profileData.last_name }}</div>
                <input v-else v-model="profileData.last_name" type="text" required
                  class="mt-1 block w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Date of Birth</label>
                <div v-if="!isEditing" class="text-gray-600 px-4 py-2.5 bg-gray-50 rounded-md mt-1">{{
                    formatDate(profileData.date_of_birth) }}</div>
                <input v-else v-model="profileData.date_of_birth" type="date"
                  class="mt-1 block w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Gender</label>
                <div v-if="!isEditing" class="text-gray-600 px-4 py-2.5 bg-gray-50 rounded-md mt-1 capitalize">{{
                    profileData.gender || '-' }}</div>
                <select v-else v-model="profileData.gender"
                  class="mt-1 block w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">Contact Number <span
                    class="text-red-500">*</span></label>
                <div v-if="!isEditing" class="text-gray-600 px-4 py-2.5 bg-gray-50 rounded-md mt-1">{{
                    profileData.contact_number }}</div>
                <input v-else v-model="profileData.contact_number" type="tel" required
                  class="mt-1 block w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700">CID <span class="text-red-500">*</span></label>
                <div v-if="!isEditing" class="text-gray-600 px-4 py-2.5 bg-gray-50 rounded-md mt-1">{{ profileData.cid
                  }}</div>
                <input v-else v-model="profileData.cid" type="text" required
                  class="mt-1 block w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
              </div>
            </div>
          </div>

          <!-- Location Information -->
          <!-- Location Information -->
          <div class="bg-white rounded-xl shadow-lg p-6">
            <div class="flex items-center mb-4">
              <MapPin class="w-5 h-5 text-blue-500 mr-2" />
              <h3 class="text-xl font-semibold text-gray-800">Location Details</h3>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <!-- Dzongkhag Field -->
              <div>
                <label class="block text-sm font-medium text-gray-700">Dzongkhag <span
                    class="text-red-500">*</span></label>
                <div v-if="!isEditing" class="text-gray-600 px-4 py-2.5 bg-gray-50 rounded-md mt-1">
                  {{ profileData.dzongkhag }}
                </div>
                <input v-else v-model="profileData.dzongkhag" type="text" required
                  class="mt-1 block w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
              </div>

              <!-- Gewog Field -->
              <div>
                <label class="block text-sm font-medium text-gray-700">Gewog <span class="text-red-500">*</span></label>
                <div v-if="!isEditing" class="text-gray-600 px-4 py-2.5 bg-gray-50 rounded-md mt-1">
                  {{ profileData.gewog }}
                </div>
                <input v-else v-model="profileData.gewog" type="text" required
                  class="mt-1 block w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
              </div>

              <!-- Village Field -->
              <div>
                <label class="block text-sm font-medium text-gray-700">Village <span
                    class="text-red-500">*</span></label>
                <div v-if="!isEditing" class="text-gray-600 px-4 py-2.5 bg-gray-50 rounded-md mt-1">
                  {{ profileData.village }}
                </div>
                <input v-else v-model="profileData.village" type="text" required
                  class="mt-1 block w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
              </div>
            </div>
          </div>


          <!-- Submit Button (Only when editing) -->
          <div v-if="isEditing" class="flex justify-end">
            <button type="submit" :disabled="loading"
              class="px-6 py-2.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center">
              <Loader2 v-if="loading" class="w-4 h-4 mr-2 animate-spin" />
              <Save v-else class="w-4 h-4 mr-2" />
              <span>{{ loading ? 'Saving...' : 'Save Changes' }}</span>
            </button>
          </div>
        </form>

        <!-- Message Display -->
        <TransitionRoot appear :show="!!message" as="template">
          <div :class="[
                    'fixed bottom-4 right-4 p-4 rounded-lg shadow-lg transition-all duration-300 transform max-w-md',
                    messageClass,
                    message ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'
                  ]">
            <div class="flex items-center">
              <CheckCircle v-if="messageClass.includes('green')" class="w-5 h-5 mr-2 text-green-500" />
              <CircleAlert v-else class="w-5 h-5 mr-2 text-red-500" />
              {{ message }}
            </div>
          </div>
        </TransitionRoot>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import apiService from '@/services/userservices';
import { storeToRefs } from 'pinia';
import { TransitionRoot } from '@headlessui/vue';
import {
  Mail, User, MapPin, Edit, X, CheckCircle, CircleAlert, Save, Loader2, Phone
} from 'lucide-vue-next';

const authStore = useAuthStore();
const { userId } = storeToRefs(authStore);
const loading = ref(false);
const message = ref('');
const messageClass = ref('');
const isEditing = ref(false);

const profileData = ref({
  first_name: '',
  middle_name: '',
  last_name: '',
  email: '',
  date_of_birth: '',
  contact_number: '',
  gender: '',
  dzongkhag: '',
  gewog: '',
  village: '',
  cid: '' // Initialize cid
});

const formatDate = (date) => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const toggleEditMode = () => {
  if (isEditing.value) {
    loadProfile(); // Reset to original values
  }
  isEditing.value = !isEditing.value;
  message.value = ''; // Clear messages
};

const loadProfile = async () => {
  if (authStore.user) {
    // Include cid in the initial load
    profileData.value = { ...authStore.user, email: authStore.email };
  } else {
    showMessage('User not logged in.', 'error');
  }
};

const updateProfile = async () => {
  loading.value = true;
  message.value = '';
  try {
    if (!userId.value) {
      showMessage('User ID is missing. Please log in again.', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('id', userId.value);
    formData.append('first_name', profileData.value.first_name);
    formData.append('middle_name', profileData.value.middle_name);
    formData.append('last_name', profileData.value.last_name);
    formData.append('date_of_birth', profileData.value.date_of_birth);
    formData.append('contact_number', profileData.value.contact_number);
    formData.append('gender', profileData.value.gender);
    formData.append('dzongkhag', profileData.value.dzongkhag);
    formData.append('gewog', profileData.value.gewog);
    formData.append('village', profileData.value.village);
    formData.append('cid', profileData.value.cid);

    await apiService.patchUser(authStore.user.id, formData);
    await authStore.updateUserAfterFetch(); // Refresh the user data
    showMessage('Profile updated successfully!', 'success');
    isEditing.value = false;

  } catch (error) {
    console.error('Error updating profile:', error);
    const errorMessage = error.response?.data?.message || 'Failed to update profile. Please try again.';
    showMessage(errorMessage, 'error');

  } finally {
    loading.value = false;
  }
};

const showMessage = (text, type = 'success') => {
  message.value = text;
  messageClass.value = type === 'success'
    ? 'bg-green-100 text-green-800'
    : 'bg-red-100 text-red-800';

  setTimeout(() => {
    message.value = '';
    messageClass.value = '';
  }, 5000);
};

onMounted(loadProfile);
</script>
