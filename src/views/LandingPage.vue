<!-- src/views/LandingPage.vue -->
<template>
  <div class="min-h-screen bg-slate-50">
    <!-- Hero Section with Animated Background -->
    <div class="relative bg-gradient-to-r from-slate-900 to-slate-800 overflow-hidden mt-20">
      <!-- Decorative circles -->
      <div class="absolute inset-0">
        <div class="absolute -top-20 -right-20 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl"></div>
        <div class="absolute -bottom-32 -left-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative">
        <div class="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
          <!-- Hero Content -->
          <div class="col-span-6 text-white">
            <div class="space-y-2 mb-6">
              <div class="inline-flex items-center px-3 py-1 rounded-full border border-blue-400/30 bg-blue-400/10 text-blue-200">
                <span class="text-sm">Official Government Authority</span>
              </div>
            </div>
            <h1 class="text-4xl font-serif font-bold tracking-tight sm:text-5xl lg:text-6xl mb-6">
              <span class="block">Bhutan Qualifications &amp;</span>
              <span class="block text-blue-400">Professional Certification</span>
              <span class="block">Authority</span>
            </h1>
            <p class="mt-6 text-lg text-slate-300 leading-relaxed max-w-2xl">
              Upholding excellence in education and professional standards through rigorous certification and
              accreditation processes.
            </p>
            <div class="mt-10 flex flex-col sm:flex-row gap-4">
              <a href="#services"
                class="group inline-flex items-center px-6 py-3 bg-white text-slate-900 rounded-lg hover:bg-slate-100 transition-all shadow-lg hover:shadow-xl">
                <span>View Our Services</span>
                <ChevronRight class="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
              </a>
              <a href="#contact"
                class="inline-flex items-center px-6 py-3 border-2 border-white text-white rounded-lg hover:bg-white/10 transition-colors">
                Contact Us
              </a>
            </div>
          </div>

          <!-- Stats Grid -->
          <div class="col-span-6 mt-12 lg:mt-0">
            <div class="bg-white/5 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/10">
              <div class="grid grid-cols-2 gap-6">
                <div v-for="stat in stats" :key="stat.label"
                     class="p-6 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20">
                  <p class="text-3xl font-bold text-white mb-1">{{ stat.value }}</p>
                  <p class="text-sm text-slate-300">{{ stat.label }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Scroll Indicator -->
        <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <a href="#services" class="animate-bounce flex flex-col items-center text-white/60 hover:text-white/80">
            <ArrowDownCircle class="h-6 w-6" />
            <span class="text-sm mt-2">Explore More</span>
          </a>
        </div>
      </div>
    </div>

    <!-- Services Section -->
    <div id="services" class="py-24 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-20">
          <h2 class="text-3xl font-serif font-bold text-slate-900">Professional Services</h2>
          <div class="w-20 h-1 bg-blue-600 mx-auto mt-4"></div>
          <p class="mt-6 text-lg text-slate-600 max-w-2xl mx-auto">
            Comprehensive certification and accreditation services for professionals and institutions across Bhutan.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="service in services" :key="service.name"
            class="group relative bg-white rounded-xl hover:shadow-xl transition-all duration-300 border border-slate-200 overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div class="p-8 relative">
              <div class="flex items-center mb-6">
                <div class="p-3 rounded-lg bg-blue-50 group-hover:bg-blue-100 transition-colors">
                  <component :is="service.icon" class="w-8 h-8 text-blue-600" />
                </div>
                <h3 class="text-xl font-semibold text-slate-900 ml-4">
                  {{ service.name }}
                </h3>
              </div>
              <p class="text-slate-600 mb-6 min-h-[80px] leading-relaxed">
                {{ service.description }}
              </p>
              <router-link :to="service.route"
                class="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium group">
                Learn More
                <ArrowRight class="ml-2 w-4 h-4 transition-transform group-hover:translate-x-2" />
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Admin Access Section -->
    <div id="about" class="bg-slate-100 py-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="bg-white rounded-2xl shadow-xl p-12 relative overflow-hidden">
          <!-- Decorative elements -->
          <div class="absolute inset-0">
            <div class="absolute top-0 right-0 w-40 h-40 bg-blue-50 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div class="absolute bottom-0 left-0 w-40 h-40 bg-slate-50 rounded-full translate-y-1/2 -translate-x-1/2"></div>
          </div>

          <div class="text-center relative">
            <h2 class="text-2xl font-serif font-bold text-slate-900 mb-8">
              Secure Administrative Access
            </h2>
            <div class="flex flex-col sm:flex-row justify-center gap-6">
              <router-link to="/admin/login"
                class="group inline-flex items-center px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl">
                <span>BQPCA Admin Portal</span>
                <LockIcon class="ml-3 h-5 w-5 transition-transform group-hover:rotate-12" />
              </router-link>
              <router-link to="/super-admin/login"
                class="group inline-flex items-center px-8 py-4 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-colors shadow-lg hover:shadow-xl">
                <span>Super Admin Portal</span>
                <ShieldIcon class="ml-3 h-5 w-5 transition-transform group-hover:rotate-12" />
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Contact Section -->
    <div id="contact" class="py-24 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-20">
          <h2 class="text-3xl font-serif font-bold text-slate-900">Contact Information</h2>
          <div class="w-20 h-1 bg-blue-600 mx-auto mt-4"></div>
          <p class="mt-6 text-lg text-slate-600 max-w-2xl mx-auto">
            Get in touch with us for any inquiries about our certification and accreditation services.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div v-for="contact in contacts" :key="contact.title"
            class="group bg-slate-50 rounded-xl p-8 border border-slate-200 hover:border-blue-200 transition-all hover:shadow-lg">
            <div class="flex flex-col items-center text-center">
              <div class="p-4 rounded-full bg-white shadow-md mb-6 group-hover:shadow-xl transition-all">
                <component :is="contact.icon" class="w-6 h-6 text-blue-600" />
              </div>
              <h3 class="text-lg font-semibold text-slate-900 mb-3">
                {{ contact.title }}
              </h3>
              <p class="text-slate-600">{{ contact.info }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
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
  Users,
  ArrowDownCircle
} from 'lucide-vue-next'

const services = [
  {
    name: "Recognition of Qualification",
    description: "Official verification and recognition of educational qualifications through our standardized system.",
    icon: GraduationCap,
    route: "/roq"
  },
  {
    name: "Education Consultancy & Placement Firms (ECPF)",
    description: "Comprehensive certification framework for educators and professionals in Bhutan.",
    icon: Award,
    route: "/ecpf"
  },
  {
    name: "Accreditation",
    description: "Systematic evaluation and accreditation of educational institutions.",
    icon: Building2,
    route: "/accreditation"
  },
  {
    name: "Engineering Certification",
    description: "Professional certification and validation for engineering practitioners.",
    icon: BookOpen,
    route: "/engineering"
  },
  {
    name: "Bhutan Medical & Health Certification (BMHC)",
    description: "Official registration and certification for healthcare professionals.",
    icon: Users,
    route: "/bmhc"
  }
];

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
