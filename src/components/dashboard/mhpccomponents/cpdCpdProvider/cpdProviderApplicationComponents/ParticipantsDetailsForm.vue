<!-- ParticipantsDetailsForm.vue -->
<template>
  <div class="space-y-6 p-4 border border-gray-200 rounded-md">
    <h3 class="text-lg font-medium leading-6 text-gray-900">Participant Details</h3>

    <div>
      <label for="participation-category" class="block text-sm font-medium text-gray-700">
        Participation Category <span class="text-red-500">*</span>
      </label>
      <select
        id="participation-category"
        multiple
        v-model="localDetails.category"
        @change="handleCategoryChange"
        class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        :class="{'border-red-500': errors && errors.categories}"
      >
        <option v-for="option in participationCategoryOptions" :key="option.value" :value="option.value">
          {{ option.text }}
        </option>
      </select>
      <p v-if="errors && errors.categories" class="mt-2 text-sm text-red-600">{{ errors.categories }}</p>
    </div>

    <div v-if="localDetails.category && localDetails.category.length > 0 && filteredSubcategoryOptions.length > 0">
      <label for="participant-subcategory" class="block text-sm font-medium text-gray-700">
        Participant Sub-Category <span class="text-red-500">*</span>
      </label>
      <select
        id="participant-subcategory"
        multiple
        v-model="localDetails.subcategory"
        @change="emitUpdate"
        class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        :class="{'border-red-500': errors && errors.subcategories}"
      >
        <option v-for="option in filteredSubcategoryOptions" :key="option.value" :value="option.value">
          {{ option.text }}
        </option>
      </select>
      <p v-if="errors && errors.subcategories" class="mt-2 text-sm text-red-600">{{ errors.subcategories }}</p>
    </div>
     <div v-else-if="localDetails.category && localDetails.category.length > 0 && participantSubcategoryOptions.length > 0 && filteredSubcategoryOptions.length === 0">
        <p class="mt-1 text-sm text-gray-500">No sub-categories available for the selected category/categories. (If sub-categories are mandatory, this might be an issue)</p>
    </div>


    <div>
      <label for="number-of-participants" class="block text-sm font-medium text-gray-700">
        Number of Participants <span class="text-red-500">*</span>
      </label>
      <input
        type="number"
        id="number-of-participants"
        v-model.number="localDetails.number"
        @input="emitUpdate"
        min="1"
        class="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
        :class="{'border-red-500': errors && errors.number}"
      />
      <p v-if="errors && errors.number" class="mt-2 text-sm text-red-600">{{ errors.number }}</p>
    </div>

    <div v-if="localDetails.category && localDetails.category.length > 1">
      <label for="relevance-to-profession" class="block text-sm font-medium text-gray-700">
        Relevance to Profession (if multiple categories selected) <span class="text-red-500">*</span>
      </label>
      <textarea
        id="relevance-to-profession"
        v-model="localDetails.relevance"
        @input="emitUpdate"
        rows="3"
        class="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
        :class="{'border-red-500': errors && errors.relevance}"
      ></textarea>
      <p v-if="errors && errors.relevance" class="mt-2 text-sm text-red-600">{{ errors.relevance }}</p>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch, computed, } from 'vue';

const props = defineProps({
  participantDetails: {
    type: Object,
    required: true,
    default: () => ({ category: [], subcategory: [], number: null, relevance: '' })
  },
  participationCategoryOptions: {
    type: Array,
    default: () => []
  },
  participantSubcategoryOptions: {
    type: Array,
    default: () => []
  },
  errors: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(['update:participantDetails']);

const localDetails = reactive({
  category: [],
  subcategory: [],
  number: null,
  relevance: ''
});

// Sync localDetails with props on mount and when props change
watch(() => props.participantDetails, (newDetails) => {
  localDetails.category = Array.isArray(newDetails.category) ? [...newDetails.category] : [];
  localDetails.subcategory = Array.isArray(newDetails.subcategory) ? [...newDetails.subcategory] : [];
  localDetails.number = (newDetails.number === null || newDetails.number === undefined) ? null : Number(newDetails.number);
  localDetails.relevance = newDetails.relevance || '';
}, { deep: true, immediate: true });


const filteredSubcategoryOptions = computed(() => {
  if (!localDetails.category || localDetails.category.length === 0 || !props.participantSubcategoryOptions) {
    return [];
  }
  return props.participantSubcategoryOptions.filter(subOpt =>
    localDetails.category.includes(subOpt.categoryId) // categoryId from parent's mapping
  );
});

const handleCategoryChange = () => {
  // When category changes, filter existing selected subcategories
  // to ensure they are still valid for the new set of selected categories.
  const validSelectedSubcategories = localDetails.subcategory.filter(subId =>
    filteredSubcategoryOptions.value.some(opt => opt.value === subId)
  );
  if (localDetails.subcategory.length !== validSelectedSubcategories.length) {
      localDetails.subcategory = validSelectedSubcategories;
  }
  emitUpdate();
};

const emitUpdate = () => {
  const numberToSend = (localDetails.number === '' || localDetails.number === null || isNaN(parseInt(localDetails.number)))
                       ? null
                       : parseInt(localDetails.number);
  emit('update:participantDetails', {
    category: [...localDetails.category],
    subcategory: [...localDetails.subcategory],
    number: numberToSend,
    relevance: localDetails.relevance.trim()
  });
};

// If you need to emit initial state on mount, uncomment this.
// However, typically the parent initializes the data, and changes are emitted on user interaction.
// onMounted(() => {
//   emitUpdate();
// });
</script>