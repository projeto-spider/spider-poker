'use strict';

const Lucid = use('Lucid');

class User extends Lucid {
	static boot() {
		super.boot();

		this.addHook('beforeCreate', 'User.encryptPassword');
		this.addHook('afterCreate', 'User.createProfile');
	}

	apiTokens() {
		return this.hasMany('App/Model/Token');
	}

	profile() {
		return this.hasOne('App/Model/Profile');
	}
}

module.exports = User;
