<template>
    <div class="w-full mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Left Column: Profile Card (Sticky) -->
            <div class="lg:col-span-1">
                <div class="bg-white rounded-xl shadow-lg overflow-hidden sticky top-6">
                    <div class="bg-gradient-to-r from-blue-500 to-blue-400 p-6 text-white">
                        <div class="flex flex-col items-center">
                            <div class="relative group mb-4">
                                <div
                                    class="w-28 h-28 rounded-full bg-white flex items-center justify-center text-blue-500 text-4xl font-bold shadow-lg transition-all duration-300 group-hover:shadow-xl"
                                >
                                    {{
                                        profileData.name
                                            ? profileData.name.charAt(0).toUpperCase()
                                            : 'U'
                                    }}
                                </div>
                            </div>
                            <h2 class="text-2xl font-bold text-center">{{ profileData.name }}</h2>
                            <p class="text-sm text-blue-100 flex items-center justify-center mt-1">
                                <Mail class="w-4 h-4 mr-1" />
                                {{ profileData.email }}
                            </p>
                            <div
                                v-if="profileData.contactNo"
                                class="text-sm text-blue-100 flex items-center justify-center mt-1"
                            >
                                <Phone class="w-4 h-4 mr-1" />
                                {{ profileData.contactNo }}
                            </div>
                        </div>
                    </div>

                    <div class="p-6">
                        <div class="grid grid-cols-2 gap-4">
                            <div class="bg-blue-50 p-4 rounded-lg">
                                <div class="flex items-center text-blue-600">
                                    <Award class="w-5 h-5 mr-2" />
                                    <span class="font-medium">Linkages</span>
                                </div>
                                <p class="text-2xl font-bold text-gray-800">
                                    {{ profileData.linkages.length }}
                                </p>
                            </div>
                            <div class="bg-green-50 p-4 rounded-lg">
                                <div class="flex items-center text-green-600">
                                    <CheckCircle class="w-5 h-5 mr-2" />
                                    <span class="font-medium">Status</span>
                                </div>
                                <p class="text-2xl font-bold text-gray-800">
                                    {{ profileData.status }}
                                </p>
                            </div>
                        </div>
                        <button
                            @click="toggleEditMode"
                            class="w-full mt-4 flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                            :class="[
                                isEditing
                                    ? 'bg-red-500 hover:bg-red-600 text-white'
                                    : 'bg-blue-500 hover:bg-blue-600 text-white',
                            ]"
                        >
                            <Edit v-if="!isEditing" class="w-4 h-4 mr-2" />
                            <X v-else class="w-4 h-4 mr-2" />
                            {{ isEditing ? 'Cancel' : 'Edit Profile' }}
                        </button>
                    </div>
                </div>
            </div>

            <!-- Right Column: Main Content -->
            <div class="lg:col-span-2 space-y-6">
                <form @submit.prevent="updateProfile" class="space-y-6">
                    <!-- Personal Information -->
                    <div class="bg-white rounded-xl shadow-lg p-6">
                        <div class="flex items-center mb-4">
                            <User class="w-5 h-5 text-blue-500 mr-2" />
                            <h3 class="text-xl font-semibold text-gray-800">
                                Personal Information
                            </h3>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label class="block text-sm font-medium text-gray-700"
                                    >CID No. <span class="text-red-500">*</span></label
                                >
                                <div
                                    v-if="!isEditing"
                                    class="text-gray-600 px-4 py-2.5 bg-gray-50 rounded-md mt-1"
                                >
                                    {{ profileData.cidNo }}
                                </div>
                                <input
                                    v-else
                                    v-model="profileData.cidNo"
                                    type="text"
                                    required
                                    class="mt-1 block w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700"
                                    >Applicant's Name <span class="text-red-500">*</span></label
                                >
                                <div
                                    v-if="!isEditing"
                                    class="text-gray-600 px-4 py-2.5 bg-gray-50 rounded-md mt-1"
                                >
                                    {{ profileData.name }}
                                </div>
                                <input
                                    v-else
                                    v-model="profileData.name"
                                    type="text"
                                    required
                                    class="mt-1 block w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700"
                                    >Gender</label
                                >
                                <div
                                    v-if="!isEditing"
                                    class="text-gray-600 px-4 py-2.5 bg-gray-50 rounded-md mt-1 capitalize"
                                >
                                    {{ profileData.gender || '-' }}
                                </div>
                                <select
                                    v-else
                                    v-model="profileData.gender"
                                    class="mt-1 block w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Select</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700"
                                    >Date of Birth</label
                                >
                                <div
                                    v-if="!isEditing"
                                    class="text-gray-600 px-4 py-2.5 bg-gray-50 rounded-md mt-1"
                                >
                                    {{ formatDate(profileData.dob) }}
                                </div>
                                <input
                                    v-else
                                    v-model="profileData.dob"
                                    type="date"
                                    class="mt-1 block w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700"
                                    >Contact Number <span class="text-red-500">*</span></label
                                >
                                <div
                                    v-if="!isEditing"
                                    class="text-gray-600 px-4 py-2.5 bg-gray-50 rounded-md mt-1"
                                >
                                    {{ profileData.contactNo }}
                                </div>
                                <input
                                    v-else
                                    v-model="profileData.contactNo"
                                    type="tel"
                                    required
                                    class="mt-1 block w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    <!-- Residential Address -->
                    <div class="bg-white rounded-xl shadow-lg p-6">
                        <div class="flex items-center mb-4">
                            <MapPin class="w-5 h-5 text-blue-500 mr-2" />
                            <h3 class="text-xl font-semibold text-gray-800">Residential Address</h3>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label class="block text-sm font-medium text-gray-700"
                                    >Office Number</label
                                >
                                <div
                                    v-if="!isEditing"
                                    class="text-gray-600 px-4 py-2.5 bg-gray-50 rounded-md mt-1"
                                >
                                    {{ profileData.residential.officeNumber || '-' }}
                                </div>
                                <input
                                    v-else
                                    v-model="profileData.residential.officeNumber"
                                    type="text"
                                    class="mt-1 block w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700"
                                    >Flat No.</label
                                >
                                <div
                                    v-if="!isEditing"
                                    class="text-gray-600 px-4 py-2.5 bg-gray-50 rounded-md mt-1"
                                >
                                    {{ profileData.residential.flatNo || '-' }}
                                </div>
                                <input
                                    v-else
                                    v-model="profileData.residential.flatNo"
                                    type="text"
                                    class="mt-1 block w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700"
                                    >Building No.</label
                                >
                                <div
                                    v-if="!isEditing"
                                    class="text-gray-600 px-4 py-2.5 bg-gray-50 rounded-md mt-1"
                                >
                                    {{ profileData.residential.buildingNo || '-' }}
                                </div>
                                <input
                                    v-else
                                    v-model="profileData.residential.buildingNo"
                                    type="text"
                                    class="mt-1 block w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700"
                                    >Location <span class="text-red-500">*</span></label
                                >
                                <div
                                    v-if="!isEditing"
                                    class="text-gray-600 px-4 py-2.5 bg-gray-50 rounded-md mt-1"
                                >
                                    {{ profileData.residential.location }}
                                </div>
                                <input
                                    v-else
                                    v-model="profileData.residential.location"
                                    type="text"
                                    required
                                    class="mt-1 block w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700"
                                    >Gewog/Throm <span class="text-red-500">*</span></label
                                >
                                <div
                                    v-if="!isEditing"
                                    class="text-gray-600 px-4 py-2.5 bg-gray-50 rounded-md mt-1"
                                >
                                    {{ profileData.residential.gewogThrom }}
                                </div>
                                <input
                                    v-else
                                    v-model="profileData.residential.gewogThrom"
                                    type="text"
                                    required
                                    class="mt-1 block w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700"
                                    >Dzongkhag/Thromde <span class="text-red-500">*</span></label
                                >
                                <div
                                    v-if="!isEditing"
                                    class="text-gray-600 px-4 py-2.5 bg-gray-50 rounded-md mt-1"
                                >
                                    {{ profileData.residential.dzongkhagThromde }}
                                </div>
                                <input
                                    v-else
                                    v-model="profileData.residential.dzongkhagThromde"
                                    type="text"
                                    required
                                    class="mt-1 block w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    <!-- Permanent Address -->
                    <div class="bg-white rounded-xl shadow-lg p-6">
                        <div class="flex items-center mb-4">
                            <MapPin class="w-5 h-5 text-blue-500 mr-2" />
                            <h3 class="text-xl font-semibold text-gray-800">Permanent Address</h3>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label class="block text-sm font-medium text-gray-700"
                                    >Village/Chiwog</label
                                >
                                <div
                                    v-if="!isEditing"
                                    class="text-gray-600 px-4 py-2.5 bg-gray-50 rounded-md mt-1"
                                >
                                    {{ profileData.permanent.villageChiwog || '-' }}
                                </div>
                                <input
                                    v-else
                                    v-model="profileData.permanent.villageChiwog"
                                    type="text"
                                    class="mt-1 block w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700">Gewog</label>
                                <div
                                    v-if="!isEditing"
                                    class="text-gray-600 px-4 py-2.5 bg-gray-50 rounded-md mt-1"
                                >
                                    {{ profileData.permanent.gewog || '-' }}
                                </div>
                                <input
                                    v-else
                                    v-model="profileData.permanent.gewog"
                                    type="text"
                                    class="mt-1 block w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700"
                                    >Dungkhag</label
                                >
                                <div
                                    v-if="!isEditing"
                                    class="text-gray-600 px-4 py-2.5 bg-gray-50 rounded-md mt-1"
                                >
                                    {{ profileData.permanent.dungkhag || '-' }}
                                </div>
                                <input
                                    v-else
                                    v-model="profileData.permanent.dungkhag"
                                    type="text"
                                    class="mt-1 block w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700"
                                    >Dzongkhag/Thromde <span class="text-red-500">*</span></label
                                >
                                <div
                                    v-if="!isEditing"
                                    class="text-gray-600 px-4 py-2.5 bg-gray-50 rounded-md mt-1"
                                >
                                    {{ profileData.permanent.dzongkhagThromde }}
                                </div>
                                <input
                                    v-else
                                    v-model="profileData.permanent.dzongkhagThromde"
                                    type="text"
                                    required
                                    class="mt-1 block w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    <!-- Education Details -->
                    <div class="bg-white rounded-xl shadow-lg p-6">
                        <div class="flex items-center mb-4">
                            <Award class="w-5 h-5 text-blue-500 mr-2" />
                            <h3 class="text-xl font-semibold text-gray-800">Education Details</h3>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label class="block text-sm font-medium text-gray-700"
                                    >Qualification</label
                                >
                                <div
                                    v-if="!isEditing"
                                    class="text-gray-600 px-4 py-2.5 bg-gray-50 rounded-md mt-1"
                                >
                                    {{ profileData.education.qualification || '-' }}
                                </div>
                                <input
                                    v-else
                                    v-model="profileData.education.qualification"
                                    type="text"
                                    class="mt-1 block w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700"
                                    >Name of Institute</label
                                >
                                <div
                                    v-if="!isEditing"
                                    class="text-gray-600 px-4 py-2.5 bg-gray-50 rounded-md mt-1"
                                >
                                    {{ profileData.education.institute || '-' }}
                                </div>
                                <input
                                    v-else
                                    v-model="profileData.education.institute"
                                    type="text"
                                    class="mt-1 block w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700"
                                    >Name of University</label
                                >
                                <div
                                    v-if="!isEditing"
                                    class="text-gray-600 px-4 py-2.5 bg-gray-50 rounded-md mt-1"
                                >
                                    {{ profileData.education.university || '-' }}
                                </div>
                                <input
                                    v-else
                                    v-model="profileData.education.university"
                                    type="text"
                                    class="mt-1 block w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    <!-- ECPF Establishment Proposal Details -->
                    <div class="bg-white rounded-xl shadow-lg p-6">
                        <div class="flex items-center mb-4">
                            <Award class="w-5 h-5 text-blue-500 mr-2" />
                            <h3 class="text-xl font-semibold text-gray-800">
                                ECPF Establishment Proposal Details
                            </h3>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label class="block text-sm font-medium text-gray-700"
                                    >Name of the Proposed Firm</label
                                >
                                <div
                                    v-if="!isEditing"
                                    class="text-gray-600 px-4 py-2.5 bg-gray-50 rounded-md mt-1"
                                >
                                    {{ profileData.ecpf.firmName || '-' }}
                                </div>
                                <input
                                    v-else
                                    v-model="profileData.ecpf.firmName"
                                    type="text"
                                    class="mt-1 block w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700"
                                    >Address of the Proposed Firm</label
                                >
                                <div
                                    v-if="!isEditing"
                                    class="text-gray-600 px-4 py-2.5 bg-gray-50 rounded-md mt-1"
                                >
                                    {{ profileData.ecpf.address || '-' }}
                                </div>
                                <input
                                    v-else
                                    v-model="profileData.ecpf.address"
                                    type="text"
                                    class="mt-1 block w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700"
                                    >Location of the Proposed Firm</label
                                >
                                <div
                                    v-if="!isEditing"
                                    class="text-gray-600 px-4 py-2.5 bg-gray-50 rounded-md mt-1"
                                >
                                    {{ profileData.ecpf.location || '-' }}
                                </div>
                                <input
                                    v-else
                                    v-model="profileData.ecpf.location"
                                    type="text"
                                    class="mt-1 block w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700"
                                    >Type of Firm</label
                                >
                                <div
                                    v-if="!isEditing"
                                    class="text-gray-600 px-4 py-2.5 bg-gray-50 rounded-md mt-1 capitalize"
                                >
                                    {{ profileData.ecpf.type || '-' }}
                                </div>
                                <select
                                    v-else
                                    v-model="profileData.ecpf.type"
                                    class="mt-1 block w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">Select</option>
                                    <option value="Sole Proprietorship">Sole Proprietorship</option>
                                    <option value="Partnership">Partnership</option>
                                    <option value="Private Limited">Private Limited</option>
                                    <option value="Public Limited">Public Limited</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <!-- Purpose of Establishment -->
                    <div class="bg-white rounded-xl shadow-lg p-6">
                        <div class="flex items-center mb-4">
                            <Award class="w-5 h-5 text-blue-500 mr-2" />
                            <h3 class="text-xl font-semibold text-gray-800">
                                Purpose of Establishment
                            </h3>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-1 gap-6">
                            <div>
                                <label class="block text-sm font-medium text-gray-700"
                                    >Vision</label
                                >
                                <div
                                    v-if="!isEditing"
                                    class="text-gray-600 px-4 py-2.5 bg-gray-50 rounded-md mt-1"
                                >
                                    {{ profileData.purpose.vision || '-' }}
                                </div>
                                <input
                                    v-else
                                    v-model="profileData.purpose.vision"
                                    type="text"
                                    class="mt-1 block w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700"
                                    >Mission</label
                                >
                                <div
                                    v-if="!isEditing"
                                    class="text-gray-600 px-4 py-2.5 bg-gray-50 rounded-md mt-1"
                                >
                                    {{ profileData.purpose.mission || '-' }}
                                </div>
                                <input
                                    v-else
                                    v-model="profileData.purpose.mission"
                                    type="text"
                                    class="mt-1 block w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700"
                                    >Objective</label
                                >
                                <div
                                    v-if="!isEditing"
                                    class="text-gray-600 px-4 py-2.5 bg-gray-50 rounded-md mt-1"
                                >
                                    {{ profileData.purpose.objective || '-' }}
                                </div>
                                <input
                                    v-else
                                    v-model="profileData.purpose.objective"
                                    type="text"
                                    class="mt-1 block w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    <!-- Institute/Colleges/University Linkages -->
                    <div class="bg-white rounded-xl shadow-lg p-6">
                        <div class="flex items-center mb-4">
                            <Award class="w-5 h-5 text-blue-500 mr-2" />
                            <h3 class="text-xl font-semibold text-gray-800">
                                Institute/Colleges/University Linkages
                            </h3>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-1 gap-6">
                            <div>
                                <label class="block text-sm font-medium text-gray-700"
                                    >Linkages</label
                                >
                                <div
                                    v-if="!isEditing"
                                    class="text-gray-600 px-4 py-2.5 bg-gray-50 rounded-md mt-1"
                                >
                                    <ul
                                        v-if="profileData.linkages.length > 0"
                                        class="list-disc list-inside"
                                    >
                                        <li
                                            v-for="(linkage, index) in profileData.linkages"
                                            :key="index"
                                        >
                                            {{ linkage }}
                                        </li>
                                    </ul>
                                    <p v-else class="text-gray-500">No linkages added yet.</p>
                                </div>
                                <div v-else class="space-y-2">
                                    <div
                                        v-for="(linkage, index) in profileData.linkages"
                                        :key="index"
                                        class="flex items-center"
                                    >
                                        <input
                                            v-model="profileData.linkages[index]"
                                            type="text"
                                            :placeholder="`Linkage ${index + 1}`"
                                            class="mt-1 block w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 mr-2"
                                        />
                                        <button
                                            @click="removeLinkage(index)"
                                            type="button"
                                            class="text-red-500 hover:text-red-700 focus:outline-none"
                                        >
                                            <X class="w-5 h-5" />
                                        </button>
                                    </div>
                                    <button
                                        @click="addLinkage"
                                        type="button"
                                        class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        Add Linkage
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!--Targeted Clients  -->
                    <div class="bg-white rounded-xl shadow-lg p-6">
                        <div class="flex items-center mb-4">
                            <Award class="w-5 h-5 text-blue-500 mr-2" />
                            <h3 class="text-xl font-semibold text-gray-800">Targeted Clients</h3>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-1 gap-6">
                            <div>
                                <label class="block text-sm font-medium text-gray-700"
                                    >Targeted Clients</label
                                >
                                <div
                                    v-if="!isEditing"
                                    class="text-gray-600 px-4 py-2.5 bg-gray-50 rounded-md mt-1"
                                >
                                    {{ profileData.targetedClients || '-' }}
                                </div>
                                <input
                                    v-else
                                    v-model="profileData.targetedClients"
                                    type="text"
                                    class="mt-1 block w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    <!-- SWOT Analysis -->
                    <div class="bg-white rounded-xl shadow-lg p-6">
                        <div class="flex items-center mb-4">
                            <Award class="w-5 h-5 text-blue-500 mr-2" />
                            <h3 class="text-xl font-semibold text-gray-800">SWOT Analysis</h3>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label class="block text-sm font-medium text-gray-700"
                                    >Strengths</label
                                >
                                <div
                                    v-if="!isEditing"
                                    class="text-gray-600 px-4 py-2.5 bg-gray-50 rounded-md mt-1"
                                >
                                    {{ profileData.swot.strengths || '-' }}
                                </div>
                                <input
                                    v-else
                                    v-model="profileData.swot.strengths"
                                    type="text"
                                    class="mt-1 block w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700"
                                    >Weaknesses</label
                                >
                                <div
                                    v-if="!isEditing"
                                    class="text-gray-600 px-4 py-2.5 bg-gray-50 rounded-md mt-1"
                                >
                                    {{ profileData.swot.weaknesses || '-' }}
                                </div>
                                <input
                                    v-else
                                    v-model="profileData.swot.weaknesses"
                                    type="text"
                                    class="mt-1 block w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700"
                                    >Opportunities</label
                                >
                                <div
                                    v-if="!isEditing"
                                    class="text-gray-600 px-4 py-2.5 bg-gray-50 rounded-md mt-1"
                                >
                                    {{ profileData.swot.opportunities || '-' }}
                                </div>
                                <input
                                    v-else
                                    v-model="profileData.swot.opportunities"
                                    type="text"
                                    class="mt-1 block w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700"
                                    >Threats</label
                                >
                                <div
                                    v-if="!isEditing"
                                    class="text-gray-600 px-4 py-2.5 bg-gray-50 rounded-md mt-1"
                                >
                                    {{ profileData.swot.threats || '-' }}
                                </div>
                                <input
                                    v-else
                                    v-model="profileData.swot.threats"
                                    type="text"
                                    class="mt-1 block w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>
                    </div>

                    <!-- Fee and Charges -->
                    <div class="bg-white rounded-xl shadow-lg p-6">
                        <div class="flex items-center mb-4">
                            <Award class="w-5 h-5 text-blue-500 mr-2" />
                            <h3 class="text-xl font-semibold text-gray-800">Fee and Charges</h3>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label class="block text-sm font-medium text-gray-700"
                                    >Fee Breakup</label
                                >
                                <div
                                    v-if="!isEditing"
                                    class="text-gray-600 px-4 py-2.5 bg-gray-50 rounded-md mt-1"
                                >
                                    {{ profileData.fees[0].breakup || '-' }}
                                </div>
                                <input
                                    v-else
                                    v-model="profileData.fees[0].breakup"
                                    type="text"
                                    class="mt-1 block w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700"
                                    >Description</label
                                >
                                <div
                                    v-if="!isEditing"
                                    class="text-gray-600 px-4 py-2.5 bg-gray-50 rounded-md mt-1"
                                >
                                    {{ profileData.fees[0].description || '-' }}
                                </div>
                                <input
                                    v-else
                                    v-model="profileData.fees[0].description"
                                    type="text"
                                    class="mt-1 block w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700"
                                    >Amount</label
                                >
                                <div
                                    v-if="!isEditing"
                                    class="text-gray-600 px-4 py-2.5 bg-gray-50 rounded-md mt-1"
                                >
                                    {{ profileData.fees[0].amount || '-' }}
                                </div>
                                <input
                                    v-else
                                    v-model="profileData.fees[0].amount"
                                    type="number"
                                    class="mt-1 block w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>
                        <div class="mt-4">
                            <label class="block text-sm font-medium text-gray-700"
                                >Total Amount</label
                            >
                            <div
                                v-if="!isEditing"
                                class="text-gray-600 px-4 py-2.5 bg-gray-50 rounded-md mt-1 font-bold"
                            >
                                {{ profileData.totalFee || '-' }}
                            </div>
                            <input
                                v-else
                                v-model="profileData.totalFee"
                                type="number"
                                class="mt-1 block w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-bold"
                            />
                        </div>
                    </div>

                    <!-- Guarantor Details -->
                    <div class="bg-white rounded-xl shadow-lg p-6">
                        <div class="flex items-center mb-4">
                            <Award class="w-5 h-5 text-blue-500 mr-2" />
                            <h3 class="text-xl font-semibold text-gray-800">Guarantor Details</h3>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label class="block text-sm font-medium text-gray-700"
                                    >Full Name</label
                                >
                                <div
                                    v-if="!isEditing"
                                    class="text-gray-600 px-4 py-2.5 bg-gray-50 rounded-md mt-1"
                                >
                                    {{ profileData.guarantor.fullName || '-' }}
                                </div>
                                <input
                                    v-else
                                    v-model="profileData.guarantor.fullName"
                                    type="text"
                                    class="mt-1 block w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700"
                                    >CID Number</label
                                >
                                <div
                                    v-if="!isEditing"
                                    class="text-gray-600 px-4 py-2.5 bg-gray-50 rounded-md mt-1"
                                >
                                    {{ profileData.guarantor.cidNumber || '-' }}
                                </div>
                                <input
                                    v-else
                                    v-model="profileData.guarantor.cidNumber"
                                    type="text"
                                    class="mt-1 block w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700"
                                    >Relation to Applicant</label
                                >
                                <div
                                    v-if="!isEditing"
                                    class="text-gray-600 px-4 py-2.5 bg-gray-50 rounded-md mt-1"
                                >
                                    {{ profileData.guarantor.relation || '-' }}
                                </div>
                                <input
                                    v-else
                                    v-model="profileData.guarantor.relation"
                                    type="text"
                                    class="mt-1 block w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label class="block text-sm font-medium text-gray-700"
                                    >Contact Number</label
                                >
                                <div
                                    v-if="!isEditing"
                                    class="text-gray-600 px-4 py-2.5 bg-gray-50 rounded-md mt-1"
                                >
                                    {{ profileData.guarantor.contactNumber || '-' }}
                                </div>
                                <input
                                    v-else
                                    v-model="profileData.guarantor.contactNumber"
                                    type="tel"
                                    class="mt-1 block w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>
                        <div class="mt-4">
                            <label class="block text-sm font-medium text-gray-700">CID Copy</label>
                            <div
                                v-if="!isEditing"
                                class="text-gray-600 px-4 py-2.5 bg-gray-50 rounded-md mt-1"
                            >
                                <a
                                    v-if="profileData.guarantor.cidCopy"
                                    :href="profileData.guarantor.cidCopy"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="text-blue-600 hover:underline"
                                    >View CID Copy</a
                                >
                                <span v-else>No CID Copy Uploaded</span>
                            </div>

                            <input
                                v-else
                                type="file"
                                @change="handleCidCopyUpload"
                                class="mt-1 block w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>

                    <!-- Supporting Document -->
                    <div class="bg-white rounded-xl shadow-lg p-6">
                        <div class="flex items-center mb-4">
                            <Award class="w-5 h-5 text-blue-500 mr-2" />
                            <h3 class="text-xl font-semibold text-gray-800">
                                Supporting Documents
                            </h3>
                        </div>
                        <div class="mt-4">
                            <label class="block text-sm font-medium text-gray-700">CV</label>
                            <div
                                v-if="!isEditing"
                                class="text-gray-600 px-4 py-2.5 bg-gray-50 rounded-md mt-1"
                            >
                                <a
                                    v-if="profileData.cv"
                                    :href="profileData.cv"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="text-blue-600 hover:underline"
                                    >View CV</a
                                >
                                <span v-else>No CV Uploaded</span>
                            </div>
                            <input
                                v-else
                                type="file"
                                @change="handleCvUpload"
                                class="mt-1 block w-full px-4 py-2.5 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>
                </form>

                <!-- Message Display -->
                <TransitionRoot appear :show="!!message" as="template">
                    <div
                        :class="[
                            'fixed bottom-4 right-4 p-4 rounded-lg shadow-lg transition-all duration-300 transform max-w-md',
                            messageClass,
                            message ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0',
                        ]"
                    >
                        <div class="flex items-center">
                            <CheckCircle
                                v-if="messageClass.includes('green')"
                                class="w-5 h-5 mr-2 text-green-500"
                            />
                            <CircleAlert v-else class="w-5 h-5 mr-2 text-red-500" />
                            {{ message }}
                        </div>
                    </div>
                </TransitionRoot>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
// import { useAuthStore } from '@/stores/authStore'; // If you have an auth store
// import apiService from '@/services/services'; // Your API service
import { TransitionRoot } from '@headlessui/vue'
import {
    Mail,
    User,
    MapPin,
    Award,
    Edit,
    X,
    CheckCircle,
    CircleAlert,
    Phone,
} from 'lucide-vue-next'

const loading = ref(false)
const message = ref('')
const messageClass = ref('')
const isEditing = ref(false)

const profileData = reactive({
    cidNo: '1111',
    name: 'Tenzin Wangmo',
    gender: 'Female',
    dob: '1995-08-22',
    contactNo: '+1-555-123-4567',
    email: 'tenzin.w@example.com',
    residential: {
        officeNumber: '404',
        flatNo: 'D-8',
        buildingNo: 'Sunshine Plaza',
        location: 'Uptown',
        gewogThrom: 'Gelephu Thromde',
        dzongkhagThromde: 'Sarpang',
    },
    permanent: {
        villageChiwog: 'Pemathang',
        gewog: 'Samtse',
        dungkhag: 'Tashicholing',
        dzongkhagThromde: 'Samtse',
    },
    education: {
        qualification: 'Masters in Counseling',
        institute: 'Royal Thimphu College',
        university: 'Royal University of Bhutan',
    },
    ecpf: {
        firmName: 'EduGuide Consultants',
        address: 'Norzin Lam, Thimphu',
        location: 'Thimphu',
        type: 'Partnership',
    },
    purpose: {
        vision: 'Empowering students through informed educational choices.',
        mission: 'Providing personalized guidance for academic success.',
        objective: 'To increase student enrollment in reputable institutions.',
    },
    linkages: ['University of Sydney', 'Monash University', 'RMIT'],
    targetedClients: 'Undergraduate and postgraduate applicants.',
    swot: {
        strengths: 'Experienced counselors, global partnerships.',
        weaknesses: 'New entrant in the market.',
        opportunities: 'Increasing interest in international education.',
        threats: 'Established competitors.',
    },
    fees: [{ breakup: 'Consulting', description: 'Initial Consulting Service', amount: 12 }],
    totalFee: 12,
    guarantor: {
        fullName: 'Kinley Dorji',
        cidNumber: '1122334455',
        relation: 'Uncle',
        contactNumber: '+975-17-000000',
        cidCopy: null, // Placeholder for file URL
    },
    cv: null, // Placeholder for file URL
    declaration: false,
    declarationDate: null,
    status: 'Approved',
})

const formatDate = (date) => {
    if (!date) return '-'
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })
}

const toggleEditMode = () => {
    isEditing.value = !isEditing.value
    message.value = '' // Clear messages on toggle

    // *Important*: If editing is cancelled, revert to original data
    if (!isEditing.value) {
        loadProfile() // You'll need to implement this to re-fetch or restore original
    }
}

const loadProfile = () => {
    //In real case scenario, data should be fetched using API
    //For example
    //   try {
    //      const response = await apiService.getProfile();
    //       Object.assign(profileData, response.data); // Use Object.assign for reactive
    //   } catch (error) {
    //      console.error("Error loading:", error)
    //      showMessage('Failed to load profile.', 'error');
    //   }
}

const updateProfile = async () => {
    loading.value = true
    message.value = ''

    try {
        // 1. Prepare the data to be sent.  Crucially, handle nested objects.
        const updateData = {
            cidNo: profileData.cidNo,
            name: profileData.name,
            gender: profileData.gender,
            dob: profileData.dob,
            contactNo: profileData.contactNo,
            email: profileData.email, // Email might be immutable, depending on your backend
            residential: { ...profileData.residential }, // *Clone* the nested object
            permanent: { ...profileData.permanent }, // *Clone*
            education: { ...profileData.education }, // *Clone*
            ecpf: { ...profileData.ecpf }, // *Clone*
            purpose: { ...profileData.purpose }, // *Clone*
            linkages: [...profileData.linkages], // *Clone* the array
            targetedClients: profileData.targetedClients,
            swot: { ...profileData.swot }, // *Clone*
            fees: profileData.fees.map((fee) => ({ ...fee })), // Deep clone the fees array
            totalFee: profileData.totalFee,
            guarantor: { ...profileData.guarantor }, // *Clone*, but handle file separately
            // cv:  // Handle file uploads separately (see below)
            declaration: profileData.declaration,
            declarationDate: profileData.declaration ? new Date().toISOString() : null, // Set date if declared
        }

        // 2. Handle file uploads (if any are modified).  Use FormData.
        const formData = new FormData()
        let hasFiles = false

        if (profileData.guarantor.cidCopy instanceof File) {
            formData.append('cidCopy', profileData.guarantor.cidCopy)
            hasFiles = true
            //Remove the cidCopy url
            updateData.guarantor.cidCopy = null
        }
        if (profileData.cv instanceof File) {
            formData.append('cv', profileData.cv)
            hasFiles = true
            //Remove the cv url
            updateData.cv = null
        }

        // 3. Append the *stringified* updateData to the FormData if there are files.
        if (hasFiles) {
            formData.append('profileData', JSON.stringify(updateData))
        }

        // 4. Make the API call.  Use different endpoints for file uploads vs. regular data.
        if (hasFiles) {
            //Use the form data
            // Example using a hypothetical apiService:
            // const response = await apiService.updateProfileWithFiles(formData);
            console.log('Form Data:', formData)
            showMessage('Profile updated successfully (with files)!', 'success') //for demo purpose
        } else {
            //Use the updateData
            // Example using a hypothetical apiService:
            // const response = await apiService.updateProfile(updateData);
            console.log('Profile Data:', updateData)
            showMessage('Profile updated successfully!', 'success') //for demo purpose
        }

        // 5.  Update local data *after* successful API call.
        // Object.assign(profileData, response.data);  // Update with the server's response
        isEditing.value = false
    } catch (error) {
        console.error('Error updating profile:', error)
        const errorMessage =
            error.response?.data?.message || 'Failed to update profile. Please try again.'
        showMessage(errorMessage, 'error')
    } finally {
        loading.value = false
    }
}

const showMessage = (text, type = 'success') => {
    message.value = text
    messageClass.value =
        type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'

    setTimeout(() => {
        message.value = ''
        messageClass.value = ''
    }, 5000)
}

// --- File Handling ---
const handleCidCopyUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
        profileData.guarantor.cidCopy = file // Store the *File object* itself
        // Optionally, display a preview:  profileData.guarantor.cidCopyPreview = URL.createObjectURL(file);
    } else {
        profileData.guarantor.cidCopy = null
        // profileData.guarantor.cidCopyPreview = null;
    }
}
const handleCvUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
        profileData.cv = file // Store the *File object* itself
    } else {
        profileData.cv = null
    }
}

// --- Linkage ---
const addLinkage = () => {
    profileData.linkages.push('') // Add an empty string for a new linkage
}

const removeLinkage = (index) => {
    profileData.linkages.splice(index, 1) // Remove the linkage at the given index
}

onMounted(loadProfile)
</script>
