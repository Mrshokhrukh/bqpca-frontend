<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-50 p-4 lg:p-8">
    <div class="max-w-[1600px] mx-auto">
      <h1 class="text-3xl font-bold text-slate-900 mb-6 font-serif">Master Compliance Actions</h1>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="bg-white rounded-lg shadow-sm border border-slate-200 p-6 h-fit sticky top-8">
          <h2 class="text-xl font-semibold text-slate-900 mb-4">
            {{ isEditing ? 'Edit Compliance Action' : 'Add New Compliance Action' }}
          </h2>
          <form @submit.prevent="handleSubmit">
            <div class="space-y-4">
              <div>
                <label for="action_name" class="block text-sm font-medium text-slate-700">Action Name</label>
                <input type="text" id="action_name" v-model="formData.action_name" class="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="Enter action name"
                  required />
              </div>
              <div class="flex gap-3">
                <button type="submit" class="flex-1 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700
                         focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  {{ isEditing ? 'Update Action' : 'Add Action' }}
                </button>
                <button v-if="isEditing" type="button" @click="cancelEdit"
                  class="py-2 px-4 bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200">
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>

        <div class="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div class="mb-6 space-y-4">
            <div class="flex justify-between items-center">
              <h2 class="text-xl font-semibold text-slate-900">Compliance Actions List</h2>
              <span class="text-sm text-slate-500">
                {{ filteredActions.length }} action{{ filteredActions.length !== 1 ? 's' : '' }}
              </span>
            </div>

            <div class="relative">
              <input type="text" v-model="searchQuery" placeholder="Search actions..." class="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              <svg class="absolute left-3 top-2.5 h-5 w-5 text-slate-400" fill="none" stroke="currentColor"
                viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <div class="space-y-4 mb-6">
            <TransitionGroup name="list">
              <div v-for="action in paginatedActions" :key="action.id" class="p-4 border border-slate-200 rounded-lg hover:border-blue-200
                       hover:bg-blue-50/30 transition-colors duration-200">
                <div class="flex justify-between items-start gap-4">
                  <div>
                    <h3 class="font-medium text-slate-900">{{ action.action_name }}</h3>
                  </div>
                  <div class="flex gap-2">
                    <button @click="startEdit(action)" class="p-2 text-blue-600 hover:bg-blue-50 rounded-md">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button @click="openDeleteModal(action)" class="p-2 text-red-600 hover:bg-red-50 rounded-md">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </TransitionGroup>

            <div v-if="filteredActions.length === 0" class="text-center py-8">
              <p class="text-slate-500">No compliance actions found</p>
            </div>
          </div>

          <div v-if="filteredActions.length > itemsPerPage" class="flex justify-center gap-2">
            <button @click="currentPage--" :disabled="currentPage === 1" class="px-3 py-1 rounded border border-slate-300 disabled:opacity-50
                     disabled:cursor-not-allowed hover:bg-slate-50">
              Previous
            </button>
            <span class="px-3 py-1 text-sm text-slate-600">
              Page {{ currentPage }} of {{ totalPages }}
            </span>
            <button @click="currentPage++" :disabled="currentPage === totalPages" class="px-3 py-1 rounded border border-slate-300 disabled:opacity-50
                     disabled:cursor-not-allowed hover:bg-slate-50">
              Next
            </button>
          </div>
        </div>
      </div>

      <AlertDialogRoot :open="isDeleteModalOpen" @update:open="isDeleteModalOpen = $event">
        <AlertDialogContent
          class="fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-lg bg-white p-6 shadow-lg focus:outline-none z-50">
          <AlertDialogTitle class="text-xl font-semibold text-slate-900 mb-2">
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription class="text-slate-600 mb-6">
            This action cannot be undone. This will permanently delete the compliance action
            "{{ actionToDelete?.action_name }}".
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
import { useToast } from "vue-toastification";  // Import useToast
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogOverlay,
  AlertDialogRoot,
  AlertDialogTitle,
} from 'radix-vue';

const toast = useToast(); // Initialize toast

const actions = ref([]);
const formData = ref({
  id: null,
  action_name: '',
});
const isEditing = ref(false);
const searchQuery = ref('');
const currentPage = ref(1);
const itemsPerPage = 5;

const isDeleteModalOpen = ref(false);
const actionToDelete = ref(null);

onMounted(async () => {
  try {
    const response = await services.getMasterComplianceActions();
    actions.value = response.data.results;
    if (actions.value.length > 0 && !actions.value[0].hasOwnProperty.call('action_name')) {
      console.warn("The API response does not contain 'action_name'.  Check your API.");
    }
  } catch (error) {
    toast.error("Failed to fetch compliance actions." + error); // Error toast
  }
});

const filteredActions = computed(() => {
  return actions.value.filter(action =>
    action.action_name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const totalPages = computed(() => {
  return Math.ceil(filteredActions.value.length / itemsPerPage);
});

const paginatedActions = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredActions.value.slice(start, end);
});

const handleSubmit = async () => {
  try {
    let response;
    if (isEditing.value) {
      response = await services.updateMasterComplianceAction(formData.value.id, formData.value);
      const index = actions.value.findIndex(a => a.id === formData.value.id);
      if (index !== -1) {
        actions.value[index] = response.data;
      }
      toast.success("Compliance action updated successfully!"); // Success toast
    } else {
      response = await services.createMasterComplianceAction(formData.value);
      actions.value.push(response.data);
      toast.success("Compliance action added successfully!"); // Success toast
    }
    resetForm();
  } catch (error) {
    let errorMessage = "An error occurred.";
    if (error.response && error.response.data) {
      // Check if it's a validation error from DRF
      if (typeof error.response.data === 'object') {
        const errors = error.response.data;
        errorMessage = "";
        for (const field in errors) {
          errorMessage += `${field}: ${errors[field].join(', ')}\n`;
        }
      } else {
        errorMessage = error.response.data; // Use the response data as the error message
      }
    }
    toast.error(errorMessage); // Error toast with more detail
  }
};

const startEdit = (action) => {
  formData.value = {
    id: action.id,
    action_name: action.action_name,
  };
  isEditing.value = true;
};

const cancelEdit = () => {
  resetForm();
};

const openDeleteModal = (action) => {
  actionToDelete.value = action;
  isDeleteModalOpen.value = true;
};

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false;
  actionToDelete.value = null;
};

const confirmDelete = async () => {
  if (!actionToDelete.value) return;

  try {
    await services.deleteMasterComplianceAction(actionToDelete.value.id);
    const index = actions.value.findIndex(a => a.id === actionToDelete.value.id);
    if (index !== -1) {
      actions.value.splice(index, 1);
    }
    toast.success("Compliance action deleted successfully!"); // Success toast
    closeDeleteModal();
  } catch (error) {
    toast.error("Failed to delete compliance action." + error); // Error toast
  }
};

const resetForm = () => {
  formData.value = {
    id: null,
    action_name: '',
  };
  isEditing.value = false;
};

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
