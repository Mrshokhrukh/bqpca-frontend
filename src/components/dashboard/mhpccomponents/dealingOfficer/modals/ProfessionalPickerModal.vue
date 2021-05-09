<!-- ProfessionalPickerModal.vue -->
<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <Dialog as="div" @close="closeModal" class="relative z-20"> <!-- Higher z-index for secondary modal -->
      <TransitionChild
        as="template"
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
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel class="w-full max-w-xl lg:max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
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
import { ref, watch,  defineProps, defineEmits } from 'vue';
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
} from '@headlessui/vue';
import { debounce } from 'lodash-es'; // Using lodash for debounce

const props = defineProps({
  isOpen: Boolean,
  // Pass IDs of professionals already selected in the main modal
  initiallySelectedIds: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['close', 'confirm']);

const allProfessionals = ref([]); // Holds all professionals fetched from API
const filteredProfessionals = ref([]);
// Use a temporary list for selections within this modal to avoid direct mutation of main modal's state
const tempSelectedProfessionals = ref([]); // Array of selected professional *objects*
const searchQuery = ref('');
const isLoading = ref(false);

// --- Mock API: Fetch ALL Professionals from Health Certifications ---
// Replace this with your actual API call
async function fetchAllHealthProfessionalsAPI() {
  isLoading.value = true;
  console.log("API: Fetching ALL health professionals...");
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
  const mockData = [
    { id: 'prof_1', name: 'Dr. Eva Green', cid: '123450001', registration_no: 'REG001X', designation: 'Cardiologist' },
    { id: 'prof_2', name: 'Mr. John Doe', cid: '678900002', registration_no: 'REG002Y', designation: 'Nurse Practitioner' },
    { id: 'prof_3', name: 'Ms. Jane Smith', cid: '112230003', registration_no: 'REG003Z', designation: 'Surgeon' },
    { id: 'prof_4', name: 'Dr. Eva Marlie', cid: '555550004', registration_no: 'REG004A', designation: 'Pediatrician' },
    { id: 'prof_5', name: 'Mr. Johnathan Doel', cid: '999990005', registration_no: 'REG005B', designation: 'General Practitioner' },
    { id: 'prof_6', name: 'Dr. Alice Wonderland', cid: 'AABBCC006', registration_no: 'REG006C', designation: 'Psychiatrist' },
    { id: 'prof_7', name: 'Mr. Bob The Builder', cid: 'XXYYZZ007', registration_no: 'REG007D', designation: 'Orthopedic Surgeon' },
    { id: 'prof_8', name: 'Ms. Clara Oswald', cid: 'TARDIS008', registration_no: 'REG008E', designation: 'Physiotherapist' },
    { id: 'prof_9', name: 'Dr. Who Cares', cid: 'GALLIFREY009', registration_no: 'REG009F', designation: 'Radiologist' },
    { id: 'prof_10', name: 'Prof. Albus Dumbledore', cid: 'HOGWARTS010', registration_no: 'REG010G', designation: 'Chief Medical Officer' },
  ];
  isLoading.value = false;
  return mockData.map(p => ({...p})); // Return copies
}
// --- End Mock API ---

const loadProfessionals = async () => {
  if (allProfessionals.value.length > 0 && !searchQuery.value) { // Avoid re-fetching if already loaded and no search
      _applyFilters();
      return;
  }
  allProfessionals.value = await fetchAllHealthProfessionalsAPI();
  _applyFilters();
};

const _applyFilters = () => {
  if (!searchQuery.value.trim()) {
    filteredProfessionals.value = [...allProfessionals.value];
  } else {
    const lowerQuery = searchQuery.value.toLowerCase();
    filteredProfessionals.value = allProfessionals.value.filter(prof =>
      prof.name.toLowerCase().includes(lowerQuery) ||
      prof.cid.toLowerCase().includes(lowerQuery) ||
      prof.registration_no.toLowerCase().includes(lowerQuery) ||
      (prof.designation && prof.designation.toLowerCase().includes(lowerQuery))
    );
  }
};

const debouncedFilterProfessionals = debounce(_applyFilters, 300);

const isSelected = (profId) => {
  return tempSelectedProfessionals.value.some(p => p.id === profId);
};

const toggleSelection = (professional) => {
  const index = tempSelectedProfessionals.value.findIndex(p => p.id === professional.id);
  if (index > -1) {
    tempSelectedProfessionals.value.splice(index, 1); // Deselect
  } else {
    tempSelectedProfessionals.value.push({...professional}); // Select (add a copy)
  }
};

const closeModal = () => {
  emit('close');
};

const confirmSelection = () => {
  emit('confirm', [...tempSelectedProfessionals.value]); // Send a copy of selected items
  closeModal();
};

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    searchQuery.value = ''; // Reset search on open
    // Initialize tempSelectedProfessionals based on initiallySelectedIds from the main modal
    // Ensure allProfessionals is loaded before trying to find objects by ID
    loadProfessionals().then(() => {
        tempSelectedProfessionals.value = allProfessionals.value.filter(p =>
            props.initiallySelectedIds.includes(p.id)
        ).map(p => ({...p})); // Store copies
    });

  } else {
    // Optional: Clear selections when modal is fully closed to avoid stale state if reopened quickly
    // tempSelectedProfessionals.value = [];
  }
});

// Fetch professionals when the component is mounted or when the modal becomes visible
// This example loads when modal becomes visible.
// onMounted(loadProfessionals); // Could also load on mount if preferred
</script>

<style scoped>
.max-h-96 {
  max-height: 24rem; /* 384px */
}
</style>