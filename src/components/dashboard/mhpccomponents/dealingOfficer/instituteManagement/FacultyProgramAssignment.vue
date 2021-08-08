<template>
  <div class="assignments-display">
    <header class="page-header">
      <h1>Faculty Assignment Matrix</h1>
      <p>An interactive matrix of all faculty assignments, grouped by institution.</p>
    </header>

    <div class="controls-wrapper">
      <div class="search-input-container">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="search-icon"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        <input type="text" v-model="searchTerm" placeholder="Search modules, faculty, programs..." class="search-input"/>
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
                </th>
                <th @click="sortBy('program')" class="sortable">
                  <span>Program</span>
                </th>
                <th @click="sortBy('facultyName')" class="sortable">
                  <span>Faculty</span>
                </th>
                <th @click="sortBy('studentCount')" class="sortable text-center">
                  <span>Students</span>
                </th>
                <!-- REMARKS HEADER -->
                <th class="remarks-header-cell">Dealing Officer Remarks</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in group.assignments" :key="item.id">
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
                <!-- REMARKS CELL WITH EDITABLE TEXTAREA -->
                <td class="remarks-cell">
                  <textarea
                    v-model="item.remarks"
                    placeholder="Add a remark..."
                    class="remarks-input"
                    rows="2"
                    :disabled="item.isSavingRemarks"
                    @blur="saveRemark(item)"
                  ></textarea>
                  <span v-if="item.isSavingRemarks" class="saving-indicator">Saving...</span>
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
import apiServices from '@/services/services';
import { useToast } from 'vue-toastification';

const toast = useToast();

const rawAssignments = ref([]);
const allInstitutes = ref([]);
const loading = ref(true);
const error = ref(null);
const searchTerm = ref('');
const selectedInstitute = ref('');
const sortKey = ref('facultyName');
const sortOrder = ref('asc');

// This map stores the original remark for each assignment to check if it has changed
const originalRemarks = new Map();

const fetchData = async () => {
  loading.value = true;
  error.value = null;
  try {
    // Note: Removed programsResponse as it's no longer needed for group remarks
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

const processedAssignments = computed(() => {
  if (!rawAssignments.value) return [];

  let flattened = rawAssignments.value.map(item => {
    const processedItem = {
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
      // Add the remarks field and a state for the saving indicator
      remarks: item.remarks || '',
      isSavingRemarks: false,
    };

    // Store the initial remark value to check for changes later
    if (!originalRemarks.has(processedItem.id)) {
      originalRemarks.set(processedItem.id, processedItem.remarks);
    }

    return processedItem;
  });

  // Filter logic
  if (selectedInstitute.value) {
    flattened = flattened.filter(item => item.institute === selectedInstitute.value);
  }
  if (searchTerm.value) {
    const lowerCaseSearch = searchTerm.value.toLowerCase();
    flattened = flattened.filter(item =>
      item.moduleName.toLowerCase().includes(lowerCaseSearch) ||
      item.facultyName.toLowerCase().includes(lowerCaseSearch) ||
      item.program.toLowerCase().includes(lowerCaseSearch)
    );
  }

  // Sort logic
  flattened.sort((a, b) => {
    let valA = a[sortKey.value];
    let valB = b[sortKey.value];
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
  return processedAssignments.value.reduce((acc, item) => {
    const groupName = item.institute;
    if (!acc[groupName]) {
      acc[groupName] = { assignments: [] };
    }
    acc[groupName].assignments.push(item);
    return acc;
  }, {});
});

const sortBy = (key) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortKey.value = key;
    sortOrder.value = 'asc';
  }
};

/**
 * Saves the remark for an individual faculty assignment.
 * Triggered on blur from the textarea.
 */
const saveRemark = async (item) => {
  // Only save if the remark has actually changed
  if (item.remarks === originalRemarks.get(item.id)) {
    return;
  }

  item.isSavingRemarks = true;
  try {
    // This API service function must be created to PATCH a single assignment
    await apiServices.patchMhpcFacultyAssignment(item.id, { remarks: item.remarks });

    // Update the 'original' value so we don't re-save unnecessarily
    originalRemarks.set(item.id, item.remarks);

    toast.success(`Remark for "${item.moduleName}" saved.`, { timeout: 2500 });
  } catch (err) {
    console.error('Failed to save remark:', err);
    toast.error('Could not save the remark. Changes have been reverted.');
    // Revert to original value on error to keep UI consistent with backend
    item.remarks = originalRemarks.get(item.id);
  } finally {
    item.isSavingRemarks = false;
  }
};

onMounted(fetchData);
</script>

<style scoped>
/* Paste your existing styles here, then add the new styles below */
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
.filter-select:focus {
  outline: none;
  border-color: var(--color-brand);
  box-shadow: 0 0 0 3px rgba(67, 56, 202, 0.2);
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
}
.institute-header .header-icon {
  color: var(--color-brand);
}
.institute-header h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-brand);
}

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
.assignments-table tbody tr:last-child td {
  border-bottom: none;
}
.assignments-table tbody tr {
  transition: background-color 0.15s ease-in-out;
}
.assignments-table tbody tr:hover {
  background-color: #f7f7f8;
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
.sub-text-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.primary-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  background-color: #dcfce7;
  color: #166534;
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
  min-width: 2ch;
  text-align: left;
}
.text-center {
  text-align: center;
}

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

/* --- NEW STYLES FOR IN-ROW REMARKS --- */
.remarks-header-cell {
  min-width: 250px;
  text-align: left;
}

.remarks-cell {
  vertical-align: top;
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
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
  border-color: var(--color-border);
  background-color: var(--color-surface);
}

.remarks-input:focus {
  outline: none;
  border-color: var(--color-brand);
  background-color: var(--color-surface);
  box-shadow: 0 0 0 3px rgba(67, 56, 202, 0.1);
}

.remarks-input:disabled {
  opacity: 0.7;
  cursor: wait;
  background-color: #f7f7f8;
}

.saving-indicator {
  position: absolute;
  bottom: 12px;
  right: 20px;
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  font-style: italic;
  pointer-events: none; /* Make sure it doesn't interfere with clicks */
}
</style>