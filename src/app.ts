import express, { Application } from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import credentials from './api/middleware/Credentials'
import helmet from 'helmet';
import ErrorMiddleware from "../src/api/middleware/ErrorMiddleware";


import Routes from './api/routes';

class App {
  public app: Application;

  public constructor () {
    this.app = express()
    this.middlewares()
    this.routing()
    this.onError()
  }

  private middlewares (): void {
    this.app.use(credentials);
    this.app.use(cors({
      credentials: true,
      origin: 'http:localhost:8080'
    }))
    this.app.use(cookieParser());
    this.app.use(express.json())
    this.app.use(helmet());
  }


  private routing (): void {
    new Routes().run(this.app);
  }

  private onError(): void {
    this.app.use(ErrorMiddleware)
  }

}

export default new App().app;