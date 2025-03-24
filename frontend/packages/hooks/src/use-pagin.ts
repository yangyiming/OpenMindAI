import { reactive } from 'vue';

type PageSize = {
  page: number;
  pageSize: number;
};
export default function usePagin(pageApi: (option: PageSize) => void) {
  const updatePage = (option: PageSize) => {
    pageApi(option);
  };
  const paginationReactive = reactive({
    page: 1,
    pageSize: 30,
    showSizePicker: true,
    itemCount: 0,
    pageSizes: [30, 50, 100],
    onUpdatePage: (page: number) => {
      paginationReactive.page = page;
      updatePage({ page: paginationReactive.page, pageSize: paginationReactive.pageSize });
    },
    onUpdatePageSize: (pageSize: number) => {
      paginationReactive.pageSize = pageSize;
      paginationReactive.page = 1;
      updatePage({ page: paginationReactive.page, pageSize: paginationReactive.pageSize });
    }
  });

  return {
    paginationReactive
  };
}
