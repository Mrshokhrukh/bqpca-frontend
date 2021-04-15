<!-- NameChange.vue -->
<template>
  <div class="p-8 min-h-screen bg-gray-50">
    <div class="bg-white rounded-xl p-8 mb-10 shadow-sm border border-gray-100">
      <h1 class="text-4xl font-bold text-gray-900 mb-3">ECPF Name Change</h1>
      <p class="text-gray-600">
        Please provide the current details and the proposed new name for the ECPF.
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
            <label class="block text-sm font-medium text-gray-700">License No.</label>
            <input
              type="text"
              :value="currentDetails.licenseNo"
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
            <label for="proposedName" class="block text-sm font-medium text-gray-700"
              >Proposed Name of ECPF</label
            >
            <input
              type="text"
              id="proposedName"
              v-model="proposedName"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm"
            />
          </div>
          <div class="mt-6">
            <label for="nameChangeRemarks" class="block text-sm font-medium text-gray-700"
              >Declaration</label
            >
            <select
              v-model="nameChangeRemarks"
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
          :disabled="nameChangeRemarks !== 'agree'"
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
      // Default should be empty or represent loading state
      ecpfName: '',
      licenseNo: '',
      location: '',
      proprietorName: '',
      cid: '',
      contactNo: '',
      emailAddress: '',
    }),
  },
  initialData: {
    // Prop for initial data (optional, for editing)
    type: Object,
    default: () => ({}),
  },
})

const proposedName = ref('')
const nameChangeRemarks = ref('')
const currentDetails = ref({ ...props.currentDetails }) // Use ref for reactivity

const emit = defineEmits(['submit', 'save-draft', 'initiate-payment', 'edit-application'])

// Fetch current details on component mount
onMounted(async () => {
  try {
    const response = await apiServices.getEcpfNameChanges() // Assuming this endpoint returns current details. Adjust if needed.
    if (response.status === 200) {
      currentDetails.value = response.data // Update currentDetails with fetched data
    } else {
      console.error('Failed to fetch current details:', response.status, response.data)
      // Handle error appropriately, maybe show a message to the user
    }
  } catch (error) {
    console.error('Error fetching current details:', error)
    // Handle error appropriately
  }
})

const onSubmit = async () => {
  if (nameChangeRemarks.value !== 'agree') {
    alert('You must agree to the declaration before submitting.')
    return
  }

  const payload = {
    proposedName: proposedName.value,
    nameChangeRemarks: nameChangeRemarks.value,
    ...currentDetails.value, // Include current details if needed in payload, or remove if backend infers it.
  }

  try {
    const response = await apiServices.createEcpfNameChange(payload) // Or use update if it's an edit scenario
    if (response.status === 201 || response.status === 200) {
      // Check for success status codes
      emit('submit', response.data) // Emit submit event with response data
      alert('Application submitted successfully!') // Optionally alert user
      // Optionally redirect or clear form
    } else {
      console.error('Failed to submit application:', response.status, response.data)
      alert('Failed to submit application. Please try again.') // Inform user of failure
    }
  } catch (error) {
    console.error('Error submitting application:', error)
    alert('Failed to submit application. Please check console for details.') // General error alert
  }
}

//watch for changes in the initialData prop
watch(
  () => props.initialData,
  (newData) => {
    proposedName.value = newData.proposedName || ''
    nameChangeRemarks.value = newData.nameChangeRemarks || ''
  },
  { immediate: true },
) // Run immediately when the component is created

const saveAsDraft = async () => {
  const payload = {
    proposedName: proposedName.value,
    nameChangeRemarks: nameChangeRemarks.value,
    status: 'draft', // Assuming you have a status field in your backend model
  }
  try {
    const response = await apiServices.patchEcpfNameChange(
      /* applicationId, if available for drafts */ 1,
      payload,
    ) // Assuming patch for drafts. Adjust endpoint and ID as needed.
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
  emit('initiate-payment') // You might want to integrate with payment API here or in the parent component
  alert('Payment initiation logic to be implemented.')
}

const editApplication = async () => {
  const payload = {
    proposedName: proposedName.value,
    nameChangeRemarks: nameChangeRemarks.value,
  }
  try {
    const response = await apiServices.patchEcpfNameChange(/* applicationId to edit */ 1, payload) // Assuming patch to update. Adjust endpoint and ID.
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
