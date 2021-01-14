<!-- src/views/services/ECPFPage.vue -->
<template>
  <div class="min-h-screen bg-slate-50">
    <!-- Hero Section -->
    <div class="bg-slate-900 relative">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="text-center mt-20">
          <h1 class="text-3xl font-serif font-bold text-white sm:text-4xl lg:text-5xl">
            Professional Framework
          </h1>
          <p class="mt-4 text-xl text-slate-300 max-w-3xl mx-auto">
            Comprehensive certification process for educators and professionals in Bhutan.
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
          <div class="bg-white border-l-4 border-purple-600 rounded p-6 shadow-sm">
            <h2 class="text-xl font-serif font-bold text-slate-900 mb-4">
              Official Notice
            </h2>
            <p class="text-slate-600">
              This is the official portal for professional certification services provided by the Bhutan Qualifications &
              Professional Certification Authority (BQPCA). All certification and validation processes are conducted
              in accordance with the Royal Government of Bhutan's regulations.
            </p>
          </div>

          <!-- Process Overview -->
          <div class="bg-white rounded-lg shadow-sm">
            <div class="p-6 border-b border-slate-200">
              <h2 class="text-xl font-serif font-bold text-slate-900">Certification Process</h2>
            </div>
            <div class="p-6">
              <div class="space-y-6">
                <div class="flex items-start">
                  <div
                    class="flex-shrink-0 h-8 w-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-medium">
                    1
                  </div>
                  <div class="ml-4">
                    <h3 class="text-lg font-medium text-slate-900">Create Account</h3>
                    <p class="mt-2 text-slate-600">Register using your details or sign in with NDI</p>
                  </div>
                </div>

                <div class="flex items-start">
                  <div
                    class="flex-shrink-0 h-8 w-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-medium">
                    2
                  </div>
                  <div class="ml-4">
                    <h3 class="text-lg font-medium text-slate-900">Submit Documents</h3>
                    <p class="mt-2 text-slate-600">Upload your professional certificates and relevant documents</p>
                  </div>
                </div>

                <div class="flex items-start">
                  <div
                    class="flex-shrink-0 h-8 w-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-medium">
                    3
                  </div>
                  <div class="ml-4">
                    <h3 class="text-lg font-medium text-slate-900">Track Progress</h3>
                    <p class="mt-2 text-slate-600">Monitor your application status in real-time</p>
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
                  <Clock class="w-6 h-6 text-purple-600 mt-1" />
                  <div class="ml-4">
                    <h3 class="font-medium text-slate-900">Processing Time</h3>
                    <p class="text-slate-600">Standard processing time is 7-10 working days</p>
                  </div>
                </div>
                <div class="flex items-start">
                  <FileText class="w-6 h-6 text-purple-600 mt-1" />
                  <div class="ml-4">
                    <h3 class="font-medium text-slate-900">Required Documents</h3>
                    <p class="text-slate-600">Professional certificates, transcripts, and valid identification</p>
                  </div>
                </div>
                <div class="flex items-start">
                  <ShieldCheck class="w-6 h-6 text-purple-600 mt-1" />
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
          <AuthSection :serviceType="serviceType" @ndi-login="handleNDILogin" @form-login="handleFormLogin" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Clock, FileText, ShieldCheck } from 'lucide-vue-next'
import AuthSection from '@/components/common/AuthSection.vue'

const serviceType = ref('ecpf')

const handleNDILogin = () => {
  // Implement NDI login logic
  console.log('NDI login clicked')
}

const handleFormLogin = (formData) => {
  // Implement login logic
  console.log('Login submitted:', formData)
}
</script>
