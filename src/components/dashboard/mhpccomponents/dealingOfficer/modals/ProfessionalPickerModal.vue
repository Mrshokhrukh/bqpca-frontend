<!-- ProfessionalPickerModal.vue -->
<template>
  <Teleport to="body">
    <TransitionRoot appear :show="isOpen" as="template">
      <Dialog as="div" @close="handleClose" class="relative z-[1000]">
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black/50" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel
                class="w-full lg:max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
                @click.stop
              >
                <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
                  Select Implicated Professionals
                </DialogTitle>

                <div class="mt-4">
                  <input
                    type="text"
                    v-model="searchQuery"
                    placeholder="Search by CID, Registration No., or Name..."
                    class="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm p-2 mb-4"
                    @input="debouncedFilterProfessionals"
                    @click.stop
                    @keydown.enter.prevent
                  />

                  <div v-if="isLoading" class="text-center py-10">
                    <svg
                      class="animate-spin h-8 w-8 text-indigo-600 mx-auto mb-3"
                      xmlns="http://www.w3.org/2000/svg"
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
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <p class="text-gray-500">Loading professionals...</p>
                  </div>
                  <div
                    v-else-if="filteredProfessionals.length === 0 && searchQuery"
                    class="text-center py-4"
                  >
                    <p class="text-sm text-gray-500">
                      No professionals found matching "<strong>{{ searchQuery }}</strong>".
                    </p>
                  </div>
                  <div
                    v-else-if="filteredProfessionals.length === 0 && allProfessionals.length > 0"
                    class="text-center py-4"
                  >
                    <p class="text-sm text-gray-500">No professionals match the current filter.</p>
                  </div>
                  <div
                    v-else-if="allProfessionals.length === 0 && !isLoading"
                    class="text-center py-4"
                  >
                    <p class="text-sm text-gray-500">No professionals available to select.</p>
                  </div>

                  <div v-else class="max-h-96 overflow-y-auto border rounded-md">
                    <ul role="listbox">
                      <li
                        v-for="prof in filteredProfessionals"
                        :key="prof.id"
                        @click.stop="toggleSelection(prof)"
                        class="p-3 hover:bg-gray-100 border-b last:border-b-0 cursor-pointer flex items-center space-x-3"
                        :class="{ 'bg-indigo-50 hover:bg-indigo-100': isSelected(prof.id) }"
                        role="option"
                        :aria-selected="isSelected(prof.id)"
                      >
                        <input
                          type="checkbox"
                          :checked="isSelected(prof.id)"
                          class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 pointer-events-none"
                          tabindex="-1"
                        />
                        <div>
                          <span class="font-semibold text-sm">{{ prof.name }}</span>
                          <span class="block text-xs text-gray-600">
                            CID: {{ prof.cid || 'N/A' }} | Reg No: {{ prof.registration_no || 'N/A' }}
                          </span>
                          <span v-if="prof.designation" class="block text-xs text-gray-500">{{
                            prof.designation
                          }}</span>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>

                <div class="mt-6 flex justify-between items-center">
                  <p class="text-sm text-gray-600">
                    Selected: {{ tempSelectedProfessionals.length }}
                  </p>
                  <div class="space-x-3">
                    <button
                      type="button"
                      class="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                      @click.stop="closeModal"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      class="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      @click.stop="confirmSelection"
                    >
                      Confirm Selection
                    </button>
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </Teleport>
</template>

<script setup>
import { ref, watch } from 'vue';
import { TransitionRoot, TransitionChild, Dialog, DialogPanel, DialogTitle } from '@headlessui/vue';
import { debounce } from 'lodash-es';
import apiServices from '@/services/services';

const props = defineProps({
  isOpen: Boolean,
  initiallySelectedIds: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['close', 'confirm']);

const allProfessionals = ref([]);
const filteredProfessionals = ref([]);
const tempSelectedProfessionals = ref([]);
const searchQuery = ref('');
const isLoading = ref(false);

async function fetchAndMapUsers() {
  isLoading.value = true;
  console.log('API: Fetching ALL users...');
  try {
    const response = await apiServices.getAllUsers();
    let rawUsers = [];
    if (response.data && Array.isArray(response.data.results)) {
      rawUsers = response.data.results;
    } else if (response.data && Array.isArray(response.data)) {
      rawUsers = response.data;
    } else {
      console.warn('API response for users is not in the expected array format:', response.data);
      rawUsers = [];
    }

    return rawUsers.map((user) => {
      let displayName = user.username;
      if (user.first_name && user.last_name) {
        displayName = `${user.first_name} ${user.last_name}`;
      } else if (user.full_name) {
        displayName = user.full_name;
      } else if (user.name) {
        displayName = user.name;
      }

      return {
        id: user.id || user.pk,
        name: displayName,
        cid: user.cid || user.citizen_id || null,
        registration_no: user.registration_no || user.professional_reg_no || null,
        designation: user.designation || user.professional_designation || null,
      };
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  } finally {
    isLoading.value = false;
  }
}

const loadInitialUsers = async () => {
  allProfessionals.value = await fetchAndMapUsers();
  _applyClientSideFilters();
};

const _applyClientSideFilters = () => {
  if (!searchQuery.value.trim()) {
    filteredProfessionals.value = [...allProfessionals.value];
  } else {
    const lowerQuery = searchQuery.value.toLowerCase();
    filteredProfessionals.value = allProfessionals.value.filter(
      (prof) =>
        (prof.name && prof.name.toLowerCase().includes(lowerQuery)) ||
        (prof.cid && prof.cid.toLowerCase().includes(lowerQuery)) ||
        (prof.registration_no && prof.registration_no.toLowerCase().includes(lowerQuery)) ||
        (prof.designation && prof.designation.toLowerCase().includes(lowerQuery))
    );
  }
};

const debouncedFilterProfessionals = debounce(_applyClientSideFilters, 300);

const isSelected = (profId) => {
  return tempSelectedProfessionals.value.some((p) => p.id === profId);
};

const toggleSelection = (professional) => {
  const index = tempSelectedProfessionals.value.findIndex((p) => p.id === professional.id);
  if (index > -1) {
    tempSelectedProfessionals.value.splice(index, 1);
  } else {
    tempSelectedProfessionals.value.push({ ...professional });
  }
};

const handleClose = () => {
  console.log('ProfessionalPickerModal close triggered');
  // Only close if explicitly intended (e.g., via Cancel button or backdrop)
  emit('close');
};

const closeModal = () => {
  console.log('closeModal called');
  emit('close');
};

const confirmSelection = () => {
  console.log('confirmSelection called', tempSelectedProfessionals.value);
  emit('confirm', [...tempSelectedProfessionals.value]);
  closeModal();
};

watch(
  () => props.isOpen,
  (newVal) => {
    console.log('ProfessionalPickerModal isOpen changed:', newVal);
    if (newVal) {
      searchQuery.value = '';
      loadInitialUsers().then(() => {
        if (allProfessionals.value && allProfessionals.value.length > 0) {
          tempSelectedProfessionals.value = allProfessionals.value
            .filter((p) => props.initiallySelectedIds.includes(p.id))
            .map((p) => ({ ...p }));
        } else {
          tempSelectedProfessionals.value = [];
        }
      });
    }
  }
);
</script>

<style scoped>
.max-h-96 {
  max-height: 24rem; /* 384px */
}
</style>
