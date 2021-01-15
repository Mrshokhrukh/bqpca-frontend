<template>
    <span :class="getStatusClass(status)" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
        {{ status }}
    </span>
</template>
<script setup>
defineProps({
    status: {
        type: String,
        required: true
    }
})
// Get status class for badge
const getStatusClass = (status) => {
    const classes = {
        'Approved': 'bg-green-100 text-green-800',
        'Pending': 'bg-yellow-100 text-yellow-800',
        'Regretted': 'bg-red-100 text-red-800',
        'In Progress': 'bg-blue-100 text-blue-800'
    };
    return classes[status] || 'bg-gray-100 text-gray-800';
};
</script>