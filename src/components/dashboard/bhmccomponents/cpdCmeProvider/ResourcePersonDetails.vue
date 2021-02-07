<template>
    <div class="border-b border-gray-200 bg-gray-50 p-6 rounded-t-xl">
        <h3 class="text-lg font-semibold text-gray-900">Resource Person Details</h3>
        <p class="mt-1 text-sm text-gray-500">Information about the resource persons.</p>
    </div>

    <div class="p-8">
        <div v-for="(person, index) in modelValue" :key="index" class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
            <div class="col-span-1">
                <label for="regNo" class="block text-sm font-medium text-gray-700">RegNo</label>
                <input type="text" id="regNo" v-model="person.regNo"
                    class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500 p-2.5" />
            </div>

            <div class="col-span-1">
                <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
                <input type="text" id="name" v-model="person.name"
                    class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500 p-2.5" />
            </div>

            <div class="col-span-1">
                <label for="certificates" class="block text-sm font-medium text-gray-700">Certificates</label>
                <input type="file" id="certificates" class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4
                               file:rounded-lg file:border-0 file:text-sm file:font-semibold
                               file:bg-green-50 file:text-green-700 hover:file:bg-green-100" />
            </div>
        </div>
        <button @click="addResourcePerson"
            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            Add Resource Person
        </button>
    </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
    modelValue: {
        type: Array,
        required: true
    }
});

const emit = defineEmits(['update:modelValue']);

const addResourcePerson = () => {
    emit('update:modelValue', [...props.modelValue, { regNo: '', name: '', certificates: null }]);
};
</script>