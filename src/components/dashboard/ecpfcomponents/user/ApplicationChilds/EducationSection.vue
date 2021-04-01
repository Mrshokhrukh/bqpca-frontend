<template>
  <section class="p-6 bg-white rounded-lg shadow">
      <h2 class="text-xl font-semibold mb-4 text-indigo-700">Education Details</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
              <label for="qualification" class="block text-sm font-medium text-gray-700">Highest Qualification <span class="text-red-500">*</span></label>
              <input type="text" id="qualification" :value="educationData.qualification" list="qualificationsList" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="e.g., Bachelors Degree, Class XII, PhD">
              <datalist id="qualificationsList">
                  <option value="PhD"></option>
                  <option value="Masters Degree"></option>
                  <option value="Bachelors Degree"></option>
                  <option value="Diploma"></option>
                  <option value="Class XII"></option>
                  <option value="Class X"></option>
                  <!-- Add other common qualifications -->
              </datalist>
          </div>
          <div>
              <label for="institute" class="block text-sm font-medium text-gray-700">Name of Institute/University <span class="text-red-500">*</span></label>
              <input type="text" id="institute" :value="educationData.instituteName" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Enter institute name">
          </div>
      </div>
  </section>
</template>

<script setup>

defineProps({
  educationData: {
    type: Object,
    required: true
  }
});
</script>