<template>
  <div class="bg-white border-b p-8 rounde md:shadow-sm mb-6 space-y-4">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between">
      <h1 class="text-2xl md:text-3xl font-bold text-gray-800">BMHC Capa Management</h1>
      <div class="mt-4 md:mt-0 flex flex-col md:flex-row gap-3">
        <div class="relative">
          <input
            v-model.trim="localSearchQuery"
            type="text"
            placeholder="Search institutes..."
            class="pl-10 pr-4 py-2.5 w-full md:w-64 text-sm rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          />
          <span class="absolute left-3 top-2.5 text-gray-400">
            <SearchIcon class="w-5 h-5" />
          </span>
        </div>
        <select
          v-model="localStatusFilter"
          class="py-2.5 px-4 text-sm rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">All Status</option>
          <option value="R">Resolved</option>
          <option value="P">Pending</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { SearchIcon } from 'lucide-vue-next'

defineProps({})
const emit = defineEmits(['search', 'status-filter'])

const localSearchQuery = ref('')
const localStatusFilter = ref('')

watch(localSearchQuery, (newValue) => {
  emit('search', newValue)
})

watch(localStatusFilter, (newValue) => {
  emit('status-filter', newValue)
})
</script>
