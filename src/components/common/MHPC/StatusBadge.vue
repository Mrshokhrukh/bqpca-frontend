<template>
  <span
    :class="['px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full', badgeClass]"
  >
    {{ status || 'N/A' }}
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  status: String,
})

const badgeClass = computed(() => {
  switch (props.status) {
    case 'Approved':
      return 'bg-green-100 text-green-800'
    case 'Pending':
      return 'bg-amber-100 text-amber-800'
    case 'Regret':
    case 'Rejected':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-slate-100 text-slate-800'
  }
})
</script>
