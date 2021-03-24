
<template>
  <div>
    <div class="border-b border-gray-200 bg-gray-50 p-6 rounded-t-xl">
      <h3 class="text-lg font-semibold text-gray-900">Resource Persons Details</h3>
      <p class="mt-1 text-sm text-gray-500">Details about the resource persons.</p>
    </div>

    <div class="p-8">
      <div v-for="(person, personIndex) in resourcePersons" :key="personIndex" class="mb-6 p-4 border rounded-lg">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- RegNo -->
          <div class="col-span-1">
            <label class="block text-sm font-medium text-gray-700">Registration Number <span
                class="text-red-500">*</span></label>
            <select v-model="person.regNo" @change="fetchResourcePersonDetails(person)"
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5">
              <option value="">Select Registration Number</option>
              <option v-for="reg in userRegistrations" :key="reg.registration_no" :value="reg.registration_no">
                {{ reg.registration_no }} - {{ reg.full_name }}
              </option>
            </select>
            <p v-if="userRegistrations.length === 0" class="mt-1 text-sm text-red-600">
              No users found. Please ensure there are registered users in the system.
            </p>
          </div>

          <!-- Name -->
          <div class="col-span-1">
            <label class="block text-sm font-medium text-gray-700">Name</label>
            <input type="text" v-model="person.name" readonly
              class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 bg-gray-50" />
          </div>
        </div>

        <div class="mt-4 flex justify-end">
          <button v-if="personIndex > 0" @click="removeResourcePerson(personIndex)"
            class="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200">
            Remove
          </button>
        </div>
      </div>

      <div class="flex justify-start mb-6">
        <button @click="addResourcePerson"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
          Add Resource Person
        </button>
      </div>

      <!-- Certificates -->
      <div class="col-span-1">
        <label for="certificates" class="block text-sm font-medium text-gray-700">Document supporting expertise of
          CPD <span class="text-red-500">*</span></label>
        <input type="file" id="certificates" @change="handleCertificateUpload"
          class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
        <p class="text-xs text-gray-500 mt-1">Accepted file format: PDF (max 5MB)</p>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  resourcePersons: { type: Array, default: () => ([{ regNo: '', name: '' }]) },
  resourcePersonCertificate: Object,
  fetchResourcePersonDetails: Function,
  handleCertificateUpload: Function,
  addResourcePerson: Function,
  removeResourcePerson: Function,
  userRegistrations: Array, // Add this prop
});
</script>