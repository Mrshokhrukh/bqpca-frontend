<template>
    <div class="max-w-3xl mx-auto p-4 md:p-6">
        <header class="text-center mb-8">
            <h1 class="text-3xl font-bold text-slate-800 mb-2">Practitioner Registration</h1>
            <p class="text-slate-600 mb-4">Select your registration type to begin</p>
            <div class="text-sm font-medium text-slate-500">Step {{ currentStep }} of 3</div>
        </header>

        <!-- Step 1: Registration Type Selection -->
        <transition name="fade">
            <div v-if="currentStep === 1">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div v-for="option in registrationOptions" :key="option.value"
                        class="p-6 border-2 rounded-xl cursor-pointer transition-all duration-300" :class="[
                            selectedType === option.value
                                ? 'border-blue-500 bg-slate-50'
                                : 'border-slate-200 hover:border-blue-500'
                        ]" @click="selectRegistrationType(option.value)">
                        <h3 class="text-lg font-semibold text-slate-800 mb-2">{{ option.label }}</h3>
                        <p class="text-slate-600 text-sm">{{ option.description }}</p>
                        <div class="relative mt-4">
                            <span class="text-blue-500 cursor-help underline text-sm" @mouseover="showTooltip = true"
                                @mouseleave="showTooltip = false">
                                What is CID?
                            </span>
                            <span v-if="showTooltip"
                                class="absolute left-0 mt-2 px-3 py-1.5 bg-slate-900 text-white text-xs rounded-md">
                                Civil Identification Document
                            </span>
                        </div>
                    </div>
                </div>
                <button
                    class="w-full md:w-auto px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    :disabled="!selectedType" @click="showConfirmationModal = true">
                    Next
                </button>
            </div>
        </transition>

        <!-- Step 2: Dynamic Form -->
        <transition name="fade">
            <div v-if="currentStep === 2">
                <form @submit.prevent="handleSubmit">
                    <div class="space-y-4 mb-8">
                        <div v-if="selectedType === 'cid'" class="space-y-4">
                            <InputField label="CID Number" v-model="formData.cid" placeholder="Enter CID number"
                                :validator="validateCID" required />
                            <InputField label="Full Name" v-model="formData.fullName" placeholder="Enter full name"
                                required />
                            <InputField label="Date of Birth" type="date" v-model="formData.dob" required />
                        </div>
                        <div v-else class="space-y-4">
                            <InputField label="Passport Number" v-model="formData.passport"
                                placeholder="Enter passport number" required />
                            <InputField label="Nationality" v-model="formData.nationality"
                                placeholder="Enter nationality" required />
                        </div>
                        <InputField label="Contact Information" v-model="formData.contact"
                            placeholder="Enter phone number" type="tel" required />
                    </div>
                    <div class="flex gap-3 justify-end">
                        <button type="button"
                            class="px-4 py-2 text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                            @click="currentStep--">
                            Back
                        </button>
                        <button type="submit"
                            class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                            Next
                        </button>
                    </div>
                </form>
            </div>
        </transition>

        <!-- Step 3: Review -->
        <transition name="fade">
            <div v-if="currentStep === 3" class="mt-8">
                <div class="bg-slate-50 rounded-xl p-6 md:p-8 shadow-sm">
                    <h3 class="text-xl font-semibold text-slate-800 mb-6">Review Details</h3>
                    <div class="border border-slate-200 rounded-lg p-4 space-y-3">
                        <p class="text-slate-800"><strong>Registration Type:</strong> {{ selectedTypeLabel }}</p>
                        <div v-if="selectedType === 'cid'" class="space-y-2">
                            <p class="text-slate-800"><strong>CID Number:</strong> {{ formData.cid }}</p>
                            <p class="text-slate-800"><strong>Full Name:</strong> {{ formData.fullName }}</p>
                            <p class="text-slate-800"><strong>Date of Birth:</strong> {{ formData.dob }}</p>
                        </div>
                        <div v-else class="space-y-2">
                            <p class="text-slate-800"><strong>Passport Number:</strong> {{ formData.passport }}</p>
                            <p class="text-slate-800"><strong>Nationality:</strong> {{ formData.nationality }}</p>
                        </div>
                        <p class="text-slate-800"><strong>Contact:</strong> {{ formData.contact }}</p>
                    </div>
                    <button
                        class="w-full mt-6 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                        @click="showSubmitModal = true">
                        Submit Registration
                    </button>
                </div>
            </div>
        </transition>

        <!-- Confirmation Modal -->
        <Modal v-if="showConfirmationModal" @close="showConfirmationModal = false">
            <template #header>
                <h3 class="text-lg font-semibold text-slate-800">Confirmation</h3>
            </template>
            <p class="text-slate-600 mb-6">You've selected {{ selectedTypeLabel }}. Please proceed with providing
                details.</p>
            <template #footer>
                <button class="px-4 py-2 text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                    @click="showConfirmationModal = false">
                    Cancel
                </button>
                <button class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    @click="proceedToNextStep">
                    Proceed
                </button>
            </template>
        </Modal>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import Modal from './Modal.vue';
import InputField from './InputField.vue';

const currentStep = ref(1);
const selectedType = ref(null);
const showConfirmationModal = ref(false);
const showTooltip = ref(false);

const formData = ref({
    cid: '',
    passport: '',
    fullName: '',
    dob: '',
    nationality: '',
    contact: ''
});

const registrationOptions = [
    {
        value: 'cid',
        label: 'CID Holder',
        description: 'Bhutanese citizens with valid CID'
    },
    {
        value: 'non-cid',
        label: 'Non-CID Holder',
        description: 'Expatriates without Bhutanese CID'
    }
];

const selectedTypeLabel = computed(() =>
    registrationOptions.find(opt => opt.value === selectedType.value)?.label
);

function selectRegistrationType(type) {
    selectedType.value = type;
}

function proceedToNextStep() {
    showConfirmationModal.value = false;
    if (currentStep.value === 1) {
        currentStep.value++;
    }
}

function validateCID(value) {
    return /^[A-Z0-9]{8}$/.test(value);
}

async function handleSubmit() {
    // Add form validation logic here
    if (currentStep.value === 2) {
        currentStep.value++;
    }
}
</script>

<style>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>