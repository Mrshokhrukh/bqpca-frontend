<template>
    <div class="border-b border-gray-200 bg-gray-50 p-6 rounded-t-xl">
        <h3 class="text-lg font-semibold text-gray-900">CPD Application Details</h3>
        <p class="mt-1 text-sm text-gray-500">Application specific information</p>
    </div>

    <div class="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="col-span-1">
            <label class="block text-sm font-medium text-gray-700">Is CPD Approved?</label>
            <div class="mt-1 space-y-2">
                <div class="flex items-center">
                    <input id="approved-yes" name="isApproved" type="radio" value="yes" :checked="modelValue.isApproved === 'yes'"
                        @change="$emit('update:modelValue', { ...modelValue, isApproved: 'yes' })"
                        class="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300" />
                    <label for="approved-yes" class="ml-3 block text-sm font-medium text-gray-700">Yes</label>
                </div>
                <div class="flex items-center">
                    <input id="approved-no" name="isApproved" type="radio" value="no" :checked="modelValue.isApproved === 'no'"
                        @change="$emit('update:modelValue', { ...modelValue, isApproved: 'no' })"
                        class="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300" />
                    <label for="approved-no" class="ml-3 block text-sm font-medium text-gray-700">No</label>
                </div>
            </div>
        </div>

        <div v-if="modelValue.isApproved === 'yes'" class="col-span-1">
            <label for="approvalLetter" class="block text-sm font-medium text-gray-700">Approval Letter</label>
            <input type="file" id="approvalLetter" class="mt-1 block w-full text-sm text-gray-500" />
        </div>

        <!-- Other fields -->
    </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

defineProps({
    modelValue: {
        type: Object,
        required: true
    }
});

defineEmits(['update:modelValue']);
</script>