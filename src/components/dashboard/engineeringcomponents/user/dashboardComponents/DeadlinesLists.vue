<template>
  <div class="bg-white p-6 rounded-lg shadow-md">
    <h3 class="font-semibold mb-4">{{ title }}</h3>

    <!-- Loading State -->
    <div v-if="loading" class="space-y-3">
      <div v-for="i in 3" :key="i" class="flex items-start space-x-3">
        <div class="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
        <div class="flex-1">
          <div class="h-4 bg-gray-200 rounded animate-pulse mb-1"></div>
          <div class="h-3 bg-gray-200 rounded animate-pulse w-24"></div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center text-red-500 text-sm">
      {{ error }}
    </div>

    <!-- Deadlines Display -->
    <div v-else class="space-y-4">
      <div
        v-for="(deadline, index) in sortedDeadlines"
        :key="index"
        class="flex items-start space-x-3"
      >
        <div :class="['p-2 rounded-full', getDeadlineTypeClass(deadline.type)]">
          <component
            :is="getDeadlineIcon(deadline.type)"
            class="w-4 h-4"
            :class="getDeadlineIconClass(deadline.type)"
          />
        </div>
        <div class="flex-1">
          <div class="flex items-center justify-between">
            <p class="text-sm font-medium">{{ deadline.title }}</p>
            <span
              v-if="deadline.urgency"
              :class="[
                'px-2 py-1 rounded-full text-xs font-medium',
                getUrgencyClass(deadline.urgency),
              ]"
            >
              {{ deadline.urgency }}
            </span>
          </div>
          <p class="text-xs text-gray-500">Due: {{ formatDate(deadline.date) }}</p>
          <p
            v-if="deadline.daysUntil !== null"
            class="text-xs"
            :class="getDaysUntilClass(deadline.daysUntil)"
          >
            {{ getDaysUntilText(deadline.daysUntil) }}
          </p>
        </div>
      </div>

      <div v-if="sortedDeadlines.length === 0" class="text-center text-gray-500 text-sm">
        No upcoming deadlines
      </div>
    </div>
  </div>
</template>

<script setup>
import { CalendarIcon, AlertCircle, Clock, FileText, Award } from 'lucide-vue-next'
import dayjs from 'dayjs'
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import apiServices from '@/services/services'

const props = defineProps({
  title: {
    type: String,
    default: 'Upcoming Deadlines',
  },
  applications: {
    type: Array,
    default: () => [],
  },
})

const authStore = useAuthStore()
const deadlines = ref([])
const loading = ref(false)
const error = ref(null)

const formatDate = (date) => {
  if (!date) return 'N/A'
  return dayjs(date).format('MMM DD, YYYY')
}

const fetchDeadlines = async () => {
  loading.value = true
  error.value = null
  deadlines.value = []

  try {
    if (!authStore.user?.cid) {
      error.value = 'User not authenticated'
      return
    }

    const cid = authStore.user.cid
    const tempDeadlines = []
    const now = dayjs()

    // 1. Qualification Expiry Deadlines from applications
    const applications =
      props.applications.length > 0 ? props.applications : await fetchApplications()

    applications.forEach((app) => {
      if (app.cid_no === cid && app.user_qualifications) {
        app.user_qualifications.forEach((qual) => {
          if (qual.endorsement_decision === 'Approved' && qual.expiry_date) {
            const expiryDate = dayjs(qual.expiry_date)
            const daysUntil = expiryDate.diff(now, 'day')

            // Show qualification expiry if within 6 months or already expired
            if (daysUntil <= 180) {
              let urgency = null
              if (daysUntil <= 0) urgency = 'Expired'
              else if (daysUntil <= 14) urgency = 'Critical'
              else if (daysUntil <= 90) urgency = 'Urgent'

              tempDeadlines.push({
                type: 'Qualification',
                title: `${qual.qualification_name_display || 'Qualification'} Expires`,
                date: expiryDate,
                daysUntil: daysUntil,
                urgency: urgency,
                priority: daysUntil <= 0 ? 1 : daysUntil <= 14 ? 2 : daysUntil <= 90 ? 3 : 4,
              })
            }
          }
        })
      }
    })

    // 2. CPD Deadlines (annual 50-point requirement)
    try {
      const cpdResponse = await apiServices.getEpcCpdRecords()
      const cpdData = Array.isArray(cpdResponse.data?.results)
        ? cpdResponse.data.results
        : Array.isArray(cpdResponse.data)
          ? cpdResponse.data
          : []

      const userCpdRecords = cpdData.filter((record) => record.cid_no === cid)
      const currentYearStart = dayjs().startOf('year')
      const currentYearEnd = dayjs().endOf('year')

      // Calculate CPD credits for current year
      const currentYearCredits = userCpdRecords
        .filter((record) => {
          const recordDate = dayjs(record.created_at)
          return (
            recordDate.isAfter(currentYearStart) &&
            recordDate.isBefore(currentYearEnd) &&
            record.review_status === 'Approved'
          )
        })
        .reduce((total, record) => total + (record.cpd_credit || 0), 0)

      // If user has approved qualifications and insufficient CPD credits
      const hasApprovedQual = applications.some(
        (app) =>
          app.cid_no === cid &&
          app.user_qualifications?.some((qual) => qual.endorsement_decision === 'Approved'),
      )

      if (hasApprovedQual && currentYearCredits < 50) {
        const daysUntilYearEnd = currentYearEnd.diff(now, 'day')
        let urgency = null
        if (daysUntilYearEnd <= 30) urgency = 'Critical'
        else if (daysUntilYearEnd <= 90) urgency = 'Urgent'

        tempDeadlines.push({
          type: 'CPD',
          title: `CPD Requirement (${currentYearCredits}/50 points)`,
          date: currentYearEnd,
          daysUntil: daysUntilYearEnd,
          urgency: urgency,
          priority: daysUntilYearEnd <= 30 ? 2 : daysUntilYearEnd <= 90 ? 3 : 5,
        })
      }
    } catch (cpdError) {
      console.error('Error fetching CPD deadlines:', cpdError)
    }

    // 3. CoGS Application Deadlines (if applicable)
    try {
      const cogsResponse = await apiServices.getEpcCogs()
      const cogsData = Array.isArray(cogsResponse.data?.results)
        ? cogsResponse.data.results
        : Array.isArray(cogsResponse.data)
          ? cogsResponse.data
          : []

      const userCogsRecords = cogsData.filter((record) => record.cid_no === cid)

      userCogsRecords.forEach((cogs) => {
        if (cogs.review_status === 'Pending' && cogs.created_at) {
          const submissionDate = dayjs(cogs.created_at)
          // Assume 30-day processing time for CoGS applications
          const expectedDecisionDate = submissionDate.add(30, 'day')
          const daysUntil = expectedDecisionDate.diff(now, 'day')

          if (daysUntil >= -7) {
            // Show for a week after expected date
            tempDeadlines.push({
              type: 'CoGS',
              title: 'CoGS Application Decision Expected',
              date: expectedDecisionDate,
              daysUntil: daysUntil,
              urgency: daysUntil <= 0 ? 'Overdue' : null,
              priority: daysUntil <= 0 ? 2 : 6,
            })
          }
        }
      })
    } catch (cogsError) {
      console.error('Error fetching CoGS deadlines:', cogsError)
    }

    // 4. Renewal Period Reminders
    applications.forEach((app) => {
      if (app.cid_no === cid && app.user_qualifications) {
        app.user_qualifications.forEach((qual) => {
          if (qual.endorsement_decision === 'Approved' && qual.expiry_date) {
            const expiryDate = dayjs(qual.expiry_date)
            const renewalStartDate = expiryDate.subtract(3, 'month') // 3 months before expiry
            const daysUntilRenewalPeriod = renewalStartDate.diff(now, 'day')

            // Show renewal reminder if within 4 months of renewal period
            if (daysUntilRenewalPeriod <= 120 && daysUntilRenewalPeriod > 0) {
              tempDeadlines.push({
                type: 'Renewal',
                title: `${qual.qualification_name_display || 'Qualification'} Renewal Period Starts`,
                date: renewalStartDate,
                daysUntil: daysUntilRenewalPeriod,
                urgency: daysUntilRenewalPeriod <= 30 ? 'Urgent' : null,
                priority: daysUntilRenewalPeriod <= 30 ? 3 : 7,
              })
            }
          }
        })
      }
    })

    deadlines.value = tempDeadlines
  } catch (err) {
    console.error('Error fetching deadlines:', err)
    error.value = 'Failed to load deadlines'
  } finally {
    loading.value = false
  }
}

const fetchApplications = async () => {
  try {
    const response = await apiServices.getEpcNewApplications()
    return Array.isArray(response.data?.results)
      ? response.data.results
      : Array.isArray(response.data)
        ? response.data
        : []
  } catch (error) {
    console.error('Error fetching applications:', error)
    return []
  }
}

onMounted(fetchDeadlines)

const sortedDeadlines = computed(() => {
  return [...deadlines.value]
    .sort((a, b) => {
      // Sort by priority first (lower number = higher priority)
      if (a.priority !== b.priority) return a.priority - b.priority
      // Then by date (sooner dates first)
      return dayjs(a.date).valueOf() - dayjs(b.date).valueOf()
    })
    .slice(0, 6) // Show top 6 deadlines
})

const getDeadlineIcon = (type) => {
  const icons = {
    Qualification: AlertCircle,
    CPD: FileText,
    CoGS: Award,
    Renewal: CalendarIcon,
    Application: FileText,
  }
  return icons[type] || AlertCircle
}

const getDeadlineTypeClass = (type) => {
  const classes = {
    Qualification: 'bg-red-100',
    CPD: 'bg-blue-100',
    CoGS: 'bg-purple-100',
    Renewal: 'bg-orange-100',
    Application: 'bg-green-100',
  }
  return classes[type] || 'bg-red-100'
}

const getDeadlineIconClass = (type) => {
  const classes = {
    Qualification: 'text-red-500',
    CPD: 'text-blue-500',
    CoGS: 'text-purple-500',
    Renewal: 'text-orange-500',
    Application: 'text-green-500',
  }
  return classes[type] || 'text-red-500'
}

const getUrgencyClass = (urgency) => {
  const classes = {
    Expired: 'bg-red-100 text-red-800',
    Critical: 'bg-red-100 text-red-800',
    Urgent: 'bg-orange-100 text-orange-800',
    Overdue: 'bg-red-100 text-red-800',
  }
  return classes[urgency] || 'bg-gray-100 text-gray-800'
}

const getDaysUntilClass = (days) => {
  if (days <= 0) return 'text-red-600 font-medium'
  if (days <= 14) return 'text-red-500 font-medium'
  if (days <= 30) return 'text-orange-500'
  return 'text-gray-500'
}

const getDaysUntilText = (days) => {
  if (days < 0) return `${Math.abs(days)} days overdue`
  if (days === 0) return 'Due today'
  if (days === 1) return '1 day remaining'
  return `${days} days remaining`
}
</script>
