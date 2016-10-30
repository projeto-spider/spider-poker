'use strict';

const Schema = use('Schema');

class BacklogTableSchema extends Schema {

	up () {
		this.create('backlog', table => {
			table.increments();
			table.integer('project_id').unsigned().references('id').inTable('projects');
			table.text('title');
			table.integer('position').unsigned();
			table.integer('parent').unsigned().references('id').inTable('backlog');
			table.integer('priority').unsigned();
			table.timestamps();
		})
	}

	down () {
		this.drop('backlog');
	}

}

module.exports = BacklogTableSchema;
