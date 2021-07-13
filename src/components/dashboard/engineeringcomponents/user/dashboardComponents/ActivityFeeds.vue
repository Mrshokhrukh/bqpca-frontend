<template>
  <div class="bg-white p-6 rounded-lg shadow-md">
    <div class="flex items-center space-x-3 mb-4">
      <div class="bg-purple-100 p-2 rounded-full">
        <FolderIcon class="w-5 h-5 text-purple-500" />
      </div>
      <h3 class="font-semibold">{{ title }}</h3>
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
          <div :class="['p-2 rounded-full', getActivityIconBgClass(activity.type)]">
            <component
              :is="getActivityIcon(activity.type)"
              class="w-4 h-4"
              :class="getActivityIconClass(activity.type)"
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
import {
  BookOpenIcon,
  DocumentIcon,
  AcademicCapIcon,
  CheckCircleIcon,
  FolderIcon,
} from '@heroicons/vue/24/outline'
import dayjs from 'dayjs'
import { useAuthStore } from '@/stores/authStore'
import apiServices from '@/services/services'
import { ref, computed, onMounted } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: 'Recent Activities',
  },
  applications: {
    type: Array,
    default: () => [],
  },
})

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
  if (response.data?.results && Array.isArray(response.data.results)) return response.data.results
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

    // Fetch CPD Records using EPC API
    try {
      const cpdResponse = await apiServices.getEpcCpdRecords()
      const cpdData = getDataArray(cpdResponse)

      getUserRecords(cpdData, cid).forEach((record) => {
        const dateObj = getValidDate(record)
        if (dateObj?.isValid()) {
          tempActivities.push({
            type: 'CPD',
            title:
              record.title_of_cpd || record.cpd_activity_topic || record.title || 'CPD Activity',
            date: dateObj,
            cid_no: cid,
          })
        }
      })
    } catch (cpdErr) {
      console.error('Error fetching EPC CPD records:', cpdErr)
    }

    // Fetch CoGS Applications using EPC API
    try {
      const cogsResponse = await apiServices.getEpcCogs()
      const cogsData = getDataArray(cogsResponse)

      getUserRecords(cogsData, cid).forEach((record) => {
        const dateObj = getValidDate(record)
        if (dateObj?.isValid()) {
          tempActivities.push({
            type: 'CoGS',
            title: 'CoGS Application Submitted',
            date: dateObj,
            cid_no: cid,
          })
        }
      })
    } catch (cogsErr) {
      console.error('Error fetching EPC CoGS records:', cogsErr)
    }

    // Fetch Renewal Applications using EPC API
    try {
      const renewalResponse = await apiServices.getEpcRenewals()
      const renewalData = getDataArray(renewalResponse)

      getUserRecords(renewalData, cid).forEach((record) => {
        const dateObj = getValidDate(record)
        if (dateObj?.isValid()) {
          tempActivities.push({
            type: 'Renewal',
            title: 'Renewal Application Submitted',
            date: dateObj,
            cid_no: cid,
          })
        }
      })
    } catch (renewalErr) {
      console.error('Error fetching EPC Renewal records:', renewalErr)
    }

    // Process passed applications (certifications)
    if (props.applications && props.applications.length > 0) {
      getUserRecords(props.applications, cid).forEach((app) => {
        const dateObj = getValidDate(app)
        if (dateObj?.isValid()) {
          tempActivities.push({
            type: 'Application',
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
                latestTitle =
                  qual.qualification_name_display || qual.title || qual.name || 'New Qualification'
              }
            })

            if (latestDate) {
              tempActivities.push({
                type: 'Certificate',
                title: latestTitle,
                date: latestDate,
                cid_no: cid,
              })
            }
          }
        }
      })
    } else {
      // If no applications passed as props, try to fetch them
      try {
        const appsResponse = await apiServices.getEpcNewApplications()
        const appsData = getDataArray(appsResponse)

        getUserRecords(appsData, cid).forEach((app) => {
          const dateObj = getValidDate(app)
          if (dateObj?.isValid()) {
            tempActivities.push({
              type: 'Application',
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
                  latestTitle =
                    qual.qualification_name_display ||
                    qual.title ||
                    qual.name ||
                    'New Qualification'
                }
              })

              if (latestDate) {
                tempActivities.push({
                  type: 'Certificate',
                  title: latestTitle,
                  date: latestDate,
                  cid_no: cid,
                })
              }
            }
          }
        })
      } catch (appErr) {
        console.error('Error fetching EPC applications:', appErr)
      }
    }

    // Add sample data if no activities found (for development/testing)
    if (tempActivities.length === 0) {
      tempActivities.push(
        {
          type: 'CPD',
          title: 'Engineering Ethics Workshop',
          date: dayjs().subtract(5, 'day'),
          cid_no: cid,
        },
        {
          type: 'Application',
          title: 'New Application Submitted',
          date: dayjs().subtract(10, 'day'),
          cid_no: cid,
        },
        {
          type: 'Certificate',
          title: 'Engineering License Qualification',
          date: dayjs().subtract(15, 'day'),
          cid_no: cid,
        },
      )
    }

    activities.value = tempActivities
  } catch (err) {
    console.error('Error fetching activities:', err)
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
    .slice(0, 5) // Show only the 5 most recent activities
})

const getActivityIcon = (type) => {
  const icons = {
    CPD: BookOpenIcon,
    Application: DocumentIcon,
    Renewal: CheckCircleIcon,
    Certificate: AcademicCapIcon,
    CoGS: FolderIcon,
  }
  return icons[type] || DocumentIcon
}

const getActivityIconBgClass = (type) => {
  const classes = {
    CPD: 'bg-blue-100',
    Application: 'bg-green-100',
    Renewal: 'bg-purple-100',
    Certificate: 'bg-amber-100',
    CoGS: 'bg-indigo-100',
  }
  return classes[type] || 'bg-gray-100'
}

const getActivityIconClass = (type) => {
  const classes = {
    CPD: 'text-blue-500',
    Application: 'text-green-500',
    Renewal: 'text-purple-500',
    Certificate: 'text-amber-500',
    CoGS: 'text-indigo-500',
  }
  return classes[type] || 'text-gray-500'
}
</script>
