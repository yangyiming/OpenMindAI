import type { ComponentPublicInstance } from 'vue';
import { reactive } from 'vue';
import type { FormInst } from 'naive-ui';

export default function useIdRef(initValue = 1) {
  // 必填语言
  type refItem = Element | ComponentPublicInstance | null | FormInst;
  const refMap: Record<string, refItem> = reactive({});
  const setRefMap = (el: refItem, id: any) => {
    if (el) {
      refMap[id] = el;
    }
  };

  return {
    refMap,
    setRefMap
  };
}
