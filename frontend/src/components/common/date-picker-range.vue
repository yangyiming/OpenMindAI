<script lang="ts" setup>
import moment from 'moment';
import { ref, watch } from 'vue';

const date = defineModel<{ create_start_time: number | undefined; create_end_time: number | undefined } | any>('date');
const dateRange = ref();

watch(dateRange, () => {
  if (date.value) {
    if (dateRange.value && dateRange.value.length > 0) {
      date.value.create_start_time = moment(dateRange.value[0]).unix();
      date.value.create_end_time = moment(dateRange.value[1]).add(1, 'd').unix();
    } else {
      date.value.create_start_time = undefined;
      date.value.create_end_time = undefined;
    }
  }
});
</script>

<template>
  <NDatePicker v-model:value="dateRange" type="daterange" clearable class="w-[260px]"></NDatePicker>
</template>
