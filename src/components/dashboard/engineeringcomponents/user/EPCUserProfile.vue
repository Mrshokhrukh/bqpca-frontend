<template>
  <div class="mx-auto py-10 px-4 sm:px-6 lg:px-8">
    <!-- Profile Header with Avatar -->
    <div class="mb-8 flex flex-col md:flex-row items-center md:items-start gap-6">
      <div class="relative">
        <div
          class="h-32 w-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg"
        >
          <img
            v-if="authStore.user?.profile_photo_url"
            :src="authStore.user.profile_photo_url"
            alt="Profile photo"
            class="h-full w-full object-cover"
          />
          <span v-else class="text-4xl font-bold text-gray-500">{{
            getInitials(authStore.fullName)
          }}</span>
        </div>
        <label
          for="photo-upload"
          class="absolute bottom-0 right-0 bg-indigo-600 rounded-full p-2 text-white cursor-pointer shadow-md hover:bg-indigo-700 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"
            />
          </svg>
          <input
            id="photo-upload"
            type="file"
            @change="handleFileUpload"
            class="hidden"
            accept="image/*"
          />
        </label>
      </div>

      <div class="text-center md:text-left">
        <h1 class="text-3xl font-bold text-gray-900">{{ authStore.fullName }}</h1>
        <p class="text-gray-500 text-lg">{{ authStore.user?.cid || 'No CID' }}</p>
        <div class="mt-2 flex flex-wrap gap-2 justify-center md:justify-start">
          <span
            class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
          >
            {{ authStore.gender }}
          </span>
          <span
            class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
          >
            {{ formatDate(authStore.dateOfBirth) }}
          </span>
        </div>
      </div>

      <div class="ml-auto hidden md:block">
        <button
          @click="isEditing = !isEditing"
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <span v-if="!isEditing">Edit Profile</span>
          <span v-else>View Profile</span>
        </button>
      </div>
    </div>

    <!-- Tab Navigation -->
    <div class="border-b border-gray-200 mb-8">
      <nav class="-mb-px flex space-x-8">
        <button
          @click="isEditing = false"
          class="cursor-pointer whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
          :class="
            !isEditing
              ? 'border-indigo-500 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          "
        >
          Personal Information
        </button>
        <button
          @click="isEditing = true"
          class="cursor-pointer whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm"
          :class="
            isEditing
              ? 'border-indigo-500 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          "
        >
          Update Profile
        </button>
      </nav>
    </div>

    <!-- Mobile Edit Button -->
    <div class="md:hidden mb-6 flex justify-end">
      <button
        @click="isEditing = !isEditing"
        class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
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
              <h4 class="text-sm font-medium text-gray-500">CID No./Identity/Work Permit No.</h4>
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
              <p class="mt-1 text-gray-900">
                {{ formatDate(authStore.dateOfBirth) || 'Not provided' }}
              </p>
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
              <h4 class="text-sm font-medium text-gray-500">Contact Information</h4>
              <div class="mt-1 flex items-center space-x-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <span>{{ authStore.user?.contact_number || 'No contact number' }}</span>
              </div>
              <div class="mt-1 flex items-center space-x-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span>{{ authStore.user?.email || 'No email address' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-gray-50 p-6 border-t border-gray-200">
        <h3 class="text-lg font-medium text-gray-900 mb-4 border-b pb-2">Work Information</h3>
        <div>
          <h4 class="text-sm font-medium text-gray-500">Work Address [Practice]</h4>
          <p class="mt-1 text-gray-900">
            {{ getWorkAddressName(profileForm.workAddressId) || 'Not specified' }}
          </p>
        </div>
      </div>
    </div>

    <!-- Edit Profile Form -->
    <div v-else class="bg-white rounded-lg shadow overflow-hidden">
      <form @submit.prevent="saveProfile" class="p-6">
        <h3 class="text-lg font-medium text-gray-900 mb-6">Update Your Information</h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- CID Field -->
          <div>
            <label for="cid" class="block text-sm font-medium text-gray-700">CID</label>
            <input
              type="text"
              id="cid"
              v-model="profileForm.cid"
              class="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>

          <!-- First Name -->
          <div>
            <label for="firstName" class="block text-sm font-medium text-gray-700">First Name</label>
            <input
              type="text"
              id="firstName"
              v-model="profileForm.firstName"
              class="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>

          <!-- Middle Name -->
          <div>
            <label for="middleName" class="block text-sm font-medium text-gray-700">Middle Name</label>
            <input
              type="text"
              id="middleName"
              v-model="profileForm.middleName"
              class="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>

          <!-- Last Name -->
          <div>
            <label for="lastName" class="block text-sm font-medium text-gray-700">Last Name</label>
            <input
              type="text"
              id="lastName"
              v-model="profileForm.lastName"
              class="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>

          <!-- Gender -->
          <div>
            <label for="gender" class="block text-sm font-medium text-gray-700">Gender</label>
            <select
              id="gender"
              v-model="profileForm.gender"
              class="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <!-- Village -->
          <div>
            <label for="village" class="block text-sm font-medium text-gray-700">Village</label>
            <input
              type="text"
              id="village"
              v-model="profileForm.village"
              class="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>

          <!-- Gewog -->
          <div>
            <label for="gewog" class="block text-sm font-medium text-gray-700">Gewog</label>
            <input
              type="text"
              id="gewog"
              v-model="profileForm.gewog"
              class="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>

          <!-- Dzongkhag -->
          <div>
            <label for="dzongkhag" class="block text-sm font-medium text-gray-700">Dzongkhag</label>
            <input
              type="text"
              id="dzongkhag"
              v-model="profileForm.dzongkhag"
              class="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div class="mt-8 flex justify-end space-x-3">
          <button
            type="button"
            @click="cancelEdit"
            class="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import apiService from '@/services/services'
import epcServices from '@/services/epcServices'
import { useToast } from 'vue-toastification'

const authStore = useAuthStore()
const toast = useToast()
const isEditing = ref(false)
const previewUrl = ref(null)

const profileForm = ref({
  cid: authStore.user?.cid || '',
  firstName: authStore.user?.first_name || '',
  middleName: authStore.user?.middle_name || '',
  lastName: authStore.user?.last_name || '',
  gender: authStore.user?.gender || '',
  village: authStore.user?.village || '',
  gewog: authStore.user?.gewog || '',
  dzongkhag: authStore.user?.dzongkhag || '',
  contactNumber: authStore.user?.contact_number || '',
  emailAddress: authStore.user?.email || '',
  passportPhoto: null,
  workAddressId: '',
})

const workAddresses = ref([])

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

const getWorkAddressName = (addressId) => {
  if (!addressId) return ''
  const address = workAddresses.value.find((addr) => addr.id === addressId)
  return address ? address.name : ''
}

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    profileForm.value.passportPhoto = file

    // Create preview URL
    previewUrl.value = URL.createObjectURL(file)
  }
}

const fetchUserDetails = async () => {
  try {
    const response = await apiService.getUserDetails(profileForm.value.cid)
    if (response.data) {
      Object.assign(profileForm.value, response.data)
    }
  } catch (error) {
    console.error('Error fetching user details:', error)
    toast.error('Failed to fetch user details.')
  }
}

const saveProfile = async () => {
  try {
    const updatedData = { ...profileForm.value };
    await epcServices.updateUser(authStore.user.id, updatedData); // Ensure `authStore.user.id` is correct
    toast.success('Profile updated successfully!');
    isEditing.value = false;
  } catch (error) {
    console.error('Error updating profile:', error);
    toast.error('Failed to update profile.');
  }
}

const cancelEdit = () => {
  // Reset form data
  profileForm.value = {
    cid: authStore.user?.cid || '',
    firstName: authStore.user?.first_name || '',
    middleName: authStore.user?.middle_name || '',
    lastName: authStore.user?.last_name || '',
    gender: authStore.user?.gender || '',
    village: authStore.user?.village || '',
    gewog: authStore.user?.gewog || '',
    dzongkhag: authStore.user?.dzongkhag || '',
    contactNumber: authStore.user?.contact_number || '',
    emailAddress: authStore.user?.email || '',
    passportPhoto: null,
    workAddressId: profileForm.value.workAddressId, // Keep the current work address
  }

  // Clear preview
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
    previewUrl.value = null
  }

  // Switch back to view mode
  isEditing.value = false
}

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

onMounted(async () => {
  // Load Work Addresses using EPC services
  try {
    // Get the user's CID
    const userCid = authStore.user?.cid

    if (userCid) {
      // Get EPC applications for this user
      const response = await epcServices.getEpcNewApplications()

      if (response.data && Array.isArray(response.data.results)) {
        const userApplications = response.data.results.filter((app) => app.cid_no === userCid)

        if (userApplications.length > 0) {
          // Extract work addresses from qualifications
          const workplaces = userApplications
            .flatMap((app) => app.user_qualifications)
            .filter((qual) => qual.practice_address)

          workAddresses.value = workplaces.map((workplace) => ({
            id: workplace.id,
            name: workplace.practice_address,
          }))

          // Set default work address if available
          if (workAddresses.value.length > 0) {
            profileForm.value.workAddressId = workAddresses.value[0].id
          }
        }
      }
    }
  } catch (error) {
    console.error('Error loading work addresses:', error)
    toast.error('Failed to load work addresses.')
  }
})
</script>
