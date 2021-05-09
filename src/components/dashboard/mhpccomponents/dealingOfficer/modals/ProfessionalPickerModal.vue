<!-- ProfessionalPickerModal.vue -->
<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" @close="closeModal" class="relative z-20"> <!-- Higher z-index for secondary modal -->
      <TransitionChild
        as="div"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black bg-opacity-50" /> <!-- Slightly darker backdrop -->
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild
            as="div"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel class="w-full lg:max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
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
                />

                <div v-if="isLoading" class="text-center py-10">
                  <p class="text-gray-500">Loading professionals...</p>
                  <!-- You can add a spinner SVG here -->
                </div>
                <div v-else-if="filteredProfessionals.length === 0 && searchQuery" class="text-center py-4">
                    <p class="text-sm text-gray-500">No professionals found matching "<strong>{{ searchQuery }}</strong>".</p>
                </div>
                <div v-else-if="filteredProfessionals.length === 0 && allProfessionals.length > 0" class="text-center py-4">
                    <p class="text-sm text-gray-500">No professionals match the current filter.</p>
                </div>
                 <div v-else-if="allProfessionals.length === 0 && !isLoading" class="text-center py-4">
                    <p class="text-sm text-gray-500">No professionals available to select.</p>
                </div>

                <div v-else class="max-h-96 overflow-y-auto border rounded-md">
                  <ul role="listbox">
                    <li
                      v-for="prof in filteredProfessionals"
                      :key="prof.id"
                      @click="toggleSelection(prof)"
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
                          CID: {{ prof.cid }} | Reg No: {{ prof.registration_no }}
                        </span>
                        <span v-if="prof.designation" class="block text-xs text-gray-500">{{ prof.designation }}</span>
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
                      @click="closeModal"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      class="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      @click="confirmSelection"
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
</template>

<script setup>
import { ref, watch } from 'vue';
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
} from '@headlessui/vue';
import { debounce } from 'lodash-es';
import apiServices from '@/services/services'; // Your existing import

const props = defineProps({
  isOpen: Boolean,
  initiallySelectedIds: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['close', 'confirm']);

const allProfessionals = ref([]); // Holds ALL fetched users for client-side filtering
const filteredProfessionals = ref([]); // Users displayed after filtering
const tempSelectedProfessionals = ref([]); // Array of selected professional *objects*
const searchQuery = ref('');
const isLoading = ref(false);

/**
 * Fetches all users from the backend and maps them to the required format.
 */
async function fetchAndMapUsers() {
  isLoading.value = true;
  console.log("API: Fetching ALL users...");
  try {
    // Using getAllUsers() from your general user management API
    const response = await apiServices.getAllUsers();

    let rawUsers = [];
    // Adjust based on your API's response structure
    if (response.data && Array.isArray(response.data.results)) { // Common for DRF paginated results
      rawUsers = response.data.results;
      // TODO: If paginated and you need ALL users,
      // implement logic here to fetch subsequent pages (response.data.next).
      // For now, this takes the first page.
    } else if (response.data && Array.isArray(response.data)) { // If it's a direct array
      rawUsers = response.data;
    } else {
      console.warn("API response for users is not in the expected array format:", response.data);
      rawUsers = [];
    }

    // --- CRUCIAL MAPPING ---
    // YOU MUST ADJUST THIS MAPPING based on the fields returned by your `/users/users/` endpoint.
    // The modal expects objects with: id, name, cid, registration_no, designation.
    return rawUsers.map(user => {
      // Construct name - common patterns:
      let displayName = user.username; // Fallback to username
      if (user.first_name && user.last_name) {
        displayName = `${user.first_name} ${user.last_name}`;
      } else if (user.full_name) {
        displayName = user.full_name;
      } else if (user.name) {
        displayName = user.name;
      }

      return {
        id: user.id || user.pk, // Adjust if your ID field is different (e.g., user.user_id)
        name: displayName,
        // For the fields below, you need to determine how they are stored on your User model
        // or if they come from a related profile. They might be null if not available.
        cid: user.cid || user.citizen_id || null, // Example: user.profile.cid
        registration_no: user.registration_no || user.professional_reg_no || null, // Example: user.profile.registration_no
        designation: user.designation || user.professional_designation || null, // Example: user.profile.designation
        // You might want to include the original user object or other fields if needed later
        // originalUser: user,
      };
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  } finally {
    isLoading.value = false;
  }
}

/**
 * Loads the initial list of users when the modal opens.
 */
const loadInitialUsers = async () => {
  allProfessionals.value = await fetchAndMapUsers(); // `allProfessionals` now stores mapped users
  _applyClientSideFilters(); // Apply client-side filtering for any existing searchQuery
};

/**
 * Filters the `allProfessionals` list (which contains all fetched users)
 * client-side based on `searchQuery`.
 */
const _applyClientSideFilters = () => {
  if (!searchQuery.value.trim()) {
    filteredProfessionals.value = [...allProfessionals.value];
  } else {
    const lowerQuery = searchQuery.value.toLowerCase();
    filteredProfessionals.value = allProfessionals.value.filter(prof =>
      (prof.name && prof.name.toLowerCase().includes(lowerQuery)) ||
      (prof.cid && prof.cid.toLowerCase().includes(lowerQuery)) ||
      (prof.registration_no && prof.registration_no.toLowerCase().includes(lowerQuery)) ||
      (prof.designation && prof.designation.toLowerCase().includes(lowerQuery))
    );
  }
};

// Debounces the client-side filtering logic
const debouncedFilterProfessionals = debounce(_applyClientSideFilters, 300);

const isSelected = (profId) => {
  return tempSelectedProfessionals.value.some(p => p.id === profId);
};

const toggleSelection = (professional) => {
  const index = tempSelectedProfessionals.value.findIndex(p => p.id === professional.id);
  if (index > -1) {
    tempSelectedProfessionals.value.splice(index, 1);
  } else {
    tempSelectedProfessionals.value.push({ ...professional });
  }
};

const closeModal = () => {
  emit('close');
};

const confirmSelection = () => {
  emit('confirm', [...tempSelectedProfessionals.value]);
  closeModal();
};

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    searchQuery.value = '';
    loadInitialUsers().then(() => {
      if (allProfessionals.value && allProfessionals.value.length > 0) {
        tempSelectedProfessionals.value = allProfessionals.value
          .filter(p => props.initiallySelectedIds.includes(p.id))
          .map(p => ({ ...p }));
      } else {
        tempSelectedProfessionals.value = [];
      }
    });
  }
});
</script>
<style scoped>
.max-h-96 {
  max-height: 24rem; /* 384px */
}
</style>
