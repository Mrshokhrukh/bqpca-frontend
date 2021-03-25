<template>
  <header class="bg-white shadow-sm border-b border-slate-200">
    <div class="flex items-center justify-between px-6 py-4">
      <div class="flex items-center space-x-4">
        <button @click="toggleSidebar" class="p-2 rounded-lg hover:bg-slate-100 lg:hidden transition-colors">
          <Menu class="h-6 w-6" />
        </button>
        <h1 class="text-lg font-semibold text-slate-800">{{ currentRouteName }}</h1>
      </div>

      <div class="flex items-center space-x-6">
        <NotificationBell />

        <!-- User Info (without icon and popup) -->
        <div class="text-right">
          <p class="text-sm font-medium text-slate-700">{{ fullName }}</p>
          <p class="text-xs text-slate-500">{{ serviceTypeLabel }}</p>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { Menu } from 'lucide-vue-next';
import NotificationBell from '@/components/NotificationBell.vue';

defineProps({
  currentRouteName: String,
  fullName: String,
  serviceTypeLabel: String,
});

const emit = defineEmits(['toggle-sidebar']);

const toggleSidebar = () => {
  emit('toggle-sidebar');
};
</script>