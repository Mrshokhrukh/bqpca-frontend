<template>
  <teleport to="body">
    <transition name="modal">
      <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-lg p-6 max-w-md w-full">
          <div class="mb-4">
            <h3 class="text-lg font-semibold">Confirm Registration Type</h3>
            <p class="text-gray-600 mt-2">You selected: {{ selectedType }}</p>
          </div>

          <div class="flex justify-end gap-3">
            <button
              class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              @click="$emit('close')"
            >
              Cancel
            </button>
            <button
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              @click="$emit('proceed')"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
defineProps({
  show: Boolean,
  selectedType: String
});

defineEmits(['close', 'proceed']);
</script>

<style>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
