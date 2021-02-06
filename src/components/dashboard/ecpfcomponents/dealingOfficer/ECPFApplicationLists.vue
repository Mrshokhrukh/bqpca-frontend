<template>
    <div class="ecpf-application-lists">
        <h2>ECPF Applications</h2>
        <div class="application-container">
            <table class="applications-table">
                <thead>
                    <tr>
                        <th>Application ID</th>
                        <th>Applicant Name</th>
                        <th>Submission Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <!-- Add v-for loop here when data is available -->
                    <tr>
                        <td>Loading...</td>
                        <td>Loading...</td>
                        <td>Loading...</td>
                        <td>Loading...</td>
                        <td>
                            <button class="view-btn">View</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ECPFApplicationLists',
    data() {
        return {
            applications: []
        }
    },
    methods: {
        // Add methods for handling applications
    }
}
</script>

<style scoped>
.ecpf-application-lists {
    padding: 20px;
}

.application-container {
    margin-top: 20px;
}

.applications-table {
    width: 100%;
    border-collapse: collapse;
}

.applications-table th,
.applications-table td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #ddd;
}

.view-btn {
    padding: 6px 12px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.view-btn:hover {
    background-color: #45a049;
}
</style>