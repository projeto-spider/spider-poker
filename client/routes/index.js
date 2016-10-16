import Dashboard from './Dashboard';

// Authentication
import {
	AuthPanel,
	Login,
	Register,
} from './auth';

// Root-level routes
import HomePage from './HomePage';

const routes = [
	{
		path: '/auth',
		component: AuthPanel,
		childRoutes: [
			{
				path: 'login',
				component: Login,
			},
			{
				path: 'register',
				component: Register,
			},
		],
	}, {
		path: '/',
		component: Dashboard,
		indexRoute: {
			component: HomePage,
		},
		childRoutes: [
		],
	}
];

export default routes;
