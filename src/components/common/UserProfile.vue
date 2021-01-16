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
                <img :src="user.personalInfo.avatar || '/api/placeholder/128/128'" alt="Profile"
                  class="w-full h-full object-cover" />
              </div>
            </div>
            <div class="flex-1 pt-4">
              <div class="flex flex-col lg:flex-row lg:items-center gap-4 justify-between">
                <div>
                  <h1 class="text-2xl font-bold text-slate-900">{{ user.personalInfo.name }}</h1>
                  <p class="text-slate-600">{{ user.personalInfo.role }}</p>
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
          <div class="group relative">
            <div
              class="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-blue-400 rounded-xl blur opacity-0 group-hover:opacity-20 transition duration-300">
            </div>
            <div class="relative bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <h2 class="text-lg font-semibold text-slate-900 mb-4">Contact Information</h2>
              <div class="space-y-4">
                <div class="flex items-center gap-3">
                  <div class="p-2 bg-blue-50 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600" fill="none"
                      viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm text-slate-500">Email</p>
                    <p class="text-slate-900">{{ user.personalInfo.email }}</p>
                  </div>
                </div>
                <div class="flex items-center gap-3">
                  <div class="p-2 bg-blue-50 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600" fill="none"
                      viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm text-slate-500">Phone</p>
                    <p class="text-slate-900">{{ user.personalInfo.phone }}</p>
                  </div>
                </div>
                <div class="flex items-center gap-3">
                  <div class="p-2 bg-blue-50 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600" fill="none"
                      viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm text-slate-500">Location</p>
                    <p class="text-slate-900">{{ user.personalInfo.location }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Personal Details Card -->
          <div class="group relative">
            <div
              class="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-purple-400 rounded-xl blur opacity-0 group-hover:opacity-20 transition duration-300">
            </div>
            <div class="relative bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <h2 class="text-lg font-semibold text-slate-900 mb-4">Personal Details</h2>
              <div class="space-y-4">
                <div class="flex items-center gap-3">
                  <div class="p-2 bg-purple-50 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-600" fill="none"
                      viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm text-slate-500">Date of Birth</p>
                    <p class="text-slate-900">{{ formatDate(user.personalInfo.dateOfBirth) }}</p>
                  </div>
                </div>
                <div class="flex items-center gap-3">
                  <div class="p-2 bg-purple-50 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-600" fill="none"
                      viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm text-slate-500">Nationality</p>
                    <p class="text-slate-900">{{ user.personalInfo.nationality }}</p>
                  </div>
                </div>
                <div class="flex items-center gap-3">
                  <div class="p-2 bg-purple-50 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-600" fill="none"
                      viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                    </svg>
                  </div>
                  <div>
                    <p class="text-sm text-slate-500">Languages</p>
                    <div class="flex flex-wrap gap-2 mt-1">
                      <span v-for="lang in user.personalInfo.languages" :key="lang"
                        class="px-2 py-1 bg-purple-50 text-purple-600 text-sm rounded-md">
                        {{ lang }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Middle and Right Columns - Education & Qualifications -->
        <div class="lg:col-span-2 space-y-8">
          <!-- Education Section -->
          <div class="group relative">
            <div
              class="absolute -inset-0.5 bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-xl blur opacity-0 group-hover:opacity-20 transition duration-300">
            </div>
            <div class="relative bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <div class="flex items-center justify-between mb-6">
                <h2 class="text-lg font-semibold text-slate-900">Education</h2>
                <button class="p-2 hover:bg-emerald-50 rounded-lg transition-colors duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-emerald-600" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
              </div>
              <div class="space-y-6">
                <div v-for="(edu, index) in user.education" :key="index" class="relative pl-8 pb-6 last:pb-0">
                  <div class="absolute left-0 top-0 mt-1.5 w-4 h-4 rounded-full border-2 border-emerald-600 bg-white">
                  </div>
                  <div class="absolute left-2 top-5 bottom-0 w-[1px] bg-emerald-200 last:hidden"></div>
                  <div>
                    <h3 class="text-lg font-medium text-slate-900">{{ edu.degree }}</h3>
                    <p class="text-slate-600">{{ edu.institution }}</p>
                    <p class="text-sm text-slate-500 mt-1">{{ edu.year }}</p>
                    <p class="text-sm text-slate-600 mt-2">{{ edu.description }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Qualifications Section -->
          <div class="group relative">
            <div
              class="absolute -inset-0.5 bg-gradient-to-r from-amber-600 to-amber-400 rounded-xl blur opacity-0 group-hover:opacity-20 transition duration-300">
            </div>
            <div class="relative bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <div class="flex items-center justify-between mb-6">
                <h2 class="text-lg font-semibold text-slate-900">Qualifications & Certifications</h2>
                <button class="p-2 hover:bg-amber-50 rounded-lg transition-colors duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div v-for="(qual, index) in user.qualifications" :key="index"
                  class="p-4 rounded-lg border border-slate-200 hover:border-amber-200 transition-colors duration-300">
                  <div class="flex items-start gap-3">
                    <div class="p-2 bg-amber-50 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-amber-600" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                    </div>
                    <div class="flex-1">
                      <h3 class="font-medium text-slate-900">{{ qual.name }}</h3>
                      <p class="text-sm text-slate-600">{{ qual.issuer }}</p>
                      <div class="flex items-center gap-2 mt-2 text-sm text-slate-500">
                        <span>Issued: {{ qual.year }}</span>
                        <span>•</span>
                        <span>Valid until: {{ qual.validUntil }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Skills Section -->
          <div class="group relative">
            <div
              class="absolute -inset-0.5 bg-gradient-to-r from-indigo-600 to-indigo-400 rounded-xl blur opacity-0 group-hover:opacity-20 transition duration-300">
            </div>
            <div class="relative bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <h2 class="text-lg font-semibold text-slate-900 mb-6">Skills & Expertise</h2>
              <div class="flex flex-wrap gap-2">
                <span v-for="skill in user.skills" :key="skill.name"
                  class="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-sm hover:bg-indigo-100 transition-colors duration-300">
                  {{ skill.name }}
                  <span class="text-indigo-400 ml-1">• {{ skill.level }}</span>
                </span>
              </div>
            </div>
          </div>

          <!-- Work Experience Section -->
          <div class="group relative">
            <div
              class="absolute -inset-0.5 bg-gradient-to-r from-rose-600 to-rose-400 rounded-xl blur opacity-0 group-hover:opacity-20 transition duration-300">
            </div>
            <div class="relative bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <div class="flex items-center justify-between mb-6">
                <h2 class="text-lg font-semibold text-slate-900">Work Experience</h2>
                <button class="p-2 hover:bg-rose-50 rounded-lg transition-colors duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-rose-600" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
              </div>
              <div class="space-y-6">
                <div v-for="(exp, index) in user.experience" :key="index" class="relative pl-8 pb-6 last:pb-0">
                  <div class="absolute left-0 top-0 mt-1.5 w-4 h-4 rounded-full border-2 border-rose-600 bg-white">
                  </div>
                  <div class="absolute left-2 top-5 bottom-0 w-[1px] bg-rose-200 last:hidden"></div>
                  <div>
                    <h3 class="text-lg font-medium text-slate-900">{{ exp.role }}</h3>
                    <p class="text-slate-600">{{ exp.company }}</p>
                    <p class="text-sm text-slate-500 mt-1">{{ exp.period }}</p>
                    <p class="text-sm text-slate-600 mt-2">{{ exp.description }}</p>
                    <div class="flex flex-wrap gap-2 mt-3">
                      <span v-for="tech in exp.technologies" :key="tech"
                        class="px-2 py-1 bg-rose-50 text-rose-600 text-sm rounded-md">
                        {{ tech }}
                      </span>
                    </div>
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
import { defineProps } from 'vue';

// Define the prop for user data
const props = defineProps({
  user: {
    type: Object,
    required: true
  }
});

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};
</script>
