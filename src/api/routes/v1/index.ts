import { Router } from 'express';
import github from './github';
import register from './register';
import auth from './auth';

const router = Router();

router.use('/github', github);
router.use('/register', register);
router.use('/auth', auth);

export default router;