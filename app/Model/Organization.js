'use strict';

const Lucid = use('Lucid')

class Organization extends Lucid {
	static get hidden() {
		return [
			'updated_at',
		];
	}

	users() {
		return this.hasMany('App/Model/User');
	}

	projects() {
		return this.hasMany('App/Model/Project');
	}

	static scopePublic(builder) {
		builder.where('private', false);
	}
}

module.exports = Organization;
