<template>
    <div class="site-visit-scheduling">
        <h2>Site Visit Scheduling</h2>
        
        <div class="scheduling-form">
            <v-form @submit.prevent="submitSchedule">
                <v-container>
                    <v-row>
                        <v-col cols="12" md="6">
                            <v-date-picker v-model="visitDate" label="Visit Date"></v-date-picker>
                        </v-col>
                        
                        <v-col cols="12" md="6">
                            <v-time-picker v-model="visitTime" label="Visit Time"></v-time-picker>
                        </v-col>

                        <v-col cols="12">
                            <v-text-field
                                v-model="location"
                                label="Visit Location"
                                required
                            ></v-text-field>
                        </v-col>

                        <v-col cols="12">
                            <v-select
                                v-model="selectedOfficers"
                                :items="officers"
                                label="Select Officers"
                                multiple
                                chips
                            ></v-select>
                        </v-col>

                        <v-col cols="12">
                            <v-textarea
                                v-model="notes"
                                label="Additional Notes"
                                rows="3"
                            ></v-textarea>
                        </v-col>

                        <v-col cols="12">
                            <v-btn color="primary" type="submit">Schedule Visit</v-btn>
                            <v-btn color="secondary" class="ml-4" @click="resetForm">Reset</v-btn>
                        </v-col>
                    </v-row>
                </v-container>
            </v-form>
        </div>
    </div>
</template>

<script>
export default {
    name: 'SiteVisitScheduling',
    data() {
        return {
            visitDate: null,
            visitTime: null,
            location: '',
            selectedOfficers: [],
            notes: '',
            officers: [
                'Officer 1',
                'Officer 2',
                'Officer 3',
                'Officer 4'
            ]
        }
    },
    methods: {
        submitSchedule() {
            // Handle form submission
            const scheduleData = {
                date: this.visitDate,
                time: this.visitTime,
                location: this.location,
                officers: this.selectedOfficers,
                notes: this.notes
            }
            console.log('Schedule Data:', scheduleData)
            // Add API call here
        },
        resetForm() {
            this.visitDate = null
            this.visitTime = null
            this.location = ''
            this.selectedOfficers = []
            this.notes = ''
        }
    }
}
</script>

<style scoped>
.site-visit-scheduling {
    padding: 20px;
}

.scheduling-form {
    max-width: 800px;
    margin: 0 auto;
}

h2 {
    margin-bottom: 20px;
    color: #333;
}
</style>