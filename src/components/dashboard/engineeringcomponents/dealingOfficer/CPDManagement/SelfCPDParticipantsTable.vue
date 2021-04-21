<template>
  <div class="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Participant Name
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Registration Number
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              CPD Activity
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Awarded Credits
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Status
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr
            v-for="participant in participants"
            :key="participant.id"
            class="hover:bg-gray-50 transition-colors"
          >
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">{{ participant.fullName }}</div>
              <div class="text-xs text-gray-500">{{ participant.cidNumber }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm text-gray-900">{{ participant.registrationNumber }}</div>
            </td>
            <td class="px-6 py-4">
              <div class="text-sm text-gray-900">{{ participant.cpdTitle }}</div>
              <div class="text-xs text-gray-500">{{ participant.activityType }}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <div class="text-sm font-medium text-gray-900">
                {{ participant.cpdCredits || 0 }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span
                :class="[
                  getStatusColor(participant.reviewStatus),
                  'px-2 py-1 text-xs font-medium rounded-full',
                ]"
              >
                {{ participant.reviewStatus || 'Pending' }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-center">
              <button
                @click="$emit('open-award-modal', participant)"
                class="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                View
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div
      class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6"
    >
      <div class="flex-1 flex justify-between items-center">
        <div>
          <p class="text-sm text-gray-700">
            Showing <span class="font-medium">{{ paginationStart + 1 }}</span> to
            <span class="font-medium">{{ paginationEnd }}</span> of
            <span class="font-medium">{{ totalParticipants }}</span> results
          </p>
        </div>
        <div class="flex">
          <button
            @click="$emit('prev-page')"
            :disabled="currentPage === 1"
            :class="[
              currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50',
              'relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white',
            ]"
          >
            <svg
              class="h-5 w-5 mr-2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clip-rule="evenodd"
              />
            </svg>
            Previous
          </button>
          <button
            @click="$emit('next-page')"
            :disabled="currentPage === totalPages"
            :class="[
              currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50',
              'ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white',
            ]"
          >
            Next
            <svg
              class="h-5 w-5 ml-2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  participants: {
    type: Array,
    required: true,
  },
  paginationStart: {
    type: Number,
    required: true,
  },
  paginationEnd: {
    type: Number,
    required: true,
  },
  totalParticipants: {
    type: Number,
    required: true,
  },
  currentPage: {
    type: Number,
    required: true,
  },
  totalPages: {
    type: Number,
    required: true,
  },
})

defineEmits(['open-award-modal', 'prev-page', 'next-page'])

const getStatusColor = (status) => {
  return (
    {
      Pending: 'bg-yellow-100 text-yellow-800',
      Approved: 'bg-green-100 text-green-800',
      Rejected: 'bg-red-100 text-red-800',
    }[status] || 'bg-gray-100 text-gray-800'
  )
}
</script>

<style scoped>
/* Scoped styles for table */
</style>
