<!-- src/layouts/AdminDashboard.vue -->
<template>
  <div class="flex h-screen bg-slate-50">
    <!-- Sidebar -->
    <div class="w-64 bg-slate-800 text-white transition-all duration-300" :class="{ '-ml-64': !sidebarOpen }">
      <div class="flex items-center justify-between p-4 border-b border-slate-700">
        <router-link to="/" class="flex items-center space-x-3">
          <img src="@/assets/rgob.png" alt="BQPCA Logo" class="h-8 w-8" />
          <span class="font-semibold">BQPCA Admin</span>
        </router-link>
        <button @click="toggleSidebar" class="lg:hidden">
          <XIcon class="h-6 w-6" />
        </button>
      </div>

      <div class="p-4">
        <nav class="space-y-1">
          <!-- Dynamic Navigation Menu -->
          <template v-for="item in filteredNavigationItems" :key="item.name">
            <router-link :to="item.route" v-slot="{ isActive }" custom>
              <a :href="item.route"
                class="flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors" :class="[
                  isActive
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white',
                ]">
                <component :is="item.icon" class="h-5 w-5 mr-3" />
                {{ item.name }}
              </a>
            </router-link>
          </template>

          <!-- Logout Button -->
          <button @click="handleLogout"
            class="w-full flex items-center px-4 py-2.5 text-sm font-medium text-slate-300 rounded-lg hover:bg-slate-700 hover:text-white mt-auto">
            <LogOut class="h-5 w-5 mr-3" />
            Logout
          </button>
        </nav>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Top Navigation -->
      <header class="bg-white shadow">
        <div class="flex items-center justify-between p-4">
          <button @click="toggleSidebar" class="p-2 rounded-md hover:bg-slate-100 lg:hidden">
            <Menu class="h-6 w-6" />
          </button>

          <div class="flex items-center space-x-4">
            <span class="text-sm text-slate-600">Welcome, {{ userDisplayName }}</span>
            <div class="relative">
              <button @click="toggleProfileMenu"
                class="flex items-center space-x-2 p-2 rounded-full hover:bg-slate-100">
                <UserCircle class="h-8 w-8 text-slate-600" />
              </button>
              <!-- Profile Dropdown -->
              <div v-if="showProfileMenu" class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                <a href="#" class="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100" @click="handleProfile">
                  Profile Settings
                </a>
                <a href="#" class="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100" @click="handleLogout">
                  Logout
                </a>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Main Content Area -->
      <main class="flex-1 overflow-auto bg-slate-50 p-6">
        <router-view />
      </main>
      <!-- Footer -->
      <footer class="bg-white border-t border-slate-200 py-4 text-center">
        <p class="text-sm text-slate-600">
          © {{ currentYear }} Bhutan Qualifications & Professional Certification Authority. All rights reserved.
        </p>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import {
  Menu,
  X as XIcon,
  LogOut,
  UserCircle,
} from 'lucide-vue-next';
import { SERVICE_TYPE_CHOICES } from '@/router/constants';
import { generateNavigationItems } from '@/constants/navMenu';

// State (using Pinia)
const authStore = useAuthStore();
const sidebarOpen = ref(true);
const showProfileMenu = ref(false);
const router = useRouter();

// Data
const navigationItems = ref({});


onBeforeMount(async () => {
  await router.isReady();
  // Use the imported function
  navigationItems.value = generateNavigationItems(authStore.role, authStore.serviceType)
});

// Computed
const userDisplayName = computed(() => {
  const userFullName = authStore.fullName;
  const serviceTypeLabel = SERVICE_TYPE_CHOICES.find((s) => s.key === authStore.serviceType)?.label || authStore.serviceType;

  return `${userFullName} ${serviceTypeLabel ? `- ${serviceTypeLabel}` : ''}`;
});

const filteredNavigationItems = computed(() => {
  return navigationItems.value[authStore.role] || [];
});

const currentYear = computed(() => new Date().getFullYear());

// Methods
const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value;
};

const toggleProfileMenu = () => {
  showProfileMenu.value = !showProfileMenu.value;
};

const handleLogout = async () => {
  await authStore.logout();
};

const handleProfile = () => {
  showProfileMenu.value = false;
};


</script>