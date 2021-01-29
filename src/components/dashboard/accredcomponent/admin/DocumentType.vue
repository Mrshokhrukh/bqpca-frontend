<template>
    <div class="p-6 max-w-7xl mx-auto">
        <h1 class="text-2xl font-bold text-gray-800 mb-6">Document Type Management</h1>

        <!-- Add/Edit Form -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 class="text-xl font-semibold text-gray-700 mb-4">
                {{ isEditing ? 'Edit Document Type' : 'Add New Document Type' }}
            </h2>
            <form @submit.prevent="handleSubmit" class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Document</label>
                    <input v-model="formData.document" type="text"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required />
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Document Type ID</label>
                    <input v-model="formData.document_type" type="number"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required />
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Institution Profile ID</label>
                    <input v-model="formData.institution_profile" type="number"
                        class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required />
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
                                ID
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Document
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Document Type ID
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Institution Profile ID
                            </th>
                            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-for="doc in documentTypes" :key="doc.id">
                            <td class="px-6 py-4 whitespace-nowrap">{{ doc.id }}</td>
                            <td class="px-6 py-4 whitespace-nowrap">{{ doc.document }}</td>
                            <td class="px-6 py-4 whitespace-nowrap">{{ doc.document_type }}</td>
                            <td class="px-6 py-4 whitespace-nowrap">{{ doc.institution_profile }}</td>
                            <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                <button @click="editDocumentType(doc)"
                                    class="text-blue-600 hover:text-blue-900 focus:outline-none">
                                    Edit
                                </button>
                                <button @click="confirmDelete(doc.id)"
                                    class="text-red-600 hover:text-red-900 focus:outline-none">
                                    Delete
                                </button>
                            </td>
                        </tr>
                        <tr v-if="documentTypes.length === 0">
                            <td colspan="5" class="px-6 py-4 text-center text-gray-500">
                                No document types found
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Delete Confirmation Modal -->
        <div v-if="showDeleteModal"
            class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
            <div class="bg-white p-6 rounded-lg shadow-xl max-w-md mx-auto">
                <h3 class="text-lg font-medium text-gray-900 mb-4">Confirm Delete</h3>
                <p class="text-gray-600 mb-6">Are you sure you want to delete this document type? This action cannot be
                    undone.</p>
                <div class="flex justify-end space-x-3">
                    <button @click="showDeleteModal = false"
                        class="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500">
                        Cancel
                    </button>
                    <button @click="deleteDocumentType"
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
const documentTypes = ref([])
const formData = ref({
    document: '',
    document_type: 0,
    institution_profile: 0
})
const isEditing = ref(false)
const editingId = ref(null)
const showDeleteModal = ref(false)
const deleteId = ref(null)

// Methods
const fetchDocumentTypes = async () => {
    try {
        const response = await api.getProfileDocuments()
        documentTypes.value = response.data
    } catch (error) {
        console.error('Error fetching document types:', error)
    }
}

const handleSubmit = async () => {
    try {
        if (isEditing.value) {
            await api.updateProfileDocument(editingId.value, formData.value)
        } else {
            await api.createProfileDocument(formData.value)
        }
        resetForm()
        fetchDocumentTypes()
    } catch (error) {
        console.error('Error saving document type:', error)
    }
}

const editDocumentType = (doc) => {
    formData.value = {
        document: doc.document,
        document_type: doc.document_type,
        institution_profile: doc.institution_profile
    }
    isEditing.value = true
    editingId.value = doc.id
}

const cancelEdit = () => {
    resetForm()
}

const resetForm = () => {
    formData.value = {
        document: '',
        document_type: 0,
        institution_profile: 0
    }
    isEditing.value = false
    editingId.value = null
}

const confirmDelete = (id) => {
    deleteId.value = id
    showDeleteModal.value = true
}

const deleteDocumentType = async () => {
    try {
        await api.deleteProfileDocument(deleteId.value)
        showDeleteModal.value = false
        deleteId.value = null
        fetchDocumentTypes()
    } catch (error) {
        console.error('Error deleting document type:', error)
    }
}

// Lifecycle
onMounted(() => {
    fetchDocumentTypes()
})
</script>