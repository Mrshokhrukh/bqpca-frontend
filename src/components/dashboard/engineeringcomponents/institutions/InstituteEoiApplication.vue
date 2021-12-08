<template>
  <div v-if="showForm" class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
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
            class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl mb-6 shadow-sm transform hover:scale-105 transition-transform duration-300"
          >
            <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h1
            class="text-4xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent mb-4"
          >
            Expression of Interest Application
          </h1>
          <p class="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Complete the form below to apply for engineering program certification. All required fields are marked with an asterisk.
          </p>
          <p v-if="isAutoFilled" class="text-md text-emerald-600 mt-2 font-medium">
            <svg
              class="w-5 h-5 inline-block mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Personal details have been auto-filled from your profile
          </p>
        </div>
      </div>

      <form
        @submit.prevent="handleSubmit"
        class="space-y-8"
        enctype="multipart/form-data"
      >
        <!-- Applicant Information Section -->
        <div class="group relative">
          <div
            class="absolute inset-0 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-500 blur-xl"
          ></div>

          <div
            class="relative bg-white/80 backdrop-blur-xl border border-white/30 rounded-3xl shadow-sm overflow-hidden transform transition-all duration-500 hover:shadow-3xl hover:-translate-y-1"
          >
            <!-- Section Header -->
            <div
              class="bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 px-8 py-6 border-b border-emerald-100/50"
            >
              <div class="flex items-center">
                <div
                  class="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300"
                >
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div class="ml-6">
                  <h3
                    class="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent"
                  >
                    Applicant Information
                  </h3>
                  <p class="text-slate-500 mt-1 text-sm">
                    Personal details of the applicant
                  </p>
                </div>
              </div>
            </div>

            <!-- Section Content -->
            <div class="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
              <!-- CID -->
              <div>
                <label for="CID" class="form-label required-label">CID</label>
                <input
                  type="text"
                  id="CID"
                  v-model="formData.CID"
                  class="form-input disabled-input"
                  readonly
                />
              </div>

              <!-- Full Name -->
              <div>
                <label for="full_name" class="form-label required-label">Full Name</label>
                <input
                  type="text"
                  id="full_name"
                  v-model.trim="formData.full_name"
                  class="form-input"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <!-- Gender -->
              <div>
                <label for="gender" class="form-label required-label">Gender</label>
                <div class="relative">
                  <select
                    id="gender"
                    v-model="formData.gender"
                    class="form-select"
                    required
                  >
                    <option value="" disabled>Select Gender</option>
                    <option v-for="option in genderOptions" :key="option.value" :value="option.value">
                      {{ option.label }}
                    </option>
                  </select>
                  <div
                    class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"
                  >
                    <svg
                      class="w-5 h-5 text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <!-- Contact Number -->
              <div>
                <label for="contact_no" class="form-label required-label">Contact Number</label>
                <input
                  type="tel"
                  id="contact_no"
                  v-model.trim="formData.contact_no"
                  class="form-input"
                  placeholder="Enter contact number"
                  required
                />
              </div>

              <!-- Email Address -->
              <div>
                <label for="email_address" class="form-label required-label">Email Address</label>
                <input
                  type="email"
                  id="email_address"
                  v-model.trim="formData.email_address"
                  class="form-input"
                  placeholder="Enter email address"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Institution Details Section -->
        <div class="group relative">
          <div
            class="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-500 blur-xl"
          ></div>

          <div
            class="relative bg-white/80 backdrop-blur-xl border border-white/30 rounded-3xl shadow-sm overflow-hidden transform transition-all duration-500 hover:shadow-3xl hover:-translate-y-1"
          >
            <!-- Section Header -->
            <div
              class="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 px-8 py-6 border-b border-indigo-100/50"
            >
              <div class="flex items-center">
                <div
                  class="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300"
                >
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div class="ml-6">
                  <h3
                    class="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
                  >
                    Institution Details
                  </h3>
                  <p class="text-slate-500 mt-1 text-sm">
                    Details of the applying institution
                  </p>
                </div>
              </div>
            </div>

            <!-- Section Content -->
            <div class="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
              <!-- Name of Institution -->
              <div class="lg:col-span-2">
                <label for="name_of_institution" class="form-label required-label">
                  Name of Institution
                </label>
                <input
                  type="text"
                  id="name_of_institution"
                  v-model.trim="formData.name_of_institution"
                  class="form-input"
                  placeholder="Enter institution name"
                  required
                />
              </div>

              <!-- Country -->
              <div>
                <label for="country" class="form-label required-label">Country</label>
                <div class="relative">
                  <select
                    id="country"
                    v-model="formData.country"
                    class="form-select"
                    required
                  >
                    <option value="" disabled>Select Country</option>
                    <option v-for="c in countryData" :key="c.code" :value="c.name">
                      {{ c.name }}
                    </option>
                  </select>
                  <div
                    class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"
                  >
                    <svg
                      class="w-5 h-5 text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <!-- Dzongkhag -->
              <div>
                <label for="dzongkhag" class="form-label required-label">Dzongkhag</label>
                <div class="relative">
                  <select
                    id="dzongkhag"
                    v-model="formData.dzongkhag"
                    @change="handleDzongkhagChange"
                    class="form-select"
                    required
                  >
                    <option value="" disabled>Select Dzongkhag</option>
                    <option
                      v-for="d in bhutanDzongkhagsGewogs"
                      :key="d.dzongkhag"
                      :value="d.dzongkhag"
                    >
                      {{ d.dzongkhag }}
                    </option>
                  </select>
                  <div
                    class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"
                  >
                    <svg
                      class="w-5 h-5 text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <!-- Gewog -->
              <div>
                <label for="gewog" class="form-label required-label">Gewog</label>
                <div class="relative">
                  <select
                    id="gewog"
                    v-model="formData.gewog"
                    :disabled="!formData.dzongkhag"
                    class="form-select"
                    required
                  >
                    <option value="" disabled>
                      {{ !formData.dzongkhag ? 'Select Dzongkhag first' : 'Select Gewog' }}
                    </option>
                    <option v-for="g in availableGewogs" :key="g" :value="g">
                      {{ g }}
                    </option>
                  </select>
                  <div
                    class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"
                  >
                    <svg
                      class="w-5 h-5 text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <!-- Village -->
              <div>
                <label for="village" class="form-label required-label">Village</label>
                <input
                  type="text"
                  id="village"
                  v-model.trim="formData.village"
                  class="form-input"
                  placeholder="Enter village"
                  required
                />
              </div>

              <!-- Chiwog (Optional) -->
              <div>
                <label for="chiwog" class="form-label">Chiwog (Optional)</label>
                <input
                  type="text"
                  id="chiwog"
                  v-model.trim="formData.chiwog"
                  class="form-input"
                  placeholder="Enter chiwog (optional)"
                />
              </div>

              <!-- Address -->
              <div class="lg:col-span-2">
                <label for="address" class="form-label required-label">Address</label>
                <textarea
                  id="address"
                  v-model.trim="formData.address"
                  rows="3"
                  class="form-textarea"
                  placeholder="Enter complete address"
                  required
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        <!-- Course Details Section -->
        <div class="group relative">
          <div
            class="absolute inset-0 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-500 blur-xl"
          ></div>

          <div
            class="relative bg-white/80 backdrop-blur-xl border border-white/30 rounded-3xl shadow-sm overflow-hidden transform transition-all duration-500 hover:shadow-3xl hover:-translate-y-1"
          >
            <!-- Section Header -->
            <div
              class="bg-gradient-to-r from-amber-50 via-orange-50 to-red-50 px-8 py-6 border-b border-amber-100/50"
            >
              <div class="flex items-center">
                <div
                  class="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300"
                >
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0v6" />
                  </svg>
                </div>
                <div class="ml-6">
                  <h3
                    class="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent"
                  >
                    Course Details
                  </h3>
                  <p class="text-slate-500 mt-1 text-sm">
                    Information about the proposed engineering program
                  </p>
                </div>
              </div>
            </div>

            <!-- Section Content -->
            <div class="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
              <!-- Title of Course -->
              <div class="lg:col-span-2">
                <label for="title_of_course" class="form-label required-label">
                  Title of Course
                </label>
                <input
                  type="text"
                  id="title_of_course"
                  v-model.trim="formData.title_of_course"
                  class="form-input"
                  placeholder="Enter course title"
                  required
                />
              </div>

              <!-- Course Duration -->
              <div>
                <label for="course_duration" class="form-label required-label">
                  Course Duration (months)
                </label>
                <input
                  type="number"
                  id="course_duration"
                  v-model="formData.course_duration"
                  min="1"
                  class="form-input"
                  placeholder="Enter duration in months"
                  required
                />
              </div>

              <!-- Commencement Date -->
              <div>
                <label for="commencement_date" class="form-label required-label">
                  Proposed Commencement Date
                </label>
                <input
                  type="date"
                  id="commencement_date"
                  v-model="formData.commencement_date"
                  :min="todayDate"
                  class="form-input"
                  required
                />
              </div>

              <!-- Type of Program -->
              <div class="lg:col-span-2">
                <label class="form-label required-label mb-4">
                  Type of Program
                </label>
                <div class="flex flex-wrap gap-6">
                  <label
                    v-for="option in programTypeOptions"
                    :key="option.value"
                    class="flex items-center cursor-pointer group"
                  >
                    <div class="relative">
                      <input
                        type="radio"
                        :value="option.value"
                        v-model="formData.type_of_programme"
                        class="sr-only peer"
                        required
                      />
                      <div
                        class="w-5 h-5 rounded-full border-2 border-slate-300 peer-checked:border-amber-500 peer-checked:bg-amber-500 flex items-center justify-center transition-all duration-200 group-hover:border-amber-400"
                      >
                        <div class="w-2.5 h-2.5 rounded-full bg-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200"></div>
                      </div>
                    </div>
                    <span class="ml-3 text-slate-700 group-hover:text-slate-900 transition-colors duration-200">
                      {{ option.label }}
                    </span>
                  </label>
                </div>
              </div>

              <!-- Supporting Documents -->
              <div class="lg:col-span-2">
                <label for="supporting_documents" class="form-label required-label">
                  Supporting Documents
                </label>
                <div class="relative">
                  <input
                    type="file"
                    id="supporting_documents"
                    @change="(e) => handleFileUpload(e, 'supporting_documents')"
                    accept=".pdf,.doc,.docx"
                    required
                    class="form-file-input"
                  />
                  <p class="mt-2 text-sm text-slate-500 flex items-center">
                    <svg
                      class="w-4 h-4 mr-2 text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                      />
                    </svg>
                    Attach curriculum outline or other supporting documents
                  </p>
                  <p
                    v-if="formData.supporting_documents"
                    class="mt-2 text-sm text-green-600 flex items-center"
                  >
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    File selected: {{ formData.supporting_documents.name }}
                  </p>
                </div>
              </div>

              <!-- Remarks -->
              <div class="lg:col-span-2">
                <label for="remarks" class="form-label">
                  Remarks (Optional)
                </label>
                <textarea
                  id="remarks"
                  v-model="formData.remarks"
                  rows="3"
                  class="form-textarea"
                  placeholder="Additional remarks or comments..."
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        <!-- Head of Institution Section -->
        <div class="group relative">
          <div
            class="absolute inset-0 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 rounded-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-500 blur-xl"
          ></div>

          <div
            class="relative bg-white/80 backdrop-blur-xl border border-white/30 rounded-3xl shadow-sm overflow-hidden transform transition-all duration-500 hover:shadow-3xl hover:-translate-y-1"
          >
            <!-- Section Header -->
            <div
              class="bg-gradient-to-r from-violet-50 via-purple-50 to-fuchsia-50 px-8 py-6 border-b border-violet-100/50"
            >
              <div class="flex items-center">
                <div
                  class="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300"
                >
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div class="ml-6">
                  <h3
                    class="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent"
                  >
                    Head of Institution Details
                  </h3>
                  <p class="text-slate-500 mt-1 text-sm">
                    Contact information for the institution head
                  </p>
                </div>
              </div>
            </div>

            <!-- Section Content -->
            <div class="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
              <!-- Name -->
              <div>
                <label for="head_of_institution_name" class="form-label required-label">
                  Name
                </label>
                <input
                  type="text"
                  id="head_of_institution_name"
                  v-model.trim="formData.head_of_institution_name"
                  class="form-input"
                  placeholder="Enter full name"
                  required
                />
              </div>

              <!-- Gender -->
              <div>
                <label for="head_of_institution_gender" class="form-label required-label">
                  Gender
                </label>
                <div class="relative">
                  <select
                    id="head_of_institution_gender"
                    v-model="formData.head_of_institution_gender"
                    class="form-select"
                    required
                  >
                    <option value="" disabled>Select Gender</option>
                    <option v-for="option in genderOptions" :key="option.value" :value="option.value">
                      {{ option.label }}
                    </option>
                  </select>
                  <div
                    class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"
                  >
                    <svg
                      class="w-5 h-5 text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <!-- Phone Number -->
              <div>
                <label for="head_of_institution_phone_number" class="form-label required-label">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="head_of_institution_phone_number"
                  v-model.trim="formData.head_of_institution_phone_number"
                  class="form-input"
                  placeholder="Enter phone number"
                  required
                />
              </div>

              <!-- Email -->
              <div>
                <label for="head_of_institution_email" class="form-label required-label">
                  Email
                </label>
                <input
                  type="email"
                  id="head_of_institution_email"
                  v-model.trim="formData.head_of_institution_email"
                  class="form-input"
                  placeholder="Enter email address"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Declaration Section -->
        <div class="group relative">
          <div
            class="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-500 blur-xl"
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
                  I/We certify that the information provided in this application is true, complete, and accurate to the best of my knowledge. I realize that any false, fictitious, or fraudulent statements may be subjected to administrative penalties. I am fully aware and understand the process and requirements of relevant agencies.
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
            @click="saveDraft"
            :disabled="isSubmitting"
            class="btn btn-draft w-full sm:w-auto order-last sm:order-first"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            Save as Draft
          </button>

          <button
            type="submit"
            :disabled="!formData.declaration || isSubmitting"
            class="btn btn-primary w-full sm:w-auto"
          >
            <div v-if="isSubmitting" class="animate-spin w-5 h-5 mr-2 border-2 border-white border-t-transparent rounded-full"></div>
            <svg v-else class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            {{ isSubmitting ? 'Submitting...' : 'Submit Application' }}
          </button>
        </div>
      </form>
    </div>
  </div>

  <!-- Already Approved View -->
  <div v-else class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden flex items-center justify-center">
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        class="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-emerald-400/20 to-teal-600/20 rounded-full blur-3xl"
      ></div>
      <div
        class="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-green-400/20 to-emerald-600/20 rounded-full blur-3xl"
      ></div>
    </div>

    <div class="relative bg-white/80 backdrop-blur-xl border border-white/30 rounded-3xl shadow-xl p-12 max-w-lg mx-4">
      <div class="text-center">
        <div
          class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl mb-6 shadow-sm"
        >
          <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2
          class="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4"
        >
          Application Already Approved
        </h2>
        <p class="text-slate-600 leading-relaxed">
          You have already submitted and your application is approved. You cannot submit again.
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
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import apiService from '@/services/services'
import { useAuthStore } from '@/stores/authStore'
import { countryData } from '@/constants/countries.js'
import { bhutanDzongkhagsGewogs } from '@/constants/dzongkhags.js'

const router = useRouter()
const authStore = useAuthStore()
const availableGewogs = ref([])
const showForm = ref(true)
const existingApplication = ref(null)
const toastMessage = ref('')
const showToast = ref(false)
const isSubmitting = ref(false)
const isAutoFilled = ref(false)
const userData = ref(null)

const showToastNotification = (message, type = 'info') => {
  toastMessage.value = message
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
    toastMessage.value = ''
  }, 3000)
}

const todayDate = computed(() => {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
})

const formData = ref({
  // Basic Information
  CID: '',
  full_name: '',
  gender: '',
  contact_no: '',
  email_address: '',

  // Institution Details (removed teaching_institute and website)
  name_of_institution: '',
  country: 'Bhutan',
  gewog: '',
  dzongkhag: '',
  village: '',
  address: '',
  chiwog: '', // Made optional

  // Course Details
  title_of_course: '',
  course_duration: '',
  commencement_date: '',
  type_of_programme: '',
  supporting_documents: null,
  remarks: '',

  // Head of Institution Details
  head_of_institution_name: '',
  head_of_institution_gender: '',
  head_of_institution_phone_number: '',
  head_of_institution_email: '',

  // Declaration
  declaration: false,

  // Review fields (hidden)
  review_decision: 'Pending',
  reason_if_rejected: '',
})

const genderOptions = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'others', label: 'Others' },
]

const programTypeOptions = [
  { value: 'D', label: 'Diploma' },
  { value: 'B', label: 'Bachelor' },
]

// Auto-fill user data from auth store
const autoFillUserData = () => {
  try {
    if (authStore.user) {
      userData.value = authStore.user

      console.log('User data loaded from auth store:', userData.value)

      // Auto-fill personal information
      if (userData.value.cid) {
        formData.value.CID = userData.value.cid
      }

      // Construct full name from first, middle, and last names
      const fullNameParts = []
      if (userData.value.first_name) fullNameParts.push(userData.value.first_name)
      if (userData.value.middle_name) fullNameParts.push(userData.value.middle_name)
      if (userData.value.last_name) fullNameParts.push(userData.value.last_name)
      if (fullNameParts.length > 0) {
        formData.value.full_name = fullNameParts.join(' ')
      }

      if (userData.value.gender) {
        formData.value.gender = userData.value.gender.toLowerCase()
      }

      if (userData.value.contact_number) {
        formData.value.contact_no = userData.value.contact_number
      }

      if (userData.value.email) {
        formData.value.email_address = userData.value.email
      }

      // Auto-fill location information if available
      if (userData.value.dzongkhag) {
        formData.value.dzongkhag = userData.value.dzongkhag
        // Trigger gewog loading
        setTimeout(() => {
          handleDzongkhagChange()
          if (userData.value.gewog) {
            formData.value.gewog = userData.value.gewog
          }
        }, 100)
      }

      if (userData.value.village) {
        formData.value.village = userData.value.village
      }

      if (userData.value.chiwog) {
        formData.value.chiwog = userData.value.chiwog
      }

      if (userData.value.work_address || userData.value.address) {
        formData.value.address = userData.value.work_address || userData.value.address
      }

      isAutoFilled.value = true
      showToastNotification('Personal information has been auto-filled from your profile', 'success')
    } else {
      console.log('No user data found in auth store')
    }
  } catch (error) {
    console.error('Error auto-filling user data:', error)
  }
}

const handleDzongkhagChange = () => {
  const selectedDzongkhag = bhutanDzongkhagsGewogs.find(
    (d) => d.dzongkhag === formData.value.dzongkhag
  )
  availableGewogs.value = selectedDzongkhag ? selectedDzongkhag.gewogs : []
  formData.value.gewog = ''
}

const handleFileUpload = (event, fieldName) => {
  const file = event.target.files[0]
  if (file) {
    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      showToastNotification('File size should be less than 10MB')
      event.target.value = ''
      return
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    if (!allowedTypes.includes(file.type)) {
      showToastNotification('Only PDF, DOC, and DOCX files are allowed')
      event.target.value = ''
      return
    }

    formData.value[fieldName] = file
    showToastNotification('File selected successfully', 'success')
  }
}

const validateForm = () => {
  const requiredFields = [
    { field: 'full_name', label: 'Full Name' },
    { field: 'gender', label: 'Gender' },
    { field: 'contact_no', label: 'Contact Number' },
    { field: 'email_address', label: 'Email Address' },
    { field: 'name_of_institution', label: 'Name of Institution' },
    { field: 'country', label: 'Country' },
    { field: 'dzongkhag', label: 'Dzongkhag' },
    { field: 'gewog', label: 'Gewog' },
    { field: 'village', label: 'Village' },
    // { field: 'chiwog', label: 'Chiwog' }, // REMOVED - now optional
    { field: 'address', label: 'Address' },
    { field: 'title_of_course', label: 'Title of Course' },
    { field: 'course_duration', label: 'Course Duration' },
    { field: 'commencement_date', label: 'Commencement Date' },
    { field: 'type_of_programme', label: 'Type of Program' },
    { field: 'supporting_documents', label: 'Supporting Documents' },
    { field: 'head_of_institution_name', label: 'Head of Institution Name' },
    { field: 'head_of_institution_gender', label: 'Head of Institution Gender' },
    { field: 'head_of_institution_phone_number', label: 'Head of Institution Phone Number' },
    { field: 'head_of_institution_email', label: 'Head of Institution Email' },
  ]

  for (const { field, label } of requiredFields) {
    const value = formData.value[field]
    if (
      value === null ||
      value === undefined ||
      (typeof value === 'string' && value.trim() === '') ||
      (field === 'supporting_documents' && !value)
    ) {
      showToastNotification(`${label} is required.`)
      return false
    }
  }

  const duration = Number(formData.value.course_duration)
  if (!Number.isInteger(duration) || duration <= 0) {
    showToastNotification('Course Duration must be a positive integer (in months).')
    return false
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(formData.value.email_address)) {
    showToastNotification('Please enter a valid Email Address.')
    return false
  }
  if (!emailRegex.test(formData.value.head_of_institution_email)) {
    showToastNotification('Please enter a valid Head of Institution Email.')
    return false
  }

  if (new Date(formData.value.commencement_date) < new Date(todayDate.value)) {
    showToastNotification('Commencement Date cannot be in the past.')
    return false
  }

  return true
}

const handleSubmit = async () => {
  // Check authentication
  if (!authStore.isAuthenticated) {
    showToastNotification('Please log in to submit the application.')
    router.push('/login')
    return
  }

  if (!authStore.user || !authStore.user.cid) {
    showToastNotification('User authentication error. Please log in again.')
    return
  }

  formData.value.CID = authStore.user.cid

  if (!formData.value.declaration) {
    showToastNotification('Please agree to the declaration before submitting.')
    return
  }

  if (!validateForm()) {
    return
  }

  isSubmitting.value = true
  const submitData = new FormData()

  // Add authentication token if available
  const token = authStore.token || localStorage.getItem('access_token')
  if (token) {
    apiService.defaults.headers.common['Authorization'] = `Bearer ${token}`
  }

  Object.keys(formData.value).forEach((key) => {
    const value = formData.value[key]

    // Skip review decision fields
    if (key === 'review_decision' || key === 'reason_if_rejected') {
      return
    }

    if (key === 'declaration') {
      submitData.append('declaration', value ? 'true' : 'false')
    } else if (value instanceof File) {
      submitData.append(key, value, value.name)
    } else if (key === 'course_duration') {
      const duration = Number(value)
      if (!isNaN(duration) && duration > 0) {
        submitData.append(key, String(duration))
      } else {
        submitData.append(key, '')
      }
    } else if (value !== null && value !== undefined && value !== '') {
      submitData.append(key, String(value).trim())
    }
  })

  try {
    console.log('Submitting form data...')
    const response = await apiService.createEpcInstitute(submitData)
    if (response.data) {
      showToastNotification('Expression of Interest submitted successfully!', 'success')
      clearDraft()
      setTimeout(() => {
        router.push('/admin/institutions/engineering_certification/dashboard')
      }, 1500)
    } else {
      showToastNotification('Submission received, but confirmation unclear. Please check status later.')
    }
  } catch (error) {
    console.error('Error submitting EOI form:', error)
    let message = 'Error submitting application. Please try again.'

    if (error.response?.status === 401) {
      message = 'Session expired. Please log in again.'
      authStore.logout()
      router.push('/login')
    } else if (error.response?.data) {
      if (typeof error.response.data === 'string') {
        if (error.response.data.includes('<!DOCTYPE html>')) {
          message = 'Server returned an unexpected HTML error page. Please contact support.'
        } else {
          message = `Submission Failed: ${error.response.data}`
        }
      } else if (error.response.data.error) {
        message = `Submission Failed: ${error.response.data.error}`
      } else if (typeof error.response.data === 'object') {
        const errors = Object.entries(error.response.data)
          .map(
            ([field, messages]) =>
              `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`
          )
          .join('; ')
        message = `Submission Failed: ${errors || 'Please check your inputs.'}`
      } else {
        message = `Submission Failed: ${JSON.stringify(error.response.data)}`
      }
    } else if (error.request) {
      message = 'No response received from server. Check your network connection.'
    } else if (error.message) {
      message = `Submission Failed: ${error.message}`
    }

    showToastNotification(message)
  } finally {
    isSubmitting.value = false
  }
}

const saveDraft = () => {
  const draftData = { ...formData.value }
  if (draftData.supporting_documents instanceof File) {
    draftData.supporting_documents = {
      name: draftData.supporting_documents.name,
      type: draftData.supporting_documents.type
    }
  } else {
    draftData.supporting_documents = null
  }

  localStorage.setItem('epcEoiFormDraft', JSON.stringify(draftData))
  showToastNotification('Draft saved successfully!', 'success')
}

const clearDraft = () => {
  localStorage.removeItem('epcEoiFormDraft')
}

onMounted(async () => {
  // Auto-fill user data first
  autoFillUserData()

  if (authStore.user?.cid) {
    formData.value.CID = authStore.user.cid

    try {
      const response = await apiService.getEpcInstitutes()
      const applications = response.data.results
      if (!Array.isArray(applications)) {
        throw new Error("API response did not contain a 'results' array.")
      }
      const userApplication = applications.find((app) => app.CID === authStore.user.cid)
      if (userApplication) {
        existingApplication.value = userApplication
        if (
          userApplication.review_decision &&
          userApplication.review_decision.toLowerCase() === 'approved'
        ) {
          showForm.value = false
        } else {
          showForm.value = true
        }
      } else {
        showForm.value = true
      }
    } catch (err) {
      console.error('Error fetching EOI applications:', err)
      showToastNotification('Could not check your application status. Please try again later.')
      showForm.value = true
    }

    // Load draft if exists (after auto-fill)
    const savedDraft = localStorage.getItem('epcEoiFormDraft')
    if (savedDraft) {
      try {
        const parsedDraft = JSON.parse(savedDraft)
        Object.keys(parsedDraft).forEach((key) => {
          if (key !== 'CID' && Object.prototype.hasOwnProperty.call(formData.value, key)) {
            if (key !== 'supporting_documents') {
              formData.value[key] = parsedDraft[key]
            } else {
              formData.value[key] = null
            }
          }
        })

        if (formData.value.dzongkhag) {
          handleDzongkhagChange()
        }
        showToastNotification('Draft loaded. Please re-select any required files.')
      } catch (error) {
        console.error('Error loading draft:', error)
        clearDraft()
      }
    }
  } else {
    showToastNotification('Could not retrieve user information. Please log in again.')
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

.form-select {
  @apply w-full px-4 py-3 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition bg-white/80 appearance-none;
}

.form-textarea {
  @apply w-full px-4 py-3 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition bg-white/80 placeholder-slate-400 resize-none;
}

.form-file-input {
  @apply w-full px-4 py-3 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition bg-white/80 text-slate-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100;
}

.disabled-input {
  @apply bg-slate-100/80 text-slate-500 cursor-not-allowed;
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
</style>