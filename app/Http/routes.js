'use strict';

const Route = use('Route');

Route.group('auth', () => {
	Route.get('/valid', 'AuthController.valid');
	Route.post('/register', 'AuthController.register');
	Route.post('/authorize', 'AuthController.authorize');
}).prefix('/api/auth');

Route.group('user', () => {
	Route
		.resources('users', 'UserController')
		.except('create', 'store', 'edit', 'destroy')
		.middleware({
			auth: ['update'],
		});
}).prefix('/api');

Route.get('/', 'ReactController.main');

// Widgets

Route.group('widgets', () => {
	Route
		.get('/redmine/issues', 'Widgets/RedmineController.issues');
}).prefix('/widgets');

