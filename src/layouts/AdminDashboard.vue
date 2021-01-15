<template>
  <div class="flex h-screen bg-slate-50">
    <!-- Enhanced Sidebar -->
    <div
      class="w-72 bg-gradient-to-b from-slate-800 to-slate-900 text-white transition-all duration-300 flex flex-col relative"
      :class="{ '-ml-72': !sidebarOpen }">
      <!-- Logo Section -->
      <div class="flex items-center justify-between p-5 border-b border-slate-700/50">
        <router-link to="/" class="flex items-center space-x-3 group">
          <div class="relative h-9 w-9 rounded-xl overflow-hidden ring-2 ring-slate-700/50">
            <img src="@/assets/rgob.png" alt="BQPCA Logo"
              class="h-full w-full object-contain transition-transform duration-300 group-hover:scale-110" />
          </div>
          <span class="font-semibold text-lg tracking-wide group-hover:text-primary transition-colors">BQPCA
            Admin</span>
        </router-link>
        <button @click="toggleSidebar" class="lg:hidden p-2 hover:bg-slate-700 rounded-lg transition-colors">
          <XIcon class="h-5 w-5" />
        </button>
      </div>

      <!-- Navigation Menu -->
      <div class="flex-1 overflow-y-auto custom-scrollbar p-4">
        <nav class="space-y-1.5">
          <template v-for="item in filteredNavigationItems" :key="item.name">
            <router-link :to="item.route" v-slot="{ isActive, navigate }" custom>
              <div @click="navigate"
                class="flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 cursor-pointer"
                :class="[
                  isActive
                    ? 'bg-slate-700/70 text-white shadow-lg shadow-slate-900/20'
                    : 'text-slate-300 hover:bg-slate-700/50 hover:text-white hover:translate-x-1',
                ]">
                <component :is="item.icon" class="h-5 w-5 mr-3" :class="{ 'text-primary': isActive }" />
                {{ item.name }}
              </div>
            </router-link>
          </template>
        </nav>
      </div>

      <!-- Logout Section at Bottom -->
      <div class="p-4 border-t border-slate-700/50">
        <button @click="handleLogout"
          class="w-full flex items-center px-4 py-3 text-sm font-medium text-slate-300 rounded-xl hover:bg-rose-500/10 hover:text-rose-500 transition-all duration-200 group">
          <LogOut class="h-5 w-5 mr-3 transition-transform duration-200 group-hover:-translate-x-1" />
          Logout
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Enhanced Top Navigation -->
      <header class="bg-white shadow-sm border-b border-slate-200">
        <div class="flex items-center justify-between px-6 py-4">
          <div class="flex items-center space-x-4">
            <button @click="toggleSidebar" class="p-2 rounded-lg hover:bg-slate-100 lg:hidden transition-colors">
              <Menu class="h-6 w-6" />
            </button>
            <h1 class="text-lg font-semibold text-slate-800">{{ currentRouteName }}</h1>
          </div>

          <div class="flex items-center space-x-6">
            <!-- Notification Component -->
            <NotificationBell />

            <!-- User Profile Section -->
            <div class="relative flex items-center space-x-4">
              <div class="text-right hidden sm:block">
                <p class="text-sm font-medium text-slate-700">{{ authStore.fullName }}</p>
                <p class="text-xs text-slate-500">{{ serviceTypeLabel }}</p>
              </div>
              <div class="relative">
                <button @click="toggleProfileMenu"
                  class="flex items-center p-1.5 rounded-xl border-2 border-slate-200 hover:border-primary transition-colors duration-200">
                  <UserCircle class="h-8 w-8 text-slate-600" />
                </button>
                <!-- Enhanced Profile Dropdown -->
                <div v-if="showProfileMenu"
                  class="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg py-2 border border-slate-200"
                  v-click-outside="() => showProfileMenu = false">
                  <div class="px-4 py-2 border-b border-slate-100">
                    <p class="text-sm font-medium text-slate-700">{{ authStore.fullName }}</p>
                    <p class="text-xs text-slate-500">{{ authStore.email }}</p>
                  </div>
                  <a href="#"
                    class="flex items-center px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    @click="handleProfile">
                    <Settings class="h-4 w-4 mr-2" />
                    Profile Settings
                  </a>
                  <a href="#"
                    class="flex items-center px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition-colors"
                    @click="handleLogout">
                    <LogOut class="h-4 w-4 mr-2" />
                    Logout
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Main Content Area -->
      <main class="flex-1 overflow-auto bg-slate-50 p-6">
        <router-view />
      </main>

      <!-- Enhanced Footer -->
      <footer class="bg-white border-t border-slate-200 px-6 py-4">
        <p class="text-sm text-slate-600 text-center">
          © {{ currentYear }} Bhutan Qualifications & Professional Certification Authority. All rights reserved.
        </p>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onBeforeMount } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import {
  Menu,
  X as XIcon,
  LogOut,
  UserCircle,
  Settings,
} from 'lucide-vue-next';
import { SERVICE_TYPE_CHOICES } from '@/router/constants';
import { generateNavigationItems } from '@/constants/navMenu';
import NotificationBell from '@/components/NotificationBell.vue';
import { formatText } from '@/utils/formatText'; // Import the utility function

// State
const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();
const sidebarOpen = ref(true);
const showProfileMenu = ref(false);
const navigationItems = ref({});

onBeforeMount(async () => {
  await router.isReady();
  navigationItems.value = generateNavigationItems(authStore.role, authStore.serviceType);
});

// Computed
const currentRouteName = computed(() => {
  const formattedRole = formatText(authStore.role);
  const formattedServiceType = formatText(serviceTypeLabel.value);
  return `${formattedRole}, ${formattedServiceType} - Dashboard`;
});

const serviceTypeLabel = computed(() => {
  return SERVICE_TYPE_CHOICES.find((s) => s.key === authStore.serviceType)?.label || '';
});

console.log(route)

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
  // Add profile navigation logic
};
</script>

<style scoped>
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.1) transparent;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
}
</style>
