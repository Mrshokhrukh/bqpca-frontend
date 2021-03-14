<template>
    <div class="border-b border-gray-200 bg-gray-50 p-6 rounded-t-xl mt-8">
        <h3 class="text-lg font-semibold text-gray-900">Participant Details</h3>
        <p class="mt-1 text-sm text-gray-500">Details about the participants for this CPD.</p>
    </div>

    <div class="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="col-span-1">
            <label for="participationCategory" class="block text-sm font-medium text-gray-700">
                Participation Category <span class="text-red-600">*</span>
            </label>
            <select id="participationCategory" :value="modelValue.participationCategory"
                @change="updateCategory($event.target.value)"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500 p-2.5">
                <option value="" disabled>Select Category</option>
                <option v-for="category in categories" :key="category.value" :value="category.value">
                    {{ category.text }}
                </option>
            </select>
            <div v-if="loading" class="mt-1 text-sm text-blue-600">
                Loading categories...
            </div>
        </div>

        <div class="col-span-1">
            <label for="participantSubCategory" class="block text-sm font-medium text-gray-700">
                Participant Sub-category <span class="text-red-600">*</span>
            </label>
            <select id="participantSubCategory" :value="modelValue.participantSubCategory"
                @change="updateField('participantSubCategory', $event.target.value)"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500 p-2.5">
                <option value="" disabled>Select Sub-category</option>
                <option v-for="subcategory in filteredSubcategories" :key="subcategory.value" :value="subcategory.value">
                    {{ subcategory.text }}
                </option>
            </select>
            <div v-if="loading" class="mt-1 text-sm text-blue-600">
                Loading subcategories...
            </div>
        </div>

        <div class="col-span-1">
            <label for="numberOfParticipants" class="block text-sm font-medium text-gray-700">
                Number of Participants <span class="text-red-600">*</span>
            </label>
            <input type="number" id="numberOfParticipants" :value="modelValue.numberOfParticipants"
                @input="updateField('numberOfParticipants', Number($event.target.value))"
                min="1"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500 p-2.5" />
        </div>

        <div class="col-span-1">
            <label for="relevanceProfession" class="block text-sm font-medium text-gray-700">
                Relevance to profession <span class="text-red-600">*</span>
            </label>
            <textarea id="relevanceProfession" :value="modelValue.relevanceProfession"
                @input="updateField('relevanceProfession', $event.target.value)"
                rows="4"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500 p-2.5"></textarea>
        </div>

        <div class="col-span-1" v-if="isCpdApproved">
            <label for="attachment" class="block text-sm font-medium text-gray-700">
                Attachment <span class="text-red-600">*</span>
            </label>
            <input type="file" id="attachment" accept=".pdf,.doc,.docx"
                @change="handleFileUpload"
                class="mt-1 block w-full text-sm text-gray-500 
                       file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 
                       file:text-sm file:font-semibold file:bg-green-50 
                       file:text-green-700 hover:file:bg-green-100" />
            <p class="text-xs text-gray-500 mt-1">Accepted file formats: PDF, DOC, DOCX (max 5MB)</p>
            <div v-if="attachmentFileName" class="mt-2 text-sm text-green-600">
                Selected file: {{ attachmentFileName }}
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import apiservice from '@/services/bmhcservices';
import { useToast } from 'vue-toastification';

const props = defineProps({
    modelValue: {
        type: Object,
        required: true,
        default: () => ({
            participationCategory: '',
            participantSubCategory: '',
            numberOfParticipants: 0,
            relevanceProfession: '',
            attachment: null
        })
    },
    isCpdApproved: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['update:modelValue']);
const toast = useToast();

// Local state
const categories = ref([]);
const subcategories = ref([]);
const attachmentFileName = ref('');
const loading = ref(false);

// Computed properties
const filteredSubcategories = computed(() => {
    if (!props.modelValue?.participationCategory) return [];
    
    return subcategories.value.filter(subcategory => 
        subcategory.categoryId === props.modelValue.participationCategory
    );
});

// Methods
const updateField = (field, value) => {
    if (!props.modelValue) return;
    
    emit('update:modelValue', {
        ...props.modelValue,
        [field]: value
    });
};

const updateCategory = (categoryId) => {
    if (!props.modelValue) return;
    
    // When category changes, reset subcategory
    emit('update:modelValue', {
        ...props.modelValue,
        participationCategory: categoryId,
        participantSubCategory: '' // Reset subcategory when category changes
    });
};

const handleFileUpload = (event) => {
    if (!props.modelValue) return;
    
    const file = event.target.files[0];
    if (!file) return;
    
    // Validate file type and size
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    if (!validTypes.includes(file.type)) {
        toast.error('Please upload a PDF or Word document');
        event.target.value = '';
        return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB');
        event.target.value = '';
        return;
    }
    
    attachmentFileName.value = file.name;
    updateField('attachment', file);
};

// API calls
const fetchCategories = async () => {
    try {
        loading.value = true;
        const response = await apiservice.getMastersParticipationCategories();
        
        if (response.data && response.data.results) {
            categories.value = response.data.results.map(category => ({
                value: category.id.toString(),
                text: category.participation_category_name
            }));
        }
    } catch (error) {
        console.error('Error fetching participation categories:', error);
        toast.error('Failed to load participation categories');
    } finally {
        loading.value = false;
    }
};

const fetchSubcategories = async () => {
    try {
        loading.value = true;
        const response = await apiservice.getMastersParticipationSubCategories();
        
        if (response.data && response.data.results) {
            subcategories.value = response.data.results.map(subcategory => ({
                value: subcategory.id.toString(),
                text: subcategory.participation_sub_category_name,
                categoryId: subcategory.participation_category_name
            }));
        }
    } catch (error) {
        console.error('Error fetching participation subcategories:', error);
        toast.error('Failed to load participation subcategories');
    } finally {
        loading.value = false;
    }
};

// Initialize
onMounted(() => {
    fetchCategories();
    fetchSubcategories();
});
</script>