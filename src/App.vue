<script setup lang="ts">
</script>

<template>
  <body>
    <main>
      <RouterView />
    </main>
  </body>
</template>

<style scoped>
body {
  display: flex;
  flex-direction: column;
  width:100%;
  align-items: center;
  justify-content: center;
}
main {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
