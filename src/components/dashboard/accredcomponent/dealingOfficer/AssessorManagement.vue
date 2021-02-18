<template>
    <div class="assessor-assignment">
        <h2>Assessor Assignment</h2>
        <div class="assignment-form">
            <v-card class="pa-4">
                <v-form @submit.prevent="handleSubmit">
                    <v-select
                        v-model="selectedAssessor"
                        :items="assessors"
                        item-title="name"
                        item-value="id"
                        label="Select Assessor"
                        required
                    ></v-select>
                    
                    <v-select
                        v-model="selectedApplication"
                        :items="applications"
                        item-title="applicationNumber"
                        item-value="id"
                        label="Select Application"
                        required
                    ></v-select>

                    <v-textarea
                        v-model="notes"
                        label="Assignment Notes"
                        rows="3"
                    ></v-textarea>

                    <v-btn
                        color="primary"
                        type="submit"
                        :loading="loading"
                    >
                        Assign Assessor
                    </v-btn>
                </v-form>
            </v-card>
        </div>
    </div>
</template>

<script>
export default {
    name: 'AssessorAssignment',
    data() {
        return {
            selectedAssessor: null,
            selectedApplication: null,
            notes: '',
            loading: false,
            assessors: [
                { id: 1, name: 'John Doe' },
                { id: 2, name: 'Jane Smith' },
                // Add more assessors as needed
            ],
            applications: [
                { id: 1, applicationNumber: 'APP001' },
                { id: 2, applicationNumber: 'APP002' },
                // Add more applications as needed
            ]
        }
    },
    methods: {
        async handleSubmit() {
            this.loading = true
            try {
                // Add your API call here to save the assignment
                await this.saveAssignment({
                    assessorId: this.selectedAssessor,
                    applicationId: this.selectedApplication,
                    notes: this.notes
                })
                // Show success message
                this.$notify({
                    type: 'success',
                    message: 'Assessor assigned successfully'
                })
                this.resetForm()
            } catch (error) {
                // Handle error
                this.$notify({
                    type: 'error',
                    message: `Failed to assign assessor: ${error.message}`
                })
            } finally {
                this.loading = false
            }
        },
        resetForm() {
            this.selectedAssessor = null
            this.selectedApplication = null
            this.notes = ''
        },
        async saveAssignment(data) {
            // Implement your API call here
            console.log('Saving assignment:', data)
        }
    }
}
</script>

<style scoped>
.assessor-assignment {
    padding: 20px;
}

.assignment-form {
    max-width: 600px;
    margin: 0 auto;
}
</style>