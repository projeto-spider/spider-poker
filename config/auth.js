'use strict';

module.exports = {
	authenticator: 'api',
	api: {
		serializer: 'Lucid',
		model: 'App/Model/Token',
		scheme: 'api',
		expiry: '30d',
	}
};
