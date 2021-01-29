# AssessorPoolManager.vue

<template>
    <div class="p-6 max-w-7xl mx-auto">
        <h1 class="text-2xl font-bold text-gray-800 mb-6">Assessor Pool Management</h1>

        <!-- Add/Edit Form -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 class="text-xl font-semibold text-gray-700 mb-4">
                {{ isEditing ? 'Edit Assessor Profile' : 'Add New Assessor Profile' }}
            </h2>
            <form @submit.prevent="handleSubmit" class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Assessor</label>
                        <select v-model="formData.assessor"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required>
                            <option value="">Select Assessor</option>
                            <!-- Add your assessor options here -->
                        </select>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Institution Profile</label>
                        <select v-model="formData.institution_profile"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required>
                            <option value="">Select Institution</option>
                            <!-- Add your institution options here -->
                        </select>
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Conflict of Interest</label>
                        <div class="mt-1">
                            <label class="inline-flex items-center">
                                <input type="checkbox" v-model="formData.conflict_of_interest"
                                    class="form-checkbox h-4 w-4 text-blue-600 rounded" />
                                <span class="ml-2">Yes, there is a conflict of interest</span>
                            </label>
                        </div>
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-1">Assessor's Report</label>
                        <input type="file" @change="handleFileUpload" accept=".pdf"
                            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                    <textarea v-model="formData.remarks" rows="3"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                </div>

                <div class="flex justify-end space-x-3">
                    <button v-if="isEditing" type="button" @click="cancelEdit"
                        class="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500">
                        Cancel
                    </button>
                    <button type="submit"
                        class="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        {{ isEditing ? 'Update' : 'Add' }}
                    </button>
                </div>
            </form>
        </div>

        <!-- Data Table -->
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
            <div class="min-w-full overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Assessor ID</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Institution ID</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Conflict of Interest</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Remarks</th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Report</th>
                            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-for="assessor in assessors" :key="assessor.id">
                            <td class="px-6 py-4 whitespace-nowrap">{{ assessor.assessor }}</td>
                            <td class="px-6 py-4 whitespace-nowrap">{{ assessor.institution_profile }}</td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span :class="{
                                    'px-2 py-1 text-xs font-semibold rounded-full': true,
                                    'bg-red-100 text-red-800': assessor.conflict_of_interest,
                                    'bg-green-100 text-green-800': !assessor.conflict_of_interest
                                }">
                                    {{ assessor.conflict_of_interest ? 'Yes' : 'No' }}
                                </span>
                            </td>
                            <td class="px-6 py-4">
                                <p class="line-clamp-2">{{ assessor.remarks }}</p>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <a v-if="assessor.assessors_report" :href="assessor.assessors_report" target="_blank"
                                    class="text-blue-600 hover:text-blue-900">
                                    View Report
                                </a>
                                <span v-else class="text-gray-400">No report</span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                <button @click="editAssessor(assessor)"
                                    class="text-blue-600 hover:text-blue-900 focus:outline-none">
                                    Edit
                                </button>
                                <button @click="confirmDelete(assessor.id)"
                                    class="text-red-600 hover:text-red-900 focus:outline-none">
                                    Delete
                                </button>
                            </td>
                        </tr>
                        <tr v-if="assessors.length === 0">
                            <td colspan="6" class="px-6 py-4 text-center text-gray-500">
                                No assessors found
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Pagination -->
            <div v-if="totalPages > 1"
                class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div class="flex-1 flex justify-between">
                    <button @click="currentPage > 1 && fetchAssessors(currentPage - 1)" :disabled="currentPage === 1"
                        class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }">
                        Previous
                    </button>
                    <button @click="currentPage < totalPages && fetchAssessors(currentPage + 1)"
                        :disabled="currentPage === totalPages"
                        class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                        :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages }">
                        Next
                    </button>
                </div>
            </div>
        </div>

        <!-- Delete Confirmation Modal -->
        <div v-if="showDeleteModal"
            class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
            <div class="bg-white p-6 rounded-lg shadow-xl max-w-md mx-auto">
                <h3 class="text-lg font-medium text-gray-900 mb-4">Confirm Delete</h3>
                <p class="text-gray-600 mb-6">Are you sure you want to delete this assessor profile? This action cannot
                    be undone.</p>
                <div class="flex justify-end space-x-3">
                    <button @click="showDeleteModal = false"
                        class="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500">
                        Cancel
                    </button>
                    <button @click="deleteAssessor"
                        class="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500">
                        Delete
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/services'

// State
const assessors = ref([])
const formData = ref({
    assessor: '',
    institution_profile: '',
    conflict_of_interest: false,
    remarks: '',
    assessors_report: null
})
const isEditing = ref(false)
const editingId = ref(null)
const showDeleteModal = ref(false)
const deleteId = ref(null)
const currentPage = ref(1)
const totalPages = ref(1)

// Methods
const fetchAssessors = async (page = 1) => {
    try {
        const response = await api.getProfileAssessors()
        assessors.value = response.data.results
        totalPages.value = Math.ceil(response.data.count / 10) // Assuming 10 items per page
        currentPage.value = page
    } catch (error) {
        console.error('Error fetching assessors:', error)
    }
}

const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
        formData.value.assessors_report = file
    }
}

const handleSubmit = async () => {
    try {
        const submitData = new FormData()
        for (const [key, value] of Object.entries(formData.value)) {
            if (value !== null) {
                submitData.append(key, value)
            }
        }

        if (isEditing.value) {
            await api.updateProfileAssessor(editingId.value, submitData)
        } else {
            await api.createProfileAssessor(submitData)
        }
        resetForm()
        fetchAssessors()
    } catch (error) {
        console.error('Error saving assessor:', error)
    }
}

const editAssessor = (assessor) => {
    formData.value = {
        assessor: assessor.assessor,
        institution_profile: assessor.institution_profile,
        conflict_of_interest: assessor.conflict_of_interest,
        remarks: assessor.remarks,
        assessors_report: null // Reset file input
    }
    isEditing.value = true
    editingId.value = assessor.id
}

const cancelEdit = () => {
    resetForm()
}

const resetForm = () => {
    formData.value = {
        assessor: '',
        institution_profile: '',
        conflict_of_interest: false,
        remarks: '',
        assessors_report: null
    }
    isEditing.value = false
    editingId.value = null
}

const confirmDelete = (id) => {
    deleteId.value = id
    showDeleteModal.value = true
}

const deleteAssessor = async () => {
    try {
        await api.deleteProfileAssessor(deleteId.value)
        showDeleteModal.value = false
        deleteId.value = null
        fetchAssessors()
    } catch (error) {
        console.error('Error deleting assessor:', error)
    }
}

// Lifecycle
onMounted(() => {
    fetchAssessors()
})
</script>