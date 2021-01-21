<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <teleport to="body">
        <transition name="modal">
            <div v-if="isOpen" class="modal-overlay" @click.self="close">
                <div class="modal-container">
                    <div class="modal-header">
                        <slot name="header">
                            <h3>{{ title }}</h3>
                            <button class="close-button" @click="close">&times;</button>
                        </slot>
                    </div>

                    <div class="modal-content">
                        <slot></slot>
                    </div>

                    <div class="modal-footer">
                        <slot name="footer"></slot>
                    </div>
                </div>
            </div>
        </transition>
    </teleport>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';

const props = defineProps({
    isOpen: Boolean,
    title: String
});

const emit = defineEmits(['close']);

function close() {
    emit('close');
}

function handleEscape(e) {
    if (e.key === 'Escape') {
        close();
    }
}

onMounted(() => {
    document.addEventListener('keydown', handleEscape);
});

onUnmounted(() => {
    document.removeEventListener('keydown', handleEscape);
});
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal-container {
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    width: 90%;
    max-width: 500px;
    padding: 1.5rem;
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #e2e8f0;
    padding-bottom: 1rem;
    margin-bottom: 1rem;
}

.modal-header h3 {
    margin: 0;
    font-size: 1.25rem;
    color: #1e293b;
}

.close-button {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #64748b;
    padding: 0 0.5rem;
}

.close-button:hover {
    color: #475569;
}

.modal-footer {
    border-top: 1px solid #e2e8f0;
    padding-top: 1rem;
    margin-top: 1rem;
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
}

.modal-enter-active,
.modal-leave-active {
    transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
    transition: transform 0.3s ease;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
    transform: translateY(-20px);
}
</style>