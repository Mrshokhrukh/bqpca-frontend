<template>
  <div class="w-full mx-auto px-4 py-8">
    <div class="bg-white rounded-xl shadow-md p-8 mb-10 border border-gray-100">
      <h2 class="text-3xl font-bold text-gray-800 mb-3 text-center">Your Applications</h2>
      <p class="text-gray-500 text-center max-w-2xl mx-auto">
        Track the status and review the details of all your submitted Detailed Project Reports (DPR).
      </p>
    </div>

    <div v-if="isLoading" class="flex justify-center my-12">
      <Loader class="inline-block animate-spin text-indigo-600 w-8 h-8" />
    </div>
    <div v-else-if="apiError" class="text-center py-12 bg-red-50 rounded-xl border border-red-200">
      <AlertTriangle class="mx-auto h-12 w-12 text-red-400" />
      <h3 class="mt-4 text-lg font-semibold text-red-700">An Error Occurred</h3>
      <p class="mt-1 text-red-600">{{ errorMessage }}</p>
    </div>
    <div v-else-if="applications.length === 0"
      class="text-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-300">
      <FileText class="mx-auto h-12 w-12 text-gray-400" />
      <h3 class="mt-4 text-lg font-semibold text-gray-800">No Applications Found</h3>
      <p class="mt-1 text-gray-500">You have not submitted any DPR applications yet.</p>
    </div>

    <div v-else class="space-y-6">
      <div v-for="app in applications" :key="app.id"
        class="bg-white rounded-xl shadow-sm border border-gray-200 transition-all duration-300"
        :class="{ 'shadow-lg border-indigo-200': expandedApplicationId === app.id }">
        <div class="p-6">
          <div class="flex flex-col sm:flex-row justify-between sm:items-start">
            <div class="flex-1">
              <span
                :class="['px-2.5 py-1 text-xs font-medium rounded-full inline-block mb-3', getStatusColor(app.do_dpr_review_decision)]">
                {{ app.do_dpr_review_decision || 'Submitted' }}
              </span>
              <h3 class="text-lg font-semibold text-gray-900">{{ app.name_of_institution }}</h3>
              <p class="text-indigo-600 font-medium text-sm">{{ app.title_of_course }}</p>
            </div>
            <div class="text-left sm:text-right mt-4 sm:mt-0">
              <p class="text-sm font-medium text-gray-500">Submitted On</p>
              <p class="text-sm text-gray-800 font-semibold">{{ formatDate(app.created_at) }}</p>
            </div>
          </div>

          <div class="mt-6 border-t border-gray-100 pt-4 grid grid-cols-2 md:grid-cols-3 gap-6 text-sm">
            <div>
              <p class="text-gray-500">Program Type</p>
              <p class="font-semibold text-gray-800">{{ mapProgramType(app.type_of_programme) }}</p>
            </div>
            <div>
              <p class="text-gray-500">Duration</p>
              <p class="font-semibold text-gray-800">{{ app.course_duration }} months</p>
            </div>
            <div>
              <p class="text-gray-500">Payment</p>
              <p class="font-semibold" :class="app.is_payment_complete ? 'text-green-600' : 'text-amber-600'">
                  {{ app.payment_status_display || (app.is_payment_complete ? 'Completed' : 'Pending') }}
              </p>
            </div>
            <div class="col-span-2 md:col-span-1">
              <p class="text-gray-500">Officer Remarks</p>
              <p class="font-semibold text-gray-800 truncate" :title="app.do_dpr_review_summary">
                {{ app.do_dpr_review_summary || 'Not available' }}
              </p>
            </div>
            <div>
              <p class="text-gray-500">Officer Report</p>
              <a v-if="app.do_dpr_report" :href="app.do_dpr_report" target="_blank" rel="noopener noreferrer"
                class="font-semibold text-indigo-600 hover:text-indigo-800 inline-flex items-center">
                View Report
                <ExternalLink class="h-3 w-3 ml-1.5" />
              </a>
              <p v-else class="font-semibold text-gray-500 italic">Not available</p>
            </div>
          </div>
        </div>

        <transition enter-active-class="transition-all ease-out duration-300 overflow-hidden"
          enter-from-class="transform opacity-0 max-h-0" enter-to-class="transform opacity-100 max-h-screen"
          leave-active-class="transition-all ease-in duration-200 overflow-hidden"
          leave-from-class="transform opacity-100 max-h-screen" leave-to-class="transform opacity-0 max-h-0">
          <div v-if="expandedApplicationId === app.id" class="px-6 pb-6">
            <div class="border-t border-gray-200 pt-4">
              <div class="border-b border-gray-200">
                <nav class="-mb-px flex flex-wrap" aria-label="Tabs">
                  <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id" :class="[
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                    'whitespace-nowrap py-3 px-4 border-b-2 font-medium text-sm'
                  ]">
                    {{ tab.name }}
                  </button>
                </nav>
              </div>
              <div class="mt-4">
                <div v-for="tab in tabs" :key="tab.id">
                  <div v-if="activeTab === tab.id">
                    <h4 class="text-base font-semibold text-gray-800 mb-2">{{ tab.name }}</h4>
                    <p class="text-sm text-gray-600 whitespace-pre-wrap bg-gray-50 p-4 rounded-md h-64 overflow-y-auto">
                      {{ app[tab.id] || 'No information provided.' }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </transition>

        <div class="p-4 bg-gray-50 rounded-b-xl border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div class="flex items-center space-x-3">
              <button v-if="app.do_dpr_review_decision === 'Approved' && !app.is_payment_complete"
                    @click="initiatePayment(app)"
                    class="btn btn-primary">
              <CreditCard class="h-4 w-4 mr-2" />
              Make Payment (Nu. 1,000)
            </button>

            <a v-if="app.do_dpr_review_decision === 'Approved' && app.is_payment_complete && app.certificate_url"
               :href="app.certificate_url" target="_blank" rel="noopener noreferrer"
               class="btn btn-success">
              <Award class="h-4 w-4 mr-2" />
              View Certificate
            </a>
            <p v-if="app.do_dpr_review_decision === 'Approved' && app.is_payment_complete && !app.certificate_url" class="text-sm text-gray-500 italic">
                Certificate is being generated...
            </p>
          </div>

          <button @click="toggleDetails(app.id)" class="w-full sm:w-auto btn btn-secondary">
            <template v-if="expandedApplicationId === app.id">
              <ChevronUp class="h-4 w-4 mr-2" />
              <span>Hide Details</span>
            </template>
            <template v-else>
              <ChevronDown class="h-4 w-4 mr-2" />
              <span>View Details</span>
            </template>
          </button>
        </div>
      </div>
    </div>

    <PaymentModal
      ref="paymentModalRef"
      :amount="1000"
      @payment-completed="handlePaymentCompleted"
      @close="closePaymentModal"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import apiService from '@/services/services';
import PaymentModal from '@/components/common/PaymentModal.vue';
import { useToast } from 'vue-toastification';
import { Loader, FileText, AlertTriangle, ChevronDown, ChevronUp, ExternalLink, CreditCard, Award, CheckCircle } from 'lucide-vue-next';

const applications = ref([]);
const isLoading = ref(false);
const apiError = ref(false);
const errorMessage = ref('');
const expandedApplicationId = ref(null);
const activeTab = ref('vision_mission_strategies');
const paymentModalRef = ref(null);
const selectedAppForPayment = ref(null);

const authStore = useAuthStore();
const toast = useToast();

const tabs = ref([
  { id: 'vision_mission_strategies', name: 'Vision & Mission' },
  { id: 'project_scheduling', name: 'Scheduling' },
  { id: 'gross_national_happiness', name: 'GNH' },
  { id: 'land_details', name: 'Land Details' },
  { id: 'conceptual_master_plan', name: 'Master Plan' },
  { id: 'academic_plan', name: 'Academic Plan' },
  { id: 'affiliation_details', name: 'Affiliation' },
  { id: 'teaching_hospital', name: 'Teaching Institute' },
  { id: 'research_policy', name: 'Research' },
  { id: 'human_resource', name: 'HR' },
  { id: 'quality_assurance', name: 'QA' },
  { id: 'governance_structure', name: 'Governance' },
  { id: 'business_plan', name: 'Business Plan' },
  { id: 'project_cost_analysis', name: 'Cost Analysis' },
  { id: 'facilities_student_services', name: 'Facilities' },
  { id: 'admission_policy', name: 'Admission' },
  { id: 'service_conditions', name: 'Service Conditions' },
  { id: 'safety_security', name: 'Safety' },
  { id: 'public_information_system', name: 'Public Info' },
  { id: 'other_details', name: 'Other Details' },
]);

const getStatusColor = (status) => {
  switch (status) {
    case 'Approved': return 'bg-green-100 text-green-800';
    case 'Regretted': return 'bg-red-100 text-red-800';
    case 'Pending': return 'bg-yellow-100 text-yellow-800';
    default: return 'bg-blue-100 text-blue-700';
  }
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric'
  });
};

const mapProgramType = (code) => {
  const map = { 'D': 'Diploma', 'B': 'Bachelor', 'M': 'Masters', 'P': 'PhD' };
  return map[code] || code || 'N/A';
};

const toggleDetails = (appId) => {
  if (expandedApplicationId.value === appId) {
    expandedApplicationId.value = null;
  } else {
    expandedApplicationId.value = appId;
    activeTab.value = 'vision_mission_strategies';
  }
};

const fetchApplications = async () => {
  if (!authStore.user?.cid) {
    errorMessage.value = 'User information not available. Please log in again.';
    apiError.value = true;
    return;
  }

  isLoading.value = true;
  apiError.value = false;
  errorMessage.value = '';

  try {
    const response = await apiService.getEpcInstitutes();
    if (response?.data?.results) {
      const userCid = authStore.user.cid;
      applications.value = response.data.results.filter(
        (app) => app.CID && app.CID.toLowerCase() === userCid.toLowerCase()
      );
    } else {
      applications.value = [];
    }
  } catch (error) {
    console.error('Error fetching DPR applications:', error);
    apiError.value = true;
    errorMessage.value = error.response?.data?.message || 'Could not fetch your applications.';
  } finally {
    isLoading.value = false;
  }
};

const initiatePayment = (app) => {
  selectedAppForPayment.value = app;
  if (paymentModalRef.value) {
    paymentModalRef.value.openModal();
  } else {
    toast.error('Payment module could not be loaded.');
  }
};

const closePaymentModal = () => {
  selectedAppForPayment.value = null;
};

const handlePaymentCompleted = async (paymentData) => {
  if (!selectedAppForPayment.value) {
    toast.error('No application selected for payment.');
    return;
  }
  const user = authStore.user;
  if (!user?.cid) {
    toast.error('User information is missing. Please log in again.');
    return;
  }

  isLoading.value = true;
  const paymentId = paymentData.paymentHash;
  const appToPay = selectedAppForPayment.value;
  appToPay.payment_status_display = 'Processing...';
  let redirectUrl = null;

  try {
    const paymentGatewayFormData = new FormData();
    paymentGatewayFormData.append('refNo', paymentId);
    paymentGatewayFormData.append('serviceCode', '102805');
    paymentGatewayFormData.append('taxPayerName', user.full_name || user.cid);
    paymentGatewayFormData.append('taxPayerNo', user.cid);
    paymentGatewayFormData.append('taxPayerDocumentNo', user.cid);
    paymentGatewayFormData.append('totalPayableAmount', 1000);
    paymentGatewayFormData.append('description', 'ECP Institute DPR Registration Fee');
    paymentGatewayFormData.append('mobileNo', user.contact_number || 'NA');
    paymentGatewayFormData.append('payerEmail', user.email || 'NA');
    paymentGatewayFormData.append('user', user.id);
    paymentGatewayFormData.append('payableAmount', 1000);
    paymentGatewayFormData.append('application_no', appToPay.id);
    paymentGatewayFormData.append('app_type', 'epc_institute');

    const paymentResponse = await apiService.makePayment(paymentGatewayFormData);
    if (paymentResponse.data?.content?.redirectUrl) {
      redirectUrl = paymentResponse.data.content.redirectUrl;
    }

    const updateFormData = new FormData();
    updateFormData.append('payment_id', paymentId);
    updateFormData.append('is_payment_complete', false);

    await apiService.patchEpcInstitute(appToPay.id, updateFormData);

    toast.success(`Payment initiated successfully. Redirecting for payment completion. A link has also been sent to your email.`, { timeout: 8000 });

    if (redirectUrl) {
        window.open(redirectUrl, '_blank');
    }

    await fetchApplications();

  } catch (error) {
    console.error('Payment handling error:', error);
    let errorMsg = 'An error occurred while confirming your payment.';
    if (error.response?.data) {
      errorMsg = `API Error: ${JSON.stringify(error.response.data)}`;
    }
    toast.error(`${errorMsg} Please contact support with Payment Ref: ${paymentId}`);
    appToPay.payment_status_display = 'Failed';
  } finally {
    isLoading.value = false;
    if (paymentModalRef.value) {
        paymentModalRef.value.closeModal();
    }
    closePaymentModal();
  }
};

onMounted(fetchApplications);
</script>

<style scoped>
.btn {
  @apply inline-flex items-center justify-center space-x-2 px-4 py-2 text-sm font-medium rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 transition-colors;
}

.btn-secondary {
  @apply text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 focus:ring-indigo-500;
}

.btn-primary {
  @apply text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500;
}

.btn-success {
    @apply text-white bg-green-600 hover:bg-green-700 focus:ring-green-500;
}

.max-h-screen {
  max-height: 1000px;
}
</style>
