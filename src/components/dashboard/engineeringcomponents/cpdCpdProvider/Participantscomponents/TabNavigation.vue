<template>
  <div class="bg-white rounded-xl shadow-md overflow-hidden mb-6">
    <div class="flex border-b border-gray-200">
      <button @click="changeTab('single')" :class="getTabClasses('single')">
        <UserIcon class="h-5 w-5 inline-block mr-2" />
        Single Entry
      </button>
      <button @click="changeTab('bulk')" :class="getTabClasses('bulk')">
        <UsersIcon class="h-5 w-5 inline-block mr-2" />
        Bulk Upload
      </button>
      <button @click="changeTab('photo')" :class="getTabClasses('photo')">
        <CameraIcon class="h-5 w-5 inline-block mr-2" />
        Attendance Sheet
      </button>
    </div>
  </div>
</template>

<script setup>
import { UserIcon, UsersIcon, CameraIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  activeTab: {
    type: String,
    required: true,
    validator: (value) => ['single', 'bulk', 'photo'].includes(value),
  },
})

const emit = defineEmits(['tab-change'])

function changeTab(tab) {
  emit('tab-change', tab)
}

function getTabClasses(tab) {
  return [
    'flex-1 py-3 font-medium text-center focus:outline-none transition-colors',
    props.activeTab === tab
      ? 'text-green-600 border-b-2 border-green-500 bg-green-50'
      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50',
  ]
}
</script>
