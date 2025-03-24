export type Response<T = unknown> = {
  /** 响应状态码 */
  code: string;
  /** 响应消息 */
  msg: string;
  /** 响应数据 */
  data: T;
};

export const successResponse = <T>(data: T, msg = 'success'): Response<T> => ({
  code: '0',
  msg,
  data
});

export const errorResponse = (msg: string, code = '1'): Response<null> => ({
  code,
  msg,
  data: null
});

export interface PageRequest {
  page: {
     /** 当前页码 */
    current_page?: number;
    /** 每页条数 */
    page_size?: number;
  }
}
