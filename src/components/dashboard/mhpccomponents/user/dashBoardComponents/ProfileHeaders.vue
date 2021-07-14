<template>
  <div
    class="overflow-hidden rounded-xl bg-white shadow-lg transition-shadow duration-300 hover:shadow-xl"
  >
    <div class="p-6">
      <div
        v-if="qualificationStatus.theme === 'danger' || qualificationStatus.theme === 'warning'"
        class="mb-4 flex items-center gap-3 rounded-lg p-3"
        :class="{
          'bg-red-50 text-red-800': qualificationStatus.theme === 'danger',
          'bg-yellow-50 text-yellow-800': qualificationStatus.theme === 'warning',
        }"
      >
        <ExclamationTriangleIcon
          v-if="qualificationStatus.theme === 'warning'"
          class="h-6 w-6 flex-shrink-0 text-yellow-500"
        />
        <ExclamationCircleIcon
          v-if="qualificationStatus.theme === 'danger'"
          class="h-6 w-6 flex-shrink-0 text-red-500"
        />
        <p class="text-sm font-semibold">
          {{ qualificationStatus.text }}
          <span v-if="!isExpired && (isExpiringSoon || isExpiredPast)"
            >Please renew your license.</span
          >
        </p>
      </div>

      <div class="grid grid-cols-[auto_1fr_auto] items-center gap-6">
        <div class="flex-shrink-0">
          <div
            class="relative rounded-full bg-gradient-to-br from-blue-500 to-blue-600 p-1.5 shadow"
          >
            <div class="flex h-16 w-16 items-center justify-center rounded-full bg-white">
              <UserIcon class="h-9 w-9 text-blue-600" />
            </div>
          </div>
        </div>

        <div class="min-w-0">
          <h2 class="truncate text-2xl font-bold tracking-tight text-gray-800">
            {{ userDetail.username }}
          </h2>
          <p class="mt-1 text-sm text-gray-500">
            Registration No: <span class="font-mono">{{ userDetail.registration_no }}</span>
          </p>
          <div class="mt-3">
            <div
              class="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium"
              :class="qualificationStatus.chipClasses"
            >
              <component :is="qualificationStatus.icon" class="h-4 w-4" />
              <span>Valid Until: {{ formattedExpiryDate }}</span>
            </div>
          </div>
        </div>

        <div class="flex flex-col items-end gap-3 sm:flex-row sm:items-center">
          <button
            v-if="!isExpiredPast"
            @click="$emit('view-certificate', props.qualification)"
            class="relative inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-semibold text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2"
            :class="{
              'bg-gradient-to-r from-blue-500 to-blue-600 hover:-translate-y-0.5 hover:shadow-lg focus:ring-blue-500':
                !isExpiringSoon,
              'bg-gradient-to-r from-blue-300 to-blue-400 cursor-not-allowed': isExpiringSoon,
            }"
          >
            <EyeIcon class="-ml-1 mr-2 h-5 w-5" />
            View Certificate
          </button>

          <button
            v-if="isExpiringSoon || isExpiredPast"
            @click="navigateToRenewal"
            class="relative inline-flex items-center justify-center rounded-full px-6 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            :class="{
              'bg-gradient-to-r from-green-500 to-green-600': isExpiringSoon,
              'bg-gradient-to-r from-red-500 to-red-600': isExpiredPast,
            }"
          >
            <component :is="renewalButtonIcon" class="-ml-1 mr-2 h-5 w-5" />
            {{ renewalButtonText }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useRouter } from 'vue-router' // Import useRouter

import {
  UserIcon,
  EyeIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  ArrowPathIcon, // Icon for renewal
  ClipboardDocumentCheckIcon, // Icon for re-registration
} from '@heroicons/vue/24/solid'

dayjs.extend(relativeTime)

// Initialize router
const router = useRouter()

// --- PROPS ---
const props = defineProps({
  userDetail: {
    type: Object,
    required: true,
  },
  qualification: {
    type: Object,
    required: true,
  },
})

defineEmits(['view-certificate'])

// --- COMPUTED PROPERTIES ---

const formattedExpiryDate = computed(() => {
  return props.qualification.expiry_date
    ? dayjs(props.qualification.expiry_date).format('MMM DD,YYYY')
    : 'N/A'
})

const now = dayjs()

const expiry = computed(() => {
  return props.qualification.expiry_date ? dayjs(props.qualification.expiry_date) : null
})

const daysUntilExpiry = computed(() => {
  if (!expiry.value) return Infinity
  return expiry.value.diff(now, 'day')
})

const isExpiredPast = computed(() => {
  return expiry.value ? now.isAfter(expiry.value, 'day') : false
})

const isExpiringSoon = computed(() => {
  // Within the next 3 months (90 days) but not already expired
  return !isExpiredPast.value && daysUntilExpiry.value <= 90 && daysUntilExpiry.value >= 0
})

/**
 * Centralized Status Logic
 * This single computed property derives all status-related information (theme, text, icons, classes).
 * It makes the template cleaner and the logic easier to manage.
 */
const qualificationStatus = computed(() => {
  if (!props.qualification.expiry_date) {
    return {
      theme: 'info',
      text: 'Expiry date not available.',
      icon: InformationCircleIcon,
      chipClasses: 'bg-gray-100 text-gray-700',
    }
  }

  if (isExpiredPast.value) {
    return {
      theme: 'danger',
      text: `Your license has expired.`,
      icon: ExclamationCircleIcon,
      chipClasses: 'bg-red-100 text-red-800',
    }
  }
  if (daysUntilExpiry.value <= 30) {
    // 1 month or less
    return {
      theme: 'danger',
      text: `Your license expires in ${daysUntilExpiry.value + 1} days.`,
      icon: ExclamationCircleIcon,
      chipClasses: 'bg-red-100 text-red-800 animate-pulse',
    }
  }
  if (daysUntilExpiry.value <= 90) {
    // 3 months or less
    return {
      theme: 'warning',
      text: `Your license expires ${dayjs().to(expiry.value)}.`,
      icon: ExclamationTriangleIcon,
      chipClasses: 'bg-yellow-100 text-yellow-800',
    }
  }
  return {
    theme: 'success',
    text: `Your license is valid.`,
    icon: CheckCircleIcon,
    chipClasses: 'bg-green-100 text-green-800',
  }
})

const renewalButtonText = computed(() => {
  return isExpiredPast.value ? 'Re-Register Application' : 'Renew Now'
})

const renewalButtonIcon = computed(() => {
  return isExpiredPast.value ? ClipboardDocumentCheckIcon : ArrowPathIcon
})

// --- METHODS ---
const navigateToRenewal = () => {
  router.push('/admin/user/health_certification/renewal')
}
</script>
