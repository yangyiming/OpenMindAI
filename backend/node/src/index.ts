import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from "@koa/cors";
import { createConnection } from 'typeorm';
import { HOST, PORT,DOMAIN,config } from './config';
import router from './routes'
import * as dotenv from "dotenv";
import { User } from './entity/user';
dotenv.config();
const app = new Koa();

const corsOptions = {
  origin: (ctx) => {
    // 使用cors中间件来处理跨域问题
    // 你可以根据需要配置cors的选项
    const requestOrigin = ctx.request.header.origin;
    // 允许的域名列表
    const allowedOrigins = [];

    // 如果是在开发环境中，允许所有来源
    if (process.env.NODE_ENV === 'dev' || process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'pro') {
      return '*';
    }

    // 检查请求的 Origin 是否在允许的列表中
    if (allowedOrigins.includes(requestOrigin)) {
      return requestOrigin;
    }
    // 否则返回 `false` 表示不允许该来源的跨域请求
    return false;
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // 允许的HTTP方法
  optionsSuccess: true, // 预检请求成功时不返回错误 
  credentials: true, // 支持携带凭证（如cookies）
};

app.use(cors(corsOptions))
app.use(bodyParser());
app.use(router.routes());
app.use(router.allowedMethods());



createConnection().then(async connection => {
  console.log('数据库连接成功');
  // 测试实体是否正常工作
  // const user = new User();
  // user.userName = "admin";
  // user.password = "admin123";

  // await connection.manager.save(user);
  // console.log("User has been saved. User id is", user.id);
  const server = app.listen(PORT).on('listening', async () => {
    console.log(`应用启动成功 http://${HOST}:${PORT}`);
  });
  
}).catch(error => {
  console.error('数据库连接失败:', error);
});


