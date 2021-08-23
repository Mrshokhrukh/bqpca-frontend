<template>
  <div class="overflow-hidden bg-white rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl">
    <div class="p-6 sm:p-8">
      <div class="flex flex-col sm:flex-row sm:items-center sm:gap-6">

        <div class="flex-shrink-0 self-start">
          <div class="relative p-2 bg-blue-100 rounded-full">
            <div
              class="relative flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full shadow-md">
              <UserIcon class="w-9 h-9 text-white" />
            </div>
          </div>
        </div>

        <div class="flex-grow min-w-0 mt-4 sm:mt-0">
          <div>
            <h2 class="text-2xl font-bold text-slate-800 tracking-tight truncate">
              {{ userDetail.username }}
            </h2>
            <div class="flex items-center gap-2 mt-1 text-sm text-slate-500">
              <span class="font-medium">Registration No:</span>
              <span class="font-mono">{{ userDetail.registration_no || 'N/A' }}</span>
            </div>
          </div>

          <div class="flex flex-wrap gap-2 sm:gap-4 mt-4 text-xs sm:text-sm">
            <div class="flex items-center gap-2 px-3 py-1.5 rounded-full" :class="statusBadgeClass">
              <CheckBadgeIcon class="w-5 h-5" />
              <span class="font-semibold">Approved</span>
            </div>

            <div class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 text-slate-700">
              <CalendarDaysIcon class="w-5 h-5 text-slate-500" />
              <span>Expires on: <span class="font-semibold">{{ formattedExpiryDate }}</span></span>
            </div>

            <div v-if="daysRemaining !== null" class="flex items-center gap-2 px-3 py-1.5 rounded-full"
              :class="daysRemainingBadgeClass">
              <ClockIcon class="w-5 h-5" />
              <span class="font-semibold">{{ daysRemainingText }}</span>
            </div>
          </div>
        </div>

        <div class="flex-shrink-0 mt-4 sm:mt-0 sm:ml-auto">
          <button @click="handleActionButtonClick" :class="actionButtonClass"
            class="relative w-full sm:w-auto overflow-hidden font-semibold py-2.5 px-6 rounded-full transition-all duration-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transform hover:-translate-y-0.5 flex items-center justify-center gap-2">
            <span class="relative z-10">{{ actionButtonText }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Import all necessary icons, including the new ones for the badges
import {
  UserIcon,
  CheckBadgeIcon,
  CalendarDaysIcon,
  ClockIcon
} from '@heroicons/vue/24/solid'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import dayjs from 'dayjs'

const props = defineProps({
  userDetail: {
    type: Object,
    required: true,
  },
  // The target component used 'qualification', we keep it for consistency
  qualification: {
    type: Object,
    required: true,
  },
})

const router = useRouter()
// The fix: You need to define the emit function explicitly.
const emit = defineEmits(['view-certificate'])

// --- COMPUTED PROPERTIES (Adopting the referral's pattern) ---

const expiryDate = computed(() => props.qualification?.expiry_date || null)

const formattedExpiryDate = computed(() => {
  if (!expiryDate.value) return 'N/A'
  return dayjs(expiryDate.value).format('DD MMM YYYY')
})

const daysRemaining = computed(() => {
  if (!expiryDate.value) return null
  const expiry = dayjs(expiryDate.value)
  const now = dayjs()
  // The diff gives the number of full days between, so we add 1 for inclusive counting on the expiry day
  return expiry.isValid() ? expiry.diff(now, 'day') : null
})

// Text for the days remaining badge (e.g., "30 days remaining", "Expires today", "5 days ago")
const daysRemainingText = computed(() => {
  if (daysRemaining.value === null) return 'N/A'
  if (daysRemaining.value < 0) return `${Math.abs(daysRemaining.value)} days ago`
  if (daysRemaining.value === 0) return 'Expires today'
  return `${daysRemaining.value + 1} days remaining`
})

// Dynamic class for the main status badge (always success in this context)
const statusBadgeClass = computed(() => {
  return 'bg-emerald-100 text-emerald-800'
});

// Dynamic class for the 'days remaining' badge (changes color based on urgency)
const daysRemainingBadgeClass = computed(() => {
  if (daysRemaining.value === null) return 'bg-slate-100 text-slate-700'
  if (daysRemaining.value <= 0) return 'bg-red-100 text-red-800' // Expired or expires today
  if (daysRemaining.value <= 30) return 'bg-amber-100 text-amber-800' // Expires within 30 days
  return 'bg-slate-100 text-slate-700' // More than 30 days left
})

// Determines the text for the single action button
const actionButtonText = computed(() => {
  if (daysRemaining.value === null) return 'View Certificate'
  if (daysRemaining.value < 0) return 'Re-register'
  if (daysRemaining.value <= 90) return 'Renew License'
  return 'View Certificate'
})

// Determines the gradient color class for the single action button
const actionButtonClass = computed(() => {
  const text = actionButtonText.value
  if (text === 'Re-register') return 'bg-gradient-to-r from-red-500 to-red-600 text-white focus:ring-red-500'
  if (text === 'Renew License') return 'bg-gradient-to-r from-orange-400 to-orange-500 text-white focus:ring-orange-500'
  return 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white focus:ring-blue-500'
})


// --- METHODS ---

// Single handler for the action button, directs based on computed text
const handleActionButtonClick = () => {
  const buttonText = actionButtonText.value;
  if (buttonText === 'View Certificate') {
    // Emitting the original event to the parent
    emit('view-certificate', props.qualification);
  } else if (buttonText === 'Renew License' || buttonText === 'Re-register') {
    // Using the original navigation logic
    router.push('/admin/user/health_certification/renewal');
  }
}
</script>
