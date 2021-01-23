export default {
  super_admin: {
    dashboard: () => import('@/views/admin/SuperAdmin/Dashboard.vue'),
    // users: () => import('@/views/admin/SuperAdmin/Users.vue'),
    // user_management: () => import('@/views/admin/SuperAdmin/UserManagement.vue'),
    // settings: () => import('@/views/admin/SuperAdmin/Settings.vue'),
    // activity_logs: () => import('@/views/admin/SuperAdmin/ActivityLogs.vue'),
    // reports: () => import('@/views/admin/SuperAdmin/Reports.vue'),
    // ... any other Super Admin specific routes
  },
  admin: {
    roq: {
      dashboard: () => import('@/views/admin/ROQ/Dashboard.vue'),
      decisions: () => import('@/views/admin/ROQ/Dashboard.vue'),
      learning_types: () => import('@/views/admin/ROQ/Dashboard.vue'),
      qualifications: () => import('@/views/admin/ROQ/Dashboard.vue'),
      reason_for_issue_of_second_copy: () => import('@/views/admin/ROQ/Dashboard.vue'),
      type_of_courses: () => import('@/views/admin/ROQ/Dashboard.vue'),
      user_profile: () => import('@/views/admin/ROQ/Dashboard.vue'),
    },
    ecpf: {
      dashboard: () => import('@/views/admin/ECPF/Dashboard.vue'),
      // applications: () => import('@/views/admin/ECPF/Applications.vue'),
      // new_application: () => import('@/views/admin/ECPF/NewApplication.vue'),
      // pending_applications: () => import('@/views/admin/ECPF/PendingApplications.vue'),
      // approved_applications: () => import('@/views/admin/ECPF/ApprovedApplications.vue'),
      // clients: () => import('@/views/admin/ECPF/Clients.vue'),
      // reports: () => import('@/views/admin/ECPF/Reports.vue'),
      // ... all other ECPF related routes for admin
    },
    accreditation: {
      dashboard: () => import('@/views/admin/ACCRED/Dashboard.vue'),
      // applications: () => import('@/views/admin/ACCRED/Applications.vue'),
      // new_application: () => import('@/views/admin/ACCRED/NewApplication.vue'),
      // pending_applications: () => import('@/views/admin/ACCRED/PendingApplications.vue'),
      // approved_applications: () => import('@/views/admin/ACCRED/ApprovedApplications.vue'),
      // clients: () => import('@/views/admin/ACCRED/Clients.vue'),
      // reports: () => import('@/views/admin/ACCRED/Reports.vue'),
      // ... all other Accreditation related routes for admin
    },
    engineering_certification: {
      dashboard: () => import('@/views/admin/Engineering/Dashboard.vue'),
      // applications: () => import('@/views/admin/Engineering/Applications.vue'),
      // new_application: () => import('@/views/admin/Engineering/NewApplication.vue'),
      // pending_applications: () => import('@/views/admin/Engineering/PendingApplications.vue'),
      // approved_applications: () => import('@/views/admin/Engineering/ApprovedApplications.vue'),
      // clients: () => import('@/views/admin/Engineering/Clients.vue'),
      // reports: () => import('@/views/admin/Engineering/Reports.vue'),
      // ... all other Engineering related routes for admin
    },
    health_certification: {
      dashboard: () => import('@/views/admin/BMHC/Dashboard.vue'),
      // applications: () => import('@/views/admin/BMHC/Applications.vue'),
      // new_application: () => import('@/views/admin/BMHC/NewApplication.vue'),
      // pending_applications: () => import('@/views/admin/BMHC/PendingApplications.vue'),
      // approved_applications: () => import('@/views/admin/BMHC/ApprovedApplications.vue'),
      // clients: () => import('@/views/admin/BMHC/Clients.vue'),
      // reports: () => import('@/views/admin/BMHC/Reports.vue'),
      // ... all other Health Certification related routes for admin
    },
  },
  user: {
    roq: {
      dashboard: () => import('@/views/admin/ROQ/Dashboard.vue'),
      my_applications: () => import('@/views/admin/ROQ/Dashboard.vue'),
      secondcopy_applications: () => import('@/views/admin/ROQ/Dashboard.vue'),
      application_lists: () => import('@/views/admin/ROQ/Dashboard.vue'),
      application_details: () => import('@/views/admin/ROQ/Dashboard.vue'),
      profile: () => import('@/views/admin/ROQ/Dashboard.vue'),
      // ... other ROQ routes for a regular user
    },
    ecpf: {
      dashboard: () => import('@/views/admin/ECPF/Dashboard.vue'),
      // my_applications: () => import('@/views/admin/ECPF/MyApplications.vue'),
      // new_application: () => import('@/views/admin/ECPF/NewApplication.vue'),
      // application_status: () => import('@/views/admin/ECPF/ApplicationStatus.vue'),
      // profile: () => import('@/views/admin/ECPF/Profile.vue'),
      // ... other ECPF routes for a regular user
    },
    accreditation: {
      dashboard: () => import('@/views/admin/ACCRED/Dashboard.vue'),
      // my_applications: () => import('@/views/admin/ACCRED/MyApplications.vue'),
      // new_application: () => import('@/views/admin/ACCRED/NewApplication.vue'),
      // application_status: () => import('@/views/admin/ACCRED/ApplicationStatus.vue'),
      // profile: () => import('@/views/admin/ACCRED/Profile.vue'),
      // ... other Accreditation routes for a regular user
    },
    engineering_certification: {
      dashboard: () => import('@/views/admin/Engineering/Dashboard.vue'),
      // my_applications: () => import('@/views/admin/Engineering/MyApplications.vue'),
      // new_application: () => import('@/views/admin/Engineering/NewApplication.vue'),
      // application_status: () => import('@/views/admin/Engineering/ApplicationStatus.vue'),
      // profile: () => import('@/views/admin/Engineering/Profile.vue'),
      // ... other Engineering routes for a regular user
    },
    health_certification: {
      dashboard: () => import('@/views/admin/BMHC/Dashboard.vue'),
      practitioner_reg_and_cert: {
        component: () => import('@/views/admin/BMHC/Dashboard.vue'),
        children: {
          registration: () => import('@/views/admin/BMHC/Dashboard.vue'),
          certificate: () => import('@/views/admin/BMHC/Dashboard.vue'),
        },
      },
      cpd: () => import('@/views/admin/BMHC/Dashboard.vue'),
      CoGS: () => import('@/views/admin/BMHC/Dashboard.vue'),
    },
  },
  dealing_officer: {
    roq: {
      dashboard: () => import('@/views/admin/ROQ/Dashboard.vue'),
      application_lists: () => import('@/views/admin/ROQ/Dashboard.vue'),
      second_copy_lists: () => import('@/views/admin/ROQ/Dashboard.vue'),
      application_details: () => import('@/views/admin/ROQ/Dashboard.vue'),
      // reports: () => import('@/views/admin/ROQ/Reports.vue'),
      // ... other ROQ routes for dealing officer
    },
    ecpf: {
      dashboard: () => import('@/views/admin/ECPF/Dashboard.vue'),
      // pending_applications: () => import('@/views/admin/ECPF/PendingApplications.vue'),
      // approved_applications: () => import('@/views/admin/ECPF/ApprovedApplications.vue'),
      // rejected_applications: () => import('@/views/admin/ECPF/RejectedApplications.vue'),
      // reports: () => import('@/views/admin/ECPF/Reports.vue'),
      // ... other ECPF routes for dealing officer
    },
    accreditation: {
      dashboard: () => import('@/views/admin/ACCRED/Dashboard.vue'),
      // pending_applications: () => import('@/views/admin/ACCRED/PendingApplications.vue'),
      // approved_applications: () => import('@/views/admin/ACCRED/ApprovedApplications.vue'),
      // rejected_applications: () => import('@/views/admin/ACCRED/RejectedApplications.vue'),
      // reports: () => import('@/views/admin/ACCRED/Reports.vue'),
      // ... other Accreditation routes for dealing officer
    },
    engineering_certification: {
      dashboard: () => import('@/views/admin/Engineering/Dashboard.vue'),
      // pending_applications: () => import('@/views/admin/Engineering/PendingApplications.vue'),
      // approved_applications: () => import('@/views/admin/Engineering/ApprovedApplications.vue'),
      // rejected_applications: () => import('@/views/admin/Engineering/RejectedApplications.vue'),
      // reports: () => import('@/views/admin/Engineering/Reports.vue'),
      // ... other Engineering routes for dealing officer
    },
    health_certification: {
      dashboard: () => import('@/views/admin/BMHC/Dashboard.vue'),
      application_lists: () => import('@/views/admin/BMHC/Dashboard.vue'),
      cpd_management: () => import('@/views/admin/BMHC/Dashboard.vue'),
      institutes: () => import('@/views/admin/BMHC/Dashboard.vue'),
      profiles: () => import('@/views/admin/BMHC/Dashboard.vue'),
      cogs: () => import('@/views/admin/BMHC/Dashboard.vue'),
      capa: () => import('@/views/admin/BMHC/Dashboard.vue'),
      payments: () => import('@/views/admin/BMHC/Dashboard.vue'),
      reports: () => import('@/views/admin/BMHC/Dashboard.vue'),
    },
  },
  chief: {
    roq: {
      dashboard: () => import('@/views/admin/ROQ/Dashboard.vue'),
      application_lists: () => import('@/views/admin/ROQ/Dashboard.vue'),
      second_copy_lists: () => import('@/views/admin/ROQ/Dashboard.vue'),
      // reports: () => import('@/views/admin/ROQ/Reports.vue'),
      // ... other ROQ routes for chief
    },
    ecpf: {
      dashboard: () => import('@/views/admin/ECPF/Dashboard.vue'),
      // for_review_applications: () => import('@/views/admin/ECPF/ForReviewApplications.vue'),
      // endorsed_applications: () => import('@/views/admin/ECPF/EndorsedApplications.vue'),
      // reports: () => import('@/views/admin/ECPF/Reports.vue'),
      // ... other ECPF routes for chief
    },
    accreditation: {
      dashboard: () => import('@/views/admin/ACCRED/Dashboard.vue'),
      // for_review_applications: () => import('@/views/admin/ACCRED/ForReviewApplications.vue'),
      // endorsed_applications: () => import('@/views/admin/ACCRED/EndorsedApplications.vue'),
      // reports: () => import('@/views/admin/ACCRED/Reports.vue'),
      // ... other Accreditation routes for chief
    },
    engineering_certification: {
      dashboard: () => import('@/views/admin/Engineering/Dashboard.vue'),
      // for_review_applications: () => import('@/views/admin/Engineering/ForReviewApplications.vue'),
      // endorsed_applications: () => import('@/views/admin/Engineering/EndorsedApplications.vue'),
      // reports: () => import('@/views/admin/Engineering/Reports.vue'),
      // ... other Engineering routes for chief
    },
    health_certification: {
      dashboard: () => import('@/views/admin/BMHC/Dashboard.vue'),
      application_lists: () => import('@/views/admin/BMHC/Dashboard.vue'),
      cpd_management: () => import('@/views/admin/BMHC/Dashboard.vue'),
      institutes: () => import('@/views/admin/BMHC/Dashboard.vue'),
      profiles: () => import('@/views/admin/BMHC/Dashboard.vue'),
      cogs: () => import('@/views/admin/BMHC/Dashboard.vue'),
      payments: () => import('@/views/admin/BMHC/Dashboard.vue'),
      reports: () => import('@/views/admin/BMHC/Dashboard.vue'),
      // ... other Health Certification routes for chief
    },
  },
  director: {
    roq: {
      dashboard: () => import('@/views/admin/ROQ/Dashboard.vue'),
      // for_approval_applications: () => import('@/views/admin/ROQ/ForApprovalApplications.vue'),
      // approved_applications: () => import('@/views/admin/ROQ/ApprovedApplications.vue'),
      // reports: () => import('@/views/admin/ROQ/Reports.vue'),
      // ... other ROQ routes for director
    },
    ecpf: {
      dashboard: () => import('@/views/admin/ECPF/Dashboard.vue'),
      // for_approval_applications: () => import('@/views/admin/ECPF/ForApprovalApplications.vue'),
      // approved_applications: () => import('@/views/admin/ECPF/ApprovedApplications.vue'),
      // reports: () => import('@/views/admin/ECPF/Reports.vue'),
      // ... other ECPF routes for director
    },
    accreditation: {
      dashboard: () => import('@/views/admin/ACCRED/Dashboard.vue'),
      // for_approval_applications: () => import('@/views/admin/ACCRED/ForApprovalApplications.vue'),
      // approved_applications: () => import('@/views/admin/ACCRED/ApprovedApplications.vue'),
      // reports: () => import('@/views/admin/ACCRED/Reports.vue'),
      // ... other Accreditation routes for director
    },
    engineering_certification: {
      dashboard: () => import('@/views/admin/Engineering/Dashboard.vue'),
      // for_approval_applications: () => import('@/views/admin/Engineering/ForApprovalApplications.vue'),
      // approved_applications: () => import('@/views/admin/Engineering/ApprovedApplications.vue'),
      // reports: () => import('@/views/admin/Engineering/Reports.vue'),
      // ... other Engineering routes for director
    },
    health_certification: {
      dashboard: () => import('@/views/admin/BMHC/Dashboard.vue'),
      // for_approval_applications: () => import('@/views/admin/BMHC/ForApprovalApplications.vue'),
      // approved_applications: () => import('@/views/admin/BMHC/ApprovedApplications.vue'),
      // reports: () => import('@/views/admin/BMHC/Reports.vue'),
      // ... other Health Certification routes for director
    },
  },
  institutions: {
    ecpf: {
      dashboard: () => import('@/views/admin/ECPF/Dashboard.vue'),
      // for_approval_applications: () => import('@/views/admin/ECPF/ForApprovalApplications.vue'),
      // approved_applications: () => import('@/views/admin/ECPF/ApprovedApplications.vue'),
      // reports: () => import('@/views/admin/ECPF/Reports.vue'),
      // ... other ECPF routes for director
    },
    accreditation: {
      dashboard: () => import('@/views/admin/ACCRED/Dashboard.vue'),
      // for_approval_applications: () => import('@/views/admin/ACCRED/ForApprovalApplications.vue'),
      // approved_applications: () => import('@/views/admin/ACCRED/ApprovedApplications.vue'),
      // reports: () => import('@/views/admin/ACCRED/Reports.vue'),
      // ... other Accreditation routes for director
    },
    engineering_certification: {
      dashboard: () => import('@/views/admin/Engineering/Dashboard.vue'),
      // for_approval_applications: () => import('@/views/admin/Engineering/ForApprovalApplications.vue'),
      // approved_applications: () => import('@/views/admin/Engineering/ApprovedApplications.vue'),
      // reports: () => import('@/views/admin/Engineering/Reports.vue'),
      // ... other Engineering routes for director
    },
    health_certification: {
      dashboard: () => import('@/views/admin/BMHC/Dashboard.vue'),
      // for_approval_applications: () => import('@/views/admin/BMHC/ForApprovalApplications.vue'),
      // approved_applications: () => import('@/views/admin/BMHC/ApprovedApplications.vue'),
      // reports: () => import('@/views/admin/BMHC/Reports.vue'),
      // ... other Health Certification routes for director
    },
  },
  cpd_cme_provider: {
    ecpf: {
      dashboard: () => import('@/views/admin/ECPF/Dashboard.vue'),
      // for_approval_applications: () => import('@/views/admin/ECPF/ForApprovalApplications.vue'),
      // approved_applications: () => import('@/views/admin/ECPF/ApprovedApplications.vue'),
      // reports: () => import('@/views/admin/ECPF/Reports.vue'),
      // ... other ECPF routes for director
    },
    accreditation: {
      dashboard: () => import('@/views/admin/ACCRED/Dashboard.vue'),
      // for_approval_applications: () => import('@/views/admin/ACCRED/ForApprovalApplications.vue'),
      // approved_applications: () => import('@/views/admin/ACCRED/ApprovedApplications.vue'),
      // reports: () => import('@/views/admin/ACCRED/Reports.vue'),
      // ... other Accreditation routes for director
    },
    engineering_certification: {
      dashboard: () => import('@/views/admin/Engineering/Dashboard.vue'),
      // for_approval_applications: () => import('@/views/admin/Engineering/ForApprovalApplications.vue'),
      // approved_applications: () => import('@/views/admin/Engineering/ApprovedApplications.vue'),
      // reports: () => import('@/views/admin/Engineering/Reports.vue'),
      // ... other Engineering routes for director
    },
    health_certification: {
      dashboard: () => import('@/views/admin/BMHC/Dashboard.vue'),
      // for_approval_applications: () => import('@/views/admin/BMHC/ForApprovalApplications.vue'),
      // approved_applications: () => import('@/views/admin/BMHC/ApprovedApplications.vue'),
      // reports: () => import('@/views/admin/BMHC/Reports.vue'),
      // ... other Health Certification routes for director
    },
  },
}
