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
                :value="participantDetails.category"
                @change="handleCategoryChange($event.target.value)"
                class="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 pl-10 bg-white appearance-none pr-10"
              >
                <option value="" disabled>Select Category</option>
                <option
                  v-for="categoryOption in participationCategoryOptions"
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
            <div class="relative">
              <select
                id="participantSubcategory"
                :value="participantDetails.subcategory"
                @change="handleFieldUpdate('subcategory', $event.target.value)"
                class="block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 pl-10 bg-white appearance-none pr-10"
                :disabled="!participantDetails.category || (filteredSubcategories && filteredSubcategories.length === 0)"
              >
                <option value="" disabled>Select Sub-Category</option>
                <option
                  v-for="subcategoryOption in filteredSubcategories"
                  :key="subcategoryOption.value"
                  :value="subcategoryOption.value"
                >
                  {{ subcategoryOption.text }}
                </option>
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
            <p v-if="!participantDetails.category" class="mt-1 text-xs text-gray-500 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Please select a category first
            </p>
             <p v-if="participantDetails.category && filteredSubcategories && filteredSubcategories.length === 0" class="mt-1 text-xs text-orange-500 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              No subcategories available for the selected category.
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
                :value="participantDetails.number"
                @input="handleFieldUpdate('number', $event.target.value === '' ? null : (Number($event.target.value) >= 1 ? Number($event.target.value) : participantDetails.number))"
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
                :value="participantDetails.relevance"
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
import { watch } from 'vue'; // Make sure watch is imported

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
  // loadSubcategories prop removed as it's handled by parent's computed property
  filteredSubcategories: { // This prop receives the already filtered subcategories
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['update:participantDetails']);

// --- START: MODIFIED/ADDED FOR DEBUGGING ---
watch(() => props.participantDetails, (newVal) => {
  console.log("%cCHILD: props.participantDetails changed:", "color: green; font-weight: bold;", JSON.parse(JSON.stringify(newVal)));
}, { deep: true, immediate: true }); // immediate: true to log initial value

watch(() => props.filteredSubcategories, (newVal) => {
  console.log("%cCHILD: props.filteredSubcategories changed:", "color: green; font-weight: bold;", JSON.parse(JSON.stringify(newVal)));
  if (newVal) { // Check if newVal is defined
    const isDisabled = !props.participantDetails.category || newVal.length === 0;
    console.log(`%cCHILD: Subcategory dropdown disabled? ${isDisabled}`, "color: green; font-weight: bold;");
    console.log(`CHILD:   !props.participantDetails.category: ${!props.participantDetails.category}`);
    console.log(`CHILD:   filteredSubcategories.length === 0: ${newVal.length === 0}`);
  } else {
    console.log("%cCHILD: props.filteredSubcategories is undefined/null.", "color: red; font-weight: bold;");
  }
}, { deep: true, immediate: true }); // immediate: true to log initial value
// --- END: MODIFIED/ADDED FOR DEBUGGING ---

const handleCategoryChange = (newCategoryId) => {
  console.log("CHILD: handleCategoryChange called with newCategoryId:", newCategoryId);
  emit('update:participantDetails', {
    // ...props.participantDetails, // No need to spread if parent handles reset correctly
    category: newCategoryId,
    subcategory: '', // Explicitly reset subcategory here when category changes
  });
};

const handleFieldUpdate = (field, value) => {
  console.log(`CHILD: handleFieldUpdate called for field: ${field}, value: ${value}`);
  emit('update:participantDetails', {
    ...props.participantDetails,
    [field]: value,
  });
};
</script>