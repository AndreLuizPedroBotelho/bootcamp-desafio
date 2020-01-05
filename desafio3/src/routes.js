import { Router } from 'express';

import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';
import PlanController from './app/controllers/PlanController';
import RegistrationController from './app/controllers/RegistrationController';
import CheckinController from './app/controllers/CheckinController';
import HelpOrderController from './app/controllers/HelpOrderController';
import StudentHelpOrderController from './app/controllers/StudentHelpOrderController';
import AnswerController from './app/controllers/AnswerController';

import authMiddlewares from './app/middlewares/auth';

const routes = new Router();

routes.post('/session', SessionController.store);

routes.use(authMiddlewares);

// Student
routes.post('/student', StudentController.store);
routes.put('/student/:id', StudentController.update);

// Checkins
routes.post('/students/:studentId/checkins', CheckinController.store);
routes.get('/students/:studentId/checkins', CheckinController.index);

// HelpOrders
routes.get('/students/help-orders/dont-answer', HelpOrderController.index);

// StudentHelpOrders
routes.post(
  '/students/:studentId/help-orders',
  StudentHelpOrderController.store
);
routes.get(
  '/students/:studentId/help-orders',
  StudentHelpOrderController.index
);

// Answer
routes.put('/help-orders/:helpOrdersId/answer', AnswerController.update);

// Plans
routes.put('/plans/:planId', PlanController.update);
routes.post('/plans', PlanController.store);
routes.get('/plans', PlanController.index);
routes.delete('/plans/:planId', PlanController.delete);

// Registration
routes.put('/registrations/:registrationId', RegistrationController.update);
routes.post('/registrations', RegistrationController.store);
routes.get('/registrations', RegistrationController.index);
routes.delete('/registrations/:registrationId', RegistrationController.delete);

export default routes;
