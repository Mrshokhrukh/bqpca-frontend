<template>
  <div class="award-credits p-6 bg-white rounded-xl">
    <h2 class="text-2xl font-bold mb-6 text-gray-900">Award CPD Credits</h2>

    <!-- Enhanced Table -->
    <div class="overflow-x-auto rounded-xl border border-gray-200 shadow-sm"> <!-- Added shadow-sm -->
      <table class="min-w-full divide-y divide-gray-200"> <!-- Use min-w-full -->
        <thead class="bg-gray-100"> <!-- Slightly darker background -->
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Participant Name
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Registration Number
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              CPD Activity
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Awarded Credits
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="participant in participants" :key="participant.id" class="hover:bg-gray-50 transition-colors">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ participant.fullName }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ participant.registrationNumber }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ participant.cpdTitle }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {{ participant.cpdCredits || 0 }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap"> <!-- Added whitespace-nowrap -->
              <button @click="openAwardModal(participant)" class="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium
                       bg-blue-600 text-white
                       hover:bg-blue-700
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50  <!-- Improved focus ring -->
                       transition-colors duration-200">
                <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-.181h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Award Credits
              </button>
            </td>
          </tr>
          <!-- Loading State -->
          <tr v-if="isLoading">
            <td colspan="5" class="text-center py-4">Loading participants...</td>
          </tr>
          <!-- No Data Message -->
          <tr v-if="!isLoading && participants.length === 0">
            <td colspan="5" class="text-center py-4">No participants found.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modern Award Modal -->
    <!-- Enhanced Award Modal -->
    <Transition name="modal-fade">
      <div v-if="isAwardModalVisible" class="fixed inset-0 z-50 flex items-center justify-center">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" @click="closeAwardModal"></div>

        <!-- Modal -->
        <div
          class="relative w-full max-w-4xl bg-white rounded-lg shadow-md p-8 m-4 transform transition-all overflow-y-auto max-h-[90vh]"
          role="dialog" aria-labelledby="modal-title" @click.stop>

          <!-- Header with close button and status -->
          <div class="flex justify-between items-center mb-6">
            <div class="flex items-center gap-3">
              <div class="text-gray-700">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h2 id="modal-title" class="text-xl font-semibold text-gray-900">
                  CPD Application Details
                </h2>
                <p class="text-sm text-gray-500">Review and manage CPD application information</p>
              </div>
            </div>

            <!-- Status indicator -->
            <div class="flex items-center gap-2">
              <div v-if="selectedParticipant?.reviewStatus"
                class="px-3 py-1 rounded-full flex items-center gap-2 text-sm" :class="{
                  'bg-green-100 text-green-800': selectedParticipant?.reviewStatus === 'Approved',
                  'bg-yellow-100 text-yellow-800': selectedParticipant?.reviewStatus === 'Pending',
                  'bg-red-100 text-red-800': selectedParticipant?.reviewStatus === 'Rejected'
                }">
                <span v-if="selectedParticipant?.reviewStatus === 'Approved'"
                  class="w-2 h-2 bg-green-500 rounded-full"></span>
                <span v-else-if="selectedParticipant?.reviewStatus === 'Pending'"
                  class="w-2 h-2 bg-yellow-500 rounded-full"></span>
                <span v-else class="w-2 h-2 bg-red-500 rounded-full"></span>
                {{ selectedParticipant?.reviewStatus }}
              </div>

              <!-- Close button -->
              <button @click="closeAwardModal" class="text-gray-400 hover:text-gray-600">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Content Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">

            <!-- Left Column -->
            <div class="space-y-8">
              <!-- Personal Information -->
              <div class="bg-gray-50 rounded-lg p-6">
                <div class="flex items-center gap-2 mb-4">
                  <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <h3 class="text-lg font-medium text-gray-900">Personal Information</h3>
                </div>

                <div class="space-y-4">
                  <div>
                    <div class="flex items-center gap-2 mb-1">
                      <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" stroke-width="2" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3" />
                      </svg>
                      <span class="text-sm font-medium text-gray-500">Registration Number</span>
                    </div>
                    <p class="text-gray-900 ml-6">{{ selectedParticipant?.registrationNumber }}</p>
                  </div>

                  <div>
                    <div class="flex items-center gap-2 mb-1">
                      <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                      </svg>
                      <span class="text-sm font-medium text-gray-500">CID/Identity Number</span>
                    </div>
                    <p class="text-gray-900 ml-6">{{ selectedParticipant?.cidNumber }}</p>
                  </div>

                  <div>
                    <div class="flex items-center gap-2 mb-1">
                      <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span class="text-sm font-medium text-gray-500">Full Name</span>
                    </div>
                    <p class="text-gray-900 ml-6">{{ selectedParticipant?.fullName }}</p>
                  </div>

                  <div>
                    <div class="flex items-center gap-2 mb-1">
                      <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span class="text-sm font-medium text-gray-500">Gender</span>
                    </div>
                    <p class="text-gray-900 ml-6">{{ selectedParticipant?.gender }}</p>
                  </div>
                </div>
              </div>

              <!-- Attachment -->
              <div class="bg-gray-50 rounded-lg p-6">
                <div class="flex items-center gap-2 mb-4">
                  <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                  <h3 class="text-lg font-medium text-gray-900">Attachment</h3>
                </div>

                <div v-if="selectedParticipant?.attachment"
                  class="p-4 bg-gray-100 rounded-lg flex items-center justify-between">
                  <div class="flex items-start gap-3">
                    <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span class="text-sm text-gray-600 break-all">
                      {{ selectedParticipant.attachment.url.split('/').pop() }}
                    </span>
                  </div>
                  <a :href="selectedParticipant.attachment.url" target="_blank"
                    class="text-sm text-blue-600 hover:text-blue-800 whitespace-nowrap">
                    View Document
                  </a>
                </div>
                <div v-else class="text-sm text-gray-500">No attachment available</div>
              </div>
            </div>

            <!-- Right Column -->
            <div class="space-y-8">
              <!-- CPD Details -->
              <div class="bg-gray-50 rounded-lg p-6">
                <div class="flex items-center gap-2 mb-4">
                  <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 class="text-lg font-medium text-gray-900">CPD Details</h3>
                </div>

                <div class="space-y-4">
                  <div>
                    <div class="flex items-center gap-2 mb-1">
                      <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span class="text-sm font-medium text-gray-500">Title of CPD</span>
                    </div>
                    <p class="text-gray-900 ml-6">{{ selectedParticipant?.cpdTitle }}</p>
                  </div>

                  <div>
                    <div class="flex items-center gap-2 mb-1">
                      <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span class="text-sm font-medium text-gray-500">Relevance to Profession</span>
                    </div>
                    <p class="text-gray-900 ml-6">{{ selectedParticipant?.relevance }}</p>
                  </div>

                  <div>
                    <div class="flex items-center gap-2 mb-1">
                      <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span class="text-sm font-medium text-gray-500">Participation Category</span>
                    </div>
                    <p class="text-gray-900 ml-6">{{ selectedParticipant?.participationCategory }}</p>
                  </div>

                  <div>
                    <div class="flex items-center gap-2 mb-1">
                      <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span class="text-sm font-medium text-gray-500">Participant Sub-category</span>
                    </div>
                    <p class="text-gray-900 ml-6">{{ selectedParticipant?.participantSubCategory }}</p>
                  </div>

                  <div>
                    <div class="flex items-center gap-2 mb-1">
                      <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                      </svg>
                      <span class="text-sm font-medium text-gray-500">Type of CPD Activity</span>
                    </div>
                    <p class="text-gray-900 ml-6">{{ selectedParticipant?.activityType }}</p>
                  </div>
                </div>
              </div>

              <!-- Review Details -->
              <div class="bg-gray-50 rounded-lg p-6">
                <div class="flex items-center gap-2 mb-4">
                  <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <h3 class="text-lg font-medium text-gray-900">Review Details</h3>
                </div>

                <div class="space-y-4">
                  <div>
                    <div class="flex items-center gap-2 mb-1">
                      <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span class="text-sm font-medium text-gray-500">CPD Credits</span>
                    </div>
                    <p class="text-gray-900 ml-6">{{ selectedParticipant?.cpdCredits || 0 }}</p>
                  </div>

                  <div>
                    <div class="flex items-center gap-2 mb-1">
                      <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                      </svg>
                      <span class="text-sm font-medium text-gray-500">Remarks</span>
                    </div>
                    <p class="text-gray-900 ml-6">{{ selectedParticipant?.remarks || 'No remarks' }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Award Credits Section -->
          <div class="mt-8 pt-6 border-t border-gray-200">
            <div class="flex justify-between items-center mb-4">
              <div class="flex items-center gap-2">
                <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 class="text-lg font-medium text-gray-900">Award Credits</h3>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label for="credits" class="block text-sm font-medium text-gray-700 mb-2">
                  Number of Credits to Award
                </label>
                <div class="relative">
                  <input id="credits" v-model.number="creditScore" type="number" step="0.5" min="0" required
                    class="block w-full px-4 py-2 rounded-md border border-gray-300 bg-white shadow-sm 
                focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" placeholder="0.0">
                </div>
                <div v-if="creditError" class="mt-1 text-red-500 text-sm">
                  {{ creditError }}
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex justify-end gap-4">
              <button type="button" @click="closeAwardModal" class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Close
              </button>

              <button @click="awardCredits" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Edit Credits
              </button>
            </div>
          </div>

        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import apiServices from '@/services/services';

const participants = ref([])
const selectedParticipant = ref(null)
const isAwardModalVisible = ref(false)
const creditScore = ref(0)
const isLoading = ref(false);
const creditError = ref('');

// Methods
const openAwardModal = (participant) => {
  selectedParticipant.value = participant;
  isAwardModalVisible.value = true;
  creditScore.value = 0; // Reset credit score
  creditError.value = ''; // Reset any previous errors
};

const closeAwardModal = () => {
  isAwardModalVisible.value = false;
  // Reset after the modal transition
  setTimeout(() => {
    selectedParticipant.value = null;
    creditScore.value = 0;
  }, 300);
};


const awardCredits = () => {
  creditError.value = ''; // Clear any previous error
  if (creditScore.value <= 0) {
    creditError.value = "Please enter a valid credit score greater than 0.";
    return; // Prevent awarding non-positive credits
  }
  if (!selectedParticipant.value || selectedParticipant.value.id === undefined) {
    console.error("Selected participant is invalid or has no ID.");
    return; // Exit if no participant is selected or ID is missing
  }

  const updatedCredits = (selectedParticipant.value.cpdCredits || 0) + creditScore.value;

  // Prepare the updated data object
  const updatedData = {
    cpd_credit: updatedCredits,
    // Include other fields that *might* be updated by this action, if any
    // For example, if approving also updates the status:
    // review_status: "Approved",
  };


  // Make the API call to update the participant's credits
  apiServices.patchBmhcCpdRecord(selectedParticipant.value.id, updatedData)
    .then(response => {

      const participantIndex = participants.value.findIndex(p => p.id === selectedParticipant.value.id);
      if (participantIndex !== -1) {

        participants.value.splice(participantIndex, 1, response.data); // Use the API response
      }
      console.log(`Awarded ${creditScore.value} credits to ${selectedParticipant.value.fullName}`);
      closeAwardModal(); // Close the modal after successful update
    })
    .catch(error => {
      console.error("Error updating CPD credits:", error);
      // Display error to user here
    });
};

onMounted(async () => {
  isLoading.value = true;
  try {
    const response = await apiServices.getBmhcCpdRecords();
    console.log("API Response:", response);

    if (response && response.data && response.data.results) {
      participants.value = response.data.results.map(item => ({
        id: item.id,
        fullName: item.full_name,
        registrationNumber: item.registration_no,
        cpdTitle: item.title_of_cpd,
        cpdCredits: item.cpd_credit, // Existing credits
        // Add any other fields you need in the table
        cidNumber: item.cid_no,
        gender: item.gender,
        relevance: item.relevance_to_profession,
        participationCategory: item.participation_category?.participation_category_name,
        participantSubCategory: item.participant_sub_category?.participation_sub_category_name,
        activityType: item.type_of_cpd_activity?.cpd_activity_name,
        attachment: item.attachment ? { url: item.attachment } : null,
        reviewStatus: item.review_status,
        remarks: item.remark,
      }));
    } else {
      console.error('Error fetching CPD records: Unexpected response format', response);
      participants.value = [];
    }
  } catch (error) {
    console.error('Error fetching CPD records:', error);
    participants.value = [];
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
/* Modal Animation (Keep this) */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>