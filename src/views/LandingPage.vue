<template>
  <div class="min-h-screen bg-slate-50">
    <!-- Hero Section with Animated Background -->
    <div class="relative bg-gradient-to-r from-slate-900 to-slate-800 overflow-hidden mt-10">
      <!-- Decorative circles -->
      <div class="absolute inset-0">
        <div
          class="absolute -top-20 -right-20 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl"
        ></div>
        <div
          class="absolute -bottom-32 -left-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"
        ></div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative">
        <div class="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
          <!-- Hero Content -->
          <div class="col-span-6 text-white">
            <div class="space-y-2 mb-6">
              <div
                class="inline-flex items-center px-3 py-1 rounded-full border border-blue-400/30 bg-blue-400/10 text-blue-200"
              >
                <span class="text-sm">Official Government Authority</span>
              </div>
            </div>
            <h1 class="text-4xl font-serif font-bold tracking-tight sm:text-5xl lg:text-6xl mb-6">
              <span class="block">Bhutan Qualifications &</span>
              <span class="block text-blue-400">Professional Certification</span>
              <span class="block">Authority</span>
            </h1>
            <p class="mt-6 text-lg text-slate-300 leading-relaxed max-w-2xl">
              Upholding excellence in education and professional standards through rigorous
              certification and accreditation processes.
            </p>
            <div class="mt-10 flex flex-col sm:flex-row gap-4">
              <a
                href="#services"
                class="group inline-flex items-center px-6 py-3 bg-white text-slate-900 rounded-lg hover:bg-slate-100 transition-all shadow-lg hover:shadow-xl"
              >
                <span>View Our Services</span>
                <ChevronRight
                  class="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform"
                />
              </a>
              <a
                href="#contact"
                class="inline-flex items-center px-6 py-3 border-2 border-white text-white rounded-lg hover:bg-white/10 transition-colors"
              >
                Contact Us
              </a>
            </div>
          </div>

          <!-- Stats Grid -->
          <div class="col-span-6 mt-12 lg:mt-0">
            <div
              class="bg-white/5 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/10"
            >
              <div class="grid grid-cols-2 gap-6">
                <div
                  v-for="stat in stats"
                  :key="stat.label"
                  class="p-6 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20"
                >
                  <p class="text-3xl font-bold text-white mb-1">{{ stat.value }}</p>
                  <p class="text-sm text-slate-300">{{ stat.label }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Scroll Indicator -->
        <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <a
            href="#services"
            class="animate-bounce flex flex-col items-center text-white/60 hover:text-white/80"
          >
            <ArrowDownCircle class="h-6 w-6" />
            <span class="text-sm mt-2">Explore More</span>
          </a>
        </div>
      </div>
    </div>

    <!-- Services Section -->
    <div id="services" class="py-24 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-20">
          <h2 class="text-3xl font-serif font-bold text-slate-900">Professional Services</h2>
          <div class="w-20 h-1 bg-blue-600 mx-auto mt-4"></div>
          <p class="mt-6 text-lg text-slate-600 max-w-2xl mx-auto">
            Comprehensive certification and accreditation services for professionals and
            institutions across Bhutan.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <!-- Wrap the entire service card content with router-link -->
          <router-link
            v-for="service in services"
            :key="service.name"
            :to="service.route"
            class="group relative bg-white rounded-xl hover:shadow-xl transition-all duration-300 border border-slate-200 overflow-hidden block"
          >
            <!-- Added 'block' class for proper link behavior -->
            <div
              class="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
            ></div>
            <div class="p-8 relative">
              <div class="flex items-center mb-6">
                <div class="p-3 rounded-lg bg-blue-50 group-hover:bg-blue-100 transition-colors">
                  <component :is="service.icon" class="w-8 h-8 text-blue-600" />
                </div>
                <h3 class="text-xl font-semibold text-slate-900 ml-4">
                  {{ service.name }}
                </h3>
              </div>
              <p class="text-slate-600 mb-6 min-h-[80px] leading-relaxed">
                {{ service.description }}
              </p>
              <!-- "Learn More" link (optional, can be kept or removed) -->
              <span
                class="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium group"
              >
                Proceed to Login
                <ArrowRight class="ml-2 w-4 h-4 transition-transform group-hover:translate-x-2" />
              </span>
            </div>
          </router-link>
        </div>
      </div>
    </div>

    <!-- About Section -->
    <div id="about" class="py-24 bg-slate-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-20">
          <h2 class="text-3xl font-serif font-bold text-slate-900">About BQPCA</h2>
          <div class="w-20 h-1 bg-blue-600 mx-auto mt-4"></div>
          <p class="mt-6 text-lg text-slate-600 max-w-2xl mx-auto">
            The Bhutan Qualifications and Professionals Certification Authority provides
            comprehensive certification, qualification accreditation, and professional standards
            management under the Ministry of Education and Skills Development.
          </p>
        </div>

        <!-- Main Content Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <!-- Left Column: Mission & Description -->
          <div class="relative">
            <div
              class="absolute -top-10 -left-10 w-40 h-40 bg-blue-50 rounded-full opacity-50 blur-2xl"
            ></div>
            <div
              class="relative bg-white rounded-xl p-8 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300"
            >
              <h3 class="text-2xl font-serif font-bold text-slate-800 mb-6">Our Mission</h3>
              <p class="text-slate-600 leading-relaxed mb-6">
                To automate and streamline professional certification and qualification processes,
                enhancing service delivery and creating a centralized support system for all
                stakeholders in Bhutan.
              </p>
              <div class="flex items-center space-x-4 text-blue-600">
                <DocumentCheckIcon class="w-6 h-6" />
                <span class="font-medium">Ensuring Excellence in Professional Standards</span>
              </div>
            </div>
          </div>

          <!-- Right Column: Councils Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div
              v-for="council in councils"
              :key="council.name"
              class="group bg-white rounded-xl p-6 shadow-lg border border-slate-200 hover:border-blue-200 hover:shadow-xl transition-all duration-300"
            >
              <div class="flex flex-col h-full">
                <div
                  class="p-3 rounded-lg bg-blue-50 w-fit mb-4 group-hover:bg-blue-100 transition-colors"
                >
                  <component :is="council.icon" class="w-6 h-6 text-blue-600" />
                </div>
                <h4 class="text-lg font-semibold text-slate-900 mb-2">{{ council.name }}</h4>
                <p class="text-slate-600 text-sm flex-grow">{{ council.description }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Bottom Stats Section -->
        <div class="mt-20 bg-white rounded-2xl shadow-xl p-12 relative overflow-hidden">
          <div class="absolute inset-0">
            <div
              class="absolute top-0 right-0 w-40 h-40 bg-blue-50 rounded-full -translate-y-1/2 translate-x-1/2"
            ></div>
            <div
              class="absolute bottom-0 left-0 w-40 h-40 bg-slate-50 rounded-full translate-y-1/2 -translate-x-1/2"
            ></div>
          </div>

          <div class="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div v-for="achievement in achievements" :key="achievement.label" class="text-center">
              <p class="text-3xl font-bold text-blue-600 mb-2">{{ achievement.value }}</p>
              <p class="text-sm text-slate-600">{{ achievement.label }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Contact Section -->
    <div id="contact" class="py-24 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-20">
          <h2 class="text-3xl font-serif font-bold text-slate-900">Contact Information</h2>
          <div class="w-20 h-1 bg-blue-600 mx-auto mt-4"></div>
          <p class="mt-6 text-lg text-slate-600 max-w-2xl mx-auto">
            Get in touch with us for any inquiries about our certification and accreditation
            services.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div
            v-for="contact in contacts"
            :key="contact.title"
            class="group bg-slate-50 rounded-xl p-8 border border-slate-200 hover:border-blue-200 transition-all hover:shadow-lg"
          >
            <div class="flex flex-col items-center text-center">
              <div
                class="p-4 rounded-full bg-white shadow-md mb-6 group-hover:shadow-xl transition-all"
              >
                <component :is="contact.icon" class="w-6 h-6 text-blue-600" />
              </div>
              <h3 class="text-lg font-semibold text-slate-900 mb-3">
                {{ contact.title }}
              </h3>
              <p class="text-slate-600">{{ contact.info }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Certificate Verification Section -->
    <div id="certificate-verification" class="py-24 bg-slate-100">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-3xl font-serif font-bold text-slate-900">Certificate Verification</h2>
          <div class="w-20 h-1 bg-blue-600 mx-auto mt-4"></div>
          <p class="mt-6 text-lg text-slate-600 max-w-2xl mx-auto">
            The official BQPCA portal to verify the authenticity of certifications issued by the
            authority.
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <!-- Left Column: Features -->
          <div class="space-y-8">
            <div class="bg-white rounded-xl p-8 shadow-lg border border-slate-200">
              <h3 class="text-xl font-semibold text-slate-900 mb-6">Key Considerations</h3>
              <div class="space-y-6">
                <div
                  v-for="feature in verificationFeatures"
                  :key="feature.title"
                  class="flex items-start space-x-4"
                >
                  <div class="p-2 rounded-lg bg-blue-50 mt-1">
                    <component :is="feature.icon" class="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 class="font-medium text-slate-900">{{ feature.title }}</h4>
                    <p class="text-sm text-slate-600 mt-1">{{ feature.description }}</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-slate-800 rounded-xl p-8 text-white relative overflow-hidden">
              <div class="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-transparent"></div>
              <div class="relative">
                <h3 class="text-xl font-semibold mb-4">Information</h3>
                <p class="text-slate-300">
                  Our online verification system provides secure and efficient authentication of
                  certifications issued in Bhutan.
                </p>
                <div class="mt-6 flex items-center space-x-2 text-blue-300">
                  <ActivityIcon class="w-5 h-5" />
                  <span class="text-sm">Official verification system.</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column: Verification Card -->
          <div class="relative">
            <!-- Decorative Elements -->
            <div
              class="absolute -top-10 -right-10 w-40 h-40 bg-blue-50 rounded-full opacity-50 blur-2xl"
            ></div>
            <div
              class="absolute -bottom-10 -left-10 w-40 h-40 bg-slate-100 rounded-full opacity-50 blur-2xl"
            ></div>

            <div class="relative bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
              <div class="text-center mb-8">
                <div
                  class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 mb-4"
                >
                  <SearchIcon class="w-8 h-8 text-blue-600" />
                </div>
                <h3 class="text-xl font-semibold text-slate-900">Certificate Verification</h3>
                <p class="text-sm text-slate-600 mt-2">
                  Proceed to verify the authenticity of a BQPCA issued certificate.
                </p>
              </div>

              <router-link
                to="/certification-validity"
                class="group block w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl p-6 hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-4">
                    <ShieldCheckIcon class="w-6 h-6" />
                    <div class="text-left">
                      <h4 class="font-medium">Initiate Verification</h4>
                      <p class="text-sm text-blue-100">Official Portal • Secure Process</p>
                    </div>
                  </div>
                  <ArrowRight
                    class="w-6 h-6 transform group-hover:translate-x-2 transition-transform"
                  />
                </div>
              </router-link>

              <div class="mt-8 grid grid-cols-2 gap-4 text-center text-sm">
                <div class="p-4 rounded-lg bg-slate-50">
                  <p class="text-slate-900 font-medium">24/7</p>
                  <p class="text-slate-600">Availability</p>
                </div>
                <div class="p-4 rounded-lg bg-slate-50">
                  <p class="text-slate-900 font-medium">Instant</p>
                  <p class="text-slate-600">Verification</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  ChevronRight,
  ArrowRight,
  MapPin,
  Mail,
  Phone,
  Lock as LockIcon,
  Shield as ShieldIcon,
  GraduationCap,
  Award,
  Building2,
  BookOpen,
  Users,
  ArrowDownCircle,
  Users as UsersIcon,
  ClipboardCheck as DocumentCheckIcon,
  Search as SearchIcon,
  ShieldCheck as ShieldCheckIcon,
  Activity as ActivityIcon,
  Clock as ClockIcon,
  Database as DatabaseIcon,
} from 'lucide-vue-next'

const verificationFeatures = [
  {
    icon: ShieldIcon,
    title: 'Authenticity Assurance',
    description: 'Confirm if a certificate has been officially issued by the BQPCA.',
  },
  {
    icon: ClockIcon,
    title: 'Current Status',
    description: 'Provides immediate verification of certification status and validity.',
  },
  {
    icon: DatabaseIcon,
    title: 'Detailed Information',
    description:
      'View comprehensive details about the certification, including its field and level.',
  },
  {
    icon: LockIcon,
    title: 'Secure Process',
    description: 'The system employs advanced security measures to ensure data integrity.',
  },
]

const services = [
  {
    name: 'Recognition of Qualification',
    description:
      'Official verification and recognition of educational qualifications through our standardized system.',
    icon: GraduationCap,
    route: '/roq',
  },
  {
    name: 'Education Consultancy & Placement Firms (ECPF)',
    description: 'Comprehensive certification framework for educators and professionals in Bhutan.',
    icon: Award,
    route: '/ecpf',
  },
  {
    name: 'Accreditation Service',
    description: 'Systematic evaluation and accreditation of educational institutions.',
    icon: Building2,
    route: '/accreditation',
  },
  {
    name: 'Engineering Professionals Council (EPC)',
    description: 'Professional certification and validation for engineering practitioners.',
    icon: BookOpen,
    route: '/engineering',
  },
  {
    name: 'Medical & Health Professionals Council (MHPC)',
    description: 'Official registration and certification for healthcare professionals.',
    icon: Users,
    route: '/mhpc',
  },
]

const stats = [
  { label: 'Certified Professionals', value: '5,000+' },
  { label: 'Accredited Institutions', value: '100+' },
  { label: 'Certification Rate', value: '98%' },
  { label: 'Processing Efficiency', value: '95%' },
]

const contacts = [
  {
    title: 'Official Address',
    info: 'BQPCA Headquarters, Thimphu, Bhutan',
    icon: MapPin,
  },
  {
    title: 'Email Contact',
    info: 'contact@bqpca.gov.bt',
    icon: Mail,
  },
  {
    title: 'Phone Number',
    info: '+975 XXXXXXX',
    icon: Phone,
  },
]

const councils = [
  {
    name: 'MHPC',
    description: 'Medical & Health Professionals Council for healthcare certification',
    icon: UsersIcon,
  },
  {
    name: 'HEQC',
    description: 'Higher Education Quality Council for academic standards',
    icon: GraduationCap,
  },
  {
    name: 'TVET-QC',
    description: 'Technical & Vocational Education Training Quality Council',
    icon: Award,
  },
  {
    name: 'EPC',
    description: 'Engineering Professionals Council for engineering certifications',
    icon: Building2,
  },
]

const achievements = [
  { label: 'Professional Certifications', value: '5,000+' },
  { label: 'Registered Institutions', value: '100+' },
  { label: 'Success Rate', value: '98%' },
  { label: 'User Satisfaction', value: '95%' },
]
</script>
