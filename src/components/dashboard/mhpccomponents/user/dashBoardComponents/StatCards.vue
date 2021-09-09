<template>
  <div class="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 flex flex-col h-full">
    <div class="flex items-center justify-between pb-4 border-b border-gray-100">
      <div class="flex items-center space-x-3">
        <div class="bg-sky-100 text-sky-600 rounded-lg p-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 17 17 23 15.79 13.88"></polyline></svg>
        </div>
        <h2 class="text-lg font-semibold text-gray-800">{{ title }}</h2>
      </div>
      <div class="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
        Recommended Credit: <span class="font-bold text-gray-700">{{ totalTarget }}</span>
      </div>
    </div>

    <div v-if="totalApplications > 0" class="flex-grow flex flex-col justify-between pt-5">
      <div>
        <div class="flex items-center justify-between text-sm mb-2">
          <span class="font-medium text-gray-600">Progress</span>
          <span class="font-bold text-indigo-600">{{ credits }} / {{ totalTarget }} points</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-4 shadow-inner overflow-hidden">
          <div
            class="bg-gradient-to-r from-sky-500 to-indigo-500 h-4 rounded-full transition-all duration-700 ease-out"
            :style="{ width: `${progressPercentage}%` }"
          ></div>
        </div>
        <div v-if="isTargetMet" class="text-center mt-3 text-sm font-medium text-green-600 flex items-center justify-center space-x-2">
          <span>🎉</span>
          <span>Congratulations! You've met the target.</span>
        </div>
      </div>

      <div class="mt-6 flex items-stretch gap-4">
        <div class="w-1/2 bg-green-50 border border-green-200 p-4 rounded-lg flex items-center space-x-3">
          <div class="bg-white text-green-600 p-2 rounded-full">
             <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          </div>
          <div>
            <div class="text-2xl font-bold text-green-700">{{ statusCounts.Approved || 0 }}</div>
            <div class="text-xs font-medium text-gray-500">Approved</div>
          </div>
        </div>

        <div class="w-1/2 bg-amber-50 border border-amber-200 p-4 rounded-lg flex items-center space-x-3">
          <div class="bg-white text-amber-600 p-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          </div>
           <div>
            <div class="text-2xl font-bold text-amber-700">{{ otherApplicationsCount }}</div>
            <div class="text-xs font-medium text-gray-500">Pending Review</div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="flex-grow flex flex-col items-center justify-center text-center py-8">
      <div class="bg-gray-100 text-gray-400 rounded-full p-4">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
      </div>
      <p class="mt-4 font-semibold text-gray-700">No Applications Found</p>
      <p class="text-sm text-gray-500">You have not submitted any CPD applications yet.</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  credits: {
    type: Number,
    required: true,
    default: 0
  },
  totalTarget: {
    type: Number,
    required: true,
    default: 30
  },
  statusCounts: {
    type: Object,
    required: true,
    default: () => ({})
  },
})

// Calculates percentage for the progress bar
const progressPercentage = computed(() => {
  if (!props.totalTarget) return 0
  const percentage = (props.credits / props.totalTarget) * 100
  return Math.min(percentage, 100) // Cap at 100%
})

// Calculates total applications from the status counts object
const totalApplications = computed(() => {
  if (!props.statusCounts || Object.keys(props.statusCounts).length === 0) {
    return 0
  }
  return Object.values(props.statusCounts).reduce((sum, count) => sum + count, 0);
});

// ## NEW ##: Calculates the count of all non-approved applications
const otherApplicationsCount = computed(() => {
  // We take the total and subtract the approved count.
  const approvedCount = props.statusCounts.Approved || 0;
  return totalApplications.value - approvedCount;
});

// A boolean computed property to check if the target has been met
const isTargetMet = computed(() => props.credits >= props.totalTarget);

</script>
