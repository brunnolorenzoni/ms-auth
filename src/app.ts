import express, { Application } from 'express'
import cookie from 'cookie-parser'
import cors from 'cors'
import helmet from 'helmet';

import Routes from './api/routes';

class App {
  public app: Application;

  public constructor () {
    this.app = express()
    this.middlewares()
    this.routing()
  }

  private middlewares (): void {
    this.app.use(express.json())
    this.app.use(cors())
    this.app.use(cookie());
    this.app.use(helmet());
  }


  private routing (): void {
    new Routes().run(this.app);
  }
}

export default new App().app;