import { request } from '@/service/request';

export interface ChatResponse {
  response: string;
}

export const chat = (query: string) => {
  return request<ChatResponse>({
    url: `${import.meta.env.VITE_PYTHON_SERVICE_BASE_URL}/chat`,
    method: 'POST',
    data: { query }
  });
};
