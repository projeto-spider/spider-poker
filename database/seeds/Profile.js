'use strict';

const Profile = use('App/Model/Profile');

class ProfileSeeder {
	* run () {
		yield Profile.create({
			user_id: 1,
			name: 'admin',
		});
	}
}

module.exports = ProfileSeeder;
