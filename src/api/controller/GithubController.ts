import { Request, Response, NextFunction } from 'express';
import GithubService from '../../services/github/'


interface AuthorizationQueryParams {
  redirect_uri: string
}

interface CallbackQueryParams {
  code: string
}

declare module 'express-session' {
  interface SessionData {
    redirect_uri: string;
  }
}

export default class GithubController {

  authorization(req: Request, res: Response, next: NextFunction) {
    const { redirect_uri } = req.query as unknown as AuthorizationQueryParams; 
    try {
      const url = GithubService.urlAuthorization();
      req.session.redirect_uri = redirect_uri
      res.redirect(url);
    } catch (e) {
      next(e);
    }
  }

  async callback(req: Request, res: Response, next: NextFunction) {
    const { code } = req.query as unknown as CallbackQueryParams; 
    const redirect_uri:string = req.session.redirect_uri!
    try {
      const { access_token } = await GithubService.callback(code);
      res.redirect(redirect_uri + `?access_token=${access_token}`)
    } catch (e) {
      next(e);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    req.session.destroy(() => {
      res.send(true).status(200)
    });
  }
}