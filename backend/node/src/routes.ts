import Router from '@koa/router';
import documentRouter from './controller/document.controller';
import authRouter from './controller/auth.controller';
import { DefaultContext } from 'koa';

const router = new Router<{}, DefaultContext>();

// 注册文档管理路由
router.use(documentRouter.routes(), documentRouter.allowedMethods());
router.use(authRouter.routes(), authRouter.allowedMethods());

export default router;
