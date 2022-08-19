import { Router } from 'express';
import GithubController from '../../../controller/GithubController';

const router = Router();

const controller = new GithubController()

router.get('/authorization', controller.authorization);
router.get('/callback', controller.callback);

export default router;