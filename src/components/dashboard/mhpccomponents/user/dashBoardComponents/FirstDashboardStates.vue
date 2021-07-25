<template>
  <div class="flex flex-col items-center justify-center text-center px-4 py-16">
    <div
      class="max-w-md w-full backdrop-blur-sm bg-white/90 rounded-2xl shadow-lg border border-indigo-100 p-6 relative overflow-hidden"
    >
      <div class="absolute -top-20 -right-20 w-40 h-40 bg-indigo-100 rounded-full opacity-50"></div>
      <div
        class="absolute -bottom-20 -left-20 w-40 h-40 bg-indigo-100 rounded-full opacity-50"
      ></div>

      <div class="relative z-10">
        <div class="w-32 h-32 mx-auto mb-6 relative">
          <div
            class="absolute inset-0 bg-gradient-to-r from-indigo-200 to-purple-200 rounded-full animate-pulse"
          ></div>

          <div class="absolute inset-4 bg-white rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="w-16 h-16"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M9 12.75L11.25 15L15 9.75M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                stroke="url(#paint0_linear_alt)"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_alt"
                  x1="3"
                  y1="12"
                  x2="21"
                  y2="12"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stop-color="#6366F1" />
                  <stop offset="1" stop-color="#8B5CF6" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <div
            class="absolute top-4 right-6 w-3 h-3 bg-indigo-300 rounded-full animate-float-slow"
          ></div>
          <div
            class="absolute bottom-6 left-6 w-2 h-2 bg-purple-300 rounded-full animate-float-medium"
          ></div>
          <div
            class="absolute top-8 left-8 w-1 h-1 bg-indigo-400 rounded-full animate-float-fast"
          ></div>
        </div>

        <h2
          class="text-2xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600"
        >
          No Applications Found
        </h2>

        <p class="text-base text-gray-600 mb-6 leading-relaxed">{{ message }}</p>

        <div class="flex flex-col sm:flex-row gap-3 w-full">
          <button
            class="w-full px-4 py-2 rounded-xl shadow-md text-white bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 font-medium transition-all transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center justify-center text-sm"
            @click="checkApplicationStatus"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Apply Now
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()

defineProps({
  message: {
    type: String,
    default: "You don't have any applications yet. Please apply by clicking the button below.",
  },
})

const checkApplicationStatus = () => {
  if (typeof router.push === 'function') {
    router.push('/admin/user/health_certification/registration')
  } else {
    console.error('router.push is not a function')
  }
}
</script>

<style scoped>
@keyframes float-slow {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

@keyframes float-medium {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}

@keyframes float-fast {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-2px);
  }
}

.animate-float-slow {
  animation: float-slow 6s ease-in-out infinite;
}

.animate-float-medium {
  animation: float-medium 4s ease-in-out infinite;
}

.animate-float-fast {
  animation: float-fast 3s ease-in-out infinite;
}
</style>
