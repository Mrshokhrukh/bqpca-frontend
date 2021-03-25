<template>
  <div
    class="w-72 bg-gradient-to-b from-slate-800 to-slate-900 text-white transition-all duration-300 flex flex-col relative"
    :class="{ '-ml-72': !sidebarOpen }">
    <!-- Logo Section -->
    <div class="flex items-center justify-between p-5 border-b border-slate-700/50">
      <router-link to="/" class="flex items-center space-x-3 group">
        <div class="relative h-9 w-9 rounded-xl overflow-hidden ring-2 ring-slate-700/50">
          <img src="@/assets/rgob.png" alt="BQPCA Logo"
            class="h-full w-full object-contain transition-transform duration-300 group-hover:scale-110" />
        </div>
        <span class="font-semibold text-lg tracking-wide group-hover:text-primary transition-colors">BQPCA
          Admin</span>
      </router-link>
      <button @click="toggleSidebar" class="lg:hidden p-2 hover:bg-slate-700 rounded-lg transition-colors">
        <XIcon class="h-5 w-5" />
      </button>
    </div>

    <!-- Navigation Menu -->
    <div class="flex-1 overflow-y-auto custom-scrollbar p-4">
      <nav class="space-y-1.5">
        <template v-for="item in filteredNavigationItems" :key="item.name">
          <!-- Single Item Without Children -->
          <div v-if="!item.children">
            <router-link :to="item.route" v-slot="{ isActive, navigate }" custom>
              <div @click="navigate"
                class="flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 cursor-pointer"
                :class="[
      isActive
        ? 'bg-slate-700/70 text-white shadow-lg shadow-slate-900/20'
        : 'text-slate-300 hover:bg-slate-700/50 hover:text-white hover:translate-x-1',
    ]">
                <component :is="item.icon" class="h-5 w-5 mr-3" :class="{ 'text-primary': isActive }" />
                {{ item.name }}
              </div>
            </router-link>
          </div>

          <!-- Parent Item With Children -->
          <div v-else>
            <button @click="toggleSubMenu(item)"
              class="flex items-center justify-between w-full px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 cursor-pointer group"
              :class="[
      isChildActive(item.children) || activeMenu === item.name
        ? 'bg-slate-700/70 text-white shadow-lg shadow-slate-900/20'
        : 'text-slate-300 hover:bg-slate-700/50 hover:text-white hover:translate-x-1',
    ]">
              <div class="flex items-center">
                <component :is="item.icon" class="h-5 w-5 mr-3" />
                {{ item.name }}
              </div>
              <ChevronDown class="h-4 w-4 transform transition-transform duration-200"
                :class="{ 'rotate-180': activeMenu === item.name }" />
            </button>

            <!-- Animated Submenu -->
            <transition enter-active-class="transition-all duration-200 ease-out"
              leave-active-class="transition-all duration-150 ease-in" enter-from-class="opacity-0 max-h-0"
              enter-to-class="opacity-100 max-h-96" leave-from-class="opacity-100 max-h-96"
              leave-to-class="opacity-0 max-h-0">
              <div v-show="activeMenu === item.name" class="ml-8 space-y-1 overflow-hidden">
                <router-link v-for="child in item.children" :key="child.name" :to="child.route"
                  v-slot="{ isActive, navigate }" custom>
                  <div @click="navigate"
                    class="flex items-center px-3 py-2 text-sm rounded-lg transition-colors duration-200" :class="[
      isActive
        ? 'bg-slate-700/50 text-white font-medium'
        : 'text-slate-300 hover:bg-slate-700/30 hover:text-white',
    ]">
                    <span class="w-2 h-2 mr-3 rounded-full bg-slate-400/50"></span>
                    {{ child.name }}

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
      <button @click="handleLogout"
        class="w-full flex items-center px-4 py-3 text-sm font-medium text-slate-300 rounded-xl hover:bg-rose-500/10 hover:text-rose-500 transition-all duration-200 group">
        <LogOut class="h-5 w-5 mr-3 transition-transform duration-200 group-hover:-translate-x-1" />
        Logout
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import {
  X as XIcon,
  LogOut,
  ChevronDown,
} from 'lucide-vue-next';

const route = useRoute();
const activeMenu = ref(null); // Keep track of the currently open menu

defineProps({
  sidebarOpen: Boolean,
  filteredNavigationItems: Array,
});

const emit = defineEmits(['toggle-sidebar', 'logout']);

const toggleSidebar = () => {
  emit('toggle-sidebar');
};

const toggleSubMenu = (item) => {
    // If the clicked menu is already open, close it.  Otherwise, open the clicked menu.
  activeMenu.value = activeMenu.value === item.name ? null : item.name;
};

const handleLogout = () => {
  emit('logout');
};

const isChildActive = (children) => {
  return children.some(child => route.path === child.route);
};

</script>

<style scoped>
/* Add any SideNavBar-specific styles here.  Keep the styles from the original component. */
.transition-all {
  transition-property: all;
}
</style>