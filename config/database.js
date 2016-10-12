'use strict';

const Env = use('Env');
const Helpers = use('Helpers');

module.exports = {
	/*
	|--------------------------------------------------------------------------
	| Default Connection
	|--------------------------------------------------------------------------
	|
	| Connection defines the default connection settings to be used while
	| interacting with SQL databases.
	|
	| Fallbacks to sqlite.
	| When running tests, use sqlite 'test.sqlite'.
	|
	*/
	connection: Env.get('NODE_ENV') === 'test' ? 'testing' : Env.get('DB_CONNECTION', 'sqlite'),
	testing: {
		client: 'sqlite3',
		connection: {
			filename: Helpers.databasePath('test.sqlite')
		},
		useNullAsDefault: true
	},
	sqlite: {
		client: 'sqlite3',
		connection: {
			filename: Helpers.databasePath('development.sqlite')
		},
		useNullAsDefault: true
	},
	mysql: {
		client: 'mysql',
		connection: {
			host: Env.get('DB_HOST', 'localhost'),
			user: Env.get('DB_USER', 'root'),
			password: Env.get('DB_PASSWORD', ''),
			database: Env.get('DB_DATABASE', 'adonis')
		}
	},
	pg: {
		client: 'pg',
		connection: {
			host: Env.get('DB_HOST', 'localhost'),
			user: Env.get('DB_USER', 'root'),
			password: Env.get('DB_PASSWORD', ''),
			database: Env.get('DB_DATABASE', 'adonis')
		}
	}
};
