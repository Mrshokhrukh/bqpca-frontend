<template>
    <div class="cpd-participant-container">
        <h1 class="form-title">Add CPD Task Participant</h1>

        <div class="form-card">
            <div class="form-grid">
                <div class="form-row">
                    <label for="cpdCreditsTemplate" class="form-label">CPD Credits Template <span
                            class="optional">(Optional)</span>:</label>
                    <div class="input-group">
                        <select id="cpdCreditsTemplate" v-model="formData.cpdCreditsTemplate" class="form-select"
                            @change="applyCreditsTemplate" aria-label="CPD Credits Template Options">
                            <option value="">Select template (optional)</option>
                            <option value="symposium">Symposium - 2 Credits</option>
                            <option value="workshop">Workshop - 3 Credits</option>
                            <option value="conference">Conference - 5 Credits</option>
                        </select>
                        <div class="action-buttons">
                            <button class="btn-icon btn-action" @click="editCpdCreditsTemplate" title="Edit Template">
                                <lucide-icon name="pencil" aria-hidden="true" />
                                <span class="sr-only">Edit Template</span>
                            </button>
                            <button class="btn-icon btn-action" @click="addCpdCreditsTemplate" title="Add New Template">
                                <lucide-icon name="plus" aria-hidden="true" />
                                <span class="sr-only">Add New Template</span>
                            </button>
                            <button class="btn-icon btn-action" @click="deleteCpdCreditsTemplate"
                                title="Delete Template">
                                <lucide-icon name="trash" aria-hidden="true" />
                                <span class="sr-only">Delete Template</span>
                            </button>
                            <button class="btn-icon btn-action" @click="viewCpdCreditsTemplate" title="View Template">
                                <lucide-icon name="eye" aria-hidden="true" />
                                <span class="sr-only">View Template</span>
                            </button>
                        </div>
                    </div>
                    <div class="form-text-hint">Choose a template for pre-filled CPD credits or enter manually below.
                    </div>
                </div>

                <div class="form-row">
                    <label for="cpdCredits" class="form-label">CPD Credits <span class="required">*</span>:</label>
                    <input type="number" id="cpdCredits" v-model.number="formData.cpdCredits" class="form-input"
                        placeholder="Enter CPD credits" aria-required="true" />
                    <div class="form-text-hint">Specify the CPD credits earned by the participant.</div>
                </div>

                <div class="form-row">
                    <label for="reviewStatus" class="form-label">Review Status <span class="required">*</span>:</label>
                    <select id="reviewStatus" v-model="formData.reviewStatus" class="form-select" aria-required="true"
                        aria-label="Review Status">
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                    </select>
                    <div class="form-text-hint">Current status of the review process.</div>
                </div>

                <div class="form-row">
                    <label for="reviewRemarks" class="form-label">Review Remarks <span
                            class="optional">(Optional)</span>:</label>
                    <textarea id="reviewRemarks" v-model="formData.reviewRemarks" rows="3" class="form-textarea"
                        placeholder="Add review remarks (if any)" aria-label="Review Remarks"></textarea>
                    <div class="form-text-hint">Any notes or comments from the reviewer.</div>
                </div>

                <div class="form-row">
                    <label for="endorsementDecision" class="form-label">Endorsement Decision <span
                            class="required">*</span>:</label>
                    <select id="endorsementDecision" v-model="formData.endorsementDecision" class="form-select"
                        aria-required="true" aria-label="Endorsement Decision">
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                    </select>
                    <div class="form-text-hint">Final decision on endorsement.</div>
                </div>

                <div class="form-row">
                    <label for="endorsementRemarks" class="form-label">Endorsement Remarks <span
                            class="optional">(Optional)</span>:</label>
                    <textarea id="endorsementRemarks" v-model="formData.endorsementRemarks" rows="3"
                        class="form-textarea" placeholder="Add endorsement remarks (if any)"
                        aria-label="Endorsement Remarks"></textarea>
                    <div class="form-text-hint">Additional notes regarding the endorsement decision.</div>
                </div>

                <div class="form-row">
                    <label for="cpdTask" class="form-label">CPD Task <span class="required">*</span>:</label>
                    <div class="input-group">
                        <select id="cpdTask" v-model="formData.cpdTask" class="form-select" aria-required="true"
                            aria-label="CPD Task">
                            <option v-for="task in cpdTasks" :key="task.id" :value="task.id">{{ task.title }}</option>
                        </select>
                        <div class="action-buttons">
                            <button class="btn-icon btn-action" @click="editTask" title="Edit CPD Task">
                                <lucide-icon name="pencil" aria-hidden="true" />
                                <span class="sr-only">Edit CPD Task</span>
                            </button>
                            <button class="btn-icon btn-action" @click="addTask" title="Add New CPD Task">
                                <lucide-icon name="plus" aria-hidden="true" />
                                <span class="sr-only">Add New CPD Task</span>
                            </button>
                            <button class="btn-icon btn-action" @click="viewTask" title="View CPD Task">
                                <lucide-icon name="eye" aria-hidden="true" />
                                <span class="sr-only">View CPD Task</span>
                            </button>
                        </div>
                    </div>
                    <div class="form-text-hint">Select the CPD task this participant is associated with.</div>
                </div>

                <div class="form-row">
                    <label for="participantRegNo" class="form-label">Participant Reg No <span
                            class="required">*</span>:</label>
                    <div class="input-group">
                        <select id="participantRegNo" v-model="formData.participantRegNo" class="form-select"
                            aria-required="true" aria-label="Participant Registration Number">
                            <option v-for="participant in participants" :key="participant.id"
                                :value="participant.reg_no">
                                {{ participant.full_name }} - {{ participant.reg_no }}
                            </option>
                        </select>
                        <div class="action-buttons">
                            <button class="btn-icon btn-action" @click="editParticipant" title="Edit Participant">
                                <lucide-icon name="pencil" aria-hidden="true" />
                                <span class="sr-only">Edit Participant</span>
                            </button>
                            <button class="btn-icon btn-action" @click="addParticipant" title="Add New Participant">
                                <lucide-icon name="plus" aria-hidden="true" />
                                <span class="sr-only">Add New Participant</span>
                            </button>
                            <button class="btn-icon btn-action" @click="viewParticipant"
                                title="View Participant Details">
                                <lucide-icon name="eye" aria-hidden="true" />
                                <span class="sr-only">View Participant Details</span>
                            </button>
                        </div>
                    </div>
                    <div class="form-text-hint">Choose the participant from the registered list.</div>
                </div>
            </div>


            <div class="form-actions">
                <button @click="submitForm" class="btn-primary">Submit</button>
                <button @click="resetForm" class="btn-secondary">Reset</button>
            </div>

            <div v-if="message" :class="['message', messageType]">
                {{ message }}
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import { useRouter } from 'vue-router';
import apiService from '@/services/services'; // Assuming path is correct
import { LucideIcon } from "lucide-vue-next"; // Import LucidIcon

const router = useRouter();
const cpdTasks = ref([]);
const participants = ref([]);
const message = ref('');
const messageType = ref('');

const formData = reactive({
    cpdCreditsTemplate: '',
    cpdCredits: 0,
    reviewStatus: 'pending',
    reviewRemarks: '',
    endorsementDecision: 'pending',
    endorsementRemarks: '',
    cpdTask: '',
    participantRegNo: ''
});

// Fetch CPD tasks and participants on component mount
onMounted(async () => {
    await fetchData();
});

const fetchData = async () => {
    try {
        const tasksResponse = await apiService.getBmhcCpdTasks();
        cpdTasks.value = tasksResponse.data;

        const participantsResponse = await apiService.getBmhcCounsellors(); // Assuming counsellors are participants
        participants.value = participantsResponse.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        showMessage('Failed to load data. Please try again.', 'error');
    }
};

// Apply CPD credits template
const applyCreditsTemplate = () => {
    switch (formData.cpdCreditsTemplate) {
        case 'symposium':
            formData.cpdCredits = 2;
            break;
        case 'workshop':
            formData.cpdCredits = 3;
            break;
        case 'conference':
            formData.cpdCredits = 5;
            break;
        default:
            formData.cpdCredits = 0;
            break;
    }
};


// Form submission
const submitForm = async () => {
    try {
        // Validate form
        if (!validateForm()) {
            return;
        }

        // Prepare data for API
        const participantData = {
            cpd_credits: formData.cpdCredits,
            review_status: formData.reviewStatus,
            review_remarks: formData.reviewRemarks,
            endorsement_decision: formData.endorsementDecision,
            endorsement_remarks: formData.endorsementRemarks,
            cpd_task: formData.cpdTask,
            participant_reg_no: formData.participantRegNo
        };

        // Submit to API
        await apiService.createBmhcCpdTaskParticipant(participantData);

        showMessage('Participant added successfully!', 'success');
        resetForm();
        await fetchData(); // Refresh data after successful submission, if needed for lists.
    } catch (error) {
        console.error('Error submitting form:', error);
        showMessage('Failed to add participant. Please try again.', 'error');
    }
};

// Form validation
const validateForm = () => {
    if (!formData.cpdCredits) {
        showMessage('Please enter CPD credits', 'error');
        return false;
    }

    if (!formData.cpdTask) {
        showMessage('Please select a CPD task', 'error');
        return false;
    }

    if (!formData.participantRegNo) {
        showMessage('Please select a participant', 'error');
        return false;
    }

    return true;
};

// Reset form to default values
const resetForm = () => {
    formData.cpdCreditsTemplate = '';
    formData.cpdCredits = 0;
    formData.reviewStatus = 'pending';
    formData.reviewRemarks = '';
    formData.endorsementDecision = 'pending';
    formData.endorsementRemarks = '';
    formData.cpdTask = '';
    formData.participantRegNo = '';
};

// Display message to user
const showMessage = (text, type) => {
    message.value = text;
    messageType.value = type;

    // Clear message after 3 seconds
    setTimeout(() => {
        message.value = '';
    }, 3000);
};

// Template actions handlers -  Placeholders, implement actual logic as needed
const editCpdCreditsTemplate = () => {
    alert('Edit CPD Credits Template functionality to be implemented'); // Placeholder
};

const addCpdCreditsTemplate = () => {
    alert('Add CPD Credits Template functionality to be implemented'); // Placeholder
};

const deleteCpdCreditsTemplate = () => {
    alert('Delete CPD Credits Template functionality to be implemented'); // Placeholder
};

const viewCpdCreditsTemplate = () => {
    alert('View CPD Credits Template functionality to be implemented'); // Placeholder
};

const editTask = () => {
    if (formData.cpdTask) {
        router.push(`/cpd-tasks/edit/${formData.cpdTask}`);
    } else {
        showMessage('Please select a task first', 'error');
    }
};

const addTask = () => {
    router.push('/cpd-tasks/new');
};

const viewTask = () => {
    if (formData.cpdTask) {
        router.push(`/cpd-tasks/view/${formData.cpdTask}`);
    } else {
        showMessage('Please select a task first', 'error');
    }
};

const editParticipant = () => {
    if (formData.participantRegNo) {
        router.push(`/participants/edit/${formData.participantRegNo}`);
    } else {
        showMessage('Please select a participant first', 'error');
    }
};

const addParticipant = () => {
    router.push('/participants/new');
};

const viewParticipant = () => {
    if (formData.participantRegNo) {
        router.push(`/participants/view/${formData.participantRegNo}`);
    } else {
        showMessage('Please select a participant first', 'error');
    }
};
</script>

<style scoped>
/* General layout and container */
.cpd-participant-container {
    max-width: 900px;
    margin: 30px auto;
    /* Increased top/bottom margin */
    padding: 30px;
    font-family: 'Roboto', sans-serif;
    /* Professional and readable font */
    color: #333;
}

.form-card {
    background-color: #fff;
    border-radius: 12px;
    /* More rounded corners */
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
    /* Softer, more modern shadow */
    padding: 30px;
}

.form-title {
    font-size: 2.2rem;
    /* Slightly larger title */
    color: #2d3748;
    /* Darker, professional title color */
    margin-bottom: 35px;
    /* Increased bottom margin */
    text-align: center;
    font-weight: 600;
    /* Semi-bold title */
}

.form-grid {
    display: grid;
    gap: 25px;
    /* Increased gap between form rows */
}

.form-row {
    display: flex;
    flex-direction: column;
    gap: 10px;
    /* Increased gap between label and input */
    padding-bottom: 18px;
    /* Increased padding */
    margin-bottom: 18px;
    /* Increased margin */
    border-bottom: 1px solid #e2e8f0;
    /* Lighter border color */
}

.form-row:last-child {
    border-bottom: none;
    margin-bottom: 0;
    padding-bottom: 0;
}

.form-label {
    font-weight: 500;
    /* Medium font weight for labels */
    color: #4a5568;
    /* Slightly muted label color */
    margin-bottom: 5px;
    display: block;
    font-size: 1rem;
    /* Slightly larger label font */
}

.optional {
    font-style: italic;
    color: #718096;
    /* Muted color for optional text */
    margin-left: 5px;
}

.required {
    color: #e53e3e;
    /* Subtle red for required fields */
    margin-left: 2px;
    font-weight: bold;
    font-size: 1.1em;
    vertical-align: super;
    position: relative;
    top: -0.2em;
}


.form-input,
.form-select,
.form-textarea {
    padding: 14px 16px;
    /* Increased padding in inputs */
    border: 1px solid #cbd5e0;
    /* Lighter border color */
    border-radius: 8px;
    /* Slightly more rounded inputs */
    font-size: 1rem;
    color: #333;
    background-color: #fff;
    transition: border-color 0.2s ease;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
    border-color: #63b3ed;
    /* Focus border color */
    outline: none;
    box-shadow: 0 0 0 2px rgba(99, 179, 237, 0.2);
    /* Softer focus shadow */
}

.form-textarea {
    resize: vertical;
    min-height: 120px;
    /* Slightly taller textarea */
}

.input-group {
    display: flex;
    align-items: center;
    gap: 12px;
    /* Increased gap in input group */
}

.input-group .form-select {
    flex-grow: 1;
}

.action-buttons {
    display: flex;
    gap: 10px;
}

.btn-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    /* Slightly larger buttons */
    height: 40px;
    /* border: 1px solid #cbd5e0; Removed border */
    border-radius: 8px;
    cursor: pointer;
    color: #4a5568;
    /* Icon color */
    background-color: transparent;
    /* Make background transparent */
    transition: background-color 0.2s ease, color 0.2s ease;
}

.btn-icon:hover,
.btn-icon:focus {
    background-color: rgba(0, 0, 0, 0.04);
    /* Very subtle hover background */
    color: #2d3748;
    /* Darker icon color on hover */
}


.btn-icon i,
.btn-icon lucide-icon {
    font-size: 1.1rem;
    /* Icon size */
    vertical-align: middle;
}


.form-actions {
    margin-top: 35px;
    /* Increased margin */
    display: flex;
    justify-content: flex-end;
    gap: 15px;
}

.btn-primary,
.btn-secondary {
    padding: 14px 30px;
    /* Increased button padding */
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    font-size: 1.1rem;
    /* Slightly larger button text */
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
    /* Subtle button shadow */
}

.btn-primary {
    background-color: #43a047;
    /* Primary green */
    color: white;
}

.btn-secondary {
    background-color: #f8f9fa;
    /* Light gray secondary button */
    color: #4a5568;
    border: 1px solid #cbd5e0;
}

.btn-primary:hover,
.btn-primary:focus {
    background-color: #388e3c;
    /* Darker green on hover */
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    /* Slightly stronger shadow on hover */
}

.btn-secondary:hover,
.btn-secondary:focus {
    background-color: #e9ecef;
    /* Slightly darker secondary hover */
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}


.message {
    margin-top: 25px;
    /* Increased margin */
    padding: 18px;
    /* Increased padding */
    border-radius: 8px;
    text-align: center;
    font-weight: 500;
}

.success {
    background-color: #e6f7e8;
    color: #3ab759;
    border: 1px solid #b7e1c1;
}

.error {
    background-color: #fceeee;
    color: #e74c3c;
    border: 1px solid #f5c6cb;
}

.form-text-hint {
    color: #718096;
    /* Muted hint text color */
    font-size: 0.9rem;
    margin-top: 3px;
}


/* Accessibility helper class */
.sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
}


/* Responsive adjustments */
@media (max-width: 768px) {
    .cpd-participant-container {
        margin: 20px auto;
        padding: 20px;
    }

    .form-card {
        padding: 20px;
    }

    .form-title {
        font-size: 1.8rem;
        margin-bottom: 25px;
    }

    .form-grid {
        gap: 20px;
    }

    .form-row {
        gap: 8px;
        padding-bottom: 15px;
        margin-bottom: 15px;
    }

    .form-label {
        font-size: 0.95rem;
        margin-bottom: 3px;
    }

    .form-input,
    .form-select,
    .form-textarea {
        padding: 12px 14px;
        font-size: 0.95rem;
    }

    .form-textarea {
        min-height: 100px;
    }

    .input-group {
        gap: 8px;
    }

    .action-buttons {
        gap: 5px;
    }

    .btn-icon {
        width: 36px;
        height: 36px;
        font-size: 1rem;
    }

    .btn-primary,
    .btn-secondary {
        padding: 12px 25px;
        font-size: 1rem;
    }

    .message {
        margin-top: 20px;
        padding: 15px;
        font-size: 0.9rem;
    }

    .form-text-hint {
        font-size: 0.85rem;
    }
}
</style>