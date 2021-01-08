<!-- src/components/common/Header.vue -->
<template>
  <header class="fixed w-full top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm">
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <div class="flex items-center">
          <!-- Logo -->
          <router-link to="/" class="flex items-center space-x-2">
            <img src="@/assets/logo.svg" alt="BQPCA Logo" class="h-8 w-auto" />
            <span class="text-lg font-semibold text-gray-900">BQPCA</span>
          </router-link>
        </div>

        <!-- Navigation -->
        <div class="hidden md:flex items-center space-x-8">
          <router-link v-for="item in navItems" :key="item.name" :to="item.route"
            class="text-gray-600 hover:text-primary transition-colors duration-200">
            {{ item.name }}
          </router-link>
        </div>

        <!-- Login Buttons -->
        <div class="flex items-center space-x-4">
          <router-link to="/admin/login"
            class="hidden md:inline-flex text-sm px-4 py-2 border border-transparent rounded-md text-primary hover:bg-primary/5 transition-colors duration-200">
            Admin Login
          </router-link>
          <button @click="isMenuOpen = !isMenuOpen"
            class="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100">
            <Menu v-if="!isMenuOpen" class="h-6 w-6" />
            <X v-else class="h-6 w-6" />
          </button>
        </div>
      </div>
    </nav>

    <!-- Mobile Menu -->
    <div v-show="isMenuOpen" class="md:hidden">
      <div class="pt-2 pb-3 space-y-1 px-4 bg-white shadow-lg">
        <router-link v-for="item in navItems" :key="item.name" :to="item.route"
          class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary hover:bg-gray-50">
          {{ item.name }}
        </router-link>
        <router-link to="/admin/login"
          class="block px-3 py-2 rounded-md text-base font-medium text-primary hover:bg-primary/5">
          Admin Login
        </router-link>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { Menu, X } from 'lucide-vue-next'

const isMenuOpen = ref(false)

const navItems = [
  { name: 'Home', route: '/' },
  { name: 'Services', route: '/#services' },
  { name: 'About', route: '/#about' },
  { name: 'Contact', route: '/#contact' }
]
</script>
