<template>
  <div class="mass-media-event">
    <h2>Mass Media Event Management</h2>
    <div class="event-form">
      <v-form @submit.prevent="handleSubmit">
        <v-text-field
          v-model="event.title"
          label="Event Title"
          required
        ></v-text-field>
        <v-textarea
          v-model="event.description"
          label="Event Description"
          rows="4"
        ></v-textarea>
        <v-menu
          v-model="dateMenu"
          :close-on-content-click="false"
          transition="scale-transition"
        >
          <template v-slot:activator="{ props }">
            <v-text-field
              v-model="event.date"
              label="Event Date"
              readonly
              v-bind="props"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="event.date"
            @input="dateMenu = false"
          ></v-date-picker>
        </v-menu>
        <v-btn type="submit" color="primary">Submit Event</v-btn>
      </v-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MassMediaEvent',
  data() {
    return {
      dateMenu: false,
      event: {
        title: '',
        description: '',
        date: '',
      },
    }
  },
  methods: {
    handleSubmit() {
      // Handle form submission
      console.log('Event submitted:', this.event)
      // Add your API call or data handling logic here
    },
  },
}
</script>

<style scoped>
.mass-media-event {
  padding: 20px;
}

.event-form {
  max-width: 600px;
  margin: 20px auto;
}
</style>
