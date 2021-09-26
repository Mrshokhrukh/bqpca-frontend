<template>
  <div class="min-h-screen bg-slate-50">
    <!-- Hero Section with Animated Background -->
    <div class="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      <!-- Floating shapes -->
      <div class="absolute inset-0 pointer-events-none">
        <div class="shape"></div>
        <div class="shape"></div>
        <div class="shape"></div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative">
        <div class="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
          <!-- Hero Content -->
          <div class="col-span-6 text-white mt-12">
            <div class="space-y-2 mb-6">
              <div
                class="inline-flex items-center px-3 py-1 rounded-full border border-blue-400/30 bg-blue-400/10 text-blue-200 backdrop-blur-sm"
              >
                <ShieldCheckIcon class="h-4 w-4 mr-2" />
                <span class="text-sm">Official Government Authority</span>
              </div>
            </div>
            <h1
              class="text-4xl font-serif font-extrabold tracking-tight sm:text-5xl lg:text-6xl mb-6 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent"
            >
              Bhutan Qualifications & Professionals Certification Authority
            </h1>
            <p class="mt-6 text-lg text-slate-300 leading-relaxed max-w-2xl">
              Empowering excellence through rigorous certification and accreditation processes. Your
              trusted partner in professional development and educational standards.
            </p>
            <div class="mt-10 flex flex-col sm:flex-row gap-4">
              <a
                href="#services"
                class="group inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 transform transition-all"
              >
                <span>Explore Services</span>
                <ArrowRight
                  class="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform"
                />
              </a>
              <a
                href="#contact"
                class="inline-flex items-center justify-center px-6 py-3 bg-white/10 border-2 border-white/20 text-white rounded-xl hover:bg-white/20 transition-colors backdrop-blur-sm"
              >
                Get Started
              </a>
            </div>
          </div>

          <!-- Stats Grid -->
          <div class="col-span-6 mt-12 lg:mt-0">
            <div
              class="bg-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/20"
            >
              <div class="grid grid-cols-2 gap-6">
                <div
                  v-for="stat in stats"
                  :key="stat.label"
                  class="p-6 rounded-xl bg-white/10 border border-white/20 text-center transition-transform hover:-translate-y-1"
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
    <div id="services" class="py-24 bg-gradient-to-b from-slate-50 to-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-20 fade-in">
          <h2
            class="text-3xl font-serif font-bold text-slate-900 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent"
          >
            Professional Services
          </h2>
          <div class="w-20 h-1 bg-blue-600 mx-auto mt-4"></div>
          <p class="mt-6 text-lg text-slate-600 max-w-2xl mx-auto">
            Comprehensive certification and accreditation services for professionals and
            institutions across Bhutan.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <router-link
            v-for="service in services"
            :key="service.name"
            :to="service.route"
            class="group service-card-hover relative bg-white rounded-xl hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2 transition-all duration-300 border border-slate-200 overflow-hidden block fade-in"
          >
            <div class="p-8 relative">
              <div
                class="p-3 rounded-lg w-fit mb-6 bg-gradient-to-br from-blue-600 to-blue-700 text-white"
              >
                <component :is="service.icon" class="w-8 h-8" />
              </div>
              <h3 class="text-xl font-semibold text-slate-900 mb-4">
                {{ service.name }}
              </h3>
              <p class="text-slate-600 mb-6 min-h-[80px] leading-relaxed">
                {{ service.description }}
              </p>
              <span
                class="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
              >
                Proceed
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
        <div class="text-center mb-20 fade-in">
          <h2
            class="text-3xl font-serif font-bold text-slate-900 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent"
          >
            About BQPCA
          </h2>
          <div class="w-20 h-1 bg-blue-600 mx-auto mt-4"></div>
          <p class="mt-6 text-lg text-slate-600 max-w-2xl mx-auto">
            The Bhutan Qualifications and Professionals Certification Authority provides
            comprehensive certification, qualification accreditation, and professional standards
            management under the Ministry of Education and Skills Development.
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div class="relative fade-in">
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

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 fade-in">
            <div
              v-for="council in councils"
              :key="council.name"
              class="group bg-white rounded-xl p-6 shadow-lg border border-slate-200 hover:border-blue-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
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
      </div>
    </div>

    <!-- Certificate Verification Section -->
    <div id="certificate-verification" class="py-24 bg-slate-900 text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div class="space-y-8 fade-in">
            <h2
              class="text-3xl font-serif font-extrabold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent"
            >
              Certificate Verification Portal
            </h2>
            <p class="text-lg text-slate-300">
              Instantly verify the authenticity of any BQPCA-issued certification through our
              secure, real-time verification system.
            </p>
            <div class="space-y-4">
              <div
                v-for="feature in verificationFeatures"
                :key="feature.title"
                class="flex items-start space-x-4"
              >
                <div class="p-2 rounded-lg bg-blue-500/10 mt-1">
                  <component :is="feature.icon" class="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h4 class="font-medium text-slate-100">{{ feature.title }}</h4>
                  <p class="text-sm text-slate-400 mt-1">{{ feature.description }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="relative fade-in">
            <div
              class="verification-card relative p-1 rounded-2xl overflow-hidden border border-white/10"
            >
              <div class="verification-card-content relative bg-slate-800/90 rounded-xl p-8">
                <div class="text-center mb-8">
                  <div
                    class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 mb-4"
                  >
                    <SearchIcon class="w-8 h-8 text-white" />
                  </div>
                  <h3 class="text-xl font-semibold text-white">Verify Certificate</h3>
                  <p class="text-sm text-slate-400 mt-2">
                    Proceed to verify the authenticity of a BQPCA issued certificate.
                  </p>
                </div>

                <router-link
                  to="/certification-validity"
                  class="group block w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl p-4 hover:from-emerald-600 hover:to-green-700 transition-all shadow-lg hover:shadow-emerald-500/30"
                >
                  <div class="flex items-center justify-center">
                    <ShieldCheckIcon class="w-6 h-6" />
                    <div class="text-center ml-3">
                      <h4 class="font-medium">Initiate Verification</h4>
                    </div>
                  </div>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Contact Section -->
    <div id="contact" class="py-24 bg-gradient-to-b from-slate-100 to-slate-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-20 fade-in">
          <h2
            class="text-3xl font-serif font-bold text-slate-900 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent"
          >
            Get In Touch
          </h2>
          <div class="w-20 h-1 bg-blue-600 mx-auto mt-4"></div>
          <p class="mt-6 text-lg text-slate-600 max-w-2xl mx-auto">
            Connect with our team for any inquiries about certification services, application
            processes, or general support.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div
            v-for="contact in contacts"
            :key="contact.title"
            class="group bg-white rounded-xl p-8 border border-slate-200 hover:border-blue-300 transition-all hover:shadow-xl hover:-translate-y-2 transform fade-in"
          >
            <div class="flex flex-col items-center text-center">
              <div
                class="p-4 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg mb-6 group-hover:shadow-xl transition-all"
              >
                <component :is="contact.icon" class="w-6 h-6" />
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
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
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
  { label: 'User Satisfaction', value: '95%' },
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

// --- Animations and Effects ---

const observer = ref(null)
const observedElements = ref([])

const handleScroll = () => {
  const scrolled = window.pageYOffset
  document.querySelectorAll('.shape').forEach((shape, index) => {
    const speed = 0.15 + index * 0.1
    const rotation = scrolled * 0.02
    const translation = scrolled * speed
    // Use will-change and translate3d for performance
    shape.style.transform = `translate3d(0, ${translation}px, 0) rotate(${rotation}deg)`
  })
}

onMounted(() => {
  // Intersection Observer for fade-in animations
  observer.value = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
          observer.value.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.1 }
  )

  document.querySelectorAll('.fade-in').forEach((el) => {
    observer.value.observe(el)
    observedElements.value.push(el)
  })

  // Parallax scroll for hero shapes
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  if (observer.value) {
    observedElements.value.forEach((el) => {
      if (el) observer.value.unobserve(el)
    })
  }
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style>
/* --- Hero Animations --- */
@keyframes float {
  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-30px) rotate(180deg);
  }
}

.shape {
  position: absolute;
  border-radius: 9999px;
  background: linear-gradient(45deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.05));
  animation: float 12s ease-in-out infinite;
  will-change: transform;
}

.shape:nth-child(1) {
  width: 200px;
  height: 200px;
  top: 10%;
  left: 10%;
  animation-delay: 0s;
  animation-duration: 12s;
}

.shape:nth-child(2) {
  width: 150px;
  height: 150px;
  top: 60%;
  right: 15%;
  animation-delay: -4s;
  animation-duration: 15s;
}

.shape:nth-child(3) {
  width: 100px;
  height: 100px;
  bottom: 20%;
  left: 70%;
  animation-delay: -8s;
  animation-duration: 10s;
}

/* --- Service Card Hover --- */
.service-card-hover::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.08), transparent);
  transition: left 0.6s ease;
}

.service-card-hover:hover::before {
  left: 100%;
}

/* --- Verification Card Animation --- */
@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.verification-card::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: conic-gradient(
    from 0deg,
    transparent,
    rgba(59, 130, 246, 0.3),
    transparent 30%
  );
  animation: rotate 10s linear infinite;
}

/* --- Fade-in Animation --- */
.fade-in {
  opacity: 0;
  transform: translateY(30px);
  transition:
    opacity 0.6s ease-out,
    transform 0.6s ease-out;
}

.fade-in.visible {
  opacity: 1;
  transform: translateY(0);
}
</style>
