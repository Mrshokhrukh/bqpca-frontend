<script setup>
import Modal from './Modal.vue'
import { ref } from 'vue'

defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['close', 'add'])

const participantName = ref('')
const participantEmail = ref('')

const addParticipant = () => {
  emit('add', { name: participantName.value, email: participantEmail.value })
  emit('close')
}
</script>

<template>
  <Modal :title="'Add Participants'" :isOpen="isOpen" @close="emit('close')">
    <div>
      <label class="block text-sm font-medium text-gray-700">Name</label>
      <input v-model="participantName" type="text" class="mt-1 p-2 border rounded-lg w-full" />
      <label class="block text-sm font-medium text-gray-700 mt-4">Email</label>
      <input v-model="participantEmail" type="email" class="mt-1 p-2 border rounded-lg w-full" />
    </div>
    <template #footer>
      <button
        @click="addParticipant"
        class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
      >
        Add
      </button>
      <button
        @click="emit('close')"
        class="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
      >
        Cancel
      </button>
    </template>
  </Modal>
</template>
