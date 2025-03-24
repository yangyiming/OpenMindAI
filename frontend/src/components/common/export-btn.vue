<script lang="ts" setup>
import { cloneDeep } from 'lodash-es';
import { ref } from 'vue';

const props = defineProps<{
  data: any;
  func: (option: any) => Promise<any>;
  noDate?: boolean;
}>();
const searchModel = props.data;
const exportLoading = ref<boolean>(false);
function exportDataCsv() {
  if (!props.noDate) {
    // 判断用户是否有选择时间
    if (searchModel.create_start_time) {
      if (typeof searchModel.create_start_time == 'undefined' && typeof searchModel.create_end_time == 'undefined') {
        window.$message?.error('请选择时间范围');
        return;
      } else if (searchModel.create_start_time && searchModel.create_end_time) {
        // 时间范围不能超过3个月
        // 将3个月转换为毫秒（1个月约等于30天，这里用3个月90天来计算）
        const threeMonthsInMilliseconds = 90 * 24 * 60 * 60;
        if (searchModel.create_end_time - searchModel.create_start_time >= threeMonthsInMilliseconds) {
          window.$message?.error('时间范围不能超过3个月');
          return;
        }
      }
    } else {
      window.$message?.error('请选择时间范围,最多不能超过3个月');
      return;
    }
  }

  exportLoading.value = true;
  const cloneOption = cloneDeep(searchModel);
  delete cloneOption.page;
  props
    .func(searchModel)
    .then(response => {
      if (response.data) {
        const filename = response.data.filename;
        // 将响应的Blob对象转换为文件
        const file = new File([response.data], filename, { type: 'application/octet-stream' });
        // 可以选择下载文件
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(file);
        downloadLink.download = filename; // 设置下载文件名
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      }
    })
    .finally(() => {
      exportLoading.value = false;
    });
}
</script>

<template>
  <NButton type="primary" :loading="exportLoading" @click="exportDataCsv">导出</NButton>
</template>
