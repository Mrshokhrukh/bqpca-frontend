<template>
  <div class="rounded-xl border border-gray-200 shadow-sm bg-white overflow-hidden">
    <!-- Header -->
    <div class="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b border-gray-200">
      <h3 class="text-xl font-semibold text-gray-800 flex items-center">
        <span class="inline-block mr-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
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
          <!-- Participation Category -->
          <div class="col-span-1">
            <label for="participationCategory" class="block text-sm font-medium text-gray-700 mb-1">
              Participation Category <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <select
                id="participationCategory"
                :value="props.participantDetails.category"
                @change="handleCategoryChange($event.target.value)"
                class="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 pl-10 bg-white appearance-none pr-10"
              >
                <option value="" disabled>Select Category</option>
                <option
                  v-for="categoryOption in props.participationCategoryOptions"
                  :key="categoryOption.value"
                  :value="categoryOption.value"
                >
                  {{ categoryOption.text }}
                </option>
              </select>
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                 <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Participant sub-category -->
          <div class="col-span-1">
            <label for="participantSubcategory" class="block text-sm font-medium text-gray-700 mb-1">
              Participant sub-category <span class="text-red-500">*</span>
            </label>

            <!-- DEBUGGING OUTPUT -->
            <div style="padding: 10px; margin-bottom: 10px; background-color: #f0f8ff; border: 1px solid #add8e6;">
              <p style="font-weight: bold; color: #333;">CHILD DEBUG: Subcategory Logic</p>
              <p style="color: #555;">Selected Main Category ID (props.participantDetails.category): {{ props.participantDetails.category }} (Type: {{ typeof props.participantDetails.category }})</p>
              <p style="font-weight: bold; color: #333; margin-top: 5px;">ALL Subcategories received via prop (props.participantSubCategoryOptions):</p>
              <pre style="white-space: pre-wrap; word-wrap: break-word; color: #555; max-height: 150px; overflow-y: auto;">{{ JSON.stringify(props.participantSubCategoryOptions, null, 2) }}</pre>
              <p style="color: #555;">Length of ALL Subcategories: {{ props.participantSubCategoryOptions ? props.participantSubCategoryOptions.length : 'N/A' }}</p>
              <p style="font-weight: bold; color: #333; margin-top: 5px;">FILTERED Subcategories (availableSubcategories - from computed):</p>
              <pre style="white-space: pre-wrap; word-wrap: break-word; color: #555; max-height: 150px; overflow-y: auto;">{{ JSON.stringify(availableSubcategories, null, 2) }}</pre>
              <p style="color: #555;">Length of FILTERED Subcategories: {{ availableSubcategories.length }}</p>
            </div>
            <!-- END DEBUGGING OUTPUT -->

            <div class="relative">
              <select
                id="participantSubcategory"
                :value="props.participantDetails.subcategory"
                @change="handleFieldUpdate('subcategory', $event.target.value)"
                class="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 pl-10 bg-white appearance-none pr-10"
                :disabled="!props.participantDetails.category || availableSubcategories.length === 0"
              >
                <option value="" disabled>
                  {{ !props.participantDetails.category ? 'Select main category first' : (availableSubcategories.length === 0 ? 'No subcategories for this category' : 'Select Sub-Category') }}
                  ({{ availableSubcategories.length }} available)
                </option>
                <!-- Iterate over the COMPUTED, FILTERED list -->
                <template v-if="availableSubcategories.length > 0">
                  <option
                    v-for="(subcategoryOption) in availableSubcategories"
                    :key="`subcat-opt-${subcategoryOption.value}`"
                    :value="subcategoryOption.value"
                  >
                    {{ subcategoryOption.text }}
                  </option>
                </template>
              </select>
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            <p v-if="props.participantDetails.category && availableSubcategories.length === 0" class="mt-1 text-xs text-orange-500 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              No subcategories available for the selected main category.
            </p>
             <p v-if="!props.participantDetails.category" class="mt-1 text-xs text-gray-500">
              Please select a main participation category first to see available subcategories.
            </p>
          </div>

          <!-- Number of Participants -->
          <div class="col-span-1">
            <label for="numberParticipants" class="block text-sm font-medium text-gray-700 mb-1">
              Number of Participants <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <input
                type="number"
                id="numberParticipants"
                :value="props.participantDetails.number"
                @input="handleFieldUpdate('number', $event.target.value === '' ? null : (Number($event.target.value) >= 1 ? Number($event.target.value) : props.participantDetails.number))"
                placeholder="Enter total number of participants"
                min="1"
                class="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 pl-10 bg-white"
              />
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Relevance to your profession -->
          <div class="col-span-1 md:col-span-2">
            <label for="relevanceProfession" class="block text-sm font-medium text-gray-700 mb-1">
              Relevance to profession <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <textarea
                id="relevanceProfession"
                :value="props.participantDetails.relevance"
                @input="handleFieldUpdate('relevance', $event.target.value)"
                placeholder="Explain how this CPD is relevant to your professional development and practice..."
                class="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 pl-10 bg-white"
                rows="4"
              ></textarea>
              <div class="absolute top-3 left-3 flex items-start pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <p class="mt-1 text-xs text-gray-500 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Be specific about how this training will enhance your professional skills and knowledge
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, defineProps, defineEmits, watch } from 'vue';

const props = defineProps({
  participantDetails: {
    type: Object,
    required: true,
    default: () => ({
      category: '',
      subcategory: '',
      number: null,
      relevance: '',
    }),
  },
  participationCategoryOptions: {
    type: Array,
    default: () => [],
  },
  participantSubCategoryOptions: { 
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['update:participantDetails']);

// Watcher for props.participantDetails (for debugging prop changes)
watch(() => props.participantDetails, (newVal) => {
  console.log(
    "%cCHILD: props.participantDetails changed (watcher):",
    "color: #4CAF50; font-weight: bold;", // Green
    JSON.parse(JSON.stringify(newVal)) // Safe cloning for complex objects
  );
}, { deep: true, immediate: true });

// Watcher for props.participantSubCategoryOptions (for debugging prop changes)
watch(() => props.participantSubCategoryOptions, (newVal, oldVal) => {
  console.log(
    "%cCHILD: props.participantSubCategoryOptions changed (watcher). New:",
    "color: #9C27B0; font-weight: bold;", // Purple
    JSON.parse(JSON.stringify(newVal)) // Safe cloning
  );
  if (oldVal !== undefined) {
    console.log(
      "%cCHILD: props.participantSubCategoryOptions changed (watcher). Old:",
      "color: #9C27B0;",
      JSON.parse(JSON.stringify(oldVal)) // Safe cloning
    );
  } else {
    console.log("%cCHILD: props.participantSubCategoryOptions changed (watcher). Old: undefined (primitive)", "color: #9C27B0;");
  }

  if (newVal && Array.isArray(newVal)) {
    console.log(`%cCHILD: Subcategory prop received (watcher). Length: ${newVal.length}. Options should update.`, "color: #9C27B0;");
  } else {
    console.log("%cCHILD: Subcategory prop is not an array or is null/undefined (watcher).", "color: #F44336;"); // Red
  }
}, { deep: true, immediate: true });


const handleCategoryChange = (newCategoryId) => {
  console.log("CHILD: handleCategoryChange called with newCategoryId:", newCategoryId, "(type:", typeof newCategoryId, ")");
  emit('update:participantDetails', {
    ...props.participantDetails,
    category: newCategoryId,
    subcategory: '', // IMPORTANT: Clear subcategory when main category changes
  });
};

const handleFieldUpdate = (field, value) => {
  console.log(`CHILD: handleFieldUpdate called for field: ${field}, value: ${value}`);
  emit('update:participantDetails', {
    ...props.participantDetails,
    [field]: value,
  });
};

const availableSubcategories = computed(() => {
  const selectedMainCategoryId = props.participantDetails.category;
  const allSubcategories = props.participantSubCategoryOptions;

  console.log("%cCHILD: `availableSubcategories` COMPUTED property running...", "color: blue; font-weight: bold;");
  console.log("  CHILD computed: Selected Main Category ID (props.participantDetails.category):", selectedMainCategoryId, "(Type:", typeof selectedMainCategoryId, ")");
  // console.log("  CHILD computed: All Subcategories from prop (props.participantSubCategoryOptions):", JSON.stringify(allSubcategories));


  if (!selectedMainCategoryId || !Array.isArray(allSubcategories) || allSubcategories.length === 0) {
    console.log("  CHILD computed: No main category selected or no subcategories available in prop. Returning [].");
    return [];
  }

  const filtered = allSubcategories.filter(sub => {
    // Ensure robust comparison, especially if IDs can be numbers or strings
    // The 'categoryId' in your subcategory objects (from parent) should now be the correct ID.
    // 'selectedMainCategoryId' (props.participantDetails.category) also comes as a string from select.
    const match = String(sub.categoryId) === String(selectedMainCategoryId);
    // console.log(`  CHILD computed: Comparing sub.categoryId: '${sub.categoryId}' (Type: ${typeof sub.categoryId}) WITH selectedMainCategoryId: '${selectedMainCategoryId}' (Type: ${typeof selectedMainCategoryId}) => Match: ${match}`);
    return match;
  });

  console.log("  CHILD computed: Filtered subcategories list:", JSON.stringify(filtered));
  return filtered;
});

</script>