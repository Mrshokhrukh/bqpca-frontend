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
            <input type="text" :value="currentDetails.ecpfName" readonly class="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm" />
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
            <label for="newLocation" class="block text-sm font-medium text-gray-700">New Location</label>
            <input type="text" id="newLocation" v-model="newLocation" class="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm" />
          </div>
          <div class="grid grid-cols-2 gap-4 mt-4">
            <div>
              <label for="gewogThrom" class="block text-sm font-medium text-gray-700">Gewog/Throm</label>
              <select id="gewogThrom" v-model="selectedGewogThrom" class="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm">
                <option value="">Select</option>
                <option v-for="option in gewogThromOptions" :key="option.value" :value="option.value">{{ option.label }}</option>
              </select>
            </div>
            <div>
              <label for="dzongkhagThromde" class="block text-sm font-medium text-gray-700">Dzongkhag/Thromde</label>
              <select id="dzongkhagThromde" v-model="selectedDzongkhagThromde" class="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm">
                <option value="">Select</option>
                <option v-for="option in dzongkhagThromdeOptions" :key="option.value" :value="option.value">{{ option.label }}</option>
              </select>
            </div>
          </div>
          <div class="mt-4">
              <label for="locationChangeRemarks" class="block text-sm font-medium text-gray-700">Declaration</label>
              <select
                v-model="locationChangeRemarks"
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
        <button @click="emitSubmit" :disabled="locationChangeRemarks !== 'agree'" class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed">Submit</button>
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
      location: 'Auto',
      proprietorName: 'Auto',
      cid: 'Auto',
      contactNo: 'Auto',
      emailAddress: 'Auto',
    }),
  },
  gewogThromOptions: {
    type: Array,
    required: true,
    default: () => [],
  },
  dzongkhagThromdeOptions: {
    type: Array,
    required: true,
    default: () => [],
  },
  initialData: {
    type: Object,
    default: () => ({}),
  },
});

const newLocation = ref('');
const selectedGewogThrom = ref('');
const selectedDzongkhagThromde = ref('');
const locationChangeRemarks = ref(''); //  for the dropdown

const emit = defineEmits(['submit', 'save-draft', 'initiate-payment','edit-application']);

const emitSubmit = () => {
    if (locationChangeRemarks.value !== 'agree') {
        alert("You must agree to the declaration to submit.")
        return
    }
  emit('submit', {
    newLocation: newLocation.value,
    selectedGewogThrom: selectedGewogThrom.value,
    selectedDzongkhagThromde: selectedDzongkhagThromde.value,
    locationChangeRemarks: locationChangeRemarks.value,
  });
};

// Watch for changes in initialData
watch(
  () => props.initialData,
  (newData) => {
    newLocation.value = newData.newLocation || '';
    selectedGewogThrom.value = newData.selectedGewogThrom || '';
    selectedDzongkhagThromde.value = newData.selectedDzongkhagThromde || '';
    locationChangeRemarks.value = newData.locationChangeRemarks || '';
  },
  { immediate: true }
);

const saveAsDraft = () => {
    emit('save-draft', {
        newLocation: newLocation.value,
        selectedGewogThrom: selectedGewogThrom.value,
        selectedDzongkhagThromde: selectedDzongkhagThromde.value,
        locationChangeRemarks: locationChangeRemarks.value
    });
};
const initiatePayment = () => {
    emit('initiate-payment');
};

const editApplication = () => {
    emit('edit-application', {
        newLocation: newLocation.value,
        selectedGewogThrom: selectedGewogThrom.value,
        selectedDzongkhagThromde: selectedDzongkhagThromde.value,
        locationChangeRemarks: locationChangeRemarks.value
    });
};
</script>
