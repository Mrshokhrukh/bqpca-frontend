<template>
  <div class="flex items-start space-x-4 rounded-lg bg-slate-50/70 p-4 border border-slate-200/80 h-full">
    <div v-if="icon" class="flex-shrink-0 rounded-full bg-white p-2.5 border border-slate-200 shadow-sm">
      <component :is="iconComponent" class="h-5 w-5 text-slate-600" />
    </div>
    <div class="flex-1 min-w-0">
      <p class="text-xs font-semibold uppercase text-slate-500 truncate" :title="label">{{ label }}</p>
      <a v-if="(isLink || isEmail) && value" :href="isEmail ? `mailto:${value}` : value" target="_blank" rel="noopener noreferrer" class="text-base font-medium text-indigo-600 hover:text-indigo-800 break-words">
        {{ value }}
      </a>
      <p v-else class="text-base font-medium text-gray-800 break-words">
        {{ value || 'N/A' }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { User, Mail, Hash, Phone, Globe, MapPin, Calendar } from 'lucide-vue-next';

const props = defineProps({
  icon: String,
  label: String,
  value: [String, Number],
  isLink: {
    type: Boolean,
    default: false,
  },
  isEmail: {
    type: Boolean,
    default: false,
  },
});

const iconComponents = {
  User,
  Mail,
  Hash,
  Phone,
  Globe,
  MapPin,
  Calendar,
};

const iconComponent = computed(() => {
  return iconComponents[props.icon] || null;
});
</script>
