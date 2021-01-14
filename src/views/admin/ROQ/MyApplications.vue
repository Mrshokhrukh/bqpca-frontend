# Applications.vue
<template>
    <div class="space-y-4">
        <!-- Tabs -->
        <div class="border-b border-gray-200">
            <nav class="-mb-px flex space-x-4" aria-label="Tabs">
                <button v-for="tab in tabs" :key="tab.name" @click="currentTab = tab.value" :class="[
                    currentTab === tab.value
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                    'whitespace-nowrap border-b-2 py-4 px-4 text-sm font-medium'
                ]">
                    {{ tab.name }}
                </button>
            </nav>
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                    <tr>
                        <th scope="col"
                            class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sl.No
                        </th>
                        <th scope="col"
                            class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CID
                        </th>
                        <th scope="col"
                            class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name
                        </th>
                        <th scope="col"
                            class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date
                            of Birth</th>
                        <th scope="col"
                            class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Contact Number</th>
                        <th scope="col"
                            class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email
                            Address</th>
                        <th scope="col"
                            class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Application Category</th>
                        <th scope="col"
                            class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status</th>
                        <th scope="col"
                            class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Action</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="(application, index) in filteredApplications" :key="application.id"
                        :class="index % 2 === 0 ? 'bg-white' : 'bg-gray-50'">
                        <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{{ index + 1 }}</td>
                        <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{{ application.cid }}</td>
                        <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">{{ application.name }}</td>
                        <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{{
                            formatDate(application.dateOfBirth) }}</td>
                        <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{{ application.contactNumber }}
                        </td>
                        <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{{ application.email }}</td>
                        <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{{ application.category }}</td>
                        <td class="px-4 py-3 whitespace-nowrap">
                            <span :class="getStatusClass(application.status)"
                                class="px-2 py-1 text-xs font-medium rounded-full">
                                {{ application.status }}
                            </span>
                        </td>
                        <td class="px-4 py-3 whitespace-nowrap text-sm">
                            <div class="flex space-x-2">
                                <button @click="viewApplication(application.id)"
                                    class="text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm">
                                    View
                                </button>
                                <button v-if="currentTab === 'approved'" @click="printDocument(application.id)"
                                    class="text-white bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm">
                                    Print
                                </button>
                            </div>
                        </td>
                    </tr>
                    <tr v-if="filteredApplications.length === 0">
                        <td colspan="9" class="px-4 py-4 text-center text-gray-500">No applications found</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const currentTab = ref('pending');

const tabs = [
    { name: 'Pending', value: 'pending' },
    { name: 'Review', value: 'review' },
    { name: 'Forwarded', value: 'forwarded' },
    { name: 'Approved', value: 'approved' },
    { name: 'Suspended', value: 'suspended' },
    { name: 'Regretted', value: 'regretted' },
];

// Mock data - replace with actual API call
const applications = ref([
    {
        id: 1,
        cid: '112212345',
        name: 'Dorji Tshering',
        dateOfBirth: '1980-01-01',
        contactNumber: '17324560',
        email: 'xyz@gmail.com',
        category: 'New',
        status: 'Submitted'
    },
    {
        id: 2,
        cid: '112212345',
        name: 'Tshering Dorji',
        dateOfBirth: '1970-01-01',
        contactNumber: '17324532',
        email: 'abc@gmail.com',
        category: 'Second Copy',
        status: 'Submitted'
    },
    // Add more mock data as needed
]);

const filteredApplications = computed(() => {
    return applications.value.filter(app => {
        switch (currentTab.value) {
            case 'pending':
                return app.status === 'Submitted' || app.status === 'Pending';
            case 'review':
                return app.status === 'Under Review';
            case 'forwarded':
                return app.status === 'Forwarded';
            case 'approved':
                return app.status === 'Approved';
            case 'suspended':
                return app.status === 'Suspended';
            case 'regretted':
                return app.status === 'Regretted';
            default:
                return true;
        }
    });
});

const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};

const getStatusClass = (status) => {
    const classes = {
        'Submitted': 'bg-yellow-100 text-yellow-800',
        'Pending': 'bg-yellow-100 text-yellow-800',
        'Under Review': 'bg-blue-100 text-blue-800',
        'Forwarded': 'bg-purple-100 text-purple-800',
        'Approved': 'bg-green-100 text-green-800',
        'Suspended': 'bg-orange-100 text-orange-800',
        'Regretted': 'bg-red-100 text-red-800'
    };
    return classes[status] || 'bg-gray-100 text-gray-800';
};

const viewApplication = (id) => {
    router.push(`/applications/${id}`);
};

const printDocument = (id) => {
    // Implement document printing logic
    console.log(`Printing document for application ${id}`);
};
</script>