<!-- src/components/common/Footer.vue -->
<template>
  <footer class="bg-gray-900 text-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- Logo and Description -->
        <div class="col-span-1 md:col-span-2">
          <router-link to="/" class="flex items-center group">
            <div class="relative h-14 w-14 mr-3">
              <img src="@/assets/rgob.png" alt="BQPCA Crest"
                class="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105" />
            </div>
            <div class="flex flex-col">
              <span class="text-sm font-dzongkha leading-tight text-gray-300">
                འབྲུག་ཤེས་ཚད་དང་ཁྱད་རིག་ངོ་སྦྱོར་དབང་འཛིན།
              </span>
              <span class="text-xs font-medium tracking-wide text-gray-400">
                Bhutan Qualifications and Professionals Certification Authority
              </span>
            </div>
          </router-link>
          <p class="mt-4 text-gray-400 max-w-md">
            Ensuring quality and standards in education and professional certification.
          </p>
        </div>

        <!-- Rest of the footer content remains the same -->
        <!-- Quick Links -->
        <div>
          <h3 class="text-sm font-semibold text-gray-300 uppercase tracking-wider">Services</h3>
          <ul class="mt-4 space-y-2">
            <li v-for="service in services" :key="service.name">
              <router-link :to="service.route" class="text-gray-400 hover:text-white transition-colors duration-200">
                {{ service.name }}
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Contact Info -->
        <div>
          <h3 class="text-sm font-semibold text-gray-300 uppercase tracking-wider">Contact</h3>
          <ul class="mt-4 space-y-2">
            <li class="flex items-center text-gray-400">
              <MapPin class="h-5 w-5 mr-2" />
              Thimphu, Bhutan
            </li>
            <li class="flex items-center text-gray-400">
              <Mail class="h-5 w-5 mr-2" />
              contact@bqpca.gov.bt
            </li>
            <li class="flex items-center text-gray-400">
              <Phone class="h-5 w-5 mr-2" />
              +975 XXXXXXX
            </li>
          </ul>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="mt-12 pt-8 border-t border-gray-800">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <p class="text-gray-400 text-sm">
            © {{ currentYear }} BQPCA. All rights reserved.
          </p>
          <div class="flex space-x-6 mt-4 md:mt-0">
            <a href="#" class="text-gray-400 hover:text-white">
              <Facebook class="h-5 w-5" />
            </a>
            <a href="#" class="text-gray-400 hover:text-white">
              <Twitter class="h-5 w-5" />
            </a>
            <a href="#" class="text-gray-400 hover:text-white">
              <Instagram class="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { MapPin, Mail, Phone, Facebook, Twitter, Instagram } from 'lucide-vue-next'
import { ref } from 'vue'

// Get the current year dynamically
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
