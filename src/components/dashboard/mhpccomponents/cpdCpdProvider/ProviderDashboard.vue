<template>
  <div class="space-y-6">
    <!-- Provider Profile Banner -->
    <div class="bg-white p-6 rounded-lg shadow-md">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <div class="bg-blue-100 p-4 rounded-full">
            <UserCircle class="w-8 h-8 text-blue-500" />
          </div>
          <div>
            <h2 class="text-xl font-bold">{{ fullName }}</h2>
            <!-- <p class="text-sm text-gray-500">Provider ID: {{ user.cid || 'N/A' }}</p> -->
          </div>
        </div>
        <button
          @click="proposeNewTraining"
          class="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-600"
        >
          <Plus class="w-4 h-4" />
          <span>Propose New Training</span>
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-10">
      <p class="text-lg text-gray-600">Loading dashboard data...</p>
      <!-- You can add a spinner here -->
    </div>

    <!-- Data Display -->
    <template v-else>
      <!-- Quick Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          v-for="(stat, index) in quickStats"
          :key="index"
          class="bg-white p-6 rounded-lg shadow-md"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-gray-600 text-sm">{{ stat.label }}</p>
              <p class="text-2xl font-bold mt-1">{{ stat.value }}</p>
            </div>
            <div :class="['p-3 rounded-full', stat.bgColor]">
              <component :is="stat.icon" class="w-5 h-5" :class="stat.iconColor" />
            </div>
          </div>
        </div>
      </div>

      <!-- Training Sessions & Approval Status -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- My Training Sessions -->
        <div class="bg-white p-6 rounded-lg shadow-md">
          <div class="flex justify-between items-center mb-4">
            <h3 class="font-semibold text-lg">My Training Sessions</h3>
            <button @click="viewAllSessions" class="text-blue-600 text-sm hover:text-blue-800">
              View All
            </button>
          </div>
          <div class="space-y-4">
            <div
              v-for="session in trainingSessions.slice(0, 3)"
              :key="session.id"
              class="border-b last:border-0 pb-4 last:pb-0"
            >
              <div class="flex justify-between items-start">
                <div class="space-y-1">
                  <h4 class="font-medium">{{ session.title }}</h4>
                  <div class="flex items-center space-x-3 text-sm text-gray-600">
                    <span class="flex items-center">
                      <Calendar class="w-4 h-4 mr-1" />
                      {{ formatDate(session.date) }}
                    </span>
                    <span class="flex items-center">
                      <Clock class="w-4 h-4 mr-1" />
                      {{ session.duration }} Hrs
                    </span>
                  </div>
                  <div class="flex items-center space-x-3 text-sm">
                    <span class="flex items-center text-gray-600">
                      <Users class="w-4 h-4 mr-1" />
                      {{ session.participants }} enrolled
                    </span>
                    <span class="flex items-center text-purple-600">
                      <Award class="w-4 h-4 mr-1" />
                      {{ session.credits }} CPD credits
                    </span>
                  </div>
                </div>
                <span
                  :class="[
                    'px-2 py-1 rounded-full text-xs whitespace-nowrap',
                    session.status === 'Approved'
                      ? 'bg-green-100 text-green-800'
                      : session.status === 'Pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : session.status === 'Upcoming'
                          ? 'bg-blue-100 text-blue-800'
                          : session.status === 'Completed'
                            ? 'bg-gray-100 text-gray-700'
                            : 'bg-purple-100 text-purple-800', // Default/fallback
                  ]"
                >
                  {{ session.status }}
                </span>
              </div>
            </div>
            <p v-if="trainingSessions.length === 0" class="text-gray-600 py-4">
              No training sessions found. Click "Propose New Training" to create one.
            </p>
          </div>
        </div>

        <!-- Recent Reviews & Feedback (Placeholder - You'll need to fetch this data) -->
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h3 class="font-semibold text-lg mb-4">Recent Feedback</h3>
          <div class="space-y-4">
            <p v-if="recentFeedback.length === 0" class="text-gray-600">
              No recent feedback available.
            </p>
            <div
              v-for="feedbackItem in recentFeedback.slice(0, 3)"
              :key="feedbackItem.id"
              class="border-b last:border-0 pb-4 last:pb-0"
            >
              <div class="flex items-start space-x-3">
                <div class="bg-gray-100 p-2 rounded">
                  <MessageSquare class="w-4 h-4 text-gray-500" />
                </div>
                <div class="flex-1">
                  <div class="flex justify-between">
                    <p class="text-sm font-medium">{{ feedbackItem.sessionTitle }}</p>
                    <div class="flex items-center">
                      <Star class="w-4 h-4 text-yellow-400" />
                      <span class="text-sm ml-1">{{ feedbackItem.rating }}/5</span>
                    </div>
                  </div>
                  <p class="text-sm text-gray-600 mt-1 line-clamp-2">{{ feedbackItem.comment }}</p>
                  <p class="text-xs text-gray-500 mt-1">{{ formatDate(feedbackItem.date) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Upcoming Schedule -->
      <div class="bg-white p-6 rounded-lg shadow-md">
        <div class="flex justify-between items-center mb-4">
          <h3 class="font-semibold text-lg">Upcoming Schedule</h3>
          <!-- <button class="text-blue-600 text-sm hover:text-blue-700">View Calendar</button> -->
        </div>
        <div
          v-if="upcomingSchedule.length > 0"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          <div
            v-for="event in upcomingSchedule.slice(0, 3)"
            :key="event.id"
            class="border rounded-lg p-4"
          >
            <div class="flex items-start space-x-3">
              <div class="bg-gray-100 p-2 rounded text-center min-w-[3rem]">
                <span class="text-sm font-bold block">{{ formatDate(event.date, 'dd') }}</span>
                <span class="text-xs text-gray-600">{{ formatDate(event.date, 'MMM') }}</span>
              </div>
              <div class="flex-1">
                <h4 class="font-medium">{{ event.title }}</h4>
                <div class="space-y-1 mt-2">
                  <p class="text-sm text-gray-600 flex items-center">
                    <Clock class="w-3 h-3 mr-1" />
                    {{ event.time }}
                  </p>
                  <p class="text-sm text-gray-600 flex items-center">
                    <Users class="w-3 h-3 mr-1" />
                    {{ event.participants }} registered
                  </p>
                  <p class="text-sm text-gray-600 flex items-center">
                    <MapPin class="w-3 h-3 mr-1" />
                    {{ event.venue }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <p v-if="upcomingSchedule.length === 0 && !loading" class="text-gray-600 py-4">
          No upcoming events scheduled.
        </p>
      </div>
    </template>
  </div>
</template>

<script setup>
import {
  UserCircle,
  Users,
  Award,
  Calendar,
  Clock,
  Plus,
  MessageSquare,
  Star,
  MapPin,
  Presentation,
} from 'lucide-vue-next'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import apiServices from '@/services/mhpcservices' // Assuming this is your API service
import { format, isFuture, isPast, parseISO } from 'date-fns'

const router = useRouter()

const user = ref(JSON.parse(localStorage.getItem('user')) || {})

const fullName = computed(() => {
  if (user.value && user.value.first_name) {
    const firstName = user.value.first_name || ''
    const middleName = user.value.middle_name ? ` ${user.value.middle_name}` : '' // Adjusted spacing
    const lastName = user.value.last_name ? ` ${user.value.last_name}` : '' // Adjusted spacing
    return `${firstName}${middleName}${lastName}`.trim()
  }
  return 'Provider Name' // Fallback
})

const quickStats = ref([])
const trainingSessions = ref([])
const recentFeedback = ref([])
const upcomingSchedule = ref([])
const loading = ref(true) // Start with loading true

const proposeNewTraining = () => {
  router.push('/admin/cme_cpd_provider/health_certification/cpd_application_details')
}

const viewAllSessions = () => {
  router.push('/admin/cme_cpd_provider/health_certification/cpd_application_tracker')
}

const getSessionStatus = (item) => {
  if (!item.is_cpd_approved) {
    return 'Pending'
  }
  // Assuming from_date and to_date are valid date strings (e.g., ISO format)
  const fromDate = item.from_date ? parseISO(item.from_date) : null
  const toDate = item.to_date ? parseISO(item.to_date) : null

  if (fromDate && isFuture(fromDate)) {
    return 'Upcoming'
  }
  if (toDate && isPast(toDate)) {
    return 'Completed'
  }
  if (!toDate && fromDate && isPast(fromDate)) {
    // Single day event in the past
    return 'Completed'
  }
  return 'Approved' // Ongoing or approved without specific future/past date
}

onMounted(async () => {
  loading.value = true
  try {
    const userCid = user.value?.cid
    if (!userCid) {
      console.warn('User CID not found in localStorage. Cannot filter provider data.')
      // Potentially set an error state or show a message
      quickStats.value = [
        {
          label: 'Total Sessions Conducted',
          value: 0,
          icon: Presentation,
          bgColor: 'bg-blue-100',
          iconColor: 'text-blue-500',
        },
        {
          label: 'Total CPD Credits Awarded',
          value: 0,
          icon: Award,
          bgColor: 'bg-purple-100',
          iconColor: 'text-purple-500',
        },
        {
          label: 'Average Rating',
          value: 'N/A',
          icon: Star,
          bgColor: 'bg-yellow-100',
          iconColor: 'text-yellow-500',
        },
      ]
      loading.value = false
      return
    }

    const cpdRecordsResponse = await apiServices.getMhpcCpdTask()
    const cpdData = cpdRecordsResponse.data?.results || []

    // Filter data specific to the logged-in provider using their CID
    const providerCpdData = cpdData.filter((item) => item.cid_no === userCid && !item.is_draft) // Exclude drafts from dashboard

    // --- Quick Stats ---
    const totalSessionsConducted = providerCpdData.length
    const totalCpdCreditsAwarded = providerCpdData.reduce(
      (total, item) => total + (Number(item.credit) || 0),
      0,
    )
    // Average Rating: Placeholder - requires feedback data integration
    const averageRating = 'N/A' // Or 0 if you prefer a number

    quickStats.value = [
      {
        label: 'Total Sessions Conducted',
        value: totalSessionsConducted,
        icon: Presentation,
        bgColor: 'bg-blue-100',
        iconColor: 'text-blue-500',
      },
      {
        label: 'Total CPD Credits Awarded',
        value: totalCpdCreditsAwarded,
        icon: Award,
        bgColor: 'bg-purple-100',
        iconColor: 'text-purple-500',
      },
      {
        label: 'Average Rating',
        value: averageRating,
        icon: Star,
        bgColor: 'bg-yellow-100',
        iconColor: 'text-yellow-500',
      },
    ]

    // --- Training Sessions (Recent/Relevant) ---
    // Sort by creation date descending to get the latest proposals first for the summary
    const sortedProviderCpdData = [...providerCpdData].sort((a, b) => {
      const dateA = a.created_at ? new Date(a.created_at) : 0
      const dateB = b.created_at ? new Date(b.created_at) : 0
      return dateB - dateA
    })

    trainingSessions.value = sortedProviderCpdData.map((item) => ({
      id: item.id,
      title: item.title_of_cpd || 'N/A',
      date: item.from_date, // Will be formatted in template
      duration: item.duration_in_hours || 0,
      participants: item.number_of_participants || 0,
      credits: item.credit || 0,
      status: getSessionStatus(item),
    }))

    // --- Upcoming Schedule ---
    upcomingSchedule.value = providerCpdData
      .filter((item) => {
        if (!item.is_cpd_approved || !item.from_date) return false
        try {
          return isFuture(parseISO(item.from_date))
        } catch (e) {
          console.error('Error parsing date:', item.from_date, e)
          return false
        }
      })
      .sort((a, b) => parseISO(a.from_date) - parseISO(b.from_date)) // Sort by upcoming date ascending
      .map((item) => ({
        id: item.id,
        date: item.from_date,
        title: item.title_of_cpd || 'N/A',
        time:
          item.start_time && item.end_time ? `${item.start_time} - ${item.end_time}` : 'Full Day', // Placeholder: use actual time if available
        participants: item.number_of_participants || 0,
        venue: item.venue || 'N/A',
      }))

    // --- Recent Feedback (Mock data, replace with API call) ---
    // Example: const feedbackResponse = await apiServices.getFeedbackForProvider(userCid);
    // recentFeedback.value = feedbackResponse.data.results || [];
    recentFeedback.value = [
      // Keeping mock data for now
      {
        id: 1,
        sessionTitle: 'Advanced Cardiac Life Support Update',
        rating: 4.9,
        comment: 'Excellent practical demonstrations and very current information.',
        date: '2024-07-20',
      },
      {
        id: 2,
        sessionTitle: 'Emergency Response Workshop',
        rating: 4.8,
        comment: "Dr. Chen's experience really showed in the case studies.",
        date: '2024-07-17',
      },
      {
        id: 3,
        sessionTitle: 'Cardiovascular Care Seminar',
        rating: 4.7,
        comment: 'Very informative session with great hands-on practice.',
        date: '2024-07-10',
      },
    ]
  } catch (error) {
    console.error('Error fetching provider dashboard data:', error)
    // Set an error state to display a message to the user if desired
    // For now, just ensuring loading is false and some defaults are set.
    quickStats.value = [
      {
        label: 'Total Sessions Conducted',
        value: 0,
        icon: Presentation,
        bgColor: 'bg-blue-100',
        iconColor: 'text-blue-500',
      },
      {
        label: 'Total CPD Credits Awarded',
        value: 0,
        icon: Award,
        bgColor: 'bg-purple-100',
        iconColor: 'text-purple-500',
      },
      {
        label: 'Average Rating',
        value: 'Error',
        icon: Star,
        bgColor: 'bg-yellow-100',
        iconColor: 'text-yellow-500',
      },
    ]
  } finally {
    loading.value = false
  }
})

const formatDate = (dateString, formatStr = 'MMM dd, yyyy') => {
  // Default format changed for better readability
  if (!dateString) return 'N/A'
  try {
    return format(parseISO(dateString), formatStr) // Use parseISO for flexibility with input date strings
  } catch (error) {
    console.warn('Error formatting date:', dateString, error)
    return 'Invalid Date'
  }
}
</script>
