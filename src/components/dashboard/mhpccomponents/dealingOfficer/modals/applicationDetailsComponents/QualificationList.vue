<template>
  <div class="bg-white rounded-xl border border-gray-200 shadow-sm">
    <div class="p-6">
      <h4 class="text-lg font-medium text-gray-900 mb-6 flex items-center space-x-3">
        <GraduationCap class="h-6 w-6 text-gray-500" />
        <span>Qualification Details</span>
      </h4>

      <div v-if="sortedQualifications && sortedQualifications.length > 0" class="space-y-10">
        <div
          v-for="qualification in sortedQualifications"
          :key="qualification.id"
          class="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-md transition-shadow duration-300 hover:shadow-lg relative"
        >
          <div
            class="absolute left-0 top-0 h-full w-1.5"
            :class="{
              'bg-indigo-600': qualification.is_primary_qualification,
              'bg-gray-300': !qualification.is_primary_qualification,
            }"
          ></div>

          <div
            class="px-6 py-4 border-b border-gray-200 bg-gray-50/70 flex items-center space-x-3 pl-8"
          >
            <Star
              v-if="qualification.is_primary_qualification"
              class="h-5 w-5 text-amber-500 fill-current"
            />

            <h5
              class="text-base font-semibold"
              :class="{
                'text-indigo-800': qualification.is_primary_qualification,
                'text-gray-700': !qualification.is_primary_qualification,
              }"
            >
              {{
                qualification.is_primary_qualification
                  ? 'Primary Qualification'
                  : 'Additional Qualification'
              }}
            </h5>
          </div>

          <div class="pl-8">
            <div class="border-b border-gray-200">
              <QualificationDetails :qualification="qualification" class="bg-white" />
            </div>

            <div class="p-6">
              <ApplicationReview
                :qualification="qualification"
                :applicationId="applicationId"
                @update="$emit('update')"
              />
            </div>
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
import { computed } from 'vue'
// ADDED: Imported Star icon
import { GraduationCap, CircleAlert, Star } from 'lucide-vue-next'
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
})

defineEmits(['update'])

const sortedQualifications = computed(() => {
  if (!props.qualifications) {
    return []
  }
  return [...props.qualifications].sort((a, b) => {
    if (a.is_primary_qualification && !b.is_primary_qualification) {
      return -1
    }
    if (!a.is_primary_qualification && b.is_primary_qualification) {
      return 1
    }
    return 0
  })
})
</script>
