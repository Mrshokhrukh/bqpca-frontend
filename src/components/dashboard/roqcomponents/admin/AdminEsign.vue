<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-50 p-4 lg:p-8">
    <div class="max-w-[1600px] mx-auto">
      <h1 class="text-3xl font-bold text-slate-900 mb-6 font-serif">E-Signature Management</h1>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Left Column - Add/Edit Form -->
        <div class="bg-white rounded-lg shadow-sm border border-slate-200 p-6 h-fit sticky top-8">
          <h2 class="text-xl font-semibold text-slate-900 mb-4">
            {{ isEditing ? 'Edit E-Signature' : 'Add New E-Signature' }}
          </h2>
          <form @submit.prevent="handleSubmit" enctype="multipart/form-data">
            <div class="space-y-4">
              <div>
                <label for="name" class="block text-sm font-medium text-slate-700">Name</label>
                <input
                  type="text"
                  id="name"
                  v-model="formData.name"
                  class="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter name"
                  required
                />
              </div>
              <div>
                <label for="designation" class="block text-sm font-medium text-slate-700"
                  >Designation</label
                >
                <input
                  type="text"
                  id="designation"
                  v-model="formData.designation"
                  class="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter designation"
                  required
                />
              </div>
              <div>
                <label for="signature" class="block text-sm font-medium text-slate-700"
                  >Signature (PNG)</label
                >
                <input
                  type="file"
                  id="signature"
                  @change="handleFileUpload"
                  accept="image/png"
                  class="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  :required="!isEditing"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700">Status</label>
                <div class="mt-2">
                  <label class="inline-flex items-center">
                    <input
                      type="checkbox"
                      v-model="formData.status"
                      class="rounded border-slate-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                    <span class="ml-2">Active</span>
                  </label>
                </div>
              </div>
              <div class="flex gap-3">
                <button
                  type="submit"
                  class="flex-1 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  :disabled="loading"
                >
                  <span v-if="loading" class="inline-flex items-center">
                    <svg
                      class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        class="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        stroke-width="4"
                      ></circle>
                      <path
                        class="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      ></path>
                    </svg>
                    Processing...
                  </span>
                  <span v-else>{{ isEditing ? 'Update E-Signature' : 'Add E-Signature' }}</span>
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
        <!-- Right Column - List -->
        <div class="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div class="mb-6 space-y-4">
            <div class="flex justify-between items-center">
              <h2 class="text-xl font-semibold text-slate-900">E-Signatures List</h2>
              <span class="text-sm text-slate-500">
                {{ filteredSignatures.length }} Signature{{
                  filteredSignatures.length !== 1 ? 's' : ''
                }}
              </span>
            </div>
            <!-- Search Bar -->
            <div class="relative">
              <input
                type="text"
                v-model="searchQuery"
                placeholder="Search signatures..."
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
          <!-- Signatures Grid -->
          <div class="space-y-4 mb-6">
            <TransitionGroup name="list">
              <div
                v-for="signature in paginatedSignatures"
                :key="signature.id"
                class="p-4 border border-slate-200 rounded-lg hover:border-blue-200 hover:bg-blue-50/30 transition-colors duration-200"
              >
                <div class="flex justify-between items-start gap-4">
                  <div class="flex-grow">
                    <h3 class="font-medium text-slate-900">{{ signature.name }}</h3>
                    <p class="text-sm text-slate-600 mt-1">{{ signature.designation }}</p>
                    <p class="text-sm text-slate-500 mt-1">
                      Status:
                      <span :class="signature.status ? 'text-green-600' : 'text-red-600'">
                        {{ signature.status ? 'Active' : 'Inactive' }}
                      </span>
                    </p>
                  </div>
                  <div class="flex gap-2">
                    <button
                      @click="startEdit(signature)"
                      class="p-2 text-blue-600 hover:bg-blue-50 rounded-md"
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
                      @click="openDeleteModal(signature)"
                      class="p-2 text-red-600 hover:bg-red-50 rounded-md"
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
            <!-- Empty State -->
            <div v-if="filteredSignatures.length === 0" class="text-center py-8">
              <p class="text-slate-500">No e-signatures found</p>
            </div>
          </div>
          <!-- Pagination -->
          <div v-if="filteredSignatures.length > itemsPerPage" class="flex justify-center gap-2">
            <button
              @click="currentPage--"
              :disabled="currentPage === 1"
              class="px-3 py-1 rounded border border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50"
            >
              Previous
            </button>
            <span class="px-3 py-1 text-sm text-slate-600">
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
      <!-- Delete Confirmation Modal -->
      <AlertDialogRoot :open="isDeleteModalOpen" @update:open="isDeleteModalOpen = $event">
        <AlertDialogContent
          class="fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-lg bg-white p-6 shadow-lg focus:outline-none z-50"
        >
          <AlertDialogTitle class="text-xl font-semibold text-slate-900 mb-2">
            Delete Confirmation
          </AlertDialogTitle>
          <AlertDialogDescription class="text-slate-600 mb-6">
            Are you sure you want to delete the e-signature for "{{ signatureToDelete?.name }}"?
            This action cannot be undone.
          </AlertDialogDescription>
          <div class="flex justify-end gap-4">
            <AlertDialogCancel
              class="px-4 py-2 rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200"
              @click="closeDeleteModal"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              class="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
              :disabled="loading"
              @click="confirmDelete"
            >
              {{ loading ? 'Deleting...' : 'Delete' }}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
        <AlertDialogOverlay class="fixed inset-0 bg-black/50 z-40" />
      </AlertDialogRoot>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useToast } from 'vue-toastification'
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

const toast = useToast()

// State
const signatures = ref([])
const formData = ref({
  id: null,
  name: '',
  designation: '',
  signature: null,
  status: true,
})
const loading = ref(false)
const isEditing = ref(false)
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = 5
const isDeleteModalOpen = ref(false)
const signatureToDelete = ref(null)

const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB in bytes

// Computed Properties
const filteredSignatures = computed(() => {
  const query = searchQuery.value.toLowerCase()
  return signatures.value.filter(
    (signature) =>
      signature.name.toLowerCase().includes(query) ||
      signature.designation.toLowerCase().includes(query),
  )
})

const totalPages = computed(() => Math.ceil(filteredSignatures.value.length / itemsPerPage))

const paginatedSignatures = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredSignatures.value.slice(start, end)
})

// Methods
const fetchSignatures = async () => {
  try {
    loading.value = true
    const response = await services.getESignature() // Changed from getMastersESignatures
    signatures.value = response.data.results
  } catch (error) {
    console.error('Error fetching signatures:', error)
    toast.error('Failed to load e-signatures')
  } finally {
    loading.value = false
  }
}

const handleFileUpload = (event) => {
  const file = event.target.files[0]

  // Reset file input if validation fails
  const resetInput = () => {
    event.target.value = ''
    formData.value.signature = null
  }

  // Validate file type
  if (!file || file.type !== 'image/png') {
    toast.error('Please upload a PNG file only')
    resetInput()
    return
  }

  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    toast.error('File size must be less than 2MB')
    resetInput()
    return
  }

  formData.value.signature = file
  toast.success('File selected successfully')
}

const handleSubmit = async () => {
  try {
    loading.value = true
    const data = new FormData()
    data.append('name', formData.value.name)
    data.append('designation', formData.value.designation)
    data.append('status', formData.value.status)
    if (formData.value.signature) {
      data.append('signature', formData.value.signature)
    }

    if (isEditing.value) {
      await services.updateESignature(formData.value.id, data) // Changed from updateMastersESignature
      toast.success('E-signature updated successfully')
    } else {
      await services.createESignature(data) // Changed from createMastersESignature
      toast.success('E-signature added successfully')
    }

    resetForm()
    fetchSignatures()
  } catch (error) {
    console.error('Error saving e-signature:', error)
    toast.error(error.response?.data?.message || 'Failed to save e-signature')
  } finally {
    loading.value = false
  }
}

const startEdit = (signature) => {
  formData.value = {
    id: signature.id,
    name: signature.name,
    designation: signature.designation,
    signature: null,
    status: signature.status,
  }
  isEditing.value = true
}

const cancelEdit = () => {
  resetForm()
}

const openDeleteModal = (signature) => {
  signatureToDelete.value = signature
  isDeleteModalOpen.value = true
}

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false
  signatureToDelete.value = null
}

const confirmDelete = async () => {
  if (!signatureToDelete.value) return

  try {
    loading.value = true
    await services.deleteESignature(signatureToDelete.value.id) // Changed from deleteMastersESignature
    toast.success('E-signature deleted successfully')
    fetchSignatures()
    closeDeleteModal()
  } catch (error) {
    console.error('Error deleting e-signature:', error)
    toast.error('Failed to delete e-signature')
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  formData.value = {
    id: null,
    name: '',
    designation: '',
    signature: null,
    status: true,
  }
  isEditing.value = false
}

// Watchers
watch(searchQuery, () => {
  currentPage.value = 1
})

// Lifecycle Hooks
onMounted(() => {
  fetchSignatures()
})
</script>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.list-move {
  transition: transform 0.3s ease;
}
</style>
