'use strict';

const Route = use('Route');

Route.group('auth', () => {
	Route.get('/valid', 'AuthController.valid');
	Route.post('/register', 'AuthController.register');
	Route.post('/authorize', 'AuthController.authorize');
}).prefix('/api/auth');

Route.get('/', 'ReactController.main');

// Widgets

Route.group('widgets', () => {
	Route
		.get('/redmine/issues', 'Widgets/RedmineController.issues');
}).prefix('/widgets');

