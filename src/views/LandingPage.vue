<!-- src/views/LandingPage.vue -->
<template>
  <div class="min-h-screen bg-slate-50">
    <Header />

    <!-- Hero Section -->
    <div class="relative bg-gradient-to-r from-slate-900 to-slate-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div class="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
          <div class="text-white">
            <h1 class="text-4xl font-serif font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Bhutan Qualifications & Professional Certification Authority
            </h1>
            <p class="mt-6 text-lg text-slate-300">
              Upholding excellence in education and professional standards through rigorous certification and accreditation processes.
            </p>
            <div class="mt-8 flex flex-col sm:flex-row gap-4">
              <a href="#services"
                class="inline-flex items-center px-6 py-3 bg-white text-slate-900 rounded hover:bg-slate-100 transition-colors">
                View Our Services
                <ChevronRight class="ml-2 h-5 w-5" />
              </a>
              <a href="#contact"
                class="inline-flex items-center px-6 py-3 border border-white text-white rounded hover:bg-white/10 transition-colors">
                Contact Us
              </a>
            </div>
          </div>
          <div class="mt-12 lg:mt-0 relative">
            <div class="bg-white rounded-lg p-8 shadow-xl">
              <div class="grid grid-cols-2 gap-6">
                <div v-for="stat in stats" :key="stat.label"
                  class="p-4 bg-slate-50 rounded-lg text-center">
                  <p class="text-2xl font-bold text-slate-900">{{ stat.value }}</p>
                  <p class="text-sm text-slate-600">{{ stat.label }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Services Section -->
    <div id="services" class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl font-serif font-bold text-slate-900">Professional Services</h2>
          <div class="w-20 h-1 bg-blue-600 mx-auto mt-4"></div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="service in services" :key="service.name"
            class="group bg-white border border-slate-200 rounded-lg hover:shadow-lg transition-shadow duration-300">
            <div class="p-8">
              <div class="flex items-center mb-6">
                <component :is="service.icon"
                  class="w-8 h-8 text-blue-600" />
                <h3 class="text-xl font-semibold text-slate-900 ml-4">
                  {{ service.name }}
                </h3>
              </div>
              <p class="text-slate-600 mb-6 min-h-[80px]">
                {{ service.description }}
              </p>
              <router-link :to="service.route"
                class="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium">
                Learn More
                <ArrowRight class="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Admin Access Section -->
    <div class="bg-slate-100 py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="bg-white rounded-xl shadow-lg p-8">
          <div class="text-center">
            <h2 class="text-2xl font-serif font-bold text-slate-900 mb-6">
              Secure Administrative Access
            </h2>
            <div class="flex flex-col sm:flex-row justify-center gap-4">
              <router-link to="/admin/login"
                class="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                BQPCA Admin Portal
                <LockIcon class="ml-2 h-5 w-5" />
              </router-link>
              <router-link to="/super-admin/login"
                class="inline-flex items-center px-6 py-3 bg-slate-800 text-white rounded hover:bg-slate-900 transition-colors">
                Super Admin Portal
                <ShieldIcon class="ml-2 h-5 w-5" />
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Contact Section -->
    <div id="contact" class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl font-serif font-bold text-slate-900">Contact Information</h2>
          <div class="w-20 h-1 bg-blue-600 mx-auto mt-4"></div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div v-for="contact in contacts" :key="contact.title"
            class="bg-slate-50 rounded-lg p-8 border border-slate-200">
            <div class="flex items-center mb-4">
              <component :is="contact.icon"
                class="w-6 h-6 text-blue-600" />
              <h3 class="text-lg font-semibold text-slate-900 ml-3">
                {{ contact.title }}
              </h3>
            </div>
            <p class="text-slate-600">{{ contact.info }}</p>
          </div>
        </div>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import {
  ChevronRight,
  ArrowRight,
  MapPin,
  Mail,
  Phone,
  Lock as LockIcon,
  Shield as ShieldIcon,
  GraduationCap,
  Award,
  Building2,
  BookOpen,
  Users
} from 'lucide-vue-next'
import Header from '@/components/common/Header.vue'
import Footer from '@/components/common/Footer.vue'

const services = [
  {
    name: "Qualification Recognition",
    description: "Official verification and recognition of educational qualifications through our standardized system.",
    icon: GraduationCap,
    route: "/roq"
  },
  {
    name: "Professional Certification",
    description: "Comprehensive certification framework for educators and professionals in Bhutan.",
    icon: Award,
    route: "/ecpf"
  },
  {
    name: "Institution Accreditation",
    description: "Systematic evaluation and accreditation of educational institutions.",
    icon: Building2,
    route: "/accreditation"
  },
  {
    name: "Engineering Standards",
    description: "Professional certification and validation for engineering practitioners.",
    icon: BookOpen,
    route: "/engineering"
  },
  {
    name: "Medical Certification",
    description: "Official registration and certification for healthcare professionals.",
    icon: Users,
    route: "/bmhc"
  }
]

const stats = [
  { label: "Certified Professionals", value: "10,000+" },
  { label: "Accredited Institutions", value: "100+" },
  { label: "Certification Rate", value: "98%" },
  { label: "Processing Efficiency", value: "95%" }
]

const contacts = [
  {
    title: "Official Address",
    info: "BQPCA Headquarters, Thimphu, Bhutan",
    icon: MapPin
  },
  {
    title: "Email Contact",
    info: "contact@bqpca.gov.bt",
    icon: Mail
  },
  {
    title: "Phone Number",
    info: "+975 XXXXXXX",
    icon: Phone
  }
]
</script>
