import apiRouterFactory from './lib/api-router-factory';
import * as controller from '../controllers/redmine';

const routes = apiRouterFactory('/redmine');

routes.get('/issues', controller.issues);

module.exports = routes;
