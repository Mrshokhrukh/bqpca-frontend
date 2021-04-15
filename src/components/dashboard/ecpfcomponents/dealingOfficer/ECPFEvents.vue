<template>
  <div class="ecpf-events">
    <h2 class="events-title">ECPF Events</h2>
    <div class="events-container">
      <div v-if="loading" class="loading">Loading events...</div>
      <div v-else-if="events.length === 0" class="no-events">No events found</div>
      <div v-else class="event-list">
        <div v-for="event in events" :key="event.id" class="event-item">
          <div class="event-header">
            <span class="event-date">{{ formatDate(event.date) }}</span>
            <span class="event-status" :class="event.status">{{ event.status }}</span>
          </div>
          <div class="event-content">
            <h3>{{ event.title }}</h3>
            <p>{{ event.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const loading = ref(true)
const events = ref([])

const formatDate = (date) => {
  return new Date(date).toLocaleDateString()
}

const fetchEvents = async () => {
  try {
    // Replace with actual API call
    loading.value = true
    // Simulated API response (Replace this with your actual API call)
    // Example:
    // const response = await fetch('/api/events');
    // events.value = await response.json();
    events.value = [
      {
        id: 1,
        title: 'Application Review',
        description: 'Initial review of ECPF application',
        date: '2024-01-15',
        status: 'pending',
      },
      {
        id: 2,
        title: 'Document Verification',
        description: 'Verification of submitted documents',
        date: '2024-01-16',
        status: 'completed',
      },
    ]
  } catch (error) {
    console.error('Error fetching events:', error)
  } finally {
    loading.value = false
  }
}

onMounted(fetchEvents)
</script>

<style scoped>
.ecpf-events {
  padding: 20px;
}

.events-title {
  margin-bottom: 20px;
  color: #333;
}

.event-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.event-item {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  background-color: #fff;
}

.event-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.event-status {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.9em;
}

.event-status.pending {
  background-color: #fff3cd;
  color: #856404;
}

.event-status.completed {
  background-color: #d4edda;
  color: #155724;
}

.loading,
.no-events {
  text-align: center;
  padding: 20px;
  color: #666;
}
</style>
