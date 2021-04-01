<template>
  <section class="p-6 bg-white rounded-lg shadow">
      <h2 class="text-xl font-semibold mb-4 text-indigo-700">ECPF Establishment Proposal Details</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-4">
              <div>
                  <label for="proposalName" class="block text-sm font-medium text-gray-700">Proposed Name <span class="text-red-500">*</span></label>
                  <input type="text" id="proposalName" :value="proposalData.name" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
              </div>
              <div>
                  <label for="proposalAddress" class="block text-sm font-medium text-gray-700">Proposed Address <span class="text-red-500">*</span></label>
                  <input type="text" id="proposalAddress" :value="proposalData.address" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Full address details">
              </div>
          </div>
          <div class="space-y-4">
              <div>
                  <label for="proposalLocation" class="block text-sm font-medium text-gray-700">Proposed Location (Dzongkhag/Thromde) <span class="text-red-500">*</span></label>
                  <select id="proposalLocation" :value="proposalData.location" required class="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                    <option disabled value="">Select Location</option>
                    <!-- Use name or id based on backend requirement -->
                    <option v-for="option in dzongkhagOptions" :key="option.id" :value="option.name">{{ option.name }}</option>
                  </select>
              </div>
              <div>
                  <label for="proposalFirmType" class="block text-sm font-medium text-gray-700">Type of Firm <span class="text-red-500">*</span></label>
                  <select id="proposalFirmType" :value="proposalData.firmType" required class="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                    <option disabled value="">Select Firm Type</option>
                    <!-- Assuming firmTypeOptions has { id: '...', name: '...' } structure -->
                    <option v-for="option in firmTypeOptions.results" :key="option.id" :value="option.id">{{ option.description }}</option>
                  </select>
              </div>
          </div>
      </div>
  </section>
</template>

<script setup>

defineProps({
  proposalData: {
    type: Object,
    required: true
  },
  dzongkhagOptions: {
    type: Object,
    default: () => { }
  },
   firmTypeOptions: { // Receive firm types from parent
    type: Object,
     default: () => { }
  }
});
</script>