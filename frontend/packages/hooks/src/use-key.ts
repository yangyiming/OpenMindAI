import { ref } from 'vue';

/**
 * Boolean
 *
 * @param initValue Init value
 */
export default function useKey(initValue = 1) {
  const key = ref(initValue);

  function setKey() {
    key.value += 1;
  }

  return {
    key,
    setKey
  };
}
