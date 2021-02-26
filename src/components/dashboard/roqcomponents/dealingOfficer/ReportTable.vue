<template>
    <div class="p-6">
        <!-- Header -->
        <div class="flex justify-between items-center mb-6">
            <h1 class="text-2xl font-bold text-gray-900">All ROQ Applications</h1>
            <div class="flex space-x-4">
                <button @click="exportToExcel"
                    class="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                    <i class="pi pi-file-excel mr-2"></i>
                    Export Excel
                </button>
                <button @click="downloadReport"
                    class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    <i class="pi pi-download mr-2"></i>
                    Export PDF
                </button>
            </div>
        </div>

        <!-- Stats Cards -->
        <div class="grid grid-cols-4 gap-6 mb-6">
            <div class="bg-white p-6 rounded-lg shadow-sm">
                <div class="flex items-center justify-between mb-2">
                    <span class="text-gray-600">Pending Applications</span>
                    <Clock class="w-5 h-5 text-gray-400" />
                </div>
                <div class="text-3xl font-semibold">{{ stats.pending }}</div>
            </div>
            <div class="bg-white p-6 rounded-lg shadow-sm">
                <div class="flex items-center justify-between mb-2">
                    <span class="text-gray-600">Processing Applications</span>
                    <Hourglass class="w-5 h-5 text-gray-400" />
                </div>
                <div class="text-3xl font-semibold">{{ stats.processing }}</div>
            </div>
            <div class="bg-white p-6 rounded-lg shadow-sm">
                <div class="flex items-center justify-between mb-2">
                    <span class="text-gray-600">Approved</span>
                    <CheckCircle class="w-5 h-5 text-gray-400" />
                </div>
                <div class="text-3xl font-semibold">{{ stats.approved }}</div>
            </div>
            <div class="bg-white p-6 rounded-lg shadow-sm">
                <div class="flex items-center justify-between mb-2">
                    <span class="text-gray-600">Regretted</span>
                    <XCircle class="w-5 h-5 text-gray-400" />
                </div>
                <div class="text-3xl font-semibold">{{ stats.regretted }}</div>
            </div>
        </div>

        <!-- Search Bar -->
        <div class="mb-6">
            <div class="relative max-w-md">
                <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i class="pi pi-search text-gray-400"></i>
                </span>
                <input type="text" v-model="searchQuery"
                    class="pl-10 pr-4 py-2 w-full border rounded-lg text-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Search..." />
            </div>
        </div>

        <!-- Table -->
        <div class="bg-white rounded-lg shadow-sm overflow-auto">
            <table class="min-w-full">
                <thead>
                    <tr class="border-b">
                        <th v-for="header in TABLE_HEADERS" :key="header.key"
                            class="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider cursor-pointer whitespace-nowrap"
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
                <tbody class="divide-y divide-gray-200">
                    <tr v-for="app in paginatedData" :key="app.id" class="hover:bg-gray-50">
                        <td class="px-6 py-4 text-sm">{{ app.id }}</td>
                        <td class="px-6 py-4 text-sm">{{ app.applicants_name }}</td>
                        <td class="px-6 py-4 text-sm">{{ app.cid_no || '-' }}</td>
                        <td class="px-6 py-4 text-sm">{{ app.qec_number || '-' }}</td>
                        <td class="px-6 py-4 text-sm">{{ app.course_title || '-' }}</td>
                        <td class="px-6 py-4 text-sm">{{ getModeOfDelivery(app) }}</td>
                        <td class="px-6 py-4 text-sm">{{ app.name_of_institute || '-' }}</td>
                        <td class="px-6 py-4 text-sm">{{ app.name_of_university || '-' }}</td>
                        <td class="px-6 py-4 text-sm">{{ app.country || '-' }}</td>
                        <td class="px-6 py-4 text-sm">{{ hasCompleteDocuments(app) ? 'Yes' : 'No' }}</td>
                        <td class="px-6 py-4">
                            <span :class="getStatusClass(app.status)">
                                <span class="flex items-center">
                                    <span class="h-2 w-2 rounded-full" :class="getStatusDotClass(app.status)"></span>
                                    <span class="ml-2">{{ formatStatus(app.status) }}</span>
                                </span>
                            </span>
                        </td>
                        <td class="px-6 py-4 text-sm">{{ getEndorsementInfo(app) }}</td>
                        <td class="px-6 py-4 text-sm">{{ app.dealing_officer_remarks || app.chief_remarks || '-' }}</td>
                        <td class="px-6 py-4 text-sm">
                            <div class="truncate max-w-xs" :title="app.remarks">{{ app.remarks || "-" }}</div>
                        </td>
                        <td class="px-6 py-4 text-sm">{{ formatDate(app.created_at) }}</td>
                        <td class="px-6 py-4 text-sm">{{ calculateProcessingDays(app) }} days</td>
                    </tr>
                </tbody>
            </table>

            <!-- Pagination -->
            <div class="px-6 py-4 border-t border-gray-200">
                <div class="flex items-center justify-between">
                    <div class="text-sm text-gray-600">
                        Showing {{ startIndex + 1 }} to {{ endIndex }} of {{ totalItems }} entries
                    </div>
                    <div class="flex items-center space-x-4">
                        <select v-model="itemsPerPage" class="px-3 py-1 rounded-md text-sm border border-gray-300"
                            @change="handlePerPageChange">
                            <option :value="10">10 / page</option>
                            <option :value="25">25 / page</option>
                            <option :value="50">50 / page</option>
                        </select>
                        <button @click="previousPage" :disabled="currentPage === 1"
                            class="px-4 py-1 text-sm text-gray-600 hover:text-gray-900 disabled:text-gray-400 disabled:cursor-not-allowed">
                            Previous
                        </button>
                        <button @click="nextPage" :disabled="currentPage === totalPages"
                            class="px-4 py-1 text-sm text-gray-600 hover:text-gray-900 disabled:text-gray-400 disabled:cursor-not-allowed">
                            Next
                        </button>
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
import * as XLSX from 'xlsx';
import apiService from "@/services/services";
import { useAuthStore } from '@/stores/authStore';

const toast = useToast();
const { userId } = useAuthStore();

// Constants
const TABLE_HEADERS = [
    { key: "id", label: "Application ID" },
    { key: "applicants_name", label: "Name" },
    { key: "cid_no", label: "CID" },
    { key: "qec_number", label: "Endorsement No" },
    { key: "course_title", label: "Name of Qualification" },
    { key: "mode_of_delivery", label: "Mode of Delivery" },
    { key: "name_of_institute", label: "Institute/College" },
    { key: "name_of_university", label: "University" },
    { key: "country", label: "Country" },
    { key: "documents", label: "Complete Documents" },
    { key: "status", label: "Status (Follow up)" },
    { key: "endorsement", label: "Endorsement by CPO" },
    { key: "notes", label: "Update/Note" },
    { key: "remarks", label: "Remarks" },
    { key: "created_at", label: "Submission Date" },
    { key: "processing_time", label: "Processing Time" },
];

const STATUS_CLASSES = {
    draft: "inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800",
    applied: "inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800",
    processing: "inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800",
    processing_payment: "inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800",
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
    processing_payment: 'bg-orange-600',
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
            pending: apps.filter(app => app?.status === "applied" || app?.status === "processing_payment").length,
            processing: apps.filter(app => app?.status === "processing" || app?.status === "under_review").length,
            approved: apps.filter(app => app?.status === "approved").length,
            regretted: apps.filter(app => app?.status === "regretted").length
        };
    } catch (err) {
        console.error('Error calculating stats:', err);
        return { pending: 0, processing: 0, approved: 0, regretted: 0 };
    }
});

const totalPages = computed(() => Math.max(1, Math.ceil(totalItems.value / itemsPerPage.value)));
const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage.value);
const endIndex = computed(() => Math.min(startIndex.value + itemsPerPage.value, totalItems.value));
const paginatedData = computed(() => {
    // Client-side sorting (as a fallback if API sorting doesn't work)
    if (applications.value.length === 0) return [];

    return [...applications.value].sort((a, b) => {
        let valA = a[sortKey.value];
        let valB = b[sortKey.value];

        // Handle special cases like dates and nested properties
        if (sortKey.value === 'created_at' || sortKey.value === 'updated_at') {
            valA = new Date(valA || 0).getTime();
            valB = new Date(valB || 0).getTime();
        } else if (sortKey.value === 'processing_time') {
            valA = calculateProcessingDays(a);
            valB = calculateProcessingDays(b);
        } else if (sortKey.value === 'mode_of_delivery') {
            valA = getModeOfDelivery(a);
            valB = getModeOfDelivery(b);
        } else if (sortKey.value === 'documents') {
            valA = hasCompleteDocuments(a) ? 1 : 0;
            valB = hasCompleteDocuments(b) ? 1 : 0;
        } else if (sortKey.value === 'endorsement') {
            valA = getEndorsementInfo(a);
            valB = getEndorsementInfo(b);
        } else if (sortKey.value === 'notes') {
            valA = a.dealing_officer_remarks || a.chief_remarks || '';
            valB = b.dealing_officer_remarks || b.chief_remarks || '';
        }

        // Handle null/undefined values
        if (valA === null || valA === undefined) valA = '';
        if (valB === null || valB === undefined) valB = '';

        // Compare the values based on their types
        if (typeof valA === 'string' && typeof valB === 'string') {
            return sortOrder.value === 'asc'
                ? valA.localeCompare(valB)
                : valB.localeCompare(valA);
        } else {
            return sortOrder.value === 'asc'
                ? (valA > valB ? 1 : -1)
                : (valA < valB ? 1 : -1);
        }
    });
});

// Methods
const fetchApplications = async () => {
    try {
        error.value = null;
        loading.value = true;

        // Map virtual columns to actual API ordering fields
        let orderingField = sortKey.value;
        if (sortKey.value === 'processing_time') {
            orderingField = 'created_at'; // Fallback to created_at for processing time
        } else if (sortKey.value === 'mode_of_delivery') {
            orderingField = 'from_in_country';
        } else if (sortKey.value === 'documents' ||
            sortKey.value === 'endorsement' ||
            sortKey.value === 'notes') {
            orderingField = 'id'; // Default sort for virtual fields
        }

        const params = {
            page: currentPage.value,
            limit: itemsPerPage.value,
            search: searchQuery.value || undefined,
            ordering: sortOrder.value === 'asc' ? orderingField : `-${orderingField}`,
            user_id: userId.value,
        };



        const response = await apiService.getRecognitionOfQualifications(params);

        if (response?.data) {
            applications.value = response.data.results;
            totalItems.value = response.data.count || 0;

            // If sorting by virtual fields that the API can't handle,
            // we'll rely on client-side sorting in the paginatedData computed prop
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

    // Check if this is a "virtual" column that can't be sorted by API
    const virtualColumns = ['mode_of_delivery', 'documents', 'endorsement', 'notes', 'processing_time'];

    if (virtualColumns.includes(key)) {
        // For virtual columns, we don't need to fetch from API again
        // The computed paginatedData property will handle the sorting
        return;
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

// New helper methods for the additional fields
const getModeOfDelivery = (app) => {
    return app.from_in_country ? 'In-Country' : 'International';
};

const hasCompleteDocuments = (app) => {
    // Check if all required documents exist
    const requiredDocs = [
        app.degree_certificate,
        app.academic_transcript,
        app.passport_size_photo
    ];

    // If it's a second copy, check for that document as well
    if (app.is_second_copy) {
        requiredDocs.push(app.second_copy_supporting_document);
    }

    return requiredDocs.filter(Boolean).length >= (app.is_second_copy ? 4 : 3);
};

const getEndorsementInfo = (app) => {
    if (app.dealing_officer_decision === 'approved' || app.chief_decision === 'approved') {
        return 'Endorsed';
    } else if (app.dealing_officer_decision === 'regretted' || app.chief_decision === 'regretted') {
        return 'Rejected';
    } else if (app.forward) {
        return 'Forwarded';
    }
    return 'Pending';
};

// Excel export function
const exportToExcel = () => {
    try {
        // Prepare data for Excel
        const excelData = applications.value.map(app => ({
            'Application ID': app.id,
            'Name': app.applicants_name,
            'CID': app.cid_no || '',
            'Endorsement No': app.qec_number || '',
            'Name of Qualification': app.course_title || '',
            'Mode of Delivery': getModeOfDelivery(app),
            'Institute/College': app.name_of_institute || '',
            'University': app.name_of_university || '',
            'Country': app.country || '',
            'Complete Documents': hasCompleteDocuments(app) ? 'Yes' : 'No',
            'Status (Follow up)': formatStatus(app.status),
            'Endorsement by CPO': getEndorsementInfo(app),
            'Update/Note': app.dealing_officer_remarks || app.chief_remarks || '',
            'Remarks': app.remarks || '',
            'Submission Date': formatDate(app.created_at),
            'Processing Time (days)': calculateProcessingDays(app)
        }));

        // Create a new workbook
        const workbook = XLSX.utils.book_new();

        // Convert data to worksheet
        const worksheet = XLSX.utils.json_to_sheet(excelData);

        // Set column widths
        const columnWidths = [
            { wch: 15 },  // Application ID
            { wch: 25 },  // Name
            { wch: 15 },  // CID
            { wch: 20 },  // Endorsement No
            { wch: 30 },  // Name of Qualification
            { wch: 15 },  // Mode of Delivery
            { wch: 25 },  // Institute/College
            { wch: 25 },  // University
            { wch: 20 },  // Country
            { wch: 15 },  // Complete Documents
            { wch: 20 },  // Status
            { wch: 20 },  // Endorsement
            { wch: 30 },  // Update/Note
            { wch: 30 },  // Remarks
            { wch: 15 },  // Submission Date
            { wch: 15 },  // Processing Time
        ];
        worksheet['!cols'] = columnWidths;

        // Add the worksheet to the workbook
        XLSX.utils.book_append_sheet(workbook, worksheet, 'ROQ Applications');

        // Generate Excel file
        const fileName = `roq_applications_${format(new Date(), "yyyy-MM-dd")}.xlsx`;
        XLSX.writeFile(workbook, fileName);

        toast.success("Excel file downloaded successfully");
    } catch (err) {
        console.error('Error generating Excel:', err);
        toast.error("Failed to generate Excel file. Please try again.");
    }
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

        // PDF column headers - simplified for printability
        const pdfHeaders = [
            "ID", "Name", "CID", "Endorsement", "Qualification", "Institute",
            "University", "Country", "Status", "Remarks", "Processing Time"
        ];

        // Applications table
        doc.autoTable({
            startY: summaryY + cardHeight + 10,
            head: [pdfHeaders],
            body: applications.value.map(app => [
                app.id,
                app.applicants_name,
                app.cid_no || '-',
                app.qec_number || '-',
                app.course_title || '-',
                app.name_of_institute || '-',
                app.name_of_university || '-',
                app.country || '-',
                formatStatus(app.status),
                app.remarks || "-",
                `${calculateProcessingDays(app)} days`
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
                0: { cellWidth: 15 },     // ID
                1: { cellWidth: 30 },     // Name
                2: { cellWidth: 20 },     // CID
                3: { cellWidth: 25 },     // Endorsement No
                4: { cellWidth: 30 },     // Qualification
                5: { cellWidth: 25 },     // Institute
                6: { cellWidth: 25 },     // University
                7: { cellWidth: 20 },     // Country
                8: { cellWidth: 25 },     // Status
                9: { cellWidth: 30 },     // Remarks
                10: { cellWidth: 20 }     // Processing Time
            },
            alternateRowStyles: {
                fillColor: [249, 250, 251]
            },
            didDrawCell: function (data) {
                if (data.column.index === 8 && data.cell.section === 'body') {
                    const status = data.cell.raw.toLowerCase();
                    let statusStyle;
                    switch (status) {
                        case 'processing':
                        case 'processing payment':
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

.pi-file-excel::before {
    content: "📊";
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