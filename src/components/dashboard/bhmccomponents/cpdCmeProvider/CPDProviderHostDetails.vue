<template>
    <div class="border-b border-gray-200 bg-gray-50 p-6 rounded-t-xl">
        <h3 class="text-lg font-semibold text-gray-900">CPD Provider (Host) Details</h3>
        <p class="mt-1 text-sm text-gray-500">Information about the CPD provider.</p>
    </div>

    <div class="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="col-span-1">
            <label for="providingAgency" class="block text-sm font-medium text-gray-700">CPD Providing Agency</label>
            <select id="providingAgency" :value="modelValue.providingAgency"
                @input="emit('update:modelValue', { ...modelValue, providingAgency: $event.target.value })"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500 p-2.5">
                <option value="" disabled>Select Agency</option>
                <option value="agency1">Agency 1</option>
                <option value="agency2">Agency 2</option>
                <option value="other">Other</option>
            </select>
        </div>

        <div v-if="modelValue.providingAgency === 'other'" class="col-span-1">
            <label for="otherAgency" class="block text-sm font-medium text-gray-700">Specify Other Agency</label>
            <input type="text" id="otherAgency" :value="modelValue.otherAgency"
                @input="emit('update:modelValue', { ...modelValue, otherAgency: $event.target.value })"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500 p-2.5" />
        </div>

        <div class="col-span-1">
            <label for="reasonConducting" class="block text-sm font-medium text-gray-700">Reason for Conducting</label>
            <select id="reasonConducting" :value="modelValue.reasonConducting"
                @input="emit('update:modelValue', { ...modelValue, reasonConducting: $event.target.value })"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500 p-2.5">
                <option value="" disabled>Select Reason</option>
                <option value="reason1">Reason 1</option>
                <option value="reason2">Reason 2</option>
            </select>
        </div>

        <div class="col-span-1">
            <label for="reasonDetails" class="block text-sm font-medium text-gray-700">Reason Details</label>
            <input type="text" id="reasonDetails" :value="modelValue.reasonDetails"
                @input="emit('update:modelValue', { ...modelValue, reasonDetails: $event.target.value })"
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

const emit = defineEmits(['update:modelValue']);
</script>
