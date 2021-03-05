<!-- components/dashboard/ProfileHeader.vue -->
<template>
  <div class="bg-white rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl">
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
        <div class="flex-grow">
          <h2 class="text-2xl font-bold text-gray-800 mb-1 tracking-tight">
            {{ userDetail.username }}
          </h2>
          <div class="flex items-center gap-2">
            <span class="text-gray-500 font-medium">Registration No:</span>
            <span class="font-mono text-gray-700">{{ userDetail.registration_no }}</span>
          </div>
        </div>

        <!-- Actions Section -->
        <div class="flex items-center gap-4 ml-auto flex-wrap md:flex-nowrap">
          <!-- Renewal Status Badge -->
          <div v-if="renewalMessage" :class="[
              'px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300',
              getRenewalClass(renewalMessage),
              'flex items-center gap-2'
            ]">
            <span class="w-2 h-2 rounded-full" :class="getStatusDotClass(renewalMessage)"></span>
            {{ renewalMessage }}
          </div>

          <!-- Certificate Button -->
          <button v-if="shouldShowViewCertificateButton" @click="$emit('view-certificate')"
            class="relative overflow-hidden bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-2.5 px-6 rounded-full transition-all duration-300 hover:shadow-lg hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transform hover:-translate-y-0.5">
            <span class="relative z-10">View Certificate</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { UserIcon } from '@heroicons/vue/24/outline';
import { computed } from 'vue';

const props = defineProps({
  userDetail: {
    type: Object,
    required: true
  },
  renewalMessage: {
    type: String,
    default: ''
  },
    qualifications:{ //new prop
        type: Array,
        required: true
    }
});

defineEmits(['view-certificate']);

const getRenewalClass = (message) => {
  const classes = {
    'expired': 'bg-gray-100 text-gray-700',
    '2 weeks': 'bg-red-50 text-red-700',
    '3 months': 'bg-amber-50 text-amber-700',
    'valid': 'bg-emerald-50 text-emerald-700'
  };

  return Object.entries(classes).find(([key]) => message.toLowerCase().includes(key))?.[1]
    || 'bg-gray-100 text-gray-700';
};

const getStatusDotClass = (message) => {
  const classes = {
    'expired': 'bg-gray-500',
    '2 weeks': 'bg-red-500 animate-pulse',
    '3 months': 'bg-amber-500',
    'valid': 'bg-emerald-500'
  };

  return Object.entries(classes).find(([key]) => message.toLowerCase().includes(key))?.[1]
    || 'bg-gray-500';
};

//Computed property for certificate button visibility
const shouldShowViewCertificateButton = computed(() => {
    return props.qualifications.some(
        (q) => q.is_primary_qualification && q.endorsement_decision === 'Approved'
    )
});
</script>
