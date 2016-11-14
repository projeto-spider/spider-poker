'use strict';

const Lucid = use('Lucid');

class OrganizationUser extends Lucid {
	user() {
		return this.hasOne('App/Model/User');
	}

	organization() {
		return this.hasOne('App/Model/Organization');
	}
}

module.exports = OrganizationUser;
