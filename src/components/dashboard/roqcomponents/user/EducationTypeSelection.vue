<!-- EducationTypeSelection.vue -->
<template>
  <div class="w-full max-w-4xl mx-auto">
    <div class="bg-white border rounded-lg shadow-sm p-8">
      <div class="text-center mb-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-2">Education Details</h2>
        <p class="text-gray-600">Please select where you completed your education</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- In-Country Option -->
        <button
          type="button"
          @click="$emit('update:modelValue', true)"
          :class="[
            'flex flex-col items-center p-6 rounded-lg border-2 transition-all duration-200 hover:shadow-md',
            modelValue === true
              ? 'border-primary bg-primary/5'
              : 'border-gray-200 hover:border-gray-300',
          ]"
        >
          <div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <svg class="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 14l9-5-9-5-9 5 9 5z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 14l9-5-9-5-9 5 9 5z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 14l9-5-9-5-9 5 9 5z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 14l9-5-9-5-9 5 9 5z"
              />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">In-Country Education</h3>
          <p class="text-sm text-gray-600 text-center">
            Select if you studied at a Bhutanese institution
          </p>
        </button>

        <!-- International Option -->
        <button
          type="button"
          @click="$emit('update:modelValue', false)"
          :class="[
            'flex flex-col items-center p-6 rounded-lg border-2 transition-all duration-200 hover:shadow-md',
            modelValue === false
              ? 'border-primary bg-primary/5'
              : 'border-gray-200 hover:border-gray-300',
          ]"
        >
          <div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <svg class="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
              />
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">International Education</h3>
          <p class="text-sm text-gray-600 text-center">
            Select if you studied at an institution outside Bhutan
          </p>
        </button>
      </div>

      <div class="mt-6 text-center text-sm text-gray-500">
        <p>Your selection will determine the required documentation and verification process</p>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: Boolean,
    default: null,
  },
})

defineEmits(['update:modelValue'])
</script>
