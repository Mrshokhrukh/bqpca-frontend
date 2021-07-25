<template>
  <div class="border-b border-gray-200 bg-gray-50 p-6 rounded-t-xl mt-8">
    <h3 class="text-lg font-semibold text-gray-900">Resource Persons Details</h3>
    <p class="mt-1 text-sm text-gray-500">Details about the resource persons for this CPD.</p>
  </div>

  <div class="p-8">
    <div v-for="(person, index) in resourcePersons" :key="index" class="mb-6 p-4 border rounded-lg">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- RegNo -->
        <div class="col-span-1">
          <label :for="`regNo-${index}`" class="block text-sm font-medium text-gray-700">
            Registration Number <span class="text-red-600">*</span>
          </label>
          <input
            type="text"
            :id="`regNo-${index}`"
            v-model="person.regNo"
            @blur="fetchPersonDetails(person)"
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500 p-2.5"
          />
        </div>

        <!-- Name -->
        <div class="col-span-1">
          <label :for="`name-${index}`" class="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            :id="`name-${index}`"
            v-model="person.name"
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500 p-2.5 bg-gray-50"
            readonly
          />
        </div>
      </div>

      <div class="mt-4 flex justify-end">
        <button
          v-if="index > 0"
          @click="removeResourcePerson(index)"
          class="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Remove
        </button>
      </div>
    </div>

    <div class="flex justify-start mb-6">
      <button
        @click="addResourcePerson"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Add Resource Person
      </button>
    </div>

    <!-- Certificates -->
    <div class="col-span-2">
      <label for="certificates" class="block text-sm font-medium text-gray-700">
        Document supporting expertise of CPD <span class="text-red-600">*</span>
      </label>
      <input
        type="file"
        id="certificates"
        accept=".pdf"
        @change="handleCertificateUpload"
        class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
      />
      <p class="text-xs text-gray-500 mt-1">Accepted file format: PDF (max 5MB)</p>
      <div v-if="certificateFileName" class="mt-2 text-sm text-green-600">
        Selected file: {{ certificateFileName }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import apiServices from '@/services/mhpcservices'
import { useToast } from 'vue-toastification'

const props = defineProps({
  modelValue: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue'])
const toast = useToast()

// Local state for resource persons to maintain reactivity
const resourcePersons = ref([...props.modelValue])
const certificateFileName = ref('')
const loading = ref(false)

// Sync local state with modelValue prop
watch(
  props.modelValue,
  (newVal) => {
    if (JSON.stringify(newVal) !== JSON.stringify(resourcePersons.value)) {
      resourcePersons.value = [...newVal]
    }
  },
  { deep: true },
)

// Sync modelValue with local state
watch(
  resourcePersons,
  (newVal) => {
    emit('update:modelValue', [...newVal])
  },
  { deep: true },
)

// Methods
const fetchPersonDetails = async (person) => {
  if (!person.regNo) return

  try {
    loading.value = true

    // Try to fetch person details from API
    const response = await apiServices.getMhpcApplicationsByCid('')

    if (response.data && Array.isArray(response.data)) {
      // Try to find a matching registration
      const match = response.data.find((app) => app.registration_no === person.regNo)

      if (match) {
        person.name = match.full_name || 'Unknown'
      } else {
        // If not found in the API, prompt for manual entry
        const manualName = prompt(
          `Resource person with registration number ${person.regNo} not found. Please enter the name manually:`,
        )
        if (manualName) {
          person.name = manualName
        } else {
          person.name = ''
          toast.warning('No name provided for resource person')
        }
      }
    }
  } catch (error) {
    console.error('Error fetching resource person details:', error)
    toast.error('Failed to fetch resource person details')

    // Allow manual entry
    const manualName = prompt(
      `Failed to fetch details for registration number ${person.regNo}. Please enter the name manually:`,
    )
    if (manualName) {
      person.name = manualName
    } else {
      person.name = ''
    }
  } finally {
    loading.value = false
  }
}

const addResourcePerson = () => {
  resourcePersons.value.push({ regNo: '', name: '' })
}

const removeResourcePerson = (index) => {
  resourcePersons.value.splice(index, 1)
}

const handleCertificateUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return

  // Validate file is PDF and size is less than 5MB
  if (file.type !== 'application/pdf') {
    toast.error('Please upload a PDF file')
    event.target.value = ''
    return
  }

  if (file.size > 5 * 1024 * 1024) {
    toast.error('File size must be less than 5MB')
    event.target.value = ''
    return
  }

  // Set the certificate for all resource persons
  certificateFileName.value = file.name

  // Emit the file to the parent component
  resourcePersons.value.forEach((person) => {
    person.certificate = file
  })
}
</script>
