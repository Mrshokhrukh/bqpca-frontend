<template>
  <div class="bg-white rounded-xl shadow-md p-6 md:p-8">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
      <h2 class="text-2xl font-semibold text-slate-800 flex items-center">
        <span class="mr-3 text-purple-600">
          <Calendar class="w-6 h-6" />
        </span>
        Important Dates & Events
      </h2>
      <div v-if="events.length > 0"
        class="text-sm font-medium bg-slate-200 text-slate-600 rounded-full px-3 py-1 whitespace-nowrap">
        {{ events.length }} Upcoming Item{{ events.length !== 1 ? 's' : '' }}
      </div>
    </div>

    <!-- Events Grid / List -->
    <transition-group v-if="events.length > 0" name="event-list" tag="div"
      class="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-6">
      <!-- Event Card -->
      <div v-for="event in events" :key="event.id"
        class="bg-white rounded-lg shadow-sm border border-slate-100 overflow-hidden flex flex-col transition-all duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1 group">
        <!-- Card Header: Date & Type -->
        <div class="p-4 border-b border-slate-100 flex items-center gap-4"
          :class="getEventColor(event.type).borderClass">
          <!-- Date Block -->
          <div class="text-center flex-shrink-0 w-16">
            <span class="block text-xs font-medium text-slate-500">{{ formatDate(event.date, 'MMM').toUpperCase()
              }}</span>
            <span class="block text-2xl font-bold text-slate-700">{{ formatDate(event.date, 'd') }}</span>
            <span class="block text-xs font-medium text-slate-500">{{ event.time }}</span>
          </div>
          <!-- Type & Icon -->
          <div class="flex-grow">
            <div class="flex items-center mb-1">
              <component :is="getEventIcon(event.type)" class="w-4 h-4 mr-2 flex-shrink-0"
                :class="getEventColor(event.type).text" />
              <h3
                class="text-base font-semibold text-slate-800 leading-tight truncate group-hover:text-purple-700 transition-colors">
                {{ event.type }}
              </h3>
            </div>
            <!-- Tags -->
            <div class="flex items-center gap-2 mt-1 flex-wrap">
              <span v-if="isUpcoming(event.date)"
                class="px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full whitespace-nowrap animate-pulse-calm">
                Upcoming
              </span>
              <span v-if="isDeadline(event.type)" class="px-2 py-0.5 text-xs font-medium rounded-full whitespace-nowrap"
                :class="isUpcoming(event.date) ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'">
                Deadline
              </span>
            </div>
          </div>
        </div>

        <!-- Card Body: Description -->
        <div class="p-4 flex-grow">
          <p class="text-sm text-slate-600 leading-relaxed">
            {{ event.description }}
          </p>
        </div>

        <!-- Card Footer: Links & Location -->
        <div class="p-4 border-t border-slate-100 bg-slate-50/50" v-if="event.link || event.location">
          <div class="flex flex-wrap items-center gap-3">
            <a v-if="event.link" :href="event.link" target="_blank" rel="noopener noreferrer"
              class="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium bg-purple-100 text-purple-700 hover:bg-purple-600 hover:text-white transition-all duration-200">
              <Link class="w-3.5 h-3.5 mr-1.5" />
              More Details
            </a>
            <div v-if="event.location"
              class="inline-flex items-center px-3 py-1 rounded-md text-xs bg-slate-200 text-slate-700">
              <MapPin class="w-3.5 h-3.5 mr-1.5" />
              {{ event.location }}
            </div>
          </div>
        </div>
      </div>
    </transition-group>

    <!-- Empty State -->
    <div v-else
      class="py-16 mt-6 flex flex-col items-center justify-center text-center bg-white rounded-xl border border-dashed border-slate-300 shadow-inner">
      <div class="relative mb-5 p-4 bg-slate-100 rounded-full">
        <Calendar class="h-12 w-12 text-slate-400" />
      </div>
      <p class="text-slate-600 font-semibold text-lg mb-2">No upcoming events</p>
      <p class="text-slate-400 text-sm max-w-xs mb-6">
        Keep an eye on this space! We'll list your important dates and deadlines here as they are scheduled.
      </p>
      <button
        class="inline-flex items-center px-5 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 bg-purple-600 text-white shadow hover:bg-purple-700 hover:shadow-md transform active:scale-95">
        <PlusCircle class="w-4 h-4 mr-2" />
        View Full Calendar
      </button>
    </div>
  </div>
</template>

<script setup>
import {
  Calendar, Users, FileText, BarChart2, GraduationCap, Link, MapPin, PlusCircle
} from 'lucide-vue-next';

// Props definition (remains the same)
defineProps({
  events: {
    type: Array,
    default: () => []
  }
});

// --- Icon Mapping ---
const getEventIcon = (type) => {
  // Same mapping as before
  switch (type) {
    case 'ECPF Renewal Deadline': return Calendar;
    case 'Education Fair': return Users;
    case 'HEI Visit': return FileText;
    case 'Workshop': return BarChart2;
    case 'Graduation Ceremony': return GraduationCap;
    default: return Calendar;
  }
};

// --- Color & Style Mapping ---
// Adjusted to provide more style options (e.g., border color)
const getEventColor = (type) => {
  switch (type) {
    case 'ECPF Renewal Deadline':
      return { bg: 'bg-red-50', text: 'text-red-600', borderClass: 'border-red-400' };
    case 'Education Fair':
      return { bg: 'bg-blue-50', text: 'text-blue-600', borderClass: 'border-blue-400' };
    case 'HEI Visit':
      return { bg: 'bg-green-50', text: 'text-green-600', borderClass: 'border-green-400' };
    case 'Workshop':
      return { bg: 'bg-amber-50', text: 'text-amber-600', borderClass: 'border-amber-400' };
    case 'Graduation Ceremony':
      return { bg: 'bg-purple-50', text: 'text-purple-600', borderClass: 'border-purple-400' };
    default:
      return { bg: 'bg-slate-50', text: 'text-slate-600', borderClass: 'border-slate-400' };
  }
};

// --- Date Formatting ---
// Extended to allow different formats
const formatDate = (dateString, format = 'short') => {
  const date = new Date(dateString);
  let options = {};
  if (format === 'short') { // e.g., Sep 15
    options = { month: 'short', day: 'numeric' };
  } else if (format === 'MMM') { // e.g., Sep
    options = { month: 'short' };
  } else if (format === 'd') { // e.g., 15
    options = { day: 'numeric' };
  } else { // Default to short
    options = { month: 'short', day: 'numeric' };
  }
  return date.toLocaleDateString(undefined, options);
};

// --- Status Checks ---
const isUpcoming = (dateString) => {
  const eventDate = new Date(dateString);
  const currentDate = new Date();
  const sevenDaysFromNow = new Date(currentDate.getTime() + 7 * 24 * 60 * 60 * 1000);

  // Set hours to 0 to compare dates only
  eventDate.setHours(0, 0, 0, 0);
  currentDate.setHours(0, 0, 0, 0);
  sevenDaysFromNow.setHours(0, 0, 0, 0);

  // Return true if event date is today or within the next 7 days
  return eventDate >= currentDate && eventDate <= sevenDaysFromNow;
};

const isDeadline = (type) => {
  return type.toLowerCase().includes('deadline');
};
</script>

<style scoped>
/* Subtle List Transition */
.event-list-enter-active,
.event-list-leave-active {
  transition: all 0.4s ease-out;
}

.event-list-enter-from,
.event-list-leave-to {
  opacity: 0;
  transform: translateY(20px);
  /* Slide up effect */
}

/* Ensure leaving items don't disrupt layout */
.event-list-leave-active {
  position: absolute;
  /* Optional: helps smooth out removals in grids */
  width: calc((100% - var(--gap-x)) / var(--cols));
  /* Adjust if using absolute positioning */
}

/* Subtle pulse for 'Upcoming' tag */
@keyframes pulse-calm {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.75;
  }
}

.animate-pulse-calm {
  animation: pulse-calm 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Responsive Grid Column Variables (for potential leave transition tweaks) */
:root {
  --cols: 1;
  --gap-x: 1.5rem;
  /* Corresponds to gap-6 */
}

@media (min-width: 768px) {

  /* md breakpoint */
  :root {
    --cols: 2;
  }
}

@media (min-width: 1024px) {

  /* lg breakpoint */
  :root {
    --cols: 3;
  }
}
</style>