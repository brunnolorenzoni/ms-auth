import { Router } from 'express';
import AuthController from '../../../controller/AuthController';
import AuthService from '../../../../services/auth';
import UserRepository from '../../../../repositories/implementation/User/Memory';

import Auth from '../../../middleware/Auth';

const router = Router();

const repository = new UserRepository()
const service = new AuthService(repository)
const controller = new AuthController(service)

router.post('/login', controller.login);
router.get('/verify', Auth, controller.verify);
router.get('/refresh', Auth, controller.refresh);
router.get('/logout', controller.logout);

export default router;