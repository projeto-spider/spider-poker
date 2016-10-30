'use strict';

const Schema = use('Schema');

class OrganizationsTableSchema extends Schema {
	up () {
		this.create('organizations', table => {
			table.increments();
			table.string('name', 80).notNullable().unique();
			table.string('display_name', 254).notNullable();
			table.string('description', 254);
			table.string('company', 254);
			table.string('location', 254);
			table.text('url');
			table.boolean('private');
			table.timestamps();
		})
	}

	down () {
		this.drop('organizations');
	}
}

module.exports = OrganizationsTableSchema;
