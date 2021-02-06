<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 class="text-3xl font-bold text-gray-900 mb-8">Medical Professional Dashboard</h2>

      <!-- Navigation Tabs -->
      <div class="bg-white rounded-xl shadow-sm mb-6">
        <nav class="flex divide-x divide-gray-200">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="currentTab = tab.id"
            :class="[
              'flex-1 px-6 py-4 text-sm font-medium focus:outline-none transition-colors duration-200',
              currentTab === tab.id
                ? 'text-blue-600 bg-blue-50'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            ]"
          >
            <div class="flex items-center justify-center space-x-2">
              <component :is="tab.icon" class="w-5 h-5" />
              <span>{{ tab.name }}</span>
            </div>
          </button>
        </nav>
      </div>

      <!-- Content Panels -->
      <div class="bg-white rounded-xl shadow-sm p-6">
        <!-- Profile Panel -->
        <div v-if="currentTab === 'profile'" class="space-y-6">
          <div class="flex items-center space-x-6">
            <div class="h-24 w-24 rounded-full bg-blue-100 flex items-center justify-center">
              <span class="text-2xl font-bold text-blue-600">
                {{ profileData?.fullName.charAt(0) }}
              </span>
            </div>
            <div>
              <h3 class="text-2xl font-bold text-gray-900">{{ profileData?.fullName }}</h3>
              <p class="text-gray-500">Registration No: {{ profileData?.registrationNumber }}</p>
            </div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="text-sm font-medium text-gray-500">Email Address</div>
              <div class="mt-1 text-gray-900">{{ profileData?.email }}</div>
            </div>
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="text-sm font-medium text-gray-500">Contact Number</div>
              <div class="mt-1 text-gray-900">{{ profileData?.contactNumber }}</div>
            </div>
          </div>
        </div>

        <!-- Education Panel -->
        <div v-if="currentTab === 'education'" class="space-y-6">
          <div v-for="(edu, index) in educationData" :key="index" 
               class="bg-gray-50 rounded-lg p-6">
            <div class="flex justify-between items-start">
              <div>
                <h4 class="text-lg font-semibold text-gray-900">{{ edu.degree }}</h4>
                <p class="text-gray-600">{{ edu.institution }}</p>
              </div>
              <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {{ edu.year }}
              </span>
            </div>
          </div>
        </div>

        <!-- Registration Panel -->
        <div v-if="currentTab === 'registration'" class="space-y-6">
          <div v-for="(reg, index) in registrationHistory" :key="index"
               class="border rounded-lg overflow-hidden">
            <div class="px-6 py-4 bg-gray-50 border-b">
              <div class="flex justify-between items-center">
                <span class="font-medium text-gray-900">Registration Period</span>
                <span :class="[
                  'px-3 py-1 rounded-full text-sm font-medium',
                  reg.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                ]">
                  {{ reg.status }}
                </span>
              </div>
            </div>
            <div class="px-6 py-4">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <div class="text-sm font-medium text-gray-500">Start Date</div>
                  <div class="mt-1">{{ formatDate(reg.registrationDate) }}</div>
                </div>
                <div>
                  <div class="text-sm font-medium text-gray-500">Expiry Date</div>
                  <div class="mt-1">{{ formatDate(reg.expiryDate) }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- CME Panel -->
        <div v-if="currentTab === 'cme'" class="space-y-6">
          <div class="bg-blue-50 rounded-lg p-4 mb-6">
            <div class="flex justify-between items-center">
              <span class="text-lg font-medium text-blue-900">Total CME Credits</span>
              <span class="text-2xl font-bold text-blue-600">{{ totalCME }}</span>
            </div>
          </div>
          
          <div v-for="(cmes, year) in cmeHistoryGroupedByYear" :key="year" class="space-y-4">
            <h4 class="text-lg font-semibold text-gray-900">{{ year }}</h4>
            <div class="grid gap-4">
              <div v-for="cme in cmes" :key="cme.id" 
                   class="bg-gray-50 rounded-lg p-4">
                <div class="flex justify-between items-start">
                  <div>
                    <h5 class="font-medium text-gray-900">{{ cme.title }}</h5>
                    <p class="text-sm text-gray-500">{{ formatDate(cme.date) }}</p>
                  </div>
                  <span class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    {{ cme.credits }} Credits
                  </span>
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
import { ref, onMounted, computed } from 'vue';
import { UserCircleIcon, AcademicCapIcon, ClipboardDocumentCheckIcon, ChartBarIcon } from '@heroicons/vue/24/outline';

const tabs = [
  { id: 'profile', name: 'Profile', icon: UserCircleIcon },
  { id: 'education', name: 'Education', icon: AcademicCapIcon },
  { id: 'registration', name: 'Registration', icon: ClipboardDocumentCheckIcon },
  { id: 'cme', name: 'CME History', icon: ChartBarIcon }
];

const currentTab = ref('profile');
const profileData = ref(null);
const educationData = ref(null);
const registrationHistory = ref(null);
const cmeHistory = ref(null);

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

onMounted(() => {
  // Simulate API calls
  profileData.value = {
    registrationNumber: 'M-2023-1234',
    fullName: 'Pema Wangchuk',
    email: 'pema.wangchuk@example.com',
    contactNumber: '17600000',
  };

  educationData.value = [
    { degree: 'MBBS', institution: 'Khesar Gyalpo University of Medical Sciences of Bhutan', year: '2015' },
    { degree: 'MD', institution: 'AIIMS, New Delhi', year: '2020' },
  ];

  registrationHistory.value = [
    { registrationDate: '2023-01-15', expiryDate: '2026-01-15', status: 'Active' },
    { registrationDate: '2020-01-15', expiryDate: '2023-01-15', status: 'Expired' },
  ];

  cmeHistory.value = [
    { id: 1, title: 'Advanced Cardiac Care', credits: 10, date: '2023-03-10' },
    { id: 2, title: 'Infectious Disease Update', credits: 8, date: '2023-09-20' },
    { id: 3, title: 'Pain Management Workshop', credits: 5, date: '2022-05-05' },
  ];
});

const cmeHistoryGroupedByYear = computed(() => {
  if (!cmeHistory.value) return {};
  
  const grouped = {};
  cmeHistory.value.forEach(cme => {
    const year = new Date(cme.date).getFullYear();
    if (!grouped[year]) {
      grouped[year] = [];
    }
    grouped[year].push(cme);
  });
  return grouped;
});

const totalCME = computed(() => {
  if (!cmeHistory.value) return 0;
  return cmeHistory.value.reduce((sum, cme) => sum + cme.credits, 0);
});
</script>