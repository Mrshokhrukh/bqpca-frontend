<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 lg:p-8">
    <div class="max-w-[1600px] mx-auto">
      <h1 class="text-3xl font-bold text-slate-900 mb-6 font-serif">Fees Association Management</h1>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Left Column - Add/Edit Form -->
        <div class="bg-white rounded-lg shadow-sm border border-slate-200 p-6 h-fit sticky top-8">
          <h2 class="text-xl font-semibold text-slate-900 mb-4">
            {{ isEditing ? 'Edit Fees Association' : 'Add New Fees Association' }}
          </h2>
          <form @submit.prevent="handleSubmit">
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
                <label for="description" class="block text-sm font-medium text-slate-700">Description</label>
                <textarea
                  id="description"
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
                  class="flex-1 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {{ isEditing ? 'Update Fees Association' : 'Add Fees Association' }}
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

        <!-- Right Column - Fees Associations List -->
        <div class="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div class="mb-6 space-y-4">
            <div class="flex justify-between items-center">
              <h2 class="text-xl font-semibold text-slate-900">Fees Associations List</h2>
              <span class="text-sm text-slate-500">
                {{ filteredFeesAssociations.length }} Fees Association{{ filteredFeesAssociations.length !== 1 ? 's' : '' }}
              </span>
            </div>

            <!-- Search Bar -->
            <div class="relative">
              <input
                type="text"
                v-model="searchQuery"
                placeholder="Search Fees Associations..."
                class="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <svg
                class="absolute left-3 top-2.5 h-5 w-5 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <!-- Fees Associations Grid -->
          <div class="space-y-4 mb-6">
            <TransitionGroup name="list">
              <div
                v-for="feesAssociation in paginatedFeesAssociations"
                :key="feesAssociation.id"
                class="p-4 border border-slate-200 rounded-lg hover:border-blue-200 hover:bg-blue-50/30 transition-colors duration-200"
              >
                <div class="flex justify-between items-start gap-4">
                  <div>
                    <h3 class="font-medium text-slate-900">{{ feesAssociation.name }}</h3>
                    <p class="text-sm text-slate-600 mt-1">{{ feesAssociation.description }}</p>
                  </div>
                  <div class="flex gap-2">
                    <button
                      @click="startEdit(feesAssociation)"
                      class="p-2 text-blue-600 hover:bg-blue-50 rounded-md"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      @click="openDeleteModal(feesAssociation)"
                      class="p-2 text-red-600 hover:bg-red-50 rounded-md"
                    >
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
            <div v-if="filteredFeesAssociations.length === 0" class="text-center py-8">
              <p class="text-slate-500">No fees associations found</p>
            </div>
          </div>

          <!-- Pagination -->
          <div v-if="filteredFeesAssociations.length > itemsPerPage"
               class="flex justify-center gap-2">
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

      <!-- Confirmation modal -->
      <AlertDialogRoot :open="isDeleteModalOpen" @update:open="isDeleteModalOpen = $event">
        <AlertDialogContent
          class="fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-lg bg-white p-6 shadow-lg focus:outline-none z-50">
          <AlertDialogTitle class="text-xl font-semibold text-slate-900 mb-2">
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription class="text-slate-600 mb-6">
            This action cannot be undone. This will permanently delete the fees association
            "{{ feesAssociationToDelete?.name }}".
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
import services from '@/services/services';
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
const feesAssociations = ref([]);
const formData = ref({
  id: null,
  name: '',
  description: ''
});
const isEditing = ref(false);
const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = 5;

const isDeleteModalOpen = ref(false);
const feesAssociationToDelete = ref(null);

// Fetch fees associations on component mount
onMounted(async () => {
  try {
    const response = await services.getMastersFeesAssociatedFor();
    feesAssociations.value = response.data.results;
  } catch (error) {
    console.error('Error fetching fees associations:', error);
  }
});

// Computed
const filteredFeesAssociations = computed(() => {
  return feesAssociations.value.filter(feesAssociation => {
    const query = searchQuery.value.toLowerCase();
    return feesAssociation.name.toLowerCase().includes(query) ||
           feesAssociation.description.toLowerCase().includes(query);
  });
});

const totalPages = computed(() => {
  return Math.ceil(filteredFeesAssociations.value.length / itemsPerPage);
});

const paginatedFeesAssociations = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredFeesAssociations.value.slice(start, end);
});

// Methods
const handleSubmit = async () => {
  try {
    if (isEditing.value) {
      const response = await services.updateMastersFeesAssociatedFor(formData.value.id, formData.value);
      const index = feesAssociations.value.findIndex(fa => fa.id === formData.value.id);
      if (index !== -1) {
        feesAssociations.value[index] = response.data;
      }
    } else {
      const response = await services.createMastersFeesAssociatedFor(formData.value);
      feesAssociations.value.push(response.data);
    }
    resetForm();
  } catch (error) {
    console.error('Error saving fees association:', error);
  }
};

const startEdit = (feesAssociation) => {
  formData.value = { ...feesAssociation };
  isEditing.value = true;
};

const cancelEdit = () => {
  resetForm();
};

const openDeleteModal = (feesAssociation) => {
  feesAssociationToDelete.value = feesAssociation;
  isDeleteModalOpen.value = true;
};

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false;
  feesAssociationToDelete.value = null;
};

const confirmDelete = async () => {
  if (!feesAssociationToDelete.value) return;

  try {
    await services.deleteMastersFeesAssociatedFor(feesAssociationToDelete.value.id);
    const index = feesAssociations.value.findIndex(fa => fa.id === feesAssociationToDelete.value.id);
    if (index !== -1) {
      feesAssociations.value.splice(index, 1);
    }
    closeDeleteModal();
  } catch (error) {
    console.error('Error deleting fees association:', error);
  }
};

const resetForm = () => {
  formData.value = {
    id: null,
    name: '',
    description: ''
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
