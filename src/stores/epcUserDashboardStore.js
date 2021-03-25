// src/stores/epcUserDashboardStore.js
import { defineStore } from 'pinia';
import apiServices from '@/services/services';
import { useAuthStore } from '@/stores/authStore';

export const useEpcDashboardStore = defineStore('epcDashboard', {
  state: () => ({
    userDetail: null,
    applications: [],
    cpdCredits: 0,
    licenseExpiryDate: null,
    licenseStatus: 'Inactive',
    renewalMessage: '',
    showViewCertificateButton: false,
    recentActivities: [],
    upcomingDeadlines: [],
    selectedApplications: [],
    modalTitle: '',
    isLoading: false,
    selectedApplication: null,
    showCertificateModal: false,
    error: null, // Add an error state
  }),

  getters: {
    currentUserApplication() {
      const authStore = useAuthStore();
      if (!this.applications || !authStore.user?.cid) {
        return null;
      }

      // Find applications that match the user's CID
      const userApplications = this.applications.filter(app => app.cid === authStore.user.cid);

      // Sort by date (most recent first) and return the first one, or null if none found
      return userApplications.sort((a, b) => new Date(b.date) - new Date(a.date))[0] || null;
    },

    hasApplication() {
      return !!this.currentUserApplication;
    },

    hasSubmitted() {
      return !!this.currentUserApplication?.status;
    },

    hasApprovedApp() {
      const app = this.currentUserApplication;
      if (!app) return false;
      //Check in user_qualification for endorsement_decision
      return app.user_qualifications?.some(q => q.endorsement_decision === 'Approved') ?? false;
    },

    isRenewalPeriod() {
      if (!this.hasApprovedApp || !this.licenseExpiryDate) return false;
      const expiryDate = new Date(this.licenseExpiryDate);
      const today = new Date();
      const monthsRemaining = (expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 30);
      return monthsRemaining <= 3 && monthsRemaining > 0;
    },

    isInReregistrationPeriod() {
      if (!this.hasApprovedApp || !this.licenseExpiryDate) return false;

      const expiryDate = new Date(this.licenseExpiryDate);
      const today = new Date();
      const monthsSinceExpiry = (today.getTime() - expiryDate.getTime()) / (1000 * 60 * 60 * 24 * 30);

      return monthsSinceExpiry > 0 && monthsSinceExpiry <= 2;
    },
    visibleMenus() {
      // 1. After Registration (but before application):
      if (!this.hasSubmitted) {
        return {
          baseMenus: {
            dashboard: true,
            certification: true,
            cpdManagement: false,
            cogsManagement: false,
            profile: true,
          },
          certificationSubMenus: {
            applyForCertification: true,
            myApplications: false,
            renewal: false,
            reRegistration: false,
            additionalQualification: false,
          },
        };
      }

      // 2. Once Application is Applied (but not yet approved):
      if (this.hasSubmitted && !this.hasApprovedApp) {
        return {
          baseMenus: {
            dashboard: true,
            certification: true,
            cpdManagement: false,
            cogsManagement: false,
            profile: true,
          },
          certificationSubMenus: {
            applyForCertification: true,
            myApplications: true,
            renewal: false,
            reRegistration: false,
            additionalQualification: false,
          },
        };
      }

      // 3. Once Application is Approved:
      if (this.hasApprovedApp) {
        let baseMenus = {
          dashboard: true,
          certification: true,
          cpdManagement: true,
          cogsManagement: false,
          profile: true,
        };

        let certificationSubMenus = {
          applyForCertification: true,
          myApplications: true,
          renewal: false,
          reRegistration: false,
          additionalQualification: true,
        };

        // 4. Renewal Period:
        if (this.isRenewalPeriod) {
          certificationSubMenus.renewal = true;
        }

        // 5. Re-registration Period:
        if (this.isInReregistrationPeriod) {
          certificationSubMenus.reRegistration = true;
        }

        return { baseMenus, certificationSubMenus };
      }
      //default menus in case of an error or unexpected state.
      return {
        baseMenus: {
          dashboard: true,
          certification: false,
          cpdManagement: false,
          cogsManagement: false,
          profile: true,
        },
        certificationSubMenus: {
          applyForCertification: false,
          myApplications: false,
          renewal: false,
          reRegistration: false,
          additionalQualification: false,
        },
      };
    }

  },

  actions: {
    async fetchAllData(cid) {
      this.isLoading = true;
      this.error = null; // Reset error state
      try {
        // Fetch all required data in parallel
        await Promise.all([
          this.fetchUserDetails(cid),
          this.fetchApplications(cid),
          this.fetchCpdCredits(cid),
          this.fetchActivities(cid),
          this.fetchDeadlines(cid),
        ]);

        // Determine license status, renewal message, and certificate button visibility *after* data is fetched
        this.determineLicenseStatus();
        this.determineRenewalMessage();
        this.determineShowCertificateButton();

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        this.error = error.message || 'An unexpected error occurred.'; // Set error state
      } finally {
        this.isLoading = false;
      }
    },

   async fetchUserDetails(cid) {
      try {
        const response = await apiServices.getApplicationWithCid(cid);
        const userData = Array.isArray(response.data) ? response.data : response.data?.results || [];

        if (userData.length > 0) {
          // Sort applications by creation date (most recent first)
          const sortedApplications = userData.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

          // Extract user details from the most recent application
          const latestApplication = sortedApplications[0];

          // Extract the primary qualification (if available)
          const primaryQualification = latestApplication.user_qualifications?.find(q => q.is_primary_qualification);

          this.userDetail = {
            name: latestApplication.full_name || 'N/A',
            id: latestApplication.cid_no || 'N/A',
            email: latestApplication.email_address || 'N/A',
            phone: latestApplication.contact_no || 'N/A',
            // Use primary qualification details if available, otherwise default
            qualification: primaryQualification?.qualification_name_display || 'N/A',
            registrationNumber: latestApplication.registration_no || 'N/A',
            registrationType: latestApplication.registration_type_name || 'N/A',
            photo: latestApplication.passport_photo || null,
          };
        } else {
          this.userDetail = null; // No user data found
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
        this.error = error.message || 'Failed to fetch user details.';
        this.userDetail = null; // Ensure userDetail is reset on error
      }
    },

    async fetchApplications(cid) {
      try {
        const response = await apiServices.getApplicationWithCid(cid);
        const applicationsData = Array.isArray(response.data) ? response.data : response.data?.results || [];
        this.applications = applicationsData; // Directly assign, no mapping needed

      } catch (error) {
        console.error('Error fetching applications:', error);
        this.error = error.message || 'Failed to fetch applications.';
        this.applications = []; // Set to empty array on error
      }
    },

    async fetchCpdCredits(cid) {
      try {
        const response = await apiServices.getEpcCpdTasks();
        const cpdData = Array.isArray(response.data) ? response.data : response.data?.results || [];
        const userTasks = cpdData.filter(task => task.cid === cid);  //Make sure the task object has cid
        this.cpdCredits = userTasks.reduce((total, task) => total + (task.credits || 0), 0);
      } catch (error) {
        console.error('Error fetching CPD credits:', error);
        this.error = error.message || 'Failed to fetch CPD credits.';
        this.cpdCredits = 0; // Reset on error
      }
    },
async fetchActivities(cid) {
      try {
        const [appResponse, cpdResponse] = await Promise.all([
          apiServices.getApplicationWithCid(cid),
          apiServices.getEpcCpdTasks(),
        ]);

        const activities = [];

        const appData = Array.isArray(appResponse.data)
          ? appResponse.data
          : appResponse.data?.results || [];

        appData.forEach((app) => {
          // Iterate through user_qualifications for activity details
          app.user_qualifications?.forEach(qualification => {
             activities.push({
              id: `app-${app.id}-${qualification.id}`, // More specific ID
              type: 'Application',
              status: qualification.endorsement_decision || 'Pending', // Get status from qualification
              date: qualification.updated_at || qualification.created_at, // Use qualification dates
              title: `${app.registration_type_name || 'Registration'} application ${qualification.endorsement_decision?.toLowerCase() || 'pending'}`, // Use type_name
              description:
                qualification.endorsement_remarks ||
                `Your application has been ${qualification.endorsement_decision?.toLowerCase() || 'processed'}`,
            });
          });
        });


        const cpdData = Array.isArray(cpdResponse.data)
          ? cpdResponse.data
          : cpdResponse.data?.results || [];


        const userCpdTasks = cpdData.filter((task) => task.cid === cid);
          userCpdTasks.forEach((cpd) => {
            activities.push({
              id: `cpd-${cpd.id}`,
              type: 'CPD',
              status: cpd.status || 'Submitted',  // Use task status if available
              date: cpd.created_at,  //Use created date
              title: `CPD Activity: ${cpd.title || 'Activity'}`,
              description: `${cpd.credits || 0} credits earned for ${cpd.description || 'professional development'}`,
            });
          });

        this.recentActivities = activities
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 5);
      } catch (error) {
        console.error('Error fetching activities:', error);
        this.error = error.message || 'Failed to fetch recent activities.';
        this.recentActivities = []; // Reset on error
      }
    },
  async fetchDeadlines(cid) {
      try {
        const appResponse = await apiServices.getApplicationWithCid(cid);
        const deadlines = [];

        const appData = Array.isArray(appResponse.data) ? appResponse.data : appResponse.data?.results || [];

        appData.forEach(app => {
            app.user_qualifications?.forEach(qualification => {
                if (qualification.endorsement_decision === 'Approved' && qualification.expiry_date) {
                    deadlines.push({
                        id: `renewal-${app.id}-${qualification.id}`,
                        title: 'License Renewal',
                        date: qualification.expiry_date,
                        type: 'Renewal',
                        description: 'Submit your renewal application before license expires',
                    });
                }
            });
        });

        const currentYear = new Date().getFullYear();
        const cpdDeadline = new Date(currentYear, 11, 31); // December 31st

        deadlines.push({
          id: 'cpd-annual',
          title: 'Annual CPD Submission',
          date: cpdDeadline.toISOString(),
          type: 'CPD',
          description: 'Submit your CPD records for the year',
        });

        this.upcomingDeadlines = deadlines.sort((a, b) => new Date(a.date) - new Date(b.date)).slice(0, 3);
      } catch (error) {
        console.error('Error fetching deadlines:', error);
        this.error = error.message || 'Failed to fetch upcoming deadlines.';
        this.upcomingDeadlines = []; // Reset on error
      }
    },
   determineLicenseStatus() {
    let latestExpiry = null;
    let latestStatus = 'Inactive'; // Default to Inactive

    this.applications.forEach(app => {
        app.user_qualifications?.forEach(qualification => {
            if (qualification.endorsement_decision === 'Approved') {
                const expiryDate = new Date(qualification.expiry_date);
                if (!isNaN(expiryDate)) { // Check if expiry_date is valid
                    if (!latestExpiry || expiryDate > new Date(latestExpiry)) {
                        latestExpiry = qualification.expiry_date;
                        latestStatus = new Date(qualification.expiry_date) > new Date() ? 'Active' : 'Expired';
                    }
                }
            }
        });
    });

    this.licenseExpiryDate = latestExpiry;
    this.licenseStatus = latestStatus;
},

    determineRenewalMessage() {
       if (this.licenseStatus === 'Active' && this.licenseExpiryDate) {
        const expiryDate = new Date(this.licenseExpiryDate);
        const today = new Date();
        const daysToExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

        if (daysToExpiry <= 30) {
          this.renewalMessage = `Your license will expire in ${daysToExpiry} days. Please renew soon.`;
        } else if (daysToExpiry <= 90) {
          this.renewalMessage = 'Your license renewal is due in the next 3 months.';
        } else {
          this.renewalMessage = '';
        }
      } else if (this.licenseStatus === 'Expired') {
        this.renewalMessage = 'Your license has expired. Please renew immediately.';
      } else {
        this.renewalMessage = '';
      }
    },

    determineShowCertificateButton() {
       this.showViewCertificateButton = this.applications.some(app =>
        app.user_qualifications?.some(q => q.endorsement_decision === 'Approved')
      );
    },

  setSelectedApplications(status) {
    // Filter applications based on the endorsement_decision within user_qualifications
    this.selectedApplications = this.applications.filter(app =>
        app.user_qualifications?.some(q => q.endorsement_decision === status)
    );
    this.modalTitle = `${status} Applications`;
},

    clearSelectedApplications() {
      this.selectedApplications = [];
      this.modalTitle = '';
    },

  async setShowCertificateModal(show) {
    if (show) {
      // Find an approved application
      const approvedApp = this.applications.find(app =>
        app.user_qualifications?.some(q => q.endorsement_decision === 'Approved')
      );

      if (approvedApp) {
        try {
          const response = await apiServices.getEpcNewApplication(approvedApp.id);
          const applicationData = response.data;

            if (applicationData) {
                // Find the primary qualification within the application
                const primaryQualification = applicationData.user_qualifications?.find(q => q.is_primary_qualification);

                this.selectedApplication = {
                    ...applicationData,
                    // Use primary qualification details, if available
                    registrationNumber: primaryQualification?.registration_no || 'N/A',
                    fullName: applicationData.full_name || 'N/A',
                    issueDate: primaryQualification?.registration_date || applicationData.created_at,
                    expiryDate: primaryQualification?.expiry_date || null,
                    qualificationName: primaryQualification?.qualification_name_display || 'N/A',
                };
            } else {
                console.error('Application data is empty.');
                this.selectedApplication = null;
            }
        } catch (error) {
          console.error('Error fetching application details for certificate:', error);
          this.error = error.message || 'Failed to fetch certificate details.';
          this.selectedApplication = null;
        }
      }
    }
    this.showCertificateModal = show; // Always set the modal visibility
  },
    // --- Actions adapted from source store ---
    async fetchApplicationDetails() { //renamed to initializeApplications
      this.isLoading = true;
      this.error = null; // Assuming you add an error ref to the state

      try {
        //using already existing function.
        await this.fetchApplications(useAuthStore().user.cid) // Fetch applications based on CID.

      } catch (err) {
        console.error('Error fetching application details:', err);
        this.error = err.response?.data?.message || 'Failed to fetch application details'; // Assuming you add an error ref
        this.applications = []; //  set to empty if there's an error
      } finally {
        this.isLoading = false;
      }
    },
    async initialize() {
      const authStore = useAuthStore();
      if (authStore.isAuthenticated) {
        await this.fetchApplicationDetails(); // Call the new method to load application details
      }
    },
    resetStore() {
      // Reset all state properties to their initial values
      Object.assign(this, {
        userDetail: null,
        applications: [],
        cpdCredits: 0,
        licenseExpiryDate: null,
        licenseStatus: 'Inactive',
        renewalMessage: '',
        showViewCertificateButton: false,
        recentActivities: [],
        upcomingDeadlines: [],
        selectedApplications: [],
        modalTitle: '',
        isLoading: false,
        selectedApplication: null,
        showCertificateModal: false,
        error: null, // Assuming you also want to reset error
      });

    },

  },
});
