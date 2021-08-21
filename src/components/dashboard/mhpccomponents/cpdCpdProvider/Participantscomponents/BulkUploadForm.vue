<template>
  <div class="space-y-8">
    <div class="bg-slate-100/80 rounded-xl p-5 border border-slate-200">
      <h3 class="font-semibold text-slate-800 flex items-center mb-3 text-lg">
        <InformationCircleIcon class="h-6 w-6 mr-2.5 text-slate-500" />
        Bulk Upload Instructions
      </h3>
      <div class="pl-[42px] text-slate-600 space-y-2 text-sm">
        <p>
          <!-- MODIFIED: Simplified Instructions -->
          Upload a CSV file containing participant registration numbers. All participants in the
          file will be automatically marked as approved for the selected CPD task.
        </p>
        <ul class="list-disc list-inside space-y-1 pt-1">
          <li>
            The file must include a header row with one column:
            <code class="bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded text-xs font-mono"
              >participant_reg_no</code
            >
          </li>
          <!-- REMOVED: Optional status columns are no longer mentioned -->
        </ul>
        <div class="pt-2">
          <a
            href="#"
            @click.prevent="downloadTemplate"
            class="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors inline-flex items-center"
          >
            <ArrowDownTrayIcon class="h-4 w-4 mr-1.5" />
            Download CSV Template
          </a>
        </div>
      </div>
    </div>

    <!-- The rest of your template remains the same -->
    <div class="bg-white rounded-2xl shadow-xl border border-gray-100/80">
      <div class="p-6 md:p-8">
        <h2 class="text-xl font-bold text-gray-800 pb-4 border-b border-gray-200 mb-6">
          Upload Participants CSV
        </h2>

        <!-- ... form fields ... -->

      </div>

      <!-- ... form actions ... -->
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import {
  ArrowUpTrayIcon,
  ChevronDownIcon,
  DocumentCheckIcon,
  TrashIcon,
  InformationCircleIcon,
  ArrowDownTrayIcon,
} from '@heroicons/vue/24/outline'
import FormActions from './FormActions.vue'
import apiServices from '@/services/services'
import { useToast } from 'vue-toastification'

const toast = useToast()

// ... props, emits, and other reactive state remain the same ...

function downloadTemplate() {
  try {
    // --- MODIFIED: Simplified CSV Content ---
    const csvContent = [
      '# Participants in this file will be automatically approved for the selected CPD task.',
      'participant_reg_no',
      'MM/Orth-000005',
      'MM/Orth-000006',
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'participant_bulk_upload_template.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    toast.success('CSV template downloaded successfully.')
  } catch (err) {
    console.error('Error downloading CSV template:', err)
    toast.error('Failed to download CSV template. Please try again.')
  }
}

// ... The rest of your script setup remains exactly the same ...
</script>