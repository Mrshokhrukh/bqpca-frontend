<template>
    <button @click="onClick" class="flex items-center space-x-2 text-green-500 hover:text-green-700">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
      </svg>
      <span>Approve</span>
    </button>
  </template>
  
  <script setup>
  const emit = defineEmits(['click']);
  
  const onClick = () => {
    emit('click');
  };
  </script>