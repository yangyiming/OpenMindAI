<script lang="ts" setup>
defineProps<{ title: string; closable?: boolean }>();
interface Emits {
  (e: 'close'): void;
}

const emit = defineEmits<Emits>();

function handleClose() {
  emit('close');
}
</script>

<template>
  <div class="h-full flex flex-col">
    <NCard
      class="h-full flex flex-col"
      :title="title"
      :bordered="false"
      size="small"
      segmented
      :closable="closable"
      @close="handleClose"
    >
      <template #header-extra>
        <slot name="header-extra"></slot>
      </template>
      <div class="h-full flex flex-col flex-1">
        <slot></slot>
      </div>
    </NCard>
  </div>
</template>

<style lang="scss" scoped>
.n-card {
  height: 100%;
  overflow: auto;
}
</style>
