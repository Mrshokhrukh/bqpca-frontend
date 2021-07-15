<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div class="bg-white p-6 rounded-lg shadow-lg w-96">
      <h2 class="text-xl font-bold mb-4">Manage CAPA for {{ institute.name }}</h2>

      <!-- List of CAPA Issues -->
      <div class="space-y-4">
        <div v-for="(issue, index) in capaIssues" :key="index" class="border-b pb-4">
          <p class="text-sm text-gray-700">{{ issue.description }}</p>
          <p class="text-sm text-gray-500">Status: {{ issue.status }}</p>
          <div v-if="issue.status === 'Pending'">
            <textarea
              v-model="issue.remarks"
              class="mt-2 w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
              placeholder="Enter remarks..."
            ></textarea>
            <button
              @click="resolveIssue(index)"
              class="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Mark as Resolved
            </button>
          </div>
          <p v-if="issue.status === 'Resolved'" class="text-sm text-gray-500">
            Remarks: {{ issue.remarks || 'No remarks provided.' }}
          </p>
        </div>
      </div>

      <!-- Add New CAPA Issue -->
      <div class="mt-6">
        <textarea
          v-model="newIssue"
          class="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="3"
          placeholder="Enter new CAPA issue..."
        ></textarea>
        <button
          @click="addIssue"
          class="mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Add CAPA Issue
        </button>
      </div>

      <!-- Close Button -->
      <div class="mt-6 flex justify-end">
        <button
          @click="closeModal"
          class="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useToast } from 'vue-toastification'

const props = defineProps({
  institute: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['close', 'update-capa'])
const toast = useToast()

const newIssue = ref('')
const capaIssues = ref(props.institute.capaIssues || [])

// Watch for changes in the prop and update the local ref
watch(
  () => props.institute.capaIssues,
  (newCapaIssues) => {
    capaIssues.value = newCapaIssues || []
  },
  { deep: true },
)

const addIssue = () => {
  if (newIssue.value.trim()) {
    capaIssues.value.push({
      description: newIssue.value,
      status: 'Pending',
      remarks: '',
      timestamp: new Date().toLocaleString(),
    })
    emit('update-capa', capaIssues.value) // Emit after adding
    newIssue.value = ''
  }
}

const resolveIssue = (index) => {
  if (capaIssues.value[index] && capaIssues.value[index].remarks.trim()) {
    //check if it exists.
    capaIssues.value[index].status = 'Resolved'
    capaIssues.value[index].resolvedTimestamp = new Date().toLocaleString()
    emit('update-capa', capaIssues.value) // Emit after resolving
  } else {
    toast.error('Please provide remarks before resolving the issue.')
  }
}

const closeModal = () => {
  emit('close')
}
</script>
