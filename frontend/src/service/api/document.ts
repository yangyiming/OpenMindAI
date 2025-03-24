import { request } from '../request';
export function uploadFile(param: Record<string, any>) {
  const data = new FormData();
  for (const x in param) {
    data.append(x, param[x]);
  }
  return request<{ url: string; path: string }>({ url: `/api/documents/upload`, method: 'post', data });
}

/**
 * 获取文档
 *
 * @param id
 * @returns
 */
export function fetchDocuments(data: { page: Api.Page }) {
  return request<App.Service.ResponsePage<Api.Document.List>>({
    url: `/api/documents/pages`,
    method: 'post',
    data
  });
}

/**
 * 删除文档
 *
 * @param id
 * @returns
 */
export function deleteDocument(id: string) {
  return request({
    url: `/api/documents/${id}`,
    method: 'delete'
  });
}
