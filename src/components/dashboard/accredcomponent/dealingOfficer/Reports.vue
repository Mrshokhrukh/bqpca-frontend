<template>
    <div class="reports-container">
        <h2 class="reports-title">Dealing Officer Reports</h2>
        <div class="reports-content">
            <div class="report-filters">
                <el-select v-model="selectedPeriod" placeholder="Select Period">
                    <el-option label="Last 30 days" value="30" />
                    <el-option label="Last 3 months" value="90" />
                    <el-option label="Last 6 months" value="180" />
                </el-select>
            </div>
            
            <div class="report-list">
                <!-- Sample report items -->
                <div v-for="report in reports" :key="report.id" class="report-item">
                    <h3>{{ report.title }}</h3>
                    <p>{{ report.description }}</p>
                    <span class="report-date">{{ report.date }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'DealingOfficerReports',
    data() {
        return {
            selectedPeriod: '30',
            reports: [
                {
                    id: 1,
                    title: 'Monthly Assessment Report',
                    description: 'Overview of monthly accreditation assessments',
                    date: '2023-07-01'
                },
                {
                    id: 2,
                    title: 'Compliance Summary',
                    description: 'Summary of compliance status for current applications',
                    date: '2023-07-15'
                }
            ]
        }
    }
}
</script>

<style scoped>
.reports-container {
    padding: 20px;
}

.reports-title {
    margin-bottom: 20px;
    color: #2c3e50;
}

.report-filters {
    margin-bottom: 20px;
}

.report-item {
    border: 1px solid #eee;
    padding: 15px;
    margin-bottom: 10px;
    border-radius: 4px;
}

.report-date {
    color: #666;
    font-size: 0.9em;
}
</style>