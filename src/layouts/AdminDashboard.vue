<template>
  <div class="flex h-screen bg-slate-50">
    <SideNavBar
      :sidebar-open="sidebarOpen"
      :filtered-navigation-items="filteredNavigationItems"
      @toggle-sidebar="toggleSidebar"
      @logout="handleLogout"
    />

    <div class="flex-1 flex flex-col overflow-hidden">
      <TopMenuBar
        :current-route-name="currentRouteName"
        :full-name="authStore.fullName"
        :service-type-label="serviceTypeLabel"
        @toggle-sidebar="toggleSidebar"
      />
      <MainDisplayArea :current-year="currentYear" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onBeforeMount, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useHealthCertificationStore } from '@/stores/mhpcNavigationStore'
import { useInstitutionStore } from '@/stores/institutionNavigationStore'
import { SERVICE_TYPE_CHOICES } from '@/router/constants'
import { generateNavigationItems } from '@/constants/navMenu'
import { formatText } from '@/utils/formatText'

import SideNavBar from './components/SideNavBar.vue' // Adjust path if needed
import TopMenuBar from './components/TopMenuBar.vue' // Adjust path if needed
import MainDisplayArea from './components/MainDisplayArea.vue' // Adjust path if needed
// State Management
const authStore = useAuthStore()
const router = useRouter()
// const route = useRoute();
const sidebarOpen = ref(true)
const navigationItems = ref([]) // Now an array
// const showSubMenu = reactive({});

// Lifecycle Hooks
onBeforeMount(async () => {
  await router.isReady()

  // Initialize health certification store if needed
  if (authStore.serviceType === 'health_certification' && authStore.role === 'user') {
    const healthStore = useHealthCertificationStore()
    await healthStore.initialize()
  }

  // Initialize institution store if needed
  if (authStore.serviceType === 'health_certification' && authStore.role === 'institutions') {
    const institutionStore = useInstitutionStore()
    await institutionStore.initialize()
  }

  // Generate navigation items after store initialization
  navigationItems.value = generateNavigationItems(authStore.role, authStore.serviceType)
})

// Watch for route changes to update navigation
onMounted(async () => {
  if (authStore.serviceType === 'health_certification' && authStore.role === 'user') {
    const healthStore = useHealthCertificationStore()
    await healthStore.initialize()
    navigationItems.value = generateNavigationItems(authStore.role, authStore.serviceType)
  }

  if (authStore.serviceType === 'health_certification' && authStore.role === 'institutions') {
    const institutionStore = useInstitutionStore()
    await institutionStore.initialize()
    navigationItems.value = generateNavigationItems(authStore.role, authStore.serviceType)
  }
})

// Computed Properties
const currentRouteName = computed(() => {
  const formattedRole = formatText(authStore.role)
  const formattedServiceType = formatText(serviceTypeLabel.value)
  return `${formattedRole}, ${formattedServiceType} - Dashboard`
})

const serviceTypeLabel = computed(() => {
  return SERVICE_TYPE_CHOICES.find((s) => s.key === authStore.serviceType)?.label || ''
})

const filteredNavigationItems = computed(() => {
  return navigationItems.value
})

const currentYear = computed(() => new Date().getFullYear())

// const isChildActive = (children) => {
//   return children.some(child => route.path === child.route);
// };

// Methods
const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

// const toggleSubMenu = (item) => {
//   showSubMenu[item.name] = !showSubMenu[item.name];
// };

const handleLogout = async () => {
  await authStore.logout()
}
</script>

<style scoped>
/* Smooth transitions */
.transition-all {
  transition-property: all;
}

/* menu notification */
.notification-badge {
  display: inline-block;
  background-color: red;
  color: white;
  border-radius: 50%;
  padding: 0.2em 0.5em;
  font-size: 0.8em;
  margin-left: 0.5em;
  vertical-align: top;
}
</style>
