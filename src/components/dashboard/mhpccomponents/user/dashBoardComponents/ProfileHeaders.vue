<!-- components/dashboard/ProfileHeader.vue -->
<template>
  <div class="overflow-hidden rounded-xl bg-white shadow-lg transition-shadow duration-300 hover:shadow-xl">
    <div class="p-6">
      <!-- Expiry Alert Banner -->
      <div
        v-if="qualificationStatus.theme === 'danger' || qualificationStatus.theme === 'warning'"
        class="mb-4 flex items-center gap-3 rounded-lg p-3"
        :class="{
          'bg-red-50 text-red-800': qualificationStatus.theme === 'danger',
          'bg-yellow-50 text-yellow-800': qualificationStatus.theme === 'warning',
        }"
      >
        <ExclamationTriangleIcon v-if="qualificationStatus.theme === 'warning'" class="h-6 w-6 flex-shrink-0 text-yellow-500" />
        <ExclamationCircleIcon v-if="qualificationStatus.theme === 'danger'" class="h-6 w-6 flex-shrink-0 text-red-500" />
        <p class="text-sm font-semibold">{{ qualificationStatus.text }} <span v-if="!isExpired">Please renew your license.</span></p>
      </div>

      <!-- Main Content Grid -->
      <div class="grid grid-cols-[auto_1fr_auto] items-center gap-6">
        <!-- Avatar -->
        <div class="flex-shrink-0">
          <div class="relative rounded-full bg-gradient-to-br from-blue-500 to-blue-600 p-1.5 shadow">
            <div class="flex h-16 w-16 items-center justify-center rounded-full bg-white">
              <UserIcon class="h-9 w-9 text-blue-600" />
            </div>
          </div>
        </div>

        <!-- User Info -->
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

        <!-- Actions -->
        <div class="flex flex-col items-end gap-3 sm:flex-row sm:items-center">
          <button
            @click="$emit('view-certificate', props.qualification)"
            class="relative inline-flex items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <EyeIcon class="-ml-1 mr-2 h-5 w-5" />
            View Certificate
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import {
  UserIcon,
  EyeIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
} from '@heroicons/vue/24/solid';

dayjs.extend(relativeTime);

// --- PROPS ---
// Simplified props: We only need the user detail and the single, relevant qualification.
const props = defineProps({
  userDetail: {
    type: Object,
    required: true,
  },
  qualification: {
    type: Object,
    required: true,
  },
});

defineEmits(['view-certificate']);

// --- COMPUTED PROPERTIES ---

const formattedExpiryDate = computed(() => {
  return props.qualification.expiry_date
    ? dayjs(props.qualification.expiry_date).format('MMM DD, YYYY')
    : 'N/A';
});

const isExpired = computed(() => {
  if (!props.qualification.expiry_date) return false;
  return dayjs().isAfter(dayjs(props.qualification.expiry_date));
});

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
    };
  }

  const expiry = dayjs(props.qualification.expiry_date);
  const now = dayjs();
  const daysUntilExpiry = expiry.diff(now, 'day');

  if (daysUntilExpiry < 0) {
    return {
      theme: 'danger',
      text: `Your license has expired.`,
      icon: ExclamationCircleIcon,
      chipClasses: 'bg-red-100 text-red-800',
    };
  }
  if (daysUntilExpiry <= 30) { // 1 month or less
    return {
      theme: 'danger',
      text: `Your license expires in ${daysUntilExpiry + 1} days.`,
      icon: ExclamationCircleIcon,
      chipClasses: 'bg-red-100 text-red-800 animate-pulse',
    };
  }
  if (daysUntilExpiry <= 90) { // 3 months or less
    return {
      theme: 'warning',
      text: `Your license expires in ${dayjs().to(expiry)}.`,
      icon: ExclamationTriangleIcon,
      chipClasses: 'bg-yellow-100 text-yellow-800',
    };
  }
  return {
    theme: 'success',
    text: `Your license is valid.`,
    icon: CheckCircleIcon,
    chipClasses: 'bg-green-100 text-green-800',
  };
});
</script>
