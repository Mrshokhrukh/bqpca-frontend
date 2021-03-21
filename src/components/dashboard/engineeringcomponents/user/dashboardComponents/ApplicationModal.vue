
<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg w-3/4 max-h-[80vh] overflow-hidden">
      <div class="p-6">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-bold">{{ title }}</h2>
          <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700">
            <XMarkIcon class="w-6 h-6" />
          </button>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="bg-gray-50">
                <th v-for="header in headers" :key="header" class="text-left p-3 text-sm font-medium text-gray-700">
                  {{ header }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="app in applications" :key="app.id" class="border-b hover:bg-gray-50">
                <td class="p-3">{{ app.id }}</td>
                <td class="p-3">{{ app.type }}</td>
                <td class="p-3">{{ formatDate(app.date) }}</td>
                <td class="p-3">
                  <span :class="[
            'px-2 py-1 rounded-full text-xs font-medium',
            getStatusClass(app.status)
          ]">
                    {{ app.status }}
                  </span>
                </td>
                <td class="p-3">{{ app.message }}</td>
                <td v-if="showActionColumn" class="p-3">
                  <button
                    class="bg-blue-500 text-white px-3 py-1 rounded-full text-sm hover:bg-blue-600 transition-colors"
                    @click="$emit('visit', app)">Review
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="bg-gray-50 px-6 py-4 flex justify-end space-x-2">
        <button @click="$emit('close')"
          class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors">
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { XMarkIcon } from '@heroicons/vue/24/outline';
import { computed } from 'vue';
import dayjs from 'dayjs';

const props = defineProps({
  applications: {
    type: Array,
    required: true
  },
  title: {
    type: String,
    required: true
  }
});

defineEmits(['close', 'visit']);

const headers = computed(() => {
  const baseHeaders = ['ID', 'Type', 'Date', 'Status', 'Remarks'];
  return props.title === 'Rejected Applications'
    ? [...baseHeaders, 'Action']
    : baseHeaders;
});

const showActionColumn = computed(() =>
  props.title === 'Rejected Applications'
);

const formatDate = (date) =>
  dayjs(date).format('MMM DD, YYYY');

const getStatusClass = (status) => {
  const classes = {
    'Approved': 'bg-green-100 text-green-800',
    'Pending': 'bg-yellow-100 text-yellow-800',
    'Rejected': 'bg-red-100 text-red-800'
  };
  return classes[status] || 'bg-gray-100 text-gray-800';
};
</script>
