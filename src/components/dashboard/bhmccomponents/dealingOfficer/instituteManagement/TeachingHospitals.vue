<template>
  <div class="container mx-auto p-4">
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200 table-auto">
        <thead class="bg-gray-50">
          <tr>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Name
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              City
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Specialty
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Capacity
            </th>
            <th scope="col" class="relative px-6 py-3">
              <span class="sr-only">Edit</span>
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="center in teachingCenters" :key="center.id">
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ center.name }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ center.city }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800"
              >
                {{ center.specialty }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {{ center.capacity }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <a href="#" class="text-indigo-600 hover:text-indigo-900">View</a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// Static data for teaching centers (replace with your actual data or API call later)
const teachingCenters = ref([
  { id: 1, name: 'General Hospital of City A', city: 'City A', specialty: 'General Medicine', capacity: 15 },
  { id: 2, name: 'Specialized Heart Center', city: 'City B', specialty: 'Cardiology', capacity: 8 },
  { id: 3, name: 'Children\'s Medical Institute', city: 'City C', specialty: 'Pediatrics', capacity: 20 },
  { id: 4, name: 'Neuroscience Teaching Hospital', city: 'City D', specialty: 'Neurology', capacity: 12 },
  { id: 5, name: 'Orthopedic & Trauma Center', city: 'City E', specialty: 'Orthopedics', capacity: 10 },
]);
</script>
