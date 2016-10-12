'use strict';

const Lucid = use('Lucid');

class User extends Lucid {
	static boot() {
		super.boot();

		this.addHook('beforeCreate', 'User.encryptPassword');
	}

	apiTokens() {
		return this.hasMany('App/Model/Token');
	}
}

module.exports = User;
