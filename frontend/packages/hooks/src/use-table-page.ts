import { reactive } from 'vue';

type PageFunc = (option: { page: number; pageSize: number }) => void;
export default function useBoolean(updatePage: PageFunc) {
  const paginationReactive = reactive({
    page: 1,
    pageSize: 50,
    showSizePicker: true,
    itemCount: 30,
    pageSizes: [10, 50, 100, 200],
    onChange: (page: number) => {
      paginationReactive.page = page;
      updatePage({ page, pageSize: paginationReactive.pageSize });
    },
    onUpdatePageSize: (pageSize: number) => {
      paginationReactive.page = 1;
      paginationReactive.pageSize = pageSize;
      updatePage({ page: paginationReactive.page, pageSize });
    }
  });

  return {
    paginationReactive
  };
}
