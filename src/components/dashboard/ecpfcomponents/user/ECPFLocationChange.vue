<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
      <h2 class="text-2xl font-semibold mb-4 text-gray-800">II. ECPF Location Change</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
              <h3 class="text-lg font-medium mb-2 text-gray-700">Current Details</h3>
              <div class="grid grid-cols-2 gap-4">
                  <div>
                      <label class="block text-sm font-medium text-gray-700">ECPF Name:</label>
                      <p class="mt-1 text-sm text-gray-900">{{ currentDetails.ecpfName }}</p>
                  </div>
                  <div>
                      <label class="block text-sm font-medium text-gray-700">Location:</label>
                      <p class="mt-1 text-sm text-gray-900">{{ currentDetails.location }}</p>
                  </div>
                  <div>
                      <label class="block text-sm font-medium text-gray-700">Name of Proprietor:</label>
                      <p class="mt-1 text-sm text-gray-900">{{ currentDetails.proprietorName }}</p>
                  </div>
                  <div>
                      <label class="block text-sm font-medium text-gray-700">CID:</label>
                      <p class="mt-1 text-sm text-gray-900">{{ currentDetails.cid }}</p>
                  </div>
                  <div>
                      <label class="block text-sm font-medium text-gray-700">Contact No.:</label>
                      <p class="mt-1 text-sm text-gray-900">{{ currentDetails.contactNo }}</p>
                  </div>
                  <div>
                      <label class="block text-sm font-medium text-gray-700">Email Address:</label>
                      <p class="mt-1 text-sm text-gray-900">{{ currentDetails.emailAddress }}</p>
                  </div>
              </div>
          </div>

          <div>
              <h3 class="text-lg font-medium mb-4 text-gray-700">Proposed Change</h3>
              <div>
                  <label for="newLocation" class="block text-sm font-medium text-gray-700">Location:</label>
                  <input type="text" id="newLocation" v-model="newLocation"
                      class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
              </div>

              <div class="grid grid-cols-2 gap-4 mt-4">
                  <div>
                      <label for="gewogThrom" class="block text-sm font-medium text-gray-700">Gewog/Throm:</label>
                      <select id="gewogThrom" v-model="selectedGewogThrom"
                          class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                          <option value="">Select</option>
                          <option v-for="option in gewogThromOptions" :key="option.value" :value="option.value">{{
                              option.label }}</option>
                      </select>
                  </div>
                  <div>
                      <label for="dzongkhagThromde" class="block text-sm font-medium text-gray-700">Dzongkhag/Thromde:</label>
                      <select id="dzongkhagThromde" v-model="selectedDzongkhagThromde"
                          class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                          <option value="">Select</option>
                          <option v-for="option in dzongkhagThromdeOptions" :key="option.value" :value="option.value">{{
                              option.label }}</option>
                      </select>
                  </div>
              </div>

              <div class="mt-4">
                  <label for="locationChangeRemarks" class="block text-sm font-medium text-gray-700">Remarks:</label>
                  <textarea id="locationChangeRemarks" v-model="locationChangeRemarks" rows="3"
                      class="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
              </div>
          </div>

      </div>
      <div class="mt-8 flex justify-end">
          <button @click="emitSubmit"
              class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline">
              Submit
          </button>
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
  initialData: { // Prop for initial data (optional, for editing)
      type: Object,
      default: () => ({})
  }
});

const newLocation = ref('');
const selectedGewogThrom = ref('');
const selectedDzongkhagThromde = ref('');
const locationChangeRemarks = ref('');

const emit = defineEmits(['submit']);

const emitSubmit = () => {
  emit('submit', {
      newLocation: newLocation.value,
      selectedGewogThrom: selectedGewogThrom.value,
      selectedDzongkhagThromde: selectedDzongkhagThromde.value,
      locationChangeRemarks: locationChangeRemarks.value,
  });
};

// Watch for changes in initialData
watch(() => props.initialData, (newData) => {
  newLocation.value = newData.newLocation || '';
  selectedGewogThrom.value = newData.selectedGewogThrom || '';
  selectedDzongkhagThromde.value = newData.selectedDzongkhagThromde || '';
  locationChangeRemarks.value = newData.locationChangeRemarks || '';
}, { immediate: true });
</script>
