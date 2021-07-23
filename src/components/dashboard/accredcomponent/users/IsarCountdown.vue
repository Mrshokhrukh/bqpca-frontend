<template>
    <span :class="countdownClass">
      {{ countdownText }}
    </span>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, onUnmounted } from 'vue';
  
  const props = defineProps({
    deadline: {
      type: String,
      default: null,
    },
  });
  
  const now = ref(new Date());
  let timer = null;
  
  onMounted(() => {
    // Update the 'now' time every second to make the countdown live
    timer = setInterval(() => {
      now.value = new Date();
    }, 1000);
  });
  
  onUnmounted(() => {
    // Clean up the timer when the component is removed
    if (timer) {
      clearInterval(timer);
    }
  });
  
  const timeRemaining = computed(() => {
    if (!props.deadline) return null;
  
    // Ensure the deadline is interpreted correctly by adding a time component.
    // This helps avoid timezone issues where the date might be considered the start of the day in UTC.
    const deadlineDate = new Date(`${props.deadline}T23:59:59`);
    const remaining = deadlineDate.getTime() - now.value.getTime();
    
    if (remaining <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
    }
  
    const seconds = Math.floor((remaining / 1000) % 60);
    const minutes = Math.floor((remaining / 1000 / 60) % 60);
    const hours = Math.floor((remaining / (1000 * 60 * 60)) % 24);
    const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
  
    return { days, hours, minutes, seconds, total: remaining };
  });
  
  const countdownText = computed(() => {
    if (!props.deadline) {
      return 'Not set';
    }
  
    const remaining = timeRemaining.value;
  
    if (remaining.total <= 0) {
      return 'Deadline Passed';
    }
    
    if (remaining.days > 0) {
      return `${remaining.days}d ${remaining.hours}h remaining`;
    }
    
    if (remaining.hours > 0) {
      return `${remaining.hours}h ${remaining.minutes}m remaining`;
    }
    
    return `${remaining.minutes}m ${remaining.seconds}s remaining`;
  });
  
  const countdownClass = computed(() => {
    if (!props.deadline || !timeRemaining.value) {
      return 'text-gray-400';
    }
  
    const remaining = timeRemaining.value;
  
    if (remaining.total <= 0) {
      return 'text-red-600 font-bold';
    }
    if (remaining.days < 7) {
      return 'text-red-500 font-semibold';
    }
    if (remaining.days < 30) {
      return 'text-yellow-600 font-semibold';
    }
    return 'text-gray-700';
  });
  </script>