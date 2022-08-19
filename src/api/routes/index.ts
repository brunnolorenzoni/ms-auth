import { Request, Response, Application } from 'express';
import v1 from './v1';

export default class Routes {

  public run(app: Application): void {
    app.route('/healths').get((req: Request, res: Response) => {
      res.status(200).send({
        server: 'UP'
      });
    });
    app.use('/api/v1', v1);
  }
}