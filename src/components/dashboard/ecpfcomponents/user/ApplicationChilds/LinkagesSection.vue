<template>
  <section class="p-6 bg-white rounded-lg shadow">
    <h2 class="text-xl font-semibold mb-4 text-blue-700">Probable Institute/Colleges/University Linkages</h2>
    <div v-if="linkages.length === 0" class="text-center text-gray-500 py-4">
      No linkages added yet. Click "Add Linkage" to start.
    </div>
    <div v-for="(linkage, index) in linkages" :key="index" class="mb-6 p-4 border rounded-md relative">
      <button type="button" @click="removeLinkage(index)"
        class="absolute top-2 right-2 text-red-500 hover:text-red-700 p-1 rounded-full bg-red-100 hover:bg-red-200"
        aria-label="Remove Linkage">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label :for="'linkName-' + index" class="block text-sm font-medium text-gray-700">Name</label>
          <input type="text" :id="'linkName-' + index" v-model="linkage.name"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        </div>
        <div>
          <label :for="'linkLocation-' + index" class="block text-sm font-medium text-gray-700">Location</label>
          <input type="text" :id="'linkLocation-' + index" v-model="linkage.location"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        </div>
        <div>
          <label :for="'linkCountry-' + index" class="block text-sm font-medium text-gray-700">Country</label>
          <input type="text" :id="'linkCountry-' + index" v-model="linkage.country"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        </div>
        <div class="md:col-span-2 lg:col-span-1">
          <label :for="'linkRecognition-' + index"
            class="block text-sm font-medium text-gray-700">Recognition/Accreditation</label>
          <input type="text" :id="'linkRecognition-' + index" v-model="linkage.recognition"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        </div>
        <div class="md:col-span-2">
          <label :for="'linkApproval-' + index" class="block text-sm font-medium text-gray-700">Approval from
            University</label>
          <input type="text" :id="'linkApproval-' + index" v-model="linkage.approval"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        </div>
      </div>
    </div>
    <button type="button" @click="addLinkage"
      class="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
      add institute
    </button>
  </section>
</template>

<script setup>
const props = defineProps({
  linkages: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['update:linkages'])
// End Change

const addLinkage = () => {
  emit('update:linkages', [
    ...props.linkages,
    { name: '', location: '', country: '', recognition: '', approval: '' },
  ])
}

const removeLinkage = (index) => {
  emit(
    'update:linkages',
    props.linkages.filter((_, i) => i !== index),
  )
}
</script>
