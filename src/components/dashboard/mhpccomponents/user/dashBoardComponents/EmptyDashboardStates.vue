<template>
  <div class="flex flex-col items-center justify-center px-4 py-16 text-center">
    <div
      class="relative w-full max-w-md rounded-2xl border border-indigo-100 bg-white/90 p-6 shadow-lg backdrop-blur-sm overflow-hidden"
    >
      <div
        class="absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-indigo-100 opacity-50"
      ></div>
      <div class="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-indigo-100 opacity-50"></div>

      <div class="relative z-10">
        <div class="relative mx-auto mb-6 h-32 w-32">
          <div
            class="absolute inset-0 animate-pulse rounded-full bg-gradient-to-r from-indigo-200 to-purple-200"
          ></div>
          <div class="absolute inset-4 flex items-center justify-center rounded-full bg-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-16 w-16"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
                stroke="url(#paint0_linear_empty)"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M14 2V8H20"
                stroke="url(#paint1_linear_empty)"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M16 13H8"
                stroke="url(#paint2_linear_empty)"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M16 17H8"
                stroke="url(#paint3_linear_empty)"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M10 9H9H8"
                stroke="url(#paint4_linear_empty)"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_empty"
                  x1="4"
                  y1="12"
                  x2="20"
                  y2="12"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stop-color="#6366F1" />
                  <stop offset="1" stop-color="#8B5CF6" />
                </linearGradient>
                <linearGradient
                  id="paint1_linear_empty"
                  x1="14"
                  y1="5"
                  x2="20"
                  y2="5"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stop-color="#6366F1" />
                  <stop offset="1" stop-color="#8B5CF6" />
                </linearGradient>
                <linearGradient
                  id="paint2_linear_empty"
                  x1="8"
                  y1="13.5"
                  x2="16"
                  y2="13.5"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stop-color="#6366F1" />
                  <stop offset="1" stop-color="#8B5CF6" />
                </linearGradient>
                <linearGradient
                  id="paint3_linear_empty"
                  x1="8"
                  y1="17.5"
                  x2="16"
                  y2="17.5"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stop-color="#6366F1" />
                  <stop offset="1" stop-color="#8B5CF6" />
                </linearGradient>
                <linearGradient
                  id="paint4_linear_empty"
                  x1="8"
                  y1="9.5"
                  x2="10"
                  y2="9.5"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stop-color="#6366F1" />
                  <stop offset="1" stop-color="#8B5CF6" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div
            class="absolute bottom-6 left-6 h-2 w-2 animate-float-medium rounded-full bg-purple-300"
          ></div>
          <div
            class="absolute right-6 top-4 h-3 w-3 animate-float-slow rounded-full bg-indigo-300"
          ></div>
          <div
            class="absolute left-8 top-8 h-1 w-1 animate-float-fast rounded-full bg-indigo-400"
          ></div>
        </div>

        <h2
          class="mb-3 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-2xl font-bold text-transparent"
        >
          Application In Progress
        </h2>

        <p class="mb-6 text-base leading-relaxed text-gray-600">{{ displayMessage }}</p>

        <div
          v-if="currentStatusTitle"
          class="mb-6 flex items-center rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 transition-transform hover:scale-[1.02]"
        >
          <div class="relative mr-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 text-amber-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div
              class="absolute -right-1 -top-1 h-2 w-2 animate-ping rounded-full bg-amber-500"
            ></div>
          </div>
          <div>
            <span class="block text-sm font-medium text-amber-800">{{ currentStatusTitle }}</span>
            <span class="text-xs text-amber-700">{{ currentStatusSubtitle }}</span>
          </div>
        </div>

        <div class="flex w-full flex-col gap-3 sm:flex-row">
          <button
            @click="checkApplicationStatus"
            class="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-4 py-2 text-sm font-medium text-white shadow-md transition-transform hover:scale-[1.02] hover:from-indigo-500 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            aria-label="Check Application Status"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="mr-2 h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Check Application Status
          </button>
          <button
            @click="contactSupport"
            class="flex w-full items-center justify-center rounded-xl border-2 border-indigo-200 bg-white px-4 py-2 text-sm font-medium text-indigo-700 transition-transform hover:scale-[1.02] hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            aria-label="Contact Support"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="mr-2 h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              />
            </svg>
            Contact Support
          </button>
        </div>
      </div>
    </div>

    <div class="mt-8 flex flex-col items-center">
      <div
        class="flex items-center space-x-2 rounded-full bg-white/80 px-4 py-2 shadow-md backdrop-blur-sm"
      >
        <div class="relative">
          <div
            class="absolute h-2.5 w-2.5 animate-ping rounded-full bg-indigo-500 opacity-75"
          ></div>
          <div class="relative h-2.5 w-2.5 rounded-full bg-indigo-600"></div>
        </div>
        <p class="text-sm font-medium text-indigo-800">You'll be notified of status changes.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const props = defineProps({
  qualificationInfo: {
    type: Object,
    default: null,
  },
})

const STATUS = {
  PENDING: 'Pending',
  APPROVED: 'Approved',
  REGRETTED: 'Regretted',
  PAYMENT_PENDING: 'pending',
  PAYMENT_PROCESSING: 'processing_payment',
  PAYMENT_COMPLETED: 'completed',
  PAYMENT_FAILED: 'failed',
}

const statusConfig = {
  [STATUS.PENDING]: {
    title: 'Application Review Pending',
    message:
      'Your application is being reviewed by our team. You will be notified once the initial review is complete.',
  },
  [STATUS.REGRETTED]: {
    title: 'Application Review Regretted',
    message: (qual) =>
      `The initial review of your application was not successful. ${
        qual.application_review_remark ||
        'Please review your application details or contact support.'
      }`,
  },
  [STATUS.APPROVED]: {
    physical: {
      [STATUS.PENDING]: {
        title: 'Physical Verification Pending',
        message:
          'Your application has been reviewed. You are required to visit the BQPCA office with original certificates for physical verification.',
      },
      [STATUS.REGRETTED]: {
        title: 'Physical Verification Regretted',
        message: (qual) =>
          `The physical verification of your documents was not successful. ${
            qual.physical_review_remark || 'Please contact support for clarification.'
          }`,
      },
      [STATUS.APPROVED]: {
        payment: {
          [STATUS.PAYMENT_PENDING]: {
            title: 'Payment Required',
            message:
              "Your application's physical verification is completed. You are required to proceed to your application tracker and complete the payment.",
          },
          [STATUS.PAYMENT_PROCESSING]: {
            title: 'Payment Processing',
            message:
              'Your payment for your application is being processed. We will notify you upon confirmation.',
          },
          [STATUS.PAYMENT_FAILED]: {
            title: 'Payment Failed',
            message: (qual) =>
              `Your payment for the application has failed. ${
                qual.payment_remarks || 'Please attempt the payment again or contact support.'
              }`,
          },
          [STATUS.PAYMENT_COMPLETED]: {
            endorsement: {
              [STATUS.PENDING]: {
                title: 'Endorsement Pending',
                message:
                  'Your payment for the application has been completed successfully. You will be notified once your application has been endorsed.',
              },
              [STATUS.REGRETTED]: {
                title: 'Endorsement Regretted',
                message: (qual) =>
                  `Your application could not be endorsed at this time. ${
                    qual.endorsement_remarks || 'Please contact support for further details.'
                  }`,
              },
            },
          },
        },
      },
    },
  },
}

const currentStatus = computed(() => {
  if (!props.qualificationInfo?.qualification) {
    return {
      title: 'Status Unavailable',
      subtitle: 'Please check back later.',
      message:
        'Your application is being processed. If you have not added qualifications, please do so. Otherwise, please check back soon for updates.',
    }
  }

  const qual = props.qualificationInfo.qualification
  let config = statusConfig[qual.application_review_status] || statusConfig[STATUS.PENDING]

  if (qual.application_review_status === STATUS.APPROVED) {
    config = config.physical[qual.physical_review_status] || config
    if (qual.physical_review_status === STATUS.APPROVED) {
      config = config.payment[qual.payment_status] || config
      if (qual.payment_status === STATUS.PAYMENT_COMPLETED) {
        config = config.endorsement[qual.endorsement_decision] || config
      }
    }
  }

  return {
    title: config.title,
    subtitle: 'Refer to the message above for details.',
    message: typeof config.message === 'function' ? config.message(qual) : config.message,
  }
})

const currentStatusTitle = computed(() => currentStatus.value.title)
const currentStatusSubtitle = computed(() => currentStatus.value.subtitle)
const displayMessage = computed(() => currentStatus.value.message)

const checkApplicationStatus = () => router.push('/admin/user/health_certification/my_applications')
const contactSupport = () => (window.location.href = '/#contact')
</script>

<style scoped>
@keyframes float-slow {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}
@keyframes float-medium {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
}
@keyframes float-fast {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-2px);
  }
}
.animate-float-slow {
  animation: float-slow 6s ease-in-out infinite;
}
.animate-float-medium {
  animation: float-medium 4s ease-in-out infinite;
}
.animate-float-fast {
  animation: float-fast 3s ease-in-out infinite;
}
</style>
