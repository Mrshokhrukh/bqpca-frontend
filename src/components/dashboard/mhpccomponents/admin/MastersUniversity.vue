<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-50 p-4 lg:p-8">
    <div class="max-w-[1600px] mx-auto">
      <h1 class="text-3xl font-bold text-slate-900 mb-6 font-serif">University Management</h1>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-white rounded-lg shadow-sm border border-slate-200 p-6 h-fit sticky top-8">
          <h2 class="text-xl font-semibold text-slate-900 mb-4">
            {{ isEditing ? 'Edit University' : 'Add New University' }}
          </h2>
          <form @submit.prevent="handleSubmit">
            <div class="space-y-4">
              <div>
                <label for="country" class="block text-sm font-medium text-slate-700"
                  >Country Code</label
                >
                <input
                  type="text"
                  id="country"
                  v-model="formData.country"
                  class="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter country code (e.g., US, CA, AF)"
                  required
                  maxlength="2"
                  @input="formData.country = formData.country.toUpperCase()"
                />
              </div>
              <div>
                <label for="universityName" class="block text-sm font-medium text-slate-700"
                  >University Name</label
                >
                <input
                  type="text"
                  id="universityName"
                  v-model="formData.university"
                  class="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter university name"
                  required
                />
              </div>
              <div>
                <label for="instituteName" class="block text-sm font-medium text-slate-700"
                  >Institute Name</label
                >
                <input
                  type="text"
                  id="instituteName"
                  v-model="formData.institute_name"
                  class="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter institute name (optional)"
                />
              </div>

              <div class="flex gap-3">
                <button
                  type="submit"
                  :disabled="isLoading"
                  class="flex-1 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {{ isEditing ? `Update University` : `Add University` }}
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
              <h2 class="text-xl font-semibold text-slate-900">Universities List</h2>
              <span class="text-sm text-slate-500">
                {{ filteredUniversities.length }} University{{
                  filteredUniversities.length !== 1 ? 's' : ''
                }}
              </span>
            </div>

            <div class="relative">
              <input
                type="text"
                v-model="searchQuery"
                placeholder="Search by name, institute, or country..."
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
                v-for="university in paginatedUniversities"
                :key="university.id"
                class="p-4 border border-slate-200 rounded-lg hover:border-blue-200 hover:bg-blue-50/30 transition-colors duration-200"
              >
                <div class="flex justify-between items-start gap-4">
                  <div>
                    <h3 class="font-medium text-slate-900">{{ university.name }}</h3>
                    <p class="text-sm text-slate-600 mt-1">
                      Institute: {{ university.institute_name || 'N/A' }}
                    </p>
                    <p class="text-sm text-slate-600 mt-1">Country: {{ university.country }}</p>
                  </div>
                  <div class="flex gap-2 flex-shrink-0">
                    <button
                      @click="startEdit(university)"
                      class="p-2 text-blue-600 hover:bg-blue-50 rounded-md"
                      aria-label="Edit university"
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
                      @click="openDeleteModal(university)"
                      class="p-2 text-red-600 hover:bg-red-50 rounded-md"
                      aria-label="Delete university"
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
                Loading universities...
             </div>

            <div v-if="!isLoading && filteredUniversities.length === 0" class="text-center py-8">
              <p class="text-slate-500">
                 {{ searchQuery ? 'No universities match your search.' : 'No universities found.' }}
              </p>
            </div>
          </div>

          <div v-if="!isLoading && filteredUniversities.length > itemsPerPage" class="flex justify-center gap-2 mt-6">
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
            This action cannot be undone. This will permanently delete the university "<strong>{{
              universityToDelete?.name
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

const universities = ref([])
const formData = ref({
  id: null,
  country: '',
  university: '',
  institute_name: '',
})
const isEditing = ref(false)
const isLoading = ref(true)
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = 5

const isDeleteModalOpen = ref(false)
const universityToDelete = ref(null)

onMounted(async () => {
  isLoading.value = true
  try {
    const response = await services.getMhpcMastersUniversities()
    universities.value = response.data.results || []
  } catch (error) {
    console.error('Error fetching universities:', error)
  } finally {
      isLoading.value = false
  }
})

const filteredUniversities = computed(() => {
  if (!universities.value) return []
  const query = searchQuery.value.toLowerCase().trim()
  if (!query) {
    return universities.value
  }
  return universities.value.filter((university) => {
    return (
      university.name?.toLowerCase().includes(query) ||
      university.institute_name?.toLowerCase().includes(query) ||
      university.country?.toLowerCase().includes(query)
    )
  })
})

const totalPages = computed(() => {
  if (itemsPerPage <= 0 || filteredUniversities.value.length === 0) {
      return 1;
  }
  return Math.ceil(filteredUniversities.value.length / itemsPerPage)
})

const paginatedUniversities = computed(() => {
  if (currentPage.value > totalPages.value) {
return filteredUniversities.value.slice(0, itemsPerPage);
  }
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredUniversities.value.slice(start, end)
})

const handleSubmit = async () => {
    if (!formData.value.country || !formData.value.university) {
        console.error('Country and University Name are required.');
        return;
    }
    isLoading.value = true;

    const payload = {
        country: formData.value.country.toUpperCase(),
        name: formData.value.university, // Map formData.university to payload.name
        institute_name: formData.value.institute_name || '', // Send empty string if null/undefined
    };

  try {
    let response;
    if (isEditing.value && formData.value.id) {
      response = await services.updateMhpcMastersUniversity(formData.value.id, payload);
      const index = universities.value.findIndex((u) => u.id === formData.value.id);
      if (index !== -1) {
        universities.value.splice(index, 1, response.data);
      }
    } else {
        delete payload.id; // Ensure id is not sent on create
      response = await services.createMhpcMastersUniversity(payload);
      universities.value.unshift(response.data);
      currentPage.value = 1;
    }
    resetForm();
  } catch (error) {
    console.error('Error saving university:', error);
  } finally {
      isLoading.value = false;
  }
}

const startEdit = (university) => {
  formData.value = {
      id: university.id,
      country: university.country || '',
      university: university.name || '', // Map name from list item back to university in form
      institute_name: university.institute_name || '',
  }
  isEditing.value = true

  const formElement = document.querySelector('.sticky.top-8');
  if (formElement) {
    formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

const cancelEdit = () => {
  resetForm()
}

const openDeleteModal = (university) => {
  universityToDelete.value = university
  isDeleteModalOpen.value = true
}

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false
  setTimeout(() => {
      universityToDelete.value = null;
  }, 150);
}

const confirmDelete = async () => {
  if (!universityToDelete.value?.id) return

  isLoading.value = true;
  try {
    await services.deleteMhpcMastersUniversity(universityToDelete.value.id)
    const index = universities.value.findIndex((u) => u.id === universityToDelete.value.id)
    if (index !== -1) {
      universities.value.splice(index, 1)
       if (paginatedUniversities.value.length === 0 && currentPage.value > 1) {
          currentPage.value--;
       }
    }
    closeDeleteModal()
  } catch (error) {
    console.error('Error deleting university:', error)
    closeDeleteModal()
  } finally {
      isLoading.value = false;
  }
}

const resetForm = () => {
  formData.value = {
    id: null,
    country: '',
    university: '',
    institute_name: '',
  }
  isEditing.value = false
}

watch(searchQuery, () => {
  currentPage.value = 1
})

watch(universities, () => {
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
