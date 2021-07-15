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
import { generateNavigationItems } from '@/constants/navMenu'
import { formatText } from '@/utils/formatText'
//EPC
import { useEngineeringCertificationStore } from '@/stores/engineeringNavigationStore'

import SideNavBar from './components/SideNavBar.vue'
import TopMenuBar from './components/TopMenuBar.vue'
import MainDisplayArea from './components/MainDisplayArea.vue'

// State Management
const authStore = useAuthStore()
const router = useRouter()
const sidebarOpen = ref(true)
const navigationItems = ref([])

// Lifecycle Hooks
onBeforeMount(async () => {
  await router.isReady()

  if (authStore.serviceType === 'health_certification' && authStore.role === 'user') {
    const healthStore = useHealthCertificationStore()
    await healthStore.initialize()
  }

  if (authStore.serviceType === 'health_certification' && authStore.role === 'institutions') {
    const institutionStore = useInstitutionStore()
    await institutionStore.initialize()
  }

  if (authStore.serviceType === 'engineering_certification' && authStore.role === 'user') {
    const engineeringStore = useEngineeringCertificationStore()
    await engineeringStore.initialize()
  }

  navigationItems.value = generateNavigationItems(authStore.role, authStore.serviceType)
})

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

  //epc
  if (authStore.serviceType === 'engineering_certification' && authStore.role === 'user') {
    const engineeringStore = useEngineeringCertificationStore()
    await engineeringStore.initialize()
    navigationItems.value = generateNavigationItems(authStore.role, authStore.serviceType)
  }
})

// Custom mapping for service type display names
const serviceTypeDisplayMap = {
  roq: 'Recognition of Qualification',
  ecpf: 'ECPF',
  health_certification: 'Medical Health Professionals',
  engineering_certification: 'Engineering Professionals',
  accreditation: 'Accreditation Services',
}

// Computed Properties
const serviceTypeLabel = computed(() => {
  return serviceTypeDisplayMap[authStore.serviceType] || ''
})

const currentRouteName = computed(() => {
  const formattedRole = formatText(authStore.role)
  const formattedServiceType = formatText(serviceTypeLabel.value)
  return `${formattedRole}, ${formattedServiceType} - Dashboard`
})

const filteredNavigationItems = computed(() => {
  return navigationItems.value
})

const currentYear = computed(() => new Date().getFullYear())

// Methods
const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const handleLogout = async () => {
  await authStore.logout()
}
</script>

<style scoped>
.transition-all {
  transition-property: all;
}

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
