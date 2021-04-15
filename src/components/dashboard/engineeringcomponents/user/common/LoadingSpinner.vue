// components/common/LoadingSpinner.vue
<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white p-6 rounded-lg shadow-xl">
      <div class="flex items-center space-x-4">
        <div
          class="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"
        ></div>
        <span class="text-gray-700">Loading...</span>
      </div>
    </div>
  </div>
</template>
