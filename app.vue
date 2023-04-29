<template>
  <NuxtLayout>
    some page content
    <slot />
  </NuxtLayout>
</template>

<script lang="ts">
export default {
  data: () => ({
    drawer: null,
  }),
};
</script>