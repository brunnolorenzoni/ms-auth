import { Router } from 'express';
import RegisterController from '../../../controller/RegisterController';
import RegisterService from '../../../../services/register';
import UserRepository from '../../../../repositories/implementation/User/Memory';

const router = Router();

const repository = new UserRepository()
const service = new RegisterService(repository)
const controller = new RegisterController(service)

router.post('/', controller.register);

export default router;