'use strict';

const Lucid = use('Lucid');

class Profile extends Lucid {
	static get hidden() {
		return [
			'id',
			'user_id',
			'created_at',
			'updated_at',
		];
	}

	users() {
		return this.belongsTo('App/Model/User');
	}
}

module.exports = Profile
