<template>
  <div class="layout">
    <NavBar />
    <div class="page">
      <NuxtLoadingIndicator color="#bb0a08" :height="3" />
      <slot />
    </div>
  </div>
</template>

<style scoped>
.layout {
  min-height: 100dvh;
  width: 100%;
}

.page {
  width: 100%;
  min-height: var(--hemo-page-min-height);
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
