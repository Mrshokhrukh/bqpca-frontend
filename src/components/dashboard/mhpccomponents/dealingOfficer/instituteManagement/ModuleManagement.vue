<template>
  <div class="w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-gray-50 min-h-screen">
    <InstituteHeader
      title="Module Definition Management"
      subtitle="Add, view, and manage all educational module definitions."
      :show-actions="false"
    />

    <div class="mt-8">
      <div class="flex justify-end mb-6">
        <button @click="openAddDefinitionModal" type="button" class="btn btn-primary">
          <PlusIcon class="w-5 h-5 mr-2 -ml-1" aria-hidden="true" />
          Add New Module Definition
        </button>
      </div>

      <div v-if="pageError" class="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 shadow-sm">
        <div class="flex">
          <div class="flex-shrink-0">
            <XCircleIcon class="h-6 w-6 text-red-500" aria-hidden="true" />
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-semibold text-red-800">An Error Occurred</h3>
            <p class="mt-1 text-sm text-red-700">{{ pageError }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
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
  // You might want to clear the error after some time or on user action
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
.btn {
  @apply inline-flex items-center justify-center rounded-lg border py-2.5 px-5 text-sm font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-150 disabled:opacity-70 disabled:cursor-not-allowed;
}
.btn-primary {
  @apply border-transparent bg-purple-600 text-white hover:bg-purple-700 focus:ring-purple-500;
}
.module-management {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
}
</style>
