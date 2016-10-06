'use strict';

const Route = use('Route');

Route.get('/', function * (_req, res) {
	const scripts = ['http://localhost:8080/bundle.js'];

	return yield res.sendView('master', {
		scripts
	});
});
