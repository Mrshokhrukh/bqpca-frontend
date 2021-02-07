<template>
    <div class="bg-white border rounded-xl shadow-sm p-6 mt-8">
        <div class="border-b border-gray-200 bg-gray-50 p-6 rounded-t-xl">
            <h3 class="text-lg font-semibold text-gray-900">Add Participants (After Approval)</h3>
            <p class="mt-1 text-sm text-gray-500">Add participants to the approved CPD course.</p>
        </div>

        <div class="p-8">
            <div v-for="(participant, index) in participants" :key="index"
                class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                <div class="col-span-1">
                    <label for="regNo" class="block text-sm font-medium text-gray-700">RegNo</label>
                    <input type="text" id="regNo" v-model="participant.regNo"
                        class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500 p-2.5" />
                </div>

                <div class="col-span-1">
                    <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
                    <input type="text" id="name" v-model="participant.name"
                        class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500 p-2.5" />
                </div>
            </div>
            <button @click="addParticipant"
                class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                Add Participant
            </button>

            <div class="mt-6">
                <label for="attendanceSheet" class="block text-sm font-medium text-gray-700">Attendance Sheet</label>
                <input type="file" id="attendanceSheet" class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4
                               file:rounded-lg file:border-0 file:text-sm file:font-semibold
                               file:bg-green-50 file:text-green-700 hover:file:bg-green-100" />
            </div>
        </div>

        <div class="mt-12 flex justify-end space-x-4 p-8">
            <button type="button" @click="handleSaveDraft"
                class="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                Save as Draft
            </button>
            <button type="button" @click="handleSubmit"
                class="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                Submit
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useToast } from 'vue-toastification';

const toast = useToast();

const participants = ref([{ regNo: '', name: '' }]);

const addParticipant = () => {
    participants.value.push({ regNo: '', name: '' });
};

const handleSaveDraft = () => {
    console.log('Saving participants as draft:', participants.value);
    toast.info('Participants saved as draft!');
};

const handleSubmit = () => {
    console.log('Submitting participants:', participants.value);
    toast.success('Participants submitted successfully!');
};
</script>