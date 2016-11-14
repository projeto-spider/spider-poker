'use strict';

const Schema = use('Schema');

class OrganizationUserTableSchema extends Schema {
	up () {
		this.create('organization_users', table => {
			table.increments();
			table.integer('user_id').unsigned().references('id').inTable('users');
			table.integer('organization_id').unsigned().references('id').inTable('organizations');
			table.timestamps();
		})
	}

	down () {
		this.drop('organization_users');
	}
}

module.exports = OrganizationUserTableSchema;
