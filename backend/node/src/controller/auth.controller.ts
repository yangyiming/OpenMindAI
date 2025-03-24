import Router from '@koa/router';
import { Context } from 'koa';
import { AuthService } from '../service/auth.service';
import jwt from 'jsonwebtoken';
import { getRepository } from 'typeorm';
import { User } from '../entity/user';
import { successResponse, errorResponse } from '../typings/global';

interface LoginRequestBody {
  userName: string;
  password: string;
}

const router = new Router({
  prefix: '/api/auth'
});

const getAuthService = () => new AuthService(getRepository(User));

router.post('/login', async (ctx: Context) => {
  const { userName, password } = ctx.request.body as LoginRequestBody;
  
  if (!userName || !password) {
    ctx.status = 400;
    ctx.body = errorResponse('用户名和密码不能为空');
    return;
  }

  const authService = getAuthService();
  const user = await authService.validateUser(userName, password);

  if (!user) {
    ctx.status = 401;
    ctx.body = errorResponse('用户名或密码错误');
    return;
  }

  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '1h' }
  );

  ctx.body = successResponse({ token });
});

router.post('/user/info', async (ctx: Context) => {
  const token = ctx.headers.token as string;
  
  if (!token) {
    ctx.status = 401;
    ctx.body = errorResponse('未提供认证信息');
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as unknown as { userId: string };
    const authService = getAuthService();
    const user = await authService.getUserById(decoded.userId);

    if (!user) {
      ctx.status = 404;
      ctx.body = errorResponse('用户不存在');
      return;
    }

    ctx.body = successResponse({
      id: user.id,
      userName: user.userName,
      email: user.email
    });
  } catch (err) {
    ctx.status = 401;
    ctx.body = errorResponse('无效的token');
  }
});

export default router;
