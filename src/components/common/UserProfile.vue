<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 lg:p-8">
    <div class="max-w-7xl mx-auto">
      <!-- Header Section with Profile Overview -->
      <div class="mb-8 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div class="relative h-48 bg-gradient-to-r from-blue-600 to-blue-400">
          <div class="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>
        <div class="relative px-6 pb-6">
          <div class="flex flex-col lg:flex-row gap-6 items-start">
            <div class="relative -mt-16">
              <div class="w-32 h-32 rounded-xl border-4 border-white shadow-sm overflow-hidden bg-white">
                <img src="#" alt="Profile" class="w-full h-full object-cover" />
              </div>
            </div>
            <div class="flex-1 pt-4">
              <div class="flex flex-col lg:flex-row lg:items-center gap-4 justify-between">
                <div>
                  <h1 class="text-2xl font-bold text-slate-900">{{ user.first_name }} {{ user.last_name }}</h1>
                  <p class="text-slate-600">{{ user.role }}</p>
                </div>
                <button
                  class="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left Column - Personal Information -->
        <div class="space-y-8">
          <!-- Contact Information Card -->
          <div class="group relative" v-if="user.email || user.contact_number">
            <div
              class="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-blue-400 rounded-xl blur opacity-0 group-hover:opacity-20 transition duration-300">
            </div>
            <div class="relative bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <h2 class="text-lg font-semibold text-slate-900 mb-4">Contact Information</h2>
              <div class="space-y-4">
                <div class="flex items-center gap-3" v-if="user.email">
                  <div class="p-2 bg-blue-50 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600" fill="none"
                      viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm text-slate-500">Email</p>
                    <p class="text-slate-900">{{ user.email }}</p>
                  </div>
                </div>
                <div class="flex items-center gap-3" v-if="user.contact_number">
                  <div class="p-2 bg-blue-50 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600" fill="none"
                      viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm text-slate-500">Phone</p>
                    <p class="text-slate-900">{{ user.contact_number }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Personal Details Card -->
          <div class="group relative" v-if="user.date_of_birth || user.gender">
            <div
              class="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-purple-400 rounded-xl blur opacity-0 group-hover:opacity-20 transition duration-300">
            </div>
            <div class="relative bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <h2 class="text-lg font-semibold text-slate-900 mb-4">Personal Details</h2>
              <div class="space-y-4">
                <div class="flex items-center gap-3" v-if="user.date_of_birth">
                  <div class="p-2 bg-purple-50 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-600" fill="none"
                      viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm text-slate-500">Date of Birth</p>
                    <p class="text-slate-900">{{ formatDate(user.date_of_birth) }}</p>
                  </div>
                </div>
                <div class="flex items-center gap-3" v-if="user.gender">
                  <div class="p-2 bg-purple-50 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-600" fill="none"
                      viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm text-slate-500">Gender</p>
                    <p class="text-slate-900">{{ user.gender }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

// Define the prop for user data
defineProps({
  user: {
    type: Object,
    required: true,
  },
});

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};
</script>
