<!-- src/layouts/AdminDashboard.vue -->
<template>
  <div class="flex h-screen bg-slate-50">
    <!-- Sidebar -->
    <div class="w-64 bg-slate-800 text-white transition-all duration-300" :class="{ '-ml-64': !sidebarOpen }">
      <div class="flex items-center justify-between p-4 border-b border-slate-700">
        <router-link to="/" class="flex items-center space-x-3">
          <img src="@/assets/rgob.png" alt="BQPCA Logo" class="h-8 w-8">
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
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
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
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  Menu,
  X as XIcon,
  LogOut,
  UserCircle,
  LayoutDashboard,
  FileText,
  Settings,
  Users,
  ClipboardCheck,
  BookOpen,
  Building2
} from 'lucide-vue-next'

// State
const sidebarOpen = ref(true)
const showProfileMenu = ref(false)
const router = useRouter()

// Props
const props = defineProps({
  userRole: {
    type: String,
    required: true
  },
  userModule: {
    type: String,
    default: null
  }
})

// Navigation items based on roles
const navigationItems = {
  superAdmin: [
    { name: 'Dashboard', icon: LayoutDashboard, route: '/admin/dashboard' },
    { name: 'Reports', icon: FileText, route: '/admin/reports' },
    { name: 'Configuration', icon: Settings, route: '/admin/config' }
  ],
  roqAdmin: [
    { name: 'Dashboard', icon: LayoutDashboard, route: '/roq/dashboard' },
    { name: 'Applications', icon: ClipboardCheck, route: '/roq/applications' },
    { name: 'Qualifications', icon: BookOpen, route: '/roq/qualifications' },
    { name: 'Institutions', icon: Building2, route: '/roq/institutions' }
  ],
  ecpfAdmin: [
    { name: 'Dashboard', icon: LayoutDashboard, route: '/ecpf/dashboard' },
    { name: 'Certifications', icon: BookOpen, route: '/ecpf/certifications' },
    { name: 'Professionals', icon: Users, route: '/ecpf/professionals' }
  ],
  // Add other module menus similarly
}

// Computed
const userDisplayName = computed(() => {
  return `${props.userRole} ${props.userModule ? `- ${props.userModule}` : ''}`
})

const filteredNavigationItems = computed(() => {
  if (props.userRole === 'superAdmin') {
    return navigationItems.superAdmin
  }
  return navigationItems[`${props.userModule.toLowerCase()}Admin`] || []
})

// Methods
const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const toggleProfileMenu = () => {
  showProfileMenu.value = !showProfileMenu.value
}

const handleLogout = async () => {
  // Add logout logic here
  await router.push('/admin/login')
}

const handleProfile = () => {
  showProfileMenu.value = false
  // Add profile navigation logic
}
</script>
