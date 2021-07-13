<template>
  <section class="p-6 bg-white rounded-lg shadow">
    <h2 class="text-xl font-semibold mb-4 text-blue-700">
      Probable Institute/Colleges/University Linkages
    </h2>

    <div v-if="localLinkages.length === 0" class="text-center text-gray-500 py-4">
      No linkages added yet. Click "Add New Institute" to start.
    </div>

    <div
      v-for="(linkage, index) in localLinkages"
      :key="index"
      class="mb-6 p-4 border rounded-md relative space-y-4"
    >
      <div class="flex justify-between items-start">
        <h3 class="font-semibold text-gray-800">Institute #{{ index + 1 }}</h3>
        <button
          type="button"
          @click="removeLinkage(index)"
          class="text-red-500 hover:text-red-700 p-1 rounded-full bg-red-100 hover:bg-red-200"
          aria-label="Remove Linkage"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label :for="'institutionName-' + index" class="block text-sm font-medium text-gray-700"
            >Institution Name <span class="text-red-500">*</span></label
          >
          <input
            type="text"
            :id="'institutionName-' + index"
            v-model="linkage.institution_name"
            @input="updateParent"
            required
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label :for="'linkLocation-' + index" class="block text-sm font-medium text-gray-700"
            >Location <span class="text-red-500">*</span></label
          >
          <input
            type="text"
            :id="'linkLocation-' + index"
            v-model="linkage.location"
            @input="updateParent"
            required
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label :for="'linkCountry-' + index" class="block text-sm font-medium text-gray-700"
            >Country <span class="text-red-500">*</span></label
          >
          <input
            type="text"
            :id="'linkCountry-' + index"
            v-model="linkage.country"
            @input="updateParent"
            required
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div class="md:col-span-2 lg:col-span-1">
          <label :for="'recognitionDoc-' + index" class="block text-sm font-medium text-gray-700"
            >Recognition Document (PDF) <span class="text-red-500">*</span></label
          >
          <input
            type="file"
            :id="'recognitionDoc-' + index"
            accept=".pdf"
            @change="handleFileChange($event, index, 'recognitionDocFile')"
            required
            class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <p v-if="linkage.recognitionDocFile" class="text-xs text-green-600 mt-1">
            Selected: {{ linkage.recognitionDocFile.name }}
          </p>
        </div>
        <div class="md:col-span-2">
          <label :for="'approvalDoc-' + index" class="block text-sm font-medium text-gray-700"
            >Approval Document (PDF) <span class="text-red-500">*</span></label
          >
          <input
            type="file"
            :id="'approvalDoc-' + index"
            accept=".pdf"
            @change="handleFileChange($event, index, 'approvalDocFile')"
            required
            class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <p v-if="linkage.approvalDocFile" class="text-xs text-green-600 mt-1">
            Selected: {{ linkage.approvalDocFile.name }}
          </p>
        </div>
      </div>
    </div>

    <button
      type="button"
      @click="addLinkage"
      :disabled="!isLastLinkageValid"
      class="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
      :class="
        isLastLinkageValid ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'
      "
    >
      Add New Institute
    </button>
    <p v-if="!isLastLinkageValid && localLinkages.length > 0" class="text-xs text-yellow-700 mt-2">
      Please fill all required fields for the last institute before adding a new one.
    </p>
  </section>
</template>

<script setup>
import { ref, watch, computed } from 'vue'

const props = defineProps({
  linkages: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['update:linkages'])

// Use a local copy of the prop to avoid direct mutation
const localLinkages = ref([...props.linkages])

// Watch for changes in the parent's prop and update the local state
watch(
  () => props.linkages,
  (newVal) => {
    localLinkages.value = [...newVal]
  },
  { deep: true },
)

// A computed property to check if the last item in the array is fully populated
const isLastLinkageValid = computed(() => {
  if (localLinkages.value.length === 0) {
    return true // Can always add the first one
  }
  const lastLinkage = localLinkages.value[localLinkages.value.length - 1]
  return (
    lastLinkage.institution_name &&
    lastLinkage.location &&
    lastLinkage.country &&
    lastLinkage.recognitionDocFile && // Check for the file object
    lastLinkage.approvalDocFile // Check for the file object
  )
})

const updateParent = () => {
  emit('update:linkages', localLinkages.value)
}

const addLinkage = () => {
  localLinkages.value.push({
    institution_name: '',
    location: '',
    country: '',
    recognitionDocFile: null,
    approvalDocFile: null,
  })
  updateParent()
}

const removeLinkage = (index) => {
  localLinkages.value.splice(index, 1)
  updateParent()
}

const handleFileChange = (event, index, fileKey) => {
  const file = event.target.files[0] || null
  localLinkages.value[index][fileKey] = file
  updateParent()
}
</script>
