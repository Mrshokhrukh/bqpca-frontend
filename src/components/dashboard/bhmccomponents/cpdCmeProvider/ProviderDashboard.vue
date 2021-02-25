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
            <div class="flex items-center space-x-2 text-sm text-gray-600">
              <!-- You can add other user details here if needed -->
            </div>
          </div>
        </div>
        <button class="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-600">
          <Plus class="w-4 h-4" />
          <span>Propose New Training</span>
        </button>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div v-for="(stat, index) in quickStats" :key="index" class="bg-white p-6 rounded-lg shadow-md">
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
        <h3 class="font-semibold text-lg mb-4">My Training Sessions</h3>
        <div class="space-y-4">
          <div v-for="session in trainingSessions" :key="session.id" class="border-b last:border-0 pb-4 last:pb-0">
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
              <span :class="[
                'px-2 py-1 rounded-full text-xs',
                session.status === 'Approved'
                  ? 'bg-green-100 text-green-800'
                  : session.status === 'Pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : session.status === 'Upcoming'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-purple-100 text-purple-800',
              ]">
                {{ session.status }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Reviews & Feedback (Placeholder - You'll need to fetch this data) -->
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h3 class="font-semibold text-lg mb-4">Recent Feedback</h3>
        <div class="space-y-4">
          <p v-if="recentFeedback.length === 0" class="text-gray-600">No recent feedback available.</p>
          <div v-for="feedback in recentFeedback" :key="feedback.id" class="border-b last:border-0 pb-4 last:pb-0">
            <div class="flex items-start space-x-3">
              <div class="bg-gray-100 p-2 rounded">
                <MessageSquare class="w-4 h-4 text-gray-500" />
              </div>
              <div class="flex-1">
                <div class="flex justify-between">
                  <p class="text-sm font-medium">{{ feedback.sessionTitle }}</p>
                  <div class="flex items-center">
                    <Star class="w-4 h-4 text-yellow-400" />
                    <span class="text-sm ml-1">{{ feedback.rating }}/5</span>
                  </div>
                </div>
                <p class="text-sm text-gray-600 mt-1">{{ feedback.comment }}</p>
                <p class="text-xs text-gray-500 mt-1">{{ formatDate(feedback.date) }}</p>
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
        <button class="text-blue-600 text-sm hover:text-blue-700">View Calendar</button>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div v-for="event in upcomingSchedule" :key="event.id" class="border rounded-lg p-4">
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
    </div>
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
} from 'lucide-vue-next';
import { computed, onMounted, ref } from 'vue';
import apiservice from '@/services/bmhcservices';
import { format } from 'date-fns';

// Access user data directly from localStorage
const user = ref(JSON.parse(localStorage.getItem('user')) || {});

// Computed property for the full name
const fullName = computed(() => {
  if (user.value) {
    const firstName = user.value.first_name || '';
    const middleName = user.value.middle_name ? ` ${user.value.middle_name} ` : '';
    const lastName = user.value.last_name || '';
    return `${firstName}${middleName}${lastName}`.trim();
  }
  return ''; // Return empty string if user data is not available
});

// Refs for dynamic data
const quickStats = ref([]);
const trainingSessions = ref([]);
const recentFeedback = ref([]); // Add ref for feedback
const upcomingSchedule = ref([]);
const loading = ref(false);


onMounted(async () => {
  loading.value = true;
  try {
    const cpdRecordsResponse = await apiservice.getBmhcCpdTask();
    const cpdData = cpdRecordsResponse.data.results || [];

    // Filter data based on user's CID
    const userCid = user.value.cid;
    if (!userCid) {
      console.warn("User CID not found in localStorage.  Cannot filter data.");
      return; // Or handle appropriately
    }

    const filteredData = cpdData.filter(item => item.cid_no === userCid);

    // --- Quick Stats ---
    const totalSessionsConducted = filteredData.length;
    const totalCpdCreditsAwarded = filteredData.reduce((total, item) => total + item.credit, 0);
    const averageRating = 0; // Placeholder, need to calculate this.

    quickStats.value = [
      {
        label: "Total Sessions Conducted",
        value: totalSessionsConducted,
        icon: Presentation,
        bgColor: 'bg-blue-100',
        iconColor: 'text-blue-500'
      },
      {
        label: "Total CPD Credits Awarded",
        value: totalCpdCreditsAwarded,
        icon: Award,
        bgColor: 'bg-purple-100',
        iconColor: 'text-purple-500'
      },
      {
        label: "Average Rating",
        value: averageRating, // Use the calculated average
        icon: Star,
        bgColor: 'bg-yellow-100',
        iconColor: 'text-yellow-500'
      },
    ];


    // --- Training Sessions ---
    trainingSessions.value = filteredData.map(item => ({
      id: item.id,
      title: item.title_of_cpd,
      date: item.from_date,
      duration: item.duration_in_hours,
      participants: item.number_of_participants,
      credits: item.credit,
      status: item.is_cpd_approved ? "Approved" : "Pending"  //Simplified status
    }));

    // --- Upcoming Schedule ---
    upcomingSchedule.value = filteredData.filter(item => item.is_cpd_approved) //Filter for Approved ones.
      .map(item => ({
        id: item.id,
        day: item.from_date, //You'll format this in template.
        month: item.from_date, //You'll format this
        title: item.title_of_cpd,
        time: "Add time if available in API", //Add if your api give
        participants: item.number_of_participants,
        venue: item.venue
      }));

    // --- Recent Feedback --- (Assuming you have a separate endpoint for feedback)
    //  const feedbackResponse = await apiservice.getFeedback(userCid); // Replace with your actual API call
    // recentFeedback.value = feedbackResponse.data.results || [];
    //For now, keep the mock data.
    recentFeedback.value = [
      {
        id: 1,
        sessionTitle: "Advanced Cardiac Life Support Update",
        rating: 4.9,
        comment: "Excellent practical demonstrations and very current information.",
        date: "2024-02-20"  // Use a consistent date format
      },
      {
        id: 2,
        sessionTitle: "Emergency Response Workshop",
        rating: 4.8,
        comment: "Dr. Chen's experience really showed in the case studies.",
        date: "2024-02-17"
      },
      {
        id: 3,
        sessionTitle: "Cardiovascular Care Seminar",
        rating: 4.7,
        comment: "Very informative session with great hands-on practice.",
        date: "2024-02-10"
      }
    ];

  } catch (error) {
    console.error('Error fetching data:', error);
    // Handle errors, e.g., show a message to the user
  } finally {
    loading.value = false;
  }
});

const formatDate = (dateString, formatString = 'yyyy-MM-dd') => {
  if (!dateString) return 'N/A';
  try {
    return format(new Date(dateString), formatString);
  } catch (error) {
    console.error("Error formatting date:", dateString, error);
    return 'Invalid Date';
  }
};
</script>
