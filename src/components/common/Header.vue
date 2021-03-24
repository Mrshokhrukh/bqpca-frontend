<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <header class="fixed w-full top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100"
    style="height: auto; max-height: 97px;">
    <!-- Top accent line -->
    <div class="h-1 bg-gradient-to-r from-primary/20 via-primary to-primary/20"></div>

    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-24">
        <div class="flex items-center">
          <!-- Logo and Text with enhanced animation -->
          <router-link to="/" class="flex items-center group">
            <div class="relative h-16 w-16 mr-4 overflow-hidden rounded-xl shadow-sm">
              <img src="@/assets/rgob.png" alt="BQPCA Crest"
                class="h-full w-full object-contain transform transition-all duration-500 group-hover:scale-110" />
              <div
                class="absolute inset-0 ring-1 ring-gray-200 rounded-xl group-hover:ring-primary/30 transition-colors duration-300">
              </div>
            </div>
            <div class="flex flex-col space-y-0.5">
              <span
                class="text-base font-dzongkha leading-tight text-gray-900 transition-transform duration-300 group-hover:translate-x-1">
                འབྲུག་ཤེས་ཚད་དང་ཁྱད་རིག་ངོ་སྦྱོར་དབང་འཛིན།
              </span>
              <span
                class="text-sm font-medium tracking-wide text-gray-700 transition-transform duration-300 group-hover:translate-x-1">
                Bhutan Qualifications and <br> Professionals Certification Authority
              </span>
            </div>
          </router-link>
        </div>

        <!-- Desktop Navigation with floating effect -->
        <div class="hidden md:flex items-center space-x-6">
          <router-link v-for="item in navItems" :key="item.name" :to="item.route"
            class="relative text-gray-600 hover:text-primary transition-all duration-300 group py-2 px-1">
            <span class="relative z-10">{{ item.name }}</span>
            <span
              class="absolute inset-0 bg-gray-50 rounded-lg scale-0 group-hover:scale-100 transition-transform duration-300 -z-0"></span>
            <span
              class="absolute bottom-0 left-0 w-full h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out origin-left"></span>
          </router-link>
        </div>

        <!-- Login Buttons with enhanced styling -->
        <div class="flex items-center space-x-4">
          <a href="#services" @click="scrollToServices"
            class="hidden md:inline-flex items-center text-sm px-6 py-3 border-2 border-primary/20 rounded-xl text-primary hover:bg-primary/5 hover:border-primary hover:shadow-md transition-all duration-300 font-medium group">
            <User class="w-4 h-4 mr-2 transition-transform duration-300 group-hover:scale-110" />
            <span class="transition-transform duration-300 group-hover:translate-x-0.5">User Login</span>
          </a>
          <router-link to="/admin/login"
            class="hidden md:inline-flex items-center text-sm px-6 py-3 border-2 border-primary/20 rounded-xl text-primary hover:bg-primary/5 hover:border-primary hover:shadow-md transition-all duration-300 font-medium group">
            <UserCircle class="w-4 h-4 mr-2 transition-transform duration-300 group-hover:scale-110" />
            <span class="transition-transform duration-300 group-hover:translate-x-0.5">Admin Login</span>
          </router-link>
          <button @click="isMenuOpen = !isMenuOpen"
            class="md:hidden p-2.5 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all duration-300 hover:shadow-sm">
            <Menu v-if="!isMenuOpen" class="h-6 w-6" />
            <X v-else class="h-6 w-6" />
          </button>
        </div>
      </div>
    </nav>

    <!-- Enhanced Mobile Menu with controlled height -->
    <div v-show="isMenuOpen"
      class="md:hidden absolute w-full bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-lg"
      style="max-height: 80vh; overflow-y: auto;">
      <div class="max-w-7xl mx-auto px-4 pt-3 pb-4 space-y-1.5">
        <a v-for="item in navItems" :key="item.name" :href="item.route"
          class="block px-5 py-3 rounded-xl text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50/80 transition-all duration-300">
          {{ item.name }}
        </a>
        <router-link to="/#services" @click="navigateToServices"
          class="flex items-center px-5 py-3 rounded-xl text-base font-medium text-primary hover:bg-primary/5 transition-all duration-300 mt-4 border-t border-gray-100 pt-4">
          <User class="w-5 h-5 mr-2.5" />
          User Login
        </router-link>
        <router-link to="/admin/login"
          class="flex items-center px-5 py-3 rounded-xl text-base font-medium text-primary hover:bg-primary/5 transition-all duration-300">
          <UserCircle class="w-5 h-5 mr-2.5" />
          Admin Login
        </router-link>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { Menu, X, UserCircle, User } from 'lucide-vue-next'

const isMenuOpen = ref(false)

const navItems = [
  { name: 'Home', route: '/' },
  { name: 'Services', route: '#services' },
  { name: 'About', route: '#about' },
  { name: 'Contact', route: '#contact' },
  { name: 'Verification', route: '#certificate-verification' },
]

// Navigation and scroll function
const navigateToServices = () => {
  if (window.location.pathname !== '/') {
    window.location.href = '/#services'
  } else {
    const servicesSection = document.querySelector('#services')
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: 'smooth' })
    }
  }
  isMenuOpen.value = false // Close mobile menu if open
}

// Add a function for the missing scrollToServices method
const scrollToServices = (event) => {
  event.preventDefault()
  navigateToServices()
}

// Close menu when resizing to desktop
const handleResize = () => {
  if (window.innerWidth >= 768 && isMenuOpen.value) {
    isMenuOpen.value = false
  }
}

// Add event listeners for resize
onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
@font-face {
  font-family: 'Dzongkha';
  src: url('@/assets/fonts/dzongkha.woff2') format('woff2');
}

.font-dzongkha {
  font-family: 'Dzongkha', sans-serif;
}

html {
  scroll-behavior: smooth;
}

/* Fixed height ensure for the header */
header {
  min-height: 97px !important;
  height: auto !important;
  max-height: unset !important;
}

/* Ensure the mobile menu doesn't affect header height */
header>div[v-show="isMenuOpen"] {
  top: 97px;
}
</style>