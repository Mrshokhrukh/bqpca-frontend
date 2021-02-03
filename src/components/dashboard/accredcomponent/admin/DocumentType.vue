<template>
    <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 lg:p-8">
        <div class="max-w-[1600px] mx-auto">
            <h1 class="text-3xl font-bold text-slate-900 mb-6 font-serif">Document Type Management</h1>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- Left Column - Add/Edit Form -->
                <div class="bg-white rounded-lg shadow-sm border border-slate-200 p-6 h-fit sticky top-8">
                    <h2 class="text-xl font-semibold text-slate-900 mb-4">
                        {{ isEditing ? 'Edit Document Type' : 'Add New Document Type' }}
                    </h2>
                    <form @submit.prevent="handleSubmit">
                        <div class="space-y-4">
                            <div>
                                <label for="document"
                                    class="block text-sm font-medium text-slate-700 mb-1">Document</label>
                                <input type="text" id="document" v-model="formData.document"
                                    class="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter document name" required />
                            </div>
                            <div>
                                <label for="document_type"
                                    class="block text-sm font-medium text-slate-700 mb-1">Document Type ID</label>
                                <input type="number" id="document_type" v-model="formData.document_type"
                                    class="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter document type ID" required />
                            </div>
                            <div>
                                <label for="institution_profile"
                                    class="block text-sm font-medium text-slate-700 mb-1">Institution Profile ID</label>
                                <input type="number" id="institution_profile" v-model="formData.institution_profile"
                                    class="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Enter institution profile ID" required />
                            </div>
                            <div class="flex gap-3">
                                <button type="submit"
                                    class="flex-1 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                                    {{ isEditing ? 'Update Type' : 'Add Type' }}
                                </button>
                                <button v-if="isEditing" type="button" @click="cancelEdit"
                                    class="py-2 px-4 bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200">
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                <!-- Right Column - Data Table -->
                <div class="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                    <div class="mb-6 space-y-4">
                        <div class="flex justify-between items-center">
                            <h2 class="text-xl font-semibold text-slate-900">Document Types List</h2>
                            <span class="text-sm text-slate-500">
                                {{ documentTypes.length }} Type{{ documentTypes.length !== 1 ? 's' : '' }}
                            </span>
                        </div>
                    </div>

                    <!-- Document Types Table -->
                    <div class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-slate-200">
                            <thead class="bg-slate-50">
                                <tr>
                                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">
                                        ID
                                    </th>
                                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">
                                        Document
                                    </th>
                                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">
                                        Document Type ID
                                    </th>
                                    <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">
                                        Institution Profile ID
                                    </th>
                                    <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6 text-right">
                                        <span class="sr-only">Actions</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-slate-200">
                                <tr v-for="doc in documentTypes" :key="doc.id"
                                    class="hover:bg-blue-50/30 transition-colors duration-200">
                                    <td class="px-6 py-4 whitespace-nowrap text-slate-900">{{ doc.id }}</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-slate-700">{{ doc.document }}</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-slate-700">{{ doc.document_type }}</td>
                                    <td class="px-6 py-4 whitespace-nowrap text-slate-700">{{ doc.institution_profile }}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                        <div class="flex justify-end gap-2">
                                            <button @click="editDocumentType(doc)"
                                                class="p-2 text-blue-600 hover:bg-blue-50 rounded-md">
                                                <svg class="w-4 h-4" fill="none" stroke="currentColor"
                                                    viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        stroke-width="2"
                                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                </svg>
                                            </button>
                                            <button @click="openDeleteModal(doc)"
                                                class="p-2 text-red-600 hover:bg-red-50 rounded-md">
                                                <svg class="w-4 h-4" fill="none" stroke="currentColor"
                                                    viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        stroke-width="2"
                                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                <tr v-if="documentTypes.length === 0">
                                    <td colspan="5" class="px-6 py-4 text-center text-slate-500">
                                        No document types found
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- Delete Confirmation Modal -->
            <AlertDialogRoot :open="showDeleteModal" @update:open="showDeleteModal = $event">
                <AlertDialogContent
                    class="fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-lg bg-white p-6 shadow-lg focus:outline-none z-50">
                    <AlertDialogTitle class="text-xl font-semibold text-slate-900 mb-2">
                        Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription class="text-slate-600 mb-6">
                        This action cannot be undone. This will permanently delete the document type
                        "{{ documentToDelete?.document }}".
                    </AlertDialogDescription>
                    <div class="flex justify-end gap-4">
                        <AlertDialogCancel class="px-4 py-2 rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200"
                            @click="closeDeleteModal">
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction class="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
                            @click="deleteDocumentType">
                            Delete
                        </AlertDialogAction>
                    </div>
                </AlertDialogContent>
                <AlertDialogOverlay class="fixed inset-0 bg-black/50 z-40" />
            </AlertDialogRoot>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/services'
import {
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogOverlay,
    AlertDialogRoot,
    AlertDialogTitle,
} from 'radix-vue';

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
const isDeleteModalOpen = ref(false);
const documentToDelete = ref(null);

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

const openDeleteModal = (doc) => {
    documentToDelete.value = doc;
    isDeleteModalOpen.value = true;
};

const closeDeleteModal = () => {
    isDeleteModalOpen.value = false;
    documentToDelete.value = null;
};


const confirmDelete = (id) => {
    deleteId.value = id
    showDeleteModal.value = true
}

const deleteDocumentType = async () => {
    if (!documentToDelete.value) return;
    try {
        await api.deleteProfileDocument(documentToDelete.value.id)
        const index = documentTypes.value.findIndex(doctype => doctype.id === documentToDelete.value.id);
        if (index !== -1) {
            documentTypes.value.splice(index, 1);
        }
        closeDeleteModal();
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

<style scoped></style>