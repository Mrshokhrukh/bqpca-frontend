<template>
  <div class="w-full mx-auto px-4 py-8">
    <!-- Enhanced Header with Gradient -->
    <div
      class="bg-gradient-to-r from-indigo-100 via-blue-50 to-indigo-100 rounded-xl p-8 mb-10 shadow-xl"
    >
      <h2 class="text-4xl font-bold mb-4 text-center">Medical Professional Dashboard</h2>
      <p class="text-center max-w-2xl mx-auto text-lg">
        Welcome back, Dr. {{ authStore.fullName }}! View your professional information and history.
      </p>
    </div>

    <!-- Enhanced Navigation Tabs -->
    <nav class="bg-white rounded-xl shadow-lg mb-8 overflow-hidden">
      <ul class="flex divide-x divide-gray-200">
        <li v-for="tab in tabs" :key="tab.id" class="flex-1">
          <button
            @click="currentTab = tab.id"
            :class="[
              'flex items-center justify-center space-x-3 px-8 py-5 text-sm font-medium focus:outline-none transition-all duration-200 w-full',
              currentTab === tab.id
                ? 'text-blue-600 bg-blue-50 border-t-2 border-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50',
            ]"
          >
            <component :is="tab.icon" class="w-5 h-5" />
            <span class="font-semibold">{{ tab.name }}</span>
          </button>
        </li>
      </ul>
    </nav>

    <!-- Enhanced Content Panels -->
    <div class="bg-white rounded-2xl shadow-lg p-8">
      <!-- Profile Panel -->
      <div v-if="currentTab === 'profile'" class="space-y-8">
        <!-- Profile Header -->
        <div class="flex items-center space-x-8 bg-gray-50 p-6 rounded-xl border border-gray-200">
          <div
            class="h-32 w-32 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg"
          >
            <span class="text-3xl font-bold text-white">
              {{ authStore.fullName ? authStore.fullName.charAt(0) : '' }}
            </span>
          </div>
          <div>
            <h3 class="text-3xl font-bold text-gray-900 mb-2">
              {{ authStore.fullName }}
            </h3>
            <div class="flex items-center space-x-4">
              <span class="px-4 py-1.5 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                Registration No: {{ profileData?.registrationNumber }}
              </span>
              <span
                class="px-4 py-1.5 bg-green-100 text-green-800 rounded-full text-sm font-medium"
              >
                Active
              </span>
            </div>
          </div>
        </div>

        <!-- Profile Information Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Personal Information Card -->
          <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h4 class="text-lg font-semibold text-gray-900">Personal Information</h4>
            </div>
            <div class="p-6 space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="text-sm font-medium text-gray-500">First Name</p>
                  <p class="mt-1 text-gray-900">
                    {{ authStore.user?.first_name }}
                  </p>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-500">Last Name</p>
                  <p class="mt-1 text-gray-900">
                    {{ authStore.user?.last_name }}
                  </p>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-500">Gender</p>
                  <p class="mt-1 text-gray-900 capitalize">
                    {{ authStore.user?.gender }}
                  </p>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-500">Date of Birth</p>
                  <p class="mt-1 text-gray-900">
                    {{ formatDate(authStore.user?.date_of_birth) }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Contact Information Card -->
          <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h4 class="text-lg font-semibold text-gray-900">Contact Information</h4>
            </div>
            <div class="p-6 space-y-4">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="text-sm font-medium text-gray-500">Contact Number</p>
                  <p class="mt-1 text-gray-900">
                    {{ authStore.user?.contact_number }}
                  </p>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-500">Email</p>
                  <p class="mt-1 text-gray-900">{{ authStore.email }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Address Information Card -->
          <div
            class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden md:col-span-2"
          >
            <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <h4 class="text-lg font-semibold text-gray-900">Address Information</h4>
            </div>
            <div class="p-6 space-y-4">
              <div class="grid grid-cols-3 gap-4">
                <div>
                  <p class="text-sm font-medium text-gray-500">Dzongkhag</p>
                  <p class="mt-1 text-gray-900">
                    {{ authStore.user?.dzongkhag }}
                  </p>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-500">Gewog</p>
                  <p class="mt-1 text-gray-900">{{ authStore.user?.gewog }}</p>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-500">Village</p>
                  <p class="mt-1 text-gray-900">{{ authStore.user?.village }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Education Panel -->
      <div v-if="currentTab === 'education'" class="space-y-6">
        <div class="grid gap-6">
          <div
            v-for="(edu, index) in educationData"
            :key="index"
            class="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div class="flex justify-between items-start">
              <div class="space-y-2">
                <h4 class="text-xl font-semibold text-gray-900">
                  {{ edu.degree }}
                </h4>
                <p class="text-gray-600">{{ edu.institution }}</p>
              </div>
              <span
                class="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
              >
                {{ edu.year }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Registration Panel -->
      <div v-if="currentTab === 'registration'" class="space-y-6">
        <div class="grid gap-6">
          <div
            v-for="(reg, index) in registrationHistory"
            :key="index"
            class="bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div class="px-6 py-4 bg-gray-50 border-b border-gray-200">
              <div class="flex justify-between items-center">
                <span class="font-medium text-gray-900">Registration Period</span>
                <span
                  :class="[
                    'px-4 py-2 rounded-full text-sm font-medium',
                    reg.status === 'Active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800',
                  ]"
                >
                  {{ reg.status }}
                </span>
              </div>
            </div>
            <div class="p-6">
              <div class="grid grid-cols-2 gap-6">
                <div>
                  <div class="text-sm font-medium text-gray-500">Start Date</div>
                  <div class="mt-1 text-gray-900">
                    {{ formatDate(reg.registrationDate) }}
                  </div>
                </div>
                <div>
                  <div class="text-sm font-medium text-gray-500">Expiry Date</div>
                  <div class="mt-1 text-gray-900">
                    {{ formatDate(reg.expiryDate) }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- CPD Panel -->
      <div v-if="currentTab === 'cme'" class="space-y-8">
        <div class="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl p-6 shadow-lg">
          <div class="flex justify-between items-center">
            <span class="text-xl font-medium text-white">Total CPD Credits</span>
            <span class="text-3xl font-bold text-white">{{ totalCPD }}</span>
          </div>
        </div>

        <div v-for="(cmes, year) in cmeHistoryGroupedByYear" :key="year" class="space-y-4">
          <h4 class="text-xl font-semibold text-gray-900 border-b pb-2">{{ year }}</h4>
          <div class="grid gap-4">
            <div
              v-for="cme in cmes"
              :key="cme.id"
              class="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div class="flex justify-between items-start">
                <div>
                  <h5 class="text-lg font-medium text-gray-900">
                    {{ cme.title }}
                  </h5>
                  <p class="text-sm text-gray-500 mt-1">
                    {{ formatDate(cme.date) }}
                  </p>
                </div>
                <span
                  class="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-green-100 text-green-800"
                >
                  {{ cme.credits }} Credits
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import {
  UserCircleIcon,
  AcademicCapIcon,
  ClipboardDocumentCheckIcon,
  ChartBarIcon,
} from '@heroicons/vue/24/outline'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()

const tabs = [
  { id: 'profile', name: 'Profile', icon: UserCircleIcon },
  { id: 'education', name: 'Education', icon: AcademicCapIcon },
  { id: 'registration', name: 'Registration', icon: ClipboardDocumentCheckIcon },
  { id: 'cme', name: 'CPD History', icon: ChartBarIcon },
]

const currentTab = ref('profile')
const profileData = ref(null)
const educationData = ref(null)
const registrationHistory = ref(null)
const cmeHistory = ref(null)

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

onMounted(() => {
  // Simulate API calls
  profileData.value = {
    registrationNumber: 'M-2023-1234',
    fullName: authStore.fullName,
    email: authStore.email,
    contactNumber: authStore.contactNumber,
  }

  educationData.value = [
    {
      degree: 'MBBS',
      institution: 'Khesar Gyalpo University of Medical Sciences of Bhutan',
      year: '2015',
    },
    { degree: 'MD', institution: 'AIIMS, New Delhi', year: '2020' },
  ]

  registrationHistory.value = [
    { registrationDate: '2023-01-15', expiryDate: '2026-01-15', status: 'Active' },
    { registrationDate: '2020-01-15', expiryDate: '2023-01-15', status: 'Expired' },
  ]

  cmeHistory.value = [
    { id: 1, title: 'Advanced Cardiac Care', credits: 10, date: '2023-03-10' },
    { id: 2, title: 'Infectious Disease Update', credits: 8, date: '2023-09-20' },
    { id: 3, title: 'Pain Management Workshop', credits: 5, date: '2022-05-05' },
  ]
})

const cmeHistoryGroupedByYear = computed(() => {
  if (!cmeHistory.value) return {}

  const grouped = {}
  cmeHistory.value.forEach((cme) => {
    const year = new Date(cme.date).getFullYear()
    if (!grouped[year]) {
      grouped[year] = []
    }
    grouped[year].push(cme)
  })
  return grouped
})

const totalCPD = computed(() => {
  if (!cmeHistory.value) return 0
  return cmeHistory.value.reduce((sum, cme) => sum + cme.credits, 0)
})
</script>
