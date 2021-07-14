<template>
  <div class="rounded-xl border border-gray-200 shadow-sm bg-white overflow-hidden">
    <!-- Header -->
    <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-200">
      <h3 class="text-xl font-semibold text-gray-800 flex items-center">
        <span class="inline-block mr-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </span>
        Participants Details
      </h3>
      <p class="mt-2 text-sm text-gray-600">Provide information about the participants attending this CPD program.</p>
    </div>

    <!-- Form Content -->
    <div class="p-6">
      <div class="bg-gray-50 p-5 rounded-lg border border-gray-200">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Participation Categories -->
          <div class="col-span-1">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Participation Categories <span class="text-red-500">*</span>
            </label>
            <div class="space-y-2">
              <div v-for="categoryOption in props.participationCategoryOptions" :key="categoryOption.value"
                class="flex items-center">
                <input type="checkbox" :id="`category-${categoryOption.value}`" :value="categoryOption.value"
                  v-model="selectedCategories"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                <label :for="`category-${categoryOption.value}`" class="ml-2 text-sm text-gray-700">{{
                  categoryOption.text }}</label>
              </div>
            </div>
            <p v-if="!props.participationCategoryOptions || props.participationCategoryOptions.length === 0"
              class="mt-1 text-xs text-orange-500 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24"
                stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              No categories available to select.
            </p>
          </div>

          <!-- Participant Subcategories -->
          <div class="col-span-1">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Participant Subcategories <span class="text-red-500">*</span>
            </label>
            <div class="space-y-2">
              <div v-for="subcategoryOption in props.participantSubcategoryOptions" :key="subcategoryOption.value"
                class="flex items-center">
                <input type="checkbox" :id="`subcategory-${subcategoryOption.value}`" :value="subcategoryOption.value"
                  v-model="selectedSubcategories"
                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                <label :for="`subcategory-${subcategoryOption.value}`" class="ml-2 text-sm text-gray-700">{{
                  subcategoryOption.text }}</label>
              </div>
            </div>
            <p v-if="!props.participantSubcategoryOptions || props.participantSubcategoryOptions.length === 0"
              class="mt-1 text-xs text-orange-500 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24"
                stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              No subcategories available to select.
            </p>
          </div>

          <!-- Number of Participants -->
          <div class="col-span-1">
            <label for="numberParticipants" class="block text-sm font-medium text-gray-700 mb-1">
              Number of Participants <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <input type="number" id="numberParticipants" :value="props.participantDetails.number"
                @input="handleFieldUpdate('number', $event.target.value === '' ? null : (Number($event.target.value) >= 1 ? Number($event.target.value) : props.participantDetails.number))"
                placeholder="Enter total number of participants" min="1"
                class="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 pl-10 bg-white" />
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Relevance to Profession -->
          <div class="col-span-1 md:col-span-2">
            <label for="relevanceProfession" class="block text-sm font-medium text-gray-700 mb-1">
              Relevance to Profession <span v-if="isRelevanceMandatory" class="text-red-500">*</span>
            </label>
            <div class="relative">
              <textarea id="relevanceProfession" :value="props.participantDetails.relevance"
                @input="handleFieldUpdate('relevance', $event.target.value)"
                placeholder="Explain how this CPD is relevant to your professional development and practice..."
                class="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 pl-10 bg-white"
                rows="4"></textarea>
              <div class="absolute top-3 left-3 flex items-start pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <p v-if="isRelevanceMandatory" class="mt-1 text-sm text-red-500">
              This field is mandatory since multiple categories are selected. Please justify why the training is
              relevant to multi-disciplinary participants.
            </p>
            <p v-else class="mt-1 text-sm text-gray-500">
              This field is optional for single category selection.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';

const props = defineProps({
  participantDetails: {
    type: Object,
    required: true,
    default: () => ({
      category: [],    // Fixed: using 'category' instead of 'categories'
      subcategory: [], // Fixed: using 'subcategory' instead of 'subcategories'
      number: null,
      relevance: '',
    }),
  },
  participationCategoryOptions: {
    type: Array,
    default: () => [],
  },
  participantSubcategoryOptions: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['update:participantDetails']);

// Fixed: Initialize with correct field names from props
const selectedCategories = ref(props.participantDetails.category || []);
const selectedSubcategories = ref(props.participantDetails.subcategory || []);

// Computed property to determine if relevance is mandatory
const isRelevanceMandatory = computed(() => selectedCategories.value.length > 1);

// Watch selectedCategories and emit updates with correct field name
watch(selectedCategories, (newVal) => {
  console.log('Categories changed:', newVal);
  emit('update:participantDetails', {
    ...props.participantDetails,
    category: newVal,  // Fixed: using 'category' instead of 'categories'
  });
}, { deep: true });

// Watch selectedSubcategories and emit updates with correct field name
watch(selectedSubcategories, (newVal) => {
  console.log('Subcategories changed:', newVal);
  emit('update:participantDetails', {
    ...props.participantDetails,
    subcategory: newVal,  // Fixed: using 'subcategory' instead of 'subcategories'
  });
}, { deep: true });

// Watch props.participantDetails to sync local state
watch(() => props.participantDetails, (newDetails) => {
  if (newDetails) {
    selectedCategories.value = newDetails.category || [];
    selectedSubcategories.value = newDetails.subcategory || [];
  }
}, { deep: true });

// Watch participantSubcategoryOptions to filter out unavailable subcategories
watch(() => props.participantSubcategoryOptions, (newOptions) => {
  if (newOptions && Array.isArray(newOptions)) {
    const availableSubcatIds = newOptions.map(opt => opt.value);
    const updatedSubcategories = selectedSubcategories.value.filter(subcat => availableSubcatIds.includes(subcat));
    if (updatedSubcategories.length !== selectedSubcategories.value.length) {
      selectedSubcategories.value = updatedSubcategories;
      emit('update:participantDetails', {
        ...props.participantDetails,
        subcategory: updatedSubcategories,  // Fixed: using 'subcategory'
      });
    }
  }
});

// Handle updates for number and relevance fields
const handleFieldUpdate = (field, value) => {
  console.log(`Field ${field} updated:`, value);
  emit('update:participantDetails', {
    ...props.participantDetails,
    [field]: value,
  });
};
</script>