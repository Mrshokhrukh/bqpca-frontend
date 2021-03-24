<!-- ./dashboardComponents/HelpAndSupport.vue -->
<template>
  <div class="bg-gradient-to-b from-white to-gray-50 rounded-xl shadow-xl p-8 border border-gray-100">
    <div class="flex items-center mb-6">
      <div class="bg-indigo-100 p-3 rounded-full mr-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24"
          stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h2 class="text-2xl font-bold text-gray-800">Help & Support</h2>
    </div>

    <div class="space-y-6">
      <!-- FAQ Section -->
      <div class="bg-white rounded-lg p-5 shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md">
        <div @click="$emit('toggle-faq')" class="flex justify-between items-center cursor-pointer">
          <h3 class="text-lg font-semibold text-gray-800 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Frequently Asked Questions
          </h3>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
            :class="{ 'rotate-180': showFAQ }" class="w-5 h-5 text-indigo-500 transition-transform duration-300">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
          </svg>
        </div>

        <transition name="fade">
          <div v-if="showFAQ" class="mt-4 space-y-3">
            <div v-for="(faq, index) in faqs" :key="index"
              class="bg-gray-50 rounded-lg p-4 border-l-4 border-indigo-400 hover:border-indigo-600 transition-colors duration-200">
              <details class="group">
                <summary
                  class="flex justify-between items-center cursor-pointer font-medium text-gray-700 group-open:text-indigo-600 transition-colors duration-200">
                  {{ faq.question }}
                  <svg xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4 text-gray-500 group-open:rotate-180 group-open:text-indigo-500 transition-all duration-300"
                    fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 9-7 7-7-7" />
                  </svg>
                </summary>
                <p class="mt-3 text-gray-600 text-sm leading-relaxed">{{ faq.answer }}</p>
              </details>
            </div>
          </div>
        </transition>
      </div>

      <!-- Contact Information Section -->
      <div class="bg-white rounded-lg p-5 shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md">
        <h3 class="text-lg font-semibold text-gray-800 flex items-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Contact Information
        </h3>
        <div class="space-y-3 pl-7">
          <div class="flex items-center text-gray-600 hover:text-indigo-600 transition-colors duration-200">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <a href="mailto:support@example.com"
              class="border-b border-dashed border-gray-400 hover:border-indigo-400">support@example.com</a>
          </div>
          <div class="flex items-center text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span>+1 (555) 123-4567</span>
          </div>
        </div>
      </div>

      <!-- Tutorials/Guides Section -->
      <div class="bg-white rounded-lg p-5 shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md">
        <h3 class="text-lg font-semibold text-gray-800 flex items-center mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          Tutorials & Guides
        </h3>
        <ul class="space-y-2 pl-7">
          <li class="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mt-1 mr-2 text-indigo-400" fill="none"
              viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
            <a href="#"
              class="text-indigo-500 hover:text-indigo-700 transition-colors duration-200 hover:underline">Application
              Process Guide</a>
          </li>
          <li class="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mt-1 mr-2 text-indigo-400" fill="none"
              viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
            <a href="#"
              class="text-indigo-500 hover:text-indigo-700 transition-colors duration-200 hover:underline">Video
              Tutorial: Submitting Your Application</a>
          </li>
        </ul>
      </div>

      <!-- Live Chat Button (Optional) -->
      <div v-if="liveChatAvailable" class="flex justify-center mt-4">
        <button @click="$emit('open-live-chat')"
          class="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center group">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 group-hover:animate-bounce" fill="none"
            viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          Start Live Chat
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  faqs: {
    type: Array,
    default: () => []
  },
  showFAQ: {
    type: Boolean,
    default: false
  },
  liveChatAvailable: {
    type: Boolean,
    default: false
  }
});

defineEmits(['toggle-faq', 'open-live-chat']);
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>