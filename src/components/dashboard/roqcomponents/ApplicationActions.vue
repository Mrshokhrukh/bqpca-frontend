<template>
    <button class="text-blue-600 hover:text-blue-900" @click="viewApplication(id)">View</button>
</template>
<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();
defineProps({
    id: {
        type: String,
        required: true
    }
})
// View application details
const viewApplication = (id) => {
    router.push(`/applications/${id}`);
};
</script>