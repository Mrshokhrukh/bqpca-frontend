<template>
  <div
    v-if="isVisible && application"
    class="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full flex items-center justify-center z-50 p-4"
    @click.self="closeModal"
  >
    <div
      class="bg-white rounded-lg shadow-xl p-6 md:p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
    >
      <div class="flex justify-between items-center mb-6 border-b pb-4">
        <h3 class="text-2xl font-semibold text-gray-900">
          DPR Application Details: {{ application.dpr_name }}
        </h3>
        <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div class="space-y-8">
        <!-- Basic Application Info -->
        <section>
          <h4 class="text-lg font-semibold text-gray-800 mb-3">Basic Information</h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-sm">
            <div>
              <strong class="text-gray-600">Institution Name:</strong>
              <p class="text-gray-800">{{ application.name_of_institution }}</p>
            </div>
            <div>
              <strong class="text-gray-600">CID:</strong>
              <p class="text-gray-800">{{ application.CID }}</p>
            </div>
            <div>
              <strong class="text-gray-600">DPR/Course Title:</strong>
              <p class="text-gray-800">{{ application.dpr_name }}</p>
            </div>
            <div>
              <strong class="text-gray-600">Status:</strong>
              <span
                :class="[
                  'px-2.5 py-0.5 text-xs font-medium rounded-full',
                  getStatusColor(application.do_dpr_review_decision),
                ]"
              >
                {{ application.do_dpr_review_decision || 'N/A' }}
              </span>
            </div>
            <div>
              <strong class="text-gray-600">Head of Institution:</strong>
              <p class="text-gray-800">
                {{ application.head_of_institution_name }} ({{
                  application.head_of_institution_email
                }})
              </p>
            </div>
            <div>
              <strong class="text-gray-600">Contact:</strong>
              <p class="text-gray-800">
                {{ application.contact_no }} | {{ application.email_address }}
              </p>
            </div>
            <div>
              <strong class="text-gray-600">Location:</strong>
              <p class="text-gray-800">
                {{ application.dzongkhag }}, {{ application.gewog || 'N/A' }}
              </p>
            </div>
            <div>
              <strong class="text-gray-600">Proposed Start Date:</strong>
              <p class="text-gray-800">{{ formatDate(application.commencement_date) }}</p>
            </div>
            <div>
              <strong class="text-gray-600">Program Type:</strong>
              <p class="text-gray-800">{{ formatProgramType(application.type_of_programme) }}</p>
            </div>
            <div>
              <strong class="text-gray-600">Duration:</strong>
              <p class="text-gray-800">{{ application.course_duration }} months</p>
            </div>
            <div
              v-if="
                application.do_dpr_review_decision === 'Rejected' &&
                application.do_dpr_reason_if_rejected
              "
              class="md:col-span-2"
            >
              <strong class="text-red-600">Rejection Reason:</strong>
              <p class="text-red-700 bg-red-50 p-2 rounded">
                {{ application.do_dpr_reason_if_rejected }}
              </p>
            </div>
          </div>
        </section>

        <!-- Executive Summary -->
        <section>
          <h4 class="text-lg font-semibold text-gray-800 mb-2">Executive Summary</h4>
          <p class="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
            {{ application.executive_summary || 'Not provided' }}
          </p>
        </section>

        <!-- DPR Review Summary -->
        <section v-if="application.do_dpr_review_summary">
          <h4 class="text-lg font-semibold text-gray-800 mb-2">DPR Review Summary (by Officer)</h4>
          <p class="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
            {{ application.do_dpr_review_summary }}
          </p>
        </section>

        <!-- Application Timeline -->
        <section>
          <h4 class="text-lg font-semibold text-gray-800 mb-3">Application Timeline</h4>
          <div class="relative pl-6">
            <div class="absolute left-2.5 top-0 h-full w-0.5 bg-gray-300"></div>
            <div
              v-for="(event, index) in getTimelineEvents(application)"
              :key="index"
              class="mb-6 relative"
            >
              <div
                :class="[
                  'absolute left-[-24px] top-1 w-5 h-5 rounded-full border-4 border-white',
                  event.color || 'bg-blue-600',
                ]"
              ></div>
              <p class="text-sm font-medium text-gray-800">{{ event.status }}</p>
              <p class="text-xs text-gray-500">{{ formatDate(event.date, true) }}</p>
              <p v-if="event.details" class="text-xs text-gray-600 mt-1">{{ event.details }}</p>
            </div>
          </div>
        </section>

        <!-- Guidelines for DPR (Collapsible Sections) -->
        <section>
          <h4 class="text-lg font-semibold text-gray-800 mb-3">
            DPR Guidelines Checklist (Illustrative)
          </h4>
          <p class="text-sm text-gray-600 mb-4">
            This section shows the standard guidelines for a Detailed Project Proposal. The
            applicant should ensure their submitted DPR addresses these points. (Actual submitted
            content for each point would be viewed in the uploaded DPR document).
          </p>
          <div class="space-y-3">
            <template v-for="(guideline, index) in dprGuidelines" :key="index">
              <div class="border border-gray-200 rounded-md">
                <button
                  @click="toggleGuideline(index)"
                  class="w-full flex justify-between items-center p-3 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                >
                  <span>{{ guideline.title }}</span>
                  <svg
                    class="w-5 h-5 transform transition-transform"
                    :class="{ 'rotate-180': openGuidelines[index] }"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                <div v-if="openGuidelines[index]" class="p-3 border-t border-gray-200 bg-gray-50">
                  <p class="text-xs text-gray-600 whitespace-pre-line">
                    {{ guideline.description }}
                  </p>
                  <!-- Here you could potentially show if the applicant has addressed this specific point,
                       if your `application` object contains such structured data.
                       For now, it just shows the guideline description.
                  <div class="mt-2 text-xs">
                    <span class="font-semibold">Applicant's Input:</span>
                    <span class="text-gray-500 italic ml-1"> (Data for this point would appear here if available in application object)</span>
                  </div>
                  -->
                </div>
              </div>
            </template>
          </div>
        </section>
      </div>

      <div class="mt-8 pt-6 border-t flex justify-end">
        <button
          type="button"
          @click="closeModal"
          class="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  isVisible: Boolean,
  application: Object, // The full application object
})

const emit = defineEmits(['close'])

const openGuidelines = ref({})

const dprGuidelines = ref([
  {
    title: 'Proposed Name of the College/institution',
    description:
      'The Detailed Project Proposal has to include the proposed name for the institution. The promoter must avoid using various terms such as “Royal”, “National” and other similar words in the names of the private institutions. The final name of the private institute shall be determined as per the approval of the Registrar of Companies, Ministry of Industry, Commerce and Employment.',
  },
  {
    title: 'Vision, Mission and Implementation strategies',
    description:
      'The Detailed Project Proposal shall include the vision, mission, objectives and implementation strategies of the institution. To this effect, the promoter should clearly mention all such strategies in the document; and what obstacles he/she envisages and how to overcome them to fulfill its vision and mission.',
  },
  {
    title: 'Project scheduling, implementation and management',
    description:
      'The Detailed Project Proposal has to specify the timelines and major milestones to be achieved with projected student numbers, etc.',
  },
  {
    title: 'Values of Gross National Happiness',
    description:
      'The Detailed Project Proposal must include how the institution aspires to contribute towards realizing Gross National Happiness, instilling values in students, promoting use of Information and Communication Technology and the quest for excellence.',
  },
  { title: 'Land', description: 'As required by relevant rules and regulations.' },
  {
    title: 'Conceptual Master plan',
    description:
      'The conceptual master plan must encompass all aspects of the physical infrastructure of the proposed buildings (academic, residential for staff and students, professional auditorium, dining hall, multipurpose hall, etc.), parking space, and playfields. Using accommodation to run two or more institutions in one premise in a shift system shall not be permitted.',
  },
  {
    title: 'Academic Plan/Profile',
    description:
      'The Detailed Project Proposal shall state the intent and purpose of the institute in terms of the academic character that it wishes to promote. It should include convincing justifications for the programs which are relevant based on analysis of market trends, programs offered by existing institutes, and research facilities for faculty and students. Furthermore, the DPP may include plans to offer credit transfer with other renowned institutes, and part-time and exchange study programs. The proponent may also include plans for a clear internship program with agencies in or ex-country for hands-on experience and has potential with in-campus recruitment.',
  },
  {
    title: 'Affiliation',
    description:
      'Provide details on the affiliation of the training institute with a recognized university. The proposed institution shall approach the University concerned to obtain affiliation for the institute. Before according to temporary affiliation to the college, the University shall send an affiliation committee to inspect whether the college has provided facilities as per the norms. The management of the sanctioned institute has to approach the concerned University for affiliation in the same academic year for which the permission is granted, otherwise, the permission orders issued are deemed to be canceled.',
  },
  {
    title: 'Teaching Hospital',
    description:
      'Identification of a Teaching hospital is mandatory for Medical and Health course for student practice to gain clinical skills. Teaching hospitals shall not be shared between two or more institutes offering the same education program. The institute shall have signed agreements with the Ministry of Health/ University of Medical Sciences for clinical facilities in the Teaching hospital, primary health center and other health facilities for specialized training.',
  },
  {
    title: 'Research Policy',
    description:
      'The Detailed Project Proposal shall include a policy to promote research activities by the faculty, students and the institution.',
  },
  {
    title: 'Human Resource',
    description:
      'The Detailed Project Proposal shall articulate and envisage that the faculties would be recruited both in terms of teaching and non-teaching as relevant to the types of programs and with relevant qualifications. By relevant qualification, reference should be made to the type of acquired qualification and the proposed field of teaching. It shall also indicate that the teaching of its courses shall be strictly carried out by academics with at least one qualification level higher than the level of the course taught. The provision for encouraging research, publication and consultancy services by faculties should be included. The number of people required, future expansion of programs and requirement of expatriate personnel should be clearly elaborated.',
  },
  {
    title: 'Quality Assurance System',
    description:
      'Quality being a major concern, the Detailed Project Proposal shall articulate the scope of having a mechanism to be put in place to ensure the internal quality assurance system and have a provision for external quality assurance by external professional bodies/Higher Education Quality Council. Academic quality with respect to teaching, learning, research and community service within the framework of the institutional mission must provide evidence that it has a clear description of academic quality, standards or policies to determine the quality standards, and expectations of institutional or program quality, educational quality, and student achievement.',
  },
  {
    title: 'Governance Structure',
    description:
      'The Detailed Project Proposal shall include the proposed governance policy to ensure that the institution’s operations and strategies are implemented to improve institutional performance. It must have an organizational structure including the Board of Directors, relevant committees and their terms of reference whose reporting arrangements, delegations and inter-relationships are clearly described to manage all key aspects of the quality Tertiary Education Institution. A section on planning the program, coordinating with stakeholders and mobilizing resources shall be included.',
  },
  {
    title: 'Business Plan',
    description:
      'The Detailed Project Proposal shall indicate the financial viability and the capacities of the promoter to sustain operations into the future through a range of financial indicators. It shall also capture the source of funds such as equity (partners, shares, etc. or debt and a detailed project costing as well as financial analysis including projected tuition levels that will make the institution viable shall be mentioned). It should also stipulate that the institution shall be well-managed by stating when the management and administrative systems, policies, procedures and practices will be put in place.',
  },
  {
    title: 'Project cost and Analysis',
    description:
      'The Detailed Project Proposal should include detailed project costing and financial analysis including projected tuition levels, source of funding whether equity (partners, shares, etc.) and/or debt structure. They may be based on the cost (in Nu) of land, site development, civil construction, infrastructure/installation charges, plant and equipment, pollution control equipment and accessories, technical know-how and services, other pre-operating expenses, miscellaneous/contingencies, foreign exchange requirement if any, etc. Both fixed investment and working capital must be included.',
  },
  {
    title: 'Facilities and Student Services',
    description:
      'The Detailed Project Proposal shall include the appropriate range of mechanisms intended to be put in place so that student learning outcomes are enhanced through access to quality facilities, inclusive practices, learning and information resources including library, infirmary, ICT facilities and support services including cafeteria, transport, counseling services, etc.',
  },
  {
    title: 'Admission Policy and Scholarships',
    description:
      'The Detailed Project Proposal shall include a clear policy on admission, eligibility criteria, selection procedures, fee structure, and provisions of scholarships by the college.',
  },
  {
    title: 'Service conditions',
    description:
      'The Detailed Project Proposal shall specify clear policies on service conditions such as recruitment, professional development of the staff, remuneration details including provident fund, retirement benefits, leave procedure, staff welfare, student representation in decision-making bodies and any other support services that the institutes envisage to set up.',
  },
  {
    title: 'Safety and Security',
    description:
      'Evidence must be included in the Detailed Project Proposal to show that the institution is concerned for the safety and security of the staff and students. The Detailed Project Proposal shall, therefore, indicate that proper mechanisms are put in place. In the event of the closure of the college for unforeseen reasons, the details of provisions for the continuation of the courses by the learners shall be also included in the Detailed Project Proposal. This is to ensure proper protection of the learners in terms of continuation and completion of the courses.',
  },
  {
    title: 'Public Information System',
    description:
      'The Detailed Project Proposal shall include the plan to create and maintain a public information system to ensure transparency of all necessary information such as student fees, licensing and accreditation status, course details etc. of the college.',
  },
  {
    title: 'Others',
    description:
      'The Detailed Project Proposal shall cover issues such as, but not limited to the following, supported by sound and authentic justifications; market analysis, ownership, sustainability of the college, enrolment projection (beginning & onwards), approvals from respective organizations, etc.',
  },
])

watch(
  () => props.isVisible,
  (newValue) => {
    if (newValue) {
      // Reset open/closed states of guidelines when modal becomes visible
      openGuidelines.value = {}
    }
  },
)

const closeModal = () => {
  emit('close')
}

const toggleGuideline = (index) => {
  openGuidelines.value[index] = !openGuidelines.value[index]
}

const formatDate = (dateString, includeTime = false) => {
  if (!dateString) return 'N/A'
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'Invalid Date'
    const options = { day: '2-digit', month: 'short', year: 'numeric' }
    if (includeTime) {
      options.hour = '2-digit'
      options.minute = '2-digit'
    }
    return date.toLocaleDateString('en-GB', options)
  } catch (e) {
    console.error('Date formatting error:', e)
    return 'Date Error'
  }
}

const getStatusColor = (status) => {
  // Same as in DPRApplicationManager
  const STATUS_APPROVED = 'Approved'
  const STATUS_REJECTED = 'Rejected'
  const STATUS_PENDING = 'Pending'
  switch (status) {
    case STATUS_APPROVED:
      return 'bg-green-100 text-green-700'
    case STATUS_REJECTED:
      return 'bg-red-100 text-red-700'
    case STATUS_PENDING:
      return 'bg-yellow-100 text-yellow-700'
    case 'In Review':
      return 'bg-blue-100 text-blue-700'
    case 'Submitted':
      return 'bg-gray-100 text-gray-700'
    default:
      return 'bg-gray-100 text-gray-700'
  }
}

const formatProgramType = (type) => {
  switch (type) {
    case 'D':
      return 'Diploma'
    case 'B':
      return 'Bachelor'
    case 'C':
      return 'Certificate'
    case 'O':
      return 'Other'
    default:
      return type || 'N/A'
  }
}

const getTimelineEvents = (app) => {
  if (!app) return []
  let events = [
    {
      status: 'Application Submitted',
      date: app.created_at || app.commencement_date,
      color: 'bg-gray-500',
    },
  ]

  if (app.do_dpr_review_decision && app.do_dpr_review_decision !== 'Submitted') {
    let statusText = `Reviewed: ${app.do_dpr_review_decision}`
    let color = 'bg-yellow-500' // Pending/In Review
    if (app.do_dpr_review_decision === 'Approved') {
      color = 'bg-green-500'
    } else if (app.do_dpr_review_decision === 'Rejected') {
      color = 'bg-red-500'
    } else if (app.do_dpr_review_decision === 'In Review') {
      color = 'bg-blue-500'
    }
    events.push({
      status: statusText,
      date: app.updated_at || app.do_dpr_review_date, // Assuming a review date field
      color: color,
      details:
        app.do_dpr_review_decision === 'Rejected'
          ? `Reason: ${app.do_dpr_reason_if_rejected}`
          : app.do_dpr_review_summary,
    })
  }

  if (app.is_payment_complete) {
    events.push({
      status: 'Payment Completed',
      date: app.payment_completed_at || app.updated_at, // Assuming a payment date field
      color: 'bg-teal-500',
    })
  }
  // Add more events based on your application lifecycle (e.g., certificate issued)

  return events.sort((a, b) => new Date(a.date) - new Date(b.date))
}
</script>

<style scoped>
/* Scoped styles if needed */
.whitespace-pre-line {
  white-space: pre-line;
}
</style>
