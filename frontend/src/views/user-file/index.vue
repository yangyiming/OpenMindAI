<script setup lang="ts">
import { computed, h, reactive, ref } from 'vue';
import moment from 'moment';
import type { UploadFileInfo } from 'naive-ui';
import { NButton, NInput, NModal, NUpload, useDialog, useMessage } from 'naive-ui';
import { usePagin } from '~/packages/hooks/src';
import { deleteDocument, fetchDocuments, uploadFile } from '@/service/api/document';

const { paginationReactive } = usePagin(updatePage);
const loading = ref(false);
const editType = ref<'add' | 'edit'>('add');
const showEdit = ref(false);
const editData = ref();

// 搜索表单
const searchModel = reactive({
  page: computed(() => {
    return {
      current_page: paginationReactive.page,
      page_size: paginationReactive.pageSize,
      total: 0
    };
  }),
  text: undefined
});

function handleSuccess() {
  showEdit.value = false;
  init();
}

const tableData = ref<Api.Document.List[]>([]);
const showContentModal = ref(false);
const previewContent = ref('');

function handlePreviewContent(content: string) {
  previewContent.value = content;
  showContentModal.value = true;
}

const createColumns = () => {
  return [
    {
      title: 'ID',
      key: 'id'
    },
    {
      title: '文件名',
      key: 'name'
    },
    {
      title: '大小',
      key: 'sizeStr'
    },
    {
      title: '进度',
      key: 'progress',
      render: (row: Api.Document.List) => {
        if (row.progress) {
          return `${row.progress}%`;
        }
      }
    },
    {
      title: '创建时间',
      key: 'createdAt',
      render(row: Api.Document.List) {
        return moment(row.createdAt).format('YYYY-MM-DD HH:mm:ss');
      }
    },
    {
      title: '更新时间',
      key: 'updatedAt',
      render(row: Api.Document.List) {
        return moment(row.updatedAt).format('YYYY-MM-DD HH:mm:ss');
      }
    },
    {
      title: '操作',
      key: 'actions',
      render: (row: Api.Document.List) => {
        const dialog = useDialog();
        const message = useMessage();

        const handleDelete = () => {
          dialog.warning({
            title: '删除确认',
            content: '确定要删除该文档吗？',
            positiveText: '确定',
            negativeText: '取消',
            onPositiveClick: async () => {
              try {
                loading.value = true;
                await deleteDocument(row.id as string);
                await init();
                loading.value = false;
                message.success('删除成功');
              } catch (error) {
                message.error('删除失败');
              }
            }
          });
        };

        return h('div', { class: 'flex gap-[8px]' }, [
          row.content &&
            h(
              NButton,
              {
                type: 'primary',
                size: 'small',
                onClick: () => handlePreviewContent(row.content || '')
              },
              { default: () => '查看内容' }
            ),
          h(
            NButton,
            {
              type: 'error',
              size: 'small',
              onClick: handleDelete
            },
            { default: () => '删除' }
          )
        ]);
      }
    }
  ];
};

const columns = createColumns();

// 初始化数据
async function init() {
  loading.value = true;
  const { data } = await fetchDocuments({ page: { current_page: 1, page_size: 100 } });
  tableData.value = data?.list || [];
  tableData.value.forEach(item => {
    item.sizeStr = formatFileSize(item.size as number);
  });
  loading.value = false;
}

function updatePage(option: { page: number; pageSize: number }) {
  searchModel.page.current_page = option.page;
  searchModel.page.page_size = option.pageSize;
  init();
}

function searchData() {
  paginationReactive.page = 1;
  paginationReactive.itemCount = 0;
  init();
}
function formatFileSize(bytes: number) {
  if (bytes === 0) {
    return '0 Bytes';
  }
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${Number.parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
}

async function handleUpload({ file }: { file: UploadFileInfo }) {
  const sizeStr = formatFileSize(file.file?.size as number);
  const fileItem = reactive({
    name: file.name,
    progress: 0,
    sizeStr,
    status: '上传中'
  });
  tableData.value.push(fileItem);

  try {
    await uploadFile({ file: file.file as File });
    fileItem.status = 'success';
  } catch (error) {
    fileItem.status = 'error';
  }
}
init();
</script>

<template>
  <NSpace vertical :size="16" :wrap-item="false">
    <NCard title="文件管理" :bordered="false" size="small" segmented content-class="flex flex-col" class="h-full">
      <div class="flex gap-[20px] pb-[10px]">
        <NFormItem class="min-w-[140px]" label="">
          <NInput v-model="searchModel.text" placeholder="文件名"></NInput>
        </NFormItem>
        <NFormItem>
          <NButton type="primary" @click="searchData">搜索</NButton>
        </NFormItem>
        <NFormItem>
          <NUpload :show-file-list="false" :custom-request="handleUpload">
            <NButton type="primary">上传</NButton>
          </NUpload>
        </NFormItem>
      </div>
      <NDataTable
        :columns="columns"
        :data="tableData"
        remote
        :pagination="paginationReactive"
        :loading="loading"
        class="flex-1"
        flex-height
      ></NDataTable>
    </NCard>
    <EditDialog v-model:show="showEdit" :type="editType" :data="editData" @success="handleSuccess"></EditDialog>
    <NModal v-model:show="showContentModal">
      <NCard style="width: 900px" title="文件内容预览" content-class="max-h-[600px] overflow-auto">
        <pre class="whitespace-pre-wrap">{{ previewContent }}</pre>
      </NCard>
    </NModal>
  </NSpace>
</template>

<style scoped></style>
