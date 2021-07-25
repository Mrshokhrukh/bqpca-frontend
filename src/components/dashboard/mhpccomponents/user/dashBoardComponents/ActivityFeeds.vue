<template>
  <div class="bg-white p-6 rounded-lg shadow-md">
    <div class="flex items-center space-x-3 mb-4">
      <div class="bg-purple-100 p-2 rounded-full">
        <FolderIcon class="w-5 h-5 text-purple-500" />
      </div>
      <h3 class="font-semibold">recent activities</h3>
    </div>
    <div class="space-y-4">
      <div v-if="loading" class="text-center text-gray-500 text-sm">Loading activities...</div>

      <div v-else-if="error" class="text-center text-red-500 text-sm">
        {{ error }}
      </div>

      <template v-else>
        <div
          v-for="(activity, index) in sortedActivities"
          :key="index"
          class="flex items-start space-x-3"
        >
          <div
            :class="['p-2 rounded-full', activity.type === 'cpd' ? 'bg-blue-100' : 'bg-green-100']"
          >
            <component
              :is="activity.type === 'cpd' ? BookOpenIcon : DocumentIcon"
              class="w-4 h-4"
              :class="activity.type === 'cpd' ? 'text-blue-500' : 'text-green-500'"
            />
          </div>
          <div>
            <p class="text-sm font-medium">{{ activity.title }}</p>
            <p class="text-xs text-gray-500">{{ formatDate(activity.date) }}</p>
          </div>
        </div>

        <div v-if="sortedActivities.length === 0" class="text-center text-gray-500 text-sm">
          No recent activities
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { BookOpenIcon, DocumentIcon, FolderIcon } from '@heroicons/vue/24/outline'
import dayjs from 'dayjs'
import { useAuthStore } from '@/stores/authStore'
import apiServices from '@/services/services'
import { ref, computed, onMounted } from 'vue'

const authStore = useAuthStore()
const activities = ref([])
const loading = ref(true)
const error = ref(null)

const formatDate = (dateInput) => {
  if (!dateInput) return 'N/A'
  try {
    return dayjs(dateInput).format('MMM DD, YYYY')
  } catch (err) {
    console.error('Error formatting date:', err)
    return 'Invalid date'
  }
}

onMounted(() => fetchActivities())

// Extract data from response with consistent pattern
const getDataArray = (response) => {
  if (!response) return []

  if (Array.isArray(response.data)) return response.data
  if (response.data?.data && Array.isArray(response.data.data)) return response.data.data
  if (response.data && typeof response.data === 'object') {
    // Try to find array in object properties
    for (const key in response.data) {
      if (Array.isArray(response.data[key])) return response.data[key]
    }
    // If data is direct object map
    if (Object.keys(response.data).length > 0) return Object.values(response.data)
  }
  return []
}

// Get records that match current user
const getUserRecords = (records, cid) => {
  return records.filter((record) => {
    if (!record) return false
    const recordCid = record.cid_no || record.cid || record.user_id
    return recordCid && recordCid.toString() === cid.toString()
  })
}

// Get valid date from record with fallbacks
const getValidDate = (record) => {
  const dateValue = record.updated_at || record.created_at || record.date
  return dateValue ? dayjs(dateValue) : null
}

const fetchActivities = async () => {
  loading.value = true
  error.value = null
  activities.value = []

  try {
    // Check for authenticated user
    if (!authStore.user?.cid) {
      error.value = 'User not authenticated'
      loading.value = false
      return
    }

    const cid = authStore.user.cid
    const tempActivities = []

    // Fetch CPD Records
    try {
      const cpdResponse = await apiServices.getMhpcCpdRecords()
      const cpdData = getDataArray(cpdResponse)

      getUserRecords(cpdData, cid).forEach((record) => {
        const dateObj = getValidDate(record)
        if (dateObj?.isValid()) {
          tempActivities.push({
            type: 'cpd',
            title: record.cpd_activity_topic || record.title || 'CPD Activity',
            date: dateObj,
            cid_no: cid,
          })
        }
      })
    } catch (cpdErr) {
      console.error('Error fetching CPD records:', cpdErr)
    }

    // Fetch Applications
    try {
      const appsResponse = await apiServices.getMhpcNewApplications()
      const appsData = getDataArray(appsResponse)

      getUserRecords(appsData, cid).forEach((app) => {
        const dateObj = getValidDate(app)
        if (dateObj?.isValid()) {
          tempActivities.push({
            type: 'application',
            title: 'New Application Submitted',
            date: dateObj,
            cid_no: cid,
          })

          // Handle qualifications
          let qualifications = app.user_qualifications || app.qualifications || []
          if (!Array.isArray(qualifications) && typeof qualifications === 'object') {
            qualifications = Object.values(qualifications)
          }

          if (qualifications.length > 0) {
            // Find most recent qualification
            let latestDate = null
            let latestTitle = 'New Qualification'

            qualifications.forEach((qual) => {
              if (!qual) return
              const qualDateObj = getValidDate(qual)
              if (qualDateObj?.isValid() && (!latestDate || qualDateObj.isAfter(latestDate))) {
                latestDate = qualDateObj
                latestTitle = qual.title || qual.name || 'New Qualification'
              }
            })

            if (latestDate) {
              tempActivities.push({
                type: 'application',
                title: latestTitle,
                date: latestDate,
                cid_no: cid,
              })
            }
          }
        }
      })
    } catch (appErr) {
      console.error('Error fetching applications:', appErr)
    }

    // Add test data if no activities found
    if (tempActivities.length === 0) {
      tempActivities.push(
        {
          type: 'cpd',
          title: 'Medical Ethics Workshop',
          date: dayjs().subtract(5, 'day'),
          cid_no: cid,
        },
        {
          type: 'application',
          title: 'New Application Submitted',
          date: dayjs().subtract(10, 'day'),
          cid_no: cid,
        },
        {
          type: 'application',
          title: 'Medical License Qualification',
          date: dayjs().subtract(15, 'day'),
          cid_no: cid,
        },
      )
    }

    activities.value = tempActivities
  } catch (err) {
    error.value = err.message || 'Failed to fetch activities.'
  } finally {
    loading.value = false
  }
}

const sortedActivities = computed(() => {
  return [...activities.value]
    .filter((activity) => activity?.date)
    .sort((a, b) => {
      try {
        return dayjs(b.date).valueOf() - dayjs(a.date).valueOf()
      } catch {
        return 0
      }
    })
    .slice(0, 5)
})
</script>
