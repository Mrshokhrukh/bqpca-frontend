<template>
  <div class="linkages-container">
    <h2 class="section-title">Linkages</h2>
    
    <div class="linkages-grid">
      <!-- Linkage Items -->
      <div v-for="(linkage, index) in linkages" :key="index" class="linkage-item">
        <div class="linkage-card">
          <h3>{{ linkage.title }}</h3>
          <p>{{ linkage.description }}</p>
          <div class="linkage-actions">
            <button @click="viewDetails(linkage)" class="btn-view">View Details</button>
            <button @click="editLinkage(linkage)" class="btn-edit">Edit</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ECPFLinkages',
  data() {
    return {
      linkages: [
        {
          title: 'Sample Linkage 1',
          description: 'Description for linkage 1',
          id: 1
        },
        {
          title: 'Sample Linkage 2',
          description: 'Description for linkage 2',
          id: 2
        }
      ]
    }
  },
  methods: {
    viewDetails(linkage) {
      console.log('Viewing details for:', linkage)
      // Add your view logic here
    },
    editLinkage(linkage) {
      console.log('Editing linkage:', linkage)
      // Add your edit logic here
    }
  }
}
</script>

<style scoped>
.linkages-container {
  padding: 20px;
}

.section-title {
  color: #333;
  margin-bottom: 20px;
}

.linkages-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.linkage-card {
  background-color: #fff;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.linkage-actions {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.btn-view, .btn-edit {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-view {
  background-color: #4CAF50;
  color: white;
}

.btn-edit {
  background-color: #2196F3;
  color: white;
}
</style>