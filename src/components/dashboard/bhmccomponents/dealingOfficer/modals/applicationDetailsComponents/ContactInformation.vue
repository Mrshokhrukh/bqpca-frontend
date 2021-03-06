<template>
  <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
    <div class="p-6">
      <div class="flex items-center justify-between">
        <h4 class="text-lg font-medium text-gray-900 mb-6 flex items-center space-x-2">
          <Contact class="h-5 w-5 text-gray-500" />
          <span>Contact Information</span>
        </h4>
      </div>
      <div class="space-y-4">
        <!-- Email -->
        <div class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
          <Mail class="h-4 w-4 text-gray-400" />
          <span class="text-sm text-gray-600">{{ application.email_address }}</span>
        </div>

        <!-- Contact No -->
        <div class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
          <Phone class="h-4 w-4 text-gray-400" />
          <span class="text-sm text-gray-600">{{ application.contact_no }}</span>
        </div>

        <!-- Address -->
        <div class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
          <MapPin class="h-4 w-4 text-gray-400" />
          <span class="text-sm text-gray-600">
            {{ application.village }}, {{ application.gewog }},
            {{ application.dzongkhag }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Contact, Mail, Phone, MapPin } from 'lucide-vue-next'

defineProps({
  application: {
    type: Object,
    required: true,
  },
})
</script>
