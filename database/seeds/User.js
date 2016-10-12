'use strict';

const User = use('App/Model/User');

class UserSeeder {
	* run() {
		yield User.create({
			username: 'admin',
			password: 'admin',
			email: 'admin@gmail.com',
		});
	}
}

module.exports = UserSeeder;
