<template>
  <div class="flex flex-wrap gap-2 items-center">
    <div v-if="!capas || !capas.length" class="text-sm text-gray-500 italic">No CAPAs</div>
    <button
      v-for="capa in capas"
      :key="capa.id"
      @click="$emit('view-details', capa)"
      class="px-2 py-1 text-xs font-medium rounded-full cursor-pointer transition-colors duration-150"
      :class="statusClass(capa.status)"
    >
      {{ capa.capa || `CAPA #${capa.id}` }}
    </button>
  </div>
</template>

<script setup>
defineProps({
  capas: {
    type: Array,
    default: () => [],
  },
});

defineEmits(['view-details']);

const statusClass = (status) => {
  const classes = {
    'Completed': 'bg-green-100 text-green-800 hover:bg-green-200',
    'Resolved': 'bg-green-100 text-green-800 hover:bg-green-200',
    'In Progress': 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
    'Pending': 'bg-blue-100 text-blue-800 hover:bg-blue-200',
  };
  return classes[status] || 'bg-gray-100 text-gray-800 hover:bg-gray-200';
};
</script>