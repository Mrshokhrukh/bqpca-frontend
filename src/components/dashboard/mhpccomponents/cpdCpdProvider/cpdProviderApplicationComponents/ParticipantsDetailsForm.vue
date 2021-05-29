<!-- ParticipantsDetailsForm.vue -->
<template>
  <div
    v-if="areOptionsLoaded && participationCategoryOptions?.length && participantSubcategoryOptions?.length >= 0"
    class="bg-gray-50 rounded-lg p-6 mb-6"
  >
    <h3 class="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
      Participant Details
    </h3>

    <!-- Participation Category -->
    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Participation Category <span class="text-red-500">*</span>
      </label>
      <div
        v-if="!participationCategoryOptions?.length"
        class="text-gray-500 text-sm"
      >
        No categories available
      </div>
      <div
        v-else
        class="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto border border-gray-200 rounded-md p-4 bg-white"
      >
        <div
          v-for="category in participationCategoryOptions"
          :key="category.value"
          class="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded"
        >
          <input
            :id="`category-${category.value}`"
            v-model="localParticipantDetails.category"
            :value="category.value"
            type="checkbox"
            class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            @change="emitParticipantDetailsUpdate"
          />
          <label
            :for="`category-${category.value}`"
            class="text-sm text-gray-700 cursor-pointer flex-1 leading-5"
          >
            {{ category.text }}
          </label>
        </div>
      </div>
      <p v-if="errors.categories" class="mt-1 text-sm text-red-600">
        {{ errors.categories }}
      </p>
    </div>

    <!-- Participant Sub-Category -->
    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Participant Sub-Category <span class="text-red-500">*</span>
      </label>
      <div
        v-if="!filteredSubcategories?.length"
        class="text-gray-500 text-sm"
      >
        No subcategories available for selected categories
      </div>
      <div
        v-else
        class="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto border border-gray-200 rounded-md p-4 bg-white"
      >
        <div
          v-for="subcategory in filteredSubcategories"
          :key="subcategory.value"
          class="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded"
        >
          <input
            :id="`subcategory-${subcategory.value}`"
            v-model="localParticipantDetails.subcategory"
            :value="subcategory.value"
            type="checkbox"
            class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            @change="emitParticipantDetailsUpdate"
          />
          <label
            :for="`subcategory-${subcategory.value}`"
            class="text-sm text-gray-700 cursor-pointer flex-1 leading-5"
          >
            {{ subcategory.text }}
          </label>
        </div>
      </div>
      <p v-if="errors.subcategories" class="mt-1 text-sm text-red-600">
        {{ errors.subcategories }}
      </p>
    </div>

    <!-- Number of Participants -->
    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Number of Participants <span class="text-red-500">*</span>
      </label>
      <input
        v-model.number="localParticipantDetails.number"
        type="number"
        min="1"
        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        @input="emitParticipantDetailsUpdate"
      />
      <p v-if="errors.number" class="mt-1 text-sm text-red-600">
        {{ errors.number }}
      </p>
    </div>

    <!-- Relevance to Profession -->
    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-2">
        Relevance to Profession <span v-if="localParticipantDetails.category.length > 1" class="text-red-500">*</span>
      </label>
      <textarea
        v-model="localParticipantDetails.relevance"
        rows="4"
        placeholder="Describe the relevance to the profession..."
        class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        @input="emitParticipantDetailsUpdate"
      ></textarea>
      <p v-if="errors.relevance" class="mt-1 text-sm text-red-600">
        {{ errors.relevance }}
      </p>
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
      category: [],
      subcategory: [],
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
  errors: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(['update:participantDetails']);

const areOptionsLoaded = computed(() => {
  const isLoaded = props.participationCategoryOptions?.length > 0 && Array.isArray(props.participantSubcategoryOptions);
  console.log('areOptionsLoaded:', {
    isLoaded,
    categoryOptionsLength: props.participationCategoryOptions?.length,
    subcategoryOptionsIsArray: Array.isArray(props.participantSubcategoryOptions),
    subcategoryOptionsLength: props.participantSubcategoryOptions?.length,
  });
  return isLoaded;
});

const localParticipantDetails = ref({
  category: Array.isArray(props.participantDetails.category) ? [...props.participantDetails.category] : [],
  subcategory: Array.isArray(props.participantDetails.subcategory) ? [...props.participantDetails.subcategory] : [],
  number: Number(props.participantDetails.number) || null,
  relevance: props.participantDetails.relevance?.trim() || '',
});

const filteredSubcategories = computed(() => {
  console.log('Computing filteredSubcategories:', {
    selectedCategories: localParticipantDetails.value.category,
    subcategoryOptions: props.participantSubcategoryOptions,
  });
  if (!Array.isArray(props.participantSubcategoryOptions)) {
    console.warn('participantSubcategoryOptions is not an array:', props.participantSubcategoryOptions);
    return [];
  }
  if (!localParticipantDetails.value.category.length) {
    return props.participantSubcategoryOptions;
  }
  const filtered = props.participantSubcategoryOptions.filter((subcategory) => {
    const categoryId = subcategory?.categoryId ?? subcategory?.category;
    if (!categoryId) {
      console.warn('Subcategory missing categoryId:', subcategory);
      return false;
    }
    const includes = localParticipantDetails.value.category.some((cat) =>
      String(cat) === String(categoryId)
    );
    return includes;
  });
  console.log('Filtered Subcategories:', filtered);
  return filtered;
});

// Debounce the emit to prevent recursive updates
let emitTimeout = null;
const emitParticipantDetailsUpdate = () => {
  clearTimeout(emitTimeout);
  emitTimeout = setTimeout(() => {
    console.log('Emitting participantDetails update:', localParticipantDetails.value);
    emit('update:participantDetails', {
      category: [...localParticipantDetails.value.category],
      subcategory: [...localParticipantDetails.value.subcategory],
      number: Number(localParticipantDetails.value.number) || null,
      relevance: localParticipantDetails.value.relevance?.trim() || '',
    });
  }, 100);
};

watch(
  () => props.participantDetails,
  (newValue) => {
    localParticipantDetails.value = {
      category: Array.isArray(newValue.category) ? [...newValue.category] : [],
      subcategory: Array.isArray(newValue.subcategory) ? [...newValue.subcategory] : [],
      number: Number(newValue.number) || null,
      relevance: newValue.relevance?.trim() || '',
    };
  },
  { deep: true }
);

// Remove the watcher on localParticipantDetails to prevent recursive updates
// Instead, rely on explicit @change and @input events
</script>