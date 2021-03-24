<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-50 p-4 lg:p-8">
    <div class="max-w-[1600px] mx-auto">
      <h1 class="text-3xl font-bold text-slate-900 mb-6 font-serif">Engineering Participation Sub-Category
        Management</h1>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Left Column - Add/Edit Form -->
        <div class="bg-white rounded-lg shadow-sm border border-slate-200 p-6 h-fit sticky top-8">
          <h2 class="text-xl font-semibold text-slate-900 mb-4">
            {{ isEditing ? 'Edit Participation Sub-Category' : 'Add New Participation Sub-Category' }}
          </h2>
          <form @submit.prevent="handleSubmit">
            <div class="space-y-4">
              <div>
                <label for="participationSubCategoryName" class="block text-sm font-medium text-slate-700">Participation
                  Sub-Category
                  Name</label>
                <input type="text" id="participationSubCategoryName" v-model="formData.participation_sub_category_name"
                  class="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter participation sub-category name" required />
              </div>
              <div>
                <label for="participationCategoryName" class="block text-sm font-medium text-slate-700">Participation
                  Category</label>
                <select id="participationCategoryName" v-model="formData.participation_category_name"
                  class="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required>
                  <option v-for="category in participationCategories" :key="category.id" :value="category.id">
                    {{ category.participation_category_name }}
                  </option>
                </select>
              </div>
              <div>
                <label for="participationSubCategoryDescription"
                  class="block text-sm font-medium text-slate-700">Description</label>
                <textarea id="participationSubCategoryDescription" v-model="formData.description" rows="4"
                  class="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter participation sub-category description" required></textarea>
              </div>

              <div class="flex gap-3">
                <button type="submit"
                  class="flex-1 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  {{ isEditing ? `Update Participation Sub-Category` : `Add Participation
                  Sub-Category` }}
                </button>
                <button v-if="isEditing" type="button" @click="cancelEdit"
                  class="py-2 px-4 bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200">
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
              <h2 class="text-xl font-semibold text-slate-900">Participation Sub-Categories List</h2>
              <span class="text-sm text-slate-500">
                {{ filteredParticipationSubCategories.length }} Participation Sub-Category{{
              filteredParticipationSubCategories.length !== 1 ? 's' : '' }}
              </span>
            </div>

            <!-- Search Bar -->
            <div class="relative">
              <input type="text" v-model="searchQuery" placeholder="Search Participation Sub-Categories..."
                class="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              <svg class="absolute left-3 top-2.5 h-5 w-5 text-slate-400" fill="none" stroke="currentColor"
                viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <!-- Participation Sub-Categories Grid -->
          <div class="space-y-4 mb-6">
            <TransitionGroup name="list">
              <div v-for="participationSubCategory in paginatedParticipationSubCategories"
                :key="participationSubCategory.id"
                class="p-4 border border-slate-200 rounded-lg hover:border-blue-200 hover:bg-blue-50/30 transition-colors duration-200">
                <div class="flex justify-between items-start gap-4">
                  <div>
                    <h3 class="font-medium text-slate-900">{{
              participationSubCategory.participation_sub_category_name }}</h3>
                    <p class="text-sm text-slate-600 mt-1">{{ participationSubCategory.description
                      }}</p>
                    <p class="text-sm text-slate-600 mt-1">Category ID: {{
              participationSubCategory.participation_category_name }}</p>
                  </div>
                  <div class="flex gap-2">
                    <button @click="startEdit(participationSubCategory)"
                      class="p-2 text-blue-600 hover:bg-blue-50 rounded-md">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button @click="openDeleteModal(participationSubCategory)"
                      class="p-2 text-red-600 hover:bg-red-50 rounded-md">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </TransitionGroup>

            <!-- Empty State -->
            <div v-if="filteredParticipationSubCategories.length === 0" class="text-center py-8">
              <p class="text-slate-500">No participation sub-categories found</p>
            </div>
          </div>

          <!-- Pagination -->
          <div v-if="filteredParticipationSubCategories.length > itemsPerPage" class="flex justify-center gap-2">
            <button @click="currentPage--" :disabled="currentPage === 1"
              class="px-3 py-1 rounded border border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50">
              Previous
            </button>
            <span class="px-3 py-1 text-sm text-slate-600">
              Page {{ currentPage }} of {{ totalPages }}
            </span>
            <button @click="currentPage++" :disabled="currentPage === totalPages"
              class="px-3 py-1 rounded border border-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50">
              Next
            </button>
          </div>
        </div>
      </div>

      <!-- Confirmation modal -->
      <AlertDialogRoot :open="isDeleteModalOpen" @update:open="isDeleteModalOpen = $event">
        <AlertDialogContent
          class="fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-lg bg-white p-6 shadow-lg focus:outline-none z-50">
          <AlertDialogTitle class="text-xl font-semibold text-slate-900 mb-2">
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription class="text-slate-600 mb-6">
            This action cannot be undone. This will permanently delete the participation sub-category
            "{{ participationSubCategoryToDelete?.participation_sub_category_name }}".
          </AlertDialogDescription>
          <div class="flex justify-end gap-4">
            <AlertDialogCancel class="px-4 py-2 rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200"
              @click="closeDeleteModal">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction class="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
              @click="confirmDelete">
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
        <AlertDialogOverlay class="fixed inset-0 bg-black/50 z-40" />
      </AlertDialogRoot>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import apiServices from '@/services/services';
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogOverlay,
  AlertDialogRoot,
  AlertDialogTitle,
} from 'radix-vue';

// State
const participationSubCategories = ref([]);
const formData = ref({
  id: null,
  participation_sub_category_name: '',
  description: '',
  participation_category_name: null,
});
const isEditing = ref(false);
const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = 5;

const isDeleteModalOpen = ref(false);
const participationSubCategoryToDelete = ref(null);

// Fetch data from the MastersParticipationCategories API
const participationCategories = ref([])

const getParticipationCategories = async () => {
  try {
    const response = await apiServices.getMastersParticipationCategories()
    participationCategories.value = response.data.results
  } catch (error) {
    console.error('Error fetching participation categories:', error)
  }
}

// Fetch participation sub-categories on component mount
onMounted(async () => {
  try {
    await getParticipationCategories()
    const response = await apiServices.getMastersParticipationSubCategories();
    participationSubCategories.value = response.data.results;
  } catch (error) {
    console.error('Error fetching participation sub-categories:', error);
  }
});

// Computed
const filteredParticipationSubCategories = computed(() => {
  return participationSubCategories.value.filter(participationSubCategory => {
    const query = searchQuery.value.toLowerCase();
    return participationSubCategory.participation_sub_category_name.toLowerCase().includes(query) ||
      participationSubCategory.description.toLowerCase().includes(query);
  });
});

const totalPages = computed(() => {
  return Math.ceil(filteredParticipationSubCategories.value.length / itemsPerPage);
});

const paginatedParticipationSubCategories = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredParticipationSubCategories.value.slice(start, end);
});

// Methods
const handleSubmit = async () => {
  try {
    if (isEditing.value) {
      const response = await apiServices.updateMastersParticipationSubCategory(formData.value.id, formData.value);
      const index = participationSubCategories.value.findIndex(dt => dt.id === formData.value.id);
      if (index !== -1) {
        participationSubCategories.value[index] = response.data;
      }
    } else {
      const response = await apiServices.createMastersParticipationSubCategory(formData.value);
      participationSubCategories.value.push(response.data);
    }
    resetForm();
  } catch (error) {
    console.error('Error saving participation sub-category:', error);
  }
};

const startEdit = (participationSubCategory) => {
  formData.value = { ...participationSubCategory };
  isEditing.value = true;
};

const cancelEdit = () => {
  resetForm();
};

const openDeleteModal = (participationSubCategory) => {
  participationSubCategoryToDelete.value = participationSubCategory;
  isDeleteModalOpen.value = true;
};

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false;
  participationSubCategoryToDelete.value = null;
};

const confirmDelete = async () => {
  if (!participationSubCategoryToDelete.value) return;

  try {
    await apiServices.deleteMastersParticipationSubCategory(participationSubCategoryToDelete.value.id);
    const index = participationSubCategories.value.findIndex(dt => dt.id === participationSubCategoryToDelete.value.id);
    if (index !== -1) {
      participationSubCategories.value.splice(index, 1);
    }
    closeDeleteModal();
  } catch (error) {
    console.error('Error deleting participation sub-category:', error);
  }
};

const resetForm = () => {
  formData.value = {
    id: null,
    participation_sub_category_name: '',
    description: '',
    participation_category_name: null,
  };
  isEditing.value = false;
};

// Watch for search query changes to reset pagination
watch(searchQuery, () => {
  currentPage.value = 1;
});
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
