'use strict';

const Lucid = use('Lucid');

class User extends Lucid {
	static get hidden() {
		return [
			'password',
			'updated_at',
		];
	}

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

	organizations() {
		return this.belongsToMany('App/Model/Organization');
	}

	isAdmin() {
		return this.role === 'admin';
	}

	getRole() {
		switch (this.role) {
			case 10:
				return 'admin';
			default:
				return 'user';
		}
	}
}

module.exports = User;
