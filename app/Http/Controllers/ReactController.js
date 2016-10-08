'use strict';
const Env = use('Env');

class ReactController {
	* main(_req, res) {
		const {scripts, styles} = ReactController.assets();

		return yield res.sendView('master', {
			scripts, styles,
		});
	}

	static assets() {
		const vendorStyles = [
			'/vendor/bootstrap/bootstrap.min.css',
			'/vendor/adminlte/AdminLTE.min.css',
		];

		if (Env.get('NODE_ENV') === 'development') {
			return {
				scripts: [
					`http://localhost:${Env.get('WEBPACK_PORT', 3000)}/bundle.js`
				],
				styles: [
					...vendorStyles,
				],
			};
		}

		if (!ReactController.webpackBuild) {
			ReactController.webpackBuild = require('../../../webpack.assets.json');
		}

		const {app, vendor} = ReactController.webpackBuild;

		return {
			scripts: [
				vendor.js,
				app.js,
			],
			styles: [
				...vendorStyles,
			],
		};
	}
}

module.exports = ReactController;
