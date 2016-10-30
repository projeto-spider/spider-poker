'use strict';

const Schema = use('Schema');

class OrgsTableSchema extends Schema {
	up () {
		this.create('orgs', table => {
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
		this.drop('orgs');
	}
}

module.exports = OrgsTableSchema;
