<template>
  <div class="ecpf-linkages">
    <h2 class="section-title">ECPF Linkages</h2>
    <div class="linkages-container">
      <div class="linkage-item" v-for="(linkage, index) in linkages" :key="index">
        <div class="linkage-header">
          <span class="linkage-title">{{ linkage.title }}</span>
          <span class="linkage-status" :class="linkage.status">{{ linkage.status }}</span>
        </div>
        <div class="linkage-content">
          <p>{{ linkage.description }}</p>
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
          title: 'Linkage 1',
          description: 'Description of linkage 1',
          status: 'active'
        },
        {
          title: 'Linkage 2',
          description: 'Description of linkage 2',
          status: 'pending'
        }
      ]
    }
  }
}
</script>

<style scoped>
.ecpf-linkages {
  padding: 20px;
}

.section-title {
  font-size: 1.5rem;
  margin-bottom: 20px;
}

.linkages-container {
  display: grid;
  gap: 20px;
}

.linkage-item {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
}

.linkage-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.linkage-title {
  font-weight: bold;
}

.linkage-status {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.9rem;
}

.linkage-status.active {
  background-color: #4caf50;
  color: white;
}

.linkage-status.pending {
  background-color: #ffc107;
  color: black;
}
</style>