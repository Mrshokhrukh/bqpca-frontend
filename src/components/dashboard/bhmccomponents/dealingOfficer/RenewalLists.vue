<template>
  <div class="p-8 min-h-screen bg-gray-50">
     <div class="bg-white rounded-xl p-8 mb-10 shadow-sm border border-gray-100">
       <h1 class="text-4xl font-bold text-gray-900 mb-3">Renewal Applications</h1>
        <div class="flex items-center text-gray-600">
         <span class="flex items-center">
           <span class="w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
           Total: {{ filteredApplications.length }}
         </span>
         <span class="mx-4">|</span>
         <span class="flex items-center">
           <span class="w-3 h-3 rounded-full bg-yellow-500 mr-2"></span>
           Pending: {{ pendingCount }}
         </span>
       </div>
     </div>

     <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
       <div class="relative">
         <input v-model="searchQuery" type="text" placeholder="Search by name, CID or registration number..."
           class="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
         <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2"
           fill="none" viewBox="0 0 24 24" stroke="currentColor">
           <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
             d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
         </svg>
       </div>
       <div class="flex gap-4">
         <select v-model="filterStatus"
           class="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
           <option value="all">All Statuses</option>
           <option value="Pending">Pending</option>
           <option value="Approved">Approved</option>
           <option value="Regretted">Regretted</option>
         </select>
       </div>
     </div>

     <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
       <div class="overflow-x-auto">
         <table class="min-w-full divide-y divide-gray-200">
           <thead class="bg-gray-50">
             <tr>
               <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
               <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Applicant
               </th>
               <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Registration
                 No.</th>
               <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
               <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
               <th class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
             </tr>
           </thead>
           <tbody class="divide-y divide-gray-200 bg-white">
             <tr v-for="app in paginatedApplications" :key="app.id" class="hover:bg-gray-50 transition-colors">
               <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                 #{{ app.id }}
               </td>
               <td class="px-6 py-4 whitespace-nowrap">
                 <div class="flex items-center">
                   <img :src="app.passport_photo || ''" class="h-8 w-8 rounded-full object-cover mr-3">
                   <div>
                     <div class="text-sm font-medium text-gray-900">{{ app.full_name }}</div>
                     <div class="text-sm text-gray-500">{{ app.cid_no }}</div>
                   </div>
                 </div>
               </td>
               <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                 {{ app.registration_no }}
               </td>
               <td class="px-6 py-4 whitespace-nowrap">
                 <span :class="getStatusClasses(app)">
                   {{ getStatus(app) }}
                 </span>
               </td>
               <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                 {{ formatDate(app.registration_date) }}
               </td>
               <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                 <div class="flex space-x-3">
                   <button @click="viewDetails(app)"
                     class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-sm transition-colors duration-200">View</button>
                 </div>
               </td>
             </tr>
           </tbody>
         </table>
       </div>
     </div>

     <div class="mt-6 flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-100">
       <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
         <div>
           <p class="text-sm text-gray-700">
             Showing
             <span class="font-medium">{{ paginationStart }}</span>
             to
             <span class="font-medium">{{ paginationEnd }}</span>
             of
             <span class="font-medium">{{ filteredApplications.length }}</span>
             results
           </p>
         </div>
         <div>
           <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
             <button @click="prevPage" :disabled="currentPage === 1"
               class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50">
               <span class="sr-only">Previous</span>
               <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                 <path fill-rule="evenodd"
                   d="M12 1.586l-9.707 9.707a1 1 0 0 1-1.414-1.414l10.414-10.414a1 1 0 0 1 1.414 0l10.414 10.414a1 1 0 0 1-1.414 1.414L12 1.586z"
                   clip-rule="evenodd" />
               </svg>
             </button>
             <button @click="nextPage" :disabled="currentPage === totalPages"
               class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50">
               <span class="sr-only">Next</span>
               <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                 <path fill-rule="evenodd"
                   d="M12 18.414l9.707-9.707a1 1 0 0 0-1.414-1.414L12 15.586 3.707 7.293a1 1 0 0 0-1.414 1.414l9.707 9.707z"
                   clip-rule="evenodd" />
               </svg>
             </button>
           </nav>
         </div>
       </div>
     </div>

     <ViewDetailsModal :isOpen="isModalOpen" :application="selectedApplication" @close="closeModal"
       @update="handleUpdate" :personnel-categories="personnelCategories"
       :personnel-subcategories="personnelSubcategories" :sectors="sectors" />
   </div>
 </template>

 <script setup>
 import { ref, computed, onMounted } from 'vue';
 import apiServices from '@/services/services';
 import ViewDetailsModal from './modals/ViewApplicationDetailsModal.vue';

 const applications = ref([]);
 const filterStatus = ref('all');
 const searchQuery = ref('');
 const currentPage = ref(1);
 const itemsPerPage = 10;
 const isModalOpen = ref(false);
 const selectedApplication = ref(null);
 const personnelCategories = ref([]);
 const personnelSubcategories = ref([]);
 const sectors = ref([]);

 const pendingCount = computed(() => {
   return filteredApplications.value.filter(app => getStatus(app) === 'Pending').length;
 });

 // Filter for "Renewal"
 const filteredApplications = computed(() => {
   return applications.value.filter(app => app.registration_type_name === 'Renewal')
     .filter(app => {
       if (filterStatus.value !== 'all') {
         return getStatus(app) === filterStatus.value;
       }
       return true;
     })
     .filter(app => {
       if (searchQuery.value) {
         const query = searchQuery.value.toLowerCase();
         return (
           app.full_name?.toLowerCase().includes(query) ||
           app.cid_no?.toLowerCase().includes(query) ||
           app.registration_no?.toLowerCase().includes(query)
         );
       }
       return true;
     });
 });

 const paginatedApplications = computed(() => {
   const start = (currentPage.value - 1) * itemsPerPage;
   const end = start + itemsPerPage;
   return filteredApplications.value.slice(start, end);
 });

 const totalPages = computed(() => {
   return Math.ceil(filteredApplications.value.length / itemsPerPage);
 });

 const paginationStart = computed(() => {
   return ((currentPage.value - 1) * itemsPerPage) + 1;
 });

 const paginationEnd = computed(() => {
   return Math.min(currentPage.value * itemsPerPage, filteredApplications.value.length);
 });

 const getStatus = (app) => {
   if (!Array.isArray(app.user_qualifications) || app.user_qualifications.length === 0) {
     return 'Pending';
   }

   for (const qualification of app.user_qualifications) {
     const { application_review_status, physical_review_status, endorsement_decision } = qualification;

     if (application_review_status === 'Regretted' || physical_review_status === 'Regretted' || endorsement_decision === 'Regretted') {
       return 'Regretted';
     }
   }

   const allApproved = app.user_qualifications.every(qualification =>
     qualification.application_review_status === 'Approved' &&
     qualification.physical_review_status === 'Approved' &&
     qualification.endorsement_decision === 'Approved'
   );

   if (allApproved) {
     return 'Approved';
   }

   return 'Pending';
 };

 const getStatusClasses = (app) => {
   const status = getStatus(app);
   return [
     'px-3 py-1 rounded-full text-xs font-medium',
     {
       'bg-yellow-100 text-yellow-800': status === 'Pending',
       'bg-green-100 text-green-800': status === 'Approved',
       'bg-red-100 text-red-800': status === 'Regretted'
     }
   ];
 };

 const formatDate = (date) => {
   if (!date) return '';
   return new Date(date).toLocaleDateString('en-US', {
     year: 'numeric',
     month: 'short',
     day: 'numeric'
   });
 };

 const fetchApplications = async () => {
   try {
     const response = await apiServices.getBhmcNewApplications();
     applications.value = Array.isArray(response.data) ? response.data : (response.data?.results || []);

     const categories = await apiServices.getMastersParticipationCategories();
     personnelCategories.value = Array.isArray(categories.data) ? categories.data : (categories.data?.results || []);

     const subcategories = await apiServices.getMastersSubCategories();
     personnelSubcategories.value = Array.isArray(subcategories.data) ? subcategories.data : (subcategories.data?.results || [])

     const sectorData = await apiServices.getMastersSectors();
     sectors.value = Array.isArray(sectorData.data) ? sectorData.data : (sectorData.data?.results || []);


   } catch (error) {
     console.error('Error fetching applications or master data:', error);
   }
 };

 const viewDetails = async (application) => {
   try {
     const response = await apiServices.getAllUsers();
     const users = Array.isArray(response.data) ? response.data : (response.data?.results || []);
     const matchingUser = users.find(user => user.cid === application.cid_no);

     selectedApplication.value = {
       ...application,
       is_counselor: matchingUser?.is_counselor || false,
       userDetails: matchingUser
     };
     isModalOpen.value = true;
   } catch (error) {
     console.error('Error fetching user details:', error);
     selectedApplication.value = { ...application, is_counselor: false }; //safe fallback
     isModalOpen.value = true;
   }
 };

 const handleUpdate = async () => {
   await fetchApplications();
   closeModal();
 };

 const closeModal = () => {
   isModalOpen.value = false;
   selectedApplication.value = null;
 };

 const prevPage = () => {
   if (currentPage.value > 1) currentPage.value--;
 };

 const nextPage = () => {
   if (currentPage.value < totalPages.value) currentPage.value++;
 };

 onMounted(() => {
   fetchApplications();
 });
 </script>
