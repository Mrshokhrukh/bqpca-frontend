<template>
    <form @submit.prevent="handleSubmit" class="max-w-4xl mx-auto">
      <h2 class="text-2xl font-bold mb-6">New ECPF Establishment</h2>
  
      <!-- Personal Information Section -->
      <Section title="1. Personal Information">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField label="CID No." v-model="form.cidNo" disabled />
          <InputField label="Applicant's Name" v-model="form.name" disabled />
          <InputField label="Gender" v-model="form.gender" disabled />
          <InputField label="Date of Birth" v-model="form.dob" disabled />
          <InputField label="Contact No." v-model="form.contactNo" type="number" />
          <InputField label="Email Address" v-model="form.email" type="email" />
        </div>
      </Section>
  
      <!-- Residential/Present Address Section -->
      <Section title="2. Residential/Present Address">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField label="Office Number" v-model="form.officeNumber" type="number" />
          <InputField label="Flat No." v-model="form.flatNo" />
          <InputField label="Building No." v-model="form.buildingNo" />
          <SelectField label="Location" v-model="form.location" :options="locationOptions" />
          <SelectField label="Gewog/Throm" v-model="form.gewogThrom" :options="gewogThromOptions" />
          <SelectField label="Dzongkhag/Thromde" v-model="form.dzongkhagThromde" :options="dzongkhagThromdeOptions" />
        </div>
      </Section>
  
      <!-- Permanent Address Section -->
      <Section title="3. Permanent Address">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField label="Village/Chiwog" v-model="form.villageChiwog" disabled />
          <InputField label="Gewog" v-model="form.gewog" disabled />
          <InputField label="Dungkhag" v-model="form.dungkhag" disabled />
          <InputField label="Dzongkhag/Thromde" v-model="form.dzongkhagThromdePermanent" disabled />
        </div>
      </Section>
  
      <!-- Education Details Section -->
      <Section title="4. Education Details">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField label="Qualification" v-model="form.qualification" />
          <SelectField label="Qualification Type" v-model="form.qualificationType" :options="qualificationTypeOptions" />
          <InputField label="Name of Institute" v-model="form.instituteName" />
          <InputField label="Name of University" v-model="form.universityName" />
        </div>
      </Section>
  
      <!-- ECPF Establishment Proposal Details Section -->
      <Section title="5. ECPF Establishment Proposal Details">
        <InputField label="Name of the Proposed Firm" v-model="form.proposedFirmName" />
        <SelectField label="Type of Firm" v-model="form.firmType" :options="firmTypeOptions" />
      </Section>
  
      <!-- Form Actions -->
      <div class="flex justify-end space-x-4 mt-6">
        <button type="button" @click="handleSaveAsDraft" class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
          Save as Draft
        </button>
        <button type="submit" class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
          Submit Application
        </button>
      </div>
    </form>
  </template>
  
  <script setup>
  import { ref, reactive } from 'vue';
  import Section from './Section.vue';
  import InputField from './InputField.vue';
  import SelectField from './SelectField.vue';
  
  const form = reactive({
    cidNo: '',
    name: '',
    gender: '',
    dob: '',
    contactNo: '',
    email: '',
    officeNumber: '',
    flatNo: '',
    buildingNo: '',
    location: '',
    gewogThrom: '',
    dzongkhagThromde: '',
    villageChiwog: '',
    gewog: '',
    dungkhag: '',
    dzongkhagThromdePermanent: '',
    qualification: '',
    qualificationType: '',
    instituteName: '',
    universityName: '',
    proposedFirmName: '',
    firmType: ''
  });
  
  const locationOptions = ref(['Location 1', 'Location 2', 'Location 3']);
  const gewogThromOptions = ref(['Gewog 1', 'Gewog 2', 'Gewog 3']);
  const dzongkhagThromdeOptions = ref(['Dzongkhag 1', 'Dzongkhag 2', 'Dzongkhag 3']);
  const qualificationTypeOptions = ref(['Class XII', 'Diploma', 'Bachelor', 'Masters']);
  const firmTypeOptions = ref(['Independent', 'Collaboration']);
  
  const emit = defineEmits(['submit', 'save-draft']);
  
  const handleSubmit = () => {
    emit('submit', form);
  };
  
  const handleSaveAsDraft = () => {
    emit('save-draft', form);
  };
  </script>