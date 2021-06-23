<template>
  <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
    <div class="p-5">
      <h4 class="text-base font-semibold text-gray-800 mb-4 flex items-center space-x-3">
        <component :is="iconComponent" class="h-5 w-5 text-gray-500" />
        <span>{{ title }}</span>
      </h4>
      <div class="space-y-3">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import * as LucideIcons from 'lucide-vue-next';

const props = defineProps({
  title: String,
  icon: String, // Pass the icon name as a string e.g. "User"
});

const iconComponent = computed(() => LucideIcons[props.icon] || LucideIcons.HelpCircle);
</script>
