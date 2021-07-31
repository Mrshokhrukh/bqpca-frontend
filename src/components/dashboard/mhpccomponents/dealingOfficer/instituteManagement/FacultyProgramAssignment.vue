<template>
  <div class="assignments-display">
    <header class="page-header">
      <h1>Faculty Assignment Matrix</h1>
      <p>An interactive matrix of faculty assignments, grouped by institution.</p>
    </header>

    <div class="controls-wrapper">
      <div class="search-input-container">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="search-icon"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        <input type="text" v-model="searchTerm" placeholder="Search modules, faculty, programs..." class="search-input"/>
      </div>
    </div>

    <div v-if="loading" class="state-card">
      <p>🚀 Loading assignment matrix...</p>
    </div>

    <div v-else-if="error" class="state-card error-state">
      <h2>⚠️ An Error Occurred</h2>
      <p>{{ error }}</p>
      <button @click="fetchAssignments" class="retry-button">Try Again</button>
    </div>

    <div v-else-if="Object.keys(groupedAssignments).length > 0" class="groups-container">
      <div v-for="(group, instituteName) in groupedAssignments" :key="instituteName" class="institute-card">
        <div class="institute-header">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="header-icon"><path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"></path><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"></path><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"></path><path d="M10 6h4"></path><path d="M10 10h4"></path><path d="M10 14h4"></path><path d="M10 18h4"></path></svg>
          <h2>{{ instituteName }}</h2>
        </div>
        <div class="table-wrapper">
          <table class="assignments-table">
            <thead>
              <tr>
                <th @click="sortBy('moduleName')" class="sortable">
                  <span>Module</span>
                  <span class="sort-icon-container">
                    <svg v-if="sortKey !== 'moduleName'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7 15 5 5 5-5"/><path d="m7 9 5-5 5 5"/></svg>
                    <svg v-if="sortKey === 'moduleName' && sortOrder === 'asc'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                    <svg v-if="sortKey === 'moduleName' && sortOrder === 'desc'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
                  </span>
                </th>
                <th @click="sortBy('program')" class="sortable">
                  <span>Program</span>
                   <span class="sort-icon-container">
                    <svg v-if="sortKey !== 'program'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7 15 5 5 5-5"/><path d="m7 9 5-5 5 5"/></svg>
                    <svg v-if="sortKey === 'program' && sortOrder === 'asc'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                    <svg v-if="sortKey === 'program' && sortOrder === 'desc'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
                  </span>
                </th>
                <th @click="sortBy('facultyName')" class="sortable">
                  <span>Faculty</span>
                   <span class="sort-icon-container">
                    <svg v-if="sortKey !== 'facultyName'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7 15 5 5 5-5"/><path d="m7 9 5-5 5 5"/></svg>
                    <svg v-if="sortKey === 'facultyName' && sortOrder === 'asc'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                    <svg v-if="sortKey === 'facultyName' && sortOrder === 'desc'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
                  </span>
                </th>
                <th @click="sortBy('studentCount')" class="sortable text-center">
                  <span>Students</span>
                   <span class="sort-icon-container">
                    <svg v-if="sortKey !== 'studentCount'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7 15 5 5 5-5"/><path d="m7 9 5-5 5 5"/></svg>
                    <svg v-if="sortKey === 'studentCount' && sortOrder === 'asc'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                    <svg v-if="sortKey === 'studentCount' && sortOrder === 'desc'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg>
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in group" :key="item.id">
                <td>
                  <div class="cell-content">
                    <div class="module-name">{{ item.moduleName }}</div>
                    <div class="sub-text">{{ item.moduleCode }}</div>
                  </div>
                </td>
                <td>
                  <div class="cell-content">
                    <div>{{ item.program }}</div>
                    <div class="sub-text">Semester {{ item.semester }}</div>
                  </div>
                </td>
                <td>
                  <div class="cell-content">
                    <div>{{ item.facultyName }}</div>
                    <div class="sub-text-group">
                      <span class="sub-text">{{ item.facultyDesignation }}</span>
                      <span v-if="item.isPrimary" class="primary-badge">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><polyline points="16 11 18 13 22 9"></polyline></svg>
                        Primary
                      </span>
                    </div>
                  </div>
                </td>
                <td class="text-center">
                  <div class="student-count-cell">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                    <span>{{ item.studentCount }}</span>
                  </div>
                </td>
              </tr>
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
import { ref, onMounted, computed } from 'vue';
// Ensure this path is correct for your project
import apiServices from '@/services/services';

// --- STATE MANAGEMENT ---
const rawAssignments = ref([]);
const loading = ref(true);
const error = ref(null);
const searchTerm = ref('');
const sortKey = ref('facultyName'); // Default sort key
const sortOrder = ref('asc'); // Default sort order

// --- DATA FETCHING ---
const fetchAssignments = async () => {
  loading.value = true;
  error.value = null;
  try {
    const response = await apiServices.getMhpcFacultyAssignments();
    rawAssignments.value = response.data.results;
  } catch (err) {
    console.error('Failed to fetch assignments:', err);
    error.value = 'Could not retrieve assignment data. Please check your connection and try again.';
  } finally {
    loading.value = false;
  }
};

// --- DATA TRANSFORMATION & COMPUTED PROPERTIES ---
const processedAssignments = computed(() => {
  if (!rawAssignments.value) return [];

  // 1. Flatten Data
  let flattened = rawAssignments.value.map(item => ({
    id: item.id,
    institute: item.module?.semester?.program_offered?.institute?.name_of_institution || 'Unknown Institute',
    program: item.module?.semester?.program_offered?.program_master?.program_name || 'N/A',
    semester: item.module?.semester?.semester_number || 'N/A',
    moduleName: item.module?.module_master?.module_name || 'N/A',
    moduleCode: item.module?.module_master?.module_code || 'N/A',
    facultyName: item.faculty?.faculty_name || 'Unassigned',
    facultyDesignation: item.faculty?.designation || 'N/A',
    isPrimary: item.is_primary_instructor,
    studentCount: item.module?.student_count ?? 0,
  }));

  // 2. Filter by Search Term
  if (searchTerm.value) {
    const lowerCaseSearch = searchTerm.value.toLowerCase();
    flattened = flattened.filter(item =>
      item.moduleName.toLowerCase().includes(lowerCaseSearch) ||
      item.facultyName.toLowerCase().includes(lowerCaseSearch) ||
      item.program.toLowerCase().includes(lowerCaseSearch)
    );
  }
  
  // 3. Sort the data
  flattened.sort((a, b) => {
    let valA = a[sortKey.value];
    let valB = b[sortKey.value];
    
    // Handle numeric vs string sorting
    if (typeof valA === 'string') {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
    }
    
    let result = 0;
    if (valA < valB) result = -1;
    else if (valA > valB) result = 1;
    
    return sortOrder.value === 'asc' ? result : -result;
  });

  return flattened;
});

const groupedAssignments = computed(() => {
  return processedAssignments.value.reduce((groups, item) => {
    const groupName = item.institute;
    if (!groups[groupName]) {
      groups[groupName] = [];
    }
    groups[groupName].push(item);
    return groups;
  }, {});
});

// --- METHODS ---
const sortBy = (key) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortKey.value = key;
    sortOrder.value = 'asc';
  }
};

// --- LIFECYCLE HOOK ---
onMounted(fetchAssignments);
</script>

<style scoped>
/* --- THEME & FONT --- */
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

/* --- HEADER --- */
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

/* --- CONTROLS --- */
.controls-wrapper {
  margin-bottom: 2rem;
}
.search-input-container {
  position: relative;
}
.search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-tertiary);
  pointer-events: none;
}
.search-input {
  width: 100%;
  max-width: 450px;
  padding: 12px 16px 12px 44px;
  border-radius: 0.5rem;
  border: 1px solid var(--color-border);
  font-size: 1rem;
  transition: box-shadow 0.2s, border-color 0.2s;
  background-color: var(--color-surface);
}
.search-input:focus {
  outline: none;
  border-color: var(--color-brand);
  box-shadow: 0 0 0 3px rgba(67, 56, 202, 0.2);
}

/* --- GROUPING & CARDS --- */
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
}
.institute-header .header-icon {
  color: var(--color-brand);
}
.institute-header h2 {
  font-size: 1.25rem;
  font-weight: 600;
}

/* --- TABLE --- */
.table-wrapper {
  overflow-x: auto;
}
.assignments-table {
  width: 100%;
  border-collapse: collapse;
}
.assignments-table th, .assignments-table td {
  padding: 1rem 1.5rem;
  text-align: left;
  border-bottom: 1px solid var(--color-border);
  white-space: nowrap;
}
.assignments-table th {
  background-color: #fcfcfd;
  font-weight: 500;
  font-size: 0.8rem;
  text-transform: uppercase;
  color: var(--color-text-secondary);
  letter-spacing: 0.05em;
}
.assignments-table th.sortable {
  cursor: pointer;
  transition: background-color 0.2s;
}
.assignments-table th.sortable:hover {
  background-color: var(--color-background);
}
.assignments-table th.sortable > span {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}
.sort-icon-container {
  color: var(--color-text-tertiary);
}
.assignments-table th.sortable:hover .sort-icon-container {
  color: var(--color-text-secondary);
}
.sort-icon-container svg {
  transition: transform 0.2s;
}
.assignments-table th.sortable:hover .sort-icon-container svg {
  transform: scale(1.1);
}
.assignments-table tbody tr:last-child td {
  border-bottom: none;
}
.assignments-table tbody tr {
  transition: background-color 0.15s ease-in-out;
}
.assignments-table tbody tr:hover {
  background-color: var(--color-brand-light);
}

/* --- CELL STYLES --- */
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
.sub-text-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.primary-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  background-color: var(--color-brand-light);
  color: var(--color-brand);
  font-weight: 500;
  padding: 3px 8px;
  border-radius: 999px;
  font-size: 0.75rem;
}
.student-count-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 500;
  font-size: 1rem;
  color: var(--color-text-secondary);
}
.student-count-cell span {
  min-width: 2ch; /* Ensures alignment */
  text-align: left;
}
.text-center {
  text-align: center;
}

/* --- STATE CARDS --- */
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
  transition: background-color 0.2s;
}
.retry-button:hover {
  background-color: #3730a3;
}
</style>