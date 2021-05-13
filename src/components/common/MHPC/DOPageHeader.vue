<template>
  <div
    class="backdrop-blur-md bg-white/80 rounded-2xl p-8 mb-10 shadow-lg border border-indigo-100 overflow-hidden relative"
  >
    <div class="absolute -top-16 -right-16 w-64 h-64 bg-indigo-200 rounded-full opacity-20"></div>
    <div class="absolute -bottom-8 -left-8 w-32 h-32 bg-blue-200 rounded-full opacity-20"></div>

    <div
      class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10"
    >
      <div>
        <h1
          class="text-3xl font-bold text-gray-900 bg-gradient-to-r from-indigo-700 to-blue-700 bg-clip-text text-transparent"
        >
          {{ title }}
        </h1>
        <p v-if="description" class="text-gray-600 mt-1">
          {{ description }}
        </p>
      </div>
      <div
        v-if="showControls"
        class="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 w-full md:w-auto"
      >
        <div v-if="showSearch" class="relative flex-grow">
          <input
            :value="searchQuery"
            @input="$emit('update:searchQuery', $event.target.value)"
            type="text"
            :placeholder="searchPlaceholder"
            class="pl-10 pr-4 py-3 border-0 rounded-xl focus:ring-2 focus:ring-indigo-500 w-full shadow-md text-sm bg-white"
          />
          <span class="absolute left-3 top-3 text-gray-400">
            <SearchIcon class="w-5 h-5" />
          </span>
        </div>
        <select
          v-if="showFilter && filterOptions.length > 0"
          :value="filterValue"
          @change="$emit('update:filterValue', $event.target.value)"
          class="border-0 rounded-xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 shadow-md text-sm bg-white"
        >
          <option v-for="option in filterOptions" :key="option.value" :value="option.value">
            {{ option.text }}
          </option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup>
import { SearchIcon } from 'lucide-vue-next'

defineProps({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  showControls: {
    type: Boolean,
    default: true,
  },
  showSearch: {
    type: Boolean,
    default: true,
  },
  searchQuery: {
    type: String,
    default: '',
  },
  searchPlaceholder: {
    type: String,
    default: 'Search...',
  },
  showFilter: {
    type: Boolean,
    default: true,
  },
  filterValue: {
    type: String,
    default: '',
  },
  filterOptions: {
    type: Array,
    default: () => [], // Should be an array of { value: '', text: '' }
  },
})

defineEmits(['update:searchQuery', 'update:filterValue'])
</script>
