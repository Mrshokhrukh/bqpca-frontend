<template>
  <div class="space-y-6">
    <div
      v-for="renewal in applications"
      :key="renewal.id"
      class="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300"
    >
      <div class="p-4 sm:p-6 border-b border-gray-200 bg-gray-50">
        <div class="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
          <div>
            <h3 class="text-lg sm:text-xl font-bold text-gray-900">{{ renewal.full_name }}</h3>
            <div class="flex items-center text-xs text-gray-600 mt-1">
              <IdCard class="w-4 h-4 mr-1.5 text-blue-600" />
              <span>Registration No: {{ renewal.registration_no }}</span>
              <span class="mx-2">|</span>
              <Calendar class="w-4 h-4 mr-1.5 text-blue-600" />
              <span>Applied On: {{ formatDate(renewal.created_at) }}</span>
            </div>
          </div>
          <div v-if="getOverallStatus(renewal).text" class="self-start sm:self-center">
            <span
              class="px-3 py-1.5 rounded-full text-xs font-medium inline-flex items-center"
              :class="getOverallStatus(renewal).badgeClass"
            >
              <component :is="getOverallStatus(renewal).icon" class="w-4 h-4 mr-1.5" />
              {{ getOverallStatus(renewal).text }}
            </span>
          </div>
        </div>
      </div>

      <div class="p-4 sm:p-6">
        <h4 class="text-base font-semibold text-gray-800 mb-4">Renewal Progress</h4>
        <div class="flex flex-col md:flex-row items-stretch gap-4">
          <div class="flex-1 flex items-start space-x-3 p-3 rounded-xl bg-gray-50 border">
            <div class="mt-1 p-1.5 rounded-lg" :class="getStepInfo('review', renewal).iconBgClass">
              <component
                :is="getStepInfo('review', renewal).icon"
                class="w-5 h-5"
                :class="getStepInfo('review', renewal).iconClass"
              />
            </div>
            <div>
              <p class="font-semibold text-gray-900">Admin Review</p>
              <p class="text-sm font-medium" :class="getStepInfo('review', renewal).textClass">
                {{ getStepInfo('review', renewal).text }}
              </p>
              <p v-if="renewal.renewal_remarks" class="text-xs text-gray-500 mt-1 italic">
                Remark: "{{ renewal.renewal_remarks }}"
              </p>
            </div>
          </div>

          <div class="flex-1 flex items-start space-x-3 p-3 rounded-xl bg-gray-50 border">
            <div class="mt-1 p-1.5 rounded-lg" :class="getStepInfo('payment', renewal).iconBgClass">
              <component
                :is="getStepInfo('payment', renewal).icon"
                class="w-5 h-5"
                :class="getStepInfo('payment', renewal).iconClass"
              />
            </div>
            <div>
              <p class="font-semibold text-gray-900">Payment</p>
              <p class="text-sm font-medium" :class="getStepInfo('payment', renewal).textClass">
                {{ getStepInfo('payment', renewal).text }}
              </p>
              <button
                v-if="
                  renewal.renewal_status === 'APPROVED' &&
                  (renewal.payment_status === 'pending' || renewal.payment_status === 'failed')
                "
                @click="$emit('initiate-payment', renewal)"
                class="mt-2 inline-flex items-center px-3 py-1.5 text-xs bg-gradient-to-r from-teal-500 to-cyan-600 text-white rounded-lg hover:from-teal-600 hover:to-cyan-700 transition-all shadow-md"
              >
                <CreditCard class="w-3 h-3 mr-1.5" />
                <span>{{
                  renewal.payment_status === 'failed' ? 'Retry Payment' : 'Proceed to Payment'
                }}</span>
              </button>
            </div>
          </div>

          <div class="flex-1 flex items-start space-x-3 p-3 rounded-xl bg-gray-50 border">
            <div
              class="mt-1 p-1.5 rounded-lg"
              :class="getStepInfo('complete', renewal).iconBgClass"
            >
              <component
                :is="getStepInfo('complete', renewal).icon"
                class="w-5 h-5"
                :class="getStepInfo('complete', renewal).iconClass"
              />
            </div>
            <div>
              <p class="font-semibold text-gray-900">Completed</p>
              <p class="text-sm font-medium" :class="getStepInfo('complete', renewal).textClass">
                {{ getStepInfo('complete', renewal).text }}
              </p>
              <p
                v-if="getStepInfo('complete', renewal).isComplete"
                class="text-xs text-gray-500 mt-1"
              >
                New Expiry: {{ formatDate(renewal.proposed_expiry_date) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { IdCard, Calendar, Clock, CreditCard, XCircle, ShieldCheck } from 'lucide-vue-next'
import dayjs from 'dayjs'

// Props definition
defineProps({
  applications: {
    type: Array,
    required: true,
  },
})

// Emits definition
defineEmits(['initiate-payment'])

// Utility function to format dates
const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return dayjs(dateString).format('MMM D, YYYY')
}

const getOverallStatus = (renewal) => {
  if (renewal.renewal_status === 'APPROVED' && renewal.payment_status === 'completed') {
    return { text: 'Renewed', icon: ShieldCheck, badgeClass: 'bg-green-100 text-green-800' }
  }
  if (renewal.renewal_status === 'REJECTED') {
    return { text: 'Rejected', icon: XCircle, badgeClass: 'bg-red-100 text-red-800' }
  }
  if (renewal.renewal_status === 'APPROVED' && renewal.payment_status !== 'completed') {
    return {
      text: 'Pending Payment',
      icon: CreditCard,
      badgeClass: 'bg-yellow-100 text-yellow-800',
    }
  }
  return { text: 'In Progress', icon: Clock, badgeClass: 'bg-blue-100 text-blue-800' }
}

// A helper function to get styling and text for each step
const getStepInfo = (step, renewal) => {
  const styles = {
    complete: {
      text: 'Complete',
      icon: ShieldCheck,
      iconBgClass: 'bg-green-100',
      iconClass: 'text-green-600',
      textClass: 'text-green-700',
    },
    pending: {
      text: 'Pending',
      icon: Clock,
      iconBgClass: 'bg-yellow-100',
      iconClass: 'text-yellow-600',
      textClass: 'text-yellow-700',
    },
    rejected: {
      text: 'Rejected',
      icon: XCircle,
      iconBgClass: 'bg-red-100',
      iconClass: 'text-red-600',
      textClass: 'text-red-700',
    },
    waiting: {
      text: 'Waiting for previous step',
      icon: Clock,
      iconBgClass: 'bg-gray-100',
      iconClass: 'text-gray-400',
      textClass: 'text-gray-500',
    },
    processing: {
      text: 'Processing',
      icon: Clock,
      iconBgClass: 'bg-blue-100',
      iconClass: 'text-blue-600',
      textClass: 'text-blue-700',
    },
  }

  if (step === 'review') {
    if (renewal.renewal_status === 'APPROVED') return { ...styles.complete, text: 'Approved' }
    if (renewal.renewal_status === 'REJECTED') return styles.rejected
    return styles.pending
  }

  if (step === 'payment') {
    if (renewal.renewal_status !== 'APPROVED') return styles.waiting
    if (renewal.payment_status === 'completed') return styles.complete
    if (renewal.payment_status === 'failed') return { ...styles.rejected, text: 'Failed' }
    if (renewal.payment_status === 'processing_payment') return styles.processing
    return styles.pending
  }

  if (step === 'complete') {
    const isComplete =
      renewal.renewal_status === 'APPROVED' && renewal.payment_status === 'completed'
    return { ...(isComplete ? styles.complete : styles.waiting), isComplete }
  }

  return styles.waiting
}
</script>
