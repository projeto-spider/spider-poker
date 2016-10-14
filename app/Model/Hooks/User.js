'use strict';
const User = exports = module.exports = {};
const Profile = use('App/Model/Profile');
const Hash = use('Hash');

User.encryptPassword = function * (next) {
	this.password = yield Hash.make(this.password);
	yield next;
};

User.createProfile = function * (next) {
	const profile = new Profile();
	profile.name = this.username;

	yield this.profile().save(profile);

	yield next;
};
