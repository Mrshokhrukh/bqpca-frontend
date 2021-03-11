<template>
    <div v-if="isOpen" class="fixed z-50 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <!-- Background overlay -->
        <div
          class="fixed inset-0 bg-slate-900/75 transition-opacity backdrop-blur-sm"
          aria-hidden="true"
          @click="close"
        ></div>

        <!-- Modal positioning helper -->
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&nbsp;</span>

        <!-- Modal panel -->
        <div class="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <!-- Modal header -->
          <div class="bg-white px-6 pt-6 pb-0">
            <div class="flex items-start justify-between">
              <h3 class="text-xl font-semibold text-slate-900" id="modal-title">
                Report Details
              </h3>
              <button
                @click="close"
                class="text-slate-400 hover:text-slate-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-lg"
              >
                <span class="sr-only">Close</span>
                <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <!-- Modal content -->
          <div class="px-6 py-5">
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <!-- Name -->
              <div class="space-y-2">
                <label class="text-sm font-medium text-slate-700">Name</label>
                <p class="text-sm text-slate-900 bg-slate-50 rounded-lg px-4 py-2.5">
                  {{ report.name }}
                </p>
              </div>

              <!-- Type -->
              <div class="space-y-2">
                <label class="text-sm font-medium text-slate-700">Type</label>
                <p class="text-sm text-slate-900 bg-slate-50 rounded-lg px-4 py-2.5">
                  {{ report.type }}
                </p>
              </div>

              <!-- Details -->
              <div class="sm:col-span-2 space-y-2">
                <label class="text-sm font-medium text-slate-700">Details</label>
                <p class="text-sm text-slate-900 bg-slate-50 rounded-lg px-4 py-2.5 min-h-[100px]">
                  {{ report.details }}
                </p>
              </div>
            </div>
          </div>

          <!-- Modal footer -->
          <div class="bg-slate-50 px-6 py-4 flex justify-end">
            <button
              type="button"
              class="inline-flex items-center px-4 py-2 border border-slate-300 rounded-lg shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              @click="close"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>

  <script setup>

  defineProps({
    isOpen: Boolean,
    report: {
      type: Object,
      default: () => ({})
    }
  });

  const emit = defineEmits(['close']);

  const close = () => {
    emit('close');
  };
  </script>
