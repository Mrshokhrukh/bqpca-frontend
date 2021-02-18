<template>
    <div class="appeal-decisions">
        <h2 class="text-h5 mb-4">Appeal Decisions</h2>

        <v-card class="mb-4">
            <v-card-text>
                <!-- Search and filters -->
                <v-row>
                    <v-col cols="12" sm="6" md="4">
                        <v-text-field
                            v-model="search"
                            label="Search"
                            prepend-inner-icon="mdi-magnify"
                            clearable
                            outlined
                            dense
                        ></v-text-field>
                    </v-col>
                </v-row>

                <!-- Appeals table -->
                <v-data-table
                    :headers="headers"
                    :items="appeals"
                    :search="search"
                    :loading="loading"
                    class="elevation-1"
                >
                    <template v-slot:[`item.status`]="{ item }">
                        <v-chip :color="getStatusColor(item.status)" small>
                            {{ item.status }}
                        </v-chip>
                    </template>

                    <template v-slot:[`item.actions`]="{ item }">
                        <v-btn
                            small
                            color="primary"
                            text
                            @click="viewAppealDetails(item)"
                        >
                            View Details
                        </v-btn>
                    </template>
                </v-data-table>
            </v-card-text>
        </v-card>
    </div>
</template>

<script>
export default {
    name: 'AppealDecisions',
    
    data() {
        return {
            search: '',
            loading: false,
            headers: [
                { text: 'Appeal ID', value: 'id' },
                { text: 'Applicant Name', value: 'applicantName' },
                { text: 'Date Submitted', value: 'dateSubmitted' },
                { text: 'Status', value: 'status' },
                { text: 'Actions', value: 'actions', sortable: false }
            ],
            appeals: [
                // Sample data - replace with actual API data
                {
                    id: 'APP001',
                    applicantName: 'John Doe',
                    dateSubmitted: '2023-07-01',
                    status: 'Pending'
                },
                {
                    id: 'APP002',
                    applicantName: 'Jane Smith',
                    dateSubmitted: '2023-07-02',
                    status: 'Approved'
                }
            ]
        }
    },

    methods: {
        getStatusColor(status) {
            switch (status) {
                case 'Approved':
                    return 'success'
                case 'Rejected':
                    return 'error'
                case 'Pending':
                    return 'warning'
                default:
                    return 'grey'
            }
        },

        viewAppealDetails(item) {
            // Implement view details logic
            console.log('Viewing details for appeal:', item.id)
        },

        async fetchAppeals() {
            try {
                this.loading = true
                // Implement API call to fetch appeals
                // this.appeals = await api.getAppeals()
            } catch (error) {
                console.error('Error fetching appeals:', error)
            } finally {
                this.loading = false
            }
        }
    },

    mounted() {
        this.fetchAppeals()
    }
}
</script>

<style scoped>
.appeal-decisions {
    padding: 16px;
}
</style>