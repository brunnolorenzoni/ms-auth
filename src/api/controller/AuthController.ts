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
      res.send({ accessToken, refreshToken }).status(200);
    } catch (e) {
      next(e);
    }
  }

  async verify(req: Request, res: Response, next: NextFunction) {
    const [, token] = req.headers.authorization!.split(" ")
    try {
      await this.service.verify(token)
      res.status(200).end();
    } catch (e) {
      next(e)
    }

  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    const token = req.body.refreshToken
    try {
      const { accessToken, refreshToken } = await this.service.refresh(token);
      res.cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'none', secure: true, maxAge: 24 * 60 * 60 * 1000 });
      res.send({ accessToken, refreshToken }).status(200);
    } catch (e) {
      next(e);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    const { jwt } = req.cookies
    console.log(jwt)
    try {
      await this.service.logout(jwt);
      //res.clearCookie('jwt', { httpOnly: true, sameSite: 'none', secure: true });
      //res.sendStatus(204);
    } catch (e) {
      next(e);
    }
  }
}