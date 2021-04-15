<!-- src/views/services/RoQPage.vue -->
<template>
  <div class="min-h-screen bg-slate-50 pb-12">
    <!-- Hero Section -->
    <div class="bg-gradient-to-r from-slate-900 to-slate-800 relative overflow-hidden mt-10">
      <!-- Decorative elements -->
      <div class="absolute inset-0">
        <div class="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
        <div class="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative">
        <div class="text-center">
          <div
            class="inline-flex items-center px-3 py-1 rounded-full border border-blue-400/30 bg-blue-400/10 text-blue-200 mb-6"
          >
            <BookOpen class="w-4 h-4 mr-2" />
            <span class="text-sm">Official Verification Service</span>
          </div>
          <h1 class="text-3xl font-serif font-bold text-white sm:text-4xl lg:text-5xl">
            Recognition of Qualifications
          </h1>
          <p class="mt-6 text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Official verification and recognition of educational qualifications by the Royal
            Government of Bhutan
          </p>
        </div>
      </div>

      <!-- Decorative wave shape -->
      <div class="absolute bottom-0 left-0 right-0">
        <svg class="w-full h-8 fill-slate-50" viewBox="0 0 1440 48" preserveAspectRatio="none">
          <path
            d="M0 48h1440V0c-283.146 39.154-566.281 48-849.405 48C307.47 48 153.735 32 0 0v48z"
          />
        </svg>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Information Section -->
        <div class="lg:col-span-2 space-y-8">
          <!-- Official Notice -->
          <div class="bg-white border-l-4 border-blue-600 rounded-xl p-8 shadow-lg">
            <div class="flex items-start">
              <div class="p-3 rounded-lg bg-blue-50">
                <CircleAlert class="w-6 h-6 text-blue-600" />
              </div>
              <div class="ml-4">
                <h2 class="text-xl font-serif font-bold text-slate-900 mb-4">Official Notice</h2>
                <p class="text-slate-600 leading-relaxed">
                  This is the official portal for qualification recognition services provided by the
                  Bhutan Qualifications & Professional Certification Authority (BQPCA). All
                  certification and verification processes are conducted in accordance with the
                  Royal Government of Bhutan's regulations.
                </p>
              </div>
            </div>
          </div>

          <!-- Process Overview -->
          <div class="bg-white rounded-xl shadow-lg overflow-hidden">
            <div class="p-8 border-b border-slate-200">
              <div class="flex items-center">
                <div class="p-3 rounded-lg bg-blue-50">
                  <ListChecks class="w-6 h-6 text-blue-600" />
                </div>
                <h2 class="text-xl font-serif font-bold text-slate-900 ml-4">
                  Verification Process
                </h2>
              </div>
            </div>
            <div class="p-8">
              <div class="space-y-8">
                <div
                  v-for="(step, index) in verificationSteps"
                  :key="step.title"
                  class="flex items-start group"
                >
                  <div class="relative">
                    <div
                      class="flex-shrink-0 h-10 w-10 rounded-full bg-blue-600 group-hover:bg-blue-700 transition-colors text-white flex items-center justify-center font-medium"
                    >
                      {{ index + 1 }}
                    </div>
                    <!-- Connection line -->
                    <div
                      v-if="index < verificationSteps.length - 1"
                      class="absolute top-10 left-1/2 bottom-0 w-px bg-blue-200 transform -translate-x-1/2 h-full"
                    ></div>
                  </div>
                  <div class="ml-6">
                    <h3
                      class="text-lg font-medium text-slate-900 group-hover:text-blue-600 transition-colors"
                    >
                      {{ step.title }}
                    </h3>
                    <p class="mt-2 text-slate-600 leading-relaxed">{{ step.description }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Important Information -->
          <div class="bg-white rounded-xl shadow-lg overflow-hidden">
            <div class="p-8 border-b border-slate-200">
              <div class="flex items-center">
                <div class="p-3 rounded-lg bg-blue-50">
                  <InfoIcon class="w-6 h-6 text-blue-600" />
                </div>
                <h2 class="text-xl font-serif font-bold text-slate-900 ml-4">
                  Important Information
                </h2>
              </div>
            </div>
            <div class="p-8">
              <div class="grid md:grid-cols-3 gap-8">
                <div
                  v-for="info in importantInfo"
                  :key="info.title"
                  class="group bg-slate-50 rounded-xl p-6 hover:bg-blue-50 transition-colors"
                >
                  <div class="flex items-start">
                    <component
                      :is="info.icon"
                      class="w-6 h-6 text-blue-600 mt-1 group-hover:scale-110 transition-transform"
                    />
                    <div class="ml-4">
                      <h3 class="font-medium text-slate-900">{{ info.title }}</h3>
                      <p class="mt-2 text-slate-600">{{ info.description }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Authentication Section -->
        <div class="lg:sticky lg:top-8 self-start">
          <AuthSection
            :serviceType="serviceType"
            @ndi-login="handleNDILogin"
            @form-login="handleFormLogin"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import {
  Clock,
  FileText,
  ShieldCheck,
  BookOpen,
  CircleAlert,
  ListChecks,
  Info as InfoIcon,
} from 'lucide-vue-next'
import AuthSection from '@/components/common/AuthSection.vue'

const serviceType = ref('roq')

const verificationSteps = [
  {
    title: 'Identity Verification',
    description:
      'Authenticate using your National Digital Identity (NDI) or create an account with your citizenship details',
  },
  {
    title: 'Document Submission',
    description:
      'Submit digital copies of your educational certificates and supporting documentation',
  },
  {
    title: 'Verification',
    description: 'Your documents will be verified through our official channels',
  },
  {
    title: 'Certification',
    description: 'Receive your official verification certificate with digital signature',
  },
]

const importantInfo = [
  {
    title: 'Processing Time',
    description: 'Standard processing time is 5-7 working days',
    icon: Clock,
  },
  {
    title: 'Required Documents',
    description: 'Original certificates, transcripts, and valid identification',
    icon: FileText,
  },
  {
    title: 'Security',
    description: 'All documents are processed through secure government channels',
    icon: ShieldCheck,
  },
]

const handleNDILogin = () => {
  console.log('NDI login clicked')
}

const handleFormLogin = (formData) => {
  console.log('Login submitted:', formData)
}
</script>
