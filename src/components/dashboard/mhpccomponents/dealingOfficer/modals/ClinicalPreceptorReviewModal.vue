<template>
  <!-- Main modal -->
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-gray-900 bg-opacity-50"
    @click.self="close"
  >
    <div class="relative p-4 w-full max-w-2xl">
      <!-- Modal content -->
      <div class="relative bg-white rounded-lg shadow">
        <!-- Modal header -->
        <div class="flex items-start justify-between p-5 border-b rounded-t">
          <h3 class="text-xl font-semibold text-gray-900">Clinical Preceptor Details</h3>
          <button
            @click="close"
            type="button"
            class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
          >
            <!-- Close icon -->
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
          </button>
        </div>

        <!-- Loading state -->
        <div v-if="isLoading" class="p-6 text-center">
          <p class="text-gray-500">Loading details...</p>
        </div>

        <!-- Modal body -->
        <div v-else-if="preceptor" class="p-6 space-y-6">
          <!-- ... (Preceptor details grid remains the same) ... -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p class="font-semibold text-gray-500">Preceptor Name</p>
              <p class="text-gray-800">{{ preceptor.name }}</p>
            </div>
            <div>
              <p class="font-semibold text-gray-500">Registration No.</p>
              <p class="text-gray-800">{{ preceptor.reg_no || 'N/A' }}</p>
            </div>
            <div>
              <p class="font-semibold text-gray-500">CID</p>
              <p class="text-gray-800">{{ preceptor.cid }}</p>
            </div>
            <div>
              <p class="font-semibold text-gray-500">Designation</p>
              <p class="text-gray-800">{{ preceptor.designation || 'N/A' }}</p>
            </div>
            <div class="col-span-1 md:col-span-2">
              <p class="font-semibold text-gray-500">Primary Qualification</p>
              <p class="text-gray-800">{{ preceptor.qualification }}</p>
            </div>
            <div class="col-span-1 md:col-span-2">
              <p class="font-semibold text-gray-500">Teaching Center</p>
              <p class="text-gray-800">{{ preceptor.teaching_center_details?.center_name || 'N/A' }}</p>
            </div>
          </div>

          <!-- Officer Remarks -->
          <div class="border-t pt-4">
            <label for="remarks" class="block mb-2 text-sm font-medium text-gray-900">
              <!-- Change: Label text is now dynamic -->
              {{ hasExistingRemarks ? "Dealing Officer's Remarks" : "Dealing Officer's Remarks (Optional)" }}
            </label>
            <!-- Change: A single textarea is now used. It becomes disabled and styled differently when remarks exist. -->
            <textarea
              id="remarks"
              v-model="remarks"
              :disabled="hasExistingRemarks"
              rows="4"
              class="block p-2.5 w-full text-sm text-gray-900 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              :class="{
                'bg-gray-100 cursor-not-allowed text-gray-700': hasExistingRemarks,
                'bg-gray-50': !hasExistingRemarks
              }"
              placeholder="Add any comments here..."
            ></textarea>
          </div>
        </div>

        <!-- Modal footer -->
        <div v-if="!isLoading && preceptor" class="flex items-center justify-end p-6 space-x-2 border-t border-gray-200 rounded-b">
          <button @click="close" type="button" class="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10">
            Close
          </button>
          <!-- Change: The save button is now hidden with v-if if remarks exist -->
          <button
            v-if="!hasExistingRemarks"
            @click="saveRemarks"
            :disabled="isSubmitting"
            type="button"
            class="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:bg-blue-300"
          >
            {{ isSubmitting ? 'Saving...' : 'Save Remarks' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useToast } from 'vue-toastification'
import apiService from '@/services/services'

const props = defineProps({
  isOpen: Boolean,
  preceptor: Object,
  isLoading: Boolean,
})

const emit = defineEmits(['close-modal', 'preceptor-updated'])
const toast = useToast()
const isSubmitting = ref(false)
const remarks = ref('')


const hasExistingRemarks = computed(() => {
  return !!props.preceptor?.officer_remarks;
})


watch(
  () => props.preceptor,
  (newVal) => {
    if (newVal) {

      remarks.value = newVal.officer_remarks || ''
    } else {
      remarks.value = ''
    }
  },
  { immediate: true, deep: true },
)

const close = () => {
  if (isSubmitting.value) return
  emit('close-modal')
}

const saveRemarks = async () => {
  if (!props.preceptor) return

  if (!remarks.value.trim()) {
    toast.info('Remarks field is empty.');
    return;
  }

  isSubmitting.value = true
  const payload = {
    officer_remarks: remarks.value,
  }

  try {
    await apiService.patchMhpcClinicalPreceptor(props.preceptor.id, payload)
    toast.success('Remarks updated successfully.')

    emit('preceptor-updated')
  } catch (error) {
    console.error(`Error saving remarks for preceptor ${props.preceptor.id}:`, error)
    toast.error(error.response?.data?.detail || 'Failed to update remarks. Please try again.')
  } finally {
    isSubmitting.value = false
  }
}
</script>