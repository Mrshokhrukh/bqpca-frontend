<!-- components/dashboard/ProfileHeader.vue -->
<template>
  <div
    class="bg-white rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl"
    :class="{ 'animate-pulse': isExpiringSoon }"
  >
    <div class="p-8 relative overflow-hidden">
      <div class="flex items-center flex-wrap md:flex-nowrap gap-6">
        <!-- Avatar Section -->
        <div class="flex-shrink-0 group">
          <div class="relative">
            <div
              class="absolute inset-0 bg-blue-200 rounded-full transform transition-transform group-hover:scale-110 duration-300"
            ></div>
            <div
              class="relative bg-gradient-to-br from-blue-500 to-blue-600 p-5 rounded-full transform transition-all duration-300 group-hover:rotate-3"
            >
              <UserIcon class="w-10 h-10 text-white" />
            </div>
          </div>
        </div>

        <!-- User Info Section -->
        <div class="flex-grow relative">
          <!-- Expiry Warning (Always Visible) -->
          <div
            v-if="isExpiringSoon"
            class="absolute top-0 left-0 w-full h-full bg-red-100 bg-opacity-50 flex items-center justify-center text-red-700 font-bold text-lg rounded-xl z-10"
          >
            Your license {{ getExpiryMessage }}
          </div>

          <h2
            :class="{ 'text-gray-400': isExpiringSoon }"
            class="text-2xl font-bold mb-1 tracking-tight"
          >
            {{ userDetail.username }}
          </h2>
          <div :class="{ 'text-gray-400': isExpiringSoon }" class="flex items-center gap-2">
            <span class="text-gray-500 font-medium">Registration No:</span>
            <span class="font-mono">{{ userDetail.registration_no }}</span>
          </div>

          <!-- Tooltip License Status -->
          <div class="mt-4 relative group">
            <InformationCircleIcon
              :class="[
                'w-7 h-7 cursor-pointer',
                statusIconClass,
                { 'text-red-700': isExpiringSoon },
              ]"
            />
            <div
              class="absolute z-20 left-1/2 -translate-x-1/2 -top-full mt-[-6px] bg-gray-800 text-white text-xs rounded p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap shadow-lg"
            >
              <h6 class="font-semibold text-sm mb-1">License</h6>
              <div class="text-xs">
                Valid Until: <span :class="expiryStatusClass">{{ formattedExpiryDate }}</span>
              </div>
              <div class="text-xs">
                Status:
                <span :class="statusClass">{{
                  firstApprovedQualificationStatus || 'Loading...'
                }}</span>
              </div>
              <div
                class="absolute left-1/2 -translate-x-1/2 top-full mt-[-5px] w-0 h-0 border-l-[5px] border-r-[5px] border-t-[8px] border-l-transparent border-r-transparent border-t-gray-800"
              ></div>
            </div>
          </div>
        </div>

        <!-- Actions Section -->
        <div class="flex items-center gap-4 ml-auto flex-wrap md:flex-nowrap">
          <div
            v-if="renewalMessage"
            :class="[
              'px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300',
              getRenewalClass(renewalMessage),
              'flex items-center gap-2',
            ]"
          >
            <span class="w-2 h-2 rounded-full" :class="getStatusDotClass(renewalMessage)"></span>
            {{ renewalMessage }}
          </div>
          <button
            v-if="shouldShowViewCertificateButton"
            @click="$emit('view-certificate')"
            class="relative overflow-hidden bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-2.5 px-6 rounded-full transition-all duration-300 hover:shadow-lg hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform hover:-translate-y-0.5"
          >
            <span class="relative z-10">View Certificate</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { UserIcon, DocumentIcon, InformationCircleIcon } from '@heroicons/vue/24/outline'
import { computed } from 'vue'
import dayjs from 'dayjs'
const props = defineProps({
  userDetail: {
    type: Object,
    required: true,
  },
  renewalMessage: {
    type: String,
    default: '',
  },
  qualifications: {
    type: Array,
    required: true,
  },
})

defineEmits(['view-certificate'])

const getRenewalClass = (message) => {
  const classes = {
    expired: 'bg-gray-100 text-gray-700',
    '2 weeks': 'bg-red-50 text-red-700',
    '3 months': 'bg-amber-50 text-amber-700',
    valid: 'bg-emerald-50 text-emerald-700',
  }
  return (
    Object.entries(classes).find(([key]) => message.toLowerCase().includes(key))?.[1] ||
    'bg-gray-100 text-gray-700'
  )
}
const getStatusDotClass = (message) => {
  const classes = {
    expired: 'bg-gray-500',
    '2 weeks': 'bg-red-500 animate-pulse',
    '3 months': 'bg-amber-500',
    valid: 'bg-emerald-500',
  }
  return (
    Object.entries(classes).find(([key]) => message.toLowerCase().includes(key))?.[1] ||
    'bg-gray-500'
  )
}
const shouldShowViewCertificateButton = computed(() => {
  return props.qualifications.some(
    (q) => q.is_primary_qualification && q.endorsement_decision === 'Approved',
  )
})

const firstApprovedQualification = computed(() => {
  return props.qualifications.find(
    (q) => q.is_primary_qualification && q.endorsement_decision === 'Approved',
  )
})

const firstApprovedQualificationExpiryDate = computed(() => {
  return firstApprovedQualification.value ? firstApprovedQualification.value.expiry_date : null
})

const firstApprovedQualificationStatus = computed(() => {
  return firstApprovedQualification.value
    ? firstApprovedQualification.value.endorsement_decision
    : null
})

const formattedExpiryDate = computed(() => {
  return firstApprovedQualificationExpiryDate.value
    ? dayjs(firstApprovedQualificationExpiryDate.value).format('MMM DD, YYYY')
    : 'N/A'
})

const expiryStatusClass = computed(() => {
  if (!firstApprovedQualificationExpiryDate.value) return 'text-gray-600'

  const expiry = dayjs(firstApprovedQualificationExpiryDate.value)
  const now = dayjs()
  const threeMonths = expiry.subtract(3, 'month')
  const twoWeeks = expiry.subtract(2, 'week')

  if (now.isAfter(expiry)) return 'text-gray-500'
  if (now.isAfter(twoWeeks)) return 'text-red-500'
  if (now.isAfter(threeMonths)) return 'text-yellow-500'
  return 'text-green-500'
})

const statusClass = computed(() => {
  const classes = {
    Approved: 'bg-green-100 text-green-800',
    Pending: 'bg-yellow-100 text-yellow-800',
    Rejected: 'bg-red-100 text-red-800',
  }
  return classes[firstApprovedQualificationStatus.value] || 'bg-gray-100 text-gray-800'
})

const statusIconClass = computed(() => {
  const classes = {
    Approved: 'text-green-500',
    Pending: 'text-yellow-500',
    Rejected: 'text-red-500',
  }
  return classes[firstApprovedQualificationStatus.value] || 'text-gray-500'
})

// Check if expiring within 3 months
const isExpiringSoon = computed(() => {
  if (!firstApprovedQualificationExpiryDate.value) return false

  const expiry = dayjs(firstApprovedQualificationExpiryDate.value)
  const now = dayjs()
  const threeMonths = expiry.subtract(3, 'month')

  return now.isAfter(threeMonths) && !now.isAfter(expiry) // Within 3 months, but not expired
})

// NEW: Message with days remaining
const getExpiryMessage = computed(() => {
  if (!firstApprovedQualificationExpiryDate.value) return ''

  const expiry = dayjs(firstApprovedQualificationExpiryDate.value)
  const now = dayjs()
  const daysRemaining = expiry.diff(now, 'day')

  if (daysRemaining <= 0) {
    return 'has expired!'
  } else if (daysRemaining === 1) {
    return 'expires in 1 day! Renew it now.'
  } else {
    return `expires in ${daysRemaining} days! Renew it now.`
  }
})
</script>
