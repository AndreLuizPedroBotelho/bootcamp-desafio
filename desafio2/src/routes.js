import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';
import authMiddlewares from './app/middlewares/auth';

const routes = new Router();

routes.post('/users', UserController.store);
routes.put('/users', authMiddlewares, UserController.update);
// routes.put('/student', authMiddlewares, StudentController.update);
routes.post('/student', StudentController.store);

routes.post('/session', SessionController.store);

export default routes;
