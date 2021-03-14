<template>
    <div class="max-w-4xl mx-auto px-4 py-8">
        <h1 class="text-3xl font-bold text-center mb-8 text-gray-800">
            Add CPD Task Participant
            <div class="h-1 w-20 bg-green-500 rounded mx-auto mt-3"></div>
        </h1>

        <div class="bg-white rounded-xl shadow-md p-6 md:p-8">
            <div class="space-y-6">
                <!-- Credits Section -->
                <div class="bg-gray-50 rounded-lg p-5 border border-gray-200 hover:shadow-sm transition">
                    <h2 class="text-lg font-semibold text-gray-700 pb-3 border-b border-gray-200 mb-4">Credits Templates
                    </h2>

                    <div class="mb-6">
                        <label for="cpdCreditsTemplate" class="block text-sm font-medium text-gray-700 mb-2">
                            CPD Credits Template <span class="text-gray-500 text-xs italic">(Optional)</span>
                        </label>
                        <select id="cpdCreditsTemplate" v-model="formData.cpdCreditsTemplate"
                            @change="applyCreditsTemplate"
                            class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none"
                            aria-label="CPD Credits Template Options">
                            <option value="">Select template (optional)</option>
                            <option value="symposium">Symposium - 2 Credits</option>
                            <option value="workshop">Workshop - 3 Credits</option>
                            <option value="conference">Conference - 5 Credits</option>
                        </select>
                        <p class="mt-1 text-sm text-gray-500">Choose a template for pre-filled CPD credits or enter
                            manually below</p>
                    </div>

                    <div>
                        <label for="cpdCredits" class="block text-sm font-medium text-gray-700 mb-2">
                            CPD Credits <span class="text-red-500">*</span>
                        </label>
                        <input type="number" id="cpdCredits" v-model.number="formData.cpdCredits"
                            class="w-full px-4 py-2 rounded-lg border border-gray-300 mb-2 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none"
                            placeholder="Enter CPD credits" aria-required="true" />
                        <div class="flex space-x-2 mb-1">
                            <button v-for="credit in [1, 2, 3, 5]" :key="credit" @click="formData.cpdCredits = credit"
                                class="h-8 w-8 rounded-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 border border-gray-300 text-sm font-medium">
                                {{ credit }}
                            </button>
                        </div>
                        <p class="text-sm text-gray-500">Specify the CPD credits earned by the participant</p>
                    </div>
                </div>

                <!-- Review & Endorsement Section -->
                <div class="bg-gray-50 rounded-lg p-5 border border-gray-200 hover:shadow-sm transition">
                    <h2 class="text-lg font-semibold text-gray-700 pb-3 border-b border-gray-200 mb-4">Review &
                        Endorsement</h2>

                    <div class="grid md:grid-cols-2 gap-6">
                        <!-- Review Column -->
                        <div class="space-y-6">
                            <div>
                                <label for="reviewStatus" class="block text-sm font-medium text-gray-700 mb-2">
                                    Review Status <span class="text-red-500">*</span>
                                </label>
                                <select id="reviewStatus" v-model="formData.reviewStatus"
                                    class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none"
                                    aria-required="true" aria-label="Review Status">
                                    <option value="pending">Pending</option>
                                    <option value="approved">Approved</option>
                                    <option value="rejected">Rejected</option>
                                </select>
                                <p class="mt-1 text-sm text-gray-500">Current status of the review process</p>
                            </div>

                            <div>
                                <label for="reviewRemarks" class="block text-sm font-medium text-gray-700 mb-2">
                                    Review Remarks <span class="text-gray-500 text-xs italic">(Optional)</span>
                                </label>
                                <textarea id="reviewRemarks" v-model="formData.reviewRemarks" rows="3"
                                    class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none"
                                    placeholder="Add review remarks (if any)" aria-label="Review Remarks"></textarea>
                                <p class="mt-1 text-sm text-gray-500">Any notes or comments from the reviewer</p>
                            </div>
                        </div>

                        <!-- Endorsement Column -->
                        <div class="space-y-6">
                            <div>
                                <label for="endorsementDecision" class="block text-sm font-medium text-gray-700 mb-2">
                                    Endorsement Decision <span class="text-red-500">*</span>
                                </label>
                                <select id="endorsementDecision" v-model="formData.endorsementDecision"
                                    class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none"
                                    aria-required="true" aria-label="Endorsement Decision">
                                    <option value="pending">Pending</option>
                                    <option value="approved">Approved</option>
                                    <option value="rejected">Rejected</option>
                                </select>
                                <p class="mt-1 text-sm text-gray-500">Final decision on endorsement</p>
                            </div>

                            <div>
                                <label for="endorsementRemarks" class="block text-sm font-medium text-gray-700 mb-2">
                                    Endorsement Remarks <span class="text-gray-500 text-xs italic">(Optional)</span>
                                </label>
                                <textarea id="endorsementRemarks" v-model="formData.endorsementRemarks" rows="3"
                                    class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none"
                                    placeholder="Add endorsement remarks (if any)"
                                    aria-label="Endorsement Remarks"></textarea>
                                <p class="mt-1 text-sm text-gray-500">Additional notes regarding the endorsement
                                    decision</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Task & Participant Section -->
                <div class="bg-gray-50 rounded-lg p-5 border border-gray-200 hover:shadow-sm transition">
                    <h2 class="text-lg font-semibold text-gray-700 pb-3 border-b border-gray-200 mb-4">Task &
                        Participant Selection</h2>

                    <div class="space-y-6">
                        <div>
                            <label for="cpdTask" class="block text-sm font-medium text-gray-700 mb-2">
                                CPD Task <span class="text-red-500">*</span>
                            </label>
                            <div class="relative">
                                <select id="cpdTask" v-model="formData.cpdTask"
                                    class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none pr-10"
                                    aria-required="true" aria-label="CPD Task">
                                    <option value="">Select a CPD task</option>
                                    <option v-for="task in cpdTasks" :key="task.id" :value="task.id">{{ task.title }}
                                    </option>
                                </select>
                                <MagnifyingGlassIcon
                                    class="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
                            </div>
                            <p class="mt-1 text-sm text-gray-500">Select the CPD task this participant is associated
                                with</p>
                        </div>

                        <div>
                            <label for="participantRegNo" class="block text-sm font-medium text-gray-700 mb-2">
                                Participant <span class="text-red-500">*</span>
                            </label>
                            <div class="relative">
                                <select id="participantRegNo" v-model="formData.participantRegNo"
                                    class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none pr-10"
                                    aria-required="true" aria-label="Participant Registration Number">
                                    <option value="">Select a participant</option>
                                    <option v-for="participant in participants" :key="participant.id"
                                        :value="participant.reg_no">
                                        {{ participant.full_name }} - {{ participant.reg_no }}
                                    </option>
                                </select>
                                <MagnifyingGlassIcon
                                    class="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
                            </div>
                            <p class="mt-1 text-sm text-gray-500">Choose the participant from the registered list</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Form Actions -->
            <div class="mt-8 flex justify-between items-center">
                <button @click="cancel" class="text-gray-600 hover:text-gray-800 hover:underline font-medium">
                    Cancel
                </button>
                <div class="flex space-x-4">
                    <button @click="resetForm"
                        class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg border border-gray-300 font-medium">
                        Reset
                    </button>
                    <button @click="submitForm"
                        class="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium shadow-sm flex items-center">
                        <CheckCircleIcon class="h-5 w-5 mr-2" />
                        Submit
                    </button>
                </div>
            </div>

            <!-- Status Messages -->
            <transition name="fade">
                <div v-if="message" :class="[
                    'mt-6 p-4 rounded-lg flex items-center',
                    messageType === 'success' ? 'bg-green-50 text-green-700 border-l-4 border-green-500' : 'bg-red-50 text-red-700 border-l-4 border-red-500'
                ]">
                    <component :is="messageType === 'success' ? CheckCircleIcon : ExclamationCircleIcon"
                        class="h-5 w-5 mr-3" />
                    {{ message }}
                </div>
            </transition>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';
import apiService from '@/services/services';
import {
    CheckCircleIcon,
    ExclamationCircleIcon,
    MagnifyingGlassIcon
} from '@heroicons/vue/24/outline';

const router = useRouter();
const cpdTasks = ref([]);
const participants = ref([]);
const message = ref('');
const messageType = ref('');

const formData = reactive({
    cpdCreditsTemplate: '',
    cpdCredits: 0,
    reviewStatus: 'pending',
    reviewRemarks: '',
    endorsementDecision: 'pending',
    endorsementRemarks: '',
    cpdTask: '',
    participantRegNo: ''
});

onMounted(fetchData);

async function fetchData() {
    try {
        const [tasksResponse, participantsResponse] = await Promise.all([
            apiService.getBmhcCpdTasks(),
            apiService.getBmhcCounsellors()
        ]);

        cpdTasks.value = tasksResponse.data;
        participants.value = participantsResponse.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        showMessage('Failed to load data. Please try again.', 'error');
    }
}

function applyCreditsTemplate() {
    const templates = {
        'symposium': 2,
        'workshop': 3,
        'conference': 5
    };

    formData.cpdCredits = templates[formData.cpdCreditsTemplate] || 0;
}

async function submitForm() {
    if (!validateForm()) return;

    try {
        await apiService.createBmhcCpdTaskParticipant({
            cpd_credits: formData.cpdCredits,
            review_status: formData.reviewStatus,
            review_remarks: formData.reviewRemarks,
            endorsement_decision: formData.endorsementDecision,
            endorsement_remarks: formData.endorsementRemarks,
            cpd_task: formData.cpdTask,
            participant_reg_no: formData.participantRegNo
        });

        showMessage('Participant added successfully!', 'success');
        resetForm();
        await fetchData();
    } catch (error) {
        console.error('Error submitting form:', error);
        showMessage('Failed to add participant. Please try again.', 'error');
    }
}

function validateForm() {
    if (!formData.cpdCredits) {
        showMessage('Please enter CPD credits', 'error');
        return false;
    }

    if (!formData.cpdTask) {
        showMessage('Please select a CPD task', 'error');
        return false;
    }

    if (!formData.participantRegNo) {
        showMessage('Please select a participant', 'error');
        return false;
    }

    return true;
}

function resetForm() {
    Object.assign(formData, {
        cpdCreditsTemplate: '',
        cpdCredits: 0,
        reviewStatus: 'pending',
        reviewRemarks: '',
        endorsementDecision: 'pending',
        endorsementRemarks: '',
        cpdTask: '',
        participantRegNo: ''
    });
}

function cancel() {
    router.go(-1);
}

function showMessage(text, type) {
    message.value = text;
    messageType.value = type;
    setTimeout(() => message.value = '', 4000);
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s, transform 0.3s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: translateY(10px);
}
</style>