<template>
  <div class="border-b border-gray-200 mb-6">
    <nav class="-mb-px flex space-x-6 sm:space-x-8" aria-label="Tabs">
      <button
        v-for="tab in tabs"
        :key="tab.name"
        @click="$emit('update:currentTab', tab.name)"
        :class="[
          currentTab === tab.name
            ? 'border-indigo-500 text-indigo-600 bg-indigo-50'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
          'whitespace-nowrap py-4 px-4 sm:px-6 border-b-2 font-medium text-base rounded-t-lg transition-all duration-200',
        ]"
      >
        {{ tab.label }}
      </button>
    </nav>
  </div>
</template>

<script setup>
defineProps({
  tabs: {
    type: Array,
    required: true,
  },
  currentTab: {
    type: String,
    required: true,
  },
});

defineEmits(['update:currentTab']);
</script>
