<template>
  <div class="w-full mx-auto px-4 sm:px-6 py-8">
    <!-- header -->
    <div
      class="relative overflow-hidden backdrop-blur-sm bg-white/80 rounded-2xl p-6 sm:p-8 mb-10 shadow-lg border border-indigo-100 transform transition-all duration-500"
    >
      <div
        class="absolute -top-16 -right-16 w-40 h-40 bg-indigo-100 rounded-full opacity-30 blur-xl"
      ></div>
      <div
        class="absolute -bottom-12 -left-12 w-32 h-32 bg-blue-100 rounded-full opacity-40 blur-lg"
      ></div>

      <div class="relative z-10">
        <div class="flex justify-center mb-5">
          <div class="bg-gradient-to-r from-indigo-500 to-blue-500 rounded-xl p-1 shadow-md">
            <div class="bg-white rounded-lg p-2.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="w-6 h-6 text-indigo-600"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
          </div>
        </div>

        <h2
          class="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 to-blue-600 mb-3 text-center"
        >
          Select Registration Type
        </h2>
        <p class="text-gray-600 text-center max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
          Choose the appropriate registration type based on your citizenship status.
        </p>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-10 perspective-1000">
      <div v-for="option in options" :key="option.value" class="relative group">
        <div
          class="h-full p-6 sm:p-7 rounded-2xl cursor-pointer transition-all duration-500 flex flex-col transform-gpu backface-hidden"
          :class="[
            localValue === option.value
              ? 'border-2 border-indigo-500 bg-white shadow-xl ring-4 ring-indigo-500/15 scale-[1.02] rotate-y-0'
              : 'border border-gray-200 bg-white/80 hover:shadow-lg hover:bg-white hover:border-indigo-300 hover:scale-[1.01] hover:rotate-y-3',
          ]"
          @click="selectOption(option.value)"
        >
          <div
            class="absolute -right-2 -top-2 w-7 h-7 rounded-full border-3 border-white flex items-center justify-center transition-all duration-300 shadow-md"
            :class="[
              localValue === option.value
                ? 'bg-indigo-600 opacity-100 scale-100'
                : 'bg-gray-200 opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100',
            ]"
          >
            <Check
              class="w-3.5 h-3.5 text-white"
              :class="{ 'opacity-0': localValue !== option.value }"
            />
          </div>

          <div class="mb-4">
            <div
              class="p-3 rounded-xl inline-flex transition-all duration-500 shadow-sm"
              :class="[
                localValue === option.value
                  ? 'bg-gradient-to-r from-indigo-500 to-blue-500 text-white rotate-6'
                  : 'bg-gradient-to-r from-indigo-100 to-blue-100 text-indigo-600 group-hover:from-indigo-500 group-hover:to-blue-500 group-hover:text-white group-hover:rotate-6',
              ]"
            >
              <UserCircle v-if="option.value === 'cid'" class="w-6 h-6" />
              <Users v-else class="w-6 h-6" />
            </div>
          </div>

          <div class="flex-grow">
            <h3
              class="font-bold text-lg sm:text-xl mb-2 transition-colors duration-300"
              :class="[
                localValue === option.value
                  ? 'text-indigo-700'
                  : 'text-gray-800 group-hover:text-indigo-700',
              ]"
            >
              {{ option.label }}
            </h3>
            <p class="text-gray-600 text-sm sm:text-base leading-relaxed mb-5">
              {{ option.description }}
            </p>

            <div class="pt-4 border-t border-gray-200/80 mt-auto">
              <ul class="space-y-3">
                <li class="flex items-start text-xs sm:text-sm text-gray-700">
                  <div
                    class="flex-shrink-0 w-5 h-5 mr-2.5 mt-0.5 rounded-full flex items-center justify-center transition-colors duration-300"
                    :class="[
                      localValue === option.value
                        ? 'bg-green-100 text-green-600'
                        : 'bg-gray-100 text-gray-500 group-hover:bg-green-100 group-hover:text-green-600',
                    ]"
                  >
                    <CheckCircle2 class="w-3.5 h-3.5" />
                  </div>
                  <span>{{
                    option.value === 'cid'
                      ? 'Valid CID required'
                      : 'Valid passport/work permit required'
                  }}</span>
                </li>
                <li class="flex items-start text-xs sm:text-sm text-gray-700">
                  <div
                    class="flex-shrink-0 w-5 h-5 mr-2.5 mt-0.5 rounded-full flex items-center justify-center transition-colors duration-300"
                    :class="[
                      localValue === option.value
                        ? 'bg-green-100 text-green-600'
                        : 'bg-gray-100 text-gray-500 group-hover:bg-green-100 group-hover:text-green-600',
                    ]"
                  >
                    <ClipboardCheck class="w-3.5 h-3.5" />
                  </div>
                  <span>{{
                    option.value === 'cid' ? 'Faster verification' : 'Standard verification'
                  }}</span>
                </li>
                <li class="flex items-start text-xs sm:text-sm text-gray-700">
                  <div
                    class="flex-shrink-0 w-5 h-5 mr-2.5 mt-0.5 rounded-full flex items-center justify-center transition-colors duration-300"
                    :class="[
                      localValue === option.value
                        ? 'bg-green-100 text-green-600'
                        : 'bg-gray-100 text-gray-500 group-hover:bg-green-100 group-hover:text-green-600',
                    ]"
                  >
                    <Clock class="w-3.5 h-3.5" />
                  </div>
                  <span>{{
                    option.value === 'cid' ? 'Typically 3-5 days' : 'Typically 5-10 days'
                  }}</span>
                </li>
              </ul>
            </div>
          </div>

          <div class="absolute right-0 top-0 bottom-0 flex items-center">
            <div
              class="w-1.5 h-16 rounded-l-full transition-all duration-500"
              :class="localValue === option.value ? 'bg-indigo-500' : 'bg-transparent'"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <div class="flex justify-center mt-8">
      <button
        class="group relative py-3 sm:py-3.5 px-8 sm:px-10 rounded-xl shadow-md focus:outline-none disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 overflow-hidden w-full sm:w-auto max-w-sm mx-auto transform hover:translate-y-[-1px]"
        :class="[
          localValue
            ? 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700'
            : 'bg-gray-200 text-gray-500',
        ]"
        :disabled="!localValue"
        @click="handleContinue"
      >
        <div
          class="absolute inset-0 w-full h-full transition-all duration-300 transform"
          :class="[
            localValue && !isButtonClicked ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0',
            'origin-left bg-gradient-to-r from-indigo-700 to-blue-700',
          ]"
        ></div>

        <div
          class="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-300 blur-lg"
          :class="{ 'bg-indigo-400': localValue }"
        ></div>

        <div
          class="relative flex items-center justify-center space-x-2.5 text-sm sm:text-base font-medium z-10"
        >
          <span class="text-white">Continue</span>
          <ArrowRight
            class="w-4 h-4 text-white transform transition-transform duration-300 group-hover:translate-x-1"
          />
        </div>

        <div
          v-if="rippleEffect.show"
          class="absolute rounded-full bg-white/30 transform -translate-x-1/2 -translate-y-1/2 animate-ripple"
          :style="{
            top: rippleEffect.y + 'px',
            left: rippleEffect.x + 'px',
            width: rippleEffect.size + 'px',
            height: rippleEffect.size + 'px',
          }"
        ></div>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import {
  UserCircle,
  Users,
  Check,
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  Clock,
} from 'lucide-vue-next'

const props = defineProps({
  options: {
    type: Array,
    required: true,
    default: () => [
      {
        value: 'cid',
        label: 'Bhutanese Citizen',
        description: 'For citizens with a valid CID card.',
      },
      {
        value: 'foreign',
        label: 'Foreign National',
        description: 'For non-citizens with permits or passports.',
      },
    ],
  },
  modelValue: {
    type: String,
    required: false,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue', 'next'])

const localValue = ref(props.modelValue)
const isButtonClicked = ref(true)
const rippleEffect = ref({
  show: false,
  x: 0,
  y: 0,
  size: 0,
})

watch(
  () => props.modelValue,
  (newValue) => {
    localValue.value = newValue
  },
)

function selectOption(value) {
  if (localValue.value !== value) {
    localValue.value = value
    emit('update:modelValue', value)
    isButtonClicked.value = false
  }
}

function handleContinue(event) {
  if (!localValue.value) return

  const button = event.currentTarget
  const rect = button.getBoundingClientRect()
  const size = Math.max(button.offsetWidth, button.offsetHeight) * 2

  rippleEffect.value = {
    show: true,
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
    size: size,
  }

  setTimeout(() => {
    rippleEffect.value.show = false
  }, 600)

  isButtonClicked.value = true
  emit('next')
}

onMounted(() => {
  isButtonClicked.value = true
  if (localValue.value) {
    setTimeout(() => {
      isButtonClicked.value = false
    }, 1000)
  }
})
</script>

<style scoped>
.perspective-1000 {
  perspective: 1000px;
}

.backface-hidden {
  backface-visibility: hidden;
}

.rotate-y-0 {
  transform: rotateY(0deg);
}

.rotate-y-3:hover {
  transform: rotateY(3deg); /* Reduced rotation */
}

@keyframes ripple {
  0% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(0);
  }
  90% {
    opacity: 0.2;
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(1);
  }
}

.animate-ripple {
  animation: ripple 600ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
}
</style>
