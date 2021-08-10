<!--  ProfileHeader from './dashboardComponents/ProfileHeaders.vue' -->
<template>
  <div class="bg-white rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl"
    :class="{ 'animate-pulse': isExpiringSoon }">
    <div class="p-8 relative overflow-hidden">
      <div class="flex items-center flex-wrap md:flex-nowrap gap-6">
        <!-- Avatar Section -->
        <div class="flex-shrink-0 group">
          <div class="relative">
            <div
              class="absolute inset-0 bg-blue-200 rounded-full transform transition-transform group-hover:scale-110 duration-300">
            </div>
            <div
              class="relative bg-gradient-to-br from-blue-500 to-blue-600 p-5 rounded-full transform transition-all duration-300 group-hover:rotate-3">
              <UserIcon class="w-10 h-10 text-white" />
            </div>
          </div>
        </div>

        <!-- User Info Section -->
        <div class="flex-grow relative">
          <!-- Expiry Warning (Only show when actually expiring soon) -->
          <div v-if="isExpiringSoon"
            class="absolute top-0 left-0 w-full h-full bg-red-100 bg-opacity-50 flex items-center justify-center text-red-700 font-bold text-lg rounded-xl z-10">
            Your license {{ getExpiryMessage }}
          </div>

          <h2 :class="{ 'text-gray-400': isExpiringSoon }" class="text-2xl font-bold mb-1 tracking-tight">
            {{ userDetail?.full_name || userDetail?.name || userDetail?.username || 'Engineering Professional' }}
          </h2>
          <div :class="{ 'text-gray-400': isExpiringSoon }" class="flex items-center gap-2">
            <span class="text-gray-500 font-medium">Registration No:</span>
            <span class="font-mono">{{ userDetail?.registration_no || 'N/A' }}</span>
          </div>

          <!-- Tooltip License Status -->
          <div class="mt-4 relative group">
            <InformationCircleIcon :class="[
              'w-7 h-7 cursor-pointer',
              statusIconClass,
              { 'text-red-700': isExpiringSoon },
            ]" />
            <div
              class="absolute z-20 left-1/2 -translate-x-1/2 -top-full mt-[-6px] bg-gray-800 text-white text-xs rounded p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap shadow-lg">
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
              <div class="text-xs">
                Days Remaining: <span :class="daysRemainingClass">{{ daysRemaining }}</span>
              </div>
              <div
                class="absolute left-1/2 -translate-x-1/2 top-full mt-[-5px] w-0 h-0 border-l-[5px] border-r-[5px] border-t-[8px] border-l-transparent border-r-transparent border-t-gray-800">
              </div>
            </div>
          </div>
        </div>

        <!-- Actions Section -->
        <div class="flex items-center gap-4 ml-auto flex-wrap md:flex-nowrap">
          <div v-if="calculatedRenewalMessage" :class="[
            'px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300',
            getRenewalClass(calculatedRenewalMessage),
            'flex items-center gap-2',
          ]">
            <span class="w-2 h-2 rounded-full" :class="getStatusDotClass(calculatedRenewalMessage)"></span>
            {{ calculatedRenewalMessage }}
          </div>

          <!-- Dynamic Action Button -->
          <button v-if="shouldShowActionButton" @click="handleActionButtonClick" :class="actionButtonClass"
            class="relative overflow-hidden font-semibold py-2.5 px-6 rounded-full transition-all duration-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transform hover:-translate-y-0.5">
            <span class="relative z-10">{{ actionButtonText }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Certificate Modal -->
    <EPCCertificateModal :qualification="certificateData" :showModal="showCertificateModal"
      @close="closeCertificateModal" />
  </div>
</template>

<script setup>
import { UserIcon, InformationCircleIcon } from '@heroicons/vue/24/outline'
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
  renewalMessage: {
    type: String,
    default: '',
  },
  qualifications: {
    type: Array,
    default: () => [],
  },
})

const router = useRouter()
const toast = useToast()
const showCertificateModal = ref(false)
const certificateData = ref(null)

defineEmits(['view-certificate'])

const getRenewalClass = (message) => {
  const classes = {
    expired: 'bg-red-50 text-red-700',
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
    expired: 'bg-red-500 animate-pulse',
    '2 weeks': 'bg-red-500 animate-pulse',
    '3 months': 'bg-amber-500',
    valid: 'bg-emerald-500',
  }
  return (
    Object.entries(classes).find(([key]) => message.toLowerCase().includes(key))?.[1] ||
    'bg-gray-500'
  )
}

const userQualifications = computed(() => {
  if (props.qualifications?.length > 0) {
    return props.qualifications
  }
  if (props.userDetail?.user_qualifications?.length > 0) {
    return props.userDetail.user_qualifications
  }
  return []
})

const enhancedUserDetail = computed(() => {
  if (!props.userDetail) return null
  return {
    ...props.userDetail,
    user_qualifications: userQualifications.value
  }
})

const firstApprovedQualification = computed(() => {
  if (!userQualifications.value || userQualifications.value.length === 0) return null
  let primaryQual = userQualifications.value.find(
    (q) => q && q.is_primary_qualification === true && q.endorsement_decision === 'Approved'
  )
  if (!primaryQual) {
    primaryQual = userQualifications.value.find(q => q && q.endorsement_decision === 'Approved')
  }
  return primaryQual || null
})

const firstApprovedQualificationExpiryDate = computed(() => {
  if (!firstApprovedQualification.value) return null
  return firstApprovedQualification.value.expiry_date || null
})

const firstApprovedQualificationStatus = computed(() => {
  if (!firstApprovedQualification.value) return null
  return firstApprovedQualification.value.endorsement_decision || null
})

const formattedExpiryDate = computed(() => {
  if (!firstApprovedQualificationExpiryDate.value) return 'N/A'
  return dayjs(firstApprovedQualificationExpiryDate.value).format('MMM DD, YYYY')
})

const daysRemaining = computed(() => {
  if (!firstApprovedQualificationExpiryDate.value) return null
  const expiry = dayjs(firstApprovedQualificationExpiryDate.value)
  const now = dayjs()
  if (!expiry.isValid()) return null
  return expiry.diff(now, 'day')
})

const daysRemainingClass = computed(() => {
  if (daysRemaining.value === null) return 'text-gray-500'
  if (daysRemaining.value <= 0) return 'text-red-500'
  if (daysRemaining.value <= 14) return 'text-red-400'
  if (daysRemaining.value <= 90) return 'text-yellow-400'
  return 'text-green-400'
})

const expiryStatusClass = computed(() => {
  if (!firstApprovedQualificationExpiryDate.value) return 'text-gray-600'
  const expiry = dayjs(firstApprovedQualificationExpiryDate.value)
  const now = dayjs()
  if (!expiry.isValid()) return 'text-gray-600'
  const daysUntilExpiry = expiry.diff(now, 'day')
  if (daysUntilExpiry <= 0) return 'text-red-600'
  if (daysUntilExpiry <= 14) return 'text-red-500'
  if (daysUntilExpiry <= 90) return 'text-yellow-500'
  return 'text-green-500'
})

const statusClass = computed(() => {
  const classes = {
    Approved: 'bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs',
    Pending: 'bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs',
    Rejected: 'bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs',
    Regretted: 'bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs',
  }
  return classes[firstApprovedQualificationStatus.value] || 'bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs'
})

const statusIconClass = computed(() => {
  const classes = {
    Approved: 'text-green-500',
    Pending: 'text-yellow-500',
    Rejected: 'text-red-500',
    Regretted: 'text-red-500',
  }
  return classes[firstApprovedQualificationStatus.value] || 'text-gray-500'
})

const isExpiringSoon = computed(() => {
  if (!firstApprovedQualificationExpiryDate.value) return false
  const expiry = dayjs(firstApprovedQualificationExpiryDate.value)
  const now = dayjs()
  if (!expiry.isValid()) return false
  const daysUntilExpiry = expiry.diff(now, 'day')
  return daysUntilExpiry <= 90
})

const getExpiryMessage = computed(() => {
  if (!firstApprovedQualificationExpiryDate.value) return ''
  const expiry = dayjs(firstApprovedQualificationExpiryDate.value)
  const now = dayjs()
  if (!expiry.isValid()) return 'has invalid expiry date'
  const daysRemainingVal = expiry.diff(now, 'day')
  if (daysRemainingVal < 0) {
    const daysExpired = Math.abs(daysRemainingVal)
    return `expired ${daysExpired} day${daysExpired === 1 ? '' : 's'} ago! Renew it now.`
  }
  if (daysRemainingVal === 0) return 'expires today! Renew it now.'
  return `expires in ${daysRemainingVal} day${daysRemainingVal === 1 ? '' : 's'}! Renew it now.`
})

const calculatedRenewalMessage = computed(() => {
  if (!firstApprovedQualificationExpiryDate.value || !firstApprovedQualification.value) return ''
  const expiry = dayjs(firstApprovedQualificationExpiryDate.value)
  const now = dayjs()
  if (!expiry.isValid()) return ''
  const daysUntilExpiry = expiry.diff(now, 'day')
  if (daysUntilExpiry < 0) {
    const daysExpired = Math.abs(daysUntilExpiry)
    return `License expired ${daysExpired} ${daysExpired === 1 ? 'day' : 'days'} ago`
  }
  if (daysUntilExpiry === 0) return 'License expires today'
  if (daysUntilExpiry <= 14) return `License expires in ${daysUntilExpiry} ${daysUntilExpiry === 1 ? 'day' : 'days'} - 2 weeks warning`
  if (daysUntilExpiry <= 90) {
    const monthsRemaining = Math.ceil(daysUntilExpiry / 30)
    return `License expires in ${monthsRemaining} ${monthsRemaining === 1 ? 'month' : 'months'} - 3 months warning`
  }
  return 'License valid'
})

const shouldShowActionButton = computed(() => {
  return userQualifications.value?.some(
    (q) => q && q.endorsement_decision === 'Approved'
  )
})

const actionButtonText = computed(() => {
  if (!firstApprovedQualificationExpiryDate.value) return 'View Certificate'
  const expiry = dayjs(firstApprovedQualificationExpiryDate.value)
  const now = dayjs()
  if (!expiry.isValid()) return 'View Certificate'
  const daysUntilExpiry = expiry.diff(now, 'day')
  if (daysUntilExpiry < 0) return 'Re-register'
  if (daysUntilExpiry <= 90) return 'Renew Certificate'
  return 'View Certificate'
})

const actionButtonClass = computed(() => {
  const text = actionButtonText.value
  if (text === 'Re-register') return 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 focus:ring-red-500'
  if (text === 'Renew Certificate') return 'bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 focus:ring-orange-500'
  return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 focus:ring-blue-500'
})

const handleActionButtonClick = () => {
  const buttonText = actionButtonText.value
  if (buttonText === 'View Certificate') {
    openCertificateModal()
  } else if (buttonText === 'Renew Certificate' || buttonText === 'Re-register') {
    router.push('/admin/user/engineering_certification/renewal')
  }
}

const openCertificateModal = () => {
  const allQualifications = enhancedUserDetail.value?.user_qualifications || [];
  const approvedQualifications = allQualifications.filter(
    q => q && q.endorsement_decision === 'Approved'
  );
  if (approvedQualifications.length === 0) {
    toast.info("There are no approved qualifications to display in a certificate.");
    return;
  }

  const mappedUserDetail = {
    full_name: enhancedUserDetail.value?.name || enhancedUserDetail.value?.username,
    cid_no: enhancedUserDetail.value?.id,
    registration_no: enhancedUserDetail.value?.registration_no,
    email_address: enhancedUserDetail.value?.email,
    contact_no: enhancedUserDetail.value?.phone,
    passport_photo: enhancedUserDetail.value?.photo,
    registration_date: approvedQualifications[0]?.registration_date,
    expiry_date: approvedQualifications[0]?.expiry_date,
    is_active: approvedQualifications[0]?.is_active,
    category_display: approvedQualifications[0]?.personnel_category_name || 'Professional Engineer',
    subcategory_display: approvedQualifications[0]?.personnel_sub_category_name,
    registration_type_display: enhancedUserDetail.value?.registrationType || 'Full Registration',
    user_qualifications: approvedQualifications,

    updated_at: approvedQualifications[0]?.updated_at
  };

  certificateData.value = { results: [mappedUserDetail] };
  showCertificateModal.value = true;
}


const closeCertificateModal = () => {
  showCertificateModal.value = false
  certificateData.value = null
}
</script>
