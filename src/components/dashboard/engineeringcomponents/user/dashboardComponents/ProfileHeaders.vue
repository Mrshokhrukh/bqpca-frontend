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
              {{ userDetail?.full_name || userDetail?.name || userDetail?.username || 'Engineering Professional' }}
            </h2>
            <div class="flex items-center gap-2 mt-1 text-sm text-slate-500">
              <span class="font-medium">Registration No:</span>
              <span class="font-mono">{{ userDetail?.registration_no || 'N/A' }}</span>
            </div>
          </div>

          <div v-if="firstApprovedQualification" class="flex flex-wrap gap-2 sm:gap-4 mt-4 text-xs sm:text-sm">
            <div class="flex items-center gap-2 px-3 py-1.5 rounded-full" :class="statusBadgeClass">
              <CheckBadgeIcon class="w-5 h-5" />
              <span class="font-semibold">{{ firstApprovedQualificationStatus || 'Loading...' }}</span>
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
          <button v-if="shouldShowActionButton" @click="handleActionButtonClick" :class="actionButtonClass"
            class="relative w-full sm:w-auto overflow-hidden font-semibold py-2.5 px-6 rounded-full transition-all duration-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transform hover:-translate-y-0.5 flex items-center justify-center gap-2">
            <span class="relative z-10">{{ actionButtonText }}</span>
          </button>
        </div>
      </div>
    </div>

    <EPCCertificateModal :qualification="certificateData" :showModal="showCertificateModal"
      @close="closeCertificateModal" />
  </div>
</template>

<script setup>
// NEW: Import new icons for the status bar
import { UserIcon, CheckBadgeIcon, CalendarDaysIcon, ClockIcon } from '@heroicons/vue/24/solid'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import dayjs from 'dayjs'
import EPCCertificateModal from '@/components/common/EPC/EPCCertificateModal.vue'
import { useToast } from 'vue-toastification'

const props = defineProps({
  userDetail: {
    type: Object,
    required: true,
  },
})

const router = useRouter()
const toast = useToast()
const showCertificateModal = ref(false)
const certificateData = ref(null)

defineEmits(['view-certificate'])

// --- COMPUTED PROPERTIES (Most logic remains the same) ---

const userQualifications = computed(() => {
  return props.userDetail?.user_qualifications || []
})

const firstApprovedQualification = computed(() => {
  if (!userQualifications.value || userQualifications.value.length === 0) return null
  // Prioritize primary qualification
  let primaryQual = userQualifications.value.find(
    (q) => q?.is_primary_qualification && q.endorsement_decision === 'Approved'
  )
  // Fallback to any approved qualification if no primary is found
  if (!primaryQual) {
    primaryQual = userQualifications.value.find(q => q?.endorsement_decision === 'Approved')
  }
  return primaryQual || null
})

const firstApprovedQualificationExpiryDate = computed(() => {
  return firstApprovedQualification.value?.expiry_date || null
})

const firstApprovedQualificationStatus = computed(() => {
  return firstApprovedQualification.value?.endorsement_decision || null
})

const formattedExpiryDate = computed(() => {
  if (!firstApprovedQualificationExpiryDate.value) return 'N/A'
  return dayjs(firstApprovedQualificationExpiryDate.value).format('DD MMM YYYY')
})

const daysRemaining = computed(() => {
  if (!firstApprovedQualificationExpiryDate.value) return null
  const expiry = dayjs(firstApprovedQualificationExpiryDate.value)
  const now = dayjs()
  return expiry.isValid() ? expiry.diff(now, 'day') : null
})

// NEW: More descriptive text for the badge
const daysRemainingText = computed(() => {
  if (daysRemaining.value === null) return 'N/A'
  if (daysRemaining.value < 0) return `${Math.abs(daysRemaining.value)} days ago`
  if (daysRemaining.value === 0) return 'Expires today'
  return `${daysRemaining.value} days remaining`
})

// NEW: Dynamic classes for the new status badges
const statusBadgeClass = computed(() => {
  const status = firstApprovedQualificationStatus.value
  if (status === 'Approved') return 'bg-emerald-100 text-emerald-800'
  if (status === 'Pending') return 'bg-amber-100 text-amber-800'
  if (status === 'Rejected' || status === 'Regretted') return 'bg-red-100 text-red-800'
  return 'bg-slate-100 text-slate-800'
})

const daysRemainingBadgeClass = computed(() => {
  if (daysRemaining.value === null) return 'bg-slate-100 text-slate-700'
  if (daysRemaining.value <= 0) return 'bg-red-100 text-red-800'
  if (daysRemaining.value <= 30) return 'bg-amber-100 text-amber-800'
  return 'bg-slate-100 text-slate-700'
})


const shouldShowActionButton = computed(() => {
  return userQualifications.value?.some(q => q?.endorsement_decision === 'Approved')
})

const actionButtonText = computed(() => {
  if (daysRemaining.value === null) return 'View Certificate'
  if (daysRemaining.value < 0) return 'Re-register'
  if (daysRemaining.value <= 90) return 'Renew License'
  return 'View Certificate'
})

const actionButtonClass = computed(() => {
  const text = actionButtonText.value
  if (text === 'Re-register') return 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 focus:ring-red-500'
  if (text === 'Renew License') return 'bg-gradient-to-r from-orange-400 to-orange-500 text-white hover:from-orange-500 hover:to-orange-600 focus:ring-orange-500'
  return 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 focus:ring-blue-500'
})

// --- METHODS (Unchanged) ---

const handleActionButtonClick = () => {
  const buttonText = actionButtonText.value
  if (buttonText === 'View Certificate') {
    openCertificateModal()
  } else if (buttonText === 'Renew License' || buttonText === 'Re-register') {
    router.push('/admin/user/engineering_certification/renewal')
  }
}

const openCertificateModal = () => {
  const approvedQualifications = userQualifications.value.filter(
    q => q?.endorsement_decision === 'Approved'
  )

  if (approvedQualifications.length === 0) {
    toast.info("There are no approved qualifications to display in a certificate.")
    return
  }
  // Constructing certificate data...
  const mappedUserDetail = {
    ...props.userDetail,
    user_qualifications: approvedQualifications
  };
  certificateData.value = { results: [mappedUserDetail] };
  showCertificateModal.value = true;
}

const closeCertificateModal = () => {
  showCertificateModal.value = false
  certificateData.value = null
}
</script>