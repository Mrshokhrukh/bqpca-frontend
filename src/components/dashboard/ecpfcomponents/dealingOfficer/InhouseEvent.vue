<template>
  <div class="inhouse-event">
    <h2>Inhouse Event</h2>
    <div class="event-container">
      <div class="event-form">
        <el-form :model="eventForm" label-width="120px">
          <el-form-item label="Event Title">
            <el-input v-model="eventForm.title" placeholder="Enter event title"></el-input>
          </el-form-item>
          <el-form-item label="Event Date">
            <el-date-picker v-model="eventForm.date" type="date" placeholder="Select date"></el-date-picker>
          </el-form-item>
          <el-form-item label="Description">
            <el-input type="textarea" v-model="eventForm.description" placeholder="Enter event description"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitEvent">Submit</el-button>
          </el-form-item>
        </el-form>
      </div>

      <div class="event-list">
        <h3>Upcoming Events</h3>
        <el-table :data="events" style="width: 100%">
          <el-table-column prop="title" label="Title"></el-table-column>
          <el-table-column prop="date" label="Date"></el-table-column>
          <el-table-column prop="description" label="Description"></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InhouseEvent',
  data() {
    return {
      eventForm: {
        title: '',
        date: '',
        description: ''
      },
      events: []
    }
  },
  methods: {
    submitEvent() {
      // Handle event submission
      const newEvent = {
        title: this.eventForm.title,
        date: this.eventForm.date,
        description: this.eventForm.description
      }
      this.events.push(newEvent)
      // Reset form
      this.eventForm = {
        title: '',
        date: '',
        description: ''
      }
    }
  }
}
</script>

<style scoped>
.inhouse-event {
  padding: 20px;
}

.event-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.event-form {
  max-width: 600px;
  margin: 0 auto;
}

.event-list {
  margin-top: 20px;
}
</style>
