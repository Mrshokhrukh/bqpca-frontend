<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-50 p-4 lg:p-8">
    <div class="max-w-[1600px] mx-auto">
      <h1 class="text-3xl font-bold text-slate-900 mb-6 font-serif">
        Qualification Type Management
      </h1>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-white rounded-lg shadow-sm border border-slate-200 p-6 h-fit sticky top-8">
          <h2 class="text-xl font-semibold text-slate-900 mb-4">
            {{ isEditing ? 'Edit Qualification Type' : 'Add New Qualification Type' }}
          </h2>
          <form @submit.prevent="handleSubmit">
            <div class="space-y-4">
              <div>
                <label for="qualificationTypeName" class="block text-sm font-medium text-slate-700"
                  >Qualification Type Name</label
                >
                <input
                  type="text"
                  id="qualificationTypeName"
                  v-model="formData.name"
                  class="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter qualification type name"
                  required
                />
              </div>
              <div>
                <label for="description" class="block text-sm font-medium text-slate-700"
                  >Description</label
                >
                <textarea
                  id="description"
                  v-model="formData.description"
                  rows="4"
                  class="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter description"
                ></textarea>
              </div>
              <div class="flex gap-3">
                <button
                  type="submit"
                  :disabled="isLoading"
                  class="flex-1 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {{ isEditing ? 'Update Qualification Type' : 'Add Qualification Type' }}
                </button>
                <button
                  v-if="isEditing"
                  type="button"
                  @click="cancelEdit"
                  class="py-2 px-4 bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>

        <div class="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div class="mb-6 space-y-4">
            <div class="flex justify-between items-center">
              <h2 class="text-xl font-semibold text-slate-900">Qualification Types List</h2>
              <span class="text-sm text-slate-500">
                {{ filteredQualificationTypes.length }} Qualification Type{{
                  filteredQualificationTypes.length !== 1 ? 's' : ''
                }}
              </span>
            </div>

            <div class="relative">
              <input
                type="text"
                v-model="searchQuery"
                placeholder="Search by name or description..."
                class="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <svg
                class="absolute left-3 top-2.5 h-5 w-5 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          <div class="space-y-4 mb-6 min-h-[200px]">
            <TransitionGroup name="list">
              <div
                v-for="qualificationType in paginatedQualificationTypes"
                :key="qualificationType.id"
                class="p-4 border border-slate-200 rounded-lg hover:border-blue-200 hover:bg-blue-50/30 transition-colors duration-200"
              >
                <div class="flex justify-between items-start gap-4">
                  <div>
                    <h3 class="font-medium text-slate-900">
                      {{ qualificationType.name }}
                    </h3>
                    <p class="text-sm text-slate-600 mt-1">{{ qualificationType.description }}</p>
                  </div>
                  <div class="flex gap-2 flex-shrink-0">
                    <button
                      @click="startEdit(qualificationType)"
                      class="p-2 text-blue-600 hover:bg-blue-50 rounded-md"
                      aria-label="Edit qualification type"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <button
                      @click="openDeleteModal(qualificationType)"
                      class="p-2 text-red-600 hover:bg-red-50 rounded-md"
                      aria-label="Delete qualification type"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </TransitionGroup>

            <div v-if="isLoading" class="text-center py-8 text-slate-500">
                Loading qualification types...
             </div>

            <div v-if="!isLoading && filteredQualificationTypes.length === 0" class="text-center py-8">
              <p class="text-slate-500">
                 {{ searchQuery ? 'No qualification types match your search.' : 'No qualification types found.' }}
              </p>
            </div>
          </div>

          <div
            v-if="!isLoading && filteredQualificationTypes.length > itemsPerPage"
            class="flex justify-center gap-2 mt-6"
          >
            <button
              @click="currentPage--"
              :disabled="currentPage === 1"
              class="px-3 py-1 rounded border border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
            >
              Previous
            </button>
            <span class="px-3 py-1 text-sm text-slate-600 flex items-center">
              Page {{ currentPage }} of {{ totalPages }}
            </span>
            <button
              @click="currentPage++"
              :disabled="currentPage === totalPages"
              class="px-3 py-1 rounded border border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <AlertDialogRoot :open="isDeleteModalOpen" @update:open="isDeleteModalOpen = $event">
         <AlertDialogOverlay class="fixed inset-0 bg-black/50 z-40" />
        <AlertDialogContent
          class="fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-lg bg-white p-6 shadow-lg focus:outline-none z-50"
        >
          <AlertDialogTitle class="text-xl font-semibold text-slate-900 mb-2">
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription class="text-slate-600 mb-6">
            This action cannot be undone. This will permanently delete the qualification type "<strong>{{
              qualificationTypeToDelete?.name
            }}</strong>".
          </AlertDialogDescription>
          <div class="flex justify-end gap-4">
            <AlertDialogCancel
              class="px-4 py-2 rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200 focus:ring-2 focus:ring-offset-2 focus:ring-slate-400"
              @click="closeDeleteModal"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              class="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              @click="confirmDelete"
            >
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialogRoot>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import services from '@/services/services'
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogOverlay,
  AlertDialogRoot,
  AlertDialogTitle,
} from 'radix-vue'

const qualificationTypes = ref([])
const formData = ref({
  id: null,
  name: '',
  description: '',
})
const isEditing = ref(false)
const isLoading = ref(true)
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = 5

const isDeleteModalOpen = ref(false)
const qualificationTypeToDelete = ref(null)

onMounted(async () => {
  isLoading.value = true
  try {
    const response = await services.getMhpcMastersQualificationTypes()
    qualificationTypes.value = response.data.results || []
  } catch (error) {
    console.error('Error fetching qualification types:', error)
  } finally {
    isLoading.value = false
  }
})

const filteredQualificationTypes = computed(() => {
  if (!qualificationTypes.value) return []
  const query = searchQuery.value.toLowerCase().trim()
  if (!query) {
    return qualificationTypes.value
  }
  return qualificationTypes.value.filter((qualificationType) => {
    return (
      qualificationType.name?.toLowerCase().includes(query) ||
      qualificationType.description?.toLowerCase().includes(query)
    )
  })
})

const totalPages = computed(() => {
  if (itemsPerPage <= 0 || filteredQualificationTypes.value.length === 0) {
    return 1
  }
  return Math.ceil(filteredQualificationTypes.value.length / itemsPerPage)
})

const paginatedQualificationTypes = computed(() => {
  if (currentPage.value > totalPages.value) {
return filteredQualificationTypes.value.slice(start, end)
  }
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredQualificationTypes.value.slice(start, end)
})

const handleSubmit = async () => {
  if (!formData.value.name) {
      console.error('Qualification Type Name is required.');
      return;
  }

  isLoading.value = true
  const payload = { ...formData.value }

  // Ensure description is sent, even if empty, if API expects it
   if (payload.description === undefined) {
       payload.description = '';
   }

  try {
    let response
    if (isEditing.value && formData.value.id) {
      response = await services.updateMhpcMastersQualificationType(
        formData.value.id,
        payload,
      )
      const index = qualificationTypes.value.findIndex((qt) => qt.id === formData.value.id)
      if (index !== -1) {
        qualificationTypes.value.splice(index, 1, response.data)
      }
    } else {
      delete payload.id; // Ensure id is not sent for create
      response = await services.createMhpcMastersQualificationType(payload)
      qualificationTypes.value.unshift(response.data)
      currentPage.value = 1
    }
    resetForm()
  } catch (error) {
    console.error('Error saving qualification type:', error)
  } finally {
    isLoading.value = false
  }
}

const startEdit = (qualificationType) => {
  formData.value = {
      id: qualificationType.id,
      name: qualificationType.name || '',
      description: qualificationType.description || '',
  }
  isEditing.value = true

  const formElement = document.querySelector('.sticky.top-8')
  if (formElement) {
    formElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

const cancelEdit = () => {
  resetForm()
}

const openDeleteModal = (qualificationType) => {
  qualificationTypeToDelete.value = qualificationType
  isDeleteModalOpen.value = true
}

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false
  setTimeout(() => {
    qualificationTypeToDelete.value = null
  }, 150)
}

const confirmDelete = async () => {
  if (!qualificationTypeToDelete.value?.id) return

  isLoading.value = true
  try {
    await services.deleteMhpcMastersQualificationType(qualificationTypeToDelete.value.id)
    const index = qualificationTypes.value.findIndex(
      (qt) => qt.id === qualificationTypeToDelete.value.id,
    )
    if (index !== -1) {
      qualificationTypes.value.splice(index, 1)
       if (paginatedQualificationTypes.value.length === 0 && currentPage.value > 1) {
          currentPage.value--;
       }
    }
    closeDeleteModal()
  } catch (error) {
    console.error('Error deleting qualification type:', error)
    closeDeleteModal()
  } finally {
    isLoading.value = false
  }
}

const resetForm = () => {
  formData.value = {
    id: null,
    name: '',
    description: '',
  }
  isEditing.value = false
}

watch(searchQuery, () => {
  currentPage.value = 1
})

watch(qualificationTypes, () => {
    if (currentPage.value > totalPages.value) {
        currentPage.value = Math.max(1, totalPages.value);
    }
}, { deep: true });

</script>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.4s ease-out;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
.list-move {
  transition: transform 0.4s ease;
}
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
input:focus,
textarea:focus,
select:focus,
button:focus-visible {
  outline: 2px solid theme('colors.blue.500');
  outline-offset: 1px;
  border-color: transparent !important;
}
.radix-vue-alert-dialog-trigger:focus-visible,
.radix-vue-alert-dialog-cancel:focus-visible,
.radix-vue-alert-dialog-action:focus-visible {
    outline: 2px solid theme('colors.blue.500');
    outline-offset: 2px;
}
</style>
