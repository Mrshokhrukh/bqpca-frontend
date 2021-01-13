<template>
  <header class="fixed w-full top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-20">
        <div class="flex items-center">
          <!-- Logo and Text -->
          <router-link to="/" class="flex items-center group">
            <div class="relative h-14 w-14 mr-3">
              <img src="@/assets/rgob.png" alt="BQPCA Crest"
                class="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105" />
            </div>
            <div class="flex flex-col">
              <span class="text-sm font-dzongkha leading-tight text-gray-900">
                འབྲུག་ཤེས་ཚད་དང་ཁྱད་རིག་ངོ་སྦྱོར་དབང་འཛིན།
              </span>
              <span class="text-xs font-medium tracking-wide text-gray-700">
                Bhutan Qualifications and Professionals Certification Authority
              </span>
            </div>
          </router-link>
        </div>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-8">
          <router-link v-for="item in navItems" :key="item.name" :to="item.route"
            class="relative text-gray-600 hover:text-primary transition-colors duration-200 group py-2">
            {{ item.name }}
            <span
              class="absolute bottom-0 left-0 w-full h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
          </router-link>
        </div>

        <!-- Login Button -->
        <div class="flex items-center space-x-4">
          <router-link to="/admin/login"
            class="hidden md:inline-flex items-center text-sm px-5 py-2.5 border border-primary/20 rounded-lg text-primary hover:bg-primary/5 hover:border-primary transition-all duration-200 font-medium">
            <UserCircle class="w-4 h-4 mr-2" />
            Admin Login
          </router-link>
          <button @click="isMenuOpen = !isMenuOpen"
            class="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200">
            <Menu v-if="!isMenuOpen" class="h-6 w-6" />
            <X v-else class="h-6 w-6" />
          </button>
        </div>
      </div>
    </nav>

    <!-- Mobile Menu -->
    <div v-show="isMenuOpen" class="md:hidden absolute w-full bg-white border-b border-gray-100 shadow-lg">
      <div class="max-w-7xl mx-auto px-4 pt-2 pb-3 space-y-1">
        <a v-for="item in navItems" :key="item.name" :href="item.route"
          class="block px-4 py-2.5 rounded-lg text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50 transition-colors duration-200">
          {{ item.name }}
        </a>
        <router-link to="/admin/login"
          class="flex items-center px-4 py-2.5 rounded-lg text-base font-medium text-primary hover:bg-primary/5 transition-colors duration-200">
          <UserCircle class="w-5 h-5 mr-2" />
          Admin Login
        </router-link>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { Menu, X, UserCircle } from 'lucide-vue-next'

const isMenuOpen = ref(false)

const navItems = [
  { name: 'Home', route: '/' },
  { name: 'Services', route: '#services' },
  { name: 'About', route: '#about' },
  { name: 'Contact', route: '#contact' }
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
