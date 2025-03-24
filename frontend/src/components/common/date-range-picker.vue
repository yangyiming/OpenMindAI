<script setup lang="ts">
import moment from 'moment';

const props = defineProps<{
  modelValue: [number, number];
}>();

const emit = defineEmits(['update:modelValue', 'confirm']);

const disabledDate = (ts: number) => {
  const endDate = moment().endOf('day').valueOf();
  return ts > endDate;
};

function handleUpdateValue(value: [number, number]) {
  emit('update:modelValue', value);
}

function handleConfirm(value: number | [number, number]) {
  emit('confirm', value);
}
</script>

<template>
  <NDatePicker
    :value="props.modelValue"
    type="daterange"
    class="w-[300px]"
    :is-date-disabled="disabledDate"
    @update:value="handleUpdateValue"
    @confirm="handleConfirm"
  />
</template>
