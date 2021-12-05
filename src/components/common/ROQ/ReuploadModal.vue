<template>
  <div v-if="showModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
      <h3 class="text-lg font-semibold mb-4">Re-upload Application</h3>
      <label class="block text-sm font-medium text-gray-700 mb-2">Remarks</label>
      <textarea
        :value="remarks"
        @input="onInput"
        class="w-full border border-gray-300 rounded-md p-2 mb-4"
        rows="4"
        placeholder="Enter remarks for re-upload..."
      ></textarea>
      <div class="flex justify-end gap-2">
        <button @click="$emit('close')" class="px-4 py-2 bg-gray-200 rounded-md">Cancel</button>
        <button @click="submit" class="px-4 py-2 bg-blue-600 text-white rounded-md">Submit</button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  showModal: Boolean,
  application: Object,
  remarks: String,
})
const emit = defineEmits(['close', 'submit', 'update:remarks'])

const onInput = (e) => {
  emit('update:remarks', e.target.value)
}

const submit = () => {
  emit('submit')
}
</script>