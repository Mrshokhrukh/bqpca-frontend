<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-10 sm:px-6 lg:px-8">
      <header class="mb-8">
        <h1 class="text-3xl font-bold tracking-tight text-gray-900">
          Module Definition Management
        </h1>
        <p class="mt-1 text-base text-gray-500">
          A centralized hub to seamlessly add, view, and manage all educational module definitions.
        </p>
      </header>

      <div class="mb-6 flex justify-end">
        <button @click="openAddDefinitionModal" type="button" class="btn btn-primary">
          <PlusIcon class="mr-2 h-5 w-5" aria-hidden="true" />
          Add New Module Definition
        </button>
      </div>

      <div v-if="pageError" class="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 shadow-sm">
        <div class="flex">
          <div class="flex-shrink-0">
            <XCircleIcon class="h-6 w-6 text-red-400" aria-hidden="true" />
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">An Error Occurred</h3>
            <div class="mt-2 text-sm text-red-700">
              <p>{{ pageError }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
        <ModuleManagementModal ref="moduleDefinitionTableRef" @error="handleChildError" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import ModuleManagementModal from './ModuleManagementModal.vue'
import InstituteHeader from '@/components/common/MHPC/InstituteHeader.vue'
import { PlusIcon, XCircleIcon } from '@heroicons/vue/24/outline'

const moduleDefinitionTableRef = ref(null) // Renamed for clarity
const pageError = ref(null)

const openAddDefinitionModal = () => {
  if (moduleDefinitionTableRef.value) {
    moduleDefinitionTableRef.value.openAddModal() // Child component's method
  }
}

//   }
// }

const handleChildError = (errorMessage) => {
  pageError.value = errorMessage
  // Automatically clear the error message after 7 seconds
  setTimeout(() => {
    pageError.value = null
  }, 7000)
}

const modules = ref([
  { id: 1, name: 'Module A', description: 'Description for Module A' },
  { id: 2, name: 'Module B', description: 'Description for Module B' },
])
const searchQuery = ref('')
const isModalOpen = ref(false)
const modalTitle = ref('Add New Module')
const modalForm = ref({ id: null, name: '', description: '' })

const filteredModules = computed(() => {
  return modules.value.filter((module) =>
    module.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const openAddModuleModal = () => {
  modalTitle.value = 'Add New Module'
  modalForm.value = { id: null, name: '', description: '' }
  isModalOpen.value = true
}

const editModule = (module) => {
  modalTitle.value = 'Edit Module'
  modalForm.value = { ...module }
  isModalOpen.value = true
}

const deleteModule = (id) => {
  modules.value = modules.value.filter((module) => module.id !== id)
}

const handleModalSubmit = () => {
  if (modalForm.value.id) {
    const index = modules.value.findIndex((m) => m.id === modalForm.value.id)
    if (index !== -1) {
      modules.value[index] = { ...modalForm.value }
    }
  } else {
    const newId = Math.max(...modules.value.map((m) => m.id)) + 1
    modules.value.push({ ...modalForm.value, id: newId })
  }
  closeModal()
}

const closeModal = () => {
  isModalOpen.value = false
}
</script>

<style scoped>
/* Using Tailwind's @apply for maintainable and utility-first styling */
.btn {
  @apply inline-flex items-center justify-center rounded-md border border-transparent px-4 py-2 text-sm font-semibold shadow-sm ring-offset-white transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70;
}

.btn-primary {
  @apply bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500;
}
</style>
