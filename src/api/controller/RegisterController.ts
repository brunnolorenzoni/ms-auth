import { Request, Response, NextFunction } from 'express';
import RegisterService from '../../services/register'

interface IRegister {
  email: string,
  password: string
}

export default class RegisterController {

  constructor(readonly service: RegisterService) {
    this.register = this.register.bind(this)
  }

  async register(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body as unknown as IRegister; 
    console.log(email, password)
    try {
      await this.service.register(email, password);
      res.status(201).send('User created');
    } catch (e) {
      next(e);
    }
  }
}