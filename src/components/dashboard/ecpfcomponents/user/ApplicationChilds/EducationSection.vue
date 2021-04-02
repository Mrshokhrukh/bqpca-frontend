<template>
  <section class="p-6 bg-white rounded-lg shadow">
      <h2 class="text-xl font-semibold mb-4 text-blue-700">Education Details</h2>
      <!-- Changed grid columns to accommodate the new field -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
              <label for="qualification" class="block text-sm font-medium text-gray-700">Highest Qualification <span class="text-red-500">*</span></label>
              <input type="text" id="qualification" :value="educationData.qualification" list="qualificationsList" required
                  @input="$emit('update:educationData', { ...educationData, qualification: $event.target.value })"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="e.g., Bachelors Degree, Class XII, PhD">
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
              <label for="institute" class="block text-sm font-medium text-gray-700">Institute Name <span class="text-red-500">*</span></label>
              <input type="text" id="institute" :value="educationData.instituteName" required
                  @input="$emit('update:educationData', { ...educationData, instituteName: $event.target.value })"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter institute name">
          </div>
          <!-- Added University Name Input -->
          <div>
              <label for="university" class="block text-sm font-medium text-gray-700">University Name <span class="text-red-500">*</span></label>
              <input type="text" id="university" :value="educationData.universityName" required
                  @input="$emit('update:educationData', { ...educationData, universityName: $event.target.value })"
                  class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter university name">
          </div>
          <!-- End Added Input -->
      </div>
  </section>
</template>

<script setup>
defineProps({
  educationData: {
    type: Object,
    required: true
    // Ensure the parent passes an object like: { qualification: '', instituteName: '', universityName: '' }
  }
});

// Declare the event
defineEmits(['update:educationData']);
</script>