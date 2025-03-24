<script lang="ts" setup>
import '@wangeditor/editor/dist/css/style.css'; // 引入 css
import { onBeforeUnmount, onMounted, shallowRef } from 'vue';
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
import type { IEditorConfig } from '@wangeditor/editor';
const content = defineModel('content', {
  type: String,
  default: ''
});

// 初始化 MENU_CONF 属性
const editorConfig: Partial<IEditorConfig> = {
  // TS 语法
  // const editorConfig = {                       // JS 语法
  MENU_CONF: {},
  placeholder: '请输入内容...'

  // 其他属性...
};
const mode = 'default'; // 或 'simple'
// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef();

// 内容 HTML

// 模拟 ajax 异步获取内容
onMounted(() => {});

const toolbarConfig = {};
if (editorConfig.MENU_CONF) {
  editorConfig.MENU_CONF.uploadImage = {
    server: '/api/upload-image',
    // form-data fieldName ，默认值 'wangeditor-uploaded-image'
    fieldName: 'your-custom-name',

    // 单个文件的最大体积限制，默认为 2M
    maxFileSize: 5 * 1024 * 1024, // 1M

    // 最多可上传几个文件，默认为 100
    maxNumberOfFiles: 10,

    // 选择文件时的类型限制，默认为 ['image/*'] 。如不想限制，则设置为 []
    allowedFileTypes: ['image/*'],

    // 自定义上传参数，例如传递验证的 token 等。参数会被添加到 formData 中，一起上传到服务端。
    meta: {
      token: 'xxx',
      otherKey: 'yyy'
    },

    // 将 meta 拼接到 url 参数中，默认 false
    metaWithUrl: false,

    // 自定义增加 http  header
    headers: {
      Accept: 'text/x-json',
      otherKey: 'xxx'
    },

    // 跨域是否传递 cookie ，默认为 false
    withCredentials: true,

    // 超时时间，默认为 10 秒
    timeout: 5 * 1000 // 5 秒
  };
}

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (!editor) return;
  editor.destroy();
});

const handleCreated = (editor: any) => {
  editorRef.value = editor; // 记录 editor 实例，重要！
};
</script>

<template>
  <div class="border-[#ccc]">
    <Toolbar class="border-[#ccc]" :editor="editorRef" :default-config="toolbarConfig" :mode="mode" />
    <Editor
      v-model="content"
      class="h-[500px]"
      :default-config="editorConfig"
      :mode="mode"
      @on-created="handleCreated"
    />
  </div>
</template>
