<template>
  <div class="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
      <div class="text-center">
        <h2 class="text-3xl font-serif font-bold text-slate-900">BQPCA Admin Portal</h2>
        <p class="mt-2 text-sm text-slate-600">Please select your service and login method</p>
      </div>

      <div class="mt-8 space-y-6">
        <!-- Service Selection -->
        <div>
          <label for="service" class="block text-sm font-medium text-slate-700">Select Service</label>
          <select v-model="selectedService" id="service"
            class="mt-1 block w-full py-2 px-3 border border-slate-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
            <option value="">Select a service</option>
            <option v-for="service in services" :key="service.id" :value="service.id">
              {{ service.name }}
            </option>
          </select>
        </div>

        <!-- Login Method Tabs -->
        <div class="border-b border-slate-200">
          <div class="flex space-x-4">
            <button v-for="tab in loginTabs" :key="tab.id" @click="activeTab = tab.id" :class="[
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300',
              'flex-1 py-4 px-1 text-center border-b-2 font-medium text-sm'
            ]">
              {{ tab.name }}
            </button>
          </div>
        </div>

        <!-- NDI QR Login -->
        <div v-if="activeTab === 'ndi'" class="text-center space-y-6">
          <div class="bg-slate-100 p-8 rounded-lg">
            <div class="w-48 h-48 mx-auto bg-white rounded-lg flex items-center justify-center">
              <QrCodeIcon class="w-32 h-32 text-slate-400" />
            </div>
          </div>
          <p class="text-sm text-slate-600">Scan the QR code with your NDI app to login</p>
        </div>

        <!-- Email Password Login -->
        <div v-if="activeTab === 'email'" class="space-y-6">
          <div>
            <label for="email" class="block text-sm font-medium text-slate-700">Email address</label>
            <input v-model="email" type="email" id="email"
              class="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="admin@example.com" />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-slate-700">Password</label>
            <input v-model="password" type="password" id="password"
              class="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input type="checkbox" id="remember-me" v-model="rememberMe"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded" />
              <label for="remember-me" class="ml-2 block text-sm text-slate-700">Remember me</label>
            </div>

            <div class="text-sm">
              <a href="#" class="font-medium text-blue-600 hover:text-blue-500">Forgot password?</a>
            </div>
          </div>
        </div>

        <button @click="handleLogin" :disabled="!isFormValid"
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-slate-400 disabled:cursor-not-allowed">
          Sign in
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { QrCode as QrCodeIcon } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/authStore'
import { useToast } from 'vue-toastification'

const toast = useToast()
const authStore = useAuthStore()

const services = [
  { id: 'roq', name: 'ROQ' },
  { id: 'ecpf', name: 'ECPF' },
  { id: 'health_certification', name: 'Health Certification' },
  { id: 'engineering_certification', name: 'Engineer Certification' },
  { id: 'accreditation', name: 'Accreditation' },
]

const loginTabs = [
  { id: 'ndi', name: 'NDI QR Login' },
  { id: 'email', name: 'Email & Password' }
]

const selectedService = ref('')
const activeTab = ref('ndi')
const email = ref('')
const password = ref('')
const rememberMe = ref(false)

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
