'use strict';

const Lucid = use('Lucid');

class Profile extends Lucid {
	users() {
		return this.belongsTo('App/Model/User');
	}
}

module.exports = Profile
