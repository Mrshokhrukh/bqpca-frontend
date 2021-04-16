<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-50 p-4 lg:p-8">
    <div class="max-w-[1600px] mx-auto">
      <h1 class="text-3xl font-bold text-slate-900 mb-6 font-serif">
        Participation Sub-Category Management
      </h1>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Left Column - Add/Edit Form -->
        <div class="bg-white rounded-lg shadow-sm border border-slate-200 p-6 h-fit sticky top-8">
          <h2 class="text-xl font-semibold text-slate-900 mb-4">
            {{
              isEditing ? 'Edit Participation Sub-Category' : 'Add New Participation Sub-Category'
            }}
          </h2>
          <form @submit.prevent="handleSubmit">
            <div class="space-y-4">
              <div>
                <label
                  for="participationSubCategoryName"
                  class="block text-sm font-medium text-slate-700"
                  >Sub-Category Name</label
                >
                <input
                  type="text"
                  id="participationSubCategoryName"
                  v-model="formData.name"
                  class="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter sub-category name"
                  required
                />
              </div>
              <div>
                <label
                  for="participationCategory"
                  class="block text-sm font-medium text-slate-700"
                  >Participation Category</label
                >
                <select
                  id="participationCategory"
                  v-model="formData.category_id"
                  class="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="" disabled>Select a category</option>
                  <option
                    v-for="category in participationCategories"
                    :key="category.id"
                    :value="category.id"
                  >
                    {{ category.name }}
                  </option>
                </select>
              </div>
              <div>
                <label
                  for="participationSubCategoryDescription"
                  class="block text-sm font-medium text-slate-700"
                  >Description</label
                >
                <textarea
                  id="participationSubCategoryDescription"
                  v-model="formData.description"
                  rows="4"
                  class="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter description"
                  required
                ></textarea>
              </div>

              <div class="flex gap-3">
                <button
                  type="submit"
                  :disabled="isLoading"
                  class="flex-1 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {{ isEditing ? 'Update Sub-Category' : 'Add Sub-Category' }}
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

        <!-- Right Column - Participation Sub-Categories List -->
        <div class="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div class="mb-6 space-y-4">
            <div class="flex justify-between items-center">
              <h2 class="text-xl font-semibold text-slate-900">
                Participation Sub-Categories List
              </h2>
              <span class="text-sm text-slate-500">
                {{ filteredParticipationSubCategories.length }} Sub-Categor{{
                  filteredParticipationSubCategories.length !== 1 ? 'ies' : 'y'
                }}
              </span>
            </div>

            <!-- Search Bar -->
            <div class="relative">
              <input
                type="text"
                v-model="searchQuery"
                placeholder="Search by name, description, or category..."
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

          <!-- Participation Sub-Categories Grid -->
          <div class="space-y-4 mb-6 min-h-[200px]">
            <TransitionGroup name="list">
              <div
                v-for="subCategory in paginatedParticipationSubCategories"
                :key="subCategory.id"
                class="p-4 border border-slate-200 rounded-lg hover:border-blue-200 hover:bg-blue-50/30 transition-colors duration-200"
              >
                <div class="flex justify-between items-start gap-4">
                  <div>
                    <h3 class="font-medium text-slate-900">
                      {{ subCategory.name }}
                    </h3>
                    <p class="text-sm text-slate-600 mt-1">
                      Desc: {{ subCategory.description }}
                    </p>
                    <p class="text-sm text-slate-600 mt-1">
                      Category: {{ getCategoryNameById(subCategory.participation_category?.id) }}
                    </p>
                  </div>
                  <div class="flex gap-2 flex-shrink-0">
                    <button
                      @click="startEdit(subCategory)"
                      class="p-2 text-blue-600 hover:bg-blue-50 rounded-md"
                      aria-label="Edit sub-category"
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
                      @click="openDeleteModal(subCategory)"
                      class="p-2 text-red-600 hover:bg-red-50 rounded-md"
                      aria-label="Delete sub-category"
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

            <!-- Loading State -->
             <div v-if="isLoading" class="text-center py-8 text-slate-500">
                Loading sub-categories...
             </div>

            <!-- Empty State -->
            <div v-if="!isLoading && filteredParticipationSubCategories.length === 0" class="text-center py-8">
              <p class="text-slate-500">
                 {{ searchQuery ? 'No sub-categories match your search.' : 'No sub-categories added yet.' }}
              </p>
            </div>
          </div>

          <!-- Pagination -->
          <div
            v-if="!isLoading && filteredParticipationSubCategories.length > itemsPerPage"
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

      <!-- Confirmation modal -->
      <AlertDialogRoot :open="isDeleteModalOpen" @update:open="isDeleteModalOpen = $event">
         <AlertDialogOverlay class="fixed inset-0 bg-black/50 z-40" />
        <AlertDialogContent
          class="fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-lg bg-white p-6 shadow-lg focus:outline-none z-50"
        >
          <AlertDialogTitle class="text-xl font-semibold text-slate-900 mb-2">
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription class="text-slate-600 mb-6">
            This action cannot be undone. This will permanently delete the sub-category "<strong>{{
              participationSubCategoryToDelete?.name
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
import services from '@/services/services' // Assuming services are correctly configured
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogOverlay,
  AlertDialogRoot,
  AlertDialogTitle,
} from 'radix-vue'

// State
const participationSubCategories = ref([])
const participationCategories = ref([]) // For the dropdown
const formData = ref({
  id: null,
  name: '',
  description: '',
  category_id: '', // <-- FIXED: Use ID field, initialize as empty string for default option
})
const isEditing = ref(false)
const isLoading = ref(true); // Add loading state
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = 5

const isDeleteModalOpen = ref(false)
const participationSubCategoryToDelete = ref(null)

// Fetch data on component mount
onMounted(async () => {
  isLoading.value = true;
  try {
    // Fetch categories first for the dropdown
    const categoryResponse = await services.getMhpcMastersMHPCParticipationCategories();
    participationCategories.value = categoryResponse.data.results || [];

    // Then fetch sub-categories
    const subCategoryResponse = await services.getMhpcMastersMhpcParticipationSubCategories();
    participationSubCategories.value = subCategoryResponse.data.results || [];

  } catch (error) {
    console.error('Error fetching data:', error)
    // Handle error state, e.g., show a notification
  } finally {
     isLoading.value = false;
  }
})

// Computed properties
const filteredParticipationSubCategories = computed(() => {
  if (!participationSubCategories.value) return [];
  const query = searchQuery.value.toLowerCase().trim();
  if (!query) {
    return participationSubCategories.value;
  }
  return participationSubCategories.value.filter((subCategory) => {
     const categoryName = getCategoryNameById(subCategory.participation_category?.id)?.toLowerCase() || '';
    return (
      subCategory.name?.toLowerCase().includes(query) ||
      subCategory.description?.toLowerCase().includes(query) ||
      categoryName.includes(query) // Search by category name
    );
  });
});


const totalPages = computed(() => {
  // Prevent division by zero if itemsPerPage is 0 or filtered list is empty
  if (itemsPerPage <= 0 || filteredParticipationSubCategories.value.length === 0) {
    return 1; // Always at least one page
  }
  return Math.ceil(filteredParticipationSubCategories.value.length / itemsPerPage)
})

const paginatedParticipationSubCategories = computed(() => {
  // Reset to page 1 if current page becomes invalid
  if (currentPage.value > totalPages.value) {
return filteredParticipationSubCategories.value.slice(
  (Math.min(currentPage.value, totalPages.value) - 1) * itemsPerPage,
  Math.min(currentPage.value, totalPages.value) * itemsPerPage
);
  }
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredParticipationSubCategories.value.slice(start, end)
})

// Methods
const handleSubmit = async () => {
  if (!formData.value.name || !formData.value.description || !formData.value.category_id) {
      console.error('Form is incomplete');
      // Optionally show user notification
      return;
  }

  isLoading.value = true; // Indicate processing
  const payload = { ...formData.value }; // Use the formData directly as it now holds the ID

  try {
    if (isEditing.value && formData.value.id) {
      const response = await services.updateMhpcMastersParticipationSubCategory(
        formData.value.id,
        payload,
      )
      const index = participationSubCategories.value.findIndex((dt) => dt.id === formData.value.id)
      if (index !== -1) {
        // Update reactively
        participationSubCategories.value.splice(index, 1, response.data);
      }
    } else {
      // Ensure ID is not part of the payload for creation
      delete payload.id;
      const response = await services.createMhpcMastersParticipationSubCategory(payload)
       // Add to the beginning
      participationSubCategories.value.unshift(response.data);
      currentPage.value = 1; // Go to first page
    }
    resetForm()
  } catch (error) {
    console.error('Error saving participation sub-category:', error)
     // Handle error state, e.g., show a notification
  } finally {
      isLoading.value = false; // Stop loading indicator
  }
}

const startEdit = (subCategory) => {
  // Populate form data, safely accessing nested category ID
  formData.value = {
    id: subCategory.id,
    name: subCategory.name || '',
    description: subCategory.description || '',
    // Use optional chaining and provide default null if category or id is missing
    category_id: subCategory.participation_category?.id ?? '', // <-- FIXED: Get ID
  };
  isEditing.value = true;
   // Scroll form into view smoothly (optional)
  const formElement = document.querySelector('.sticky.top-8'); // Adjust selector if needed
  if (formElement) {
    formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

const cancelEdit = () => {
  resetForm()
}

const openDeleteModal = (subCategory) => {
  participationSubCategoryToDelete.value = subCategory
  isDeleteModalOpen.value = true
}

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false
   setTimeout(() => {
    participationSubCategoryToDelete.value = null;
  }, 150);
}

const confirmDelete = async () => {
  if (!participationSubCategoryToDelete.value?.id) return

  isLoading.value = true;
  try {
    await services.deleteMhpcMastersParticipationSubCategory(
      participationSubCategoryToDelete.value.id,
    )
    const index = participationSubCategories.value.findIndex(
      (dt) => dt.id === participationSubCategoryToDelete.value.id,
    )
    if (index !== -1) {
      participationSubCategories.value.splice(index, 1)
      // Adjust pagination
       if (paginatedParticipationSubCategories.value.length === 0 && currentPage.value > 1) {
          currentPage.value--;
       }
    }
    closeDeleteModal()
  } catch (error) {
    console.error('Error deleting participation sub-category:', error)
     // Handle error state, e.g., show a notification
     closeDeleteModal(); // Still close modal on error
  } finally {
      isLoading.value = false;
  }
}

const resetForm = () => {
  formData.value = {
    id: null,
    name: '',
    description: '',
    category_id: '', // <-- FIXED: Reset to empty string for default option
  }
  isEditing.value = false
}

// Helper function to get category name by ID for display list
const getCategoryNameById = (categoryId) => {
  if (categoryId == null || !participationCategories.value?.length) {
      return 'N/A'; // Or 'Unknown' or ''
  }
  // Use loose equality (==) for flexibility (number vs string)
  const category = participationCategories.value.find(cat => cat.id == categoryId);
  return category ? category.name : 'Unknown';
}


// Watchers
watch(searchQuery, () => {
  currentPage.value = 1
})

watch(participationSubCategories, () => {
    // Adjust page if it becomes invalid after data changes
    if (currentPage.value > totalPages.value) {
        currentPage.value = Math.max(1, totalPages.value);
    }
}, { deep: true });

</script>

<style scoped>
/* Using same styles as previous component */
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

/* Focus styles */
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
