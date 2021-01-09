<!-- src/views/services/ECPFPage.vue -->
<template>
  <div class="min-h-screen bg-gray-50">

    <!-- Hero Section -->
    <div class="relative pt-20 pb-16 bg-gradient-to-br from-purple-500 to-purple-600">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="text-center text-white py-12">
          <h1 class="text-4xl font-bold sm:text-5xl">Professional Framework</h1>
          <p class="mt-4 text-xl text-purple-100">
            Comprehensive certification process for educators and professionals in Bhutan.
          </p>
        </div>
      </div>
      <!-- Wave decoration -->
      <div class="absolute bottom-0 left-0 right-0">
        <svg class="fill-current text-gray-50" viewBox="0 0 1440 120">
          <path
            d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z">
          </path>
        </svg>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <!-- Info Section -->
        <div class="space-y-8">
          <div class="bg-white rounded-xl p-8 shadow-sm">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">Why Choose Our Service?</h2>
            <div class="space-y-4">
              <div class="flex items-start">
                <CheckCircle2 class="w-6 h-6 text-purple-500 mt-1 flex-shrink-0" />
                <div class="ml-4">
                  <h3 class="font-medium">Comprehensive Certification</h3>
                  <p class="text-gray-600">Get certified for your professional skills and expertise</p>
                </div>
              </div>
              <div class="flex items-start">
                <ShieldCheck class="w-6 h-6 text-purple-500 mt-1 flex-shrink-0" />
                <div class="ml-4">
                  <h3 class="font-medium">Secure & Reliable</h3>
                  <p class="text-gray-600">Your documents are handled with the highest security standards</p>
                </div>
              </div>
              <div class="flex items-start">
                <Globe class="w-6 h-6 text-purple-500 mt-1 flex-shrink-0" />
                <div class="ml-4">
                  <h3 class="font-medium">National Recognition</h3>
                  <p class="text-gray-600">Get your qualifications recognized across Bhutan</p>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl p-8 shadow-sm">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">How It Works</h2>
            <div class="space-y-6">
              <div class="flex">
                <div
                  class="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center font-semibold">
                  1</div>
                <div class="ml-4">
                  <h3 class="font-medium">Create Account</h3>
                  <p class="text-gray-600">Register using your details or sign in with NDI</p>
                </div>
              </div>
              <div class="flex">
                <div
                  class="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center font-semibold">
                  2</div>
                <div class="ml-4">
                  <h3 class="font-medium">Submit Documents</h3>
                  <p class="text-gray-600">Upload your professional certificates and relevant documents</p>
                </div>
              </div>
              <div class="flex">
                <div
                  class="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center font-semibold">
                  3</div>
                <div class="ml-4">
                  <h3 class="font-medium">Track Progress</h3>
                  <p class="text-gray-600">Monitor your application status in real-time</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Auth Section -->
        <div class="lg:mt-8">
          <div class="bg-white rounded-xl shadow-sm overflow-hidden">
            <!-- Auth Tabs -->
            <div class="flex border-b border-gray-200">
              <button @click="activeTab = 'login'" class="flex-1 py-4 px-6 text-center font-medium"
                :class="activeTab === 'login' ? 'text-purple-600 border-b-2 border-purple-500' : 'text-gray-500 hover:text-gray-700'">
                Login
              </button>
              <button @click="activeTab = 'register'" class="flex-1 py-4 px-6 text-center font-medium"
                :class="activeTab === 'register' ? 'text-purple-600 border-b-2 border-purple-500' : 'text-gray-500 hover:text-gray-700'">
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
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Password</label>
                  <input type="password" v-model="loginForm.password"
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500" />
                </div>
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <input type="checkbox" v-model="loginForm.remember"
                      class="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded" />
                    <label class="ml-2 block text-sm text-gray-700">Remember me</label>
                  </div>
                  <a href="#" class="text-sm text-purple-600 hover:text-purple-500">Forgot password?</a>
                </div>
                <button type="submit"
                  class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                  Sign in
                </button>
              </form>

              <!-- Registration Form -->
              <form v-else @submit.prevent="handleRegister" class="space-y-4">
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700">First Name</label>
                    <input type="text" v-model="registerForm.firstName"
                      class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500" />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Last Name</label>
                    <input type="text" v-model="registerForm.lastName"
                      class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500" />
                  </div>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Email</label>
                  <input type="email" v-model="registerForm.email"
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Password</label>
                  <input type="password" v-model="registerForm.password"
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Confirm Password</label>
                  <input type="password" v-model="registerForm.confirmPassword"
                    class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500" />
                </div>
                <div class="flex items-center">
                  <input type="checkbox" v-model="registerForm.terms"
                    class="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded" />
                  <label class="ml-2 block text-sm text-gray-700">
                    I agree to the <a href="#" class="text-purple-600 hover:text-purple-500">Terms</a> and <a href="#"
                      class="text-purple-600 hover:text-purple-500">Privacy Policy</a>
                  </label>
                </div>
                <button type="submit"
                  class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500">
                  Create Account
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { CheckCircle2, ShieldCheck, Globe } from 'lucide-vue-next'

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
