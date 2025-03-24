interface AnyObject {
  [key: string]: any;
}

type FiledsMap = Record<string, string>;

// interface AxiosInstance {
//   <T extends (...args: any[]) => any>(api: T): (...args: Parameters<T>) => ReturnType<T>;
// }

export function random(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * [链式取值]
 *
 * @param {Function} fn [于函数中返回的取值对象]
 * @param {any} defaultValue [可选默认返回值]
 * @returns {[type] | undefined} return description
 */
export function getValue(fn: () => any, defaultValue?: any) {
  try {
    const result = fn();
    const nullish = [null, undefined];

    if (!result && nullish.includes(result)) throw new Error(`get fn() error: ${result}`);

    return result;
  } catch (error) {
    // console.warn('get value error:', error)
    return defaultValue;
  }
}

/**
 * 链式访问器
 *
 * @param {Any} result [访问对象]
 * @param {String} path [访问链地址，例：'data.pageInfo.list.0']
 * @returns {Any}
 */
export function chainAccess(result: AnyObject, path: string) {
  const aPath = path.split('.');
  let newRes = result?.[aPath?.shift?.() || ''];

  if (aPath.length && newRes) newRes = chainAccess(newRes, aPath.join('.'));

  return newRes;
}

/**
 * 防抖
 *
 * @returns {[Function] | undefined} return 防抖加工后的新方法
 */
export function joinDebounce() {
  let timer: NodeJS.Timeout;

  return (func: (...args: any[]) => void, ms = 500) => {
    clearTimeout(timer);
    timer = setTimeout(func, ms);
  };
}

/**
 * 生成并行异步请求列表
 *
 * @param {[Promise]} apis [Promise.all([...])]
 * @returns {[Promise] | undefined} return description
 */
export function genrateParallels(apis: any[]) {
  const parallels = apis.map(api => (async () => await api)());

  return parallels;
}

/**
 * API then回调处理
 *
 * @param {Object} res [resolve参数]
 */
export function $thenBack(res: AnyObject) {
  // const data = res?.data;
  const isError = !res?.data;
  // const isError = res.code !== 0;

  if (isError) throw res;

  return res;
}

/**
 * API catch回调处理
 *
 * @param {String} errPrefix [自定义错误前缀]
 */
export function $catchBack(errPrefix = '') {
  return function (err: AnyObject) {
    const [backData, errorMsg] = [{ ...err }, errPrefix + (err?.errorMsg || err?.msg || err?.message || '')];

    window.$message?.error(errorMsg);

    return backData;
  };
}

/**
 * 接口请求封装
 *
 * @param {T} api [接口]
 * @returns {args<T><ReturnType><T> | undefined} return description
 */
export function apiReq<T extends (...args: any[]) => any>(api: T): (...args: Parameters<T>) => ReturnType<T> {
  return (...params: any[]) =>
    api(...(params ?? []))
      .then($thenBack)
      .catch($catchBack());
}

/**
 * 文件下载
 *
 * @param {[AnyObject]} res 接口回调
 * @param {string} fileNameKey 下载文件键名
 */
export function $downloadFile(res: AnyObject, fileNameKey?: string) {
  const { data, headers } = res || {};
  const isError = !data;
  const key = fileNameKey ?? 'filename=';

  if (isError) throw res;

  const { 'content-disposition': contDesc, 'content-type': contType } = headers || {};

  const type = contType?.split(';').find((v: AnyObject) => v.includes('application'));
  const fileName = contDesc
    ?.split(';')
    .find((v: AnyObject) => v.includes(key))
    ?.replace(key, '');

  const decodeName = fileName ? decodeURIComponent(fileName) : '附件';

  const [blob, eLink] = [new Blob([data], { type }), document.createElement('a')];

  eLink.download = decodeName;
  eLink.style.display = 'none';
  eLink.href = URL.createObjectURL(blob);
  document.body.appendChild(eLink);
  eLink.click();
  URL.revokeObjectURL(eLink.href);
  document.body.removeChild(eLink);
}

/**
 * item字段映射
 *
 * @param {[Object]} fieldsMap [传入字段映射表，返回返]
 * @returns {[Function] | undefined} return 映射转换
 */
export function itemFiledsMap(fieldsMap: AnyObject) {
  return function (item = {}) {
    const formatItem = {};

    Object.entries(fieldsMap).forEach(([key, path]) => {
      Object.defineProperty(formatItem, key, {
        value: chainAccess(item, path),
        writable: true,
        enumerable: true,
        configurable: true
      });
      // formatItem[key] = chainAccess(item, path);
    });

    return formatItem;
  };
}

/**
 * 请求提交定制确认
 *
 * @param {String} tip [确认提示语]
 * @param {Function} thenBack [确认后执行回调]
 */
// export async function $confirmReq(tip = '', thenBack = (res?: any) => null) {
//   await MessageBox.confirm(tip, '提示', {
//     confirmButtonText: '确定',
//     cancelButtonText: '取消'
//   }).then((res?: any) => {
//     setTimeout(() => thenBack(res), 300); // 避免遮罩层关闭时与下一个弹窗开启冲突
//   });
// }

/**
 * 文件异常检测
 *
 * @param {[type]} fileBlob [fileBlob description]
 * @returns {[Boolean]} 是否异常
 */
export async function checkFileCatch(fileBlob = new Blob()) {
  // const { $catchBack } = this;
  const text = await fileBlob?.text?.();
  let isError = false;

  try {
    const fileInfo = JSON.parse(text ?? null) ?? {};
    isError = fileInfo.code !== 0;
    $catchBack()(fileInfo);
  } catch (err) {
    window.$message?.warning(`JSON 无法解析 ${err}`);
  }

  return isError;
}

/**
 * 到处数据到CSV
 *
 * @param {any[]} data 列表数据
 * @param {FiledsMap} filedsMap 字段名映射
 */
export function exportDataToCSV(data: any[], filedsMap?: FiledsMap) {
  const isError = !data?.length;
  if (isError) throw new Error('导出数据不可为空！');

  const csvData = convertToCSV(data, filedsMap);
  const blob = new Blob([`\uFEFF${csvData}`], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'data.csv';

  document.body.append(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * 转换CSV数据
 *
 * @param {any[]} data 列表数据
 * @param {FiledsMap} filedsMap 字段名映射
 * @returns {string}
 */
function convertToCSV(data: Record<string, any>[], filedsMap?: FiledsMap): string {
  const fileds = filedsMap && Object.keys(filedsMap);
  const keys = Object.keys(data[0] ?? {});
  const heads = filedsMap ? Object.values(filedsMap) : keys;

  const list = data.map(v => {
    const row =
      fileds?.map(f => v[f]) ??
      Object.values(v)
        .map(v2 => `${v2}`)
        .join(',');

    return row;
  });
  const csv = [heads, ...list].join('\n');

  return csv;
}

/**
 * API工具组合
 *
 * @member {[type]}
 */
export const apiTools = { apiReq, $thenBack, $catchBack, $downloadFile };
