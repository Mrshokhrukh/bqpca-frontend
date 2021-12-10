<template>
  <!-- Loading State -->
  <div v-if="isLoading" class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <div class="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
      <p class="text-gray-600">Loading application...</p>
    </div>
  </div>

  <!-- Status Messages -->
  <div
    v-else-if="reviewDecision === 'Regretted'"
    class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden flex items-center justify-center"
  >
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        class="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-red-400/20 to-pink-600/20 rounded-full blur-3xl"
      ></div>
      <div
        class="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-orange-400/20 to-red-600/20 rounded-full blur-3xl"
      ></div>
    </div>

    <div
      class="relative bg-white/80 backdrop-blur-xl border border-white/30 rounded-3xl shadow-xl p-12 max-w-lg mx-4"
    >
      <div class="text-center">
        <div
          class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl mb-6 shadow-sm"
        >
          <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h2 class="text-3xl font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent mb-4">
          Application Status: Not Available
        </h2>
        <p class="text-slate-600 leading-relaxed">
          You cannot submit a DPR until your Expression of Interest (EOI) application has been approved.
        </p>
        <button
          @click="router.push('/admin/institutions/engineering_certification/dashboard')"
          class="mt-8 btn btn-primary"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  </div>

  <div
    v-else-if="reviewDecision === 'Pending'"
    class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden flex items-center justify-center"
  >
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        class="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-yellow-400/20 to-amber-600/20 rounded-full blur-3xl"
      ></div>
      <div
        class="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-orange-400/20 to-yellow-600/20 rounded-full blur-3xl"
      ></div>
    </div>

    <div
      class="relative bg-white/80 backdrop-blur-xl border border-white/30 rounded-3xl shadow-xl p-12 max-w-lg mx-4"
    >
      <div class="text-center">
        <div
          class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-2xl mb-6 shadow-sm"
        >
          <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h2 class="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent mb-4">
          Application Status: Pending
        </h2>
        <p class="text-slate-600 leading-relaxed">
          Your EOI application is currently under review. You will be notified once a decision has been made.
        </p>
        <button
          @click="router.push('/admin/institutions/engineering_certification/dashboard')"
          class="mt-8 btn btn-primary"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  </div>

  <div
    v-else-if="dprStatus === 'Approved'"
    class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden flex items-center justify-center"
  >
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        class="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-emerald-400/20 to-teal-600/20 rounded-full blur-3xl"
      ></div>
      <div
        class="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-green-400/20 to-emerald-600/20 rounded-full blur-3xl"
      ></div>
    </div>

    <div
      class="relative bg-white/80 backdrop-blur-xl border border-white/30 rounded-3xl shadow-xl p-12 max-w-lg mx-4"
    >
      <div class="text-center">
        <div
          class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl mb-6 shadow-sm"
        >
          <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h2 class="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
          Application Already Submitted and Approved
        </h2>
        <p class="text-slate-600 leading-relaxed">
          You have a valid, approved DPR application. You may track its details on the 'Your Applications' page.
        </p>
        <button
          @click="router.push('/admin/institutions/engineering_certification/dashboard')"
          class="mt-8 btn btn-primary"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  </div>

  <!-- Main DPR Form -->
  <div
    v-else-if="reviewDecision === 'Approved' && !isLoading"
    class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden"
  >
    <!-- Toast Notification -->
    <div
      v-if="toastMessage"
      class="fixed top-4 right-4 z-50 p-4 bg-green-600 text-white rounded-lg shadow-lg flex items-center max-w-sm transition-all duration-300"
      :class="{ 'opacity-0': !showToast, 'opacity-100': showToast }"
    >
      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
      </svg>
      {{ toastMessage }}
    </div>

    <!-- Background decorative elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        class="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-indigo-600/20 rounded-full blur-3xl"
      ></div>
      <div
        class="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-400/20 to-pink-600/20 rounded-full blur-3xl"
      ></div>
      <div
        class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-cyan-400/10 to-blue-600/10 rounded-full blur-3xl"
      ></div>
    </div>

    <div class="relative w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="text-center mb-12 relative">
        <div
          class="absolute inset-0 bg-white/30 backdrop-blur-xl rounded-3xl border border-white/20 shadow-sm"
        ></div>
        <div class="relative p-8">
          <div
            class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl mb-6 shadow-sm transform hover:scale-105 transition-transform duration-300"
          >
            <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <h1
            class="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent mb-4"
          >
            Detailed Project Proposal (DPR)
          </h1>
          <p class="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Complete your Detailed Project Proposal for establishing an Educational Institution. All required fields are marked with an asterisk.
          </p>
        </div>
      </div>

      <form class="space-y-8" enctype="multipart/form-data">
        <!-- Section 1: Applicant Details -->
        <div class="group relative">
          <div
            class="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-500 blur-xl"
          ></div>

          <div
            class="relative bg-white/80 backdrop-blur-xl border border-white/30 rounded-3xl shadow-sm overflow-hidden transform transition-all duration-500 hover:shadow-3xl hover:-translate-y-1"
          >
            <div
              class="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 px-8 py-6 border-b border-blue-100/50"
            >
              <div class="flex items-center">
                <div
                  class="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300"
                >
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <div class="ml-6">
                  <h3 class="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    1. Applicant Details
                  </h3>
                  <p class="text-slate-500 mt-1 text-sm">Enter the details of the applicant</p>
                </div>
              </div>
            </div>

            <div class="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <label for="cid" class="form-label required-label">CID</label>
                <input
                  type="text"
                  id="cid"
                  v-model="formData.cid"
                  class="form-input disabled-input"
                  readonly
                />
              </div>
              <div>
                <label for="fullName" class="form-label required-label">Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  v-model="formData.full_name"
                  class="form-input disabled-input"
                  readonly
                />
              </div>
              <div>
                <label for="gender" class="form-label required-label">Gender</label>
                <input
                  type="text"
                  id="gender"
                  v-model="formData.gender"
                  class="form-input disabled-input"
                  readonly
                />
              </div>
              <div>
                <label for="contactNo" class="form-label required-label">Contact Number</label>
                <input
                  type="text"
                  id="contactNo"
                  v-model="formData.contact_no"
                  class="form-input"
                  placeholder="Enter contact number"
                  required
                />
              </div>
              <div class="lg:col-span-2">
                <label for="emailAddress" class="form-label required-label">Email Address</label>
                <input
                  type="email"
                  id="emailAddress"
                  v-model="formData.email_address"
                  class="form-input"
                  placeholder="Enter email address"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Section 2: Institute Establishment Proposal Details -->
        <div class="group relative">
          <div
            class="absolute inset-0 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-500 blur-xl"
          ></div>

          <div
            class="relative bg-white/80 backdrop-blur-xl border border-white/30 rounded-3xl shadow-sm overflow-hidden transform transition-all duration-500 hover:shadow-3xl hover:-translate-y-1"
          >
            <div
              class="bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 px-8 py-6 border-b border-emerald-100/50"
            >
              <div class="flex items-center">
                <div
                  class="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300"
                >
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <div class="ml-6">
                  <h3 class="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    2. Institute Establishment Proposal Details
                  </h3>
                  <p class="text-slate-500 mt-1 text-sm">Enter the details of the proposed institution</p>
                </div>
              </div>
            </div>

            <div class="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <label for="institutionName" class="form-label required-label">Name of Institution</label>
                <input
                  type="text"
                  id="institutionName"
                  v-model="formData.institution_name"
                  class="form-input disabled-input"
                  readonly
                />
              </div>
              <div>
                <label for="country" class="form-label required-label">Country</label>
                <input
                  type="text"
                  id="country"
                  v-model="formData.country"
                  class="form-input disabled-input"
                  readonly
                />
              </div>
              <div>
                <label for="gewogState" class="form-label required-label">Gewog/State</label>
                <input
                  type="text"
                  id="gewogState"
                  v-model="formData.gewog"
                  class="form-input disabled-input"
                  readonly
                />
              </div>
              <div>
                <label for="chiwog" class="form-label required-label">Chiwog</label>
                <input
                  type="text"
                  id="chiwog"
                  v-model="formData.chiwog"
                  class="form-input disabled-input"
                  readonly
                />
              </div>
              <div>
                <label for="courseTitle" class="form-label required-label">Title of the Course</label>
                <input
                  type="text"
                  id="courseTitle"
                  v-model="formData.title_of_course"
                  class="form-input disabled-input"
                  readonly
                />
              </div>
              <div>
                <label for="courseDuration" class="form-label required-label">Course Duration</label>
                <input
                  type="text"
                  id="courseDuration"
                  v-model="formData.course_duration"
                  class="form-input disabled-input"
                  readonly
                />
              </div>
              <div>
                <label for="commencementDate" class="form-label required-label">Commencement Date</label>
                <input
                  type="text"
                  id="commencementDate"
                  v-model="formData.commencement_date"
                  class="form-input disabled-input"
                  readonly
                />
              </div>
              <div>
                <label for="programmeType" class="form-label required-label">Type of Programme</label>
                <input
                  type="text"
                  id="programmeType"
                  v-model="formData.type_of_programme"
                  class="form-input disabled-input"
                  readonly
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Section 3: Head of Institution Details -->
        <div class="group relative">
          <div
            class="absolute inset-0 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 rounded-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-500 blur-xl"
          ></div>

          <div
            class="relative bg-white/80 backdrop-blur-xl border border-white/30 rounded-3xl shadow-sm overflow-hidden transform transition-all duration-500 hover:shadow-3xl hover:-translate-y-1"
          >
            <div
              class="bg-gradient-to-r from-violet-50 via-purple-50 to-fuchsia-50 px-8 py-6 border-b border-violet-100/50"
            >
              <div class="flex items-center">
                <div
                  class="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300"
                >
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>
                <div class="ml-6">
                  <h3 class="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                    3. Head of Institution Details
                  </h3>
                  <p class="text-slate-500 mt-1 text-sm">Enter the details of the head of the institution</p>
                </div>
              </div>
            </div>

            <div class="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <label for="headName" class="form-label required-label">Name</label>
                <input
                  type="text"
                  id="headName"
                  v-model="formData.head_of_institution_name"
                  class="form-input disabled-input"
                  readonly
                />
              </div>
              <div>
                <label for="headGender" class="form-label required-label">Gender</label>
                <input
                  type="text"
                  id="headGender"
                  v-model="formData.head_of_institution_gender"
                  class="form-input disabled-input"
                  readonly
                />
              </div>
              <div>
                <label for="headPhone" class="form-label required-label">Phone Number</label>
                <input
                  type="text"
                  id="headPhone"
                  v-model="formData.head_of_institution_phone_number"
                  class="form-input disabled-input"
                  readonly
                />
              </div>
              <div>
                <label for="headEmail" class="form-label required-label">Email Address</label>
                <input
                  type="email"
                  id="headEmail"
                  v-model="formData.head_of_institution_email"
                  class="form-input disabled-input"
                  readonly
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Section 4: DPR Details -->
        <div class="group relative">
          <div
            class="absolute inset-0 bg-gradient-to-r from-indigo-500 via-blue-500 to-cyan-500 rounded-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-500 blur-xl"
          ></div>

          <div
            class="relative bg-white/80 backdrop-blur-xl border border-white/30 rounded-3xl shadow-sm overflow-hidden transform transition-all duration-500 hover:shadow-3xl hover:-translate-y-1"
          >
            <div
              class="bg-gradient-to-r from-indigo-50 via-blue-50 to-cyan-50 px-8 py-6 border-b border-indigo-100/50"
            >
              <div class="flex items-center">
                <div
                  class="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300"
                >
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div class="ml-6">
                  <h3 class="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                    4. DPR Details
                  </h3>
                  <p class="text-slate-500 mt-1 text-sm">Describe the DPR details</p>
                </div>
              </div>
            </div>

            <div class="p-8 grid grid-cols-1 gap-8">
              <div>
                <label for="dprName" class="form-label required-label">DPR Name</label>
                <input
                  id="dprName"
                  v-model="formData.dpr_name"
                  class="form-input"
                  placeholder="Enter DPR name"
                  required
                />
              </div>
              <div>
                <label for="executiveSummary" class="form-label required-label">Executive Summary</label>
                <textarea
                  id="executiveSummary"
                  v-model="formData.executive_summary"
                  rows="5"
                  class="form-textarea"
                  placeholder="Provide a comprehensive executive summary..."
                  required
                ></textarea>
              </div>
              <div>
                <label for="supportingDocuments" class="form-label required-label">Supporting Documents (PDF only)</label>
                <input
                  type="file"
                  id="supportingDocuments"
                  @change="handleFileUpload('supporting_documents')"
                  accept="application/pdf"
                  class="form-file-input"
                  required
                />
                <p class="mt-2 text-sm text-slate-500 flex items-center">
                  <svg class="w-4 h-4 mr-2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                    />
                  </svg>
                  Upload supporting documents in PDF format (max 10MB)
                </p>
                <p v-if="formData.supporting_documents" class="mt-2 text-sm text-green-600 flex items-center">
                  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  File selected: {{ formData.supporting_documents.name }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Section 5: Additional Details -->
        <div class="group relative">
          <div
            class="absolute inset-0 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-500 blur-xl"
          ></div>

          <div
            class="relative bg-white/80 backdrop-blur-xl border border-white/30 rounded-3xl shadow-sm overflow-hidden transform transition-all duration-500 hover:shadow-3xl hover:-translate-y-1"
          >
            <div
              class="bg-gradient-to-r from-amber-50 via-orange-50 to-red-50 px-8 py-6 border-b border-amber-100/50"
            >
              <div class="flex items-center">
                <div
                  class="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300"
                >
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                    />
                  </svg>
                </div>
                <div class="ml-6">
                  <h3 class="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                    5. Additional Details
                  </h3>
                  <p class="text-slate-500 mt-1 text-sm">Provide any additional details relevant to the DPR</p>
                </div>
              </div>
            </div>

            <div class="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div v-for="field in additionalDetailsFields" :key="field.id">
                <label :for="field.id" class="form-label">{{ field.label }}</label>
                <textarea
                  :id="field.id"
                  v-model="formData[field.model]"
                  :rows="field.rows || 3"
                  class="form-textarea"
                  :placeholder="field.placeholder"
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        <!-- Declaration Section -->
        <div class="group relative">
          <div
            class="absolute inset-0 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-500 blur-xl"
          ></div>

          <div
            class="relative bg-white/80 backdrop-blur-xl border border-white/30 rounded-3xl shadow-sm p-8 transform transition-all duration-500 hover:shadow-3xl hover:-translate-y-1"
          >
            <div class="flex items-start space-x-4">
              <div class="flex items-center h-6 mt-1">
                <input
                  id="declaration"
                  type="checkbox"
                  v-model="formData.declaration"
                  class="w-5 h-5 text-blue-600 bg-white border-2 border-slate-300 rounded-md focus:ring-blue-500 focus:ring-2 focus:ring-offset-2 transition-all duration-200 hover:border-blue-400"
                  required
                />
              </div>
              <div class="flex-1">
                <label
                  for="declaration"
                  class="block text-lg font-semibold text-slate-700 required-label mb-2"
                >
                  Declaration
                </label>
                <p class="text-slate-600 leading-relaxed">
                  I declare that all information provided in this Detailed Project Proposal is accurate, complete, and true to the best of my knowledge. I understand that any false information may lead to rejection of the application and potential penalties.
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div
          class="flex flex-col sm:flex-row justify-end items-center space-y-4 sm:space-y-0 sm:space-x-6 pt-8"
        >
          <button
            type="button"
            @click="handleSaveDraft"
            :disabled="isSubmitting"
            class="btn btn-draft w-full sm:w-auto order-last sm:order-first"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            Save as Draft
          </button>

          <button
            type="button"
            @click="handleSubmit"
            :disabled="!formData.declaration || isSubmitting"
            class="btn btn-primary w-full sm:w-auto"
          >
            <div
              v-if="isSubmitting"
              class="animate-spin w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full"
            ></div>
            <svg v-else class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
            {{ isSubmitting ? 'Submitting...' : 'Submit Application' }}
          </button>
        </div>
      </form>
    </div>
  </div>

  <!-- Fallback if no conditions match -->
  <div v-else class="min-h-screen flex items-center justify-center">
    <div class="text-center">
      <div class="w-20 h-20 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl mb-6 shadow-sm flex items-center justify-center mx-auto">
        <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h2 class="text-2xl font-bold text-slate-700 mb-4">Unable to Load Application</h2>
      <p class="text-slate-600 mb-6">There was an error loading the DPR application. Please try again.</p>
      <button
        @click="router.push('/admin/institutions/engineering_certification/dashboard')"
        class="btn btn-primary"
      >
        Go to Dashboard
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const instituteId = ref(null)
const reviewDecision = ref('')
const dprStatus = ref('')
const isLoading = ref(true)
const isSubmitting = ref(false)
const toastMessage = ref('')
const showToast = ref(false)

const showToastNotification = (message, type = 'info') => {
  toastMessage.value = message
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
    toastMessage.value = ''
  }, 3000)
}

const formData = ref({
  cid: '',
  full_name: '',
  gender: '',
  contact_no: '',
  email_address: '',
  institution_name: '',
  country: '',
  gewog: '',
  chiwog: '',
  teaching_institute: '',
  title_of_course: '',
  course_duration: '',
  commencement_date: '',
  type_of_programme: '',
  head_of_institution_name: '',
  head_of_institution_gender: '',
  head_of_institution_phone_number: '',
  head_of_institution_email: '',
  dpr_name: '',
  executive_summary: '',
  supporting_documents: null,
  declaration: false,
  vision_mission_strategies: '',
  project_scheduling: '',
  gross_national_happiness: '',
  land_details: '',
  conceptual_master_plan: '',
  academic_plan: '',
  affiliation_details: '',
  teaching_hospital: '',
  research_policy: '',
  human_resource: '',
  quality_assurance: '',
  governance_structure: '',
  business_plan: '',
  project_cost_analysis: '',
  facilities_student_services: '',
  admission_policy: '',
  service_conditions: '',
  safety_security: '',
  public_information_system: '',
  other_details: '',
})

const additionalDetailsFields = [
  { id: 'visionMissionStrategies', label: 'Vision, Mission & Strategies', model: 'vision_mission_strategies', placeholder: 'Describe your vision, mission, and strategic objectives...' },
  { id: 'projectScheduling', label: 'Project Scheduling', model: 'project_scheduling', placeholder: 'Provide project timeline and milestones...' },
  { id: 'grossNationalHappiness', label: 'Gross National Happiness', model: 'gross_national_happiness', placeholder: 'Explain how your project aligns with Gross National Happiness principles...' },
  { id: 'landDetails', label: 'Land Details', model: 'land_details', placeholder: 'Provide details about the land for the institution...' },
  { id: 'conceptualMasterPlan', label: 'Conceptual Master Plan', model: 'conceptual_master_plan', placeholder: 'Describe the conceptual master plan for the institution...' },
  { id: 'academicPlan', label: 'Academic Plan', model: 'academic_plan', placeholder: 'Outline the academic plan and curriculum...' },
  { id: 'affiliationDetails', label: 'Affiliation Details', model: 'affiliation_details', placeholder: 'Provide details of affiliations with other institutions...' },
  { id: 'teachingHospital', label: 'Teaching Institute/Center', model: 'teaching_hospital', placeholder: 'Describe teaching facilities and centers...' },
  { id: 'researchPolicy', label: 'Research Policy', model: 'research_policy', placeholder: 'Outline research policies and initiatives...' },
  { id: 'humanResource', label: 'Human Resource', model: 'human_resource', placeholder: 'Describe human resource plans and staffing...' },
  { id: 'qualityAssurance', label: 'Quality Assurance', model: 'quality_assurance', placeholder: 'Explain quality assurance mechanisms...' },
  { id: 'governanceStructure', label: 'Governance Structure', model: 'governance_structure', placeholder: 'Describe the governance structure...' },
  { id: 'businessPlan', label: 'Business Plan', model: 'business_plan', placeholder: 'Provide business plan details...' },
  { id: 'projectCostAnalysis', label: 'Project Cost Analysis', model: 'project_cost_analysis', placeholder: 'Provide detailed cost analysis...' },
  { id: 'facilitiesStudentServices', label: 'Facilities & Student Services', model: 'facilities_student_services', placeholder: 'Describe facilities and student services...' },
  { id: 'admissionPolicy', label: 'Admission Policy', model: 'admission_policy', placeholder: 'Outline admission policies and criteria...' },
  { id: 'serviceConditions', label: 'Service Conditions', model: 'service_conditions', placeholder: 'Describe service conditions for staff...' },
  { id: 'safetySecurity', label: 'Safety & Security', model: 'safety_security', placeholder: 'Explain safety and security measures...' },
  { id: 'publicInformationSystem', label: 'Public Information System', model: 'public_information_system', placeholder: 'Describe public information systems...' },
  { id: 'otherDetails', label: 'Other Details', model: 'other_details', placeholder: 'Any other relevant details...' },
]

const handleFileUpload = (fieldName) => (event) => {
  const file = event.target.files[0]
  if (file) {
    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      showToastNotification('File size should be less than 10MB')
      event.target.value = ''
      return
    }

    // Validate file type
    if (file.type !== 'application/pdf') {
      showToastNotification('Only PDF files are allowed')
      event.target.value = ''
      return
    }

    formData.value[fieldName] = file
    showToastNotification('File selected successfully', 'success')
  }
}

const saveDraft = () => {
  const draftData = { ...formData.value }
  if (draftData.supporting_documents instanceof File) {
    draftData.supporting_documents = {
      name: draftData.supporting_documents.name,
      type: draftData.supporting_documents.type,
    }
  } else {
    draftData.supporting_documents = null
  }
  localStorage.setItem('dprFormDraft', JSON.stringify(draftData))
  showToastNotification('Draft saved successfully!', 'success')
}

const clearDraft = () => {
  localStorage.removeItem('dprFormDraft')
}

const handleSaveDraft = async () => {
  if (!instituteId.value) {
    showToastNotification('Institute ID is missing. Please refresh the page.', 'error')
    return
  }
  saveDraft()
}

const handleSubmit = async () => {
  if (!instituteId.value) {
    showToastNotification('Institute ID is missing. Please refresh the page.', 'error')
    return
  }

  // Validate required fields
  if (!formData.value.dpr_name) {
    showToastNotification('Please enter the DPR name.', 'error')
    return
  }
  if (!formData.value.executive_summary) {
    showToastNotification('Please enter the executive summary.', 'error')
    return
  }
  if (!formData.value.supporting_documents) {
    showToastNotification('Please upload supporting documents.', 'error')
    return
  }
  if (!formData.value.declaration) {
    showToastNotification('Please check the declaration box.', 'error')
    return
  }

  isSubmitting.value = true

  // Form submission logic
  const submitData = new FormData()
  submitData.append('cid', formData.value.cid)
  submitData.append('full_name', formData.value.full_name)
  submitData.append('gender', formData.value.gender)
  submitData.append('contact_no', formData.value.contact_no)
  submitData.append('email_address', formData.value.email_address)
  submitData.append('name_of_institution', formData.value.institution_name)
  submitData.append('country', formData.value.country)
  submitData.append('gewog', formData.value.gewog)
  submitData.append('chiwog', formData.value.chiwog)
  submitData.append('teaching_institute', formData.value.teaching_institute)
  submitData.append('title_of_course', formData.value.title_of_course)
  submitData.append('course_duration', formData.value.course_duration)
  submitData.append('commencement_date', formData.value.commencement_date)
  submitData.append('type_of_programme', formData.value.type_of_programme)
  submitData.append('head_of_institution_name', formData.value.head_of_institution_name)
  submitData.append('head_of_institution_gender', formData.value.head_of_institution_gender)
  submitData.append(
    'head_of_institution_phone_number',
    formData.value.head_of_institution_phone_number
  )
  submitData.append('head_of_institution_email', formData.value.head_of_institution_email)
  submitData.append('dpr_name', formData.value.dpr_name)
  submitData.append('executive_summary', formData.value.executive_summary)
  if (formData.value.supporting_documents) {
    submitData.append('supporting_documents', formData.value.supporting_documents)
  }
  submitData.append('vision_mission_strategies', formData.value.vision_mission_strategies)
  submitData.append('project_scheduling', formData.value.project_scheduling)
  submitData.append('gross_national_happiness', formData.value.gross_national_happiness)
  submitData.append('land_details', formData.value.land_details)
  submitData.append('conceptual_master_plan', formData.value.conceptual_master_plan)
  submitData.append('academic_plan', formData.value.academic_plan)
  submitData.append('affiliation_details', formData.value.affiliation_details)
  submitData.append('teaching_hospital', formData.value.teaching_hospital)
  submitData.append('research_policy', formData.value.research_policy)
  submitData.append('human_resource', formData.value.human_resource)
  submitData.append('quality_assurance', formData.value.quality_assurance)
  submitData.append('governance_structure', formData.value.governance_structure)
  submitData.append('business_plan', formData.value.business_plan)
  submitData.append('project_cost_analysis', formData.value.project_cost_analysis)
  submitData.append('facilities_student_services', formData.value.facilities_student_services)
  submitData.append('admission_policy', formData.value.admission_policy)
  submitData.append('service_conditions', formData.value.service_conditions)
  submitData.append('safety_security', formData.value.safety_security)
  submitData.append('public_information_system', formData.value.public_information_system)
  submitData.append('other_details', formData.value.other_details)

  try {
    const response = await apiService.patchEpcInstitute(instituteId.value, submitData)
    if (response.status === 200 || response.status === 204) {
      showToastNotification('DPR submitted successfully!', 'success')
      clearDraft()
      setTimeout(() => {
        router.push('/admin/institutions/engineering_certification/dashboard')
      }, 1500)
    } else {
      showToastNotification(`Failed to submit DPR. Status: ${response.status}`, 'error')
    }
  } catch (error) {
    console.error('Error submitting DPR data:', error)
    showToastNotification('Error submitting DPR data. Please try again.', 'error')
  } finally {
    isSubmitting.value = false
  }
}

// Simulate data fetching for testing
const simulateDataFetching = () => {
  // For testing, set some dummy data
  setTimeout(() => {
    reviewDecision.value = 'Approved' // Change this to test different states: 'Approved', 'Pending', 'Regretted'
    dprStatus.value = '' // Set to 'Approved' to test approved DPR status

    // Populate form with dummy data for testing
    if (reviewDecision.value === 'Approved' && !dprStatus.value) {
      formData.value = {
        cid: '123456789',
        full_name: 'John Doe',
        gender: 'Male',
        contact_no: '17123456',
        email_address: 'john.doe@example.com',
        institution_name: 'Royal Institute of Technology',
        country: 'Bhutan',
        gewog: 'Kawang',
        chiwog: 'Chiwog 1',
        teaching_institute: 'Main Campus',
        title_of_course: 'Bachelor of Engineering',
        course_duration: '48',
        commencement_date: '2024-08-01',
        type_of_programme: 'Bachelor',
        head_of_institution_name: 'Dr. Sarah Smith',
        head_of_institution_gender: 'Female',
        head_of_institution_phone_number: '17123457',
        head_of_institution_email: 'sarah.smith@example.com',
        dpr_name: '',
        executive_summary: '',
        supporting_documents: null,
        declaration: false,
        // Additional details
        vision_mission_strategies: '',
        project_scheduling: '',
        gross_national_happiness: '',
        land_details: '',
        conceptual_master_plan: '',
        academic_plan: '',
        affiliation_details: '',
        teaching_hospital: '',
        research_policy: '',
        human_resource: '',
        quality_assurance: '',
        governance_structure: '',
        business_plan: '',
        project_cost_analysis: '',
        facilities_student_services: '',
        admission_policy: '',
        service_conditions: '',
        safety_security: '',
        public_information_system: '',
        other_details: '',
      }
    }

    isLoading.value = false
  }, 1000)
}

const fetchInstituteData = async () => {
  try {
    simulateDataFetching()
  } catch (error) {
    console.error('Error fetching institute data:', error)
    showToastNotification('Error fetching institute data. Please try again.', 'error')
    isLoading.value = false
  }
}

onMounted(async () => {
  // Get institute ID from route or query params
  instituteId.value = route.params.id || route.query.instituteId

  // If no institute ID in URL, try to get it from the auth store or localStorage
  if (!instituteId.value) {
    // Try to get from auth store if user has an approved EOI
    if (authStore.user && authStore.user.approvedEoiId) {
      instituteId.value = authStore.user.approvedEoiId
    }
  }

  // Fetch institute data
  await fetchInstituteData()

  // Load draft if exists (only if user can submit DPR)
  if (reviewDecision.value === 'Approved' && !dprStatus.value) {
    const savedDraft = localStorage.getItem('dprFormDraft')
    if (savedDraft) {
      try {
        const parsedDraft = JSON.parse(savedDraft)
        Object.keys(parsedDraft).forEach((key) => {
          if (key !== 'supporting_documents' && Object.prototype.hasOwnProperty.call(formData.value, key)) {
            formData.value[key] = parsedDraft[key]
          }
        })
        showToastNotification('Draft loaded. Please re-select any required files.')
      } catch (error) {
        console.error('Error loading draft:', error)
        clearDraft()
      }
    }
  }
})
</script>

<style scoped>
.form-label {
  @apply block text-sm font-medium text-slate-700 mb-2;
}

.form-label.required-label::after {
  @apply content-['*'] text-red-500 ml-1;
}

.form-input {
  @apply w-full px-4 py-3 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition bg-white/80 placeholder-slate-400;
}

.disabled-input {
  @apply bg-slate-100/80 text-slate-500 cursor-not-allowed;
}

.form-textarea {
  @apply w-full px-4 py-3 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition bg-white/80 placeholder-slate-400 resize-none;
}

.form-file-input {
  @apply w-full px-4 py-3 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition bg-white/80 text-slate-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100;
}

.btn {
  @apply inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200;
}

.btn-draft {
  @apply border border-amber-300 text-amber-700 bg-amber-50/80 hover:bg-amber-100 focus:ring-amber-500 disabled:opacity-50 disabled:cursor-not-allowed;
}

.btn-primary {
  @apply border border-transparent text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed;
}

button:disabled {
  @apply opacity-50 cursor-not-allowed;
}
</style>