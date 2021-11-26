<template>
  <div class="assignments-display">
    <header class="page-header">
      <h1>Faculty Assignment Matrix</h1>
      <p>An interactive matrix of all faculty assignments, grouped by institution.</p>
    </header>

    <div class="controls-wrapper">
      <div class="search-input-container">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="search-icon">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <input type="text" v-model="searchTerm" placeholder="Search modules, faculty, programs..."
          class="search-input" />
      </div>
      <div class="filter-container">
        <label for="institute-filter" class="filter-label">Filter by Institute:</label>
        <select id="institute-filter" v-model="selectedInstitute" class="filter-select">
          <option value="">All Institutes</option>
          <option v-for="institute in allInstitutes" :key="institute.id" :value="institute.name_of_institution">
            {{ institute.name_of_institution }}
          </option>
        </select>
      </div>
    </div>

    <div v-if="loading" class="state-card">
      <p>🚀 Loading assignment matrix...</p>
    </div>
    <div v-else-if="error" class="state-card error-state">
      <h2>⚠️ An Error Occurred</h2>
      <p>{{ error }}</p>
      <button @click="fetchData" class="retry-button">Try Again</button>
    </div>

    <div v-else-if="Object.keys(groupedData).length > 0" class="groups-container">
      <div v-for="(institute, instituteName) in groupedData" :key="instituteName" class="institute-card">
        <div class="institute-header">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="header-icon">
            <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"></path>
            <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"></path>
            <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"></path>
            <path d="M10 6h4"></path>
            <path d="M10 10h4"></path>
            <path d="M10 14h4"></path>
            <path d="M10 18h4"></path>
          </svg>
          <h2>{{ instituteName }}</h2>
        </div>
        <div class="table-wrapper">
          <table class="assignments-table">
            <thead>
              <tr>
                <th class="whitespace-nowrap">Program / Module</th>
                <th class="whitespace-nowrap">Semester & Description</th>
                <th class="whitespace-nowrap">Year</th>
                <th class="whitespace-nowrap">Assigned Faculty</th>
                <th class="text-center">Students</th>
                <th class="remarks-header-cell">Dealing Officer Remarks</th>
              </tr>
            </thead>
            <tbody v-for="program in institute.programs" :key="program.name">
              <tr class="program-row" @click="toggleProgram(program.id)">
                <td :colspan="6">
                  <div class="program-cell-content">
                    <svg :class="['expand-icon', { 'is-expanded': program.isExpanded }]"
                      xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                      stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                    <span class="program-name">{{ program.name }}</span>
                    <span class="program-meta-badge">{{ program.modules.length }} Modules</span>
                  </div>
                </td>
              </tr>

              <template v-if="program.isExpanded">
                <tr v-for="module in program.modules" :key="module.id" class="module-row">
                  <td>
                    <div class="cell-content capitalize">
                      <div class="module-name">{{ module.name }}</div>
                    </div>
                  </td>
                  <td>
                    <div class="cell-content">
                      <div class="sub-text ">
                        Semester {{ module.semester }}
                      </div>
                      <div class="sub-text">
                        {{ module.semisterDescription || 'No description' }}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div class="cell-content">
                      {{ module.academicYear }}
                    </div>
                  </td>
                  <td>
                    <div class="faculty-pills-container">
                      <span v-for="faculty in module.faculties" :key="faculty.id"
                        :class="['faculty-pill', { 'primary': faculty.isPrimary }]">
                        <svg v-if="faculty.isPrimary" xmlns="http://www.w3.org/2000/svg" width="12" height="12"
                          viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"
                          stroke-linejoin="round">
                          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                          <circle cx="9" cy="7" r="4"></circle>
                          <polyline points="16 11 18 13 22 9"></polyline>
                        </svg>
                        {{ faculty.name }}
                      </span>
                    </div>
                  </td>
                  <td class="text-center">
                    <div class="student-count-cell">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                      <span>{{ module.studentCount }}</span>
                    </div>
                  </td>
                  <td class="remarks-cell">
                    <textarea v-model="module.remarks" placeholder="Add a remark..." class="remarks-input" rows="2"
                      :disabled="module.isSavingRemarks" @blur="saveRemark(module)"></textarea>
                    <span v-if="module.isSavingRemarks" class="saving-indicator">Saving...</span>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div v-else class="state-card">
      <h2>No Assignments Found</h2>
      <p>Your search returned no results, or no assignments have been created yet.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import apiServices from '@/services/services';
import { useToast } from 'vue-toastification';

const toast = useToast();

const rawAssignments = ref([]);
const allInstitutes = ref([]);
const loading = ref(true);
const error = ref(null);
const searchTerm = ref('');
const selectedInstitute = ref('');

const expandedPrograms = ref({});
const originalRemarks = new Map();

const fetchData = async () => {
  loading.value = true;
  error.value = null;
  try {
    const [assignmentsResponse, institutesResponse] = await Promise.all([
      apiServices.getMhpcFacultyAssignments(),
      apiServices.getMhpcInstitutes()
    ]);
    rawAssignments.value = assignmentsResponse.data.results || [];
    allInstitutes.value = institutesResponse.data.results || [];
  } catch (err) {
    console.error('Failed to fetch data:', err);
    error.value = 'Could not retrieve data. Please check your connection and try again.';
  } finally {
    loading.value = false;
  }
};

const groupedData = computed(() => {
  if (!rawAssignments.value) return {};

  let filteredAssignments = rawAssignments.value;

  if (selectedInstitute.value) {
    filteredAssignments = filteredAssignments.filter(item =>
      item.module?.semester?.program_offered?.institute?.name_of_institution === selectedInstitute.value
    );
  }
  if (searchTerm.value) {
    const lowerCaseSearch = searchTerm.value.toLowerCase();
    filteredAssignments = filteredAssignments.filter(item =>
      (item.module?.module_master?.module_name || '').toLowerCase().includes(lowerCaseSearch) ||
      (item.faculty?.faculty_name || '').toLowerCase().includes(lowerCaseSearch) ||
      (item.module?.semester?.program_offered?.program_master?.program_name || '').toLowerCase().includes(lowerCaseSearch)
    );
  }

  const nested = filteredAssignments.reduce((acc, assignment) => {
    const instituteName = assignment.module?.semester?.program_offered?.institute?.name_of_institution || 'Unknown Institute';
    const programName = assignment.module?.semester?.program_offered?.program_master?.program_name || 'Uncategorized Program';
    const programId = `${instituteName}-${programName}`;
    const moduleInfo = assignment.module;
    const facultyInfo = assignment.faculty;

    if (!moduleInfo || !facultyInfo) return acc;

    if (!acc[instituteName]) {
      acc[instituteName] = { name: instituteName, programs: {} };
    }
    if (!acc[instituteName].programs[programName]) {
      acc[instituteName].programs[programName] = {
        id: programId,
        name: programName,
        isExpanded: expandedPrograms.value[programId] ?? true,
        modules: {}
      };
    }

    if (!acc[instituteName].programs[programName].modules[moduleInfo.id]) {
      acc[instituteName].programs[programName].modules[moduleInfo.id] = {
        id: moduleInfo.id,
        name: moduleInfo.module_master?.module_name || 'N/A',
        code: moduleInfo.module_master?.module_code || 'N/A',
        semester: moduleInfo.semester?.semester_number || 'N/A',
        semisterDescription: moduleInfo.semester?.name || 'N/A',
        description: moduleInfo.module_master?.description || '',
        academicYear: moduleInfo.semester?.academic_year || 'N/A',
        studentCount: moduleInfo.student_count ?? 0,
        remarks: '',
        isSavingRemarks: false,
        faculties: [],
        assignmentIds: []
      };
    }

    const module = acc[instituteName].programs[programName].modules[moduleInfo.id];
    module.faculties.push({
      id: facultyInfo.id,
      name: facultyInfo.faculty_name,
      isPrimary: assignment.is_primary_instructor,
    });

    if (assignment.is_primary_instructor || !module.remarks) {
      module.remarks = assignment.remarks || '';
    }
    if (!originalRemarks.has(module.id)) {
      originalRemarks.set(module.id, module.remarks);
    }

    module.assignmentIds.push(assignment.id);

    return acc;
  }, {});

  for (const instituteName in nested) {
    const programsObject = nested[instituteName].programs;
    nested[instituteName].programs = Object.values(programsObject).sort((a, b) => a.name.localeCompare(b.name));

    nested[instituteName].programs.forEach(program => {
      const modulesObject = program.modules;
      program.modules = Object.values(modulesObject).sort((a, b) => a.name.localeCompare(b.name));
    });
  }

  return nested;
});

const toggleProgram = (programId) => {
  expandedPrograms.value[programId] = !expandedPrograms.value[programId];
};

const saveRemark = async (module) => {
  if (module.remarks === originalRemarks.get(module.id)) return;

  const assignmentIdToUpdate = module.assignmentIds[0];
  if (!assignmentIdToUpdate) {
    toast.error("Cannot save remark: No assignment ID found.", { timeout: 3000 });
    return;
  }

  module.isSavingRemarks = true;
  try {
    await apiServices.patchMhpcFacultyAssignment(assignmentIdToUpdate, { remarks: module.remarks });
    originalRemarks.set(module.id, module.remarks);
    toast.success(`Remark for "${module.name}" saved.`, { timeout: 2500 });
  } catch (err) {
    console.error('Failed to save remark:', err);
    toast.error('Could not save the remark. Changes have been reverted.');
    module.remarks = originalRemarks.get(module.id);
  } finally {
    module.isSavingRemarks = false;
  }
};

watch(selectedInstitute, () => {
  expandedPrograms.value = {};
});

onMounted(fetchData);
</script>


<style scoped>
/* --- BASE STYLES (Keep your well-defined variables) --- */
.assignments-display {
  --color-brand: #4338ca;
  --color-brand-light: #eef2ff;
  --color-text-primary: #1f2937;
  --color-text-secondary: #6b7280;
  --color-text-tertiary: #9ca3af;
  --color-surface: #ffffff;
  --color-background: #f9fafb;
  --color-border: #e5e7eb;
  --color-error: #be123c;
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --border-radius: 0.75rem;

  padding: 2rem;
  font-family: 'Inter', system-ui, sans-serif;
  background-color: var(--color-background);
  color: var(--color-text-primary);
}

.page-header {
  margin-bottom: 2rem;
}

.page-header h1 {
  font-size: 2rem;
  font-weight: 700;
}

.page-header p {
  color: var(--color-text-secondary);
  margin-top: 0.5rem;
  font-size: 1.1rem;
}

.controls-wrapper {
  margin-bottom: 2rem;
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.filter-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filter-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-secondary);
}

.filter-select {
  padding: 10px 14px;
  border-radius: 0.5rem;
  border: 1px solid var(--color-border);
  font-size: 1rem;
  background-color: var(--color-surface);
  min-width: 250px;
}

.search-input-container {
  position: relative;
  flex-grow: 1;
  /* Allow search to take more space */
}

.search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-tertiary);
}

.search-input {
  width: 100%;
  max-width: 450px;
  padding: 12px 16px 12px 44px;
  border-radius: 0.5rem;
  border: 1px solid var(--color-border);
  font-size: 1rem;
  transition: box-shadow 0.2s, border-color 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: var(--color-brand);
  box-shadow: 0 0 0 3px rgba(67, 56, 202, 0.2);
}

.groups-container {
  display: grid;
  gap: 2rem;
}

.institute-card {
  background-color: var(--color-surface);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-border);
  overflow: hidden;
}

.institute-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--color-border);
  background-color: var(--color-brand-light);
  color: var(--color-brand);
}

.institute-header h2 {
  font-size: 1.25rem;
  font-weight: 600;
}

.table-wrapper {
  overflow-x: auto;
}

.assignments-table {
  width: 100%;
  border-collapse: collapse;
}

.assignments-table th {
  background-color: #fcfcfd;
  font-weight: 500;
  font-size: 0.8rem;
  text-transform: uppercase;
  color: var(--color-text-secondary);
  letter-spacing: 0.05em;
  padding: 1rem 1.5rem;
  text-align: left;
}

.text-center {
  text-align: center;
}

/* --- NEW HIERARCHICAL TABLE STYLES --- */

.program-row {
  background-color: #f9fafb;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.program-row:hover {
  background-color: #f3f4f6;
}

.program-row td {
  font-weight: 600;
  border-bottom: 1px solid #e5e7eb;
}

.program-cell-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.5rem 0.5rem;
}

.program-name {
  color: var(--color-text-primary);
}

.expand-icon {
  color: var(--color-text-secondary);
  transition: transform 0.2s ease-in-out;
}

.expand-icon.is-expanded {
  transform: rotate(180deg);
}

.program-meta-badge {
  background-color: #e5e7eb;
  color: var(--color-text-secondary);
  font-size: 0.75rem;
  font-weight: 500;
  padding: 3px 8px;
  border-radius: 999px;
}

.module-row td {
  padding: 1rem 1.5rem;
  padding-left: 2rem;
  /* KEY: Indent module rows */
  border-bottom: 1px solid var(--color-border);
  background-color: #fff;
}

.module-row:last-child td {
  border-bottom: none;
}

.assignments-table tbody:not(:last-child) .module-row:last-child td {
  border-bottom: 1px solid var(--color-border);
  /* Add border between program groups */
}


.cell-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.module-name {
  font-weight: 500;
}

.sub-text {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
}

.faculty-pills-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.faculty-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  background-color: #f3f4f6;
  color: #374151;
  font-weight: 500;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 0.875rem;
  border: 1px solid #e5e7eb;
}

.faculty-pill.primary {
  background-color: #dcfce7;
  color: #166534;
  border-color: #a7f3d0;
}

.student-count-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 500;
  color: var(--color-text-secondary);
}

.remarks-header-cell {
  min-width: 280px;
}

.remarks-cell {
  vertical-align: top;
  position: relative;
  white-space: normal;
}

.remarks-input {
  width: 100%;
  border: 1px solid transparent;
  background-color: transparent;
  padding: 8px;
  border-radius: 6px;
  font-family: inherit;
  font-size: 0.95rem;
  resize: vertical;
  transition: all 0.2s ease-in-out;
  min-height: 50px;
}

.remarks-input:hover {
  background-color: #f9fafb;
}

.remarks-input:focus {
  outline: none;
  border-color: var(--color-brand);
  background-color: var(--color-surface);
  box-shadow: 0 0 0 2px rgba(67, 56, 202, 0.1);
}

.remarks-input:disabled {
  opacity: 0.7;
  cursor: wait;
}

.saving-indicator {
  position: absolute;
  bottom: 12px;
  right: 20px;
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  font-style: italic;
}

/* --- STATE CARDS (Loading, Error, Empty) --- */
.state-card {
  text-align: center;
  padding: 4rem 2rem;
  background-color: var(--color-surface);
  border-radius: var(--border-radius);
  border: 1px dashed var(--color-border);
  color: var(--color-text-secondary);
}

.state-card h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text-primary);
}

.state-card.error-state h2 {
  color: var(--color-error);
}

.retry-button {
  margin-top: 1rem;
  padding: 10px 20px;
  border: none;
  background-color: var(--color-brand);
  color: white;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 500;
}
</style>