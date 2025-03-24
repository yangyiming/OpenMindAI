<script setup lang="ts">
const props = defineProps<{
  message?: string;
}>();
const emit = defineEmits<{
  (e: 'confirm'): void;
  (e: 'cancel'): void;
}>();
const handlePositiveClick = () => {
  emit('confirm');
};
const handleNegativeClick = () => {
  emit('cancel');
};
const errorMes = props.message || ' 确认要删除吗？';
</script>

<template>
  <NPopconfirm @positive-click="handlePositiveClick" @negative-click="handleNegativeClick">
    <template #trigger>
      <NButton size="small" type="error">删除</NButton>
    </template>
    {{ errorMes }}
  </NPopconfirm>
</template>
