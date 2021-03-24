<!-- ./dashboardComponents/MyApplications.vue -->
<template>
  <div
    class="bg-white rounded-xl shadow-xl p-6 col-span-1 lg:col-span-2 transition-all duration-300 border border-gray-100">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold text-gray-800 flex items-center">
        <span class="mr-3 bg-blue-100 text-blue-600 p-2 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd"
              d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
              clip-rule="evenodd" />
          </svg>
        </span>
        My Applications
      </h2>
      <span class="text-sm font-medium text-gray-500">{{ applications.length }} Application{{ applications.length !== 1
        ? 's' : '' }}</span>
    </div>

    <transition-group name="list" tag="div" class="space-y-4" v-if="applications.length > 0">
      <div v-for="app in applications" :key="app.id"
        class="group bg-gray-50 hover:bg-blue-50 rounded-lg p-4 transition-all duration-200 border border-gray-100 hover:border-blue-200">
        <div class="flex justify-between items-start">
          <div>
            <div class="flex items-center">
              <h3 class="text-lg font-semibold text-gray-800 group-hover:text-blue-700 transition-colors">{{ app.type }}
              </h3>
              <span :class="getStatusClass(app.status)" class="ml-3 transition-all duration-200">
                {{ app.status }}
              </span>
            </div>
            <div class="flex items-center mt-1 text-sm text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd"
                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                  clip-rule="evenodd" />
              </svg>
              Submitted: {{ formatDate(app.submittedDate) }}
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <button v-if="app.status === 'Draft'" @click="$emit('edit-application', app.id)"
              class="text-gray-500 hover:text-blue-600 transition-colors" title="Edit Draft">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </button>
          </div>
        </div>

        <transition name="fade">
          <p v-if="app.actionRequired"
            class="mt-3 text-sm bg-orange-50 text-orange-700 p-3 rounded-md border border-orange-200 flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 flex-shrink-0" viewBox="0 0 20 20"
              fill="currentColor">
              <path fill-rule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clip-rule="evenodd" />
            </svg>
            <span>{{ app.actionRequired }}</span>
          </p>
        </transition>

        <div class="mt-4 flex items-center justify-end">
          <button @click="$emit('view-details', app.id)"
            class="inline-flex items-center px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 bg-white text-blue-600 border border-blue-200 hover:bg-blue-600 hover:text-white hover:border-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            View Details
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </transition-group>

    <div v-else
      class="py-12 flex flex-col items-center justify-center text-center bg-gray-50 rounded-lg border border-dashed border-gray-300">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24"
        stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <p class="text-gray-500 font-medium">No applications submitted yet</p>
      <button @click="$emit('create-application')"
        class="mt-4 inline-flex items-center px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-600 hover:text-white hover:border-blue-600">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd"
            d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
            clip-rule="evenodd" />
        </svg>
        Create New Application
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  applications: {
    type: Array,
    default: () => []
  }
});

defineEmits(['view-details', 'edit-application', 'create-application']);

const getStatusClass = (status) => {
  switch (status) {
    case 'Draft':
      return 'bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-medium border border-gray-200';
    case 'Submitted':
      return 'bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium border border-blue-200';
    case 'Under Review':
      return 'bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-medium border border-yellow-200';
    case 'Approved':
      return 'bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium border border-green-200';
    case 'Rejected':
      return 'bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-medium border border-red-200';
    case 'Action Required':
      return 'bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs font-medium border border-orange-200';
    default:
      return 'bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-medium border border-gray-200';
  }
};

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};
</script>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>