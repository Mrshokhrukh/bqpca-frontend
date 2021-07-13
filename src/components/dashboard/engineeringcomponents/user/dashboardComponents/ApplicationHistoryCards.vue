<template>
  <div class="bg-white p-6 rounded-lg shadow-md">
    <div class="flex items-center space-x-3 mb-4">
      <div class="bg-purple-100 p-2 rounded-full">
        <ClockIcon class="w-5 h-5 text-purple-500" />
      </div>
      <h3 class="font-semibold">Application History</h3>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="space-y-3">
      <div v-for="i in 3" :key="i" class="flex justify-between items-center">
        <div class="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
        <div class="h-6 bg-gray-200 rounded-full w-8 animate-pulse"></div>
      </div>
    </div>

    <!-- Data Display -->
    <div v-else class="space-y-3">
      <div
        v-for="(status, index) in statusTypes"
        :key="index"
        class="flex justify-between items-center"
        :class="{
          'cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-colors': status === 'Rejected',
        }"
        @click="status === 'Rejected' && $emit('show-rejected')"
      >
        <span class="text-sm">{{ status }}</span>
        <span :class="['px-2 py-1 rounded-full text-xs font-medium', getStatusClass(status)]">
          {{ getStatusCount(status) }}
        </span>
      </div>
    </div>

    <!-- Summary by Type (Optional detailed breakdown) -->
    <div v-if="!isLoading && showBreakdown" class="mt-4 pt-4 border-t border-gray-200">
      <h4 class="text-xs font-medium text-gray-500 mb-2">Breakdown by Type</h4>
      <div class="space-y-2">
        <div
          v-for="(counts, type) in applicationBreakdown"
          :key="type"
          class="flex justify-between text-xs"
        >
          <span class="text-gray-600">{{ formatApplicationType(type) }}</span>
          <div class="flex space-x-2">
            <span class="text-green-600">{{ counts.Approved || 0 }}</span>
            <span class="text-yellow-600">{{ counts.Pending || 0 }}</span>
            <span class="text-red-600">{{ counts.Rejected || 0 }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ClockIcon } from '@heroicons/vue/24/outline'
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import apiService from '@/services/services'

const props = defineProps({
  applications: {
    type: Array,
    required: true,
  },
  showBreakdown: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['show-rejected'])

const authStore = useAuthStore()
const cpdApplications = ref([])
const cogsApplications = ref([])
const isLoading = ref(false)

const statusTypes = ['Approved', 'Pending', 'Rejected']

// Fetch CPD and CoGS applications
const fetchAdditionalApplications = async () => {
  if (!authStore.user?.cid) return

  isLoading.value = true
  try {
    const [cpdResponse, cogsResponse] = await Promise.allSettled([
      apiService.getEpcCpdRecords(),
      apiService.getEpcCogs(),
    ])

    // Process CPD applications
    if (cpdResponse.status === 'fulfilled') {
      const cpdData = Array.isArray(cpdResponse.value.data.results)
        ? cpdResponse.value.data.results
        : Array.isArray(cpdResponse.value.data)
          ? cpdResponse.value.data
          : []

      cpdApplications.value = cpdData.filter((app) => app.cid_no === authStore.user.cid)
    } else {
      console.error('Failed to fetch CPD applications:', cpdResponse.reason)
    }

    // Process CoGS applications
    if (cogsResponse.status === 'fulfilled') {
      const cogsData = Array.isArray(cogsResponse.value.data.results)
        ? cogsResponse.value.data.results
        : Array.isArray(cogsResponse.value.data)
          ? cogsResponse.value.data
          : []

      cogsApplications.value = cogsData.filter((app) => app.cid_no === authStore.user.cid)
    } else {
      console.error('Failed to fetch CoGS applications:', cogsResponse.reason)
    }
  } catch (error) {
    console.error('Error fetching additional applications:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchAdditionalApplications)

// Process regular applications (certifications)
const processedCertificationApplications = computed(() => {
  return props.applications.map((app) => {
    let status = 'Pending'

    if (app.user_qualifications && app.user_qualifications.length > 0) {
      const primaryQual =
        app.user_qualifications.find((q) => q.is_primary_qualification) ||
        app.user_qualifications[0]

      if (primaryQual) {
        if (primaryQual.endorsement_decision === 'Approved') {
          status = 'Approved'
        } else if (
          primaryQual.endorsement_decision === 'Regretted' ||
          primaryQual.endorsement_decision === 'Rejected'
        ) {
          status = 'Rejected'
        } else if (primaryQual.endorsement_decision === 'Pending') {
          if (
            primaryQual.application_review_status === 'Regretted' ||
            primaryQual.physical_review_status === 'Regretted'
          ) {
            status = 'Rejected'
          } else {
            status = 'Pending'
          }
        }
      }
    }

    return {
      ...app,
      status: status,
      type: 'Certification',
    }
  })
})

// Process CPD applications
const processedCpdApplications = computed(() => {
  return cpdApplications.value.map((app) => {
    let status = 'Pending'

    if (app.review_status === 'Approved') {
      status = 'Approved'
    } else if (app.review_status === 'Regretted' || app.review_status === 'Rejected') {
      status = 'Rejected'
    } else {
      status = 'Pending'
    }

    return {
      ...app,
      status: status,
      type: 'CPD',
    }
  })
})

// Process CoGS applications
const processedCogsApplications = computed(() => {
  return cogsApplications.value.map((app) => {
    let status = 'Pending'

    // Check endorsement decision first
    if (app.endorsement_decision === 'Approved') {
      status = 'Approved'
    } else if (
      app.endorsement_decision === 'Regretted' ||
      app.endorsement_decision === 'Rejected'
    ) {
      status = 'Rejected'
    } else if (app.review_status === 'Regretted' || app.review_status === 'Rejected') {
      status = 'Rejected'
    } else {
      status = 'Pending'
    }

    return {
      ...app,
      status: status,
      type: 'CoGS',
    }
  })
})

// Combine all applications
const allApplications = computed(() => [
  ...processedCertificationApplications.value,
  ...processedCpdApplications.value,
  ...processedCogsApplications.value,
])

// Application breakdown by type
const applicationBreakdown = computed(() => {
  const breakdown = {}

  allApplications.value.forEach((app) => {
    if (!breakdown[app.type]) {
      breakdown[app.type] = { Approved: 0, Pending: 0, Rejected: 0 }
    }
    breakdown[app.type][app.status]++
  })

  return breakdown
})

const getStatusCount = (status) => {
  return allApplications.value.filter((app) => app.status === status).length
}

const getStatusClass = (status) => {
  const classes = {
    Approved: 'bg-green-100 text-green-800',
    Pending: 'bg-yellow-100 text-yellow-800',
    Rejected: 'bg-red-100 text-red-800',
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const formatApplicationType = (type) => {
  const typeNames = {
    Certification: 'Certifications',
    CPD: 'CPD Applications',
    CoGS: 'CoGS Applications',
  }
  return typeNames[type] || type
}
</script>
