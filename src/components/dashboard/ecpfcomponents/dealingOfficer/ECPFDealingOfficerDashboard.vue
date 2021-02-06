<template>
    <div class="dealing-officer-dashboard">
        <h1>ECPF Dealing Officer Dashboard</h1>
        <div class="dashboard-content">
            <!-- Add your dashboard content here -->
            <div class="dashboard-stats">
                <div class="stat-card">
                    <h3>Pending Cases</h3>
                    <p>{{ pendingCases }}</p>
                </div>
                <div class="stat-card">
                    <h3>Completed Cases</h3>
                    <p>{{ completedCases }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ECPFDealingOfficerDashboard',
    data() {
        return {
            pendingCases: 0,
            completedCases: 0,
        }
    },
    mounted() {
        // Fetch data when component mounts
        this.fetchDashboardData()
    },
    methods: {
        fetchDashboardData() {
            // Add your API calls here
        }
    }
}
</script>

<style scoped>
.dealing-officer-dashboard {
    padding: 20px;
}

.dashboard-content {
    margin-top: 20px;
}

.dashboard-stats {
    display: flex;
    gap: 20px;
}

.stat-card {
    background-color: #f5f5f5;
    padding: 20px;
    border-radius: 8px;
    min-width: 200px;
}

.stat-card h3 {
    margin: 0 0 10px 0;
    color: #333;
}

.stat-card p {
    font-size: 24px;
    font-weight: bold;
    margin: 0;
    color: #2c3e50;
}
</style>