
import axios, { CancelTokenSource } from 'axios'
import { ProxyAgent, request } from 'undici'
import { v4 as uuidv4 } from 'uuid';



export type Option = {
    url: string
    method?: 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'CONNECT' | 'OPTIONS' | 'TRACE' | 'PATCH'
    data?: any
    header?: Record<string, any>
    responseType?: any
    maxRedirects?: number // 最大重定向次数
    followRedirects?: boolean // 是否跟随重定向
}


const cancelTokenSourceMap = new Map<string, any>();
export function cancelRequest(requestId: string) {
    const cancelTokenSource = cancelTokenSourceMap.get(requestId);
    if (cancelTokenSource) {
      cancelTokenSource.abort();
      cancelTokenSourceMap.delete(requestId);
    }
}

export function cancelAllRequest() {
    cancelTokenSourceMap.forEach(cancelTokenSource => {
        cancelTokenSource.abort();
    });
    cancelTokenSourceMap.clear();
}
export function httpRequest(option: Option):Promise<any> {
    const targetUrl = option.url
    let method = option.method ? option.method : 'GET'
    const header = option.header
    const responseType = option.responseType || ''
    const followRedirects = option.followRedirects || false
    
    const requestObj: any = {
        method: method,
        headers: header,
        timeout: 120 * 1000,
        responseType,
    }
    if(followRedirects){
        requestObj.maxRedirects = 0
    }
    if (option.data) {
        requestObj.data = option.data
    }
   

    // config cancel token
    const requestId = uuidv4();

    // 创建一个新的 AbortController 实例
    const controller = new AbortController();
    const signal = controller.signal;
    requestObj.signal = signal
    cancelTokenSourceMap.set(requestId, controller);

    return axios({
        url: targetUrl,
        ...requestObj
    }).then((response:any) => {
        return response
    })

}

