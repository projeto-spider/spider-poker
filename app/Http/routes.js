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

	// Organizations

	Route
		.resources('orgs', 'OrgsController')
		.except('create', 'store', 'edit', 'destroy');

	// Projects

	Route
		.resources('projects', 'ProjectsController')
		.except('create', 'store', 'edit', 'destroy');

	// Backlog

	Route
		.resources('backlogs', 'BacklogController')
		.except('create', 'store', 'edit', 'destroy');
}).prefix('/api');

// Widgets

Route.group('widgets', () => {
	Route
		.get('/redmine/issues', 'Widgets/RedmineController.issues');
}).prefix('/widgets');

// Fallback all other GET requests to rendering our React app
Route.get('*', 'ReactController.main');

