<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center z-[60] p-4 transition-opacity duration-300"
      :class="show ? 'opacity-100' : 'opacity-0 pointer-events-none'"
    >
      <div
        class="bg-white rounded-xl shadow-xl w-full max-w-md border border-slate-200 transform transition-all duration-300"
        :class="show ? 'scale-100 opacity-100' : 'scale-95 opacity-0'"
      >
        <div
          class="flex justify-between items-center px-6 py-4 bg-slate-50 border-b border-slate-200"
        >
          <h3 class="text-lg font-semibold text-slate-800 flex items-center">
            <LockKeyhole class="w-5 h-5 mr-2 text-blue-600" />
            Change Password
          </h3>
          <button
            @click="closeModal"
            title="Close"
            class="text-slate-500 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-200"
          >
            <X size="20" />
          </button>
        </div>
        <form @submit.prevent="handleChangePassword" class="p-6 space-y-4">
          <div>
            <label for="currentPassword" class="block text-sm font-medium text-slate-700 mb-1.5"
              >Current Password</label
            >
            <input
              type="password"
              id="currentPassword"
              v-model="currentPassword"
              required
              class="form-input-field"
            />
          </div>
          <div>
            <label for="newPassword" class="block text-sm font-medium text-slate-700 mb-1.5"
              >New Password</label
            >
            <input
              type="password"
              id="newPassword"
              v-model="newPassword"
              required
              class="form-input-field"
            />
          </div>
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-slate-700 mb-1.5"
              >Confirm New Password</label
            >
            <input
              type="password"
              id="confirmPassword"
              v-model="confirmPassword"
              required
              class="form-input-field"
            />
          </div>
          <div class="pt-2 flex justify-end gap-3">
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="isSubmitting"
              class="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center disabled:opacity-50"
            >
              <LoaderCircle v-if="isSubmitting" class="animate-spin mr-2 h-4 w-4" />
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useToast } from 'vue-toastification' // If you use it
import apiService from '@/services/services' // Your API service
import { LockKeyhole, X, LoaderCircle } from 'lucide-vue-next'

const props = defineProps({ modelValue: Boolean }) // For v-if compatibility
const emit = defineEmits(['close', 'update:modelValue'])

const toast = useToast ? useToast() : { error: console.error, success: console.log }

const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const isSubmitting = ref(false)
const show = ref(props.modelValue)

watch(
  () => props.modelValue,
  (newVal) => {
    show.value = newVal
    if (newVal) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
  },
)

const closeModal = () => {
  currentPassword.value = ''
  newPassword.value = ''
  confirmPassword.value = ''
  emit('close')
  emit('update:modelValue', false) // For v-if compatibility
}

const handleChangePassword = async () => {
  if (newPassword.value !== confirmPassword.value) {
    toast.error('New passwords do not match.')
    return
  }
  if (newPassword.value.length < 8) {
    // Example validation
    toast.error('New password must be at least 8 characters long.')
    return
  }
  isSubmitting.value = true
  try {
    // Replace with your actual API call
    await apiService.changePassword({
      current_password: currentPassword.value,
      new_password: newPassword.value,
    })
    toast.success('Password changed successfully!')
    closeModal()
  } catch (error) {
    console.error('Password change error:', error)
    const errorMsg =
      error.response?.data?.detail || error.response?.data?.message || 'Failed to change password.'
    toast.error(errorMsg)
  } finally {
    isSubmitting.value = false
  }
}
</script>
<style scoped>
.form-input-field {
  @apply block w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white shadow-sm transition;
}
</style>
