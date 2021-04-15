<template>
  <main class="flex-1 overflow-auto bg-slate-50 p-6 min-h-auto" style="overflow-y: auto">
    <router-view />
  </main>

  <!-- Footer -->
  <footer class="bg-white border-t border-slate-200 px-6 py-4">
    <p class="text-sm text-slate-600 text-center">
      © {{ currentYear }} Bhutan Qualifications & Professional Certification Authority. All rights
      reserved.
    </p>
  </footer>
</template>

<script setup>
defineProps({
  currentYear: Number,
})
</script>
