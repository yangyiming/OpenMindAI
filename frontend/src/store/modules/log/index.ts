import { defineStore } from 'pinia';
import { ref } from 'vue';
import { SetupStoreId } from '@/enum';
export const useLogStore = defineStore(SetupStoreId.Log, () => {
  const startTime = ref();
  const endTime = ref();
  const activePackageName = ref();
  const activeEventType = ref();
  const refresh = ref(0);
  const searchUserId = ref('');
  return {
    startTime,
    endTime,
    activePackageName,
    activeEventType,
    refresh,
    searchUserId
  };
});
