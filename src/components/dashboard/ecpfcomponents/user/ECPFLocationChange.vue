<!-- EcpfLocationChange.vue -->
<template>
  <div class="p-8 min-h-screen bg-gray-50">
    <div class="bg-white rounded-xl p-8 mb-10 shadow-sm border border-gray-100">
      <h1 class="text-4xl font-bold text-gray-900 mb-3">ECPF Location Change</h1>
      <p class="text-gray-600">
        Please provide the current location details and the proposed new location for the ECPF.
      </p>
    </div>

    <div class="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Current Details (Readonly Inputs) -->
        <div>
          <h3 class="text-lg font-medium mb-2 text-gray-700">Current Details</h3>
          <div>
            <label class="block text-sm font-medium text-gray-700">ECPF Name</label>
            <input
              type="text"
              :value="currentDetails.ecpfName"
              readonly
              class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Location</label>
            <input
              type="text"
              :value="currentDetails.location"
              readonly
              class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Name of Proprietor</label>
            <input
              type="text"
              :value="currentDetails.proprietorName"
              readonly
              class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">CID</label>
            <input
              type="text"
              :value="currentDetails.cid"
              readonly
              class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Contact No.</label>
            <input
              type="text"
              :value="currentDetails.contactNo"
              readonly
              class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              :value="currentDetails.emailAddress"
              readonly
              class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
        </div>

        <!-- Proposed Change (Editable Fields) -->
        <div>
          <h3 class="text-lg font-medium mb-2 text-gray-700">Proposed Change</h3>
          <div>
            <label for="newLocation" class="block text-sm font-medium text-gray-700"
              >New Location</label
            >
            <input
              type="text"
              id="newLocation"
              v-model="newLocation"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm"
            />
          </div>
          <div class="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label for="gewogThrom" class="block text-sm font-medium text-gray-700"
                >Gewog/Throm</label
              >
              <select
                id="gewogThrom"
                v-model="selectedGewogThrom"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm"
              >
                <option value="">Select</option>
                <option
                  v-for="option in gewogThromOptions"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </option>
              </select>
            </div>
            <div>
              <label for="dzongkhagThromde" class="block text-sm font-medium text-gray-700"
                >Dzongkhag/Thromde</label
              >
              <select
                id="dzongkhagThromde"
                v-model="selectedDzongkhagThromde"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm"
              >
                <option value="">Select</option>
                <option
                  v-for="option in dzongkhagThromdeOptions"
                  :key="option.value"
                  :value="option.value"
                >
                  {{ option.label }}
                </option>
              </select>
            </div>
          </div>
          <div class="mt-4">
            <label for="locationChangeRemarks" class="block text-sm font-medium text-gray-700"
              >Declaration</label
            >
            <select
              v-model="locationChangeRemarks"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm"
            >
              <option value="">Select an Option</option>
              <option value="agree">Agree</option>
              <option value="disagree">Disagree</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="mt-6 flex justify-end space-x-4">
        <button
          @click="saveAsDraft"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
        >
          Save as Draft
        </button>
        <button
          @click="editApplication"
          class="px-4 py-2 text-sm font-medium text-white bg-yellow-500 rounded-md hover:bg-yellow-600"
        >
          Edit
        </button>
        <button
          @click="initiatePayment"
          class="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600"
        >
          Initiate Payment
        </button>
        <button
          @click="onSubmit"
          :disabled="locationChangeRemarks !== 'agree'"
          class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Submit
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import apiServices from '@/services/services' // Import your API service

const props = defineProps({
  currentDetails: {
    type: Object,
    required: true,
    default: () => ({
      ecpfName: '',
      location: '',
      proprietorName: '',
      cid: '',
      contactNo: '',
      emailAddress: '',
    }),
  },
  gewogThromOptions: {
    type: Array,
    required: true,
    default: () => [], // Provide default empty arrays
  },
  dzongkhagThromdeOptions: {
    type: Array,
    required: true,
    default: () => [], // Provide default empty arrays
  },
  initialData: {
    type: Object,
    default: () => ({}),
  },
})

const newLocation = ref('')
const selectedGewogThrom = ref('')
const selectedDzongkhagThromde = ref('')
const locationChangeRemarks = ref('')
const currentDetails = ref({ ...props.currentDetails }) // Make currentDetails reactive

const emit = defineEmits(['submit', 'save-draft', 'initiate-payment', 'edit-application'])

onMounted(async () => {
  try {
    const response = await apiServices.getEcpfLocationChanges() // Adjust endpoint if needed to fetch current details
    if (response.status === 200) {
      currentDetails.value = response.data
    } else {
      console.error('Failed to fetch current details:', response.status, response.data)
      alert('Failed to fetch current details.')
    }
  } catch (error) {
    console.error('Error fetching current details:', error)
    alert('Error fetching current details.')
  }
})

const onSubmit = async () => {
  if (locationChangeRemarks.value !== 'agree') {
    alert('You must agree to the declaration to submit.')
    return
  }

  const payload = {
    newLocation: newLocation.value,
    selectedGewogThrom: selectedGewogThrom.value,
    selectedDzongkhagThromde: selectedDzongkhagThromde.value,
    locationChangeRemarks: locationChangeRemarks.value,
    ...currentDetails.value, // Include current details if needed
  }

  try {
    const response = await apiServices.createEcpfLocationChange(payload) // Or use update if editing
    if (response.status === 201 || response.status === 200) {
      emit('submit', response.data)
      alert('Application submitted successfully!')
    } else {
      console.error('Failed to submit application:', response.status, response.data)
      alert('Failed to submit application.')
    }
  } catch (error) {
    console.error('Error submitting application:', error)
    alert('Error submitting application.')
  }
}

// Watch for changes in initialData
watch(
  () => props.initialData,
  (newData) => {
    newLocation.value = newData.newLocation || ''
    selectedGewogThrom.value = newData.selectedGewogThrom || ''
    selectedDzongkhagThromde.value = newData.selectedDzongkhagThromde || ''
    locationChangeRemarks.value = newData.locationChangeRemarks || ''
  },
  { immediate: true },
)

const saveAsDraft = async () => {
  const payload = {
    newLocation: newLocation.value,
    selectedGewogThrom: selectedGewogThrom.value,
    selectedDzongkhagThromde: selectedDzongkhagThromde.value,
    locationChangeRemarks: locationChangeRemarks.value,
    status: 'draft', // Assuming status field in backend
  }
  try {
    const response = await apiServices.patchEcpfLocationChange(
      /* applicationId if available for drafts */ 1,
      payload,
    ) // Adjust ID and endpoint
    if (response.status === 200) {
      emit('save-draft', response.data)
      alert('Saved as draft!')
    } else {
      console.error('Failed to save as draft:', response.status, response.data)
      alert('Failed to save as draft.')
    }
  } catch (error) {
    console.error('Error saving as draft:', error)
    alert('Error saving as draft.')
  }
}
const initiatePayment = () => {
  emit('initiate-payment')
  alert('Payment initiation logic to be implemented.')
}

const editApplication = async () => {
  const payload = {
    newLocation: newLocation.value,
    selectedGewogThrom: selectedGewogThrom.value,
    selectedDzongkhagThromde: selectedDzongkhagThromde.value,
    locationChangeRemarks: locationChangeRemarks.value,
  }
  try {
    const response = await apiServices.patchEcpfLocationChange(
      /* applicationId to edit */ 1,
      payload,
    ) // Adjust ID and endpoint
    if (response.status === 200) {
      emit('edit-application', response.data)
      alert('Application updated in edit mode!')
    } else {
      console.error('Failed to update application for edit:', response.status, response.data)
      alert('Failed to update application for edit.')
    }
  } catch (error) {
    console.error('Error updating application for edit:', error)
    alert('Error updating application for edit.')
  }
}
</script>
