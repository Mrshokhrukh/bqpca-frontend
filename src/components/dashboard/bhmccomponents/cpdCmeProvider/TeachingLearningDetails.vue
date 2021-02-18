<template>
    <div class="border-b border-gray-200 bg-gray-50 p-6 rounded-t-xl">
        <h3 class="text-lg font-semibold text-gray-900">Teaching Learning Method</h3>
        <p class="mt-1 text-sm text-gray-500">Details about the teaching and learning methods.</p>
    </div>

    <div class="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="col-span-1">
            <label for="cpdType" class="block text-sm font-medium text-gray-700">Type of CPD</label>
            <select id="cpdType" :value="modelValue.cpdType"
                @change="$emit('update:modelValue', { ...modelValue, cpdType: $event.target.value })"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500 p-2.5">
                <option value="" disabled>Select Type</option>
                <option value="type1">Type 1</option>
                <option value="type2">Type 2</option>
            </select>
        </div>

        <div class="col-span-1">
            <label for="methodologies" class="block text-sm font-medium text-gray-700">Methodologies</label>
            <select id="methodologies" :value="modelValue.methodologies"
                @change="$emit('update:modelValue', { ...modelValue, methodologies: $event.target.value })"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500 p-2.5">
                <option value="" disabled>Select Methodology</option>
                <option value="method1">Method 1</option>
                <option value="method2">Method 2</option>
            </select>
        </div>

        <div class="col-span-1">
            <label for="expectedOutcome" class="block text-sm font-medium text-gray-700">Expected Outcome</label>
            <input type="text" id="expectedOutcome" :value="modelValue.expectedOutcome"
                @input="$emit('update:modelValue', { ...modelValue, expectedOutcome: $event.target.value })"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500 p-2.5" />
        </div>

        <div class="col-span-1">
            <label for="activity" class="block text-sm font-medium text-gray-700">Activity</label>
            <input type="text" id="activity" :value="modelValue.activity"
                @input="$emit('update:modelValue', { ...modelValue, activity: $event.target.value })"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500 p-2.5" />
        </div>

        <div class="col-span-1">
            <label for="durationHours" class="block text-sm font-medium text-gray-700">Duration in Hours</label>
            <input type="number" id="durationHours" :value="modelValue.durationHours"
                @input="$emit('update:modelValue', { ...modelValue, durationHours: Number($event.target.value) })"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500 p-2.5" />
        </div>

        <div class="col-span-1">
            <label for="credit" class="block text-sm font-medium text-gray-700">Credit</label>
            <input type="text" id="credit" :value="modelValue.credit" disabled
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500 p-2.5 bg-gray-50" />
        </div>

        <div class="col-span-1">
            <label for="courseDocument" class="block text-sm font-medium text-gray-700">Course Document</label>
            <input type="file" id="courseDocument" @change="$emit('update:modelValue', { ...modelValue, courseDocument: $event.target.files[0] })"
                class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4
                               file:rounded-lg file:border-0 file:text-sm file:font-semibold
                               file:bg-green-50 file:text-green-700 hover:file:bg-green-100" />
        </div>
    </div>
</template>

<script setup>
import { watch } from 'vue';

const props = defineProps({
    modelValue: {
        type: Object,
        required: true
    }
});

const emit = defineEmits(['update:modelValue']);

// Auto-calculate credit based on durationHours
watch(
    () => props.modelValue.durationHours,
    (newDuration) => {
        const credit = newDuration ? newDuration / 2 : 0; // Example calculation
        emit('update:modelValue', { ...props.modelValue, credit: credit });
    },
    { immediate: true } // Calculate credit on component mount
);
</script>
