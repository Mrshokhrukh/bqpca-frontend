<template>
  <div class="min-h-screen bg-gray-50">
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                scope="col"
                class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                Institute
              </th>
              <th
                scope="col"
                class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                Training Center
              </th>
              <th
                scope="col"
                class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                Inspection From Date
              </th>
              <th
                scope="col"
                class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                Inspection To Date
              </th>
              <th
                scope="col"
                class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                Observation Description
              </th>
              <th
                scope="col"
                class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                Root Cause
              </th>
              <th
                scope="col"
                class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                CAPA
              </th>
              <th
                scope="col"
                class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                Implementation Timeline
              </th>
              <th
                scope="col"
                class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                DO Remarks
              </th>
              <th
                scope="col"
                class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <template v-for="institute in institutes" :key="institute.id">
              <tr class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ institute.name_of_institution }}
                  <button @click="toggleCapas(institute.id)" class="ml-2">
                    <svg
                      v-if="expandedInstitute === institute.id"
                      class="w-4 h-4 fill-current"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path
                        d="M7 10v4h6v-4H7zm0-5v4h6V5H7zm0 10v4h6v-4H7zM2 3v14h16V3H2zm15 13H3V4h14v12z"
                      />
                    </svg>
                    <svg
                      v-else
                      class="w-4 h-4 fill-current"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path
                        d="M10 0v4h4v2h-4v4H8V6H4V4h4V0h2zm0 8v4h4v2h-4v4H8v-4H4v-2h4V8h2zM2 3v14h16V3H2zm15 13H3V4h14v12z"
                      />
                    </svg>
                  </button>
                </td>
                <td colspan="9" class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <!-- Empty cells for Training Center through Status -->
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    @click="$emit('add-capa', institute.id)"
                    class="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors duration-200"
                  >
                    <PlusIcon class="w-4 h-4 mr-1" />
                    Add CAPA
                  </button>
                </td>
              </tr>
              <template v-if="expandedInstitute === institute.id">
                <tr
                  v-for="capa in instituteCapas[institute.id] || []"
                  :key="capa.id"
                  class="bg-gray-100"
                >
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ institute.name_of_institution }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ getTeachingCenterName(capa.teaching_center_id) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ formatDate(capa.inspection_from_date) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ formatDate(capa.inspection_to_date) }}
                  </td>
                  <td
                    class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                    :title="capa.observation_description"
                  >
                    {{ truncateText(capa.observation_description || 'N/A', 50) }}
                  </td>
                  <td
                    class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                    :title="capa.root_cause"
                  >
                    {{ truncateText(capa.root_cause || 'N/A', 50) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500" :title="capa.capa">
                    {{ truncateText(capa.capa || 'N/A', 50) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ capa.implementation_timeline || 'N/A' }}
                  </td>
                  <td
                    class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                    :title="capa.DO_remarks"
                  >
                    {{ truncateText(capa.DO_remarks || 'N/A', 50) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      :class="[
                        getStatusClass(capa.status),
                        'px-2.5 py-0.5 rounded-full text-xs font-medium',
                      ]"
                    >
                      {{ getStatusText(capa.status) }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      @click="$emit('open-view-details-modal', capa)"
                      class="inline-flex items-center bg-blue-100 hover:bg-blue-200 text-blue-600 font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors duration-200 mr-2"
                    >
                      View
                    </button>
                    <button
                      @click="$emit('delete-capa', capa.id)"
                      class="inline-flex items-center bg-red-100 hover:bg-red-200 text-red-600 font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors duration-200"
                    >
                      <TrashIcon class="w-4 h-4" />
                    </button>
                  </td>
                </tr>
                <tr v-if="(instituteCapas[institute.id] || []).length === 0" class="bg-gray-100">
                  <td colspan="11" class="px-6 py-8 text-center text-sm text-gray-500">
                    No CAPA records found for this institute.
                  </td>
                </tr>
              </template>
            </template>
            <tr v-if="institutes.length === 0">
              <td colspan="11" class="px-6 py-8 text-center text-sm text-gray-500">
                No institutes found.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { PlusIcon, TrashIcon } from 'lucide-vue-next'
import { ref } from 'vue'

const props = defineProps({
  institutes: {
    type: Array,
    required: true,
  },
  instituteCapas: {
    type: Object,
    required: true,
  },
  teachingCenters: {
    type: Array,
    default: () => [],
  },
})

defineEmits(['add-capa', 'view-details', 'delete-capa', 'open-view-details-modal'])
const expandedInstitute = ref(null)

const toggleCapas = (instituteId) => {
  if (expandedInstitute.value === instituteId) {
    expandedInstitute.value = null
  } else {
    expandedInstitute.value = instituteId
  }
}

// Helper function to get teaching center name
const getTeachingCenterName = (teachingCenterId) => {
  if (!teachingCenterId) {
    return 'N/A (No Training Center Linked)'
  }
  const center = props.teachingCenters.find((center) => center.id === teachingCenterId)
  return center ? center.center_name : `Unknown (ID: ${teachingCenterId})`
}

const getStatusClass = (status) => {
  const classes = {
    P: 'bg-yellow-100 text-yellow-800',
    R: 'bg-green-100 text-green-800',
    C: 'bg-red-100 text-red-800',
    A: 'bg-blue-100 text-blue-800',
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getStatusText = (status) => {
  const statusTexts = {
    P: 'Pending',
    R: 'Resolved',
    C: 'Cancelled',
    A: 'Approved',
  }
  return statusTexts[status] || 'Unknown'
}

const truncateText = (text, maxLength) => {
  if (!text) return ''
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      return 'Invalid Date'
    }
    return date.toLocaleDateString('en-CA')
  } catch (e) {
    console.error('Error formatting date:', dateString, e)
    return 'Invalid Date'
  }
}
</script>
