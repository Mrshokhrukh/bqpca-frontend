<template>
    <div>
        <label v-if="label" class="form-label">{{ label }}</label>
        <div class="readonly-field-container">
            <div class="readonly-field-value">
                {{ value || 'N/A' }}
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    label: {
        type: String,
        default: '',
    },
    value: {
        type: [String, Number, null, undefined],
        default: '',
    },
})
</script>

<style scoped>
/* Scoped styles are defined in the parent component for consistency or can be added here if specific */
.form-label {
    @apply block text-sm font-medium text-gray-700 mb-1.5;
}
.readonly-field-container {
    @apply mt-1;
} /* Adjusts spacing if label is present */
.readonly-field-value {
    @apply block w-full px-3 py-2.5 bg-gray-100 border border-gray-200 rounded-md shadow-sm sm:text-sm text-gray-700 min-h-[46px] flex items-center;
} /* Ensure min-height matches inputs */
</style>
