<template>
  <div class="border-b border-gray-200 bg-gray-50 p-6 rounded-t-xl">
    <h3 class="text-lg font-semibold text-gray-900">Applicant Details</h3>
    <p class="mt-1 text-sm text-gray-500">Verify your personal information.</p>
  </div>

  <div class="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
    <!-- CID Number -->
    <div class="col-span-1">
      <label class="block text-sm font-medium text-gray-700"
        >CID No./Identity/Work Permit No.</label
      >
      <input
        type="text"
        :value="applicant.cidNumber"
        readonly
        class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 bg-gray-50"
      />
    </div>

    <!-- Full Name -->
    <div class="col-span-1">
      <label class="block text-sm font-medium text-gray-700">Full Name</label>
      <input
        type="text"
        :value="applicant.fullName"
        readonly
        class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 bg-gray-50"
      />
    </div>

    <!-- Agency/Training Location -->
    <div class="col-span-1">
      <label class="block text-sm font-medium text-gray-700"
        >Agency/Training Location <span class="text-red-500">*</span></label
      >
      <input
        type="text"
        :value="applicant.agencyTrainingLocation"
        @input="
          $emit('update:applicant', { ...applicant, agencyTrainingLocation: $event.target.value })
        "
        class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
      />
    </div>
  </div>
</template>

<script setup>
defineProps({
  applicant: Object,
})
</script>
