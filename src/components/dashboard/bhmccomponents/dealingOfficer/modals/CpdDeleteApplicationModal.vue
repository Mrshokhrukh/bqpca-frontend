<template>
  <div class="modal-overlay" v-if="isVisible">
    <div class="modal-content">
      <h2>Delete CPD Application</h2>
      <p>Are you sure you want to delete this application?</p>
      <button @click="confirmDelete">Yes, Delete</button>
      <button @click="closeModal">Cancel</button>
    </div>
  </div>
</template>

<script setup>
// Define props
defineProps({
  isVisible: {
    type: Boolean,
    required: true,
  },
});

// Define emits
const emit = defineEmits(['delete', 'close']);

// Methods
const confirmDelete = () => {
  emit('delete');
  closeModal();
};

const closeModal = () => {
  emit('close');
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}

button {
  margin: 5px;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:first-of-type {
  background-color: #ff4d4d;
  color: white;
}

button:last-of-type {
  background-color: #f0f0f0;
  color: #333;
}
</style>