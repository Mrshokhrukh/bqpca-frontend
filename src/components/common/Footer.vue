<!-- src/components/common/Footer.vue -->
<template>
  <footer class="bg-gray-900 text-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- Logo and Description -->
        <div class="col-span-1 md:col-span-2">
          <div class="flex items-center space-x-2">
            <img src="#" alt="BQPCA Logo" class="h-8 w-auto" />
            <span class="text-lg font-semibold">BQPCA</span>
          </div>
          <p class="mt-4 text-gray-400 max-w-md">
            Bhutan Qualifications and Professionals Certification Authority - Ensuring quality and standards in
            education and professional certification.
          </p>
        </div>

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
            © 2024 BQPCA. All rights reserved.
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

const services = [
  { name: 'Recognition of Qualifications', route: '/roq' },
  { name: 'Professional Framework', route: '/ecpf' },
  { name: 'Accreditation', route: '/accreditation' },
  { name: 'Engineering Certification', route: '/engineering' },
  { name: 'Medical & Health Council', route: '/bmhc' }
]
</script>
