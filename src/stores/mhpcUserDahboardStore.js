import { defineStore } from 'pinia';
import apiServices from '@/services/services';
import dayjs from 'dayjs';

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    userDetail: {
      username: '',
      registration_no: '',
    },
    applications: [],
    cpdCredits: 0,
    licenseExpiryDate: null,
    licenseStatus: null,
    renewalMessage: '',
    showViewCertificateButton: false,
    recentActivities: [],
    upcomingDeadlines: [],
    selectedApplications: [],
    modalTitle: '',
    isLoading: false,
    selectedApplication: null, // Changed: Store the *entire* selected application
    showCertificateModal: false,
  }),

  actions: {
    async fetchAllData(cid) {
      this.isLoading = true;
      try {
        const [cogsData, applicationsData, cpdData] = await Promise.all([
          apiServices.getBmhcCogsByCid(cid),
          apiServices.getFullApplicationListByCid(cid),
          apiServices.getBmhcCpdRecordsByCid(cid),
        ]);

        this.processCogsData(cogsData);
        this.processApplicationsData(applicationsData);
        this.processCpdData(cpdData);
        this.updateActivitiesAndDeadlines();
      } finally {
        this.isLoading = false;
      }
    },

    processCogsData(response) {
      if (response.data.valid && response.data.details) {
        this.userDetail.username = response.data.details.full_name;
      }
    },

    processApplicationsData(response) {
      if (response.data.results?.length) {
        const latestApp = response.data.results[0];
        this.updateUserDetails(latestApp);
        this.updateLicenseStatus(latestApp);
        this.processApplicationsList(response.data.results);
        this.checkExpiration(latestApp.expiry_date);
      }
    },

    processCpdData(response) {
      if (response.data.valid && response.data.details) {
        this.cpdCredits = response.data.details.cpd_credit || 0;
        this.addCpdApplication(response.data.details);
      }
    },

    updateUserDetails(app) {
      this.userDetail.registration_no = app.registration_no;
      this.licenseExpiryDate = app.expiry_date;
      this.licenseStatus = app.user_qualifications[0]?.application_review_status;
    },

    updateLicenseStatus(app) {
      this.showViewCertificateButton = app.user_qualifications.every(q =>
        q.application_review_status === 'Approved' &&
        q.physical_review_status === 'Approved' &&
        q.endorsement_decision === 'Approved'
      );
    },

    processApplicationsList(results) {
      this.applications = results.map(app => ({
        ...app, // Store the *entire* application object.  This is crucial!
        name: app.registration_type?.name || 'Unknown Application',
        type: this.determineApplicationType(app.registration_type?.name),
        date: app.created_at,
        status: app.user_qualifications[0]?.application_review_status || 'Status Unavailable',
        remarks: app.user_qualifications[0]?.application_review_remark || '',
      }));
    },

    determineApplicationType(name) {
      if (!name) return 'Other';
      if (name.includes('Registration')) return 'License';
      if (name.includes('CPD')) return 'CPD';
      return 'Other';
    },

    addCpdApplication(cpdDetails) {
      this.applications.push({
        ...cpdDetails, // Store the *entire* CPD details object
        name: cpdDetails.title_of_cpd || 'CPD Record',
        type: 'CPD',
        date: cpdDetails.created_at,
        status: cpdDetails.review_status || 'Pending',
        remarks: cpdDetails.remark || '',
      });
    },

    checkExpiration(expiryDate) {
      if (!expiryDate) {
        this.renewalMessage = 'Expiry date not available';
        return;
      }

      const expiry = dayjs(expiryDate);
      const current = dayjs();
      const threeMonths = expiry.subtract(3, 'month');
      const twoWeeks = expiry.subtract(2, 'week');

      if (current.isAfter(expiry)) {
        this.renewalMessage = 'License has expired';
      } else if (current.isAfter(twoWeeks)) {
        this.renewalMessage = 'License expires in less than 2 weeks';
      } else if (current.isAfter(threeMonths)) {
        this.renewalMessage = 'License expires in less than 3 months';
      } else {
        this.renewalMessage = 'License is valid';
      }
    },

    updateActivitiesAndDeadlines() {
      this.recentActivities = this.applications
        .slice(0, 5)
        .map(app => ({
          type: app.type.toLowerCase(),
          title: app.name,
          date: app.date
        }));

      this.upcomingDeadlines = [
        {
          title: 'CPD Points Target',
          date: dayjs().endOf('year').format('YYYY-MM-DD')
        },
        {
          title: 'License Renewal',
          date: this.licenseExpiryDate
        }
      ].filter(deadline => deadline.date);
    },

    setSelectedApplications(status) {
      this.selectedApplications = this.applications.filter(app => app.status === status);
      this.modalTitle = `${status} Applications`;
    },

    clearSelectedApplications() {
      this.selectedApplications = [];
      this.modalTitle = '';
    },

    // NO fetchCertificateData needed!

    setShowCertificateModal(show) {
      this.showCertificateModal = show;
       // Find and store the relevant application when showing the modal
        if (show) {
          this.selectedApplication = this.applications.find(app => app.registration_no === this.userDetail.registration_no);
        } else {
          this.selectedApplication = null; // Clear it when closing
        }
    }
  }
});
