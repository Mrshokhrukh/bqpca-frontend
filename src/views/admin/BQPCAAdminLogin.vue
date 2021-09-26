<template>
  <div
    class="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
  >
    <div
      class="fade-in max-w-xl w-full space-y-8 bg-white/80 backdrop-blur-xl p-10 rounded-2xl shadow-2xl border border-slate-200"
    >
      <div class="text-center">
        <h2
          class="text-3xl font-bold flex items-center justify-center gap-3 bg-gradient-to-r from-blue-800 to-slate-800 bg-clip-text text-transparent"
        >
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
            'p-3 rounded-lg cursor-pointer transition-all duration-200 text-center border-2',
            selectedService === service.id
              ? 'bg-blue-100 border-blue-500 text-blue-700 shadow-md'
              : 'bg-slate-100 hover:bg-slate-200 border-transparent text-slate-600',
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
      <div class="flex space-x-2 bg-slate-200/60 rounded-full p-1">
        <button
          v-for="tab in loginTabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all duration-300',
            activeTab === tab.id
              ? 'bg-white shadow-md text-blue-600'
              : 'text-slate-500 hover:bg-white/80',
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
              class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 pl-10 bg-white/50"
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
              class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 pl-10 pr-12 bg-white/50"
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
            <a
              @click.prevent="openForgotPasswordModal"
              href="#"
              class="font-medium text-blue-600 hover:text-blue-500"
            >
              Forgot password?
            </a>
          </div>
        </div>
      </div>

      <!-- NDI QR Login -->
      <div v-if="activeTab === 'ndi'" class="text-center space-y-6 py-6">
        <img :src="NdiLogo" alt="NDI Logo" class="h-12 w-12 mx-auto" />
        <h3 class="text-lg font-medium text-slate-800">Login with Bhutan NDI</h3>
        <p class="text-sm text-slate-600 max-w-xs mx-auto">
          Click the button below to securely log in using your National Digital Identity wallet.
        </p>
        <button
          @click="openNdiModal"
          class="w-full inline-flex items-center justify-center px-4 py-3 border border-slate-300 rounded-lg shadow-sm bg-white text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <img :src="NdiLogo" alt="NDI" class="h-5 w-5 mr-3" />
          Login with NDI
        </button>
      </div>

      <button
        v-if="activeTab === 'email'"
        @click="handleLogin"
        :disabled="!isFormValid"
        class="w-full flex justify-center py-3 px-4 border-transparent rounded-lg shadow-lg text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-slate-400 disabled:bg-gradient-to-none disabled:cursor-not-allowed transform hover:-translate-y-0.5 transition-all duration-300"
      >
        Sign In
      </button>

      <div class="text-center pt-6 border-t border-slate-200">
        <router-link
          to="/"
          class="group inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors"
        >
          <ArrowLeftIcon class="w-4 h-4 mr-2 transform transition-transform group-hover:-translate-x-1" />
          <span>Back to Home</span>
        </router-link>
      </div>
    </div>

    <NdiModal
      v-if="isNdiModalOpen"
      :serviceType="selectedService"
      actionType="login"
      @close="isNdiModalOpen = false"
      @ndi-login-success="handleNdiLoginSuccess"
    />
    <ForgotPasswordModal
      :isVisible="isForgotPasswordModalOpen"
      @close="isForgotPasswordModalOpen = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import {
  ArrowLeft as ArrowLeftIcon,
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
import NdiModal from '../../components/common/NdiModal.vue'
import ForgotPasswordModal from '../../components/common/ForgotPasswordModal.vue'
import NdiLogo from '@/assets/ndi-logo.png'

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
  { id: 'ndi', name: 'NDI Login' },
]

const selectedService = ref('')
const activeTab = ref('email')
const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const showPassword = ref(false)

const isNdiModalOpen = ref(false)
const isForgotPasswordModalOpen = ref(false)

const isFormValid = computed(() => {
  // This computed is now only for the email form
  return email.value && password.value && selectedService.value
})

const handleLogin = async () => {
  if (!isFormValid.value) return // Should not happen if button is disabled, but good practice

  try {
    // Email/password login
    const loginForm = {
      email: email.value,
      password: password.value,
      remember: rememberMe.value,
      service_type: selectedService.value,
      from: 'adminLogin',
    }
    await authStore.login(loginForm)
    // Success toast/navigation is handled in authStore
  } catch (error) {
    console.error('Login error:', error)
    toast.error(error.response?.data?.message || 'Login failed. Please try again.')
  }
}

const openNdiModal = () => {
  if (!selectedService.value) {
    toast.error('Please select a service before proceeding with NDI login.')
    return
  }
  isNdiModalOpen.value = true
}

const openForgotPasswordModal = () => {
  isForgotPasswordModalOpen.value = true
}

const handleNdiLoginSuccess = async (threadId) => {
  try {
    await authStore.loginWithNdi(threadId, 'adminLogin')
    isNdiModalOpen.value = false
    // Success toast/navigation is handled in authStore
  } catch (error) {
    console.error('NDI login finalization failed in admin login:', error)
    isNdiModalOpen.value = false
    toast.error(error.response?.data?.message || 'NDI Login failed.')
  }
}

// --- Animation Logic ---
const observer = ref(null)
const observedElements = ref([])

onMounted(() => {
  observer.value = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
          observer.value.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.1 }
  )

  document.querySelectorAll('.fade-in').forEach((el) => {
    observer.value.observe(el)
    observedElements.value.push(el)
  })
})

onUnmounted(() => {
  if (observer.value) {
    observedElements.value.forEach((el) => {
      if (el) observer.value.unobserve(el)
    })
  }
})
</script>

<style>
.fade-in {
  opacity: 0;
  transform: translateY(30px);
  transition:
    opacity 0.6s ease-out,
    transform 0.6s ease-out;
}

.fade-in.visible {
  opacity: 1;
  transform: translateY(0);
}
</style>
