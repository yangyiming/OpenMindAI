import dotenv from 'dotenv';

if (process.env.NODE_ENV === 'test') {
    dotenv.config({ path: '.test.env' });
} else if (process.env.NODE_ENV === 'pro') {
    dotenv.config({ path: '.pro.env' });
} else {
    dotenv.config();
}


// 项目变量
export const config = {
    // 是否定时执行 
    loop: true,
    loopTime: 4, // 小时
    // 禁止飞书报错
    disableFeishu: false,
    // 解析完成是否关闭页面
    closePage: true,
    // 客户端是否打开浏览器 true 打开无头浏览器 不会显示图形界面
    headless: true,
    // 链接解析instagrame 
    instagrameRule: true,
    // 链接解析fb
    facebookRule: true,
    // 链接解析tiktok
    tikTokRule: true,
    // 链接解析 x
    xRule: true,
    // 云盘特殊网站解析
    cloudBrowser: false,
    // okcloud web解析接口
    cloudApi: false
}

export const { PORT, HOST,DOMAIN,FEISHU_WEBHOOK_URL} = process.env;

