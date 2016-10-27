'use strict';

const Schema = use('Schema');

class AddUserLevelColumnTableSchema extends Schema {
	up () {
		this.table('users', table => {
			table.integer('role').defaultTo(0);
		})
	}

	down () {
		this.table('users', table => {
			table.dropColumn('role');
		})
	}
}

module.exports = AddUserLevelColumnTableSchema;
