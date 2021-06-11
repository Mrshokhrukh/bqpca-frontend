<template>
  <div
    class="flex space-x-2 bg-slate-200/70 p-1.5 rounded-xl backdrop-blur-sm"
    :class="{ 'cursor-not-allowed opacity-70': disabled }"
  >
    <button @click="changeTab('single')" :class="getTabClasses('single')" :disabled="disabled">
      <UserIcon class="h-5 w-5 mr-2" />
      Single Entry
    </button>
    <button @click="changeTab('bulk')" :class="getTabClasses('bulk')" :disabled="disabled">
      <UsersIcon class="h-5 w-5 mr-2" />
      Bulk Upload
    </button>
    <button @click="changeTab('photo')" :class="getTabClasses('photo')" :disabled="disabled">
      <CameraIcon class="h-5 w-5 mr-2" />
      Attendance Photo
    </button>
  </div>
</template>

<script setup>
import { UserIcon, UsersIcon, CameraIcon } from '@heroicons/vue/24/outline';

const props = defineProps({
  activeTab: {
    type: String,
    required: true,
    validator: (value) => ['single', 'bulk', 'photo'].includes(value),
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['tab-change']);

function changeTab(tab) {
  if (props.disabled) return;
  emit('tab-change', tab);
}

function getTabClasses(tab) {
  const isActive = props.activeTab === tab;
  return [
    'flex-1 flex items-center justify-center text-center whitespace-nowrap py-3 px-4 font-semibold text-sm rounded-lg transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-200/70',
    isActive
      ? 'bg-white text-blue-600 shadow-md'
      : 'text-slate-600 hover:bg-slate-300/50 hover:text-slate-800',
  ];
}
</script>
