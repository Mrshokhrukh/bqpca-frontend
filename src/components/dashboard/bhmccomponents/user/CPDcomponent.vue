<template>
  <div class="min-h-screen w-full flex items-center justify-center ">
    <div class="w-full max-w-5xl">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          v-for="(card, index) in cards"
          :key="index"
          class="h-48 p-6 bg-white shadow-md rounded-lg hover:shadow-lg transition-shadow cursor-pointer flex flex-col justify-center"
          @click="openDialog(card)"
        >
          <h2 class="text-xl font-semibold text-gray-800">{{ card.title }}</h2>
          <p class="mt-2 text-gray-600">{{ card.description }}</p>
        </div>
      </div>
    </div>

    <!-- Dialog -->
    <div v-if="isDialogOpen" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white p-6 rounded-lg shadow-lg w-1/2">
        <component :is="selectedComponent" />
        <button
          class="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg"
          @click="closeDialog"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import CPD_Online from './CPDonline.vue'
import CPD_PutUP from './CPDputUp.vue'
import CPD_Issuied from './CPDissueed.vue'

// Map card titles to their respective components
const componentMap = {
  'CPD Online': CPD_Online,
  'CPD Putup': CPD_PutUP,
  'CPD Issued': CPD_Issuied
}

// Data for cards
const cards = ref([
  { title: 'CPD Online', description: 'Access online CPD resources.' },
  { title: 'CPD Putup', description: 'Manage CPD submissions.' },
  { title: 'CPD Issued', description: 'View issued CPDs.' }
])

// State for dialog and selected component
const isDialogOpen = ref(false)
const selectedComponent = ref(null)

// Open the dialog and set the selected component
const openDialog = (card) => {
  selectedComponent.value = componentMap[card.title] || null
  isDialogOpen.value = true
}

// Close the dialog
const closeDialog = () => {
  isDialogOpen.value = false
  selectedComponent.value = null
}
</script>

<style scoped>
/* Any custom styles can go here if needed */
</style>
