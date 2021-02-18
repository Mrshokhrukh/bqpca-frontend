<template>
    <div class="border-b border-gray-200 bg-gray-50 p-6 rounded-t-xl">
        <h3 class="text-lg font-semibold text-gray-900">Participant Details</h3>
        <p class="mt-1 text-sm text-gray-500">Details about the participants.</p>
    </div>

    <div class="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="col-span-1">
            <label for="participationCategory" class="block text-sm font-medium text-gray-700">Participation Category</label>
            <select id="participationCategory" :value="modelValue.participationCategory"
                @input="$emit('update:modelValue', { ...modelValue, participationCategory: $event.target.value })"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500 p-2.5">
                <option value="" disabled>Select Category</option>
                <option value="category1">Category 1</option>
                <option value="category2">Category 2</option>
            </select>
        </div>

        <div class="col-span-1">
            <label for="participantSubCategory" class="block text-sm font-medium text-gray-700">Participant Sub-category</label>
            <select id="participantSubCategory" :value="modelValue.participantSubCategory"
                @input="$emit('update:modelValue', { ...modelValue, participantSubCategory: $event.target.value })"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500 p-2.5">
                <option value="" disabled>Select Sub-category</option>
                <option value="subcategory1">Sub-category 1</option>
                <option value="subcategory2">Sub-category 2</option>
            </select>
        </div>

        <div class="col-span-1">
            <label for="numberOfParticipants" class="block text-sm font-medium text-gray-700">Number of Participants</label>
            <input type="number" id="numberOfParticipants" :value="modelValue.numberOfParticipants"
                @input="$emit('update:modelValue', { ...modelValue, numberOfParticipants: Number($event.target.value) })"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500 p-2.5" />
        </div>

        <div class="col-span-1">
            <label for="relevanceProfession" class="block text-sm font-medium text-gray-700">Relevance Profession</label>
            <input type="text" id="relevanceProfession" :value="modelValue.relevanceProfession"
                @input="$emit('update:modelValue', { ...modelValue, relevanceProfession: $event.target.value })"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500 p-2.5" />
        </div>
    </div>
</template>

<script setup>

defineProps({
    modelValue: {
        type: Object,
        required: true
    }
});

defineEmits(['update:modelValue']);
</script>
