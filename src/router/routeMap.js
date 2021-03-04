const roqDashboard = () => import('@/views/admin/ROQ/Dashboard.vue')
const ecpfDashboard = () => import('@/views/admin/ECPF/Dashboard.vue')
const bmhcDashboard = () => import('@/views/admin/BMHC/Dashboard.vue')
const accredDashboard = () => import('@/views/admin/ACCRED/Dashboard.vue')
const engineeringDashboard = () => import('@/views/admin/Engineering/Dashboard.vue')
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
      dashboard: roqDashboard,
      decisions: roqDashboard,
      learning_types: roqDashboard,
      qualifications: roqDashboard,
      reason_for_issue_of_second_copy: roqDashboard,
      type_of_courses: roqDashboard,
      genders: roqDashboard,
      countries: roqDashboard,
      user_profile: roqDashboard,
      esign: roqDashboard,
    },
    ecpf: {
      dashboard: ecpfDashboard,
      // applications: () => import('@/views/admin/ECPF/Applications.vue'),
      // new_application: () => import('@/views/admin/ECPF/NewApplication.vue'),
      // pending_applications: () => import('@/views/admin/ECPF/PendingApplications.vue'),
      // approved_applications: () => import('@/views/admin/ECPF/ApprovedApplications.vue'),
      // clients: () => import('@/views/admin/ECPF/Clients.vue'),
      // reports: () => import('@/views/admin/ECPF/Reports.vue'),
      // ... all other ECPF related routes for admin
    },
    accreditation: {
      dashboard: accredDashboard,
      reports: accredDashboard,

      // All master routes now point to accredDashboard
      appeal_reason: accredDashboard,
      application_duration: accredDashboard,
      assessor_pool: accredDashboard,
      decision: accredDashboard,
      decision_classes: accredDashboard,
      e_signature: accredDashboard,
      employee_category: accredDashboard,
      employee_type: accredDashboard,
      fees: accredDashboard,
      indicators: accredDashboard,
      institute: accredDashboard,
      key_aspects: accredDashboard,
      document: accredDashboard,
      qualification: accredDashboard,
      rating_category: accredDashboard,
      source_of_funding: accredDashboard,
      staff_type: accredDashboard,
      standard: accredDashboard,
    },
    engineering_certification: {
      dashboard: engineeringDashboard,
      applications: engineeringDashboard,
      clients: engineeringDashboard,
      reports: engineeringDashboard,
    },
    health_certification: {
      dashboard: bmhcDashboard,
      cme_activities: bmhcDashboard,
      cme_credits: bmhcDashboard,
      cme_methodologies: bmhcDashboard,
      cpd_activity: bmhcDashboard,
      document_types: bmhcDashboard,
      e_signatures: bmhcDashboard,
      fee_structures: bmhcDashboard,
      fees_associated_for: bmhcDashboard,
      file_types: bmhcDashboard,
      participation_category: bmhcDashboard,
      participation_sub_category: bmhcDashboard,
      personnel_categories: bmhcDashboard,
      qualification_types: bmhcDashboard,
      qualifications: bmhcDashboard,
      registration_type: bmhcDashboard,
      sector: bmhcDashboard,
      sub_categories: bmhcDashboard,
      university: bmhcDashboard,
      cogs_agency: bmhcDashboard,
      cogs_dept: bmhcDashboard,
      cogs_workplace: bmhcDashboard,
    },
  },
  user: {
    roq: {
      dashboard: roqDashboard,
      my_applications: roqDashboard,
      secondcopy_applications: roqDashboard,
      application_lists: roqDashboard,
      application_details: roqDashboard,
      profile: roqDashboard,
      // ... other ROQ routes for a regular user
    },
    ecpf: {
      dashboard: ecpfDashboard,
      individual_ecpf: ecpfDashboard,
      collaborated_ecpf: ecpfDashboard,
      new_branch_ecpf: ecpfDashboard,
      ecpf_renewal: ecpfDashboard,
      ecpf_name_change: ecpfDashboard,
      ecpf_location_change: ecpfDashboard,
      ecpf_ownership_change: ecpfDashboard,
      ecpf_linkage_establishment: ecpfDashboard,
      ecpf_education_fair: ecpfDashboard,
    },
    accreditation: {
      dashboard: accredDashboard,
      apply_for_accreditation: accredDashboard,
      appeal: accredDashboard,
      coi_confirmation: accredDashboard,
      site_visit_confirmation: accredDashboard,
      results: accredDashboard,
      profile: accredDashboard,
    },
    engineering_certification: {
      // Existing routes
      dashboard: engineeringDashboard,
      profile: engineeringDashboard,

      // Registration services routes
      registration: engineeringDashboard,
      renewal: engineeringDashboard,
      re_registration: engineeringDashboard,
      additional_qualification: engineeringDashboard,
      CoGS: engineeringDashboard,

      // CPD route
      cpd: engineeringDashboard,

      // Payment routes
      payment: engineeringDashboard,
      payment_history: engineeringDashboard,

      // Reports route
      reports: engineeringDashboard,

      // Keep existing routes that weren't in our navigation but might be used elsewhere
      my_applications: engineeringDashboard,
      new_application: engineeringDashboard,
      application_status: () => engineeringDashboard,
    },
    health_certification: {
      dashboard: bmhcDashboard,
      registration: bmhcDashboard,
      my_applications: bmhcDashboard,
      renewal: bmhcDashboard,
      re_registration: bmhcDashboard,
      additional_qualification: bmhcDashboard,
      cpd: bmhcDashboard,
      cpd_application: bmhcDashboard,
      track_cpd_applications: bmhcDashboard,
      CoGS: bmhcDashboard,
      cogs_application: bmhcDashboard,
      user_profile: bmhcDashboard,
      reports: bmhcDashboard,
      counselor_application: bmhcDashboard,
    },
  },
  dealing_officer: {
    roq: {
      dashboard: roqDashboard,
      application_lists: roqDashboard,
      second_copy_lists: roqDashboard,
      application_details: roqDashboard,
      // reports: () => import('@/views/admin/ROQ/Reports.vue'),
      // ... other ROQ routes for dealing officer
    },
    ecpf: {
      dashboard: ecpfDashboard,
      // pending_applications: () => import('@/views/admin/ECPF/PendingApplications.vue'),
      // approved_applications: () => import('@/views/admin/ECPF/ApprovedApplications.vue'),
      // rejected_applications: () => import('@/views/admin/ECPF/RejectedApplications.vue'),
      // reports: () => import('@/views/admin/ECPF/Reports.vue'),
      // ... other ECPF routes for dealing officer
    },
    accreditation: {
      dashboard: accredDashboard,
      institutional_accreditations: accredDashboard,
      appeals: accredDashboard,
      assessor_management: accredDashboard,
      site_visit_scheduling: accredDashboard,
      reports: accredDashboard,
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
      dashboard: bmhcDashboard,
      application_lists: bmhcDashboard,
      additional_application: bmhcDashboard,
      renewal_lists: bmhcDashboard,
      re_registration_lists: bmhcDashboard,
      cpd_application_review: bmhcDashboard,
      cpd_create_application: bmhcDashboard,
      cpd_award_credits: bmhcDashboard,
      cpd_reports: bmhcDashboard,
      cpd_provider_management: bmhcDashboard,
      institutes: bmhcDashboard,
      profiles: bmhcDashboard,
      cogs: bmhcDashboard,
      capa: bmhcDashboard,
      eoi_application: bmhcDashboard,
      dpr_application: bmhcDashboard,
      institute_report: bmhcDashboard,
      payments: bmhcDashboard,
      reports: bmhcDashboard,
      counselor_application: bmhcDashboard,
    },
  },
  chief: {
    roq: {
      dashboard: roqDashboard,
      application_lists: roqDashboard,
      second_copy_lists: roqDashboard,
      reports: () => roqDashboard,
      // ... other ROQ routes for chief
    },
    ecpf: {
      dashboard: ecpfDashboard,
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
      dashboard: bmhcDashboard,
      application_lists: bmhcDashboard,
      cpd_management: bmhcDashboard,
      institutes: bmhcDashboard,
      profiles: bmhcDashboard,
      cogs: bmhcDashboard,
      payments: bmhcDashboard,
      reports: bmhcDashboard,
      // ... other Health Certification routes for chief
    },
  },
  director: {
    roq: {
      dashboard: roqDashboard,
      // for_approval_applications: () => import('@/views/admin/ROQ/ForApprovalApplications.vue'),
      // approved_applications: () => import('@/views/admin/ROQ/ApprovedApplications.vue'),
      // reports: () => import('@/views/admin/ROQ/Reports.vue'),
      // ... other ROQ routes for director
    },
    ecpf: {
      dashboard: ecpfDashboard,
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
      dashboard: bmhcDashboard,
      // for_approval_applications: () => import('@/views/admin/BMHC/ForApprovalApplications.vue'),
      // approved_applications: () => import('@/views/admin/BMHC/ApprovedApplications.vue'),
      // reports: () => import('@/views/admin/BMHC/Reports.vue'),
      // ... other Health Certification routes for director
    },
  },
  institutions: {
    ecpf: {
      dashboard: ecpfDashboard,
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
      dashboard: bmhcDashboard,
      apply_for_eoi: bmhcDashboard,
      apply_for_dpr: bmhcDashboard,
      view_certificates: bmhcDashboard,
      track_eoi: bmhcDashboard,
      track_dpr: bmhcDashboard,
      draft_applications: bmhcDashboard,
      // ... other Health Certification routes for director
    },
  },
  cpd_cme_provider: {
    ecpf: {
      dashboard: ecpfDashboard,
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
      dashboard: bmhcDashboard,
      cpd_application_details: bmhcDashboard,
      cpd_application_tracker: bmhcDashboard,
      reports: bmhcDashboard,
    },
  },
}
