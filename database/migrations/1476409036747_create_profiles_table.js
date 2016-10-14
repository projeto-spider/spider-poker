'use strict'

const Schema = use('Schema')

class ProfilesTableSchema extends Schema {
	up () {
		this.create('profiles', table => {
			table.increments();
			table.integer('user_id').unsigned().references('id').inTable('users');
			table.string('name', 254).notNullable();
			table.string('bio', 254);
			table.string('location', 254);
			table.string('company', 254);
			table.string('contact', 254);
			table.text('url');
			table.timestamps();
		})
	}

	down () {
		this.drop('profiles')
	}
}

module.exports = ProfilesTableSchema
