<template>
  <div class="min-h-screen p-6">
    <h1 class="text-3xl font-bold mb-6 text-gray-800">Dashboard</h1>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <MyApplications
        :applications="applications"
        @view-details="viewApplicationDetails"
        v-if="applications.length"
      />
      <div v-else class="bg-white p-4 rounded-lg shadow">
        <p class="text-gray-500">No applications available</p>
      </div>

      <ImportantDatesAndEvents
        :events="events"
        v-if="events.length"
      />
      <div v-else class="bg-white p-4 rounded-lg shadow">
        <p class="text-gray-500">No events available</p>
      </div>

      <Notifications
        :notifications="notifications"
        @mark-all-read="markAllAsRead"
        v-if="notifications.length"
      />
      <div v-else class="bg-white p-4 rounded-lg shadow">
        <p class="text-gray-500">No notifications available</p>
      </div>

      <QuickLinks
        @start-new-application="startNewApplication"
        @renew-ecpf="renewECPF"
        @change-name-location="changeNameLocation"
        @contact-support="contactSupport"
        :show-renew-button="showRenewButton"
        @go-to-student-management="goToStudentManagement"
        @go-to-hr-bio-data="goToHRBioData"
      />

      <HelpAndSupport
        :faqs="faqs"
        :show-faq="showFAQ"
        :live-chat-available="liveChatAvailable"
        @toggle-faq="toggleFAQ"
        @open-live-chat="openLiveChat"
        v-if="faqs.length"
      />
      <div v-else class="bg-white p-4 rounded-lg shadow">
        <p class="text-gray-500">No FAQs available</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import MyApplications from './dashboardComponents/MyApplications.vue'
import ImportantDatesAndEvents from './dashboardComponents/ImportantDatesAndEvents.vue'
import Notifications from './dashboardComponents/Notifications.vue'
import QuickLinks from './dashboardComponents/QuickLinks.vue'
import HelpAndSupport from './dashboardComponents/HelpAndSupport.vue'

// Reactive state
const applications = ref([])
const events = ref([])
const notifications = ref([])
const faqs = ref([])
const showFAQ = ref(false)
const liveChatAvailable = ref(false)
const showRenewButton = ref(false)

// API fetching function (replace with actual API client, e.g., axios)
const fetchData = async (endpoint) => {
  try {
    // Example: const response = await axios.get(endpoint)
    const response = await fetch(endpoint) // Replace with actual API client
    return response.ok ? await response.json() : []
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error)
    return []
  }
}

onMounted(async () => {
  // Fetch applications
  applications.value = await fetchData('/api/applications')
  const today = new Date()
  const renewalThreshold = new Date()
  renewalThreshold.setDate(today.getDate() + 30)

  applications.value.forEach((app) => {
    const renewalDate = new Date(app.submittedDate)
    renewalDate.setFullYear(renewalDate.getFullYear() + 1)
    if (renewalDate <= renewalThreshold && app.status === 'Approved') {
      showRenewButton.value = true
    }
  })

  // Fetch events
  events.value = await fetchData('/api/events')

  // Fetch notifications
  notifications.value = await fetchData('/api/notifications')

  // Fetch FAQs
  faqs.value = await fetchData('/api/faqs')

  // Fetch live chat availability
  liveChatAvailable.value = await fetchData('/api/live-chat-status') || false
})

// Event handlers
const viewApplicationDetails = (id) => {
  alert(`Viewing details for application ID: ${id}`)
}

const startNewApplication = () => {
  alert('Starting new application...')
}

const renewECPF = () => {
  alert('Redirecting to ECPF renewal page...')
}

const changeNameLocation = () => {
  alert('Redirecting to change name/location page...')
}

const contactSupport = () => {
  alert('Opening contact form...')
}

const markAllAsRead = () => {
  notifications.value = []
}

const toggleFAQ = () => {
  showFAQ.value = !showFAQ.value
}

const openLiveChat = () => {
  alert('Starting live chat...')
}

const goToStudentManagement = () => {
  alert('Redirecting to Student Management page')
}

const goToHRBioData = () => {
  alert('Redirecting to HR Bio Data page')
}
</script>
