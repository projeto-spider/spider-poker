'use strict';

const Schema = use('Schema');

class ProjectsTableSchema extends Schema {

	up () {
		this.create('projects', table => {
			table.increments();
			table.integer('org_id').unsigned().references('id').inTable('orgs');
			table.string('name', 254).notNullable().unique();
			table.string('display_name', 254).notNullable();
			table.string('description', 254);
			table.boolean('private');
			table.timestamps();
		})
	}

	down () {
		this.drop('projects');
	}

}

module.exports = ProjectsTableSchema;
