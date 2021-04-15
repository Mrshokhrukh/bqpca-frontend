<template>
  <section class="p-6 bg-white rounded-lg shadow">
    <h2 class="text-xl font-semibold mb-4 text-blue-700">Applicant Details (Auto-fetched)</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700">CID No.</label>
        <input
          type="text"
          :value="applicantData?.cid"
          disabled
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed sm:text-sm"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Applicant's Name</label>
        <input
          type="text"
          :value="applicantData?.name"
          disabled
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed sm:text-sm"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Gender</label>
        <input
          type="text"
          :value="applicantData?.gender"
          disabled
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed sm:text-sm"
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Date of Birth</label>
        <input
          type="text"
          :value="applicantData?.dob"
          disabled
          class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed sm:text-sm"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  applicantData: {
    type: Object,
    default: () => ({ cid: '', name: '', gender: '', dob: '' }), // Provide default structure
  },
})
</script>
