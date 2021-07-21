<template>
  <div class="mx-auto py-10 px-4 sm:px-6 lg:px-8">
    <!-- Profile Header with Avatar -->
    <div class="mb-8 flex flex-col md:flex-row items-center md:items-start gap-6">
      <div class="relative">
        <div
          class="h-32 w-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
          <img v-if="authStore.user?.profile_photo_url" :src="authStore.user.profile_photo_url" alt="Profile photo"
            class="h-full w-full object-cover" />
          <span v-else class="text-4xl font-bold text-gray-500">{{
            getInitials(authStore.fullName)
            }}</span>
        </div>
        <label for="photo-upload"
          class="absolute bottom-0 right-0 bg-indigo-600 rounded-full p-2 text-white cursor-pointer shadow-md hover:bg-indigo-700 transition">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path
              d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
          <input id="photo-upload" type="file" @change="handleFileUpload" class="hidden" accept="image/*" />
        </label>
      </div>

      <div class="text-center md:text-left">
        <h1 class="text-3xl font-bold text-gray-900">{{ authStore.fullName }}</h1>
        <p class="text-gray-500 text-lg">{{ authStore.user?.cid || 'No CID' }}</p>
        <div class="mt-2 flex flex-wrap gap-2 justify-center md:justify-start">
          <span
            class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
            {{ authStore.gender }}
          </span>
          <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            {{ formatDate(authStore.dateOfBirth) }}
          </span>
        </div>
      </div>

      <div class="ml-auto hidden md:block">
        <button @click="isEditing = !isEditing"
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          <span v-if="!isEditing">Edit Profile</span>
          <span v-else>View Profile</span>
        </button>
      </div>
    </div>

    <!-- Tab Navigation -->
    <div class="border-b border-gray-200 mb-8">
      <nav class="-mb-px flex space-x-8">
        <button @click="isEditing = false"
          class="cursor-pointer whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm" :class="!isEditing
            ? 'border-indigo-500 text-indigo-600'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ">
          Personal Information
        </button>
        <button @click="isEditing = true"
          class="cursor-pointer whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm" :class="isEditing
            ? 'border-indigo-500 text-indigo-600'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            ">
          Update Profile
        </button>
      </nav>
    </div>

    <!-- Mobile Edit Button -->
    <div class="md:hidden mb-6 flex justify-end">
      <button @click="isEditing = !isEditing"
        class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
        <span v-if="!isEditing">Edit Profile</span>
        <span v-else>View Profile</span>
      </button>
    </div>

    <!-- Personal Information View -->
    <div v-if="!isEditing" class="bg-white rounded-lg shadow overflow-hidden">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12 p-6">
        <div>
          <h3 class="text-lg font-medium text-gray-900 mb-4 border-b pb-2">Personal Details</h3>
          <div class="space-y-4">
            <div>
              <h4 class="text-sm font-medium text-gray-500">CID No.</h4>
              <p class="mt-1 text-gray-900">{{ authStore.user?.cid || 'Not provided' }}</p>
            </div>
            <div>
              <h4 class="text-sm font-medium text-gray-500">Full Name</h4>
              <p class="mt-1 text-gray-900">{{ authStore.fullName || 'Not provided' }}</p>
            </div>
            <div>
              <h4 class="text-sm font-medium text-gray-500">Gender</h4>
              <p class="mt-1 text-gray-900">{{ authStore.gender || 'Not provided' }}</p>
            </div>
            <div>
              <h4 class="text-sm font-medium text-gray-500">Date of Birth</h4>
              <p class="mt-1 text-gray-900">{{ formatDate(authStore.dateOfBirth) || 'Not provided' }}</p>
            </div>
          </div>
        </div>
        <div>
          <h3 class="text-lg font-medium text-gray-900 mb-4 border-b pb-2">Location & Contact</h3>
          <div class="space-y-4">
            <div>
              <h4 class="text-sm font-medium text-gray-500">Village</h4>
              <p class="mt-1 text-gray-900">{{ authStore.village || 'Not provided' }}</p>
            </div>
            <div>
              <h4 class="text-sm font-medium text-gray-500">Gewog</h4>
              <p class="mt-1 text-gray-900">{{ authStore.gewog || 'Not provided' }}</p>
            </div>
            <div>
              <h4 class="text-sm font-medium text-gray-500">Dzongkhag</h4>
              <p class="mt-1 text-gray-900">{{ authStore.dzongkhag || 'Not provided' }}</p>
            </div>
            <div>
              <h4 class="text-sm font-medium text-gray-500">Contact Number</h4>
              <p class="mt-1 text-gray-900">{{ authStore.user?.contact_number || 'Not provided' }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="bg-gray-50 p-6 border-t border-gray-200">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Work Information</h3>
        <div>
          <h4 class="text-sm font-medium text-gray-500">Work Address</h4>
          <p class="mt-1 text-gray-900">{{ authStore.user?.work_address || 'Not specified' }}</p>
        </div>
      </div>
    </div>

    <!-- Edit Profile Form -->
    <div v-else class="bg-white rounded-lg shadow overflow-hidden">
      <form @submit.prevent="saveProfile" class="p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-6">Update Your Information</h3>
        <p class="text-sm text-gray-500 mb-6">Only the contact number and work address fields are editable.</p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Editable Fields -->
          <div>
            <label for="contactNumber" class="block text-sm font-medium text-gray-700">Contact Number</label>
            <input type="text" id="contactNumber" v-model="profileForm.contactNumber"
              class="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
          </div>

          <div>
            <label for="workAddress" class="block text-sm font-medium text-gray-700">Work Address</label>
            <input type="text" id="workAddress" v-model="profileForm.workAddress"
              class="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
          </div>

          <!-- Disabled Fields -->
          <div>
            <label for="cid" class="block text-sm font-medium text-gray-700">CID</label>
            <input type="text" id="cid" v-model="profileForm.cid"
              class="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md bg-gray-100" disabled />
          </div>
          <div>
            <label for="firstName" class="block text-sm font-medium text-gray-700">First Name</label>
            <input type="text" id="firstName" v-model="profileForm.firstName"
              class="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md bg-gray-100" disabled />
          </div>
          <div>
            <label for="lastName" class="block text-sm font-medium text-gray-700">Last Name</label>
            <input type="text" id="lastName" v-model="profileForm.lastName"
              class="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md bg-gray-100" disabled />
          </div>
          <div>
            <label for="gender" class="block text-sm font-medium text-gray-700">Gender</label>
            <input type="text" id="gender" v-model="profileForm.gender"
              class="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md bg-gray-100" disabled />
          </div>
        </div>

        <div class="mt-8 flex justify-end space-x-3">
          <button type="button" @click="cancelEdit"
            class="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Cancel
          </button>
          <button type="submit"
            class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import apiService from '@/services/services' // Make sure this path is correct
import { useToast } from 'vue-toastification'

const authStore = useAuthStore()
const toast = useToast()
const isEditing = ref(false)
const previewUrl = ref(null)

// Initialize form with data from the store
const profileForm = ref({
  cid: authStore.user?.cid || '',
  firstName: authStore.user?.first_name || '',
  lastName: authStore.user?.last_name || '',
  gender: authStore.user?.gender || '',
  contactNumber: authStore.user?.contact_number || '',
  workAddress: authStore.user?.work_address || '',
  passportPhoto: null, // This will hold the file object for uploads
})

const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const getInitials = (name) => {
  if (!name) return ''
  return name
    .split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase()
}

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    profileForm.value.passportPhoto = file // Store the actual file object
    previewUrl.value = URL.createObjectURL(file)
  }
}

// *** THIS IS THE CORRECTED FUNCTION ***
const saveProfile = async () => {
  try {
    // 1. Create a FormData object. This is essential for multipart/form-data requests.
    const formData = new FormData();

    // 2. Append only the fields you want to update.
    // The keys ('contact_number', 'work_address') must match your Django API's field names.
    formData.append('contact_number', profileForm.value.contactNumber);
    formData.append('work_address', profileForm.value.workAddress);

    // OPTIONAL: Also append the passport photo if a new one was selected
    if (profileForm.value.passportPhoto) {
      formData.append('passport_photo', profileForm.value.passportPhoto);
    }

    // 3. Call the `patchUser` method from your service file.
    // It is the correct method for partial updates.
    // Your `apiClient` (likely Axios) will automatically set the correct Content-Type header.
    const response = await apiService.patchUser(authStore.user.id, formData);

    // 4. On success, update the local data in the authStore to keep the UI in sync.
    authStore.user.contact_number = response.data.contact_number;
    authStore.user.work_address = response.data.work_address;
    if (response.data.passport_photo) {
      authStore.user.profile_photo_url = response.data.passport_photo
    }


    toast.success('Profile updated successfully!');
    isEditing.value = false; // Switch back to view mode.

  } catch (error) {
    console.error('Error updating profile:', error.response ? error.response.data : error);
    toast.error(error.response?.data?.detail || 'Failed to update profile. Please try again.');
  }
};


const cancelEdit = () => {
  // Reset form fields to their original values from the store
  profileForm.value.contactNumber = authStore.user?.contact_number || ''
  profileForm.value.workAddress = authStore.user?.work_address || ''
  profileForm.value.passportPhoto = null; // Clear any selected file
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value); // Clean up the preview URL
    previewUrl.value = null;
  }
  isEditing.value = false
}

</script>
