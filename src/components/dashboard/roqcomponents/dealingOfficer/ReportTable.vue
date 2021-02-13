<template>
    <div class="p-4">
        <!-- Header with Export Button -->
        <div class="flex justify-between items-center mb-4">
            <h1 class="text-2xl font-bold text-gray-900">Application Reports</h1>
            <button @click="downloadReport"
                class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                <i class="pi pi-download mr-2"></i>
                Export Report
            </button>
        </div>

        <!-- Quick Stats -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div v-for="(stat, index) in statsArray" :key="index"
                class="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div class="flex items-center justify-between mb-2">
                    <span class="text-sm font-medium text-gray-500">{{ stat.label }}</span>
                    <component :is="stat.icon" class="w-4 h-4 text-gray-500" />
                </div>
                <p class="text-2xl font-bold">{{ stat.value }}</p>
            </div>
        </div>

        <!-- Applications Table -->
        <div class="bg-white rounded-lg shadow-sm">
            <div class="p-4 border-b border-gray-200">
                <div class="flex justify-between items-center">
                    <h2 class="text-lg font-semibold">Applications List</h2>
                    <div class="relative">
                        <input type="text" v-model="searchQuery" placeholder="Search..."
                            class="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <i class="pi pi-search absolute left-3 top-3 text-gray-400"></i>
                    </div>
                </div>
            </div>

            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th v-for="header in tableHeaders" :key="header.key"
                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                @click="sortBy(header.key)">
                                {{ header.label }}
                                <i v-if="sortKey === header.key"
                                    :class="['pi', sortOrder === 'asc' ? 'pi-sort-up' : 'pi-sort-down', 'ml-1']">
                                </i>
                            </th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-for="app in paginatedData" :key="app.id" class="hover:bg-gray-50">
                            <td class="px-6 py-4 whitespace-nowrap">{{ app.id }}</td>
                            <td class="px-6 py-4 whitespace-nowrap">{{ app.applicant_name }}</td>
                            <td class="px-6 py-4 whitespace-nowrap">{{ app.cid }}</td>
                            <td class="px-6 py-4 whitespace-nowrap">{{ formatDate(app.submission_date) }}</td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span :class="getStatusClass(app.status)">
                                    {{ app.status }}
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">{{ calculateProcessingDays(app) }} days</td>
                            <td class="px-6 py-4 whitespace-nowrap">{{ app.course_type }}</td>
                            <td class="px-6 py-4">
                                <div class="truncate max-w-xs" :title="app.remarks">
                                    {{ app.remarks || '-' }}
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Pagination -->
            <div class="px-4 py-3 border-t border-gray-200">
                <div class="flex items-center justify-between">
                    <div class="text-sm text-gray-700">
                        Showing {{ startIndex + 1 }} to {{ endIndex }} of {{ filteredData.length }} entries
                    </div>
                    <div class="flex gap-2">
                        <button @click="previousPage" :disabled="currentPage === 1" class="px-3 py-1 border rounded"
                            :class="currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''">
                            Previous
                        </button>
                        <button @click="nextPage" :disabled="currentPage === totalPages"
                            class="px-3 py-1 border rounded"
                            :class="currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''">
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useToast } from 'vue-toastification';
import { Clock, CheckCircle, XCircle, Hourglass } from 'lucide-vue-next';
import { format } from 'date-fns';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import apiService from '@/services/services';

const toast = useToast();

// Table headers configuration
const tableHeaders = [
    { key: 'id', label: 'Application ID' },
    { key: 'applicant_name', label: 'Applicant Name' },
    { key: 'cid', label: 'CID' },
    { key: 'submission_date', label: 'Submission Date' },
    { key: 'status', label: 'Status' },
    { key: 'processing_time', label: 'Processing Time' },
    { key: 'course_type', label: 'Course Type' },
    { key: 'remarks', label: 'Remarks' }
];

// State
const applications = ref([]);
const searchQuery = ref('');
const loading = ref(true);
const currentPage = ref(1);
const itemsPerPage = ref(10);
const sortKey = ref('id');
const sortOrder = ref('asc');

// Computed properties
const stats = computed(() => ({
    pending: applications.value.filter(app => app.status === 'pending').length,
    processing: applications.value.filter(app => app.status === 'processing').length,
    approved: applications.value.filter(app => app.status === 'approved').length,
    regretted: applications.value.filter(app => app.status === 'regretted').length
}));

const statsArray = computed(() => [
    { label: 'Pending Applications', value: stats.value.pending, icon: Clock },
    { label: 'Processing Applications', value: stats.value.processing, icon: Hourglass },
    { label: 'Approved', value: stats.value.approved, icon: CheckCircle },
    { label: 'Regretted', value: stats.value.regretted, icon: XCircle }
]);

const filteredData = computed(() => {
    let filtered = [...applications.value];

    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        filtered = filtered.filter(app =>
            String(app.id).toLowerCase().includes(query) ||
            app.applicant_name?.toLowerCase().includes(query) ||
            app.cid?.toLowerCase().includes(query) ||
            app.status?.toLowerCase().includes(query) ||
            app.course_type?.toLowerCase().includes(query) ||
            app.remarks?.toLowerCase().includes(query)
        );
    }

    // Sort the filtered data
    return filtered.sort((a, b) => {
        let aValue = a[sortKey.value];
        let bValue = b[sortKey.value];

        if (sortKey.value === 'submission_date') {
            aValue = new Date(aValue);
            bValue = new Date(bValue);
        }

        if (aValue < bValue) return sortOrder.value === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortOrder.value === 'asc' ? 1 : -1;
        return 0;
    });
});

const totalPages = computed(() => Math.ceil(filteredData.value.length / itemsPerPage.value));

const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value);

const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage.value, filteredData.value.length));

const paginatedData = computed(() => {
    return filteredData.value.slice(startIndex.value, endIndex.value);
});

// Methods
const sortBy = (key) => {
    if (sortKey.value === key) {
        sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
    } else {
        sortKey.value = key;
        sortOrder.value = 'asc';
    }
};

const previousPage = () => {
    if (currentPage.value > 1) {
        currentPage.value--;
    }
};

const nextPage = () => {
    if (currentPage.value < totalPages.value) {
        currentPage.value++;
    }
};

const calculateProcessingDays = (application) => {
    const submissionDate = new Date(application.submission_date);
    const completionDate = application.completion_date ?
        new Date(application.completion_date) : new Date();
    const diffTime = Math.abs(completionDate - submissionDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const formatDate = (date) => {
    return format(new Date(date), 'MMM dd, yyyy');
};

const getStatusClass = (status) => {
    const classes = {
        approved: 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800',
        regretted: 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800',
        pending: 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800',
        processing: 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800'
    };
    return classes[status] || 'inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800';
};

const downloadReport = () => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(20);
    doc.text('Applications Report', 14, 22);
    doc.setFontSize(12);
    doc.text(`Generated on ${format(new Date(), 'MMMM dd, yyyy')}`, 14, 32);

    // Add statistics
    doc.setFontSize(16);
    doc.text('Summary', 14, 45);
    doc.setFontSize(12);
    let yPos = 55;
    Object.entries(stats.value).forEach(([key, value]) => {
        doc.text(`${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`, 14, yPos);
        yPos += 10;
    });

    // Add applications table
    doc.autoTable({
        startY: yPos + 10,
        head: [['Application ID', 'Applicant Name', 'CID', 'Submission Date', 'Status', 'Processing Time', 'Course Type', 'Remarks']],
        body: applications.value.map(app => [
            app.id,
            app.applicant_name,
            app.cid,
            formatDate(app.submission_date),
            app.status,
            `${calculateProcessingDays(app)} days`,
            app.course_type,
            app.remarks || '-'
        ]),
        theme: 'striped',
        headStyles: { fillColor: [59, 130, 246] },
        columnStyles: {
            0: { cellWidth: 25 },
            1: { cellWidth: 30 },
            2: { cellWidth: 25 },
            3: { cellWidth: 25 },
            4: { cellWidth: 20 },
            5: { cellWidth: 25 },
            6: { cellWidth: 25 },
            7: { cellWidth: 'auto' }
        }
    });

    // Save the PDF
    doc.save(`applications_report_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
    toast.success('Report downloaded successfully');
};

// Fetch Data
const fetchApplications = async () => {
    try {
        loading.value = true;
        const response = await apiService.getRecognitionOfQualifications();
        applications.value = response.data.results;
    } catch (error) {
        console.error('Error fetching applications:', error);
        toast.error('Failed to load applications');
    } finally {
        loading.value = false;
    }
};

// Lifecycle hooks
onMounted(() => {
    fetchApplications();
});
</script>