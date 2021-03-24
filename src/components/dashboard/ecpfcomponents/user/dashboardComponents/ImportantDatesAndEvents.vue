<template>
  <div
    class="bg-gradient-to-br from-white to-purple-50 rounded-2xl shadow-lg p-8 border border-gray-100 transition-all duration-300 hover:shadow-xl">
    <div class="flex items-center justify-between mb-8">
      <h2 class="text-2xl font-bold text-gray-800 flex items-center group">
        <span
          class="mr-3 bg-purple-100 text-purple-600 p-3 rounded-lg shadow-sm group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
          <Calendar class="w-5 h-5" />
        </span>
        <span class="group-hover:text-purple-700 transition-colors">Important Dates & Events</span>
      </h2>
      <div class="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium shadow-sm">
        {{ events.length }} Event{{ events.length !== 1 ? 's' : '' }}
      </div>
    </div>

    <div class="relative">
      <div class="absolute left-2.5 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-300 to-gray-200"
        v-if="events.length > 0"></div>

      <transition-group name="event-list" tag="div" class="space-y-8" v-if="events.length > 0">
        <div v-for="event in events" :key="event.id"
          class="flex group hover:bg-white hover:shadow-md rounded-xl transition-all duration-200 relative pl-12 p-4">

          <div class="absolute left-0 flex flex-col items-center">
            <div
              class="w-6 h-6 rounded-full flex items-center justify-center mb-2 shadow-md transform group-hover:scale-110 transition-all"
              :class="getEventColor(event.type).bg">
              <component :is="getEventIcon(event.type)" class="w-4 h-4" :class="getEventColor(event.type).text">
              </component>
            </div>
            <!-- Date and Time -->
            <div class="text-center -ml-1">
              <span class="text-xs font-bold text-gray-700 block">{{ formatDate(event.date) }}</span>
              <span class="text-xs text-gray-500 block mt-1">{{ event.time }}</span>
            </div>
          </div>

          <div class="flex-1">
            <div class="flex flex-col">
              <div class="flex items-center">
                <h3 class="text-lg font-semibold text-gray-800 group-hover:text-purple-700 transition-colors">
                  {{ event.type }}
                </h3>
                <span v-if="isUpcoming(event.date)"
                  class="ml-2 px-3 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full shadow-sm animate-pulse">
                  Upcoming
                </span>
                <div v-if="isDeadline(event.type)" class="ml-2">
                  <div class="text-xs font-medium px-3 py-1 rounded-full shadow-sm"
                    :class="isUpcoming(event.date) ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'">
                    Deadline
                  </div>
                </div>
              </div>
              <p class="text-gray-600 mt-2 text-sm leading-relaxed">{{ event.description }}</p>

              <div class="mt-4 flex flex-wrap items-center gap-3" v-if="event.link || event.location">
                <a v-if="event.link" :href="event.link" target="_blank" rel="noopener noreferrer"
                  class="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-purple-100 text-purple-700 hover:bg-purple-700 hover:text-white transition-all duration-200">
                  <Link class="w-4 h-4 mr-2" />
                  More Details
                </a>

                <div v-if="event.location"
                  class="inline-flex items-center px-3 py-1.5 rounded-lg text-sm bg-gray-100 text-gray-700">
                  <MapPin class="w-4 h-4 mr-2" />
                  {{ event.location }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition-group>

      <div v-else
        class="py-16 flex flex-col items-center justify-center text-center bg-white rounded-xl border border-dashed border-gray-300 shadow-inner">
        <div class="relative mb-6">
          <Calendar class="h-20 w-20 text-gray-200" />
          <div class="absolute inset-0 flex items-center justify-center">
            <span class="text-gray-400 text-xl font-semibold">0</span>
          </div>
        </div>
        <p class="text-gray-500 font-medium mb-2">No upcoming deadlines or events</p>
        <p class="text-gray-400 text-sm max-w-xs mb-6">You'll see your upcoming events and deadlines here once they're
          scheduled</p>
        <button
          class="inline-flex items-center px-6 py-3 rounded-lg font-medium text-sm transition-all duration-200 bg-purple-600 text-white shadow-md hover:bg-purple-700 hover:shadow-lg transform hover:-translate-y-1">
          <PlusCircle class="w-4 h-4 mr-2" />
          Show All Events
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  Calendar, Users, FileText, BarChart2, GraduationCap, Link, MapPin, PlusCircle
} from 'lucide-vue-next';
import { defineProps } from 'vue';

defineProps({
  events: {
    type: Array,
    default: () => []
  }
});

const getEventIcon = (type) => {
  switch (type) {
    case 'ECPF Renewal Deadline': return Calendar;
    case 'Education Fair': return Users;
    case 'HEI Visit': return FileText;
    case 'Workshop': return BarChart2;
    case 'Graduation Ceremony': return GraduationCap;
    default: return Calendar;
  }
};

const getEventColor = (type) => {
  switch (type) {
    case 'ECPF Renewal Deadline':
      return { bg: 'bg-red-100', text: 'text-red-600' };
    case 'Education Fair':
      return { bg: 'bg-blue-100', text: 'text-blue-600' };
    case 'HEI Visit':
      return { bg: 'bg-green-100', text: 'text-green-600' };
    case 'Workshop':
      return { bg: 'bg-amber-100', text: 'text-amber-600' };
    case 'Graduation Ceremony':
      return { bg: 'bg-purple-100', text: 'text-purple-600' };
    default:
      return { bg: 'bg-gray-100', text: 'text-gray-600' };
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { month: 'short', day: 'numeric' };
  return date.toLocaleDateString(undefined, options);
};

const isUpcoming = (dateString) => {
  const eventDate = new Date(dateString);
  const currentDate = new Date();
  const timeDiff = eventDate - currentDate;
  const daysDiff = timeDiff / (1000 * 3600 * 24);

  // Return true if event is in the next 7 days
  return daysDiff >= 0 && daysDiff <= 7;
};

const isDeadline = (type) => {
  return type.toLowerCase().includes('deadline');
};
</script>

<style scoped>
.event-list-enter-active,
.event-list-leave-active {
  transition: all 0.5s ease;
}

.event-list-enter-from,
.event-list-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}

@keyframes pulse {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.7;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>