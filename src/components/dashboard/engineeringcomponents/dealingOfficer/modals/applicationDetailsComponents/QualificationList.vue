<template>
  <div class="bg-white rounded-xl border border-gray-200 shadow-sm">
    <div class="p-6">
      <h4 class="text-lg font-medium text-gray-900 mb-6 flex items-center space-x-2">
        <GraduationCap class="h-5 w-5 text-gray-500" />
        <span>Qualification Details</span>
      </h4>

      <div v-if="qualifications && qualifications.length > 0" class="space-y-8">
        <div v-for="qualification in qualifications" :key="qualification.id"
          class="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
          <div class="border-b border-gray-200">
            <QualificationDetails :qualification="qualification" class="bg-white" />
          </div>

          <div class="p-6">
            <ApplicationReview :qualification="qualification" :applicationId="applicationId"
              @update="$emit('update')" />
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

defineProps({
  qualifications: {
    type: Array,
    default: () => [],
  },
  applicationId: {
    type: Number,
    required: true,
  },
})

defineEmits(['update'])
</script>../ApplicationReview.vue
