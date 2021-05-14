// CpdProviderForm.vue
<template>
  <div class="rounded-xl border border-gray-200 shadow-sm bg-white overflow-hidden">
    <!-- Header -->
    <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-200">
      <h3 class="text-xl font-semibold text-gray-800 flex items-center">
        <span class="inline-block mr-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </span>
        CPD Providers Details (Host)
      </h3>
      <p class="mt-2 text-sm text-gray-600">Information about the CPD provider and the reason for conducting the program.</p>
    </div>

    <!-- Form Content -->
    <div class="p-6 space-y-8">
      <!-- Provider Information Section -->
      <div class="bg-gray-50 p-5 rounded-lg border border-gray-200">
        <h4 class="text-md font-medium text-gray-700 mb-4 flex items-center">
          <span class="inline-block mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </span>
          Provider Information
        </h4>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- CPD Providing Agency -->
          <div class="col-span-1">
            <label for="providingAgency" class="block text-sm font-medium text-gray-700 mb-1">
              CPD Providing Agency <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <select
                id="providingAgency"
                :value="cpdProvider.agency"
                class="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 pl-10 bg-white appearance-none pr-10"
              >
                <option value="" disabled>Select Agency</option>
                <option v-for="agency in agencyOptions" :key="agency.value" :value="agency.value">
                  {{ agency.text }} (ID: {{ agency.value }})
                </option>
                <option value="other">Other (specify below)</option>
              </select>
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            <div v-if="agencyOptions.length === 0" class="mt-2 text-sm text-red-600 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              No agencies found. Please try refreshing the page.
            </div>

            <div
              v-if="cpdProvider.agency && cpdProvider.agency !== 'other'"
              class="mt-2 text-xs text-gray-500 flex items-center bg-blue-50 p-2 rounded"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Selected agency ID: {{ cpdProvider.agency }}
            </div>
          </div>

          <!-- If Others (Specify) - Conditional Field -->
          <div v-if="cpdProvider.agency === 'other'" class="col-span-1">
            <label for="otherAgency" class="block text-sm font-medium text-gray-700 mb-1">
              Specify Other Agency <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <input
                type="text"
                id="otherAgency"
                :value="cpdProvider.otherAgency"
                placeholder="Enter agency name"
                class="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 pl-10"
              />
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Reason Section -->
      <div class="bg-gray-50 p-5 rounded-lg border border-gray-200">
        <h4 class="text-md font-medium text-gray-700 mb-4 flex items-center">
          <span class="inline-block mr-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
          Reason for Conducting
        </h4>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Reason for Conducting -->
          <div class="col-span-1">
            <label for="reasonConducting" class="block text-sm font-medium text-gray-700 mb-1">
              Reason for Conducting <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <select
                id="reasonConducting"
                :value="cpdProvider.reason"
                class="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 pl-10 bg-white appearance-none pr-10"
              >
                <option value="" disabled>Select Reason</option>
                <option v-for="reason in reasonOptions" :key="reason.value" :value="reason.value">
                  {{ reason.text }}
                </option>
              </select>
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Reason Details -->
          <div class="col-span-1 md:col-span-2">
            <label for="reasonDetails" class="block text-sm font-medium text-gray-700 mb-1">
              Reason Details <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <textarea
                id="reasonDetails"
                :value="cpdProvider.reasonDetails"
                placeholder="Provide detailed information about the reason for conducting this CPD..."
                class="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 pl-10"
                rows="4"
              ></textarea>
              <div class="absolute top-3 left-3 flex items-start pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  cpdProvider: Object,
  agencyOptions: Array,
  reasonOptions: Array,
})
</script>