<template lang="pug">
main.h-screen.w-screen.flex.flex-col
  Header
  router-view
</template>
<script setup lang="ts">
import Header from '../components/header/index.vue';
</script>
