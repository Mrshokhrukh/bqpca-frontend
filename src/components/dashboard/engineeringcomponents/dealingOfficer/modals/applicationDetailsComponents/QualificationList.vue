<template>
  <div class="bg-white rounded-xl border border-gray-200 shadow-sm">
    <div class="p-6">
      <h4 class="text-lg font-medium text-gray-900 mb-6 flex items-center space-x-2">
        <GraduationCap class="h-5 w-5 text-gray-500" />
        <span>Qualification Details</span>
      </h4>
      <div v-if="qualifications && qualifications.length > 0" class="space-y-8">
        <div
          v-for="qualification in qualifications"
          :key="qualification.id"
          class="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden"
        >
          <div class="border-b border-gray-200">
            <div class="px-6 py-2 text-sm text-gray-700">
              <span class="font-semibold text-2xl px-4">Registration Type:</span>
              {{ getRegistrationTypeName(qualification.registration_type) }}
            </div>
            <QualificationDetails :qualification="qualification" class="bg-white" />
          </div>

          <div class="p-6">
            <ApplicationReview
              :qualification="qualification"
              :applicationId="applicationId"
              :mainApplicationPaymentStatus="props.mainApplicationPaymentStatus"
              @update="$emit('update')"
            />
          </div>
        </div>
      </div>
      <div v-else class="p-6 bg-gray-50 rounded-lg text-center">
        <p class="text-sm text-gray-500 flex items-center justify-center space-x-2">
          <CircleAlert class="h-4 w-4" />
          <span>No qualification details found.</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { GraduationCap, CircleAlert } from 'lucide-vue-next'
import QualificationDetails from './QualificationDetails.vue'
import ApplicationReview from './ApplicationReview.vue'

const props = defineProps({
  qualifications: {
    type: Array,
    default: () => [],
  },
  applicationId: {
    type: Number,
    required: true,
  },
  registrationTypes: {
    type: Array,
    default: () => [],
  },

  mainApplicationPaymentStatus: {
    type: String,
    default: 'pending',
  },
})

defineEmits(['update'])

const getRegistrationTypeName = (id) => {
  const type = props.registrationTypes.find((rt) => rt.id === id)
  return type ? type.name : 'N/A'
}
</script>
