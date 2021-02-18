<!-- components/dealingOfficer/ApplicationForm.vue -->
<template>
    <div class="p-6">
      <h2 class="text-xl font-semibold mb-4">Application Details - {{ application.institute_name }}</h2>
  
      <!-- Application Review Section -->
      <div class="mb-4 border p-4 rounded">
        <h3 class="font-semibold mb-2">Application Review</h3>
        <div class="mb-2">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="reviewDecision">Review Decision:</label>
          <select v-model="formData.reviewDecision" id="reviewDecision" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
            <option value="Accepted">Accepted</option>
            <option value="Rejected">Rejected</option>
            <option value="Pending">Pending</option>
            <option value="Requires Modification">Requires Modification</option>
          </select>
        </div>
        <div class="mb-2">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="reviewRemark">Remark (if any):</label>
          <textarea v-model="formData.reviewRemark" id="reviewRemark" rows="3" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"></textarea>
        </div>
      </div>
  
      <!-- Assessor Assignment & CoI Confirmation Section -->
      <div class="mb-4 border p-4 rounded">
        <h3 class="font-semibold mb-2">Assessor Assignment & CoI Confirmation</h3>
        <div class="mb-2">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="assessorName">Assessor Name:</label>
          <select v-model="formData.assessorName" id="assessorName" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
            <option v-for="assessor in assessorPool" :key="assessor" :value="assessor">{{ assessor }}</option>
          </select>
        </div>
      </div>
  
      <!-- Site Visit Scheduling Section -->
      <div class="mb-4 border p-4 rounded">
        <h3 class="font-semibold mb-2">Site Visit Scheduling</h3>
        <div class="mb-2">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="siteVisitName">Site Visit Name:</label>
          <input v-model="formData.siteVisitName" type="text" id="siteVisitName" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
        </div>
        <div class="mb-2">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="startDate">Start Date:</label>
          <input v-model="formData.startDate" type="date" id="startDate" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
        </div>
        <div class="mb-2">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="endDate">End Date:</label>
          <input v-model="formData.endDate" type="date" id="endDate" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
        </div>
        <div class="mb-2">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="siteVisitRemarks">Remarks, if any:</label>
          <textarea v-model="formData.siteVisitRemarks" id="siteVisitRemarks" rows="2" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"></textarea>
        </div>
      </div>
  
      <!-- Result Updates or Report Section -->
      <div class="mb-4 border p-4 rounded">
        <h3 class="font-semibold mb-2">Result Updates or Report</h3>
        <div class="mb-2">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="accreditationDecision">Accreditation Decision:</label>
          <select v-model="formData.accreditationDecision" id="accreditationDecision" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
            <option value="Accredited">Accredited</option>
            <option value="Not Accredited">Not Accredited</option>
            <option value="Provisional Accreditation">Provisional Accreditation</option>
          </select>
        </div>
        <div class="mb-2" v-if="formData.accreditationDecision === 'Accredited'">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="grade">Grade (if approved):</label>
          <select v-model="formData.grade" id="grade" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
          </select>
        </div>
        <div class="mb-2" v-if="formData.accreditationDecision === 'Accredited'">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="validity">Validity (if approved):</label>
          <input v-model="formData.validity" type="date" id="validity" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
        </div>
        <div class="mb-2">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="assessorsReport">Assessors Report:</label>
          <input type="file" id="assessorsReport" @change="handleFileUpload" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
          <span v-if="formData.assessorsReportName" class="text-sm text-gray-500">Selected file: {{ formData.assessorsReportName }}</span>
        </div>
        <div class="mb-2" v-if="formData.accreditationDecision === 'Not Accredited'">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="reason">Reason (if not accredited):</label>
          <textarea v-model="formData.reason" id="reason" rows="2" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"></textarea>
        </div>
        <div class="mb-2">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="resultRemarks">Remarks (if Any):</label>
          <textarea v-model="formData.resultRemarks" id="resultRemarks" rows="2" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"></textarea>
        </div>
      </div>
  
      <!-- Buttons -->
      <div class="flex justify-end">
        <button @click="closeModal" class="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded mr-2">Cancel</button>
        <button @click="saveData" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Save</button>
      </div>
    </div>
  </template>
  
  <script>
  import { reactive, watch } from 'vue';
  
  export default {
    props: {
      application: {
        type: Object,
        required: true
      },
      assessorPool: {
        type: Array,
        required: true
      }
    },
    setup(props, { emit }) {
      const formData = reactive({
        reviewDecision: props.application.reviewDecision || '',
        reviewRemark: props.application.reviewRemark || '',
        assessorName: props.application.assessorName || '',
        siteVisitName: props.application.siteVisitName || '',
        startDate: props.application.startDate || '',
        endDate: props.application.endDate || '',
        siteVisitRemarks: props.application.siteVisitRemarks || '',
        accreditationDecision: props.application.accreditationDecision || '',
        grade: props.application.grade || '',
        validity: props.application.validity || '',
        assessorsReport: null,
        assessorsReportName: props.application.assessorsReportName || null,
        reason: props.application.reason || '',
        resultRemarks: props.application.resultRemarks || ''
      });
  
      // Watch for changes in props.application to update formData
      watch(
        () => props.application,
        (newApplication) => {
          formData.reviewDecision = newApplication.reviewDecision || '';
          formData.reviewRemark = newApplication.reviewRemark || '';
          formData.assessorName = newApplication.assessorName || '';
          formData.siteVisitName = newApplication.siteVisitName || '';
          formData.startDate = newApplication.startDate || '';
          formData.endDate = newApplication.endDate || '';
          formData.siteVisitRemarks = newApplication.siteVisitRemarks || '';
          formData.accreditationDecision = newApplication.accreditationDecision || '';
          formData.grade = newApplication.grade || '';
          formData.validity = newApplication.validity || '';
          formData.assessorsReportName = newApplication.assessorsReportName || null;
          formData.reason = newApplication.reason || '';
          formData.resultRemarks = newApplication.resultRemarks || '';
        },
        { immediate: true } // Run the watcher immediately on component creation
      );
  
      const handleFileUpload = (event) => {
        const file = event.target.files[0];
        formData.assessorsReport = file;
        formData.assessorsReportName = file.name;
      };
  
      const closeModal = () => {
        emit('close');
      };
  
      const saveData = () => {
        const payload = {
          ...props.application, // Keep the original application data
          ...formData // Override with form data
        };
        emit('save', payload);
      };
  
      return {
        formData,
        closeModal,
        saveData,
        handleFileUpload
      };
    }
  };
  </script>