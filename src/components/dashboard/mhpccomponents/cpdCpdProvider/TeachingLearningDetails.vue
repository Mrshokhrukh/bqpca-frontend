<template>
    <div class="border-b border-gray-200 bg-gray-50 p-6 rounded-t-xl mt-8">
        <h3 class="text-lg font-semibold text-gray-900">Teaching Learning Method</h3>
        <p class="mt-1 text-sm text-gray-500">Details about the teaching and learning methods.</p>
    </div>

    <div class="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="col-span-1">
            <label for="cpdType" class="block text-sm font-medium text-gray-700">
                Type of CPD <span class="text-red-600">*</span>
            </label>
            <select id="cpdType" :value="modelValue.cpdType"
                @change="updateField('cpdType', $event.target.value)"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500 p-2.5">
                <option value="" disabled>Select Type</option>
                <option v-for="type in cpdTypes" :key="type.value" :value="type.value">
                    {{ type.text }}
                </option>
            </select>
            <div v-if="loading" class="mt-1 text-sm text-blue-600">
                Loading CPD types...
            </div>
        </div>

        <div class="col-span-1">
            <label class="block text-sm font-medium text-gray-700">
                Methodologies <span class="text-red-600">*</span>
            </label>
            <div class="mt-2">
                <div v-for="method in methodologies" :key="method.value" class="flex items-center mb-2">
                    <input type="checkbox" :id="`method-${method.value}`"
                        :value="method.value"
                        :checked="isMethodSelected(method.value)"
                        @change="toggleMethodology(method.value)"
                        class="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded" />
                    <label :for="`method-${method.value}`" class="ml-2 block text-sm text-gray-700">
                        {{ method.text }}
                    </label>
                </div>
            </div>
            <div v-if="loading" class="mt-1 text-sm text-blue-600">
                Loading methodologies...
            </div>
        </div>

        <div class="col-span-1">
            <label for="expectedOutcome" class="block text-sm font-medium text-gray-700">
                Expected Outcome <span class="text-red-600">*</span>
            </label>
            <textarea id="expectedOutcome" :value="modelValue.expectedOutcome"
                @input="updateField('expectedOutcome', $event.target.value)"
                rows="4"
                class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500 p-2.5"></textarea>
        </div>

        <div class="col-span-2">
            <h4 class="text-md font-medium mb-2">Learning Activities and Duration</h4>
            <div v-for="(activity, index) in activities" :key="index" class="flex space-x-4 mb-4">
                <div class="flex-1">
                    <label :for="`activity-${index}`" class="block text-sm font-medium text-gray-700">
                        Activity <span class="text-red-600">*</span>
                    </label>
                    <input type="text" :id="`activity-${index}`" v-model="activity.activity"
                        class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500 p-2.5" />
                </div>
                <div class="flex-1">
                    <label :for="`duration-${index}`" class="block text-sm font-medium text-gray-700">
                        Duration in Hours <span class="text-red-600">*</span>
                    </label>
                    <input type="number" :id="`duration-${index}`" v-model.number="activity.durationHours"
                        @input="calculateCredit"
                        min="0" step="0.5"
                        class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500 p-2.5" />
                </div>
                <button v-if="activities.length > 1" @click="removeActivity(index)"
                    class="mt-6 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                    Remove
                </button>
            </div>
            <button @click="addActivity"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Add Activity
            </button>

            <div class="mt-4 p-3 bg-blue-50 rounded-lg">
                <p class="font-medium">Total Hours: {{ totalHours }}</p>
                <p>Calculated CPD Credits: {{ calculatedCredits }}</p>
            </div>
        </div>

        <div class="col-span-1">
            <label for="courseDocument" class="block text-sm font-medium text-gray-700">
                Course Document <span class="text-red-600">*</span>
            </label>
            <input type="file" id="courseDocument" accept=".pdf,.doc,.docx"
                @change="handleFileUpload"
                class="mt-1 block w-full text-sm text-gray-500
                       file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0
                       file:text-sm file:font-semibold file:bg-green-50
                       file:text-green-700 hover:file:bg-green-100" />
            <p class="text-xs text-gray-500 mt-1">Accepted file formats: PDF, DOC, DOCX (max 5MB)</p>
            <div v-if="documentFileName" class="mt-2 text-sm text-green-600">
                Selected file: {{ documentFileName }}
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import apiservice from '@/services/mhpcservices';
import { useToast } from 'vue-toastification';

const props = defineProps({
    modelValue: {
        type: Object,
        required: true
    }
});

const emit = defineEmits(['update:modelValue', 'credits-calculated']);
const toast = useToast();

// Local state
const cpdTypes = ref([]);
const methodologies = ref([]);
const selectedMethodologies = ref(props.modelValue.methodologies || []);
const activities = ref(props.modelValue.activities && props.modelValue.activities.length ?
    [...props.modelValue.activities] :
    [{ activity: '', durationHours: 0 }]);
const documentFileName = ref('');
const loading = ref(false);

// Computed properties
const totalHours = computed(() => {
    return activities.value.reduce((total, item) => {
        return total + (Number(item.durationHours) || 0);
    }, 0);
});

const calculatedCredits = computed(() => {
    // Simple calculation: 1 credit per hour, rounded to nearest 0.5
    const credits = totalHours.value;
    return Math.round(credits * 2) / 2; // Round to nearest 0.5
});

// Methods
const updateField = (field, value) => {
    emit('update:modelValue', {
        ...props.modelValue,
        [field]: value
    });
};

const isMethodSelected = (methodId) => {
    return selectedMethodologies.value.includes(methodId);
};

const toggleMethodology = (methodId) => {
    const selected = [...selectedMethodologies.value];

    if (selected.includes(methodId)) {
        // Remove if already selected
        const index = selected.indexOf(methodId);
        selected.splice(index, 1);
    } else {
        // Add if not selected
        selected.push(methodId);
    }

    selectedMethodologies.value = selected;
    updateField('methodologies', selected);
};

const addActivity = () => {
    activities.value.push({ activity: '', durationHours: 0 });
};

const removeActivity = (index) => {
    activities.value.splice(index, 1);
    calculateCredit();
};

const calculateCredit = () => {
    // Update the parent component with the new activities and hours
    updateField('activities', activities.value);
    updateField('totalHours', totalHours.value);
    updateField('credit', calculatedCredits.value);

    // Notify parent about the calculated credits
    emit('credits-calculated', calculatedCredits.value);
};

const handleFileUpload = (event) => {
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

    documentFileName.value = file.name;
    updateField('courseDocument', file);
};

// API calls
const fetchCpdTypes = async () => {
    try {
        loading.value = true;
        const response = await apiservice.getMhpcMastersCpdActivities();

        if (response.data && response.data.results) {
            cpdTypes.value = response.data.results.map(type => ({
                value: type.id.toString(),
                text: type.cpd_activity_name
            }));
        }
    } catch (error) {
        console.error('Error fetching CPD types:', error);
        toast.error('Failed to load CPD types');
    } finally {
        loading.value = false;
    }
};

const fetchMethodologies = async () => {
    try {
        loading.value = true;
        const response = await apiservice.getMhpcMastersCpdMethodologies();

        if (response.data && response.data.results) {
            methodologies.value = response.data.results.map(method => ({
                value: method.id.toString(),
                text: method.methodology_name
            }));
        }
    } catch (error) {
        console.error('Error fetching methodologies:', error);
        toast.error('Failed to load methodologies');
    } finally {
        loading.value = false;
    }
};

// Watch for changes
watch(activities, () => {
    calculateCredit();
}, { deep: true });

// Initialize
onMounted(() => {
    fetchCpdTypes();
    fetchMethodologies();
});
</script>
