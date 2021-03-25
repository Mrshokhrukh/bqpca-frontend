<template>
  <div class="space-y-6">
    <div class="bg-blue-50 rounded-lg p-4 border border-blue-200 mb-6">
      <h3 class="font-medium text-blue-700 flex items-center mb-2">
        <InformationCircleIcon class="h-5 w-5 mr-2" />
        Attendance Photo Upload
      </h3>
      <p class="text-sm text-blue-600">
        Upload photos as evidence of attendance for CPD task participants. You can upload a single photo
        that will be attached to the selected CPD task.
      </p>
    </div>

    <div class="bg-gray-50 rounded-lg p-5 border border-gray-200 hover:shadow-sm transition">
      <h2 class="text-lg font-semibold text-gray-700 pb-3 border-b border-gray-200 mb-4">Upload Attendance Photo</h2>

      <div class="space-y-6">
        <div>
          <label for="photoCpdTask" class="block text-sm font-medium text-gray-700 mb-2">
            CPD Task <span class="text-red-500">*</span>
          </label>
          <div class="relative">
            <select id="photoCpdTask" v-model="formData.cpdTask"
              class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none pr-10"
              aria-required="true" aria-label="CPD Task">
              <option value="">Select a CPD task</option>
              <option v-for="task in cpdTasks" :key="task.id" :value="task.id">{{ task.title }}</option>
            </select>
            <MagnifyingGlassIcon class="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
          </div>
          <p class="mt-1 text-sm text-gray-500">Select the CPD task this photo is associated with</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Attendance Photo <span class="text-red-500">*</span>
          </label>
          <div
            class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg"
            :class="{ 'border-blue-300 bg-blue-50': photoFile }"
          >
            <div class="space-y-1 text-center">
              <div v-if="photoPreview" class="mx-auto h-48 w-auto mb-3">
                <img :src="photoPreview" alt="Attendance preview" class="h-full mx-auto object-cover rounded-lg" />
              </div>
              <CameraIcon
                v-else
                class="mx-auto h-12 w-12 text-gray-400"
                :class="{ 'text-blue-500': photoFile }"
              />
              <div class="flex text-sm text-gray-600">
                <label for="photo-upload"
                  class="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                  <span v-if="!photoFile">Upload attendance photo</span>
                  <span v-else>{{ photoFile.name }}</span>
                  <input id="photo-upload" name="photo-upload" type="file" class="sr-only"
                    accept="image/*" @change="handlePhotoUpload" />
                </label>
                <p v-if="!photoFile" class="pl-1">or drag and drop</p>
              </div>
              <p class="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
            </div>
          </div>
          <div v-if="photoFile" class="mt-2 flex justify-end">
            <button @click="removePhoto" class="text-sm text-red-500 hover:text-red-700 flex items-center">
              <TrashIcon class="h-4 w-4 mr-1" />
              Remove
            </button>
          </div>
        </div>

        <div>
          <label for="photoDescription" class="block text-sm font-medium text-gray-700 mb-2">
            Photo Description <span class="text-gray-500 text-xs italic">(Optional)</span>
          </label>
          <textarea id="photoDescription" v-model="formData.description" rows="3"
            class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 outline-none"
            placeholder="Add a description for this photo (e.g., 'Group photo of Workshop participants, March 12, 2025')"
            aria-label="Photo Description"></textarea>
          <p class="mt-1 text-sm text-gray-500">Provide context or details about this attendance photo</p>
        </div>
      </div>
    </div>

    <!-- Form Actions -->
    <FormActions
      submitLabel="Upload Photo"
      :disabled="!isFormValid"
      @submit="submitForm"
      @reset="resetForm"
      @cancel="$emit('cancel')"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue';
import { MagnifyingGlassIcon, CameraIcon, TrashIcon, InformationCircleIcon } from '@heroicons/vue/24/outline';
import FormActions from './FormActions.vue';

defineProps({
  cpdTasks: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['submit', 'cancel']);

const formData = reactive({
  cpdTask: '',
  description: ''
});

const photoFile = ref(null);
const photoPreview = ref('');

const isFormValid = computed(() => {
  return formData.cpdTask && photoFile.value;
});

function handlePhotoUpload(event) {
  const file = event.target.files[0];
  if (file && file.type.startsWith('image/')) {
    photoFile.value = file;

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      photoPreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
  } else {
    alert('Please upload a valid image file.');
    event.target.value = '';
  }
}

function removePhoto() {
  photoFile.value = null;
  photoPreview.value = '';
}

function submitForm() {
  if (!isFormValid.value) return;

  emit('submit', {
    cpdTask: formData.cpdTask,
    photo: photoFile.value,
    description: formData.description
  });
}

function resetForm() {
  formData.cpdTask = '';
  formData.description = '';
  removePhoto();
}
</script>