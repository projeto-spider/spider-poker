'use strict';

const User = use('App/Model/User');

class UserSeeder {
	* run() {
		yield User.createMany([{
			username: 'admin',
			password: 'admin',
			email: 'admin@gmail.com',
		}, {
			username: 'lubien',
			password: 'lubien',
			email: 'lubien1996@gmail.com',
		}, {
			username: 'john-doe',
			password: 'john-doe',
			email: 'john.doe@gmail.com',
		}]);
	}
}

module.exports = UserSeeder;
