<template>
    <div class="main-container">
        <!-- search bar and filter button -->
        <div class="search-bar">
            <input type="text" placeholder="Pesquisar" />
            <button class="filter-button">Filtrar</button>
        </div>
        <!-- Card requests paginated list -->
        <div class="card-list">
            <CardRequest v-for="i in [1,2,3]"/>
        </div>
        <!-- footer button pedir ajuda -->
        <div class="footer">
            <button class="help-button">Pedir ajuda</button>
        </div>
    </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.main-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    width: 100vw;
    /* background-color: red; */
}
</style>