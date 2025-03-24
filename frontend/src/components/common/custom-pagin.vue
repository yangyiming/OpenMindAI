<script setup lang="ts">
import { computed, ref } from 'vue';

const page = ref(1);
const pageSize = ref(30);
const total = defineModel<number>('total', { required: true });
const pageCount = computed(() => {
  return Math.ceil(total.value / pageSize.value);
});

const emit = defineEmits<{
  (e: 'updatePage', option: { page: number; pageSize: number }): void;
}>();

const updatePage = () => {
  emit('updatePage', { page: page.value, pageSize: pageSize.value });
};
</script>

<template>
  <NPagination
    v-model:page="page"
    v-model:pageSize="pageSize"
    size="large"
    show-quick-jumper
    show-size-picker
    :page-count="pageCount"
    :page-sizes="[30, 100]"
    class="flex justify-center py-[10px]"
    @update:page="updatePage"
    @update:page-size="updatePage"
  />
</template>
