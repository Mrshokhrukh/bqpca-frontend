<!-- src/views/services/RoQPage.vue -->
<template>
  <div class="min-h-screen bg-slate-50">
    <!-- Hero Section -->
    <div class="bg-slate-900 relative">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="text-center mt-20">
          <h1 class="text-3xl font-serif font-bold text-white sm:text-4xl lg:text-5xl">
            Recognition of Qualifications
          </h1>
          <p class="mt-4 text-xl text-slate-300 max-w-3xl mx-auto">
            Official verification and recognition of educational qualifications by the Royal Government of Bhutan
          </p>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Information Section -->
        <div class="lg:col-span-2 space-y-8">
          <!-- Official Notice -->
          <div class="bg-white border-l-4 border-blue-600 rounded p-6 shadow-sm">
            <h2 class="text-xl font-serif font-bold text-slate-900 mb-4">
              Official Notice
            </h2>
            <p class="text-slate-600">
              This is the official portal for qualification recognition services provided by the Bhutan Qualifications &
              Professional Certification Authority (BQPCA). All certification and verification processes are conducted in
              accordance with the Royal Government of Bhutan's regulations.
            </p>
          </div>

          <!-- Process Overview -->
          <div class="bg-white rounded-lg shadow-sm">
            <div class="p-6 border-b border-slate-200">
              <h2 class="text-xl font-serif font-bold text-slate-900">Verification Process</h2>
            </div>
            <div class="p-6">
              <div class="space-y-6">
                <div class="flex items-start">
                  <div class="flex-shrink-0 h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-medium">
                    1
                  </div>
                  <div class="ml-4">
                    <h3 class="text-lg font-medium text-slate-900">Identity Verification</h3>
                    <p class="mt-2 text-slate-600">Authenticate using your National Digital Identity (NDI) or create an account with your citizenship details</p>
                  </div>
                </div>

                <div class="flex items-start">
                  <div class="flex-shrink-0 h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-medium">
                    2
                  </div>
                  <div class="ml-4">
                    <h3 class="text-lg font-medium text-slate-900">Document Submission</h3>
                    <p class="mt-2 text-slate-600">Submit digital copies of your educational certificates and supporting documentation</p>
                  </div>
                </div>

                <div class="flex items-start">
                  <div class="flex-shrink-0 h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-medium">
                    3
                  </div>
                  <div class="ml-4">
                    <h3 class="text-lg font-medium text-slate-900">Verification</h3>
                    <p class="mt-2 text-slate-600">Your documents will be verified through our official channels</p>
                  </div>
                </div>

                <div class="flex items-start">
                  <div class="flex-shrink-0 h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-medium">
                    4
                  </div>
                  <div class="ml-4">
                    <h3 class="text-lg font-medium text-slate-900">Certification</h3>
                    <p class="mt-2 text-slate-600">Receive your official verification certificate with digital signature</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Important Information -->
          <div class="bg-white rounded-lg shadow-sm">
            <div class="p-6 border-b border-slate-200">
              <h2 class="text-xl font-serif font-bold text-slate-900">Important Information</h2>
            </div>
            <div class="p-6">
              <div class="space-y-4">
                <div class="flex items-start">
                  <Clock class="w-6 h-6 text-blue-600 mt-1" />
                  <div class="ml-4">
                    <h3 class="font-medium text-slate-900">Processing Time</h3>
                    <p class="text-slate-600">Standard processing time is 5-7 working days</p>
                  </div>
                </div>
                <div class="flex items-start">
                  <FileText class="w-6 h-6 text-blue-600 mt-1" />
                  <div class="ml-4">
                    <h3 class="font-medium text-slate-900">Required Documents</h3>
                    <p class="text-slate-600">Original certificates, transcripts, and valid identification</p>
                  </div>
                </div>
                <div class="flex items-start">
                  <ShieldCheck class="w-6 h-6 text-blue-600 mt-1" />
                  <div class="ml-4">
                    <h3 class="font-medium text-slate-900">Security</h3>
                    <p class="text-slate-600">All documents are processed through secure government channels</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Authentication Section -->
        <div>
          <div class="bg-white rounded-lg shadow-sm sticky top-8">
            <div class="p-6 border-b border-slate-200">
              <h2 class="text-xl font-serif font-bold text-slate-900">Authentication</h2>
            </div>

            <div class="p-6">
              <!-- NDI Login Button -->
              <button @click="loginWithNDI"
                class="w-full flex items-center justify-center px-4 py-3 bg-slate-800 text-white rounded hover:bg-slate-700 transition-colors">
                <img src="@/assets/ndi-logo.png" alt="NDI" class="h-5 w-5 mr-2" />
                Authenticate with NDI
              </button>

              <div class="relative my-6">
                <div class="absolute inset-0 flex items-center">
                  <div class="w-full border-t border-slate-200"></div>
                </div>
                <div class="relative flex justify-center text-sm">
                  <span class="px-2 bg-white text-slate-500">Alternative Login</span>
                </div>
              </div>

              <!-- Login Form -->
              <form @submit.prevent="handleLogin" class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-slate-700">Email Address</label>
                  <input type="email" v-model="loginForm.email"
                    class="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-700">Password</label>
                  <input type="password" v-model="loginForm.password"
                    class="mt-1 block w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <button type="submit"
                  class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Sign In
                </button>
              </form>

              <div class="mt-4 text-center">
                <a href="/register" class="text-sm text-blue-600 hover:text-blue-500">
                  Create new account
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { Clock, FileText, ShieldCheck } from 'lucide-vue-next'

const loginForm = reactive({
  email: '',
  password: ''
})

const loginWithNDI = () => {
  // Implement NDI login logic
  console.log('NDI login clicked')
}

const handleLogin = () => {
  // Implement login logic
  console.log('Login submitted:', loginForm)
}
</script>
