<!-- eslint-disable no-unused-vars -->
<template>
    <div class="border-b border-gray-200 bg-gray-50 p-6 rounded-t-xl">
        <h3 class="text-lg font-semibold text-gray-900">Applicant Details</h3>
        <p class="mt-1 text-sm text-gray-500">Information about the applicant.</p>
    </div>

    <div class="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="col-span-1">
            <label for="registrationNumber" class="block text-sm font-medium text-gray-700">Registration Number</label>
            <input type="text" id="registrationNumber" :value="modelValue.registrationNumber"
                @input="$emit('update:modelValue', { ...modelValue, registrationNumber: $event.target.value })" disabled
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500 p-2.5 bg-gray-50" />
        </div>
        <!-- Add other fields -->
    </div>
</template>

<script setup>
defineProps({
    modelValue: {
        type: Object,
        required: true
    },
    isDisabled: {
        type: Boolean,
        default: false
    }
});

</script>