<!-- src/views/services/EngineeringPage.vue -->
<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Hero Section -->
    <div class="relative pt-20 pb-16 bg-gradient-to-br from-orange-500 to-orange-600">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="text-center text-white py-12">
          <h1 class="text-4xl font-bold sm:text-5xl">Engineering Certification</h1>
          <p class="mt-4 text-xl text-orange-100">
            Professional validation and certification for engineering professionals in Bhutan.
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
                <CheckCircle2 class="w-6 h-6 text-orange-500 mt-1 flex-shrink-0" />
                <div class="ml-4">
                  <h3 class="font-medium">Professional Validation</h3>
                  <p class="text-gray-600">Get certified for your engineering expertise</p>
                </div>
              </div>
              <div class="flex items-start">
                <ShieldCheck class="w-6 h-6 text-orange-500 mt-1 flex-shrink-0" />
                <div class="ml-4">
                  <h3 class="font-medium">Secure & Reliable</h3>
                  <p class="text-gray-600">Your credentials are handled securely</p>
                </div>
              </div>
              <div class="flex items-start">
                <Globe class="w-6 h-6 text-orange-500 mt-1 flex-shrink-0" />
                <div class="ml-4">
                  <h3 class="font-medium">National Recognition</h3>
                  <p class="text-gray-600">Get recognized across Bhutan</p>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl p-8 shadow-sm">
            <h2 class="text-2xl font-semibold text-gray-900 mb-4">How It Works</h2>
            <div class="space-y-6">
              <div class="flex">
                <div
                  class="flex-shrink-0 w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-semibold">
                  1</div>
                <div class="ml-4">
                  <h3 class="font-medium">Submit Application</h3>
                  <p class="text-gray-600">Complete the online application form</p>
                </div>
              </div>
              <div class="flex">
                <div
                  class="flex-shrink-0 w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-semibold">
                  2</div>
                <div class="ml-4">
                  <h3 class="font-medium">Document Review</h3>
                  <p class="text-gray-600">Our team reviews your documents</p>
                </div>
              </div>
              <div class="flex">
                <div
                  class="flex-shrink-0 w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-semibold">
                  3</div>
                <div class="ml-4">
                  <h3 class="font-medium">Get Certified</h3>
                  <p class="text-gray-600">Receive your engineering certification</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Auth Section -->
        <div class="lg:mt-8">
          <AuthSection />
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { CheckCircle2, ShieldCheck, Globe } from 'lucide-vue-next'
import AuthSection from '@/components/AuthSection.vue'
</script>
