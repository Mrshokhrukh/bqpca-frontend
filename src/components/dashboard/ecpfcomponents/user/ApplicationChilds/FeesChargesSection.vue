<template>
  <section class="p-6 bg-white rounded-lg shadow">
    <h2 class="text-xl font-semibold mb-4 text-indigo-700">Fee & Charges</h2>
    <div v-if="fees.length === 0" class="text-center text-gray-500 py-4">
      Click "Add Fee Item" to define fees.
    </div>
    <div v-for="(fee, index) in fees" :key="index" class="mb-4 p-4 border rounded-md relative">
      <button type="button" @click="removeFee(index)" v-if="fees.length > 0"
        class="absolute top-2 right-2 text-red-500 hover:text-red-700 p-1 rounded-full bg-red-100 hover:bg-red-200"
        aria-label="Remove Fee">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label :for="'feeBreakup-' + index" class="block text-sm font-medium text-gray-700">Fee Breakup <span
              class="text-red-500">*</span></label>
          <input type="text" :id="'feeBreakup-' + index" v-model="fee.breakup" required
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
        </div>
        <div>
          <label :for="'feeDescription-' + index" class="block text-sm font-medium text-gray-700">Description</label>
          <input type="text" :id="'feeDescription-' + index" v-model="fee.description"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
        </div>
        <div>
          <label :for="'feeAmount-' + index" class="block text-sm font-medium text-gray-700">Amount (Nu.) <span
              class="text-red-500">*</span></label>
          <input type="number" :id="'feeAmount-' + index" v-model.number="fee.amount" required min="0" step="any"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
        </div>
      </div>
    </div>
    <div class="mt-4 flex items-center justify-between">
      <button type="button" @click="addFee"
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
        Add Fee Item
      </button>
      <div class="text-right">
        <span class="text-lg font-semibold text-gray-800">Total Amount: Nu. {{ totalFeeAmount.toFixed(2) }}</span>
      </div>
    </div>
  </section>
</template>

<script setup>

const props = defineProps({
  fees: {
    type: Array,
    required: true
  },
  totalFeeAmount: { // Receive total from parent
    type: Number,
    required: true
  }
});

// Methods modify the prop array directly
const addFee = () => {
  const emit = defineEmits(['update:fees']);
  emit('update:fees', [...props.fees, { breakup: '', description: '', amount: null }]);
};

const removeFee = (index) => {
  // Keep the logic to prevent removing the last item if desired,
  // or allow removing all items. Let's allow removing all for now.
  const emit = defineEmits(['update:fees']);
  emit('update:fees', props.fees.filter((_, i) => i !== index));
  // If you want to ensure at least one item:
  // if (props.fees.length > 1) {
  //    props.fees.splice(index, 1);
  // } else if (props.fees.length === 1) {
  //     // Clear the fields of the last remaining item
  //     Object.assign(props.fees[0], { breakup: '', description: '', amount: null });
  //     alert("At least one fee item structure is recommended. Please fill it or add a new one.");
  // }
};
</script>