'use strict';

const Route = use('Route');

Route.get('/', 'ReactController.main');

// Widgets

Route.group('widgets', () => {
	Route
		.get('/redmine/issues', 'Widgets/RedmineController.issues');
}).prefix('/widgets');
