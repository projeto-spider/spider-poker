import Layout from './Layout';

// Root-level routes
import HomePage from './HomePage';

const routes = {
	path: '/',
	component: Layout,
	indexRoute: {
		component: HomePage,
	},
	childRoutes: [
	],
};

export default routes;
