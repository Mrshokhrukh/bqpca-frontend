<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div class="bg-white p-6 rounded-lg shadow-lg w-96">
      <h2 class="text-xl font-bold mb-4">Review Application</h2>
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Institute Name</label>
          <p class="mt-1 text-gray-900">{{ institute.name }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Location</label>
          <p class="mt-1 text-gray-900">{{ institute.location }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Status</label>
          <p class="mt-1 text-gray-900">
            {{ institute.eoiStatus === 'Pending' ? 'EOI Pending' : 'DPR Pending' }}
          </p>
        </div>
        <div v-if="showRejectReason">
          <label class="block text-sm font-medium text-gray-700">Rejection Reason</label>
          <textarea
            v-model="rejectionReason"
            class="mt-1 block w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
            placeholder="Enter rejection reason..."
          ></textarea>
        </div>
      </div>
      <div class="mt-6 flex justify-end space-x-2">
        <button
          @click="approve"
          class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
        >
          Approve
        </button>
        <button @click="reject" class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
          Regret
        </button>
        <button
          @click="closeModal"
          class="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useToast } from 'vue-toastification'

// Props
defineProps({
  institute: {
    type: Object,
    required: true,
  },
})

// Emits
const emit = defineEmits(['approve', 'reject', 'close'])
const toast = useToast()

// Reactive state
const showRejectReason = ref(false)
const rejectionReason = ref('')

// Methods
const approve = () => {
  emit('approve')
  closeModal()
}

const reject = () => {
  if (rejectionReason.value) {
    emit('reject', rejectionReason.value)
    closeModal()
  } else {
    toast.error('Please provide a rejection reason.')
  }
}

const closeModal = () => {
  emit('close')
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 500px;
  width: 100%;
  text-align: center;
}

h2 {
  margin-bottom: 16px;
}

p {
  margin-bottom: 20px;
}

button {
  margin: 5px;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-approve {
  background-color: #4caf50;
  color: white;
}

.btn-reject {
  background-color: #f44336;
  color: white;
}

.btn-submit-reject {
  background-color: #f44336;
  color: white;
  margin-top: 10px;
}

.btn-close {
  background-color: #f0f0f0;
  color: #333;
}

.reject-reason-section {
  margin-top: 16px;
}

.reject-reason-input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  resize: vertical;
}
</style>
