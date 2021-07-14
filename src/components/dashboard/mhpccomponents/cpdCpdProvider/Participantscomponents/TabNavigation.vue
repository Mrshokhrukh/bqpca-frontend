<template>
  <div
    class="flex space-x-2 bg-slate-200/70 p-1.5 rounded-xl"
    :class="{ 'cursor-not-allowed opacity-70': disabled }"
  >
    <button
      v-for="tab in tabs"
      :key="tab.id"
      @click="changeTab(tab.id)"
      :class="getTabClasses(tab.id)"
      :disabled="disabled"
    >
      <component :is="iconMap[tab.id]" class="h-5 w-5 mr-2" aria-hidden="true" />
      {{ tab.name }}
    </button>
  </div>
</template>

<script setup>
import { UsersIcon, CameraIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  // Accept an array of tabs to be rendered
  tabs: {
    type: Array,
    required: true,
  },
  activeTab: {
    type: String,
    required: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['tab-change'])

// Map tab IDs to their corresponding icons
const iconMap = {
  bulk: UsersIcon,
  photo: CameraIcon,
}

function changeTab(tabId) {
  if (props.disabled) return
  emit('tab-change', tabId)
}

function getTabClasses(tabId) {
  const isActive = props.activeTab === tabId
  return [
    'flex-1 flex items-center justify-center text-center whitespace-nowrap py-3 px-4 font-semibold text-sm rounded-lg transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-200/70',
    isActive
      ? 'bg-white text-blue-600 shadow-md' // Active tab style
      : 'text-slate-600 hover:bg-white/60 hover:text-slate-800', // Inactive tab style
  ]
}
</script>
