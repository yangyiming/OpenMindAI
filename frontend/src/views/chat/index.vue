<script lang="ts" setup>
import { ref } from 'vue';
import { NButton, NCard, NInput, NScrollbar, NTag } from 'naive-ui';
import { chat } from '@/service/api/chat';

interface Message {
  role: string;
  content: string;
}

const inputText = ref('');
const messages = ref<Message[]>([]);

const handleSend = async () => {
  if (!inputText.value.trim()) return;

  const userMessage = {
    role: 'user',
    content: inputText.value
  };
  messages.value.push(userMessage);

  try {
    const response = await chat(inputText.value);
    if (response?.data) {
      messages.value.push({
        role: 'assistant',
        content: response.data.response
      });
    } else {
      throw new Error('Empty response');
    }
  } catch (error) {
    messages.value.push({
      role: 'assistant',
      content: '请求失败，请稍后重试'
    });
  }

  inputText.value = '';
};
</script>

<template>
  <NCard class="chat-container">
    <div class="h-[100%] flex flex-col">
      <NScrollbar class="message-list flex-1">
        <div v-for="(msg, index) in messages" :key="index" class="message-item" :class="{ user: msg.role === 'user' }">
          <NTag :type="msg.role === 'user' ? 'primary' : 'success'">
            {{ msg.role === 'user' ? '你' : 'AI' }}
          </NTag>
          <div class="message-content">{{ msg.content }}</div>
        </div>
      </NScrollbar>

      <div class="input-area">
        <NInput
          v-model:value="inputText"
          type="textarea"
          placeholder="输入消息..."
          :autosize="{ minRows: 2, maxRows: 5 }"
          @keydown.enter="handleSend"
        />
        <NButton type="primary" size="large" @click="handleSend">发送</NButton>
      </div>
    </div>
  </NCard>
</template>

<style scoped>
.chat-container {
  width: 100%;
  max-width: 800px;
  height: 90vh;
  margin: 20px auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.message-list {
  flex: 1;
  padding: 12px;
  overflow-y: auto;
  background-color: #f5f5f5;
  border-radius: 8px;
}

.message-item {
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.message-item.user {
  align-items: flex-end;
}

.message-item .message-content {
  max-width: 80%;
  padding: 12px 16px;
  border-radius: 12px;
  background-color: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.message-item.user .message-content {
  background-color: #409eff;
  color: #fff;
}

.input-area {
  display: flex;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid #eee;
  align-items: center;
}

.input-area .n-input {
  flex: 1;
}

@media (max-width: 768px) {
  .chat-container {
    height: 100vh;
    margin: 0;
    border-radius: 0;
  }

  .message-item .message-content {
    max-width: 90%;
  }
}
</style>
