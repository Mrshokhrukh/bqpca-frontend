<template>
  <div class="ecpf-admin-dashboard">
    <div class="dashboard-content">
      <!-- Masters Infrastructure Management -->
      <div class="bg-gradient-to-br from-slate-50 to-slate-50 p-4 lg:p-8">
        <div class="max-w-[1600px] mx-auto">
          <h1 class="text-3xl font-bold text-slate-900 mb-6 font-serif">
            Masters Infrastructure
          </h1>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- Form (Add/Edit) -->
            <div class="bg-white rounded-lg shadow-sm border border-slate-200 p-6 h-fit sticky top-8">
              <h2 class="text-xl font-semibold text-slate-900 mb-4">
                {{
                  isEditing
                    ? "Edit Infrastructure"
                    : "Add New Infrastructure"
                }}
              </h2>
              <form @submit.prevent="handleSubmit">
                <div class="space-y-4">
                  <div>
                    <label for="particular_name" class="block text-sm font-medium text-slate-700">Particular
                      Name</label>
                    <input type="text" id="particular_name" v-model="formData.particular_name"
                      class="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter particular name" required />
                  </div>
                  <div>
                    <label for="item_description" class="block text-sm font-medium text-slate-700">Item
                      Description</label>
                    <textarea id="item_description" v-model="formData.item_description"
                      class="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter item description" rows="3"></textarea>
                  </div>
                  <div>
                    <label for="minimum_rooms" class="block text-sm font-medium text-slate-700">Minimum Rooms</label>
                    <input type="number" id="minimum_rooms" v-model="formData.minimum_rooms"
                      class="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter minimum rooms" />
                  </div>
                  <div class="flex gap-3">
                    <button type="submit"
                      class="flex-1 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      {{ isEditing ? "Update" : "Add" }}
                    </button>
                    <button v-if="isEditing" type="button" @click="cancelEdit"
                      class="py-2 px-4 bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200">
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            </div>

            <!-- List (Display, Search, Edit, Delete) -->
            <div class="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <div class="mb-6 space-y-4">
                <div class="flex justify-between items-center">
                  <h2 class="text-xl font-semibold text-slate-900">
                    Infrastructure List
                  </h2>
                  <span class="text-sm text-slate-500">
                    {{ filteredInfrastructures.length }} item{{
                  filteredInfrastructures.length !== 1 ? "s" : ""
                }}
                  </span>
                </div>

                <div class="relative">
                  <input type="text" v-model="searchQuery" placeholder="Search..."
                    class="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  <svg class="absolute left-3 top-2.5 h-5 w-5 text-slate-400" fill="none" stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              <div class="space-y-4 mb-6">
                <TransitionGroup name="list">
                  <div v-for="infrastructure in paginatedInfrastructures" :key="infrastructure.id"
                    class="p-4 border border-slate-200 rounded-lg hover:border-blue-200 hover:bg-blue-50/30 transition-colors duration-200">
                    <div class="flex justify-between items-start gap-4">
                      <div>
                        <h3 class="font-medium text-slate-900">
                          {{ infrastructure.particular_name }}
                        </h3>
                        <p class="text-slate-600 mt-1">
                          {{ infrastructure.item_description }}
                        </p>
                        <p class="text-slate-600 mt-1">
                          Minimum Rooms: {{ infrastructure.minimum_rooms }}
                        </p>
                      </div>
                      <div class="flex gap-2">
                        <button @click="startEdit(infrastructure)"
                          class="p-2 text-blue-600 hover:bg-blue-50 rounded-md">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button @click="openDeleteModal(infrastructure)"
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

                <div v-if="filteredInfrastructures.length === 0" class="text-center py-8">
                  <p class="text-slate-500">No infrastructure items found.</p>
                </div>
              </div>

              <!-- Pagination -->
              <div v-if="filteredInfrastructures.length > itemsPerPage" class="flex justify-center gap-2">
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

          <!-- Delete Confirmation Modal (Radix UI) -->
          <AlertDialogRoot :open="isDeleteModalOpen" @update:open="isDeleteModalOpen = $event">
            <AlertDialogContent
              class="fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-lg bg-white p-6 shadow-lg focus:outline-none z-50">
              <AlertDialogTitle class="text-xl font-semibold text-slate-900 mb-2">
                Are you absolutely sure?
              </AlertDialogTitle>
              <AlertDialogDescription class="text-slate-600 mb-6">
                This action cannot be undone. This will permanently delete the
                item "{{ infrastructureToDelete?.particular_name }}".
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
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import services from "@/services/services";
import { useToast } from "vue-toastification";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogOverlay,
  AlertDialogRoot,
  AlertDialogTitle,
} from "radix-vue";

const toast = useToast();

// Data
const infrastructures = ref([]);
const formData = ref({
  id: null,
  particular_name: "",
  item_description: "",
  minimum_rooms: null,
});
const isEditing = ref(false);
const searchQuery = ref("");
const currentPage = ref(1);
const itemsPerPage = 5;
const isDeleteModalOpen = ref(false);
const infrastructureToDelete = ref(null);

// Computed Properties
const filteredInfrastructures = computed(() => {
  const query = searchQuery.value.toLowerCase();
  return infrastructures.value.filter((infra) =>
    infra.particular_name.toLowerCase().includes(query) ||
    (infra.item_description && infra.item_description.toLowerCase().includes(query)) // Optional chaining
  );
});

const totalPages = computed(() => {
  return Math.ceil(filteredInfrastructures.value.length / itemsPerPage);
});

const paginatedInfrastructures = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredInfrastructures.value.slice(start, end);
});

// Lifecycle Hook
onMounted(async () => {
  await fetchInfrastructures();
});

// Methods
const fetchInfrastructures = async () => {
  try {
    const response = await services.getMastersInfrastructures();
    infrastructures.value = response.data.results;
    if (infrastructures.value.length > 0 && !infrastructures.value[0].hasOwnProperty.call('particular_name') && !infrastructures.value[0].hasOwnProperty.call('item_description') && !infrastructures.value[0].hasOwnProperty.call('minimum_rooms')) {
      console.warn("The API response does not contain all required fields ('particular_name', 'item_description', 'minimum_rooms').  Check your API.");
    }
  } catch (error) {
    toast.error("Failed to fetch data: " + error);
  }
};

const handleSubmit = async () => {
  try {
    let response;
    if (isEditing.value) {
      response = await services.updateMastersInfrastructure(
        formData.value.id,
        formData.value
      );
      const index = infrastructures.value.findIndex(
        (i) => i.id === formData.value.id
      );
      if (index !== -1) {
        infrastructures.value[index] = response.data;
      }
      toast.success("Item updated successfully!");
    } else {
      response = await services.createMastersInfrastructure(formData.value);
      infrastructures.value.push(response.data);
      toast.success("Item added successfully!");
    }
    resetForm();
  } catch (error) {
    let errorMessage = "An error occurred.";
    if (error.response && error.response.data) {
      if (typeof error.response.data === 'object') {
        const errors = error.response.data;
        errorMessage = "";
        for (const field in errors) {
          errorMessage += `${field}: ${errors[field].join(', ')}\n`;
        }
      } else {
        errorMessage = error.response.data;
      }
    }
    toast.error(errorMessage);
  }
};

const startEdit = (infrastructure) => {
  formData.value = {
    id: infrastructure.id,
    particular_name: infrastructure.particular_name,
    item_description: infrastructure.item_description,
    minimum_rooms: infrastructure.minimum_rooms,
  };
  isEditing.value = true;
};

const cancelEdit = () => {
  resetForm();
};

const openDeleteModal = (infrastructure) => {
  infrastructureToDelete.value = infrastructure;
  isDeleteModalOpen.value = true;
};

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false;
  infrastructureToDelete.value = null;
};

const confirmDelete = async () => {
  if (!infrastructureToDelete.value) return;

  try {
    await services.deleteMastersInfrastructure(infrastructureToDelete.value.id);
    infrastructures.value = infrastructures.value.filter(
      (i) => i.id !== infrastructureToDelete.value.id
    );
    toast.success("Item deleted successfully!");
    closeDeleteModal();
  } catch (error) {
    toast.error("Failed to delete item: " + error);
  }
};

const resetForm = () => {
  formData.value = {
    id: null,
    particular_name: "",
    item_description: "",
    minimum_rooms: null,
  };
  isEditing.value = false;
};

// Watcher
watch(searchQuery, () => {
  currentPage.value = 1;
});
</script>

<style scoped>
/* Keep styles from the previous example and adjust as needed */
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

.dashboard-content {
  padding: 20px;
}
</style>
