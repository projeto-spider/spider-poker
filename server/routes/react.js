import router from 'koa-router';
const routes = router();
import {index} from '../controllers/react';

routes.get('*', index);

module.exports = routes;
