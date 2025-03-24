
import axios, { CancelTokenSource } from 'axios'
import { ProxyAgent, request } from 'undici'
import { v4 as uuidv4 } from 'uuid';
import { HttpProxyAgent } from 'http-proxy-agent';
import { HttpsProxyAgent } from 'https-proxy-agent';


const apikey = 'beb5a2211345b91c1e27073fb22a851767f4868a'
// const proxyConfig = {
//     protocol: 'http',
//     host: 'superproxy.zenrows.com',
//     port: 1337,
//     auth: {
//         username: '7x36kTjfd7Jd',
//         password: 'bzVQI9WQVFmf'
//     }
// };



export type Option = {
    url: string
    method?: 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'CONNECT' | 'OPTIONS' | 'TRACE' | 'PATCH'
    data?: any
    header?: Record<string, any>
    responseType?: any
    proxy?: boolean // 是否启用代理
    js?: boolean // 是否使用zenrows的js_render
    http?: boolean // 是否使用住宅代理请求
    premiumProxy?: boolean // 是否使用zenrows的premium_proxy
    ttl?: boolean // 固定ip 30分钟
    requestIds?: string[] // 请求id
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
    let proxy = option.proxy || false
    let http = option.http || false
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
    if(option.requestIds){
        option.requestIds.push(requestId)
    }
    
    // 创建一个新的 AbortController 实例
    const controller = new AbortController();
    const signal = controller.signal;
    requestObj.signal = signal
    cancelTokenSourceMap.set(requestId, controller);
    if(targetUrl.includes('instagram.com')){
        proxy = false
    }
    if(targetUrl.includes('imginn')){
        http = true
    }
    if (proxy) {
        if (http) {
            let queryStr=''
            if (option.js) {
                queryStr = 'js_render=true'
            }
            if (option.premiumProxy) {
                queryStr='&premium_proxy=true'
            }
            const proxy = `http://beb5a2211345b91c1e27073fb22a851767f4868a:${queryStr}@api.zenrows.com:8001`;
            const httpAgent = new HttpProxyAgent(proxy);
            const httpsAgent = new HttpsProxyAgent(proxy);
            process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
            // zenrows 代理 
            return axios({
                url: targetUrl,
                httpAgent,
                httpsAgent,
                ...requestObj
            }).then((response:any) => {
                response.config.requestId = requestId
                return {data:response.data,cookies:''}
            }).catch((err) => {
                console.error(err.message)
                return Promise.reject(err)
            })
        } else {
            const params = {
                'url': targetUrl,
                'apikey': apikey,
            }
            if (option.js) {
                params['js_render'] = 'true'
            }
            if (option.premiumProxy) {
                params['premium_proxy'] = 'true'
            }
            // zenrows 代理 
            return axios({
                url: 'https://api.zenrows.com/v1/',
                params: params,
                ...requestObj
            }).then((response:any) => {
                response.config.requestId = requestId
                return {data:response.data,cookies:''}
            }).catch((err) => {
                logger.error(err.message)
                return Promise.reject(err)
            })
        }
           

    } else {
        return axios({
            url: targetUrl,
            ...requestObj
        }).then((response:any) => {
            response.config.requestId = requestId
            const cookies = response.headers['set-cookie'];
            return {data:response.data,cookies:cookies}
        }).catch((err) => {
            let response = err.response
            if ('status' in response && response.status >= 300 && response.status < 400 && followRedirects) {
                return {
                    data: {
                        redirectUrl: response.headers.location
                    }
                }
            }
            // console.log(err)
            console.error(err.message)
            return Promise.reject(err.message)
        })
    }

}

// 使用住宅代理请求 zenrows
// export async function requestProxy(option: Option) {
//     // 住宅代理
//     let proxyAgent = new ProxyAgent({ uri: process.env.ZENROW })
//     if (typeof option.proxy !== 'undefined') {
//         proxyAgent = undefined
//     }
//     const req = await request(option.url, {
//         dispatcher: proxyAgent,
//         method: option.method || 'GET',
//         headers: option.header,
//         body: option.data,
//     })
//     if (req) {
//         const code = req.statusCode.toString();
//         if (code.startsWith('2')) {
//             if (req.headers['content-type'].includes('application/json')) return req.body.json();
//             return req.body.text();
//         }
//         if (code.startsWith('3')) {
//             option.url = req.headers.location as string
//             return requestProxy(option)
//         }
//         return Promise.reject({
//             code: 1001
//         })
//     }

// }

// 获取最终重定向的url
export async function requestRedirectedUrl(option: Option) {
    const req = await request(option.url, {
        method: option.method || 'GET',
        headers: option.header,
        body: option.data,
    })
    if (req) {
        const code = req.statusCode.toString();
        if (code.startsWith('3')) {
            option.url = req.headers.location as string
            return requestRedirectedUrl(option)
        }
        if (code.startsWith('2')) {
            return option.url
        }
    }

}

