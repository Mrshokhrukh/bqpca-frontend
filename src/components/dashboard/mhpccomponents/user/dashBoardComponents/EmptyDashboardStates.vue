<template>
    <!-- Adjusted padding and removed min-h for better flexibility -->
    <div class="flex flex-col items-center justify-center text-center px-4 py-16">
        <!-- Reduced max-width, padding, and shadow intensity -->
        <div
            class="max-w-md w-full backdrop-blur-sm bg-white/90 rounded-2xl shadow-lg border border-indigo-100 p-6 relative overflow-hidden"
        >
            <!-- Decorative elements (kept original size, adjust if needed) -->
            <div
                class="absolute -top-20 -right-20 w-40 h-40 bg-indigo-100 rounded-full opacity-50"
            ></div>
            <div
                class="absolute -bottom-20 -left-20 w-40 h-40 bg-indigo-100 rounded-full opacity-50"
            ></div>

            <!-- Main content -->
            <div class="relative z-10">
                <!-- Illustration with reduced size and margin -->
                <div class="w-32 h-32 mx-auto mb-6 relative">
                    <!-- Base circle with pulsing effect -->
                    <div
                        class="absolute inset-0 bg-gradient-to-r from-indigo-200 to-purple-200 rounded-full animate-pulse"
                    ></div>

                    <!-- Document illustration (smaller container and icon) -->
                    <div
                        class="absolute inset-4 bg-white rounded-full flex items-center justify-center"
                    >
                        <!-- Reduced icon size -->
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="w-16 h-16"
                            viewBox="0 0 24 24"
                            fill="none"
                        >
                            <!-- SVG paths remain the same, only size adjusted -->
                            <path
                                d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
                                stroke="url(#paint0_linear)"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                            <path
                                d="M14 2V8H20"
                                stroke="url(#paint1_linear)"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                            <path
                                d="M16 13H8"
                                stroke="url(#paint2_linear)"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                            <path
                                d="M16 17H8"
                                stroke="url(#paint3_linear)"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                            <path
                                d="M10 9H9H8"
                                stroke="url(#paint4_linear)"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                            <defs>
                                <linearGradient
                                    id="paint0_linear"
                                    x1="4"
                                    y1="12"
                                    x2="20"
                                    y2="12"
                                    gradientUnits="userSpaceOnUse"
                                >
                                    <stop stop-color="#6366F1" />
                                    <stop offset="1" stop-color="#8B5CF6" />
                                </linearGradient>
                                <linearGradient
                                    id="paint1_linear"
                                    x1="14"
                                    y1="5"
                                    x2="20"
                                    y2="5"
                                    gradientUnits="userSpaceOnUse"
                                >
                                    <stop stop-color="#6366F1" />
                                    <stop offset="1" stop-color="#8B5CF6" />
                                </linearGradient>
                                <linearGradient
                                    id="paint2_linear"
                                    x1="8"
                                    y1="13.5"
                                    x2="16"
                                    y2="13.5"
                                    gradientUnits="userSpaceOnUse"
                                >
                                    <stop stop-color="#6366F1" />
                                    <stop offset="1" stop-color="#8B5CF6" />
                                </linearGradient>
                                <linearGradient
                                    id="paint3_linear"
                                    x1="8"
                                    y1="17.5"
                                    x2="16"
                                    y2="17.5"
                                    gradientUnits="userSpaceOnUse"
                                >
                                    <stop stop-color="#6366F1" />
                                    <stop offset="1" stop-color="#8B5CF6" />
                                </linearGradient>
                                <linearGradient
                                    id="paint4_linear"
                                    x1="8"
                                    y1="9.5"
                                    x2="10"
                                    y2="9.5"
                                    gradientUnits="userSpaceOnUse"
                                >
                                    <stop stop-color="#6366F1" />
                                    <stop offset="1" stop-color="#8B5CF6" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>

                    <!-- Floating particles (kept original size, adjust positions if needed) -->
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

                <!-- Title with reduced size and margin -->
                <h2
                    class="text-2xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600"
                >
                    Application Pending
                </h2>

                <!-- Message with reduced text size and margin -->
                <p class="text-base text-gray-600 mb-6 leading-relaxed">{{ message }}</p>

                <!-- Status indicator with reduced padding and margin -->
                <div
                    class="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-6 flex items-center transform transition-all hover:scale-[1.02]"
                >
                    <!-- Reduced icon size -->
                    <div class="mr-3 relative">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-5 w-5 text-amber-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        <div
                            class="absolute -top-1 -right-1 w-2 h-2 bg-amber-500 rounded-full animate-ping"
                        ></div>
                    </div>
                    <div>
                        <span class="block text-amber-800 font-medium text-sm">Under Review</span>
                        <!-- Adjusted text size -->
                        <span class="text-amber-700 text-xs"
                            >Your application is being reviewed by our team</span
                        >
                        <!-- Adjusted text size -->
                    </div>
                </div>

                <!-- Action buttons with reduced padding, gap, and icon size -->
                <div class="flex flex-col sm:flex-row gap-3 w-full">
                    <button
                        class="w-full px-4 py-2 rounded-xl shadow-md text-white bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 font-medium transition-all transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center justify-center text-sm"
                        
                        @click="checkApplicationStatus" >
                        <!-- Reduced icon size -->
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-4 w-4 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M15 15l-2-2m0 0l-2-2m2 2l2-2m-2 2l-2 2"
                            />
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        Check Application Status
                    </button>

                    <button
                        class="w-full px-4 py-2 rounded-xl border-2 border-indigo-200 text-indigo-700 bg-white hover:bg-indigo-50 font-medium transition-all transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center justify-center text-sm"

                        @click="contactSupport" >
                        <!-- Reduced icon size -->
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-4 w-4 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                            />
                        </svg>
                        Contact Support
                    </button>
                </div>
            </div>
        </div>

        <!-- Notification indicator with reduced margin and padding -->
        <div class="mt-8 flex flex-col items-center">
            <div
                class="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md"
            >
                <div class="relative">
                    <div
                        class="h-2.5 w-2.5 bg-indigo-500 rounded-full animate-ping absolute opacity-75"
                    ></div>
                    <!-- Slightly smaller ping -->
                    <div class="h-2.5 w-2.5 bg-indigo-600 rounded-full relative"></div>
                    <!-- Slightly smaller dot -->
                </div>
                <p class="text-indigo-800 font-medium text-sm">
                    You'll be notified once your application is approved
                </p>
                <!-- Adjusted text size -->
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
        default:
            "You don't have any approved applications yet. Once approved, you will have access to the dashboard.",
    },
})

const checkApplicationStatus = () => {
    if (typeof router.push === 'function') {
        router.push('/admin/user/health_certification/my_applications')
    } else {
        console.error('router.push is not a function')
    }
}

const contactSupport = () => {
    window.location.href = '/#contact'
}
</script>

<style scoped>
/* Animations remain the same */
@keyframes float-slow {
    0%,
    100% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-8px);
    } /* Slightly reduced float distance */
}

@keyframes float-medium {
    0%,
    100% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-5px);
    } /* Slightly reduced float distance */
}

@keyframes float-fast {
    0%,
    100% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-2px);
    } /* Slightly reduced float distance */
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
