<template>
  <div class="layout">
    <div class="page">
      <NuxtLoadingIndicator color="#bb0a08" :height="3" />
      <slot/>
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
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--black-0)
}
</style>
