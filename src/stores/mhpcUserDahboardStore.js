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
    selectedApplication: null,
    showCertificateModal: false,
    error: null, // Added to track errors
  }),

  actions: {
    /** Fetch all dashboard data with proper error handling */
    async fetchAllData(cid) {
      this.isLoading = true;
      this.error = null;

      try {
        // Run each API call independently with its own error handling
        const cogsData = await apiServices.getMhpcCogsByCid(cid)
          .catch(error => {
            console.error('Error fetching COGS data:', error);
            return null;
          });

        const applicationsData = await apiServices.getMhpcFullApplicationListByCid(cid)
          .catch(error => {
            console.error('Error fetching applications data:', error);
            return null;
          });

        const cpdData = await apiServices.getMhpcCpdRecordsByCid(cid)
          .catch(error => {
            console.error('Error fetching CPD data:', error);
            return null;
          });

        // Process data only if it exists
        if (cogsData) this.processCogsData(cogsData);
        if (applicationsData) this.processApplicationsData(applicationsData);
        if (cpdData) this.processCpdData(cpdData);

        this.updateActivitiesAndDeadlines();
      } catch (error) {
        console.error('Error in fetchAllData:', error);
        this.error = 'An unexpected error occurred. Some data may be incomplete.';
      } finally {
        this.isLoading = false;
      }
    },

    /** Process COGS data with null safety */
    processCogsData(response) {
      if (response?.data?.valid && response.data.details?.full_name) {
        this.userDetail.username = response.data.details.full_name;
      } else {
        console.warn('Invalid or missing COGS data');
        this.userDetail.username = 'Unknown User';
      }
    },

    /** Process applications data with null safety and empty case handling */
    processApplicationsData(response) {
      const results = response?.data?.results;
      if (Array.isArray(results) && results.length > 0) {
        const latestApp = results[0];
        this.updateUserDetails(latestApp);
        this.updateLicenseStatus(latestApp);
        this.processApplicationsList(results);
        this.checkExpiration(latestApp.expiry_date);
      } else {
        console.warn('No applications found');
        this.renewalMessage = 'No applications available';
      }
    },

    /** Process CPD data with null safety */
    processCpdData(response) {
      const cpdDetails = response?.data?.details;
      if (response?.data?.valid && cpdDetails) {
        this.cpdCredits = cpdDetails.cpd_credit || 0;
        this.addCpdApplication(cpdDetails);
      } else {
        console.warn('Invalid or missing CPD data');
        this.cpdCredits = 0;
      }
    },

    /** Update user details with null checks */
    updateUserDetails(app) {
      if (app) {
        this.userDetail.registration_no = app.registration_no || '';
        this.licenseExpiryDate = app.expiry_date || null;
        this.licenseStatus = app.user_qualifications?.[0]?.application_review_status || 'Unknown';
      }
    },

    /** Update license status with null safety */
    updateLicenseStatus(app) {
      if (app?.user_qualifications && Array.isArray(app.user_qualifications)) {
        this.showViewCertificateButton = app.user_qualifications.every(q =>
          q?.application_review_status === 'Approved' &&
          q?.physical_review_status === 'Approved' &&
          q?.endorsement_decision === 'Approved'
        );
      } else {
        this.showViewCertificateButton = false;
      }
    },

    /** Process applications list with null safety */
    processApplicationsList(results) {
      if (Array.isArray(results)) {
        this.applications = results.map(app => ({
          ...app,
          name: app?.registration_type?.name || 'Unknown Application',
          type: this.determineApplicationType(app?.registration_type?.name),
          date: app?.created_at || '',
          status: app?.user_qualifications?.[0]?.application_review_status || 'Status Unavailable',
          remarks: app?.user_qualifications?.[0]?.application_review_remark || '',
        }));
      } else {
        this.applications = [];
      }
    },

    /** Determine application type with null check */
    determineApplicationType(name) {
      if (!name) return 'Other';
      if (name.includes('Registration')) return 'License';
      if (name.includes('CPD')) return 'CPD';
      return 'Other';
    },

    /** Add CPD application with null safety */
    addCpdApplication(cpdDetails) {
      if (cpdDetails) {
        this.applications.push({
          ...cpdDetails,
          name: cpdDetails.title_of_cpd || 'CPD Record',
          type: 'CPD',
          date: cpdDetails.created_at || '',
          status: cpdDetails.review_status || 'Pending',
          remarks: cpdDetails.remark || '',
        });
      }
    },

    /** Check expiration with date validation */
    checkExpiration(expiryDate) {
      if (!expiryDate || !dayjs(expiryDate).isValid()) {
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

    /** Update activities and deadlines with null safety */
    updateActivitiesAndDeadlines() {
      if (Array.isArray(this.applications)) {
        this.recentActivities = this.applications
          .slice(0, 5)
          .map(app => ({
            type: (app.type || 'other').toLowerCase(),
            title: app.name || 'Untitled',
            date: app.date || ''
          }));

        this.upcomingDeadlines = [
          {
            title: 'CPD Points Target',
            date: dayjs().endOf('year').format('YYYY-MM-DD'),
          },
          {
            title: 'License Renewal',
            date: this.licenseExpiryDate || null,
          },
        ].filter(deadline => deadline.date);
      } else {
        this.recentActivities = [];
        this.upcomingDeadlines = [];
      }
    },

    /** Set selected applications with null safety */
    setSelectedApplications(status) {
      if (Array.isArray(this.applications)) {
        this.selectedApplications = this.applications.filter(app => app.status === status);
        this.modalTitle = `${status} Applications`;
      } else {
        this.selectedApplications = [];
        this.modalTitle = '';
      }
    },

    /** Clear selected applications */
    clearSelectedApplications() {
      this.selectedApplications = [];
      this.modalTitle = '';
    },

    /** Toggle certificate modal with null safety */
    setShowCertificateModal(show) {
      this.showCertificateModal = show;
      if (show && Array.isArray(this.applications)) {
        this.selectedApplication = this.applications.find(app => app.registration_no === this.userDetail.registration_no) || null;
      } else {
        this.selectedApplication = null;
      }
    },
  },
});
