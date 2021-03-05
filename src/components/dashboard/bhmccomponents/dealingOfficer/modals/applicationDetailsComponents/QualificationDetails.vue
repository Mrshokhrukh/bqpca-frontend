<template>
  <div class="bg-gray-50 rounded-lg p-6">
    <!-- Qualification details grid -->
    <div class="grid grid-cols-2 gap-6">
      <div>
        <p class="text-sm font-medium text-gray-500">Qualification</p>
        <p class="text-sm text-gray-900 mt-2 flex items-center space-x-2">
          <GraduationCap class="h-4 w-4 text-gray-400" />
          <span>{{ qualification.qualification_name_display }}</span>
        </p>
      </div>
      <div>
        <p class="text-sm font-medium text-gray-500">
          Qualification Type
        </p>
        <p class="text-sm text-gray-900 mt-2 flex items-center space-x-2">
          <ClipboardCheck class="h-4 w-4 text-gray-400" />
          <span>{{ qualification.qualification_type_display }}</span>
        </p>
      </div>
      <div>
        <p class="text-sm font-medium text-gray-500">
          Institute/University
        </p>
        <p class="text-sm text-gray-900 mt-2 flex items-center space-x-2">
          <MapPin class="h-4 w-4 text-gray-400" />
          <span>{{ qualification.institute_university_display }}</span>
        </p>
      </div>
      <div>
        <p class="text-sm font-medium text-gray-500">Completion Year</p>
        <p class="text-sm text-gray-900 mt-2 flex items-center space-x-2">
          <Calendar class="h-4 w-4 text-gray-400" />
          <span>{{ qualification.completion_year }}</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { GraduationCap, ClipboardCheck, MapPin, Calendar } from 'lucide-vue-next'

defineProps({
  qualification: {
    type: Object,
    required: true,
  },
})

</script>
