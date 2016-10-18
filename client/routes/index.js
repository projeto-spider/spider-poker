import Dashboard from './Dashboard';

// Authentication
import {
	AuthPanel,
	Login,
	Register,
} from './auth';

// Root-level routes
import HomePage from './HomePage';

// Routing middlewares
import {
	notLoggedIn,
} from './middleware';

const routes = [
	{
		path: '/auth',
		component: AuthPanel,
		childRoutes: [
			{
				path: 'login',
				component: Login,
				onEnter: notLoggedIn,
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
