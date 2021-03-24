// 6. CpdProviderForm.vue
<template>
  <div>
    <div class="border-b border-gray-200 bg-gray-50 p-6 rounded-t-xl">
      <h3 class="text-lg font-semibold text-gray-900">CPD Providers Details (Host)</h3>
      <p class="mt-1 text-sm text-gray-500">Information about the CPD provider.</p>
    </div>

    <div class="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- CPD Providing Agency -->
      <div class="col-span-1">
        <label for="providingAgency" class="block text-sm font-medium text-gray-700">CPD Providing Agency <span
            class="text-red-500">*</span></label>
        <select id="providingAgency" :value="cpdProvider.agency"
          class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5">
          <option value="">Select Agency</option>
          <option v-for="agency in agencyOptions" :key="agency.value" :value="agency.value">
            {{ agency.text }} (ID: {{ agency.value }})
          </option>
          <option value="other">Other</option>
        </select>

        <p v-if="agencyOptions.length === 0" class="mt-1 text-sm text-red-600">
          No agencies found. Please try refreshing the page.
        </p>

        <div v-if="cpdProvider.agency && cpdProvider.agency !== 'other'" class="mt-1 text-xs text-gray-500">
          Selected agency ID: {{ cpdProvider.agency }}
        </div>
      </div>

      <!-- If Others (Specify) -->
      <div v-if="cpdProvider.agency === 'other'" class="col-span-1">
        <label for="otherAgency" class="block text-sm font-medium text-gray-700">Specify Other Agency <span
            class="text-red-500">*</span></label>
        <input type="text" id="otherAgency" :value="cpdProvider.otherAgency"
          class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5" />
      </div>

      <!-- Reason for Conducting -->
      <div class="col-span-1">
        <label for="reasonConducting" class="block text-sm font-medium text-gray-700">Reason for Conducting <span
            class="text-red-500">*</span></label>
        <select id="reasonConducting" :value="cpdProvider.reason"
          class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5">
          <option value="">Select Reason</option>
          <option v-for="reason in reasonOptions" :key="reason.value" :value="reason.value">
            {{ reason.text }}
          </option>
        </select>
      </div>

      <!-- Reason for Details -->
      <div class="col-span-1">
        <label for="reasonDetails" class="block text-sm font-medium text-gray-700">Reason Details <span
            class="text-red-500">*</span></label>
        <textarea id="reasonDetails" :value="cpdProvider.reasonDetails"
          class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
          rows="4"></textarea>
      </div>

    </div>
  </div>
</template>

<script setup>defineProps({
  cpdProvider: Object,
  agencyOptions: Array,
  reasonOptions: Array,
});
</script>