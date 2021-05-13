<template>
  <div
    class="min-h-screen bg-slate-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-xl space-y-8 bg-white p-10 rounded-xl shadow-lg border border-slate-200">
      <div class="text-center">
        <h2 class="text-3xl font-bold text-slate-900 flex items-center justify-center gap-3">
          <BuildingIcon class="w-8 h-8 text-blue-700" />
          BQPCA Admin Portal
        </h2>
        <p class="mt-2 text-sm text-slate-600">Select your service and login method</p>
      </div>

      <!-- Service Selection as Horizontal Row -->
      <div class="grid grid-cols-5 gap-2">
        <div
          v-for="service in services"
          :key="service.id"
          @click="selectedService = service.id"
          :class="[
            'p-3 rounded-lg cursor-pointer transition-all duration-200 text-center',
            selectedService === service.id
              ? 'bg-blue-100 border-2 border-blue-500 text-blue-700'
              : 'bg-slate-100 hover:bg-slate-200 border border-transparent text-slate-600',
          ]"
        >
          <div class="flex flex-col items-center">
            <component
              :is="serviceIcons[service.id] || PackageIcon"
              :class="[
                'w-6 h-6 mb-1',
                selectedService === service.id ? 'text-blue-600' : 'text-slate-400',
              ]"
            />
            <span class="text-xs font-medium">{{ service.name }}</span>
          </div>
        </div>
      </div>

      <!-- Login Method Tabs -->
      <div class="flex space-x-2 bg-slate-100 rounded-full p-1">
        <button
          v-for="tab in loginTabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all duration-300',
            activeTab === tab.id
              ? 'bg-white shadow-md text-blue-600'
              : 'text-slate-500 hover:bg-slate-200',
          ]"
        >
          {{ tab.name }}
        </button>
      </div>

      <!-- Email Password Login (Default) -->
      <div v-if="activeTab === 'email'" class="space-y-6">
        <div>
          <label for="email" class="flex items-center text-sm font-medium text-slate-700 mb-2">
            <MailIcon class="w-4 h-4 mr-2 text-slate-500" />
            Email address
          </label>
          <div class="relative">
            <input
              v-model="email"
              type="email"
              id="email"
              class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-300 pl-10"
              placeholder="admin@example.com"
            />
            <AtSignIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          </div>
        </div>

        <div>
          <label for="password" class="flex items-center text-sm font-medium text-slate-700 mb-2">
            <LockIcon class="w-4 h-4 mr-2 text-slate-500" />
            Password
          </label>
          <div class="relative">
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              id="password"
              class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-300 pl-10 pr-12"
            />
            <LockIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <button
              @click="showPassword = !showPassword"
              type="button"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-blue-600"
            >
              <component :is="showPassword ? EyeOffIcon : EyeIcon" class="w-5 h-5" />
            </button>
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input
              type="checkbox"
              id="remember-me"
              v-model="rememberMe"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
            />
            <label for="remember-me" class="ml-2 block text-sm text-slate-700">Remember me</label>
          </div>

          <div class="text-sm">
            <a href="#" class="font-medium text-blue-600 hover:text-blue-500"> Forgot password? </a>
          </div>
        </div>
      </div>

      <!-- NDI QR Login -->
      <div v-if="activeTab === 'ndi'" class="text-center space-y-6">
        <div class="bg-slate-100 p-8 rounded-lg">
          <div
            class="w-52 h-52 mx-auto bg-white rounded-lg flex items-center justify-center shadow-md"
          >
            <QrCodeIcon class="w-40 h-40 text-slate-400" />
          </div>
        </div>
        <p class="text-sm text-slate-600">Scan the QR code with your NDI app to login</p>
      </div>

      <button
        @click="handleLogin"
        :disabled="!isFormValid"
        class="w-full flex justify-center py-3 px-4 border-transparent rounded-lg shadow-md text-sm font-medium text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-all duration-300"
      >
        Sign In
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
  QrCode as QrCodeIcon,
  Mail as MailIcon,
  Lock as LockIcon,
  Eye as EyeIcon,
  EyeOff as EyeOffIcon,
  AtSign as AtSignIcon,
  Building as BuildingIcon,
  Package as PackageIcon,
  Server as ServerIcon,
  Stethoscope as StethoscopeIcon,
  Wrench as WrenchIcon,
} from 'lucide-vue-next'
import { useAuthStore } from '@/stores/authStore'
import { useToast } from 'vue-toastification'

const toast = useToast()
const authStore = useAuthStore()

const services = [
  { id: 'roq', name: 'ROQ' },
  { id: 'ecpf', name: 'ECPF' },
  { id: 'health_certification', name: 'MHPC' },
  { id: 'engineering_certification', name: 'EPC' },
  { id: 'accreditation', name: 'Accreditation' },
]

const serviceIcons = {
  roq: ServerIcon,
  ecpf: PackageIcon,
  health_certification: StethoscopeIcon,
  engineering_certification: WrenchIcon,
  accreditation: BuildingIcon,
}

const loginTabs = [
  { id: 'email', name: 'Email Login' },
  { id: 'ndi', name: 'NDI QR Login' },
]

const selectedService = ref('')
const activeTab = ref('email')
const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const showPassword = ref(false)

const isFormValid = computed(() => {
  if (!selectedService.value) return false
  if (activeTab.value === 'email') {
    return email.value && password.value
  }
  return true
})

const handleLogin = async () => {
  try {
    if (activeTab.value === 'ndi') {
      // Handle NDI QR login
      console.log('Processing NDI login for service:', selectedService.value)
    } else {
      // Handle email/password login
      const loginForm = {
        email: email.value,
        password: password.value,
        remember: rememberMe.value,
        service_type: selectedService.value,
        from: 'adminLogin',
      }
      await authStore.login(loginForm)
    }
  } catch (error) {
    console.error('Login error:', error)
    toast.error(error.response?.data?.message || 'Login failed. Please try again.')
  }
}
</script>
