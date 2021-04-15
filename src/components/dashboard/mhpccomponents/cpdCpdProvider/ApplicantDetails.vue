<template>
    <div class="border-b border-gray-200 bg-gray-50 p-6 rounded-t-xl">
        <h3 class="text-lg font-semibold text-gray-900">Applicant Details</h3>
        <p class="mt-1 text-sm text-gray-500">Information about the applicant.</p>
    </div>

    <div class="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="col-span-1">
            <label for="registrationNumber" class="block text-sm font-medium text-gray-700">
                Registration Number <span class="text-red-600">*</span>
            </label>
            <input type="text" id="registrationNumber" :value="modelValue.registrationNumber"
                @input="$emit('update:modelValue', { ...modelValue, registrationNumber: $event.target.value })" 
                :disabled="isDisabled"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500 p-2.5"
                :class="{ 'bg-gray-50': isDisabled }" />
        </div>
        
        <div class="col-span-1">
            <label for="cidNumber" class="block text-sm font-medium text-gray-700">
                CID No./Identity/Work Permit No.
            </label>
            <input type="text" id="cidNumber" :value="modelValue.cidNumber"
                @input="$emit('update:modelValue', { ...modelValue, cidNumber: $event.target.value })" 
                :disabled="isDisabled"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500 p-2.5"
                :class="{ 'bg-gray-50': isDisabled }" />
        </div>
        
        <div class="col-span-1">
            <label for="fullName" class="block text-sm font-medium text-gray-700">
                Full Name
            </label>
            <input type="text" id="fullName" :value="modelValue.fullName"
                @input="$emit('update:modelValue', { ...modelValue, fullName: $event.target.value })" 
                :disabled="isDisabled"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500 p-2.5"
                :class="{ 'bg-gray-50': isDisabled }" />
        </div>
        
        <div class="col-span-1">
            <label for="agencyTrainingLocation" class="block text-sm font-medium text-gray-700">
                Agency/Training Location <span class="text-red-600">*</span>
            </label>
            <input type="text" id="agencyTrainingLocation" :value="modelValue.agencyTrainingLocation"
                @input="$emit('update:modelValue', { ...modelValue, agencyTrainingLocation: $event.target.value })"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500 p-2.5" />
        </div>
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

defineEmits(['update:modelValue']);
</script>