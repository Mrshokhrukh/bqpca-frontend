<template>
    <div class="input-field">
        <label v-if="label" class="input-label">
            {{ label }}
            <span v-if="required" class="required-indicator">*</span>
        </label>

        <input :type="type" :value="modelValue" :placeholder="placeholder"
            :class="['input-element', { 'input-error': error }]"
            @input="$emit('update:modelValue', $event.target.value)" @blur="validateInput">

        <span v-if="error" class="error-message">
            {{ error }}
        </span>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
    modelValue: [String, Number],
    label: String,
    placeholder: String,
    type: {
        type: String,
        default: 'text'
    },
    required: Boolean,
    validator: Function
});

const emit = defineEmits(['update:modelValue']);

const error = ref('');

function validateInput() {
    if (props.required && !props.modelValue?.trim()) {
        error.value = 'This field is required';
        return;
    }

    if (props.validator && !props.validator(props.modelValue)) {
        error.value = 'Invalid format';
        return;
    }

    error.value = '';
}
</script>

<style scoped>
.input-field {
    margin-bottom: 1.25rem;
}

.input-label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #334155;
}

.required-indicator {
    color: #ef4444;
    margin-left: 0.25rem;
}

.input-element {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.2s ease;
}

.input-element:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

.input-error {
    border-color: #ef4444;
}

.input-error:focus {
    border-color: #ef4444;
    box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.1);
}

.error-message {
    display: block;
    margin-top: 0.5rem;
    color: #ef4444;
    font-size: 0.875rem;
}
</style>