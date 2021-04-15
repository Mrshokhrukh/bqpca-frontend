// 9. ParticipantsDetailsForm.vue
<template>
  <div>
    <div class="border-b border-gray-200 bg-gray-50 p-6 rounded-t-xl">
      <h3 class="text-lg font-semibold text-gray-900">Participants Details</h3>
      <p class="mt-1 text-sm text-gray-500">Details about the participants.</p>
    </div>

    <div class="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Participation Category -->
      <div class="col-span-1">
        <label for="participationCategory" class="block text-sm font-medium text-gray-700"
          >Participation Category <span class="text-red-500">*</span></label
        >
        <select
          id="participationCategory"
          :value="participantDetails.category"
          @change="loadSubcategories"
          class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
        >
          <option value="">Select Category</option>
          <option
            v-for="category in participationCategoryOptions"
            :key="category.value"
            :value="category.value"
          >
            {{ category.text }}
          </option>
        </select>
      </div>

      <!-- Participant sub-category -->
      <div class="col-span-1">
        <label for="participantSubcategory" class="block text-sm font-medium text-gray-700"
          >Participant sub-category <span class="text-red-500">*</span></label
        >
        <select
          id="participantSubcategory"
          :value="participantDetails.subcategory"
          class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
        >
          <option value="">Select Sub-Category</option>
          <option
            v-for="subcategory in filteredSubcategories"
            :key="subcategory.value"
            :value="subcategory.value"
          >
            {{ subcategory.text }}
          </option>
        </select>
      </div>

      <!-- Number of Participants -->
      <div class="col-span-1">
        <label for="numberParticipants" class="block text-sm font-medium text-gray-700"
          >Number of Participants <span class="text-red-500">*</span></label
        >
        <input
          type="number"
          id="numberParticipants"
          :value="participantDetails.number"
          class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
        />
      </div>

      <!-- Relevance to your profession -->
      <div class="col-span-1">
        <label for="relevanceProfession" class="block text-sm font-medium text-gray-700">
          Relevance to profession <span class="text-red-500">*</span>
        </label>
        <textarea
          id="relevanceProfession"
          :value="participantDetails.relevance"
          class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"
          rows="4"
        ></textarea>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  participantDetails: Object,
  participationCategoryOptions: Array,
  participantSubcategoryOptions: Array,
  loadSubcategories: Function,
  filteredSubcategories: Array,
})
</script>
