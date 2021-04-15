<template>
  <section class="p-6 bg-white rounded-lg shadow">
    <h2 class="text-xl font-semibold mb-4 text-blue-700">Fee & Charges</h2>
    <div v-if="fees.length === 0" class="text-center text-gray-500 py-4">
      Click "Add Fee Item" to define fees.
    </div>
    <div v-for="(fee, index) in fees" :key="index" class="mb-4 p-4 border rounded-md relative">
      <button
        type="button"
        @click="removeFee(index)"
        v-if="fees.length > 0"
        class="absolute top-2 right-2 text-red-500 hover:text-red-700 p-1 rounded-full bg-red-100 hover:bg-red-200"
        aria-label="Remove Fee"
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
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label :for="'feeBreakup-' + index" class="block text-sm font-medium text-gray-700"
            >Fee Breakup <span class="text-red-500">*</span></label
          >
          <!-- Changed: Use v-model directly -->
          <input
            type="text"
            :id="'feeBreakup-' + index"
            :value="fees[index].breakup"
            @input="
              (e) =>
                emit(
                  'update:fees',
                  fees.map((f, i) => (i === index ? { ...f, breakup: e.target.value } : f)),
                )
            "
            required
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label :for="'feeDescription-' + index" class="block text-sm font-medium text-gray-700"
            >Description</label
          >
          <!-- Changed: Use v-model directly -->
          <input
            type="text"
            :id="'feeDescription-' + index"
            :value="fees[index].description"
            @input="
              (e) =>
                emit(
                  'update:fees',
                  fees.map((f, i) => (i === index ? { ...f, description: e.target.value } : f)),
                )
            "
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label :for="'feeAmount-' + index" class="block text-sm font-medium text-gray-700"
            >Amount (Nu.) <span class="text-red-500">*</span></label
          >
          <!-- Changed: Use v-model directly -->
          <input
            type="number"
            :id="'feeAmount-' + index"
            :value="fees[index].amount"
            @input="
              (e) =>
                emit(
                  'update:fees',
                  fees.map((f, i) => (i === index ? { ...f, amount: Number(e.target.value) } : f)),
                )
            "
            required
            min="0"
            step="any"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      </div>
    </div>
    <div class="mt-4 flex items-center justify-between">
      <button
        type="button"
        @click="addFee"
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
      >
        Add Fee Item
      </button>
      <div class="text-right">
        <span class="text-lg font-semibold text-gray-800"
          >Total Amount: Nu. {{ totalFeeAmount.toFixed(2) }}</span
        >
      </div>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  fees: {
    type: Array,
    required: true,
  },
  totalFeeAmount: {
    type: Number,
    required: true,
  },
})

// Changed: Define emit once at the top level
const emit = defineEmits(['update:fees'])
// End Change

// Methods modify the prop array directly using emit
const addFee = () => {
  // Changed: Use the emit defined above
  emit('update:fees', [...props.fees, { breakup: '', description: '', amount: null }])
}

const removeFee = (index) => {
  // Changed: Use the emit defined above
  emit(
    'update:fees',
    props.fees.filter((_, i) => i !== index),
  )
}
</script>
