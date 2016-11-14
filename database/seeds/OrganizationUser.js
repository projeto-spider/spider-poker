'use strict';

const OrganizationUser = use('App/Model/OrganizationUser');

class OrganizationUserSeeder {
	* run () {
		yield OrganizationUser.createMany([{
			user_id: 2,
			organization_id: 1,
		}, {
			user_id: 3,
			organization_id: 2,
		}]);
	}
}

module.exports = OrganizationUserSeeder;
