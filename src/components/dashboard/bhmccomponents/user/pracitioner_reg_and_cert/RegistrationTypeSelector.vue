<template>
  <div class="max-w-3xl mx-auto p-6">
    <h2 class="text-2xl font-bold text-gray-900 mb-8 text-center">
      Select Registration Type
    </h2>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
      <div
        v-for="option in options"
        :key="option.value"
        class="relative group"
      >
        <div
          class="p-6 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md"
          :class="[
            localValue === option.value
              ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-500'
              : 'border-gray-300 hover:border-blue-400 hover:ring-1 hover:ring-blue-400'
          ]"
          @click="selectOption(option.value)"
        >
          <div class="flex items-start space-x-4">
            <!-- Icon Section -->
            <div
              class="p-3 rounded-lg transition-colors"
              :class="[
                localValue === option.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-blue-500 group-hover:bg-blue-600 group-hover:text-white'
              ]"
            >
              <UserCircle
                v-if="option.value === 'cid'"
                class="w-6 h-6"
              />
              <Users
                v-else
                class="w-6 h-6"
              />
            </div>

            <!-- Label and Description -->
            <div class="flex-1">
              <h3 class="font-semibold text-gray-900 text-lg">
                {{ option.label }}
              </h3>
              <p class="text-gray-600 text-sm mt-1">
                {{ option.description }}
              </p>
            </div>

            <!-- Selection Indicator -->
            <div
              class="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors"
              :class="[
                localValue === option.value
                  ? 'border-blue-600 bg-blue-600'
                  : 'border-gray-300 group-hover:border-blue-400'
              ]"
            >
              <Check
                class="w-4 h-4 text-white"
                :class="{ 'opacity-0': localValue !== option.value }"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Continue Button -->
    <div class="flex justify-center">
      <button
        class="py-3 px-8 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center space-x-2"
        :disabled="!localValue"
        @click="$emit('next')"
      >
        <span>Continue</span>
        <ArrowRight class="w-4 h-4" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { UserCircle, Users, Check, ArrowRight } from 'lucide-vue-next';

// Define props
const props = defineProps({
  options: {
    type: Array,
    required: true,
  },
  modelValue: {
    type: String,
    required: false,
    default: '',
  },
});

// Define emits
const emit = defineEmits(['update:modelValue', 'next']);

// Local reactive variable to handle the selected value
const localValue = ref(props.modelValue);

// Watch for changes in `modelValue` and sync with `localValue`
watch(
  () => props.modelValue,
  (newValue) => {
    localValue.value = newValue;
  }
);

// Handle option selection
function selectOption(value) {
  localValue.value = value; // Update local state
  emit('update:modelValue', value); // Sync changes with the parent
}
</script>
