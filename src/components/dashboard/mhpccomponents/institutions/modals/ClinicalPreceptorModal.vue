<template>
  <div
    class="bg-white rounded-lg shadow-xl p-6 w-full max-w-3xl transform transition-all sm:my-8 sm:align-middle flex flex-col max-h-[90vh]"
  >
    <div class="flex-shrink-0 flex justify-between items-center pb-3 border-b border-gray-200">
      <h3 class="text-xl font-semibold text-gray-800">Add Clinical Preceptors</h3>
      <button
        @click="close"
        class="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
      >
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          ></path>
        </svg>
      </button>
    </div>

    <form @submit.prevent="submitPreceptors" class="mt-6 flex-grow flex flex-col overflow-hidden">
      <div class="flex-grow overflow-y-auto pr-2 space-y-6">
        <div>
          <label for="searchProfessional" class="block text-sm font-medium text-gray-700 mb-1">
            Search & Select Professionals <span class="text-red-500">*</span>
          </label>
          <input
            type="text"
            v-model="searchQuery"
            id="searchProfessional"
            placeholder="Search by name or registration number..."
            class="mt-1 block w-full px-3 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div
          class="border border-gray-300 rounded-lg max-h-64 overflow-y-auto"
          :class="{ 'border-red-500': selectedProfessionalSystemIds.length === 0 && formAttempted }"
        >
          <div v-if="isLoadingProfessionals" class="text-center p-4 text-gray-500">
            Loading professionals...
          </div>
          <div v-else-if="filteredProfessionals.length > 0">
            <label
              v-for="prof in filteredProfessionals"
              :key="prof.system_id"
              class="flex items-center p-3 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 cursor-pointer"
            >
              <input
                type="checkbox"
                :value="prof.system_id"
                v-model="selectedProfessionalSystemIds"
                class="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <span class="ml-3 text-sm text-gray-800">
                <span class="font-medium">{{ prof.full_name }}</span> -
                <span class="text-gray-600">{{ prof.registration_no }}</span>
                <span class="block text-xs text-gray-500">{{ prof.qualification }}</span>
              </span>
            </label>
          </div>
          <div v-else class="text-center p-4 text-gray-500 text-sm">
            No eligible professionals found matching your search.
          </div>
        </div>
        <p v-if="selectedProfessionalSystemIds.length === 0 && formAttempted" class="mt-1 text-xs text-red-500">
          At least one professional must be selected.
        </p>

        <div v-if="selectedProfessionalsDetails.length > 0">
          <h4 class="text-sm font-semibold text-gray-700 mb-2">Selected Professionals:</h4>
          <div class="space-y-2 max-h-40 overflow-y-auto bg-gray-50 p-3 rounded-md border">
            <div v-for="prof in selectedProfessionalsDetails" :key="prof.system_id" class="text-sm text-gray-800 p-1.5 bg-white rounded border border-gray-200">
              {{ prof.full_name }} ({{ prof.registration_no }})
            </div>
          </div>
        </div>
      </div>

      <div class="flex-shrink-0 pt-6 mt-4 flex justify-end space-x-3 border-t border-gray-200">
        <button
          type="button"
          @click="close"
          class="px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          :disabled="isSubmitting || isLoadingProfessionals || selectedProfessionalSystemIds.length === 0"
          class="px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-md hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 flex items-center"
        >
          <svg
            v-if="isSubmitting"
            class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            ></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
          </svg>
          {{ isSubmitting ? 'Submitting...' : `Add ${selectedProfessionalSystemIds.length} Preceptor(s)` }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import apiServices from '@/services/services'
import { useToast } from 'vue-toastification'

const props = defineProps({
  applicationId: {
    type: [String, Number],
    required: true,
  },
  existingPreceptorIds: {
    type: Array,
    default: () => [],
  },
})
const emit = defineEmits(['close', 'submit-success'])
const toast = useToast()

const selectedProfessionalSystemIds = ref([])
const isLoadingProfessionals = ref(false)
const initialLoadDone = ref(false)
const formAttempted = ref(false)
const isSubmitting = ref(false)
const searchQuery = ref('')
const eligibleProfessionalsList = ref([])

const filteredProfessionals = computed(() => {
  if (!searchQuery.value) {
    return eligibleProfessionalsList.value
  }
  const lowerCaseQuery = searchQuery.value.toLowerCase()
  return eligibleProfessionalsList.value.filter(prof => 
    prof.full_name.toLowerCase().includes(lowerCaseQuery) ||
    prof.registration_no.toLowerCase().includes(lowerCaseQuery)
  )
})

const selectedProfessionalsDetails = computed(() => {
  if (selectedProfessionalSystemIds.value.length === 0) return []
  return eligibleProfessionalsList.value.filter(p =>
    selectedProfessionalSystemIds.value.includes(p.system_id)
  )
})

// const fetchEligibleProfessionals = async () => {
//   isLoadingProfessionals.value = true
//   initialLoadDone.value = false
//   try {
//     const response = await apiServices.getEligiblePreceptors()
//     const rawProfessionals = response.data || []
//     console.log(rawProfessionals);
    

//     if (!Array.isArray(rawProfessionals)) {
//       eligibleProfessionalsList.value = []
//     } else {
//       eligibleProfessionalsList.value = rawProfessionals
//         .filter(prof => !props.existingPreceptorIds.includes(prof.id))
//         .map((prof) => ({
//           system_id: prof.id,
//           registration_no: prof.registration_no || 'N/A',
//           cid_no: prof.cid_no || 'N/A',
//           full_name: prof.full_name || 'Unknown Professional',
//           qualification: prof.qualification || 'N/A',
//         }))
//     }
//   } catch (error) {
//     console.error('Error fetching professionals list:', error.response?.data || error.message)
//     toast.error('Could not load professionals list. Please try again.')
//     eligibleProfessionalsList.value = []
//   } finally {
//     isLoadingProfessionals.value = false
//     initialLoadDone.value = true
//     if (eligibleProfessionalsList.value.length === 0) {
//       toast.info('No new eligible professionals were found to add.')
//     }
//   }
// }




//filtering after getting the application 
const fetchEligibleProfessionals = async () => {
  isLoadingProfessionals.value = true
  initialLoadDone.value = false
  try {
    // Fetch all applicants (use your actual API call)
    const response = await apiServices.getMhpcNewApplications()
    const rawApplicants = response.data?.results || []

        // const response1 = await apiServices.getEligiblePreceptors()
        // console.log("============");
        
        // console.log(response1);
        


    // Filter: Only applicants with a primary qualification that is Approved
    const approvedApplicants = rawApplicants.filter(app => {
      const primary = app.user_qualifications?.find(q => q.is_primary_qualification)
      return primary && primary.endorsement_decision === 'Approved'
    })

    // Map to the format needed for your UI
    eligibleProfessionalsList.value = approvedApplicants.map(app => {
      const primary = app.user_qualifications.find(q => q.is_primary_qualification)
      return {
        system_id: app.id,
        registration_no: app.registration_no || 'N/A',
        cid_no: app.cid_no || 'N/A',
        full_name: app.full_name || 'Unknown Professional',
        qualification: primary
          ? `${primary.qualification_type_display || ''} ${primary.qualification_name_display || ''}`.trim()
          : 'N/A',
      }
    })
  } catch (error) {
    console.error('Error fetching professionals list:', error.response?.data || error.message)
    toast.error('Could not load professionals list. Please try again.')
    eligibleProfessionalsList.value = []
  } finally {
    isLoadingProfessionals.value = false
    initialLoadDone.value = true
    if (eligibleProfessionalsList.value.length === 0) {
      toast.info('No new eligible professionals were found to add.')
    }
  }
}

onMounted(() => {
  fetchEligibleProfessionals()
})

const resetForm = () => {
  selectedProfessionalSystemIds.value = []
  searchQuery.value = ''
  formAttempted.value = false
}

const close = () => {
  emit('close')
}

const submitPreceptors = async () => {
  formAttempted.value = true
  if (selectedProfessionalSystemIds.value.length === 0) {
    toast.error('Please select at least one eligible professional.')
    return
  }

  isSubmitting.value = true
  const preceptorPromises = selectedProfessionalSystemIds.value.map(profId => {
    const preceptorData = {
      teaching_center: props.applicationId,
      application: profId,
    }
    console.log(preceptorData);
    
    return apiServices.createMhpcClinicalPreceptor(preceptorData)
  })

  const results = await Promise.allSettled(preceptorPromises)
  
  const successes = results.filter(r => r.status === 'fulfilled')
  const failures = results.filter(r => r.status === 'rejected')

  if (successes.length > 0) {
    toast.success(`Successfully added ${successes.length} clinical preceptor(s).`)
    emit('submit-success')
    resetForm()
    close()
  }

  if (failures.length > 0) {
    toast.error(`Failed to add ${failures.length} preceptor(s). Please check the console for details.`)
    console.error("Failed preceptor submissions:", failures.map(f => f.reason))
  }

  isSubmitting.value = false
}
</script>

<style scoped>
select:disabled,
input:read-only {
  background-color: #f3f4f6;
  cursor: not-allowed;
}
</style>