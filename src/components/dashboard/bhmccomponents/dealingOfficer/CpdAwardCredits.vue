<template>
  <div class="award-credits p-6 bg-white rounded-xl">
    <h2 class="text-2xl font-bold mb-6 text-gray-900">Award CPD Credits</h2>

    <!-- Enhanced Table -->
    <div class="overflow-x-auto rounded-xl border border-gray-200">
      <table class="w-full">
        <thead>
          <tr class="bg-gray-50">
            <th class="px-6 py-4 text-sm font-semibold text-gray-700">Participant Name</th>
            <th class="px-6 py-4 text-sm font-semibold text-gray-700">Registration Number</th>
            <th class="px-6 py-4 text-sm font-semibold text-gray-700">CPD Activity</th>
            <th class="px-6 py-4 text-sm font-semibold text-gray-700">Awarded Credits</th>
            <th class="px-6 py-4 text-sm font-semibold text-gray-700">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr
            v-for="participant in participants"
            :key="participant.id"
            class="hover:bg-gray-50 transition-colors"
          >
            <td class="px-6 py-4 text-sm text-gray-900">
              {{ participant.name }}
            </td>
            <td class="px-6 py-4 text-sm text-gray-900">
              {{ participant.regNo }}
            </td>
            <td class="px-6 py-4 text-sm text-gray-900">
              {{ participant.cpdActivity }}
            </td>
            <td class="px-6 py-4 text-sm text-gray-900">
              {{ participant.awardedCredits || 0 }}
            </td>
            <td class="px-6 py-4">
              <button
                @click="openAwardModal(participant)"
                class="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium
                       bg-blue-600 text-white
                       hover:bg-blue-700
                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                       transition-colors duration-200"
              >
                <svg
                  class="w-4 h-4 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-.181h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Award Credits
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modern Award Modal -->
    <Transition name="modal-fade">
      <div v-if="isAwardModalVisible" class="fixed inset-0 z-50 flex items-center justify-center">
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
          @click="closeAwardModal"
        ></div>

        <!-- Modal -->
        <div
          class="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 m-4 transform transition-all"
          role="dialog"
          aria-labelledby="modal-title"
          @click.stop
        >
          <!-- Close button -->
          <button
            @click="closeAwardModal"
            class="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors group"
            aria-label="Close modal"
          >
            <svg
              class="w-5 h-5 text-gray-400 group-hover:text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <!-- Content -->
          <div class="mb-8">
            <h2
              id="modal-title"
              class="text-2xl font-bold text-gray-900"
            >
              Award Credits to {{ selectedParticipant?.name }}
            </h2>
            <p class="mt-2 text-sm text-gray-500">
              {{ selectedParticipant?.cpdActivity }}
            </p>
          </div>

          <!-- Form -->
          <form @submit.prevent="awardCredits" class="space-y-8">
            <div class="space-y-2">
              <label
                for="credits"
                class="block text-sm font-medium text-gray-700"
              >
                Number of Credits
              </label>
              <div class="relative">
                <input
                  id="credits"
                  v-model.number="creditScore"
                  type="number"
                  step="0.5"
                  min="0"
                  required
                  class="block w-full px-4 py-3 rounded-xl border-2 bg-transparent
                         focus:ring-2 focus:ring-offset-2 focus:outline-none
                         placeholder-gray-400
                         [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
                         border-gray-200 hover:border-gray-300 focus:border-blue-500"
                  placeholder="0.0"
                >
                <div class="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                  credits
                </div>
              </div>
            </div>

            <!-- Buttons -->
            <div class="flex gap-4">
              <button
                type="button"
                @click="closeAwardModal"
                class="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200
                       text-gray-700 font-medium
                       hover:bg-gray-50
                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500
                       transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="flex-1 px-4 py-3 rounded-xl bg-blue-600 text-white font-medium
                       hover:bg-blue-700
                       focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                       transition-all duration-200"
              >
                Award Credits
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Reactive state
const participants = ref([
{ id: 1, name: 'John Doe', regNo: 'PMLT123', cpdActivity: 'Microbiology Workshop', awardedCredits: 0 },
{ id: 2, name: 'Jane Smith', regNo: 'PMLT456', cpdActivity: 'ISO Standards Seminar', awardedCredits: 0 },
])

const selectedParticipant = ref(null)
const isAwardModalVisible = ref(false)
const creditScore = ref(0)

// Methods
const openAwardModal = (participant) => {
selectedParticipant.value = participant
isAwardModalVisible.value = true
creditScore.value = 0
}

const closeAwardModal = () => {
isAwardModalVisible.value = false
setTimeout(() => {
  selectedParticipant.value = null
  creditScore.value = 0
}, 300)
}

const awardCredits = () => {
if (creditScore.value <= 0) return

// Update the participant's awarded credits
const participantIndex = participants.value.findIndex(p => p.id === selectedParticipant.value.id)
if (participantIndex !== -1) {
  participants.value[participantIndex].awardedCredits += creditScore.value
}

console.log(`Awarded ${creditScore.value} credits to ${selectedParticipant.value.name}`)
closeAwardModal()
}
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>\