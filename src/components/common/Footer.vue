<!-- src/components/common/Footer.vue -->
<template>
  <footer class="bg-gradient-to-b from-gray-900 to-slate-900 text-white relative overflow-hidden">
    <!-- Decorative elements -->
    <div class="absolute inset-0">
      <div class="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
      <div class="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
    </div>

    <!-- Main footer content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-16">
        <!-- Logo and Description -->
        <div class="col-span-1 md:col-span-2">
          <router-link to="/" class="flex items-center group">
            <div class="relative h-16 w-16 mr-4">
              <div class="absolute inset-0 bg-blue-500/20 rounded-full blur-sm group-hover:blur-md transition-all"></div>
              <img src="@/assets/rgob.png" alt="BQPCA Crest"
                class="h-full w-full object-contain relative transition-transform duration-300 group-hover:scale-105" />
            </div>
            <div class="flex flex-col">
              <span class="text-lg font-dzongkha leading-tight text-gray-200">
                འབྲུག་ཤེས་ཚད་དང་ཁྱད་རིག་ངོ་སྦྱོར་དབང་འཛིན།
              </span>
              <span class="text-sm font-medium tracking-wide text-gray-400 mt-1">
                Bhutan Qualifications and Professionals Certification Authority
              </span>
            </div>
          </router-link>
          <p class="mt-6 text-gray-400 max-w-md leading-relaxed">
            Ensuring quality and standards in education and professional certification through rigorous evaluation and
            verification processes aligned with international standards.
          </p>

          <!-- Mission statement -->
          <div class="mt-8 p-4 bg-gradient-to-r from-gray-800 to-gray-800/50 rounded-lg border border-gray-700">
            <div class="flex items-center mb-2">
              <Award class="h-5 w-5 text-blue-400 mr-2" />
              <span class="text-sm font-semibold text-gray-300">Our Mission</span>
            </div>
            <p class="text-sm text-gray-400">
              To uphold and advance the quality of professional standards in Bhutan through comprehensive certification
              and verification processes.
            </p>
          </div>
        </div>

        <!-- Quick Links -->
        <div>
          <h3 class="text-sm font-semibold text-gray-200 uppercase tracking-wider flex items-center">
            <Navigation class="h-4 w-4 mr-2 text-blue-400" />
            Services
          </h3>
          <ul class="mt-4 space-y-3">
            <li v-for="service in services" :key="service.name">
              <router-link :to="service.route"
                class="group flex items-center text-gray-400 hover:text-white transition-colors duration-200">
                <ChevronRight class="h-4 w-4 mr-2 text-gray-600 group-hover:text-blue-400 transition-colors" />
                <span>{{ service.name }}</span>
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Contact Info -->
        <div>
          <h3 class="text-sm font-semibold text-gray-200 uppercase tracking-wider flex items-center">
            <PhoneCall class="h-4 w-4 mr-2 text-blue-400" />
            Contact
          </h3>
          <ul class="mt-4 space-y-4">
            <li class="group">
              <a href="https://maps.google.com" target="_blank"
                class="flex items-center text-gray-400 hover:text-white transition-colors duration-200">
                <div class="p-2 bg-gray-800 rounded group-hover:bg-gray-700 transition-colors">
                  <MapPin class="h-4 w-4 text-blue-400" />
                </div>
                <span class="ml-3">Thimphu, Bhutan</span>
              </a>
            </li>
            <li class="group">
              <a href="mailto:contact@bqpca.gov.bt"
                class="flex items-center text-gray-400 hover:text-white transition-colors duration-200">
                <div class="p-2 bg-gray-800 rounded group-hover:bg-gray-700 transition-colors">
                  <Mail class="h-4 w-4 text-blue-400" />
                </div>
                <span class="ml-3">contact@bqpca.gov.bt</span>
              </a>
            </li>
            <li class="group">
              <a href="tel:+975XXXXXXX"
                class="flex items-center text-gray-400 hover:text-white transition-colors duration-200">
                <div class="p-2 bg-gray-800 rounded group-hover:bg-gray-700 transition-colors">
                  <Phone class="h-4 w-4 text-blue-400" />
                </div>
                <span class="ml-3">+975 XXXXXXX</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="mt-16 pt-8 border-t border-gray-800">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <div class="flex items-center space-x-2 text-gray-400 text-sm">
            <Shield class="h-4 w-4 text-blue-400" />
            <p>© {{ currentYear }} BQPCA. All rights reserved.</p>
          </div>
          <div class="flex items-center space-x-6 mt-4 md:mt-0">
            <a href="#" class="group">
              <div class="p-2 bg-gray-800 rounded-lg group-hover:bg-gray-700 transition-colors">
                <Facebook class="h-5 w-5 text-gray-400 group-hover:text-blue-400 transition-colors" />
              </div>
            </a>
            <a href="#" class="group">
              <div class="p-2 bg-gray-800 rounded-lg group-hover:bg-gray-700 transition-colors">
                <Twitter class="h-5 w-5 text-gray-400 group-hover:text-blue-400 transition-colors" />
              </div>
            </a>
            <a href="#" class="group">
              <div class="p-2 bg-gray-800 rounded-lg group-hover:bg-gray-700 transition-colors">
                <Instagram class="h-5 w-5 text-gray-400 group-hover:text-blue-400 transition-colors" />
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import {
  MapPin,
  Mail,
  Phone,
  Facebook,
  Twitter,
  Instagram,
  Award,
  Navigation,
  PhoneCall,
  Shield,
  ChevronRight
} from 'lucide-vue-next'
import { ref } from 'vue'

const currentYear = ref(new Date().getFullYear())

const services = [
  { name: 'Recognition of Qualifications', route: '/roq' },
  { name: 'Professional Framework', route: '/ecpf' },
  { name: 'Accreditation', route: '/accreditation' },
  { name: 'Engineering Certification', route: '/engineering' },
  { name: 'Medical & Health Council', route: '/bmhc' }
]
</script>

<style scoped>
@font-face {
  font-family: 'Dzongkha';
  src: url('@/assets/fonts/dzongkha.woff2') format('woff2');
}

.font-dzongkha {
  font-family: 'Dzongkha', sans-serif;
}
</style>
