<script setup lang="ts">
import { ref } from 'vue';
import CardData from './card-data.vue';
const totalDate = ref();
function onConfirm(v: number | number[] | null) {}
</script>

<template>
  <NSpace vertical :size="16">
    <NDatePicker
      v-model:value="totalDate"
      update-value-on-close
      type="daterange"
      class="w-[300px]"
      :actions="['clear']"
      @confirm="onConfirm"
    />
    <CardData type="Android" />
    <CardData type="iOS" />
    <CardData type="all" />
  </NSpace>
</template>

<style scoped></style>
