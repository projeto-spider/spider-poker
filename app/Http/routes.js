'use strict';

const Route = use('Route');

// API

Route.group('api', () => {
	// Auth

	Route.get('/auth/valid', 'AuthController.valid');
	Route.post('/auth/register', 'AuthController.register');
	Route.post('/auth/authorize', 'AuthController.authorize');

	// Users

	Route
		.resources('users', 'UserController')
		.except('create', 'store', 'edit', 'destroy')
		.middleware({
			auth: ['update'],
		});
}).prefix('/api');

// Widgets

Route.group('widgets', () => {
	Route
		.get('/redmine/issues', 'Widgets/RedmineController.issues');
}).prefix('/widgets');

// Fallback all other GET requests to rendering our React app
Route.get('*', 'ReactController.main');

