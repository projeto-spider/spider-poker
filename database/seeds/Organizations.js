'use strict';

const Organization = use('App/Model/Organization');

class OrganizationsSeeder {
	* run () {
		yield Organization.createMany([{
			name: 'projeto-spider',
			display_name: 'Projeto Spider',
			private: false,
		}]);
	}
}

module.exports = OrganizationsSeeder;
