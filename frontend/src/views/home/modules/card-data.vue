<script setup lang="ts">
import { computed } from 'vue';
import { createReusableTemplate } from '@vueuse/core';
const props = defineProps<{
  type: 'Android' | 'iOS' | 'all';
}>();

defineOptions({
  name: 'CardData'
});

interface CardData {
  key: string;
  title: string;
  value: number;
  unit: string;
  color: {
    start: string;
    end: string;
  };
}

const title = computed(() => {
  if (props.type === 'all') {
    return '全部';
  }
  return props.type;
});

const cardData = computed<CardData[]>(() => [
  {
    key: 'visitCount',
    title: '累计安装数',
    value: 9725,
    unit: '',
    color: {
      start: '#719de3',
      end: '#719de3'
    }
  },
  {
    key: 'turnover',
    title: '活跃设备数',
    value: 1026,
    unit: '$',
    color: {
      start: '#719de3',
      end: '#719de3'
    }
  },
  {
    key: 'downloadCount',
    title: '订阅用户',
    value: 970925,
    unit: '',
    color: {
      start: '#719de3',
      end: '#719de3'
    }
  },
  {
    key: 'dealCount',
    title: '订单数',
    value: 9527,
    unit: '',
    color: {
      start: '#719de3',
      end: '#719de3'
    }
  },
  {
    key: 'dealCount',
    title: '退款订单数',
    value: 9527,
    unit: '',
    color: {
      start: '#719de3',
      end: '#719de3'
    }
  },
  {
    key: 'dealCount',
    title: '存云盘用户数',
    value: 9527,
    unit: '',
    color: {
      start: '#719de3',
      end: '#719de3'
    }
  }
]);

interface GradientBgProps {
  gradientColor: string;
}

const [DefineGradientBg, GradientBg] = createReusableTemplate<GradientBgProps>();

function getGradientColor(color: CardData['color']) {
  return `linear-gradient(to bottom right, ${color.start}, ${color.end})`;
}
</script>

<template>
  <div class="flex items-center gap-[10px]">
    <div class="bold w-[100px] text-right text-[24px]">{{ title }}:</div>
    <NCard :bordered="false" size="small" class="card-wrapper">
      <!-- define component start: GradientBg -->
      <DefineGradientBg v-slot="{ $slots, gradientColor }">
        <div class="rd-8px px-16px pb-4px pt-8px text-white" :style="{ backgroundImage: gradientColor }">
          <component :is="$slots.default" />
        </div>
      </DefineGradientBg>
      <!-- define component end: GradientBg -->
      <NGrid cols="s:6 m:6 l:6" responsive="screen" :x-gap="16" :y-gap="16">
        <NGi v-for="item in cardData" :key="item.key">
          <GradientBg :gradient-color="getGradientColor(item.color)" class="flex-1">
            <h3 class="text-16px">{{ item.title }}</h3>
            <div class="flex justify-between pt-12px">
              <span class="text-32px"></span>
              <CountTo
                :prefix="item.unit"
                :start-value="1"
                :end-value="item.value"
                class="text-30px text-white dark:text-dark"
              />
            </div>
          </GradientBg>
        </NGi>
      </NGrid>
    </NCard>
  </div>
</template>

<style scoped></style>
