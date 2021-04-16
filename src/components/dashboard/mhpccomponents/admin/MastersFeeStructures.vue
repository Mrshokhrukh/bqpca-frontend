<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-50 p-4 lg:p-8">
    <div class="max-w-[1600px] mx-auto">
      <h1 class="text-3xl font-bold text-slate-900 mb-6 font-serif">Fee Structure Management</h1>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Left Column - Add/Edit Form -->
        <div class="bg-white rounded-lg shadow-sm border border-slate-200 p-6 h-fit sticky top-8">
          <h2 class="text-xl font-semibold text-slate-900 mb-4">
            {{ isEditing ? 'Edit Fee Structure' : 'Add New Fee Structure' }}
          </h2>
          <form @submit.prevent="handleSubmit">
            <div class="space-y-4">
              <div>
                <label for="feeName" class="block text-sm font-medium text-slate-700"
                  >Fee Name</label
                >
                <input
                  type="text"
                  id="feeName"
                  v-model="formData.name"
                  class="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter fee name"
                  required
                />
              </div>
              <div>
                <label for="feeAmount" class="block text-sm font-medium text-slate-700"
                  >Fee Amount</label
                >
                <input
                  type="number"
                  id="feeAmount"
                  v-model="formData.fee_amount"
                  class="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter fee amount"
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
                  required
                ></textarea>
              </div>
              <div>
                <label for="feeAssociatedFor" class="block text-sm font-medium text-slate-700"
                  >Fee Associated For</label
                >
                <select
                  id="feeAssociatedFor"
                  v-model="formData.fee_category_id"
                  class="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="" disabled>Select a category</option>
                  <option
                    v-for="feeFor in feeAssociatedForOptions"
                    :key="feeFor.id"
                    :value="feeFor.id"
                  >
                    {{ feeFor.name }}
                  </option>
                </select>
              </div>
              <div class="flex gap-3">
                <button
                  type="submit"
                  class="flex-1 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {{ isEditing ? 'Update Fee Structure' : 'Add Fee Structure' }}
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

        <!-- Right Column - Fee Structures List -->
        <div class="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div class="mb-6 space-y-4">
            <div class="flex justify-between items-center">
              <h2 class="text-xl font-semibold text-slate-900">Fee Structures List</h2>
              <span class="text-sm text-slate-500">
                {{ filteredFeeStructures.length }} Fee Structure{{
                  filteredFeeStructures.length !== 1 ? 's' : ''
                }}
              </span>
            </div>

            <!-- Search Bar -->
            <div class="relative">
              <input
                type="text"
                v-model="searchQuery"
                placeholder="Search Fee Structures..."
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

          <!-- Fee Structures Grid -->
          <div class="space-y-4 mb-6">
            <TransitionGroup name="list">
              <div
                v-for="feeStructure in paginatedFeeStructures"
                :key="feeStructure.id"
                class="p-4 border border-slate-200 rounded-lg hover:border-blue-200 hover:bg-blue-50/30 transition-colors duration-200"
              >
                <div class="flex justify-between items-start gap-4">
                  <div>
                    <h3 class="font-medium text-slate-900">{{ feeStructure.name }}</h3>
                    <p class="text-sm text-slate-600 mt-1">Amount: {{ feeStructure.fee_amount }}</p>
                    <p class="text-sm text-slate-600 mt-1">Desc: {{ feeStructure.description }}</p>
                    <p class="text-sm text-slate-600 mt-1">
                      Category: {{ getFeeAssociatedForName(feeStructure.fee_category?.id) }} 
                    </p>
                  </div>
                  <div class="flex gap-2 flex-shrink-0">
                    <button
                      @click="startEdit(feeStructure)"
                      class="p-2 text-blue-600 hover:bg-blue-50 rounded-md"
                      aria-label="Edit fee structure"
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
                      @click="openDeleteModal(feeStructure)"
                      class="p-2 text-red-600 hover:bg-red-50 rounded-md"
                      aria-label="Delete fee structure"
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
            <div v-if="filteredFeeStructures.length === 0 && !isLoading" class="text-center py-8">
                <p class="text-slate-500">
                    {{ searchQuery ? 'No fee structures match your search.' : 'No fee structures added yet.' }}
                </p>
            </div>
             <!-- Loading State -->
             <div v-if="isLoading" class="text-center py-8">
                <p class="text-slate-500">Loading fee structures...</p>
                <!-- Optional: Add a spinner -->
             </div>
          </div>

          <!-- Pagination -->
          <div v-if="!isLoading && filteredFeeStructures.length > itemsPerPage" class="flex justify-center gap-2 mt-6">
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
            This action cannot be undone. This will permanently delete the fee structure "<strong>{{
              feeStructureToDelete?.name
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
const feeStructures = ref([])
const feeAssociatedForOptions = ref([])
const formData = ref({
  id: null,
  name: '',
  fee_amount: '',
  description: '',
  fee_category_id: '',
})
const isEditing = ref(false)
const isLoading = ref(true); // Add loading state
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = 5

const isDeleteModalOpen = ref(false)
const feeStructureToDelete = ref(null)

// Fetch data on component mount
onMounted(async () => {
  isLoading.value = true;
  try {
    const [feeStructuresResponse, feeAssociatedForResponse] = await Promise.all([
      services.getMhpcMastersFeeStructures(),
      services.getMhpcMastersFeesAssociatedFor(),
    ])
    feeStructures.value = feeStructuresResponse.data.results || [] // Ensure it's an array
    feeAssociatedForOptions.value = feeAssociatedForResponse.data.results || [] // Ensure it's an array
  } catch (error) {
    console.error('Error fetching data:', error)
    // Handle error state, e.g., show a notification to the user
  } finally {
     isLoading.value = false;
  }
})

// Computed properties
const filteredFeeStructures = computed(() => {
  if (!feeStructures.value) return []; // Guard against null/undefined
  const query = searchQuery.value.toLowerCase().trim();
  if (!query) {
    return feeStructures.value;
  }
  return feeStructures.value.filter((feeStructure) => {
    const categoryName = getFeeAssociatedForName(feeStructure.fee_category?.id)?.toLowerCase() || '';
    return (
      feeStructure.name?.toLowerCase().includes(query) ||
      feeStructure.description?.toLowerCase().includes(query) ||
      feeStructure.fee_amount?.toString().includes(query) || // Allow search by amount
      categoryName.includes(query) // Allow search by category name
    );
  });
});


const totalPages = computed(() => {
  return Math.ceil(filteredFeeStructures.value.length / itemsPerPage)
})

const paginatedFeeStructures = computed(() => {
  // Reset to page 1 if current page becomes invalid after filtering
  if (currentPage.value > totalPages.value) {
return filteredFeeStructures.value.slice(start, end)
  }
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredFeeStructures.value.slice(start, end)
})

// Methods
const handleSubmit = async () => {
  // Basic validation (consider adding more robust validation)
  if (!formData.value.name || !formData.value.fee_amount || !formData.value.description || !formData.value.fee_category_id) {
      console.error('Form is incomplete');
      // Optionally show a user notification
      return;
  }

  // Prepare data, ensuring fee_amount is a number if required by backend
  const payload = {
    ...formData.value,
    fee_amount: parseFloat(formData.value.fee_amount) || 0, // Ensure it's a number
  };

  try {
    if (isEditing.value && formData.value.id) {
      const response = await services.updateMhpcMastersFeeStructure(
        formData.value.id,
        payload, // Use prepared payload
      )
      const index = feeStructures.value.findIndex((fs) => fs.id === formData.value.id)
      if (index !== -1) {
        // Update the item in the array reactively
        feeStructures.value.splice(index, 1, response.data);
      }
    } else {
      const response = await services.createMhpcMastersFeeStructure(payload) // Use prepared payload
       // Add to the beginning of the list for better UX
      feeStructures.value.unshift(response.data)
      currentPage.value = 1; // Go to first page to see the new item
    }
    resetForm()
  } catch (error) {
    console.error('Error saving fee structure:', error)
    // Handle error state, e.g., show a notification
  }
}

const startEdit = (feeStructure) => {
  // Ensure all fields exist on the feeStructure object before assigning
  formData.value = {
    id: feeStructure.id,
    name: feeStructure.name || '',
    fee_amount: feeStructure.fee_amount || '',
    description: feeStructure.description || '',
    fee_category_id: feeStructure.fee_category?.id || '', // Get ID from nested object
  }
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

const openDeleteModal = (feeStructure) => {
  feeStructureToDelete.value = feeStructure
  isDeleteModalOpen.value = true
}

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false
  // Delay resetting feeStructureToDelete slightly to avoid flicker in modal text
  setTimeout(() => {
    feeStructureToDelete.value = null;
  }, 150); // Adjust timing as needed
}

const confirmDelete = async () => {
  if (!feeStructureToDelete.value?.id) return

  try {
    await services.deleteMhpcMastersFeeStructure(feeStructureToDelete.value.id)
    const index = feeStructures.value.findIndex((fs) => fs.id === feeStructureToDelete.value.id)
    if (index !== -1) {
      feeStructures.value.splice(index, 1)
      // Adjust pagination if the last item on a page was deleted
       if (paginatedFeeStructures.value.length === 0 && currentPage.value > 1) {
          currentPage.value--;
       }
    }
    closeDeleteModal()
  } catch (error) {
    console.error('Error deleting fee structure:', error)
     // Handle error state, e.g., show a notification
    closeDeleteModal(); // Close modal even if delete failed
  }
}

const resetForm = () => {
  formData.value = {
    id: null,
    name: '',
    fee_amount: '',
    description: '',
    fee_category_id: '', // Reset to empty string for the default option
  }
  isEditing.value = false
}

const getFeeAssociatedForName = (feeAssociatedForId) => {
  // Guard against null/undefined ID and ensure options are loaded
  if (feeAssociatedForId == null || !feeAssociatedForOptions.value?.length) {
    return 'Unknown';
  }
  // Use loose equality (==) in case IDs are numbers in one place and strings in another
  const feeFor = feeAssociatedForOptions.value.find((f) => f.id == feeAssociatedForId)
  return feeFor ? feeFor.name : 'Unknown';
}

// Watch for search query changes to reset pagination
watch(searchQuery, () => {
  currentPage.value = 1
})

// Watch for changes in feeStructures to potentially reset pagination if needed
// (e.g., if external changes modify the list)
watch(feeStructures, () => {
    if (currentPage.value > totalPages.value) {
        currentPage.value = Math.max(1, totalPages.value);
    }
}, { deep: true });

</script>

<style scoped>
/* Add smooth transition for list items */
.list-enter-active,
.list-leave-active {
  transition: all 0.4s ease-out; /* Slightly longer duration */
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(20px); /* Animate vertically */
}

/* Ensure moving items animate smoothly */
.list-move {
  transition: transform 0.4s ease;
}

/* Style for disabled pagination buttons */
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Improve focus states for accessibility */
input:focus,
textarea:focus,
select:focus,
button:focus-visible {
  outline: 2px solid theme('colors.blue.500');
  outline-offset: 1px;
  border-color: transparent !important; /* Override default border on focus */
}
/* Specific focus for Radix buttons */
.radix-vue-alert-dialog-trigger:focus-visible,
.radix-vue-alert-dialog-cancel:focus-visible,
.radix-vue-alert-dialog-action:focus-visible {
    outline: 2px solid theme('colors.blue.500');
    outline-offset: 2px;
}

</style>
