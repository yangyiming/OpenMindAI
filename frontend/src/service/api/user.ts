import { request } from '../request';

export interface UserOption {
  /** 客户端类型 */
  client_type?: number;
  /** 国家ID */
  country_id?: number;
  /** 结束时间(秒时间戳) */
  create_end_time?: number;
  /** 开始时间(秒时间戳) */
  create_start_time?: number;
  /** 用户ID */
  user_id?: string;
  /** 语言 */
  language?: string;
  /** 分页信息 */
  page: Api.Page;
  /** 用户状态 */
  status?: number;
  device_udid?: string;
}

/**
 * 用户列表
 *
 * @param data
 * @returns
 */
export function fetchUserList(data: UserOption) {
  return request<Api.Request.ListData<Api.User.UserInfo>>({
    url: '/user/list',
    method: 'post',
    data
  });
}

/**
 * 导出用户列表
 *
 * @param data
 * @returns
 */
export function exportUserList(data: UserOption) {
  return request<Blob>({
    url: '/user/list_export',
    method: 'post',
    responseType: 'blob' as any,
    data
  });
}

/**
 * 禁用设备
 *
 * @param data
 * @returns
 */
export function disableUser(data: { user_id: number }) {
  return request<Blob>({
    url: '/user/disable',
    method: 'post',
    data
  });
}

/**
 * 启用设备
 *
 * @param data
 * @returns
 */
export function enableUser(data: { user_id: number }) {
  return request<Blob>({
    url: '/user/enable',
    method: 'post',
    data
  });
}

/**
 * 用户详情
 *
 * @param data
 * @returns
 */
export function userDetail(data: { id: number }) {
  return request<Api.User.UserInfo>({
    url: '/user/detail',
    method: 'post',
    data
  });
}

export type UserLogOption = {
  /** 设备号 (设备管理入口传该值) */
  device_udid?: string;
  /** 分页信息 */
  page: Api.Page;
  /** 搜索月份 格式:202411 */
  select_month?: string;
  /** 自定义排序 */
  sort?: Sort;
  /** 用户ID (用户管理入口传该值) */
  user_id?: string;
};

type Sort = {
  /** 排序字段名 允许字段: id */
  field: string;
  /** 排序方式 正序:asc 倒序:desc */
  type: string;
};
export function userEventLog(data: UserLogOption) {
  return request<Api.Request.ListData<Api.User.UserLog>>({
    url: '/user/event_log_list',
    method: 'post',
    data
  });
}

/**
 * 变更用户风控类型
 *
 * @param data
 * @returns
 */
export function userChangeRiskType(data: { user_id: number; risk_type: number }) {
  return request({
    url: '/user/change_risk_type',
    method: 'post',
    data
  });
}
