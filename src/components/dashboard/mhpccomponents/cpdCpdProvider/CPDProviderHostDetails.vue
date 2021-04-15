<template>
  <div class="border-b border-gray-200 bg-gray-50 p-6 rounded-t-xl mt-8">
    <h3 class="text-lg font-semibold text-gray-900">CPD Provider (Host) Details</h3>
    <p class="mt-1 text-sm text-gray-500">Information about the CPD provider.</p>
  </div>

  <div class="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
    <div class="col-span-1">
      <label for="providingAgency" class="block text-sm font-medium text-gray-700">
        CPD Providing Agency <span class="text-red-600">*</span>
      </label>
      <select
        id="providingAgency"
        :value="modelValue.providingAgency"
        @change="updateAgency($event.target.value)"
        class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500 p-2.5"
      >
        <option value="" disabled>Select Agency</option>
        <option v-for="agency in agencies" :key="agency.value" :value="agency.value">
          {{ agency.text }}
        </option>
        <option value="other">Other</option>
      </select>
      <div v-if="loading" class="mt-1 text-sm text-blue-600">Loading agencies...</div>
    </div>

    <div v-if="modelValue.providingAgency === 'other'" class="col-span-1">
      <label for="otherAgency" class="block text-sm font-medium text-gray-700">
        Specify Other Agency <span class="text-red-600">*</span>
      </label>
      <input
        type="text"
        id="otherAgency"
        :value="modelValue.otherAgency"
        @input="$emit('update:modelValue', { ...modelValue, otherAgency: $event.target.value })"
        class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500 p-2.5"
      />
    </div>

    <div class="col-span-1">
      <label for="reasonConducting" class="block text-sm font-medium text-gray-700">
        Reason for Conducting <span class="text-red-600">*</span>
      </label>
      <select
        id="reasonConducting"
        :value="modelValue.reasonConducting"
        @change="
          $emit('update:modelValue', { ...modelValue, reasonConducting: $event.target.value })
        "
        class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500 p-2.5"
      >
        <option value="" disabled>Select Reason</option>
        <option v-for="reason in reasons" :key="reason.value" :value="reason.value">
          {{ reason.text }}
        </option>
      </select>
      <div v-if="loading" class="mt-1 text-sm text-blue-600">Loading reasons...</div>
    </div>

    <div class="col-span-1">
      <label for="reasonDetails" class="block text-sm font-medium text-gray-700">
        Reason Details <span class="text-red-600">*</span>
      </label>
      <textarea
        id="reasonDetails"
        :value="modelValue.reasonDetails"
        @input="$emit('update:modelValue', { ...modelValue, reasonDetails: $event.target.value })"
        rows="4"
        class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500 p-2.5"
      ></textarea>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import apiservice from '@/services/mhpcservices'

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue'])

// State
const agencies = ref([])
const reasons = ref([])
const loading = ref(false)

// Methods
const updateAgency = (value) => {
  // When agency is changed, reset the otherAgency if not 'other'
  if (value !== 'other') {
    emit('update:modelValue', {
      ...props.modelValue,
      providingAgency: value,
      otherAgency: '',
    })
  } else {
    emit('update:modelValue', {
      ...props.modelValue,
      providingAgency: value,
    })
  }
}

// Load data from API
const fetchAgencies = async () => {
  try {
    loading.value = true
    const response = await apiservice.getProvidingAgency()

    if (response.data && response.data.results) {
      agencies.value = response.data.results.map((agency) => ({
        value: agency.id.toString(),
        text: agency.name,
      }))
    }
  } catch (error) {
    console.error('Error fetching CPD providing agencies:', error)
  } finally {
    loading.value = false
  }
}

const fetchReasons = async () => {
  try {
    loading.value = true
    const response = await apiservice.getReasonForCoducting()

    if (response.data && response.data.results) {
      reasons.value = response.data.results.map((reason) => ({
        value: reason.id.toString(),
        text: reason.name,
      }))
    }
  } catch (error) {
    console.error('Error fetching reasons for conducting:', error)
  } finally {
    loading.value = false
  }
}

// Initialize
onMounted(() => {
  fetchAgencies()
  fetchReasons()
})
</script>
