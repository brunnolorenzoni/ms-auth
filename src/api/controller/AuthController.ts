import { Request, Response, NextFunction } from 'express';
import AuthService from '../../services/auth';

interface IRegister {
  email: string,
  password: string
}

export default class AuthController {

  constructor(readonly service: AuthService) {
    this.login = this.login.bind(this)
    this.refresh = this.refresh.bind(this)
    this.verify = this.verify.bind(this)
    this.logout = this.logout.bind(this)
  }

  async login(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body as unknown as IRegister; 
    try {
      const { accessToken, refreshToken } = await this.service.login(email, password);
      res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'none', secure: !!process.env.COOKIE_SECURE, path: '/', maxAge: 24 * 60 * 60 * 1000 });
      res.send({ access_token: accessToken }).status(200);
    } catch (e) {
      next(e);
    }
  }

  async verify(req: Request, res: Response, next: NextFunction) {
    const [, authorization] = req.headers.authorization!.split(' ') || req.headers.Authorization!.toString().split(' ')
    const refreshToken = req.cookies.jwt
    try {

      await this.service.verify(authorization, refreshToken) 
        ? res.status(200).send()
        : res.status(401).send()
    } catch (e) {
      next(e)
    }

  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    const [, oldAccessToken] = req.headers.authorization!.split(' ') || req.headers.Authorization!.toString().split(' ')
    const jwtRefreshToken = req.cookies.jwt
    try {
      const accessToken = await this.service.refresh(oldAccessToken, jwtRefreshToken);
      res.cookie('jwt', jwtRefreshToken, { httpOnly: true, sameSite: 'none', secure: !!process.env.COOKIE_SECURE, path: '/', maxAge: 24 * 60 * 60 * 1000 });
      res.send({ access_token: accessToken }).status(200);
    } catch (e) {
      next(e);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies.jwt
    try {
      await this.service.logout(token);
      res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: !!process.env.COOKIE_SECURE, path: '/' });
      res.status(204).send();
    } catch (e) {
      next(e);
    }
  }
}