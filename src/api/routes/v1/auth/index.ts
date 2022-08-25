import { Router } from 'express';
import AuthController from '../../../controller/AuthController';
import AuthService from '../../../../services/auth';
import UserRepository from '../../../../repositories/implementation/User/Memory';

const router = Router();

const repository = new UserRepository()
const service = new AuthService(repository)
const controller = new AuthController(service)

router.post('/login', controller.login);
router.get('/verify', controller.verify);
router.get('/refresh', controller.refresh);
router.get('/logout', controller.logout);

export default router;