<!-- ./dashboardComponents/QuickLinks.vue -->
<template>
  <div class="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
    <!-- Header -->
    <div class="flex items-center mb-6">
      <span class="mr-3 text-purple-600">
        <Link2 class="w-5 h-5" />
      </span>
      <h2 class="text-xl font-semibold text-slate-800">Quick Links</h2>
    </div>

    <!-- Links Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <!-- Link Item: Start New Application -->
      <button @click="$emit('start-new-application')" :class="baseLinkClasses" class="group">
        <span :class="[iconWrapperClasses, getLinkStyle('new').bg]">
          <PlusCircle :class="[iconClasses, getLinkStyle('new').text]" />
        </span>
        <span :class="textClasses">Start New Application</span>
        <ChevronRight :class="chevronClasses" />
      </button>

      <!-- Link Item: Renew ECPF -->
      <button
        v-if="showRenewButton"
        @click="$emit('renew-ecpf')"
        :class="baseLinkClasses"
        class="group"
      >
        <span :class="[iconWrapperClasses, getLinkStyle('renew').bg]">
          <RefreshCw :class="[iconClasses, getLinkStyle('renew').text]" />
        </span>
        <span :class="textClasses">Renew ECPF</span>
        <ChevronRight :class="chevronClasses" />
      </button>

      <!-- Link Item: Change Name/Location -->
      <button @click="$emit('change-name-location')" :class="baseLinkClasses" class="group">
        <span :class="[iconWrapperClasses, getLinkStyle('change').bg]">
          <Edit3 :class="[iconClasses, getLinkStyle('change').text]" />
        </span>
        <span :class="textClasses">Change Name/Location</span>
        <ChevronRight :class="chevronClasses" />
      </button>

      <!-- Link Item: Student Management -->
      <button @click="$emit('go-to-student-management')" :class="baseLinkClasses" class="group">
        <span :class="[iconWrapperClasses, getLinkStyle('student').bg]">
          <Users :class="[iconClasses, getLinkStyle('student').text]" />
        </span>
        <span :class="textClasses">Student Management</span>
        <ChevronRight :class="chevronClasses" />
      </button>

      <!-- Link Item: HR Bio Data -->
      <button @click="$emit('go-to-hr-bio-data')" :class="baseLinkClasses" class="group">
        <span :class="[iconWrapperClasses, getLinkStyle('hr').bg]">
          <UserCheck :class="[iconClasses, getLinkStyle('hr').text]" />
        </span>
        <span :class="textClasses">HR Bio Data</span>
        <ChevronRight :class="chevronClasses" />
      </button>

      <!-- Link Item: Contact Support -->
      <button @click="$emit('contact-support')" :class="baseLinkClasses" class="group">
        <span :class="[iconWrapperClasses, getLinkStyle('support').bg]">
          <Mail :class="[iconClasses, getLinkStyle('support').text]" />
        </span>
        <span :class="textClasses">Contact Support</span>
        <ChevronRight :class="chevronClasses" />
      </button>
    </div>
  </div>
</template>

<script setup>
import {
  Link2, // Main header icon
  PlusCircle, // Start new
  RefreshCw, // Renew
  Edit3, // Change name/location
  Users, // Student Management
  UserCheck, // HR Bio Data
  Mail, // Contact Support
  ChevronRight, // Interaction arrow
} from 'lucide-vue-next'
import { ref } from 'vue' // Use ref for reactive variables

// Props definition (remains the same)
defineProps({
  showRenewButton: {
    type: Boolean,
    default: false,
  },
})

// Emits definition (remains the same)
defineEmits([
  'start-new-application',
  'renew-ecpf',
  'change-name-location',
  'contact-support',
  'go-to-student-management',
  'go-to-hr-bio-data',
])

// --- Base Styling Classes (Refactored for maintainability) ---
const baseLinkClasses = ref(
  'flex items-center w-full p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-300 focus:ring-offset-1',
)
const iconWrapperClasses = ref(
  'flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center mr-3 transition-colors duration-200',
)
const iconClasses = ref('w-4 h-4 transition-colors duration-200')
const textClasses = ref(
  'flex-grow text-sm font-medium text-slate-700 text-left group-hover:text-slate-900 transition-colors duration-200',
)
const chevronClasses = ref(
  'w-4 h-4 text-slate-400 ml-2 flex-shrink-0 opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200',
)

// --- Style Mapping for Icons ---
// Provides background and text color classes for each link type's icon
const getLinkStyle = (type) => {
  switch (type) {
    case 'new':
      return { bg: 'bg-blue-100', text: 'text-blue-600' }
    case 'renew':
      return { bg: 'bg-green-100', text: 'text-green-600' }
    case 'change':
      return { bg: 'bg-amber-100', text: 'text-amber-600' }
    case 'student':
      return { bg: 'bg-purple-100', text: 'text-purple-600' }
    case 'hr':
      return { bg: 'bg-pink-100', text: 'text-pink-600' }
    case 'support':
      return { bg: 'bg-slate-200', text: 'text-slate-600' }
    default:
      return { bg: 'bg-slate-100', text: 'text-slate-500' }
  }
}
</script>

<style scoped>
/* Add any additional scoped styles if needed */
/* For example, ensuring focus rings look good */
button:focus-visible {
  @apply ring-2 ring-purple-400 ring-offset-2;
}
</style>
