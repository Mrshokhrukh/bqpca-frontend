<template>
  <div class="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4 p-4 bg-white rounded-lg shadow-md">
    <!-- Search Input -->
    <div v-if="hasCapas" class="w-full sm:w-1/3">
      <label for="search" class="sr-only">Search</label>
      <div class="relative">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
          </svg>
        </div>
        <input
          id="search"
          type="text"
          v-model="localSearchQuery"
          @input="emitSearch"
          class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="Search by institute or teaching center"
        />
      </div>
    </div>

    <!-- Status Filter -->
    <div v-if="hasCapas" class="w-full sm:w-1/4">
      <label for="status-filter" class="sr-only">Filter by Status</label>
      <select
        id="status-filter"
        v-model="localStatusFilter"
        @change="emitStatusFilter"
        class="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      >
        <option value="">All Statuses</option>
        <option value="Pending">Pending</option>
        <option value="Resolved">Resolved</option>
        <option value="Approved">Approved</option>
      </select>
    </div>

    <!-- Add CAPA Button -->
    <div class="w-full sm:w-auto">
      <button
        @click="$emit('add-capa')"
        class="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <svg class="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
        </svg>
        Add New CAPA
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  searchQuery: String,
  statusFilter: String,
  hasCapas: Boolean,
});

const emit = defineEmits(['search', 'status-filter', 'add-capa']);

const localSearchQuery = ref(props.searchQuery);
const localStatusFilter = ref(props.statusFilter);

watch(() => props.searchQuery, (newVal) => {
  localSearchQuery.value = newVal;
});

watch(() => props.statusFilter, (newVal) => {
  localStatusFilter.value = newVal;
});

const emitSearch = () => {
  emit('search', localSearchQuery.value);
};

const emitStatusFilter = () => {
  emit('status-filter', localStatusFilter.value);
};
</script>
