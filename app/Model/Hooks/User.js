'use strict';
const User = exports = module.exports = {};
const Hash = use('Hash');

User.encryptPassword = function * (next) {
	this.password = yield Hash.make(this.password);
	yield next;
};
