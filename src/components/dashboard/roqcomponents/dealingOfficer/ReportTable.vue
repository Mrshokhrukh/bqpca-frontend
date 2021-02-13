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
                            class="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                        <i class="pi pi-search absolute left-3 top-3 text-gray-400"></i>
                    </div>
                </div>
            </div>

            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th v-for="header in TABLE_HEADERS" :key="header.key"
                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                @click="sortBy(header.key)">
                                {{ header.label }}
                                <i v-if="sortKey === header.key" :class="[
                                    'pi',
                                    sortOrder === 'asc' ? 'pi-sort-up' : 'pi-sort-down',
                                    'ml-1',
                                ]"></i>
                            </th>
                        </tr>
                    </thead>
                    <tbody v-if="applications.length" class="bg-white divide-y divide-gray-200">
                        <tr v-for="app in paginatedData" :key="app.id" class="hover:bg-gray-50">
                            <td class="px-6 py-4 whitespace-nowrap">{{ app.id }}</td>
                            <td class="px-6 py-4 whitespace-nowrap">{{ app.applicants_name }}</td>
                            <td class="px-6 py-4 whitespace-nowrap">{{ app.cid_no || '-' }}</td>
                            <td class="px-6 py-4 whitespace-nowrap">{{ formatDate(app.created_at) }}</td>
                            <td class="px-6 py-4 whitespace-nowrap">
                                <span :class="getStatusClass(app.status)">
                                    <span class="flex items-center">
                                        <span class="h-2 w-2 rounded-full"
                                            :class="getStatusDotClass(app.status)"></span>
                                        <span class="ml-2">{{ formatStatus(app.status) }}</span>
                                    </span>
                                </span>
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap">{{ calculateProcessingDays(app) }} days</td>
                            <td class="px-6 py-4 whitespace-nowrap">{{ app.course_title }}</td>
                            <td class="px-6 py-4">
                                <div class="truncate max-w-xs" :title="app.remarks">{{ app.remarks || "-" }}</div>
                            </td>
                        </tr>
                    </tbody>
                    <tbody v-else>
                        <tr>
                            <td colspan="8" class="px-6 py-4 text-center text-gray-500">
                                No applications found
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Pagination -->
            <div class="px-4 py-3 border-t border-gray-200">
                <div class="flex items-center justify-between">
                    <div class="text-sm text-gray-700">
                        Showing {{ startIndex + 1 }} to {{ endIndex }} of {{ totalItems }} entries
                    </div>
                    <div class="flex items-center space-x-4">
                        <div class="flex items-center space-x-2">
                            <select v-model="itemsPerPage" class="px-3 py-1 rounded-md text-sm border border-gray-300"
                                @change="handlePerPageChange">
                                <option :value="10">10 / page</option>
                                <option :value="25">25 / page</option>
                                <option :value="50">50 / page</option>
                            </select>
                        </div>
                        <div class="flex items-center space-x-2">
                            <button @click="previousPage" :disabled="currentPage === 1"
                                class="px-3 py-1 rounded-md text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                                Previous
                            </button>
                            <button @click="nextPage" :disabled="currentPage === totalPages"
                                class="px-3 py-1 rounded-md text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Loading indicator -->
        <div v-if="loading" class="fixed inset-0 bg-gray-100 bg-opacity-50 flex items-center justify-center">
            <i class="pi pi-spin pi-spinner text-blue-500 text-4xl"></i>
        </div>
    </div>
</template>


<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useToast } from "vue-toastification";
import { Clock, CheckCircle, XCircle, Hourglass } from "lucide-vue-next";
import { format, isValid, parseISO } from "date-fns";
import jsPDF from "jspdf";
import "jspdf-autotable";
import apiService from "@/services/services";
import { useAuthStore } from '@/stores/authStore';

const toast = useToast();
const { userId } = useAuthStore();

// Constants
const TABLE_HEADERS = [
    { key: "id", label: "Application ID" },
    { key: "applicants_name", label: "Applicant Name" },
    { key: "cid_no", label: "CID" },
    { key: "created_at", label: "Submission Date" },
    { key: "status", label: "Status" },
    { key: "processing_time", label: "Processing Time" },
    { key: "course_title", label: "Course Type" },
    { key: "remarks", label: "Remarks" },
];

const STATUS_CLASSES = {
    draft: "inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800",
    applied: "inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800",
    processing: "inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800",
    under_review: "inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800",
    approved: "inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800",
    regretted: "inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800",
    reprocess: "inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800",
    reupload: "inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-800",
};

const STATUS_DOT_CLASSES = {
    draft: 'bg-gray-600',
    applied: 'bg-blue-600',
    processing: 'bg-yellow-600',
    under_review: 'bg-purple-600',
    approved: 'bg-green-600',
    regretted: 'bg-red-600',
    reprocess: 'bg-orange-600',
    reupload: 'bg-indigo-600',
};

// State
const applications = ref([]);
const searchQuery = ref("");
const loading = ref(false);
const currentPage = ref(1);
const itemsPerPage = ref(10);
const sortKey = ref("id");
const sortOrder = ref("asc");
const totalItems = ref(0);
const error = ref(null);

// Computed Properties
const stats = computed(() => {
    try {
        const apps = applications.value || [];
        return {
            pending: apps.filter(app => app?.status === "applied").length,
            processing: apps.filter(app => app?.status === "processing").length,
            approved: apps.filter(app => app?.status === "approved").length,
            regretted: apps.filter(app => app?.status === "regretted").length
        };
    } catch (err) {
        console.error('Error calculating stats:', err);
        return { pending: 0, processing: 0, approved: 0, regretted: 0 };
    }
});

const statsArray = computed(() => [
    { label: "Pending Applications", value: stats.value.pending, icon: Clock },
    { label: "Processing Applications", value: stats.value.processing, icon: Hourglass },
    { label: "Approved", value: stats.value.approved, icon: CheckCircle },
    { label: "Regretted", value: stats.value.regretted, icon: XCircle }
]);

const totalPages = computed(() => Math.max(1, Math.ceil(totalItems.value / itemsPerPage.value)));
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value);
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage.value, totalItems.value));
const paginatedData = computed(() => applications.value);

// Methods
const fetchApplications = async () => {
    try {
        error.value = null;
        loading.value = true;

        const params = {
            page: currentPage.value,
            limit: itemsPerPage.value,
            search: searchQuery.value || undefined,
            ordering: sortOrder.value === 'asc' ? sortKey.value : `-${sortKey.value}`,
            user_id: userId.value,
        };

        const response = await apiService.getRecognitionOfQualifications(params);

        if (response?.data) {
            applications.value = response.data.results;
            totalItems.value = response.data.count || 0;
        } else {
            throw new Error('Invalid response format');
        }
    } catch (err) {
        console.error("Error fetching applications:", err);
        error.value = err.response?.data?.detail ||
            err.response?.data?.message ||
            'Failed to load applications. Please try again.';
        toast.error(error.value);
        applications.value = [];
        totalItems.value = 0;
    } finally {
        loading.value = false;
    }
};

const sortBy = (key) => {
    if (sortKey.value === key) {
        sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
    } else {
        sortKey.value = key;
        sortOrder.value = "asc";
    }
    fetchApplications();
};

const formatDate = (dateString) => {
    try {
        if (!dateString) return '-';

        let date = parseISO(dateString);
        if (!isValid(date)) {
            date = new Date(dateString);
            if (isNaN(date.getTime())) {
                return '-';
            }
        }

        return format(date, 'MMM dd, yyyy');
    } catch (err) {
        console.error('Error formatting date:', err);
        return '-';
    }
};

const calculateProcessingDays = (application) => {
    try {
        const submissionDate = new Date(application.created_at);
        const completionDate = application.completion_date
            ? new Date(application.completion_date)
            : new Date();

        if (isNaN(submissionDate.getTime())) {
            return 0;
        }

        const diffTime = Math.abs(completionDate - submissionDate);
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    } catch (err) {
        console.error('Error calculating processing days:', err);
        return 0;
    }
};

const getStatusClass = (status) => {
    return STATUS_CLASSES[status?.toLowerCase()] ||
        "inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800";
};

const getStatusDotClass = (status) => {
    return STATUS_DOT_CLASSES[status?.toLowerCase()] || 'bg-gray-600';
};

const formatStatus = (status) => {
    if (!status) return '';
    return status
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

const downloadReport = async () => {
    try {
        // Create PDF document in landscape mode
        const doc = new jsPDF('landscape');

        // Header
        doc.setFillColor(37, 99, 235);
        doc.rect(0, 0, 297, 35, 'F');

        // Logo
        doc.setFillColor(255, 255, 255);
        doc.circle(25, 17, 6, 'F');

        // Title
        doc.setFont("helvetica", "bold");
        doc.setFontSize(22);
        doc.setTextColor(255, 255, 255);
        doc.text("Applications Report", 40, 20);

        // Date
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.text(`Generated: ${format(new Date(), "MMMM dd, yyyy, HH:mm")}`,
            doc.internal.pageSize.width - 15, 20, { align: 'right' });

        // Summary cards - made more compact
        const summaryY = 45;
        const cardSpacing = 8;
        const cardWidth = 55;
        const cardHeight = 35;

        const statusCards = [
            { label: 'Pending', value: stats.value.pending, color: '#6B7280', bgColor: '#F3F4F6' },
            { label: 'Processing', value: stats.value.processing, color: '#2563EB', bgColor: '#EFF6FF' },
            { label: 'Approved', value: stats.value.approved, color: '#059669', bgColor: '#ECFDF5' },
            { label: 'Regretted', value: stats.value.regretted, color: '#DC2626', bgColor: '#FEF2F2' }
        ];

        statusCards.forEach((card, index) => {
            const x = 15 + (cardWidth + cardSpacing) * index;

            // Card background
            doc.setFillColor(hexToRgb(card.bgColor).r, hexToRgb(card.bgColor).g, hexToRgb(card.bgColor).b);
            doc.roundedRect(x, summaryY, cardWidth, cardHeight, 2, 2, 'F');

            // Card content
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            doc.setTextColor(71, 85, 105);
            doc.text(card.label, x + 6, summaryY + 12);

            doc.setFont("helvetica", "bold");
            doc.setFontSize(18);
            doc.setTextColor(hexToRgb(card.color).r, hexToRgb(card.color).g, hexToRgb(card.color).b);
            doc.text(card.value.toString(), x + 6, summaryY + 28);
        });

        // Applications table
        doc.autoTable({
            startY: summaryY + cardHeight + 10,
            head: [TABLE_HEADERS.map(header => header.label)],
            body: applications.value.map(app => [
                app.id,
                app.applicants_name,
                app.cid_no || '-',
                formatDate(app.created_at),
                formatStatus(app.status),
                `${calculateProcessingDays(app)} days`,
                app.course_title,
                app.remarks || "-"
            ]),
            theme: 'grid',
            headStyles: {
                fillColor: [37, 99, 235],
                textColor: [255, 255, 255],
                fontSize: 10,
                fontStyle: 'bold',
                cellPadding: { top: 8, bottom: 8, left: 6, right: 6 },
                halign: 'left',
                valign: 'middle'
            },
            bodyStyles: {
                fontSize: 9,
                textColor: [71, 85, 105],
                cellPadding: { top: 6, bottom: 6, left: 6, right: 6 },
                lineColor: [226, 232, 240],
                lineWidth: 0.2
            },
            columnStyles: {
                0: { cellWidth: 20 },     // ID
                1: { cellWidth: 35 },     // Name
                2: { cellWidth: 30 },     // CID
                3: { cellWidth: 30 },     // Date
                4: { cellWidth: 30 },     // Status
                5: { cellWidth: 25 },     // Processing Time
                6: { cellWidth: 45 },     // Course Type
                7: { cellWidth: 'auto' }  // Remarks
            },
            alternateRowStyles: {
                fillColor: [249, 250, 251]
            },
            didDrawCell: function (data) {
                if (data.column.index === 4 && data.cell.section === 'body') {
                    const status = data.cell.raw.toLowerCase();
                    let statusStyle;
                    switch (status) {
                        case 'processing':
                            statusStyle = { bg: '#EFF6FF', text: '#2563EB' };
                            break;
                        case 'approved':
                            statusStyle = { bg: '#ECFDF5', text: '#059669' };
                            break;
                        case 'regretted':
                            statusStyle = { bg: '#FEF2F2', text: '#DC2626' };
                            break;
                        default:
                            statusStyle = { bg: '#F3F4F6', text: '#6B7280' };
                    }

                    const x = data.cell.x + 2;
                    const y = data.cell.y + 2;
                    const width = data.column.width - 4;
                    const height = data.row.height - 4;

                    // Status badge
                    doc.setFillColor(hexToRgb(statusStyle.bg).r, hexToRgb(statusStyle.bg).g, hexToRgb(statusStyle.bg).b);
                    doc.roundedRect(x, y, width, height, 2, 2, 'F');

                    // Status text
                    doc.setTextColor(hexToRgb(statusStyle.text).r, hexToRgb(statusStyle.text).g, hexToRgb(statusStyle.text).b);
                    doc.setFont("helvetica", "bold");
                    doc.setFontSize(9);
                    doc.text(formatStatus(status), x + width / 2, y + height / 2 + 1,
                        { align: 'center', baseline: 'middle' });
                }
            },
            didDrawPage: function (data) {
                // Footer
                const footerY = doc.internal.pageSize.height - 10;

                doc.setTextColor(148, 163, 184);
                doc.setFontSize(8);
                doc.setFont("helvetica", "normal");
                doc.text(
                    `Total Records: ${applications.value.length}`,
                    15,
                    footerY
                );
                doc.text(
                    `Page ${data.pageNumber} of ${doc.internal.getNumberOfPages()}`,
                    doc.internal.pageSize.width - 15,
                    footerY,
                    { align: 'right' }
                );
            },
            margin: { top: 40, right: 15, bottom: 15, left: 15 },
            showHead: 'everyPage'
        });

        // Save the PDF
        const fileName = `applications_report_${format(new Date(), "yyyy-MM-dd")}.pdf`;
        doc.save(fileName);
        toast.success("Report downloaded successfully");
    } catch (err) {
        console.error('Error generating PDF:', err);
        toast.error("Failed to generate report. Please try again.");
    }
};

// Utility function to convert hex to RGB
const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
};

const previousPage = () => {
    if (currentPage.value > 1) {
        currentPage.value--;
        fetchApplications();
    }
};

const nextPage = () => {
    if (currentPage.value < totalPages.value) {
        currentPage.value++;
        fetchApplications();
    }
};

const handlePerPageChange = () => {
    currentPage.value = 1;
    fetchApplications();
};

// Watchers
watch(searchQuery, () => {
    currentPage.value = 1;
    fetchApplications();
});

// Lifecycle hooks
onMounted(() => {
    fetchApplications();
});
</script>

<style scoped>
.pi-sort-up::before {
    content: "↑";
}

.pi-sort-down::before {
    content: "↓";
}

.pi-search::before {
    content: "🔍";
}

.pi-download::before {
    content: "↓";
}

.pi-spin::before {
    content: "◌";
    animation: spin 1s linear infinite;
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}
</style>