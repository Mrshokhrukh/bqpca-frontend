<template>
  <TransitionRoot appear :show="!!staff" as="template">
    <Dialog as="div" @close="$emit('close')" class="relative z-50">
      <!-- Backdrop with improved blur effect -->
      <TransitionChild
        as="template"
        enter="transition duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="transition duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-black/60 backdrop-blur-md" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4">
          <TransitionChild
            as="template"
            enter="transition duration-300 ease-out"
            enter-from="opacity-0 scale-95 translate-y-4"
            enter-to="opacity-100 scale-100 translate-y-0"
            leave="transition duration-200 ease-in"
            leave-from="opacity-100 scale-100 translate-y-0"
            leave-to="opacity-0 scale-95 translate-y-4"
          >
            <DialogPanel
              class="w-full max-w-lg transform overflow-hidden rounded-xl bg-white shadow-2xl transition-all"
            >
              <!-- Header with improved styling -->
              <div class="relative px-6 py-5 border-b border-gray-100">
                <DialogTitle as="h3" class="text-xl font-semibold text-gray-900">
                  {{ modalTitle }}
                </DialogTitle>
                <button
                  @click="$emit('close')"
                  class="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <!-- Modal body with form fields -->
              <div class="px-6 py-5 space-y-5">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <!-- Name field -->
                  <div class="col-span-1 md:col-span-2">
                    <label for="staff-name" class="block text-sm font-medium text-gray-700 mb-1"
                      >Full Name</label
                    >
                    <input
                      type="text"
                      id="staff-name"
                      v-model="internalStaff.name"
                      class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-colors"
                      :class="{ 'bg-gray-50': isViewMode }"
                      :readonly="isViewMode"
                      placeholder="Enter staff member's full name"
                    />
                  </div>

                  <!-- Two columns for smaller fields -->
                  <div>
                    <label for="designation" class="block text-sm font-medium text-gray-700 mb-1"
                      >Designation</label
                    >
                    <input
                      type="text"
                      id="designation"
                      v-model="internalStaff.designation"
                      class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-colors"
                      :class="{ 'bg-gray-50': isViewMode }"
                      :readonly="isViewMode"
                      placeholder="Job title"
                    />
                  </div>

                  <div>
                    <label for="department" class="block text-sm font-medium text-gray-700 mb-1"
                      >Department</label
                    >
                    <input
                      type="text"
                      id="department"
                      v-model="internalStaff.department"
                      class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-colors"
                      :class="{ 'bg-gray-50': isViewMode }"
                      :readonly="isViewMode"
                      placeholder="Department name"
                    />
                  </div>

                  <!-- Contact information -->
                  <div>
                    <label for="email" class="block text-sm font-medium text-gray-700 mb-1">
                      <span class="flex items-center gap-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                        Email
                      </span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      v-model="internalStaff.email"
                      class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-colors"
                      :class="{ 'bg-gray-50': isViewMode }"
                      :readonly="isViewMode"
                      placeholder="email@example.com"
                    />
                  </div>

                  <div>
                    <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">
                      <span class="flex items-center gap-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                        Phone
                      </span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      v-model="internalStaff.phone"
                      class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-colors"
                      :class="{ 'bg-gray-50': isViewMode }"
                      :readonly="isViewMode"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>

                  <!-- Full width for qualifications -->
                  <div class="col-span-1 md:col-span-2">
                    <label for="qualifications" class="block text-sm font-medium text-gray-700 mb-1"
                      >Qualifications</label
                    >
                    <textarea
                      id="qualifications"
                      v-model="internalStaff.qualifications"
                      rows="3"
                      class="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-colors"
                      :class="{ 'bg-gray-50': isViewMode }"
                      :readonly="isViewMode"
                      placeholder="Education, certifications, and relevant qualifications"
                    ></textarea>
                  </div>
                </div>
              </div>

              <!-- Footer with gradient buttons -->
              <div class="bg-gray-50 px-6 py-4 flex flex-col-reverse sm:flex-row gap-3 justify-end">
                <button
                  v-if="!isViewMode"
                  @click="submitStaff"
                  class="w-full sm:w-auto px-5 py-2.5 rounded-lg font-medium text-white bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all shadow-sm"
                >
                  {{ submitButtonText }}
                </button>
                <button
                  @click="$emit('close')"
                  class="w-full sm:w-auto px-5 py-2.5 rounded-lg font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
                >
                  {{ isViewMode ? 'Close' : 'Cancel' }}
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup>
import { Dialog, DialogPanel, DialogTitle, TransitionRoot, TransitionChild } from '@headlessui/vue'
import { ref, computed, watch } from 'vue'

const props = defineProps({
  staff: {
    type: Object,
    default: null,
  },
  mode: {
    // 'add', 'edit', 'view'
    type: String,
    default: 'view',
  },
})

const emit = defineEmits(['close', 'staff-updated', 'staff-added'])

// Create a deep copy to avoid mutation of props
const internalStaff = ref(
  props.staff
    ? { ...props.staff }
    : {
        name: '',
        designation: '',
        department: '',
        email: '',
        phone: '',
        qualifications: '',
      },
)

// Watch for changes in the staff prop and update the internal state
watch(
  () => props.staff,
  (newStaff) => {
    if (newStaff) {
      internalStaff.value = { ...newStaff }
    }
  },
  { deep: true, immediate: true },
)

// Computed properties for UI state
const isViewMode = computed(() => props.mode === 'view')
const modalTitle = computed(() => {
  switch (props.mode) {
    case 'add':
      return '✨ Add New Staff Member'
    case 'edit':
      return '✏️ Edit Staff Member'
    default:
      return '👤 Staff Details'
  }
})
const submitButtonText = computed(() => (props.mode === 'add' ? 'Add Staff' : 'Save Changes'))

// Form submission handler
const submitStaff = () => {
  if (props.mode === 'add') {
    emit('staff-added', { ...internalStaff.value })
  } else if (props.mode === 'edit') {
    emit('staff-updated', { ...internalStaff.value })
  }
  emit('close')
}
</script>
