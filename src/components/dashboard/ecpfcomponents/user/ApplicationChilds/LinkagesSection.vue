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
          <label :for="'institutionName-' + index" class="block text-sm font-medium text-gray-700">Institution Name
            <span class="text-red-500">*</span></label>
          <input type="text" :id="'institutionName-' + index" v-model="linkage.institution_name" required
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        </div>
        <div>
          <label :for="'linkLocation-' + index" class="block text-sm font-medium text-gray-700">Location <span
              class="text-red-500">*</span></label>
          <input type="text" :id="'linkLocation-' + index" v-model="linkage.location" required
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        </div>
        <div>
          <label :for="'linkCountry-' + index" class="block text-sm font-medium text-gray-700">Country <span
              class="text-red-500">*</span></label>
          <input type="text" :id="'linkCountry-' + index" v-model="linkage.country" required
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
        </div>
        <div class="md:col-span-2 lg:col-span-1">
          <label :for="'recognitionDoc-' + index" class="block text-sm font-medium text-gray-700">Recognition Document
            (PDF)</label>
          <input type="file" :id="'recognitionDoc-' + index" accept=".pdf"
            @change="handleRecognitionFileChange($event, index)"
            class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
          <p v-if="linkage.recognition_doc_name" class="text-xs text-gray-600 mt-1">
            Selected: {{ linkage.recognition_doc_name }}
          </p>
        </div>
        <div class="md:col-span-2">
          <label :for="'approvalDoc-' + index" class="block text-sm font-medium text-gray-700">Approval Document
            (PDF)</label>
          <input type="file" :id="'approvalDoc-' + index" accept=".pdf"
            @change="handleApprovalFileChange($event, index)"
            class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
          <p v-if="linkage.approval_doc_name" class="text-xs text-gray-600 mt-1">
            Selected: {{ linkage.approval_doc_name }}
          </p>
        </div>
      </div>
    </div>
    <button type="button" @click="addLinkage"
      class="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
      Add Institute
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

const emit = defineEmits(['update:linkages', 'update:file'])

const addLinkage = () => {
  emit('update:linkages', [
    ...props.linkages,
    {
      institution_name: '',
      location: '',
      country: '',
      recognition_doc: null,
      recognition_doc_name: '',
      approval_doc: null,
      approval_doc_name: ''
    },
  ])
}

const removeLinkage = (index) => {
  emit(
    'update:linkages',
    props.linkages.filter((_, i) => i !== index),
  )
}

const handleRecognitionFileChange = (event, index) => {
  const file = event.target.files[0]
  if (file) {
    const updatedLinkages = [...props.linkages]
    updatedLinkages[index] = {
      ...updatedLinkages[index],
      recognition_doc: file,
      recognition_doc_name: file.name
    }
    emit('update:linkages', updatedLinkages)

    // Emit file update for parent to handle file storage
    emit('update:file', {
      file,
      field: `linkage_${index}_recognition_doc`,
      index,
      type: 'recognition_doc'
    })
  }
}

const handleApprovalFileChange = (event, index) => {
  const file = event.target.files[0]
  if (file) {
    const updatedLinkages = [...props.linkages]
    updatedLinkages[index] = {
      ...updatedLinkages[index],
      approval_doc: file,
      approval_doc_name: file.name
    }
    emit('update:linkages', updatedLinkages)

    // Emit file update for parent to handle file storage
    emit('update:file', {
      file,
      field: `linkage_${index}_approval_doc`,
      index,
      type: 'approval_doc'
    })
  }
}
</script>
