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
            <input type="text" :value="currentDetails.ecpfName" readonly class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">License No.</label>
            <input type="text" :value="currentDetails.licenseNo" readonly class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Location</label>
            <input type="text" :value="currentDetails.location" readonly class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Name of Proprietor</label>
            <input type="text" :value="currentDetails.proprietorName" readonly class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">CID</label>
            <input type="text" :value="currentDetails.cid" readonly class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Contact No.</label>
            <input type="text" :value="currentDetails.contactNo" readonly class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Email Address</label>
            <input type="email" :value="currentDetails.emailAddress" readonly class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm" />
          </div>
        </div>

        <!-- Proposed Change (Editable Fields) -->
        <div>
          <h3 class="text-lg font-medium mb-2 text-gray-700">Proposed Change</h3>
          <div>
            <label for="proposedName" class="block text-sm font-medium text-gray-700">Proposed Name of ECPF</label>
            <input type="text" id="proposedName" v-model="proposedName" class="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm" />
          </div>
          <div class="mt-6">
            <label for="nameChangeRemarks" class="block text-sm font-medium text-gray-700">Declaration</label>
             <select
                v-model="nameChangeRemarks"
                class="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm"
                >
                <option value="">Select an Option</option>
                <option  value="agree">
                  Agree
                </option>
                 <option  value="disagree">
                  Disagree
                </option>
              </select>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="mt-6 flex justify-end space-x-4">
        <button @click="saveAsDraft" class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">Save as Draft</button>
        <button @click="editApplication" class="px-4 py-2 text-sm font-medium text-white bg-yellow-500 rounded-md hover:bg-yellow-600">Edit</button>
         <button @click="initiatePayment" class="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600">Initiate Payment</button>
        <button @click="emitSubmit" :disabled="nameChangeRemarks !== 'agree'" class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed">Submit</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, watch } from 'vue';

const props = defineProps({
  currentDetails: {
    type: Object,
    required: true,
    default: () => ({
      ecpfName: 'Auto',
      licenseNo: 'Auto',
      location: 'Auto',
      proprietorName: 'Auto',
      cid: 'Auto',
      contactNo: 'Auto',
      emailAddress: 'Auto',
    }),
  },
  initialData: { // Prop for initial data (optional, for editing)
        type: Object,
        default: () => ({})
  }
});

const proposedName = ref('');
const nameChangeRemarks = ref(''); // Now used for the dropdown

const emit = defineEmits(['submit', 'save-draft', 'initiate-payment', 'edit-application']);

const emitSubmit = () => {
   if (nameChangeRemarks.value !== 'agree') {
        alert('You must agree to the declaration before submitting.');
        return;
    }
    emit('submit', {
        proposedName: proposedName.value,
        nameChangeRemarks: nameChangeRemarks.value
    });
};

//watch for changes in the initialData prop
watch(() => props.initialData, (newData) => {
    proposedName.value = newData.proposedName || '';
    nameChangeRemarks.value = newData.nameChangeRemarks || '';
}, { immediate: true }); // Run immediately when the component is created


const saveAsDraft = () => {
  emit('save-draft', {
    proposedName: proposedName.value,
    nameChangeRemarks: nameChangeRemarks.value,
  });
};

const initiatePayment = () => {
  emit('initiate-payment');
};

const editApplication = () => {
    emit('edit-application', {
     proposedName: proposedName.value,
     nameChangeRemarks: nameChangeRemarks.value
    });
};
</script>
