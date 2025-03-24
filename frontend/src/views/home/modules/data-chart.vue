<script setup lang="ts">
import { ref } from 'vue';
import moment from 'moment';
import LineChart from './line-chart.vue';
const deviceTypes = ref([
  {
    label: 'Android',
    value: 'Android'
  },
  {
    label: 'iOS',
    value: 'iOS'
  },
  {
    label: '全部',
    value: 'all'
  }
]);
const curDevice = ref('');

function onConfirm(v: number | number[] | null) {}

// 计算最近7天的开始时间（当前时间往前推7天）
const startOfLast7Days = moment().subtract(6, 'days').startOf('day'); // 包含今天，所以减去6天
const endOfLast7Days = moment().endOf('day'); // 当前日期的结束时间
const totalDate = ref<[number, number]>([startOfLast7Days.valueOf(), endOfLast7Days.valueOf()]);
</script>

<template>
  <NSpace vertical :size="16">
    <NRadioGroup v-model:value="curDevice" name="deviceGroup">
      <NRadioButton v-for="item in deviceTypes" :key="item.value" :value="item.value" :label="item.label" />
    </NRadioGroup>
    <NDatePicker
      v-model:value="totalDate"
      update-value-on-close
      type="daterange"
      class="w-[300px]"
      :actions="['clear']"
      @confirm="onConfirm"
    />
    <LineChart />
  </NSpace>
</template>

<style scoped></style>
