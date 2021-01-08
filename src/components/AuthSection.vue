<!-- src/components/AuthSection.vue -->
<template>
  <div class="bg-white rounded-xl shadow-sm overflow-hidden">
    <!-- Auth Tabs -->
    <div class="flex border-b border-gray-200">
      <button @click="activeTab = 'login'" class="flex-1 py-4 px-6 text-center font-medium"
        :class="activeTab === 'login' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'">
        Login
      </button>
      <button @click="activeTab = 'register'" class="flex-1 py-4 px-6 text-center font-medium"
        :class="activeTab === 'register' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-gray-700'">
        Register
      </button>
    </div>

    <div class="p-8">
      <!-- NDI Login Button -->
      <button @click="loginWithNDI"
        class="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-gray-700 hover:bg-gray-50 mb-6">
        <img src="@/assets/ndi-logo.png" alt="NDI" class="h-5 w-5 mr-2" />
        Continue with NDI
      </button>

      <div class="relative mb-6">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-gray-300"></div>
        </div>
        <div class="relative flex justify-center text-sm">
          <span class="px-2 bg-white text-gray-500">Or continue with</span>
        </div>
      </div>

      <!-- Login Form -->
      <form v-if="activeTab === 'login'" @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Email</label>
          <input type="email" v-model="loginForm.email"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Password</label>
          <input type="password" v-model="loginForm.password"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" />
        </div>
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input type="checkbox" v-model="loginForm.remember"
              class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" />
            <label class="ml-2 block text-sm text-gray-700">Remember me</label>
          </div>
          <a href="#" class="text-sm text-primary hover:text-primary/90">Forgot password?</a>
        </div>
        <button type="submit"
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
          Sign in
        </button>
      </form>

      <!-- Registration Form -->
      <form v-else @submit.prevent="handleRegister" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">First Name</label>
            <input type="text" v-model="registerForm.firstName"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Last Name</label>
            <input type="text" v-model="registerForm.lastName"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" />
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Email</label>
          <input type="email" v-model="registerForm.email"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Password</label>
          <input type="password" v-model="registerForm.password"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Confirm Password</label>
          <input type="password" v-model="registerForm.confirmPassword"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary" />
        </div>
        <div class="flex items-center">
          <input type="checkbox" v-model="registerForm.terms"
            class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" />
          <label class="ml-2 block text-sm text-gray-700">
            I agree to the <a href="#" class="text-primary hover:text-primary/90">Terms</a> and <a href="#"
              class="text-primary hover:text-primary/90">Privacy Policy</a>
          </label>
        </div>
        <button type="submit"
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
          Create Account
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const activeTab = ref('login')

const loginForm = reactive({
  email: '',
  password: '',
  remember: false
})

const registerForm = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  terms: false
})

const loginWithNDI = () => {
  // Implement NDI login logic
  console.log('NDI login clicked')
}

const handleLogin = () => {
  // Implement login logic
  console.log('Login submitted:', loginForm)
}

const handleRegister = () => {
  // Implement registration logic
  console.log('Registration submitted:', registerForm)
}
</script>
