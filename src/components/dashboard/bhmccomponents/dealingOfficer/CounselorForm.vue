<template>
    <div class="max-w-6xl mx-auto px-4 py-8">
        <!-- Form Header -->
        <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 mb-10">
            <h2 class="text-3xl font-bold text-gray-900 mb-3 text-center">
                Dealing Officer Review
            </h2>
            <p class="text-gray-600 text-center max-w-2xl mx-auto">
                Review the applicant and counselling details, then provide your decision and any relevant remarks.
            </p>
        </div>

        <!-- Main Form Card -->
        <div class="bg-white border rounded-xl shadow-sm p-6">
            <!-- Applicant Details Section -->
            <div class="border-b border-gray-200 bg-gray-50 p-6 rounded-t-xl">
                <h3 class="text-lg font-semibold text-gray-900">Applicant Details</h3>
                <p class="mt-1 text-sm text-gray-500">View the applicant's information.</p>
            </div>

            <div class="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- RegNo -->
                <div class="col-span-1">
                    <label class="block text-sm font-medium text-gray-700">RegNo</label>
                    <input type="text" id="regNoDO" v-model="applicantDetails.regNo" disabled
                        class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 bg-gray-50" />
                </div>

                <!-- CID -->
                <div class="col-span-1">
                    <label class="block text-sm font-medium text-gray-700">CID</label>
                    <input type="text" id="cidDO" v-model="applicantDetails.cid" disabled
                        class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 bg-gray-50" />
                </div>

                <!-- Full Name -->
                <div class="col-span-1">
                    <label class="block text-sm font-medium text-gray-700">Full Name</label>
                    <input type="text" id="fullNameDO" v-model="applicantDetails.fullName" disabled
                        class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 bg-gray-50" />
                </div>

                <!-- Gender -->
                <div class="col-span-1">
                    <label class="block text-sm font-medium text-gray-700">Gender</label>
                    <input type="text" id="genderDO" v-model="applicantDetails.gender" disabled
                        class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 bg-gray-50" />
                </div>

                <!-- Contact No. -->
                <div class="col-span-1">
                    <label class="block text-sm font-medium text-gray-700">Contact No.</label>
                    <input type="text" id="contactNoDO" v-model="applicantDetails.contactNo"
                        class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5" />
                </div>

                <!-- Email Address -->
                <div class="col-span-1">
                    <label class="block text-sm font-medium text-gray-700">Email Address</label>
                    <input type="email" id="emailAddressDO" v-model="applicantDetails.emailAddress"
                        class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5" />
                </div>
            </div>

            <!-- Counselling Details Section -->
            <div class="border-b border-gray-200 bg-gray-50 p-6">
                <h3 class="text-lg font-semibold text-gray-900">Counselling Details</h3>
                <p class="mt-1 text-sm text-gray-500">Information about the counselling session.</p>
            </div>

            <div class="p-8 grid grid-cols-1 gap-6">
                <!-- Counselling Title -->
                <div>
                    <label class="block text-sm font-medium text-gray-700">Counselling Title</label>
                    <input type="text" id="counsellingTitleDO" v-model="counsellingDetails.counsellingTitle" disabled
                        class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 bg-gray-50" />
                </div>

                <!-- Counselling Details -->
                <div>
                    <label class="block text-sm font-medium text-gray-700">Counselling Details</label>
                    <textarea id="counsellingDetailsDO" v-model="counsellingDetails.counsellingDetails" rows="3"
                        disabled
                        class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 bg-gray-50"></textarea>
                </div>

                <!-- Counselling Report -->
                <div>
                    <label class="block text-sm font-medium text-gray-700">Counselling Report</label>
                    <textarea id="counsellingReportDO" v-model="counsellingDetails.counsellingReport" rows="3" disabled
                        class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 bg-gray-50"></textarea>
                </div>

                <!-- Attachments -->
                <div>
                    <label class="block text-sm font-medium text-gray-700">Attachments</label>
                    <div v-if="attachments.length > 0">
                        <div v-for="(attachment, index) in attachments" :key="index" class="flex items-center mb-2">
                            <a :href="attachment.url" target="_blank" class="text-blue-500 hover:underline">{{
                                attachment.name }}</a>
                        </div>
                    </div>
                    <p v-else class="text-gray-500">No attachments available.</p>
                </div>

                <!-- Remarks -->
                <div>
                    <label class="block text-sm font-medium text-gray-700">Remarks from Counsellor</label>
                    <textarea id="remarksDO" v-model="counsellingDetails.remarks" rows="2" disabled
                        class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 bg-gray-50"></textarea>
                </div>
            </div>

            <!-- Declaration -->
            <div class="p-8">
                <label class="inline-flex items-center">
                    <input type="checkbox" v-model="counsellingDetails.declaration"
                        class="form-checkbox h-5 w-5 text-blue-600" disabled />
                    <span class="ml-2 text-gray-700">Declaration by Counsellor.</span>
                </label>
            </div>

            <!-- Review Details Section -->
            <div class="border-b border-gray-200 bg-gray-50 p-6">
                <h3 class="text-lg font-semibold text-gray-900">Review Details</h3>
                <p class="mt-1 text-sm text-gray-500">Provide your review decision and remarks.</p>
            </div>

            <div class="p-8 grid grid-cols-1 gap-6">
                <!-- Review Decision -->
                <div>
                    <label class="block text-sm font-medium text-gray-700">Review Decision</label>
                    <select v-model="reviewData.reviewDecision"
                        class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5">
                        <option value="">Select Decision</option>
                        <option value="approved">Approve</option>
                        <option value="rejected">Reject</option>
                        <option value="pending">Pending</option>
                    </select>
                </div>

                <!-- DO Remarks -->
                <div>
                    <label class="block text-sm font-medium text-gray-700">Remarks</label>
                    <textarea v-model="reviewData.remarks" rows="2"
                        class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5"></textarea>
                </div>
            </div>

            <!-- Action Buttons -->
            <div class="mt-12 flex justify-end space-x-4 p-8">
                <button @click="cancelReview"
                    class="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                    Cancel
                </button>
                <button @click="saveReview"
                    class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                    Save
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue';

// Applicant Details
const applicantDetails = reactive({
    regNo: 'REG123',
    cid: '1234567890',
    fullName: 'John Doe',
    gender: 'Male',
    contactNo: '',
    emailAddress: '',
});

// Counselling Details
const counsellingDetails = reactive({
    counsellingTitle: 'General Counselling',
    counsellingDetails: 'Discussed career options with the applicant.',
    counsellingReport: 'The applicant is interested in further training.',
    remarks: '',
    declaration: true,
});

// Attachments - array of objects with name and url
const attachments = ref([
    { name: 'Report.pdf', url: '#' },
    { name: 'Summary.docx', url: '#' }
]);

// Review Data for Dealing Officer
const reviewData = reactive({
    reviewDecision: '',
    remarks: '',
});

// Function to save the Dealing Officer review
const saveReview = () => {
    // Implement saving the review to an API or store
    console.log('Saving Dealing Officer review:', reviewData);
    console.log('Applicant Details:', applicantDetails);
    console.log('Counselling Details:', counsellingDetails);
    alert('Review Saved!');
    resetReview();
};

// Function to cancel the Dealing Officer review
const cancelReview = () => {
    console.log('Dealing Officer review cancelled');
    resetReview();
};

// Function to reset review data
const resetReview = () => {
    Object.assign(reviewData, {
        reviewDecision: '',
        remarks: '',
    });
};
</script>