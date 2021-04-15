<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-50 p-4 lg:p-8">
    <div class="max-w-[1600px] mx-auto">
      <h1 class="text-3xl font-bold text-slate-900 mb-6 font-serif">Rating Category Management</h1>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Left Column - Add/Edit Form -->
        <div class="bg-white rounded-lg shadow-sm border border-slate-200 p-6 h-fit sticky top-8">
          <h2 class="text-xl font-semibold text-slate-900 mb-4">
            {{ isEditing ? 'Edit Rating Category' : 'Add New Rating Category' }}
          </h2>
          <form @submit.prevent="handleSubmit">
            <div class="space-y-4">
              <div>
                <label for="ratingCategoryName" class="block text-sm font-medium text-slate-700"
                  >Rating Category Name</label
                >
                <input
                  type="text"
                  id="ratingCategoryName"
                  v-model="formData.rating_category_name"
                  class="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter rating category name"
                  required
                />
              </div>
              <div>
                <label for="validity" class="block text-sm font-medium text-slate-700"
                  >Validity (Years)</label
                >
                <input
                  type="number"
                  id="validity"
                  v-model="formData.validity"
                  class="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter validity period"
                  required
                />
              </div>
              <div class="flex gap-3">
                <button
                  type="submit"
                  class="flex-1 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {{ isEditing ? 'Update Rating' : 'Add Rating' }}
                </button>
                <button
                  v-if="isEditing"
                  type="button"
                  @click="cancelEdit"
                  class="py-2 px-4 bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>

        <!-- Right Column - Rating Categories List -->
        <div class="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
          <div class="mb-6 space-y-4">
            <div class="flex justify-between items-center">
              <h2 class="text-xl font-semibold text-slate-900">Rating Categories</h2>
              <span class="text-sm text-slate-500">
                {{ filteredRatings.length }} Rating{{ filteredRatings.length !== 1 ? 's' : '' }}
              </span>
            </div>
          </div>

          <div class="space-y-4 mb-6">
            <TransitionGroup name="list">
              <div
                v-for="rating in paginatedRatings"
                :key="rating.id"
                class="p-4 border border-slate-200 rounded-lg hover:border-blue-200 hover:bg-blue-50/30 transition-colors duration-200"
              >
                <div class="flex justify-between items-start gap-4">
                  <div>
                    <h3 class="font-medium text-slate-900">{{ rating.rating_category_name }}</h3>
                    <p class="text-sm text-slate-600 mt-1">Validity: {{ rating.validity }} years</p>
                  </div>
                  <div class="flex gap-2">
                    <button
                      @click="startEdit(rating)"
                      class="p-2 text-blue-600 hover:bg-blue-50 rounded-md"
                    >
                      Edit
                    </button>
                    <button
                      @click="deleteRating(rating.id)"
                      class="p-2 text-red-600 hover:bg-red-50 rounded-md"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </TransitionGroup>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import services from '@/services/services'

const ratings = ref([])
const formData = ref({ id: null, rating_category_name: '', validity: '' })
const isEditing = ref(false)
const currentPage = ref(1)
const itemsPerPage = 5

// Fetch ratings on mount
const fetchRatings = async () => {
  try {
    const response = await services.getMastersRatingCategories()
    ratings.value = response.data.results
  } catch (error) {
    console.error('Error fetching ratings:', error)
  }
}

onMounted(() => {
  fetchRatings()
})

const handleSubmit = async () => {
  try {
    if (isEditing.value) {
      await services.updateMastersRatingCategory(formData.value.id, formData.value)
    } else {
      await services.createMastersRatingCategory(formData.value)
    }
    fetchRatings()
    resetForm()
  } catch (error) {
    console.error('Error saving rating category:', error)
  }
}

const resetForm = () => {
  formData.value = { id: null, rating_category_name: '', validity: '' }
  isEditing.value = false
}

const startEdit = (rating) => {
  formData.value = { ...rating }
  isEditing.value = true
}

const cancelEdit = () => {
  resetForm()
}

const deleteRating = async (id) => {
  try {
    await services.deleteMastersRatingCategory(id)
    fetchRatings()
  } catch (error) {
    console.error('Error deleting rating category:', error)
  }
}

const filteredRatings = computed(() => ratings.value)
const totalPages = computed(() => Math.ceil(filteredRatings.value.length / itemsPerPage))
const paginatedRatings = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredRatings.value.slice(start, start + itemsPerPage)
})
</script>
