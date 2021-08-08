<template>
  <div
    v-if="application"
    class="bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-200/80"
  >
    <div
      class="p-5 bg-gray-50/70 border-b border-gray-200/80 flex justify-between items-start gap-4"
    >
      <div>
        <h3 class="text-xl font-bold text-gray-800">Certificate of Good Standing</h3>
        <p class="text-sm text-gray-500 mt-1">
          Status for {{ application.full_name }} ({{ application.registration_no }})
        </p>
      </div>
      <div
        :class="overallStatus.class"
        class="text-xs font-bold inline-flex items-center px-3 py-1.5 rounded-full"
      >
        <component :is="overallStatus.icon" class="w-4 h-4 mr-1.5" />
        {{ overallStatus.text }}
      </div>
    </div>

    <div class="p-6">
      <h4 class="text-sm font-semibold text-gray-500 mb-5">Application Progress</h4>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-8">
        <div v-for="step in statusSteps" :key="step.label" class="flex items-start space-x-4">
          <div
            :class="[
              getStatusInfo(step.value).bgClass,
              'flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ring-4 ring-opacity-50',
              getStatusInfo(step.value).ringClass,
            ]"
          >
            <component
              :is="step.icon"
              class="w-6 h-6"
              :class="getStatusInfo(step.value).textClass"
            />
          </div>
          <div>
            <p class="font-bold text-gray-800">{{ step.label }}</p>
            <p class="text-sm font-medium mt-1" :class="getStatusInfo(step.value).textClass">
              {{ step.value }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <div v-if="detailsToShow.length > 0" class="p-6 bg-gray-50/70 border-t border-gray-200/80">
      <h4 class="text-sm font-semibold text-gray-500 mb-4">Additional Details</h4>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="detail in detailsToShow"
          :key="detail.label"
          class="bg-white p-4 rounded-xl border border-gray-200/80 flex items-start space-x-3"
        >
          <div class="mt-1">
            <component :is="detail.icon" class="w-5 h-5 text-gray-400" />
          </div>
          <div>
            <p class="text-xs font-medium text-gray-500">{{ detail.label }}</p>
            <p class="text-base font-semibold text-gray-900">{{ detail.value }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="px-6 py-3 bg-gray-100/60 text-xs text-gray-500 flex items-center">
      <ClockIcon class="w-4 h-4 mr-2" />
      Last Updated: {{ formatDate(application.updated_at) }}
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import {
  DocumentMagnifyingGlassIcon,
  CheckBadgeIcon,
  BanknotesIcon,
  BuildingOffice2Icon,
  BuildingLibraryIcon,
  BriefcaseIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationCircleIcon,
  ArrowPathIcon,
} from '@heroicons/vue/24/outline'

// The component now only needs the application prop. No close events needed.
const props = defineProps({
  application: {
    type: Object,
    default: null,
  },
})

// All computed properties remain the same and will work perfectly.
const statusSteps = computed(() => {
  if (!props.application) return []
  return [
    {
      label: 'Application Review',
      value: props.application.review_status,
      icon: DocumentMagnifyingGlassIcon,
    },
    {
      label: 'Endorsement',
      value: props.application.endorsement_decision,
      icon: CheckBadgeIcon,
    },
    {
      label: 'Payment',
      value: props.application.is_payment_complete ? 'Complete' : 'Pending',
      icon: BanknotesIcon,
    },
  ]
})

const additionalDetails = computed(() => {
  if (!props.application) return []
  return [
    { label: 'Agency', value: props.application.agency?.name, icon: BuildingOffice2Icon },
    { label: 'Department', value: props.application.department?.name, icon: BuildingLibraryIcon },
    { label: 'Workplace', value: props.application.workplace?.name, icon: BriefcaseIcon },
  ]
})

const detailsToShow = computed(() => additionalDetails.value.filter((detail) => detail.value))

const getStatusInfo = (status) => {
  switch (String(status).toLowerCase()) {
    case 'approved':
    case 'complete':
      return {
        textClass: 'text-green-700',
        bgClass: 'bg-green-100',
        ringClass: 'ring-green-200',
      }
    case 'pending':
      return {
        textClass: 'text-yellow-700',
        bgClass: 'bg-yellow-100',
        ringClass: 'ring-yellow-200',
      }
    case 'regretted':
    case 'rejected':
      return {
        textClass: 'text-red-700',
        bgClass: 'bg-red-100',
        ringClass: 'ring-red-200',
      }
    default:
      return {
        textClass: 'text-gray-700',
        bgClass: 'bg-gray-100',
        ringClass: 'ring-gray-200',
      }
  }
}

const overallStatus = computed(() => {
  if (!props.application)
    return { text: 'Loading', class: 'bg-gray-200 text-gray-800', icon: ArrowPathIcon }
  const app = props.application
  if (app.review_status === 'Regretted' || app.endorsement_decision === 'Regretted') {
    return { text: 'Regretted', class: 'bg-red-100 text-red-800', icon: XCircleIcon }
  }
  if (app.endorsement_decision === 'Approved' && app.is_payment_complete) {
    return {
      text: 'Approved & Complete',
      class: 'bg-green-100 text-green-800',
      icon: CheckCircleIcon,
    }
  }
  return {
    text: 'In Progress',
    class: 'bg-yellow-100 text-yellow-800',
    icon: ExclamationCircleIcon,
  }
})

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>
