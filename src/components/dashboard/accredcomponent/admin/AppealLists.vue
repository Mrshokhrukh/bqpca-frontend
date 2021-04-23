<template>
    <div class="bg-gray-100 min-h-screen p-6">
        <div class="w-full mx-auto">
            <h2 class="text-3xl font-bold text-gray-800 mb-6">Appeal Lists</h2>

            <!-- Filters Section -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div class="bg-white p-4 rounded-lg shadow">
                    <label
                        for="institution-filter"
                        class="block mb-2 text-sm font-medium text-gray-700"
                        >Institution</label
                    >
                    <input
                        id="institution-filter"
                        v-model="filters.institutionName"
                        type="text"
                        class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Filter by institution..."
                    />
                </div>
                <div class="bg-white p-4 rounded-lg shadow">
                    <label
                        for="appeal-reason-filter"
                        class="block mb-2 text-sm font-medium text-gray-700"
                        >Appeal Reason</label
                    >
                    <select
                        id="appeal-reason-filter"
                        v-model="filters.appealReason"
                        class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">All</option>
                        <option v-for="reason in appealReasons" :key="reason.id" :value="reason.id">
                            {{ reason.appeal_name }}
                        </option>
                    </select>
                </div>
                <div class="bg-white p-4 rounded-lg shadow">
                    <label for="status-filter" class="block mb-2 text-sm font-medium text-gray-700"
                        >Status</label
                    >
                    <select
                        id="status-filter"
                        v-model="filters.bacDecision"
                        class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">All</option>
                        <option
                            v-for="decision in bacDecisions"
                            :key="decision.id"
                            :value="decision.id"
                        >
                            {{ decision.decision_name }}
                        </option>
                    </select>
                </div>
                <div class="bg-white p-4 rounded-lg shadow">
                    <label
                        for="date-range-filter"
                        class="block mb-2 text-sm font-medium text-gray-700"
                        >Date Range</label
                    >
                    <input
                        id="date-range-filter"
                        type="date"
                        class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            <!-- Appeal List Table -->
            <div class="bg-white rounded-lg shadow overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th
                                scope="col"
                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                @click="sortBy('institution_name')"
                            >
                                Institution
                                <span v-if="sorting.key === 'institution_name'">
                                    {{ sorting.order === 'asc' ? '▲' : '▼' }}
                                </span>
                            </th>
                            <th
                                scope="col"
                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                @click="sortBy('appeal_reason')"
                            >
                                Appeal Reason
                                <span v-if="sorting.key === 'appeal_reason'">
                                    {{ sorting.order === 'asc' ? '▲' : '▼' }}
                                </span>
                            </th>
                            <th
                                scope="col"
                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                @click="sortBy('bac_decision')"
                            >
                                Status
                                <span v-if="sorting.key === 'bac_decision'">
                                    {{ sorting.order === 'asc' ? '▲' : '▼' }}
                                </span>
                            </th>
                            <th
                                scope="col"
                                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        <tr
                            v-for="appeal in filteredAppeals"
                            :key="appeal.id"
                            class="hover:bg-gray-100"
                        >
                            <td
                                class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                            >
                                {{ appeal.name_of_institution }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {{ getAppealReasonName(appeal.reason_for_appeal) }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {{ getDecisionName(appeal.decision_by_bac) }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <button
                                    @click="viewAppeal(appeal.id)"
                                    class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                                >
                                    View
                                </button>
                                <button
                                    @click="editAppeal(appeal)"
                                    class="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
                                >
                                    Edit
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- Edit Modal -->
        <div
            v-if="showEditModal"
            class="fixed z-10 inset-0 overflow-y-auto flex items-center justify-center bg-black bg-opacity-50"
        >
            <div class="bg-white rounded-lg p-6 w-1/2">
                <h3 class="text-xl font-bold mb-4">
                    Edit Appeal: {{ editingAppeal.name_of_institution }}
                </h3>
                <div class="mb-4">
                    <label for="edit-decision" class="block mb-2 text-sm font-medium text-gray-700"
                        >Decision by BAC</label
                    >
                    <select
                        id="edit-decision"
                        v-model="editingAppeal.decision_by_bac"
                        class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option
                            v-for="decision in bacDecisions"
                            :key="decision.id"
                            :value="decision.id"
                        >
                            {{ decision.decision_name }}
                        </option>
                    </select>
                </div>
                <div class="mb-4">
                    <label
                        for="edit-decision-details"
                        class="block mb-2 text-sm font-medium text-gray-700"
                        >Decision Details</label
                    >
                    <textarea
                        id="edit-decision-details"
                        v-model="editingAppeal.decision_details"
                        class="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows="3"
                    ></textarea>
                </div>
                <div class="flex justify-end">
                    <button
                        @click="saveAppealChanges"
                        class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
                    >
                        Save
                    </button>
                    <button
                        @click="closeEditModal"
                        class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import services from '@/services/services'
// import { useRouter } from 'vue-router';

// const router = useRouter();
const appeals = ref([])
const appealReasons = ref([])
const bacDecisions = ref([])
const showEditModal = ref(false)
const editingAppeal = ref({})
const filters = ref({
    institutionName: '',
    appealReason: '',
    bacDecision: '',
    dateRange: '',
})
const sorting = ref({
    key: null,
    order: 'asc',
})

onMounted(async () => {
    await fetchAppeals()
    await fetchAppealReasons()
    await fetchBacDecisions()
})

async function fetchAppeals() {
    try {
        const response = await services.getProfileAppeals()
        appeals.value = response.data.results // Access the 'results' property
    } catch (error) {
        console.error('Error fetching appeals:', error)
    }
}

async function fetchAppealReasons() {
    try {
        const response = await services.getMastersAppealReasons()
        appealReasons.value = response.data.results
    } catch (error) {
        console.error('Error fetching appeal reasons:', error)
    }
}

async function fetchBacDecisions() {
    try {
        const response = await services.getMastersDecisions()
        bacDecisions.value = response.data.results
    } catch (error) {
        console.error('Error fetching BAC decisions:', error)
    }
}

const filteredAppeals = computed(() => {
    return appeals.value
        .filter((appeal) => {
            return (
                appeal.name_of_institution
                    .toLowerCase()
                    .includes(filters.value.institutionName.toLowerCase()) &&
                (filters.value.appealReason === '' ||
                    appeal.reason_for_appeal === filters.value.appealReason) &&
                (filters.value.bacDecision === '' ||
                    appeal.decision_by_bac === filters.value.bacDecision)
            )
        })
        .sort((a, b) => {
            if (sorting.value.key) {
                const aValue = a[sorting.value.key]
                const bValue = b[sorting.value.key]
                if (aValue < bValue) {
                    return sorting.value.order === 'asc' ? -1 : 1
                }
                if (aValue > bValue) {
                    return sorting.value.order === 'asc' ? 1 : -1
                }
            }
            return 0
        })
})

function sortBy(key) {
    if (sorting.value.key === key) {
        sorting.value.order = sorting.value.order === 'asc' ? 'desc' : 'asc'
    } else {
        sorting.value.key = key
        sorting.value.order = 'asc'
    }
}

function viewAppeal(appealId) {
    // Implement view logic (e.g., navigate to a detail page or open a modal)
    // Example: router.push(`/appeal/${appealId}`);
    console.log('Viewing appeal:', appealId)
}

function editAppeal(appeal) {
    editingAppeal.value = { ...appeal }
    showEditModal.value = true
}

function closeEditModal() {
    showEditModal.value = false
    editingAppeal.value = {}
}

async function saveAppealChanges() {
    try {
        const response = await services.patchProfileAppeal(editingAppeal.value.id, {
            decision_by_bac: editingAppeal.value.decision_by_bac,
            decision_details: editingAppeal.value.decision_details,
        })
        // Update the appeal in the list
        const index = appeals.value.findIndex((a) => a.id === editingAppeal.value.id)
        appeals.value[index] = response.data
        closeEditModal()
    } catch (error) {
        console.error('Error updating appeal:', error)
    }
}

function getAppealReasonName(id) {
    const reason = appealReasons.value.find((r) => r.id === id)
    return reason ? reason.appeal_name : 'N/A'
}

function getDecisionName(id) {
    const decision = bacDecisions.value.find((d) => d.id === id)
    return decision ? decision.decision_name : 'N/A'
}
</script>
