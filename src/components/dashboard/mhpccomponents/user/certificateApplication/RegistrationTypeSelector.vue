<template>
  <div class="max-w-4xl mx-auto p-6">
    <!-- Hero Section -->
    <div class="bg-gradient-to-r from-indigo-100 via-blue-50 to-indigo-100 rounded-2xl p-8 mb-10">
      <h2 class="text-3xl font-bold text-gray-900 mb-3 text-center">Select Registration Type</h2>
      <p class="text-gray-600 text-center max-w-2xl mx-auto">
        Choose the appropriate registration type based on your citizenship status. This will help us
        provide you with the relevant registration form.
      </p>
    </div>

    <!-- Cards Container -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
      <div v-for="option in options" :key="option.value" class="relative group">
        <div
          class="h-full p-8 border-2 rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-lg"
          :class="[
            localValue === option.value
              ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-500 transform scale-[1.02]'
              : 'border-gray-200 hover:border-blue-400 hover:ring-1 hover:ring-blue-400',
          ]"
          @click="selectOption(option.value)"
        >
          <!-- Icon Section with Larger Icons -->
          <div
            class="p-4 rounded-xl inline-flex transition-colors mb-6"
            :class="[
              localValue === option.value
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-blue-500 group-hover:bg-blue-600 group-hover:text-white',
            ]"
          >
            <UserCircle v-if="option.value === 'cid'" class="w-8 h-8" />
            <Users v-else class="w-8 h-8" />
          </div>

          <!-- Content Section -->
          <div class="space-y-4">
            <div class="flex items-start justify-between">
              <div>
                <h3 class="font-semibold text-gray-900 text-xl mb-2">
                  {{ option.label }}
                </h3>
                <p class="text-gray-600 leading-relaxed">
                  {{ option.description }}
                </p>
              </div>

              <!-- Selection Indicator -->
              <div
                class="w-7 h-7 rounded-full border-2 flex items-center justify-center transition-colors"
                :class="[
                  localValue === option.value
                    ? 'border-blue-600 bg-blue-600'
                    : 'border-gray-300 group-hover:border-blue-400',
                ]"
              >
                <Check
                  class="w-5 h-5 text-white transition-opacity duration-300"
                  :class="{ 'opacity-0': localValue !== option.value }"
                />
              </div>
            </div>

            <!-- Additional Information -->
            <div class="pt-4 border-t border-gray-200">
              <ul class="space-y-2">
                <li class="flex items-center text-sm text-gray-600">
                  <CheckCircle2 class="w-4 h-4 mr-2 text-green-500" />
                  {{
                    option.value === 'cid'
                      ? 'Valid CID required'
                      : 'Valid passport/work permit required'
                  }}
                </li>
                <li class="flex items-center text-sm text-gray-600">
                  <ClipboardCheck class="w-4 h-4 mr-2 text-green-500" />
                  {{
                    option.value === 'cid'
                      ? 'Faster verification process'
                      : 'Additional documentation needed'
                  }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Continue Button with Enhanced Design -->
    <div class="flex justify-center">
      <button
        class="py-4 px-10 bg-blue-600 text-white font-medium rounded-xl shadow-md hover:bg-blue-700 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center space-x-3 text-lg"
        :disabled="!localValue"
        @click="$emit('next')"
      >
        <span>Continue to Registration</span>
        <ArrowRight class="w-5 h-5" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { UserCircle, Users, Check, ArrowRight, CheckCircle2, ClipboardCheck } from 'lucide-vue-next'

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
})

// Define emits
const emit = defineEmits(['update:modelValue', 'next'])

// Local reactive variable to handle the selected value
const localValue = ref(props.modelValue)

// Watch for changes in `modelValue` and sync with `localValue`
watch(
  () => props.modelValue,
  (newValue) => {
    localValue.value = newValue
  },
)

// Handle option selection
function selectOption(value) {
  localValue.value = value // Update local state
  emit('update:modelValue', value) // Sync changes with the parent
}
</script>
