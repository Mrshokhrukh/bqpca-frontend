<template>
  <div
    class="w-72 bg-gradient-to-b from-slate-800 to-slate-900 text-white transition-all duration-300 flex flex-col relative shadow-xl shadow-slate-900/50"
    :class="{ '-ml-72': !sidebarOpen, 'rounded-tr-3xl': sidebarOpen }"
  >
    <!-- Logo Section -->
    <div class="flex items-center justify-between p-5 border-b border-slate-700/50">
      <router-link to="/" class="flex items-center space-x-3 group">
        <div
          class="relative h-9 w-9 rounded-full overflow-hidden bg-gradient-to-br from-primary via-purple-500 to-pink-500 p-[2px] transition-all duration-300 group-hover:scale-105"
        >
          <img
            src="@/assets/rgob.png"
            alt="BQPCA Logo"
            class="h-full w-full object-contain rounded-full"
          />
        </div>
        <span
          class="font-semibold text-lg tracking-wide text-slate-100 group-hover:text-primary transition-colors"
          >BQPCA Admin</span
        >
      </router-link>
      <button
        @click="toggleSidebar"
        class="lg:hidden p-2 hover:bg-slate-700/50 rounded-full transition-colors"
      >
        <XIcon class="h-5 w-5 stroke-slate-400 hover:stroke-white" />
      </button>
    </div>

    <!-- Navigation Menu -->
    <div class="flex-1 overflow-y-auto custom-scrollbar p-4">
      <nav class="space-y-1.5">
        <template v-for="item in filteredNavigationItems" :key="item.name">
          <!-- Single Item Without Children -->
          <div v-if="!item.children">
            <router-link :to="item.route" v-slot="{ isActive, navigate }" custom>
              <div
                @click="navigate"
                class="flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 cursor-pointer group"
                :class="[
                  isActive
                    ? 'bg-gradient-to-r from-primary to-purple-600 text-white shadow-lg shadow-primary/30'
                    : 'text-slate-300 hover:bg-slate-700/50 hover:text-white  hover:scale-[1.02] transform',
                ]"
              >
                <component
                  :is="item.icon"
                  class="h-5 w-5 mr-3 transition-colors"
                  :class="{
                    'text-primary group-hover:text-white': !isActive,
                    'text-white': isActive,
                  }"
                />
                <span class="transition-colors group-hover:text-white">{{ item.name }}</span>
              </div>
            </router-link>
          </div>

          <!-- Parent Item With Children -->
          <div v-else>
            <button
              @click="toggleSubMenu(item)"
              class="flex items-center justify-between w-full px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 cursor-pointer group"
              :class="[
                isChildActive(item.children)
                  ? 'bg-gradient-to-r from-primary to-purple-600 text-white shadow-lg shadow-primary/30' // Active child
                  : activeMenu === item.name
                    ? 'bg-slate-700/70 text-primary' // Open parent, but no active child
                    : 'text-slate-300 hover:bg-slate-700/50 hover:text-white hover:scale-[1.02] transform', // Inactive
              ]"
            >
              <div class="flex items-center">
                <component
                  :is="item.icon"
                  class="h-5 w-5 mr-3 transition-colors"
                  :class="{
                    'text-primary group-hover:text-white': !(
                      isChildActive(item.children) || activeMenu === item.name
                    ),
                    'text-white': isChildActive(item.children) || activeMenu === item.name,
                  }"
                />
                <span
                  :class="{
                    'text-primary': activeMenu === item.name && !isChildActive(item.children),
                    'text-white': isChildActive(item.children),
                    'group-hover:text-white': !(
                      activeMenu === item.name || isChildActive(item.children)
                    ),
                  }"
                  class="transition-colors"
                  >{{ item.name }}</span
                >
              </div>
              <ChevronDown
                class="h-4 w-4 stroke-slate-400 group-hover:stroke-white transform transition-transform duration-200"
                :class="{ 'rotate-180': activeMenu === item.name }"
              />
            </button>

            <!-- Animated Submenu -->
            <transition
              enter-active-class="transition-all duration-300 ease-out"
              leave-active-class="transition-all duration-200 ease-in"
              enter-from-class="opacity-0 max-h-0"
              enter-to-class="opacity-100 max-h-[500px]"
              leave-from-class="opacity-100 max-h-[500px]"
              leave-to-class="opacity-0 max-h-0"
            >
              <div
                v-show="activeMenu === item.name"
                class="ml-4 pl-4 border-l border-slate-700 space-y-1 overflow-hidden"
              >
                <router-link
                  v-for="child in item.children"
                  :key="child.name"
                  :to="child.route"
                  v-slot="{ isActive, navigate }"
                  custom
                >
                  <div
                    @click="navigate"
                    class="flex items-center py-2 text-sm transition-colors duration-200 group"
                    :class="[
                      isActive
                        ? 'bg-slate-700/50 text-white font-medium rounded-lg'
                        : 'text-slate-300 hover:bg-slate-700/30 hover:text-white rounded-lg',
                    ]"
                  >
                    <span
                      class="w-2 h-2 mr-3 rounded-full bg-slate-400/50 group-hover:bg-primary transition-colors"
                    ></span>
                    <span class="transition-colors group-hover:text-white">{{ child.name }}</span>
                  </div>
                </router-link>
              </div>
            </transition>
          </div>
        </template>
      </nav>
    </div>

    <!-- Logout Section -->
    <div class="p-4 border-t border-slate-700/50">
      <button
        @click="handleLogout"
        class="w-full flex items-center px-4 py-3 text-sm font-medium text-slate-300 rounded-xl hover:bg-rose-500/10 hover:text-rose-500 transition-all duration-200 group"
      >
        <LogOut class="h-5 w-5 mr-3 stroke-slate-400 group-hover:stroke-rose-500 transition-all" />
        <span class="transition-colors group-hover:text-rose-500">Logout</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { X as XIcon, LogOut, ChevronDown } from 'lucide-vue-next'

const route = useRoute()
const activeMenu = ref(null) // Keep track of the currently open menu

defineProps({
  sidebarOpen: Boolean,
  filteredNavigationItems: Array,
})

const emit = defineEmits(['toggle-sidebar', 'logout'])

const toggleSidebar = () => {
  emit('toggle-sidebar')
}

const toggleSubMenu = (item) => {
  // If the clicked menu is already open, close it.  Otherwise, open the clicked menu.
  activeMenu.value = activeMenu.value === item.name ? null : item.name
}

const handleLogout = () => {
  emit('logout')
}

const isChildActive = (children) => {
  return children.some((child) => route.path === child.route)
}
</script>

<style scoped>
/* Add any SideNavBar-specific styles here.  Keep the styles from the original component. */
.transition-all {
  transition-property: all;
}

/* Example custom scrollbar (for WebKit browsers) */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  /* Light track */
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  /* Light thumb */
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
  /* Slightly darker on hover */
}
</style>
