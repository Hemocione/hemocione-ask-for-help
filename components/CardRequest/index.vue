<template>
  <div class="card">
    <div class="card-content">
      <div class="card-header">
        <!-- Name -->
        <h4 class="card-requester-name">Rafael Sangue Forte</h4>
        <!-- Local -->
        <p class="card-requester-local">Hemorio</p>
      </div>
      <div class="card-body">
        <!-- Blood Type -->
        <p>Tipo Sanguíneo</p>
      </div>
    </div>
    <div class="card-image">
      <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6pTNgFMam7sm-NMkeVDieflex5poRhb8HgA&s" width="80" height="80"/>
    </div>
  </div>
</template>

<script lang="ts"></script>

<style scoped>
.card {
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  gap: 1rem;
  width: 100%;
  height: 7.5rem;
  padding: 1rem;
  border-radius: 12px;
  border: 1px solid black;
}

.card-image {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
}
</style>
