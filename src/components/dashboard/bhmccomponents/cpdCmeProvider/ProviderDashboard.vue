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
            <h2 class="text-xl font-bold">Dr. {{ providerDetail.name }}</h2>
            <div class="flex items-center space-x-2 text-sm text-gray-600">
              <span>{{ providerDetail.specialization }}</span>
              <span>•</span>
              <span>Provider ID: {{ providerDetail.id }}</span>
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
          <div :class="[
            'p-3 rounded-full',
            stat.bgColor
          ]">
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
                    {{ session.date }}
                  </span>
                  <span class="flex items-center">
                    <Clock class="w-4 h-4 mr-1" />
                    {{ session.duration }}
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
                session.status === 'Approved' ? 'bg-green-100 text-green-800' :
                  session.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    session.status === 'Upcoming' ? 'bg-blue-100 text-blue-800' :
                      'bg-purple-100 text-purple-800'
              ]">
                {{ session.status }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Reviews & Feedback -->
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h3 class="font-semibold text-lg mb-4">Recent Feedback</h3>
        <div class="space-y-4">
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
                <p class="text-xs text-gray-500 mt-1">{{ feedback.date }}</p>
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
              <span class="text-sm font-bold block">{{ event.day }}</span>
              <span class="text-xs text-gray-600">{{ event.month }}</span>
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

const providerDetail = {
  id: "CPDP-2024-001",
  name: "Sarah Chen",
  specialization: "Senior Cardiologist",
};

const quickStats = [
  {
    label: "Total Sessions Conducted",
    value: "12",
    icon: Presentation,
    bgColor: 'bg-blue-100',
    iconColor: 'text-blue-500'
  },
  {
    label: "Total CPD Credits Awarded",
    value: "156",
    icon: Award,
    bgColor: 'bg-purple-100',
    iconColor: 'text-purple-500'
  },
  {
    label: "Average Rating",
    value: "4.8",
    icon: Star,
    bgColor: 'bg-yellow-100',
    iconColor: 'text-yellow-500'
  }
];

const trainingSessions = [
  {
    id: 1,
    title: "Advanced Cardiac Life Support Update 2024",
    date: "Feb 15, 2024",
    duration: "3 hours",
    participants: 25,
    credits: 5,
    status: "Approved"
  },
  {
    id: 2,
    title: "New Approaches in Cardiovascular Care",
    date: "Mar 10, 2024",
    duration: "4 hours",
    participants: 18,
    credits: 6,
    status: "Pending"
  },
  {
    id: 3,
    title: "Emergency Cardiac Response Workshop",
    date: "Mar 25, 2024",
    duration: "6 hours",
    participants: 15,
    credits: 8,
    status: "Upcoming"
  }
];

const recentFeedback = [
  {
    id: 1,
    sessionTitle: "Advanced Cardiac Life Support Update",
    rating: 4.9,
    comment: "Excellent practical demonstrations and very current information.",
    date: "2 days ago"
  },
  {
    id: 2,
    sessionTitle: "Emergency Response Workshop",
    rating: 4.8,
    comment: "Dr. Chen's experience really showed in the case studies.",
    date: "5 days ago"
  },
  {
    id: 3,
    sessionTitle: "Cardiovascular Care Seminar",
    rating: 4.7,
    comment: "Very informative session with great hands-on practice.",
    date: "1 week ago"
  }
];

const upcomingSchedule = [
  {
    id: 1,
    day: "15",
    month: "FEB",
    title: "ACLS Update Workshop",
    time: "9:00 AM - 12:00 PM",
    participants: 25,
    venue: "City Medical Center"
  },
  {
    id: 2,
    day: "20",
    month: "FEB",
    title: "Cardiac Emergency Response",
    time: "2:00 PM - 6:00 PM",
    participants: 18,
    venue: "Virtual Session"
  },
  {
    id: 3,
    day: "25",
    month: "FEB",
    title: "Modern Cardiology Practices",
    time: "10:00 AM - 4:00 PM",
    participants: 20,
    venue: "Regional Hospital"
  }
];
</script>