'use strict';
const Env = use('Env');

class ReactController {
	* main(_req, res) {
		return yield res.sendView('master', {
			...this.assets,
		});
	}

	get assets() {
		if (Env.get('NODE_ENV') === 'development') {
			return {
				scripts: [
					'http://localhost:8080/bundle.js'
				],
				style: [
				],
			};
		}

		const {app, vendor} = require('../../../webpack.assets.json');

		return {
			scripts: [
				vendor.js,
				app.js,
			],
			style: [
			],
		};
	}
}

module.exports = ReactController;
